const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..'),zh=require(path.join(root,'data/admission.json'))[6],en=require(path.join(root,'data/en/admission.json'))[6],ja=require(path.join(root,'data/ja/messages.json'));
test('continuing admission card is consistently historical and does not promise an interview or fixed evening hours',()=>{
 for(const j of [zh,en]){assert.match(j.quota,/30/);assert.match(j.quota,/已截止|closed/);const all=JSON.stringify(j);assert.ok(!/書審 \+ 面試|document review \+ interview|18:30-21:30/i.test(all));}
 for(const field of ['title','quota','summary','content','schedule_short']){const canonical=zh[field].replace(/\s+/g,' ').trim();assert.ok(ja[canonical],field+' must resolve through the renderer’s whitespace-normalized canonical key');}
});
test('Taiwan assistant professor rank is retained without asserting equivalence to Japanese 助教',()=>{
 for(const key of ['助理教授','助理教授 · 電競娛樂系合聘','助理教授 · 從聘','助理教授 · 留職停薪']){assert.ok(ja[key].includes('台湾の職名／Assistant Professor'));assert.ok(!ja[key].includes('助教'));}
});
