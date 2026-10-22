// Three timing exercises: the stored timing is also the animation source.
export const id='new-year';
export const TARGETS=Object.freeze([[400,180,380],[320,140,320],[500,220,420]].map(Object.freeze));
export const createState=()=>({round:0,takes:[],attempts:0,done:false});
export function submit(state,timing){
  if(state.done||!Array.isArray(timing)||timing.length!==3||timing.some(v=>!Number.isFinite(v)||v<80||v>700))return {ok:false,state,reason:'invalid'};
  const error=timing.reduce((sum,v,i)=>sum+Math.abs(v-TARGETS[state.round][i]),0);
  if(timing.some((v,i)=>Math.abs(v-TARGETS[state.round][i])>65))return {ok:false,state:{...state,attempts:state.attempts+1},reason:'timing'};
  const takes=[...state.takes,{timing:[...timing],score:Math.max(0,Math.round(100-error/6))}];
  return {ok:true,state:{round:state.round+1,takes,attempts:state.attempts+1,done:takes.length===3}};
}
export function poseAt(timing,milliseconds){
  const [a,b,c]=timing,t=Math.max(0,milliseconds);
  if(t<a)return {key:'actor1',x:12+24*t/a,y:60,width:20,height:28};
  if(t<a+b)return {key:'actor2',x:36+28*(t-a)/b,y:35-12*Math.sin(Math.PI*(t-a)/b),width:20,height:28};
  return {key:'actor3',x:64+16*Math.min(1,(t-a-b)/c),y:60,width:20,height:28};
}
const W=(zh,en,ja)=>({zh,en,ja});
export function mount(ctx){
  let state=createState(),values=[600,500,100],playTime=0,playing=false,previewed=false,dead=false;
  const owned=[],sliders=[];
  const text=ctx.ui.text('ny-instructions',W('調整三格停留時間，讓起步、騰空、落地順暢。先試播，再送出。','Adjust the holds for launch, flight and landing. Preview before submitting.','踏み出し・空中・着地の長さを調整。試写してから提出。'));owned.push(text);
  const targetText=ctx.ui.text('ny-target',W('','',''));owned.push(targetText);
  const labels=[W('起步（毫秒）','Launch (ms)','踏み出し（ミリ秒）'),W('騰空（毫秒）','Flight (ms)','空中（ミリ秒）'),W('落地（毫秒）','Landing (ms)','着地（ミリ秒）')];
  const actors=[0,1,2].map(i=>ctx.sprite(`actor${i+1}`,{id:`ny-actor-${i+1}`,x:12,y:60,width:20,height:28,opacity:i===0?1:0}));
  const gate=ctx.sprite('prop2',{id:'ny-gate',x:48,y:25,width:20,height:56,z:0});
  const footprints=ctx.sprite('target',{id:'ny-footprints',x:79,y:86,width:16,height:10});
  const clock=ctx.sprite('prop1',{id:'ny-clock',x:4,y:6,width:16,height:18});
  const cards=[0,1,2].map(i=>ctx.sprite(`token${i+1}`,{x:28+i*23,y:7,width:18,height:20,opacity:0.65}));
  function draw(t){const p=poseAt(values,t);actors.forEach((a,i)=>a.update({...p,opacity:p.key===`actor${i+1}`?1:0}));}
  function updateTarget(){const t=TARGETS[state.round];ctx.ui.setText(targetText,W(`第 ${state.round+1} 幕｜導演節拍：${t.join(' / ')} 毫秒。每格可差 65 毫秒。`,`Scene ${state.round+1} | Director's beat: ${t.join(' / ')} ms. Each hold allows ±65 ms.`,`第${state.round+1}幕｜指定テンポ：${t.join(' / ')}ミリ秒。各コマ±65まで。`));ctx.setProgress(state.round,3);}
  labels.forEach((label,i)=>{const s=ctx.ui.slider({id:`ny-hold-${i}`,label,min:80,max:700,step:10,value:values[i],onInput:v=>{values[i]=Number(v);playing=false;previewed=false;draw(0);}});sliders.push(s);owned.push(s.element);});
  const preview=ctx.ui.button({id:'ny-preview',label:W('試播動作','Preview action','動きを試写'),onClick:()=>{playTime=0;playing=true;previewed=false;ctx.sound('paper');}});owned.push(preview);
  const submitButton=ctx.ui.button({id:'ny-submit',label:W('送出這幕','Submit scene','この幕を提出'),onClick:()=>{
    if(dead||state.done)return;
    if(!previewed){ctx.hint(W('先試播到落地，再判斷節奏。','Watch a full preview before submitting.','着地まで試写してから提出。'));return;}
    const r=submit(state,values);state=r.state;
    if(!r.ok){ctx.sound('error');ctx.hint(W('停格太久或太短。對照導演節拍，保留你喜歡的變化。','A hold is too long or short. Compare the director’s beat and try again.','止める時間が長すぎるか短すぎます。指定テンポと比べて調整。'));return;}
    ctx.sound('success');ctx.setProgress(state.round,3);
    if(state.done){
      const replay=state.takes.flatMap((take,scene)=>take.timing.map((duration,i)=>({duration,caption:W(`第${scene+1}幕・第${i+1}格 ${duration}毫秒`,`Scene ${scene+1}, keyframe ${i+1}: ${duration} ms`,`第${scene+1}幕・第${i+1}コマ ${duration}ミリ秒`),sprites:[{...poseAt(take.timing,take.timing.slice(0,i).reduce((s,v)=>s+v,0)+duration/2),key:`actor${i+1}`},{key:'prop2',x:48,y:25,width:20,height:56}]})));
      ctx.complete({score:Math.round(state.takes.reduce((s,v)=>s+v.score,0)/3),summary:W('三幕跨年動作已剪好，重播你的停格節奏。','Your three New Year actions are edited. Replay your timing.','年越しアクション3幕が完成。自分のテンポを再生。'),artifact:{takes:state.takes,attempts:state.attempts},replay});return;
    }
    playing=false;previewed=false;values=[600,500,100];sliders.forEach((s,i)=>s.setValue(values[i]));draw(0);updateTarget();ctx.hint(W('下一幕換了節拍，先調整再試播。','The next scene has a different beat. Adjust and preview.','次の幕は別のテンポ。調整して試写。'));
  }});owned.push(submitButton);
  ctx.controls.append(...owned);updateTarget();draw(0);
  const stop=ctx.onFrame(({dt})=>{if(!playing||dead)return;playTime+=dt*1000;const total=values.reduce((a,b)=>a+b,0);draw(Math.min(playTime,total));if(playTime>=total){playing=false;previewed=true;ctx.hint(W('試播結束。可送出，或改時間再看一次。','Preview finished. Submit, or change the timing and preview again.','試写終了。提出、または時間を変えて再試写。'));}});
  return {destroy(){dead=true;stop();actors.concat(gate,footprints,clock,cards).forEach(s=>s.remove());}};
}
