import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,submit,expressionProps,mount} from '../games/lunar-new-year.mjs';
const SAMPLES=[{brow:-20,eyes:1.4,mouth:.7,pose:0},{brow:10,eyes:.8,mouth:1,pose:0},{brow:0,eyes:.7,mouth:.5,pose:24}];
test('neutral expression never wins; rejects missing or nonfinite controls',()=>{const s=createState();assert.equal(s.done,false);assert.equal(submit(s,{brow:0,eyes:1,mouth:0,pose:0}).ok,false);assert.equal(submit(s,{...SAMPLES[0],eyes:NaN}).ok,false);assert.equal(submit(s,{}).ok,false);assert.equal(s.round,0);});
test('surprise then smile then bow are separate tasks',()=>{let s=createState();assert.equal(submit(s,SAMPLES[2]).ok,false);for(const v of SAMPLES){const r=submit(s,v);assert.equal(r.ok,true);s=r.state;}assert.equal(s.done,true);assert.equal(s.poses.length,3);assert.equal(submit(s,SAMPLES[2]).ok,false);assert.equal(createState().poses.length,0);});
test('different accepted expressions change saved creation and transforms',()=>{const a=submit(createState(),SAMPLES[0]).state.poses[0];const b=submit(createState(),{...SAMPLES[0],brow:-16,mouth:0.8}).state.poses[0];assert.notDeepEqual(a,b);assert.notDeepEqual(expressionProps(a.values),expressionProps(b.values));});
test('mounted sliders capture three actual poses and clean up frame subscription',()=>{const buttons={},sliders={},results=[];let stopped=false;const node=()=>({append(){}});const ctx={controls:node(),reducedMotion:true,ui:{choice:()=>({element:node()}),text:node,setText(){},button(o){buttons[o.id]=o.onClick;return node();},slider(o){sliders[o.id]=o;return {element:node(),setValue(v){o.value=v;}};}},sprite(){return {update(){},remove(){}};},hint(){},sound(){},setProgress(){},complete:r=>results.push(r),onFrame(){return ()=>{stopped=true;};}};const game=mount(ctx);buttons['lny-submit']();assert.equal(results.length,0);for(const t of SAMPLES){for(const [k,v] of Object.entries(t))sliders[`lny-${k}`].onInput(v);buttons['lny-submit']();}assert.equal(results.length,1);assert.equal(results[0].replay.length,3);assert.deepEqual(results[0].artifact.poses.map(v=>v.values),SAMPLES);game.destroy();assert.equal(stopped,true);});
test('sprite and control DOM ids are unique while stable slider ids remain unchanged',()=>{
 const ids=[],sliderIds=[];const node=()=>({append(){}});const record=id=>{if(id)ids.push(id);return node();};
 const ctx={controls:node(),reducedMotion:true,ui:{choice:o=>({element:record(o.id)}),text:(id)=>record(id),setText(){},button:o=>record(o.id),slider:o=>{sliderIds.push(o.id);return {element:record(o.id),setValue(){}};}},sprite:(key,props)=>{record(props.id);return {update(){},remove(){}};},hint(){},sound(){},setProgress(){},complete(){},onFrame:()=>()=>{}};
 const game=mount(ctx);game.destroy();
 const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
 assert.deepEqual(duplicates,[],'DOM ids shared by sprites and input controls must never collide');
 assert.deepEqual(sliderIds,['lny-brow','lny-eyes','lny-mouth','lny-pose']);
 assert.ok(ids.includes('lny-brow-sprite'));assert.ok(ids.includes('lny-eyes-sprite'));assert.ok(ids.includes('lny-mouth-sprite'));
});
test('bow rotates feature anchors rigidly around the fixed body centre in a 16:10 stage',()=>{
 const neutral=expressionProps({brow:0,eyes:1,mouth:0.5,pose:0});
 const aspect=16/10,epsilon=1e-10;
 for(const pose of [7,19,30,40]){
  const p=expressionProps({brow:0,eyes:1,mouth:0.5,pose});
  assert.deepEqual([p.body.x,p.body.y],[neutral.body.x,neutral.body.y],'bow must not translate the body pivot');
  for(const feature of ['brow','eyes','mouth']){
   const a={x:(neutral[feature].x-neutral.body.x)*aspect,y:neutral[feature].y-neutral.body.y};
   const b={x:(p[feature].x-p.body.x)*aspect,y:p[feature].y-p.body.y};
   const radius=Math.hypot(a.x,a.y);assert.ok(Math.abs(Math.hypot(b.x,b.y)-radius)<epsilon,'rigid rotation preserves anchor distance');
   const dot=(a.x*b.x+a.y*b.y)/(radius*radius),cross=(a.x*b.y-a.y*b.x)/(radius*radius);
   assert.ok(Math.abs(dot-Math.cos(pose*Math.PI/180))<epsilon,'feature follows body rotation angle');
   assert.ok(Math.abs(cross-Math.sin(pose*Math.PI/180))<epsilon,'feature rotates clockwise with the sprite');
  }
 }
});
test('blank-face feature proportions fit the face, and mount and replay share the same geometry',()=>{
 const buttons={},sliders={},sprites=new Map(),captures=[],results=[];const node=()=>({append(){}});
 const ctx={controls:node(),reducedMotion:true,ui:{choice:()=>({element:node()}),text:node,setText(){},button:o=>{buttons[o.id]=o.onClick;return node();},slider:o=>{sliders[o.id]=o;return {element:node(),setValue(){}};}},sprite:(key,props)=>{const data={...props};sprites.set(key,data);return {update:p=>Object.assign(data,p),remove(){}};},hint(){},sound(){},setProgress(){},complete:r=>results.push(r),onFrame:()=>()=>{}};
 const game=mount(ctx),body=sprites.get('actor1');
 for(const key of ['prop1','prop2','prop3']){
  const p=sprites.get(key);assert.ok(p.width<=body.width*0.4,'features fit inside the blank face width');
  assert.ok(p.height<=body.height*0.15,'features fit inside the blank face height');
  assert.ok(p.y>body.y-body.height*0.4&&p.y<body.y,'features stay within the upper face, away from the horns');
 }
 for(const [i,t]of SAMPLES.entries()){
  for(const [key,value]of Object.entries(t))sliders[`lny-${key}`].onInput(value);
  captures.push([`actor${i+1}`,'prop1','prop2','prop3'].map(key=>({key,...sprites.get(key)})));
  buttons['lny-submit']();
 }
 const geometry=['x','y','width','height','rotation','scaleY'];
 for(const[i,shot]of results[0].replay.entries())for(const shown of captures[i]){
  const saved=shot.sprites.find(s=>s.key===shown.key);
  for(const field of geometry)assert.equal(saved[field],shown[field],`${shown.key} ${field} differs between stage and replay`);
 }
 game.destroy();
});
