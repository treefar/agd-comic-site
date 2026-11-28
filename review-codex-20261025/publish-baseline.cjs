// 發布資料夾：保護測試改回不依賴 holiday-lab 與 git 歷史的單純指紋比對；news／admission 的核准內容記進基準
// 前提：發布準備分支的嚴格測試（含 holiday-lab exact-plan 核對）已 9/9 通過，代表差異只有核准項目
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const dest = process.argv[2]; if (!dest) throw Error('Usage: publish-baseline.cjs <publish-dir>'); process.chdir(dest);
const hash = s => crypto.createHash('sha256').update(s.replace(/\r\n/g, '\n')).digest('hex');
const basePath = 'tests/production-baseline.json', b = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const notes = {
  'news.json': '日本合作公司名稱改為「株式会社オートクチュール」（2 處，先前核准）；《人造人》組員「陳政民」→「陳政名」（2026-10-25 使用者確認）',
  'admission.json': '已審核欄位（followup、selection-eligibility exact-plan）＋進修部 evening 卡採用 4f0b1969 新版（2026-10-25 使用者確認）'
};
for (const f of Object.keys(notes)) {
  const d = hash(fs.readFileSync('data/' + f, 'utf8'));
  if (d !== b.data[f]) { b.approvals.push({ file: f, from: b.data[f], to: d, date: '2026-10-25', approved_by: '使用者於對話確認', change: notes[f] }); b.data[f] = d; }
}
for (const [f, d] of Object.entries(b.data)) assert.equal(hash(fs.readFileSync('data/' + f, 'utf8')), d, f);
fs.writeFileSync(basePath, JSON.stringify(b, null, 2) + '\n');
const tf = 'tests/shared-language.test.cjs', t = fs.readFileSync(tf, 'utf8');
const start = t.indexOf("test('Canonical Chinese data preserve published updates except reviewed admissions"), end = t.indexOf("test('English translation contains the shared navigation and footer'");
assert.ok(start > 0 && end > start, 'test anchors');
const simple = "test('Canonical Chinese data preserve published updates',()=>{const crypto=require('node:crypto');const baseline=require('./production-baseline.json');for(const [file,digest]of Object.entries(baseline.data))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('data/'+file,'utf8').replace(/\\r\\n/g,'\\n')).digest('hex'),digest,file);});\n";
const next = t.slice(0, start) + simple + t.slice(end);
assert.ok(!next.includes('holiday-lab') && !next.includes('execFileSync'), 'test still depends on holiday-lab or git history');
fs.writeFileSync(tf, next);
console.log(JSON.stringify({ approvals: b.approvals.map(a => a.file) }));
