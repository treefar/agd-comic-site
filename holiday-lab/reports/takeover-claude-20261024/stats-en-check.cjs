// 唯讀：英文 stats 清單縮短，是對齊中文，還是英文版掉資料？
const cp = require('child_process'), fs = require('fs'), path = require('path');
process.chdir(path.resolve(__dirname, '../../..'));
const show = f => JSON.parse(cp.execFileSync('git', ['-c', 'core.longpaths=true', 'show', 'origin/main:' + f], { encoding: 'utf8', maxBuffer: 1 << 27 }).replace(/^﻿/, ''));
const cur = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, ''));
const by = a => Array.isArray(a) ? Object.fromEntries(a.map(x => [x.slug, x])) : a;
const sets = { zhOld: by(show('data/stats.json')), zhNew: by(cur('data/stats.json')), enOld: by(show('data/en/stats.json')), enNew: by(cur('data/en/stats.json')) };
const shape = s => ['awards', 'honors'].map(k => k + ':' + (s[k]?.groups || []).map(g => g.items.length).join(',')).join(' | ');
const out = {};
for (const [k, s] of Object.entries(sets)) out[k] = shape(s);
out.zh_unchanged = out.zhOld === out.zhNew;
out.en_new_shape_equals_zh = out.enNew === out.zhNew;
out.en_old_shape_equals_zh = out.enOld === out.zhNew;
const total = s => ['awards', 'honors'].reduce((a, k) => a + (s[k]?.groups || []).reduce((b, g) => b + g.items.length, 0), 0);
out.totals = Object.fromEntries(Object.entries(sets).map(([k, s]) => [k, total(s)]));
console.log(JSON.stringify(out, null, 1));
