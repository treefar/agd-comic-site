const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),req=require('module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')),{chromium}=req('playwright');
const dir=__dirname,base=process.env.PLAIN_COPY_URL||'http://127.0.0.1:8864',site=path.resolve('.measure-plain-copy-20261023-01'),out=path.join(dir,'browser-'+new Date().toISOString().replaceAll(':','-'));
fs.mkdirSync(out,{recursive:true});const packet=JSON.parse(fs.readFileSync(path.join(dir,'input.json'))),rows=packet.rows.filter(r=>r.direct_semantic_subset),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const sources=['data/ja/messages.json','data/ja/step-details.json','data/en/student-guide-ui.json','data/en/step-details-ui.json','locale-en.js','locale-ja.js','data/students/guide.json','student-guide.jsx','student-guide.css'];
const before=Object.fromEntries(sources.map(f=>[f,sha(f)]));
const specs={
 'JA-ABSENCE-01':['#student-leave .sg-step-title',2,'leave'],
 'JA-ABSENCE-02':['#student-leave .sg-warning',0,'leave'],
 'JA-ABSENCE-03':['[data-step-detail="leave-2"]',0,'leave'],
 'JA-EFFECTIVE-DATE-01':['[data-step-detail="certification-1"]',0,'certification'],
 'JA-MAKEUP-01':['#student-graduation .sg-step-title',2,'graduation'],
 'EN-CERT-RECOGNITION-01':['#student-certification .sg-summary',0,null],
 'EN-ENGLISH-RECOGNITION-01':['[data-step-detail="english-2"]',0,'english'],
 'EN-CONTACT-PLAIN-01':['#student-support-rights .sg-warning',0,'support-rights'],
 'EN-CONTACT-PLAIN-02':['#student-graduate-study .sg-contact >p',0,'graduate-study'],
 'EN-CONTACT-PLAIN-03':['.sg-bottom-note >p',0,null]
};
async function settled(p){await p.evaluate(async()=>{document.body.getBoundingClientRect();await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});assert.equal(await p.evaluate(()=>document.fonts.status),'loaded');}
async function measure(p,selector,index=0){return p.locator(selector).nth(index).evaluate(e=>{
 const style=getComputedStyle(e),box=e.getBoundingClientRect(),lines=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){for(let i=0;i<node.textContent.length;i++){const ch=node.textContent[i];if(!ch.trim())continue;const r=document.createRange();r.setStart(node,i);r.setEnd(node,i+1);for(const rect of r.getClientRects()){if(rect.width<=0||rect.height<=0)continue;let line=lines.find(l=>Math.abs(l.top-rect.top)<2);if(!line){line={top:rect.top,text:'',left:rect.left,right:rect.right};lines.push(line);}line.text+=ch;line.left=Math.min(line.left,rect.left);line.right=Math.max(line.right,rect.right);}}}
 lines.sort((a,b)=>a.top-b.top);return {text:e.textContent.trim(),fontStatus:document.fonts.status,fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,box:{x:box.x,y:box.y,width:box.width,height:box.height},lines,orphan:lines.length>1&&[...lines.at(-1).text.trim()].length<=1,horizontalOverflow:e.scrollWidth>e.clientWidth+1||lines.some(l=>l.left<box.left-1||l.right>box.right+1),visible:!!box.width&&!!box.height&&style.visibility!=='hidden'};
 });}
