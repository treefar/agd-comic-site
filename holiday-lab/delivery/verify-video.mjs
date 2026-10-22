import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire('C:/agywork/agd-site-codex/package.json'),{chromium}=require('playwright');
const root=path.dirname(fileURLToPath(import.meta.url));const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto(pathToFileURL(path.join(root,'preview.html')).href);
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
 const metadata=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,muted:v.muted,error:v.error?.message||null}));
 assert.ok(metadata.duration>=35&&metadata.duration<60);assert.equal(metadata.width,1280);assert.equal(metadata.height,720);assert.equal(metadata.error,null);assert.equal(metadata.muted,true);
 await page.locator('video').evaluate(v=>new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=10;}));
 await page.locator('video').evaluate(v=>v.play());await page.waitForTimeout(550);
 const currentTime=await page.locator('video').evaluate(v=>{v.pause();return v.currentTime;});assert.ok(currentTime>10.2,'offline video playback must actually advance');
 await page.screenshot({path:path.join(root,'source','offline-player.png'),fullPage:false});
 const evidence={offlineFilePlayback:true,metadata,seekedTo:10,advancedTo:currentTime,autoRecorded:true,disclosure:'自動操作錄製／預設靜音',checkedAt:new Date().toISOString()};
 fs.writeFileSync(path.join(root,'player-verification.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
}finally{await browser.close();}
