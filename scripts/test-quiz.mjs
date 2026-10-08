// 互動測驗計分回歸測試：直接從 pages.jsx 取出 quizWinner 與題目數，跑固定案例
// 用法：node scripts/test-quiz.mjs   → 全過離開碼 0
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'pages.jsx'), 'utf8');
const fn = src.match(/const quizWinner = \(score, lastPick\) => \{[\s\S]*?\n\};/);
if (!fn) { console.error('FAIL 找不到 quizWinner'); process.exit(1); }
const quizWinner = new Function(fn[0] + '\nreturn quizWinner;')();
const KEYS = ['anim', 'game', 'art', 'cross'];
const nQ = (src.match(/const QUIZ_Q = \[([\s\S]*?)\n\];/)[1].match(/\{ q: /g) || []).length;

const run = (answers) => {
  const s = [0, 0, 0, 0];
  answers.forEach((k) => s[k]++);
  return KEYS[quizWinner(s, answers[answers.length - 1])];
};
const cases = [
  ['00000000', 'anim'], ['11111111', 'game'], ['22222222', 'art'], ['33333333', 'cross'],
  ['01010101', 'game'],   // 4:4 同分，最後一題選遊戲
  ['10101010', 'anim'],   // 4:4 同分，最後一題選動畫
  ['33221100', 'anim'],   // 四方同分，最後一題選動畫
  ['00112233', 'cross'],  // 四方同分，最後一題選跨域
  ['23232301', 'art'],    // 美術 3、跨域 3 同分，最後一題選遊戲（不在同分名單）→ 取順序較前的美術
  ['00123331', 'cross'],  // 跨域 3 分最高
];
const fails = [];
if (nQ !== 8) fails.push(`題目數應為 8，實際 ${nQ}`);
for (const [a, want] of cases) {
  const got = run(a.split('').map(Number));
  if (got !== want) fails.push(`${a} 應為 ${want}，實際 ${got}`);
}
// 每題都要 4 個選項
for (const m of src.match(/const QUIZ_Q = \[([\s\S]*?)\n\];/)[1].matchAll(/a: \[([^\]]*)\]/g)) {
  const n = (m[1].match(/"[^"]*"/g) || []).length;
  if (n !== 4) fails.push(`有一題選項數為 ${n}`);
}
if (fails.length) { console.error('FAIL\n- ' + fails.join('\n- ')); process.exit(1); }
console.log(`PASS 測驗 ${nQ} 題、${cases.length} 組計分案例`);

// 分享頁：四派各一張 share/<派>.html，og:image 指向存在的 1200x630 圖，並轉到 #/quiz/<派>
{
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const { existsSync, readFileSync: rf } = await import('node:fs');
  const shareFails = [];
  for (const k of KEYS) {
    const f = join(root, 'share', k + '.html');
    if (!existsSync(f)) { shareFails.push(`缺 share/${k}.html`); continue; }
    const h = rf(f, 'utf8');
    if (!h.includes(`images/quiz/share-${k}.jpg`)) shareFails.push(`${k} 的 og:image 不對`);
    if (!h.includes(`#/quiz/${k}"`)) shareFails.push(`${k} 沒轉到 #/quiz/${k}`);
    const img = join(root, 'images', 'quiz', `share-${k}.jpg`);
    if (!existsSync(img)) { shareFails.push(`缺 images/quiz/share-${k}.jpg`); continue; }
    const b = rf(img);
    // 讀 JPEG SOF0/SOF2 取尺寸
    let i = 2, w = 0, hgt = 0;
    while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m === 0xc0 || m === 0xc2) { hgt = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; } i += 2 + len; }
    if (w !== 1200 || hgt !== 630) shareFails.push(`share-${k}.jpg 尺寸 ${w}x${hgt}，應為 1200x630`);
  }
  if (!src.includes('treefar.link/agd-comic-site/share/')) shareFails.push('pages.jsx 的 shareUrl 沒改用 share 頁');
  // 未公開期間：分享圖要藏在 ?preview=quiz 後面（公開時連同這行一起拿掉）
  if (!/QUIZ_SHARE_PREVIEW && <div/.test(src)) shareFails.push('分享圖卡片沒有藏在 QUIZ_SHARE_PREVIEW 後面');
  if (shareFails.length) { console.error('FAIL 分享頁\n- ' + shareFails.join('\n- ')); process.exit(1); }
  console.log('PASS 分享頁 4 張（og:image 1200x630、轉址正確）');
}
