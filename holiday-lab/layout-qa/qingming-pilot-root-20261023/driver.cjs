// Root-supervised single pilot. Fresh paths only, no automatic retry or full-domain mode.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const own=__dirname,base=path.resolve(own,'../qingming-error-domain-20261023'),N=require(path.join(base,'native-tools.cjs'));
const G=require('../labor-finite-native/engine-v2/process-guard.cjs');
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
async function main(){
 const approval=path.join(own,'root-approval.json'),a=JSON.parse(fs.readFileSync(approval));N.approval(a,N.bindings());
 assert.equal(fs.existsSync(path.join(base,'native-runs',a.run_name)),false,'No restart of an existing pilot');
 assert.deepEqual(require(path.join(base,'runtime-identifiers.cjs')).build(),JSON.parse(fs.readFileSync(path.join(base,'runtime-identifiers-v4.json'))));
 await require(path.join(base,'native-run.cjs')).sourceReceipts();
 const launch=path.join(own,'launch-01');fs.mkdirSync(launch);
 const out=fs.openSync(path.join(launch,'stdout.log'),'wx'),err=fs.openSync(path.join(launch,'stderr.log'),'wx');
 const args=[path.join(base,'native-run.cjs'),'--run',approval];let child;
 try{child=spawn(process.execPath,args,{cwd:path.resolve(base,'../../..'),windowsHide:true,stdio:['ignore',out,err]});}finally{fs.closeSync(out);fs.closeSync(err);}
 let done=false;const terminal=extra=>{if(done)return;done=true;write(path.join(launch,'terminal.json'),{time:new Date().toISOString(),runner_pid:child.pid,launch_count:1,automatic_restart:false,...extra});};
 child.on('error',e=>{terminal({exit_code:null,error:e.stack});process.exitCode=1;});
 child.on('exit',(code,signal)=>{terminal({exit_code:code,signal});process.exitCode=code??1;});
 const record={time:new Date().toISOString(),driver:G.inspectProcess(process.pid),runner:G.inspectProcess(child.pid),args,approval,run_name:a.run_name,mode:'bounded-pilot-only',maximum_contexts:6,maximum_target_frames:36,full_project_approved:false};
 write(path.join(launch,'launch.json'),record);console.log(JSON.stringify(record,null,2));
 await new Promise(resolve=>{if(done)resolve();else child.once('close',resolve);});
}
main().catch(e=>{console.error(e);process.exitCode=1;});
