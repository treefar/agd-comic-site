import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const json=f=>JSON.parse(fs.readFileSync(f,'utf8')),norm=s=>s.replace(/\s+/g,' ').trim();
function locales(read){const c={};vm.runInNewContext(read('locale-en.js')+';this.en=SITE_EN_MESSAGES;'+read('locale-ja.js')+';this.ja=SITE_JA_MESSAGES;',c);return{en:JSON.parse(JSON.stringify(c.en)),ja:JSON.parse(JSON.stringify(c.ja))};}
const current=locales(f=>fs.readFileSync(f,'utf8')),old=locales(f=>execFileSync('git',['show','80286ca:'+f],{encoding:'utf8',maxBuffer:10e6})),expected=structuredClone(old);
const plan=json('holiday-lab/translation-review-about-labs/exact-plan.json'),degrees=json('holiday-lab/translation-review-title-check/neutral-degrees/exact-six.json').operations;
const jaKey='影音後製 / 自媒體',newJa='映像・音声ポストプロダクション / 個人メディア',lab=json('data/labs.json')[7],newEn=json('data/en/labs.json')[7].content;
expected.ja[jaKey]=newJa;expected.en[norm(lab.content)]=newEn;
for(const op of degrees){assert.equal(json(op.file).find(f=>f.slug===op.slug).education,op.new);expected.en[op.key]=op.new;}
const corrections=new Map([['ABOUTLAB-c8219f24cbc1-ja',newJa],['ABOUTLAB-089d19b70ab2-en',newEn]]);let corrected=0;
function at(obj,pointer){return pointer.slice(1).split('/').map(s=>s.replace(/~1/g,'/').replace(/~0/g,'~')).reduce((v,k)=>v[k],obj);}
for(const op of plan.operations){const value=corrections.get(op.id)??op.new;if(corrections.has(op.id))corrected++;assert.equal(at(json(op.file),op.pointer),value,op.id+' source');assert.equal(current[op.lang][norm(op.key)],value,op.id+' generated');}
assert.equal(corrected,2);assert.equal(plan.operations.length,44);assert.equal(degrees.length,6);
for(const lang of ['en','ja'])assert.deepEqual(current[lang],expected[lang],lang+' complete dictionary must equal 08 plus only the eight corrections');
const changed=Object.fromEntries(['en','ja'].map(lang=>[lang,Object.keys(current[lang]).filter(k=>current[lang][k]!==old[lang][k]).length]));
assert.deepEqual(changed,{en:7,ja:1});
execFileSync(process.execPath,['holiday-lab/translation-review/post-specialist/apply-lab-copy.mjs','--verify','--generated'],{stdio:'inherit'});
for(const dir of ['translation-review-content-next','translation-review-news-works-final'])execFileSync(process.execPath,[`holiday-lab/${dir}/apply-safe.mjs`,'--project',process.cwd(),'--verify-applied','--require-generated'],{stdio:'inherit'});
console.log(JSON.stringify({pass:true,about_labs_values:44,explicitly_corrected_previous_values:2,neutral_degrees:6,exact_dictionary_changes_from08:changed,non_target_generated_values_equal:true,files_written:0},null,2));
