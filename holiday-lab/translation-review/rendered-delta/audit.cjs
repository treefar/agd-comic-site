// Actual DOM -> platform font runs -> same-style isolated character probes. No product writes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')),{chromium}=req('playwright');
const {targets}=require('./targets.cjs'),dir=__dirname,repo=path.resolve(dir,'../../..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const base=process.argv[2],group=process.argv[3]||'all';
if(!base||!['all','faq','admission'].includes(group))throw Error('Usage: node audit.cjs <baseURL> [all|faq|admission]');
const run=path.join(dir,'runs',new Date().toISOString().replace(/[:.]/g,'-')+'-'+group);fs.mkdirSync(path.join(run,'fonts'),{recursive:true});
const input=targets(),wanted=input.targets.filter(t=>group==='all'||t.group===group);
const report={date:new Date().toISOString(),base,group,run,sourcePlans:input.sourcePlans,expectedCases:wanted.length*2,cases:[],pages:[],receipts:{before:{},after:{}},fontResponses:[],pageErrors:[],errors:[],scope:'Only changed 17 FAQ strings and 3 eligibility paragraphs at 390 and 1440; character probes inherit the actual target style, and are not treated as visible product content.'};
const known=new Map();
const fontRoot=path.join(repo,'holiday-lab/redesign/font-audit'),fontLatest=JSON.parse(fs.readFileSync(path.join(fontRoot,'latest.json'))),prior=JSON.parse(fs.readFileSync(path.join(fontRoot,fontLatest.run,'audit.json')));
for(const f of prior.files)if(f.url)known.set(f.url,path.join(fontRoot,f.path));
const glyphRoot=path.join(repo,'holiday-lab/redesign/glyph-copy');
for(const latest of ['latest.json','nav-latest.json']){const p=path.join(glyphRoot,latest);if(fs.existsSync(p)){const d=JSON.parse(fs.readFileSync(p)),scan=JSON.parse(fs.readFileSync(path.join(glyphRoot,d.run,'scan.json')));for(const f of scan.newFonts??[])known.set(f.url,path.join(glyphRoot,d.run,f.path));}}
// Built review pages embed both locale dictionaries in the hashed app bundle.
const sourceFiles=new Set(['index.html','styles.css','student-guide.css','data/students/guide.json','data/admission.json','data/en/admission.json','data/ja/messages.json','data/en/student-guide-ui.json']);
async function receipt(file,phase){const r=await fetch(base.replace(/\/$/,'')+'/'+file,{cache:'no-store'});if(!r.ok)throw Error('RECEIPT '+file+' '+r.status);const b=Buffer.from(await r.arrayBuffer());report.receipts[phase][file]={url:r.url,status:r.status,bytes:b.length,sha256:hash(b)};return b.toString('utf8');}
async function platform(cdp,nodeId){return(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
function save(){fs.writeFileSync(path.join(run,'audit.json'),JSON.stringify(report,null,2)+'\n');}
(async()=>{let browser;const pending=[],seen=new Set();try{
 const index=await receipt('index.html','before');for(const m of index.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))(?:\?[^"']*)?["']/g)){const f=m[1];if(!/^https?:|^\/\//.test(f))sourceFiles.add(f.replace(/^\.\//,''));}for(const f of sourceFiles)if(f!=='index.html')await receipt(f,'before');
 browser=await chromium.launch({headless:true});
 for(const width of [390,1440])for(const lang of ['zh','en','ja'])for(const kind of ['faq','admission']){
  const selected=wanted.filter(t=>t.lang===lang&&t.group===kind);if(!selected.length)continue;
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
  page.on('pageerror',e=>report.pageErrors.push({lang,width,kind,message:e.message}));
  context.on('response',r=>{const url=r.url();if(!/\.woff2?(?:\?|$)|\.ttf(?:\?|$)|\.otf(?:\?|$)/i.test(url)||seen.has(url))return;seen.add(url);pending.push((async()=>{if(known.has(url)&&fs.existsSync(known.get(url))){const bytes=fs.readFileSync(known.get(url));report.fontResponses.push({url,cached:true,path:known.get(url),bytes:bytes.length,sha256:hash(bytes)});return;}const b=await r.body(),name=hash(Buffer.from(url)).slice(0,18)+'.woff2';fs.writeFileSync(path.join(run,'fonts',name),b);report.fontResponses.push({url,status:r.status(),cached:false,path:path.join(run,'fonts',name),bytes:b.length,sha256:hash(b)});})().catch(e=>report.errors.push('FONT_RESPONSE '+url+' '+e.message)));});
  await page.goto(base+'/?lang='+lang+selected[0].route,{waitUntil:'networkidle'});await page.locator(kind==='faq'?'#student-faq':'.comic-page').waitFor();
  if(kind==='faq')await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=true));
  await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  const pageRec={lang,width,kind,url:page.url(),targets:selected.length,openedDetails:kind==='faq'?await page.locator('details[open]').count():0,pageHorizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};
  for(const [i,t]of selected.entries()){
   const c={...t,width,url:page.url(),visible:false,characters:[]};report.cases.push(c);
   const marker='delta-target-'+i;
   const found=await page.evaluate(({text,scope,marker})=>{const norm=s=>s.replace(/\s+/g,' ').trim(),root=document.querySelector(scope),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const p=n.parentElement;if(!p||p.closest('script,style')||!p.checkVisibility({checkVisibilityCSS:true}))continue;const actual=norm(n.textContent);if(actual===norm(text)||actual.includes(norm(text))){p.dataset.renderDelta=marker;return{actualNodeText:n.textContent,match:actual===norm(text)?'exact-text-node':'substring-text-node'};}}return null;},{text:t.text,scope:kind==='faq'?'#student-faq':'.comic-page',marker});
   if(!found){c.error='NEW_STRING_NOT_IN_VISIBLE_PRODUCT_DOM';console.log('MISSING',lang,width,t.id);save();continue;}
   const loc=page.locator(`[data-render-delta="${marker}"]`);await loc.scrollIntoViewIfNeeded({timeout:3000});c.visible=await loc.isVisible();c.match=found.match;c.actualNodeText=found.actualNodeText;
   c.geometry=await loc.evaluate((el,expected)=>{
    const norm=s=>s.replace(/\s+/g,' ').trim(),w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,target;while(n=w.nextNode())if(norm(n.textContent).includes(norm(expected))){target=n;break;}if(!target)throw Error('LOST_TARGET_NODE');
    const r=document.createRange(),start=target.textContent.indexOf(expected);if(start>=0){r.setStart(target,start);r.setEnd(target,start+expected.length);}else r.selectNodeContents(target);
    const rect=o=>({x:o.x,y:o.y,width:o.width,height:o.height,right:o.right,bottom:o.bottom}),lines=[...r.getClientRects()].map(rect),s=getComputedStyle(el),owner=el.closest('.sg-faq-item,.panel,.comic-panel')||el,box=owner.getBoundingClientRect(),clips=[];
    for(let a=el;a&&a!==document.body;a=a.parentElement){const cs=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(cs.overflowX+' '+cs.overflowY)){const b=a.getBoundingClientRect();for(const line of lines){const x=/hidden|clip|auto|scroll/.test(cs.overflowX)&&(line.x<b.x-1||line.right>b.right+1);const y=/hidden|clip|auto|scroll/.test(cs.overflowY)&&(line.y<b.y-1||line.bottom>b.bottom+1);if(x||y)clips.push({tag:a.tagName,class:a.className,overflowX:cs.overflowX,overflowY:cs.overflowY,line,bounds:rect(b)});}}}
    return{lines,owner:{tag:owner.tagName,class:owner.className,bounds:rect(box)},outsideViewportX:lines.some(b=>b.x< -1||b.right>innerWidth+1),outsideOwner:lines.some(b=>b.x<box.x-1||b.right>box.right+1||b.y<box.y-1||b.bottom>box.bottom+1),clipping:clips,elementScrollOverflow:el.clientWidth>0&&el.scrollWidth>el.clientWidth+1,computed:{family:s.fontFamily,weight:s.fontWeight,style:s.fontStyle,size:s.fontSize,stretch:s.fontStretch,variation:s.fontVariationSettings,features:s.fontFeatureSettings,textTransform:s.textTransform,letterSpacing:s.letterSpacing,lineHeight:s.lineHeight,stroke:s.webkitTextStrokeWidth,lang:el.closest('[lang]')?.lang||document.documentElement.lang}};
   },t.text);
   c.computed=c.geometry.computed;let doc=(await cdp.send('DOM.getDocument')).root.nodeId;const nodeId=(await cdp.send('DOM.querySelector',{nodeId:doc,selector:`[data-render-delta="${marker}"]`})).nodeId;c.platform=await platform(cdp,nodeId);
   const stem=kind+'-'+lang+'-'+width+'-'+i;c.screenshot=stem+'.png';await loc.screenshot({path:path.join(run,c.screenshot)});c.viewportScreenshot=stem+'-viewport.png';await page.screenshot({path:path.join(run,c.viewportScreenshot)});
   const chars=[...new Set([...t.text])].filter(ch=>ch.trim());
   await page.evaluate(({chars,computed})=>{document.getElementById('delta-font-probes')?.remove();const section=document.createElement('section');section.id='delta-font-probes';section.lang=computed.lang;section.style.cssText='position:fixed;left:0;top:0;opacity:0;pointer-events:none;width:1px;z-index:-1';for(const [i,ch]of chars.entries()){const e=document.createElement('span');e.id='delta-char-'+i;e.textContent=ch;Object.assign(e.style,{fontFamily:computed.family,fontWeight:computed.weight,fontStyle:computed.style,fontSize:computed.size,fontStretch:computed.stretch,fontVariationSettings:computed.variation,fontFeatureSettings:computed.features,textTransform:computed.textTransform,display:'inline-block'});section.append(e);}document.body.append(section);},{chars,computed:c.computed});
   await page.evaluate(()=>document.fonts.ready);doc=(await cdp.send('DOM.getDocument')).root.nodeId;
   const ids=(await cdp.send('DOM.querySelectorAll',{nodeId:doc,selector:'#delta-font-probes span'})).nodeIds;
   for(let k=0;k<ids.length;k++)c.characters.push({char:chars[k],codepoint:'U+'+chars[k].codePointAt(0).toString(16).toUpperCase(),platform:await platform(cdp,ids[k])});
   await page.locator('#delta-font-probes').evaluate(el=>el.remove());
   c.layoutPass=c.visible&&!c.geometry.outsideViewportX&&!c.geometry.outsideOwner&&!c.geometry.clipping.length&&!c.geometry.elementScrollOverflow;
   console.log('ACTIVE',lang,width,t.id,'FONT',c.platform.map(f=>f.familyName).join('/'),'LAYOUT',c.layoutPass,'CHARS',c.characters.length);save();
  }
  report.pages.push(pageRec);await cdp.detach();await context.close();save();
 }
 await Promise.all(pending);for(const f of sourceFiles)await receipt(f,'after');report.receiptsUnchanged=JSON.stringify(report.receipts.before)===JSON.stringify(report.receipts.after);report.domPass=report.cases.length===report.expectedCases&&report.cases.every(c=>c.visible);report.layoutPass=report.cases.every(c=>c.layoutPass)&&report.pages.every(p=>!p.pageHorizontalOverflow);report.pass=report.domPass&&report.layoutPass&&report.receiptsUnchanged&&!report.pageErrors.length&&!report.errors.length;
 }catch(e){report.errors.push(e.stack??e.message);}finally{if(browser)await browser.close();save();fs.writeFileSync(path.join(dir,'latest-'+group+'.json'),JSON.stringify({run:path.relative(dir,run).replaceAll('\\','/'),base,group,domPass:report.domPass,layoutPass:report.layoutPass,pass:report.pass},null,2)+'\n');console.log('RUN',run,'ACTIVE',report.cases.filter(c=>c.visible).length+'/'+report.expectedCases,'LAYOUT',report.layoutPass,'RECEIPTS',report.receiptsUnchanged,'ERRORS',report.errors.length+report.pageErrors.length);if(!report.pass)process.exitCode=1;}
})();
