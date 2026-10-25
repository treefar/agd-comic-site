// 本階段證據收集：實際執行指令並存 command/stdout/stderr/exit（不改產品檔）
const cp = require('child_process'), fs = require('fs'), path = require('path'), crypto = require('crypto');
process.chdir(path.resolve(__dirname, '../../..'));
const dir = 'holiday-lab/reports/poster-mix-20261024';
const run = (name, cmd, args) => {
  const r = cp.spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  const rec = { recorded_utc: new Date().toISOString(), command: [cmd, ...args], cwd: process.cwd(), exit_code: r.status, stdout: r.stdout, stderr: r.stderr };
  fs.writeFileSync(path.join(dir, name + '-command.json'), JSON.stringify(rec, null, 2));
  console.log(name, 'exit', r.status);
  return r.status;
};
const codes = [
  run('test-draw', 'node', ['--test', 'tests/student-work-draw.test.cjs']),
  run('takeover-check', 'node', ['holiday-lab/reports/takeover-claude-20261024/check.cjs']),
  run('stats-en', 'node', ['holiday-lab/reports/takeover-claude-20261024/stats-en-check.cjs']),
  // data-regression 舊版比對預期 exit1（en 兩個作廢譯文鍵、en 得獎清單按索引誤判），原樣保存
  run('data-regression', 'node', ['holiday-lab/reports/takeover-claude-20261024/data-regression.cjs'])
];
// 保全檔與原圖 SHA
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const protectedFiles = {
  'holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md': '6722a0cdb1798daf25dbfff950103c633d17bfafebdf8858c4743ef3492d5f9d',
  'holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md': '02b74b6bae38cab26f17d6e085dd840c033990fc346d29020e9d394265389e5d',
  'holiday-lab/layout-qa/phase-latest.json': 'f6762b3b724f9e7890def79ed876b4c34e1037528d7ec9e2d5863fa5fee5f593',
  'holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md': '914e505961a0f653cd16d842cc9b7c65bcac664544dd4dc7f895c5abd8e64edb',
  'holiday-lab/layout-qa/layout-report.json': 'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336'
};
const images = ['dear-all-robots', 'garble-tv', 'healing-light', 'jingxiangtuan', 'kacha', 'today-restaurant', 'yuan-wang-wang'].map(n => 'images/news/2026-awards/' + n + '.jpg').concat('images/posters/clipstudio-grand-prize.jpg');
const guard = {
  protected: Object.entries(protectedFiles).map(([f, e]) => ({ file: f, expected: e, actual: sha(f), same: sha(f) === e })),
  original_images: images.map(f => ({ file: f, sha256: sha(f), git_unchanged: cp.spawnSync('git', ['-c', 'core.longpaths=true', 'diff', '--quiet', 'origin/main', '--', f]).status === 0 })),
  branch: cp.execSync('git -c core.longpaths=true branch --show-current', { encoding: 'utf8' }).trim(),
  origin_main: cp.execSync('git -c core.longpaths=true rev-parse refs/remotes/origin/main', { encoding: 'utf8' }).trim(),
  product_diff: cp.execSync('git -c core.longpaths=true diff --stat', { encoding: 'utf8' }).split('\n').filter(l => !/layout-qa/.test(l)).join('\n')
};
guard.pass = guard.protected.every(x => x.same) && guard.original_images.every(x => x.git_unchanged) && guard.origin_main === '1b8322e69d84549db220d849afb1aac0fb9d7c2a';
fs.writeFileSync(path.join(dir, 'guard.json'), JSON.stringify(guard, null, 2));
console.log('guard pass', guard.pass, 'codes', codes.join(','));
process.exitCode = guard.pass && codes[0] === 0 && codes[1] === 0 && codes[2] === 0 ? 0 : 1;
