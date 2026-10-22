// Sound editing: material identity and a movable cue on a three-shot timeline.
export const id='children';
const W=(zh,en,ja)=>({zh,en,ja});
const materials={wood:W('木頭','Wood','木'),metal:W('金屬','Metal','金属'),paper:W('紙張','Paper','紙')};
export const shots=[{material:'wood',cue:700},{material:'metal',cue:1200},{material:'paper',cue:1700}];
export function newSession(){return {takes:[],attempts:0};}
export function evaluateTake(index,take){
 const target=shots[index];if(!target||!take||!Number.isFinite(take.cue)||take.cue<0||take.cue>2400)return {ok:false,reason:'range'};
 if(take.material!==target.material)return {ok:false,reason:'material'};
 const error=Math.abs(take.cue-target.cue);return {ok:error<=100,reason:error<=100?'ok':'sync',error};
}
export function acceptTake(state,take){const verdict=evaluateTake(state.takes.length,take);const next={takes:state.takes.map(t=>({...t})),attempts:state.attempts+1};if(verdict.ok)next.takes.push({...take,error:verdict.error});return {state:next,accepted:verdict.ok,...verdict};}
export function makeResult(state){
 if(state.takes.length!==3||!state.takes.every((t,i)=>evaluateTake(i,t).ok))throw Error('Three valid takes required');
 return {score:Math.round(100-state.takes.reduce((n,t)=>n+t.error,0)/6),summary:W('三段玩具動畫已完成配音。重播保留你的聲音落點。','Three toy clips are dubbed. Replay keeps your cue times.','おもちゃの3カットに音が付きました。再生には設定したタイミングが反映されます。'),artifact:{takes:state.takes.map(t=>({...t})),attempts:state.attempts},replay:state.takes.map((t,i)=>({duration:2600,audio:[{kind:t.material,at:t.cue}],caption:W(`${materials[t.material].zh}聲，${t.cue} 毫秒`,`${materials[t.material].en} cue at ${t.cue} ms`,`${materials[t.material].ja}の音：${t.cue}ミリ秒`),sprites:[{key:`actor${i+1}`,x:40,y:44,width:32,height:48},{key:`token${i+1}`,x:8+t.cue/2400*76,y:80,width:12,height:13},{key:'target',x:8+shots[i].cue/2400*76,y:67,width:12,height:12}]}))};
}
export function mount(ctx){
 let state=newSession(),draft={material:'paper',cue:300},running=false,clock=0,fired=false,dead=false;
 const actors=shots.map((s,i)=>ctx.sprite(`actor${i+1}`,{id:`children-actor-${i}`,x:40,y:44,width:32,height:48,opacity:i===0?1:0}));
 const mark=ctx.sprite('target',{id:'children-impact',x:8+700/2400*76,y:67,width:12,height:12});
 const cue=ctx.sprite('token1',{id:'children-cue-marker',x:8+300/2400*76,y:80,width:12,height:13});
 const heading=ctx.ui.text('children-shot',W('','',''));
 ctx.ui.text('children-help',W('先配材質，再把聲音移到碰撞瞬間。按「預覽」看動畫；靜音時依材質文字與碰撞標記也能完成。','Match the material, then move its sound to the impact. Preview the motion; labels and impact marks also work with sound off.','材質を選び、音の位置を衝突の瞬間に合わせます。「プレビュー」で確認。消音中も材質名と衝突マークで遊べます。'));
 const choice=ctx.ui.choice({id:'children-material',label:W('聲音材質','Sound material','音の材質'),options:Object.entries(materials).map(([value,label])=>({value,label})),value:draft.material,onChange:v=>{draft.material=v;}});
 const slider=ctx.ui.slider({id:'children-cue',label:W('聲音位置（毫秒）','Sound cue (ms)','音の位置（ミリ秒）'),min:0,max:2400,step:50,value:draft.cue,onInput:v=>{draft.cue=v;cue.update({x:8+v/2400*76});}});
 const status=ctx.ui.text('children-preview-status',W('按預覽觀察碰撞時點。','Preview to find the impact.','プレビューで衝突の瞬間を確認。'));
 ctx.ui.button({id:'children-preview',label:W('預覽這一段','Preview this clip','このカットをプレビュー'),onClick:()=>{running=true;clock=0;fired=false;}});
 const render=()=>{const n=state.takes.length;if(n>=3)return;ctx.setProgress(n,3);ctx.ui.setText(heading,W(`第 ${n+1} 段：${materials[shots[n].material].zh}玩具`, `Clip ${n+1}: ${materials[shots[n].material].en} toy`,`${n+1}カット目：${materials[shots[n].material].ja}のおもちゃ`));actors.forEach((a,i)=>a.update({opacity:i===n?1:0,x:40,y:44}));mark.update({x:8+shots[n].cue/2400*76});cue.update({x:8+draft.cue/2400*76});};
 ctx.ui.button({id:'children-save',label:W('放入配音作品','Keep this take','このテイクを保存'),onClick:()=>{if(dead||state.takes.length>=3)return;const r=acceptTake(state,draft);state=r.state;if(!r.accepted){ctx.sound('error');ctx.hint(r.reason==='material'?W('材質不對。觀察玩具是木、金屬還是紙。','Wrong material. Look at what the toy is made of.','材質が違います。木・金属・紙のどれかを確認。'):W('聲音還沒對上。把聲音標記移近碰撞標記，再預覽。','The cue is out of sync. Move it closer to the impact mark and preview.','音がずれています。衝突マークに近づけて再確認。'));return;}ctx.sound('success');running=false;if(state.takes.length===3){ctx.setProgress(3,3);ctx.complete(makeResult(state));return;}draft={material:'paper',cue:300};choice.setValue(draft.material);slider.setValue(draft.cue);render();ctx.hint(W('收進作品了，換下一種材質。','Take saved. Try the next material.','保存しました。次の材質へ。'));}});
 const unsub=ctx.onFrame(({dt})=>{if(!running||dead)return;clock+=dt*1000;const i=state.takes.length;if(i>=3)return;const t=clock%2600;const impact=shots[i].cue;const distance=Math.abs(t-impact);actors[i].update({x:35+Math.min(t/impact,1)*15,y:44-(distance<160&&!ctx.reducedMotion?Math.sin(distance/160*Math.PI)*8:0)});if(!fired&&t>=draft.cue){fired=true;ctx.sound(draft.material);ctx.ui.setText(status,W(`${materials[draft.material].zh}聲響起：${draft.cue} 毫秒`,`${materials[draft.material].en} sound: ${draft.cue} ms`,`${materials[draft.material].ja}の音：${draft.cue}ミリ秒`));}if(clock>=2600){running=false;ctx.ui.setText(status,W('預覽結束。可調整材質或聲音位置。','Preview finished. Adjust material or cue position.','プレビュー終了。材質や音の位置を調整できます。'));}});
 render();return {destroy(){dead=true;unsub();}};
}
