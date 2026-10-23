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
 if(d.qingming.from_current84){assert.equal(d.polish.contexts,84);assert.equal(d.polish.errors,0);assert.equal(d.polish.full_project_approved,false);return;}
 const validate=require('./qingming-proof.cjs').validateVerification,policy=d.policy,good=d.qingming.verification;
 for(const mutate of [x=>x.exit_code=1,x=>x.result.contexts=5,x=>x.result.full_project_approved=true,x=>x.result.coreflow_errors=1,x=>x.result.automatic_icon_fetch_proven_by_core_run=true,x=>x.core_run='different-run/result.json']){
  const bad=structuredClone(good);mutate(bad);assert.throws(()=>validate(bad,d.qingming.counts,policy.qingming_receipt,policy.qingming_verification));
 }
});

test('Hero technical pass does not approve the AI visual direction or publication',()=>{const d=adapter(root);assert.equal(d.heroRelease.hero.contexts,9);assert.equal(d.rows.find(r=>r.id==='hero-integrated').workflow,'waiting');assert.equal(d.heroRelease.release.yes,12);assert.equal(d.heroRelease.release.unknown,1);assert.equal(d.heroRelease.release.public_release,false);assert.equal(d.rows.find(r=>r.id==='release-preflight').user,'pending');assert.equal(d.heroRelease.checks.filter(c=>c.result==='unknown').length,1);});

test('one source-backed curation demo remains separate from all-game art approval',()=>{const d=adapter(root),demo=d.rows.find(r=>r.id==='student-curation');assert.equal(d.policy.visual_direction,'student-work-homepage-and-one-curation-demo');assert.equal(d.heroRelease.hero.demo_contexts,9);assert.equal(demo.workflow,'waiting');assert.equal(demo.user,'pending');assert.equal(demo.tool,'bounded');assert.equal(demo.links[0].href,'/holiday-lab/student-curation.html?lang=zh');assert.match(demo.limitation,/不代表既有14款/);assert.match(d.rows.find(r=>r.id==='hero-integrated').limitation,/favicon/);assert.equal(d.rows.find(r=>r.id==='ui').tool,'gate_no');});
