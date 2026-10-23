// Read-only real-input replay verification. No game imports, clock changes or state writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright'),{sampleLayout}=require('../browser-sampler.cjs'),{inspectReport}=require('C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs');
const base='http://127.0.0.1:8847',dir=path.join(__dirname,'runs',new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(dir,{recursive:true});
const assets=JSON.parse(fs.readFileSync(path.join(__dirname,'../asset-safe-regions.json'))),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const timings=[[360,140,360],[240,600,240],[500,140,300]],durations=timings.flat();
const report={date:new Date().toISOString(),base,timings,sampler_function_sha256:hash(sampleLayout.toString()),cases:[],scope:'actual DOM timing, actual elapsed native replay, screenshots and frozen-sampler evidence; not full delivery clearance'};
const save=()=>fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));
async function receipt(){const names=['runner.mjs','replay-model.mjs','lab.css','catalog.mjs','games/new-year.mjs',...['actor1.png','actor2.png','actor3.png','prop2.png','target.png'].map(f=>'assets/new-year/'+f)],r={};for(const name of names){const x=await fetch(base+'/holiday-lab/'+name);assert.ok(x.ok);r[name]=hash(Buffer.from(await x.arrayBuffer()));}return r;}
async function input(p,id,value){await p.locator('#'+id).fill(String(value));await p.locator('#'+id).dispatchEvent('input');}
async function watch(p){return p.evaluate(()=>{
 const events=[];let running=true;
 const tick=()=>{if(!running)return;const s=document.querySelector('#replay-stage'),c=document.querySelector('#replay-caption');if(s&&c){const r=s.getBoundingClientRect(),q=c.getBoundingClientRect();events.push({now:performance.now(),epoch:performance.timeOrigin+performance.now(),shot:Number(s.dataset.shot),caption:c.textContent,visible:!document.hidden,stage:{x:r.x,y:r.y,w:r.width,h:r.height},captionRect:{x:q.x,y:q.y,w:q.width,h:q.height},sprites:[...s.querySelectorAll('img')].map(n=>({src:n.getAttribute('src'),style:n.getAttribute('style'),complete:n.complete,naturalWidth:n.naturalWidth}))});}requestAnimationFrame(tick);};
 requestAnimationFrame(tick);window.__min140ReadOnlyObserver={stop:()=>{running=false;return events;},events};return true;
});}
async function run(browser,lang,width){const row={lang,width,status:'running',pageErrors:[],consoleErrors:[],samples:[]};report.cases.push(row);save();const context=await browser.newContext({viewport:{width,height:width===320?900:1000},reducedMotion:'no-preference'}),p=await context.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>row.pageErrors.push(e.message));p.on('console',m=>{if(m.type()==='error')row.consoleErrors.push(m.text());});
try{
 await p.goto(base+'/holiday-lab/?game=new-year&lang='+lang,{waitUntil:'networkidle'});await p.locator('#intro-skip').click();await p.locator('#start-game').click();
 for(const [i,values]of timings.entries()){if(i===2)await p.locator('#ny-focus-0').click();for(const [j,v]of values.entries())await input(p,'ny-hold-'+j,v);await p.locator('#ny-preview').click();await p.waitForTimeout(values.reduce((a,b)=>a+b,0)+220);await p.locator('#ny-submit').click();}
 await p.locator('#result-score').waitFor();row.artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.deepEqual(row.artifact.takes.map(t=>t.timing),timings);assert.equal(row.artifact.takes[2].focus,'launch');assert.match(await p.locator('#result-score').textContent(),/100/);
 await watch(p);await p.locator('#play-result').click();await p.locator('#replay-stage').scrollIntoViewIfNeeded();
 await p.waitForFunction(()=>new Set(window.__min140ReadOnlyObserver.events.map(e=>e.shot)).size===9);await p.waitForTimeout(1250);
 row.observation=await p.evaluate(()=>window.__min140ReadOnlyObserver.stop());row.seen=[...new Set(row.observation.map(e=>e.shot))];assert.deepEqual([...row.seen].sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
 row.observedIntervals=[];let start=null;for(const e of row.observation){if(!start||e.shot!==start.shot){if(start)row.observedIntervals.push({shot:start.shot,start:start.now,end:e.now,duration:e.now-start.now,input:durations[start.shot],caption:start.caption});start=e;}}
 for(const s of [1,7]){const points=row.observation.filter(e=>e.shot===s);assert.ok(points.length>=2,'140ms phase has multiple actual native frames');assert.ok(points.every(e=>e.caption.includes('140')));assert.ok(new Set(points.map(e=>e.sprites[0]?.style)).size>1,'140ms airborne pose moves');}
 assert.ok(row.observation.every(e=>e.visible));assert.ok(row.observation.every(e=>e.sprites.every(s=>s.complete&&s.naturalWidth>0)));
 const cdp=await context.newCDPSession(p);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 // Each fresh replay keeps all original durations. Only sampling target changes.
 for(const target of [0,1,2,3,4,5,6,7,8]){
  await p.locator('#replay-back').click();await p.locator('#play-result').click();await p.locator('#replay-stage').scrollIntoViewIfNeeded();
  await p.waitForFunction(n=>Number(document.querySelector('#replay-stage')?.dataset.shot)===n,target,{polling:'raf'});
  const sample=await p.evaluate(async({source,assets})=>{const begin=performance.now(),fn=(0,eval)('('+source+')'),r=await fn({assets});return {...r,started:begin,ended:performance.now()};},{source:sampleLayout.toString(),assets});
  const before=await p.evaluate(()=>({shot:Number(document.querySelector('#replay-stage').dataset.shot),caption:document.querySelector('#replay-caption').textContent}));
  const clip=await p.evaluate(()=>{const rs=['#replay-stage','#replay-caption'].map(s=>document.querySelector(s).getBoundingClientRect()),x=Math.min(...rs.map(r=>r.x))+scrollX,y=Math.min(...rs.map(r=>r.y))+scrollY;return{x,y,width:Math.max(...rs.map(r=>r.right))+scrollX-x,height:Math.max(...rs.map(r=>r.bottom))+scrollY-y,scale:1};});
  const capture=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:78,clip,captureBeyondViewport:true}),file=`${lang}-${width}-shot-${target}.jpg`;fs.writeFileSync(path.join(dir,file),Buffer.from(capture.data,'base64'));
  const after=await p.evaluate(()=>({shot:Number(document.querySelector('#replay-stage').dataset.shot),caption:document.querySelector('#replay-caption').textContent}));
  const stable=[sample.evidence.replay_shot_start,sample.evidence.replay_shot_end,String(before.shot),String(after.shot)].every(s=>String(s)===String(target));
  const checked=inspectReport({schema_version:1,source_fingerprints:{},cases:[{id:'min140/'+lang+'/shot-'+target,width,height:width===320?900:1000,nodes:sample.nodes,blockers:sample.blockers}]});
  row.samples.push({target,stable,before,after,file,screenshot_sha256:hash(fs.readFileSync(path.join(dir,file))),sample,geometry_errors:checked});save();
 }
 assert.deepEqual(row.pageErrors,[]);assert.deepEqual(row.consoleErrors,[]);row.status='native-replay-verified';row.stable_samples=row.samples.filter(s=>s.stable).length;row.geometry_errors=row.samples.filter(s=>s.stable).reduce((a,s)=>a+s.geometry_errors.length,0);
 console.log(`YES ${lang}/${width}: DOM saved 140ms; 9 native shots; 140ms moving frames observed; stable ink/screenshots ${row.stable_samples}/9; geometry ${row.geometry_errors}`);
}catch(e){row.status='fail';row.failure=e.stack;console.log('NO '+lang+'/'+width+' '+e.message);}finally{await context.close();save();}}
(async()=>{let browser;try{report.before=await receipt();browser=await chromium.launch({headless:true});for(const lang of ['ja'])for(const width of [320,1440])await run(browser,lang,width);report.after=await receipt();assert.deepEqual(report.after,report.before);report.source_stable=true;report.native_pass=report.cases.filter(c=>c.status==='native-replay-verified').length;report.status=report.native_pass===2?'native-replay-verified-layout-separate':'failed';}catch(e){report.fatal=e.stack;report.status='failed';}finally{await browser?.close();save();fs.writeFileSync(path.join(__dirname,'latest.json'),JSON.stringify({run:path.relative(__dirname,dir).replaceAll('\\','/'),status:report.status,native_pass:report.native_pass},null,2));console.log('EVIDENCE '+dir);process.exitCode=report.status==='failed'?1:0;}})();
