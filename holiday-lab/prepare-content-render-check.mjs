// Reuse the audited DOM/font collector, with an explicit new target inventory and routes.
import fs from 'node:fs';
const dir='holiday-lab/translation-review/content-next-rendered';fs.mkdirSync(dir,{recursive:true});
let source=fs.readFileSync('holiday-lab/translation-review/rendered-delta/audit.cjs','utf8');
function replace(old,value){if(!source.includes(old))throw Error('COLLECTOR_SOURCE_CHANGED: '+old.slice(0,50));source=source.replace(old,value);}
replace("!['all','faq','admission'].includes(group)","group!=='all'");
replace("Only changed 17 FAQ strings and 3 eligibility paragraphs at 390 and 1440; character probes inherit the actual target style, and are not treated as visible product content.","Only the newly applied 13 content translations and one corrected Chinese partner paragraph at 390 and 1440; actual DOM text first, character probes are not visible-content evidence.");
replace("['index.html','styles.css','student-guide.css','data/students/guide.json','data/admission.json','data/en/admission.json','data/ja/messages.json','data/en/student-guide-ui.json']","['index.html','styles.css','data/news.json','data/en/news.json','data/works.json','data/en/works.json','data/ja/messages.json']");
replace("for(const width of [390,1440])for(const lang of ['zh','en','ja'])for(const kind of ['faq','admission']){","for(const width of [390,1440])for(const g of [...new Map(wanted.map(t=>[t.lang+'|'+t.route,{lang:t.lang,route:t.route}])).values()]){ const {lang}=g,kind=g.route.replace(/[^a-z0-9]+/ig,'-');");
replace("wanted.filter(t=>t.lang===lang&&t.group===kind)","wanted.filter(t=>t.lang===lang&&t.route===g.route)");
replace("await page.locator(kind==='faq'?'#student-faq':'.comic-page').waitFor();","await page.locator('#root').waitFor();");
replace("scope:kind==='faq'?'#student-faq':'.comic-page'","scope:'body'");
replace("const found=await page.evaluate",`await page.waitForFunction(text=>{const norm=s=>s.replace(/\\s+/g,' ').trim(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(e&&!e.closest('script,style')&&e.checkVisibility({checkVisibilityCSS:true})&&norm(n.textContent).includes(norm(text)))return true;}return false;},t.text,{timeout:10000}).catch(()=>{});
   const found=await page.evaluate`);
replace("c.error='NEW_STRING_NOT_IN_VISIBLE_PRODUCT_DOM';","c.error='NEW_STRING_NOT_IN_VISIBLE_PRODUCT_DOM';c.observed=await page.evaluate(()=>({url:location.href,title:document.querySelector('h1')?.textContent,body:document.body.innerText.slice(0,1800)}));");
fs.writeFileSync(dir+'/audit.cjs',source);
fs.copyFileSync('holiday-lab/translation-review/rendered-delta/coverage.py',dir+'/coverage.py');
console.log('CONTENT_RENDER_COLLECTOR_READY; original collector unchanged');
