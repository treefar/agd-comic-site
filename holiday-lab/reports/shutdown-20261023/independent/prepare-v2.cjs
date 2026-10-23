const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'run.cjs'),'utf8').replace('dir=__dirname,site=',"dir=path.join(__dirname,'run02'),site=").replace("await page.waitForURL('**/#/works/clipstudio-grand-prize');","await page.waitForURL(u=>u.hash==='#/works/clipstudio-grand-prize');");
fs.mkdirSync(path.join(__dirname,'run02'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'run-v2.cjs'),s);
