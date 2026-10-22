import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {prepare,applyPrepared,defaultPlan as plan} from './apply-safe.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(dir,'../../..');
const reviewed=JSON.parse(fs.readFileSync(path.join(dir,'reviewed.json'),'utf8'));
const fixed=f=>execFileSync('git',['show',`${plan.source_commit}:${f}`],{cwd:repo,maxBuffer:10*1024*1024});
const frozen=new Map([...plan.files.map(f=>f.file),'data/students/guide.json'].map(f=>[f,fixed(f)]));
function fixture(name){const root=path.join(dir,'fixtures',name);for(const[file,bytes]of frozen){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),bytes);}return root;}
const hash=(root,file)=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const hashes=root=>Object.fromEntries([...frozen.keys()].map(f=>[f,hash(root,f)]));
const norm=s=>s.replace(/\s+/g,' ').trim();
test('All remaining 18 FAQ pairs and 72 target strings have explicit per-string decisions',()=>{
 const guide=JSON.parse(frozen.get('data/students/guide.json')),all=guide.cards.flatMap(c=>c.faq.map((_,i)=>`faq/${c.id}/${i}`)),previous=reviewed.excluded_previously_reviewed;
 assert.equal(all.length,30);assert.equal(previous.length,12);assert.equal(reviewed.units.length,18);
 assert.deepEqual([...new Set([...previous,...reviewed.units.map(u=>u.id)])].sort(),all.sort());
 for(const u of reviewed.units){assert.ok(!previous.includes(u.id));assert.ok(u.review.note.length>20);assert.equal(u.review.strings.length,4);for(const s of u.review.strings)assert.ok(['retain','revise'].includes(s.decision)&&s.reason&&s.proposed);}
 assert.equal(reviewed.units.flatMap(u=>u.review.strings).filter(s=>s.decision==='revise').length,17);
});
test('Each reviewed Chinese/English/Japanese source equals the fixed baseline active locale',()=>{
 const ctx={};vm.createContext(ctx);for(const lang of ['en','ja'])vm.runInContext(fixed(`locale-${lang}.js`).toString()+`;this.${lang}=SITE_${lang.toUpperCase()}_MESSAGES`,ctx);
 const guide=JSON.parse(frozen.get('data/students/guide.json'));
 for(const u of reviewed.units){const[,id,index]=u.id.split('/'),faq=guide.cards.find(c=>c.id===id).faq[Number(index)];for(const[part,key]of [['question','q'],['answer','a']]){assert.equal(u[part].zh,faq[key]);for(const lang of ['en','ja'])assert.equal(u[part][lang],ctx[lang][norm(faq[key])]);}}
});
test('Every planned old/new pair is exactly the reviewed string; no extra product targets',()=>{
 assert.equal(plan.changes.length,17);assert.equal(plan.files.length,2);
 for(const c of plan.changes){const u=reviewed.units.find(u=>c.id.startsWith(u.id+'/'));assert.ok(u);const[,part,lang]=c.id.slice(u.id.length).split('/');assert.equal(c.key,norm(u[part].zh));assert.equal(c.old,u[part][lang]);assert.equal(c.new,u.review.strings.find(s=>s.part===part&&s.lang===lang).proposed);assert.notEqual(c.old,c.new);}
});
test('Fixed baseline dry-run preflights all 17 operations without writing any files',()=>{const root=fixture('dry-run'),before=hashes(root),p=prepare(root);assert.equal(p.report.operations,17);assert.equal(p.report.product_files_written,0);assert.deepEqual(hashes(root),before);});
test('A changed old value is caught before any product write',()=>{const root=fixture('old-drift'),c=plan.changes[0],file=path.join(root,c.file),d=JSON.parse(fs.readFileSync(file));d[c.key]='A later edit';fs.writeFileSync(file,JSON.stringify(d));const before=hashes(root);assert.throws(()=>prepare(root),/OLD_EXACT_MISMATCH/);assert.deepEqual(hashes(root),before);});
test('Only planned values change and unrelated root content/canonical Chinese survive application',()=>{
 const root=fixture('apply'),c=plan.changes[0],file=path.join(root,c.file),extra=JSON.parse(fs.readFileSync(file));extra['root-addition']='Keep me';fs.writeFileSync(file,JSON.stringify(extra));const guideHash=hash(root,'data/students/guide.json');
 const before=Object.fromEntries(plan.files.map(f=>[f.file,JSON.parse(fs.readFileSync(path.join(root,f.file)))]));
 const result=applyPrepared(prepare(root));assert.equal(result.product_files_written,2);assert.equal(hash(root,'data/students/guide.json'),guideHash);
 for(const f of plan.files){const expected={...before[f.file]};for(const c of plan.changes.filter(c=>c.file===f.file))expected[c.key]=c.new;assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,f.file))),expected);}
 // The application tool deliberately rejects an already applied source; fixtures must still be reusable.
 assert.throws(()=>prepare(root),/OLD_EXACT_MISMATCH/);assert.equal(prepare(fixture('apply')).report.operations,17);
});
test('A concurrent edit after preflight prevents every write',()=>{const root=fixture('concurrent'),p=prepare(root),file=path.join(root,plan.files[1].file);fs.appendFileSync(file,'\n');const before=hashes(root);assert.throws(()=>applyPrepared(p),/CONCURRENT_CHANGE/);assert.deepEqual(hashes(root),before);});
test('Unexpected files and duplicate targets are rejected',()=>{const root=fixture('scope');assert.throws(()=>prepare(root,{...plan,files:[{file:'data/admission.json'}]}),/OUTSIDE/);assert.throws(()=>prepare(root,{...plan,changes:[...plan.changes,plan.changes[0]]}),/DUPLICATE_TARGET/);});
test('Dates, numerals, extensions, and canonical Chinese keys are not changed',()=>{const numbers=s=>s.match(/\d+(?:[/.]\d+)*/g)??[];for(const c of plan.changes){assert.deepEqual(numbers(c.new),numbers(c.old),c.id);assert.equal(c.key,norm(c.canonical_chinese));}assert.ok(plan.changes.filter(c=>c.id.includes('graduate-study')).every(c=>c.new.includes('116')&&!c.new.includes('推薦')));});
test('Changed FAQ keys are not overridden by a later locale dictionary',()=>{
 const later={en:['guide-labels','step-details-ui','editorial','flow-ui'],ja:['ui','step-details','editorial','flow-ui']};
 for(const c of plan.changes){const lang=c.file.split('/')[1];for(const name of later[lang]){const dict=JSON.parse(fixed(`data/${lang}/${name}.json`));assert.ok(!Object.hasOwn(dict,c.key),`${c.id} overridden by ${name}`);}}
});
