// 在頁面內執行：檢查首屏元件「互相重疊」「被裁切（以最近一層 overflow 會裁切的外框為準）」「看不見」，並回報快捷按鈕、頂欄與構圖模式
// 2026-10-25 版：被裁切改以實際裁切外框判斷（舊版用整個海報區，漏抓了面板內被切掉的亮點泡泡）
(async () => {
  const w = ms => new Promise(r => setTimeout(r, ms));
  const q = (s, root = document) => root.querySelector(s), qa = (s, root = document) => [...root.querySelectorAll(s)];
  await w(1800); window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll')); await w(200);
  const catalog = await fetch('data/student-work-draw.json').then(r => r.json());
  const visible = e => { if (!e) return false; const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05 && r.width > 1 && r.height > 1; };
  const box = e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
  const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
  const clipBox = e => { let p = e.parentElement; while (p && p !== document.body) { const cs = getComputedStyle(p); if (/(hidden|clip)/.test(cs.overflow + cs.overflowX + cs.overflowY)) return box(p); p = p.parentElement; } return { l: 0, t: 0, r: innerWidth, b: Infinity }; };
  const frame = q('.hero-original-tier'), fr = box(frame);
  const results = [], seen = new Set(); const t0 = Date.now();
  while (seen.size < catalog.length && Date.now() - t0 < 30000) {
    await w(80);
    const id = q('#student-work-draw').dataset.drawId; if (seen.has(id)) continue;
    const pb = q('#student-work-draw-pause'); if (pb && !/繼續|Resume|再開/.test(pb.textContent)) pb.click();
    await w(300); document.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} }); await w(60);
    if (q('#student-work-draw').dataset.drawId !== id) { const nb = q('#student-work-draw-pause'); if (nb && /繼續|Resume|再開/.test(nb.textContent)) nb.click(); continue; }
    seen.add(id);
    const parts = { title: q('#hero-title'), kicker: q('#hero .hero-original-copy>div:first-child'), tagline: q('#hero .hero-tagline'), console: q('.swd-console') };
    qa('#hero .hero-original-highlights a').forEach((a, i) => parts['bubble' + (i + 1)] = a);
    const quick = q('.floating-cta'); if (quick && getComputedStyle(quick).position === 'fixed' && visible(quick)) parts.quickLinks = quick;
    const present = Object.fromEntries(Object.entries(parts).filter(([k, e]) => e).map(([k, e]) => [k, visible(e)]));
    const boxes = Object.fromEntries(Object.entries(parts).filter(([k, e]) => e && visible(e)).map(([k, e]) => [k, box(e)]));
    const names = Object.keys(boxes), overlaps = [];
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { if (names[i].startsWith('bubble') && names[j].startsWith('bubble')) continue; const a = inter(boxes[names[i]], boxes[names[j]]); if (a > 40) overlaps.push(names[i] + '×' + names[j] + ':' + Math.round(a)); }
    const clipped = Object.entries(parts).filter(([k, e]) => k !== 'quickLinks' && e && visible(e)).filter(([k, e]) => { const b = box(e), c = clipBox(e); return b.l < c.l - 1 || b.r > c.r + 1 || b.t < c.t - 1 || b.b > c.b + 1; }).map(([k]) => k);
    const offScreen = Object.entries(boxes).filter(([k, b]) => b.b > innerHeight + 1).map(([k]) => k);
    const hidden = Object.entries(present).filter(([k, v]) => !v).map(([k]) => k);
    const surf = q('.swd-surface');
    results.push({ id, fit: surf.dataset.fit || '-', posterY: surf.style.getPropertyValue('--poster-y'), overlaps, clipped, offScreen, hidden });
    const nb = q('#student-work-draw-pause'); if (nb && /繼續|Resume|再開/.test(nb.textContent)) nb.click();
  }
  const cta = q('.floating-cta'), top = q('.topnav'), nav = q('.topnav nav'), brand = q('.topnav .brand'), topCta = q('.topnav>a:last-child');
  const navLinks = qa('a', nav).filter(visible), navTops = [...new Set(navLinks.map(a => Math.round(a.getBoundingClientRect().top)))];
  const quickAtTop = visible(cta);
  window.scrollTo(0, Math.round(fr.b + window.scrollY)); window.dispatchEvent(new Event('scroll')); await w(400); document.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} });
  const quickAfterHero = visible(cta);
  window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'));
  return {
    size: [innerWidth, innerHeight], lang: document.documentElement.lang, n: results.length,
    heroFrame: { top: Math.round(fr.t), bottom: Math.round(fr.b), fitsScreen: fr.b <= innerHeight + 1 },
    fits: results.map(r => r.id + ':' + r.fit + '@' + r.posterY),
    posterIssues: results.filter(r => r.overlaps.length || r.clipped.length || r.offScreen.length || r.hidden.length),
    quickLinks: { fixed: cta && getComputedStyle(cta).position === 'fixed', visibleOnFirstScreen: quickAtTop, visibleAfterHero: quickAfterHero },
    header: { height: Math.round(top.getBoundingClientRect().height), navRows: navTops.length, navOverlapsBrand: inter(box(nav), box(brand)) > 0, navOverlapsCta: inter(box(nav), box(topCta)) > 0 },
    pageOverflowX: document.documentElement.scrollWidth > innerWidth
  };
})();
