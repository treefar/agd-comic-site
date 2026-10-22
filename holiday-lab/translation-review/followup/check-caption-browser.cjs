// Rerun actual three-caption DOM flow after changing the translated caption.
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'caption-browser',new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(out,{recursive:true});
const cases=[];
for(const [lang,width]of [['zh',1440],['en',390],['ja',390]]){
 const child=spawnSync(process.execPath,['holiday-lab/extra-qa/playthrough.cjs'],{cwd:root,encoding:'utf8',env:{...process.env,EXTRA_QA_URL:process.env.CAPTION_QA_URL||'http://127.0.0.1:8815',EXTRA_QA_GAMES:'constitution',EXTRA_QA_LANG:lang,EXTRA_QA_WIDTH:String(width)}});
 fs.writeFileSync(path.join(out,`${lang}-${width}.txt`),child.stdout+child.stderr);
 const latest=JSON.parse(fs.readFileSync(path.join(root,'holiday-lab/extra-qa/latest.json')));
 cases.push({lang,width,exit:child.status,...latest});console.log(`${lang}/${width}: exit ${child.status}, ${latest.status}`);
}
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({cases,pass:cases.every(c=>c.exit===0&&c.status==='pass')},null,2));
console.log('CAPTION_BROWSER_EVIDENCE '+out);process.exitCode=cases.every(c=>c.exit===0&&c.status==='pass')?0:1;
