// 《六樓出口》畫面層：原始碼在這裡，改完跑 npm run exit6:bundle 產生 game.js（雙擊 index.html 也能玩，因為 file:// 不能載入 module）
// 規則在 game-core.mjs（有回歸測試）；這裡只管演出：走路、點擊調查、果汁、系主任、測驗、紀錄
import { createGame, step, anomalyAt, mulberry32 } from "./game-core.mjs";
import { STATIONS, ANOMALIES, QUIZ, VOICE_TEXT } from "./data.mjs";
import { periodOf, stepFor, hourAt, gradeFor, fmtHour, hourLabel } from "./time.mjs";
import { ITEMS, TARGETS, createQuests, takeItems, deliver, pending, targetsAt, STAMP_POSTMAN } from "./quests.mjs";
import { OUTLINES } from "./outlines.mjs";
import { CLUES, CODE, createClues, visibleClues, collect, allFound, tryCode } from "./clues.mjs";
import { MOVES, QIU_HP, PLAYER_HP, createFight, nextRound, input, timeout } from "./fight.mjs";
import { cueFor, hintStage, areaOf, HINT_TEXT, COACH, helpReply, HELP_COOLDOWN_MS, HELP_CLEAR } from "./coach.mjs";
import { TEACHERS, displayName, createCards, award, allCollected, teacherAt, scriptsFor } from "./teachers.mjs";

const q = new URLSearchParams(location.search);
const seed = q.has("seed") ? Number(q.get("seed")) : (Date.now() & 0xffffffff);
const rng = mulberry32(seed ^ 0x9e3779b9);
const game = createGame(ANOMALIES, mulberry32(seed));
const $ = (id) => document.getElementById(id);
const stage = $("stage");
const layers = [$("imgA"), $("imgB")];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 資料裡「（待老師補充／確認：…）」是給老師看的佔位，玩家畫面不顯示
const pub = (s) => String(s).replace(/（待老師[^）]*）/g, "").trim();
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let front = 0;
let busy = false;     // 卡片開著或走路中，不接受操作
let walking = null;   // 走路中＝可呼叫的「略過」函式

// ---------- 紀錄（只存在這台瀏覽器；讀寫失敗就當沒有） ----------
const SAVE_KEY = "exit6-save-v1";
function loadSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function writeSave(s) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* 私密視窗等情況 */ } }
const save = Object.assign({ dex: [], bestMs: null, bestMiss: null, clears: 0, cards: [] }, loadSave());
const cardBook = createCards(save.cards);   // 老師簽名卡（壞資料就當沒有）
const run = { t0: 0, mistakes: 0, precise: 0, misTaps: 0, toured: new Set(), failStreak: 0 };
// 卡住提示：進到異常站開始計時；hintOn＝這圈要不要給提示（前 3 圈，或連錯兩次後）
const hint = { t0: 0, mis: 0, stage: 0, on: false, timer: null };
const quests = createQuests();
const clues = createClues();
const STAMP_QIU = { id: "qiu", name: "找到邱老師", text: "解開 4 條線索、打開 D0647，見到動畫導演邱士展老師。" };
const stamps = () => [...(quests.stamps.length ? [STAMP_POSTMAN] : []), ...(clues.opened ? [STAMP_QIU] : []), ...(fightWon ? [STAMP_FIGHT] : [])];

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
// 系主任語音錄好、放進 exit6/audio/ 後改成 true；之前不載入，避免主控台 404
const VOICE_READY = false;
const voices = {};
function loadVoices() {
  if (!VOICE_READY) return;
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
function sayText(text, ms = 4500) {
  $("sub").innerHTML = `<b>系主任</b>${text}`;
  $("sub").classList.remove("hidden");
  clearTimeout(say.t); say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
}
function deanSays(text, ms = 4200) { dean("peek", null, ms); sayText(text, ms); }
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
  $("clock").textContent = `${fmtHour(h)} ${hourLabel(h)}`;
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

function placeBtn(b, s) {
  Object.assign(b.style, { left: s.x + "%", top: s.y + "%", width: s.w + "%", height: s.h + "%" });
  if (s.y < 16) b.classList.add("lbl-below");   // 太靠上的標籤會被左上樓層、右上站名壓到，改放下方
}

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
        b.classList.add("done"); cut?.classList.add("c-done"); $("tip").innerHTML = `<b>${s.label}</b>　${pub(s.text)}`;
        if (s.action === "takeItems" && !quests.taken) { takeItems(quests); nbPulse(); burst("收到委託", true); renderSpots(); }
        setButtons(); updateCoach();
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
      if (allFound(clues) && !clues.opened) setTimeout(() => toast("4 條線索都到手了！D0646 那邊的走廊深處好像有路……"), Math.max(1800, c.text.length * 110 + 300));
      renderBranch();
    };
    box.appendChild(b);
  }
  renderBranch();
}

