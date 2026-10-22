const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
test('English sections are shipped without game routes or files',()=>{
 const src=fs.readFileSync('en-pages.jsx','utf8');
 for(const slug of ['intro','highlights','faculty','curriculum','labs','works','visit']) assert.ok(src.includes('"'+slug+'"'),slug);
 assert.doesNotMatch(src,/PlayZone|PlayCard|Play Zone|slug: "play"|data\/play|case "play"/);
 assert.equal(fs.existsSync('play'),false); assert.equal(fs.existsSync('data/play.json'),false);
});
test('Existing Chinese site and production behavior remain unchanged',()=>{
 for(const f of ['app.jsx','comic-components.jsx','chapters-1.jsx','chapters-2.jsx','styles.css',...fs.readdirSync('data').filter(x=>x.endsWith('.json')).map(x=>'data/'+x)]) {
 const base=cp.execFileSync('git',['show','49adae7acf4d2daddaebd61d741380f4a663029b:'+f]);
 assert.equal(fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n').replaceAll(' · 電競娛樂系代理主任',''),base.toString().replace(/\r\n/g,'\n').replaceAll(' · 電競娛樂系代理主任',''),f);
 }
});
test('English intro navigation and build include all seven sections',()=>{
 assert.match(fs.readFileSync('pages.jsx','utf8'),/<EnSubNav current="intro"/);
 assert.match(fs.readFileSync('scripts/build.mjs','utf8'),/"en-pages.jsx"/);
 assert.match(fs.readFileSync('index.html','utf8'),/src="en-pages.jsx/);
});
test('English local media point to existing production assets',()=>{
 const path=require('node:path');
 function check(value){
  if(typeof value==='string' && /^images\//.test(value)) assert.ok(fs.existsSync(value),value);
  else if(Array.isArray(value)) value.forEach(check);
  else if(value && typeof value==='object') Object.values(value).forEach(check);
 }
 for(const file of fs.readdirSync('data/en')) check(JSON.parse(fs.readFileSync(path.join('data/en',file),'utf8')));
});
test('Production bundle contains no game assets or private acceptance files',()=>{
 assert.ok(fs.existsSync('dist/index.html'),'run npm run build first');
 for(const p of ['dist/play','dist/data/play.json','dist/tests','dist/LATEST_HANDOFF.md']) assert.equal(fs.existsSync(p),false,p);
});
