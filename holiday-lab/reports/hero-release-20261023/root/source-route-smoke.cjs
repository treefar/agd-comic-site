// Exercise the actual local source links; does not certify full news-page layout.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright');
const base='http://127.0.0.1:8863',root=path.resolve(__dirname,'../../../..');
(async()=>{let browser;const report={base,scope:'Chinese source links for three featured student works; not full news-page typography approval',cases:[],errors:[]};try{
 browser=await chromium.launch({headless:true});const p=await browser.newPage({viewport:{width:1440,height:1000}});
 p.on('pageerror',e=>report.errors.push(e.message));
 const news=JSON.parse(fs.readFileSync(path.join(root,'data/news.json'))).find(n=>n.id===7140);
 await p.goto(base,{waitUntil:'networkidle'});
 for(const i of [3,4,5]){
  const href=await p.locator('#student-work-source').getAttribute('href'),work=news.gallery[i],id='work-'+String(i+1).padStart(2,'0');
  assert.ok(href.endsWith('/'+id));await p.locator('#student-work-source').click();
  const row=p.locator('#'+id);await row.waitFor({state:'visible'});assert.ok((await row.innerText()).includes(work.title));
  for(const name of work.designers.split(' · '))assert.ok((await row.innerText()).includes(name),name);
  const image=row.locator('img');await image.evaluate(e=>e.decode());assert.equal(await image.getAttribute('src'),work.image);
  await p.waitForFunction(id=>Math.abs(document.getElementById(id).getBoundingClientRect().top-80)<5,id);
  report.cases.push({title:work.title,href,id,sourceImage:work.image,scrolledToTarget:true,authorsComplete:true});
  await p.goto(base,{waitUntil:'networkidle'});for(let n=0;n<i-2;n++)await p.locator('#student-work-next').click();
 }
 assert.deepEqual(report.errors,[]);report.pass=true;console.log('SOURCE_ROUTES 3/3 PASS');
 }catch(e){report.pass=false;report.error=e.stack;console.error(e.stack);process.exitCode=1;}finally{await browser?.close();fs.writeFileSync(path.join(__dirname,'source-route-smoke.json'),JSON.stringify(report,null,2));}})();
