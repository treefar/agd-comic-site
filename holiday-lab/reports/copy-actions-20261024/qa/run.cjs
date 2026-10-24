const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const [base,build,tag,ready]=process.argv.slice(2);
if(!/^raw-[a-z0-9-]+$/.test(tag||'')||ready!=='--freeze-ready')throw Error('Explicit new base/build, fresh raw-tag and --freeze-ready are required.');
const command=[process.execPath,path.join(__dirname,'check.cjs'),base,build,tag,ready],started=new Date().toISOString();
const r=cp.spawnSync(command[0],command.slice(1),{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8',maxBuffer:12e6});
const receipt={command,cwd:path.resolve(__dirname,'../../../..'),started,finished:new Date().toISOString(),stdout:r.stdout||'',stderr:r.stderr||'',exit_code:r.status,error:r.error?.message||null};
fs.writeFileSync(path.join(__dirname,tag+'-command.json'),JSON.stringify(receipt,null,2),{flag:'wx'});process.stdout.write(receipt.stdout);process.stderr.write(receipt.stderr);console.log('EXIT_CODE='+r.status);process.exitCode=r.status??1;
