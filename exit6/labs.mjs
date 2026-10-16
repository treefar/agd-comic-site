// 《六樓出口》實驗室支線：純規則，畫面層與測試共用
// 使用者 2026-10-16 選：六樓 5 間、走廊門口進（循環圈才出現）、系網照片轉漫畫當實驗室畫面、星等三條件各一顆、成就牆
// 站點是暫定（走廊實景看不到多數實驗室的門），使用者可依實際位置調整；第 6 站留給 D0647 岔路

export const LABS = [
  { id: "d0633", code: "D0633", name: "體感互動實驗室", station: 2, mg: "lab-d0633", bg: "frames/lab_d0633.webp", button: "left",
    intro: "天橋另一頭是體感互動實驗室，VR 跑步機和體感平台擺成一排。",
    say: "戴上頭盔，腳下的跑步機就是一整座城市。" },
  { id: "d0628", code: "D0628", name: "3D 列印工作坊", station: 3, mg: "lab-d0628", bg: "frames/lab_d0628.webp", button: "left",
    intro: "牌樓旁邊的 3D 列印工作坊，印表機正嗡嗡地一層一層往上疊。",
    say: "原來模型是這樣一層一層長出來的。" },
  { id: "d0604", code: "D0604", name: "電繪實驗室", station: 4, mg: "lab-d0604", bg: "frames/lab_d0604.webp", button: "left",
    intro: "電繪實驗室裡一整排繪圖螢幕，筆一碰上去線就出來了。",
    say: "在繪圖板上畫線，手感跟紙完全不一樣。" },
  { id: "d0637", code: "D0637", name: "偶動畫實驗室", station: 5, mg: "lab-d0637", bg: "frames/lab_d0637.webp", button: "left",
    intro: "偶動畫實驗室裡，手機架在支架上，對著桌上的小恐龍一格一格拍。",
    say: "每拍一張就把恐龍挪一點點，難怪要那麼有耐心。" },
  { id: "d0631", code: "D0631", name: "動作捕捉實驗室", station: 7, mg: "lab-d0631", bg: "frames/lab_d0631.webp", button: "left",
    intro: "動作捕捉實驗室其實是虛擬製片棚，整片綠幕和一排攝影機。",
    say: "演員在綠幕前演，螢幕上馬上就是另一個世界。" },
];

export const MAX_STARS = LABS.length * 3;
export const labAt = (station, phase) => (phase === "loop" ? LABS.find((l) => l.station === station) || null : null);

// 星等：沒過關 0 星；過關 1 星；分數達 score2 加 1；flawless 加 1
export function starsFor(result, stars) {
  if (!result || !result.win) return 0;
  let n = 1;
  if (stars && Number.isFinite(stars.score2) && Number(result.score) >= stars.score2) n++;
  if (result.flawless === true) n++;
  return n;
}

// 稱號（依總星數）與獎勵（使用者 2026-10-15 選的作品展示、招生分享卡）
export const TITLES = [
  { at: 1, name: "實驗室訪客" },
  { at: 5, name: "六樓實習生" },
  { at: 10, name: "實驗室常客" },
  { at: 15, name: "六樓通" },
];
export const REWARDS = [
  { id: "works", at: 6, name: "解鎖：學長姐作品展示" },
  { id: "share", at: 12, name: "解鎖：招生分享卡" },
];
export const titleFor = (total) => [...TITLES].reverse().find((t) => total >= t.at) || null;
export const unlocked = (total) => REWARDS.filter((r) => total >= r.at);

// 成就存檔：{ labs: { d0604: { stars, best } } }；讀到壞資料就當沒有，星數夾在 0～3
export function createAchv(saved) {
  const labs = {};
  const src = saved && typeof saved === "object" && saved.labs && typeof saved.labs === "object" ? saved.labs : {};
  for (const l of LABS) {
    const v = src[l.id];
    if (v && typeof v === "object") labs[l.id] = { stars: Math.max(0, Math.min(3, Number(v.stars) || 0)), best: Number(v.best) || 0 };
  }
  return { labs };
}
export const totalStars = (st) => Object.values(st.labs).reduce((s, v) => s + v.stars, 0);

// 記一局：只在星數變多時算進步；最高分另外記；回報這次新解鎖的稱號與獎勵
export function record(st, id, stars, score) {
  if (!LABS.some((l) => l.id === id)) return { improved: false, newTitles: [], newRewards: [] };
  const before = totalStars(st);
  const cur = st.labs[id] || { stars: 0, best: 0 };
  const improved = stars > cur.stars;
  st.labs[id] = { stars: Math.max(cur.stars, Math.min(3, stars)), best: Math.max(cur.best, Number(score) || 0) };
  const after = totalStars(st);
  return {
    improved,
    newTitles: TITLES.filter((t) => before < t.at && after >= t.at),
    newRewards: REWARDS.filter((r) => before < r.at && after >= r.at),
  };
}
