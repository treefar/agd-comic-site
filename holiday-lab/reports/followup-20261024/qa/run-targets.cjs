const fs=require('fs'),path=require('path'),cp=require('child_process'),tag=process.argv[2]||'new-targets-r2',args=[path.join(__dirname,'new-targets.cjs'),tag];
const r=cp.spawnSync(process.execPath,args,{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
const commandFile=path.join(__dirname,'new-targets-command.json');if(fs.existsSync(commandFile))fs.copyFileSync(commandFile,path.join(__dirname,'new-targets-command-v1.json'));
fs.writeFileSync(commandFile,JSON.stringify({command:[process.execPath,...args],cwd:path.resolve(__dirname,'../../../..'),stdout:r.stdout,stderr:r.stderr,exit_code:r.status},null,2)+'\n');
const fixed=path.join(__dirname,'new-targets/result.json');if(fs.existsSync(fixed))fs.copyFileSync(fixed,path.join(__dirname,'new-targets/result-v1.json'));
if(fs.existsSync(path.join(__dirname,tag,'result.json')))fs.copyFileSync(path.join(__dirname,tag,'result.json'),fixed);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status;
