'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const runtime=require('module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=runtime('playwright');
const out=process.argv[2]||'before';
const directory=path.join(__dirname,out);fs.mkdirSync(directory,{recursive:true});
async function measure(page,cdp,label){
 const rows=await page.evaluate(()=>[...document.querySelectorAll('h1,h2,p,button,label')].filter(e=>e.getClientRects().length&&!e.closest('.marquee-window')).map(e=>{
  const t=e.textContent.trim(),lines=[];const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
  while(n=walker.nextNode()){for(let i=0;i<n.length;i++){if(!n.textContent[i].trim())continue;const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getBoundingClientRect();if(!b.width)continue;let line=lines.find(l=>Math.abs(l.y-b.y)<2);if(!line)lines.push(line={y:b.y,text:'',width:0});line.text+=n.textContent[i];line.width+=b.width;}}
  const s=getComputedStyle(e),b=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,text:t,lines,font:s.fontFamily,size:s.fontSize,width:b.width,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,orphan:lines.length>1&&lines.at(-1).text.length===1};
 }).filter(e=>e.text));
 const doc=await cdp.send('DOM.getDocument');
 for(const row of rows){if(!row.id)continue;const q=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#'+row.id});if(q.nodeId)row.platform=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId:q.nodeId})).fonts;}
 const pageWidth=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
 return {label,rows,orphan:rows.filter(r=>r.orphan),overflow:rows.filter(r=>r.scrollWidth>r.clientWidth+1),pageWidth};
}
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
 for(const lang of ['zh','en','ja'])for(const width of [320,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const events=[];page.on('pageerror',e=>events.push(String(e)));page.on('console',m=>{if(m.type()==='error')events.push(m.text());});
 await page.goto((process.env.FONT_QA_URL||'http://127.0.0.1:8857')+'/holiday-lab/?lang='+lang);await page.locator('#open-qingming').waitFor();await page.evaluate(()=>document.fonts.ready);const states=[await measure(page,cdp,'archive')];
 await page.locator('#open-qingming').click();await page.locator('#intro-skip').click();states.push(await measure(page,cdp,'menu'));await page.locator('#show-help').click();states.push(await measure(page,cdp,'help'));await page.locator('#help-back').click();await page.locator('#start-game').click();await page.locator('#kite-play').waitFor();states.push(await measure(page,cdp,'qingming-controls'));await page.screenshot({path:path.join(directory,`${lang}-${width}-controls.png`),fullPage:true});
 results.push({lang,width,states,errors:events});await context.close();
 }
 }finally{await browser.close();}
 const sha=crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../../lab.css'))).digest('hex');
 fs.writeFileSync(path.join(directory,'result.json'),JSON.stringify({cssSha256:sha,results},null,2));
 console.log(JSON.stringify(results.map(r=>({lang:r.lang,width:r.width,orphans:r.states.flatMap(s=>s.orphan.map(o=>({state:s.label,text:o.text,lines:o.lines}))),overflows:r.states.flatMap(s=>s.overflow),errors:r.errors})),null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
