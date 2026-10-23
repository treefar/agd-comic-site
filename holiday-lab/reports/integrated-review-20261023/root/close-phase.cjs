// Phase receipts only. No product rebuild, publication or historical QA mutation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const dir=__dirname,root=path.resolve(dir,'../../../..');process.chdir(root);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(name,args,env={}){const r=cp.spawnSync(process.execPath,args,{cwd:root,env:{...process.env,...env},encoding:'utf8',maxBuffer:16*1024*1024});const receipt={at:new Date().toISOString(),cwd:root,command:[process.execPath,...args],env,exit_code:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?.message};fs.writeFileSync(path.join(dir,name+'-command.json'),JSON.stringify(receipt,null,2));console.log(name,r.status,r.stdout.slice(-1800),r.stderr.slice(-600));if(r.status!==0)throw Error(name+' failed');return r;}
if(process.argv[2]==='proof'){
 run('guide-readonly',['holiday-lab/reports/integrated-review-20261023/guide-independent/verify.cjs','holiday-lab/reports/integrated-review-20261023/guide-independent/runs/2026-10-23T11-02-24-863Z']);
 const a='holiday-lab/reports/guide-capstone-study-research-20261023',b='holiday-lab/reports/guide-internship-research-20261023';
 const v=JSON.parse(fs.readFileSync(b+'/RECHECK.json'));run('internship-readonly',['-e',v.script]);
 const draft=JSON.parse(fs.readFileSync(a+'/draft.json')),iv=JSON.parse(fs.readFileSync(b+'/verification.json'));
 const structures=iv.checks.filter(c=>c.id.startsWith('student_structure_'));
 assert.equal(structures.length,3);assert.ok(structures.every(c=>c.status==='yes'));
 const rows=[...draft.topics.map(t=>({title:t.title,steps:t.steps.length,faq:t.faq.length})),...structures.map(c=>({title:c.id.slice('student_structure_'.length),steps:c.evidence.steps,faq:c.evidence.faq}))];
 const files=[a+'/REPORT.md',a+'/draft.json',a+'/verification.json',a+'/source-catalog.json',b+'/REPORT.md',b+'/sources.json',b+'/verification.json',b+'/RECHECK.json'];
 const packet={at:new Date().toISOString(),scope:'Five supplementary topic drafts; source/structure checks only, not current policy approval',topics:rows,inputs:files.map(file=>{const b=fs.readFileSync(file);return{file,bytes:b.length,sha256:sha(b)}}),product_written:false,current_complete_regulations_verified:false,public_release:false};
 fs.writeFileSync(path.join(dir,'additional-guide-research.json'),JSON.stringify(packet,null,2));
}
if(process.argv[2]==='dashboard'){
 run('dashboard-build',['holiday-lab/build-dashboard.mjs']);
 run('phase-regression',['--test','holiday-lab/dashboard/progress-adapter.test.cjs','holiday-lab/dashboard/ui-authority.test.cjs','holiday-lab/reports/integrated-review-20261023/root/verify-recovery.test.cjs']);
 run('dashboard-smoke',['holiday-lab/dashboard/smoke.cjs'],{DASHBOARD_QA_URL:'http://127.0.0.1:8866'});
}
