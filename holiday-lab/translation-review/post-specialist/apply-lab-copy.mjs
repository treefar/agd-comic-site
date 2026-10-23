// Two independently reviewed omissions. Existing plans and frozen builds remain historical evidence.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const baseline='80286ca',files=['data/en/labs.json','data/ja/messages.json'];
const original=Object.fromEntries(files.map(f=>[f,JSON.parse(execFileSync('git',['show',baseline+':'+f],{encoding:'utf8'}))]));
const expected=structuredClone(original),lab=expected[files[0]][7];
assert.equal(lab.slug,'db105');
const before='animation, film scoring, digital learning',after='animation, film scoring, film and television production, digital learning';
assert.equal(lab.content.split(before).length-1,1);lab.content=lab.content.replace(before,after);
const key='影音後製 / 自媒體',oldJa='映像ポストプロダクション / 個人メディア',newJa='映像・音声ポストプロダクション / 個人メディア';
assert.equal(expected[files[1]][key],oldJa);expected[files[1]][key]=newJa;
const canonical=JSON.parse(fs.readFileSync('data/labs.json','utf8'))[7];
assert.equal(canonical.slug,'db105');assert.ok(canonical.content.includes('動畫、配樂、影視、數位學習'));
const snapshots=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f)])),mode=process.argv.includes('--apply')?'apply':'verify';
for(const f of files)assert.deepEqual(JSON.parse(snapshots[f]),mode==='apply'?original[f]:expected[f],f+' must match the complete fixed snapshot except the two explicit changes');
if(mode==='apply'){
 for(const f of files)assert.ok(fs.readFileSync(f).equals(snapshots[f]),'Concurrent source change '+f);
 for(const f of files)fs.writeFileSync(f,JSON.stringify(expected[f],null,2)+'\n');
}
if(process.argv.includes('--generated')){
 const context={};vm.runInNewContext(fs.readFileSync('locale-en.js','utf8')+';this.en=SITE_EN_MESSAGES;'+fs.readFileSync('locale-ja.js','utf8')+';this.ja=SITE_JA_MESSAGES;',context);
 assert.equal(context.en[canonical.content.replace(/\s+/g,' ').trim()],lab.content);
 assert.equal(context.ja[key],newJa);
}
const sha=b=>createHash('sha256').update(b).digest('hex');
console.log(JSON.stringify({baseline,mode,operations:2,canonical_audio_and_film_sources_preserved:true,all_non_target_values_equal:true,generated_checked:process.argv.includes('--generated'),files:files.map(f=>({path:f,before_sha256:sha(snapshots[f]),after_sha256:sha(fs.readFileSync(f))}))},null,2));
