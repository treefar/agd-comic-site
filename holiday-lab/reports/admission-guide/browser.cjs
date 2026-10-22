// Real DOM route selection: no imports of guidePick or direct React state access.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
const req=require('module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright');
const base=process.env.ADMISSION_QA_URL||'http://127.0.0.1:8815';
const run=path.join(__dirname,'runs',new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(run,{recursive:true});
const result={base,run,cases:[],pageErrors:[],receipts:{},pass:false};
const scenarios=[{id:'hs-certificate',school:0,award:1,route:0,want:['tech-elite','high-school-application']},{id:'voc-certificate',school:1,award:1,route:1,want:['tech-elite','selection']},{id:'hs-other-certificate',school:0,award:2,route:0,want:['high-school-application']},{id:'voc-ordinary',school:1,award:2,route:1,want:['selection','joint']},{id:'explicit-evening',school:2,want:['evening']}];
(async()=>{const browser=await chromium.launch({headless:true});try{
 for(const lang of ['zh','en','ja'])for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),p=await context.newPage();p.on('pageerror',e=>result.pageErrors.push({lang,width,message:e.message}));
  for(const s of scenarios){await p.goto(`${base}/?lang=${lang}#/guide/start`,{waitUntil:'networkidle'});await p.reload({waitUntil:'networkidle'});await p.locator('.pv-grid button').first().waitFor();
   const labels=await p.locator('.pv-grid button').allTextContents();assert.equal(labels.length,3);
   await p.locator('.pv-grid button').nth(s.school).click();
   if(s.award!==undefined){const options=await p.locator('.pv-grid button').allTextContents();assert.equal(options.length,3);assert.ok(options[1].includes(lang==='zh'?'勞動部':lang==='en'?'Ministry of Labor':'労働部'));await p.locator('.pv-grid button').nth(s.award).click();await p.locator('.pv-grid button').nth(s.route).click();}
   await p.locator('.chapter .comic-page a[href^="#/admission/"]').first().waitFor();
   const slugs=await p.locator('.chapter .comic-page a[href^="#/admission/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href').split('/').pop()).filter(x=>x!=='scholarship'));
   assert.deepEqual(slugs,s.want,`${lang}/${width}/${s.id}`);
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,'no horizontal page overflow');
   const text=await p.locator('main').count()?await p.locator('main').innerText():await p.locator('body').innerText();
   result.cases.push({lang,width,id:s.id,labels,slugs,horizontalOverflow:overflow,pass:true});
   if(s.id==='hs-certificate')await p.screenshot({path:path.join(run,`${lang}-${width}.png`),fullPage:true});
  }await context.close();
 }
 for(const f of ['pages.jsx','data/admission.json','data/en/admission.json','data/ja/messages.json','locale-en.js','locale-ja.js'])result.receipts[f]=crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../..',f))).digest('hex');
 assert.equal(result.pageErrors.length,0);result.pass=true;
}finally{await browser.close();fs.writeFileSync(path.join(run,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({pass:result.pass,cases:result.cases.length,pageErrors:result.pageErrors.length,run}));}})().catch(e=>{console.error(e);process.exitCode=1;});
