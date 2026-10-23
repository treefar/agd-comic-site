const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const target=process.env.UI_VERIFY_RUN;if(!target)throw Error('Set UI_VERIFY_RUN to the completed final run');
const dir=path.resolve(target),result=path.join(dir,'result.json'),source=fs.readFileSync(path.join(__dirname,'verify.cjs'),'utf8');
function loaded(mutate){const fakeFs={...fs,readFileSync(file,...args){if(path.resolve(String(file))===result){const r=JSON.parse(fs.readFileSync(result,'utf8'));mutate?.(r);return JSON.stringify(r);}return fs.readFileSync(file,...args);}};const mod={exports:{}},customRequire=name=>name==='fs'?fakeFs:require(name);new Function('require','module','process','console',source)(customRequire,mod,process,console);return mod.exports.verify;}
test('final raw receipts independently verify',()=>assert.equal(loaded()(dir).pass,true));
for(const [name,mutate]of [
 ['missing context',r=>r.cases.pop()],
 ['false whole-project approval',r=>r.full_project_approved=true],
 ['orphan hidden behind flow PASS',r=>r.cases[0].orphanCount=1],
 ['forged perfect score',r=>r.cases.find(c=>c.id==='lantern').completion.display='100 / 100'],
 ['unloaded image',r=>r.cases[0].states.find(s=>s.images.length).images[0].naturalWidth=0],
 ['stale source',r=>r.sources.after['lab.css']='0'.repeat(64)],
 ['forged screenshot hash',r=>r.cases[0].screenshots[0].sha256='0'.repeat(64)]
])test('rejects '+name,()=>assert.throws(()=>loaded(mutate)(dir)));
