const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const base=process.env.QA_URL||'http://127.0.0.1:8797/',out=process.env.QA_OUTPUT||'docs/qa/japanese/browser';fs.mkdirSync(out,{recursive:true});
const guide=JSON.parse(fs.readFileSync('data/students/guide.json'));
const detailCount=guide.cards.reduce((n,c)=>n+c.steps.length,0);
const routes=['#hero'];for(const[file,type,key]of [['news','news','slug'],['faculty','faculty','slug'],['labs','labs','slug'],['works','works','id'],['admission','admission','slug'],['videos','videos','id'],['stats','stats','slug']])for(const x of JSON.parse(fs.readFileSync('data/'+file+'.json')))routes.push('#/'+type+'/'+x[key]);
routes.push('#/curriculum/map','#/works/all','#/parents/guide','#/guide/start','#/quiz/start','#/reels/all','#/students/guide');
const mobile=['#hero','#/faculty/tengshuyuan','#/curriculum/map','#/works/all','#/admission/visit','#/parents/guide','#/guide/start','#/quiz/start','#/stats/honors','#/students/guide'];
const results=[],actions=[],missing={en:new Set(),ja:new Set()};
const capture=async(page,name)=>sharp(await page.screenshot({type:'png'})).webp({quality:84}).toFile(path.join(out,name+'.webp'));
(async()=>{const browser=await chromium.launch({headless:true});try{
for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:950}});let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
for(const hash of process.env.QA_QUICK?mobile:(width===1440?routes:mobile)){const signatures=[];
for(const lang of ['zh','en','ja']){errors=[];await page.goto(base+(lang==='zh'?'':'?lang='+lang)+hash,{waitUntil:'domcontentloaded'});await page.locator('.topnav').waitFor();await page.waitForFunction(()=>window.siteText&&!Array.from(document.querySelectorAll('.sfx')).some(x=>x.textContent.trim()===siteText('LOADING')));
if(hash==='#hero')await page.getByText(/STUDENT REEL · 20 CLIPS/).waitFor();
if(hash==='#/students/guide')await page.locator('[data-guide-card]').first().waitFor();
const state=await page.evaluate(()=>({language:document.documentElement.lang,text:document.body.innerText,fit:document.documentElement.scrollWidth<=innerWidth+1,signature:[...document.querySelectorAll('#root *')].map(e=>e.tagName+'#'+e.id+'.'+(typeof e.className==='string'?e.className:'')),missing:[...window.__SITE_UNTRANSLATED__]}));
assert.equal(state.language,lang==='zh'?'zh-Hant':lang);assert.ok(state.text.length>200,hash);assert.ok(!state.text.includes('404 · PANEL NOT FOUND'),hash);assert.ok(state.fit,[width,lang,hash].join(' ')+' overflow');assert.deepEqual(errors,[]);assert.equal(await page.locator('a[href*="/play/"]').count(),0);assert.ok(!state.text.includes('電競娛樂系代理主任'));signatures.push(state.signature);if(missing[lang])state.missing.forEach(s=>missing[lang].add(s));
if(hash==='#/students/guide'){assert.equal(await page.locator('[data-guide-card]').count(),15);assert.equal(await page.locator('[data-step-detail]').count(),detailCount);assert.equal(await page.locator('.sg-faq-item').count(),30);const expected=await page.evaluate(()=>siteText('在校指南'));assert.equal(await page.locator('#student-guide-title').innerText(),expected);}
if(['#hero','#/students/guide','#/faculty/tengshuyuan','#/curriculum/map'].includes(hash)&&lang!=='zh'){await capture(page,lang+'-'+width+'-'+hash.replace(/[^a-z0-9]/gi,'_'));}
results.push({width,lang,hash,elements:state.signature.length,fit:state.fit,errors:errors.length});fs.writeFileSync(path.join(out,'progress.json'),JSON.stringify({results,missing:Object.fromEntries(Object.entries(missing).map(([k,v])=>[k,[...v]]))},null,2));
}
assert.deepEqual(signatures[0],signatures[1],width+' '+hash+' zh/en DOM differs');assert.deepEqual(signatures[0],signatures[2],width+' '+hash+' zh/ja DOM differs');
}
await page.close();}
const home=await browser.newPage();await home.goto(base+'#hero');await home.locator('.topnav').waitFor();await home.locator('.topnav a[href="#/students/guide"]').click();await home.locator('[data-guide-card]').first().waitFor();assert.ok(home.url().endsWith('#/students/guide'));await home.close();
for(const width of [1440,768,390,320])for(const lang of ['zh','en','ja']){const page=await browser.newPage({viewport:{width,height:950}});await page.goto(base+(lang==='zh'?'':'?lang='+lang)+'#/students/guide');await page.locator('[data-guide-card]').first().waitFor();
if(width<=768){const menu=await page.locator('.hamburger').boundingBox();assert.ok(menu&&menu.x>=0&&menu.x+menu.width<=width+1&&menu.width>=44,lang+' '+width+' clipped hamburger');}
for(const category of guide.categories){await page.locator('.sg-directory button').nth(guide.categories.indexOf(category)+1).click();assert.equal(await page.locator('[data-guide-card]').count(),guide.cards.filter(x=>x.category===category.id).length);}
await page.locator('.sg-clear').click();await page.locator('#student-search').fill(lang==='ja'?'インターン':lang==='en'?'internship':'實習');assert.ok(await page.locator('[data-guide-card]').count()>0);await page.locator('#student-search').fill('NO_MATCH_42');assert.equal(await page.locator('[data-guide-card]').count(),0);
for(let i=0;i<guide.quick_links.length;i++){await page.locator('.sg-shortcuts button').nth(i).click();assert.equal(await page.locator('[data-guide-card]').count(),15);assert.equal(await page.locator('#student-search').inputValue(),'');}
const summary=page.locator('.sg-faq-item summary').first();await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.sg-faq-item').first().evaluate(e=>e.open),true);assert.equal(await page.locator('.click-sfx').count(),0);await summary.click();assert.equal(await page.locator('.sg-faq-item').first().evaluate(e=>e.open),false);
assert.equal(await page.locator('[data-flow-node]').count(),detailCount);
for(const card of guide.cards){const article=page.locator('[data-guide-card="'+card.id+'"]');assert.equal(await article.locator('.sg-flow-arrow').count(),['choices','branch'].includes(card.flow_type)?0:card.steps.length-1);}
await page.locator('[data-flow-node]').last().click();assert.equal(await page.evaluate(()=>document.activeElement.id),'student-step-'+guide.cards.at(-1).id+'-'+(guide.cards.at(-1).steps.length-1));assert.ok(page.url().endsWith('#/students/guide'));
const text=page.locator('.sg-summary').first();await text.click();assert.ok(await page.locator('.click-sfx').count()>0);await page.waitForTimeout(700);await page.emulateMedia({reducedMotion:'reduce'});await text.click();assert.equal(await page.locator('.click-sfx').count(),0);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.evaluate(()=>scrollTo(0,0));await capture(page,lang+'-guide-'+width);await page.locator('#student-topics-title').scrollIntoViewIfNeeded();await capture(page,lang+'-topics-'+width);
if(width===390){await page.locator('.hamburger').click();const target=lang==='ja'?'en':'ja';await page.locator('.topnav a[lang="'+target+'"]').click();await page.waitForFunction(target=>window.siteLanguage===target,target);assert.ok(page.url().endsWith('#/students/guide'));}
actions.push({width,lang,categories:8,shortcuts:8,search:true,faqKeyboard:true,faqNoFx:true,bodyFx:true,reducedMotion:true,flowNodes:detailCount,flowJump:true,branchNoArrows:true,fit:true});await page.close();}
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,actions,missing:Object.fromEntries(Object.entries(missing).map(([k,v])=>[k,[...v]]))},null,2));console.log('PASS trilingual route checks',results.length,'guide action runs',actions.length);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
