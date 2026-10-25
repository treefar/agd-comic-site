// 建置審閱版並在「檔案暫時打不開」（Windows 防毒／索引短暫鎖檔，錯誤碼 -4094）時自動重試。
// 用法：node scripts/build-review-retry.cjs <新的量測目錄名，例如 .measure-poster-mix-20261024-25>
// 成功（結束碼 0）才會補齊 holiday-lab 三個策展檔；失敗時保留每次的完整紀錄，不刪任何檔案。
const cp = require('node:child_process'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), name = process.argv[2];
if (!/^\.measure-[a-z0-9-]+$/.test(name || '')) throw Error('Usage: node scripts/build-review-retry.cjs .measure-<name>');
const logDir = path.join(root, 'holiday-lab/reports/poster-mix-20261024/build-logs');
fs.mkdirSync(logDir, { recursive: true });
let lastCode = 1, used = null;
for (let attempt = 1; attempt <= 5; attempt++) {
  const out = attempt === 1 ? name : name + '-retry' + attempt;
  if (fs.existsSync(path.join(root, out))) throw Error('Output dir already exists: ' + out);
  const r = cp.spawnSync(process.execPath, ['scripts/build.mjs', '--local-review', '--out=' + out], { cwd: root, encoding: 'utf8' });
  fs.writeFileSync(path.join(logDir, out + '.log'), (r.stdout || '') + (r.stderr || ''));
  lastCode = r.status; used = out;
  console.log('attempt ' + attempt + ' dir ' + out + ' BUILD_EXIT=' + r.status + (r.status ? ' ' + ((r.stderr || '').match(/errno: -?\d+|Error: [^\n]+/) || [''])[0] : ''));
  if (r.status === 0) break;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 4000 * attempt);
}
if (lastCode !== 0) { console.log('FAILED'); process.exit(1); }
const dest = path.join(root, used, 'holiday-lab'); fs.mkdirSync(dest, { recursive: true });
for (const f of ['student-curation.html', 'student-curation.css', 'student-curation.mjs']) fs.copyFileSync(path.join(root, 'holiday-lab', f), path.join(dest, f));
for (const f of ['overlap-audit.js']) fs.copyFileSync(path.join(root, 'holiday-lab/reports/poster-mix-20261024/r4', f), path.join(root, used, f));
const js = fs.readdirSync(path.join(root, used)).filter(f => /^app-.*\.js$/.test(f));
console.log('READY dir=' + used + ' app=' + js.join(','));
