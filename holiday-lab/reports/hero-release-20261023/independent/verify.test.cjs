const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=process.env.HERO_QA_RUN||path.join(__dirname,'runs/2026-10-23T09-03-53-114Z'),file=path.join(dir,'result.json'),{verify}=require('./verify.cjs');
function forged(change){const data=JSON.parse(fs.readFileSync(file));change(data);const mod={exports:{}},patched={...fs,readFileSync:(p,...args)=>path.resolve(p)===path.resolve(file)?Buffer.from(JSON.stringify(data)):fs.readFileSync(p,...args)};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'verify.cjs'),'utf8'),{require:n=>n==='node:fs'?patched:require(n),module:mod,process,Buffer},{filename:__filename});return()=>mod.exports.verify(dir);}
test('real frozen Hero receipt and original PNGs pass',()=>assert.equal(verify(dir).pass,true));
test('browser errors cannot be hidden by summary pass',()=>assert.throws(forged(r=>r.cases[0].errors.push({kind:'console'}))));
test('actual CJK orphan rows cannot be hidden',()=>assert.throws(forged(r=>r.cases[0].layout.orphans.push({text:'字'}))));
test('premature game requests are rejected',()=>assert.throws(forged(r=>r.cases[0].beforeClickGameRequests.push('/holiday-lab/games/new-year.mjs'))));
test('Labor cannot replace one of the fourteen active review choices',()=>assert.throws(forged(r=>r.cases[0].options[0].value='labor')));
test('changed served source fingerprints are rejected',()=>assert.throws(forged(r=>r.sources.after['index.html']='0'.repeat(64))));
test('fake screenshot hashes are rejected',()=>assert.throws(forged(r=>r.cases[0].screenshots[0].sha256='0'.repeat(64))));
test('bounded Hero evidence cannot certify full release gate',()=>assert.throws(forged(r=>r.full_project_approved=true)));
