// Original parallax composition exercise with a moving camera and a measurable clear sightline.
export const id='national-day';
const w=(zh,en,ja)=>({zh,en,ja});
const centered=p=>({...p,x:p.x+p.width/2,y:p.y+p.height/2});
export const tasks=Object.freeze([{camera:-12,coast:55,ridge:48},{camera:0,coast:50,ridge:50},{camera:12,coast:45,ridge:52}]);
export const createState=()=>({level:0,camera:0,fore:0,mid:0,far:0,order:'normal',shots:[],misses:0,feedback:'intro'});
export function change(state,key,value){
  if(state.level>=3)return state;
  if(key==='order'&&['normal','reversed'].includes(value))return {...state,order:value,feedback:'adjust'};
  const limit=key==='camera'?20:30;
  if(!['camera','fore','mid','far'].includes(key)||!Number.isFinite(value)||Math.abs(value)>limit)return state;
  return {...state,[key]:value,feedback:'adjust'};
}
export const frame=state=>({fore:50+state.fore-state.camera*.9,mid:50+state.mid-state.camera*.5,far:50+state.far-state.camera*.2,subject:50-state.camera*.6});
export function capture(state){
  if(state.level>=3)return state;
  const t=tasks[state.level],f=frame(state);
  const feedback=state.order!=='normal'?'order':Math.abs(f.fore-f.subject)<14?'blocked':Math.abs(state.camera-t.camera)>2?'camera':Math.abs(f.mid-t.coast)>3?'coast':Math.abs(f.far-t.ridge)>3?'ridge':'ok';
  if(feedback!=='ok')return {...state,misses:state.misses+1,feedback};
  return {...state,level:state.level+1,shots:[...state.shots,{camera:state.camera,fore:state.fore,mid:state.mid,far:state.far,order:state.order,...Object.fromEntries(Object.entries(f).map(([k,v])=>[`screen_${k}`,v]))}],feedback:'ok'};
}
function shotSprites(s){
  const f=frame(s);
  return [{key:'actor3',x:f.far-45,y:10,width:90,height:40,z:1},{key:'actor2',x:f.mid-45,y:36,width:90,height:35,z:2},{key:'actor1',x:f.fore-40,y:73,width:80,height:24,z:5},{key:'prop1',x:f.subject-6,y:40,width:12,height:38,z:4},{key:'prop2',x:f.fore-7,y:35,width:14,height:50,z:6}];
}
export function result(state){
  if(state.level!==3||state.shots.length!==3)return null;
  return {score:Math.max(50,100-state.misses*4),summary:w('島嶼三鏡頭完成。移動攝影機時，前景走得比山景更快。','Your island sequence is ready. The foreground moves faster than the mountains as the camera travels.','島の三つのカットが完成。カメラを動かすと手前は山より速く動きます。'),artifact:{shots:state.shots,misses:state.misses},replay:state.shots.map((s,i)=>({duration:2400,caption:w(`鏡頭 ${i+1}：攝影機 ${s.camera}，主角保持可見`,`Shot ${i+1}: camera ${s.camera}, subject stays visible`,`カット${i+1}：カメラ ${s.camera}、人物を見失わない`),sprites:shotSprites(s).map(centered)}))};
}
export function mount(ctx){
  const sprite=(key,props)=>ctx.sprite(key,centered(props));
  let state=createState(),finished=false,visual=[];
  const heading=ctx.ui.text('island-task',w('島嶼場景工作室','Island scene studio','島の背景スタジオ'));
  ctx.ui.text('island-rule',w('排好城市前景、海岸中景與山遠景。移動鏡頭拍三張：樹不能擋住學生，海岸與山也要對到參考位置。','Arrange city foreground, coast middle ground and distant mountains. Capture three camera positions with the student visible and the scenery aligned to the references.','街の手前・海岸の中景・山の遠景を配置します。人物を木で隠さず、見本に合わせて三つのカットを撮ります。'));
  const readout=ctx.ui.text('island-readout',w('','',''));
  const controls={};
  for(const [key,label] of [['fore',w('前景與樹的位移','Foreground / tree offset','手前と木の位置')],['mid',w('海岸位移','Coast offset','海岸の位置')],['far',w('山景位移','Mountain offset','山の位置')],['camera',w('攝影機橫移','Camera travel','カメラの横移動')]]){
    controls[key]=ctx.ui.slider({id:`island-${key}`,label,min:key==='camera'?-20:-30,max:key==='camera'?20:30,step:1,value:0,onInput:v=>{if(finished)return;state=change(state,key,v);render();}});
  }
  ctx.ui.choice({id:'island-order',label:w('場景層次','Scene depth order','背景の重なり順'),options:[{value:'normal',label:w('城市前、海岸中、山在後','City / coast / mountains','街が手前・海岸・山が奥')},{value:'reversed',label:w('山在前、城市在後','Mountains / coast / city','山が手前・海岸・街が奥')}],value:'normal',onChange:v=>{if(finished)return;state=change(state,'order',v);render();}});
  ctx.ui.button({id:'island-capture',label:w('拍下這個鏡頭','Capture this shot','このカットを撮る'),onClick:()=>{
    if(finished)return;
    const previous=state.level;state=capture(state);ctx.sound(state.level>previous?'success':'error');
    if(state.level===3){finished=true;ctx.setProgress(3,3);ctx.complete(result(state));return;}
    render();
  }});
  ctx.ui.button({id:'island-reset-shot',label:w('重排這個鏡頭','Reset this composition','この構図をリセット'),onClick:()=>{
    if(finished)return;
    state={...state,camera:0,fore:0,mid:0,far:0,feedback:'intro'};
    Object.values(controls).forEach(c=>c.setValue(0));render();
  }});
  function render(){
    visual.forEach(s=>s.remove());visual=[];
    const t=tasks[state.level],f=frame(state);
    for(const [index,p] of shotSprites(state).entries()){
      if(state.order==='reversed'&&['actor1','actor2','actor3'].includes(p.key))p.z=8-p.z;
      visual.push(sprite(p.key,{id:`island-scene-${index}`,...p}));
    }
    visual.push(sprite('target',{id:'island-reference',x:50-t.camera*.6-10,y:32,width:20,height:48,z:8,opacity:.25}));
    visual.push(sprite('token2',{id:'island-coast-reference',x:t.coast-6,y:86,width:12,height:10,z:9,opacity:.5}));
    visual.push(sprite('token3',{id:'island-ridge-reference',x:t.ridge-6,y:0,width:12,height:10,z:9,opacity:.5}));
    ctx.ui.setText(heading,w(`第 ${state.level+1} 鏡：島嶼橫移`,`Shot ${state.level+1}: island travel`,`第${state.level+1}カット：島を横移動`));
    ctx.ui.setText(readout,w(`鏡頭 ${state.camera}／目標 ${t.camera}；海岸 ${f.mid.toFixed(1)}／${t.coast}；山 ${f.far.toFixed(1)}／${t.ridge}；視線${Math.abs(f.fore-f.subject)>=14?'清楚':'被樹擋住'}`,`Camera ${state.camera} / ${t.camera}; coast ${f.mid.toFixed(1)} / ${t.coast}; ridge ${f.far.toFixed(1)} / ${t.ridge}; sightline ${Math.abs(f.fore-f.subject)>=14?'clear':'blocked'}`,`カメラ ${state.camera}／${t.camera}、海岸 ${f.mid.toFixed(1)}／${t.coast}、山 ${f.far.toFixed(1)}／${t.ridge}、視線${Math.abs(f.fore-f.subject)>=14?'良好':'木が遮る'}`));
    const messages={intro:w('先把樹往旁邊移，再對齊鏡頭、海岸與山。','Move the tree aside, then align camera, coast and mountains.','まず木を横へ。その後カメラ・海岸・山を合わせます。'),adjust:w('前景移動較快，遠景移動較慢。每次橫移後檢查構圖。','The foreground shifts faster than distant scenery. Check the composition after each move.','手前は速く、遠くはゆっくり動きます。横移動のたびに構図を確認。'),order:w('山景擋到前面了，請恢復城市、海岸、山的景深順序。','The mountains are in front. Restore city, coast, then mountain depth.','山が手前に来ています。街・海岸・山の順に戻しましょう。'),blocked:w('學生被樹遮住了，移開前景，留下清楚視線。','The tree hides the student. Move the foreground aside for a clear sightline.','木が人物を隠しています。手前をずらし、視線を確保しましょう。'),camera:w('鏡頭還不在拍攝位置，先對齊目標鏡頭數字。','The camera is not at the shot position. Match the target camera value first.','撮影位置が違います。まずカメラを目標の数値に合わせましょう。'),coast:w('主角可見了，接著把海岸對齊參考位置。','The student is visible. Align the coast with its reference next.','人物は見えています。次に海岸を見本の位置へ。'),ridge:w('海岸已就位，再稍微移動遠方的山。','The coast is ready. Adjust the distant mountains slightly.','海岸は合っています。遠くの山を少し動かしましょう。'),ok:w('這個鏡頭收進作品了。保留場景，移到下一個拍攝位置。','Shot saved. Keep your scene and move to the next camera position.','カットを保存しました。背景を保ち、次の撮影位置へ移動。')};
    ctx.hint(messages[state.feedback]);ctx.setProgress(state.level,3);
  }
  render();
  return {destroy(){finished=true;visual.forEach(s=>s.remove());}};
}
