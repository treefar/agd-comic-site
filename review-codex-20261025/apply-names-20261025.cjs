// 使用者 2026-10-25 指定：喀嚓英文名統一為 Kacha；《人造人》組員正確為「陳政名」（英 Chen Zheng-ming）
// 每項替換先核對出現次數，任何一項不符就整批不寫入
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '..'));
const plan = [
  ['data/en/faculty.json', 'Supervised Click (《喀嚓》)', 'Supervised Kacha (《喀嚓》)', 1],
  ['data/works.json', '陳政民', '陳政名', 1],
  ['data/en/works.json', 'Chen Zheng-min (陳政民)', 'Chen Zheng-ming (陳政名)', 1],
  ['data/en/stats.json', 'Chen Cheng-ming (陳政名)', 'Chen Zheng-ming (陳政名)', 1],
  ['data/ja/messages.json', '陳政民', '陳政名', 4],
  ['data/news.json', '陳政民', '陳政名', 1],
  ['data/en/news.json', 'Chen Zheng-min (陳政民)', 'Chen Zheng-ming (陳政名)', 1],
];
const files = new Map();
for (const [f, from, to, n] of plan) {
  const text = files.get(f) ?? fs.readFileSync(f, 'utf8'), hits = text.split(from).length - 1;
  assert.equal(hits, n, `${f}: "${from}" expected ${n}, got ${hits}`);
  files.set(f, text.split(from).join(to));
}
for (const [f, text] of files) { if (f.endsWith('.json')) JSON.parse(text); fs.writeFileSync(f, text); }
console.log(JSON.stringify({ changed: [...files.keys()] }));
