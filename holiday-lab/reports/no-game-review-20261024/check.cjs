// Verify the website-only review without opening or testing frozen games.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process');
const here=__dirname,root=path.resolve(here,'../../..');process.chdir(root);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const old=require('../legacy-reader-review-20261024/verification.json');
const beforeFile=path.join(here,'before.json'),mode=process.argv[2];
const section='          <section className="chapter" id="student-play" aria-labelledby="student-play-title">\r\n            <div className="container"><HolidayHome placement="games" /></div>\r\n          </section>\r\n';
if(mode==='snapshot'){
 const sources=old.sources.filter(x=>!x.file.startsWith('holiday-lab/reports/')&&!x.file.startsWith('.measure-'));
 const protectedFiles=['holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md','holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md','holiday-lab/layout-qa/phase-latest.json','holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md','holiday-lab/layout-qa/layout-report.json'];
 const assets=walk('images').concat(walk('holiday-lab/assets'),walk('holiday-lab/games'),walk('holiday-lab/audio'));
 const b={observed_utc:new Date().toISOString(),app:fs.readFileSync('app.jsx','utf8'),sources:sources.map(x=>({file:x.file,sha256:hash(x.file)})),protected:protectedFiles.concat(assets).map(file=>({file,sha256:hash(file)})),main:cp.execFileSync('git',['for-each-ref','--format=%(refname) %(objectname)','refs/heads/main','refs/remotes/origin/main'],{encoding:'utf8'}),handoff:fs.readFileSync('C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md','utf8')};
 fs.writeFileSync(beforeFile,JSON.stringify(b,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({snapshot:true,sources:b.sources.length,protected:b.protected.length}));
}else if(mode==='apply'){
 const b=JSON.parse(fs.readFileSync(beforeFile));assert.equal(fs.readFileSync('app.jsx','utf8'),b.app);assert.equal(b.app.split(section).length,2);fs.writeFileSync('app.jsx',b.app.replace(section,''));console.log('Removed only the homepage game section; game files retained.');
}else if(mode==='verify'){
 const b=JSON.parse(fs.readFileSync(beforeFile));const current=fs.readFileSync('app.jsx','utf8');assert.equal(current,b.app.replace(section,''));assert.ok(!current.includes('id="student-play"'),'homepage game section must be absent');
 for(const s of b.sources)if(s.file!=='app.jsx')assert.equal(hash(s.file),s.sha256,s.file);
 for(const s of b.protected)assert.equal(hash(s.file),s.sha256,s.file);
 assert.equal(cp.execFileSync('git',['for-each-ref','--format=%(refname) %(objectname)','refs/heads/main','refs/remotes/origin/main'],{encoding:'utf8'}),b.main);
 const h=fs.readFileSync('C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md','utf8');const c=t=>{const i=t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(i>=0);const s=t.slice(i),n=s.slice(1).search(/\r?\n## /);return n<0?s:s.slice(0,n+1)};assert.equal(c(h),c(b.handoff));
 const out=process.argv[3];if(out){const html=fs.readFileSync(path.join(out,'index.html'),'utf8');assert.ok(!html.includes('id="student-play"'));assert.ok(!fs.existsSync(path.join(out,'holiday-lab')),'game runtime must not be copied');for(const id of ['hero','news','about','works','faculty','labs','join','contact'])assert.ok(html.includes('id="'+id+'"'),id);}
 console.log(JSON.stringify({pass:true,only_product_change:'remove homepage play section',other_sources_preserved:b.sources.length-1,protected_files_preserved:b.protected.length,main_and_c_preserved:true,build:out||null,game_runtime_in_build:out?false:null}));
}else throw Error('snapshot | apply | verify [build]');
