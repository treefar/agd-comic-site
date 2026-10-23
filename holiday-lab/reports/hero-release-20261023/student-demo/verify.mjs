// Re-run the bounded source/logic checks; browser acceptance is a separate agent's task.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {selectStudentWorks} from '../../../student-curation.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(dir,'../../../..');
const runtime=['holiday-lab/student-curation.html','holiday-lab/student-curation.css','holiday-lab/student-curation.mjs'];
const hash=p=>createHash('sha256').update(fs.readFileSync(path.join(repo,p))).digest('hex');
const report={schema:1,created:new Date().toISOString(),scope:'Student curation demo: source and pure rules only',public_release:false,original_exhibition_replaced:false,browser_verified:false,checks:[],commands:[],files:Object.fromEntries(runtime.map(p=>[p,hash(p)]))};
for(const args of [['--test','holiday-lab/tests/student-curation.test.mjs'],['--check','holiday-lab/student-curation.mjs']]){const r=spawnSync(process.execPath,args,{cwd:repo,encoding:'utf8'});report.commands.push({command:['node',...args].join(' '),exit:r.status,stdout:r.stdout,stderr:r.stderr});report.checks.push({id:args[0]==='--test'?'source-credits-and-curation-rules':'module-syntax',result:r.status===0?'yes':'no'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');}
const news=JSON.parse(fs.readFileSync(path.join(repo,'data/news.json'))),works=selectStudentWorks(news);report.works=works.map(w=>({title:w.title,rank:w.rank,image:w.image,sha256:hash(w.image),mentor:w.mentor,designers:w.designers}));
try{const html=fs.readFileSync(path.join(repo,runtime[0]),'utf8'),css=fs.readFileSync(path.join(repo,runtime[1]),'utf8'),js=fs.readFileSync(path.join(repo,runtime[2]),'utf8');assert.match(js,/fetch\('\.\.\/data\/news\.json'\)/);assert.match(css,/object-fit:contain/);assert.ok(!/https?:\/\/|<canvas|<svg|<iframe|new Audio|\/assets\//i.test(html+css+js));report.checks.push({id:'direct-source-full-poster-no-new-generated-assets',result:'yes',evidence:'Runtime has direct relative news fetch, contain poster CSS, no remote URL/canvas/svg/iframe/audio/assets references.'});}catch(e){report.checks.push({id:'direct-source-full-poster-no-new-generated-assets',result:'no',error:e.message});}
report.checks.push({id:'final-build-and-browser-acceptance',result:'unknown',reason:'Root owns unified build. Independent agent owns native browser acceptance against that build.'});
fs.writeFileSync(path.join(dir,'checks.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(dir,'stdout.txt'),report.commands.map(c=>`$ ${c.command}\nexit=${c.exit}\n${c.stdout}${c.stderr}`).join('\n')+'\n');
console.log(JSON.stringify({checks:report.checks,report:path.join(dir,'checks.json')},null,2));
if(report.checks.some(c=>c.result==='no'))process.exitCode=1;
