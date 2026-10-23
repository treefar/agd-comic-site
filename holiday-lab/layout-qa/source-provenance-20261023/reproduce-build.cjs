// Runs the unchanged generator only beneath this task's write scope. No server is started.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),P=require('./provenance.cjs');
const root=path.resolve(__dirname,'../../..'),rel=p=>path.relative(root,p).replaceAll('\\','/');
const run=path.join(__dirname,'isolated-'+Date.now()),sandbox=path.join(run,'root');fs.mkdirSync(sandbox,{recursive:true});
const build=fs.readFileSync(path.join(root,'scripts/build.mjs'),'utf8');
const sources=JSON.parse(build.match(/const SOURCES = (\[[^;]+\]);/)[1]);
const names=[...sources,'index.html','scripts/build.mjs','scripts/build-translations.cjs','scripts/build-ja-translations.cjs','holiday-lab/catalog.mjs','package.json','package-lock.json','data','styles.css','holiday-home.css','student-guide.css','faculty-portrait.css','.nojekyll'];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const before=[];
for(const name of names){const source=path.join(root,name);if(!fs.existsSync(source))continue;for(const f of fs.statSync(source).isDirectory()?walk(source):[source])before.push(P.reference(root,rel(f)));fs.mkdirSync(path.dirname(path.join(sandbox,name)),{recursive:true});fs.cpSync(source,path.join(sandbox,name),{recursive:true});}
const args=['scripts/build.mjs','--local-review','--out=out'];
const result=cp.spawnSync(process.execPath,args,{cwd:sandbox,encoding:'utf8',maxBuffer:8e6});
fs.writeFileSync(path.join(run,'build-output.txt'),result.stdout+result.stderr+'\nexit='+result.status+'\n');
const unchanged=before.every(r=>{try{P.verifyRef(root,r);return true;}catch{return false;}});
const outputs=result.status===0?walk(path.join(sandbox,'out')).map(f=>P.reference(root,rel(f))):[];
const comparison=[];
for(const r of outputs.filter(r=>/\/index\.html$|\/app-[^/]+\.js$/.test(r.path))){const file=path.basename(r.path),old=path.join(root,'.measure-integrated-08',file);comparison.push({file,isolated:r,snapshot08:fs.existsSync(old)?P.reference(root,rel(old)):null,equal_snapshot08:fs.existsSync(old)&&P.sha(fs.readFileSync(old))===r.sha256});}
const output={type:'isolated-original-generator-run-v1',at:new Date().toISOString(),command:[process.execPath,...args],cwd:rel(sandbox),exit:result.status,inputs:before,source_inputs_unchanged:unchanged,outputs,comparison,omitted_static_copy:['images/ (no influence on SSR or client generator; full site package is not claimed)','holiday-lab runtime allowlist (build-review.mjs not executed)'],global_approved:false};
fs.writeFileSync(path.join(run,'receipt.json'),JSON.stringify(output,null,2));fs.writeFileSync(path.join(__dirname,'isolated-latest.json'),JSON.stringify({receipt:rel(path.join(run,'receipt.json'))},null,2));
console.log(JSON.stringify({run:rel(run),exit:result.status,source_inputs_unchanged:unchanged,inputs:before.length,outputs:outputs.length,comparison:comparison.map(x=>({file:x.file,equal_snapshot08:x.equal_snapshot08}))},null,2));process.exitCode=result.status||(!unchanged?1:0);
