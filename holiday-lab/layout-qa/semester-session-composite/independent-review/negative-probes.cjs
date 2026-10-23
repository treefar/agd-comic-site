const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname,qa=path.resolve(dir,'../..'),testFile=path.resolve(qa,'../tests/semester-session-evidence.test.cjs'),text=fs.readFileSync(testFile,'utf8'),cut=text.indexOf('\ntest(');assert.ok(cut>0);
const temp=path.join(dir,'fixtures');fs.mkdirSync(temp,{recursive:true});process.env.TEMP=temp;process.env.TMP=temp;
const sandbox={require:require('node:module').createRequire(testFile),module:{exports:{}},console};vm.runInNewContext(text.slice(0,cut)+'\nmodule.exports={fixture};',sandbox,{filename:testFile});
const {fixture}=sandbox.module.exports,{collectSemesterEvidence}=require('../../semester-session-evidence.cjs'),{writeLayoutReport}=require('../../layout-report-store.cjs'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),results=[];
function update(f){writeLayoutReport(f.oldFile,f.old);writeLayoutReport(f.freshFile,f.fresh);f.ov.manifest_sha256=sha(fs.readFileSync(f.oldFile));f.fv.manifest_sha256=sha(fs.readFileSync(f.freshFile));f.comparison.fresh_manifest_sha256=f.fv.manifest_sha256;f.save();}
for(const kind of ['after_precedes_fresh_run','comparison_disagrees_actual_after_bytes','contradictory_recovery_no']){
 const f=fixture();
 if(kind==='after_precedes_fresh_run'){f.old.metadata.date='2026-10-23T00:00:00Z';f.fresh.metadata.date='2026-10-23T04:00:00Z';for(const row of f.comparison.rows){row.after_started='1970-01-01T00:00:00Z';row.after_finished='1970-01-01T00:00:01Z';}}
 if(kind==='comparison_disagrees_actual_after_bytes'){f.fv.source_checks={served_before:f.fresh.metadata.runtime_receipts,served_independent_after:f.comparison.rows.map(r=>({file:r.file,sha256:r.fresh_independent_actual_after_sha256,status:r.after_http_status,bytes:r.after_bytes,started:r.after_started,finished:r.after_finished}))};f.comparison.rows[0].after_bytes++;}
 if(kind==='contradictory_recovery_no'){f.old.recovery.original_violations_fully_recovered=false;f.ov.original_violations_fully_recovered=true;}
 update(f);let accepted=false,returned=null,error=null;try{const r=collectSemesterEvidence(f.paths,f.options);accepted=true;returned={cases:r.cases.length,unknown:r.original_missing_terminal_flags,original_violations_fully_recovered:r.original_violations_fully_recovered,full_project_approved:r.full_project_approved};}catch(e){error=e.message;}
 results.push({probe:kind,expected:'reject inconsistent receipt/provenance',accepted,returned,error,fixture:f.dir});
}
const suffix=process.argv[2]?'-'+process.argv[2]:'';assert.ok(/^[a-z-]*$/.test(suffix));
const result={adapter_sha256:sha(fs.readFileSync(path.join(qa,'semester-session-evidence.cjs'))),test_source_sha256:sha(Buffer.from(text)),fixture_extraction:'Unmodified helper prefix before first node:test registration; no core changes.',results};fs.writeFileSync(path.join(dir,'negative-results'+suffix+'.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
