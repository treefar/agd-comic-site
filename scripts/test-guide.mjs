// 招生管道導引回歸測試：直接從 pages.jsx 取出 guidePick / guideNextDate，跑代表性答案並對照 data/admission.json
// 另外檢查作品集牆的彙整（buildWall）只用資料裡已有的作品、分類對應正確
// 用法：node scripts/test-guide.mjs   → 全過離開碼 0
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'pages.jsx'), 'utf8').replace(/\r\n/g, '\n');
const load = (name) => JSON.parse(readFileSync(join(root, 'data', name + '.json'), 'utf8'));
const grab = (re, label) => {
  const m = src.match(re);
  if (!m) { console.error('FAIL 找不到 ' + label); process.exit(1); }
  return m[0];
};

const guidePick = new Function(grab(/const guidePick = \(school, award, route\) => \{[\s\S]*?\n\};/, 'guidePick') + '\nreturn guidePick;')();
const guideNextDate = new Function(grab(/const guideNextDate = \(timeline, now\) => \{[\s\S]*?\n\};/, 'guideNextDate') + '\nreturn guideNextDate;')();

const admission = load('admission');
const bySlug = Object.fromEntries(admission.map((a) => [a.slug, a]));
// 不是入學管道的條目不可被推薦
const NOT_CHANNEL = ['visit', 'scholarship'];
const fails = [];

// 1) 10+ 組代表性答案
const cases = [
  [['hs', 'none', 'gsat'], ['high-school-application']],
  [['hs', 'none', 'portfolio'], ['high-school-application']],
  [['hs', 'cert', 'tcte'], ['joint']],
  [['hs', 'award', 'school'], ['high-school-application']],
  [['voc', 'none', 'tcte'], ['selection', 'joint']],
  [['voc', 'none', 'portfolio'], ['selection']],
  [['voc', 'cert', 'school'], ['tech-star', 'selection']],
  [['voc', 'award', 'tcte'], ['tech-elite', 'selection']],
  [['voc', 'award', 'school'], ['tech-elite', 'tech-star']],
  [['voc', 'none', 'gsat'], ['selection', 'joint']],
  [['voc', 'award', 'portfolio'], ['tech-elite', 'selection']],
  [['work', undefined, undefined], ['evening']],
];
const LABEL = { hs: '普通型高中', voc: '高職／綜高', work: '已畢業／在職', award: '競賽得獎', cert: '只有證照', none: '都沒有', gsat: '學測', tcte: '統測', school: '學校推薦', portfolio: '作品集書審' };
console.log('| # | 學校 | 得獎／證照 | 想靠 | 推薦管道 |');
console.log('|---|---|---|---|---|');
cases.forEach(([a, want], i) => {
  const got = guidePick(...a);
  console.log(`| ${i + 1} | ${LABEL[a[0]]} | ${LABEL[a[1]] || '（略過）'} | ${LABEL[a[2]] || '（略過）'} | ${got.map((s) => (bySlug[s] ? bySlug[s].title : '??' + s)).join('、')} |`);
  if (JSON.stringify(got) !== JSON.stringify(want)) fails.push(`${a.join('/')} 應為 ${want.join(',')}，實際 ${got.join(',')}`);
});

// 2) 全部組合：1–2 個、不重複、都存在於 admission.json、不是參訪或獎學金
let combos = 0;
for (const s of ['hs', 'voc', 'work']) for (const w of ['award', 'cert', 'none']) for (const r of ['gsat', 'tcte', 'school', 'portfolio']) {
  combos++;
  const got = guidePick(s, w, r);
  if (got.length < 1 || got.length > 2) fails.push(`${s}/${w}/${r} 推薦數 ${got.length}`);
  if (new Set(got).size !== got.length) fails.push(`${s}/${w}/${r} 推薦重複`);
  for (const slug of got) {
    if (!bySlug[slug]) fails.push(`${s}/${w}/${r} 推薦的 ${slug} 不在 admission.json`);
    if (NOT_CHANNEL.includes(slug)) fails.push(`${s}/${w}/${r} 推薦了非入學管道 ${slug}`);
  }
}

// 3) 倒數只對未來日期：今天（2026-10-08）所有 115 學年度時程都已過去 → 不顯示倒數
const today = new Date(2026, 9, 8);
for (const a of admission) {
  const n = guideNextDate(a.timeline, today);
  if (n) fails.push(`${a.slug} 在 2026-10-08 不該有倒數，卻得到 ${n.raw}`);
}
// 時間倒回 2026-01-01：申請入學的下一個時程應是 2026/03/19 報名
const early = guideNextDate(bySlug['high-school-application'].timeline, new Date(2026, 0, 1));
if (!early || early.raw.indexOf('2026/03/19') !== 0) fails.push(`2026-01-01 的申請入學下一時程應為 2026/03/19，實際 ${early && early.raw}`);
// 沒有完整日期（例如「2026/09 起」「依進修部專區公告」）不可被當成日期
if (guideNextDate([{ date: '2026/09 起', label: 'x' }, { date: '依樹德進修部專區公告', label: 'y' }], new Date(2000, 0, 1))) fails.push('不完整日期被誤判成倒數目標');

// 4) 結果頁必帶的文案
for (const t of ['以 115 學年度時程為參考，116 學年度簡章公布後更新', '也做做看：你是哪一派？', '#/quiz/start']) {
  if (!src.includes(t)) fails.push(`pages.jsx 缺少「${t}」`);
}

