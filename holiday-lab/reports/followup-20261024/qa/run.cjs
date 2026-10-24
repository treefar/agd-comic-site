const fs=require('fs'),path=require('path'),cp=require('child_process');
const tag=process.argv[2]||'main-r2';
const args=[path.join(__dirname,'check.cjs'),'http://127.0.0.1:8876/','.measure-followup-20261024-01',tag];
const r=cp.spawnSync(process.execPath,args,{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
fs.writeFileSync(path.join(__dirname,'command.json'),JSON.stringify({command:[process.execPath,...args],cwd:path.resolve(__dirname,'../../../..'),stdout:r.stdout,stderr:r.stderr,exit_code:r.status},null,2)+'\n');
if(fs.existsSync(path.join(__dirname,tag,'result.json')))fs.copyFileSync(path.join(__dirname,tag,'result.json'),path.join(__dirname,'result.json'));
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status;