async function platformFonts(cdp,selector,index=0){const doc=await cdp.send('DOM.getDocument'),found=await cdp.send('DOM.querySelectorAll',{nodeId:doc.root.nodeId,selector});return (await cdp.send('CSS.getPlatformFontsForNode',{nodeId:found.nodeIds[index]})).fonts;}
(async()=>{const report={scope:'twelve approved translation values in real DOM; selected guide routes and one admission content; no whole-site certification',base,site,before,cases:[],targets:[],pass:false};let browser;
 try{browser=await chromium.launch({headless:true});
 for(const lang of ['zh','en','ja'])for(const width of [320,1440]){
  const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage(),r={lang,width,route:'guide',errors:[],targets:[]};report.cases.push(r);p.on('pageerror',e=>r.errors.push(e.message));
  await p.goto(base+'/?lang='+lang+'#/students/guide',{waitUntil:'networkidle'});await p.locator('#student-guide').waitFor();await settled(p);assert.equal(await p.locator('[data-guide-card]').count(),15);assert.equal(await p.locator('.sg-faq-item').count(),30);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await p.screenshot({path:path.join(out,lang+'-'+width+'-guide.png')});const cdp=await ctx.newCDPSession(p);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  if(lang!=='zh')for(const row of rows.filter(x=>x.lang===lang&&specs[x.id])){
   const [selector,index,card]=specs[row.id];if(card&&!(await p.locator('#student-'+card+' .sg-card-detail').getAttribute('open')!==null))await p.locator('#student-'+card+' .sg-card-detail>summary').click();
   await p.locator(selector).nth(index).scrollIntoViewIfNeeded();await settled(p);const m=await measure(p,selector,index);assert.ok(m.text.includes(row.candidate),row.id+' exact full candidate visible');assert.ok(!m.text.includes(row.current),row.id+' old wording absent');assert.ok(m.visible);assert.equal(m.orphan,false,row.id+' orphan');assert.equal(m.horizontalOverflow,false,row.id+' text bounds');m.id=row.id;m.lang=lang;m.width=width;m.expected=row.candidate;m.fonts=await platformFonts(cdp,selector,index);assert.ok(m.fonts.length>0);await p.locator(selector).nth(index).screenshot({path:path.join(out,row.id+'-'+width+'.png')});r.targets.push(row.id);report.targets.push(m);
  }
  if(lang==='ja'){
   await p.locator('#student-search').fill('__NO_TOPIC__');await p.locator('.sg-empty>p').waitFor();await settled(p);const row=rows.find(x=>x.id==='JA-CLEAR-BUTTON-01'),m=await measure(p,'.sg-empty>p');assert.equal(m.text,row.candidate);assert.equal(m.orphan,false);assert.equal(m.horizontalOverflow,false);m.id=row.id;m.lang=lang;m.width=width;m.expected=row.candidate;m.fonts=await platformFonts(cdp,'.sg-empty>p');report.targets.push(m);r.targets.push(row.id);assert.equal(await p.locator('.sg-clear').textContent(),'条件をリセット');await p.locator('#student-topics .sg-empty').screenshot({path:path.join(out,row.id+'-'+width+'.png')});await p.locator('.sg-clear').click();assert.equal(await p.locator('[data-guide-card]').count(),15);
  }
  assert.deepEqual(r.errors,[]);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);r.pass=true;await ctx.close();
 }
 for(const width of [320,1440]){
  const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage(),r={lang:'ja',width,route:'admission/selection',errors:[]};report.cases.push(r);p.on('pageerror',e=>r.errors.push(e.message));await p.goto(base+'/?lang=ja#/admission/selection',{waitUntil:'networkidle'});await p.locator('#admission-content').waitFor();await p.locator('#admission-content').scrollIntoViewIfNeeded();await settled(p);const row=rows.find(x=>x.id==='JA-APPLICATION-DOCUMENT-01'),m=await measure(p,'#admission-content');assert.equal(m.text.replace(/\s+/g,' ').trim(),row.candidate.replace(/\s+/g,' ').trim());assert.ok(m.text.includes('自伝'));assert.ok(!m.text.includes('自己推薦書'));assert.equal(m.orphan,false);assert.equal(m.horizontalOverflow,false);const cdp=await ctx.newCDPSession(p);await cdp.send('DOM.enable');await cdp.send('CSS.enable');m.fonts=await platformFonts(cdp,'#admission-content');m.id=row.id;m.lang='ja';m.width=width;m.expected=row.candidate;report.targets.push(m);await p.locator('#admission-content').screenshot({path:path.join(out,row.id+'-'+width+'.png')});assert.deepEqual(r.errors,[]);r.pass=true;await ctx.close();
 }
 assert.equal(report.targets.length,24);assert.equal(new Set(report.targets.map(r=>r.id)).size,12);report.pass=true;
 }catch(e){report.error=e.stack;process.exitCode=1;console.error(e.stack);}finally{await browser?.close();report.after=Object.fromEntries(sources.map(f=>[f,sha(f)]));report.sourceStable=JSON.stringify(report.after)===JSON.stringify(before);assert.ok(report.sourceStable);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(report,null,2));console.log('PLAIN_BROWSER '+(report.pass?'PASS':'FAIL')+' cases'+report.cases.filter(r=>r.pass).length+'/'+report.cases.length+' targets'+report.targets.length+'/24; sourceStable='+report.sourceStable+'; '+out);}
})();
