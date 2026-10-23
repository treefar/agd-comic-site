// Functional module receipts only. A match is not a whole-bundle/layout approval.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const receiptCache=new Map();
function loadCurrent(root,file){const p=path.join(root,file),st=fs.statSync(p),key=p+'|'+st.mtimeMs+'|'+st.size;if(!receiptCache.has(key)){receiptCache.clear();receiptCache.set(key,JSON.parse(fs.readFileSync(p,'utf8')));}return receiptCache.get(key);}
module.exports=function proof(root,id){
 const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,`holiday-lab/games/${id}.mjs`))).digest('hex');
 const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const policy=load('holiday-lab/dashboard/progress-policy.json');
 if(policy.ui_polish_receipt){
  const current=loadCurrent(root,policy.ui_polish_receipt),cases=current.cases.filter(c=>c.id===id),files=['runner.mjs','lab.css','catalog.mjs','replay-model.mjs','games/'+id+'.mjs'];
  const matching=files.every(f=>current.sources.before[f]===current.sources.after[f]&&current.sources.before[f]===crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'holiday-lab',f))).digest('hex'));
  if(matching&&current.status==='pass'&&cases.length===6&&new Set(cases.map(c=>c.lang+'/'+c.width)).size===6&&cases.every(c=>c.status==='pass'&&c.errors.length===0&&c.issueCount===0&&c.orphanCount===0))return policy.ui_polish_receipt;
 }
 const q=load('holiday-lab/qa/playthrough.json');
 for(const r of [...(q.previousRuns||[]),q].reverse())if(r.servedSourceSha256?.[`games/${id}.mjs`]===sha&&r.cases.some(c=>c.game===id&&c.lang==='zh'&&c.width===1440&&c.status==='pass'))return 'holiday-lab/qa/playthrough.json';
 for(const folder of ['new-year-choice','lunar-expression','semester-tasks']){
  const dir=`holiday-lab/reports/${folder}`;
  for(const name of fs.readdirSync(path.join(root,dir)).filter(n=>n.startsWith('integration-')).sort().reverse()){
   const file=`${dir}/${name}/playthrough.json`;if(!fs.existsSync(path.join(root,file)))continue;const r=load(file);
   if(r.status==='pass'&&r.servedSourceSha256?.[`games/${id}.mjs`]===sha&&r.cases.some(c=>c.game===id&&c.lang==='zh'&&c.width===1440&&c.status==='pass'))return file;
  }
 }
 for(const name of fs.readdirSync(path.join(root,'holiday-lab/extra-qa/runs')).sort().reverse()){
  const file=`holiday-lab/extra-qa/runs/${name}/results.json`;if(!fs.existsSync(path.join(root,file)))continue;const r=load(file);
  // Each module case has its own complete assertions. Other failed cases in the
  // same historical run do not become pass, and no whole-run claim is made here.
  if(r.receipts?.before?.[`games/${id}.mjs`]===sha&&r.receipts?.after?.[`games/${id}.mjs`]===sha&&r.cases.some(c=>c.game===id&&c.lang==='zh'&&c.width===1440&&c.status==='pass'&&c.checks.completedFromDOM==='yes'&&c.checks.replayThreeShots==='yes'&&c.checks.retryFresh==='yes'))return file;
 }
 return null;
};
