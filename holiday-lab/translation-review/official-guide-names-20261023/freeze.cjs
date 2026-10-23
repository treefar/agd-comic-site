const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const b=__dirname,read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const file=path.join(b,'freeze-v3.json');assert(!fs.existsSync(file),'fresh freeze only');
const before=read('holiday-lab/translation-review/plain-copy-layout-20261023/freeze-v2.json'),base=read(path.join(b,'baseline.json')),site=path.resolve('.measure-official-guide-names-20261023-01');
let oldVerified=0;for(const f of before.build_files){assert.equal(sha(path.join(before.site,f.file)),f.sha256,'old02 immutable '+f.file);oldVerified++;}
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const build=walk(site).map(f=>({file:path.relative(site,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:sha(f)}));
const old=new Map(before.build_files.map(x=>[x.file,x])),now=new Map(build.map(x=>[x.file,x]));
const delta={before:before.site,after:site,old_files:before.build_files.length,new_files:build.length,old02_verified:oldVerified,added:build.filter(f=>!old.has(f.file)),removed:before.build_files.filter(f=>!now.has(f.file)),changed:build.filter(f=>old.has(f.file)&&old.get(f.file).sha256!==f.sha256),unchanged:build.filter(f=>old.get(f.file)?.sha256===f.sha256).length};
const source=base.files.filter(f=>f.file!=='holiday-lab/latest-build.json').map(f=>({file:f.file,bytes:fs.statSync(f.file).size,sha256:sha(f.file)}));
const latest={before_sha256:base.files.find(f=>f.file==='holiday-lab/latest-build.json').sha256,after_sha256:sha('holiday-lab/latest-build.json'),before:read(path.join(b,'preimage/holiday-lab/latest-build.json')),after:read('holiday-lab/latest-build.json'),staged:false,note:'既有本機measurement可變指標；build更新，不復原也不提交'};
fs.writeFileSync(path.join(b,'build-delta.json'),JSON.stringify(delta,null,2)+'\n');
fs.writeFileSync(path.join(b,'latest-build-change.json'),JSON.stringify(latest,null,2)+'\n');
fs.writeFileSync(file,JSON.stringify({created_at:new Date().toISOString(),site,base:null,source_files:source,build_files:build,scope:'12 exact supported name-fragment changes; prior12 semantic + layout preserved; independent UI acceptance pending',public_release:false,full_project_approved:false},null,2)+'\n');
console.log('FROZEN sources'+source.length+' build'+build.length+' old02immutable'+oldVerified+'; no browser/HTTP server started');
console.log(JSON.stringify({added:delta.added.map(x=>x.file),removed:delta.removed.map(x=>x.file),changed:delta.changed.map(x=>x.file),unchanged:delta.unchanged}));

