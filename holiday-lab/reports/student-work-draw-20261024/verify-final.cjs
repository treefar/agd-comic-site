const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process');
process.chdir(path.resolve(__dirname,'../../..'));
const dir='holiday-lab/reports/student-work-draw-20261024',site='.measure-student-work-draw-20261024-04';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name).replaceAll('\\','/')]);
async function main(){
 const contexts=[['zh',1440],['en',1440],['ja',1440],['zh',390],['en',390],['ja',390],['zh',1180],['zh',1181]];
 const cases=contexts.map(([lang,width])=>{const file=`${dir}/case-${lang}-${width}.json`,c=read(file);assert.equal(c.lang,lang);assert.equal(c.width,width);for(const [k,v] of Object.entries(c.checked))assert.equal(v,true,`${file}:${k}`);return{file,lang,width,checks:c.checked};});
 for(const file of ['static-keyboard.json','escape-stop.json','click-stop.json','offscreen.json']){const c=read(dir+'/'+file);for(const [k,v]of Object.entries(c.checks))assert.equal(v,true,file+':'+k);}
 const live=read(dir+'/ten-live-draws.json');assert.equal(live.length,10);assert.ok(live.every(x=>x.pass));
 const routes=read(dir+'/routes.json');assert.equal(routes.length,8);assert.ok(routes.every(x=>x.pass));assert.equal(read(dir+'/clicked-route-en.json').pass,true);
 const ja=read(dir+'/clicked-route-ja.json');assert.ok(ja.after.url.includes('?lang=ja#'));assert.ok(ja.after.url.endsWith(ja.before.href));assert.ok(ja.after.text.includes(ja.before.title));
 const errors=read(dir+'/console.json').entries.filter(x=>x.url?.startsWith('http://127.0.0.1:8892/')&&x.level==='error');assert.equal(errors.length,0);
 for(const tag of ['green-model-r2-command','build-r4-command'])assert.equal(read(dir+'/'+tag+'.json').exit_code,0);
 assert.equal(read(dir+'/native-timer-red-command.json').exit_code,1);
 const before=read(dir+'/before.json'),allowed=new Set(['chapters-1.jsx','index.html']);
 for(const x of before.sources)if(!allowed.has(x.file))assert.equal(hash(x.file),x.sha256,x.file);
 for(const x of [...before.protected,...before.curation])assert.equal(hash(x.file),x.sha256,x.file);
 const oldRefs=read('holiday-lab/reports/nav-centered-cta-20261024/before.json').refs;
 assert.equal(cp.execFileSync('git',['for-each-ref','--format=%(refname) %(objectname)','refs/heads/main','refs/remotes/origin/main'],{encoding:'utf8'}),oldRefs);
 for(const x of before.curation)assert.equal(hash(site+'/'+x.file),x.sha256);
 const proof=read(dir+'/catalog-proof.json');for(const x of proof.records)assert.equal(hash(x.image),x.imageSha256,x.image);
 const html=fs.readFileSync(site+'/index.html','utf8'),bundle=html.match(/src="(app-[^"]+\.js)"/)[1];assert.ok(html.includes('student-work-draw.css'));
 for(const file of ['student-work-draw.css','data/student-work-draw.json'])assert.equal(hash(site+'/'+file),hash(file));
 const requests=['/','/'+bundle,'/student-work-draw.css','/data/student-work-draw.json',...proof.records.map(x=>'/'+x.image)];const http=[];
 for(const request of requests){const r=await fetch('http://127.0.0.1:8892'+request),b=Buffer.from(await r.arrayBuffer()),sha=crypto.createHash('sha256').update(b).digest('hex');assert.equal(r.status,200,request);assert.equal(sha,hash(site+'/'+(request==='/'?'index.html':request.slice(1))),request);http.push({path:request,status:r.status,bytes:b.length,sha256:sha});}
 assert.ok(!walk(site+'/holiday-lab').some(f=>!before.curation.some(x=>site+'/'+x.file===f)));
 fs.writeFileSync(dir+'/http.json',JSON.stringify({observed_utc:new Date().toISOString(),command:'Node fetch HTTP12 files and compare SHA-256 to frozen build',exit_code:0,results:http},null,2)+'\n',{flag:'wx'});
 const out={observed_utc:new Date().toISOString(),pass:true,site,port:8892,bundle,build_files:walk(site).length,browser_contexts:cases.length,layout_assertions:cases.reduce((n,c)=>n+Object.keys(c.checks).length,0),cases,live_draws:10,exact_routes:8,http_checks:http.length,other_sources_preserved:before.sources.length-allowed.size,protected_preserved:before.protected.length,curation_preserved:before.curation.length,original_image_bytes_preserved:proof.records.length,new_candidate_console_errors:errors.length,main_refs_unchanged:true,public_release:false,limits:['本次是主控窄範圍驗收，沒有新獨立代理全站驗收。','實測手動靜態模式及離屏暫停；系統層prefers-reduced-motion與真實背景分頁未另變更，模型回歸通過不等於這兩項真機驗收。','沒有閃爍儀器量測或完整WCAG認證；預覽每1.8秒換圖，抽選間隔350至800ms，可暫停及立即停格。','既有六項全站資料／字型／來源／WebGL／母語真機限制維持原狀。']};
 fs.writeFileSync(dir+'/result.json',JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(out));
}main().catch(e=>{console.error(e);process.exitCode=1});
