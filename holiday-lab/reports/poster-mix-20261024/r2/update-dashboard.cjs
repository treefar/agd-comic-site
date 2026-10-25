// 第二輪：以 poster-mix verification 為基底，更新相關列並把儀表板權威指向 8900 建置
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r2', out = dir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
assert.ok(!fs.existsSync(out), 'verification.json 已存在，不覆寫');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/poster-mix-20261024/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-03';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8900, baseline_site: base.site,
  baseline_note: '第二輪套用使用者選的Fable顧問8項：手機選單LINE、桌面浮動鈕避讓面板、頂欄改導管道測驗、招生區可用按鈕、手機海報集中線、面板字級、指南搜尋分詞同義詞與位置、移除對外內部用語；海報改本機檔。舊列按明列版本保留，未重新全站驗收。' };
const ev = ['REPORT.md', 'browser.json', 'guard.json', 'test-draw-command.json', 'test-guide-command.json', 'test-all-command.json'].map(f => dir + '/' + f);
ev.forEach(f => assert.ok(fs.existsSync(f), f));
const r2 = ' 8900第二輪：';
const patch = {
  'student-work-draw': r2 + '海報改本機images/news/7200-obsessive-reality.jpg；手機hero集中線0.06、署名12/13px、按鈕13px；桌面1440中英日29步捲動面板三控制項0次被擋。',
  'floating-cta': r2 + '面板在畫面內時桌面浮動鈕避讓（pointer-events:none），滑過海報後恢復；1366只驗頁頂。',
  'mobile-nav': r2 + '手機選單尾加LINE聯絡系主任，375寬實測可見。',
  'guide-index': r2 + '搜尋列移到分類索引上方（y1157→485），空白分詞AND與3組同義詞，常用項目不再固定藍底；新增2回歸測試。',
  'page-bottom': r2 + '移除對外「節日試作暫緩」字樣，策展入口保留。'
};
v.checks = base.checks.map(c => patch[c.id] ? { ...c, reason: c.reason + patch[c.id], evidence: [...c.evidence, dir + '/REPORT.md', dir + '/browser.json'] } : c);
assert.equal(Object.keys(patch).filter(id => !v.checks.some(c => c.id === id)).length, 0, 'patched ids must exist');
const changed = ['data/student-work-draw.json', 'tests/student-work-draw.test.cjs', 'tests/student-guide.test.cjs', 'student-guide-model.js', 'student-guide.jsx', 'student-guide.css', 'student-work-draw.jsx', 'student-work-draw.css', 'comic-components.jsx', 'chapters-2.jsx', 'holiday-home.jsx', 'styles.css', 'scripts/build.mjs'];
const add = new Set([...ev, ...changed, 'images/news/7200-obsessive-reality.jpg', site + '/index.html', site + '/data/student-work-draw.json', site + '/images/news/7200-obsessive-reality.jpg']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return changed.includes(s.file) && fs.existsSync(s.file) ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
