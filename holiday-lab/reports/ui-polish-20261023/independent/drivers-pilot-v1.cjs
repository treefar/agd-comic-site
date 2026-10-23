const assert=require('node:assert/strict'),{join}=require('node:path');const out=__dirname,runId='independent';const touchPages=new WeakSet(),keyboardPages=new WeakSet(); async function click(p,id){await p.locator('#'+id).click();} async function range(p,id,value){await p.locator('#'+id).fill(String(value));}async function choice(p,id,index){await click(p,id+'-'+index);}async function progress(p){return (await p.locator('#game-progress').textContent()).replace(/\s/g,'');}
async function solve(p,id,variant=false,caseRow){
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
  const poses=variant?[[-30,1.5,1,0],[22,.6,1,4],[18,1.4,.9,38]]:[[-10,1.2,.5,10],[0,1,.7,12],[-10,.6,.3,12]];
  for(const [round,v] of poses.entries()){
   if(round===2)await choice(p,'lny-intent',variant?0:1);
   for(const [i,key] of ['brow','eyes','mouth','pose'].entries())await range(p,'lny-'+key,v[i]);await click(p,'lny-submit');
  }
  const artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.deepEqual(artifact.poses.map(x=>Object.values(x.values)),poses);assert.equal(artifact.poses[2].intent,variant?'comic':'reserved');
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
  const evidence={guides:[],wrongWindows:[],taskLabels:[],oldCoordinatesBlocked:[]},tag=`${runId}-semester-${caseRow.lang}-${caseRow.width}-${caseRow.keyboard?'keyboard':caseRow.reducedMotion}`;
  const position=()=>p.locator('#semester-player').evaluate(n=>({x:Math.round((parseFloat(n.style.left)-18)/16),y:Math.round((parseFloat(n.style.top)-32)/22)}));
  async function walk(window){const goal={department:{x:0,y:0},academic:{x:4,y:0},classroom:{x:2,y:2}}[window];for(let i=0;i<20;i++){const here=await position();if(here.x===goal.x&&here.y===goal.y)return;await click(p,'semester-'+(here.x!==goal.x?(here.x<goal.x?'right':'left'):(here.y<goal.y?'down':'up')));}throw Error('Cannot reach the chosen fictional contact');}
  // The original three-coordinate walkthrough must remain unable to win.
  for(const directions of [['up','up'],['right','right','right','right'],['down','down','left','left']]){for(const d of directions)await click(p,'semester-'+d);await click(p,'semester-visit');assert.equal(await progress(p),'0/3');assert.equal(await p.locator('#result-score').count(),0);evidence.oldCoordinatesBlocked.push({position:await position(),progress:await progress(p),hint:await p.locator('#game-hint').textContent()});}
  await click(p,'semester-left');await click(p,'semester-left');assert.deepEqual(await position(),{x:0,y:2});
  async function openGuide(cardId){
   assert.equal(await p.locator('#semester-guide').getAttribute('data-guide-card'),cardId);assert.equal(await p.locator('#semester-guide').getAttribute('href'),`../?lang=${caseRow.lang}#/students/guide`);
   const query=(await p.locator('#semester-guide-note').textContent()).match(/[「“]([^」”]+)[」”]/)?.[1];assert.ok(query,'read the actual search phrase shown by the game');
   const opening=p.context().waitForEvent('page');await click(p,'semester-guide');const q=await opening;if(caseRow.keyboard)keyboardPages.add(q);if(caseRow.width<600)touchPages.add(q);
   q.on('pageerror',e=>caseRow.pageErrors.push('guide: '+e.message));await q.waitForLoadState('networkidle');await q.locator('#student-search').waitFor();
   if(caseRow.keyboard){await tabTo(q,'student-search');await q.keyboard.type(query);}else await q.locator('#student-search').fill(query);
   const card=q.locator('#student-'+cardId);await card.waitFor();assert.equal(await q.locator('#student-search').inputValue(),query);const heading=await card.locator('h3').textContent();assert.equal(heading,query,'the game phrase must match the actual guide card title');const detail=card.locator('.sg-card-detail > summary');
   if(caseRow.keyboard){for(let n=0;n<150;n++){if(await detail.evaluate(el=>el===document.activeElement))break;await q.keyboard.press('Tab');}assert.equal(await detail.evaluate(el=>el===document.activeElement),true);await q.keyboard.press('Enter');}else if(caseRow.width<600){await detail.scrollIntoViewIfNeeded();const b=await detail.boundingBox();assert.ok(b);await q.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await detail.click();
   const contact=await card.locator('.sg-contact').textContent();assert.ok(contact.length>5);const screenshot=`screenshots/${tag}-guide-${cardId}.png`;await q.screenshot({path:join(out,screenshot),fullPage:true});evidence.guides.push({cardId,query,heading,contact,url:q.url(),screenshot});await q.close();await p.bringToFront();
  }
  const plan=[{round:0,choice:0,task:'course-plan',window:variant?'academic':'department',card:'course-selection'},{round:1,choice:0,task:'course-record',window:'academic',card:'course-selection'},...(variant?[{round:2,choice:1,task:'credit',window:'academic',card:'credit-transfer'},{round:2,choice:0,task:'graduation',window:'department',card:'graduation'}]:[{round:2,choice:0,task:'graduation',window:'department',card:'graduation'},{round:2,choice:1,task:'credit',window:'academic',card:'credit-transfer'}])];
  assert.equal(await p.locator('#semester-window-1').textContent(),{zh:'註冊課務組',en:'Registration and Curriculum Section',ja:'註冊課務組（学籍・履修担当）'}[caseRow.lang]);
  for(const [i,step]of plan.entries()){
   const taskId=`semester-task-${step.round}-${step.choice}`;await click(p,taskId);evidence.taskLabels.push(await p.locator('#'+taskId).textContent());if(!evidence.guides.some(g=>g.cardId===step.card))await openGuide(step.card);
   if(i<3){await choice(p,'semester-window',2);await walk('classroom');await click(p,'semester-visit');assert.equal(await progress(p),`${step.round}/3`);const hint=await p.locator('#game-hint').textContent();assert.match(hint,/程序窗口|process contact|手続き窓口/);evidence.wrongWindows.push({task:step.task,hint});}
   await choice(p,'semester-window',{department:0,academic:1}[step.window]);await walk(step.window);if(i===2){evidence.thirdScreenshot=`screenshots/${tag}-third-choice.png`;await p.screenshot({path:join(out,evidence.thirdScreenshot),fullPage:true});}await click(p,'semester-visit');if(i<3)assert.equal(await progress(p),`${i===2?2:i+1}/3`);
  }
  await p.locator('#result-artifact').waitFor({state:'attached'});const artifact=JSON.parse(await p.locator('#result-artifact').textContent());assert.deepEqual(artifact.visits.map(v=>v.taskId),plan.map(s=>s.task));assert.deepEqual(artifact.visits.map(v=>v.windowId),plan.map(s=>s.window));assert.deepEqual(artifact.thirdActOrder,plan.slice(2).map(s=>s.task));assert.equal(artifact.fictionalMap,true);assert.equal(artifact.consultationOnly,true);assert.equal(artifact.attempts,11);caseRow.semester=evidence;
 }else if(id==='exhibition'){
  for(const [i,x] of [20,50,80].entries()){await choice(p,'exhibition-select',i);await range(p,'exhibition-x',x);await range(p,'exhibition-y',30);await choice(p,'exhibition-info',1);}
  await click(p,'exhibition-preview');await p.waitForTimeout(4400);await click(p,'exhibition-save');
 }
}

