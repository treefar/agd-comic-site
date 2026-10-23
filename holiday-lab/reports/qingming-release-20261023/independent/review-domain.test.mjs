// Independent source-only review. No browser, DOM fabrication, or product writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readSources,assertSources,inventory,sliderAxes,axisConfigurations,legalMode,recipeFor,reproduce,buildPlan} from '../domain/domain.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const reviewDir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const original=JSON.parse(fs.readFileSync(path.join(reviewDir,'current-source-audit.json')));

test('current domain bindings match independent current-source snapshot',()=>{
  const source=readSources();assertSources(source);
  for(const binding of inventory(source).source_bindings){const row=original.files.find(x=>x.file===binding.file);assert.ok(row);assert.equal(binding.sha256,row.sha256);}
});

for(const key of ['game','runner','catalog','css','contract'])test('source drift rejects '+key,()=>{
  const source=readSources();assert.equal(assertSources(source),true);
  assert.throws(()=>assertSources({...source,[key]:source[key]+'\n'}),/source drift/);
});

test('new text write and cross-output CSS dependency cannot reuse this closure',()=>{
  const source=readSources();assert.throws(()=>inventory({...source,game:source.game+"\nctx.ui.text('new-owner',W('新','new','新'));"}),/source drift/);
  assert.throws(()=>inventory({...source,css:source.css+'\n.slider-row:has(output[value="1"]){height:999px}'}),/source drift/);
});

test('each numeric owner has its complete unique source-declared candidate set',()=>{
  const axes=sliderAxes(),expected=[Array.from({length:61},(_,i)=>String(i-30)),Array.from({length:101},(_,i)=>String(i+50)),Array.from({length:51},(_,i)=>String(i/50))];
  assert.deepEqual(axes.map(a=>a.values.map(v=>v.string)),expected);
  for(const axis of axes)assert.equal(new Set(axis.values.map(v=>v.string)).size,axis.values.length);
  assert.equal(axisConfigurations().length,211);
  assert.ok(axes.every(a=>a.serialization_status.includes('native range and stepper proof still required')));
});

test('illegal phase/hint/pause joints fail before any witness can be built',()=>{
  for(const args of [[3,'blurb',false],[-1,'retry',false],[0,'next',false],[1,'paused',false],[2,'next',true],[0,'unknown',false]])assert.throws(()=>legalMode(...args));
});

test('all 22 generated recipes reproduce only source-model observations',()=>{
  const p=buildPlan();assert.equal(p.witnesses.length,22);assert.equal(new Set(p.witnesses.map(w=>JSON.stringify([w.mode.phase,w.mode.hint,w.mode.paused,w.audio]))).size,22);
  for(const w of p.witnesses){const r=reproduce(w.recipe);assert.equal(r.phase,w.mode.phase);assert.equal(r.error_status,true);assert.equal(r.hint_kind,w.mode.hint);assert.equal(r.paused,w.mode.paused);assert.equal(r.audio,w.audio);assert.equal(r.browser_witness,false);assert.equal(r.completed,false);}
});

test('source model rejects out-of-grid values and edits through inert controls',()=>{
  const recipe=recipeFor(legalMode(0,'blurb',false));
  for(const value of ['0.01','NaN','1.02'])assert.throws(()=>reproduce([...recipe,{action:'range',axis:'kite-tension',value}]),/enumerated/);
  const paused=recipeFor(legalMode(0,'paused',true));assert.throws(()=>reproduce([...paused,{action:'range',axis:'kite-angle',value:'0'}]),/inert/);
});

test('the ten independently selected grid tuples preserve source error after real callbacks',()=>{
  for(const v of original.ten_representative_grid_values){const r=reproduce([...recipeFor(legalMode(0,'blurb',false)),...['angle','length','tension'].map(key=>({action:'range',axis:'kite-'+key,value:String(v[key])}))]);assert.equal(r.phase,0);assert.equal(r.error_status,true);assert.equal(r.browser_witness,false);}
});

test('candidate counts cannot promote unproved native, layout or canonical states',()=>{
  const p=buildPlan();assert.equal(p.exact_candidate_joint_values,314211);assert.equal(p.error_text_states_per_context,6912642);assert.equal(p.conditional_capture_jobs_per_context,232);
  for(const key of ['native_started','native_serialization_proven','layout_factorization_proven','error_longest_closed','canonical_eligible','full_project_approved'])assert.equal(p[key],false,key);
  assert.equal(p.conditional_factorization.status,'unproved');
  for(const id of ['native-number-serialization','native-row-font-paper-invariance','all-visible-owners-joint-layout','all-window-and-controls-scroller-extents'])assert.equal(p.open_obligations.find(o=>o.id===id)?.status,'not_run');
});
