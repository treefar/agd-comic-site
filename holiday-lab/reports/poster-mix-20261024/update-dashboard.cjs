// 以 poster-corner 階段 verification 為基底，產生本階段（8898 輪播換圖）的 verification.json，並把儀表板權威指向它
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024', out = dir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
assert.ok(!fs.existsSync(out), 'verification.json 已存在，不覆寫');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/poster-corner-20261024/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-01';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8898, baseline_site: base.site,
  baseline_note: '本次只換首頁輪播作品：拿掉小颯原畫（首頁右側原有小颯格子保留），加入《癡迷的現實》，八件依吸引高中生排序；產品僅改data/student-work-draw.json與回歸測試。舊列按明列版本保留，未重新全站驗收。' };
const evidence = ['REPORT.md', 'browser.json', 'guard.json', 'test-draw-command.json', 'takeover-check-command.json', 'stats-en-command.json', 'data-regression-command.json'].map(f => dir + '/' + f);
evidence.forEach(f => assert.ok(fs.existsSync(f), f));
v.checks = base.checks.map(c => {
  if (c.id === 'student-work-draw') return { ...c, reason: '8898輪播換圖：使用者裁定拿掉小颯、增加不同畫風；改為今食堂、葛柏TV秀、喀嚓、癡迷的現實、癒光之音、Dear All Robots、競箱團、冤枉汪八件，署名與連結逐筆對data/news.json。Node 10pass、10組抽選相鄰不重複、Build exit0；Chrome中文1440輪播一圈8件無小颯、英日375無橫溢且日文實點停格。《癡迷的現實》用YouTube遠端縮圖。僅主控窄驗，非使用者確認或全站批准。8897清晰海報與右下面板參數不變。', evidence: [dir + '/REPORT.md', dir + '/browser.json', dir + '/test-draw-command.json'] };
  if (c.id === 'art-original') return { ...c, reason: c.reason + ' 8898：小颯原圖檔與首頁右側原畫格保留，只從輪播移除；輪播八件皆既有學生作品與原署名，原圖SHA未改。', evidence: [...c.evidence, dir + '/guard.json'] };
  return c;
});
// 來源 SHA：重算既有綁定中已變更者，並加入本階段證據與新建置的抽選資料
const add = new Set([...evidence, 'data/student-work-draw.json', 'tests/student-work-draw.test.cjs', site + '/data/student-work-draw.json', site + '/index.html', site + '/student-work-draw.css']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return fs.existsSync(s.file) && (s.file === 'data/student-work-draw.json' || s.file === 'tests/student-work-draw.test.cjs') ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
