// 把 CI 保護基準更新為「核准後內容」：先證明與舊基準的差異只有核准項目，才寫新指紋；測試改回不依賴 git 歷史的單純指紋比對
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), { execFileSync } = require('child_process');
process.chdir(path.resolve(__dirname, '..'));
const hash = s => crypto.createHash('sha256').update(s.replace(/\r\n/g, '\n')).digest('hex');
const basePath = 'tests/production-baseline.json', baseline = JSON.parse(fs.readFileSync(basePath, 'utf8'));
// 1) labs.json：還原「周邊→週邊」後必須等於舊基準
const labs = fs.readFileSync('data/labs.json', 'utf8');
assert.equal(labs.split('周邊商品設計實驗室').length - 1, 2);
assert.equal(hash(labs.split('周邊商品設計實驗室').join('週邊商品設計實驗室')), baseline.data['labs.json'], 'labs differs beyond 週邊→周邊');
// 2) admission.json：舊分支測試邏輯（已審核欄位）＋進修部 evening 卡 16 欄（使用者 2026-10-25 核准）
const oldAdm = execFileSync('git', ['show', '904ac79937407d748e1bfdbce22517d38acbf8f3:data/admission.json'], { encoding: 'utf8' });
assert.equal(hash(oldAdm), baseline.data['admission.json']);
const expected = JSON.parse(oldAdm);
for (const c of require(path.resolve('holiday-lab/translation-review/followup/exact-plan.json')).changes.filter(c => c.file === 'data/admission.json')) { const k = c.pointer.slice(1).split('/'), last = k.pop(); let t = expected; for (const x of k) t = t[x]; assert.equal(t[last], c.old); t[last] = c.new; }
const sel = require(path.resolve('holiday-lab/translation-review/selection-eligibility/exact-plan.json')).changes.find(c => c.file === 'data/admission.json');
expected.find(x => x.slug === 'selection').content = sel.new;
const current = JSON.parse(fs.readFileSync('data/admission.json', 'utf8'));
const ei = expected.findIndex(x => x.slug === 'evening'); assert.equal(current[ei].slug, 'evening');
expected[ei] = current[ei];
assert.deepEqual(current, expected, 'admission differs beyond reviewed fields and the approved evening card');
// 3) news.json：分支測試已驗證只差日本合作公司名稱；這裡重驗舊基準＋兩處替換
const oldNews = execFileSync('git', ['show', '904ac79937407d748e1bfdbce22517d38acbf8f3:data/news.json'], { encoding: 'utf8' });
assert.equal(hash(oldNews), baseline.data['news.json']);
const news = JSON.parse(oldNews);
news[4].content = news[4].content.replace('「オートクチュール株式会社」', '「株式会社オートクチュール」');
news[16].content = news[16].content.replace('オートクチュール株式会社（Hautecouture Inc.', '株式会社オートクチュール（hautecouture Inc.');
assert.deepEqual(JSON.parse(fs.readFileSync('data/news.json', 'utf8')), news, 'news differs beyond the verified partner name');
// 4) 其餘檔案必須仍等於舊基準
for (const [f, d] of Object.entries(baseline.data)) if (!['labs.json', 'admission.json', 'news.json'].includes(f)) assert.equal(hash(fs.readFileSync('data/' + f, 'utf8')), d, f);
// 寫新基準（保留舊指紋與核准紀錄）
const next = { data: { ...baseline.data }, style: baseline.style, approvals: baseline.approvals || [] };
for (const f of ['labs.json', 'admission.json', 'news.json']) {
  const d = hash(fs.readFileSync('data/' + f, 'utf8'));
  if (d !== baseline.data[f]) next.approvals.push({ file: f, from: baseline.data[f], to: d, date: '2026-10-25', approved_by: '使用者於對話確認', change: { 'labs.json': '「週邊商品設計實驗室」改「周邊商品設計實驗室」（2 處）', 'admission.json': '已審核欄位（followup、selection-eligibility exact-plan）＋進修部 evening 卡 16 欄採用 4f0b1969 新版', 'news.json': '日本合作公司名稱改為「株式会社オートクチュール」（2 處，先前已核准）' }[f] });
  next.data[f] = d;
}
fs.writeFileSync(basePath, JSON.stringify(next, null, 2) + '\n');
// 測試改回線上 main 的單純指紋比對（GitHub 淺複製讀不到舊 commit）
const tf = 'tests/shared-language.test.cjs', t = fs.readFileSync(tf, 'utf8');
const start = t.indexOf("test('Canonical Chinese data preserve published updates except reviewed admissions"), end = t.indexOf("test('English translation contains the shared navigation and footer'");
assert.ok(start > 0 && end > start);
const simple = "test('Canonical Chinese data preserve published updates',()=>{const crypto=require('node:crypto');const baseline=require('./production-baseline.json');for(const [file,digest]of Object.entries(baseline.data))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('data/'+file,'utf8').replace(/\\r\\n/g,'\\n')).digest('hex'),digest,file);});\n";
fs.writeFileSync(tf, t.slice(0, start) + simple + t.slice(end));
console.log(JSON.stringify({ approvals: next.approvals.map(a => a.file) }));
