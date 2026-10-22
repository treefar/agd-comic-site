// A fictional paper-wrapping puzzle. The projected planes are a game model, not a cooking instruction.
export const id='dragon-boat';
const w=(zh,en,ja)=>({zh,en,ja});
const centered=p=>({...p,x:p.x+p.width/2,y:p.y+p.height/2});
const leaves=['left','right','top'];
const names={left:w('左葉','Left leaf','左の葉'),right:w('右葉','Right leaf','右の葉'),top:w('上葉','Top leaf','上の葉')};
export const createState=()=>({leaf:'left',angle:0,face:'inside',folded:[],misses:0,feedback:'intro'});
export function coverage(leaf,angle){
  if(!leaves.includes(leaf)||!Number.isFinite(angle)||angle<90||angle>180)return 0;
  const reach=-Math.cos(angle*Math.PI/180)*30;
  const samples=leaf==='top'?[10,18,26]:[10,14,18];
  return samples.filter(distance=>reach>=distance).length/samples.length;
}
export function change(state,key,value){
  if(state.folded.length===3)return state;
  if(key==='leaf'&&leaves.includes(value))return {...state,leaf:value,feedback:'adjust'};
  if(key==='face'&&['inside','outside'].includes(value))return {...state,face:value,feedback:'adjust'};
  if(key==='angle'&&Number.isFinite(value)&&value>=0&&value<=180)return {...state,angle:value,feedback:'adjust'};
  return state;
}
export function fold(state){
  if(state.folded.length===3)return state;
  const expected=leaves[state.folded.length];
  const feedback=state.leaf!==expected?'order':state.face!=='inside'?'face':coverage(state.leaf,state.angle)<1?'coverage':state.angle>175?'crease':'ok';
  if(feedback!=='ok')return {...state,misses:state.misses+1,feedback};
  const folded=[...state.folded,{leaf:state.leaf,angle:state.angle,face:state.face,coverage:coverage(state.leaf,state.angle)}];
  return {...state,folded,leaf:leaves[Math.min(folded.length,2)],angle:0,face:'inside',feedback:'ok'};
}
export function unfold(state){
  if(!state.folded.length)return {...state,angle:0,feedback:'intro'};
  const previous=state.folded.at(-1);
  return {...state,folded:state.folded.slice(0,-1),leaf:previous.leaf,angle:previous.angle,face:previous.face,feedback:'unfold'};
}
function plane(leaf,angle,z=3){
  const cos=Math.cos(angle*Math.PI/180),span=Math.max(.6,Math.abs(cos)*30);
  if(leaf==='left')return {key:'token1',x:cos>=0?32-span:32,y:29,width:span,height:35,rotation:0,z};
  if(leaf==='right')return {key:'token2',x:cos>=0?68:68-span,y:29,width:span,height:35,rotation:0,z};
  return {key:'token3',x:35,y:cos>=0?25-span:25,width:30,height:span,rotation:0,z};
}
export function result(state){
  if(state.folded.length!==3 || state.folded.some((f,i)=>f.leaf!==leaves[i]||coverage(f.leaf,f.angle)!==1||f.face!=='inside'))return null;
  return {score:Math.max(50,100-state.misses*4),summary:w('紙葉包好了。每一次摺角都會保留在你的作品裡。','Paper package complete. Your actual fold angles are kept in the replay.','紙の包みが完成。実際に折った角度を再生します。'),artifact:{folds:state.folded,misses:state.misses},replay:state.folded.map((f,i)=>({duration:2300,caption:w(`${names[f.leaf].zh}：${f.angle} 度`,`${names[f.leaf].en}: ${f.angle} degrees`,`${names[f.leaf].ja}：${f.angle}度`),sprites:[{key:'prop1',x:42,y:35,width:16,height:20,z:1},...state.folded.slice(0,i+1).map((p,j)=>plane(p.leaf,p.angle,j+2)),...(i===2?[{key:'prop2',x:40,y:30,width:20,height:37,z:8}]:[])].map(centered)}))};
}
export function mount(ctx){
  const sprite=(key,props)=>ctx.sprite(key,centered(props));
  let state=createState(),finished=false,visual=[];
  const heading=ctx.ui.text('fold-task',w('粽葉折疊局','Paper-leaf folds','葉っぱの折り紙'));
  ctx.ui.text('fold-rule',w('這是虛構紙藝：左葉打底、右葉交疊、上葉封口。調整摺角覆蓋紙餡料，紋路朝內；太平的摺面無法扣住。','A fictional paper puzzle: left base, right overlap, then top closure. Fold far enough to cover the filling, pattern inward; a completely flat fold will not hold.','架空の紙工作です。左で土台、右を重ね、上を閉じます。模様を内側にして中身を覆い、平らに倒しすぎないように。'));
  const status=ctx.ui.text('fold-status',w('','',''));
  const leaf=ctx.ui.choice({id:'fold-leaf',label:w('操作哪片葉','Choose a leaf','操作する葉'),options:leaves.map(value=>({value,label:names[value]})),value:'left',onChange:v=>adjust('leaf',v)});
  const angle=ctx.ui.slider({id:'fold-angle',label:w('摺角（度）','Fold angle (degrees)','折る角度（度）'),min:0,max:180,step:1,value:0,onInput:v=>adjust('angle',v)});
  const face=ctx.ui.choice({id:'fold-face',label:w('紋路朝向','Pattern direction','模様の向き'),options:[{value:'inside',label:w('朝內','Inward','内側')},{value:'outside',label:w('朝外','Outward','外側')}],value:'inside',onChange:v=>adjust('face',v)});
  ctx.ui.button({id:'fold-commit',label:w('壓住這一摺','Press this fold','この折り目を押さえる'),onClick:()=>{
    if(finished)return;
    const before=state.folded.length;state=fold(state);ctx.sound(state.folded.length>before?'paper':'error');
    if(state.folded.length===3){finished=true;ctx.setProgress(3,3);ctx.complete(result(state));return;}
    sync();render();
  }});
  ctx.ui.button({id:'fold-unfold',label:w('展開上一摺','Undo last fold','前の折り目を開く'),onClick:()=>{if(finished)return;state=unfold(state);sync();render();ctx.sound('paper');}});
  ctx.ui.button({id:'fold-reset',label:w('全部展開','Unfold all','すべて開く'),onClick:()=>{if(finished)return;state=createState();sync();render();}});
  const base=sprite('actor1',{id:'fold-base',x:10,y:10,width:80,height:78,opacity:.2,z:0});
  const filling=sprite('prop1',{id:'fold-filling',x:42,y:35,width:16,height:20,z:1});
  const outline=sprite('target',{id:'fold-target',x:34,y:28,width:32,height:40,opacity:.4,z:2});
  function sync(){leaf.setValue(state.leaf);angle.setValue(state.angle);face.setValue(state.face);}
  function adjust(k,v){if(finished)return;state=change(state,k,v);render();}
  function render(){
    visual.forEach(s=>s.remove());visual=[];
    state.folded.forEach((f,i)=>{const p=plane(f.leaf,f.angle,i+3);visual.push(sprite(p.key,{id:`fold-done-${i}`,...p}));});
    const p=plane(state.leaf,state.angle,7);visual.push(sprite(p.key,{id:'fold-preview',...p,opacity:state.face==='inside'?.85:.45}));
    ctx.ui.setText(heading,w(`第 ${state.folded.length+1} 摺：${names[leaves[state.folded.length]].zh}`,`Fold ${state.folded.length+1}: ${names[leaves[state.folded.length]].en}`,`第${state.folded.length+1}折：${names[leaves[state.folded.length]].ja}`));
    const covered=Math.round(coverage(state.leaf,state.angle)*100);
    ctx.ui.setText(status,w(`目前覆蓋 ${covered}%；角度 ${state.angle} 度。左、右約 140 度，上葉約 160 度。`,`Coverage ${covered}%; angle ${state.angle}°. Try about 140° left/right and 160° top.`,`現在の覆い ${covered}%、角度 ${state.angle}度。左右は約140度、上は約160度。`));
    ctx.setProgress(state.folded.length,3);
    const messages={intro:w('先選左葉，拉動角度，看葉面往中間覆蓋。','Start with the left leaf. Move the angle slider and watch it cover the center.','左の葉から始めます。角度を動かして中央を覆いましょう。'),adjust:w('確認覆蓋到 100%、紋路朝內，再壓住摺面。','Reach 100% coverage with the pattern inward, then press the fold.','覆いが100%、模様が内側になったら折り目を押さえます。'),order:w('這片現在還壓不住。依左、右、上的順序交疊。','This leaf has no support yet. Overlap left, right, then top.','この葉はまだ支えがありません。左、右、上の順に重ねましょう。'),face:w('紋路露在外面了，先把它轉成朝內。','The pattern faces out. Turn it inward first.','模様が外を向いています。内側に向けましょう。'),coverage:w('還有紙餡料露出，增加摺角再試。','Some filling is exposed. Increase the fold angle and retry.','中身がまだ出ています。角度を増やして再挑戦。'),crease:w('摺得太平無法扣住，稍微展開一點。','Too flat to hold. Open the angle slightly.','平らすぎて留まりません。少し戻しましょう。'),ok:w('這一摺固定了，下一片接著覆蓋。','Fold secured. Bring the next leaf over.','折り目が留まりました。次の葉を重ねましょう。'),unfold:w('上一摺已展開，可以重新調角度。','Last fold opened. Adjust its angle again.','前の折り目を開きました。角度を調整できます。')};
    ctx.hint(messages[state.feedback]);
  }
  render();
  return {destroy(){finished=true;visual.forEach(s=>s.remove());base.remove();filling.remove();outline.remove();}};
}
