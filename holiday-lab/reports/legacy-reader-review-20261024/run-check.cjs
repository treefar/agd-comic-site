const fs=require('fs'),path=require('path'),cp=require('child_process');
const file=path.join(__dirname,'check-parser.cjs'),at=new Date().toISOString();
const r=cp.spawnSync(process.execPath,[file],{cwd:'C:/agywork/agd-holiday-prototypes',encoding:'utf8',timeout:120000,maxBuffer:12*1024*1024,windowsHide:true});
const result={at,command:[process.execPath,file],cwd:'C:/agywork/agd-holiday-prototypes',stdout:r.stdout||'',stderr:r.stderr||'',exit_code:r.status,signal:r.signal,error:r.error?String(r.error):null,finished_at:new Date().toISOString()};
const target=path.join(__dirname,'check-command.json');if(fs.existsSync(target))throw new Error('Do not overwrite existing receipt');
fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');process.stdout.write(result.stdout);process.stderr.write(result.stderr);process.exitCode=r.status===0?0:1;
