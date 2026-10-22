// Self-contained review file; external school links and fonts still need a connection.
import fs from 'node:fs';import path from 'node:path';
const dest=path.resolve(process.argv[2]||'docs/qa/student-guide/preview');fs.mkdirSync(dest,{recursive:true});
let html=fs.readFileSync('dist/index.html','utf8');
const data=fs.readFileSync('data/students/guide.json','utf8').replace(/</g,'\\u003c');
html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>在校指南｜官網版型審閱稿</title>');
html=html.replace(/<div id="root">[\s\S]*?<script>\(function\(\)\{var n=[\s\S]*?<\/script>/,'<div id="root"></div>');
html=html.replace(/<link rel="stylesheet" href="([^\"]+)"\s*\/>/g,(_,url)=>'<style>'+fs.readFileSync(path.join('dist',url.split('?')[0]),'utf8')+'</style>');
html=html.replace(/<script src="(app-[^\"]+\.js)"><\/script>/,(_,file)=>'<script>window.__STUDENT_GUIDE_FILE__=true;window.__STUDENT_GUIDE__='+data+';if(!location.hash.startsWith("#/students/"))location.hash="/students/guide";</script><script>'+fs.readFileSync(path.join('dist',file),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
fs.writeFileSync(path.join(dest,'index.html'),html);console.log('Review file:',path.join(dest,'index.html'));
