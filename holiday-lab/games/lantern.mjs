// Original paper-shadow staging puzzle. Geometry is a readable stage model, not a physics simulator.
export const id = 'lantern';
const w = (zh, en, ja) => ({ zh, en, ja });
// Internal rectangles use top-left geometry; the shared renderer receives center coordinates.
const centered = p => ({...p,x:p.x+p.width/2,y:p.y+p.height/2});
export const tasks = Object.freeze([
  { key:'actor1', shadow:'token1', x:65, depth:20, order:'front', name:w('紙鶴','Paper crane','紙の鶴') },
  { key:'actor2', shadow:'token2', x:55, depth:50, order:'back', name:w('紙魚','Paper fish','紙の魚') },
  { key:'actor3', shadow:'token3', x:70, depth:75, order:'front', name:w('紙山','Paper mountain','紙の山') },
]);
export const createState = () => ({ level:0, lamp:30, paper:35, depth:0, order:'front', shots:[], misses:0, feedback:'intro' });
export function project({lamp,paper,depth}) { return { x:paper+(paper-lamp)*depth/100, scale:1+depth/100 }; }
export function change(state, key, value) {
  if (state.level >= 3) return state;
  const ranges = {lamp:[10,40], paper:[25,75], depth:[0,100]};
  if (key === 'order' && ['front','back'].includes(value)) return {...state,order:value,feedback:'adjust'};
  if (!Object.hasOwn(ranges,key) || !Number.isFinite(value) || value<ranges[key][0] || value>ranges[key][1]) return state;
  return {...state,[key]:value,feedback:'adjust'};
}
export function submit(state) {
  if(state.level>=3) return state;
  const t=tasks[state.level], p=project(state);
  const feedback = Math.abs(p.x-t.x)>3 ? 'position' : Math.abs(state.depth-t.depth)>8 ? 'size' : state.order!==t.order ? 'order' : 'ok';
  if(feedback!=='ok') return {...state,misses:state.misses+1,feedback};
  const shot={lamp:state.lamp,paper:state.paper,depth:state.depth,order:state.order,x:p.x,scale:p.scale};
  return {...state,level:state.level+1,lamp:30,paper:35,depth:0,order:'front',shots:[...state.shots,shot],feedback:'ok'};
}
export function result(state) {
  if(state.level!==3 || state.shots.length!==3) return null;
  const replay=state.shots.map((s,i)=>({
    duration:2400,
    caption:w(`第 ${i+1} 幕：燈位 ${s.lamp.toFixed(0)}、距離 ${s.depth.toFixed(0)}`,`Scene ${i+1}: lamp ${s.lamp.toFixed(0)}, depth ${s.depth.toFixed(0)}`,`第${i+1}幕：照明 ${s.lamp.toFixed(0)}、距離 ${s.depth.toFixed(0)}`),
    sprites:[
      {key:'prop2',x:42,y:18,width:52,height:57,z:1},
      {key:tasks[i].shadow,x:s.x-10*s.scale,y:32,width:20*s.scale,height:28*s.scale,z:s.order==='front'?4:2},
      ...(i>0?[{key:tasks[i-1].shadow,x:tasks[i].x-9,y:39,width:22,height:25,opacity:.65,z:3}]:[]),
      {key:'prop1',x:s.lamp-7.5,y:68,width:15,height:20,z:5},
      {key:tasks[i].key,x:s.paper-8,y:67,width:16,height:22,z:6},
    ].map(centered),
  }));
  return {score:Math.max(50,100-state.misses*4),summary:w('三個紙影完成。重播會保留你的燈位與紙藝距離。','Three shadows staged. Replay keeps your lamp and paper positions.','三つの影が完成。照明と紙の位置を再生します。'),artifact:{shots:state.shots,misses:state.misses},replay};
}
export function mount(ctx) {
  const sprite=(key,props)=>ctx.sprite(key,centered(props));
  let state=createState(), finished=false;
  const title=ctx.ui.text('lan-task',w('燈影借位','Borrowed shadows','影の舞台'));
  const details=ctx.ui.text('lan-detail',w('移動燈與紙藝，讓黑影的位置、大小和前後順序符合淡色參考。','Move the lamp and paper. Match the shadow position, size and layer order to the pale reference.','照明と紙を動かし、薄い見本の位置・大きさ・重なり順に影を合わせます。'));
  const readout=ctx.ui.text('lan-readout',w('','',''));
  const lamp=ctx.ui.slider({id:'lan-lamp',label:w('燈的位置','Lamp position','照明の位置'),min:10,max:40,step:1,value:state.lamp,onInput:v=>adjust('lamp',v)});
  const paper=ctx.ui.slider({id:'lan-paper',label:w('紙藝的位置','Paper position','紙の位置'),min:25,max:75,step:.1,value:state.paper,onInput:v=>adjust('paper',v)});
  const depth=ctx.ui.slider({id:'lan-depth',label:w('紙藝離屏幕的距離','Paper distance from screen','紙とスクリーンの距離'),min:0,max:100,step:1,value:state.depth,onInput:v=>adjust('depth',v)});
  const order=ctx.ui.choice({id:'lan-order',label:w('影子的重疊順序','Shadow layer order','影の重なり順'),options:[{value:'front',label:w('放在前方','In front','手前')},{value:'back',label:w('放在後方','Behind','奥')}],value:'front',onChange:v=>adjust('order',v)});
  ctx.ui.button({id:'lan-check',label:w('亮燈試演','Test the scene','照明テスト'),onClick:()=>{
    if(finished)return;
    const next=submit(state), accepted=next.level>state.level;
    state=next; ctx.sound(accepted?'success':'error');
    if(state.level===3){finished=true;ctx.setProgress(3,3);ctx.complete(result(state));return;}
    if(accepted){lamp.setValue(state.lamp);paper.setValue(state.paper);depth.setValue(state.depth);order.setValue(state.order);}
    render();
  }});
  ctx.ui.button({id:'lan-reset',label:w('這幕重排','Reset this scene','この幕をやり直す'),onClick:()=>{
    if(finished)return;
    state={...state,lamp:30,paper:35,depth:0,order:'front',feedback:'intro'};
    lamp.setValue(30);paper.setValue(35);depth.setValue(0);order.setValue('front');render();
  }});
  const screen=sprite('prop2',{id:'lan-screen',x:42,y:18,width:52,height:57,z:1});
  const light=sprite('prop1',{id:'lan-light',x:22.5,y:68,width:15,height:20,z:5});
  let objects=[];
  function adjust(key,v){if(finished)return;state=change(state,key,v);render();}
  function render(){
    objects.forEach(s=>s.remove());objects=[];
    const t=tasks[state.level],p=project(state);
    ctx.ui.setText(title,w(`第 ${state.level+1} 幕：${t.name.zh}`,`Scene ${state.level+1}: ${t.name.en}`,`第${state.level+1}幕：${t.name.ja}`));
    ctx.ui.setText(readout,w(`影子橫位 ${p.x.toFixed(1)}／目標 ${t.x}；距離 ${state.depth}／目標 ${t.depth}；目標順序：${t.order==='front'?'前':'後'}`,`Shadow X ${p.x.toFixed(1)} / target ${t.x}; depth ${state.depth} / target ${t.depth}; layer: ${t.order}`,`影の横位置 ${p.x.toFixed(1)}／目標 ${t.x}、距離 ${state.depth}／目標 ${t.depth}、順番：${t.order==='front'?'手前':'奥'}`));
    const refScale=1+t.depth/100;
    objects.push(sprite(t.shadow,{id:'lan-reference',x:t.x-10*refScale,y:32,width:20*refScale,height:28*refScale,opacity:.3,z:2}));
    objects.push(sprite(t.shadow,{id:'lan-shadow',x:p.x-10*p.scale,y:32,width:20*p.scale,height:28*p.scale,opacity:.85,z:state.order==='front'?4:2}));
    // Previous paper shadows provide a real overlap reference for the next layer task.
    if(state.level>0) objects.push(sprite(tasks[state.level-1].shadow,{id:'lan-previous',x:t.x-9,y:39,width:22,height:25,opacity:.65,z:3}));
    objects.push(sprite(t.key,{id:'lan-paper-object',x:state.paper-8,y:67,width:16,height:22,z:6}));
    light.update({x:state.lamp});
    ctx.setProgress(state.level,3);
    const messages={intro:w('先調距離決定影子大小，再移動燈和紙藝對齊位置。','Set depth for size, then move the lamp and paper to align the shadow.','まず距離で大きさを決め、照明と紙を動かして位置を合わせます。'),adjust:w('黑影會跟著調整；完成後按「亮燈試演」。','The shadow follows your controls. Test the scene when ready.','影は操作に合わせて動きます。準備できたら照明テスト。'),position:w('影子還沒對齊。燈往左移，影子會往右走。','Position does not match yet. Moving the lamp left shifts the shadow right.','位置がまだ合いません。照明を左へ動かすと影は右へ。'),size:w('位置接近了，再調整距離，讓大小符合參考。','Position is close. Adjust the depth to match its size.','位置は近いです。距離を調整して大きさを合わせましょう。'),order:w('位置與大小都對了，試著交換影子的前後順序。','Position and size match. Swap the shadow layer order.','位置と大きさは合っています。重なり順を変えましょう。'),ok:w('上一幕完成，下一幕換一種紙藝與重疊方式。','Scene complete. Try the next paper shape and overlap.','前の幕が完成。次は別の紙と重なり方です。')};
    ctx.hint(messages[state.feedback]);
  }
  render();
  return {destroy(){finished=true;objects.forEach(s=>s.remove());screen.remove();light.remove();}};
}
