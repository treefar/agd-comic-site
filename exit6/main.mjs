// 《六樓出口》畫面層：原始碼在這裡，改完跑 npm run exit6:bundle 產生 game.js（雙擊 index.html 也能玩，因為 file:// 不能載入 module）
// 規則在 game-core.mjs（有回歸測試）；這裡只管演出：走路、點擊調查、果汁、系主任、測驗、紀錄
import { createGame, step, anomalyAt, mulberry32 } from "./game-core.mjs";
import { STATIONS, ANOMALIES, QUIZ, VOICE_TEXT } from "./data.mjs";
import { periodOf, stepFor, hourAt, gradeFor, fmtHour, PERIOD_LABEL } from "./time.mjs";
import { ITEMS, TARGETS, createQuests, takeItems, deliver, pending, targetsAt, STAMP_POSTMAN } from "./quests.mjs";
import { OUTLINES } from "./outlines.mjs";
import { CLUES, CODE, createClues, visibleClues, collect, allFound, tryCode } from "./clues.mjs";

const q = new URLSearchParams(location.search);
const seed = q.has("seed") ? Number(q.get("seed")) : (Date.now() & 0xffffffff);
const rng = mulberry32(seed ^ 0x9e3779b9);
const game = createGame(ANOMALIES, mulberry32(seed));
const $ = (id) => document.getElementById(id);
const stage = $("stage");
const layers = [$("imgA"), $("imgB")];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let front = 0;
let busy = false;     // 卡片開著或走路中，不接受操作
let walking = null;   // 走路中＝可呼叫的「略過」函式

// ---------- 紀錄（只存在這台瀏覽器；讀寫失敗就當沒有） ----------
const SAVE_KEY = "exit6-save-v1";
function loadSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function writeSave(s) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* 私密視窗等情況 */ } }
const save = Object.assign({ dex: [], bestMs: null, bestMiss: null, clears: 0 }, loadSave());
const run = { t0: 0, mistakes: 0, precise: 0, misTaps: 0, toured: new Set() };
const quests = createQuests();
const clues = createClues();
const STAMP_QIU = { id: "qiu", name: "找到邱老師", text: "解開 4 條線索、打開 D0647，見到動畫導演邱士展老師。" };
const stamps = () => [...(quests.stamps.length ? [STAMP_POSTMAN] : []), ...(clues.opened ? [STAMP_QIU] : [])];

// ---------- 時間：開局讀玩家裝置的本地時間（除錯 ?hour=N），之後每圈前進 stepFor 小時 ----------
const realHour = new Date().getHours();
const startHour = q.has("hour") ? ((Number(q.get("hour")) % 24) + 24) % 24 : realHour;
const nowHour = () => hourAt(startHour, game.phase === "tour" ? 0 : game.lap);

// ---------- 音效：audio/sfx_<名稱>.mp3，沒有檔案就安靜略過 ----------
const SFX = ["footstep", "hum", "sting", "found", "wrong", "dean", "correct", "clear", "click"];
const sfx = {};
function loadSfx() {
  for (const n of SFX) {
    const a = new Audio(`audio/sfx_${n}.mp3`);
    a.preload = "auto"; a.onerror = () => { sfx[n] = null; };
    sfx[n] = a;
  }
  sfx.hum.loop = true; sfx.hum.volume = 0.25;
}
// maxMs：長音檔只播一小段就停（腳步聲原檔是 5 秒 8 步的循環，每走一格只踩約 0.6 秒）
function play(n, vol = 1, maxMs = 0) {
  const a = sfx[n]; if (!a) return;
  if (n === "hum") { a.play().catch(() => {}); return; }
  const c = a.cloneNode(); c.volume = vol; c.play().catch(() => {});
  if (maxMs) setTimeout(() => c.pause(), maxMs);
}
const voices = {};
function loadVoices() {
  for (const id of Object.keys(VOICE_TEXT)) {
    const a = new Audio(`audio/${id}.m4a`); a.preload = "auto"; a.onerror = () => { voices[id] = null; }; voices[id] = a;
  }
}

