/* Independent runtime QA. Reads the served review only; writes this QA directory only. */
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const {createHash}=require('node:crypto');
const bundled=createRequire(process.env.CODEX_QA_NODE_PACKAGE||'C:/Users/treef/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=bundled('playwright'),sharp=bundled('sharp');
const BASE=(process.argv.find(x=>x.startsWith('--base='))||'--base=http://127.0.0.1:8800').slice(7).replace(/\/$/,'');
const OUT=__dirname,SHOT=path.join(OUT,'screenshots');fs.mkdirSync(SHOT,{recursive:true});
const run={started_at:new Date().toISOString(),base:BASE,scope:'Independent homepage and shared shell; no gameplay pass substituted',checks:[],errors:[],screenshots:[]};
const only=(process.argv.find(x=>x.startsWith('--only='))||'').slice(7).split(',').filter(Boolean);
run.only=only;run.command=`node holiday-lab/qa/shell.cjs ${process.argv.slice(2).join(' ')}`.trim();
const runTag=run.started_at.replace(/[^0-9]/g,'');
run.script_sha256=createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
const ids=['new-year','lunar-new-year','lantern','children','dragon-boat','mid-autumn','teachers','national-day','semester','exhibition'];
let browser;
const ok=(condition,message)=>{if(!condition)throw Error(message);};
async function check(name,fn){if(only.length&&!only.some(prefix=>name.startsWith(prefix)))return;try{const evidence=await fn();run.checks.push({name,pass:true,evidence});console.log(`YES ${name}: ${JSON.stringify(evidence)}`);}catch(e){run.checks.push({name,pass:false,error:e.message});console.log(`NO ${name}: ${e.message}`);}}
function instrument(){
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 const records=new Map();window.__shellQA={records,audios:[]};
 const key=(target,type)=>target===document?`document:${type}`:target===window?`window:${type}`:null;
 EventTarget.prototype.addEventListener=function(type,listener,options){const k=key(this,type);if(k){if(!records.has(k))records.set(k,new Set());records.get(k).add(listener);}return add.call(this,type,listener,options);};
 EventTarget.prototype.removeEventListener=function(type,listener,options){const k=key(this,type);if(k)records.get(k)?.delete(listener);return remove.call(this,type,listener,options);};
 const Native=window.Audio;function Tracked(...args){const a=new Native(...args);window.__shellQA.audios.push(a);return a;}Tracked.prototype=Native.prototype;Object.setPrototypeOf(Tracked,Native);window.Audio=Tracked;
}
async function context(options={}){const c=await browser.newContext({viewport:{width:1440,height:1000},...options});c.setDefaultTimeout(10000);await c.addInitScript(instrument);return c;}
function observe(page){const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(BASE))errors.push(`${r.status()} ${r.url()}`);});return {requests,errors};}
async function navigate(page,url){await page.goto(url,{waitUntil:'networkidle'});await page.locator('#lab, #festival-start, #student-guide').first().waitFor();}
async function imageReady(page,selector){await page.locator(selector).evaluateAll(async nodes=>{await Promise.all(nodes.map(n=>{if(n.loading==='lazy')n.loading='eager';return n.decode();}));});}
async function snap(page,label){const file=`${runTag}-${label}.webp`;await sharp(await page.screenshot({fullPage:false})).webp({quality:83}).toFile(path.join(SHOT,file));run.screenshots.push(file);return file;}
async function auditLayout(page){return page.evaluate(()=>{
 const issues=[],vw=document.documentElement.clientWidth;
 if(document.documentElement.scrollWidth>vw+1)issues.push({kind:'horizontal-overflow',scrollWidth:document.documentElement.scrollWidth,viewport:vw});
 const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
 for(const e of document.querySelectorAll('button')){
  if(!visible(e))continue;const b=e.getBoundingClientRect(),style=getComputedStyle(e),range=document.createRange();range.selectNodeContents(e);
  for(const r of range.getClientRects())if(r.width>0&&r.height>0&&(r.left<b.left+4||r.right>b.right-4||r.top<b.top+4||r.bottom>b.bottom-4))issues.push({kind:'button-text-safe-area',id:e.id,text:e.textContent.slice(0,60),button:[b.x,b.y,b.width,b.height],text:[r.x,r.y,r.width,r.height]});
  if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)issues.push({kind:'button-content-overflow',id:e.id});
  if(parseFloat(style.fontSize)<13)issues.push({kind:'small-button-text',id:e.id,font:style.fontSize});
 }
 for(const e of document.querySelectorAll('#lab p,#lab h1,#lab h2,#lab label')){if(!visible(e))continue;const s=getComputedStyle(e);if(['hidden','clip'].includes(s.overflowY)&&e.scrollHeight>e.clientHeight+2)issues.push({kind:'clipped-copy',id:e.id,text:e.textContent.slice(0,60)});}
 return {viewport:vw,issues};
});}
// Pixel audit mirrors text_on_border_audit.py thresholds. Temporary DOM styling is removed immediately.
async function auditButtonPixels(page){
 const rects=await page.evaluate(()=>{
  const out=[];
  for(const e of document.querySelectorAll('button,#game-hint,.marquee')){
   const bounds=e.getBoundingClientRect();if(!bounds.width||!bounds.height||bounds.bottom<0||bounds.top>innerHeight)continue;
   const cs=getComputedStyle(e),foreground=(cs.color.match(/[\d.]+/g)||[]).slice(0,3).map(Number),large=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&Number(cs.fontWeight)>=700);
   const clips=[];for(let a=e;a&&a!==document.documentElement;a=a.parentElement){const s=getComputedStyle(a);if(s.overflow!=='visible'||s.overflowX!=='visible'||s.overflowY!=='visible')clips.push(a.getBoundingClientRect());}
   const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
   for(let n;(n=walker.nextNode());){
    if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);
    for(const box of range.getClientRects()){
     let left=box.left,top=box.top,right=box.right,bottom=box.bottom;
     for(const c of clips){left=Math.max(left,c.left);top=Math.max(top,c.top);right=Math.min(right,c.right);bottom=Math.min(bottom,c.bottom);}
     if(right-left<=2||bottom-top<=2)continue;
     out.push({id:e.id||e.className,text:n.textContent.trim().slice(0,35),x:left,y:top,w:right-left,h:bottom-top,foreground,contrastMinimum:large?3:4.5});
    }
   }
  }
  return out;
 });
 const hide=await page.addStyleTag({content:'button,button *,#game-hint,.marquee,.marquee *{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important}'});
 let shot;try{shot=await page.screenshot();}finally{await hide.evaluate(e=>e.remove());}
 const {data,info}=await sharp(shot).removeAlpha().raw().toBuffer({resolveWithObject:true}),issues=[],contrasts=[];
 const luminance=rgb=>rgb.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 for(const r of rects){const x0=Math.max(0,Math.floor(r.x)-2),y0=Math.max(0,Math.floor(r.y)-2),x1=Math.min(info.width,Math.floor(r.x+r.w)+2),y1=Math.min(info.height,Math.floor(r.y+r.h)+2);if(x1<=x0||y1<=y0)continue;const rgb=[[],[],[]];for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const o=(y*info.width+x)*3;for(let k=0;k<3;k++)rgb[k].push(data[o+k]);}const median=rgb.map(a=>a.sort((a,b)=>a-b)[Math.floor(a.length/2)]),a=luminance(r.foreground),b=luminance(median),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);contrasts.push({id:r.id,ratio:Number(contrast.toFixed(2)),minimum:r.contrastMinimum});if(contrast<r.contrastMinimum)issues.push({...r,contrast:Number(contrast.toFixed(2)),kind:'low-median-contrast'});let different=0,total=(x1-x0)*(y1-y0);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const o=(y*info.width+x)*3;if(Math.abs(data[o]-median[0])+Math.abs(data[o+1]-median[1])+Math.abs(data[o+2]-median[2])>48)different++;}const ratio=different/total;if(different>=6&&ratio>.004)issues.push({...r,ratio:Number(ratio.toFixed(4)),medianContrast:Number(contrast.toFixed(2)),kind:'text-over-artwork'});}
 return {rectangles:rects.length,contrasts,issues};
}
async function menu(page,game='new-year',lang='zh'){await navigate(page,`${BASE}/holiday-lab/?lang=${lang}&game=${game}`);await page.locator('#intro-skip').click();await page.locator('#start-game').waitFor();}
async function game(page,id='new-year',lang='zh'){await menu(page,id,lang);await page.locator('#start-game').click();await page.locator('#game-controls button').first().waitFor();await page.locator('.sprite').first().waitFor();await imageReady(page,'#game-stage img');}
async function homeChecks(){
 for(const lang of ['zh','en','ja'])await check(`homepage-${lang}`,async()=>{
  const c=await context(),p=await c.newPage(),seen=observe(p);
  try{await navigate(p,`${BASE}/?lang=${lang}#hero`);const sections=await p.locator('#hero,#news,#about,#works,#faculty,#labs,#join,#contact').evaluateAll(es=>es.map(e=>e.id));ok(sections.length===8,`Missing homepage sections: ${sections}`);ok(await p.locator('#festival-select option').count()===10,'Expected ten prototype choices');ok(await p.locator('iframe').count()===0,'Iframe loaded before click');const eager=seen.requests.filter(x=>/\/games\/[^/]+\.mjs|\/audio\//.test(x));ok(!eager.length,`Eager game/audio requests ${eager}`);
   const initialListeners=await p.evaluate(()=>Object.fromEntries([...window.__shellQA.records].map(([k,v])=>[k,v.size])));
   for(let i=0;i<4;i++){await p.locator('#festival-start').click();const frame=p.frameLocator('.festival-modal iframe');await frame.locator('#intro-skip').waitFor();await p.locator('.festival-close').click();await p.locator('.festival-modal iframe').waitFor({state:'detached'});await p.waitForFunction(()=>document.activeElement?.id==='festival-start');}
   const finalListeners=await p.evaluate(()=>Object.fromEntries([...window.__shellQA.records].map(([k,v])=>[k,v.size])));ok((initialListeners['document:keydown']||0)===(finalListeners['document:keydown']||0),`Key listeners grew: ${JSON.stringify({initialListeners,finalListeners})}`);
   await snap(p,`homepage-${lang}`);await navigate(p,`${BASE}/?lang=${lang}#/students/guide`);await p.locator('[data-guide-card]').first().waitFor();const cards=await p.locator('[data-guide-card]').count(),details=await p.locator('[data-step-detail]').count();ok(cards===15&&details===47,`Guide data changed: ${cards} cards ${details} details`);ok(!seen.errors.length,seen.errors.join('; '));return {sections,guide:{cards,details},lazy:eager.length,open_close_cycles:4,focus_restored:true,listeners:{initialListeners,finalListeners},consoleErrors:seen.errors};
  }finally{await c.close();}
 });
}
async function iframeEscapeChecks(){await check('iframe-escape-and-focus',async()=>{
 const c=await context(),p=await c.newPage();try{await navigate(p,`${BASE}/?lang=zh#hero`);await p.locator('#festival-start').click();await p.frameLocator('.festival-modal iframe').locator('#intro-skip').waitFor();await p.frameLocator('.festival-modal iframe').locator('.intro').focus();await p.keyboard.press('Escape');await p.locator('.festival-modal iframe').waitFor({state:'detached',timeout:1500});await p.waitForFunction(()=>document.activeElement?.id==='festival-start');return {iframeEscape:true,focusRestored:true};}finally{await c.close();}
});}
async function guideChecks(){for(const lang of ['zh','en','ja'])await check(`guide-preservation-${lang}`,async()=>{
 const c=await context(),p=await c.newPage(),seen=observe(p);try{await navigate(p,`${BASE}/?lang=${lang}#/students/guide`);await p.locator('[data-guide-card]').first().waitFor();const counts={cards:await p.locator('[data-guide-card]').count(),details:await p.locator('[data-step-detail]').count(),faq:await p.locator('.sg-faq-item').count(),sources:await p.locator('.sg-sources').count()};ok(counts.cards===15&&counts.details===47&&counts.faq===30&&counts.sources===15,`Guide content changed: ${JSON.stringify(counts)}`);await p.locator('.sg-faq-item summary').first().click();ok(await p.locator('.sg-faq-item[open] .sg-faq-answer').first().isVisible(),'FAQ answer does not expand');ok(!seen.errors.length,seen.errors.join('; '));return {...counts,faqExpanded:true,consoleErrors:seen.errors};}finally{await c.close();}
});}
async function responsiveChecks(){
 for(const lang of ['zh','en','ja'])for(const width of [320,390,768,1440])await check(`responsive-${lang}-${width}`,async()=>{
  const c=await context({viewport:{width,height:1000},hasTouch:width<500}),p=await c.newPage(),seen=observe(p);const samples=[],pixelIssues=[];
  try{
   await navigate(p,`${BASE}/holiday-lab/?lang=${lang}`);const buttons=await p.locator('.game-card button').count();ok(buttons===10,`Only ${buttons} archive buttons`);const archive=await auditLayout(p);ok(!archive.issues.length,JSON.stringify(archive.issues));ok(!seen.requests.some(x=>/\/games\//.test(x)),'Archive imported a game');await imageReady(p,'.game-card img');await snap(p,`archive-${lang}-${width}`);const pixels=await auditButtonPixels(p);pixelIssues.push(...pixels.issues);samples.push({screen:'archive',...archive});
   for(const id of ids){await game(p,id,lang);const layout=await auditLayout(p);samples.push({screen:id,...layout});ok(!layout.issues.length,`${id}: ${JSON.stringify(layout.issues)}`);if(['new-year','national-day','exhibition'].includes(id)){const pixels=await auditButtonPixels(p);pixelIssues.push(...pixels.issues.map(i=>({game:id,...i})));}if(id==='exhibition')await snap(p,`controls-${lang}-${width}`);}
   const contrastIssues=pixelIssues.filter(i=>i.kind==='low-median-contrast'),textureIssues=pixelIssues.filter(i=>i.kind==='text-over-artwork');
   // Keep geometric padding, readable contrast, and the strict no-pattern criterion distinct.
   run.checks.push({name:`button-contrast-${lang}-${width}`,pass:!contrastIssues.length,evidence:{issues:contrastIssues}});console.log(`${contrastIssues.length?'NO':'YES'} button-contrast-${lang}-${width}: ${JSON.stringify(contrastIssues)}`);
   run.checks.push({name:`text-on-border-${lang}-${width}`,pass:!textureIssues.length,evidence:{threshold:.004,issues:textureIssues}});console.log(`${textureIssues.length?'NO':'YES'} text-on-border-${lang}-${width}: ${JSON.stringify(textureIssues.slice(0,3))}`);
   ok(!seen.errors.length,seen.errors.join('; '));return {archiveButtons:buttons,checkedGameControls:10,samples,pixelIssueCount:pixelIssues.length,contrastIssueCount:contrastIssues.length,textureIssueCount:textureIssues.length,consoleErrors:seen.errors};
  }finally{await c.close();}
 });
}
async function introChecks(){await check('five-CG-marquee-and-intro-input',async()=>{
 const c=await context(),p=await c.newPage(),seen=observe(p);try{
  await navigate(p,`${BASE}/holiday-lab/?lang=zh&game=new-year`);const start=await p.locator('.marquee').evaluate(e=>({text:e.textContent,transform:getComputedStyle(e).transform,animation:getComputedStyle(e).animationName}));ok(start.text.length>20,'Narration missing');ok(start.animation!=='none','Narration does not move');const frames=[];
  for(let i=1;i<=5;i++){await p.waitForFunction(n=>document.querySelector('.intro-caption')?.textContent===`${n} / 5`,i,{timeout:9500});await imageReady(p,'.intro-image:not(.previous)');const image=await p.locator('.intro-image:not(.previous)').getAttribute('src');frames.push(image);await snap(p,`intro-${i}`);}
  ok(new Set(frames).size===5,`Only ${new Set(frames).size} unique CGs`);await p.locator('.intro').click();await p.locator('#start-game').waitFor();await p.locator('#watch-intro').click();await p.locator('.intro').focus();await p.keyboard.press('Space');await p.locator('#start-game').waitFor();ok(!seen.errors.length,seen.errors.join('; '));return {frames,narration:start.text,marqueeAnimation:start.animation,skipClick:true,skipKeyboard:true};
 }finally{await c.close();}
});}
async function frameOrderingChecks(){await check('intro-first-RAF-timestamp-regression',async()=>{
 const c=await context();await c.addInitScript(()=>{const native=requestAnimationFrame.bind(window);let first=true;window.requestAnimationFrame=fn=>{const registeredAt=performance.now();return native(timestamp=>{const older=first;first=false;fn(older?Math.min(timestamp,registeredAt-25):timestamp);});};});const p=await c.newPage(),seen=observe(p);try{await navigate(p,`${BASE}/holiday-lab/?lang=zh&game=children`);await p.waitForTimeout(120);ok(!seen.requests.some(x=>/cg-0\.webp/.test(x)),`Opening requested cg-0: ${seen.requests.filter(x=>/cg-0\.webp/.test(x))}`);ok(await p.locator('.intro-caption').innerText()==='1 / 5','Initial timestamp moved to an invalid CG');ok(!seen.errors.length,seen.errors.join('; '));return {callbackFixture:'first browser RAF callback uses a timestamp 25ms before RAF registration; application source untouched',initialCG:'1 / 5',invalidRequests:0};}finally{await c.close();}
});}
async function narrationChecks(){await check('intro-narration-text-background',async()=>{
 const c=await context({viewport:{width:390,height:844}}),p=await c.newPage();try{await navigate(p,`${BASE}/holiday-lab/?lang=zh&game=new-year`);await imageReady(p,'.intro-image');await snap(p,'narration-normal');const pixels=await auditButtonPixels(p);ok(!pixels.issues.length,JSON.stringify(pixels.issues));return {rectangles:pixels.rectangles,contrast:pixels.contrasts,issues:[]};}finally{await c.close();}
});}
async function menuChecks(){for(const lang of ['zh','en','ja'])await check(`menu-help-settings-${lang}`,async()=>{
 const c=await context(),p=await c.newPage();try{await menu(p,'new-year',lang);for(const id of ['start-game','show-help','show-settings','watch-intro','exit-game'])ok(await p.locator(`#${id}`).isVisible(),`Missing ${id}`);await p.locator('#show-help').click();const help=await p.locator('#lab').innerText();ok(help.length>200,'Help copy too short');await p.locator('#help-back').click();await p.locator('#show-settings').click();ok(await p.locator('#settings-back').isVisible(),'Settings missing');await p.locator('#settings-back').click();await p.locator('#exit-game').click();ok(await p.locator('.game-card button').count()===10,'Exit did not return to archive');return {helpLength:help.length,menuActions:5,settings:true,exit:true};}finally{await c.close();}
 });}
async function pauseChecks(){await check('pause-inert-resume-and-listener-cleanup',async()=>{
 const c=await context(),p=await c.newPage();try{await game(p);const baseline=await p.evaluate(()=>Object.fromEntries([...__shellQA.records].map(([k,v])=>[k,v.size])));await p.locator('#ny-preview').click();await p.locator('#pause-game').click();ok(await p.locator('#game-controls').evaluate(e=>e.inert),'Controls not inert');const before=await p.locator('#ny-actor-1').getAttribute('style');await p.waitForTimeout(350);const after=await p.locator('#ny-actor-1').getAttribute('style');ok(before===after,'Animation progressed while paused');let blocked=false;try{await p.locator('#ny-submit').click({timeout:350});}catch{blocked=true;}ok(blocked,'Paused control accepted a pointer click');await p.locator('#pause-game').click();await p.waitForFunction(s=>document.querySelector('#ny-actor-1').getAttribute('style')!==s,before);for(let i=0;i<4;i++){await p.locator('#leave-game').click();await p.locator('#open-new-year').click();await p.locator('#intro-skip').click();await p.locator('#start-game').click();await p.locator('#ny-preview').waitFor();}const final=await p.evaluate(()=>Object.fromEntries([...__shellQA.records].map(([k,v])=>[k,v.size])));for(const key of ['document:keydown','document:visibilitychange'])ok(baseline[key]===final[key],`${key} grew ${baseline[key]} -> ${final[key]}`);return {frozenStyle:true,pointerBlocked:blocked,resume:true,cycles:4,listeners:{baseline,final}};}finally{await c.close();}
});}
async function audioChecks(){await check('audio-default-gate-decode-and-volume',async()=>{
 const c=await context(),p=await c.newPage(),seen=observe(p);try{await game(p,'children');ok(await p.locator('#audio-toggle').innerText()==='聲音：關','Sound not muted by default');await p.locator('#children-preview').click();await p.waitForTimeout(450);ok(!seen.requests.some(x=>/\/audio\//.test(x)),'Muted mode requested audio');await p.locator('#audio-toggle').click();await p.waitForFunction(()=>__shellQA.audios.some(a=>a.readyState>=2));const native=await p.evaluate(()=>__shellQA.audios.map(a=>({src:a.currentSrc,volume:a.volume,readyState:a.readyState,error:a.error?.message||null})));ok(native.length>0&&native.every(a=>a.volume<=.5&&!a.error),'Playback media failed / excessive volume');const decoded=await p.evaluate(async()=>{const ctx=new AudioContext(),out=[];try{for(const kind of ['click','success','error','paper','wood','metal']){const response=await fetch(`audio/${kind}.ogg`);if(!response.ok)throw Error(`${kind} HTTP ${response.status}`);const decoded=await ctx.decodeAudioData(await response.arrayBuffer());let peak=0;for(let channel=0;channel<decoded.numberOfChannels;channel++){const pcm=decoded.getChannelData(channel);for(const x of pcm)peak=Math.max(peak,Math.abs(x));}out.push({kind,duration:decoded.duration,channels:decoded.numberOfChannels,sampleRate:decoded.sampleRate,peak});}}finally{await ctx.close();}return out;});ok(decoded.every(d=>d.duration>0&&d.peak>0),'Silent / invalid decoded audio');await p.locator('#audio-toggle').click();ok(await p.evaluate(()=>__shellQA.audios.every(a=>a.paused)),'Mute did not stop native audio');return {mutedRequests:0,native,decoded,actualListening:'not performed; headless media decode is not listening evidence'};}finally{await c.close();}
});}
async function backgroundChecks(){await check('real-browser-background-suspension',async()=>{
 const c=await context(),p=await c.newPage();try{await game(p);await p.locator('#ny-preview').click();const other=await c.newPage();await other.goto('about:blank');await other.bringToFront();const hidden=await p.evaluate(()=>document.hidden);ok(hidden,'Headless Chromium kept both tabs visible; no genuine visibilitychange evidence (no JS visibility override used)');const before=await p.locator('#ny-actor-1').getAttribute('style');await p.waitForTimeout(350);const after=await p.locator('#ny-actor-1').getAttribute('style');ok(before===after,'Animation progressed in hidden tab');await p.bringToFront();await p.waitForFunction(()=>!document.hidden);return {documentHidden:hidden,animationStopped:true};}finally{await c.close();}
});}
async function reducedChecks(){for(const lang of ['zh','en','ja'])await check(`reduced-motion-${lang}`,async()=>{
 const c=await context({reducedMotion:'reduce',viewport:{width:390,height:844}}),p=await c.newPage();try{await navigate(p,`${BASE}/holiday-lab/?lang=${lang}&game=new-year`);await imageReady(p,'.intro-image');const motion=await p.evaluate(()=>({image:getComputedStyle(document.querySelector('.intro-image')).animationName,marquee:getComputedStyle(document.querySelector('.marquee')).animationName,whiteSpace:getComputedStyle(document.querySelector('.marquee')).whiteSpace,text:document.querySelector('.marquee').textContent,overflow:getComputedStyle(document.querySelector('.marquee-window')).overflowY}));ok(motion.image==='none'&&motion.marquee==='none','Reduced motion still animates');ok(motion.whiteSpace!=='nowrap'&&motion.text.length>20,'Narration cannot be read as wrapped text');await snap(p,`reduced-${lang}`);const pixels=await auditButtonPixels(p);ok(!pixels.issues.length,JSON.stringify(pixels.issues));await p.locator('#intro-skip').click();await p.locator('#start-game').click();await p.locator('#ny-preview').waitFor();return {...motion,textPixelRectangles:pixels.rectangles};}finally{await c.close();}
 });}
async function negativeControls(){await check('auditor-negative-control',async()=>{
 const c=await context({viewport:{width:320,height:844}}),p=await c.newPage();try{await menu(p);await p.locator('#start-game').evaluate(e=>{e.style.width='30px';e.style.padding='0';e.style.whiteSpace='nowrap';});const layout=await auditLayout(p);ok(layout.issues.some(i=>i.id==='start-game'),'Layout auditor failed to detect an injected narrow button');return {injected:'30px button, zero padding, nowrap; browser-only temporary defect',detected:layout.issues};}finally{await c.close();}
});}
function save(){run.finished_at=new Date().toISOString();run.summary={yes:run.checks.filter(x=>x.pass).length,no:run.checks.filter(x=>!x.pass).length,total:run.checks.length};let archive={runs:[]};const file=path.join(OUT,'shell.json');if(fs.existsSync(file)){try{archive=JSON.parse(fs.readFileSync(file,'utf8'));}catch{archive={runs:[]};}}archive.runs.push(run);fs.writeFileSync(file,JSON.stringify(archive,null,2));const report=['# 共用外框與首頁：獨立 QA',`\n執行：${run.started_at}；網址：${BASE}。`, '\n命令：`'+run.command+'`',`\n結果：yes ${run.summary.yes}／no ${run.summary.no}／總計 ${run.summary.total}。`, '\n| 驗收 | yes/no | 實際證據或錯誤 |','|---|---|---|',...run.checks.map(x=>`| ${x.name} | ${x.pass?'yes':'no'} | ${JSON.stringify(x.evidence||x.error).replaceAll('|','／').slice(0,1200)} |`),'\n完整輸出、時間、各尺寸量測與失敗詳情見 shell.json。截圖在 screenshots/。','\n此腳本使用 Chromium headless 與真實網頁輸入；媒體完整解碼／音量屬工具證據，沒有實體裝置觸控或真人實聽。暫時注入的窄按鈕只在獨立瀏覽器測試頁，未修改來源。沒有 push、修改 main、刪檔。'];fs.writeFileSync(path.join(OUT,'SHELL-REPORT.md'),report.join('\n'));console.log(`SUMMARY yes=${run.summary.yes} no=${run.summary.no} total=${run.summary.total}`);}
(async()=>{browser=await chromium.launch({headless:true});try{await homeChecks();await iframeEscapeChecks();await guideChecks();await responsiveChecks();await introChecks();await frameOrderingChecks();await narrationChecks();await menuChecks();await pauseChecks();await audioChecks();await backgroundChecks();await reducedChecks();await negativeControls();}catch(e){run.errors.push(e.stack);console.error(e);}finally{await browser.close();save();}process.exitCode=run.errors.length||run.checks.some(x=>!x.pass)?1:0;})();
