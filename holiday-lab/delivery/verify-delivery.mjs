import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const require=createRequire('C:/agywork/agd-site-codex/package.json'),{chromium}=require('playwright');
const root=path.dirname(fileURLToPath(import.meta.url));
let attempt=1,extracted;
do{extracted=path.join(root,'verification',`unpacked-${String(attempt++).padStart(2,'0')}`);}while(fs.existsSync(extracted));
fs.mkdirSync(path.dirname(extracted),{recursive:true});
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const unpack=spawnSync('powershell',['-NoProfile','-Command',`Expand-Archive -LiteralPath ${quote(path.join(root,'holiday-preview.zip'))} -DestinationPath ${quote(extracted)}`],{encoding:'utf8'});assert.equal(unpack.status,0,unpack.stderr);
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const list=(p,prefix='')=>fs.readdirSync(path.join(p,prefix),{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(p,prefix+e.name+'/'):[prefix+e.name]).sort();
const manifest=JSON.parse(fs.readFileSync(path.join(extracted,'SHA256SUMS.json'),'utf8'));
assert.deepEqual(list(extracted),[...manifest.files.map(f=>f.path),'SHA256SUMS.json'].sort());
for(const file of manifest.files){const p=path.join(extracted,file.path);assert.equal(fs.statSync(p).size,file.bytes,file.path);assert.equal(sha(p),file.sha256,file.path);}
assert.equal(sha(path.join(extracted,'SHA256SUMS.json')),sha(path.join(root,'portable','SHA256SUMS.json')));
assert.ok(!list(extracted).some(p=>/(^|\/)(\.git|work-orders|tests|reports|art-source|audio-source)(\/|$)/.test(p)));
const evidence={zip:{path:'holiday-preview.zip',bytes:fs.statSync(path.join(root,'holiday-preview.zip')).size,sha256:sha(path.join(root,'holiday-preview.zip'))},verifiedFiles:manifest.files.length+1,hashMismatches:0,unexpectedFiles:0,launcherCommand:'Start-Preview.cmd --port=8802 --no-browser',http:[],browser:[]};
const start=spawnSync('cmd.exe',['/d','/c','Start-Preview.cmd','--port=8802','--no-browser'],{cwd:extracted,encoding:'utf8',timeout:15000});evidence.launcherOutput=start.stdout+start.stderr;assert.equal(start.status,0,evidence.launcherOutput);
const server=JSON.parse(fs.readFileSync(path.join(extracted,'preview-server.json'),'utf8'));assert.equal(server.port,8802);evidence.ownServerPid=server.pid;
let browser;
try{
 const ids=['new-year','lunar-new-year','lantern','children','dragon-boat','mid-autumn','teachers','national-day','semester','exhibition'];
 for(const url of ['/','/?lang=zh#/students/guide',...ids.map(id=>`/holiday-lab/games/${id}.mjs`)]){const response=await fetch('http://127.0.0.1:8802'+url),body=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200,url);const rel=url.startsWith('/holiday-lab/games/')?url.slice(1):'index.html';assert.equal(crypto.createHash('sha256').update(body).digest('hex'),sha(path.join(extracted,'site',rel)),url);evidence.http.push({url,status:response.status,bytes:body.length,sha256:crypto.createHash('sha256').update(body).digest('hex')});}
 browser=await chromium.launch({headless:true});const page=await browser.newPage();
 for(const lang of ['zh','en','ja']){await page.goto(`http://127.0.0.1:8802/?lang=${lang}#/students/guide`,{waitUntil:'networkidle'});await page.locator('#student-guide-title').waitFor({state:'visible'});const headings=await page.locator('h1,h2').allTextContents();assert.ok(headings.some(s=>/在校指南|Student Guide|在学生ガイド/i.test(s)),headings.join(' / '));console.log('Student guide rendered: '+lang);evidence.browser.push({route:'student-guide',lang,headings:headings.slice(0,4)});}
 await page.goto('http://127.0.0.1:8802/holiday-lab/',{waitUntil:'networkidle'});assert.equal(await page.locator('[id^="open-"]').count(),10);evidence.browser.push({route:'holiday-lab',cards:10});
}finally{if(browser)await browser.close();process.kill(server.pid);}
await new Promise(r=>setTimeout(r,250));let stopped=false;try{await fetch('http://127.0.0.1:8802/');}catch{stopped=true;}assert.ok(stopped,'own package server must stop');evidence.ownServerStopped=true;
fs.writeFileSync(path.join(root,'delivery-verification.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
