// 《六樓出口》時間與光線：純函式，畫面層與測試共用
// 開局小時＝玩家裝置本地時間；之後每圈前進 stepFor(開局) 小時，保證第 4 圈前一定會進入晚上（時段線索碰得到）

export const NIGHT_BY_LAP = 4;     // 時段線索的保證：第 1～4 圈內至少有一圈是晚上
export const BRIGHT_FLOOR = 0.72;  // 亮度下限：再晚、樓層再高也看得清楚（趣味招生，不做到恐怖）

// 白天 06–16、黃昏 17–18、晚上 19–05
export function periodOf(hour) {
  const h = ((hour % 24) + 24) % 24;
  if (h >= 19 || h < 6) return "night";
  if (h >= 17) return "dusk";
  return "day";
}

// 每圈前進幾小時：晚上開局 +1；凌晨 0–5 開局時鐘停住（整局都是晚上）；其他時段跳快一點，第 4 圈前進入晚上
export function stepFor(start) {
  const h = ((start % 24) + 24) % 24;
  if (h < 6) return 0;
  if (h >= 19) return 1;
  return Math.ceil((19 - h) / NIGHT_BY_LAP);
}

// 第 lap 圈的遊戲時間（導覽圈 lap=0），回傳 0–23
export function hourAt(start, lap) {
  return (((start + stepFor(start) * lap) % 24) + 24) % 24;
}

export const PERIOD_LABEL = { day: "白天", dusk: "黃昏", night: "晚上" };

// 整張調色：filter 只調亮度／飽和／對比（不轉色相，紅色告示晚上仍是紅的），
// 時段色調用一層「相乘」疊色（tint）；亮度下限以疊色後的實際亮度計算
// 只做整張色階調整，不改畫面內容；正常圖與異常圖在同一時段套同一組值
const TINT = { day: null, dusk: { rgb: [255, 196, 140], a: 0.28 }, night: { rgb: [96, 128, 210], a: 0.34 } };
const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
export function gradeFor(hour, count = 0) {
  const p = periodOf(hour);
  const t = TINT[p];
  const tintFactor = t ? 1 - t.a * (1 - lum(t.rgb)) : 1;          // 相乘疊色讓平均亮度剩下的比例
  const base = { day: 1, dusk: 0.98, night: 0.95 }[p];
  const b = Math.max(BRIGHT_FLOOR / tintFactor, base - count * 0.025);
  const s = Math.max(0.6, ({ day: 1, dusk: 1.05, night: 0.85 }[p]) - count * 0.05);
  const parts = [`brightness(${b.toFixed(3)})`, `saturate(${s.toFixed(3)})`];
  if (count) parts.push(`contrast(${(1 + count * 0.025).toFixed(3)})`);
  const vig = Math.min(0.85, (p === "night" ? 0.6 : 0.5) + count * 0.04);
  const tint = t ? `rgba(${t.rgb.join(",")},${t.a})` : "transparent";
  return { period: p, filter: parts.join(" "), tint, vig, brightness: b * tintFactor };
}

export const fmtHour = (h) => `${String(h).padStart(2, "0")}:00`;
