// 背景真瀏覽器驗收（Playwright／Chromium headless）：首屏重疊檢查、實際捲動測快捷按鈕、8 張海報逐張截圖
// 用法：node holiday-lab/reports/poster-mix-20261024/r4/pw-verify.cjs http://127.0.0.1:8902/ <新的輸出資料夾>
const fs = require('node:fs'), path = require('node:path');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
const [base, out] = process.argv.slice(2);
if (!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(base || '') || !out) throw Error('Usage: pw-verify.cjs <http://127.0.0.1:port/> <fresh-output-dir>');
if (fs.existsSync(out)) throw Error('Output dir must be new: ' + out);
fs.mkdirSync(out, { recursive: true });
const audit = fs.readFileSync(path.join(__dirname, 'overlap-audit.js'), 'utf8');
const cases = [[1920, 1080, 'zh'], [1920, 1080, 'en'], [1440, 900, 'zh'], [1440, 900, 'en'], [1440, 900, 'ja'], [1366, 768, 'zh'], [1280, 720, 'zh'], [1265, 800, 'zh'], [1181, 720, 'zh']];
(async () => {
  const browser = await chromium.launch();
  const results = { base, cases: [], screenshots: [], errors: [] };
  try {
    for (const [width, height, lang] of cases) {
      const page = await browser.newPage({ viewport: { width, height } });
      const consoleErrors = []; page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      await page.goto(base + '?lang=' + lang, { waitUntil: 'networkidle' });
      const r = await page.evaluate(audit);
      // 實際捲動：第一畫面快捷按鈕應藏；捲過海報區一半後應出現
      const scroll = [];
      for (const y of [0, 'half', 'past']) {
        const target = await page.evaluate(k => { const b = document.querySelector('.hero-original-tier').getBoundingClientRect(); const abs = b.bottom + window.scrollY; return k === 0 ? 0 : k === 'half' ? Math.round(abs - window.innerHeight * 0.45) : Math.round(abs + 50); }, y);
        await page.evaluate(t => window.scrollTo(0, t), target); await page.waitForTimeout(450);
        scroll.push(await page.evaluate(() => { const c = document.querySelector('.floating-cta'), cs = getComputedStyle(c); return { scrollY: Math.round(window.scrollY), heroBottom: Math.round(document.querySelector('.hero-original-tier').getBoundingClientRect().bottom), flag: document.documentElement.dataset.heroInView, quickVisible: cs.visibility === 'visible' && parseFloat(cs.opacity) > 0.5 }; }));
      }
      results.cases.push({ width, height, lang, audit: r, scroll, consoleErrors });
      await page.close();
    }
    // 1440×900 中文：8 張逐張停格截圖
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + '?lang=zh', { waitUntil: 'networkidle' });
    const catalog = await page.evaluate(() => fetch('data/student-work-draw.json').then(r => r.json()));
    for (const work of catalog) {
      await page.waitForFunction(id => document.querySelector('#student-work-draw')?.dataset.drawId === id, work.id, { timeout: 30000 });
      await page.evaluate(() => { const b = document.querySelector('#student-work-draw-pause'); if (b && !/繼續/.test(b.textContent)) b.click(); });
      await page.waitForTimeout(700);
      const file = path.join(out, 'zh-1440-' + work.id + '.png');
      await page.screenshot({ path: file });
      const meta = await page.evaluate(() => ({ fit: document.querySelector('.swd-surface').dataset.fit, posterY: document.querySelector('.swd-surface').style.getPropertyValue('--poster-y'), side: document.querySelector('.hero-original-tier').dataset.copySide }));
      results.screenshots.push({ id: work.id, file: path.basename(file), ...meta });
      await page.evaluate(() => { const b = document.querySelector('#student-work-draw-pause'); if (b && /繼續/.test(b.textContent)) b.click(); });
    }
    await page.close();
    // 1920×1080：使用者指定要看全臉的三張另截一份
    const wide = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await wide.goto(base + '?lang=zh', { waitUntil: 'networkidle' });
    for (const id of ['showcase-01', 'showcase-02', 'showcase-03']) {
      await wide.waitForFunction(x => document.querySelector('#student-work-draw')?.dataset.drawId === x, id, { timeout: 30000 });
      await wide.evaluate(() => { const b = document.querySelector('#student-work-draw-pause'); if (b && !/繼續/.test(b.textContent)) b.click(); });
      await wide.waitForTimeout(700); await wide.screenshot({ path: path.join(out, 'zh-1920-' + id + '.png') });
      await wide.evaluate(() => { const b = document.querySelector('#student-work-draw-pause'); if (b && /繼續/.test(b.textContent)) b.click(); });
    }
    await wide.close();
  } catch (e) { results.errors.push(String(e && e.stack || e)); }
  await browser.close();
  results.summary = {
    allAuditsClean: results.cases.every(c => c.audit.n === 8 && c.audit.posterIssues.length === 0 && c.audit.heroFrame.fitsScreen && !c.audit.pageOverflowX),
    quickHiddenFirstScreen: results.cases.every(c => c.scroll[0].quickVisible === false),
    quickShownAfterHero: results.cases.every(c => c.scroll[2].quickVisible === true),
    consoleErrors: results.cases.reduce((n, c) => n + c.consoleErrors.length, 0),
    screenshots: results.screenshots.length, errors: results.errors.length
  };
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.summary));
  process.exitCode = results.errors.length || !results.summary.allAuditsClean || !results.summary.quickHiddenFirstScreen || !results.summary.quickShownAfterHero ? 1 : 0;
})();
