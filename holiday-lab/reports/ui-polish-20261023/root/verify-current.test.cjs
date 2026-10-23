const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../..'),file='holiday-lab/reports/ui-polish-20261023/independent/runs/2026-10-23T08-07-41-848Z/result.json';
const verify=require('./verify-current.cjs');
test('the final independent receipt matches all current runtime sources and PNGs',()=>{const r=verify(root,file);assert.equal(r.contexts,84);assert.equal(r.screenshots,420);assert.equal(r.full_project_approved,false);});
function forged(change){
 const target=path.resolve(root,file),data=JSON.parse(fs.readFileSync(target));change(data);
 const mod={exports:{}},fakeFs={...fs,readFileSync:(p,...args)=>path.resolve(String(p))===target?Buffer.from(JSON.stringify(data)):fs.readFileSync(p,...args)};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'verify-current.cjs'),'utf8'),{require:n=>n==='node:fs'?fakeFs:require(n),module:mod,process,Buffer},{filename:__filename});
 return()=>mod.exports(root,file,{deep:false});
}
test('an invented pass cannot hide a failed context',()=>assert.throws(forged(d=>{d.cases[0].status='fail';})));
test('an invented zero cannot hide an actual clipped-text row',()=>assert.throws(forged(d=>{d.cases[0].states[0].issues.push({kind:'clipped-text'});})));
test('stale CSS fingerprints cannot certify the current build',()=>assert.throws(forged(d=>{d.sources.before['lab.css']=d.sources.after['lab.css']='0'.repeat(64);})));
test('an invented global approval cannot upgrade bounded UI evidence',()=>assert.throws(forged(d=>{d.full_project_approved=true;})));
