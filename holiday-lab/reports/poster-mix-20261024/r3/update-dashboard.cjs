// 第三輪：以第二輪 verification 為基底，更新抽選列，儀表板權威改指向 poster-avoid-20261024
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r3', outDir = 'holiday-lab/reports/poster-avoid-20261024', out = outDir + '/verification.json', policyFile = 'holiday-lab/dashboard/progress-policy.json';
assert.ok(!fs.existsSync(out), 'verification.json 已存在，不覆寫');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const base = JSON.parse(fs.readFileSync('holiday-lab/reports/fable-polish-20261024/verification.json', 'utf8'));
const site = '.measure-poster-mix-20261024-09';
const v = { ...base, observed_utc: new Date().toISOString(), site, port: 8902, baseline_site: base.site,
  baseline_note: '第三輪：喀嚓、冤枉汪換成2023年《龍戰於前》《伏末》（系官網報導原圖）；桌面≥1181px標題與按鈕依主體位置自動縮到空位。舊列按明列版本保留，未重新全站驗收。' };
const ev = ['REPORT.md', 'browser.json', 'guard.json', 'catalog-proof.json', 'test-draw-command.json', 'test-guide-command.json', 'test-all-command.json', 'saliency-probe.js', 'layout-probe.js'].map(f => dir + '/' + f);
ev.forEach(f => assert.ok(fs.existsSync(f), f));
const patch = {
  'student-work-draw': ' 8902第三輪：輪播改為今食堂、葛柏TV秀、龍戰於前(2023)、癡迷的現實、癒光之音、Dear All Robots、競箱團、伏末(2023)；桌面1440中英日×8張24/24標題不壓主體、按鈕與右下面板不重疊；1280中文7/8（伏末超門檻0.002）；單元測試12/12。僅主控窄驗，非使用者確認。',
  'art-original': ' 8902：新增兩件2023年作品圖取自系官網報導原圖未修改，署名依報導原文；沒有AI生成。',
  'art-provenance': ' 8902：新增三張輪播圖（兩張官網報導原圖、一張YouTube官方縮圖下載）來源與SHA已記錄，仍不代表全站素材權利已核。'
};
v.checks = base.checks.map(c => patch[c.id] ? { ...c, reason: c.reason + patch[c.id], evidence: [...c.evidence, dir + '/REPORT.md', dir + '/browser.json', dir + '/catalog-proof.json'] } : c);
const changed = ['data/student-work-draw.json', 'tests/student-work-draw.test.cjs', 'student-work-draw-model.js', 'student-work-draw.jsx', 'student-work-draw.css'];
const add = new Set([...ev, ...changed, 'images/news/2023-design-awards/dragon-before-us.jpg', 'images/news/2023-design-awards/fumo.jpg', site + '/index.html', site + '/data/student-work-draw.json']);
const seen = new Set();
v.sources = base.sources.map(s => { seen.add(s.file); return changed.includes(s.file) && fs.existsSync(s.file) ? { file: s.file, bytes: fs.statSync(s.file).size, sha256: sha(s.file) } : s; });
for (const f of add) if (!seen.has(f)) v.sources.push({ file: f, bytes: fs.statSync(f).size, sha256: sha(f) });
fs.writeFileSync(out, JSON.stringify(v, null, 2) + '\n');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
policy.latest_local_review = site; policy.dashboard_state_file = out;
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ checks: v.checks.length, yes: v.checks.filter(c => c.result === 'yes').length, no: v.checks.filter(c => c.result === 'no').length, sources: v.sources.length }));
