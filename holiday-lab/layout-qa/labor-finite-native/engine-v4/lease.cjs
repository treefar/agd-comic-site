'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),e=require('./engine.cjs'),g=require('./process-guard.cjs');
// The exclusive per-epoch claim is acquired BEFORE the decisive latest-lease/PID check.
// Never remove a claim. Partial ownership evidence requires manual review, not automatic retry.
function acquireResume(run,{resume=false,expectedPrevious,owner,probeFn=g.inspectProcess,afterPrecheck=()=>{},afterClaim=()=>{}}={}){
 assert.equal(resume,true,'explicit --resume required');assert.ok(expectedPrevious?.sha256,'verified expected previous lease required');assert.ok(owner?.pid>0&&owner.creation,'uncertain own process identity');
 const observedBefore=e.readLeases(run),previous=observedBefore.at(-1);assert.deepEqual(previous.ref,expectedPrevious,'stale precheck: latest lease changed');g.assertResume(previous.owner,probeFn(previous.owner.pid),true);afterPrecheck();const seq=observedBefore.length,name=String(seq).padStart(6,'0'),claims=path.join(run,'claims');if(!fs.existsSync(claims))fs.mkdirSync(claims,{recursive:true});const claimFile=path.join(claims,name+'.json'),meta=JSON.parse(fs.readFileSync(path.join(run,'run.meta.json')));
 // wx is the cross-process linearization point. Another contender for this epoch cannot pass.
 e.writeJSON(claimFile,{schema:4,seq,owner,previous_ref:expectedPrevious,binding_sha256:meta.binding_sha256});afterClaim();
 const current=e.readLeases(run,{pendingClaim:name}).at(-1);assert.deepEqual(current.ref,expectedPrevious,'latest lease changed inside exclusive claim');
 const self=probeFn(owner.pid);assert.ok(self?.state==='present'&&self.pid===owner.pid&&self.creation===owner.creation,'uncertain own process identity inside atomic claim');
 const observed=probeFn(current.owner.pid);g.assertResume(current.owner,observed,true);
 assert.deepEqual(e.readLeases(run,{pendingClaim:name}).at(-1).ref,expectedPrevious,'latest lease changed before install');
 const terminationFile=path.join(claims,name+'.termination.json');e.writeJSON(terminationFile,{schema:4,seq,previous_ref:expectedPrevious,observed,observed_at:new Date().toISOString()});
 const toRef=file=>{const bytes=fs.readFileSync(file);return {file:path.relative(run,file).split(path.sep).join('/'),sha256:e.digest(bytes),bytes:bytes.length};};
 const leaseFile=path.join(run,'leases',name+'.json');e.writeJSON(leaseFile,{seq,prev_hash:expectedPrevious.sha256,binding_sha256:meta.binding_sha256,owner,claim_ref:toRef(claimFile),termination_ref:toRef(terminationFile)});e.writeJSON(leaseFile+'.receipt.json',toRef(leaseFile));
 e.readLeases(run);return {seq,owner,claim_ref:toRef(claimFile)};
}
module.exports={acquireResume};
