// Rechecks existing raw evidence without executing collectors or rewriting aggregates.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),P=require('./provenance.cjs');
const root=path.resolve(__dirname,'../../..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f))),ref=f=>P.reference(root,f);
const qa='holiday-lab/layout-qa/',dir=qa+'newyear-ja-caption-current/';
const {sampleLayout}=require('../browser-sampler.cjs');
const policy='C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs';
const {inspectReport}=require(policy),hash=P.sha,refs=[ref(dir+'aggregate.json'),ref(dir+'verify-aggregate.cjs'),ref(dir+'check.cjs')];
const agg=read(dir+'aggregate.json'),runs=['2026-10-23T00-45-20-992Z','2026-10-23T01-03-43-409Z'].map(id=>({id,report:read(dir+'runs/'+id+'/report.json')}));
for(const run of runs){refs.push(ref(dir+'runs/'+run.id+'/report.json'));assert.equal(run.report.source_stable,true);assert.deepEqual(run.report.before,run.report.after);assert.deepEqual(run.report.before,agg.source_sha256);assert.equal(run.report.sampler_function_sha256,hash(sampleLayout.toString()));}
for(const [file,sha]of Object.entries(agg.source_sha256)){
 for(const prefix of ['holiday-lab/','.measure-integrated-10/holiday-lab/']){const r=ref(prefix+file);assert.equal(r.sha256,sha);refs.push(r);}
}
const selected=[];
for(const width of [320,1440])for(let target=0;target<9;target++){
 let chosen;
 for(const run of [...runs].reverse())for(const row of run.report.cases.filter(c=>c.width===width&&c.lang==='ja')){const s=row.samples.find(s=>s.target===target&&s.stable);if(s&&!chosen)chosen={run,row,s};}
 assert.ok(chosen);const {run,row,s}=chosen;
 assert.equal(row.status,'native-replay-verified');assert.equal(s.before.shot,target);assert.equal(s.after.shot,target);
 assert.equal(String(s.sample.evidence.replay_shot_start),String(target));assert.equal(String(s.sample.evidence.replay_shot_end),String(target));
 const screenshot=ref(dir+'runs/'+run.id+'/'+s.file);assert.equal(screenshot.sha256,s.screenshot_sha256);refs.push(screenshot);
 const errors=inspectReport({schema_version:1,source_fingerprints:{},cases:[{id:`ja/${width}/${target}`,width,height:width===320?900:1000,nodes:s.sample.nodes,blockers:s.sample.blockers}]});assert.deepEqual(errors,[]);
 if(target<3)assert.ok(s.before.caption.includes('軽く跳ぶ'));
 selected.push({width,target,run:run.id,screenshot,geometry_errors:errors.length});
}
const oldFile=qa+'newyear-min140/runs/2026-10-23T00-05-50-129Z/report.json',old=read(oldFile);refs.push(ref(oldFile));
const oldSource=ref('.measure-integrated-08/holiday-lab/games/new-year.mjs'),current=ref('holiday-lab/games/new-year.mjs');refs.push(oldSource,current);
assert.equal(old.before['games/new-year.mjs'],oldSource.sha256);assert.deepEqual(old.before,old.after);assert.equal(old.native_pass,0);
const a=fs.readFileSync(path.join(root,oldSource.path),'utf8'),b=fs.readFileSync(path.join(root,current.path),'utf8');
assert.ok(a.replace("scene===0?W('俐落跨門','A quick leap','軽やかに越える')","scene===0?W('俐落跨門','A quick leap','軽く跳ぶ')")===b,'exact scene0 focus-only replacement');
const originalNative=runs[0].report.cases.map(c=>({width:c.width,seen:c.seen,observedIntervals:c.observedIntervals}));
for(const c of runs[0].report.cases){assert.deepEqual([...c.seen].sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);for(const shot of [1,7]){const points=c.observation.filter(e=>e.shot===shot);assert.ok(points.length>=2);assert.ok(points.every(p=>p.visible&&p.caption.includes('140')));assert.ok(new Set(points.map(e=>e.sprites[0]?.style)).size>1);}}
const plan=read(qa+'supplement-integration-20261023/v4/plan-current/plan.json');
const result={type:'existing-native-readonly-audit-v1',pass:true,global_approved:false,source:current,original:oldSource,exact_diff:{line:64,old:'軽やかに越える',current:'軽く跳ぶ',scope:'scene===0 JA focus; replay shots 0,1,2'},selected_count:selected.length,selected,originalNative,
 old_raw_status_preserved:old.cases.map(c=>({lang:c.lang,width:c.width,status:c.status,failure:c.failure?.split('\n')[0]})),
 plan_newyear_selected:plan.selected.filter(c=>c.canonical_id.startsWith('new-year/')).length,
 coverage_limit:'Existing current-source Japanese native replay only: 2 widths × 9 shots, one launch ending and recorded timings; no new captures, no proof for other focus/timing branches, universal fonts, normal/reduced-motion matrix, intro/control/result/error states. Old raw fail statuses stay fail.',
 must_retest:'For strict current-source acceptance, retain all 08 source case bindings as 08. Replay JA shots 0–2 need current-source evidence for every contract focus/timing/viewport not covered by these 18 captures. Revalidate affected result/replay paths in all 3 languages and current source-required cases; no blanket migration of all 138 selected new-year cases.',
 policy:{absolute_path:policy,sha256:hash(fs.readFileSync(policy))},evidence_refs:refs};
fs.writeFileSync(path.join(__dirname,'native-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({pass:true,selected:18,native_widths:2,exact_diff_one_JA_phrase:true,old_raw_failures_preserved:old.cases.filter(x=>x.status==='fail').length,global_approved:false},null,2));
