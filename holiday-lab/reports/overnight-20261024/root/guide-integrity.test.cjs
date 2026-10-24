const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..'),guide=require(path.join(root,'data/students/guide.json')),before=require('./before/data/students/guide.json');
test('guide retains all topics and existing workflows, with resolved citations for each detail and FAQ',()=>{
 assert.deepEqual(guide.cards.map(c=>c.id),before.cards.map(c=>c.id));const ids=new Set(guide.sources.map(s=>s.id));assert.equal(ids.size,guide.sources.length);
 for(const card of guide.cards){assert.ok(card.step_details.length>=card.steps.length);assert.ok(card.step_details.every(s=>s.title&&s.detail.length>20));assert.ok(card.faq.length>=2);
 for(const s of [...card.step_details,...card.faq]){assert.ok(s.source_ids.length>0);assert.ok(s.source_ids.every(id=>ids.has(id)),card.id);}}
 for(const s of before.sources)assert.deepEqual(guide.sources.find(n=>n.id===s.id),s,'Original source dates and evidence must remain unchanged');
});
test('new visible wording and source labels have both English and Japanese translations',()=>{
 const added=require('../guide/translations.json');for(const lang of ['en','ja']){const d=require(path.join(root,'data',lang,'flow-ui.json'));for(const row of added)assert.equal(d[row.zh.replace(/\s+/g,' ').trim()],row[lang]);}
});
