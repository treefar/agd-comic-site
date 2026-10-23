// Native input/replay first; separately labelled typography-only boundary probes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright');
const samplerPath='C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/browser-sampler.cjs';
const {sampleLayout}=require(samplerPath),assets=JSON.parse(fs.readFileSync('C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/asset-safe-regions.json'));
const base=process.env.CAPTION_BASE||'http://127.0.0.1:8845',expected=process.env.CAPTION_EXPECT||'軽やかに越える',name=process.argv[2]||'red';
const out=path.join(__dirname,name);assert.ok(!fs.existsSync(out),'retain prior evidence; choose fresh directory');fs.mkdirSync(out);
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const report={base,expected,started:new Date().toISOString(),samplerSHA:hash(fs.readFileSync(samplerPath)),cases:[]};
function save(){fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));}
async function receipt(){const r={};for(const f of ['runner.mjs','replay-model.mjs','lab.css','games/new-year.mjs']){const a=await fetch(base+'/holiday-lab/'+f);assert.ok(a.ok);r[f]=hash(Buffer.from(await a.arrayBuffer()));}return r;}
async function textLines(p){return p.locator('#replay-caption').evaluate(el=>{const lines=[];const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;let offset=0;for(const ch of n.textContent){const r=document.createRange();r.setStart(n,offset);offset+=ch.length;r.setEnd(n,offset);const b=r.getBoundingClientRect();let l=lines.find(l=>Math.abs(l.y-b.y)<1);if(!l){l={y:b.y,text:'',rects:[]};lines.push(l);}l.text+=ch;l.rects.push({x:b.x,y:b.y,width:b.width,height:b.height});}}const b=el.getBoundingClientRect();return {text:el.textContent,lines,orphan:lines.length>1&&Array.from(lines.at(-1).text.trim()).length===1,owner:{x:b.x,y:b.y,width:b.width,height:b.height},horizontalOverflow:document.documentElement.scrollWidth>innerWidth};});}
async function sample(p){return p.evaluate(async({source,assets})=>await (0,eval)('('+source+')')({assets}),{source:sampleLayout.toString(),assets});}
async function run(browser,width){const row={width,native:[],boundary:[],pageErrors:[]};report.cases.push(row);const ctx=await browser.newContext({viewport:{width,height:1000}}),p=await ctx.newPage();p.on('pageerror',e=>row.pageErrors.push(e.message));p.setDefaultTimeout(15000);
try{await p.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window),pending=new Set();window.requestAnimationFrame=fn=>{const id=raf(t=>{pending.delete(id);fn(t);});pending.add(id);return id;};window.__freezeNativeReplay=()=>{for(const id of pending)cancel(id);pending.clear();window.requestAnimationFrame=raf;};});await p.goto(base+'/holiday-lab/?game=new-year&lang=ja',{waitUntil:'networkidle'});await p.locator('#intro-skip').click();await p.locator('#start-game').click();
 const timings=[[360,140,360],[240,600,240],[700,140,300]];
 for(const [i,values]of timings.entries()){if(i===2)await p.locator('#ny-focus-0').click();for(const [j,value]of values.entries()){await p.locator('#ny-hold-'+j).fill(String(value));await p.locator('#ny-hold-'+j).dispatchEvent('input');}await p.locator('#ny-preview').click();await p.waitForTimeout(values.reduce((a,b)=>a+b)+250);await p.locator('#ny-submit').click();}
 await p.locator('#result-score').waitFor();row.artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.deepEqual(row.artifact.takes.map(t=>t.timing),timings);
 await p.locator('#play-result').click();await p.locator('#replay-caption').scrollIntoViewIfNeeded();
 for(let shot=0;shot<9;shot++){await p.waitForFunction(n=>Number(document.querySelector('#replay-stage')?.dataset.shot)===n,shot,{polling:'raf'});row.native.push({shot,...await textLines(p)});}
 assert.ok(row.native.slice(0,3).every(x=>x.text.endsWith(expected)));
 // Pause already-pending native RAF, then restore native RAF so the sampler can settle.
 // Product buildResult supplies these labels. Invalid timing vectors below are typography fixtures,
 // not successful playable works; 700ms flight is intentionally not claimed valid for brief 1.
 const captions=await p.evaluate(async()=>{const {buildResult}=await import('./games/new-year.mjs');return [140,350,700].flatMap(value=>buildResult({done:true,takes:[{timing:[value,value,value],focus:'quick'},{timing:[240,600,240],focus:'flight'},{timing:[700,140,300],focus:'launch'}]}).replay.slice(0,3).map((s,phase)=>({value,phase,text:s.caption.ja})));});
 await p.evaluate(()=>window.__freezeNativeReplay());row.frozenAt=await p.locator('#replay-stage').getAttribute('data-shot');
 for(const target of captions){await p.locator('#replay-caption').evaluate((e,t)=>e.textContent=t,target.text);const measured=await textLines(p),s=await sample(p);const nodes=s.nodes.filter(n=>n.owner==='replay-caption');
  const violations=[];for(const n of nodes){const a=n.ink,b=n.safe;if(a.x<b.x-.01||a.y<b.y-.01||a.x+a.width>b.x+b.width+.01||a.y+a.height>b.y+b.height+.01)violations.push(n);}
  const file=`ja-${width}-${target.value}-${target.phase}.png`;await p.screenshot({path:path.join(out,file)});row.boundary.push({...target,...measured,nodes,violations,screenshot:file});save();}
 row.targetPass=row.boundary.every(x=>!x.orphan&&!x.horizontalOverflow&&x.violations.length===0&&x.nodes.length>0);assert.deepEqual(row.pageErrors,[]);console.log(`${row.targetPass?'YES':'NO'} ja/${width} native9 typography9 orphan${row.boundary.filter(x=>x.orphan).length} inkOutside${row.boundary.reduce((n,x)=>n+x.violations.length,0)}`);
}catch(e){row.failure=e.stack;console.log('ERROR '+width+' '+e.stack);}finally{await ctx.close();save();}}
(async()=>{let browser;try{report.before=await receipt();browser=await chromium.launch({headless:true});for(const width of [320,1440])await run(browser,width);report.after=await receipt();assert.deepEqual(report.before,report.after);report.sourceStable=true;report.pass=report.cases.every(r=>r.targetPass&&!r.failure);console.log('PASS '+report.pass);}catch(e){report.fatal=e.stack;}finally{await browser?.close();save();process.exitCode=report.pass?0:1;}})();
