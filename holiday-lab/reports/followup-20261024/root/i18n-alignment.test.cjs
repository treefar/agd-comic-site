const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..'),zh=require(path.join(root,'data/stats.json')),en=require(path.join(root,'data/en/stats.json'));
test('English awards source retains all canonical years, counts and per-year item counts',()=>{
 for(const slug of ['awards','honors']){const z=zh.find(x=>x.slug===slug),e=en.find(x=>x.slug===slug);assert.equal(e.groups.length,z.groups.length,slug);for(let i=0;i<z.groups.length;i++)assert.equal(e.groups[i].items.length,z.groups[i].items.length,slug+' '+z.groups[i].year);}
 const z=zh.find(x=>x.slug==='awards'),e=en.find(x=>x.slug==='awards');assert.equal(e.highlights.length,z.highlights.length);assert.equal(e.highlights.at(-1).count,z.highlights.at(-1).count);
});
test('the soothing-sounds source is classified as a game, consistent with canonical data',()=>{const z=require(path.join(root,'data/works.json')).find(x=>x.id==='soothing-sounds'),e=require(path.join(root,'data/en/works.json')).find(x=>x.id==='soothing-sounds');assert.equal(z.kind,'遊戲');assert.equal(e.kind,'Game');});
