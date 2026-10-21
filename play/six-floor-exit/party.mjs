// 《六樓出口》隱藏彩蛋「殺青派對」：同一台裝置 2～4 人輪流玩，純規則，畫面層與測試共用
// 使用者 2026-10-16 選：同一台輪流比分、藏在 D0647、重組現有小遊戲短版、冠軍畫面＋分享卡
// 每輪大家玩同一款、同一個亂數種子（關卡一樣才公平）；各款分數尺度差很多，所以只比同輪名次、發名次積分，不把原始分數相加

export const PARTY_SECONDS = 20;
export const PARTY_ROUNDS = 3;
export const MIN_PLAYERS = 2, MAX_PLAYERS = 4, NAME_MAX = 8;
export const PLACE_POINTS = [3, 2, 1, 0];

// 遊戲池：排除 mg-3d（要連網載 three.js，攤位沒網路會卡）與 lab-d0637（三輪發牌，20 秒玩不出東西）
export const PARTY_POOL = [
  { mg: "mg-anim", title: "動畫跑酷：緩入緩出" },
  { mg: "mg-book", title: "繪本角色往上爬" },
  { mg: "mg-code", title: "程式接水管" },
  { mg: "mg-type", title: "字型大亂鬥" },
  { mg: "lab-d0604", title: "繪圖板描線救援" },
  { mg: "lab-d0628", title: "3D 逐層列印" },
  { mg: "lab-d0631", title: "虛擬製片靶場" },
  { mg: "lab-d0633", title: "VR 跑步機衝刺" },
];

export function cleanNames(raw, count) {
  const n = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, Number(count) || MIN_PLAYERS));
  return Array.from({ length: n }, (_, i) => {
    const s = String((raw && raw[i]) || "").replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
    return s || `玩家 ${i + 1}`;
  });
}

// rng：回傳 0～1 的函式；抽 rounds 款不重複的遊戲，每輪一個整數種子
export function createParty(names, rng = Math.random, rounds = PARTY_ROUNDS) {
  const players = cleanNames(names, names ? names.length : MIN_PLAYERS);
  const pool = PARTY_POOL.map((g) => g.mg);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const n = Math.max(1, Math.min(rounds, pool.length));
  return {
    players,
    games: pool.slice(0, n),
    seeds: Array.from({ length: n }, () => Math.floor(rng() * 2 ** 31)),
    results: Array.from({ length: n }, () => players.map(() => null)),
    round: 0, turn: 0,
  };
}

export const isDone = (p) => p.round >= p.games.length;
export const gameInfo = (mg) => PARTY_POOL.find((g) => g.mg === mg) || { mg, title: mg };

// 現在輪到誰、玩哪一款；全部玩完回傳 null
export function current(p) {
  if (isDone(p)) return null;
  return { round: p.round, turn: p.turn, player: p.players[p.turn], mg: p.games[p.round], seed: p.seeds[p.round] };
}

// 記一次成績並前進；回報這次是否剛好結束一輪、整場是否結束
export function submit(p, r) {
  if (isDone(p)) return { roundDone: false, done: true };
  const score = Math.max(0, Math.round(Number(r && r.score) || 0));
  p.results[p.round][p.turn] = { score, win: !!(r && r.win) };
  p.turn++;
  let roundDone = false;
  if (p.turn >= p.players.length) { p.turn = 0; p.round++; roundDone = true; }
  return { roundDone, done: isDone(p) };
}

// 同輪名次：分數高的在前，同分同名次、拿同樣積分
export function roundRanking(p, round) {
  const rows = p.players.map((name, i) => ({ i, name, score: (p.results[round][i] || { score: 0 }).score }));
  const sorted = [...rows].sort((a, b) => b.score - a.score || a.i - b.i);
  return sorted.map((r) => {
    const place = sorted.findIndex((x) => x.score === r.score) + 1;
    return { ...r, place, points: PLACE_POINTS[place - 1] ?? 0 };
  });
}

// 總排名：積分高的在前；同分比拿過幾次第一；再同分就並列
export function standings(p) {
  const played = Math.min(p.round, p.games.length);
  const tot = p.players.map((name, i) => ({ i, name, points: 0, firsts: 0 }));
  for (let r = 0; r < played; r++) for (const row of roundRanking(p, r)) { tot[row.i].points += row.points; if (row.place === 1) tot[row.i].firsts++; }
  const key = (t) => t.points * 100 + t.firsts;
  const sorted = [...tot].sort((a, b) => key(b) - key(a) || a.i - b.i);
  return sorted.map((t) => ({ ...t, place: sorted.findIndex((x) => key(x) === key(t)) + 1 }));
}
export const champions = (p) => standings(p).filter((t) => t.place === 1);

export function partyShareText(p, url = "https://www.dgd.stu.edu.tw/") {
  const champ = champions(p).map((t) => t.name).join("、");
  return `我們在《六樓出口》的隱藏彩蛋「殺青派對」玩了 ${p.games.length} 輪，冠軍是 ${champ}！樹德科大動畫與遊戲設計系的六樓，等你來找：${url}`;
}
