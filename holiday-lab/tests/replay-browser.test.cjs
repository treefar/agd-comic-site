// Regression through real controls. Baseline mode serves the prior renderer only.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process'),{createRequire}=require('node:module'),{createHash}=require('node:crypto');
const dep=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=dep('playwright');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'holiday-lab/reports/replay-fix-evidence');fs.mkdirSync(out,{recursive:true});
const baseline=process.env.REPLAY_BASELINE==='1',base=process.env.REPLAY_BASE_URL||'http://127.0.0.1:8803';
const report={at:new Date().toISOString(),baseline,base,cases:[],errors:[],limitations:['Visibility regression uses a simulated document.hidden signal, not a real background tab.','Automated DOM playthrough is not a student blind test or user artwork approval.']};
let server,browser;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function range(p,id,v){await p.locator('#'+id).fill(String(v));await p.locator('#'+id).dispatchEvent('input');}
async function open(id,lang='zh',width=1440){
 const c=await browser.newContext({viewport:{width,height:1000}});
 await c.addInitScript(()=>{
  window.__replayMedia=[];const play=HTMLMediaElement.prototype.play,pause=HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play=function(...args){const item={type:'play',src:this.src,at:performance.now(),shot:document.querySelector('#replay-stage')?.dataset.shot,started:false};window.__replayMedia.push(item);const promise=play.apply(this,args);promise?.then(()=>{item.started=true;},e=>{item.error=e.message;});return promise;};
  HTMLMediaElement.prototype.pause=function(...args){window.__replayMedia.push({type:'pause',src:this.src,at:performance.now()});return pause.apply(this,args);};
 });
 const p=await c.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 if(baseline){const old=execFileSync('git',['show',`${process.env.REPLAY_BASELINE_REF||'1f7ad61'}:holiday-lab/runner.mjs`],{cwd:root,encoding:'utf8'});await p.route('**/holiday-lab/runner.mjs',route=>route.fulfill({body:old,contentType:'text/javascript'}));}
 await p.goto(`${base}/holiday-lab/?game=${id}&lang=${lang}`,{waitUntil:'networkidle'});await p.locator('#intro-skip').click();await p.locator('#start-game').click();await p.locator('#game-controls button').first().waitFor();return {p,c};
}
async function check(name,fn){const c={name,pass:false};report.cases.push(c);try{await fn(c);c.pass=true;console.log(`YES ${name}`);}catch(e){c.error=e.stack;console.log(`NO ${name}: ${e.message}`);}}
(async()=>{
 try{
  if(!process.env.REPLAY_BASE_URL){server=spawn(process.execPath,['holiday-lab/serve-review.mjs',process.env.REPLAY_BUILD_DIR||'.', '8803'],{cwd:root,stdio:['ignore','pipe','pipe'],windowsHide:true});let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);for(let i=0;i<50;i++){if(server.exitCode!==null)throw Error(`Test server stopped: ${log}`);try{const r=await fetch(`${base}/holiday-lab/runner.mjs`);if(r.ok)break;}catch{}await wait(100);}report.server={pid:server.pid,log};}
  report.runtimeSha256={};for(const file of ['runner.mjs','replay-model.mjs','lab.css']){const r=await fetch(`${base}/holiday-lab/${file}`);assert.ok(r.ok);report.runtimeSha256[file]=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');}
  browser=await chromium.launch({headless:true});report.browser=await browser.version();
  await check('children replay plays wood, metal and paper at the saved cues',async row=>{
   const {p,c}=await open('children');try{
    await p.locator('#audio-toggle').click();
    for(const [i,cue]of [750,1200,1700].entries()){await p.locator(`#children-material-${i}`).click();await range(p,'children-cue',cue);await p.locator('#children-preview').click();await p.waitForTimeout(2700);await p.locator('#children-save').click();}
    await p.locator('#result-score').waitFor();row.artifact=JSON.parse(await p.locator('#result-artifact').textContent());
    const count=await p.evaluate(()=>window.__replayMedia.length);await p.locator('#play-result').click();
    await p.waitForFunction(()=>window.__replayMedia.some(x=>x.type==='play'&&x.shot==='0'&&x.src.endsWith('/wood.ogg')&&x.started),{},{timeout:2000});
    await p.evaluate(()=>{window.__testHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__testHidden});document.dispatchEvent(new Event('visibilitychange'));});
    const hiddenAudio=await p.evaluate(()=>window.__replayMedia);assert.ok(hiddenAudio.some(x=>x.type==='pause'&&x.src.endsWith('/wood.ogg')));const hiddenPlayCount=hiddenAudio.filter(x=>x.type==='play').length;
    await p.waitForTimeout(1100);assert.equal(await p.evaluate(()=>window.__replayMedia.filter(x=>x.type==='play').length),hiddenPlayCount);row.simulatedHiddenStopsSound=true;
    await p.evaluate(()=>{window.__testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});
    await p.waitForFunction(()=>window.__replayMedia.filter(x=>x.type==='play'&&x.shot!==undefined&&/\/(wood|metal|paper)\.ogg$/.test(x.src)&&x.started).length>=3,{},{timeout:10000});
    row.replayAudio=(await p.evaluate(()=>window.__replayMedia)).slice(count).filter(x=>x.type==='play');
    for(const [i,kind]of ['wood','metal','paper'].entries())assert.ok(row.replayAudio.some(x=>x.src.endsWith(`/${kind}.ogg`)&&x.shot===String(i)&&x.started),`${kind} decoded playback in shot ${i}`);
    await p.locator('#replay-back').click();const before=await p.evaluate(()=>window.__replayMedia.filter(x=>x.type==='play').length);await p.waitForTimeout(2100);assert.equal(await p.evaluate(()=>window.__replayMedia.filter(x=>x.type==='play').length),before);row.exitStopsReplay=true;
   }finally{await c.close();}
  });
  await check('mid-autumn replay interpolates saved motion and pauses on hidden signal',async row=>{
   const {p,c}=await open('mid-autumn');try{
    for(const[t,x,size]of [[900,21.5,20],[1200,38,26],[750,56.5,18]]){await range(p,'ma-time',t);await range(p,'ma-x',x);await range(p,'ma-size',size);await p.locator('#ma-preview').click();await p.waitForTimeout(t+200);await p.locator('#ma-submit').click();}
    await p.locator('#result-score').waitFor();row.artifact=JSON.parse(await p.locator('#result-artifact').textContent());await p.locator('#play-result').click();
    const sample=()=>p.locator('#replay-stage').evaluate(e=>({shot:e.dataset.shot,left:parseFloat(e.querySelector('img').style.left)}));
    row.first=await sample();await p.waitForTimeout(280);row.moving=await sample();assert.equal(row.first.shot,'0');assert.equal(row.moving.shot,'0');assert.ok(row.moving.left>row.first.left+1,`must move within shot: ${row.first.left} -> ${row.moving.left}`);
    await p.evaluate(()=>{window.__testHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__testHidden});document.dispatchEvent(new Event('visibilitychange'));});
    row.hiddenBefore=await sample();await p.waitForTimeout(1100);row.hiddenAfter=await sample();assert.deepEqual(row.hiddenBefore,row.hiddenAfter);
    await p.evaluate(()=>{window.__testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await p.waitForTimeout(100);row.resumed=await sample();assert.equal(row.resumed.shot,'0');assert.ok(row.resumed.left-row.hiddenAfter.left<4,'no hidden-time catch-up');
    await p.waitForFunction(()=>document.querySelector('#replay-stage')?.dataset.shot==='1',{},{timeout:1500});row.afterCut=await sample();assert.equal(row.afterCut.left,row.artifact.cuts[0].endX);
    await p.screenshot({path:path.join(out,baseline?'baseline-mid-autumn.png':'mid-autumn.png'),fullPage:true});
   }finally{await c.close();}
  });
  await check('constitution replay keeps actual multiline captions and resizes their saved type',async row=>{
   const {p,c}=await open('constitution','ja',1440);try{
    for(const font of [18,20,18]){await range(p,'caption-font',font);await range(p,'caption-duration',6);await range(p,'caption-x',50);await range(p,'caption-y',78);await p.locator('#caption-lines-1').click();await p.locator('#caption-tone-0').click();await p.locator('#caption-preview').click();await p.waitForTimeout(6200);await p.locator('#caption-save').click();}
    await p.locator('#result-score').waitFor();row.artifact=JSON.parse(await p.locator('#result-artifact').textContent());await p.locator('#play-result').click();
    await p.locator('.replay-text').waitFor({timeout:1500});
    const measure=()=>p.locator('.replay-text').evaluate(n=>({words:n.textContent,fontSize:parseFloat(getComputedStyle(n).fontSize),stageWidth:n.parentElement.clientWidth,left:n.style.left,top:n.style.top,whiteSpace:getComputedStyle(n).whiteSpace,rect:{width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height},overflow:n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1}));
    row.desktop=await measure();const saved=row.artifact.captions[0];assert.equal(row.desktop.words,saved.words.ja);assert.equal(row.desktop.left,`${saved.x}%`);assert.equal(row.desktop.top,`${saved.y}%`);assert.equal(row.desktop.whiteSpace,'pre-line');assert.equal(row.desktop.overflow,false);assert.ok(Math.abs(row.desktop.fontSize-saved.font*row.desktop.stageWidth/saved.stageWidth)<.1);
    await p.setViewportSize({width:390,height:844});await p.waitForTimeout(100);row.mobile=await measure();assert.ok(row.mobile.fontSize<row.desktop.fontSize);assert.ok(Math.abs(row.mobile.fontSize-Math.max(16,saved.font*row.mobile.stageWidth/saved.stageWidth))<.1);assert.equal(row.mobile.overflow,false);
    await p.screenshot({path:path.join(out,'constitution-mobile-ja.png'),fullPage:true});row.allCaptions=[row.mobile.words];
    for(let i=1;i<3;i++){await p.waitForFunction(n=>document.querySelector('#replay-stage')?.dataset.shot===String(n),i,{timeout:7000});const sample=await measure();assert.equal(sample.words,row.artifact.captions[i].words.ja);assert.equal(sample.overflow,false);assert.ok(sample.fontSize>=16);row.allCaptions.push(sample.words);}
    await p.locator('#replay-back').click();assert.equal(await p.locator('.replay-text').count(),0);await p.setViewportSize({width:1440,height:1000});row.exitRemovesText=true;
   }finally{await c.close();}
  });
 }catch(e){report.errors.push(e.stack);console.error(e);}
 finally{await browser?.close();if(server&&server.exitCode===null)server.kill();report.pass=report.cases.length===3&&report.cases.every(x=>x.pass)&&!report.errors.length;fs.writeFileSync(path.join(out,baseline?'red.json':'green.json'),JSON.stringify(report,null,2));console.log(`TOTAL ${report.cases.filter(x=>x.pass).length}/${report.cases.length}; page errors ${report.errors.length}`);process.exitCode=report.pass?0:1;}
})();
