import test from 'node:test';import assert from 'node:assert/strict';
import {mount,newTrip,move,interact,makeResult} from '../games/semester.mjs';
test('校園走訪要到達窗口且依序辦事',()=>{
 const s=newTrip();assert.throws(()=>makeResult(s));assert.equal(interact(s).accepted,false);
 assert.deepEqual(move(s,'left').state.position,{x:0,y:2});
 assert.equal(move(s,'teleport').accepted,false);
 let a=move(move(s,'up').state,'up').state;
 assert.equal(interact(a).accepted,true);
 assert.equal(interact(interact(a).state).accepted,false);
});
test('三站辦事完整旅程，路線不同則成品不同',()=>{
 const solve=extra=>{let s=newTrip();for(const d of extra)s=move(s,d).state;
 for(const ds of [['up','up'],['right','right','right','right'],['down','down','left','left']]){for(const d of ds)s=move(s,d).state;s=interact(s).state;}return s;};
 const a=solve([]),b=solve(['right','left']);assert.equal(a.visits.length,3);
 assert.equal(makeResult(a).replay.length,3);assert.notDeepEqual(makeResult(a).artifact,makeResult(b).artifact);
 assert.equal(newTrip().visits.length,0);
});

function harness(lang){
 const controls=new Map(),frames=new Set(),keys=new Set(),sprites=[],sounds=[];let result;
 const node=()=>({append(){}});const ctx={lang,reducedMotion:false,stage:node(),controls:node(),words:w=>{assert.equal(typeof w[lang],'string');return w[lang];},ui:{text:(id,w)=>{ctx.words(w);const n=node();controls.set(id,n);return n;},setText:(el,w)=>{ctx.words(w);},group:()=>node(),button:o=>{ctx.words(o.label);const n={...node(),click:o.onClick};controls.set(o.id,n);return n;},slider:o=>{ctx.words(o.label);const n={element:node(),setValue:v=>{n.value=v;},getValue:()=>n.value,input:{},value:o.value,change:v=>{n.value=v;o.onInput(v);}};controls.set(o.id,n);return n;},choice:o=>{ctx.words(o.label);o.options.forEach(v=>ctx.words(v.label));const n={element:node(),value:o.value,setValue:v=>{n.value=v;},getValue:()=>n.value,change:v=>{n.value=v;o.onChange(v);}};controls.set(o.id,n);return n;}},sprite:(key,p)=>{const n={key,props:{...p},element:node(),update(p){Object.assign(n.props,p);},remove(){}};sprites.push(n);return n;},onFrame:fn=>{frames.add(fn);return()=>frames.delete(fn);},onKey:fn=>{keys.add(fn);return()=>keys.delete(fn);},hint:w=>ctx.words(w),setProgress(){},sound:k=>sounds.push(k),complete:r=>{assert.equal(result,undefined,'completion must fire once');result=r;}};
 return {ctx,controls,frames,keys,sprites,sounds,get result(){return result;},tick:dt=>[...frames].forEach(fn=>fn({dt,elapsed:dt}))};
}

for(const lang of ['zh','en','ja'])test('三語走訪、錯站阻擋、鍵盤替代與清理：'+lang,()=>{
 const h=harness(lang),life=mount(h.ctx);h.controls.get('semester-visit').click();assert.equal(h.result,undefined);
 for(const ds of [['up','up'],['right','right','right','right'],['down','down','left','left']]){
 for(const d of ds)h.controls.get('semester-'+d).click();h.controls.get('semester-visit').click();}
 assert.equal(h.result.artifact.visits.length,3);assert.deepEqual(h.result.artifact.route.at(-1),{x:2,y:2});
 life.destroy();assert.equal(h.keys.size,0);
});