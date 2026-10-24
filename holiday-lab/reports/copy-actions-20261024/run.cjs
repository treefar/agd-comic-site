const fs=require('fs'),path=require('path'),cp=require('child_process');const phase=process.argv[2];
if(!['red','green'].includes(phase))throw Error('Use red or green');
const started=new Date().toISOString(),r=cp.spawnSync(process.execPath,[path.join(__dirname,'regression.cjs'),phase],{cwd:path.resolve(__dirname,'../../..'),encoding:'utf8'});
const o={command:'node holiday-lab/reports/copy-actions-20261024/regression.cjs '+phase,cwd:path.resolve(__dirname,'../../..'),started,finished:new Date().toISOString(),stdout:r.stdout,stderr:r.stderr,exit_code:r.status};
const fixed=path.join(__dirname,phase+'-command.json');
const output=fs.existsSync(fixed)?path.join(__dirname,phase+'-command-'+Date.now()+'.json'):fixed;
fs.writeFileSync(output,JSON.stringify(o,null,2)+'\n',{flag:'wx'});process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status??1;
