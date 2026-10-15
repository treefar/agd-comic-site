// 《六樓出口》線索鏈與 D0647 密碼門：純資料與判定，不碰 DOM、不影響 6 圈主線
// 線索都是畫面上本來就有的東西（不新增圖），點了得到文字線索；只有路燈那條限晚上（time.mjs 保證第 4 圈前會到晚上）
import { periodOf } from "./time.mjs";

export const CODE = "6068";

// box：點擊範圍（%）；outline：outlines.mjs 的 key；digit：這條線索解出的那一碼（給測試核對）
export const CLUES = [
  { id: "c1", station: 1, box: { x: 3, y: 13, w: 24, h: 22 }, outline: "S1:0", digit: "6", night: false,
    label: "系名牆的公告", text: "系辦貼了張公告：「找邱士展老師的同學請注意，研究室密碼第 1 碼＝電梯廳牆上那個大數字。」" },
  { id: "c2", station: 5, box: { x: 0, y: 8, w: 13, h: 84 }, outline: "C:c2", digit: "0", night: false,
    label: "櫥窗邊的展覽說明", text: "展覽說明的角落有人用鉛筆寫著：「第 2 碼＝櫥窗裡最新那張海報年份的最後一位。」" },
  { id: "c3", station: 6, box: { x: 0, y: 40, w: 12, h: 22 }, outline: "C:c3", digit: "6", night: false,
    label: "開關旁的便條", text: "電燈開關旁貼著便條：「第 3 碼＝隔壁這位陳慶鴻老師門牌號碼的最後一位。」" },
  { id: "c4", station: 3, box: { x: 2, y: 38, w: 10, h: 20 }, outline: "C:c4", digit: "8", night: true,
    label: "牌樓旁的路燈", text: "晚上路燈亮了，燈座上浮出一行字：「第 4 碼＝六樓繞一圈總共有幾站。」" },
];

export function createClues() { return { found: [], opened: false }; }

// 線索只在循環圈出現；夜晚限定的線索只在晚上出現
export const visibleClues = (station, hour, phase) =>
  phase === "loop" ? CLUES.filter((c) => c.station === station && (!c.night || periodOf(hour) === "night")) : [];

export function collect(st, id) {
  if (!CLUES.some((c) => c.id === id) || st.found.includes(id)) return false;
  st.found.push(id); return true;
}

export const allFound = (st) => CLUES.every((c) => st.found.includes(c.id));

// 回傳 { ok, text }
export function tryCode(st, input) {
  const code = String(input).replace(/\D/g, "");
  if (!allFound(st)) return { ok: false, text: "線索還沒集齊，再到六樓各處找找。" };
  if (code.length !== CODE.length) return { ok: false, text: `密碼是 ${CODE.length} 個數字。` };
  if (code !== CODE) {
    const right = [...code].filter((d, i) => d === CODE[i]).length;
    return { ok: false, text: `門鎖嗶了一聲……${right ? `有 ${right} 碼的位置是對的。` : "一碼都不對，再看看手帳裡的線索。"}` };
  }
  st.opened = true;
  return { ok: true, text: "喀嚓——D0647 的門開了。" };
}
