// 《六樓出口》規則回歸測試：node --test scripts/test-exit6.mjs
// 加 --sample 參數直接執行（node scripts/test-exit6.mjs --sample）會印 10 組抽題序列供人工檢查
import test from "node:test";
import assert from "node:assert/strict";
import { createGame, step, startLap, anomalyAt, mulberry32, GOAL, LAST_STATION } from "../exit6/game-core.mjs";
import { STATIONS, ANOMALIES, QUIZ, VOICE_TEXT } from "../exit6/data.mjs";

const walkTour = (g) => { for (let i = 0; i <= LAST_STATION; i++) step(g, "forward"); };
const walkToEnd = (g) => { let ev; for (let i = 0; i <= LAST_STATION; i++) ev = step(g, "forward"); return ev; };
// 依答案正確作答一圈
const answerRight = (g) => (g.anomaly ? step(g, "back") : walkToEnd(g));

const inBox = (b) => b.x >= 0 && b.y >= 0 && b.w > 0 && b.h > 0 && b.x + b.w <= 100.01 && b.y + b.h <= 100.01;

test("資料：站數對、異常 id 不重複、每個異常有站點／點擊範圍／圖鑑", () => {
  assert.equal(STATIONS.length, LAST_STATION + 1);
  assert.equal(new Set(ANOMALIES.map((a) => a.id)).size, ANOMALIES.length);
  for (const a of ANOMALIES) {
    assert.ok(STATIONS[a.station], a.id);
    assert.ok(a.hits?.length && a.hits.every(inBox), `${a.id} 點擊範圍要在畫面內`);
    assert.ok(a.still, `${a.id} 缺異常圖`);
    assert.ok(a.card.title && a.card.text, a.id);
  }
});

test("資料：每站至少一個調查點，範圍在畫面內且有說明", () => {
  for (const s of STATIONS) {
    assert.ok(s.spots?.length, `${s.id} 沒有調查點`);
    for (const p of s.spots) assert.ok(inBox(p) && p.label && p.text, `${s.id} ${p.label}`);
  }
});

test("資料：測驗題至少 5 題、四個選項、答案索引有效、有解說", () => {
  assert.ok(QUIZ.length >= 5);
  for (const t of QUIZ) {
    assert.equal(t.options.length, 4, t.q);
    assert.equal(new Set(t.options).size, 4, `${t.q} 選項重複`);
    assert.ok(t.a >= 0 && t.a < 4 && t.why, t.q);
  }
});

test("素材：每站的中間格與停站圖、異常圖、系主任立繪都存在", async () => {
  const fs = await import("node:fs");
  const url = await import("node:url");
  const items = [...STATIONS.map((s) => [s.id, ...s.frames, s.still]), ...ANOMALIES.map((a) => [a.id, a.still]),
    ["dean", ...["plead", "cheer", "welcome", "peek"].map((p) => `frames/dean_${p}.webp`)],
    ["d0647", "frames/s8.webp", "frames/s8_a.webp", ...["greet", "ready", "attack", "ko"].map((p) => `frames/qiu_${p}.webp`)],
    ["sfx", ...["footstep", "hum", "sting", "found", "wrong", "dean", "correct", "clear", "click"].map((n) => `audio/sfx_${n}.mp3`)]];
  for (const [id, ...files] of items) for (const f of files) {
    const p = url.fileURLToPath(new URL(`../exit6/${f}`, import.meta.url));
    assert.ok(fs.existsSync(p), `${id} 缺 ${f}`);
  }
});

test("導覽圈：回頭不扣分，走完進入循環且第 1 圈必有異常", () => {
  const g = createGame(ANOMALIES, mulberry32(1));
  assert.equal(step(g, "back").type, "tour-hint");
  walkTour(g);
  assert.equal(g.phase, "loop");
  assert.equal(g.lap, 1);
  assert.ok(g.anomaly);
  assert.equal(g.count, 0);
});

test("有異常時回頭＝答對、計數 +1、第一次答對播 vo_first_correct", () => {
  const g = createGame(ANOMALIES, mulberry32(2));
  walkTour(g);
  const ev = step(g, "back");
  assert.equal(ev.type, "correct");
  assert.equal(ev.count, 1);
  assert.equal(ev.voice, "vo_first_correct");
});

