// 在 8901 頁面內執行：對輪播每張海報算「吸睛度」(邊緣強度＋與背景色差)，
// 再模擬桌面畫面框 1277x625，找出「文字靠左／靠右」與裁切位置的最佳組合。
// 只做分析、不產生任何像素；結果寫進 data/student-work-draw.json 的 focus 欄位。
(async () => {
  const catalog = await fetch('data/student-work-draw.json').then(r => r.json());
  const W = 1277, H = 625, GW = 96;
  // 遮擋區（畫面框比例）與權重：文字區寬度會被 CSS 限制在 46%
  const copy = { x0: 0.025, x1: 0.485, y0: 0.097, y1: 0.66, w: 1.0 };
  const actions = { x0: 0.787, x1: 0.975, y0: 0.159, y1: 0.512, w: 0.7 };
  const consoleBox = { x0: 0.748, x1: 0.986, y0: 0.72, y1: 0.971, w: 0.6 };
  const highlights = { x0: 0.025, x1: 0.55, y0: 0.832, y1: 0.903, w: 0.35 };
  const mirror = r => ({ ...r, x0: 1 - r.x1, x1: 1 - r.x0 });
  const layouts = { left: [copy, actions, consoleBox, highlights], right: [mirror(copy), mirror(actions), consoleBox, highlights] };
  const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const out = [];
  for (const work of catalog) {
    const img = await load(work.image.startsWith('http') ? work.image : work.image);
    const gh = Math.round(GW * img.naturalHeight / img.naturalWidth);
    const c = document.createElement('canvas'); c.width = GW; c.height = gh;
    const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0, GW, gh);
    const d = ctx.getImageData(0, 0, GW, gh).data;
    const lum = i => 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    // 背景色 = 四周邊框像素的平均
    let br = 0, bg = 0, bb = 0, bn = 0;
    for (let x = 0; x < GW; x++) for (const y of [0, gh - 1]) { const i = y * GW + x; br += d[i * 4]; bg += d[i * 4 + 1]; bb += d[i * 4 + 2]; bn++; }
    for (let y = 0; y < gh; y++) for (const x of [0, GW - 1]) { const i = y * GW + x; br += d[i * 4]; bg += d[i * 4 + 1]; bb += d[i * 4 + 2]; bn++; }
    br /= bn; bg /= bn; bb /= bn;
    const s = new Float32Array(GW * gh);
    for (let y = 1; y < gh - 1; y++) for (let x = 1; x < GW - 1; x++) {
      const i = y * GW + x;
      const gx = lum(i + 1) - lum(i - 1), gy = lum(i + GW) - lum(i - GW);
      const cd = Math.hypot(d[i * 4] - br, d[i * 4 + 1] - bg, d[i * 4 + 2] - bb) / 441;
      s[i] = Math.hypot(gx, gy) / 255 + cd * 0.8;
    }
    // 取中心偏重：畫面正中的東西較可能是主體
    let total = 0; const cx0 = GW / 2, cy0 = gh / 2;
    for (let y = 0; y < gh; y++) for (let x = 0; x < GW; x++) { const dx = (x - cx0) / GW, dy = (y - cy0) / gh; s[y * GW + x] *= 1 + 0.6 * Math.exp(-(dx * dx + dy * dy) / 0.12); total += s[y * GW + x]; }
    // 整張圖的吸睛重心（供手機 object-position 使用）
    let mx = 0, my = 0; for (let y = 0; y < gh; y++) for (let x = 0; x < GW; x++) { const v = s[y * GW + x]; mx += v * x; my += v * y; }
    const centroid = { x: +(mx / total / GW).toFixed(3), y: +(my / total / gh).toFixed(3) };
    // cover 後可見區（影像座標，格子單位）
    const scale = Math.max(W / GW, H / gh), vw = W / scale, vh = H / scale;
    const score = (px, py, layout) => {
      const ox = (GW - vw) * px, oy = (gh - vh) * py; let visible = 0, hidden = 0;
      for (let fy = 0; fy < 40; fy++) for (let fx = 0; fx < 80; fx++) {
        const u = (fx + 0.5) / 80, v = (fy + 0.5) / 40;
        const ix = Math.min(GW - 1, Math.floor(ox + u * vw)), iy = Math.min(gh - 1, Math.floor(oy + v * vh));
        const val = s[iy * GW + ix]; visible += val;
        let occ = 0; for (const r of layouts[layout]) if (u >= r.x0 && u <= r.x1 && v >= r.y0 && v <= r.y1) occ = Math.max(occ, r.w);
        hidden += val * occ;
      }
      return { visible, hidden, clear: visible - hidden };
    };
    const rows = [];
    for (const layout of ['left', 'right']) for (let p = 0; p <= 10; p++) {
      const px = vw < GW - 0.5 ? p / 10 : 0.5, py = vh < gh - 0.5 ? p / 10 : 0.5;
      const sc = score(px, py, layout); rows.push({ layout, px, py, ...sc });
    }
    const best = rows.reduce((a, b) => b.clear > a.clear ? b : a);
    const base = rows.find(r => r.layout === 'left' && Math.abs((vh < gh - 0.5 ? r.py : r.px) - 0.5) < 0.01);
    out.push({
      id: work.id, size: [img.naturalWidth, img.naturalHeight], centroid,
      default_left_center: { clearShare: +(base.clear / total).toFixed(3), hiddenOfVisible: +(base.hidden / base.visible).toFixed(3) },
      best: { layout: best.layout, px: +best.px.toFixed(2), py: +best.py.toFixed(2), clearShare: +(best.clear / total).toFixed(3), hiddenOfVisible: +(best.hidden / best.visible).toFixed(3) }
    });
  }
  return out;
})();
