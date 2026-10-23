// Recheck the independent browser receipt against current runtime bytes. No browser or product writes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ids=['new-year','lunar-new-year','lantern','children','dragon-boat','mid-autumn','teachers','national-day','semester','exhibition','peace-memory','qingming','retrocession','constitution'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function verify(root,file,{deep=true}={}){
 const full=path.resolve(root,file),bytes=fs.readFileSync(full),raw=JSON.parse(bytes),dir=path.dirname(full);
 assert.equal(raw.status,'pass');assert.equal(raw.full_project_approved,false);assert.equal(raw.canonical_eligible,false);
 assert.equal(raw.cases.length,84);assert.deepEqual(raw.sources.before,raw.sources.after,'served sources changed');
 const expected=['runner.mjs','lab.css','catalog.mjs','replay-model.mjs',...ids.map(id=>'games/'+id+'.mjs')];
 assert.deepEqual(Object.keys(raw.sources.before).sort(),expected.sort());
 for(const [file,digest]of Object.entries(raw.sources.before))assert.equal(sha(fs.readFileSync(path.join(root,'holiday-lab',file))),digest,'stale runtime '+file);
 const seen=new Set();let states=0,pngs=0,textRows=0;
 for(const c of raw.cases){
  const key=c.id+'-'+c.lang+'-'+c.width;assert.ok(ids.includes(c.id));assert.ok(['zh','en','ja'].includes(c.lang));assert.ok([320,1440].includes(c.width));assert.ok(!seen.has(key));seen.add(key);
  assert.equal(c.status,'pass',key);assert.deepEqual(c.errors,[],key);assert.deepEqual(c.pageErrors,[],key);assert.equal(c.issueCount,0,key);assert.equal(c.orphanCount,0,key);
  for(const label of ['intro','menu','help','settings','initial','wrong','result','retry'])assert.ok(c.states.some(s=>s.label===label),key+' missing '+label);
  assert.equal(new Set(c.replayShots).size,c.id==='semester'?4:3);assert.ok(c.artifact&&Object.keys(c.artifact).length>0);
  for(const s of c.states){states++;assert.deepEqual(s.issues,[],key+'/'+s.label);assert.deepEqual(s.orphans,[],key+'/'+s.label);assert.equal(s.fontStatus,'loaded');assert.ok(s.scrollWidth<=c.width+1);textRows+=s.rows.length;}
  assert.equal(c.screenshots.length,5,key+' screenshot count');
  for(const shot of c.screenshots){const p=path.resolve(dir,key,shot.file);assert.ok(p.startsWith(dir+path.sep));assert.ok(fs.statSync(p).size>100);if(deep){const b=fs.readFileSync(p);assert.equal(sha(b),shot.sha256);assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(b.readUInt32BE(16),c.width);assert.ok(b.readUInt32BE(20)>=c.height);}pngs++;}
 }
 return {verified:true,scope:'14 non-Labor games; selected real-UI flows in three languages at two widths',contexts:seen.size,states,screenshots:pngs,text_rows:textRows,layout_issues:0,unresolved_orphans:0,errors:0,source_files:expected.length,receipt:file,receipt_sha256:sha(bytes),source_fingerprints:raw.sources.before,full_project_approved:false,canonical_eligible:false};
}
module.exports=verify;
if(require.main===module){const root=process.cwd(),file=process.argv[2];if(!file)throw Error('Pass an independent result.json path');console.log(JSON.stringify(verify(root,file),null,2));}
