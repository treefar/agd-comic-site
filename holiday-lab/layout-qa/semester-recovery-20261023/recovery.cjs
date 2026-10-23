const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createLayoutReportWriter}=require('../layout-report-store.cjs');
const dir=__dirname,source=path.resolve(dir,'../phase-runs/2026-10-23T00-38-18-660Z');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function hashFile(file){const hash=crypto.createHash('sha256'),fd=fs.openSync(file,'r'),buf=Buffer.alloc(65536);try{let n;while((n=fs.readSync(fd,buf,0,buf.length,null)))hash.update(buf.subarray(0,n));}finally{fs.closeSync(fd);}return hash.digest('hex');}
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
function inventory(){const progressFile=path.join(source,'progress.json'),progress=read(progressFile),files=fs.readdirSync(source).filter(f=>f.endsWith('.case.json')).map(file=>{const m=/-(\d+)\.case\.json$/.exec(file);assert.ok(m,'Missing capture ordinal '+file);return {file,index:Number(m[1])};}).sort((a,b)=>a.index-b.index);files.forEach((x,i)=>assert.equal(x.index,i,'Capture ordinals must be continuous, unique, start0'));assert.equal(files.length,progress.frames);return {progressFile,progress,files};}
const state=inventory(),inventoryResult={source,progress_sha256:hashFile(state.progressFile),frames:state.files.length,first_index:state.files[0].index,last_index:state.files.at(-1).index,continuous_unique:true,original_postreceipt_present:Object.keys(state.progress.metadata).filter(k=>/unchanged|after/.test(k)),sessions:state.progress.metadata.sessions.map(s=>({lang:s.lang,width:s.width,intent:s.intent,status:s.status,failure:s.failure,replay_seen:s.replay_seen}))};
fs.writeFileSync(path.join(dir,'inventory.json'),JSON.stringify(inventoryResult,null,2));console.log('INVENTORY '+JSON.stringify({frames:inventoryResult.frames,continuous:true,sessions:inventoryResult.sessions.length,complete:inventoryResult.sessions.filter(s=>s.status==='route-complete-layout-not-certified').length,canonical_complete:inventoryResult.sessions.filter(s=>s.intent==='graduation-first'&&s.status==='route-complete-layout-not-certified').length,original_postreceipt_present:inventoryResult.original_postreceipt_present}));
if(process.argv.includes('--inventory'))process.exit(0);
const run=path.join(dir,'recovered-run');assert.ok(!fs.existsSync(run),'Recovery destination exists: verify it; do not silently rerun');fs.mkdirSync(run);
const writer=createLayoutReportWriter(path.join(run,'report.json')),receipts=[],violations=['PARTIAL_PHASE_CHECKPOINT: full required matrix, every error, scrolling and final source fingerprint verification incomplete'];
for(const entry of state.files){
 const caseFile=path.join(source,entry.file),sampleName=entry.file.replace(/\.case\.json$/,'.json'),sampleFile=path.join(source,sampleName),c=read(caseFile),sample=read(sampleFile);
 assert.deepEqual(c.nodes,sample.nodes,entry.file+' nodes');assert.deepEqual(c.blockers,sample.blockers,entry.file+' blockers');assert.equal(c.replay_shot,sample.replay_shot,entry.file+' shot');
 const imageFile=path.join(source,c.screenshot.file);assert.equal(hashFile(imageFile),c.screenshot.sha256,entry.file+' screenshotSHA');
 writer.appendCase(c);
 // Preserve relative paths used by existing full-case/sample readers without changing c.
 for(const [from,name]of [[sampleFile,sampleName],[imageFile,c.screenshot.file]]){assert.equal(path.basename(name),name);fs.copyFileSync(from,path.join(run,name),fs.constants.COPYFILE_EXCL);}
 const originalID=c.id.replace(/\/unstable-attempt-\d+$/,'');violations.push(...sample.violations.map(v=>originalID+': '+v));
 receipts.push({index:entry.index,id:c.id,width:c.width,intent:c.intent,original_case_file:caseFile,case_sha256:hashFile(caseFile),sample_file:sampleFile,sample_copy:sampleName,sample_sha256:hashFile(sampleFile),image_file:imageFile,image_copy:c.screenshot.file,image_sha256:c.screenshot.sha256});
 if((entry.index+1)%200===0)console.log('RECOVERED '+(entry.index+1)+'/'+state.files.length);
}
// The original collector appends its route error after the last captured sample.
for(const s of state.progress.metadata.sessions)if(s.status==='route-failed'){const message=s.failure.split('\n')[0].replace(/^\w*Error:\s*/,'');violations.push(`ROUTE_FAILURE ${s.game}/${s.lang}/${s.width}/${s.intent}: ${message}`);}
const countMatches=violations.length===state.progress.violations;
// Do not claim a reconstructed original array if its source-derived count disagrees.
assert.ok(countMatches,'Reconstructed violation count differs from progress; stop before committing manifest');
writer.checkpoint({schema_version:1,source_fingerprints:{},cases:[],violations,metadata:state.progress.metadata,recovery:{recovered:true,original_run:source,original_progress_sha256:inventoryResult.progress_sha256,original_collector_completed:false,original_after_receipt_available:false,original_violation_count:state.progress.violations,violations_reconstruction:'original collector initial literal, ordered per-case original sample violations and original progress failed-session messages; count agrees',new_capture_performed:false}});
const contexts=[];for(const lang of ['zh','en','ja'])for(const width of [320,1440])for(const intent of ['graduation-first','credit-first']){const s=state.progress.metadata.sessions.find(s=>s.lang===lang&&s.width===width&&s.intent===intent);contexts.push({lang,width,intent,status:s?.status||'not-started',recorded_route_complete:s?.status==='route-complete-layout-not-certified',replay_complete:s?.replay_seen?.length===4,failure:s?.failure||null,case_count:receipts.filter(c=>c.id.split('/')[1]===lang&&c.width===width&&c.intent===intent).length});}
fs.writeFileSync(path.join(dir,'recovery-receipts.json'),JSON.stringify({source,run,frames:receipts.length,progress_sha256:inventoryResult.progress_sha256,violations_count:violations.length,metadata_preserved_exactly:true,contexts,receipts},null,2));
assert.equal(hashFile(state.progressFile),inventoryResult.progress_sha256,'Original progress changed during recovery');
console.log('RECOVERY_COMPLETE '+JSON.stringify({frames:receipts.length,violations:violations.length,metadata_sessions:state.progress.metadata.sessions.length,contexts_complete:contexts.filter(c=>c.recorded_route_complete).length,contexts_partial:contexts.filter(c=>c.status==='route-failed').length,contexts_not_started:contexts.filter(c=>c.status==='not-started').length,original_after_receipt_available:false}));
