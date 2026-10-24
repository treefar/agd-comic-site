const cp=require('child_process'),fs=require('fs'),path=require('path');
const started=new Date().toISOString();
const r=cp.spawnSync(process.execPath,[path.join(__dirname,'verify.cjs')],{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
const receipt={command:'node holiday-lab/reports/current-rules-20261024/study/verify.cjs',cwd:path.resolve(__dirname,'../../../..'),started,finished:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status};
fs.writeFileSync(path.join(__dirname,'command.json'),JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status??1;
