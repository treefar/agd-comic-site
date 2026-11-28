// 依使用者 2026-10-25 對話決定修正上線內容；每項替換先核對出現次數，任何一項不符就整批不寫入
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '..'));
const plan = [
  // E03 教師英文名統一為師資頁拼法（TENG, SHU-YUAN／CHEN, MEI-JUNG／YANG, CHIH-CHANG）
  ...['data/en/news.json', 'data/en/works.json', 'data/en/stats.json', 'data/en/ui.json'].flatMap(f => [
    [f, 'Deng Shu-yuan', 'Teng Shu-yuan'], [f, 'Chen Mei-rong', 'Chen Mei-jung'], [f, 'Yang Zhi-zhang', 'Yang Chih-chang']]),
  // E02 非應屆生
  ['data/en/admission.json', 'Personal data registration for non-graduating students', 'Personal data registration for graduates from previous years', 1],
  // E09 官網 → 公式サイト
  ['data/ja/flow-ui.json', '（官網掲載版：', '（公式サイト掲載版：', 2],
  // E08 英文敘述後重複的整句中文
  ['data/en/stats.json', 'Suspended due to Covid-19 (因 Covid-19 暫緩)', 'Suspended due to Covid-19', 1],
  ['data/en/stats.json', 'Inviting international experts to offer workshops (including creators from South Korea and Japan) (邀請國際專家開設工作坊 - 含韓國、日本創作者)', 'Inviting international experts to offer workshops (including creators from South Korea and Japan)', 1],
  // E10 94% 含服役與出國升學 → placement rate
  ['data/en/stats.json', '"title": "Graduate Career Paths · Employment Performance"', '"title": "Graduate Career Paths · Placement Outcomes"', 1],
  ['data/en/stats.json', 'AY 109-112 · Average Employment Rate 94%', 'AY 109-112 · Average Placement Rate 94% (employment, military service, study abroad and freelancing)', 1],
  ['data/en/stats.json', 'show an average employment rate of 94%', 'show an average placement rate of 94%', 1],
  ['data/en/stats.json', '"year": "Average Employment Rate"', '"year": "Average Placement Rate"', 1],
  ['data/en/stats.json', 'College · Employment Rate ', 'College · Placement Rate ', 8],
  ['data/en/stats.json', '"note": "Employment Rate = (Employed', '"note": "Placement Rate = (Employed', 1],
  ['data/en/ui.json', '"畢業就業比": "graduate employment"', '"畢業就業比": "graduate placement"', 1],
  // E11 週邊 → 周邊（中文原文與日文查詢鑰匙一起改，日文才對得上）
  ['data/labs.json', '週邊商品設計實驗室', '周邊商品設計實驗室', 2],
  ['chapters-2.jsx', '週邊商品設計實驗室', '周邊商品設計實驗室', 1],
  ['data/ja/messages.json', '週邊商品設計實驗室', '周邊商品設計實驗室', 2],
  // E01 在校指南公開：拿掉「本頁為審閱版本」（中文原文、英文與日文鑰匙及譯文）
  ['student-guide.jsx', '尚未取得的當期規定保留提醒。本頁為審閱版本。', '尚未取得的當期規定保留提醒。', 1],
];
const counts = { 'Deng Shu-yuan': 9, 'Chen Mei-rong': 30, 'Yang Zhi-zhang': 3 };
const files = new Map(), seen = {};
for (const [f, from, to, n] of plan) {
  const text = files.get(f) ?? fs.readFileSync(f, 'utf8'), hits = text.split(from).length - 1;
  if (n !== undefined) assert.equal(hits, n, `${f}: "${from}" expected ${n}, got ${hits}`);
  else seen[from] = (seen[from] || 0) + hits;
  files.set(f, text.split(from).join(to));
}
for (const [k, n] of Object.entries(counts)) assert.equal(seen[k], n, `${k} expected ${n}, got ${seen[k]}`);
// 英日指南頁尾譯文：鑰匙是整句中文，要連鑰匙一起換
const guideKeyOld = s => s.includes('本頁為審閱版本');
for (const [f, dropEn] of [['data/en/student-guide-ui.json', /\s*This page is a review draft\.?/], ['data/ja/messages.json', /\s*なお、本ページはレビュー版です。?/]]) {
  const obj = JSON.parse(files.get(f) ?? fs.readFileSync(f, 'utf8')), keys = Object.keys(obj).filter(guideKeyOld);
  assert.equal(keys.length, 1, f + ' review key count');
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k !== keys[0]) { out[k] = v; continue; }
    const nv = v.replace(dropEn, '');
    assert.notEqual(nv, v, f + ' review sentence not found in value');
    out[k.replace('本頁為審閱版本。', '')] = nv;
  }
  files.set(f, JSON.stringify(out, null, 2) + '\n');
}
for (const [f, text] of files) { if (f.endsWith('.json')) JSON.parse(text); fs.writeFileSync(f, text); }
console.log(JSON.stringify({ files: [...files.keys()], names: seen }));
