const fs=require('fs'),path=require('path');
let s=fs.readFileSync(path.join(__dirname,'run-v3.cjs'),'utf8').replace("dir=path.join(__dirname,'run03')","dir=path.join(__dirname,'run04')");
s=s.replace("await page.getByText('小颯',{exact:true}).last().waitFor({state:'visible'});", "await page.getByText('TEAM',{exact:true}).waitFor({state:'visible'});await page.getByText('小颯',{exact:true}).last().waitFor({state:'visible'});");
fs.mkdirSync(path.join(__dirname,'run04'),{recursive:true});fs.writeFileSync(path.join(__dirname,'run-v4.cjs'),s);
