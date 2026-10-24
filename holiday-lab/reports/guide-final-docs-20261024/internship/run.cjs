const cp=require('child_process'),fs=require('fs'),path=require('path');
const start=new Date().toISOString(),r=cp.spawnSync(process.execPath,[path.join(__dirname,'verify.cjs')],{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
const o={command:'node holiday-lab/reports/guide-final-docs-20261024/internship/verify.cjs',cwd:path.resolve(__dirname,'../../../..'),started:start,finished:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status};
fs.writeFileSync(path.join(__dirname,'command.json'),JSON.stringify(o,null,2)+'\n');process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status??1;
