const fs=require('fs'),path=require('path'),cp=require('child_process'),target=path.join(__dirname,'portability-command.json');
if(fs.existsSync(target))throw new Error('Fresh receipt only');
const command=[process.execPath,path.join(__dirname,'check-portability.cjs')],at=new Date().toISOString();
const r=cp.spawnSync(command[0],command.slice(1),{cwd:'C:/agywork/agd-holiday-prototypes',encoding:'utf8',timeout:90000,maxBuffer:8*1024*1024,windowsHide:true});
fs.writeFileSync(target,JSON.stringify({at,command,stdout:r.stdout||'',stderr:r.stderr||'',exit_code:r.status,signal:r.signal,error:r.error?String(r.error):null},null,2)+'\n');
process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');process.exitCode=r.status===0?0:1;
