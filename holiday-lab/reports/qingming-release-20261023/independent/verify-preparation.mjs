// Strictly read-only source-plan verification; never launches a browser or writes evidence.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {repo,hash,validatePlan} from '../domain/domain.mjs';
const read=file=>JSON.parse(fs.readFileSync(file));
export function verify(preparation){
  const dir=path.resolve(preparation),allowed=path.resolve(repo,'holiday-lab/reports/qingming-release-20261023/domain/preparations');
  assert.equal(path.dirname(dir),allowed);
  const plan=read(path.join(dir,'plan.json')),freeze=read(path.join(dir,'freeze.json')),summary=read(path.join(dir,'summary.json')),commands=read(path.join(dir,'commands.json'));
  validatePlan(plan);
  assert.equal(freeze.scope,plan.scope);assert.equal(freeze.plan_sha256,hash(fs.readFileSync(path.join(dir,'plan.json'))));
  assert.equal(freeze.historical_credit_transferred,false);
  for(const key of ['native_run','canonical_eligible','full_project_approved'])assert.equal(freeze[key],false,key);
  assert.equal(freeze.method.length,3);assert.equal(freeze.source.length,5);
  for(const section of ['method','source','support_sources','historical_readonly_references']){
    assert.ok(Array.isArray(freeze[section])&&freeze[section].length);
    assert.equal(new Set(freeze[section].map(f=>f.file)).size,freeze[section].length);
    for(const f of freeze[section]){const absolute=path.resolve(repo,f.file),relative=path.relative(repo,absolute);assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));assert.equal(hash(fs.readFileSync(absolute)),f.sha256,f.file);}
  }
  assert.deepEqual(freeze.source,plan.sources);
  assert.equal(commands.length,2);assert.deepEqual(commands.map(c=>c.command),['node --test holiday-lab/reports/qingming-release-20261023/domain/domain.test.mjs','node --check holiday-lab/reports/qingming-release-20261023/domain/domain.mjs']);
  for(const c of commands){assert.equal(c.exit,0);assert.equal(c.stderr,'');}
  assert.equal(summary.scope,plan.scope);assert.equal(summary.tests_passed,true);assert.equal(path.resolve(summary.preparation),dir);
  assert.equal(summary.contexts,plan.contexts.length);assert.equal(summary.axis_strings,plan.axes.reduce((n,a)=>n+a.values.length,0));assert.equal(summary.unique_axis_configurations,plan.unique_axis_configurations.length);assert.equal(summary.legal_modes,plan.modes.length);assert.equal(summary.source_only_recipes,plan.witnesses.length);assert.equal(summary.conditional_jobs,plan.conditional_capture_jobs_per_context*plan.contexts.length);
  for(const key of ['native_started','native_serialization_proven','layout_factorization_proven','canonical_eligible','full_project_approved'])assert.equal(summary[key],false,key);
  const independent=read(path.join(path.dirname(fileURLToPath(import.meta.url)),'current-source-audit.json'));
  for(const f of independent.files)assert.equal(hash(fs.readFileSync(path.resolve(repo,f.file))),f.sha256,f.file);
  return{pass:true,scope:'source-plan-preparation-review-only',preparation:dir,plan_sha256:freeze.plan_sha256,method_files:freeze.method.length,current_source_files:freeze.source.length,support_files:freeze.support_sources.length,contexts:summary.contexts,candidate_axis_strings:summary.axis_strings,source_model_recipes:summary.source_only_recipes,native_launched:false,all_owner_upper_bound_proven:false,error_longest_closed:false,canonical_eligible:false,full_project_approved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{assert.ok(process.argv[2],'exact preparation directory required');console.log(JSON.stringify(verify(process.argv[2])));}catch(e){console.error(e.stack);process.exitCode=1;}
}
