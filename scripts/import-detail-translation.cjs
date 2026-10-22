const fs=require('node:fs'),assert=require('node:assert/strict'),root='C:/agywork/agd-guide-detail-translation';
const input=JSON.parse(fs.readFileSync(root+'/inputs/details.json')),output=JSON.parse(fs.readFileSync(root+'/out/details.json'));
assert.deepEqual(Object.keys(output).sort(),input.map(x=>x.id).sort());const en={},ja={};
for(const row of input)for(const lang of ['en','ja']){const value=output[row.id][lang];assert.ok(typeof value==='string'&&value.trim(),row.id+' '+lang);(lang==='en'?en:ja)[row.zh]=value;}
fs.writeFileSync('data/en/step-details-ui.json',JSON.stringify(en,null,2)+'\n');fs.writeFileSync('data/ja/step-details.json',JSON.stringify(ja,null,2)+'\n');console.log('IMPORTED detail translations',input.length,'English + Japanese');