// ---------- 系主任 ----------
const deanImg = $("dean");
let deanTimer = null;
function dean(pose, voiceId, ms = 3200) {
  clearTimeout(deanTimer);
  deanImg.src = `frames/dean_${pose}.webp`;
  deanImg.style.right = pose === "peek" ? "0" : "-2%";
  deanImg.classList.remove("out"); void deanImg.offsetWidth; deanImg.classList.add("in");
  play("dean");
  if (voiceId) say(voiceId, ms);
  deanTimer = setTimeout(() => { deanImg.classList.remove("in"); deanImg.classList.add("out"); }, ms);
}
function say(id, ms = 4500) {
  const v = voices[id]; if (v) v.play().catch(() => {});
  $("sub").innerHTML = `<b>系主任</b>${VOICE_TEXT[id]}`;
  $("sub").classList.remove("hidden");
  clearTimeout(say.t); say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
}

// ---------- 果汁 ----------
function shake(big) {
  if (reduced) return;
  stage.classList.remove("shake-s", "shake-l"); void stage.offsetWidth;
  stage.classList.add(big ? "shake-l" : "shake-s");
}
function flash(kind) {
  const f = document.createElement("div");
  f.className = "flash" + (kind ? " " + kind : "");
  stage.appendChild(f); setTimeout(() => f.remove(), 1000);
}
function burst(text, small) {
  const b = $("burst"); b.textContent = text;
  b.className = "burst" + (small ? " small" : ""); void b.offsetWidth; b.classList.add("go");
}
function floorFx(kind) {
  const el = $("floorNo"); el.classList.remove("pop", "reset"); void el.offsetWidth; el.classList.add(kind);
}
function glitch() { if (reduced) return; stage.classList.remove("glitch"); void stage.offsetWidth; stage.classList.add("glitch"); }
// 時段光線＋樓層越高越壓迫（整張調色，不改畫面內容；亮度有下限）
function grade() {
  const h = nowHour();
  const g = gradeFor(h, game.phase === "loop" ? game.count : 0);
  stage.style.setProperty("--grade", g.filter);
  stage.style.setProperty("--tint", g.tint);
  stage.style.setProperty("--vig", String(g.vig));
  $("clock").textContent = `${fmtHour(h)} ${PERIOD_LABEL[g.period]}`;
}
function toast(text) {
  const t = $("toast"); t.textContent = text; t.classList.remove("hidden");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add("hidden"), Math.max(1400, text.length * 110));   // 字多就停久一點
}
function ripple(x, y) {
  const r = document.createElement("div"); r.className = "ripple";
  r.style.left = x + "px"; r.style.top = y + "px"; stage.appendChild(r); setTimeout(() => r.remove(), 600);
}

// ---------- 畫面 ----------
const loaded = new Set();
function prefetch(i) {
  const st = STATIONS[i % STATIONS.length];
  for (const u of [...st.frames, st.still]) if (!loaded.has(u)) { loaded.add(u); new Image().src = u; }
}
let showToken = 0;   // 只讓最後一次 show 生效，避免略過時舊圖晚載入蓋掉停站圖
function show(src, push) {
  const back = layers[1 - front], token = ++showToken;
  back.onload = () => {
    if (token !== showToken) return;
    back.style.animation = "none"; void back.offsetWidth;
    back.style.animation = push && !reduced ? "push 650ms ease-out forwards" : "";
    back.classList.add("on"); layers[front].classList.remove("on"); front = 1 - front;
  };
  back.src = src;
}
const stopSrc = (st, an) => an?.still || st.still;
const tourLeft = () => STATIONS[game.station].spots.filter((_, i) => !run.toured.has(`${game.station}:${i}`)).length;

function setButtons() {
  const off = busy || game.phase === "ending";
  $("btnBack").disabled = off;
  $("btnFwd").disabled = off || (game.phase === "tour" && tourLeft() > 0);
}

function placeBtn(b, s) { Object.assign(b.style, { left: s.x + "%", top: s.y + "%", width: s.w + "%", height: s.h + "%" }); }

