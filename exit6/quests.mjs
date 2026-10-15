// 《六樓出口》六樓尋址任務：純資料與判定，不碰 DOM、不影響 6 圈主線
// 導覽圈在系辦領 3 件待送物，依「用途描述」推理該送到哪一站；送錯只給說明、不扣分

export const ITEMS = [
  { id: "tablet", name: "繪圖板教學講義", hint: "要送到「能練 2D 角色、場景和 UI 的教室」。", to: "lab" },
  { id: "motion", name: "動態圖像設計作業", hint: "要交給「教動態圖像設計的老師」。", to: "office" },
  { id: "poster", name: "作品海報", hint: "要貼到「展示系上作品的地方」。", to: "window" },
];

// 交付點：station＝站點索引；box＝畫面百分比（不可和同站異常點擊範圍重疊，有測試）
// wrong＝送錯時的說明（順便教玩家這裡是哪裡）
export const TARGETS = [
  { id: "office1", station: 1, box: { x: 41, y: 50, w: 11, h: 20 }, label: "系辦",
    wrong: "這裡是系辦：選課、各種申請、找人問事情都先來這裡。不過這件東西不是要交給系辦的。" },
  { id: "lab", station: 4, box: { x: 36, y: 44, w: 20, h: 22 }, label: "D0604",
    wrong: "這裡是 D0604 電繪實驗室，是繪圖板教室。這件東西不是要送來這裡的。" },
  { id: "window", station: 5, box: { x: 70, y: 12, w: 22, h: 40 }, label: "櫥窗",
    wrong: "這裡是作品海報櫥窗，展示系上作品。這件東西不是要貼在這裡的。" },
  { id: "office", station: 6, box: { x: 33, y: 18, w: 24, h: 30 }, label: "D0646",
    wrong: "這裡是 D0646 陳慶鴻老師研究室，他教動態圖像設計。這件東西不是要交給他的。" },
];

export const STAMP_POSTMAN = { id: "postman", name: "六樓郵差", text: "3 件委託都送對了。系辦、實驗室、櫥窗、研究室，你都知道在哪。" };

export function createQuests() {
  return { taken: false, delivered: [], stamps: [] };
}

export function takeItems(qs) {
  qs.taken = true;
  return ITEMS.map((i) => i.id);
}

export const pending = (qs) => (qs.taken ? ITEMS.filter((i) => !qs.delivered.includes(i.id)) : []);

// 回傳 { ok, text, stamp? }
export function deliver(qs, itemId, targetId) {
  const item = ITEMS.find((i) => i.id === itemId);
  const target = TARGETS.find((t) => t.id === targetId);
  if (!item || !target) return { ok: false, text: "找不到這件東西或這個地方。" };
  if (!qs.taken || qs.delivered.includes(itemId)) return { ok: false, text: "這件東西不在你身上。" };
  if (item.to !== targetId) return { ok: false, text: target.wrong };
  qs.delivered.push(itemId);
  const res = { ok: true, text: `「${item.name}」送到了！` };
  if (qs.delivered.length === ITEMS.length && !qs.stamps.includes(STAMP_POSTMAN.id)) {
    qs.stamps.push(STAMP_POSTMAN.id);
    res.stamp = STAMP_POSTMAN;
  }
  return res;
}

export const targetsAt = (station) => TARGETS.filter((t) => t.station === station);
