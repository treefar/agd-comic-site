import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {args,list,sha,writeJSON,psquote,verifyTree} from './common.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),opt=args();
if(!opt.package)throw Error('Usage: node verify-delivery.mjs --package <PREPARE_OUTPUT> [--port=8822]');
const out=fs.realpathSync(path.resolve(opt.package)),port=Number(opt.port||8822);
assert.ok(out.startsWith(root+path.sep),'Package output must be in delivery-v2');
assert.ok(![8800,8785,8797].includes(port),'Do not use existing review ports');
const base=`http://127.0.0.1:${port}/`,summary=JSON.parse(fs.readFileSync(path.join(out,'package-summary.json'),'utf8'));
const zip=path.join(out,'holiday-preview-v2.zip');assert.equal(sha(zip),summary.zipSHA256);
let n=1,unpacked;do{unpacked=path.join(out,'verification',`unpacked-${String(n++).padStart(2,'0')}`)}while(fs.existsSync(unpacked));fs.mkdirSync(path.dirname(unpacked),{recursive:true});
const expanded=spawnSync('powershell.exe',['-NoProfile','-Command',`$ErrorActionPreference='Stop'; Expand-Archive -LiteralPath ${psquote(zip)} -DestinationPath ${psquote(unpacked)}`],{encoding:'utf8',windowsHide:true,timeout:180000});
assert.equal(expanded.status,0,expanded.stderr);
const manifest=JSON.parse(fs.readFileSync(path.join(unpacked,'SHA256SUMS.json'),'utf8'));
assert.equal(sha(path.join(unpacked,'SHA256SUMS.json')),sha(path.join(out,'portable','SHA256SUMS.json')));
const verifiedFiles=verifyTree(unpacked,manifest);
assert.equal(manifest.gameIDs.length,15);
assert.ok(!list(unpacked).some(p=>/(^|\/)(\.git|node_modules|tests|reports|art-source|audio-source|redesign|Library|Unity)(\/|$)/i.test(p)));
const cmd=path.join(process.env.SystemRoot||'C:/Windows','System32','cmd.exe');
const run=(name,extra=[],env=process.env)=>spawnSync(cmd,['/d','/c',name,...extra],{cwd:unpacked,encoding:'utf8',timeout:20000,windowsHide:true,env});
const evidence={checkedAt:new Date().toISOString(),zip:{path:zip,bytes:fs.statSync(zip).size,sha256:sha(zip)},sourceSnapshot:manifest.sourceSnapshot,verifiedFiles,hashMismatches:0,unexpectedFiles:0,port,unpacked,http:[],browser:[],launcher:{}};
const missing=run('Start-Preview.cmd',['--no-browser'],{...process.env,PATH:path.join(process.env.SystemRoot||'C:/Windows','System32')});
assert.equal(missing.status,1,missing.stdout+missing.stderr);assert.match(missing.stdout,/Node.js 18 or later is required/);evidence.launcher.missingNode={exit:missing.status,output:missing.stdout+missing.stderr};
for(const f of ['Start-Preview.cmd','Stop-Preview.cmd','Verify-Files.cmd']){assert.ok([...fs.readFileSync(path.join(unpacked,f))].every(x=>x<128));}
const start=run('Start-Preview.cmd',[`--port=${port}`,'--no-browser']);assert.equal(start.status,0,start.stdout+start.stderr);evidence.launcher.start=start.stdout+start.stderr;
const state=JSON.parse(fs.readFileSync(path.join(unpacked,'preview-server.json'),'utf8'));assert.equal(state.port,port);assert.equal(state.packageID,manifest.packageID);evidence.ownServerPid=state.pid;
let browser,foreign;
try{
  const repeat=run('Start-Preview.cmd',[`--port=${port}`,'--no-browser']);assert.equal(repeat.status,0,repeat.stdout+repeat.stderr);assert.match(repeat.stdout,/REUSED/);assert.equal(JSON.parse(fs.readFileSync(path.join(unpacked,'preview-server.json'),'utf8')).pid,state.pid);evidence.launcher.repeat=repeat.stdout+repeat.stderr;
  const verify=run('Verify-Files.cmd');assert.equal(verify.status,0,verify.stdout+verify.stderr);evidence.launcher.hashCheck=verify.stdout+verify.stderr;
  foreign=http.createServer((req,res)=>res.end('unrelated test server'));await new Promise((resolve,reject)=>{foreign.once('error',reject);foreign.listen(0,'127.0.0.1',resolve)});const foreignPort=foreign.address().port;
  const collision=run('Start-Preview.cmd',[`--port=${foreignPort}`,'--no-browser']);assert.equal(collision.status,1,collision.stdout+collision.stderr);assert.match(collision.stderr,/in use by another service/);assert.equal(await (await fetch(`http://127.0.0.1:${foreignPort}/`)).text(),'unrelated test server');evidence.launcher.occupiedPort={port:foreignPort,exit:collision.status,output:collision.stdout+collision.stderr,foreignServerPreserved:true};await new Promise(r=>foreign.close(r));foreign=null;
  const queue=[...manifest.sourceManifest];async function worker(){while(queue.length){const f=queue.shift(),url=base+f.path.split('/').map(encodeURIComponent).join('/');const r=await fetch(url);assert.equal(r.status,200,f.path);const body=Buffer.from(await r.arrayBuffer()),hash=crypto.createHash('sha256').update(body).digest('hex');assert.equal(hash,f.sha256,f.path);evidence.http.push({path:f.path,status:r.status,bytes:body.length,sha256:hash});}}await Promise.all(Array.from({length:6},worker));evidence.http.sort((a,b)=>a.path.localeCompare(b.path));
  const deps=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));const {chromium}=deps('playwright');browser=await chromium.launch({headless:true});
  const guideSource=JSON.parse(fs.readFileSync(path.join(unpacked,'site/data/students/guide.json'),'utf8'));const expectedCards=guideSource.cards.length,expectedDetails=guideSource.cards.reduce((n,c)=>n+c.step_details.length,0);
  for(const lang of ['zh','en','ja'])for(const width of [390,768,1440]){
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+`?lang=${lang}#/students/guide`,{waitUntil:'networkidle'});await page.locator('#student-guide-title').waitFor({state:'visible'});
    const heading=await page.locator('#student-guide-title').innerText();assert.match(heading,/在校指南|Student Guide|在学生ガイド/);assert.equal(await page.locator('.sg-card').count(),expectedCards);for(const detail of await page.locator('.sg-card-detail').all()){await detail.locator(':scope > summary').click();assert.equal(await detail.getAttribute('open'),'');}assert.equal(await page.locator('[data-step-detail]:visible').count(),expectedDetails);assert.equal(await page.locator('.sg-identities button').count(),6);
    const layout=await page.locator('.sg-card-grid').evaluate(e=>({columns:getComputedStyle(e).gridTemplateColumns.split(' ').length,viewport:innerWidth,width:document.documentElement.scrollWidth}));assert.equal(layout.columns,width===1440?3:width===768?2:1);assert.equal(layout.width,width);
    const detail=page.locator('.sg-card-detail').first();assert.equal(await detail.getAttribute('open'),'');assert.ok(await detail.locator('[data-step-detail]').first().isVisible());assert.deepEqual(errors,[]);evidence.browser.push({route:'student-guide',lang,width,heading,cards:expectedCards,stepDetails:expectedDetails,identityButtons:6,...layout,detailsVisible:true,errors});
    await page.screenshot({path:path.join(out,'verification',`guide-${lang}-${width}.png`),fullPage:false});await page.close();
  }
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'holiday-lab/',{waitUntil:'networkidle'});await page.locator('[id^="open-"]').first().waitFor();assert.equal(await page.locator('[id^="open-"]').count(),15);for(const id of manifest.gameIDs)assert.equal(await page.locator('#open-'+id).count(),1);assert.deepEqual(errors,[]);evidence.browser.push({route:'holiday-lab',cards:15,ids:manifest.gameIDs,errors});await page.close();
}finally{
  if(browser)await browser.close();if(foreign)await new Promise(r=>foreign.close(r));
  const stopped=run('Stop-Preview.cmd');evidence.launcher.stop=stopped.stdout+stopped.stderr;
  if(stopped.status!==0)throw Error('Failed to stop own package server: '+evidence.launcher.stop);
}
await new Promise(r=>setTimeout(r,300));let stopped=false;try{await fetch(base,{signal:AbortSignal.timeout(1000)})}catch{stopped=true}assert.ok(stopped);evidence.ownServerStopped=true;writeJSON(path.join(out,'delivery-verification.json'),evidence);
console.log(`PASS ZIP extraction ${verifiedFiles} files; SHA mismatches=0; unexpected files=0`);
console.log(`PASS HTTP200 + body SHA256 for all ${evidence.http.length} runtime files`);
console.log('PASS 15 game entries; three-language guide at desktop/tablet/mobile; identity tags; full details');
console.log('PASS CMD start/reuse/ASCII/missing-Node/foreign-port/stop; no Unity; own server stopped');
console.log('ZIP SHA256 '+evidence.zip.sha256);
