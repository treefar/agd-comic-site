const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const [tag,...args]=process.argv.slice(2);if(!/^[a-z0-9-]+$/.test(tag)||!args.length)throw Error('tag and node arguments required');
const r=cp.spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:8*1024*1024});
const receipt={command:[process.execPath,...args],cwd:process.cwd(),observed_utc:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status,error:r.error?.message};
fs.writeFileSync(path.join(__dirname,tag+'.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:tag+'.json',exit_code:r.status,stdout_tail:r.stdout?.slice(-1500),stderr_tail:r.stderr?.slice(-1000)}));process.exitCode=r.status??1;
