'use strict';
// Offline source adapter only; never imports native/browser collectors or issues HTTP.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const icon='356075a7feaaa023f1998b1214823c4371af8b70436427fdc7b7e282cb55efc1',scope='favicon404-and-qingming-core-flow-only';
function validateVerification(v,counts,receipt,verification){
 assert.equal(v.schema,1);assert.equal(v.scope,scope);assert.equal(v.exit_code,0);
 assert.equal(path.posix.normalize(path.posix.join(path.posix.dirname(verification),v.core_run)),receipt);
 const r=v.result;assert.equal(r.pass,true);assert.equal(r.full_project_approved,false);assert.equal(r.canonical_eligible,false);
 assert.equal(r.contexts,counts.contexts);assert.equal(r.explicit_icon_http_receipts,counts.icons);assert.equal(r.screenshots,counts.png);
 assert.equal(r.response_bodies,counts.response_bodies);assert.equal(r.build_files,counts.build_files);assert.equal(r.source_files_http_before_after,counts.source_files);
 assert.equal(r.coreflow_errors,0);assert.equal(r.automatic_icon_fetch_proven_by_core_run,false);
 assert.equal(r.supplemental_automatic_icon_contexts,2);assert.equal(r.port8856_favicon_png,true);assert.equal(r.unknown_resource_404,true);
}
function assess(root,policy,record){const out={receipt_loaded:false,verified:false,source:policy.qingming_receipt||null,reason:policy.qingming_note,scope,checks:[],counts:{}};
 const read=(f,json=true)=>record(f,json),add=(name,fn)=>{fn();out.checks.push(name);};
 try{
  if(!policy.qingming_receipt)return out;
  const base=path.posix.dirname(policy.qingming_receipt),at=f=>base+'/'+f,result=read(policy.qingming_receipt);out.receipt_loaded=true;
  const method=read(at('method.json')),before=read(at('build-before.json')),after=read(at('build-after.json')),sourceBefore=read(at('source-before.json')),sourceAfter=read(at('source-after.json'));
  add('exact scope and six contexts',()=>{assert.equal(result.scope,scope);assert.equal(result.full_project_approved,false);assert.equal(result.canonical_eligible,false);assert.equal(result.build_stable,true);assert.equal(result.pass,true);assert.deepEqual(result.results.map(r=>r.id),['zh-320','zh-1440','en-320','en-1440','ja-320','ja-1440']);});
  add('method and immutable build source',()=>{const rel=path.relative(root,method.file).replaceAll('\\','/');assert.ok(!rel.startsWith('..'));assert.equal(hash(Buffer.from(read(rel,false))),method.sha256);assert.equal(method.scope,scope);assert.equal(path.resolve(method.build),path.resolve(root,policy.local_build));assert.deepEqual(before,after);assert.equal(new Set(before.map(r=>r.file)).size,before.length);const actual=[];function walk(dir,prefix=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const rel=prefix+e.name;if(e.isDirectory())walk(path.join(dir,e.name),rel+'/');else actual.push(rel);}}walk(method.build);assert.deepEqual(actual.sort(),before.map(r=>r.file).sort());for(const f of before){const b=fs.readFileSync(path.join(method.build,f.file));assert.equal(hash(b),f.sha256);assert.equal(b.length,f.bytes);}});
  add('source before/after response bytes',()=>{const trim=rs=>rs.map(({started,finished,...r})=>r);assert.deepEqual(trim(sourceBefore),trim(sourceAfter));assert.ok(sourceBefore.length>0);for(const r of sourceBefore){const b=before.find(x=>x.file===r.file);assert.equal(r.status,200);assert.equal(r.sha256,b.sha256);assert.equal(r.bytes,b.bytes);}});
  let png=0,icons=0,bodies=0;
  for(const r of result.results)add('raw '+r.id,()=>{assert.equal(r.id,r.lang+'-'+r.width);assert.equal(r.failure,null);assert.equal(r.flow_complete,true);assert.equal(r.pass,true);assert.equal(r.diagnostics_clear,true);const events=read(at(r.id+'/events.json')),steps=read(at(r.id+'/steps.json')),artifact=read(at(r.id+'/artifact.json')),errors=events.filter(e=>e.kind==='pageerror'||e.kind==='requestfailed'||e.kind==='console'&&e.type==='error'||e.kind==='response'&&e.status>=400||e.kind==='Network.loadingFailed');assert.deepEqual(errors,r.errors);assert.equal(errors.length,0);assert.equal(events.length,r.event_count);assert.ok(events.some(e=>e.kind==='Network.requestWillBeSent'));assert.ok(events.some(e=>e.kind==='Network.responseReceived'));
   const names=['01-homepage','02-intro','03-menu','04-game','05-missed','06-retry','07-captured-0','07-captured-1','08-result','09-replay-0','09-replay-1','09-replay-2','10-replay-return','11-archive'];assert.deepEqual(steps.filter(s=>s.name).map(s=>s.name),names);
   for(const s of steps.filter(s=>s.name)){const file=at(r.id+'/'+s.name+'.png'),buf=fs.readFileSync(path.join(root,file));record(file,false,true);assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(buf.readUInt32BE(16),r.width);assert.equal(buf.readUInt32BE(20),r.width===320?900:1000);png++;}
   for(const label of ['homepage','holiday-lab']){const xs=steps.filter(s=>s.action==='icon-receipt'&&s.label===label);assert.equal(xs.length,1);assert.equal(xs[0].status,200);assert.equal(xs[0].sha256,icon);assert.equal(xs[0].bytes,66162);assert.ok(xs[0].contentType.includes('image/png'));icons++;}
   assert.equal(steps.find(s=>s.name==='05-missed').state.progress,'0 / 3');assert.equal(steps.find(s=>s.name==='07-captured-0').state.progress,'1 / 3');assert.equal(steps.find(s=>s.name==='07-captured-1').state.progress,'2 / 3');for(let i=0;i<3;i++)assert.equal(steps.find(s=>s.name==='09-replay-'+i).state.shot,String(i));assert.deepEqual(artifact.captures.map(c=>c.phase),[0,1,2]);assert.deepEqual(artifact.captures.map(c=>c.controls),[{angle:0,length:100,tension:0},{angle:0,length:100,tension:.44},{angle:0,length:100,tension:0}]);assert.ok(artifact.resets>=2&&artifact.seconds>0&&artifact.path.length>3);
   for(const e of events.filter(e=>e.kind==='body')){let file=decodeURIComponent(new URL(e.url).pathname).replace(/^\//u,'');if(!file||file.endsWith('/'))file+='index.html';const b=before.find(x=>x.file===file);assert.ok(b);assert.equal(e.sha256,b.sha256);assert.equal(e.bytes,b.bytes);bodies++;}
  });out.counts={contexts:result.results.length,png,icons,response_bodies:bodies,build_files:before.length,source_files:sourceBefore.length};
  out.reason='已讀本輪6組原始流程、診斷與來源；等待相符獨立verification收據，尚未升格。';
  if(policy.qingming_verification){
   const v=read(policy.qingming_verification);validateVerification(v,out.counts,policy.qingming_receipt,policy.qingming_verification);
   const supplement=read(path.posix.join(path.posix.dirname(policy.qingming_verification),v.icon_supplement));
   assert.equal(supplement.pass,true);assert.equal(supplement.rows.length,2);assert.equal(supplement.full_project_approved,false);
   for(const r of supplement.rows){assert.deepEqual(r.errors,[]);assert.equal(r.explicit_status,200);assert.equal(r.sha256,icon);assert.ok(r.automatic.some(e=>e.url===r.icon&&e.status===200));}
   const alias=supplement.aliases.find(r=>new URL(r.url).pathname==='/favicon.ico');assert.equal(alias.status,200);assert.equal(alias.sha256,icon);
   assert.ok(supplement.aliases.some(r=>r.status===404&&r.bytes===0));
   out.verification_source=policy.qingming_verification;out.verification=v;out.verified=true;
   out.reason=`本輪${out.counts.contexts}組真實操作通過：失誤、重試、三段成功、結果與重播；${out.counts.icons}次圖示HTTP200、${out.counts.png}張畫面，錯誤0。`;
  }
 }catch(e){out.reason='新收據尚未達可採認條件：'+e.message;out.error=e.message;}
 return out;
}
module.exports=assess;
module.exports.validateVerification=validateVerification;
