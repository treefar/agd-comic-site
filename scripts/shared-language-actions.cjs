const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:900}});page.setDefaultTimeout(12000);const base=process.env.QA_URL||'http://127.0.0.1:8793/';const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
try{
 await page.goto(base+'?lang=en#/quiz/start',{waitUntil:'domcontentloaded'});
 const cases=[[[0,0,0,0,0,0,0,0],'anim'],[[1,1,1,1,1,1,1,1],'game'],[[2,2,2,2,2,2,2,2],'art'],[[3,3,3,3,3,3,3,3],'cross'],[[0,1,0,1,0,1,0,1],'game'],[[0,1,2,3,0,1,2,3],'cross'],[[3,2,1,0,3,2,1,0],'anim'],[[0,0,0,1,1,2,2,3],'anim'],[[1,1,1,2,2,0,0,3],'game'],[[2,2,2,3,3,0,0,1],'art']];
 for(let c=0;c<cases.length;c++){
  if(c)await page.getByRole('button',{name:'TRY AGAIN',exact:true}).click();
  const [answers,winner]=cases[c];for(let step=0;step<8;step++){await page.getByText(new RegExp('^Q'+(step+1)+'\\.')).waitFor();await page.locator('.chapter .comic-page button').nth(answers[step]).click();}
  await page.waitForURL('**#/quiz/'+winner);await page.getByRole('button',{name:'SHARE MY RESULT',exact:true}).waitFor();
  await page.evaluate(()=>{window.__mockShare=null;Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__mockShare=data;}});});
  await page.getByRole('button',{name:'SHARE MY RESULT',exact:true}).click();await page.waitForFunction(()=>!!window.__mockShare);const share=await page.evaluate(()=>window.__mockShare);assert.ok(share.url.includes('?lang=en#/quiz/'));assert.ok(!/[㐀-鿿]/.test(share.title+share.text));results.push({kind:'quiz',answers,winner,shareEnglish:true});
 }
 await page.goto(base+'?lang=en#/guide/start',{waitUntil:'domcontentloaded'});
 const guides=[[[0,0,0],'high-school-application'],[[0,2,1],'joint'],[[1,0,1],'tech-elite'],[[1,1,1],'selection'],[[1,2,2],'tech-star'],[[1,2,3],'selection'],[[1,2,0],'selection'],[[1,0,2],'tech-elite'],[[0,1,2],'high-school-application'],[[2],'evening']];
 for(let c=0;c<guides.length;c++){
  if(c)await page.getByRole('button',{name:'START AGAIN',exact:true}).click();const [answers,expected]=guides[c];for(let step=0;step<answers.length;step++){await page.getByText(new RegExp('^Q'+(step+1)+'\\.')).waitFor();await page.locator('.chapter .comic-page button').nth(answers[step]).click();}
  await page.getByText('YOUR RECOMMENDED PATHWAY',{exact:true}).waitFor();const href=await page.locator('.comic-page a[href^="#/admission/"]').first().getAttribute('href');assert.equal(href,'#/admission/'+expected);results.push({kind:'guide',answers,expected});
 }
 assert.deepEqual(errors,[]);const out=process.env.QA_OUTPUT||'docs/qa/shared-language';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/actions.json',JSON.stringify({results,errors},null,2));console.log('PASS: 10 quiz results, mocked English share, 10 admissions outcomes; errors=0');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