// ---------- 沿邊光暈與浮起：用 SAM 輪廓多邊形裁出同一張圖的物件（outlines.mjs），只做裁切與 UI 特效 ----------
function cutout(key, src, kind) {
  const polys = OUTLINES[key]; if (!polys || !polys.length) return null;
  const wrap = document.createElement("div"); wrap.className = "cut " + kind;
  let x0 = 100, y0 = 100, x1 = 0, y1 = 0;
  for (const p of polys) {
    const d = document.createElement("div"); d.className = "cut-in";
    d.style.backgroundImage = `url("${src}")`;
    d.style.clipPath = `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
    wrap.appendChild(d);
    for (const [x, y] of p) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  wrap.style.transformOrigin = `${(x0 + x1) / 2}% ${(y0 + y1) / 2}%`;   // 從物件中心浮起
  $("cuts").appendChild(wrap);
  return wrap;
}
// 按鈕和剪影連動：滑過、按住就浮起
function linkLift(btn, cut) {
  if (!cut) return;
  btn.classList.add("has-cut");
  const on = () => cut.classList.add("lift"), off = () => cut.classList.remove("lift");
  btn.addEventListener("pointerenter", on); btn.addEventListener("pointerleave", off);
  btn.addEventListener("pointerdown", on); btn.addEventListener("pointerup", off);
}
function liftFound(anomalyId) {
  const a = ANOMALIES.find((x) => x.id === anomalyId); if (!a) return;
  const c = cutout(a.id, a.still, "c-found"); if (!c) return;
  requestAnimationFrame(() => c.classList.add("lift"));
}

function renderSpots() {
  const box = $("spots"); box.innerHTML = ""; $("cuts").innerHTML = "";
  const curSrc = stopSrc(STATIONS[game.station], game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null);
  if (game.phase === "tour") {
    STATIONS[game.station].spots.forEach((s, i) => {
      const b = document.createElement("button");
      const seen = run.toured.has(`${game.station}:${i}`);
      b.className = "spot" + (seen ? " done" : "");
      placeBtn(b, s);
      b.innerHTML = `<span>${s.label}</span>`;
      b.setAttribute("aria-label", `調查：${s.label}`);
      const cut = cutout(`S${game.station}:${i}`, curSrc, seen ? "c-spot c-done" : "c-spot");
      linkLift(b, cut);
      b.onclick = (e) => {
        e.stopPropagation(); if (busy) return;
        run.toured.add(`${game.station}:${i}`); play("click");
        b.classList.add("done"); cut?.classList.add("c-done"); $("tip").innerHTML = `<b>${s.label}</b>　${s.text}`;
        if (s.action === "takeItems" && !quests.taken) { takeItems(quests); nbPulse(); burst("收到委託", true); renderSpots(); }
        setButtons();
        if (tourLeft() === 0) toast("這站看完了，可以往前走");
      };
      box.appendChild(b);
    });
  }
  // 交付點：領了委託、還有東西沒送時，在導覽圈與循環圈都看得到
  if (pending(quests).length) {
    for (const t of targetsAt(game.station)) {
      const b = document.createElement("button");
      b.className = "spot deliver"; placeBtn(b, t.box);
      b.innerHTML = `<span>送・${t.label}</span>`;
      linkLift(b, cutout(`T:${t.id}`, curSrc, "c-deliver"));
      b.setAttribute("aria-label", `交付到 ${t.label}`);
      b.onclick = (e) => { e.stopPropagation(); if (!busy) openDeliver(t); };
      box.appendChild(b);
    }
  }
  // 線索：循環圈才出現；路燈那條限晚上
  for (const c of visibleClues(game.station, nowHour(), game.phase)) {
    const got = clues.found.includes(c.id);
    const b = document.createElement("button");
    b.className = "spot clue" + (got ? " done" : ""); placeBtn(b, c.box);
    b.innerHTML = `<span>線索・${c.label}</span>`;
    b.setAttribute("aria-label", `線索：${c.label}`);
    const cut = cutout(c.outline, curSrc, got ? "c-clue c-done" : "c-clue");
    linkLift(b, cut);
    b.onclick = (e) => {
      e.stopPropagation(); if (busy) return;
      if (collect(clues, c.id)) { play("found", 0.8); burst("線索！", true); nbPulse(); b.classList.add("done"); cut?.classList.add("c-done"); }
      else play("click");
      toast(c.text);
      if (allFound(clues) && !clues.opened) setTimeout(() => toast("4 條線索都到手了！D0646 那邊的走廊深處好像有路……"), 1800);
      renderBranch();
    };
    box.appendChild(b);
  }
  renderBranch();
}

// S6 的岔路：線索集齊後出現「往走廊深處」，打開過之後可以再進去
function renderBranch() {
  $("branch").classList.toggle("hidden", !(game.phase === "loop" && game.station === 6 && allFound(clues)));
  $("branch").textContent = clues.opened ? "進入 D0647 →" : "往走廊深處 →";
}

// ---------- 手帳與交付 ----------
function nbPulse() { const n = $("nbBtn"); n.classList.remove("pulse"); void n.offsetWidth; n.classList.add("pulse"); }
function openSheet(html, cls = "") {
  const s = $("sheet"); s.innerHTML = html; s.className = "sheet " + cls; s.classList.remove("hidden");
  busy = true; setButtons();
  s.querySelector("[data-close]").onclick = closeSheet;
}
function closeSheet() { $("sheet").classList.add("hidden"); busy = false; setButtons(); }
function openNotebook() {
  if (!$("start").classList.contains("hidden") || walking) return;
  play("click");
  const items = quests.taken
    ? ITEMS.map((i) => `<li class="${quests.delivered.includes(i.id) ? "ok" : ""}"><b>${i.name}</b><br>${quests.delivered.includes(i.id) ? "已送達" : i.hint}</li>`).join("")
    : `<li>還沒有委託。導覽圈經過系辦門口時看看。</li>`;
  const st = stamps();
  const stampList = st.length ? st.map((s) => `<li class="ok"><b>${s.name}</b><br>${s.text}</li>`).join("") : `<li>還沒有紀念章。</li>`;
  const clueList = clues.found.length
    ? CLUES.filter((c) => clues.found.includes(c.id)).map((c) => `<li class="ok"><b>${c.label}</b><br>${c.text}</li>`).join("")
    : `<li>還沒有線索。循環開始後，留意畫面上發亮的「線索」。</li>`;
  const slots = CLUES.map((c, i) => (clues.found.includes(c.id) ? "？" : "＿")).join(" ");
  openSheet(`<h3>手帳</h3><p class="clock">現在 ${fmtHour(nowHour())}（${PERIOD_LABEL[periodOf(nowHour())]}）</p>
    <h4>系辦委託</h4><ul>${items}</ul>
    <h4>邱老師研究室的密碼　${slots}（${clues.found.length}/${CLUES.length}）</h4><ul>${clueList}</ul>
    <h4>紀念章</h4><ul>${stampList}</ul><button class="go" data-close>關閉</button>`);
}
function openDeliver(target) {
  play("click");
  const list = pending(quests);
  openSheet(`<h3>送到 ${target.label}？</h3><p>選一件要交出去的東西：</p>
    <div class="choices">${list.map((i) => `<button data-item="${i.id}"><b>${i.name}</b><small>${i.hint}</small></button>`).join("")}</div>
    <button class="ghost" data-close>先不要</button>`);
  $("sheet").querySelectorAll("[data-item]").forEach((b) => {
    b.onclick = () => {
      const r = deliver(quests, b.dataset.item, target.id);
      closeSheet();
      if (r.ok) {
        play("correct"); burst(r.stamp ? "蓋章！" : "送達！", !r.stamp); shake(false); toast(r.text);
        if (r.stamp) { play("clear"); setTimeout(() => dean("cheer", null, 2200), 500); toast(`紀念章「${r.stamp.name}」：${r.stamp.text}`); }
        renderSpots();
      } else { play("wrong", 0.5); toast(r.text); }
    };
  });
}

function renderStop() {
  const st = STATIONS[game.station];
  const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  if (!layers[front].src.endsWith(stopSrc(st, an)) || showToken === 0) show(stopSrc(st, an), false);
  $("floorNo").textContent = `${game.count}F`;
  $("where").textContent = game.phase === "tour" ? `導覽圈・${st.name}` : `第 ${game.lap} 圈・${st.name}`;
  const tip = $("tip");
  if (game.phase === "tour") { tip.textContent = `${st.tour}（還有 ${tourLeft()} 個地方沒看）`; tip.classList.remove("hidden"); }
  else if (!tip.dataset.keep) tip.classList.add("hidden");
  delete tip.dataset.keep;
  renderSpots(); grade();
  if (q.has("debug")) { $("dbg").textContent = `seed ${seed}｜這圈異常：${game.anomaly ?? "無"}`; $("dbg").classList.remove("hidden"); }
  prefetch(game.station + 1);
}

// 走到目前這一站：中間格 a → b → 停站圖，每張推近一點並踩一步腳步聲
const STEP_MS = 620;
function walk() {
  const st = STATIONS[game.station];
  const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  const seq = [...st.frames, stopSrc(st, an)];
  busy = true; setButtons();
  $("spots").innerHTML = ""; $("cuts").innerHTML = "";
  let i = 0, timer = null, ended = false;
  const done = () => {
    if (ended) return; ended = true; clearTimeout(timer); walking = null;
    busy = false; renderStop(); setButtons();
  };
  const next = () => {
    if (i >= seq.length) return done();
    if (i < seq.length - 1) play("footstep", 1, STEP_MS - 20);
    show(seq[i], i < seq.length - 1); i++; timer = setTimeout(next, STEP_MS);
  };
  walking = done;
  next();
}

function showCard(tag, anomalyId, onClose) {
  const a = ANOMALIES.find((x) => x.id === anomalyId);
  $("cardTag").textContent = tag;
  $("cardTitle").textContent = a.card.title;
  $("cardText").textContent = a.card.text;
  const card = $("card"); card.classList.add("hidden"); void card.offsetWidth; card.classList.remove("hidden");
  busy = true; setButtons();
  $("cardOk").onclick = () => { card.classList.add("hidden"); busy = false; setButtons(); onClose && onClose(); };
  $("cardOk").focus();
}

function remember(id) { if (id && !save.dex.includes(id)) { save.dex.push(id); writeSave(save); } }

// ---------- 密碼門與 D0647 支線（不呼叫 step()，不影響 6 圈主線） ----------
function openKeypad() {
  if (clues.opened) { enterD0647(); return; }
  play("click");
  let code = "";
  openSheet(`<h3>D0647 門鎖</h3><p>輸入 4 位數密碼（線索在手帳裡）。</p>
    <div class="code" id="codeShow">＿ ＿ ＿ ＿</div>
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join("")}
      <button data-n="clr">清除</button><button data-n="0">0</button><button data-n="ok" class="ok">開鎖</button></div>
    <p class="why" id="codeMsg"></p><button class="ghost" data-close>先不要</button>`);
  const showCode = () => { $("codeShow").textContent = [...code.padEnd(CODE.length, "＿")].join(" "); };
  $("sheet").querySelectorAll("[data-n]").forEach((b) => {
    b.onclick = () => {
      const n = b.dataset.n;
      if (n === "clr") code = "";
      else if (n === "ok") {
        const r = tryCode(clues, code);
        $("codeMsg").textContent = r.text;
        if (r.ok) { play("clear"); setTimeout(() => { closeSheet(); enterD0647(true); }, 700); }
        else { play("wrong", 0.6); shake(false); code = ""; }
      } else if (code.length < CODE.length) { code += n; play("click", 0.6); }
      showCode();
    };
  });
}

function actor(src, ms) {
  clearTimeout(deanTimer);
  deanImg.src = src; deanImg.style.right = "-2%";
  deanImg.classList.remove("out"); void deanImg.offsetWidth; deanImg.classList.add("in");
  if (ms) deanTimer = setTimeout(() => { deanImg.classList.remove("in"); deanImg.classList.add("out"); }, ms);
}
function speak(name, text, ms = 5000) {
  $("sub").innerHTML = `<b>${name}</b>${text}`; $("sub").classList.remove("hidden");
  clearTimeout(say.t); say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
}

async function enterD0647(first) {
  busy = true; setButtons();
  $("spots").innerHTML = ""; $("cuts").innerHTML = ""; $("branch").classList.add("hidden");
  $("where").textContent = "支線・D0647 研究室";
  play("footstep", 1, 560); show("frames/s8_a.webp", true); await sleep(650);
  play("footstep", 1, 560); show("frames/s8.webp", false); await sleep(600);
  actor("frames/qiu_greet.webp", 0); play("dean");
  if (first) { burst("蓋章！找到邱老師"); nbPulse(); }
  speak("邱士展老師", "哦？居然找得到 D0647！我是邱士展，教 3D 角色動畫和動畫劇本創作，專長是動畫導演跟鏡頭語言。", 6000);
  await sleep(first ? 1200 : 300);
  openSheet(`<h3>D0647・邱士展老師</h3>
    <ul><li><b>專長</b><br>電腦動畫、動畫導演、數位特效、鏡頭語言</li>
    <li><b>課程</b><br>3D 角色動畫、3D 遊戲引擎應用、動畫劇本創作、3D 列印應用實務</li>
    <li><b>2026</b><br>指導的動畫作品入圍放視大賞動畫類</li></ul>
    <p class="why">「聽說你也愛對戰？片場對決下一版開拍，到時候再來找我。」</p>
    <button class="go" data-close>回到走廊</button>`, "left");
  $("sheet").querySelector("[data-close]").onclick = () => {
    closeSheet(); deanImg.classList.remove("in"); deanImg.classList.add("out"); $("sub").classList.add("hidden");
    show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false); renderStop();
  };
}

// ---------- 判定後的演出 ----------
async function react(ev, precise) {
  if ("count" in ev) $("floorNo").textContent = `${ev.count}F`;
  remember(ev.anomaly);
  if (ev.type === "correct" || ev.type === "ending") {
    busy = true; setButtons();
    if (ev.anomaly) {
      $("spots").innerHTML = ""; $("cuts").innerHTML = "";
      if (precise) { run.precise++; flash(); await sleep(reduced ? 0 : 110); /* 頓幀 */ shake(false); liftFound(ev.anomaly); burst("碰！抓到了"); play("found"); }
      else { liftFound(ev.anomaly); burst("回頭成功", true); play("correct"); }
    } else { burst("✔ 正常", true); play("correct", 0.7); }
    floorFx("pop");
    if (ev.voice === "vo_first_correct") dean("cheer", ev.voice);
    else if (ev.voice === "vo_half") dean("peek", ev.voice, 2600);
    if (ev.type === "ending") { await sleep(500); return finish(); }
    await sleep(ev.anomaly ? 950 : 250);
    if (ev.anomaly) showCard(precise ? "✔ 精準指認！圖鑑收錄" : "✔ 答對！圖鑑收錄", ev.anomaly, walk); else walk();
    return;
  }
  // 答錯
  run.mistakes++;
  floorFx("reset");
  if (ev.reason === "missed") {
    busy = true; setButtons();
    flash("red"); shake(true); glitch(); play("sting");
    await sleep(700);
    showCard("✘ 你錯過了這個異常（計數歸零）", ev.anomaly, walk);
  } else {
    // 沒異常卻回頭：恐怖瞬間 → 系主任哀求破功（反差）
    play("wrong"); shake(false);
    dean("plead", ev.voice, 3400);
    walk();
  }
}

function act(action) {
  if (busy || game.phase === "ending" || !$("start").classList.contains("hidden")) return;
  if (game.phase === "tour" && action === "forward" && tourLeft() > 0) { toast(`還有 ${tourLeft()} 個地方沒看`); return; }
  const ev = step(game, action);
  if (ev.type === "tour-hint") { toast("導覽圈先往前走完，把正常的樣子記起來"); return; }
  if (ev.type === "move") { walk(); return; }
  if (ev.type === "tour-done") {
    run.t0 = performance.now(); tickTimer();
    flash("black"); burst("循環開始", true); play("sting", 0.6);
    const sp = stepFor(startHour);
    if (sp > 1) setTimeout(() => toast(`六樓的時間過得特別快……每走一圈過 ${sp} 小時`), 900);
    if (sp === 0) setTimeout(() => toast("六樓的時間好像停住了……"), 900);
    $("tip").textContent = "看到不對勁：直接點那個地方，或按回頭。"; $("tip").dataset.keep = "1"; $("tip").classList.remove("hidden");
    walk(); return;
  }
  react(ev, false);
}

// 循環圈直接點畫面指認異常：點中＝答對（精準），點錯只提示、不扣分
function pointAt(e) {
  if (walking) { walking(); return; }                 // 走路中點畫面＝略過
  if (busy || game.phase !== "loop" || !$("start").classList.contains("hidden")) return;
  const r = stage.getBoundingClientRect();
  const px = ((e.clientX - r.left) / r.width) * 100, py = ((e.clientY - r.top) / r.height) * 100;
  ripple(e.clientX - r.left, e.clientY - r.top);
  const an = anomalyAt(game, ANOMALIES);
  const hit = an && an.hits.some((h) => px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h);
  if (hit) { react(step(game, "back"), true); return; }
  run.misTaps++; play("click", 0.5);
  toast(["這裡看起來很正常……", "嗯？好像沒什麼", "再仔細看看"][run.misTaps % 3]);
}

// ---------- 計時 ----------
const fmt = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
function tickTimer() {
  if (game.phase !== "loop") return;
  $("timer").textContent = fmt(performance.now() - run.t0);
  requestAnimationFrame(tickTimer);
}

// ---------- 結局、測驗、成績卡 ----------
async function finish() {
  busy = true; setButtons();
  const ms = performance.now() - run.t0;
  play("clear");
  dean("welcome", "vo_ending", 4200);
  await sleep(2600);
  const secret = new Set(save.dex).size >= ANOMALIES.length && !save.secretSeen;
  save.clears++;
  const newBest = save.bestMs == null || ms < save.bestMs;
  if (newBest) save.bestMs = ms;
  if (save.bestMiss == null || run.mistakes < save.bestMiss) save.bestMiss = run.mistakes;
  if (secret) save.secretSeen = true;
  writeSave(save);
  if (secret) { dean("peek", "vo_secret", 5200); await sleep(4200); }
  const got = new Set(save.dex);
  const el = $("ending");
  el.innerHTML = `<h1>6F・出口</h1><p>你走出了六樓。</p>
    <div class="stats">
      <div><b>${fmt(ms)}</b><small>通關時間${newBest ? "（新紀錄！）" : ""}</small></div>
      <div><b>${run.mistakes}</b><small>失誤次數</small></div>
      <div><b>${run.precise}</b><small>精準指認</small></div>
      <div><b>${got.size}/${ANOMALIES.length}</b><small>圖鑑（累計）</small></div>
      <div><b>${quests.delivered.length}/${ITEMS.length}</b><small>委託送達${quests.stamps.length ? "・六樓郵差" : ""}</small></div>
      <div><b>${clues.found.length}/${CLUES.length}</b><small>線索${clues.opened ? "・找到邱老師" : ""}</small></div>
    </div>
    <div class="dex">${ANOMALIES.map((a) => got.has(a.id)
      ? `<div><b>${a.card.title}</b><br>${STATIONS[a.station].name}</div>` : `<div class="no">？？？</div>`).join("")}</div>
    ${got.size < ANOMALIES.length ? `<p style="color:var(--dim);font-size:13px">集滿 ${ANOMALIES.length} 個異常，會解鎖隱藏結局。</p>` : ""}
    <div class="row"><button class="go" id="toQuiz">接受新生小測驗</button><button class="ghost" id="again1">再走一次</button></div>`;
  el.classList.remove("hidden");
  $("toQuiz").onclick = () => quiz(ms);
  $("again1").onclick = () => location.reload();
}

function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function quiz(ms) {
  const qs = shuffle(QUIZ).slice(0, 5);
  let i = 0, score = 0;
  const el = $("ending");
  const ask = () => {
    const item = qs[i];
    const order = shuffle(item.options.map((t, k) => ({ t, ok: k === item.a })));
    el.innerHTML = `<div class="quiz"><small>新生小測驗 ${i + 1} / ${qs.length}</small><h2>${item.q}</h2>
      <div class="opts">${order.map((o, k) => `<button data-k="${k}">${o.t}</button>`).join("")}</div><p class="why" id="why"></p></div>`;
    el.querySelectorAll(".opts button").forEach((b) => {
      b.onclick = () => {
        const o = order[+b.dataset.k];
        el.querySelectorAll(".opts button").forEach((x, k) => { x.disabled = true; if (order[k].ok) x.classList.add("right"); });
        if (o.ok) { score++; play("correct"); } else { b.classList.add("bad"); play("wrong", 0.6); }
        $("why").textContent = (o.ok ? "答對！" : "答錯了。") + item.why;
        setTimeout(() => { i++; i < qs.length ? ask() : resultCard(ms, score, qs.length); }, 1500);
      };
    });
  };
  ask();
}

function resultCard(ms, score, total) {
  const title = score === total ? "六樓活地圖" : score >= total - 2 ? "合格新生" : "迷路新生";
  const line = score === total ? "系辦、實驗室、研究室都難不倒你。" : score >= total - 2 ? "再逛一次六樓就全懂了。" : "沒關係，再走一次六樓吧！";
  play(score === total ? "clear" : "correct");
  $("ending").innerHTML = `<div class="result"><small>樹德科大 動畫與遊戲設計系・六樓出口</small>
      <div class="title">${title}</div><p>${line}</p>
      <div class="meta"><span>通關時間</span><b>${fmt(ms)}</b><span>失誤次數</span><b>${run.mistakes}</b>
        <span>精準指認</span><b>${run.precise}</b><span>小測驗</span><b>${score} / ${total}</b>
        <span>圖鑑累計</span><b>${new Set(save.dex).size} / ${ANOMALIES.length}</b><span>委託送達</span><b>${quests.delivered.length} / ${ITEMS.length}</b>
        <span>紀念章</span><b>${stamps().map((s) => s.name).join("、") || "—"}</b><span>最佳時間</span><b>${save.bestMs != null ? fmt(save.bestMs) : "—"}</b></div></div>
    <p style="color:var(--dim);font-size:13px">截圖這張成績卡，分享給同學。</p>
    <div class="row"><button class="go" id="again2">再走一次</button></div>`;
  $("again2").onclick = () => location.reload();
}

// ---------- 輸入 ----------
$("btnBack").onclick = () => act("back");
$("btnFwd").onclick = () => act("forward");
stage.addEventListener("click", pointAt);
addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
  if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
});
$("go").onclick = () => {
  loadSfx(); loadVoices(); play("hum"); $("start").classList.add("hidden"); walk();
  if (periodOf(realHour) === "night") setTimeout(() => dean("cheer", "vo_night", 3600), 1600);   // 真實時間在晚上的彩蛋
};
$("nbBtn").onclick = (e) => { e.stopPropagation(); openNotebook(); };
$("branch").onclick = (e) => { e.stopPropagation(); if (!busy) openKeypad(); };
if (save.bestMs != null) $("best").textContent = `你的最佳時間 ${fmt(save.bestMs)}・圖鑑 ${new Set(save.dex).size}/${ANOMALIES.length}・通關 ${save.clears} 次`;
for (const p of ["plead", "cheer", "welcome", "peek"]) new Image().src = `frames/dean_${p}.webp`;
for (const f of ["s8_a", "s8", "qiu_greet"]) new Image().src = `frames/${f}.webp`;
renderStop(); prefetch(0);
if (q.has("debug") && q.has("go")) $("go").click();   // 除錯：自動進入（無頭瀏覽器截圖用）
