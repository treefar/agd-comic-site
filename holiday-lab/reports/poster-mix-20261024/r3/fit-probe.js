// 在頁面內執行：第一個畫面是否完整看到海報區、頂欄高度、裝飾是否隱藏
(async () => {
  await new Promise(r => setTimeout(r, 1800)); window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 200));
  const q = s => document.querySelector(s), shown = s => { const e = q(s); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0; };
  const tier = q('.hero-original-tier'), r = tier.getBoundingClientRect(), nav = q('.topnav').getBoundingClientRect(), cons = q('.swd-console').getBoundingClientRect();
  const navLinks = [...q('.topnav nav').querySelectorAll('a')].filter(a => getComputedStyle(a).display !== 'none').map(a => Math.round(a.getBoundingClientRect().top));
  return {
    size: [innerWidth, innerHeight], lang: document.documentElement.lang,
    headerH: Math.round(nav.height), headerOneRow: new Set(navLinks).size === 1 && Math.abs(navLinks[0] - Math.round(q('.topnav .brand').getBoundingClientRect().top)) < 40,
    heroTop: Math.round(r.top), heroBottom: Math.round(r.bottom), heroH: Math.round(r.height), heroFits: r.bottom <= innerHeight + 1 && r.top >= 0,
    consoleVisible: cons.bottom <= innerHeight + 1, titleFont: getComputedStyle(q('#hero-title')).fontSize,
    copyH: Math.round(q('#hero .hero-original-copy').getBoundingClientRect().height),
    hiddenOk: !shown('#hero .hero-draw-enabled>.panel>.bg-speedlines') && !shown('#hero .hero-draw-enabled .sfx') && !shown('#hero .hero-draw-enabled .hero-original-actions') && !shown('#hero .hero-draw-enabled .hero-original-chapter-stamp') && !shown('#hero .hero-original-quote'),
    highlightsShown: shown('#hero .hero-original-highlights'),
    preview: q('.swd-status')?.textContent, overflowX: document.documentElement.scrollWidth > innerWidth
  };
})();
