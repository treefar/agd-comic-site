// 從發布準備分支只搬「網站需要的檔案」到乾淨的發布資料夾（基底 origin/main）；不帶 holiday-lab、reports、work-orders、docs
// 用法：node copy-to-publish.cjs <來源分支> <目標資料夾>
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [ref, dest] = process.argv.slice(2);
if (!ref || !dest) throw Error('Usage: copy-to-publish.cjs <ref> <dest>');
const git = args => execFileSync('git', args, { cwd: dest, maxBuffer: 1 << 28 });
if (git(['status', '--porcelain']).toString().trim()) throw Error('dest must be clean');
const paths = ['app.jsx', 'chapters-1.jsx', 'chapters-2.jsx', 'comic-components.jsx', 'en-pages.jsx', 'pages.jsx', 'index.html', 'locale-en.js', 'locale-ja.js', 'faculty-portrait.css', 'faculty-portrait.js', 'holiday-home.css', 'holiday-home.jsx', 'student-guide-model.js', 'student-guide.css', 'student-guide.jsx', 'student-work-draw-model.js', 'student-work-draw.css', 'student-work-draw.jsx', 'styles.css', '.gitattributes', '.gitignore', 'data', 'images', 'scripts/build.mjs', 'scripts/build-translations.cjs', 'scripts/build-ja-translations.cjs', 'scripts/apply-poster-adjust.cjs', 'tests/en-release.test.cjs', 'tests/shared-language.test.cjs', 'tests/production-baseline.json', 'tests/student-work-draw.test.cjs', 'tests/student-work-adjust.test.cjs', 'tests/student-guide.test.cjs'];
const files = git(['ls-tree', '-r', '--name-only', '-z', ref, '--', ...paths]).toString().split('\0').filter(Boolean);
let written = 0;
for (const f of files) {
  if (/^(holiday-lab|reports|work-orders|docs)\//.test(f)) throw Error('forbidden path ' + f);
  const buf = git(['show', `${ref}:${f}`]), out = path.join(dest, f);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out) && fs.readFileSync(out).equals(buf)) continue;
  fs.writeFileSync(out, buf); written++;
}
console.log(JSON.stringify({ listed: files.length, written }));
