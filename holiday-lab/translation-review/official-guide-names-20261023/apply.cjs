const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'plan.json'))),files=new Map();
for(const row of plan)for(const d of row.definitions){
 if(!files.has(d.file))files.set(d.file,fs.readFileSync(d.file,'utf8'));
 let text=files.get(d.file),key=d.pointer.slice(1).replace(/~1/g,'/').replace(/~0/g,'~');
 const obj=JSON.parse(text);assert.equal(obj[key],d.expected_raw,row.id+' exact current value');
 const old=JSON.stringify(key)+': '+JSON.stringify(d.expected_raw),next=JSON.stringify(key)+': '+JSON.stringify(row.expected);
 assert.equal(text.split(old).length-1,1,row.id+' exact single property');
 assert.equal(d.expected_raw.replace(row.fromName,row.toName),row.expected,row.id+' name only');
 files.set(d.file,text.replace(old,next));
}
for(const [file,text]of files)fs.writeFileSync(file,text);
console.log('APPLIED names12 EN10 JA2 in4 source files; exact name fragments only; PROGRAM4 unchanged');

