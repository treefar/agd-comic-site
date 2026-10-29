// 師資頁三語驗收：截圖、水平捲軸、Console 錯誤；日文／英文頁不可出現新增的中文原句
// 用法：node pw-faculty.cjs http://127.0.0.1:8902/ <新輸出資料夾>
const fs = require('node:fs'), path = require('node:path');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
const [base, out] = process.argv.slice(2);
if (!/^https?:\/\//.test(base || '') || !out) throw Error('Usage: pw-faculty.cjs <base> <fresh-dir>');
if (fs.existsSync(out)) throw Error('Output dir must be new'); fs.mkdirSync(out, { recursive: true });
const root = path.resolve(__dirname, '../../..');
const zh = JSON.parse(fs.readFileSync(path.join(root, 'data/faculty.json'), 'utf8'));
const slugs = ['chenchinghung', 'chiangyamei', 'wangtsungli', 'chenchungkuang', 'yangchihchang'];
(async () => {
  const browser = await chromium.launch(), results = [];
  for (const lang of ['zh', 'en', 'ja']) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    for (const slug of slugs) {
      const page = await ctx.newPage(), errs = [];
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); }); page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
      const t = zh.find(x => x.slug === slug);
      await page.goto(`${base}?lang=${lang}#/faculty/${slug}`, { waitUntil: 'networkidle' });
      // 等詳細頁真的畫出來（英文名在三語頁面都會出現），避免第一頁還沒渲染就讀文字
      await page.waitForFunction(n => document.body.innerText.includes(n) && /RESEARCH|COURSES/i.test(document.body.innerText), t.en, { timeout: 20000 });
      await page.waitForTimeout(500);
      const text = await page.evaluate(() => document.body.innerText);
      const own = [...(t.achievements || []), ...(t.experience || [])].filter(s => /[㐀-鿿]/.test(s));
      // 中文頁要看得到；英日頁不可出現整句中文原文（代表沒翻到）
      const shown = own.filter(s => text.includes(s.slice(0, 18))).length;
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      const shot = `${lang}-${w}-${slug}.png`;
      if (slug === 'chenchinghung' || w === 1440) await page.screenshot({ path: path.join(out, shot), fullPage: true });
      results.push({ lang, w, slug, zhSentencesVisible: shown, total: own.length, certsVisible: lang === 'zh' ? (t.certs ? text.includes(t.certs.split('、').pop().slice(0, 12)) : null) : null, overflowX, consoleErrors: errs.length });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(results, null, 2));
  const bad = results.filter(r => r.overflowX || r.consoleErrors || (r.lang === 'zh' ? r.zhSentencesVisible !== r.total || r.certsVisible === false : r.zhSentencesVisible > 0));
  console.log(JSON.stringify({ cases: results.length, bad: bad.length, details: bad }));
})();
