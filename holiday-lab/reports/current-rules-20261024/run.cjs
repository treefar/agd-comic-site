// Keep exact command, stdout, stderr and exit status for each finite research check.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const [tag,...args]=process.argv.slice(2);assert.match(tag||'',/^[a-z0-9-]+$/);assert.ok(args.length);
const file=path.join(__dirname,tag+'.json');assert.ok(!fs.existsSync(file),'Choose a fresh receipt tag');
const r=cp.spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:12*1024*1024});
fs.writeFileSync(file,JSON.stringify({command:[process.execPath,...args],cwd:process.cwd(),observed_utc:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status,error:r.error?.message},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:file,exit_code:r.status,stdout_tail:r.stdout?.slice(-2000),stderr_tail:r.stderr?.slice(-1200)}));process.exitCode=r.status??1;
