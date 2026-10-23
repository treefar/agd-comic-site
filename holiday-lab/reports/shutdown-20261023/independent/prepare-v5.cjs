const fs=require('fs'),path=require('path');
let s=fs.readFileSync(path.join(__dirname,'run-v4.cjs'),'utf8').replace("dir=path.join(__dirname,'run04')","dir=path.join(__dirname,'run05')").replace("getByText('TEAM',{exact:true})","getByText(lang==='ja'?'制作チーム':'TEAM',{exact:true})");
fs.mkdirSync(path.join(__dirname,'run05'),{recursive:true});fs.writeFileSync(path.join(__dirname,'run-v5.cjs'),s);
