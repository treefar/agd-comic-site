const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../..'),m=JSON.parse(fs.readFileSync(path.join(d,'baseline.json'))),prepared=[];
const red=JSON.parse(fs.readFileSync(path.join(d,'red-result.json')));
if(red.no<4)throw Error('Semantic red reproduction missing');
for(const s of m.sources){
 let raw=fs.readFileSync(path.join(repo,s.file),'utf8');const original=JSON.parse(raw),own=m.changes.filter(x=>x.file===s.file);
 for(const op of own){
  if(original[op.key]!==op.before)throw Error('Exact before guard:'+s.file);
  const marker=JSON.stringify(op.key)+': '+JSON.stringify(op.before),replacement=JSON.stringify(op.key)+': '+JSON.stringify(op.after);
  if(raw.split(marker).length!==2)throw Error('Expected unique exact JSON entry');
  raw=raw.replace(marker,replacement);
 }
 const now=JSON.parse(raw),keys=new Set(own.map(x=>x.key));
 if(JSON.stringify(Object.keys(now))!==JSON.stringify(Object.keys(original))||Object.keys(original).filter(k=>!keys.has(k)).some(k=>original[k]!==now[k]))throw Error('Unexpected mapping change');
 prepared.push({file:s.file,raw,changed:own.length,sha256:crypto.createHash('sha256').update(raw).digest('hex')});
}
for(const p of prepared)fs.writeFileSync(path.join(repo,p.file),p.raw);
const receipt={at:new Date().toISOString(),proposal:m.proposal,files:prepared.map(({raw,...x})=>x),changed_values:prepared.reduce((n,x)=>n+x.changed,0),changed_keys:new Set(m.changes.map(x=>x.key)).size,other_mappings_preserved:true};
fs.writeFileSync(path.join(d,'apply-result.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt,null,2));
