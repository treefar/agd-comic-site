// 除錯：拖曳時 surface 實際收到幾次 pointermove、每次之後海報位置如何變化
const path = require('node:path');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(process.argv[2] + '?lang=zh&adjust=1', { waitUntil: 'networkidle' }); await page.waitForSelector('#swd-adjust-panel');
  await page.locator('#swd-adjust-panel input[type=range]').nth(0).fill('200'); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__ev = []; const s = document.querySelector('.swd-surface'); for (const t of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture', 'gotpointercapture']) s.addEventListener(t, e => window.__ev.push([t, Math.round(e.clientX), Math.round(e.clientY), e.pointerId, e.buttons]), true); window.__pos = () => { const i = document.querySelector('img.swd-art').getBoundingClientRect(); return [Math.round(i.left), Math.round(i.top)]; }; });
  const box = await page.locator('.swd-surface').boundingBox(); const trace = [];
  await page.mouse.move(box.x + 600, box.y + 400); await page.mouse.down();
  for (let i = 1; i <= 6; i++) { await page.mouse.move(box.x + 600 - i * 40 / 6, box.y + 400 - i * 60 / 6); await page.waitForTimeout(60); trace.push(await page.evaluate(() => window.__pos())); }
  await page.mouse.up(); await page.waitForTimeout(200);
  console.log(JSON.stringify({ start: trace[0], positions: trace, events: await page.evaluate(() => window.__ev), final: await page.evaluate(() => window.__pos()) }));
  await browser.close();
})();
