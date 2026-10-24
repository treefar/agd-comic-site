const cp=require('child_process'),fs=require('fs'),path=require('path');
const file=path.join(__dirname,'verify.cjs'),r=cp.spawnSync(process.execPath,[file],{encoding:'utf8'});
const receipt={command:JSON.stringify(process.execPath)+' '+JSON.stringify(file),cwd:process.cwd(),at:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status,scope:'local read-only product check; writes report folder only'};
fs.writeFileSync(path.join(__dirname,'verify-command.json'),JSON.stringify(receipt,null,2)+'\n');console.log(r.stdout);if(r.stderr)console.error(r.stderr);process.exitCode=r.status??1;
