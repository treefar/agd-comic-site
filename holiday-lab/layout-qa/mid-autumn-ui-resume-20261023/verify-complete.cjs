// Read-only full-run review. Output goes to stdout; the caller preserves it separately.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../mid-autumn-ui-validation-20261023');
const B=require(path.join(base,'binding.cjs')),S=require(path.join(base,'store.cjs')),P=require(path.join(base,'plan.cjs'));
const {readLayoutReport}=require(path.resolve(base,'../layout-report-store.cjs'));
const read=f=>JSON.parse(fs.readFileSync(f));
async function main(){
 const terminal=read(path.join(__dirname,'launches/resume-01/terminal.json'));
 assert.equal(terminal.exit_code,0,'Original supervisor must have recorded actual exit0');
 const frozen=B.load(path.join(base,'freeze-04.json')),binding=frozen.binding,plan=read(binding.plan_file);
 B.assertApproval(read(path.join(base,'root-approval-04.json')),frozen);
 assert.deepEqual(await B.receipts(binding),binding.source_receipts);
 const ex=path.resolve(base,'../mid-autumn-finite-native/full-domain-run/exhaustive');
 const manifest=read(plan.manifest_file),domain=require(path.join(ex,'domain-offline.cjs')).load(manifest);
 const logical=P.logicalPlan(read(plan.root_verified_file),domain);
 assert.deepEqual(logical.obligations,plan.obligations);
 assert.deepEqual(logical.jobs,plan.jobs.map(({source,...rest})=>rest));
 const run=path.join(base,'runs/root-ui-04'),verified=S.verify(run,binding,plan);
 assert.equal(verified.count,783);assert.equal(verified.seen.size,783);
 const expected=new Set(plan.obligations.map(o=>o.id)),seen=new Set(),contexts={},flags={};
 let allChecks=true,geometry=0,originalWholeClear=0;
 for(const event of verified.events){
  const job=plan.jobs.find(j=>j.id===event.payload.job_id);
  for(const id of job.obligation_ids){assert.ok(expected.has(id));assert.ok(!seen.has(id));seen.add(id);}
  const c=readLayoutReport(event.payload.case_ref.file,{cacheSize:0}).cases[0];
  assert.equal(c.pass,true);assert.equal(c.target_validation_pass,true);
  assert.deepEqual(c.comparison,[]);assert.equal(c.full_project_approved,false);
  allChecks&&=Object.values(c.checks).every(x=>x===true);
  geometry+=c.target_geometry_errors.length;originalWholeClear+=Number(c.global_method_clear);
  contexts[job.context]=(contexts[job.context]||0)+1;
  for(const flag of c.full_measurement.violations)flags[flag]=(flags[flag]||0)+1;
 }
 assert.deepEqual(seen,expected);assert.equal(seen.size,810);assert.equal(allChecks,true);assert.equal(geometry,0);
 const completed=fs.readdirSync(run).filter(n=>/^complete-\d+\.json$/.test(n));assert.equal(completed.length,1);
 const completion=read(path.join(run,completed[0]));assert.equal(completion.jobs,783);assert.equal(completion.last_hash,verified.last_hash);
 assert.equal(completion.native_ui_validation_complete,true);assert.equal(completion.global_bound_proven,false);
 return{pass:true,actual_exit:terminal.exit_code,jobs:783,seed_obligations:768,extrema_obligations:42,obligations_verified:seen.size,
  contexts,original_whole_method_clear_count:originalWholeClear,original_flags:flags,geometry_errors:geometry,
  source_font_method_receipts_current:true,last_hash:verified.last_hash,
  canonical_promoted:false,global_bound_proven:false,full_project_approved:false};
}
if(require.main===module)main().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={main};
