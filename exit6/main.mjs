// 《六樓出口》畫面層：原始碼在這裡，改完跑 npm run exit6:bundle 產生 game.js（雙擊 index.html 也能玩，因為 file:// 不能載入 module）
import { createGame, step, anomalyAt, mulberry32 } from "./game-core.mjs";
import { STATIONS, ANOMALIES, VOICE_TEXT } from "./data.mjs";

const q = new URLSearchParams(location.search);
const seed = q.has("seed") ? Number(q.get("seed")) : (Date.now() & 0xffffffff);
const game = createGame(ANOMALIES, mulberry32(seed));
const $ = (id) => document.getElementById(id);
const stage = $("stage");
const layers = [$("imgA"), $("imgB")];   // 兩層圖交替淡入淡出
let front = 0;
let busy = false;     // 卡片開著或走路中，不接受操作

// 語音：檔案放 audio/<id>.m4a；還沒錄就只顯示字幕
const audio = {};
function preloadVoices() {
  for (const id of Object.keys(VOICE_TEXT)) {
    const a = new Audio(`audio/${id}.m4a`);
    a.preload = "auto";
    a.addEventListener("error", () => { audio[id] = null; });
    audio[id] = a;
  }
}
function say(id) {
  if (!id) return;
  const a = audio[id];
  if (a) a.play().catch(() => {});
  $("sub").innerHTML = `<b>系主任</b>${VOICE_TEXT[id]}`;
  $("sub").classList.remove("hidden");
  clearTimeout(say.t);
  say.t = setTimeout(() => $("sub").classList.add("hidden"), 5000);
}

// 預先載入下一站的中間格與停站圖，走路時才不會卡
const loaded = new Set();
function prefetch(i) {
  const st = STATIONS[i % STATIONS.length];
  for (const u of [...st.frames, st.still]) if (!loaded.has(u)) { loaded.add(u); new Image().src = u; }
}

// 換一張圖：新圖在後層載好再淡入；push＝鏡頭推近（走路感）
let showToken = 0;   // 只讓最後一次 show 生效，避免略過時舊圖晚載入蓋掉停站圖
function show(src, push) {
  const back = layers[1 - front], token = ++showToken;
  back.onload = () => {
    if (token !== showToken) return;
    back.style.animation = "none"; void back.offsetWidth;
    back.style.animation = push ? "push 700ms ease-out forwards" : "";
    back.classList.add("on"); layers[front].classList.remove("on"); front = 1 - front;
  };
  back.src = src;
}
const stopSrc = (st, an) => an?.still || st.still;

function setButtons() {
  const off = busy || game.phase === "ending";
  $("btnBack").disabled = off; $("btnFwd").disabled = off;
}

// 停站：顯示最後一格＋佔位字卡＋導覽說明
function renderStop() {
  const st = STATIONS[game.station];
  const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  if (!layers[front].src.endsWith(stopSrc(st, an)) || showToken === 0) show(stopSrc(st, an), false);
  const ovs = [];
  if (an && !an.still) ovs.push(`<div class="ov ph" style="left:${an.placeholder.x}%;top:${an.placeholder.y}%">${an.placeholder.text}<small>異常佔位・待生圖</small></div>`);
  $("ovs").innerHTML = ovs.join("");
  $("floorNo").textContent = `${game.count}F`;
  $("where").textContent = game.phase === "tour" ? `導覽圈・${st.name}` : `第 ${game.lap} 圈・${st.name}`;
  const tip = $("tip");
  if (game.phase === "tour") { tip.textContent = st.tour; tip.classList.remove("hidden"); }
  else if (!tip.dataset.keep) tip.classList.add("hidden");
  delete tip.dataset.keep;
  if (q.has("debug")) { $("dbg").textContent = `seed ${seed}｜這圈異常：${game.anomaly ?? "無"}`; $("dbg").classList.remove("hidden"); }
  prefetch(game.station + 1);
}

// 走到目前這一站：中間格 a → b → 停站圖，每張推近一點（漫畫風逐格走路）
const STEP_MS = 650;
function walk() {
  const st = STATIONS[game.station];
  const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
  const seq = [...st.frames, stopSrc(st, an)];
  busy = true; setButtons();
  $("ovs").innerHTML = "";
  let i = 0, timer = null, ended = false;
  const done = () => {
    if (ended) return; ended = true; clearTimeout(timer); stage.onclick = null;
    busy = false; renderStop(); setButtons();
  };
  const next = () => { if (i >= seq.length) return done(); show(seq[i], i < seq.length - 1); i++; timer = setTimeout(next, STEP_MS); };
  stage.onclick = done;   // 點畫面可略過
  next();
}

function flash(red) {
  const f = document.createElement("div");
  f.className = "layer flash" + (red ? " red" : "");
  $("app").appendChild(f);
  setTimeout(() => f.remove(), 950);
}

function showCard(tag, anomalyId, onClose) {
  const a = ANOMALIES.find((x) => x.id === anomalyId);
  $("cardTag").textContent = tag;
  $("cardTitle").textContent = a.card.title;
  $("cardText").textContent = a.card.text;
  $("card").classList.remove("hidden");
  busy = true; setButtons();
  $("cardOk").onclick = () => { $("card").classList.add("hidden"); busy = false; setButtons(); onClose && onClose(); };
  $("cardOk").focus();
}

function showEnding() {
  const got = new Set(game.seen);
  $("ending").innerHTML = `<h1>6F・出口</h1><p>你走出了六樓。</p><p style="color:var(--dim)">圖鑑 ${got.size} / ${ANOMALIES.length}</p>
    <div class="dex">${ANOMALIES.map((a) => got.has(a.id)
      ? `<div><b>${a.card.title}</b><br>${STATIONS[a.station].name}</div>`
      : `<div class="no">？？？</div>`).join("")}</div>
    <button class="go" style="margin-top:12px" onclick="location.reload()">再走一次</button>`;
  $("ending").classList.remove("hidden");
}

function act(action) {
  if (busy || game.phase === "ending" || !$("start").classList.contains("hidden")) return;
  const ev = step(game, action);
  if ("count" in ev) $("floorNo").textContent = `${ev.count}F`; // 答完立刻更新樓層，不等卡片關掉
  switch (ev.type) {
    case "tour-hint":
      $("tip").textContent = "導覽圈先往前走完，把正常的樣子記起來。"; $("tip").classList.remove("hidden"); return;
    case "move": walk(); return;
    case "tour-done":
      flash(false); $("tip").textContent = "循環開始。記得：覺得不對勁就回頭。"; $("tip").dataset.keep = "1"; $("tip").classList.remove("hidden");
      walk(); return;
    case "correct":
      flash(false); say(ev.voice);
      if (ev.anomaly) showCard("✔ 答對！圖鑑收錄", ev.anomaly, walk); else walk();
      return;
    case "wrong":
      flash(ev.reason === "missed"); say(ev.voice);
      if (ev.reason === "missed") showCard("✘ 你錯過了這個異常（計數歸零）", ev.anomaly, walk); else walk();
      return;
    case "ending":
      flash(false); say(ev.voice);
      if (ev.anomaly) showCard("✔ 答對！圖鑑收錄", ev.anomaly, showEnding); else showEnding();
      return;
  }
}

$("btnBack").onclick = () => act("back");
$("btnFwd").onclick = () => act("forward");
addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
  if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
});
$("go").onclick = () => { preloadVoices(); $("start").classList.add("hidden"); walk(); };
renderStop(); prefetch(0);
if (q.has("debug") && q.has("go")) $("go").click();   // 除錯：自動進入（無頭瀏覽器截圖用）
