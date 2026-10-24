const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const proposal='holiday-lab/reports/goal-audit-20261024/translation-review.json';
const changes=JSON.parse(fs.readFileSync(path.join(repo,proposal))).proposed_changes;
if(changes.length!==4||new Set(changes.map(x=>x.key)).size!==2)throw Error('Expected2keys4values');
const sources=[];
for(const file of ['data/en/flow-ui.json','data/ja/flow-ui.json']){
 const raw=fs.readFileSync(path.join(repo,file)),map=JSON.parse(raw),owned=changes.filter(x=>x.file===file);
 for(const op of owned)if(map[op.key]!==op.before)throw Error('Baseline before guard failed:'+file);
 const snapshot=path.basename(path.dirname(file))+'-before.json';
 fs.writeFileSync(path.join(d,snapshot),raw,{flag:'wx'});
 sources.push({file,snapshot,sha256:sha(raw),key_count:Object.keys(map).length,proposed_value_changes:owned.length});
}
const m={created_at:new Date().toISOString(),proposal,proposal_sha256:sha(fs.readFileSync(path.join(repo,proposal))),sources,changes};
fs.writeFileSync(path.join(d,'baseline.json'),JSON.stringify(m,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({snapshots:sources,changes:4,keys:2},null,2));
