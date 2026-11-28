// 唯讀：比對 origin/main 與目前版本 data/**/*.json，找「被刪掉的鍵／陣列項目」
// 只增不減的判準：舊版有的鍵、有 slug 的項目，新版都還在（值可以被修正，但要列出來讓人看）
const cp = require('child_process'), fs = require('fs'), path = require('path');
process.chdir(path.resolve(__dirname, '../../..'));
const git = a => cp.execFileSync('git', ['-c', 'core.longpaths=true', ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });
const files = git(['ls-tree', '-r', '--name-only', 'origin/main', '--', 'data']).split('\n').filter(f => f.endsWith('.json'));
const report = { files: files.length, removed: [], changed_values: 0, per_file: {} };

function walk(o, n, p, f) {
  if (Array.isArray(o)) {
    if (!Array.isArray(n)) { report.removed.push({ file: f, at: p, why: 'array->non-array' }); return; }
    const keyOf = x => (x && typeof x === 'object') ? (x.slug ?? x.id ?? x.key ?? null) : null;
    if (o.length && o.every(x => keyOf(x) !== null)) {
      const nk = new Map(n.map(x => [keyOf(x), x]));
      for (const x of o) { const k = keyOf(x); if (!nk.has(k)) report.removed.push({ file: f, at: p + '[' + k + ']', why: 'item missing' }); else walk(x, nk.get(k), p + '[' + k + ']', f); }
    } else if (o.length > n.length) {
      report.removed.push({ file: f, at: p, why: 'array shorter ' + o.length + '->' + n.length });
      for (let i = 0; i < Math.min(o.length, n.length); i++) walk(o[i], n[i], p + '[' + i + ']', f);
    } else for (let i = 0; i < o.length; i++) walk(o[i], n[i], p + '[' + i + ']', f);
  } else if (o && typeof o === 'object') {
    if (!n || typeof n !== 'object' || Array.isArray(n)) { report.removed.push({ file: f, at: p, why: 'object->other' }); return; }
    for (const k of Object.keys(o)) { if (!(k in n)) report.removed.push({ file: f, at: p + '.' + k, why: 'key missing' }); else walk(o[k], n[k], p + '.' + k, f); }
  } else if (o !== n) { report.changed_values++; report.per_file[f] = (report.per_file[f] || 0) + 1; }
}

for (const f of files) {
  if (!fs.existsSync(f)) { report.removed.push({ file: f, at: '', why: 'file missing' }); continue; }
  let o, n;
  try { o = JSON.parse(git(['show', 'origin/main:' + f]).replace(/^﻿/, '')); n = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch (e) { report.removed.push({ file: f, at: '', why: 'parse ' + e.message }); continue; }
  walk(o, n, '', f);
}
console.log(JSON.stringify({ files: report.files, removed_count: report.removed.length, changed_values: report.changed_values, per_file_changed_values: report.per_file, removed: report.removed.slice(0, 60) }, null, 1));
process.exitCode = report.removed.length ? 1 : 0;
