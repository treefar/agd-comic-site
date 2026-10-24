const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),p=JSON.parse(fs.readFileSync(path.join(__dirname,'../program/proposal.json'),'utf8'));
const allowed=new Set(['data/admission.json','data/en/admission.json','data/ja/messages.json']),docs=new Map();
const operations=[...p.operations,...p.title_operations];
for(const o of operations){assert.ok(allowed.has(o.file));if(!docs.has(o.file))docs.set(o.file,JSON.parse(fs.readFileSync(path.join(root,o.file),'utf8')));const keys=o.pointer.slice(1).split('/').map(k=>k.replace(/~1/g,'/').replace(/~0/g,'~')),key=keys.pop(),parent=keys.reduce((a,k)=>a[k],docs.get(o.file));assert.equal(parent[key],o.op==='add'?undefined:o.before,o.file+o.pointer);parent[key]=o.after;}
for(const[f,j]of docs)fs.writeFileSync(path.join(root,f),JSON.stringify(j,null,2)+'\n');
console.log(JSON.stringify({applied:operations.length,program_operations:p.operations.length,title_operations:p.title_operations.length,files:[...docs.keys()],public_release:false}));
