// Exercise exported review files as files, including query-based language switching.
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.argv[2]||'docs/qa/japanese');
const detailCount=JSON.parse(fs.readFileSync('data/students/guide.json')).cards.reduce((n,c)=>n+c.steps.length,0);
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
for(const lang of ['zh','en','ja']){const page=await browser.newPage({viewport:{width:390,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.join(root,'guide/index.html')).href+(lang==='zh'?'':'?lang='+lang)+'#/students/guide');await page.locator('[data-step-detail]').first().waitFor();
assert.equal(await page.locator('[data-guide-card]').count(),15);assert.equal(await page.locator('[data-step-detail]').count(),detailCount);assert.equal(await page.locator('[data-flow-node]').count(),detailCount);assert.equal(await page.locator('.sg-faq-item').count(),30);assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-Hant':lang);
await page.locator('#student-search').fill(lang==='ja'?'インターン':lang==='en'?'internship':'實習');assert.ok(await page.locator('[data-guide-card]').count()>0);await page.locator('.sg-clear').click();assert.equal(await page.locator('[data-guide-card]').count(),15);
await page.locator('.hamburger').click();const target=lang==='ja'?'zh':'ja';await page.locator('.topnav a[lang="'+(target==='zh'?'zh-Hant':target)+'"]').click();await page.waitForFunction(target=>window.siteLanguage===target,target);assert.ok(page.url().endsWith('#/students/guide'));assert.deepEqual(errors,[]);results.push({lang,cards:15,details:detailCount,faq:30,search:true,languageSwitch:true,errors});await page.close();
}
fs.writeFileSync(path.join(root,'delivery-smoke.json'),JSON.stringify(results,null,2));console.log('PASS exported guide: 3 languages, '+detailCount+' paragraphs, search and language switching');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
