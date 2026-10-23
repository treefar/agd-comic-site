const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{verify}=require('./verify.cjs');
const runs=path.join(__dirname,'runs'),green=process.env.STUDENT_QA_RUN||fs.readdirSync(runs).sort().reverse().map(n=>path.join(runs,n)).find(dir=>{const f=path.join(dir,'result.json');return fs.existsSync(f)&&JSON.parse(fs.readFileSync(f)).status==='pass';}),file=green&&path.join(green,'result.json');
function forged(change){const raw=JSON.parse(fs.readFileSync(file));change(raw);const mod={exports:{}},patched={...fs,readFileSync:(p,...args)=>path.resolve(p)===path.resolve(file)?Buffer.from(JSON.stringify(raw)):fs.readFileSync(p,...args)};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'verify.cjs'),'utf8'),{require:n=>n==='node:fs'?patched:require(n),module:mod,process,Buffer},{filename:__filename});return()=>mod.exports.verify(green);}
test('the original failed mobile review remains rejected',()=>assert.throws(()=>verify(path.join(runs,'2026-10-23T09-35-46-407Z'))));
test('the new real receipt, complete credits and original posters pass',{skip:!green},()=>assert.equal(verify(green).pass,true));
test('summary pass cannot hide a failed mobile demo',{skip:!green},()=>assert.throws(forged(r=>r.demoCases.find(c=>c.width===320).status='fail')));
test('a missing creator name is rejected',{skip:!green},()=>assert.throws(forged(r=>{const w=r.cases[0].works[0];w.credit=w.credit.replace('王愛吉','');})));
test('generated seasonal art requested before play is rejected',{skip:!green},()=>assert.throws(forged(r=>r.cases[0].beforeClickForbidden.push('/holiday-lab/assets/new-year/cg-5.webp'))));
test('source drift cannot be combined into a pass',{skip:!green},()=>assert.throws(forged(r=>r.sources.after['holiday-lab/student-curation.css']='0'.repeat(64))));
test('poster cropping cannot masquerade as full-poster display',{skip:!green},()=>assert.throws(forged(r=>r.cases[0].works[0].layout.posters.find(p=>p.id==='student-work-poster').fit='cover')));
test('fake PNG hashes are rejected',{skip:!green},()=>assert.throws(forged(r=>r.cases[0].screenshots[0].sha256='0'.repeat(64))));
test('bounded local review cannot approve the full release gate',{skip:!green},()=>assert.throws(forged(r=>r.full_project_approved=true)));
