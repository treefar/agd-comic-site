// Timing shapes an expressive brief, rather than matching one millisecond answer.
export const id='new-year';
const W=(zh,en,ja)=>({zh,en,ja});
export const BRIEFS=Object.freeze([
 {id:'quick-leap',words:W('第1幕｜俐落跨門。讓騰空明顯短於前後，落地仍看得清楚。','Scene 1 · A quick leap. Keep flight noticeably shorter than launch and landing, with a readable finish.','第1幕｜軽やかに越える。空中を前後より短くし、着地も見えるテンポに。')},
 {id:'floating',words:W('第2幕｜留住騰空。讓空中的瞬間最醒目，前後也別一閃而過。','Scene 2 · Savor the flight. Give the airborne moment the most time without losing launch or landing.','第2幕｜空中を味わう。空中の瞬間を長く見せ、踏み出しと着地も読めるように。')},
 {id:'your-ending',words:W('第3幕｜我的收尾。先選主角的心情，再把時間留給那一段。','Scene 3 · Your ending. Choose the feeling, then give that part of the action the most time.','第3幕｜自分の締めくくり。気持ちを選び、その動きに時間を残しましょう。')}
]);
export const FOCUS=Object.freeze([
 {value:'launch',label:W('期待起步','Build anticipation','踏み出す期待'),note:W('起步主導：多留一拍蹲身準備，再躍出去。','Emphasize launch: linger in the crouch, then leap.','踏み出しを強調：構える姿を見せてから跳ぶ。')},
 {value:'flight',label:W('享受騰空','Savor flight','空中を楽しむ'),note:W('騰空主導：讓觀眾留在越過新年門的瞬間。','Emphasize flight: let the airborne moment linger.','空中を強調：門を越える瞬間をゆっくり見せる。')},
 {value:'landing',label:W('站穩落地','Settle the landing','着地を決める'),note:W('落地主導：收住動作，讓這一步站得踏實。','Emphasize landing: give the final pose time to settle.','着地を強調：最後の姿勢をしっかり見せる。')}
]);
const phases=[W('起步','Launch','踏み出し'),W('騰空','Flight','空中'),W('落地','Landing','着地')];
export const createState=()=>({round:0,takes:[],attempts:0,done:false});

