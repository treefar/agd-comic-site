// 在瀏覽器頁面內執行（javascript_tool 貼上）：捲動掃描面板控制項是否被任何元素遮住，並收集頂欄／招生區／字級結果
(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  await wait(2500);
  const ids = ['#student-work-draw-start', '#student-work-draw-pause', '#student-work-draw-static'];
  const blocked = [];
  let steps = 0;
  for (let y = 0; y <= 1400; y += 50) {
    window.scrollTo(0, y); window.dispatchEvent(new Event('scroll')); await wait(30);
    const panel = document.querySelector('.swd-console').getBoundingClientRect();
    if (panel.bottom <= 0) break;
    steps++;
    for (const id of ids) {
      const e = document.querySelector(id); if (!e) continue;
      const r = e.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) continue;
      const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      const ok = t && (e === t || e.contains(t) || t.contains(e));
      if (!ok) blocked.push({ y, id, by: t?.className || t?.tagName });
    }
  }
  window.scrollTo(0, 0); await wait(100);
  const cta = document.querySelector('.topnav>a:last-child');
  const after = []; for (const y of [1600, 3000]) { window.scrollTo(0, y); window.dispatchEvent(new Event('scroll')); await wait(250); after.push(getComputedStyle(document.querySelector('.floating-cta')).visibility); }
  window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'));
  return {
    lang: document.documentElement.lang, size: [innerWidth, innerHeight], steps, blocked,
    floatingAtTop: getComputedStyle(document.querySelector('.floating-cta')).visibility, floatingAfterScroll: after,
    headerCta: [cta.textContent.trim(), cta.getAttribute('href')],
    joinButtons: [...document.querySelectorAll('.join-now-actions a')].map(a => a.textContent.trim()),
    fonts: { credits: getComputedStyle(document.querySelector('.swd-credits')).fontSize, motion: getComputedStyle(document.querySelector('.swd-motion')).fontSize, button: getComputedStyle(document.querySelector('#student-work-draw-start')).fontSize },
    heroSpeedlines: getComputedStyle(document.querySelector('#hero .bg-speedlines')).opacity,
    navLineDisplay: getComputedStyle(document.querySelector('.topnav nav .nav-mobile-only')).display,
    pausedNote: !!document.querySelector('#festival-paused-note'),
    overflowX: document.documentElement.scrollWidth > innerWidth
  };
})();
