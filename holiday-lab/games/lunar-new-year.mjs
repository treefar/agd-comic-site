// An original Nian acting exercise; no camera or emotion recognition.
export const id='lunar-new-year';
export const createState=()=>({round:0,poses:[],attempts:0,done:false});
const limits={brow:[-30,30],eyes:[0.5,1.5],mouth:[0,1],pose:[0,40]};
export function evaluateExpression(round,v,intent='reserved'){
  if(!Number.isInteger(round)||round<0||round>2||!v||Object.entries(limits).some(([k,[min,max]])=>!Number.isFinite(v[k])||v[k]<min||v[k]>max)||(round===2&&!['comic','reserved'].includes(intent)))return {ok:false,reason:'invalid'};
  // Broad, visible relationships. There is no distance from a model expression.
  if(round===0){if(v.eyes<1.2)return {ok:false,reason:'surprise-eyes'};if(v.brow>-8)return {ok:false,reason:'surprise-brow'};if(v.mouth<.4)return {ok:false,reason:'surprise-mouth'};if(v.pose>16)return {ok:false,reason:'upright'};}
  if(round===1){if(v.eyes>1.05)return {ok:false,reason:'joy-eyes'};if(v.mouth<.6)return {ok:false,reason:'joy-mouth'};if(v.brow< -5)return {ok:false,reason:'joy-brow'};if(v.pose>18)return {ok:false,reason:'upright'};}
  if(round===2&&intent==='comic'){if(v.pose<22)return {ok:false,reason:'comic-bow'};if(v.eyes<1.1)return {ok:false,reason:'comic-eyes'};if(v.mouth<.7)return {ok:false,reason:'comic-mouth'};if(v.brow< -5)return {ok:false,reason:'joy-brow'};}
  if(round===2&&intent==='reserved'){if(v.pose<8)return {ok:false,reason:'reserved-bow-low'};if(v.pose>26)return {ok:false,reason:'reserved-bow-high'};if(v.eyes>1.05)return {ok:false,reason:'reserved-eyes'};if(v.mouth<.2)return {ok:false,reason:'reserved-mouth-low'};if(v.mouth>.65)return {ok:false,reason:'reserved-mouth-high'};if(Math.abs(v.brow)>18)return {ok:false,reason:'reserved-brow'};}
  return {ok:true,reason:'ok'};
}
export function submit(state,values,intent='reserved'){
  if(state.done)return {ok:false,state,reason:'done'};
  const verdict=evaluateExpression(state.round,values,intent);
  if(!verdict.ok)return {...verdict,state:verdict.reason==='invalid'?state:{...state,attempts:state.attempts+1}};
  const poses=[...state.poses,{values:{brow:values.brow,eyes:values.eyes,mouth:values.mouth,pose:values.pose},score:100,role:state.round,intent:state.round===2?intent:state.round===0?'surprise':'joy'}];
  return {ok:true,state:{round:state.round+1,poses,attempts:state.attempts+1,done:poses.length===3}};
}
export function expressionProps(v){
  const angle=v.pose*Math.PI/180,aspect=16/10,cx=49,cy=59;
  // Percent axes have different pixel scales: rotate in height units first.
  const center=(x,y)=>{const dx=(x-cx)*aspect,dy=y-cy;return {x:cx+(dx*Math.cos(angle)-dy*Math.sin(angle))/aspect,y:cy+dx*Math.sin(angle)+dy*Math.cos(angle),rotation:v.pose};};
  return {
    brow:{...center(50.4,43),width:13,height:7,rotation:v.pose+v.brow},
    eyes:{...center(50.4,47.5),width:14,height:7,scaleY:v.eyes},
    mouth:{...center(50.4,52),width:9,height:7,scaleY:0.3+v.mouth*1.2},
    body:{x:cx,y:cy,width:40,height:58,rotation:v.pose}
  };
}
const W=(zh,en,ja)=>({zh,en,ja});
const roles=[W('驚喜：看到新作品','Surprise: discovering new art','驚き：新しい作品を発見'),W('開心：朋友來了','Joy: a friend arrives','喜び：友だちが来た'),W('拜年：向大家鞠躬','Greeting: bow to everyone','新年の挨拶：みんなにお辞儀')];
export const INTENTS=Object.freeze([
 {value:'comic',label:W('誇張喜劇','Big comic greeting','大げさな喜劇'),note:W('大眼、大笑、深鞠躬，熱情招呼全場。','Big eyes, a wide grin and a deep bow greet the whole room.','大きな目と笑顔、深いお辞儀で会場にごあいさつ。')},
 {value:'reserved',label:W('含蓄問候','Quiet greeting','控えめなあいさつ'),note:W('眼神放鬆、小小微笑、輕鞠躬，向朋友致意。','Relaxed eyes, a small smile and a light bow greet a friend.','やわらかな目、小さな笑顔、軽いお辞儀で友だちに。')}
]);
const directions=[W('先睜大眼、傾斜眉，張嘴接住驚喜；先別急著鞠躬。','Open the eyes, tilt the brows and open the mouth for surprise. Stay upright.','目を大きく、眉を傾け、口を開いて驚きを。まだお辞儀はしません。'),W('朋友來了。把驚訝的大眼放鬆，眉毛回平，讓笑口成為重點。','A friend arrives. Relax the startled eyes and level the brows so the grin stands out.','友だちが来た。驚いた目をゆるめ、眉を戻し、笑顔を主役に。')];
const feedback={
 invalid:W('這組設定無法演出，請重新調整。','These settings cannot be performed. Adjust them.','この設定では演じられません。調整してください。'),
 'surprise-eyes':W('眼睛還沒睜大，驚喜看不出來。試著把眼睛張開。','The eyes still look relaxed. Open them wider for surprise.','まだ目が落ち着いています。大きく開いて驚きを見せよう。'),
 'surprise-brow':W('眼睛睜大了，眉毛還接近平直。把眉毛的傾斜做得更明顯。','The eyes are wide, but the brows are almost level. Give the brows a clearer tilt.','目は大きいのに眉はまだ平らに近いです。眉の傾きをはっきりさせよう。'),
 'surprise-mouth':W('眼眉驚訝，嘴卻閉住了。張嘴，接住看到作品的那一聲。','The eyes and brows are surprised, but the mouth is shut. Open it to react.','目と眉は驚いているのに口が閉じています。口でも反応しよう。'),
 upright:W('身體先鞠躬了，表情反而不突出。這幕先站直演。','The bow distracts from the expression. Stay upright for this act.','お辞儀で表情が目立ちません。この幕は体を起こそう。'),
 'joy-eyes':W('眼睛還像剛被嚇到。放鬆眼神，讓笑口成為重點。','The eyes still look startled. Relax them so the grin becomes the focus.','まだ驚いた目。目をゆるめて笑顔を主役にしよう。'),
 'joy-mouth':W('眼神放鬆了，笑口卻還太小。把嘴張開，讓開心被看見。','The eyes are relaxed, but the grin is small. Open the mouth to show joy.','目はやわらいだのに笑顔が小さい。口を開いて喜びを見せよう。'),
 'joy-brow':W('眉毛還停在驚訝的斜角。讓眉毛回平，接上開心的笑口。','The brows still lean in surprise. Level them to match the happy grin.','眉がまだ驚いた角度。笑顔に合わせて眉を戻そう。'),
 'comic-bow':W('鞠躬還很輕。用深鞠躬把喜劇動作做大。','The greeting needs a bigger gesture. Deepen the bow for the comic ending.','喜劇には動きも大きく。お辞儀を深くしよう。'),
 'comic-eyes':W('深鞠躬有了，眼神還很含蓄。睜大眼，把熱情送到全場。','The bow is big, but the eyes are quiet. Widen them for an exuberant greeting.','深いお辞儀に目が控えめ。大きく開いて会場に元気を届けよう。'),
 'comic-mouth':W('大動作配小小嘴，熱情還沒接上。讓笑口跟上鞠躬。','A small mouth weakens the big gesture. Let the grin match the bow.','大きな動きに口が小さい。お辞儀に負けない笑顔に。'),
 'reserved-bow-low':W('身體還站直。輕輕鞠躬，讓朋友知道你在致意。','The body is still upright. Add a light bow to greet your friend.','体がまだまっすぐ。軽くお辞儀して友だちに気持ちを伝えよう。'),
 'reserved-bow-high':W('這個鞠躬像熱鬧登場。把身體收回一點，留下輕聲問候的感覺。','The bow is deep. Ease it back for a quieter greeting.','お辞儀が深いです。浅くして静かなあいさつに。'),
 'reserved-eyes':W('眼睛還睜得很大，像熱情登場。放鬆眼神，配合含蓄問候。','The wide eyes feel like a grand entrance. Relax them for the quiet greeting.','目が大きく、華やかな登場に見えます。静かなあいさつなら目をゆるめよう。'),
 'reserved-mouth-low':W('嘴閉得太緊，像還沒開口。留一點微笑。','The mouth looks tightly shut. Leave a little smile.','口が固く閉じています。少し笑顔を残そう。'),
 'reserved-mouth-high':W('笑口比輕鞠躬更誇張。收小一點，保留含蓄的微笑。','The grin overpowers the light bow. Soften it into a smaller smile.','笑顔が軽いお辞儀より大げさ。小さくして控えめに。'),
 'reserved-brow':W('眉毛斜得很搶眼。收回一點，讓眼神與微笑說話。','The tilted brows dominate. Level them a little so the eyes and smile can speak.','眉の傾きが目立ちます。少し戻して目と笑顔で伝えよう。')
};
export function expressionFeedback(reason,values){
 if(reason==='surprise-brow'&&values.brow>=8)return W('眉毛往另一邊傾斜了。換個方向，搭配睜大的眼睛試試。','The brows tilt the other way. Reverse their tilt to match the wide-eyed surprise.','眉の傾きが逆向きです。大きく開いた目に合わせ、傾きを反対にしてみよう。');
 return feedback[reason];
}
function observation(round,values,intent){const v=evaluateExpression(round,values,intent);return v.ok?[W('眼眉和張嘴一起接住了驚喜，可拍下或再演一版。','The eyes, brows and open mouth convey surprise. Capture it or try another version.','目・眉・口で驚きが伝わります。撮影するか、別の演技を。'),W('放鬆的眼神襯出了笑口，開心看得見。','The relaxed eyes let the grin shine. Joy reads clearly.','やわらかな目が笑顔を引き立て、喜びが伝わります。'),W('表情與鞠躬都接上了你選的問候。','The expression and bow match your chosen greeting.','表情とお辞儀が、選んだあいさつに合っています。')][round]:expressionFeedback(v.reason,values);}
export function buildResult(state){
 if(!state.done||state.poses.length!==3)throw Error('Three completed expressive acts required');
 return {score:100,summary:W('三幕完成。回放保留你的表情、鞠躬與問候意圖；探索不扣分。','Three acts ready. Replay keeps your expressions, bows and greeting intent. Exploring does not reduce your score.','3幕が完成。自分の表情、お辞儀、あいさつの狙いを再生。試行回数では減点しません。'),artifact:{poses:state.poses.map(p=>({...p,values:{...p.values}})),attempts:state.attempts},replay:state.poses.map((v,i)=>{const p=expressionProps(v.values),label=i===2?INTENTS.find(t=>t.value===v.intent).label:roles[i];return {duration:1500+v.values.pose*15,caption:label,sprites:[{key:`actor${i+1}`,...p.body},{key:'prop1',...p.brow,z:5},{key:'prop2',...p.eyes,z:5},{key:'prop3',...p.mouth,z:5},{key:`token${i+1}`,x:86,y:24,width:20,height:25}]};})};
}
export function mount(ctx){
  let state=createState(),values={brow:0,eyes:1,mouth:0,pose:0},intent='reserved',dead=false,time=0;
  const nodes=[],sliders={};
  nodes.push(ctx.ui.text('lny-intro',W('眉、眼、嘴一起演戲。看畫面，試出自己的三幕。','Brows, eyes and mouth act together. Watch the face and shape three acts of your own.','眉・目・口で演じよう。顔を見ながら、自分だけの3幕に。')));
  const role=ctx.ui.text('lny-role',roles[0]);nodes.push(role);
  const reference=ctx.ui.text('lny-reference',W('','',''));nodes.push(reference);
  const observed=ctx.ui.text('lny-observation',W('','',''));nodes.push(observed);
  const initial=expressionProps(values);
  const bodies=[0,1,2].map(i=>ctx.sprite(`actor${i+1}`,{id:`lny-body-${i}`,...initial.body,opacity:i===0?1:0}));
  const brow=ctx.sprite('prop1',{id:'lny-brow-sprite',...initial.brow,z:5});
  const eyes=ctx.sprite('prop2',{id:'lny-eyes-sprite',...initial.eyes,z:5});
  const mouth=ctx.sprite('prop3',{id:'lny-mouth-sprite',...initial.mouth,z:5});
  const card=ctx.sprite('token1',{id:'lny-card-surprise',x:86,y:24,width:20,height:25});
  const card2=ctx.sprite('token2',{id:'lny-card-smile',x:86,y:52,width:20,height:25,opacity:0});
  const card3=ctx.sprite('token3',{id:'lny-card-bow',x:86,y:80,width:20,height:25,opacity:0});
  const cards=[card,card2,card3];
  function draw(){const p=expressionProps(values);bodies.forEach((s,i)=>s.update({...p.body,opacity:i===state.round?1:0}));brow.update(p.brow);eyes.update(p.eyes);mouth.update(p.mouth);}
  const labels={brow:W('眉毛角度','Brow angle','眉の角度'),eyes:W('眼睛張開','Eye openness','目の開き'),mouth:W('嘴形張開','Mouth openness','口の開き'),pose:W('鞠躬角度','Bow angle','お辞儀の角度')};
  function observe(){const words=observation(state.round,values,intent);ctx.ui.setText(observed,words);ctx.hint(words);}
  Object.entries(limits).forEach(([key,[min,max]])=>{const s=ctx.ui.slider({id:`lny-${key}`,label:labels[key],min,max,step:key==='eyes'||key==='mouth'?0.1:1,value:values[key],onInput:v=>{values[key]=Number(v);draw();observe();}});sliders[key]=s;nodes.push(s.element);});
  const intention=ctx.ui.choice({id:'lny-intent',label:W('最後想怎麼拜年？','How should the greeting feel?','最後はどんなあいさつ？'),options:INTENTS,value:intent,onChange:v=>{intent=v;update();}});nodes.push(intention.element);
  function update(){ctx.ui.setText(role,roles[state.round]);ctx.ui.setText(reference,state.round===2?INTENTS.find(t=>t.value===intent).note:directions[state.round]);intention.element.hidden=state.round!==2;cards.forEach((s,i)=>s.update({opacity:i===state.round?1:0.25}));ctx.setProgress(state.round,3);draw();observe();}
  nodes.push(ctx.ui.button({id:'lny-reset-pose',label:W('表情歸零','Reset expression','表情をリセット'),onClick:()=>{values={brow:0,eyes:1,mouth:0,pose:0};Object.entries(sliders).forEach(([k,s])=>s.setValue(values[k]));draw();observe();}}));
  nodes.push(ctx.ui.button({id:'lny-submit',label:W('拍下這一幕','Capture this act','この幕を撮影'),onClick:()=>{
    if(dead||state.done)return;const r=submit(state,values,intent);state=r.state;
    if(!r.ok){ctx.sound('error');ctx.hint(expressionFeedback(r.reason,values));return;}
    ctx.sound('success');ctx.setProgress(state.round,3);
    if(state.done){ctx.complete(buildResult(state));return;}
    update();ctx.hint(W('保留上一幕的表情。看新任務，再決定要改哪裡。','Your expression stays. Read the new act and decide what to change.','前の表情を残しました。次の狙いを見て、変えるところを考えよう。'));
  }}));
  ctx.controls.append(...nodes);update();
  const off=ctx.onFrame(({dt})=>{time+=dt;if(dead||state.done||ctx.reducedMotion)return;bodies[state.round].update({scaleX:1+Math.sin(time*2)*0.015,scaleY:1-Math.sin(time*2)*0.01});});
  return {destroy(){dead=true;off();bodies.concat(brow,eyes,mouth,...cards).forEach(s=>s.remove());}};
}
