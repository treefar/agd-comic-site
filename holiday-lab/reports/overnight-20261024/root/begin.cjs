const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'), original='C:/Projects/系網漫畫版_AGDComicSite';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(dir,...args)=>{const r=cp.spawnSync('git',['-c','core.longpaths=true','-C',dir,...args],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout;};
const files={
 'holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md':'6722a0cdb1798daf25dbfff950103c633d17bfafebdf8858c4743ef3492d5f9d',
 'holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md':'02b74b6bae38cab26f17d6e085dd840c033990fc346d29020e9d394265389e5d',
 'holiday-lab/layout-qa/phase-latest.json':'f6762b3b724f9e7890def79ed876b4c34e1037528d7ec9e2d5863fa5fee5f593',
 'holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md':'914e505961a0f653cd16d842cc9b7c65bcac664544dd4dc7f895c5abd8e64edb',
 'holiday-lab/layout-qa/layout-report.json':'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336'};
for(const[f,h]of Object.entries(files))assert.equal(sha(fs.readFileSync(path.join(root,f))),h,f);
const section=s=>{const p=s.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(p>=0);const t=s.slice(p),n=t.slice(1).search(/\r?\n## /);return n<0?t:t.slice(0,n+1);};
const instructions=['C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md','C:/Projects/系網漫畫版_AGDComicSite/work-orders/20261024/AFTER-0100.md',path.join(root,'holiday-lab/STATUS.md')].map(f=>{const b=fs.readFileSync(f);return{file:f,bytes:b.length,lines:b.toString().split('\n').length,sha256:sha(b)};});
const c=section(fs.readFileSync(path.join(original,'LATEST_HANDOFF.md'),'utf8'));assert.equal(sha(c),'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');
const snapshot={observed_utc:new Date().toISOString(),root,original,instructions,protected_files:files,c_sha256:sha(c),branches:[root,original].map(dir=>({dir,branch:git(dir,'branch','--show-current').trim(),head:git(dir,'rev-parse','HEAD').trim(),main_refs:git(dir,'for-each-ref','--format=%(refname) %(objectname)','refs/heads/main','refs/remotes/origin/main').trim()})),source_before:{}};
const sourceFiles=['index.html','scripts/serve-local-review.cjs','scripts/serve-local-review.test.cjs','holiday-home.jsx','holiday-home.css','app.jsx','pages.jsx','styles.css','data/admission.json','data/en/admission.json','data/ja/messages.json','data/students/guide.json'];
for(const f of sourceFiles){const b=fs.readFileSync(path.join(root,f));snapshot.source_before[f]=sha(b);const dst=path.join(__dirname,'before',f);fs.mkdirSync(path.dirname(dst),{recursive:true});if(fs.existsSync(dst))assert.equal(sha(fs.readFileSync(dst)),sha(b));else fs.writeFileSync(dst,b,{flag:'wx'});}
fs.writeFileSync(path.join(__dirname,'before.json'),JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({protected_files:Object.keys(files).length,c_unchanged:true,branches:snapshot.branches,instructions,source_snapshots:sourceFiles.length},null,2));