// S6 的岔路：線索集齊後出現「往走廊深處」，打開過之後可以再進去
function renderInvite() {
  const t = teacherAt(game.station, game.phase);
  const b = $("invite");
  b.classList.toggle("hidden", !t);
  if (t) b.innerHTML = `${cardBook.cards.some((c) => c.id === t.id) ? "✔ " : ""}${displayName(t)}的邀請`;
}
function renderBranch() {
  renderInvite();
  $("branch").classList.toggle("hidden", !(game.phase === "loop" && game.station === 6 && allFound(clues)));
  $("branch").textContent = clues.opened ? "進入 D0647 →" : "往走廊深處 →";
}

// ---------- 手帳與交付 ----------
function nbPulse() { const n = $("nbBtn"); n.classList.remove("pulse"); void n.offsetWidth; n.classList.add("pulse"); }
function openSheet(html, cls = "") {
  const s = $("sheet"); s.innerHTML = html; s.className = "sheet " + cls; s.classList.remove("hidden");
  busy = true; setButtons(); coachAt(null);
  s.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeSheet));
}
function closeSheet() { $("sheet").classList.add("hidden"); busy = false; setButtons(); updateCoach(); }
function cardGrid() {
  return TEACHERS.map((t) => {
    const c = cardBook.cards.find((x) => x.id === t.id);
    return c ? `<figure class="mini"><img src="${t.card}" alt=""><figcaption><b>${displayName(t)}</b>${c.best} 分</figcaption></figure>`
             : `<figure class="mini lock"><span>？</span><figcaption><b>${t.skill}</b>未取得</figcaption></figure>`;
  }).join("");
}
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
  openSheet(`<button class="x" data-close aria-label="關閉手帳">×</button><h3>手帳</h3><p class="clock">現在 ${fmtHour(nowHour())}（${hourLabel(nowHour())}）</p>
    <h4>系辦委託</h4><ul>${items}</ul>
    <h4>邱老師研究室的密碼　${slots}（${clues.found.length}/${CLUES.length}）</h4><ul>${clueList}</ul>
    <h4>老師簽名卡（${cardBook.cards.length}/${TEACHERS.length}）</h4><div class="cardgrid">${cardGrid()}</div>
    ${allCollected(cardBook) ? `<button class="ghost" data-ending>重看隱藏結局</button>` : `<p class="dim">循環圈經過有老師的站，按右下角「邀請」挑戰小遊戲。</p>`}
    <h4>紀念章</h4><ul>${stampList}</ul><button class="go" data-close>關閉</button>`);
  $("sheet").querySelector("[data-ending]")?.addEventListener("click", () => { closeSheet(); hiddenEnding(); });
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
  updateCoach();
  const anHere = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  if (anHere) startHint(anHere);
  if (game.phase === "loop" && game.lap === 2 && game.station === 0) setTimeout(() => deanSays(COACH.lap2, 4000), 500);
  if (q.has("debug")) { $("dbg").textContent = `seed ${seed}｜這圈異常：${game.anomaly ?? "無"}`; $("dbg").classList.remove("hidden"); }
  prefetch(game.station + 1);
}

