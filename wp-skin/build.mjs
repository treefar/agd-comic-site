// 把 comic-skin.css 包成 HFCM「Site Wide Header」可直接貼上的片段
// 用法：node wp-skin/build.mjs   → 產出 wp-skin/dist/hfcm-header.html、hfcm-footer.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const VERSION = '20261103a'; // 改 CSS 後一起改，方便在原始碼裡辨認線上是哪一版

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bangers&family=Bowlby+One&family=Noto+Sans+TC:wght@400;700;900&display=swap';

// 壓縮：去註解、合併空白（不動字串內容）
export function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .trim();
}

export function buildHeader(css) {
  return [
    `<!-- AGD COMIC SKIN ${VERSION} | 原始檔 agd-comic-site/wp-skin/comic-skin.css，不要直接改這裡 -->`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONT_URL}">`,
    `<style id="agdc-skin" data-ver="${VERSION}">${minify(css)}</style>`,
    '',
  ].join('\n');
}

export function buildFooter(barHtml) {
  // 去掉檔頭說明註解，只留 <script>
  const script = barHtml.match(/<script>[\s\S]*?<\/script>/)[0];
  return `<!-- AGD COMIC BAR ${VERSION} | 原始檔 agd-comic-site/wp-skin/comic-bar.html -->\n${script}\n`;
}

// 點擊特效片段：去掉 JS 註解（整行 // 與行尾 // 、/* */），線上片段比較短，也方便用雜湊比對線上與 repo 是否一致
export function stripJsComments(js) {
  return js
    .replace(/[ \t]*\/\*[^*]*\*\/[ \t]*/g, ' ')
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l))
    .map((l) => l.replace(/\s+\/\/ .*$/, ''))
    .join('\n');
}

export function buildFx(fxHtml) {
  const script = stripJsComments(fxHtml.match(/<script>[\s\S]*?<\/script>/)[0]);
  return `<!-- AGD COMIC FX ${VERSION} | 原始檔 agd-comic-site/wp-skin/comic-fx.html -->\n${script}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const css = readFileSync(join(here, 'comic-skin.css'), 'utf8');
  const bar = readFileSync(join(here, 'comic-bar.html'), 'utf8');
  const out = join(here, 'dist');
  mkdirSync(out, { recursive: true });
  const header = buildHeader(css);
  const footer = buildFooter(bar);
  // 點擊特效＋跳轉列：另一個 HFCM 片段（Site Wide Footer，2026-11-03）
  const fx = buildFx(readFileSync(join(here, 'comic-fx.html'), 'utf8'));
  writeFileSync(join(out, 'hfcm-header.html'), header, 'utf8');
  writeFileSync(join(out, 'hfcm-footer.html'), footer, 'utf8');
  writeFileSync(join(out, 'hfcm-fx-footer.html'), fx, 'utf8');
  console.log(`header ${header.length} chars, footer ${footer.length} chars, fx ${fx.length} chars → ${out}`);
}
