// 《六樓出口》規則核心：純函式，不碰 DOM，瀏覽器與 node 測試共用
// 一圈 = 從 S0 走到 S7（終點）。任何一站「回頭」= 宣告這圈有異常；在終點「往前」= 宣告這圈正常。

export const GOAL = 6;           // 連續答對幾圈可以離開
export const LAST_STATION = 7;   // S0 電梯內 … S7 電梯廳（data.mjs 的 STATIONS 要剛好 8 站）
export const ANOMALY_RATE = 0.5; // 第 2 圈起，每圈有異常的機率

// 可重現的亂數（測試用固定種子）
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(anomalies, rng = Math.random) {
  return {
    phase: "tour",        // tour 導覽圈 → loop 循環 → ending 結局
    count: 0,             // 目前連續答對圈數（顯示成 0F～6F）
    lap: 0,               // 第幾圈（含導覽圈 0）
    station: 0,
    anomaly: null,        // 這圈的異常 id，null = 正常圈
    deck: [],             // 尚未出過的異常（出完才重洗，不重複）
    seen: [],             // 已收進圖鑑的異常 id
    falseAlarms: 0,       // 沒異常卻回頭的次數（決定系主任台詞）
    firstCorrectBack: false,
    halfPlayed: false,
    ids: anomalies.map((x) => x.id),
    rng,
  };
}

function drawAnomaly(s) {
  if (s.deck.length === 0) s.deck = shuffle(s.ids, s.rng);
  return s.deck.pop();
}

// 開新的一圈：第 1 圈固定有異常，讓新手馬上學會回頭
export function startLap(s) {
  s.lap += 1;
  s.station = 0;
  const forced = s.lap === 1;
  s.anomaly = forced || s.rng() < ANOMALY_RATE ? drawAnomaly(s) : null;
  return s;
}

function judge(s, claimedAnomaly) {
  const hadAnomaly = s.anomaly !== null;
  const ok = claimedAnomaly === hadAnomaly;
  const ev = { type: ok ? "correct" : "wrong", anomaly: s.anomaly, voice: null };

  if (ok) {
    s.count += 1;
    if (hadAnomaly && !s.seen.includes(s.anomaly)) s.seen.push(s.anomaly);
    if (claimedAnomaly && !s.firstCorrectBack) { s.firstCorrectBack = true; ev.voice = "vo_first_correct"; }
    if (s.count === 3 && !s.halfPlayed && !ev.voice) { s.halfPlayed = true; ev.voice = "vo_half"; }
    if (s.count >= GOAL) { s.phase = "ending"; ev.type = "ending"; ev.voice = "vo_ending"; }
  } else {
    s.count = 0;
    ev.reason = hadAnomaly ? "missed" : "false-alarm";
    if (!hadAnomaly) {
      s.falseAlarms += 1;
      ev.voice = ["vo_wrong_01", "vo_wrong_02", "vo_wrong_03"][Math.min(s.falseAlarms, 3) - 1];
    }
    // 錯過的異常也收進圖鑑：答錯一樣學到東西
    if (hadAnomaly && !s.seen.includes(s.anomaly)) s.seen.push(s.anomaly);
  }
  ev.count = s.count;
  if (s.phase !== "ending") startLap(s);
  return ev;
}

// action: "forward" 往前 | "back" 回頭。回傳事件給畫面層演出
export function step(s, action) {
  if (s.phase === "ending") return { type: "noop" };

  if (s.phase === "tour") {
    if (action === "back") return { type: "tour-hint" };
    if (s.station < LAST_STATION) { s.station += 1; return { type: "move" }; }
    s.phase = "loop";
    startLap(s);
    return { type: "tour-done", count: s.count };
  }

  if (action === "back") return judge(s, true);
  if (s.station < LAST_STATION) { s.station += 1; return { type: "move" }; }
  return judge(s, false);
}

// 目前這一站該顯示哪個異常（不在這站就回 null）
export function anomalyAt(s, anomalies) {
  if (!s.anomaly) return null;
  const a = anomalies.find((x) => x.id === s.anomaly);
  return a && a.station === s.station ? a : null;
}
