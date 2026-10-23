'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const e=require('./engine.cjs'),g=require('./process-guard.cjs'),{dir,loadFreeze,liveReceipts}=require('./binding.cjs'),{buildPlan}=require('./plan.cjs');
async function main(){
 const args=process.argv.slice(2),resume=args.includes('--resume'),name=args.find(x=>x.startsWith('--run='))?.slice(6),approvalPath=args.find(x=>x.startsWith('--approval='))?.slice(11);
 assert.ok(args.includes('--full'),'Only reviewed --full mode exists; no automatic native test run');assert.ok(name&&/^[a-zA-Z0-9_-]+$/u.test(name),'explicit safe run name required');assert.ok(approvalPath,'explicit root engine-v4 approval required');
 const frozen=loadFreeze(),binding=frozen.binding,approval=JSON.parse(fs.readFileSync(approvalPath));e.assertApproval(approval,binding);assert.equal(approval.freeze_sha256,frozen.sha256,'approval must bind new exact freeze bytes');
 const targets=buildPlan(),run=path.join(dir,'runs',name);let writer,resumePrevious;
 if(fs.existsSync(run)){
  assert.equal(resume,true,'explicit --resume required for existing run');const verified=e.verifyRun(run,{binding,targets});resumePrevious=verified.leases.at(-1).ref;
 }else assert.equal(resume,false,'Cannot resume missing run');
 const owner=g.inspectProcess(process.pid);assert.ok(owner.state==='present'&&owner.pid===process.pid&&owner.creation,'uncertain current PID creation identity');assert.deepEqual(await liveReceipts(binding),binding.receipts);
 if(fs.existsSync(run)){require('./lease.cjs').acquireResume(run,{resume:true,expectedPrevious:resumePrevious,owner});writer=e.openAppender(run,{binding,targets});}else writer=e.createRun(run,{binding,targets,owner});
 console.log(JSON.stringify({pid:owner.pid,creation:owner.creation,run,targets:targets.length,resume,existing_targets:writer.length,freeze:frozen.sha256,global_bound:false}));
 const {createNative}=require('./native.cjs'),native=await createNative(binding);
 try{for(const target of targets){if(writer.has(target.id))continue;const data=await native.capture(target),event=writer.append(target,data);console.log(JSON.stringify({seq:event.payload.seq,id:target.id,event_hash:event.hash,pass:data.case.pass}));assert.equal(data.case.pass,true,'native target failed; evidence retained, do not restart automatically');}assert.deepEqual(await liveReceipts(binding),binding.receipts);loadFreeze();const result=e.verifyRun(run,{binding,targets});assert.equal(result.count,targets.length);e.writeJSON(path.join(run,'completed-'+Date.now()+'.json'),{date:new Date().toISOString(),targets:result.count,last_hash:result.last_hash,full_project_approved:false,global_bound:false});console.log('COLLECTION COMPLETE; GLOBAL_BOUND=NO pending independent review');}
 finally{await native.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
