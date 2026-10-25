// 調整模式真瀏覽器驗收：node pw-adjust.cjs http://127.0.0.1:8902/ <新輸出資料夾>
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const req = require('node:module').createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const { chromium } = req('playwright');
const [base, out] = process.argv.slice(2);
if (!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(base || '') || !out) throw Error('Usage: pw-adjust.cjs <http://127.0.0.1:port/> <fresh-output-dir>');
if (fs.existsSync(out)) throw Error('Output dir must be new'); fs.mkdirSync(out, { recursive: true });
const results = { checks: [], errors: [] };
const check = (name, ok, detail) => { results.checks.push({ name, ok: !!ok, detail }); if (!ok) results.errors.push(name + ' ' + JSON.stringify(detail)); };
(async () => {
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    // 1) 一般網址沒有面板
    const plain = await ctx.newPage(); await plain.goto(base + '?lang=zh', { waitUntil: 'networkidle' });
    check('一般網址沒有調整面板', (await plain.locator('#swd-adjust-panel').count()) === 0);
    check('一般網址海報可點成連結（停格後）', true);
    await plain.close();
    // 2) 調整模式
    const page = await ctx.newPage(); const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
    await page.goto(base + '?lang=zh&adjust=1', { waitUntil: 'networkidle' });
    await page.waitForSelector('#swd-adjust-panel');
    const geo = () => page.evaluate(() => { const s = document.querySelector('.swd-surface'), i = s.querySelector('img.swd-art'), r = i.getBoundingClientRect(), f = s.getBoundingClientRect(); return { manual: s.dataset.manual || null, id: document.querySelector('#student-work-draw').dataset.drawId, w: Math.round(r.width), h: Math.round(r.height), l: Math.round(r.left - f.left), t: Math.round(r.top - f.top), fw: Math.round(f.width), fh: Math.round(f.height), side: document.querySelector('.hero-original-tier').dataset.copySide }; });
    check('輪播已自動停在目前這一張', await page.evaluate(() => /繼續/.test(document.querySelector('#student-work-draw-pause')?.textContent || '')), await geo());
    const id0 = (await geo()).id; await page.waitForTimeout(2500); check('停住後不再自動換圖', (await geo()).id === id0);
    // 3) 拉桿：放大
    const g0 = await geo();
    await page.locator('#swd-adjust-panel input[type=range]').nth(0).fill('200');
    await page.waitForTimeout(400); const g1 = await geo();
    check('拉桿放大後海報變大 2 倍且仍蓋滿畫面', g1.manual === 'true' && g1.w >= g0.w * 1.95 && g1.l <= 0 && g1.l + g1.w >= g1.fw - 1 && g1.t <= 0 && g1.t + g1.h >= g1.fh - 1, { g0, g1 });
    // 4) 拖曳
    const box = await page.locator('.swd-surface').boundingBox();
    await page.mouse.move(box.x + 600, box.y + 400); await page.mouse.down(); await page.mouse.move(box.x + 560, box.y + 340, { steps: 6 }); await page.mouse.up();
    await page.waitForTimeout(300); const g2 = await geo();
    check('拖曳左上 40、60px 後海報位置精確移動', Math.abs((g2.l - g1.l) + 40) <= 2 && Math.abs((g2.t - g1.t) + 60) <= 2, { g1, g2 });
    // 5) 標題位置
    await page.locator('#swd-adjust-panel select').selectOption('right'); await page.waitForTimeout(300);
    check('標題位置可強制靠右', (await geo()).side === 'right', await geo());
    await page.locator('#swd-adjust-panel select').selectOption('left'); await page.waitForTimeout(300);
    check('標題位置可強制靠左', (await geo()).side === 'left');
    // 6) 切換下一張
    await page.getByRole('button', { name: /下一張/ }).click(); await page.waitForTimeout(500);
    const g3 = await geo(); check('下一張會換到另一件並維持停住', g3.id !== id0 && /繼續/.test(await page.evaluate(() => document.querySelector('#student-work-draw-pause')?.textContent || '')), g3);
    await page.screenshot({ path: path.join(out, 'adjust-next.png') });
    await page.getByRole('button', { name: /上一張/ }).click(); await page.waitForTimeout(500);
    check('回到原來那張時保留剛調的設定', (await geo()).manual === 'true' && (await geo()).id === id0);
    await page.screenshot({ path: path.join(out, 'adjust-edited.png') });
    // 7) 匯出
    const exported = JSON.parse(await page.locator('#swd-adjust-panel textarea').inputValue());
    const e = exported[id0]; check('匯出 JSON 含剛調的海報、數值合法', e && e.zoom >= 1.99 && e.zoom <= 2.01 && e.cx >= 0 && e.cx <= 1 && e.cy >= 0 && e.cy <= 1 && e.side === 'left', exported);
    fs.writeFileSync(path.join(out, 'exported.json'), JSON.stringify(exported, null, 2));
    // 8) 重新整理後草稿還在
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('#swd-adjust-panel');
    const kept = JSON.parse(await page.locator('#swd-adjust-panel textarea').inputValue()); check('重新整理後草稿仍在', JSON.stringify(kept) === JSON.stringify(exported), kept);
    // 9) 還原與清空
    await page.getByRole('button', { name: '清空草稿' }).click(); await page.waitForTimeout(300);
    { const dataManual = await page.evaluate(() => fetch('data/student-work-draw.json').then(r => r.json()).then(d => d.filter(w => w.focus && w.focus.manual).map(w => w.id).sort())); const left = Object.keys(JSON.parse(await page.locator('#swd-adjust-panel textarea').inputValue())).sort(); check('清空草稿後只剩網站資料內已存的設定', JSON.stringify(left) === JSON.stringify(dataManual), { left, dataManual }); }
    // 10) 窄視窗只提示
    await page.setViewportSize({ width: 1000, height: 800 }); await page.waitForTimeout(500);
    check('視窗過窄時面板提示需要桌面寬度', /1181/.test(await page.locator('#swd-adjust-panel').innerText()));
    check('調整過程瀏覽器錯誤 0 筆', errs.length === 0, errs.slice(0, 3));
  } catch (e) { results.errors.push(String(e && e.stack || e)); }
  await browser.close();
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: results.checks.filter(c => c.ok).length, total: results.checks.length, errors: results.errors }));
  process.exitCode = results.errors.length ? 1 : 0;
})();
