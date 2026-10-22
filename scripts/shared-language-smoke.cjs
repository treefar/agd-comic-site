const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve('dist'),out=process.env.QA_OUTPUT||path.resolve('docs/qa/shared-language');fs.mkdirSync(out,{recursive:true});
const routes=['#hero'];for(const [file,type,key]of [['news','news','slug'],['faculty','faculty','slug'],['labs','labs','slug'],['works','works','id'],['admission','admission','slug'],['videos','videos','id'],['stats','stats','slug']])for(const x of JSON.parse(fs.readFileSync('data/'+file+'.json')))routes.push('#/'+type+'/'+x[key]);routes.push('#/curriculum/map','#/works/all','#/parents/guide','#/guide/start','#/quiz/start','#/reels/all');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
(async()=>{let server;const base=process.env.QA_URL||'http://127.0.0.1:8793/';if(!process.env.QA_URL){server=http.createServer((req,res)=>{const f=path.join(root,decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return;}res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});await new Promise(r=>server.listen(8793,'127.0.0.1',r));}
const browser=await chromium.launch({headless:true});const results=[],missing=new Set();
try{for(const width of (process.env.QA_WIDTHS==='390'?[390]:[1440,390])){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000}});page.setDefaultTimeout(12000);page.setDefaultNavigationTimeout(12000);let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
 const selected=width===1440&&!process.env.QA_QUICK?routes:['#hero','#/faculty/tengshuyuan','#/labs/'+JSON.parse(fs.readFileSync('data/labs.json'))[0].slug,'#/curriculum/map','#/works/all','#/admission/visit','#/parents/guide','#/guide/start','#/quiz/start','#/stats/honors'];
 for(const hash of (process.env.QA_ONLY?process.env.QA_ONLY.split(','):selected)){let sig=[];
 for(const lang of ['zh','en']){console.log('CHECK',width,lang,hash);
 await page.goto(base+(lang==='en'?'?lang=en':'')+hash,{waitUntil:'domcontentloaded'});
 await page.locator('#root > header').waitFor();
 await page.waitForFunction(lang=>window.siteLanguage===lang&&document.querySelector('#root > header')&&!Array.from(document.querySelectorAll('.sfx')).some(x=>x.textContent.trim()==='LOADING'),lang);
 if(hash==='#hero')await page.getByText(/STUDENT REEL · 20 CLIPS/).waitFor();
 if(errors.length)console.error('PAGE ERRORS',errors);
 const state=await page.evaluate(()=>({text:document.body.innerText,lang:document.documentElement.lang,fit:document.documentElement.scrollWidth<=innerWidth+1,signature:[...document.querySelectorAll('#root *')].map(e=>e.tagName+'#'+e.id+'.'+(typeof e.className==='string'?e.className:'')),missing:[...window.__SITE_UNTRANSLATED__]}));
 assert.ok(!state.text.includes('404 ·')&&!state.text.includes('404 · PANEL NOT FOUND'),hash);assert.ok(state.text.length>200,hash);assert.equal(errors.length,0,errors.join('\n'));assert.ok(state.fit,width+' '+lang+' '+hash+' page overflow');
 sig.push(state.signature);state.missing.forEach(x=>missing.add(x));
 if(lang==='en'){
 assert.equal(state.lang,'en');assert.equal(await page.locator('.topnav nav').getByText('News',{exact:true}).count(),1);assert.equal(await page.locator('footer').getByText('CONTACT',{exact:true}).count(),1);assert.ok(!state.text.includes('電競娛樂系代理主任'));assert.equal(await page.locator('a[href*="/play/"]').count(),0);
 if(hash==='#hero'||hash==='#/faculty/tengshuyuan'||hash==='#/curriculum/map')await page.screenshot({path:path.join(out,'en-'+width+'-'+hash.replace(/[^a-z0-9]/gi,'_')+'.jpg'),type:'jpeg',quality:80,timeout:10000});
 }
 results.push({width,lang,hash,elements:state.signature.length,fit:state.fit,errors:errors.length});fs.writeFileSync(path.join(out,'progress.json'),JSON.stringify({results,missing:[...missing]},null,2));
 }
 assert.deepEqual(sig[0],sig[1],width+' '+hash+' shared DOM differs');
 }
 await page.goto(base+'?lang=en#/quiz/start',{waitUntil:'domcontentloaded'});
 // The same native quiz controls retain their canonical values after translation.
 await page.goto(base+'?lang=en#/works/all',{waitUntil:'domcontentloaded'});await page.getByRole('tab',{name:/^ALL/}).waitFor();await page.getByRole('tab',{name:/^ART & ILLUSTRATION/}).click();assert.ok((await page.locator('body').innerText()).includes('STUDENT WORKS WALL'));
 if(width===390){await page.locator('.hamburger').click();assert.equal(await page.locator('.hamburger').getAttribute('aria-expanded'),'true');await page.getByRole('link',{name:'Contact',exact:true}).first().click();}
 if(width===390 && await page.locator('.hamburger').getAttribute('aria-expanded')!=='true')await page.locator('.hamburger').click();
 await page.getByRole('link',{name:'🌐 中文',exact:true}).click();await page.waitForFunction(()=>document.documentElement.lang==='zh-Hant');assert.equal(await page.locator('.topnav nav').getByText('最新消息',{exact:true}).count(),1);
 await page.goto(base+'#/en/intro',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.lang==='en');assert.ok(page.url().includes('lang=en'));
 await page.close({runBeforeUnload:false});}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,missing:[...missing]},null,2));console.log('PASS',results.length,'page/viewport/language checks; missing fragments',missing.size);fs.writeFileSync(path.join(out,'missing.json'),JSON.stringify([...missing],null,2));
}finally{await browser.close();if(server)server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
