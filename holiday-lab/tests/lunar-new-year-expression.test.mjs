import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,submit,expressionProps,evaluateExpression,buildResult,mount} from '../games/lunar-new-year.mjs';
const A=[{brow:-30,eyes:1.5,mouth:1,pose:0},{brow:22,eyes:.6,mouth:1,pose:4},{brow:18,eyes:1.4,mouth:.9,pose:38}];
const B=[{brow:-10,eyes:1.2,mouth:.5,pose:10},{brow:0,eyes:1,mouth:.7,pose:12},{brow:-10,eyes:.6,mouth:.3,pose:12}];
test('the exact exaggerated surprise rejected in player-review now reads as surprise',()=>{const r=submit(createState(),A[0]);assert.equal(r.ok,true);assert.deepEqual(r.state.poses[0].values,A[0]);});
test('two visibly distinct complete performances and ending intentions work',()=>{const results=[];for(const [poses,intent]of [[A,'comic'],[B,'reserved']]){let state=createState();for(const values of poses){const r=submit(state,values,intent);assert.equal(r.ok,true,JSON.stringify({values,intent,reason:r.reason}));state=r.state;}assert.equal(state.done,true);assert.equal(state.poses[2].intent,intent);results.push(state.poses);}assert.notDeepEqual(results[0],results[1]);assert.notDeepEqual(expressionProps(A[2]),expressionProps(B[2]));});
test('same visible greeting receives different feedback for the two chosen intentions',()=>{assert.equal(evaluateExpression(2,A[2],'comic').ok,true);assert.equal(evaluateExpression(2,A[2],'reserved').reason,'reserved-bow-high');assert.equal(evaluateExpression(2,B[2],'reserved').ok,true);assert.equal(evaluateExpression(2,B[2],'comic').reason,'comic-bow');});
test('all feedback names a specific visible expression or posture rather than target distance',()=>{const cases=[
 [0,{...A[0],eyes:1},'surprise-eyes'],[0,{...A[0],brow:0},'surprise-brow'],[0,{...A[0],mouth:.3},'surprise-mouth'],[0,{...A[0],pose:17},'upright'],
 [1,{...A[1],eyes:1.2},'joy-eyes'],[1,{...A[1],mouth:.5},'joy-mouth'],[1,{...A[1],brow:-6},'joy-brow'],[1,{...A[1],pose:19},'upright'],
 [2,{...A[2],pose:21},'comic-bow','comic'],[2,{...A[2],eyes:1},'comic-eyes','comic'],[2,{...A[2],mouth:.6},'comic-mouth','comic'],[2,{...A[2],brow:-6},'joy-brow','comic'],
 [2,{...B[2],pose:7},'reserved-bow-low'],[2,{...B[2],pose:27},'reserved-bow-high'],[2,{...B[2],eyes:1.2},'reserved-eyes'],[2,{...B[2],mouth:.1},'reserved-mouth-low'],[2,{...B[2],mouth:.7},'reserved-mouth-high'],[2,{...B[2],brow:19},'reserved-brow']
 ];for(const[round,v,reason,intent='reserved']of cases)assert.equal(evaluateExpression(round,v,intent).reason,reason);});
test('inclusive readable boundaries and all slider limits are defined',()=>{
 for(const [round,v,intent]of [[0,{brow:-8,eyes:1.2,mouth:.4,pose:16}],[1,{brow:-5,eyes:1.05,mouth:.6,pose:18}],[2,{brow:-5,eyes:1.1,mouth:.7,pose:22},'comic'],[2,{brow:-18,eyes:.5,mouth:.2,pose:8}],[2,{brow:18,eyes:1.05,mouth:.65,pose:26}]])assert.equal(evaluateExpression(round,v,intent).ok,true);
 for(const key of ['brow','eyes','mouth','pose'])for(const value of [NaN,Infinity,-Infinity])assert.equal(submit(createState(),{...A[0],[key]:value}).reason,'invalid');
 for(const v of [{...A[0],brow:-31},{...A[0],brow:31},{...A[0],eyes:.4},{...A[0],eyes:1.6},{...A[0],mouth:-.1},{...A[0],mouth:1.1},{...A[0],pose:-1},{...A[0],pose:41},{},null])assert.equal(evaluateExpression(0,v).reason,'invalid');
 for(const round of [-1,3,NaN,1.2])assert.equal(evaluateExpression(round,A[0]).reason,'invalid');assert.equal(evaluateExpression(2,B[2],'unknown').reason,'invalid');
});
test('exploration does not deduct points, invalid input does not fabricate attempts, result is copied',()=>{let s=createState();const invalid=submit(s,{});assert.equal(invalid.state,s);s=submit(s,{brow:0,eyes:1,mouth:0,pose:0}).state;for(const v of B)s=submit(s,v,'reserved').state;const r=buildResult(s);assert.equal(r.score,100);assert.equal(r.artifact.attempts,4);assert.deepEqual(r.artifact.poses.map(p=>p.values),B);assert.equal(r.artifact.poses[2].intent,'reserved');assert.equal(submit(s,B[2]).reason,'done');r.artifact.poses[0].values.brow=0;assert.equal(s.poses[0].values.brow,-10);assert.throws(()=>buildResult(createState()));});
for(const lang of ['zh','en','ja'])test(`live feedback, third-act intent, retained inputs and cleanup ${lang}`,()=>{
 const buttons={},sliders={},texts=new Map(),choices={},results=[],frames=new Set(),removed=[],automaticValues=[];let progress=0,hint;
 const node=()=>({append(){}});const ctx={lang,reducedMotion:true,controls:node(),ui:{text:(id,words)=>{const n=node();texts.set(id,words);n.id=id;return n;},setText:(n,w)=>{for(const l of ['zh','en','ja'])assert.equal(typeof w[l],'string');texts.set(n.id,w);},button:o=>{buttons[o.id]=o.onClick;return node();},slider:o=>{sliders[o.id]=o;return {element:node(),setValue:v=>{automaticValues.push([o.id,v]);o.value=v;}};},choice:o=>{choices[o.id]=o;const element=node();o.element=element;return {element};}},sprite:key=>({update(){},remove(){removed.push(key);}}),hint:w=>hint=w[lang],sound(){},setProgress:n=>progress=n,complete:r=>results.push(r),onFrame:fn=>{frames.add(fn);return ()=>frames.delete(fn);}};
 const game=mount(ctx);assert.equal(choices['lny-intent'].element.hidden,true);buttons['lny-submit']();assert.equal(progress,0);assert.ok(hint.length>5);
 for(const [i,v]of B.entries()){
  for(const[k,n]of Object.entries(v))sliders['lny-'+k].onInput(n);
  if(i===2){assert.equal(choices['lny-intent'].element.hidden,false);choices['lny-intent'].onChange('comic');buttons['lny-submit']();assert.equal(progress,2);choices['lny-intent'].onChange('reserved');}
  buttons['lny-submit']();assert.equal(progress,i+1);
  if(i<2)assert.deepEqual(automaticValues,[],'no automatic model answer/reset is applied');
 }
 assert.equal(results.length,1);assert.equal(results[0].score,100);assert.equal(results[0].artifact.attempts,5);assert.deepEqual(results[0].artifact.poses.map(p=>p.values),B);assert.equal(results[0].replay[2].caption[lang],({zh:'含蓄問候',en:'Quiet greeting',ja:'控えめなあいさつ'})[lang]);assert.equal(frames.size,1);game.destroy();assert.equal(frames.size,0);assert.equal(removed.length,9);
});
