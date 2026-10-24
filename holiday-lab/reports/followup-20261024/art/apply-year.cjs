const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..');
for(const file of ['data/works.json','data/en/works.json']){const data=JSON.parse(fs.readFileSync(path.join(root,file))),work=data.find(w=>w.id==='clipstudio-grand-prize');assert.equal(work.year,'2022');assert.equal(work.team,'小颯');work.year='2021';fs.writeFileSync(path.join(root,file),JSON.stringify(data,null,2)+'\n');}
console.log('Updated two award-year metadata values: 2022 -> 2021. Original images, credits and creative content unchanged.');
