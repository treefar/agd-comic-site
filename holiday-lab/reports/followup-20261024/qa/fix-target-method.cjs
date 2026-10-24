const fs=require('fs'),path=require('path'),dir=__dirname;
fs.copyFileSync(path.join(dir,'new-targets.cjs'),path.join(dir,'new-targets-v1.cjs.txt'));
let t=fs.readFileSync(path.join(dir,'new-targets.cjs'),'utf8');
if(!t.includes("page.locator('h1').first().waitFor()"))throw Error('expected method preimage missing');
t=t.replace("path.join(__dirname,'new-targets'),base=","path.join(__dirname,process.argv[2]||'new-targets-r2'),base=");
t=t.replace("await page.locator('h1').first().waitFor();","await page.locator('.chapter-header .title').waitFor();await page.waitForFunction(()=>/WIN\\s*·\\s*\\d{4}/.test(document.body.innerText));");
t=t.replace("page.locator('h1').allTextContents()","page.locator('.chapter-header .title').allTextContents()");
fs.writeFileSync(path.join(dir,'new-targets.cjs'),t);console.log('Method-only correction: use actual detail title and WIN text, no product writes.');
