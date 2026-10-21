// 從實驗室實景圖算「可走區」碰撞資料（不是美術）：
//   1. 以種子點周圍的中位色為路面色，在限制多邊形內洪水填色（桌面、地板、拍攝板）
//   2. 下採樣成 4px 一格，算到牆的距離，輸出兩種寬容度的可走位元圖
//   3. 起點＝最左側可走欄的中心，終點＝最右側；並驗證兩種寬容度下起點都走得到終點
// 用法：node tools/scene-masks.mjs <分析用 PNG 資料夾>   （PNG 由 ffmpeg 從 art/scene/*.webp 轉出）
import fs from "node:fs";
import path from "node:path";
import { decodePNG } from "./png.mjs";

const here = path.resolve(import.meta.dirname, "..");
const srcDir = process.argv[2] || "C:/agywork/cl-src";
const cfg = JSON.parse(fs.readFileSync(path.join(here, "tools", "scene-seeds.json"), "utf8"));
const CELL = 4, out = {}, failed = [];

function inPoly(x, y, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

for (const [name, c] of Object.entries(cfg)) {
  const img = decodePNG(fs.readFileSync(path.join(srcDir, name + ".png"))), { w, h, px } = img;
  // 路面色＝種子 15x15 範圍的中位數（避開網點）
  const sample = [[], [], []];
  for (let dy = -7; dy <= 7; dy++) for (let dx = -7; dx <= 7; dx++) { const i = ((c.seed[1] + dy) * w + c.seed[0] + dx) * 4; for (let k = 0; k < 3; k++) sample[k].push(px[i + k]); }
  const ref = sample.map((a) => a.sort((p, q) => p - q)[a.length >> 1]);
  const tol = c.tol ?? 40;
  // 先模糊比對：每 4x4 格取平均色（抹掉網點），再判斷是否接近路面色
  const GW = Math.ceil(w / CELL), GH = Math.ceil(h / CELL), avg = new Float32Array(GW * GH * 3);
  for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = gy * CELL; y < Math.min(h, (gy + 1) * CELL); y++) for (let x = gx * CELL; x < Math.min(w, (gx + 1) * CELL); x++) { const i = (y * w + x) * 4; r += px[i]; g += px[i + 1]; b += px[i + 2]; n++; }
    avg.set([r / n, g / n, b / n], (gy * GW + gx) * 3);
  }
  const like = (gx, gy) => { const i = (gy * GW + gx) * 3; return Math.hypot(avg[i] - ref[0], avg[i + 1] - ref[1], avg[i + 2] - ref[2]) < tol && (!c.clip || inPoly(gx * CELL + 2, gy * CELL + 2, c.clip)); };
  const grid = new Uint8Array(GW * GH), st = [[Math.floor(c.seed[0] / CELL), Math.floor(c.seed[1] / CELL)]];
  while (st.length) { const [x, y] = st.pop(); if (x < 0 || y < 0 || x >= GW || y >= GH || grid[y * GW + x] || !like(x, y)) continue; grid[y * GW + x] = 1; st.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
  // 補小洞（網點、細線造成的 1 格破洞）：上下左右至少 3 格是路面就補
  for (let pass = 0; pass < 2; pass++) for (let y = 1; y < GH - 1; y++) for (let x = 1; x < GW - 1; x++) { const i = y * GW + x; if (!grid[i] && grid[i - 1] + grid[i + 1] + grid[i - GW] + grid[i + GW] >= 3 && (!c.clip || inPoly(x * CELL + 2, y * CELL + 2, c.clip))) grid[i] = 1; }
  // 到牆距離（格）
  const d = new Float32Array(GW * GH); for (let i = 0; i < d.length; i++) d[i] = grid[i] ? 1e9 : 0;
  const at = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : d[y * GW + x]);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (d[y * GW + x]) d[y * GW + x] = Math.min(d[y * GW + x], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414);
  for (let y = GH - 1; y >= 0; y--) for (let x = GW - 1; x >= 0; x--) if (d[y * GW + x]) d[y * GW + x] = Math.min(d[y * GW + x], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414);
  const ok = (gx, gy, rpx) => gx >= 0 && gy >= 0 && gx < GW && gy < GH && grid[gy * GW + gx] && d[gy * GW + gx] >= rpx / CELL;
  const bits = (rpx) => { const b = Buffer.alloc(Math.ceil(GW * GH / 8)); for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (ok(x, y, rpx)) b[(y * GW + x) >> 3] |= 1 << ((y * GW + x) & 7); return b.toString("base64"); };
  // 起點／終點：在最嚴格寬容度（r=14px）下最左、最右的可走欄中心
  const R0 = 14, colCenter = (gx) => { const ys = []; for (let gy = 0; gy < GH; gy++) if (ok(gx, gy, R0)) ys.push(gy); return ys.length ? [gx, ys[ys.length >> 1]] : null; };
  let s = null, e = null;
  for (let gx = 0; gx < GW && !s; gx++) { const p = colCenter(gx); if (p) s = [p[0] + 3, p[1]]; }
  for (let gx = GW - 1; gx >= 0 && !e; gx--) { const p = colCenter(gx); if (p) e = [p[0] - 3, p[1]]; }
  if (c.start) s = c.start.map((v) => Math.round(v / CELL)); if (c.end) e = c.end.map((v) => Math.round(v / CELL));
  const errs = [];
  for (const rpx of [14, 10]) {
    const seen = new Uint8Array(GW * GH), q = [s]; let reach = false; seen[s[1] * GW + s[0]] = 1;
    if (!ok(s[0], s[1], rpx)) { errs.push(`起點不在可走區（r=${rpx}）`); continue; }
    while (q.length && !reach) { const [x, y] = q.shift(); if (Math.hypot(x - e[0], y - e[1]) < 9) reach = true;
      for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + ax, ny = y + ay; if (ok(nx, ny, rpx) && !seen[ny * GW + nx]) { seen[ny * GW + nx] = 1; q.push([nx, ny]); } } }
    if (!reach) errs.push(`r=${rpx}px 時起點走不到終點`);
  }
  if (errs.length) { failed.push(`${name}：${errs.join("；")}`); }
  out[name] = { w: GW, h: GH, cell: CELL, normal: bits(14), coarse: bits(10), start: [s[0] * CELL + 2, s[1] * CELL + 2], end: [e[0] * CELL + 2, e[1] * CELL + 2], ref };
  // 文字小地圖：每 2x2 格一字，# 可走、. 不可走、S 起點、E 終點（對照原圖檢查有沒有漏到牆上）
  const rows = [];
  for (let y = 0; y < GH; y += 5) { let r = ""; for (let x = 0; x < GW; x += 4) { const S = Math.abs(x - s[0]) < 3 && Math.abs(y - s[1]) < 3, E = Math.abs(x - e[0]) < 3 && Math.abs(y - e[1]) < 3; r += S ? "S" : E ? "E" : ok(x, y, 14) ? "#" : "."; } rows.push(r); }
  console.log(`\n${name} 路面色=${ref} 可走格=${grid.reduce((a, b) => a + b, 0)}/${GW * GH} 起點=${out[name].start} 終點=${out[name].end}\n` + rows.join("\n"));
}
if (failed.length) { console.error("\n連通檢查失敗，未寫出 masks.js：\n" + failed.join("\n")); process.exit(1); }
fs.writeFileSync(path.join(here, "masks.js"), "// 由 tools/scene-masks.mjs 從實驗室實景圖的桌面／地板算出（可走區碰撞資料，不是美術）\nwindow.MASKS = " + JSON.stringify(out) + ";\n");
