import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/agywork/agd-site-codex/package.json');
const {chromium}=require('playwright');
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const source=path.join(out,'source');fs.mkdirSync(source,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:source,size:{width:1280,height:720}},reducedMotion:'no-preference'});
const page=await context.newPage(),events=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
const started=performance.now();
await page.goto('http://127.0.0.1:8800/holiday-lab/?game=new-year&lang=zh',{waitUntil:'networkidle'});
await page.locator('.intro').waitFor({state:'visible'});
await page.evaluate(()=>window.scrollTo(0,document.querySelector('.intro-caption').offsetTop-14));
let previous='';
while(performance.now()-started<65000){
 const sample=await page.evaluate(()=>{const img=document.querySelector('.intro-image:not(.previous)'),m=document.querySelector('.marquee');return {caption:document.querySelector('.intro-caption')?.textContent,src:img?.getAttribute('src'),naturalWidth:img?.naturalWidth||0,naturalHeight:img?.naturalHeight||0,marquee:m?getComputedStyle(m).transform:null,menu:!!document.querySelector('#start-game'),muted:document.querySelector('#audio-toggle')?.textContent};});
 sample.seconds=Number(((performance.now()-started)/1000).toFixed(3));
 if(sample.src!==previous&&sample.src){previous=sample.src;assert.ok(sample.naturalWidth>0,'CG must actually load');events.push(sample);await page.screenshot({path:path.join(source,`intro-${events.length}.png`)});console.log(JSON.stringify(sample));}
 if(sample.menu){assert.ok(sample.seconds>=35,'five CG must play at normal speed');events.push({...sample,event:'menu'});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(source,'menu.png')});break;}
 await page.waitForTimeout(250);
}
assert.equal(new Set(events.filter(e=>e.src).map(e=>e.src)).size,5,'exactly five visible CG');
assert.ok(events.some(e=>e.event==='menu'),'menu must follow the complete introduction');
await page.waitForTimeout(1200);
await page.locator('#start-game').click();
await page.locator('#game-stage .sprite').first().waitFor({state:'visible'});
await page.evaluate(()=>window.scrollTo(0,document.querySelector('#game-stage').offsetTop-60));
await page.waitForTimeout(1800);await page.screenshot({path:path.join(source,'game-ui.png')});
events.push({event:'game-ui',seconds:Number(((performance.now()-started)/1000).toFixed(3)),muted:await page.locator('#audio-toggle').textContent()});
assert.equal(errors.length,0,'browser console exceptions');
const video=page.video();await context.close();const videoPath=await video.path();await browser.close();
const evidence={url:'http://127.0.0.1:8800/holiday-lab/?game=new-year&lang=zh',viewport:{width:1280,height:720},automation:true,defaultMuted:true,speed:1,skipped:false,recordedAt:new Date().toISOString(),events,errors,sourceVideo:videoPath,browserCache:path.join(process.env.USERPROFILE,'AppData','Local','ms-playwright')};
fs.writeFileSync(path.join(out,'recording-evidence.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({videoPath,events:events.length,errors}));
