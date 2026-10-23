// Final local evidence refresh. Does not build the website, publish, or modify product sources.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const commands = [
  ['dashboard-final-build', ['holiday-lab/build-dashboard.mjs']],
  ['dashboard-final-tests', ['--test', 'holiday-lab/dashboard/progress-adapter.test.cjs', 'holiday-lab/dashboard/ui-authority.test.cjs', 'holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.test.cjs']],
  ['dashboard-final-smoke', ['holiday-lab/dashboard/smoke.cjs']],
];
for (const [name, args] of commands) {
  const r = cp.spawnSync(process.execPath, args, {cwd:root, encoding:'utf8', maxBuffer:10*1024*1024,
    env:{...process.env, DASHBOARD_QA_URL:'http://127.0.0.1:8863'}});
  fs.writeFileSync(path.join(__dirname, name+'-command.json'), JSON.stringify({at:new Date().toISOString(), command:'node '+args.join(' '), exit_code:r.status, stdout:r.stdout, stderr:r.stderr}, null, 2));
  console.log(name, 'exit', r.status, r.stdout.slice(-1500));
  if (r.status !== 0) {process.exitCode = 1; break;}
  if (name.endsWith('smoke')) fs.copyFileSync(path.join(root,'holiday-lab/dashboard/smoke-result.json'),path.join(__dirname,'dashboard-final-smoke-result.json'));
}
