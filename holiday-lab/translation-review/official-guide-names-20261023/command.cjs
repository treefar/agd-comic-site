const fs=require('fs'),path=require('path'),cp=require('child_process');
const tag=process.argv[2],args=process.argv.slice(3),dir=__dirname;
if(!/^[a-z0-9-]+$/.test(tag))throw Error('tag');
if(fs.existsSync(path.join(dir,tag+'.json')))throw Error('receipt already exists');
const r=cp.spawnSync(process.execPath,args,{cwd:process.cwd(),encoding:'utf8',maxBuffer:50*1024*1024});
const receipt={command:[process.execPath,...args],cwd:process.cwd(),started_tag:tag,exit_code:r.status,stdout:r.stdout||'',stderr:r.stderr||'',error:r.error?.message||null,recorded_at:new Date().toISOString()};
fs.writeFileSync(path.join(dir,tag+'.json'),JSON.stringify(receipt,null,2)+'\n');
fs.writeFileSync(path.join(dir,tag+'-output.txt'),(r.stdout||'')+(r.stderr?'\nSTDERR\n'+r.stderr:''));
const show=s=>s.length>24000?s.slice(0,12000)+'\n[terminal excerpt; complete stdout/stderr retained in receipt]\n'+s.slice(-6000):s;
process.stdout.write(show(r.stdout||''));process.stderr.write(show(r.stderr||''));process.exitCode=r.status??1;

