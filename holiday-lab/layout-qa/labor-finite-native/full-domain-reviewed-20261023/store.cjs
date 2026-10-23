'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const e=require('../engine-v4/engine.cjs'),{inspectProcess}=require('../engine-v4/process-guard.cjs'),{createLayoutReportWriter,readLayoutReport}=require('../../layout-report-store.cjs'),{validateDomain}=require('./guard.cjs');
const read=f=>JSON.parse(fs.readFileSync(f)),name=i=>String(i).padStart(6,'0'),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]).sort();
const ref=(run,f)=>{const b=fs.readFileSync(f);return {file:path.relative(run,f).split(path.sep).join('/'),sha256:e.digest(b),bytes:b.length};};
function report(file,value){const w=createLayoutReportWriter(file);w.appendCase(value);w.checkpoint({schema_version:1,kind:'unaltered-native-full-evidence'});}
function evaluate(target,data,binding){try{return {accepted:true,domain:validateDomain(target,data,binding)};}catch(error){return {accepted:false,error:error.message};}}
function create(run,config,{probe=inspectProcess}={}){
 // mkdir is the exclusive claim; existing or interrupted runs are never resumed.
 fs.mkdirSync(run);for(const d of ['attempts','records','checkpoints'])fs.mkdirSync(path.join(run,d));
 const owner=config.owner;assert.equal(owner.state,'present');assert.equal(owner.pid,process.pid);assert.ok(owner.creation);assert.deepEqual(probe(process.pid),owner,'fresh owner identity required');
 e.writeJSON(path.join(run,'owner.json'),owner);e.writeJSON(path.join(run,'plan.json'),config.targets);
 const meta={schema:1,method:'fresh-only-complete-target-domain',binding:config.binding,binding_sha256:e.digest(config.binding),plan_sha256:e.digest(config.targets),target_count:config.targets.length,scope:config.scope,initial_owner:owner,owner_ref:ref(run,path.join(run,'owner.json')),plan_ref:ref(run,path.join(run,'plan.json'))};
 e.writeJSON(path.join(run,'meta.json'),meta);const genesis=e.digest(fs.readFileSync(path.join(run,'meta.json')));e.writeJSON(path.join(run,'lease-genesis.json'),{schema:1,owner_ref:meta.owner_ref,meta_sha256:genesis,owner});
 let i=0,previous=e.digest(fs.readFileSync(path.join(run,'lease-genesis.json'))),active=null,stopped=false;
 const owned=()=>{assert.deepEqual(read(e.checked(run,meta.owner_ref)),owner,'owner changed');assert.deepEqual(probe(process.pid),owner,'owner process identity changed');assert.equal(e.digest(fs.readFileSync(path.join(run,'meta.json'))),genesis,'run meta drift');assert.equal(e.digest(read(e.checked(run,meta.plan_ref))),meta.plan_sha256);};
 function commit(target,data,captureError,{fault=()=>{}}={}){
  owned();assert.ok(active&&!stopped,'no active immutable attempt');assert.deepEqual(target,config.targets[i]);assert.deepEqual(read(active.file),active.value,'attempt start drift');
  const rd=path.join(run,'records',name(i));fs.mkdirSync(rd);let outcome;
  if(data){
   // Preserve original case/sample/PNG even when guard or target fails.
   fs.writeFileSync(path.join(rd,'viewport.png'),data.png,{flag:'wx'});fault('after-image');
   report(path.join(rd,'sample.report.json'),{id:'sample/'+target.id,width:target.width,height:target.height,sample:data.sample});fault('after-sample');
   report(path.join(rd,'case.report.json'),data.case);fault('after-case');outcome=evaluate(target,data,config.binding);
  }else outcome={accepted:false,capture_error:captureError};
  e.writeJSON(path.join(rd,'outcome.json'),outcome);
  const end=path.join(run,'attempts',name(i)+'.end.json');e.writeJSON(end,{seq:i,target_id:target.id,start_ref:ref(run,active.file),outcome,stopped:!outcome.accepted||!outcome.domain?.valid});fault('after-end');
  owned();const inventory=[...walk(rd),active.file,end].map(f=>ref(run,f)),payload={seq:i,target,target_sha256:e.digest(target),prev_hash:previous,lease_sha256:e.digest(fs.readFileSync(path.join(run,'lease-genesis.json'))),inventory,outcome},event={payload,hash:e.digest(payload)};
  const eventFile=path.join(run,'checkpoints',name(i)+'.json');e.writeJSON(eventFile,event);fault('after-checkpoint');previous=event.hash;i++;active=null;stopped=!outcome.accepted||!outcome.domain?.valid;return outcome;
 }
 return {start(target){owned();assert.ok(!active&&!stopped,'one attempt only; no retry');assert.deepEqual(target,config.targets[i],'strict complete plan order');const value={seq:i,target,owner_ref:meta.owner_ref,prev_hash:previous,started_at:new Date().toISOString()},file=path.join(run,'attempts',name(i)+'.start.json');e.writeJSON(file,value);active={file,value};},finish:(t,d,o)=>commit(t,d,null,o),captureFailed:(t,error)=>commit(t,null,String(error)),get count(){return i;},get stopped(){return stopped;}};
}
function verify(run,config){
 assert.deepEqual(fs.readdirSync(run).sort(),['attempts','records','checkpoints','owner.json','plan.json','meta.json','lease-genesis.json',...['failure.json','completion.json'].filter(f=>fs.existsSync(path.join(run,f)))].sort(),'unexpected root inventory');
 const meta=read(path.join(run,'meta.json'));assert.equal(meta.schema,1);assert.deepEqual(meta.binding,config.binding);assert.equal(meta.binding_sha256,e.digest(config.binding));assert.equal(meta.plan_sha256,e.digest(config.targets));assert.equal(meta.target_count,config.targets.length);assert.deepEqual(meta.scope,config.scope);if(config.owner)assert.deepEqual(meta.initial_owner,config.owner);
 assert.deepEqual(read(e.checked(run,meta.plan_ref)),config.targets);assert.deepEqual(read(e.checked(run,meta.owner_ref)),meta.initial_owner);
 const lease=read(path.join(run,'lease-genesis.json'));assert.deepEqual(lease,{schema:1,owner_ref:meta.owner_ref,meta_sha256:e.digest(fs.readFileSync(path.join(run,'meta.json'))),owner:meta.initial_owner});let previous=e.digest(fs.readFileSync(path.join(run,'lease-genesis.json'))),stopped=false;
 const files=fs.readdirSync(path.join(run,'checkpoints')).sort(),rows=[];
 for(let i=0;i<files.length;i++){
  assert.ok(!stopped,'records after failed target');assert.equal(files[i],name(i)+'.json');const event=read(path.join(run,'checkpoints',files[i])),p=event.payload,target=config.targets[i];assert.ok(target);assert.equal(p.seq,i);assert.equal(event.hash,e.digest(p));assert.equal(p.prev_hash,previous);assert.deepEqual(p.target,target);assert.equal(p.target_sha256,e.digest(target));assert.equal(p.lease_sha256,e.digest(fs.readFileSync(path.join(run,'lease-genesis.json'))));
  for(const r of p.inventory)e.checked(run,r);
  const rd=path.join(run,'records',name(i)),startFile=path.join(run,'attempts',name(i)+'.start.json'),endFile=path.join(run,'attempts',name(i)+'.end.json');assert.deepEqual(p.inventory.map(r=>r.file).sort(),[...walk(rd),startFile,endFile].map(f=>path.relative(run,f).split(path.sep).join('/')).sort(),'record inventory mismatch');
  const start=read(startFile),end=read(endFile);assert.equal(start.seq,i);assert.deepEqual(start.target,target);assert.deepEqual(start.owner_ref,meta.owner_ref);assert.equal(start.prev_hash,previous);assert.equal(end.seq,i);assert.equal(end.target_id,target.id);assert.deepEqual(end.start_ref,ref(run,startFile));
  let row,outcome;
  if(Object.hasOwn(p.outcome,'capture_error')){assert.deepEqual(fs.readdirSync(rd),['outcome.json']);outcome={accepted:false,capture_error:p.outcome.capture_error};assert.equal(typeof outcome.capture_error,'string');}
  else{const c=readLayoutReport(path.join(rd,'case.report.json'),{cacheSize:0}),s=readLayoutReport(path.join(rd,'sample.report.json'),{cacheSize:0});assert.equal(c.cases.length,1);assert.equal(s.cases.length,1);row={case:c.cases[0],sample:s.cases[0].sample,png:fs.readFileSync(path.join(rd,'viewport.png'))};outcome=evaluate(target,row,config.binding);}
  assert.deepEqual(p.outcome,outcome,'offline independent guard mismatch');assert.deepEqual(read(path.join(rd,'outcome.json')),outcome);assert.deepEqual(end.outcome,outcome);stopped=!outcome.accepted||!outcome.domain?.valid;assert.equal(end.stopped,stopped);rows.push({outcome,rd,has_data:!!row,original_pass:row?.case.pass});previous=event.hash;
 }
 assert.deepEqual(fs.readdirSync(path.join(run,'records')).sort(),files.map((_,i)=>name(i)),'half-written/orphan record');assert.deepEqual(fs.readdirSync(path.join(run,'attempts')).sort(),files.flatMap((_,i)=>[name(i)+'.end.json',name(i)+'.start.json']).sort(),'unfinished immutable attempt');
 return {count:rows.length,complete:rows.length===config.targets.length&&!stopped,stopped,last_hash:previous,load:i=>{const r=rows[i];if(!r)throw Error('Unknown saved row');if(!r.has_data)return {outcome:r.outcome};return {outcome:r.outcome,case:readLayoutReport(path.join(r.rd,'case.report.json'),{cacheSize:0}).cases[0],sample:readLayoutReport(path.join(r.rd,'sample.report.json'),{cacheSize:0}).cases[0].sample,png:fs.readFileSync(path.join(r.rd,'viewport.png'))};},original_pass_count:rows.filter(r=>r.original_pass===true).length,original_false_count:rows.filter(r=>r.original_pass===false).length,domain_valid_count:rows.filter(r=>r.outcome.domain?.valid===true).length,global_ui_pass:false,full_project_approved:false};
}
module.exports={create,verify};
