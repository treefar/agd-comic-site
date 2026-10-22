import test from 'node:test';import assert from 'node:assert/strict';
import {mount,newShow,updateWork,evaluateShow,makeResult} from '../games/exhibition.mjs';
test('展位需有動線間距、入口視線、資訊',()=>{
 const s=newShow();assert.equal(evaluateShow(s).ok,false);assert.throws(()=>makeResult(s));
 assert.throws(()=>updateWork(s,9,{x:20}));assert.throws(()=>updateWork(s,0,{x:Infinity}));
});
test('策展位置資訊與順序可變，成品必須跟著改變',()=>{
 const solve=(delta=0)=>{let s=newShow();for(let i=0;i<3;i++)s=updateWork(s,i,{x:[20,50,80][i]+delta,y:30,info:true});return s;};
 const a=solve(),b=solve(2);assert.equal(evaluateShow(a).ok,true);assert.equal(makeResult(a).replay.length,3);
 assert.notDeepEqual(makeResult(a).artifact,makeResult(b).artifact);
 assert.equal(evaluateShow(updateWork(a,1,{x:25})).ok,false);
 assert.equal(evaluateShow(updateWork(a,1,{y:78})).ok,false);
 assert.equal(evaluateShow(updateWork(a,1,{info:false})).ok,false);
 assert.equal(newShow().works[0].info,false);
});

function harness(lang){
 const controls=new Map(),frames=new Set(),keys=new Set(),sprites=[],sounds=[];let result;
 const node=()=>({append(){}});const ctx={lang,reducedMotion:false,stage:node(),controls:node(),words:w=>{assert.equal(typeof w[lang],'string');return w[lang];},ui:{text:(id,w)=>{ctx.words(w);const n=node();controls.set(id,n);return n;},setText:(el,w)=>{ctx.words(w);},group:()=>node(),button:o=>{ctx.words(o.label);const n={...node(),click:o.onClick};controls.set(o.id,n);return n;},slider:o=>{ctx.words(o.label);const n={element:node(),setValue:v=>{n.value=v;},getValue:()=>n.value,input:{},value:o.value,change:v=>{n.value=v;o.onInput(v);}};controls.set(o.id,n);return n;},choice:o=>{ctx.words(o.label);o.options.forEach(v=>ctx.words(v.label));const n={element:node(),value:o.value,setValue:v=>{n.value=v;},getValue:()=>n.value,change:v=>{n.value=v;o.onChange(v);}};controls.set(o.id,n);return n;}},sprite:(key,p)=>{const n={key,props:{...p},element:node(),update(p){Object.assign(n.props,p);},remove(){}};sprites.push(n);return n;},onFrame:fn=>{frames.add(fn);return()=>frames.delete(fn);},onKey:fn=>{keys.add(fn);return()=>keys.delete(fn);},hint:w=>ctx.words(w),setProgress(){},sound:k=>sounds.push(k),complete:r=>{assert.equal(result,undefined,'completion must fire once');result=r;}};
 return {ctx,controls,frames,keys,sprites,sounds,get result(){return result;},tick:dt=>[...frames].forEach(fn=>fn({dt,elapsed:dt}))};
}

for(const lang of ['zh','en','ja'])test('三語策展操作、阻擋、巡覽與清理：'+lang,()=>{
 const h=harness(lang),life=mount(h.ctx);h.controls.get('exhibition-save').click();assert.equal(h.result,undefined);
 for(let i=0;i<3;i++){h.controls.get('exhibition-select').change(String(i));h.controls.get('exhibition-x').change([20,50,80][i]);h.controls.get('exhibition-y').change(30);h.controls.get('exhibition-info').change('yes');}
 h.controls.get('exhibition-preview').click();h.tick(1.5);assert.equal(h.sprites.find(s=>s.key==='prop2').props.x,50);
 h.controls.get('exhibition-save').click();assert.deepEqual(h.result.artifact.visitorOrder,[0,1,2]);
 life.destroy();assert.equal(h.frames.size,0);assert.equal(h.keys.size,0);
});