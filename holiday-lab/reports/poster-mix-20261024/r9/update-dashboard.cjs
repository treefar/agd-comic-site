// 第五階段（使用者回報元素重疊／不見）：以第四輪 verification 為基底，更新相關列，儀表板權威改指向 hero-recheck-b-20261025
// 與 update-dashboard2.cjs 的差別：r4 證據檔在上一階段綁定後又被重跑覆寫，這裡重算所有 r4 證據檔與已變更檔的 SHA
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r9', outDir = 'holiday-lab/reports/hero-user-adjust-20261025', out = outDir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
// 同一階段第一次產出因 r4/REPORT.md 後續補寫而未能建置儀表板；本檔重產該階段尚未採用的 verification.json
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/hero-adjust-20261025/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-31';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8902, baseline_site: base.site,
  baseline_note: '第十階段：套用使用者調整、資訊面板精簡。舊列按明列版本保留，未重新全站驗收。' };
const ev = ['REPORT.md', 'guard.json', 'overlap-audit.js', 'pw-verify.cjs', 'pw-adjust.cjs', 'test-draw-command.json', 'test-guide-command.json', 'test-all-command.json'].map(f => dir + '/' + f);
ev.forEach(f => assert.ok(fs.existsSync(f), f));
const patch = {
  'student-work-draw': ' 8902第十階段：套用使用者在調整模式匯出的5筆取景（focus.manual）；靜態模式移到資訊面板右上，面板少一行；首屏9組0問題、調整模式15/15。僅主控窄驗，非使用者確認。'
};
v.checks = base.checks.map(c => patch[c.id] ? { ...c, reason: c.reason + patch[c.id], evidence: [...c.evidence, dir + '/REPORT.md', dir + '/browser.json'] } : c);
assert.equal(Object.keys(patch).filter(id => !v.checks.some(c => c.id === id)).length, 0, 'patched ids must exist');
const changed = ['data/student-work-draw.json', 'tests/student-work-draw.test.cjs', 'student-work-draw-model.js', 'student-work-draw.jsx', 'student-work-draw.css', 'styles.css', 'chapters-1.jsx'];
const refresh = new Set([...changed, ...ev]);
const add = new Set([...ev, ...changed, site + '/index.html', site + '/data/student-work-draw.json']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return (refresh.has(s.file) || (s.file.startsWith('holiday-lab/reports/poster-mix-20261024/') && fs.existsSync(s.file) && sha(s.file) !== s.sha256)) && fs.existsSync(s.file) ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
fs.writeFileSync(outDir + '/README.md', '# hero-recheck-b-20261025\n\n第五階段驗證檔（儀表板只接受 reports/<階段>/verification.json 這一層）。證據在 ../poster-mix-20261024/r9/（Playwright 結果在 ../poster-mix-20261024/r8/pw-run-09/ 與 pw-adjust-run-04/）。\n\n同日較早的 ../hero-recheck-20261025/ 因 r4 證據檔被重跑覆寫、SHA 對不上而作廢，保留未刪；hero-fit-20261024 同理（其綁定的 r4 證據檔已被更新）。\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
