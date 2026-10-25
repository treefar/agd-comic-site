// 第十一階段：以 hero-user-adjust-20261025 為基底，更新抽選列，儀表板權威改指向 hero-bubbles-20261025
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r10', outDir = 'holiday-lab/reports/hero-bubbles-20261025', out = outDir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/hero-user-adjust-20261025/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-33-retry5';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8902, baseline_site: base.site,
  baseline_note: '第十一階段：冤枉汪泡泡上移、競箱團標語框移到右上。舊列按明列版本保留，未重新全站驗收。' };
const ev = ['REPORT.md', 'pw-run-10/result.json', 'pw-adjust-run-05/result.json'].map(f => dir + '/' + f);
ev.forEach(f => assert.ok(fs.existsSync(f), f));
const patch = {
  'student-work-draw': ' 8902第十一階段：冤枉汪泡泡移到左上（focus.bubbles）、競箱團標語框移到右上（focus.tagline）；首屏9組0問題、調整模式15/15、單元35/35。僅主控窄驗，非使用者確認。'
};
v.checks = base.checks.map(c => patch[c.id] ? { ...c, reason: c.reason + patch[c.id], evidence: [...c.evidence, dir + '/REPORT.md'] } : c);
assert.equal(Object.keys(patch).filter(id => !v.checks.some(c => c.id === id)).length, 0, 'patched ids must exist');
const changed = ['data/student-work-draw.json', 'tests/student-work-draw.test.cjs', 'student-work-draw.jsx', 'student-work-draw.css'];
const refresh = new Set([...changed, ...ev]);
const add = new Set([...ev, ...changed, site + '/index.html', site + '/data/student-work-draw.json']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return (refresh.has(s.file) || (s.file.startsWith('holiday-lab/reports/poster-mix-20261024/') && fs.existsSync(s.file) && sha(s.file) !== s.sha256)) && fs.existsSync(s.file) ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
assert.ok(!fs.existsSync(out), 'stage file must be new');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
fs.writeFileSync(outDir + '/README.md', '# hero-bubbles-20261025\n\n第十一階段驗證檔（儀表板只接受 reports/<階段>/verification.json 這一層）。證據在 ../poster-mix-20261024/r10/。\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