// Wide readability bands and relative emphasis; there is no hidden exact target.
export function evaluateTiming(round,timing,focus='landing'){
 if(!Number.isInteger(round)||round<0||round>2||!Array.isArray(timing)||timing.length!==3||timing.some(v=>!Number.isFinite(v)||v<80||v>700)||(round===2&&!FOCUS.some(x=>x.value===focus)))return {ok:false,reason:'invalid'};
 const [launch,flight,landing]=timing,total=launch+flight+landing;
 const metrics={total,shares:timing.map(v=>v/total)};
 if(launch<160)return {ok:false,reason:'launch-short',metrics};
 if(flight<140)return {ok:false,reason:'flight-short',metrics};
 if(landing<180)return {ok:false,reason:'landing-short',metrics};
 if(total<800)return {ok:false,reason:'whole-short',metrics};
 if(total>1900)return {ok:false,reason:'whole-long',metrics};
 if(round===0&&flight>.75*Math.min(launch,landing))return {ok:false,reason:'quick-flight',metrics};
 if(round===1&&flight<1.25*Math.max(launch,landing))return {ok:false,reason:'float-flight',metrics};
 if(round===2){const selected=FOCUS.findIndex(x=>x.value===focus),other=timing.filter((_,i)=>i!==selected);if(timing[selected]<1.3*Math.max(...other))return {ok:false,reason:`focus-${focus}`,metrics};}
 return {ok:true,reason:'ok',metrics};
}
export function submit(state,timing,focus='landing'){
 if(state.done)return {ok:false,state,reason:'done'};
 const verdict=evaluateTiming(state.round,timing,focus);
 if(!verdict.ok)return {ok:false,state:verdict.reason==='invalid'?state:{...state,attempts:state.attempts+1},...verdict};
 const take={brief:BRIEFS[state.round].id,focus:state.round===0?'quick':state.round===1?'flight':focus,timing:[...timing],score:100,metrics:verdict.metrics};
 const takes=[...state.takes,take];return {ok:true,state:{round:state.round+1,takes,attempts:state.attempts+1,done:takes.length===3}};
}
function poseForPhase(index,progress){
 const u=Math.max(0,Math.min(1,progress));
 if(index===0){const weight=Math.sin(Math.PI*u);return {key:'actor1',x:26+10*u,y:60+2*weight,width:20,height:28,scaleX:1+.05*weight,scaleY:1-.08*weight};}
 if(index===1)return {key:'actor2',x:36+40*u,y:60-39*Math.sin(Math.PI*u),width:20,height:28};
 const settle=Math.sin(Math.PI*Math.min(1,u*2))*Math.exp(-u*3);return {key:'actor3',x:76+4*Math.min(1,u*2),y:60+3*settle,width:20,height:28,scaleX:1+.08*settle,scaleY:1-.08*settle};
}
export function poseAt(timing,milliseconds,reducedMotion=false){
 const [a,b,c]=timing,t=Math.max(0,milliseconds),phase=t<a?0:t<a+b?1:2,offset=phase===0?0:phase===1?a:a+b;
 return poseForPhase(phase,reducedMotion ? .5 : (t-offset)/[a,b,c][phase]);
}
const feedback={
 invalid:W('這個設定無法試播，請重新調整。','These settings cannot be previewed. Adjust them.','この設定では試写できません。調整してください。'),
 'launch-short':W('起步一閃就離地了。多留一點，讓觀眾看見蹲身準備。','Launch flashes past. Leave time to see the crouch before the leap.','踏み出しが一瞬です。構える姿が見える時間を残しましょう。'),
 'flight-short':W('空中的動作來不及看清。替騰空多留一點時間。','The airborne pose flashes past. Give flight more time.','空中の姿が読めません。空中にもう少し時間を。'),
 'landing-short':W('落地還沒站穩就結束了。保留收住動作的時間。','The ending cuts off before it settles. Leave time for the landing.','着地が落ち着く前に終わります。最後の姿勢を見せましょう。'),
 'whole-short':W('整個動作太匆忙。讓三段都能被看見。','The whole action rushes past. Give the three parts room to be seen.','動き全体が急ぎすぎです。3つの動きを見せる余裕を。'),
 'whole-long':W('整個動作拖慢了。留住重點，縮短其餘兩段。','The whole action drags. Keep the emphasis and shorten the other parts.','全体が間延びしています。見せたい動きを残し、他を短く。'),
 'quick-flight':W('空中和前後一樣久，像在慢慢飄。縮短騰空，保留起步和落地。','Flight feels as long as the surrounding poses. Shorten flight for a crisp leap.','空中が前後と同じ長さで、漂って見えます。空中を短くして軽快に。'),
 'float-flight':W('空中還不夠醒目。從起步或落地挪一點時間給騰空。','Flight does not stand out yet. Move some time from launch or landing into flight.','空中がまだ目立ちません。前後の時間を少し空中へ。'),
 'focus-launch':W('蹲身準備還不是重點。讓起步比另外兩段更有份量。','The crouch is not the emphasis yet. Let launch take more time than the other parts.','構える姿がまだ主役ではありません。踏み出しを前後より長く。'),
 'focus-flight':W('還沒留住空中的心情。讓騰空比另外兩段更有份量。','The airborne feeling does not linger yet. Let flight take more time than the other parts.','空中の気持ちがまだ残りません。空中を他の動きより長く。'),
 'focus-landing':W('還沒收住最後一步。讓落地比另外兩段更有份量。','The ending has not settled yet. Let landing take more time than the other parts.','最後の一歩がまだ落ち着きません。着地を他の動きより長く。')
};
function previewFeedback(round,verdict){if(!verdict.ok)return feedback[verdict.reason];return [W('俐落的一躍，前後也看得清。可收下，或再試另一種節奏。','A crisp leap with readable poses. Keep it, or try another rhythm.','軽快に跳び、前後も読めます。保存するか、別のテンポを試しましょう。'),W('空中的瞬間被留住了。可收下，或再試另一種節奏。','The airborne moment lingers. Keep it, or try another rhythm.','空中の瞬間が残ります。保存するか、別のテンポを試しましょう。'),W('重點和你選的心情相符。這是你的收尾。','The emphasis matches your chosen feeling. This ending is yours.','選んだ気持ちと動きが合っています。自分だけの締めくくりです。')][round];}
export function buildResult(state){
 if(!state.done||state.takes.length!==3)throw Error('Three completed expressive briefs required');
 const replay=state.takes.flatMap((take,scene)=>take.timing.map((duration,index)=>{
  const focus=scene===2?FOCUS.find(x=>x.value===take.focus).label:scene===0?W('俐落跨門','A quick leap','軽く跳ぶ'):W('留住騰空','Savor flight','空中を味わう');
  return {duration,caption:W(`第${scene+1}幕・${phases[index].zh} ${duration}毫秒｜${focus.zh}`,`Scene ${scene+1} · ${phases[index].en}: ${duration} ms · ${focus.en}`,`第${scene+1}幕・${phases[index].ja} ${duration}ミリ秒｜${focus.ja}`),sprites:[{...poseForPhase(index,0),frames:Array.from({length:9},(_,j)=>({at:duration*j/8,...poseForPhase(index,j/8)}))},{key:'prop2',x:48,y:52,width:20,height:56,z:0},{key:'target',x:80,y:76,width:16,height:10,z:0}]};
 }));
 return {score:100,summary:W('三幕跨年動作完成。重播會保留你的時間與收尾心情；嘗試次數不扣分。','Three New Year actions are ready. Replay keeps your timing and chosen ending. Trying things does not reduce your score.','年越しアクション3幕が完成。自分の時間配分と締めくくりを再生します。試行回数では減点しません。'),artifact:{takes:state.takes.map(t=>({...t,timing:[...t.timing]})),attempts:state.attempts},replay};
}
export function mount(ctx){
 let state=createState(),values=[350,350,350],focus='landing',playTime=0,playing=false,previewed=false,dead=false;
 const owned=[],sliders=[];
 owned.push(ctx.ui.text('ny-instructions',W('看動作，剪出心情；沒有唯一節拍。','Watch the action and shape its mood. There is no single correct beat.','動きを見て、気持ちを編集。正解のテンポは一つではありません。')));
 const brief=ctx.ui.text('ny-target',BRIEFS[0].words);owned.push(brief);
 const phaseText=ctx.ui.text('ny-pose',phases[0]);owned.push(phaseText);
 const observation=ctx.ui.text('ny-observation',W('先試播，觀察最久停在哪一段。','Preview and notice which part lasts longest.','試写して、長く見える動きを観察しましょう。'));owned.push(observation);
 const actors=[0,1,2].map(i=>ctx.sprite(`actor${i+1}`,{id:`ny-actor-${i+1}`,...poseForPhase(0,0),opacity:i===0?1:0}));
 const gate=ctx.sprite('prop2',{id:'ny-gate',x:48,y:52,width:20,height:56,z:0}),footprints=ctx.sprite('target',{id:'ny-footprints',x:80,y:76,width:16,height:10,z:0}),clock=ctx.sprite('prop1',{id:'ny-clock',x:12,y:15,width:16,height:18});
 const cards=[0,1,2].map(i=>ctx.sprite(`token${i+1}`,{x:28+i*23,y:16,width:18,height:20,opacity:.45}));
 let currentPhase=-1;
 function draw(t){const p=poseAt(values,t,ctx.reducedMotion),index=Number(p.key.at(-1))-1;actors.forEach((a,i)=>a.update({...p,opacity:i===index?1:0}));cards.forEach((c,i)=>c.update({opacity:i===index?1:.35}));if(index!==currentPhase){ctx.ui.setText(phaseText,phases[index]);currentPhase=index;}}
 function invalidate(){playing=false;previewed=false;draw(0);ctx.ui.setText(observation,W('設定改了，先看這一版的動作。','Settings changed. Watch this version before keeping it.','設定を変更しました。この動きを見てから保存しましょう。'));}
 phases.forEach((label,i)=>{const s=ctx.ui.slider({id:`ny-hold-${i}`,label:W(`${label.zh}（毫秒）`,`${label.en} (ms)`,`${label.ja}（ミリ秒）`),min:80,max:700,step:10,value:values[i],onInput:v=>{values[i]=Number(v);invalidate();}});sliders.push(s);owned.push(s.element);});
 const focusControl=ctx.ui.choice({id:'ny-focus',label:W('這次想留下什麼心情？','What feeling should linger?','どんな気持ちを残す？'),options:FOCUS,value:focus,onChange:value=>{focus=value;ctx.ui.setText(intent,FOCUS.find(x=>x.value===focus).note);invalidate();}});owned.push(focusControl.element);
 const intent=ctx.ui.text('ny-intent',FOCUS.find(x=>x.value===focus).note);owned.push(intent);
 function showBrief(){ctx.ui.setText(brief,BRIEFS[state.round].words);focusControl.element.hidden=state.round!==2;intent.hidden=state.round!==2;ctx.setProgress(state.round,3);}
 owned.push(ctx.ui.button({id:'ny-preview',label:W('試播動作','Preview action','動きを試写'),onClick:()=>{if(dead||state.done)return;playTime=0;playing=true;previewed=false;draw(0);ctx.sound('paper');}}));
 owned.push(ctx.ui.button({id:'ny-submit',label:W('收下這幕','Keep this scene','この幕を保存'),onClick:()=>{
  if(dead||state.done)return;
  if(!previewed){ctx.hint(W('先完整試播。改時間或心情後，都要再看一次。','Watch a full preview after changing timing or feeling.','時間や気持ちを変えたら、最後まで試写して確認しましょう。'));return;}
  const r=submit(state,values,focus);state=r.state;
  if(!r.ok){ctx.sound('error');ctx.hint(feedback[r.reason]);return;}
  ctx.sound('success');ctx.setProgress(state.round,3);if(state.done){ctx.complete(buildResult(state));return;}
  // Keep the player's timing across briefs; new intent, rather than reset answers, drives the next edit.
  playing=false;previewed=false;draw(0);showBrief();ctx.ui.setText(observation,W('上一幕的時間保留了。看新任務，再決定要把時間留給誰。','Your timing stays. Read the new brief and decide where to move the time.','前の時間配分を残しました。新しい狙いに合わせて、どこへ時間を移すか考えましょう。'));ctx.hint(BRIEFS[state.round].words);
 }}));
 ctx.controls.append(...owned);showBrief();draw(0);
 const stop=ctx.onFrame(({dt})=>{if(!playing||dead)return;playTime+=Math.max(0,dt)*1000;const total=values.reduce((a,b)=>a+b,0);draw(Math.min(playTime,total));if(playTime>=total){playing=false;previewed=true;const message=previewFeedback(state.round,evaluateTiming(state.round,values,focus));ctx.ui.setText(observation,message);ctx.hint(message);}});
 return {destroy(){dead=true;playing=false;stop();actors.concat(gate,footprints,clock,cards).forEach(s=>s.remove());}};
}
