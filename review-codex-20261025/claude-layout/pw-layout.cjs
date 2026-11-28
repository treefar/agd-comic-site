// 補 Codex 未完成的 A 排版：英日文 × 3 尺寸 × 8 頁，檢查水平捲軸、文字被裁切、元素超出視窗、Console 錯誤
// 用法：node pw-layout.cjs http://127.0.0.1:8910/ <新輸出資料夾>
const fs = require('node:fs'), path = require('node:path');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
const [base, out] = process.argv.slice(2);
if (!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(base || '') || !out) throw Error('Usage: pw-layout.cjs <http://127.0.0.1:port/> <fresh-output-dir>');
if (fs.existsSync(out)) throw Error('Output dir must be new'); fs.mkdirSync(out, { recursive: true });
const pages = ['', '#/students/guide', '#/admission/selection', '#/faculty/tengshuyuan', '#/stats/international', '#/labs/db101-1', '#/news/2026-04-29-awards-showcase', '#/works/fangshi-2025'];
const sizes = [[1440, 900], [1920, 1080], [390, 844]];
const audit = () => {
  const vw = document.documentElement.clientWidth, issues = [];
  const pageOverflowX = document.documentElement.scrollWidth > vw + 1;
  const visible = el => { const s = getComputedStyle(el), r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && r.width > 0 && r.height > 0; };
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('[aria-hidden="true"],svg,script,style,.swd-surface,iframe')) continue;
    const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    if (!text) continue;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    // 文字被裁切：自己是裁切容器且內容比框大
    const clips = /(hidden|clip)/.test(s.overflowX + s.overflowY) || s.textOverflow === 'ellipsis';
    if (clips && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)) issues.push({ kind: 'clipped', text: text.slice(0, 60), tag: el.tagName, cls: String(el.className).slice(0, 60), sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight });
    // 文字跑出視窗左右
    if (r.right > vw + 2 || r.left < -2) issues.push({ kind: 'offscreen', text: text.slice(0, 60), tag: el.tagName, cls: String(el.className).slice(0, 60), left: Math.round(r.left), right: Math.round(r.right), vw });
  }
  const hanLeft = (document.body.innerText.match(/[㐀-鿿]{4,}/g) || []).length;
  return { pageOverflowX, scrollW: document.documentElement.scrollWidth, vw, issues: issues.slice(0, 30), issueCount: issues.length, han4: hanLeft, title: document.title };
};
(async () => {
  const browser = await chromium.launch(), results = [];
  try {
    for (const lang of ['en', 'ja']) for (const [w, h] of sizes) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      for (const p of pages) {
        const page = await ctx.newPage(), errs = [];
        page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }); page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
        const url = base + '?lang=' + lang + p;
        await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
        const a = await page.evaluate(audit);
        const shot = `${lang}-${w}-${(p.replace(/[#/]+/g, '-').replace(/^-|-$/g, '') || 'home')}.png`;
        if (w !== 1920) await page.screenshot({ path: path.join(out, shot) });
        results.push({ lang, size: [w, h], url, ...a, consoleErrors: errs, shot: w !== 1920 ? shot : null });
        await page.close();
      }
      await ctx.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(results, null, 2));
  const bad = results.filter(r => r.pageOverflowX || r.issueCount || r.consoleErrors.length);
  console.log(JSON.stringify({ cases: results.length, withIssues: bad.length, summary: bad.map(r => ({ lang: r.lang, size: r.size[0], url: r.url.replace(base, ''), overflowX: r.pageOverflowX, issues: r.issueCount, kinds: [...new Set(r.issues.map(i => i.kind))], console: r.consoleErrors.length })) }, null, 1));
})();
