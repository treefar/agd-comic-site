// Match-cut workshop: position at the actual cut depends on time and motion.
export const id='mid-autumn';
export const TARGETS=Object.freeze([{time:900,x:35,size:20,speed:15},{time:1200,x:62,size:26,speed:20},{time:750,x:45,size:18,speed:-15}].map(Object.freeze));
export const createState=()=>({round:0,cuts:[],attempts:0,done:false});
export const cutPosition=(x,speed,time)=>x+speed*time/1000;
export function submit(state,values){
  if(state.done||!values||!Number.isFinite(values.time)||!Number.isFinite(values.x)||!Number.isFinite(values.size)||values.time<300||values.time>1600||values.x<0||values.x>80||values.size<10||values.size>32)return {ok:false,state,reason:'invalid'};
  const t=TARGETS[state.round],endX=cutPosition(values.x,t.speed,values.time);
  const errors={time:Math.abs(values.time-t.time),x:Math.abs(endX-t.x),size:Math.abs(values.size-t.size)};
  if(errors.time>140||errors.x>4||errors.size>3)return {ok:false,state:{...state,attempts:state.attempts+1},reason:'alignment',errors};
  const score=Math.max(0,Math.round(100-errors.time/14-errors.x*3-errors.size*3));
  const cuts=[...state.cuts,{time:values.time,x:values.x,size:values.size,endX,speed:t.speed,score}];
  return {ok:true,state:{round:state.round+1,cuts,attempts:state.attempts+1,done:cuts.length===3}};
}
const W=(zh,en,ja)=>({zh,en,ja});
const names=[W('月亮 → 車輪','Moon → wheel','月 → 車輪'),W('車輪 → 圓燈','Wheel → round lamp','車輪 → 丸い照明'),W('圓燈 → 月亮','Round lamp → moon','丸い照明 → 月')];
export function mount(ctx){
  let state=createState(),values={time:500,x:10,size:12},clock=0,playing=false,previewed=false,dead=false;
  const nodes=[];
  nodes.push(ctx.ui.text('ma-intro',W('調整剪接點、起始位置和圓形大小，讓移動中的圓在切換時接上參考圈。先試剪，再送出。','Adjust cut time, starting position and size so the moving circle matches the reference at the cut. Preview before submitting.','カット時刻・開始位置・大きさを調整。動く円を切替時に見本と合わせ、試写して提出。')));
  const info=ctx.ui.text('ma-target',W('','',''));nodes.push(info);
  const actors=[0,1,2].map(i=>ctx.sprite(`actor${i+1}`,{id:`ma-actor-${i}`,x:10,y:40,width:12,height:12,opacity:i===0?1:0}));
  const target=ctx.sprite('target',{id:'ma-reference',x:35,y:40,width:20,height:20,opacity:0.6,z:0});
  const board=ctx.sprite('prop1',{id:'ma-board',x:17,y:15,width:24,height:20});
  const camera=ctx.sprite('prop2',{id:'ma-camera',x:75,y:72,width:20,height:20});
  const shots=[0,1,2].map(i=>ctx.sprite(`token${i+1}`,{id:`ma-shot-${i}`,x:35+i*21,y:16,width:18,height:22,opacity:i===0?1:0.4}));
  function draw(t=values.time){const ref=TARGETS[state.round],x=cutPosition(values.x,ref.speed,t);actors.forEach((s,i)=>s.update({x,y:40,width:values.size,height:values.size,opacity:i===state.round?1:0}));target.update({x:ref.x,y:40,width:ref.size,height:ref.size});}
  const specs=[['time',W('剪接時間（毫秒）','Cut time (ms)','カット時刻（ミリ秒）'),300,1600,50],['x',W('圓的起始位置（％）','Circle starting position (%)','円の開始位置（％）'),0,80,0.5],['size',W('圓形大小（％）','Circle size (%)','円の大きさ（％）'),10,32,1]];
  const sliders={};specs.forEach(([key,label,min,max,step])=>{const s=ctx.ui.slider({id:`ma-${key}`,label,min,max,step,value:values[key],onInput:v=>{values[key]=Number(v);playing=false;previewed=false;draw();}});sliders[key]=s;nodes.push(s.element);});
  function update(){const t=TARGETS[state.round],name=names[state.round];ctx.ui.setText(info,W(`${name.zh}｜在 ${t.time} 毫秒切換；參考圈中心 ${t.x}％、大小 ${t.size}％；速度 ${t.speed}％／秒。`,`${name.en} | Cut at ${t.time} ms; reference center ${t.x}%, size ${t.size}%; speed ${t.speed}%/s.`,`${name.ja}｜${t.time}ミリ秒で切替。見本の中心${t.x}％・大きさ${t.size}％・速度${t.speed}％/秒。`));ctx.setProgress(state.round,3);shots.forEach((s,i)=>s.update({opacity:i===state.round?1:0.4}));draw();}
  nodes.push(ctx.ui.button({id:'ma-preview',label:W('試剪這一段','Preview this cut','このカットを試写'),onClick:()=>{clock=0;playing=true;previewed=false;ctx.sound('paper');}}));
  nodes.push(ctx.ui.button({id:'ma-submit',label:W('保留剪接','Keep this cut','このカットを採用'),onClick:()=>{
    if(dead||state.done)return;
    if(!previewed){ctx.hint(W('先試剪，看圓形在切換時有沒有對上。','Preview first and watch the alignment at the cut.','先に試写して、切替時に円が合うか確認。'));return;}
    const r=submit(state,values);state=r.state;
    if(!r.ok){ctx.sound('error');const e=r.errors;if(e){ctx.hint(W(`還差一點：時間誤差 ${Math.round(e.time)} 毫秒、位置 ${e.x.toFixed(1)}％、大小 ${e.size.toFixed(1)}％。`,`Almost: timing error ${Math.round(e.time)} ms, position ${e.x.toFixed(1)}%, size ${e.size.toFixed(1)}%.`,`もう少し：時刻の差${Math.round(e.time)}ミリ秒・位置${e.x.toFixed(1)}％・大きさ${e.size.toFixed(1)}％。`));}return;}
    ctx.sound('success');ctx.setProgress(state.round,3);
    if(state.done){ctx.complete({score:Math.round(state.cuts.reduce((s,v)=>s+v.score,0)/3),summary:W('月光剪接完成。重播保留你選的時間、位置與大小。','Your moonlight edit is complete. Replay your chosen timing, position and size.','月光の編集が完成。選んだ時刻・位置・大きさで再生。'),artifact:{cuts:state.cuts,attempts:state.attempts},replay:state.cuts.flatMap((cut,i)=>[{duration:cut.time,caption:W(`${names[i].zh}：切換前`,`${names[i].en}: before the cut`,`${names[i].ja}：切替前`),sprites:[{key:`actor${i+1}`,x:cut.x,y:40,width:cut.size,height:cut.size},{key:'target',x:TARGETS[i].x,y:40,width:TARGETS[i].size,height:TARGETS[i].size,opacity:0.4}]},{duration:1000,caption:W(`在 ${cut.time} 毫秒切換，圓的位置 ${cut.endX.toFixed(1)}％`,`Cut at ${cut.time} ms; circle at ${cut.endX.toFixed(1)}%`,`${cut.time}ミリ秒で切替・位置${cut.endX.toFixed(1)}％`),sprites:[{key:`actor${(i+1)%3+1}`,x:cut.endX,y:40,width:cut.size,height:cut.size}]}])});return;}
    values={time:500,x:10,size:12};Object.entries(sliders).forEach(([k,s])=>s.setValue(values[k]));playing=false;previewed=false;update();ctx.hint(W('下一段的速度不同，剪接點也要跟著調整。','The next shot moves differently. Reconsider the cut.','次のショットは速度が違います。カットも調整。'));
  }}));
  ctx.controls.append(...nodes);update();
  const stop=ctx.onFrame(({dt})=>{if(dead||!playing||state.done)return;clock+=dt*1000;draw(Math.min(clock,values.time));if(clock>=values.time){playing=false;previewed=true;draw();ctx.hint(W('已停在剪接點。比較圓的位置與大小，再決定保留或修改。','Paused at the cut. Compare position and size, then keep it or adjust.','カット位置で停止。円の位置と大きさを比べ、採用または調整。'));}});
  return {destroy(){dead=true;stop();actors.concat(target,board,camera,...shots).forEach(s=>s.remove());}};
}