test("有異常卻走到底＝答錯 missed、歸零、不出系主任聲", () => {
  const g = createGame(ANOMALIES, mulberry32(3));
  walkTour(g);
  const ev = walkToEnd(g);
  assert.equal(ev.type, "wrong");
  assert.equal(ev.reason, "missed");
  assert.equal(ev.voice, null);
  assert.equal(g.count, 0);
  assert.ok(g.seen.includes(ev.anomaly), "錯過的異常也要進圖鑑");
});

test("沒異常卻回頭＝false-alarm，台詞依次 01→02→03→03", () => {
  const g = createGame(ANOMALIES, mulberry32(4));
  walkTour(g);
  const voices = [];
  let guard = 0;
  while (voices.length < 4 && guard++ < 500) {
    if (g.anomaly) { step(g, "back"); continue; }
    voices.push(step(g, "back").voice);
  }
  assert.deepEqual(voices, ["vo_wrong_01", "vo_wrong_02", "vo_wrong_03", "vo_wrong_03"]);
});

test("答錯會把已累積的計數歸零（兩種答錯都要）", () => {
  for (const kind of ["missed", "false-alarm"]) {
    const g = createGame(ANOMALIES, mulberry32(11));
    walkTour(g);
    answerRight(g); answerRight(g);
    assert.equal(g.count, 2);
    let ev, guard = 0;
    while (guard++ < 200) {
      if (kind === "missed" ? g.anomaly : !g.anomaly) { ev = kind === "missed" ? walkToEnd(g) : step(g, "back"); break; }
      answerRight(g); g.count = 2; // 不是要的題型就跳過，計數維持 2
    }
    assert.equal(ev.reason, kind);
    assert.equal(g.count, 0, `${kind} 沒歸零`);
  }
});

test("全對 6 圈進結局、播 vo_ending、之後操作無效", () => {
  const g = createGame(ANOMALIES, mulberry32(5));
  walkTour(g);
  let ev;
  for (let i = 0; i < GOAL; i++) ev = answerRight(g);
  assert.equal(ev.type, "ending");
  assert.equal(ev.voice, "vo_ending");
  assert.equal(g.phase, "ending");
  assert.equal(step(g, "forward").type, "noop");
});

test("vo_half 只在計數 3 播一次", () => {
  const g = createGame(ANOMALIES, mulberry32(6));
  walkTour(g);
  const halves = [];
  for (let i = 0; i < 5; i++) { const ev = answerRight(g); if (ev.voice === "vo_half") halves.push(ev.count); }
  assert.deepEqual(halves, [3]);
});

test("抽題：12 個異常出完前不重複", () => {
  const g = createGame(ANOMALIES, mulberry32(7));
  walkTour(g);
  const drawn = [];
  let guard = 0;
  while (drawn.length < ANOMALIES.length && guard++ < 1000) {
    if (g.anomaly) drawn.push(g.anomaly);
    startLap(g);
  }
  assert.equal(new Set(drawn).size, ANOMALIES.length);
});

test("異常只在它所屬的站點顯示", () => {
  const g = createGame(ANOMALIES, mulberry32(8));
  walkTour(g);
  const a = ANOMALIES.find((x) => x.id === g.anomaly);
  for (let s = 0; s <= LAST_STATION; s++) {
    g.station = s;
    assert.equal(anomalyAt(g, ANOMALIES)?.id ?? null, s === a.station ? a.id : null);
  }
});

test("每個事件台詞都有字幕", () => {
  for (const id of ["vo_wrong_01", "vo_wrong_02", "vo_wrong_03", "vo_first_correct", "vo_half", "vo_ending"]) assert.ok(VOICE_TEXT[id], id);
});

test("異常率：10000 圈（扣第 1 圈）約 50%", () => {
  const g = createGame(ANOMALIES, mulberry32(9));
  walkTour(g);
  let n = 0;
  for (let i = 0; i < 10000; i++) { startLap(g); if (g.anomaly) n++; }
  assert.ok(n > 4800 && n < 5200, `實際 ${n}`);
});

// 人工檢查：10 組種子各印前 10 圈
if (process.argv.includes("--sample")) {
  for (let seed = 1; seed <= 10; seed++) {
    const g = createGame(ANOMALIES, mulberry32(seed));
    walkTour(g);
    const laps = [];
    for (let i = 0; i < 10; i++) { laps.push(g.anomaly ?? "--"); startLap(g); }
    console.log(`seed ${String(seed).padStart(2)}: ${laps.join(" ")}`);
  }
}
