// 在頁面內執行：逐張海報（每張停格後強制完成動畫）量標題、按鈕、右下面板相對主體範圍的位置
(async () => {
  const w = ms => new Promise(r => setTimeout(r, ms));
  const catalog = await fetch('data/student-work-draw.json').then(r => r.json());
  const q = s => document.querySelector(s);
  const surface = () => q('.swd-surface').getBoundingClientRect();
  const frac = (e, s) => { const r = e.getBoundingClientRect(); return { x0: (r.left - s.left) / s.width, x1: (r.right - s.left) / s.width, y0: (r.top - s.top) / s.height, y1: (r.bottom - s.top) / s.height }; };
  const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const rows = [], seen = new Set();
  window.scrollTo(0, 0);
  for (let i = 0; i < 400 && seen.size < catalog.length; i++) {
    await w(120);
    const id = q('#student-work-draw').dataset.drawId; if (seen.has(id)) continue;
    // 停在這一張：暫停輪播，等頁面實際畫出幀並讓所有動畫跑完
    const b = q('#student-work-draw-pause'); if (b && b.textContent.length && !/繼續|Resume|再開/.test(b.textContent)) b.click();
    await w(350); // 不用 requestAnimationFrame：窗格被隱藏時不出畫面幀會卡住
    document.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} });
    await w(60);
    if (q('#student-work-draw').dataset.drawId !== id) continue;
    seen.add(id);
    const f = catalog.find(x => x.id === id).focus, s = surface(), tier = q('.hero-original-tier');
    const t = q('#hero-title'), rg = document.createRange(); rg.selectNodeContents(t);
    const ink = [...rg.getClientRects()].reduce((a, r) => ({ x0: Math.min(a.x0, (r.left - s.left) / s.width), x1: Math.max(a.x1, (r.right - s.left) / s.width) }), { x0: 9, x1: -9 });
    const copy = frac(q('#hero .hero-original-copy'), s), actions = frac(q('#hero .hero-original-actions'), s), con = frac(q('.swd-console'), s);
    const side = tier.dataset.copySide;
    const intrusion = side === 'left' ? Math.max(0, ink.x1 - f.x[0]) : Math.max(0, f.x[1] - ink.x0);
    rows.push({
      id, lang: document.documentElement.lang, side, actions: tier.dataset.actions, font: getComputedStyle(t).fontSize,
      titleIntoSubject: +intrusion.toFixed(3), titleInsideFrame: ink.x0 >= -0.001 && ink.x1 <= 1.001,
      copyOverConsole: +overlap(copy, con).toFixed(4), actionsOverConsole: +overlap(actions, con).toFixed(4), copyOverActions: +overlap(copy, actions).toFixed(4),
      ok: intrusion <= 0.03 && ink.x0 >= -0.001 && ink.x1 <= 1.001 && overlap(copy, con) === 0 && overlap(actions, con) === 0 && overlap(copy, actions) === 0
    });
    if (b) { /* 下一張：繼續輪播 */ const nb = q('#student-work-draw-pause'); if (nb && /繼續|Resume|再開/.test(nb.textContent)) nb.click(); }
  }
  return { n: rows.length, allOk: rows.length === catalog.length && rows.every(r => r.ok), rows };
})();
