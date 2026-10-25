// 資料引用的 images/ 檔必須已被 git 追蹤：2026-10-25 輪播海報只在本機、從未 commit，直到 CI 才抓到
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
test('every images/ path referenced by data/*.json is tracked by git', () => {
  const tracked = new Set(execFileSync('git', ['ls-files', '-z', '--', 'images'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean));
  const refs = new Set();
  const collect = x => { if (typeof x === 'string') { if (/^images\//.test(x)) refs.add(x.split(/[?#]/)[0]); } else if (Array.isArray(x)) x.forEach(collect); else if (x && typeof x === 'object') Object.values(x).forEach(collect); };
  const walk = dir => { for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) { const p = dir + '/' + e.name; if (e.isDirectory()) walk(p); else if (p.endsWith('.json')) collect(JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))); } };
  walk('data');
  assert.ok(refs.size > 0, 'expected image references in data');
  assert.deepEqual([...refs].filter(f => !tracked.has(f)), [], 'referenced images not committed');
});
