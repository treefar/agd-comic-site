const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict'),test=require('node:test');
const dir=__dirname,packet=JSON.parse(fs.readFileSync(path.join(dir,'input.json'))),approved=packet.rows.filter(r=>r.direct_semantic_subset);
const read=f=>JSON.parse(fs.readFileSync(f)),ptr=(o,p)=>p.split('/').slice(1).reduce((a,k)=>a[k.replace(/~1/g,'/').replace(/~0/g,'~')],o);
function locale(file){const c={};vm.runInNewContext(fs.readFileSync(file,'utf8')+';globalThis.M=typeof SITE_EN_MESSAGES!=="undefined"?SITE_EN_MESSAGES:SITE_JA_MESSAGES;',c);return JSON.parse(JSON.stringify(c.M));}
const norm=s=>s.replace(/\s+/g,' ').trim();
for(const row of approved)test(row.id+'/'+row.lang+' uses the reviewed meaning-preserving translation',()=>{
 for(const d of row.definitions){assert.equal(ptr(read(path.join(dir,'preimage',d.file)),d.pointer),d.expected_raw,'original preimage');assert.equal(ptr(read(d.file),d.pointer),row.candidate,row.id);}
});
test('all unapproved source keys stay unchanged and no keys are added or removed',()=>{
 const files=[...new Set(approved.flatMap(r=>r.definitions.map(d=>d.file)))];
 for(const file of files){const before=read(path.join(dir,'preimage',file)),actual=read(file),allowed=new Set(approved.flatMap(r=>r.definitions.filter(d=>d.file===file).map(d=>d.pointer.slice(1).replace(/~1/g,'/').replace(/~0/g,'~'))));assert.deepEqual(Object.keys(actual),Object.keys(before),file+' keys');for(const key of Object.keys(before))if(!allowed.has(key))assert.equal(actual[key],before[key],file+'/'+key);}
});
for(const lang of ['en','ja'])test(lang+' generated public dictionary has exactly the approved changed values, preserving all other keys',()=>{
 const file='locale-'+lang+'.js',actual=locale(file),before=locale(path.join(dir,'preimage',file)),expected=structuredClone(before),rows=approved.filter(r=>r.lang===lang);
 for(const row of rows){assert.equal(before[norm(row.key)],row.current,'public preimage '+row.id);expected[norm(row.key)]=row.candidate;}
 assert.deepEqual(Object.keys(actual),Object.keys(expected),'dictionary keys');const differences=Object.keys(expected).filter(key=>actual[key]!==expected[key]);assert.deepEqual(differences,[],'public dictionary mismatched keys');assert.equal(rows.length,lang==='ja'?7:5);
});
test('the remaining sixteen candidates are unchanged in source data and public dictionary',()=>{
 let count=0;for(const row of packet.rows.filter(r=>!r.direct_semantic_subset)){const dict=locale('locale-'+row.lang+'.js');assert.equal(dict[norm(row.key)],row.current,row.id);for(const d of row.definitions)assert.equal(ptr(read(d.file),d.pointer),d.expected_raw,row.id);count++;}assert.equal(count,16);
});
