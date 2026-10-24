const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..'),facts=require('./facts.json');
test('award year agrees with the dated organizer announcement in both data sources',()=>{
 const raw=fs.readFileSync(path.join(__dirname,'primary.json'),'utf8');assert.ok(raw.includes('2021.04.28'));assert.ok(raw.includes('XiaoSA 小颯'));assert.ok(raw.includes('https://www.celsys.com/topic/2021042802'));
 for(const f of ['data/works.json','data/en/works.json']){const w=JSON.parse(fs.readFileSync(path.join(root,f))).find(w=>w.id==='clipstudio-grand-prize');assert.equal(w.year,facts.year,f);assert.equal(w.team,'小颯');}
});
