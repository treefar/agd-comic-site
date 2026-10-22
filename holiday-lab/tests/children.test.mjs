import test from 'node:test';
import assert from 'node:assert/strict';
import {mount,newSession, evaluateTake, acceptTake, makeResult} from '../games/children.mjs';
test('材質與時間必須都吻合，不能憑空完成',()=>{
 const s=newSession(); assert.equal(s.takes.length,0); assert.throws(()=>makeResult(s));
 assert.equal(evaluateTake(0,{material:'metal',cue:700}).ok,false);
 assert.equal(evaluateTake(0,{material:'wood',cue:100}).ok,false);
 assert.equal(evaluateTake(0,{material:'wood',cue:700}).ok,true);
 assert.equal(acceptTake(s,{material:'wood',cue:NaN}).accepted,false);
});
test('三段收音，重播保留實際時間且拒絕超範圍',()=>{
 let a=newSession(), b=newSession();
 for(const [material,cue] of [['wood',700],['metal',1200],['paper',1700]]) a=acceptTake(a,{material,cue}).state;
 for(const [material,cue] of [['wood',740],['metal',1240],['paper',1740]]) b=acceptTake(b,{material,cue}).state;
 assert.equal(a.takes.length,3); assert.equal(makeResult(a).replay.length,3);
 assert.notDeepEqual(makeResult(a).artifact,makeResult(b).artifact);
 assert.equal(acceptTake(newSession(),{material:'wood',cue:9999}).accepted,false);
 assert.equal(newSession().takes.length,0);
});

function harness(lang){
 const controls=new Map(),frames=new Set(),keys=new Set(),sprites=[],sounds=[];let result;
 const node=()=>({append(){}});const ctx={lang,reducedMotion:false,stage:node(),controls:node(),words:w=>{assert.equal(typeof w[lang],'string');return w[lang];},ui:{text:(id,w)=>{ctx.words(w);const n=node();controls.set(id,n);return n;},setText:(el,w)=>{ctx.words(w);},group:()=>node(),button:o=>{ctx.words(o.label);const n={...node(),click:o.onClick};controls.set(o.id,n);return n;},slider:o=>{ctx.words(o.label);const n={element:node(),setValue:v=>{n.value=v;},getValue:()=>n.value,input:{},value:o.value,change:v=>{n.value=v;o.onInput(v);}};controls.set(o.id,n);return n;},choice:o=>{ctx.words(o.label);o.options.forEach(v=>ctx.words(v.label));const n={element:node(),value:o.value,setValue:v=>{n.value=v;},getValue:()=>n.value,change:v=>{n.value=v;o.onChange(v);}};controls.set(o.id,n);return n;}},sprite:(key,p)=>{const n={key,props:{...p},element:node(),update(p){Object.assign(n.props,p);},remove(){}};sprites.push(n);return n;},onFrame:fn=>{frames.add(fn);return()=>frames.delete(fn);},onKey:fn=>{keys.add(fn);return()=>keys.delete(fn);},hint:w=>ctx.words(w),setProgress(){},sound:k=>sounds.push(k),complete:r=>{assert.equal(result,undefined,'completion must fire once');result=r;}};
 return {ctx,controls,frames,keys,sprites,sounds,get result(){return result;},tick:dt=>[...frames].forEach(fn=>fn({dt,elapsed:dt}))};
}

for(const lang of ['zh','en','ja'])test('三語UI連接、錯誤不完成與預覽清理：'+lang,()=>{
 const h=harness(lang),life=mount(h.ctx);assert.equal(h.result,undefined);
 h.controls.get('children-save').click();assert.equal(h.result,undefined);
 for(const [material,cue]of [['wood',700],['metal',1200],['paper',1700]]){
 h.controls.get('children-material').change(material);h.controls.get('children-cue').change(cue);
 h.controls.get('children-preview').click();h.tick(1.8);h.controls.get('children-save').click();}
 assert.equal(h.result.artifact.takes.length,3);assert.ok(h.sounds.includes('wood'));assert.equal(h.result.replay.length,3);
 life.destroy();assert.equal(h.frames.size,0);
});