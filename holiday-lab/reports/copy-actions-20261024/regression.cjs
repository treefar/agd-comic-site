// Semantic regression for approved copy; never changes product files.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../..'),phase=process.argv[2];
if(!['red','green'].includes(phase))throw Error('Use red or green');
const baseline=JSON.parse(fs.readFileSync(path.join(d,'baseline.json'))),checks=[];
const check=(name,yes,detail)=>checks.push({name,answer:yes?'yes':'no',detail});
const maps={};const fileStates=[];
for(const s of baseline.sources){
 const before=JSON.parse(fs.readFileSync(path.join(d,s.snapshot))),raw=fs.readFileSync(path.join(repo,s.file)),now=JSON.parse(raw),own=baseline.changes.filter(x=>x.file===s.file),keys=new Set(own.map(x=>x.key));
 maps[s.file]=now;
 const changed=Object.keys(now).filter(k=>now[k]!==before[k]);
 check(s.file+' key order and identities retained',JSON.stringify(Object.keys(before))===JSON.stringify(Object.keys(now)),{before:Object.keys(before).length,after:Object.keys(now).length});
 check(s.file+' all other mappings unchanged',Object.keys(before).filter(k=>!keys.has(k)).every(k=>before[k]===now[k]),Object.keys(before).length-keys.size);
 check(s.file+' exactly2 approved values changed',changed.length===2&&changed.every(k=>keys.has(k)),changed);
 for(const op of own){
  check(s.file+' approved change exact',now[op.key]===op.after,{key:op.key});
  check(s.file+' no new date or numeric condition',(now[op.key].match(/\d+/g)||[]).join('|')===(op.before.match(/\d+/g)||[]).join('|'),{key:op.key});
 }
 fileStates.push({file:s.file,sha256:crypto.createHash('sha256').update(raw).digest('hex'),changed_keys:changed});
}
const placement=baseline.changes.find(x=>x.key.includes('分級免修')).key,ret=baseline.changes.find(x=>x.key.includes('返校報到')).key;
check('EN exemption applies to course based on placement',/placement-based course exemptions/.test(maps['data/en/flow-ui.json'][placement])&&!/placement exemptions/.test(maps['data/en/flow-ui.json'][placement]),maps['data/en/flow-ui.json'][placement]);
check('JA exemption applies to course based on level determination',/習熟度判定に基づく履修免除/.test(maps['data/ja/flow-ui.json'][placement])&&!/クラス分け免除/.test(maps['data/ja/flow-ui.json'][placement]),maps['data/ja/flow-ui.json'][placement]);
check('EN return procedure and submissions both retained',/report back to the university/.test(maps['data/en/flow-ui.json'][ret])&&/submit the required outcomes/.test(maps['data/en/flow-ui.json'][ret])&&/as specified by the project/.test(maps['data/en/flow-ui.json'][ret]),maps['data/en/flow-ui.json'][ret]);
check('JA return procedure and submissions both retained',/計画に従って帰校手続きと成果提出/.test(maps['data/ja/flow-ui.json'][ret]),maps['data/ja/flow-ui.json'][ret]);
const result={phase,at:new Date().toISOString(),checks,yes:checks.filter(x=>x.answer==='yes').length,no:checks.filter(x=>x.answer==='no').length,fileStates};
const fixed=path.join(d,phase+'-result.json');
const output=fs.existsSync(fixed)?path.join(d,phase+'-result-'+Date.now()+'.json'):fixed;
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));process.exitCode=result.no?1:0;