if (fails.length) { console.error('FAIL\n- ' + fails.join('\n- ')); process.exit(1); }
console.log(`PASS 招生導引 ${cases.length} 組代表案例、${combos} 種組合全部落在 admission.json 的入學管道、倒數不指向過去日期`);

// 5) 作品集牆：彙整結果只含資料裡的作品，分類對應表正確
{
  const block = grab(/const WALL_CATS = [\s\S]*?\nconst buildWall = [\s\S]*?\n\};/, '作品集牆彙整函式');
  const buildWall = new Function(block + '\nreturn buildWall;')();
  const works = load('works'), videos = load('videos'), news = load('news');
  const wall = buildWall(works, videos, news);
  const titles = new Set([...works.map((w) => w.title), ...videos.map((v) => v.title), ...news.flatMap((n) => (n.gallery || []).map((g) => g.title))]);
  const wf = [];
  for (const it of wall) {
    if (!titles.has(it.title)) wf.push(`牆上出現資料裡沒有的作品：${it.title}`);
    if (!it.cats.length || it.cats.some((c) => !['動畫', '遊戲', '美術插畫', '其他'].includes(c))) wf.push(`${it.title} 分類異常：${it.cats}`);
    if (it.yt && !/^[\w-]{11}$/.test(it.yt)) wf.push(`${it.title} 的 YouTube ID 異常：${it.yt}`);
    if (!it.img) wf.push(`${it.title} 沒有圖片`);
  }
  if (wall.some((it) => it.title.includes('前 2%'))) wf.push('教師學術榮譽不該上作品集牆');
  const find = (t) => wall.find((it) => it.title.includes(t));
  if (!find('ClipStudio') || !find('ClipStudio').cats.includes('美術插畫')) wf.push('ClipStudio 插畫應歸「美術插畫」');
  if (!find('失竊的祕方') || find('失竊的祕方').yt !== 'g63HmiIJoiQ') wf.push('《失竊的祕方》應合併成一張並帶 YouTube');
  if (wall.filter((it) => it.title.includes('癡迷的現實')).length !== 1) wf.push('《癡迷的現實》應只出現一次');
  if (!find('放視大賞') || !['動畫', '遊戲'].every((c) => find('放視大賞').cats.includes(c))) wf.push('「動畫 + 遊戲」應同時歸動畫與遊戲');
  if (!find('電都影城') || find('電都影城').cats[0] !== '其他') wf.push('形象片應歸「其他」');
  if (wf.length) { console.error('FAIL 作品集牆\n- ' + wf.join('\n- ')); process.exit(1); }
  const count = (c) => wall.filter((it) => it.cats.includes(c)).length;
  console.log(`PASS 作品集牆 ${wall.length} 件（動畫 ${count('動畫')}、遊戲 ${count('遊戲')}、美術插畫 ${count('美術插畫')}、其他 ${count('其他')}）`);

  // 6) 測驗結果頁的作品牆：每派 6 件、分類對得上、得獎作品排在影片庫前面
  const pickBlock = grab(/const QUIZ_WALL = [\s\S]*?\nconst quizWallPick = [\s\S]*?\n\};/, '測驗作品牆挑選函式');
  const quizWallPick = new Function(pickBlock + '\nreturn quizWallPick;')();
  const qf = [];
  const want = { anim: ['動畫'], game: ['遊戲'], art: ['美術插畫', '動畫'], cross: ['動畫', '遊戲'] };
  for (const k of Object.keys(want)) {
    const list = quizWallPick(wall, k);
    console.log(`  ${k}: ` + list.map((it) => `${it.title}[${it.cats.join('+')}]`).join('、'));
    // 動畫、遊戲派最多 20 件（資料不足就全放），美術、跨域派 6 件
    const expect = ['anim', 'game'].includes(k) ? Math.min(20, wall.filter((it) => it.cats.includes(want[k][0])).length) : 6;
    if (list.length !== expect) qf.push(`${k} 應有 ${expect} 件，實際 ${list.length}`);
    if (new Set(list).size !== list.length) qf.push(`${k} 有重複作品`);
    if (list.some((it) => !it.cats.some((c) => want[k].includes(c)))) qf.push(`${k} 混進不相干分類`);
    if (list.some((it) => it.cats.includes('其他') && it.cats.length === 1)) qf.push(`${k} 混進「其他」（形象片、教學）`);
    const ranks = list.map((it) => (it.key.startsWith('v-') ? 1 : 0));
    if (ranks.some((r, i) => i > 0 && r < ranks[i - 1])) qf.push(`${k} 影片庫作品排到得獎作品前面`);
  }
  if (!quizWallPick(wall, 'art')[0].cats.includes('美術插畫')) qf.push('美術派第一件應是插畫');
  const cross = quizWallPick(wall, 'cross');
  if (!cross.some((it) => it.cats.includes('動畫')) || !cross.some((it) => it.cats.includes('遊戲'))) qf.push('跨域派要同時有動畫與遊戲');
  if (quizWallPick(wall, 'nope').length !== 0) qf.push('未知派別應回傳空陣列');
  if (qf.length) { console.error('FAIL 測驗作品牆\n- ' + qf.join('\n- ')); process.exit(1); }
  console.log('PASS 測驗結果作品牆：動畫、遊戲派全放（上限 20）、美術與跨域派 6 件、分類正確、得獎作品優先');
}
