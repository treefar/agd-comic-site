// 第十階段（套用使用者調整、面板精簡）證據：實際執行測試並存 command/stdout/stderr/exit
const cp = require('child_process'), fs = require('fs'), path = require('path'), crypto = require('crypto');
process.chdir(path.resolve(__dirname, '../../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024/r9';
const run = (name, cmd, args) => {
  const r = cp.spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  fs.writeFileSync(path.join(dir, name + '-command.json'), JSON.stringify({ recorded_utc: new Date().toISOString(), command: [cmd, ...args], cwd: process.cwd(), exit_code: r.status, stdout: r.stdout, stderr: r.stderr }, null, 2));
  console.log(name, 'exit', r.status);
  return r.status;
};
const tests = fs.readdirSync('tests').filter(f => f.endsWith('.test.cjs')).map(f => 'tests/' + f);
const codes = { draw: run('test-draw', 'node', ['--test', 'tests/student-work-draw.test.cjs']), guide: run('test-guide', 'node', ['--test', 'tests/student-guide.test.cjs']), all: run('test-all', 'node', ['--test', ...tests]) };
const untouched = cp.spawnSync('git', ['-c', 'core.longpaths=true', 'diff', '--quiet', 'HEAD', '--', 'data/admission.json', 'data/students/guide.json', 'data/works.json', 'data/en', 'data/ja']).status;
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const protectedFiles = {
  'holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md': '6722a0cdb1798daf25dbfff950103c633d17bfafebdf8858c4743ef3492d5f9d',
  'holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md': '02b74b6bae38cab26f17d6e085dd840c033990fc346d29020e9d394265389e5d',
  'holiday-lab/layout-qa/phase-latest.json': 'f6762b3b724f9e7890def79ed876b4c34e1037528d7ec9e2d5863fa5fee5f593',
  'holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md': '914e505961a0f653cd16d842cc9b7c65bcac664544dd4dc7f895c5abd8e64edb',
  'holiday-lab/layout-qa/layout-report.json': 'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336'
};
const originals = ['dear-all-robots', 'garble-tv', 'healing-light', 'jingxiangtuan', 'kacha', 'today-restaurant', 'yuan-wang-wang'].map(n => 'images/news/2026-awards/' + n + '.jpg').concat('images/posters/clipstudio-grand-prize.jpg');
const newImages = ['images/news/7200-obsessive-reality.jpg', 'images/news/2023-design-awards/dragon-before-us.jpg', 'images/news/2023-design-awards/fumo.jpg'];
const guard = {
  protected_ok: Object.entries(protectedFiles).every(([f, e]) => sha(f) === e),
  failing_tests_data_untouched: untouched === 0,
  original_images_unchanged_vs_head: originals.map(f => ({ file: f, same: cp.spawnSync('git', ['-c', 'core.longpaths=true', 'diff', '--quiet', 'HEAD', '--', f]).status === 0 })),
  new_images: newImages.map(f => ({ file: f, bytes: fs.statSync(f).size, sha256: sha(f), jpeg: fs.readFileSync(f).subarray(0, 3).toString('hex') === 'ffd8ff' })),
  new_image_sources: { '2023-design-awards/dragon-before-us.jpg': 'https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2023/12/4.jpg', '2023-design-awards/fumo.jpg': 'https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2023/12/2.jpg', approval: '2026-10-24 使用者要求「換別年度的」；報導網址見 data/student-work-draw.json href' },
  origin_main: cp.execSync('git -c core.longpaths=true rev-parse refs/remotes/origin/main', { encoding: 'utf8' }).trim(),
  branch: cp.execSync('git -c core.longpaths=true branch --show-current', { encoding: 'utf8' }).trim()
};
guard.pass = guard.protected_ok && guard.failing_tests_data_untouched && guard.original_images_unchanged_vs_head.every(x => x.same) && guard.new_images.every(x => x.jpeg) && guard.origin_main === '1b8322e69d84549db220d849afb1aac0fb9d7c2a';
fs.writeFileSync(path.join(dir, 'guard.json'), JSON.stringify(guard, null, 2));
console.log(JSON.stringify({ codes, guard_pass: guard.pass }));
process.exitCode = codes.draw === 0 && codes.guide === 0 && guard.pass ? 0 : 1;
