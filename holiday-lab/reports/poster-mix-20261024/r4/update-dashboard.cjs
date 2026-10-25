// 第三輪：以第二輪 verification 為基底，更新抽選列，儀表板權威改指向 poster-avoid-20261024
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r4', outDir = 'holiday-lab/reports/hero-fit-20261024', out = outDir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
assert.ok(!fs.existsSync(out), 'verification.json 已存在，不覆寫');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/poster-avoid-20261024/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-13';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8902, baseline_site: base.site,
  baseline_note: '第四輪：海報首頁精簡裝飾、塞滿第一畫面、頂欄一列、輪播9件。舊列按明列版本保留，未重新全站驗收。' };
const ev = ['REPORT.md', 'guard.json', 'fit-probe.js', 'test-draw-command.json', 'test-guide-command.json', 'test-all-command.json'].map(f => dir + '/' + f);
ev.forEach(f => assert.ok(fs.existsSync(f), f));
const patch = {
  'student-work-draw': ' 8902第四輪：輪播9件（放回喀嚓、冤枉汪，移除伏末）；海報首頁拿掉集中線、碰！、PRESS START、章節章與頂上泡泡；桌面海報區依視窗高度塞滿第一畫面（1920/1440/1366/1280實測），頂欄放得下時改一列；1440中英日×9張27/27避讓通過、1366中文9/9。手機海報區超出一個畫面約70px。僅主控窄驗，非使用者確認。'
};
v.checks = base.checks.map(c => patch[c.id] ? { ...c, reason: c.reason + patch[c.id], evidence: [...c.evidence, dir + '/REPORT.md', dir + '/browser.json', dir + '/catalog-proof.json'] } : c);
const changed = ['data/student-work-draw.json', 'tests/student-work-draw.test.cjs', 'student-work-draw-model.js', 'student-work-draw.jsx', 'student-work-draw.css', 'styles.css', 'chapters-1.jsx'];
const add = new Set([...ev, ...changed, site + '/index.html', site + '/data/student-work-draw.json']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return changed.includes(s.file) && fs.existsSync(s.file) ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
