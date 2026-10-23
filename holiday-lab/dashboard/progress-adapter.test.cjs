'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),adapter=require('./progress-adapter.cjs');
const root=path.resolve(__dirname,'../..');
test('overview separates evidence layers and honors explicit labor pause',()=>{const d=adapter(root);assert.equal(d.rows.find(r=>r.id==='labor').workflow,'paused');assert.ok(d.rows.every(r=>r.user==='pending'));assert.equal(d.rows.find(r=>r.id==='ui').tool,'gate_no');assert.ok(d.rows.some(r=>r.id==='faculty'));assert.ok(d.rows.some(r=>r.id==='guide'));assert.ok(d.rows.some(r=>r.id==='fonts'));assert.ok(d.rows.some(r=>r.id==='webgl'));});
test('missing root receipt never becomes native pass, and queue is not WebGL build',()=>{const d=adapter(root,{policy:{labor_note:'暫緩',national_note:'暫緩',qingming_note:'缺收據',qingming_receipt:null}});assert.equal(d.rows.find(r=>r.id==='qingming').tool,'unknown');assert.equal(d.rows.find(r=>r.id==='webgl').tool,'unknown');assert.equal(d.qingming.receipt_loaded,false);});
test('all clickable local artifacts exist and no network resource is required',()=>{const d=adapter(root);assert.ok(d.rows.flatMap(r=>r.links).length>5);for(const row of d.rows)for(const l of row.links){assert.ok(!/^(?:https?:|\/\/)/u.test(l.href));assert.equal(adapter.resolveLink(root,l.href).exists,true,l.href);}assert.ok(d.sources.every(s=>s.sha256&&s.bytes>0));});
test('historical QA scope and server/offline destinations remain explicit',()=>{const d=adapter(root);assert.match(d.rows.find(r=>r.id==='ui').proof_summary,/固定08來源的歷史證據覆蓋/u);assert.match(d.rows.find(r=>r.id==='ui').proof_summary,/不是本輪新build完整通過率/u);const primary=['website','guide','qingming'].map(id=>d.rows.find(r=>r.id===id).links[0]);assert.deepEqual(primary.map(l=>l.href),['/','/#/students/guide','/holiday-lab/?game=qingming&lang=zh']);assert.ok(primary.every(l=>l.kind==='server'));assert.ok(d.rows.flatMap(r=>r.links).some(l=>l.kind==='local-file'));});

test('current Qingming receipt is adopted only in its bounded scope',()=>{
 const d=adapter(root);assert.equal(d.qingming.verified,true);assert.equal(d.rows.find(r=>r.id==='qingming').workflow,'available');
 assert.equal(d.rows.find(r=>r.id==='qingming').tool,'bounded');assert.equal(d.rows.find(r=>r.id==='ui').tool,'gate_no');
 const validate=require('./qingming-proof.cjs').validateVerification,policy=d.policy,good=d.qingming.verification;
 for(const mutate of [x=>x.exit_code=1,x=>x.result.contexts=5,x=>x.result.full_project_approved=true,x=>x.result.coreflow_errors=1,x=>x.result.automatic_icon_fetch_proven_by_core_run=true,x=>x.core_run='different-run/result.json']){
  const bad=structuredClone(good);mutate(bad);assert.throws(()=>validate(bad,d.qingming.counts,policy.qingming_receipt,policy.qingming_verification));
 }
});
