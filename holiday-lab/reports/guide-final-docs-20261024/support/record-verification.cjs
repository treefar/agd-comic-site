const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const command=process.execPath,args=[path.join(__dirname,'verify-research.cjs')];
const started=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
fs.writeFileSync(path.join(__dirname,'verify.stdout.txt'),r.stdout||'');fs.writeFileSync(path.join(__dirname,'verify.stderr.txt'),r.stderr||'');
fs.writeFileSync(path.join(__dirname,'verify-command.json'),JSON.stringify({command,args,cwd:path.resolve(__dirname,'../../../..'),started,finished:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status,error:r.error?.message},null,2));
process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');console.log('EXIT_CODE='+r.status);process.exitCode=r.status??1;
