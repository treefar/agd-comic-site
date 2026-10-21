// 《六樓出口》主角旁白與物件台詞：純函式，畫面層與測試共用
// 主角是剛入學的大一新生（使用者 2026-10-16 選）。每到一站跳旁白框；導覽圈每站只點 1 個必點物件，其他物件第 2 圈起變成可以點的彩蛋
import { STATIONS } from "./data.mjs";

export const SAY_MAX = 28;   // 主角一句話的字數上限：一眼讀完

// 這一站導覽圈要點的物件（資料裡標 must 的那一個）
export const mustIndex = (station) => STATIONS[station].spots.findIndex((p) => p.must);

// 到站旁白：導覽圈一句、循環圈一句；其他階段不出
export function narrFor(station, phase) {
  const n = STATIONS[station] && STATIONS[station].narr;
  if (!n) return null;
  if (phase === "tour") return n.tour;
  if (phase === "loop") return n.loop;
  return null;
}

// 畫面百分比座標點到哪個物件（彩蛋點擊用）；沒點到回 null
export function spotAt(station, x, y) {
  const spots = STATIONS[station].spots;
  const k = spots.findIndex((p) => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h);
  return k < 0 ? null : k;
}
