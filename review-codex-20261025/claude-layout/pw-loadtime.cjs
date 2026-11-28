// 首頁載入時間量測：桌機寬頻與模擬 4G 手機，各跑 3 次取中位數
// 用法：node pw-loadtime.cjs <網址> [標籤]
const path = require('node:path');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
const [url, label = url] = process.argv.slice(2);
if (!/^https?:\/\//.test(url || '')) throw Error('Usage: pw-loadtime.cjs <url> [label]');
// 4G 參考 Lighthouse「Slow 4G」：下載 1.6 Mbps、上傳 0.75 Mbps、延遲 150 ms
const profiles = { desktop: { viewport: { width: 1440, height: 900 }, net: null }, mobile4g: { viewport: { width: 390, height: 844 }, net: { latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 0.75e6 / 8 } } };
const median = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
(async () => {
  const browser = await chromium.launch(), out = { label, url };
  for (const [name, p] of Object.entries(profiles)) {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await browser.newContext({ viewport: p.viewport }), page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net });
      let bytes = 0, posterBytes = 0; const big = [];
      cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });
      page.on('response', async r => { const u = r.url(); if (/images\/news\//.test(u)) { const len = +(r.headers()['content-length'] || 0); posterBytes += len; } });
      const t0 = Date.now();
      await page.goto(url, { waitUntil: 'load', timeout: 180000 });
      const loadMs = Date.now() - t0;
      const m = await page.evaluate(() => { const nav = performance.getEntriesByType('navigation')[0], paint = Object.fromEntries(performance.getEntriesByType('paint').map(x => [x.name, Math.round(x.startTime)])); return { domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), fcp: paint['first-contentful-paint'] || null }; });
      const lcp = await page.evaluate(() => new Promise(res => { let v = null; new PerformanceObserver(l => { for (const e of l.getEntries()) v = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => res(v), 500); }));
      // 首屏海報何時真的顯示出來
      const heroMs = await page.evaluate(() => { const img = document.querySelector('.swd-surface img.swd-art'); return img && img.complete ? Math.round(performance.getEntriesByName(img.currentSrc || img.src)[0]?.responseEnd || -1) : -1; });
      await page.waitForTimeout(p.net ? 8000 : 2000);
      runs.push({ ...m, lcp, heroPosterReady: heroMs, gotoLoadMs: loadMs, transferKB: Math.round(bytes / 1024), posterKB: Math.round(posterBytes / 1024) });
      await ctx.close();
    }
    out[name] = { runs, median: Object.fromEntries(Object.keys(runs[0]).map(k => [k, median(runs.map(r => r[k] ?? -1))])) };
  }
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
