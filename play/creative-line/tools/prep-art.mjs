// 後製工具（只處理核准生圖的輸出：去背、裁切、縮圖、由路線圖計算碰撞資料；不繪製任何新圖形）
// 用法：node tools/prep-art.mjs        （在 play/creative-line 底下執行）
// 輸入：art/route{1,2,3}.png、art/ui_sheet.png、art/fx_sheet.png、art/cover.png、art/card_*.png
// 輸出：art/ui/*.png、art/fx/*.png（洋紅底去背後依序切開）、masks.js（碰撞用的可走區遮罩，來自路線圖的米色路面）、art/web/*（縮圖版）
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const here = path.resolve(import.meta.dirname, "..");
const art = (p) => path.join(here, "art", p);

/* ---------- 最小 PNG 編解碼（8 bit、RGB 或 RGBA、非交錯） ---------- */
function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, ct = 0, depth = 0; const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), type = buf.toString("ascii", pos + 4, pos + 8), data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ct = data[9]; if (data[12] !== 0) throw new Error("不支援交錯 PNG"); }
    if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  if (depth !== 8 || (ct !== 2 && ct !== 6)) throw new Error(`不支援的 PNG 格式 depth=${depth} colorType=${ct}`);
  const ch = ct === 6 ? 4 : 3, stride = w * ch, raw = zlib.inflateSync(Buffer.concat(idat)), out = Buffer.alloc(w * h * 4);
  const prev = Buffer.alloc(stride), cur = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0; let v = line[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 255;
    }
    for (let x = 0; x < w; x++) { out[(y * w + x) * 4] = cur[x * ch]; out[(y * w + x) * 4 + 1] = cur[x * ch + 1]; out[(y * w + x) * 4 + 2] = cur[x * ch + 2]; out[(y * w + x) * 4 + 3] = ch === 4 ? cur[x * ch + 3] : 255; }
    cur.copy(prev);
  }
  return { w, h, px: out };
}
function encodePNG({ w, h, px }) {
  const stride = w * 4, raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const chunk = (t, d) => { const b = Buffer.alloc(12 + d.length); b.writeUInt32BE(d.length, 0); b.write(t, 4, "ascii"); d.copy(b, 8); b.writeUInt32BE(zlib.crc32(b.subarray(4, 8 + d.length)) >>> 0, 8 + d.length); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
const read = (f) => decodePNG(fs.readFileSync(art(f)));
const write = (f, img) => { fs.mkdirSync(path.dirname(art(f)), { recursive: true }); fs.writeFileSync(art(f), encodePNG(img)); };

/* ---------- 洋紅底去背＋連通區域切片 ---------- */
function keyMagenta(img) {
  const p = img.px;
  for (let i = 0; i < p.length; i += 4) {
    const dist = Math.hypot(255 - p[i], p[i + 1], 255 - p[i + 2]);
    const a = Math.max(0, Math.min(1, (dist - 70) / 90));
    if (a > 0 && a < 1) { p[i] = Math.min(p[i], 235); p[i + 2] = Math.min(p[i + 2], 235); } // 邊緣去洋紅溢色
    p[i + 3] = Math.round(p[i + 3] * a);
  }
}
function components(img, count, rad = 2) {
  const { w, h, px } = img, cell = 6, gw = Math.ceil(w / cell), gh = Math.ceil(h / cell), on = new Uint8Array(gw * gh);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 100) on[((y / cell) | 0) * gw + ((x / cell) | 0)] = 1;
  const dil = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) if (on[y * gw + x])
    for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < gh && xx >= 0 && xx < gw) dil[yy * gw + xx] = 1; }
  const seen = new Uint8Array(gw * gh), boxes = [];
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    if (!dil[y * gw + x] || seen[y * gw + x]) continue;
    let x0 = x, x1 = x, y0 = y, y1 = y, n = 0; const st = [[x, y]]; seen[y * gw + x] = 1;
    while (st.length) { const [cx, cy] = st.pop(); n++; x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy);
      for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + ax, ny = cy + ay; if (nx >= 0 && nx < gw && ny >= 0 && ny < gh && dil[ny * gw + nx] && !seen[ny * gw + nx]) { seen[ny * gw + nx] = 1; st.push([nx, ny]); } } }
    if (n > 30) boxes.push({ x: Math.max(0, (x0 - 2) * cell), y: Math.max(0, (y0 - 2) * cell), w: Math.min(w, (x1 + 3) * cell) - Math.max(0, (x0 - 2) * cell), h: Math.min(h, (y1 + 3) * cell) - Math.max(0, (y0 - 2) * cell), n });
  }
  return boxes.sort((a, b) => b.n - a.n).slice(0, count);
}
function orderRows(boxes, rows) {
  const s = [...boxes].sort((a, b) => a.y + a.h / 2 - (b.y + b.h / 2)), per = Math.ceil(s.length / rows), out = [];
  for (let r = 0; r < rows; r++) out.push(...s.slice(r * per, (r + 1) * per).sort((a, b) => a.x - b.x));
  return out;
}
function crop(img, b, maxSide) {
  // 先在方框內找不透明像素的緊貼範圍，再裁出來
  let x0 = b.w, y0 = b.h, x1 = 0, y1 = 0;
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) if (img.px[((b.y + y) * img.w + b.x + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  b = { x: b.x + x0, y: b.y + y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  const out = Buffer.alloc(b.w * b.h * 4);
  for (let y = 0; y < b.h; y++) img.px.copy(out, y * b.w * 4, ((b.y + y) * img.w + b.x) * 4, ((b.y + y) * img.w + b.x + b.w) * 4);
  let r = { w: b.w, h: b.h, px: out };
  const k = Math.min(1, maxSide / Math.max(b.w, b.h));
  return k < 1 ? scale(r, Math.round(b.w * k), Math.round(b.h * k)) : r;
}
function scale(img, nw, nh) { // 面積平均縮圖
  const out = Buffer.alloc(nw * nh * 4);
  for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
    const x0 = Math.floor(x * img.w / nw), x1 = Math.max(x0 + 1, Math.floor((x + 1) * img.w / nw)), y0 = Math.floor(y * img.h / nh), y1 = Math.max(y0 + 1, Math.floor((y + 1) * img.h / nh));
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) { const i = (yy * img.w + xx) * 4, al = img.px[i + 3]; r += img.px[i] * al; g += img.px[i + 1] * al; b += img.px[i + 2] * al; a += al; n++; }
    const o = (y * nw + x) * 4; out[o] = a ? r / a : 0; out[o + 1] = a ? g / a : 0; out[o + 2] = a ? b / a : 0; out[o + 3] = n ? a / n : 0;
  }
  return { w: nw, h: nh, px: out };
}

/* ---------- 1) 圖集切片 ---------- */
const only = process.argv.slice(2);
const want = (k) => !only.length || only.includes(k);
if (want("sheets")) {
  for (const [sheet, names, rows, dir, side] of [
    ["ui_sheet.png", ["btnPrimary", "btnSecondary", "btnPause", "btnSound", "btnMute", "btnBack", "panelCard", "panelResult"], 2, "ui", 640],
    ["fx_sheet.png", ["orb", "spark", "confetti", "stamp", "gate"], 1, "fx", 320],
  ]) {
    const img = read(sheet); keyMagenta(img);
    const boxes = components(img, names.length, dir === "fx" ? 4 : 2);
    if (boxes.length !== names.length) throw new Error(`${sheet} 只找到 ${boxes.length}/${names.length} 件，請檢查或重生`);
    orderRows(boxes, rows).forEach((b, i) => { write(`${dir}/${names[i]}.png`, crop(img, b, side)); console.log(`${dir}/${names[i]}.png`, b.w + "x" + b.h); });
  }
}

/* ---------- 2) 縮圖版（網頁載入用）：路線與封面縮成 600x900，課程卡 320 ---------- */
if (want("web")) {
  for (const n of ["route1", "route2", "route3", "cover"]) { if (fs.existsSync(art(n + ".png"))) { const i = read(n + ".png"); write(`web/${n}.png`, scale(i, 600, 900)); } }
  for (const n of ["card_anim", "card_code"]) { if (fs.existsSync(art(n + ".png"))) { const i = read(n + ".png"); write(`web/${n}.png`, scale(i, 320, 320)); } }
}

/* ---------- 3) 碰撞遮罩：從路線圖的米色路面（由起點洪水填色）算出可走區 ---------- */
if (want("masks")) {
  const GW = 300, GH = 450, cfg = JSON.parse(fs.readFileSync(path.join(here, "tools", "mask-seeds.json"), "utf8"));
  const result = {};
  for (const [name, c] of Object.entries(cfg)) {
    const img = read(name + ".png"), { w, h, px } = img, k = w / 600; // 圖座標 = 邏輯座標 * k
    const tol = c.tol ?? 22; // 路面有光暈的圖要放寬
    const isLane = (i) => Math.abs(px[i] - 244) < tol && Math.abs(px[i + 1] - 236) < tol && Math.abs(px[i + 2] - 216) < tol + 4;
    const mask = new Uint8Array(w * h), st = [[Math.round(c.seed[0] * k), Math.round(c.seed[1] * k)]];
    while (st.length) { const [x, y] = st.pop(); if (x < 0 || y < 0 || x >= w || y >= h) continue; const j = y * w + x; if (mask[j] || !isLane(j * 4)) continue; mask[j] = 1; st.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    // 下採樣到 GW x GH（格內多數為路面才算路面）
    const grid = new Uint8Array(GW * GH);
    for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
      let s = 0, n = 0; const x0 = Math.floor(gx * w / GW), x1 = Math.floor((gx + 1) * w / GW), y0 = Math.floor(gy * h / GH), y1 = Math.floor((gy + 1) * h / GH);
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { s += mask[y * w + x]; n++; }
      grid[gy * GW + gx] = s * 2 > n ? 1 : 0;
    }
    // 到牆的距離（格）：兩趟 chamfer；圖外視為牆，所以起點在圖底邊的光點不會被誤判
    const INF = 1e9, d = new Float32Array(GW * GH);
    for (let i = 0; i < d.length; i++) d[i] = grid[i] ? INF : 0;
    const at = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : d[y * GW + x]);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { if (!d[y * GW + x]) continue; d[y * GW + x] = Math.min(d[y * GW + x], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414); }
    for (let y = GH - 1; y >= 0; y--) for (let x = GW - 1; x >= 0; x--) { if (!d[y * GW + x]) continue; d[y * GW + x] = Math.min(d[y * GW + x], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414); }
    // 每格 = 2 邏輯像素；允許條件：到牆距離 ≥ 光點半徑。normal 用 r=10px，coarse（手機）用 r=6px。
    // 圖外視為牆會讓貼著圖邊的起點不可走，所以起點附近的邊界格另外放行（只允許起點圓內）
    const bits = (rpx) => { const need = rpx / 2, b = Buffer.alloc(Math.ceil(GW * GH / 8)); for (let i = 0; i < GW * GH; i++) if (grid[i] && d[i] >= need) b[i >> 3] |= 1 << (i & 7); return b.toString("base64"); };
    // 起點、終點：路面最底與最頂的列中心（邏輯座標）
    // 起點：離圖底 40 邏輯像素那一列，取最寬那段路面的中心；終點：最上方有路面的列再往下 14 邏輯像素那列的中心
    const rowRuns = (gy) => { const runs = []; let s = -1; for (let gx = 0; gx <= GW; gx++) { const v = gx < GW && grid[gy * GW + gx]; if (v && s < 0) s = gx; if (!v && s >= 0) { runs.push([s, gx - 1]); s = -1; } } return runs.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0])); };
    const center = (gy) => { const r = rowRuns(gy)[0]; return r ? [Math.round((r[0] + r[1]) / 2 * 2), gy * 2] : null; };
    let bottom = center(GH - 20), top = null;
    for (let gy = 0; gy < GH && !top; gy++) if (rowRuns(gy).length) top = center(Math.min(GH - 1, gy + 7));
    result[name] = { w: GW, h: GH, cell: 2, normal: bits(10), coarse: bits(6), start: c.start ?? bottom, end: c.end ?? top, laneCells: grid.reduce((a, b) => a + b, 0) };
    // 驗證：兩種寬容度下，起點都要走得到終點（終點半徑 36 內任一格即可）
    for (const rpx of [10, 6]) {
      const ok = (gx, gy) => gx >= 0 && gy >= 0 && gx < GW && gy < GH && grid[gy * GW + gx] && d[gy * GW + gx] >= rpx / 2;
      const s = result[name].start.map((v) => Math.round(v / 2)), e = result[name].end.map((v) => v / 2), seen = new Uint8Array(GW * GH), q = [s];
      let reach = false; seen[s[1] * GW + s[0]] = 1;
      while (q.length && !reach) { const [x, y] = q.shift(); if (Math.hypot(x - e[0], y - e[1]) < 18) reach = true;
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + ax, ny = y + ay; if (ok(nx, ny) && !seen[ny * GW + nx]) { seen[ny * GW + nx] = 1; q.push([nx, ny]); } } }
      if (!reach) throw new Error(`${name}：半徑 ${rpx}px 時起點走不到終點，請調 mask-seeds.json 的 tol 或重生路線圖`);
    }
    console.log(name, "路面格數", result[name].laneCells, "起點", result[name].start, "終點", result[name].end, "連通檢查 OK");
  }
  fs.writeFileSync(path.join(here, "masks.js"), "// 由 tools/prep-art.mjs 從路線圖的米色路面計算（可走區遮罩，不是美術）\nwindow.MASKS = " + JSON.stringify(result) + ";\n");
}
