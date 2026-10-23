const fs=require('fs'),path=require('path');
let s=fs.readFileSync(path.join(__dirname,'run-v2.cjs'),'utf8').replace("dir=path.join(__dirname,'run02')","dir=path.join(__dirname,'run03')");
s=s.replace("await ready(page);entry.source=", "await page.getByText('小颯',{exact:true}).last().waitFor({state:'visible'});await ready(page);entry.source=").replace("await page.getByText('小颯',{exact:false}).first().isVisible()","await page.getByText('小颯',{exact:true}).last().isVisible()");
fs.mkdirSync(path.join(__dirname,'run03'),{recursive:true});fs.writeFileSync(path.join(__dirname,'run-v3.cjs'),s);
