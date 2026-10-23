// A real, elapsed listening interval; no game imports, clock control or state writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'))('playwright');
const {sampleLayout}=require('../browser-sampler.cjs'),{inspectReport}=require('C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs');
const base='http://127.0.0.1:8845',dir=path.join(__dirname,'runs',new Date().toISOString().replace(/[:.]/g,'-')),assets=JSON.parse(fs.readFileSync(path.join(__dirname,'../asset-safe-regions.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');fs.mkdirSync(dir,{recursive:true});
const expected={zh:'正在聆聽，讓閱讀框先停留。',en:'Listening. Keep the reading frame still.',ja:'聴いています。枠をそのままに。'};
const files=['runner.mjs','catalog.mjs','lab.css','replay-model.mjs','games/peace-memory.mjs',...fs.readdirSync('holiday-lab/assets/peace-memory').map(f=>'assets/peace-memory/'+f),...fs.readdirSync('holiday-lab/assets/ui').map(f=>'assets/ui/'+f)];
const report={base,date:new Date().toISOString(),sampler_sha256:sha(sampleLayout.toString()),cases:[],full_project_approved:false,scope:'Actual active listening is the functional preview state; no separate preview button exists. Raw method flags remain unclosed.'};
const save=()=>fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));
async function receipts(){const r={};for(const f of files){const x=await fetch(base+'/holiday-lab/'+f);assert.ok(x.ok,f);r[f]=sha(Buffer.from(await x.arrayBuffer()));}return r;}
async function input(p,id,v){await p.locator('#'+id).fill(String(v));await p.locator('#'+id).dispatchEvent('input');}
let browser;
(async()=>{try{report.before=await receipts();browser=await chromium.launch({headless:true});for(const lang of ['zh','en','ja'])for(const width of [320,1440]){
 const context=await browser.newContext({viewport:{width,height:width===320?900:1000},reducedMotion:'no-preference'}),p=await context.newPage(),row={lang,width,page_errors:[]};report.cases.push(row);save();
 p.on('pageerror',e=>row.page_errors.push(e.message));try{
 await p.goto(base+'/holiday-lab/?game=peace-memory&lang='+lang,{waitUntil:'networkidle'});await p.locator('#intro-skip').click();await p.locator('#start-game').click();
 await p.locator('#peace-person-0').click();await input(p,'peace-x',20);await input(p,'peace-y',65);await input(p,'peace-width',24);
 const cdp=await context.newCDPSession(p);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 await p.locator('#peace-listen').click();await p.waitForFunction(text=>document.querySelector('#peace-status')?.textContent===text,expected[lang],{polling:'raf'});await p.locator('#peace-status').scrollIntoViewIfNeeded();
 row.before=await p.evaluate(()=>({status:document.querySelector('#peace-status').textContent,progress:document.querySelector('#game-progress').dataset.current,time:performance.now()}));
 row.sample=await p.evaluate(async({source,assets})=>await(0,eval)('('+source+')')({assets}),{source:sampleLayout.toString(),assets});
 const status=p.locator('#peace-status');await status.scrollIntoViewIfNeeded();row.screenshot='listening-'+lang+'-'+width+'.png';await p.screenshot({path:path.join(dir,row.screenshot),fullPage:false});row.screenshot_sha256=sha(fs.readFileSync(path.join(dir,row.screenshot)));
 row.after=await p.evaluate(()=>({status:document.querySelector('#peace-status').textContent,progress:document.querySelector('#game-progress').dataset.current,time:performance.now()}));
 row.full_case={id:'peace-memory/'+lang+'/game/preview',width,height:width===320?900:1000,nodes:row.sample.nodes,blockers:row.sample.blockers};row.geometry_errors=inspectReport({schema_version:1,source_fingerprints:{},cases:[row.full_case]});
 assert.equal(row.before.status,expected[lang]);assert.equal(row.after.status,expected[lang]);assert.equal(row.before.progress,'0');assert.equal(row.after.progress,'0');assert.deepEqual(row.geometry_errors,[]);
 await p.waitForFunction(()=>document.querySelector('#game-progress')?.dataset.current==='1',null,{timeout:6000});row.natural_completion=await p.locator('#peace-status').textContent();row.status='pass';assert.deepEqual(row.page_errors,[]);
 console.log('PREVIEW '+lang+'/'+width+' stable actual listening; geometry0; natural completion observed');
 }catch(e){row.status='no';row.error=e.stack;console.log('NO '+lang+'/'+width+' '+e.message);}finally{await context.close();save();}
 }report.after=await receipts();assert.deepEqual(report.before,report.after);report.source_stable=true;report.pass=report.cases.length===6&&report.cases.every(c=>c.status==='pass');
 }catch(e){report.fatal=e.stack;report.pass=false;}finally{await browser?.close();save();fs.writeFileSync(path.join(__dirname,'latest.json'),JSON.stringify({run:path.relative(__dirname,dir),pass:report.pass},null,2));console.log('DONE '+report.cases.filter(c=>c.status==='pass').length+'/6 '+dir);process.exitCode=report.pass?0:1;}})();