async function extraSolve(p,id,touch){
 if(id==='peace-memory'){for(const [n,speaker]of [2,0,1].entries()){await click(p,'peace-person-'+speaker,touch);await range(p,'peace-x',[20,50,80][speaker]);await range(p,'peace-y',65);await range(p,'peace-width',24);await click(p,'peace-listen',touch);if(n<2)await p.waitForFunction(v=>document.querySelector('#game-progress')?.dataset.current===String(v),n+1,{timeout:5000});}}
 if(id==='qingming'){await click(p,'kite-retry',touch);await range(p,'kite-angle',0);await range(p,'kite-length',100);for(let n=0;n<3;n++){await range(p,'kite-tension',n===1?.44:0);await click(p,'kite-play',touch);if(n<2)await p.waitForFunction(v=>document.querySelector('#game-progress')?.dataset.current===String(v),n+1,{timeout:20000});}}
 if(id==='labor'){for(const [i,start]of [0,10,22,10,22,34].entries()){await click(p,'labor-worker-'+i+'-'+[0,1,2,0,1,2][i],touch);await range(p,'labor-start-'+i,start);}await click(p,'labor-preview',touch);await p.waitForTimeout(4600);await click(p,'labor-save',touch);}
 if(id==='retrocession'){for(const values of [[-10,5,0,1],[10,-3,12,1],[-4,-5,-10,1.15]]){for(const [i,key]of ['x','y','rotation','scale'].entries())await range(p,'archive-'+key,values[i]);await click(p,'archive-save',touch);}}
 if(id==='constitution'){for(const font of [18,20,18]){await click(p,'caption-lines-1',touch);await click(p,'caption-tone-0',touch);for(const [key,value]of Object.entries({font,duration:6,x:50,y:78}))await range(p,'caption-'+key,value);await click(p,'caption-preview',touch);await p.waitForFunction(()=>/試播結束|Preview finished|プレビュー終了/.test(document.querySelector('#caption-preview-status')?.textContent||''),null,{timeout:9000});await click(p,'caption-save',touch);}}
 await p.locator('#result-score').waitFor({timeout:20000});
}

module.exports={solve,extraSolve,click,range,progress};
