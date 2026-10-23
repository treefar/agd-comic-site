'use strict';
const assert=require('node:assert/strict'),d=require('../domain.cjs'),{digest,viewport}=require('./engine.cjs');
function buildPlan(){
 const targets=[];
 for(const lang of ['zh','en','ja'])for(const width of [320,1440])for(const original of d.fullOwnerJobs(lang,width)){
  const height=viewport(width).height,job={...original,height},expected=d.evaluate(job.schedule);assert.equal(expected.ok,false);assert.equal(expected.reason,job.reason);d.assertUiSchedule(job.schedule);
  const inputs={schedule:job.schedule,ranges:job.schedule.map((j,i)=>({id:'labor-start-'+i,min:'0',max:'42',step:'1',value:String(j.start)})),choices:job.schedule.flatMap((j,i)=>[0,1,2].map(a=>({id:`labor-worker-${i}-${a}`,pressed:String(j.artist===a)})))};
  const dom_expected=Object.fromEntries([...['game-hint','labor-status','labor-loads','game-progress'].map(owner=>[owner,d.words(owner,expected,lang)]),...job.schedule.map((j,i)=>['output:labor-start-'+i,String(j.start)])]);
  for(const owner of job.owners)targets.push({id:`labor/${lang}/${width}x${height}/${job.id}/${owner}`,job_id:job.id,job_identity:job,job_sha256:digest(job),lang,width,height,owner,schedule:job.schedule,inputs,expected,dom_expected});
 }
 assert.equal(targets.length,2784);assert.equal(new Set(targets.map(t=>t.id)).size,2784);return targets;
}
module.exports={buildPlan};
