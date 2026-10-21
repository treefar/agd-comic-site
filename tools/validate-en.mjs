// 驗證 agy 的英文 JSON：結構一致、受保護欄位原樣、無殘留漢字、數字都在
// 用法：node validate.mjs [檔名...]（預設全部）
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(import.meta.dirname, '../') + '/';
const PROTECTED = new Set(['id', 'slug', 'key', 'code', 'color', 'tier', 'rank', 'date', 'ext', 'email', 'phone', 'photo', 'photoFallback', 'image', 'imageFallback', 'imageFit', 'url', 'href', 'link', 'newsId', 'hideImage', 'capstone', 'mark', 'en', 'nameEn', 'titleEn', 'tagline']);
const CJK = /[\u3400-\u9fff\u3040-\u30ff\uff00-\uffef]/;

// 允許括號 () 與書名號 《》 內的原文
function stripAllowed(s) {
  return s.replace(/\([^()]*\)/g, '').replace(/（[^（）]*）/g, '').replace(/《[^《》]*》/g, '').replace(/\[CHECK\]/g, '');
}

function walk(a, b, path, key, errs) {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null) !== (b === null)) {
    errs.push(`型別不同 ${path}`); return;
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { errs.push(`陣列長度 ${path}: ${a.length} → ${b.length}`); return; }
    a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`, key, errs));
  } else if (a && typeof a === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.join('|') !== kb.join('|')) { errs.push(`鍵不同 ${path}: ${ka.filter((k) => !kb.includes(k)).join(',')} / 多出 ${kb.filter((k) => !ka.includes(k)).join(',')}`); return; }
    for (const k of ka) walk(a[k], b[k], `${path}.${k}`, k, errs);
  } else if (typeof a === 'string') {
    if (PROTECTED.has(key)) { if (a !== b) errs.push(`受保護欄位被改 ${path}: ${JSON.stringify(a).slice(0, 40)} → ${JSON.stringify(b).slice(0, 40)}`); return; }
    if (!CJK.test(a)) { if (a !== b && !/^[\d\s.,:;%$/+\-–—~()]*$/.test(a)) errs.push(`純英文原值被改 ${path}`); return; }
    if (CJK.test(stripAllowed(b))) errs.push(`殘留漢字 ${path}: ${stripAllowed(b).match(/.{0,12}[\u3400-\u9fff\u3040-\u30ff\uff00-\uffef].{0,12}/)?.[0]}`);
    const nums = a.match(/\d+(?:[.,]\d+)*/g) || [];
    for (const n of nums) if (!b.includes(n.replace(/,/g, '')) && !b.includes(n)) { errs.push(`數字遺失 ${path}: ${n}`); break; }
  } else if (a !== b) errs.push(`非字串值被改 ${path}: ${a} → ${b}`);
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir + 'data/en').filter((n) => n.endsWith('.json'));
let bad = 0;
for (const n of names) {
  const f = n.endsWith('.json') ? n : n + '.json';
  const outPath = dir + 'data/en/' + f;
  if (!fs.existsSync(outPath)) { console.log(`${f}\tMISSING`); bad++; continue; }
  let a, b;
  try { a = JSON.parse(fs.readFileSync(dir + 'data/' + f, 'utf8').replace(/^\uFEFF/, '')); b = JSON.parse(fs.readFileSync(outPath, 'utf8').replace(/^\uFEFF/, '')); }
  catch (e) { console.log(`${f}\tJSON 解析失敗: ${e.message}`); bad++; continue; }
  const errs = [];
  walk(a, b, '$', '', errs);
  const checks = (fs.readFileSync(outPath, 'utf8').match(/\[CHECK\]/g) || []).length;
  console.log(`${f}\t${errs.length ? 'FAIL ' + errs.length : 'PASS'}\t[CHECK]=${checks}`);
  errs.slice(0, 12).forEach((e) => console.log('   - ' + e));
  if (errs.length) bad++;
}
process.exit(bad ? 1 : 0);
