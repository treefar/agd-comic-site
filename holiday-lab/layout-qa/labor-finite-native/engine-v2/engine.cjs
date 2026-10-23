'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createLayoutReportWriter,readLayoutReport}=require('../../layout-report-store.cjs');
const domain=require('../domain.cjs');
const digest=x=>crypto.createHash('sha256').update(Buffer.isBuffer(x)?x:typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const readJSON=f=>JSON.parse(fs.readFileSync(f,'utf8')),ref=(run,file)=>{const b=fs.readFileSync(file);return {file:path.relative(run,file).split(path.sep).join('/'),sha256:digest(b),bytes:b.length};};
function viewport(width){assert.ok([320,1440].includes(width),'Unsupported contract viewport');return {width,height:width===320?900:1000};}
function assertApproval(approval,binding){assert.ok(approval?.approved===true&&approval.scope==='labor-finite-engine-v2'&&approval.binding_sha256===digest(binding),'approval does not bind complete engine-v2 method/source/font/plan');}
function writeBytes(file,bytes){const fd=fs.openSync(file,'wx');try{let at=0;while(at<bytes.length)at+=fs.writeSync(fd,bytes,at,bytes.length-at);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function writeJSON(file,value){writeBytes(file,Buffer.from(JSON.stringify(value,null,2)));}
function checkedCanonicalJSON(file){const bytes=fs.readFileSync(file),value=JSON.parse(bytes);assert.equal(digest(bytes),digest(Buffer.from(JSON.stringify(value,null,2))),'immutable JSON size/SHA/canonical bytes mismatch');return value;}
function safePath(run,file){assert.ok(typeof file==='string'&&!path.isAbsolute(file)&&!file.split(/[\\/]/).includes('..'),'Unsafe reference');const p=path.resolve(run,file);assert.ok(p.startsWith(path.resolve(run)+path.sep));return p;}
function checked(run,r){const f=safePath(run,r.file),b=fs.readFileSync(f);assert.equal(b.length,r.bytes,'size mismatch '+r.file);assert.equal(digest(b),r.sha256,'SHA mismatch '+r.file);return f;}
function walk(dir){if(!fs.existsSync(dir))return [];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p];}).sort();}
function validateCase(target,c,sample,binding){
 assert.equal(c.id,target.id,'target case ID');assert.equal(c.job_id,target.job_id,'target job ID');assert.equal(c.owner,target.owner,'target owner');assert.equal(c.width,target.width,'viewport width');assert.equal(c.height,target.height,'viewport height');
 assert.deepEqual(c.job_identity,target.job_identity,'full job identity');assert.equal(c.job_sha256,target.job_sha256,'job fingerprint');
 assert.deepEqual(c.schedule,target.schedule,'input schedule');assert.deepEqual(c.inputs,target.inputs,'input before');assert.deepEqual(c.inputs_after,target.inputs,'input after');assert.deepEqual(c.expected,target.expected,'expected evaluation');
 assert.deepEqual(c.dom_before,target.dom_expected,'DOM expected before');assert.deepEqual(c.dom_after,target.dom_expected,'DOM expected after');assert.deepEqual(c.source_before,binding.receipts,'source/font before');assert.deepEqual(c.source_after,binding.receipts,'source/font after');
 assert.ok(Array.isArray(sample.nodes)&&Array.isArray(sample.blockers),'full sample required');assert.deepEqual(c.nodes,sample.nodes,'full sample nodes');assert.deepEqual(c.blockers,sample.blockers,'full sample blockers');
 assert.equal(c.screenshot?.viewport_proof?.clip?.width,target.width,'viewport clip width');assert.equal(c.screenshot?.viewport_proof?.clip?.height,target.height,'viewport clip height');
 const vp=c.screenshot.viewport_proof;assert.equal(vp.scroll_unchanged,true,'viewport scroll changed');assert.deepEqual(vp.before,vp.after,'viewport scroll before/after');
 assert.ok(Array.isArray(c.fonts)&&c.fonts.length&&c.fonts.every(f=>['MicrosoftJhengHeiUIRegular','MicrosoftJhengHeiUIBold'].includes(f.postScriptName)),'unbound font face');
 const n=sample.nodes.find(n=>n.owner===c.actual_owner);assert.ok(n,'actual target owner missing from full sample');assert.equal(domain.fullTextCoverage(n.text,n.measurements,target.dom_expected[target.owner]),true,'DOM/Range target mismatch');
}
function validatePNG(bytes,width,height){assert.ok(bytes.length>=24&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG header required');assert.equal(bytes.readUInt32BE(16),width,'PNG viewport width');assert.equal(bytes.readUInt32BE(20),height,'PNG viewport height');}
function createRun(run,{binding,targets,owner}){
 if(!fs.existsSync(run))fs.mkdirSync(run,{recursive:true});assert.equal(fs.readdirSync(run).length,0,'run exists; explicit resume required');
 assert.equal(new Set(targets.map(t=>t.id)).size,targets.length,'duplicate target plan');
 for(const d of ['records','checkpoints','leases'])fs.mkdirSync(path.join(run,d));
 writeJSON(path.join(run,'plan.json'),targets);writeJSON(path.join(run,'run.meta.json'),{schema:2,binding,binding_sha256:digest(binding),plan_sha256:digest(targets),plan_file_sha256:digest(fs.readFileSync(path.join(run,'plan.json'))),target_count:targets.length,initial_owner:owner});
 writeLease(run,owner);fs.writeFileSync(path.join(run,'events.ndjson'),'',{flag:'wx'});
 return openAppender(run,{binding,targets});
}
function readLeases(run){
 const dir=path.join(run,'leases'),files=fs.readdirSync(dir).sort(),names=files.filter(f=>/^\d{6}\.json$/u.test(f));assert.equal(files.length,names.length*2,'uncertain/partial lease files');assert.ok(names.length,'uncertain missing lease');const meta=readJSON(path.join(run,'run.meta.json'));let previous=digest(fs.readFileSync(path.join(run,'run.meta.json')));const result=[];
 for(let i=0;i<names.length;i++){const name=String(i).padStart(6,'0')+'.json';assert.equal(names[i],name,'uncertain lease sequence');const file=path.join(dir,name),receipt=checkedCanonicalJSON(file+'.receipt.json');checked(run,receipt);assert.equal(receipt.file,'leases/'+name,'lease receipt identity');const lease=readJSON(file);assert.equal(lease.seq,i);assert.equal(lease.prev_hash,previous,'lease chain drift');assert.equal(lease.binding_sha256,meta.binding_sha256,'lease binding drift');if(i===0)assert.deepEqual(lease.owner,meta.initial_owner,'initial process identity drift');assert.ok(Number.isInteger(lease.owner.pid)&&lease.owner.pid>0&&lease.owner.creation,'uncertain lease creation');result.push({...lease,ref:receipt});previous=receipt.sha256;}
 return result;
}
function writeLease(run,owner){const dir=path.join(run,'leases'),names=fs.readdirSync(dir).filter(f=>/^\d{6}\.json$/u.test(f)).sort(),seq=names.length,meta=readJSON(path.join(run,'run.meta.json')),previous=seq?readLeases(run).at(-1).ref.sha256:digest(fs.readFileSync(path.join(run,'run.meta.json'))),file=path.join(dir,String(seq).padStart(6,'0')+'.json');writeJSON(file,{seq,prev_hash:previous,binding_sha256:meta.binding_sha256,owner});writeJSON(file+'.receipt.json',ref(run,file));}
function verifyRun(run,{binding,targets}){
 const meta=readJSON(path.join(run,'run.meta.json'));assert.equal(meta.schema,2,'method schema');assert.equal(meta.binding_sha256,digest(binding),'binding drift');assert.deepEqual(meta.binding,binding,'binding drift');
 assert.equal(meta.plan_sha256,digest(targets),'target plan drift');assert.equal(meta.plan_file_sha256,digest(fs.readFileSync(path.join(run,'plan.json'))),'target plan file SHA drift');assert.deepEqual(readJSON(path.join(run,'plan.json')),targets,'target plan bytes changed');assert.equal(meta.target_count,targets.length);
 const plan=new Map(targets.map(t=>[t.id,t]));assert.equal(plan.size,targets.length,'duplicate target identity');
 const raw=fs.readFileSync(path.join(run,'events.ndjson'),'utf8');assert.ok(raw===''||raw.endsWith('\n'),'partial journal line; do not silently repair');const entries=raw===''?[]:raw.slice(0,-1).split('\n').map(line=>JSON.parse(line));
 const leases=readLeases(run);let previous=digest(fs.readFileSync(path.join(run,'run.meta.json'))),journalBytes=0;const seen=new Set();
 for(let i=0;i<entries.length;i++){
  const e=entries[i],p=e.payload;assert.equal(p.seq,i,'sequence duplicate/gap');assert.equal(p.prev_hash,previous,'hash-chain predecessor mismatch');assert.equal(e.hash,digest(p),'hash-chain event mismatch');assert.ok(!seen.has(p.target.id),'duplicate target');seen.add(p.target.id);
  const target=plan.get(p.target.id);assert.ok(target,'unknown target identity');assert.deepEqual(p.target,target,'full target identity drift');assert.equal(p.target_sha256,digest(target),'target fingerprint');
  assert.equal(p.binding_sha256,digest(binding),'binding checkpoint drift');assert.equal(path.basename(p.record_dir),String(i).padStart(6,'0'),'record identity');
  assert.ok(leases.some(l=>JSON.stringify(l.ref)===JSON.stringify(p.lease_ref)),'case writer lease mismatch');checked(run,p.lease_ref);
  for(const f of p.inventory)checked(run,f);const actualFiles=walk(safePath(run,p.record_dir)).map(f=>path.relative(run,f).split(path.sep).join('/')).sort();assert.deepEqual(actualFiles,p.inventory.map(f=>f.file).sort(),'orphan/uncommitted record files');
  const caseFile=checked(run,p.case_ref),sampleFile=checked(run,p.sample_ref);checked(run,p.image_ref);
  const full=readLayoutReport(caseFile,{cacheSize:0}),samples=readLayoutReport(sampleFile,{cacheSize:0});assert.equal(full.cases.length,1,'full case shard count');assert.equal(samples.cases.length,1,'full sample shard count');const c=full.cases[0],sample=samples.cases[0].sample;validateCase(target,c,sample,binding);validatePNG(fs.readFileSync(checked(run,p.image_ref)),target.width,target.height);
  assert.equal(c.screenshot.sha256,p.image_ref.sha256);assert.equal(c.screenshot.file,p.image_ref.file);assert.deepEqual(c.sample_ref,p.sample_ref);assert.deepEqual(p.expected,target.expected,'expected checkpoint');assert.equal(p.dom_sha256,digest(target.dom_expected),'DOM checkpoint');
  journalBytes+=Buffer.byteLength(JSON.stringify(e)+'\n');const cpFile=path.join(run,'checkpoints',String(i).padStart(6,'0')+'.json');assert.ok(fs.existsSync(cpFile),'uncommitted journal: missing immutable checkpoint');assert.deepEqual(checkedCanonicalJSON(cpFile),{schema:2,seq:i,event_hash:e.hash,journal_bytes:journalBytes,binding_sha256:digest(binding)},'checkpoint mismatch');previous=e.hash;
 }
 assert.deepEqual(fs.readdirSync(path.join(run,'records')).sort(),entries.map((_,i)=>String(i).padStart(6,'0')),'orphan/uncommitted target directory');assert.deepEqual(fs.readdirSync(path.join(run,'checkpoints')).sort(),entries.map((_,i)=>String(i).padStart(6,'0')+'.json'),'checkpoint count mismatch');
 return {count:entries.length,entries,last_hash:previous,seen,leases,load:i=>readLayoutReport(checked(run,entries[i].payload.case_ref),{cacheSize:0}).cases[0],sample:i=>readLayoutReport(checked(run,entries[i].payload.sample_ref),{cacheSize:0}).cases[0].sample};
}
function openAppender(run,{binding,targets}){
 const v=verifyRun(run,{binding,targets}),plan=new Map(targets.map(t=>[t.id,t]));for(let i=0;i<v.count;i++)assert.notEqual(v.load(i).pass,false,'previous native failure must not be silently skipped');let index=v.count,prev=v.last_hash;const seen=v.seen,leaseRef=v.leases.at(-1).ref;
 return {get length(){return index;},has:id=>seen.has(id),append(target,{case:c,sample,png},{fault=()=>{}}={}){
  assert.deepEqual(target,plan.get(target.id),'target not in full plan');assert.ok(!seen.has(target.id),'duplicate target append');validateCase(target,c,sample,binding);validatePNG(png,target.width,target.height);
  const name=String(index).padStart(6,'0'),recordDir=path.join(run,'records',name);fs.mkdirSync(recordDir);const imageFile=path.join(recordDir,'viewport.png');writeBytes(imageFile,png);fault('after-image');
  const sampleFile=path.join(recordDir,'sample.report.json'),sampleWriter=createLayoutReportWriter(sampleFile);sampleWriter.appendCase({id:'sample/'+target.id,width:target.width,height:target.height,sample});sampleWriter.checkpoint({schema_version:1,kind:'complete-frozen-sample',target_id:target.id});fault('after-sample');const sampleRef=ref(run,sampleFile),imageRef=ref(run,imageFile);
  const fullCase={...c,screenshot:{...c.screenshot,file:imageRef.file,sha256:imageRef.sha256},sample_ref:sampleRef};const caseFile=path.join(recordDir,'case.report.json'),caseWriter=createLayoutReportWriter(caseFile);caseWriter.appendCase(fullCase);caseWriter.checkpoint({schema_version:1,kind:'complete-native-case',target_id:target.id});fault('after-case');
  checked(run,leaseRef);const payload={seq:index,prev_hash:prev,binding_sha256:digest(binding),lease_ref:leaseRef,target,target_sha256:digest(target),expected:target.expected,dom_sha256:digest(target.dom_expected),record_dir:path.relative(run,recordDir).split(path.sep).join('/'),case_ref:ref(run,caseFile),sample_ref:sampleRef,image_ref:imageRef,inventory:walk(recordDir).map(f=>ref(run,f))},event={payload,hash:digest(payload)},line=JSON.stringify(event)+'\n';
  const fd=fs.openSync(path.join(run,'events.ndjson'),'a');try{const b=Buffer.from(line);let at=0;while(at<b.length)at+=fs.writeSync(fd,b,at,b.length-at);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fault('after-journal');
  writeJSON(path.join(run,'checkpoints',name+'.json'),{schema:2,seq:index,event_hash:event.hash,journal_bytes:fs.statSync(path.join(run,'events.ndjson')).size,binding_sha256:digest(binding)});seen.add(target.id);index++;prev=event.hash;return event;
 }};
}
module.exports={digest,viewport,assertApproval,createRun,verifyRun,openAppender,validateCase,validatePNG,checked,writeJSON,readLeases,writeLease};
