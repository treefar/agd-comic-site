// 校園花絮回歸測試：資料檔結構、照片檔存在、封面、分類、三語翻譯、選單與路由
// 需先跑 npm run build（產生 locale-en.js / locale-ja.js），與 CI 其他測試相同
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const CJK = /[㐀-鿿]/;
const KANA = /[぀-ヿ]/;
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const campus = JSON.parse(fs.readFileSync('data/campus.json', 'utf8'));
const CATEGORY_SLUGS = ['student-activities', 'student-association'];
const CATEGORY_LABELS = ['學生活動', '系學會剪影'];

const loadMessages = (file, name) => { const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(file, 'utf8') + ';this.m=' + name, ctx); return ctx.m; };
const zhStringsOf = (x, out = new Set()) => {
  if (typeof x === 'string' && CJK.test(x)) out.add(norm(x));
  else if (Array.isArray(x)) x.forEach((v) => zhStringsOf(v, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => zhStringsOf(v, out));
  return out;
};
// pages.jsx 校園花絮區段的中文字面值（JSX 文字與字串）
const campusUiStrings = () => {
  const src = fs.readFileSync('pages.jsx', 'utf8').replace(/\r\n/g, '\n');
  const a = src.indexOf('CAMPUS-LIFE-BEGIN'), b = src.indexOf('// CAMPUS-LIFE-END');
  assert.ok(a > 0 && b > a, 'pages.jsx 找不到校園花絮區段標記');
  const block = src.slice(src.lastIndexOf('\n', a), b);
  const { parse } = require('@babel/parser');
  const out = new Set();
  (function visit(x) {
    if (!x || typeof x !== 'object') return;
    if (x.type === 'StringLiteral' || x.type === 'JSXText' || x.type === 'TemplateElement') {
      const v = x.type === 'TemplateElement' ? x.value.cooked : x.value;
      if (v && CJK.test(v)) out.add(norm(v));
    }
    for (const [k, v] of Object.entries(x)) {
      if (['loc', 'start', 'end', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(k)) continue;
      if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v === 'object') visit(v);
    }
  })(parse(block, { sourceType: 'script', plugins: ['jsx'] }));
  return out;
};

test('campus.json 是 UTF-8 無 BOM、LF 換行', () => {
  for (const f of ['data/campus.json', 'data/en/campus.json']) {
    const buf = fs.readFileSync(f);
    assert.notDeepEqual([...buf.subarray(0, 3)], [0xef, 0xbb, 0xbf], f + ' 有 BOM');
    assert.ok(!buf.includes('\r'), f + ' 含 CR');
  }
});

test('分類只有學生活動與系學會剪影兩種', () => {
  assert.deepEqual(campus.categories.map((c) => c.slug), CATEGORY_SLUGS);
  assert.deepEqual(campus.categories.map((c) => c.label), CATEGORY_LABELS);
  for (const ev of campus.events) assert.ok(CATEGORY_SLUGS.includes(ev.category), ev.slug + ' 分類不合法：' + ev.category);
});

test('每個活動欄位齊全、slug 唯一且與日期一致', () => {
  assert.ok(campus.events.length > 0);
  const slugs = new Set();
  for (const ev of campus.events) {
    for (const k of ['slug', 'category', 'title', 'date', 'organizer', 'summary', 'cover']) assert.ok(typeof ev[k] === 'string' && ev[k].trim(), ev.slug + ' 缺 ' + k);
    assert.match(ev.date, /^\d{4}-\d{2}-\d{2}$/, ev.slug);
    assert.ok(ev.slug.startsWith(ev.date + '-'), ev.slug + ' 開頭應為日期');
    assert.match(ev.slug, /^[a-z0-9-]+$/, ev.slug + ' 只能用小寫英數與連字號（會放進網址）');
    assert.ok(!slugs.has(ev.slug), '重複 slug ' + ev.slug); slugs.add(ev.slug);
    assert.ok(Array.isArray(ev.photos) && ev.photos.length > 0, ev.slug + ' 沒有照片');
  }
});

test('每張照片的大圖與縮圖都存在，且與資料夾內容一一對應', () => {
  for (const ev of campus.events) {
    const dir = 'images/campus/' + ev.slug;
    const listed = new Set();
    const ids = new Set();
    for (const p of ev.photos) {
      assert.ok(p.slug && !ids.has(p.slug), ev.slug + ' 照片 slug 重複或缺少'); ids.add(p.slug);
      assert.equal(p.src, `${dir}/${p.slug}.jpg`, ev.slug + ' 大圖路徑');
      assert.equal(p.thumb, `${dir}/${p.slug}-s.jpg`, ev.slug + ' 縮圖路徑');
      assert.ok(fs.existsSync(p.src), p.src); assert.ok(fs.existsSync(p.thumb), p.thumb);
      assert.ok(typeof p.alt === 'string' && p.alt.trim(), p.src + ' 缺 alt');
      listed.add(path.basename(p.src)); listed.add(path.basename(p.thumb));
    }
    const onDisk = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
    assert.deepEqual(onDisk.sort(), [...listed].sort(), dir + ' 有照片沒列進 campus.json 或列了不存在的檔');
  }
});

test('每個活動有封面，且封面在該活動的照片清單內', () => {
  for (const ev of campus.events) assert.ok(ev.photos.some((p) => p.src === ev.cover), ev.slug + ' 封面不在照片清單：' + ev.cover);
});

test('campus.json 的中文字串都有英文與日文翻譯（含標題）', () => {
  const en = loadMessages('locale-en.js', 'SITE_EN_MESSAGES');
  const ja = loadMessages('locale-ja.js', 'SITE_JA_MESSAGES');
  const strings = zhStringsOf(campus);
  for (const ev of campus.events) assert.ok(strings.has(norm(ev.title)));
  for (const s of strings) {
    assert.ok(en[s], '缺英文：' + s); assert.ok(!CJK.test(en[s]), '英文含中文：' + s); assert.ok(!en[s].includes('[CHECK]'), '英文殘留 [CHECK]：' + s);
    assert.ok(ja[s], '缺日文：' + s); assert.notEqual(ja[s], s, '日文與中文相同：' + s);
  }
});

test('校園花絮頁與選單的介面字串都有英文與日文翻譯', () => {
  const en = loadMessages('locale-en.js', 'SITE_EN_MESSAGES');
  const ja = loadMessages('locale-ja.js', 'SITE_JA_MESSAGES');
  const strings = campusUiStrings();
  assert.ok(strings.has('校園花絮') && strings.has('張照片'), '區段解析不完整');
  strings.add('校園花絮');
  for (const s of strings) {
    assert.ok(en[s], '缺英文：' + s); assert.ok(!CJK.test(en[s]), '英文含中文：' + s); assert.ok(!en[s].includes('[CHECK]'), '英文介面字串不可有 [CHECK]：' + s);
    assert.ok(ja[s], '缺日文：' + s); assert.ok(KANA.test(ja[s]) || ja[s] !== s, '日文未翻：' + s);
  }
});

test('主選單在最新消息後面有校園花絮，路由分派到 CampusDetail', () => {
  const cc = fs.readFileSync('comic-components.jsx', 'utf8');
  assert.match(cc, /\{ label: "最新消息", href: "#news" \},\s*\{ label: "校園花絮", href: "#\/campus\/all" \},/);
  const pages = fs.readFileSync('pages.jsx', 'utf8');
  assert.match(pages, /case "campus":\s*return <CampusDetail slug=\{slug\} \/>;/);
  // 不可藏在預覽開關後面
  assert.doesNotMatch(pages, /case "campus":[^\n]*isPreview/);
});
