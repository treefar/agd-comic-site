/* Real DOM regression: never imports a game rule or calls ctx.complete. */
const {createRequire}=require('node:module');
const {mkdirSync,writeFileSync,readFileSync,existsSync}=require('node:fs');
const {join}=require('node:path');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const requireBundled=createRequire('C:/Users/treef/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=requireBundled('playwright');
const base=process.env.HOLIDAY_QA_URL||'http://127.0.0.1:8800';
const newYearMatrix=process.env.HOLIDAY_QA_NEWYEAR_MATRIX==='1';
const out=newYearMatrix?join(__dirname,'../reports/new-year-choice/integration-'+new Date().toISOString().replace(/[:.]/g,'-')):__dirname,shots=join(out,'screenshots');mkdirSync(shots,{recursive:true});
const runId=new Date().toISOString().replace(/[:.]/g,'-');
const summary={runId,url:base,method:'headless Chromium, real DOM buttons/ranges, no direct game imports or state mutation',cases:[],errors:[],status:'running'};
if(existsSync(join(out,'playthrough.json'))){const previous=JSON.parse(readFileSync(join(out,'playthrough.json'),'utf8'));const history=previous.previousRuns||[];delete previous.previousRuns;summary.previousRuns=[...history,previous];}
function persist(){writeFileSync(join(out,'playthrough.json'),JSON.stringify(summary,null,2)+'\n');}
const ids=['new-year','lunar-new-year','lantern','children','dragon-boat','mid-autumn','teachers','national-day','semester','exhibition'];
const wrong={'new-year':'ny-submit','lunar-new-year':'lny-submit',lantern:'lan-check',children:'children-save','dragon-boat':'fold-commit','mid-autumn':'ma-submit',teachers:'teachers-save','national-day':'island-capture',semester:'semester-visit',exhibition:'exhibition-save'};
const touchPages=new WeakSet();
const keyboardPages=new WeakSet();
async function tabTo(p,id){for(let n=0;n<100;n++){if(await p.evaluate(()=>document.activeElement?.id)===id)return;await p.keyboard.press('Tab');}throw Error('Tab cannot reach '+id);}
async function click(p,id){const loc=p.locator('#'+id);if(keyboardPages.has(p)){await tabTo(p,id);await p.keyboard.press('Enter');}else if(touchPages.has(p)){await loc.scrollIntoViewIfNeeded();const b=await loc.boundingBox();assert.ok(b,'touch target exists');await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await loc.click();}
async function range(p,id,value){const e=p.locator('#'+id);if(keyboardPages.has(p)){await tabTo(p,id);await p.keyboard.press('Home');for(let n=0;n<(value-80)/10;n++)await p.keyboard.press('ArrowRight');assert.equal(Number(await e.inputValue()),value);}else{await e.fill(String(value));await e.dispatchEvent('input');}}
async function choice(p,id,index){await click(p,`${id}-${index}`);}
async function progress(p){return (await p.locator('#game-progress').textContent()).replace(/\s/g,'');}
async function initialFailure(p,id){const before=await progress(p);await click(p,wrong[id]);assert.equal(await p.locator('#result-score').count(),0,'wrong initial action cannot produce result');assert.equal(await progress(p),before,'wrong initial action cannot advance');}
async function solve(p,id,variant=false){
 if(id==='new-year'){
  const takes=variant?[[560,240,400],[320,680,300],[220,240,620]]:[[360,180,360],[240,600,240],[600,220,260]],focus=variant?2:0;
  for(const [round,v] of takes.entries()){
   assert.equal(await p.locator('#ny-focus').isVisible(),round===2,'intent choice belongs to third brief');
   if(round===2)await choice(p,'ny-focus',focus);
   for(let i=0;i<3;i++)await range(p,`ny-hold-${i}`,v[i]);
   await click(p,'ny-submit');assert.equal(await progress(p),`${round}/3`,'every changed timing/intent requires a fresh full preview');
   assert.match(await p.locator('#game-hint').textContent(),/完整試播|full preview|最後まで試写/);
   await click(p,'ny-preview');await p.waitForTimeout(v.reduce((a,b)=>a+b,0)+240);await click(p,'ny-submit');
   if(round<2){assert.equal(await progress(p),`${round+1}/3`);assert.deepEqual(await Promise.all([0,1,2].map(i=>p.locator(`#ny-hold-${i}`).inputValue().then(Number))),v,'new brief preserves actual input values');}
  }
  await p.locator('#result-artifact').waitFor({state:'attached'});const artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.deepEqual(artifact.takes.map(t=>t.timing),takes);assert.deepEqual(artifact.takes.map(t=>t.brief),['quick-leap','floating','your-ending']);assert.equal(artifact.takes[2].focus,variant?'landing':'launch');
 }else if(id==='lunar-new-year'){
  for(const [round,values] of [[-20,1.4,.7,0],[10,.8,1,0],[0,.7,.5,30]].entries()){
   const v=round===0&&variant?[-16,1.4,.8,0]:values;
   for(const [i,key] of ['brow','eyes','mouth','pose'].entries())await range(p,'lny-'+key,v[i]);await click(p,'lny-submit');
  }
 }else if(id==='lantern'){
  for(const [depth,paper,order] of [[20,57.5,0],[50,43.3,1],[75,48.6,0]]){await range(p,'lan-lamp',20);await range(p,'lan-depth',depth);await range(p,'lan-paper',paper);await choice(p,'lan-order',order);await click(p,'lan-check');}
 }else if(id==='children'){
  for(const [i,cue] of [700,1200,1700].entries()){await choice(p,'children-material',i);await range(p,'children-cue',cue);await click(p,'children-preview');await p.waitForTimeout(2800);await click(p,'children-save');}
 }else if(id==='dragon-boat'){
  for(const [i,angle] of [140,140,160].entries()){await choice(p,'fold-leaf',i);await range(p,'fold-angle',angle);await choice(p,'fold-face',0);await click(p,'fold-commit');}
 }else if(id==='mid-autumn'){
  for(const [time,x,size] of [[900,21.5,20],[1200,38,26],[750,56.5,18]]){await range(p,'ma-time',time);await range(p,'ma-x',x);await range(p,'ma-size',size);await click(p,'ma-preview');await p.waitForTimeout(time+240);await click(p,'ma-submit');}
 }else if(id==='teachers'){
  for(const [action,line,pause] of [[0,0,900],[1,3,1400],[2,4,1100]]){await choice(p,'teachers-action',action);await choice(p,'teachers-line',line);await range(p,'teachers-pause',pause);await click(p,'teachers-preview');await p.waitForTimeout(pause+150);await click(p,'teachers-save');}
 }else if(id==='national-day'){
  for(const [camera,mid,far] of [[-12,-1,-4],[0,0,0],[12,1,4]]){await choice(p,'island-order',0);await range(p,'island-fore',22);await range(p,'island-camera',camera);await range(p,'island-mid',mid);await range(p,'island-far',far);await click(p,'island-capture');}
 }else if(id==='semester'){
  for(const direction of ['up','up'])await click(p,'semester-'+direction);await click(p,'semester-visit');
  for(let i=0;i<4;i++)await click(p,'semester-right');await click(p,'semester-visit');
  for(const direction of ['down','down','left','left'])await click(p,'semester-'+direction);await click(p,'semester-visit');
 }else if(id==='exhibition'){
  for(const [i,x] of [20,50,80].entries()){await choice(p,'exhibition-select',i);await range(p,'exhibition-x',x);await range(p,'exhibition-y',30);await choice(p,'exhibition-info',1);}
  await click(p,'exhibition-preview');await p.waitForTimeout(4400);await click(p,'exhibition-save');
 }
}
async function healthyImages(p){return await p.locator('img').evaluateAll(nodes=>nodes.filter(n=>!n.complete||!n.naturalWidth).map(n=>n.getAttribute('src')));}
async function checkReplay(p,c){await click(p,'play-result');const seen=new Set();const start=Date.now();while(seen.size<3&&Date.now()-start<17000){const value=await p.locator('#replay-stage').getAttribute('data-shot');assert.notEqual(value,null,'real replay exposes the displayed shot');seen.add(Number(value));await p.waitForTimeout(60);}assert.ok(seen.size>=3,'at least three real replay shots must render');c.replayScreenshot=`screenshots/${runId}-${c.game}-${c.lang}-${c.width}-${c.keyboard?'keyboard':c.reducedMotion}-replay.png`;await p.locator('#replay-stage').screenshot({path:join(out,c.replayScreenshot)});if(c.width<600){await p.locator('#replay-back').focus();await p.keyboard.press('Enter');c.checks.keyboardReplayExit='yes';}else await click(p,'replay-back');return [...seen];}
async function oneCase(browser,id,lang=process.env.HOLIDAY_QA_LANG||'zh',width=Number(process.env.HOLIDAY_QA_WIDTH)||1440,variant=process.env.HOLIDAY_QA_VARIANT==='1',options={}){
 const c={game:id,lang,width,reducedMotion:options.reducedMotion||'reduce',keyboard:!!options.keyboard,status:'running',checks:{},consoleErrors:[],pageErrors:[],failedRequests:[]};summary.cases.push(c);persist();
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:c.reducedMotion,hasTouch:width<600,isMobile:width<600});await context.addInitScript(()=>{window.__qaAudioPlays=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(...args){window.__qaAudioPlays++;return play.apply(this,args);};});const p=await context.newPage();if(width<600)touchPages.add(p);if(options.keyboard)keyboardPages.add(p);
 p.on('console',m=>{if(m.type()==='error')c.consoleErrors.push(m.text());});p.on('pageerror',e=>c.pageErrors.push(e.message));p.on('requestfailed',r=>c.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 try{
  const sheet=await fetch(`${base}/holiday-lab/lab.css`);assert.equal(sheet.ok,true);c.stylesheetSha256=createHash('sha256').update(Buffer.from(await sheet.arrayBuffer())).digest('hex');
  await p.goto(`${base}/holiday-lab/?game=${id}&lang=${lang}`,{waitUntil:'networkidle'});await p.locator('#intro-skip').waitFor();await click(p,'intro-skip');await click(p,'start-game');await p.locator('#game-controls button').first().waitFor();await p.waitForLoadState('networkidle');
  assert.equal(await p.locator('html').getAttribute('lang'),{zh:'zh-Hant',en:'en',ja:'ja'}[lang]);c.checks.locale='yes';
  c.duplicateIds=await p.locator('[id]').evaluateAll(nodes=>{const seen=new Set(),duplicates=new Set();for(const n of nodes){if(seen.has(n.id))duplicates.add(n.id);seen.add(n.id);}return [...duplicates];});assert.deepEqual(c.duplicateIds,[],'DOM ids must uniquely identify labels, controls and sprites');c.checks.uniqueIds='yes';
  if(id==='new-year'&&lang==='en'){assert.match(await p.locator('#ny-instructions').textContent(),/Watch the action/);c.checks.englishInstruction='yes';const input=p.locator('#ny-hold-0');if(options.keyboard)await tabTo(p,'ny-hold-0');else await input.focus();const before=Number(await input.inputValue());await input.press('ArrowLeft');assert.equal(Number(await input.inputValue()),before-10);c.checks.keyboardRange='yes';}
  if(lang==='ja'&&id==='lunar-new-year'){assert.match(await p.locator('#lny-intro').textContent(),/眉・目・口/);c.checks.japaneseInstruction='yes';}
  if(lang==='ja'&&id==='new-year'){assert.match(await p.locator('#ny-instructions').textContent(),/動きを見て/);c.checks.japaneseInstruction='yes';}
  c.missingImages=await healthyImages(p);assert.deepEqual(c.missingImages,[],'all current image resources must be decoded');c.checks.images='yes';
  await initialFailure(p,id);c.checks.initialWrongBlocked='yes';
  if(id==='new-year'&&lang==='zh'){
   await click(p,'ny-preview');await p.waitForTimeout(100);await click(p,'pause-game');const before=await p.locator('#ny-actor-1').getAttribute('style');await p.waitForTimeout(400);assert.equal(await p.locator('#ny-actor-1').getAttribute('style'),before);assert.equal(await p.locator('#game-controls').evaluate(n=>n.inert),true);await click(p,'pause-game');c.checks.pause='yes';
  }
  c.layoutScreenshot=`screenshots/${runId}-${id}-${lang}-${width}-${c.keyboard?'keyboard':c.reducedMotion}-layout.png`;await p.screenshot({path:join(out,c.layoutScreenshot),fullPage:true});
  c.stageScreenshot=`screenshots/${runId}-${id}-${lang}-${width}-${c.keyboard?'keyboard':c.reducedMotion}-stage.png`;await p.locator('#game-stage').screenshot({path:join(out,c.stageScreenshot)});
  c.horizontalOverflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(c.horizontalOverflow,false,'page must not horizontally overflow');c.checks.noHorizontalOverflow='yes';
  await solve(p,id,variant);await p.locator('#result-score').waitFor({timeout:5000});c.score=await p.locator('#result-score').textContent();c.artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.ok(c.artifact&&Object.keys(c.artifact).length>0);assert.match(c.score,/\d+\s*\/\s*100/);c.checks.completedFromDOM='yes';
  if(id==='new-year'){c.checks.threeBriefsFreshPreviews='yes';c.checks.thirdIntent='yes';assert.equal(await p.evaluate(()=>window.__qaAudioPlays),0);c.checks.mutedPlayable='yes';}
  c.resultScreenshot=`screenshots/${runId}-${id}-${lang}-${width}-${c.keyboard?'keyboard':c.reducedMotion}-result.png`;await p.screenshot({path:join(out,c.resultScreenshot),fullPage:true});
  c.replayShots=await checkReplay(p,c);c.checks.replay3Shots='yes';
  await click(p,'retry-game');await p.locator('#game-controls button').first().waitFor();assert.equal(await progress(p),'0/3');await initialFailure(p,id);c.checks.retryFresh='yes';
  if(width<600){await click(p,'leave-game');await p.locator(`#open-${id}`).waitFor();assert.equal(await p.locator('[id^="open-"]').count(),15);c.checks.exitArchive='yes';}
  assert.deepEqual(c.pageErrors,[],'no uncaught page errors');assert.deepEqual(c.consoleErrors,[],'no browser console errors');assert.deepEqual(c.failedRequests,[],'no failed network requests');c.checks.browserErrors='yes';c.status='pass';console.log(`PASS ${id} ${lang} ${width}: completion, real artifact, ${c.replayShots.length} replay shots, retry, resources`);
 }catch(error){c.status='fail';c.error=error.stack;summary.errors.push({game:id,lang,error:error.message});try{c.failureScreenshot=`screenshots/${runId}-${id}-${lang}-${width}-${c.keyboard?'keyboard':c.reducedMotion}-failure.png`;await p.screenshot({path:join(out,c.failureScreenshot),fullPage:true});}catch{}console.error(`FAIL ${id} ${lang} ${width}: ${error.message}`);}
 finally{persist();await context.close();}
}
(async()=>{let browser;try{const response=await fetch(`${base}/holiday-lab/`);assert.equal(response.ok,true,'local prototype server must be ready');summary.servedSourceSha256={};for(const file of ['runner.mjs','catalog.mjs',...ids.map(id=>`games/${id}.mjs`)]){const r=await fetch(`${base}/holiday-lab/${file}`);assert.equal(r.ok,true,`source receipt ${file}`);summary.servedSourceSha256[file]=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');}browser=await chromium.launch({headless:true});summary.browserVersion=browser.version();if(newYearMatrix){for(const lang of ['zh','en','ja'])for(const width of [320,1440])await oneCase(browser,'new-year',lang,width,width===1440,{reducedMotion:'no-preference'});await oneCase(browser,'new-year','en',1440,true,{keyboard:true,reducedMotion:'no-preference'});await oneCase(browser,'new-year','ja',320,false,{reducedMotion:'reduce'});assert.equal(summary.cases.length,8);const good=summary.cases.filter(c=>c.status==='pass');if(good.length===8){assert.notDeepEqual(good[0].artifact.takes,good[1].artifact.takes);summary.twoDistinctWorks=true;}const receipt=await fetch(`${base}/holiday-lab/games/new-year.mjs`);summary.newYearSourceSha256After=createHash('sha256').update(Buffer.from(await receipt.arrayBuffer())).digest('hex');assert.equal(summary.newYearSourceSha256After,summary.servedSourceSha256['games/new-year.mjs'],'runtime source remains frozen');}else{const selected=process.env.HOLIDAY_QA_GAMES?process.env.HOLIDAY_QA_GAMES.split(','):ids;for(const id of selected){if(process.env.HOLIDAY_QA_CASE){const [only,language,width]=process.env.HOLIDAY_QA_CASE.split('/');if(id===only)await oneCase(browser,id,language,Number(width),true);}else await oneCase(browser,id);}if(!process.env.HOLIDAY_QA_GAMES&&!process.env.HOLIDAY_QA_CASE){await oneCase(browser,'new-year','en',390,true);await oneCase(browser,'lunar-new-year','ja',768,true);const original=summary.cases.find(c=>c.game==='new-year'&&c.lang==='zh'),alternate=summary.cases.find(c=>c.game==='new-year'&&c.lang==='en');assert.notDeepEqual(original?.artifact?.takes,alternate?.artifact?.takes,'DOM alternate timing must change recorded creation');}
}
summary.status=summary.cases.every(c=>c.status==='pass')?'pass':'fail';
if(process.env.HOLIDAY_QA_GAMES&&summary.status==='pass'){const full=(summary.previousRuns||[]).filter(r=>r.status==='pass'&&r.cases.length===12).at(-1);if(full){assert.deepEqual(summary.servedSourceSha256,full.servedSourceSha256,'targeted visual retest must preserve the full matrix JavaScript receipts');summary.preservedFullMatrix={runId:full.runId,cases:12,javascriptSha256Unchanged:true};}}
}
catch(error){summary.status='fail';summary.errors.push({fatal:error.stack});console.error(error.stack);}
finally{if(browser)await browser.close();persist();console.log(`TOTAL ${summary.cases.filter(c=>c.status==='pass').length}/${summary.cases.length} passed; ${summary.status}`);process.exitCode=summary.status==='pass'?0:1;}})();
