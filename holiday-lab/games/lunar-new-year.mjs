// An original Nian acting exercise; no camera or emotion recognition.
export const id='lunar-new-year';
export const TARGETS=Object.freeze([{brow:-20,eyes:1.4,mouth:0.7,pose:0},{brow:10,eyes:0.8,mouth:1,pose:0},{brow:0,eyes:0.7,mouth:0.5,pose:30}].map(Object.freeze));
export const createState=()=>({round:0,poses:[],attempts:0,done:false});
const limits={brow:[-30,30],eyes:[0.5,1.5],mouth:[0,1],pose:[0,40]};
export function submit(state,values){
  if(state.done||!values||Object.entries(limits).some(([k,[min,max]])=>!Number.isFinite(values[k])||values[k]<min||values[k]>max))return {ok:false,state,reason:'invalid'};
  const target=TARGETS[state.round],tol={brow:7,eyes:0.16,mouth:0.16,pose:7};
  if(Object.keys(tol).some(k=>Math.abs(values[k]-target[k])>tol[k]+1e-8))return {ok:false,state:{...state,attempts:state.attempts+1},reason:'expression'};
  const quality=Math.round(100-Object.keys(tol).reduce((sum,k)=>sum+Math.abs(values[k]-target[k])/tol[k],0)*6);
  const poses=[...state.poses,{values:{brow:values.brow,eyes:values.eyes,mouth:values.mouth,pose:values.pose},score:quality,role:state.round}];
  return {ok:true,state:{round:state.round+1,poses,attempts:state.attempts+1,done:poses.length===3}};
}
export function expressionProps(v){
  const angle=v.pose*Math.PI/180;
  const center=(y)=>({x:49-(y-59)*Math.sin(angle),y:59+v.pose/5+(y-59)*Math.cos(angle),rotation:v.pose});
  return {brow:{...center(31-v.brow/12),rotation:v.pose+v.brow},eyes:{...center(41),scaleY:v.eyes},mouth:{...center(51),scaleY:0.3+v.mouth*1.2},body:{x:49,rotation:v.pose,y:59+v.pose/5}};
}
const W=(zh,en,ja)=>({zh,en,ja});
const roles=[W('驚喜：看到新作品','Surprise: discovering new art','驚き：新しい作品を発見'),W('開心：朋友來了','Joy: a friend arrives','喜び：友だちが来た'),W('拜年：向大家鞠躬','Greeting: bow to everyone','新年の挨拶：みんなにお辞儀')];
export function mount(ctx){
  let state=createState(),values={brow:0,eyes:1,mouth:0,pose:0},dead=false,time=0;
  const nodes=[],sliders={};
  nodes.push(ctx.ui.text('lny-intro',W('用眉、眼、嘴和鞠躬幅度，演出三幕。參考卡給方向，滑桿保留自己的表演。','Direct three acts with brows, eyes, mouth and a bow. Use the reference, then add your own variation.','眉・目・口・お辞儀で3幕を演出。見本を参考に、自分らしい変化を。')));
  const role=ctx.ui.text('lny-role',roles[0]);nodes.push(role);
  const reference=ctx.ui.text('lny-reference',W('','',''));nodes.push(reference);
  const bodies=[0,1,2].map(i=>ctx.sprite(`actor${i+1}`,{id:`lny-body-${i}`,x:49,y:59,width:40,height:58,opacity:i===0?1:0}));
  const brow=ctx.sprite('prop1',{id:'lny-brow-sprite',x:49,y:31,width:22,height:11,z:5});
  const eyes=ctx.sprite('prop2',{id:'lny-eyes-sprite',x:49,y:41,width:22,height:10,z:5});
  const mouth=ctx.sprite('prop3',{id:'lny-mouth-sprite',x:49,y:51,width:13,height:10,z:5});
  const card=ctx.sprite('token1',{id:'lny-card-surprise',x:86,y:24,width:20,height:25});
  const card2=ctx.sprite('token2',{id:'lny-card-smile',x:86,y:52,width:20,height:25,opacity:0});
  const card3=ctx.sprite('token3',{id:'lny-card-bow',x:86,y:80,width:20,height:25,opacity:0});
  const cards=[card,card2,card3];
  function draw(){const p=expressionProps(values);bodies.forEach((s,i)=>s.update({...p.body,opacity:i===state.round?1:0}));brow.update(p.brow);eyes.update(p.eyes);mouth.update(p.mouth);}
  const labels={brow:W('眉毛角度','Brow angle','眉の角度'),eyes:W('眼睛張開','Eye openness','目の開き'),mouth:W('嘴形張開','Mouth openness','口の開き'),pose:W('鞠躬角度','Bow angle','お辞儀の角度')};
  Object.entries(limits).forEach(([key,[min,max]])=>{const s=ctx.ui.slider({id:`lny-${key}`,label:labels[key],min,max,step:key==='eyes'||key==='mouth'?0.1:1,value:values[key],onInput:v=>{values[key]=Number(v);draw();}});sliders[key]=s;nodes.push(s.element);});
  function update(){ctx.ui.setText(role,roles[state.round]);const t=TARGETS[state.round];ctx.ui.setText(reference,W(`參考：眉 ${t.brow}°、眼 ${t.eyes}、嘴 ${t.mouth}、鞠躬 ${t.pose}°。可有小幅變化。`,`Reference: brows ${t.brow}°, eyes ${t.eyes}, mouth ${t.mouth}, bow ${t.pose}°. Small variations are welcome.`,`見本：眉${t.brow}°・目${t.eyes}・口${t.mouth}・お辞儀${t.pose}°。少し変えてもOK。`));cards.forEach((s,i)=>s.update({opacity:i===state.round?1:0.25}));ctx.setProgress(state.round,3);draw();}
  nodes.push(ctx.ui.button({id:'lny-reset-pose',label:W('表情歸零','Reset expression','表情をリセット'),onClick:()=>{values={brow:0,eyes:1,mouth:0,pose:0};Object.entries(sliders).forEach(([k,s])=>s.setValue(values[k]));draw();}}));
  nodes.push(ctx.ui.button({id:'lny-submit',label:W('拍下這一幕','Capture this act','この幕を撮影'),onClick:()=>{
    if(dead||state.done)return;const r=submit(state,values);state=r.state;
    if(!r.ok){ctx.sound('error');ctx.hint(W('表演還沒到位。驚喜要睜眼，開心要展笑，拜年要鞠躬。','Not quite there. Open the eyes for surprise, smile for joy, and bow for the greeting.','もう少し。驚きは目を開き、喜びは笑顔、挨拶はお辞儀。'));return;}
    ctx.sound('success');ctx.setProgress(state.round,3);
    if(state.done){ctx.complete({score:Math.round(state.poses.reduce((a,v)=>a+v.score,0)/3),summary:W('年獸三幕表演完成，重播你調出的表情與動作。','The Nian’s three-act performance is ready. Replay your expressions and bow.','年獣の3幕が完成。調整した表情とお辞儀を再生。'),artifact:{poses:state.poses,attempts:state.attempts},replay:state.poses.map((v,i)=>{const p=expressionProps(v.values);return {duration:1500+v.values.pose*15,caption:roles[i],sprites:[{key:`actor${i+1}`,...p.body,width:40,height:58},{key:'prop1',...p.brow,width:22,height:11,z:5},{key:'prop2',...p.eyes,width:22,height:10,z:5},{key:'prop3',...p.mouth,width:13,height:10,z:5},{key:`token${i+1}`,x:86,y:24,width:20,height:25}]};})});return;}
    values={brow:0,eyes:1,mouth:0,pose:0};Object.entries(sliders).forEach(([k,s])=>s.setValue(values[k]));update();ctx.hint(W('換下一幕，調整同一隻年獸的演出。','Next act: direct the same Nian in a new mood.','次の幕。同じ年獣に別の演技をつけよう。'));
  }}));
  ctx.controls.append(...nodes);update();
  const off=ctx.onFrame(({dt})=>{time+=dt;if(dead||state.done||ctx.reducedMotion)return;bodies[state.round].update({scaleX:1+Math.sin(time*2)*0.015,scaleY:1-Math.sin(time*2)*0.01});});
  return {destroy(){dead=true;off();bodies.concat(brow,eyes,mouth,...cards).forEach(s=>s.remove());}};
}
