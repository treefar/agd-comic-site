// 檢查 gen.js 產出的 WordPress 頁面內容，並輸出本機預覽 wp-sync/dist/preview.html
// 用法：node wp-sync/check.mjs   → 全過離開碼 0，有錯離開碼 1
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const gen = require('./gen.js');
const load = (n) => JSON.parse(readFileSync(join(here, '..', 'data', n + '.json'), 'utf8'));
const D = { faculty: load('faculty'), labs: load('labs'), admission: load('admission'), curriculum: load('curriculum'), stats: load('stats') };

const { pages, widget } = gen.buildAll(D);
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

// 1. 頁面編號不可重複
const ids = pages.map((x) => x.id);
ok(new Set(ids).size === ids.length, '頁面編號有重複：' + ids.filter((v, i) => ids.indexOf(v) !== i).join(','));

// 2. 每位老師、每間有 WordPress 頁的實驗室都要涵蓋
for (const f of D.faculty) ok(ids.includes(f.id), `漏了老師 ${f.name}（${f.id}）`);
for (const [code, id] of Object.entries(gen.LAB_PAGE)) ok(ids.includes(id), `漏了實驗室 ${code}（${id}）`);

for (const x of [...pages, { id: widget.id, label: '小工具', html: widget.html }]) {
  const h = x.html;
  // 3. 不能有會被 WordPress 濾掉的標籤
  ok(!/<(script|style|iframe|embed|object|form|input)\b/i.test(h), `${x.label} 含禁用標籤`);
  // 4. 每張圖都要有非空的 alt
  for (const tag of h.match(/<img\b[^>]*>/gi) || []) ok(/\balt="[^"]+"/.test(tag), `${x.label} 有圖片沒 alt：${tag.slice(0, 80)}`);
  // 5. 不能出現 undefined / null / [object 這類程式漏字
  ok(!/undefined|\bnull\b|\[object /.test(h), `${x.label} 出現程式漏字`);
  // 6. 不能是空內容，且要有資料來源行
  ok(h.replace(/<[^>]+>/g, '').trim().length > 30, `${x.label} 內容太少`);
  if (x.id !== widget.id) ok(/資料來源：/.test(h), `${x.label} 缺資料來源行`);
  // 7. 標籤要成對（粗略：開關數一致）
  for (const t of ['p', 'ul', 'li', 'table', 'tr', 'h2', 'h3']) {
    const open = (h.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length;
    const close = (h.match(new RegExp(`</${t}>`, 'g')) || []).length;
    ok(open === close, `${x.label} <${t}> 開關不成對（${open}/${close}）`);
  }
}
// 8. 115 學年度招生頁（參訪除外）都要有「已結束」提示
for (const id of [7139, 6906, 6926, 6908, 6919, 1952, 2001]) {
  const x = pages.find((y) => y.id === id);
  ok(x && /115 學年度招生已結束/.test(x.html), `招生頁 ${id} 缺「115 學年度招生已結束」提示`);
}
ok(!/115 學年度招生已結束/.test(pages.find((y) => y.id === 3138).html), '參訪頁不應出現招生已結束提示');
// 9. 小工具不可再出現舊系名
ok(!/數位科技與遊戲設計系/.test(widget.html), '小工具還有舊系名');

// 預覽頁
mkdirSync(join(here, 'dist'), { recursive: true });
const preview = `<!doctype html><meta charset="utf-8"><title>WP 同步預覽</title>
<style>body{font:16px/1.7 system-ui;max-width:900px;margin:24px auto;padding:0 16px}section{border:3px solid #000;margin:24px 0;padding:12px 20px}table{border-collapse:collapse}td,th{border:1px solid #999;padding:4px 6px;font-size:13px}img{max-width:240px}.id{font:12px monospace;color:#666}</style>
${[{ id: widget.id, label: '小工具 系所簡介', html: widget.html }, ...pages].map((x) => `<section><div class="id">#${x.id} ${x.label}</div>${x.html}</section>`).join('\n')}`;
writeFileSync(join(here, 'dist', 'preview.html'), preview, 'utf8');
writeFileSync(join(here, 'dist', 'pages.json'), JSON.stringify({ pages, widget }, null, 1), 'utf8');

if (fails.length) { console.error(`FAIL ${fails.length} 項：\n- ` + fails.join('\n- ')); process.exit(1); }
console.log(`PASS ${pages.length} 頁＋1 小工具，預覽 wp-sync/dist/preview.html`);
