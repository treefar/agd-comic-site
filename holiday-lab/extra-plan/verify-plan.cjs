const fs=require('node:fs');const assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(__dirname+'/art-contract.json','utf8'));
const keys=['actor1','actor2','actor3','prop1','prop2','prop3','target','token1','token2','token3'].sort();
const expected={
 'peace-memory':['2027-02-28','2027-02-27','2027-03-01'],
 qingming:['2027-04-05','2027-04-03','2027-04-06'],
 labor:['2027-05-01','2027-04-30','2027-05-02'],
 retrocession:['2027-10-25','2027-10-23','2027-10-25'],
 constitution:['2027-12-25','2027-12-24','2027-12-26']
};
assert.equal(data.games.length,5);assert.equal(new Set(data.games.map(g=>g.id)).size,5);
for(const g of data.games){assert.deepEqual([g.day,...g.government_window],expected[g.id]);assert.equal(g.school_closure,null);assert.deepEqual(Object.keys(g.sprite_keys).sort(),keys);assert.equal(g.cg_story.length,5);for(const lang of ['zh','en','ja'])assert.ok(g.title[lang]);console.log(`yes ${g.id}: official date/window + school unknown + 10 sprites + 5 CG + zh/en/ja`);}
assert.ok(!data.games.some(g=>/christmas|halloween/i.test(g.id)));console.log('yes selected scope: 5 additional universal-holiday topics, no duplicate old festival');
console.log('no implementation/playthrough/artwork approval: planning evidence only');
