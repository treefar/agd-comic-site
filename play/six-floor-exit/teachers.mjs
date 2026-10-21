// 《六樓出口》老師關卡：純規則，畫面層與測試共用
// 老師依專長分散在各站（使用者 2026-10-16 選），循環圈才出現邀請；贏了小遊戲發簽名卡，集滿解鎖隱藏結局
// 卡面：card 留 null＝文字卡（mark 大字）；Codex 插圖 2026-10-16 被使用者退回（AI 感太重），有核准美術再填路徑
// 名字與肖像要本人同意：name 先留 null，畫面顯示 title（專長代稱）。同意後把本名填進 name，並加進 CONSENTED

export const CONSENTED = ["邱士展"];   // 已由使用者在對話確認本人同意的老師（2026-10-15）
export const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

export const TEACHERS = [
  { id: "book", mg: "mg-book", station: 4, title: "繪本老師", name: null, skill: "繪本與角色造型",
    invite: "電繪實驗室裡有人在畫角色……「要不要幫我的角色找配件？」",
    quote: "剪影一眼認得出來，角色就成功一半了。", mark: "繪本", card: null },
  { id: "type", mg: "mg-type", station: 5, title: "視傳老師", name: null, skill: "視覺傳達設計",
    invite: "海報櫥窗前有人在挑字型……「你覺得哪種字最有個性？」",
    quote: "字體也有個性，挑對字，訊息自己會說話。", mark: "視傳", card: null },
  { id: "anim", mg: "mg-anim", station: 6, title: "動畫老師", name: null, skill: "電腦動畫",
    invite: "D0646 的門開了一條縫……「來試試時間曲線，動畫的快慢都在這裡。」",
    quote: "緩入緩出，動作就有了重量。", mark: "動畫", card: null },
  { id: "3d", mg: "mg-3d", station: 3, title: "3D 老師", name: null, skill: "3D 角色與 3D 列印",
    invite: "牌樓下擺著一台 3D 印表機……「零件方向擺對，才印得出來喔。」",
    quote: "先想清楚軸向，3D 世界就不會跟你作對。", mark: "3D", card: null },
  { id: "code", mg: "mg-code", station: 7, title: "程式老師", name: null, skill: "Unity／程式",
    invite: "電梯廳的筆電還開著……「幫我把資料流接到 Goal 好嗎？」",
    quote: "先想好流程再動手，比事後抓蟲省時間。", mark: "程式", card: null },
];

export const displayName = (t) => t.name || t.title;

// 這位老師的小遊戲要載入哪些檔（相對 exit6/），3D 關卡先載 Three.js
export const scriptsFor = (t) => [...(t.mg === "mg-3d" ? [THREE_URL] : []), `minigames/${t.mg}/rules.js`, `minigames/${t.mg}/game.js`];

// 循環圈才出現老師邀請（導覽圈專心認路）
export const teacherAt = (station, phase) => (phase === "loop" ? TEACHERS.find((t) => t.station === station) || null : null);

// 收藏：存檔裡的 cards 陣列 [{ id, best }]；讀到壞資料就當沒有
export function createCards(saved) {
  const ok = Array.isArray(saved) ? saved.filter((c) => c && TEACHERS.some((t) => t.id === c.id)) : [];
  return { cards: ok.map((c) => ({ id: c.id, best: Number(c.best) || 0 })) };
}

export const allCollected = (st) => TEACHERS.every((t) => st.cards.some((c) => c.id === t.id));

// 只有贏才發卡；回傳 got（這次有拿到）、first（第一次拿到這張）、completed（這次剛好集滿）
export function award(st, id, result) {
  const t = TEACHERS.find((x) => x.id === id);
  if (!t || !result || !result.win) return { got: false, first: false, completed: false };
  const before = allCollected(st);
  const score = Number(result.score) || 0;
  const have = st.cards.find((c) => c.id === id);
  if (have) { have.best = Math.max(have.best, score); return { got: true, first: false, completed: false }; }
  st.cards.push({ id, best: score });
  return { got: true, first: true, completed: !before && allCollected(st) };
}
