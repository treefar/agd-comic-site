const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(__dirname,'../guide'),p=JSON.parse(fs.readFileSync(path.join(base,'proposal.json'))),t=JSON.parse(fs.readFileSync(path.join(base,'translations.json'))),file=path.join(root,p.target),raw=fs.readFileSync(file);
assert.equal(p.target,'data/students/guide.json');assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),p.input_sha256);
const guide=JSON.parse(raw),before=structuredClone(guide);
for(const o of p.operations){const keys=o.pointer.slice(1).split('/').map(k=>k.replace(/~1/g,'/').replace(/~0/g,'~')),key=keys.pop(),parent=keys.reduce((a,k)=>a[k],guide);assert.equal(o.op,'replace');assert.deepEqual(parent[key],o.before,o.pointer);parent[key]=o.after;}
assert.deepEqual(guide.cards.map(c=>c.id),before.cards.map(c=>c.id));
for(const card of before.cards){const after=guide.cards.find(c=>c.id===card.id);assert.deepEqual(after.steps,card.steps);for(const faq of card.faq)assert.ok(after.faq.some(f=>f.q===faq.q&&f.a===faq.a));}
for(const source of before.sources)assert.ok(guide.sources.some(s=>s.id===source.id));
const translations=[];
for(const lang of ['en','ja']){const f=path.join(root,'data',lang,'flow-ui.json'),j=JSON.parse(fs.readFileSync(f));for(const r of t){const key=r.zh.replace(/\s+/g,' ').trim();if(j[key]!==undefined)assert.equal(j[key],r[lang],lang+' '+key);j[key]=r[lang];}translations.push([f,j]);}
guide.as_of='2026-10-24'; // Review/compilation date; each source retains its actual reading date and limitations.
fs.writeFileSync(file,JSON.stringify(guide,null,2)+'\n');for(const[f,j]of translations)fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n');
console.log(JSON.stringify({operations:p.operations.length,cards:guide.cards.length,steps:guide.cards.reduce((n,c)=>n+c.steps.length,0),faq:guide.cards.reduce((n,c)=>n+c.faq.length,0),sources:guide.sources.length,translation_pairs:t.length*2,current_all_rules_verified:false,source_dates_preserved:true}));
