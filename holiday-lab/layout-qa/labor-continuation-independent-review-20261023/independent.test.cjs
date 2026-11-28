// Offline fixtures only; original evidence is read, never changed; all writes stay beside this file.
const fs=require('node:fs'),path=require('node:path'),test=require('node:test'),assert=require('node:assert/strict');
const source=path.resolve(__dirname,'../labor-finite-native/continuation-20261023'),c=require(path.join(source,'continue.cjs')),a=require(path.join(source,'attempt.cjs')),store=require(path.resolve(source,'../full-domain-reviewed-20261023/store.cjs'));
test('domain complete cannot credit a run without completion or with final-source failure',()=>{
 const base={domain_complete:true,new_attempts:2453,credited:2453,completion_present:false,failure:null},pending=c.terminalState(base);assert.equal(pending.domain_complete,true);assert.equal(pending.run_complete,false);assert.equal(pending.complete,false);assert.match(pending.run_status,/^domain-complete-awaiting-final-source/);
 const failure={captured_new_attempts:2453,error:{stage:'final-source',message:'offline simulated reset'},automatic_retry:false,original_failure_untouched:true},failed=c.terminalState({...base,failure});assert.equal(failed.complete,false);assert.equal(failed.run_status,'failed');assert.deepEqual(failed.terminal_failure,failure);
 const cleanup={schema:1,attempted:true,native_created:true,closed:true,status:'closed',error:null},done=c.terminalState({...base,completion_present:true,cleanup});assert.equal(done.complete,true);assert.equal(done.run_complete,true);assert.throws(()=>c.terminalState({...base,completion_present:true}));assert.throws(()=>c.terminalState({...base,completion_present:true,cleanup:{...cleanup,closed:false,status:'failed'}}));
 assert.throws(()=>c.terminalState({...base,completion_present:true,failure}));assert.throws(()=>c.terminalState({...base,domain_complete:false,completion_present:true}));
 const unknown=c.terminalState({domain_complete:false,new_attempts:1,credited:0,completion_present:false,failure:{captured_new_attempts:1,automatic_retry:false,original_failure_untouched:true,error:{stage:'unknown'}}});assert.equal(unknown.total_historical_attempts,333);assert.equal(unknown.failed_obligation_attempted,true);assert.equal(unknown.failed_obligation_recollected_validly,false);
});
test('exact 331-prefix and 2453-suffix union retains original failed attempt',()=>{
 const full=Array.from({length:2784},(_,i)=>({id:i===331?c.RETRY_TARGET:'offline-target/'+i})),prefix=full.slice(0,331).map(target=>({target,valid:true})),suffix=full.slice(331).map(target=>({target,valid:true,context_complete:true})),history={original_attempts:332,successful_prefix:331,failed_original_seq:331,failed_target:c.RETRY_TARGET,original_failure_retained:true,original_failure_has_png:false};
 assert.deepEqual(c.makeSuffix(full),full.slice(331));assert.equal(c.reconcile(full,prefix,suffix,history).union_credited_targets,2784);assert.equal(c.reconcile(full,prefix,suffix.slice(0,-1),history).complete,false);
 for(const mutate of [x=>x[0].target=full[0],x=>x[1].target=x[0].target,x=>x[0].context_complete=false,x=>x[0].valid=false]){const bad=structuredClone(suffix);mutate(bad);assert.throws(()=>c.reconcile(full,prefix,bad,history));}
 assert.throws(()=>c.reconcile(full,prefix,suffix,{...history,original_failure_retained:false}));assert.throws(()=>c.approve({approved:true,scope:'old-full-scope'},{}));
});
function fixture(mode){
 const old=path.resolve(source,'../full-domain-reviewed-20261023/full-run'),meta=JSON.parse(fs.readFileSync(path.join(old,'meta.json'))),cp=JSON.parse(fs.readFileSync(path.join(old,'checkpoints/000000.json'))),rd=path.join(old,'records/000000'),{readLayoutReport}=require(path.resolve(source,'../../layout-report-store.cjs'));
 const data={case:readLayoutReport(path.join(rd,'case.report.json')).cases[0],sample:readLayoutReport(path.join(rd,'sample.report.json')).cases[0].sample,png:fs.readFileSync(path.join(rd,'viewport.png'))},target=cp.payload.target,owner={state:'present',pid:process.pid,creation:'independent-offline-fixture-only'},config={binding:meta.binding,targets:[target],scope:{independent_offline_fixture:true},owner},container=fs.mkdtempSync(path.join(__dirname,'fixture-'+mode+'-')),run=path.join(container,'run'),contexts=path.join(container,'contexts');fs.mkdirSync(contexts);const writer=store.create(run,config,{probe:()=>owner});
 return {container,run,contexts,writer,target,i:0,explicit_recollection:{independent_offline_fixture:true},binding:meta.binding,config,data};
}
test('full/partial/native-error and half-written returns are preserved without an extra HTTP',async()=>{
 const original=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw Error('forbidden extra HTTP');};
 try{for(const mode of ['post-return','partial','native-error','half-write']){
  const x=fixture(mode),cause=Object.assign(new Error('read ECONNRESET'),{code:'ECONNRESET'}),error=Object.assign(new TypeError('fetch failed'),{cause});let writer=x.writer;
  if(mode==='half-write')writer={...x.writer,finish:(t,d)=>x.writer.finish(t,d,{fault:stage=>{if(stage==='after-sample')throw Error('offline half-write');}})};
  const opts={...x,writer,capture:async()=>{if(mode==='native-error')throw error;return mode==='partial'?{case:{id:x.target.id},png:x.data.png}:x.data;},fault:stage=>{if(mode==='post-return'&&stage==='after-native-return')throw error;}};
  await assert.rejects(a.captureOne(opts));
  if(mode==='half-write'){assert.throws(()=>store.verify(x.run,x.config));assert.deepEqual(fs.readFileSync(path.join(x.run,'records/000000/viewport.png')),x.data.png);assert.ok(fs.existsSync(path.join(x.run,'records/000000/sample.report.json')));continue;}
  const saved=store.verify(x.run,x.config),context=a.verifyContext({...x,load:()=>saved.load(0)});assert.equal(context.credited,false);assert.equal(saved.count,1);
  if(mode==='post-return'){assert.deepEqual(saved.load(0).case,x.data.case);assert.deepEqual(saved.load(0).sample,x.data.sample);assert.deepEqual(saved.load(0).png,x.data.png);assert.equal(context.end.error.stage,'post-native-source-context');assert.equal(context.end.error.cause.code,'ECONNRESET');}
  if(mode==='native-error'){assert.equal(context.end.native_data_returned,false);assert.equal(context.end.error.original_internal_source_stage,'unknown');assert.equal(context.end.error.cause.code,'ECONNRESET');assert.equal(saved.domain_valid_count,0);}
  if(mode==='partial'){assert.equal(context.end.native_return_complete,false);assert.equal(saved.domain_valid_count,0);const partial=JSON.parse(fs.readFileSync(path.join(x.contexts,'000000.partial-native-return.json')));assert.equal(partial.partial_png_base64,x.data.png.toString('base64'));}
 }}finally{global.fetch=original;}assert.equal(calls,0);
});
test('context receipt detects changed end data without altering any original evidence',async()=>{
 const x=fixture('end-tamper');await a.captureOne({...x,capture:async()=>x.data});const saved=store.verify(x.run,x.config);assert.equal(a.verifyContext({...x,load:()=>saved.load(0)}).credited,true);const endFile=path.join(x.contexts,'000000.end.json'),end=JSON.parse(fs.readFileSync(endFile));end.error={stage:'injected-offline-only'};fs.writeFileSync(endFile,JSON.stringify(end));assert.throws(()=>a.verifyContext({...x,load:()=>saved.load(0)}));
});
