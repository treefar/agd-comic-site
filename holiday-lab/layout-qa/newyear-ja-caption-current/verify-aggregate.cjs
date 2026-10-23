const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {sampleLayout}=require('../browser-sampler.cjs');
const {inspectReport}=require('C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const runs=['2026-10-23T00-45-20-992Z','2026-10-23T01-03-43-409Z'].map(name=>({name,dir:path.join(__dirname,'runs',name),report:JSON.parse(fs.readFileSync(path.join(__dirname,'runs',name,'report.json')))}));
const sources=runs[0].report.before,selected=[];
for(const r of runs){assert.ok(r.report.source_stable);assert.deepEqual(r.report.before,sources);assert.deepEqual(r.report.after,sources);assert.equal(r.report.sampler_function_sha256,sha(sampleLayout.toString()));}
for(const width of [320,1440])for(let target=0;target<9;target++){
 let found;
 for(const r of [...runs].reverse())for(const row of r.report.cases.filter(c=>c.width===width&&c.lang==='ja')){
  const s=row.samples.find(s=>s.target===target&&s.stable);if(s&&!found)found={r,row,s};
 }
 assert.ok(found,`${width}/${target}`);const{r,row,s}=found;
 assert.equal(sha(fs.readFileSync(path.join(r.dir,s.file))),s.screenshot_sha256);
 assert.equal(s.before.shot,target);assert.equal(s.after.shot,target);
 assert.equal(String(s.sample.evidence.replay_shot_start),String(target));assert.equal(String(s.sample.evidence.replay_shot_end),String(target));
 assert.deepEqual(inspectReport({schema_version:1,source_fingerprints:{},cases:[{id:`ja/${width}/${target}`,width,height:width===320?900:1000,nodes:s.sample.nodes,blockers:s.sample.blockers}]}),[]);
 if(target===0)assert.ok(s.before.caption.includes('軽く跳ぶ'));
 selected.push({width,target,run:r.name,file:s.file,screenshot_sha256:s.screenshot_sha256,geometry_errors:0});
}
const local=fs.readFileSync(path.resolve(__dirname,'../../games/new-year.mjs'));assert.equal(sha(local),sources['games/new-year.mjs']);
const result={source_agent:'codex',base:runs[0].report.base,pass:true,stable_captures:selected.length,original_unstable_attempts_retained:2,
 native_animation_observed_in_both_widths:runs[0].report.cases.every(c=>c.status==='native-replay-verified'&&c.seen.length===9),selected,
 scope:'18 native Japanese shot captures on immutable build10, source/hash and fixed sampler geometry only; no whole-project gate or universal font proof',
 source_sha256:sources,sampler_function_sha256:sha(sampleLayout.toString()),full_project_approved:false};
fs.writeFileSync(path.join(__dirname,'aggregate.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({pass:true,stable_captures:18,widths:[320,1440],targeted_retry:[3,7],original_unstable_retained:2,geometry_errors:0,source_stable:true,full_project_approved:false},null,2));
