// Read-only regression of the historical dependency-race RED proof.
// The child success is simulated only after checking its separately recorded actual verification.
// Every mocked JSON object is parsed inside the reviewed helper's VM realm.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const qa=path.resolve(__dirname,'..'),file=path.join(qa,'verified-supplement.cjs'),source=fs.readFileSync(file,'utf8'),req=require('node:module').createRequire(file),store=req('./layout-report-store.cjs'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const childOutput=fs.readFileSync(path.join(__dirname,'verify-output.txt'),'utf8');
assert.ok(childOutput.includes('QINGMING_FIXED_VERIFY YES'));
const freeze=req('./sampler-freeze-06.json'),contract=JSON.parse(fs.readFileSync(path.resolve(qa,'../../ui-layout-contract.json')));
const options={base:'http://127.0.0.1:8845',sampler_sha256:freeze.function_sha256,asset_map_sha256:freeze.files['holiday-lab/layout-qa/asset-safe-regions.json'],required_cases:contract.required_cases};
function exercise(mode){
 let realm,reads=0,mutations=0;
 const local=value=>{realm.__fixtureJSON=JSON.stringify(value);try{return vm.runInContext('JSON.parse(__fixtureJSON)',realm);}finally{delete realm.__fixtureJSON;}};
 const sandbox={module:{exports:{}},exports:{},__dirname:qa,__filename:file,process,Buffer,console,require:name=>{
  if(name==='node:child_process')return{spawnSync:()=>({status:0,stderr:'',stdout:'SIMULATION: actual independent child receipt is separately SHA-bound'})};
  if(name==='./layout-report-store.cjs')return{...store,readLayoutReport:f=>{
   const raw=store.readLayoutReport(f),metadata=local(raw.metadata);reads++;
   if(mode==='source-map') {metadata.runtime_receipts['games/qingming.mjs']='0'.repeat(64);mutations++;}
   return{...raw,metadata,cases:new Proxy(raw.cases,{get:(array,key,receiver)=>{
    const value=Reflect.get(array,key,receiver);if(!/^\d+$/.test(String(key)))return value;
    const c=local(value);if(mode==='full-case'){assert.ok(c.nodes.length);c.nodes[0].text='SIMULATED_POST_CHILD_PAYLOAD_CHANGE';mutations++;}return c;
   }})};
  }};
  return req(name);
 }};
 realm=vm.createContext(sandbox);vm.runInContext(source,realm,{filename:file});
 try{const loaded=sandbox.module.exports.loadVerifiedSupplement('qingming-sessions',path.join(__dirname,'evidence.json'),options);return{mode,accepted:loaded.cases.length,reads,mutations,rejected:false};}
 catch(e){return{mode,reads,mutations,rejected:true,error_name:e.name,error_message:e.message.split('\n')[0],assertion_operator:e.operator};}
}
const positive=exercise('unchanged');assert.equal(positive.rejected,false,JSON.stringify(positive));assert.equal(positive.accepted,90);
const sourceMap=exercise('source-map');assert.equal(sourceMap.rejected,true);assert.equal(sourceMap.error_message,'Parent source map changed');assert.ok(sourceMap.mutations>0);
const fullCase=exercise('full-case');assert.equal(fullCase.rejected,true);assert.equal(fullCase.error_message,'Parent full case changed after child verification');assert.ok(fullCase.mutations>0);
assert.equal(sha(fs.readFileSync(file)),sha(source),'Reviewed helper changed while testing');
const result={reviewed_root_helper_sha256:sha(source),actual_readonly_child_success_receipt_sha256:sha(childOutput),test_kind:'Same-realm isolated VM dependency-race regression; actual child success separately recorded, mocked child in this test',same_realm_JSON_parse:true,positive_control:positive,source_map_negative:sourceMap,full_case_negative:fullCase,production_files_modified:false,old_red_evidence_overwritten:false,full_project_approved:false};
fs.writeFileSync(path.join(__dirname,'root-integration-race-green.json'),JSON.stringify(result,null,2)+'\n');
console.log('RACE_GREEN YES unchanged90; changed source-map rejected at source map; changed full-case rejected at full case; same-realm JSON fixtures; production edits0; GLOBAL=NO');
