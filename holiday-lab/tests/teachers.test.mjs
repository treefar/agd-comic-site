import test from 'node:test';import assert from 'node:assert/strict';
import {mount,newStory,evaluatePanel,savePanel,makeResult} from '../games/teachers.mjs';
test('漫畫不能空白完成，動作台詞和節奏都要配合',()=>{
 assert.throws(()=>makeResult(newStory()));
 assert.equal(evaluatePanel(0,{action:'listen',line:'ask',pause:900}).ok,true);
 assert.equal(evaluatePanel(0,{action:'reply',line:'ask',pause:900}).ok,false);
 assert.equal(evaluatePanel(1,{action:'thanks',line:'thank',pause:200}).ok,false);
 assert.equal(evaluatePanel(2,{action:'reply',line:'reply',pause:NaN}).ok,false);
});
test('三格台詞作品保留實際停頓，重新開始不殘留',()=>{
 let a=newStory(),b=newStory();
 for(const [action,line,pause] of [['listen','ask',900],['thanks','thank',1300],['reply','reply',1100]])a=savePanel(a,{action,line,pause}).state;
 for(const [action,line,pause] of [['listen','ask',1000],['thanks','thank',1400],['reply','reply',1200]])b=savePanel(b,{action,line,pause}).state;
 assert.equal(makeResult(a).replay.length,3);assert.notDeepEqual(makeResult(a).artifact,makeResult(b).artifact);
 assert.equal(newStory().panels.length,0);assert.equal(savePanel(a,{action:'reply',line:'reply',pause:1100}).accepted,false);
});

function harness(lang){
 const controls=new Map(),frames=new Set(),keys=new Set(),sprites=[],sounds=[];let result;
 const node=()=>({append(){}});const ctx={lang,reducedMotion:false,stage:node(),controls:node(),words:w=>{assert.equal(typeof w[lang],'string');return w[lang];},ui:{text:(id,w)=>{ctx.words(w);const n=node();controls.set(id,n);return n;},setText:(el,w)=>{ctx.words(w);},group:()=>node(),button:o=>{ctx.words(o.label);const n={...node(),click:o.onClick};controls.set(o.id,n);return n;},slider:o=>{ctx.words(o.label);const n={element:node(),setValue:v=>{n.value=v;},getValue:()=>n.value,input:{},value:o.value,change:v=>{n.value=v;o.onInput(v);}};controls.set(o.id,n);return n;},choice:o=>{ctx.words(o.label);o.options.forEach(v=>ctx.words(v.label));const n={element:node(),value:o.value,setValue:v=>{n.value=v;},getValue:()=>n.value,change:v=>{n.value=v;o.onChange(v);}};controls.set(o.id,n);return n;}},sprite:(key,p)=>{const n={key,props:{...p},element:node(),update(p){Object.assign(n.props,p);},remove(){}};sprites.push(n);return n;},onFrame:fn=>{frames.add(fn);return()=>frames.delete(fn);},onKey:fn=>{keys.add(fn);return()=>keys.delete(fn);},hint:w=>ctx.words(w),setProgress(){},sound:k=>sounds.push(k),complete:r=>{assert.equal(result,undefined,'completion must fire once');result=r;}};
 return {ctx,controls,frames,keys,sprites,sounds,get result(){return result;},tick:dt=>[...frames].forEach(fn=>fn({dt,elapsed:dt}))};
}

for(const lang of ['zh','en','ja'])test('三語漫畫操作、錯誤阻擋與預覽清理：'+lang,()=>{
 const h=harness(lang),life=mount(h.ctx);h.controls.get('teachers-save').click();assert.equal(h.result,undefined);
 for(const[action,line,pause]of [['listen','ask',900],['thanks','thank-patient',1400],['reply','reply',1100]]){
 h.controls.get('teachers-action').change(action);h.controls.get('teachers-line').change(line);h.controls.get('teachers-pause').change(pause);
 h.controls.get('teachers-preview').click();h.tick(0.3);h.tick(2);h.controls.get('teachers-save').click();}
 assert.equal(h.result.artifact.panels[1].line,'thank-patient');assert.equal(h.result.replay[1].duration,2800);
 life.destroy();assert.equal(h.frames.size,0);
});