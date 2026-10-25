// 第二輪（Fable 建議套用）證據：實際執行測試並存 command/stdout/stderr/exit；全套 tests 的 3 個既有失敗原樣保存
const cp = require('child_process'), fs = require('fs'), path = require('path'), crypto = require('crypto');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r2';
const run = (name, cmd, args) => {
  const r = cp.spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  fs.writeFileSync(path.join(dir, name + '-command.json'), JSON.stringify({ recorded_utc: new Date().toISOString(), command: [cmd, ...args], cwd: process.cwd(), exit_code: r.status, stdout: r.stdout, stderr: r.stderr }, null, 2));
  console.log(name, 'exit', r.status);
  return r.status;
};
const tests = fs.readdirSync('tests').filter(f => f.endsWith('.test.cjs')).map(f => 'tests/' + f);
const codes = {
  draw: run('test-draw', 'node', ['--test', 'tests/student-work-draw.test.cjs']),
  guide: run('test-guide', 'node', ['--test', 'tests/student-guide.test.cjs']),
  all: run('test-all', 'node', ['--test', ...tests])
};
// 既有失敗只涉及本輪未改的資料檔：以 git diff 證明
const untouched = cp.spawnSync('git', ['-c', 'core.longpaths=true', 'diff', '--quiet', 'HEAD', '--', 'data/admission.json', 'data/students/guide.json', 'data/works.json', 'data/en', 'data/ja']).status;
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const protectedFiles = {
  'holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md': '6722a0cdb1798daf25dbfff950103c633d17bfafebdf8858c4743ef3492d5f9d',
  'holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md': '02b74b6bae38cab26f17d6e085dd840c033990fc346d29020e9d394265389e5d',
  'holiday-lab/layout-qa/phase-latest.json': 'f6762b3b724f9e7890def79ed876b4c34e1037528d7ec9e2d5863fa5fee5f593',
  'holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md': '914e505961a0f653cd16d842cc9b7c65bcac664544dd4dc7f895c5abd8e64edb',
  'holiday-lab/layout-qa/layout-report.json': 'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336'
};
const guard = {
  protected_ok: Object.entries(protectedFiles).every(([f, e]) => sha(f) === e),
  untouched_failing_test_data: untouched === 0,
  new_image: { file: 'images/news/7200-obsessive-reality.jpg', sha256: sha('images/news/7200-obsessive-reality.jpg'), bytes: fs.statSync('images/news/7200-obsessive-reality.jpg').size, source: 'https://img.youtube.com/vi/y0GLRAaN_P8/maxresdefault.jpg', downloaded_with_user_approval: '2026-10-24 對話選項題「下載進 images/（建議）」' },
  origin_main: cp.execSync('git -c core.longpaths=true rev-parse refs/remotes/origin/main', { encoding: 'utf8' }).trim(),
  branch: cp.execSync('git -c core.longpaths=true branch --show-current', { encoding: 'utf8' }).trim(),
  product_files_changed: cp.execSync('git -c core.longpaths=true diff --name-only', { encoding: 'utf8' }).split('\n').filter(l => l && !/^holiday-lab\//.test(l))
};
fs.writeFileSync(path.join(dir, 'guard.json'), JSON.stringify(guard, null, 2));
console.log(JSON.stringify({ codes, guard_ok: guard.protected_ok && guard.untouched_failing_test_data }));
process.exitCode = codes.draw === 0 && codes.guide === 0 && guard.protected_ok && guard.untouched_failing_test_data ? 0 : 1;
