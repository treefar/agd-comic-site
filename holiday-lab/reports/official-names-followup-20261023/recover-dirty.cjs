const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'root','dirty-recovery');fs.mkdirSync(out,{recursive:true});const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=JSON.parse(fs.readFileSync(path.join(root,'holiday-lab/reports/integrated-review-20261023/root/before-merge.json'))).dirty;
for(const [i,r]of before.entries()){const p=path.join(out,'observed-after-failed-merge-'+i+'.bin');if(!fs.existsSync(p))fs.copyFileSync(path.join(root,r.file),p);}
const r=cp.spawnSync('git',['-c','core.longpaths=true','fsck','--connectivity-only'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});fs.writeFileSync(path.join(out,'fsck-scan.txt'),r.stdout+'\n'+r.stderr);if(r.status!==0)throw Error('fsck failed');
const objects=[...r.stdout.matchAll(/dangling (blob|commit) ([0-9a-f]{40})/g)].map(m=>({kind:m[1],oid:m[2]})),found=[];
for(const o of objects){for(const target of before){if(found.some(f=>f.file===target.file))continue;const args=o.kind==='blob'?['cat-file','blob',o.oid]:['show',o.oid+':'+target.file],b=cp.spawnSync('git',args,{cwd:root,maxBuffer:16*1024*1024});if(b.status===0&&sha(b.stdout)===target.sha256){const p=path.join(out,'recovered-'+before.indexOf(target)+'.bin');fs.writeFileSync(p,b.stdout);found.push({...target,from:o,backup:p});}}}
fs.writeFileSync(path.join(out,'found.json'),JSON.stringify({objects:objects.length,expected:before,found},null,2));console.log(JSON.stringify({objects:objects.length,found:found.map(f=>({file:f.file,from:f.from}))}));
if(found.length!==before.length)process.exitCode=2;
else{for(const f of found){const b=fs.readFileSync(f.backup);if(sha(b)!==f.sha256)throw Error('backup drift');fs.writeFileSync(path.join(root,f.file),b);}console.log('RESTORED exact original SHA 4/4');}