// 走到目前這一站：中間格 a → b → 停站圖，每張推近一點並踩一步腳步聲
const STEP_MS = 620;
function walk() {
  const st = STATIONS[game.station];
  const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  const seq = [...st.frames, stopSrc(st, an)];
  busy = true; setButtons(); stopHint(); coachAt(null);
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
  $("cardText").textContent = pub(a.card.text);
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
      } else if (code.length < CODE.length) { code += n; play("click", 0.6); $("codeMsg").textContent = ""; }
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
    <p class="why">「聽說你也愛對戰？來一場片場對決吧，用鏡頭語言打敗我！」</p>
    <button class="go" data-fight>接受片場對決</button><button class="ghost" data-close>回到走廊</button>`, "left");
  $("sheet").querySelector("[data-fight]").onclick = startFight;
  $("sheet").querySelector("[data-close]").onclick = () => {
    closeSheet(); deanImg.classList.remove("in"); deanImg.classList.add("out"); $("sub").classList.add("hidden");
    show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false); renderStop();
  };
}

// ---------- D0647 片場對決（規則在 fight.mjs；全部原創，不使用既有格鬥遊戲的名稱與素材） ----------
const ARROW = { U: "↑", D: "↓", L: "←", R: "→", UL: "↖", UR: "↗", DL: "↙", DR: "↘", A: "A" };
const STAMP_FIGHT = { id: "fight", name: "片場殺青", text: "在 D0647 片場對決贏了邱士展老師，學會搖鏡、仰角、推軌、荷蘭角。" };
let fight = null, fightRaf = 0, fightWon = false, lastAttack = null;
const fightOn = () => !$("fight").classList.contains("hidden");

function hpDraw() {
  $("hpQ").textContent = "■".repeat(fight.qiu) + "□".repeat(QIU_HP - fight.qiu);
  $("hpM").textContent = "♥".repeat(fight.me) + "♡".repeat(PLAYER_HP - fight.me);
}
function startFight() {
  closeSheet(); deanImg.classList.remove("in"); deanImg.classList.add("out"); $("sub").classList.add("hidden");
  fight = createFight(rng);
  $("fbg").style.filter = `blur(2px) brightness(.75) ${stage.style.getPropertyValue("--grade")}`;
  $("movelist").innerHTML = Object.entries(MOVES).map(([id, m]) =>
    `<div data-m="${id}"><span>${m.name}</span><code>${m.cmd.map((k) => ARROW[k]).join(" ")}</code></div>`).join("");
  $("fight").classList.remove("hidden"); busy = true; setButtons();
  $("fqiu").src = "frames/qiu_ready.webp"; hpDraw(); $("tbar").style.transform = "scaleX(1)";
  $("tele").innerHTML = `「Action！」<small>看他的預告，照分鏡表輸入反擊（斜方向可省略）。電腦可用方向鍵＋Z。</small>`;
  play("dean"); play("sting", 0.5);
  setTimeout(nextFightRound, 2600);
}
function nextFightRound() {
  if (!fight || fight.over) return;
  const atk = (lastAttack = nextRound(fight, performance.now()));
  $("fqiu").src = "frames/qiu_attack.webp";
  const hint = fight.round <= 3;   // 前 3 回合標出該用哪一招，之後靠記憶
  $("tele").innerHTML = `${atk.tele}<small>${atk.name}${hint ? `　→ 用「${MOVES[atk.counter].name}」` : ""}</small>`;
  document.querySelectorAll("#movelist div").forEach((d) => d.classList.toggle("want", hint && d.dataset.m === atk.counter));
  const total = fight.deadline - performance.now();
  cancelAnimationFrame(fightRaf);
  const tick = () => {
    if (!fight || !fight.attack) return;
    $("tbar").style.transform = `scaleX(${Math.max(0, (fight.deadline - performance.now()) / total)})`;
    const r = timeout(fight, performance.now());
    if (r) { fightResult(r); return; }
    fightRaf = requestAnimationFrame(tick);
  };
  fightRaf = requestAnimationFrame(tick);
}
function fightKey(k) {
  if (!fight || fight.over || !fight.attack) return;
  play("click", 0.35);
  const r = input(fight, k, performance.now());
  if (r.type !== "pending") fightResult(r);
}
function fightResult(r) {
  cancelAnimationFrame(fightRaf); hpDraw();
  document.querySelectorAll("#movelist div").forEach((d) => d.classList.remove("want"));
  const cam = $("fcam"), q = $("fqiu");
  if (r.type === "hit") {
    play("found");
    cam.className = "fcam"; void cam.offsetWidth; cam.classList.add("cam-" + r.move.cam.key);
    q.classList.remove("hit"); void q.offsetWidth; q.classList.add("hit");
    $("tele").innerHTML = `命中！${r.move.name}<small>${r.move.cam.term}</small>`;
    const term = $("term"); term.innerHTML = `<b>${r.move.cam.term}</b>${r.move.cam.def}`;
    term.classList.add("hidden"); void term.offsetWidth; term.classList.remove("hidden");
    clearTimeout(fightResult.t); fightResult.t = setTimeout(() => term.classList.add("hidden"), 2200);
  } else {
    play("wrong"); const box = $("fbox"); box.classList.remove("shake-l"); void box.offsetWidth; box.classList.add("shake-l");
    $("tele").innerHTML = r.reason === "slow"
      ? `太慢了！方向對了，但相鄰按鍵要在 0.5 秒內按完<small>「${MOVES[lastAttack?.counter]?.name ?? ""}」再快一點</small>`
      : `NG！被「${lastAttack?.name ?? "招式"}」打中了<small>正解是「${MOVES[lastAttack?.counter]?.name ?? ""}」</small>`;
  }
  if (r.over === "win") return fightWin();
  if (r.over === "lose") return fightLose();
  setTimeout(() => { q.src = "frames/qiu_ready.webp"; }, 500);
  setTimeout(nextFightRound, 1500);
}
function fightEndButtons(html) {
  $("tele").innerHTML = html;
  $("tele").querySelector("[data-retry]")?.addEventListener("click", startFight);
  $("tele").querySelector("[data-leave]").addEventListener("click", leaveFight);
}
function fightWin() {
  fightWon = true; play("clear");
  setTimeout(() => {
    $("fqiu").src = "frames/qiu_ko.webp";
    fightEndButtons(`「殺青！」<small>你的運鏡感很好，來動遊系一起拍片吧！紀念章「${STAMP_FIGHT.name}」</small>
      <div class="row" style="margin-top:6px"><button class="go" data-leave>回到走廊</button></div>`);
    nbPulse();
  }, 700);
}
function fightLose() {
  setTimeout(() => {
    $("fqiu").src = "frames/qiu_greet.webp";
    fightEndButtons(`「NG！這顆鏡頭重來！」<small>看預告、對分鏡表，斜方向可以省略。</small>
      <div class="row" style="margin-top:6px"><button class="go" data-retry>再拍一次</button><button class="ghost" data-leave>回到走廊</button></div>`);
  }, 700);
}
function leaveFight() {
  cancelAnimationFrame(fightRaf); fight = null;
  $("fight").classList.add("hidden"); busy = false;
  show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false); renderStop(); setButtons();
}
// 實體鍵盤：方向鍵可同時按出斜向，Z／空白／Enter＝A
const held = new Set();
const dirOf = () => {
  const v = (held.has("ArrowUp") ? "U" : held.has("ArrowDown") ? "D" : "") + (held.has("ArrowLeft") ? "L" : held.has("ArrowRight") ? "R" : "");
  return v || null;
};
addEventListener("keyup", (e) => held.delete(e.key));
document.querySelectorAll("#fight [data-k]").forEach((b) => {
  b.addEventListener("pointerdown", (e) => { e.preventDefault(); b.classList.add("on"); fightKey(b.dataset.k); });
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, () => b.classList.remove("on"));
});


// ---------- 新手引導：導覽圈前兩站圈住要按的東西 ----------
function coachAt(el, text) {
  const c = $("coach");
  if (!el) { c.classList.add("hidden"); return; }
  const a = $("app").getBoundingClientRect(), r = el.getBoundingClientRect();
  Object.assign(c.style, { left: r.left - a.left - 6 + "px", top: r.top - a.top - 6 + "px", width: r.width + 12 + "px", height: r.height + 12 + "px" });
  const sp = c.querySelector("span");
  sp.textContent = text; sp.style.marginLeft = "0px";
  c.classList.toggle("up", r.top - a.top > a.height * 0.55);   // 目標在下半部：說明放上面
  c.classList.remove("hidden");
  const t = sp.getBoundingClientRect();                         // 說明字超出畫面就往內推（手機直拿時右上角的樓層燈）
  const shift = Math.min(0, a.right - 8 - t.right) || Math.max(0, a.left + 8 - t.left);
  sp.style.marginLeft = shift + "px";
}
function updateCoach() {
  if (busy || game.phase !== "tour" || game.station > 1) return coachAt(null);
  const next = [...$("spots").querySelectorAll(".spot:not(.done):not(.deliver):not(.clue)")][0];
  coachAt(next || $("btnFwd"), next ? COACH.spot : game.station === 0 ? COACH.fwd : COACH.done);
}
addEventListener("resize", () => updateCoach());

// ---------- 異常站的線索與卡住提示 ----------
function stopHint() { clearInterval(hint.timer); hint.timer = null; $("spots").querySelector(".hintbox")?.remove(); }
function startHint(an) {
  stopHint();
  Object.assign(hint, { t0: performance.now(), mis: 0, stage: 0, on: game.lap <= 3 || run.failStreak >= 2 });
  const cue = cueFor(game.lap, run.failStreak);
  if (cue >= 1) setTimeout(glitch, 250);
  if (cue === 2) setTimeout(() => deanSays(COACH.loop1, 4200), 700);
  if (hint.on) hint.timer = setInterval(() => checkHint(an), 1000);
}
function checkHint(an) {
  if (busy || anomalyAt(game, ANOMALIES) !== an) return;
  const st = hintStage((performance.now() - hint.t0) / 1000, hint.mis, hint.on);
  if (st > hint.stage) showHint(an, st);
}
function showHint(an, st) {
  hint.stage = st;
  deanSays(HINT_TEXT[st].replace("{area}", areaOf(an.hits[0])), 4600);
  if (st === 3 && !$("spots").querySelector(".hintbox")) {
    for (const h of an.hits) {
      const b = document.createElement("div"); b.className = "hintbox"; placeBtn(b, h); $("spots").appendChild(b);
    }

    clearInterval(hint.timer);
  }
}


// ---------- 老師關卡：邀請 → 覆蓋層載入小遊戲（EXIT6_MG 介面）→ 贏了發簽名卡 ----------
const mgScripts = {};
function loadScript(src) {
  if (!mgScripts[src]) mgScripts[src] = new Promise((ok, ng) => {
    const el = document.createElement("script"); el.src = src; el.onload = ok; el.onerror = () => { delete mgScripts[src]; ng(new Error(src)); };
    document.head.appendChild(el);
  });
  return mgScripts[src];
}
let mgHandle = null, mgTeacher = null;
function openInvite() {
  const t = teacherAt(game.station, game.phase); if (!t || busy) return;
  play("click"); stopHint();
  const have = cardBook.cards.find((c) => c.id === t.id);
  openSheet(`<button class="x" data-close aria-label="關閉">×</button><h3>${displayName(t)}的邀請</h3>
    <p>${t.invite}</p><p class="mgskill">專長：${t.skill}・60 秒小遊戲</p>
    ${have ? `<p class="mgbest">已拿到簽名卡，最高分 ${have.best}。再玩可以刷新紀錄。</p>` : `<p class="mgbest">贏了可以拿到「${displayName(t)}」的簽名卡，集滿 ${TEACHERS.length} 張有驚喜。</p>`}
    <div class="row"><button class="go" data-mg>接受挑戰</button><button class="ghost" data-close>先不要</button></div>`);
  $("sheet").querySelector("[data-mg]").onclick = () => startMinigame(t);
}
async function startMinigame(t) {
  closeSheet(); deanImg.classList.remove("in"); deanImg.classList.add("out"); $("sub").classList.add("hidden");
  busy = true; setButtons(); mgTeacher = t;
  $("mgTitle").textContent = `${displayName(t)}・${t.skill}`;
  $("mgResult").classList.add("hidden"); $("mgRoot").innerHTML = `<p class="mgload">載入中……</p>`;
  $("mg").classList.remove("hidden"); play("sting", 0.4);
  try { for (const src of scriptsFor(t)) await loadScript(src); }
  catch { $("mgRoot").innerHTML = `<p class="mgload">這個小遊戲載入失敗（3D 關卡需要連網）。按右上角 × 回走廊。</p>`; return; }
  if (mgTeacher !== t) return;                      // 載入途中已經關掉
  // 每次給小遊戲一個新的內層容器：小遊戲會改容器樣式（position、transform），不能讓它動到宿主的 #mgRoot
  $("mgRoot").innerHTML = `<div class="mgstage"></div>`;
  let ended = false;   // onEnd 後等 2.6 秒再蓋上簽名卡：先讓玩家讀完小遊戲自己的專長知識
  mgHandle = window.EXIT6_MG[t.mg].mount($("mgRoot").firstChild, { rng, onEnd: (r) => { if (!ended) { ended = true; setTimeout(() => minigameEnd(t, r), 2600); } } });
}
function minigameEnd(t, r) {
  if (mgTeacher !== t) return;
  const res = award(cardBook, t.id, r);
  if (res.got) { save.cards = cardBook.cards; writeSave(save); nbPulse(); }
  const best = cardBook.cards.find((c) => c.id === t.id)?.best;
  const box = $("mgResult");
  box.innerHTML = r && r.win
    ? `<div class="sigcard"><img src="${t.card}" alt=""><div><small>${res.first ? "獲得簽名卡！" : "再次挑戰成功"}</small><b>${displayName(t)}</b><span>${t.skill}</span><q>${t.quote}</q><em>本次 ${r.score} 分・最高 ${best}</em></div></div>
       <div class="row"><button class="go" data-back>${res.completed ? "集滿了！回走廊看看" : "收進手帳，回走廊"}</button></div>`
    : `<h3>差一點！</h3><p>${t.skill}就是要多練幾次。本次 ${r ? r.score : 0} 分。</p>
       <div class="row"><button class="go" data-retry>再試一次</button><button class="ghost" data-back>回到走廊</button></div>`;
  box.classList.remove("hidden");
  if (r && r.win) { play(res.first ? "clear" : "correct"); burst(res.first ? "簽名卡 GET！" : "刷新紀錄", true); }
  box.querySelector("[data-back]").onclick = () => leaveMinigame(res.completed);
  const rt = box.querySelector("[data-retry]"); if (rt) rt.onclick = () => { mgHandle?.destroy(); mgHandle = null; startMinigame(t); };
}
function leaveMinigame(completed) {
  try { mgHandle?.destroy(); } catch { /* 小遊戲自己出錯也要能回走廊 */ }
  mgHandle = null; mgTeacher = null;
  $("mg").classList.add("hidden"); $("mgRoot").innerHTML = ""; busy = false;
  show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false); renderStop(); setButtons();
  if (completed) setTimeout(hiddenEnding, 500);
}
function hiddenEnding() {
  dean("welcome", null, 6000);
  sayText("五位老師的簽名都到手了！你已經把動遊系逛透透啦。", 6000);
  save.allCardsSeen = true; writeSave(save);
  openSheet(`<button class="x" data-close aria-label="關閉">×</button><h3>隱藏結局：六樓的通行證</h3>
    <p>走廊盡頭的燈一盞盞亮起來。五位老師的簽名在手帳裡排成一排——動畫、繪本、程式、3D、視覺傳達，這些你剛剛都親手玩過了。</p>
    <p>六樓不是迷宮，是我們每天上課的地方。下次，用學生證走進來吧。</p>
    <div class="row"><a class="go linkbtn" href="../#/works" target="_blank" rel="noopener">看學長姐作品</a><a class="go linkbtn" href="../#/admission" target="_blank" rel="noopener">招生資訊</a></div>
    <div class="row"><a class="ghost linkbtn" href="../#/labs" target="_blank" rel="noopener">特色實驗室</a><button class="ghost" data-close>回到走廊</button></div>`);
}

// 主動求救：只在循環圈可用
let helpAt = -Infinity;
function askHelp() {
  if (busy || game.phase !== "loop") { toast("先走進循環再求救喔"); return; }
  const left = HELP_COOLDOWN_MS - (performance.now() - helpAt);
  if (left > 0) { toast(`系主任喘口氣中……${Math.ceil(left / 1000)} 秒後再叫我`); return; }
  helpAt = performance.now();
  const an = anomalyAt(game, ANOMALIES);
  const r = helpReply(!!an, hint.stage);
  if (r.kind === "hint") showHint(an, r.stage); else deanSays(HELP_CLEAR, 3200);
}

// ---------- 判定後的演出 ----------
async function react(ev, precise) {
  if ("count" in ev) $("floorNo").textContent = `${ev.count}F`;
  remember(ev.anomaly);
  stopHint();
  if (ev.type === "correct" || ev.type === "ending") {
    run.failStreak = 0;
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
  run.mistakes++; run.failStreak++;
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
  run.misTaps++; hint.mis++; play("click", 0.5);
  if (an && hint.on) checkHint(an);
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
  if (fightOn()) {                                   // 對戰中：方向鍵（可同按出斜向）＋ Z／空白／Enter
    if (e.key.startsWith("Arrow")) { e.preventDefault(); if (e.repeat) return; held.add(e.key); const d = dirOf(); if (d) fightKey(d); }
    else if (["z", "Z", " ", "Enter"].includes(e.key)) { e.preventDefault(); if (!e.repeat) fightKey("A"); }
    return;
  }
  if (mgTeacher) return;                             // 老師小遊戲開著：按鍵交給小遊戲
  if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
  if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
});
// 放開一個方向、另一個還按著時，送出剩下的方向（↓ → 同按再放開 ↓＝↓ ↘ →）
addEventListener("keyup", (e) => { if (fightOn() && e.key.startsWith("Arrow")) { const d = dirOf(); if (d) fightKey(d); } });
$("go").onclick = () => {
  loadSfx(); loadVoices(); play("hum"); $("start").classList.add("hidden"); walk();
  if (periodOf(realHour) === "night") setTimeout(() => dean("cheer", "vo_night", 3600), 1600);   // 真實時間在晚上的彩蛋
};
$("nbBtn").onclick = (e) => { e.stopPropagation(); openNotebook(); };
$("helpBtn").onclick = (e) => { e.stopPropagation(); askHelp(); };
$("invite").onclick = (e) => { e.stopPropagation(); openInvite(); };
$("mgClose").onclick = () => leaveMinigame(false);
$("branch").onclick = (e) => { e.stopPropagation(); if (!busy) openKeypad(); };
if (save.bestMs != null) $("best").textContent = `你的最佳時間 ${fmt(save.bestMs)}・圖鑑 ${new Set(save.dex).size}/${ANOMALIES.length}・通關 ${save.clears} 次`;
for (const p of ["plead", "cheer", "welcome", "peek"]) new Image().src = `frames/dean_${p}.webp`;
for (const f of ["s8_a", "s8", "qiu_greet"]) new Image().src = `frames/${f}.webp`;
renderStop(); prefetch(0);
if (q.has("debug") && q.has("go")) $("go").click();   // 除錯：自動進入（無頭瀏覽器截圖用）
if (q.has("debug") && q.has("fight")) { $("start").classList.add("hidden"); startFight(); }   // 除錯：直接進片場對決
