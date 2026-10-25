// 調整模式（?adjust=1）的計算：手動構圖幾何、範圍換算、指定標題側、跳到指定海報
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const model = vm.runInNewContext(fs.readFileSync(path.join(root, 'student-work-draw-model.js'), 'utf8') + ';StudentWorkDrawModel;');
function clock() { let now = 0, id = 0; const tasks = new Map(); return { setTimeout(fn, d) { tasks.set(++id, { fn, at: now + d }); return id; }, clearTimeout(i) { tasks.delete(i); }, advance(ms) { const end = now + ms; for (;;) { const n = [...tasks].sort((a, b) => a[1].at - b[1].at)[0]; if (!n || n[1].at > end) break; now = n[1].at; tasks.delete(n[0]); n[1].fn(); } now = end; }, get pending() { return tasks.size; } }; }

test('manual geometry always covers the frame (no blank edges) for any pan and zoom', () => {
  for (const ratio of [0.7071, 0.7092, 1.7778]) for (const [fw, fh] of [[1277, 777], [1777, 957], [1117, 597]]) for (const zoom of [0.4, 1, 1.5, 3, 9]) for (const cx of [-1, 0, 0.5, 1, 2]) for (const cy of [0, 0.5, 1]) {
    const g = model.manualGeometry({ zoom, cx, cy }, ratio, fw, fh);
    assert.ok(g.zoom >= 1 && g.zoom <= 3);
    assert.ok(g.width >= fw - 1e-6 && g.height >= fh - 1e-6, 'must cover ' + [ratio, fw, fh, zoom]);
    assert.ok(g.left <= 1e-9 && g.left + g.width >= fw - 1e-6 && g.top <= 1e-9 && g.top + g.height >= fh - 1e-6, 'no blank edge ' + [ratio, fw, fh, zoom, cx, cy]);
    assert.ok(Math.abs(g.width / g.height - ratio) < 1e-9, 'poster aspect ratio is never distorted');
  }
});
test('dragging by dx,dy pixels moves the poster by exactly that much (centre point maths)', () => {
  const g0 = model.manualGeometry({ zoom: 2, cx: 0.5, cy: 0.5 }, 0.7071, 1277, 777);
  const dx = 40, dy = -60, g1 = model.manualGeometry({ zoom: 2, cx: 0.5 - dx / g0.width, cy: 0.5 - dy / g0.height }, 0.7071, 1277, 777);
  assert.ok(Math.abs((g1.left - g0.left) - dx) < 1e-6, 'x follows the pointer');
  assert.ok(Math.abs((g1.top - g0.top) - dy) < 1e-6, 'y follows the pointer');
});
test('zoom 1 with default centre equals the automatic cover size', () => {
  const g = model.manualGeometry({}, 0.7071, 1277, 777);
  assert.equal(Math.round(g.width), 1277);
  assert.ok(model.manualGeometry({ zoom: 2 }, 0.7071, 1277, 777).width > g.width * 1.99);
  assert.throws(() => model.manualGeometry({}, 0, 1277, 777));
});
test('subject extent follows a moved and enlarged poster and stays inside the frame', () => {
  const ratio = 0.7071, fw = 1277, fh = 777, auto = model.manualGeometry({}, ratio, fw, fh);
  assert.equal(JSON.stringify(model.remapExtent([0.3, 0.7], ratio, fw, fh, auto)), JSON.stringify([0.3, 0.7]));
  const big = model.manualGeometry({ zoom: 2, cx: 0.5, cy: 0.5 }, ratio, fw, fh), r = model.remapExtent([0.3, 0.7], ratio, fw, fh, big);
  assert.ok(r[0] >= 0 && r[1] <= 1 && r[0] < r[1] && r[1] - r[0] > 0.7, 'zoomed subject is wider: ' + r);
  const edge = model.remapExtent([0.8, 0.9], ratio, fw, fh, model.manualGeometry({ zoom: 3, cx: 0.5, cy: 0.5 }, ratio, fw, fh));
  assert.ok(edge[0] >= 0 && edge[1] <= 1 && edge[1] - edge[0] >= 0.05);
});
test('title side can be forced and copy width follows the chosen side', () => {
  assert.equal(model.layout({ x: [0.2, 0.7] }, 1000).side, 'right');
  const left = model.layout({ x: [0.2, 0.7] }, 1000, 0.035, 220, 'left'), right = model.layout({ x: [0.2, 0.7] }, 1000, 0.035, 220, 'right');
  assert.equal(left.side, 'left');
  assert.equal(left.copyWidth, 220);
  assert.equal(right.side, 'right');
  assert.equal(right.actions, 'opposite');
  assert.equal(model.layout({ x: [0.2, 0.7] }, 1000, 0.035, 220, 'bogus').side, 'right');
});
test('goto jumps to a poster, pauses and leaves no running timer', () => {
  const c = clock(); let last; const draw = model.create(8, s => last = s, c, () => 0.5);
  draw.goto(5); assert.equal(last.index, 5); assert.equal(last.paused, true); assert.equal(last.phase, 'preview'); assert.equal(c.pending, 0);
  c.advance(20000); assert.equal(last.index, 5, 'stays put');
  draw.goto(99); draw.goto(-1); draw.goto(2.5); assert.equal(last.index, 5, 'invalid indexes are ignored');
  draw.start(); c.advance(2700); assert.equal(last.phase, 'settled'); assert.notEqual(last.index, 5);
  draw.destroy(); assert.equal(c.pending, 0);
});
test('manual settings in the data file are validated when present', () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'data/student-work-draw.json'), 'utf8'));
  for (const w of data) { const m = w.focus && w.focus.manual; if (!m) continue; assert.ok(m.zoom >= 1 && m.zoom <= 3, w.id); assert.ok(m.cx >= 0 && m.cx <= 1 && m.cy >= 0 && m.cy <= 1, w.id); assert.ok(m.side === undefined || ['left', 'right'].includes(m.side), w.id); }
});
test('apply-poster-adjust validates every entry, writes focus.manual and can remove it', () => {
  const { apply } = require('../scripts/apply-poster-adjust.cjs'), data = [{ id: 'a', focus: { ratio: 0.7, subject: [0.2, 0.5], x: [0.3, 0.7] } }, { id: 'b', focus: { ratio: 0.7, subject: [0.2, 0.5], x: [0.3, 0.7], manual: { zoom: 1.5, cx: 0.4, cy: 0.4 } } }];
  const r = apply(data, { a: { zoom: 1.25, cx: 0.5, cy: 0.35, side: 'right' }, b: null });
  assert.deepEqual({ ...r.data[0].focus.manual }, { zoom: 1.25, cx: 0.5, cy: 0.35, side: 'right' });
  assert.equal(r.data[1].focus.manual, undefined);
  assert.equal(data[1].focus.manual.zoom, 1.5, 'input is not mutated');
  for (const bad of [{ zzz: null }, { a: { zoom: 0.8, cx: 0.5, cy: 0.5 } }, { a: { zoom: 1, cx: 1.2, cy: 0.5 } }, { a: { zoom: 1, cx: 0.5, cy: 0.5, side: 'top' } }, { a: 'x' }]) assert.throws(() => apply(data, bad));
  assert.throws(() => apply(data, { a: { zoom: 1.1, cx: 0.5, cy: 0.5 }, b: { zoom: 9, cx: 0.5, cy: 0.5 } }), /zoom/, 'one bad entry rejects the whole file');
});
test('adjust mode is hidden unless ?adjust=1 and does not leak into normal pages', () => {
  const jsx = fs.readFileSync(path.join(root, 'student-work-draw.jsx'), 'utf8');
  assert.match(jsx, /get\('adjust'\) !== '1'\) return/);
  assert.match(jsx, /\{adjust && createPortal\(/);
  assert.match(jsx, /window\.innerWidth < 1181 \|\| event\.button > 0/);
});
