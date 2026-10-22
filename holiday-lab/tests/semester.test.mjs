import test from 'node:test';import assert from 'node:assert/strict';
import {mount} from '../games/semester.mjs';
function harness(lang){
 const controls=new Map(),keys=new Set(),sprites=[],sounds=[];let result,progress=0,hint='';
 const node=()=>({dataset:{},append(){}});const root=node();root.ownerDocument={createElement:()=>node()};
 const ctx={lang,reducedMotion:false,controls:root,words:w=>{assert.equal(typeof w[lang],'string');return w[lang];},ui:{text:(id,w)=>{ctx.words(w);const n=node();n.id=id;controls.set(id,n);return n;},setText:(n,w)=>{n.text=ctx.words(w);},group:()=>node(),button:o=>{ctx.words(o.label);const n={...node(),click:o.onClick};controls.set(o.id,n);return n;},choice:o=>{ctx.words(o.label);o.options.forEach(v=>ctx.words(v.label));const n={element:node(),value:o.value,setValue:v=>{n.value=v;},change:v=>{n.value=v;o.onChange(v);}};controls.set(o.id,n);return n;}},sprite:(key,p)=>{const n={key,props:{...p},removed:false,update(p){Object.assign(n.props,p);},remove(){n.removed=true;}};sprites.push(n);return n;},onKey:fn=>{keys.add(fn);return()=>keys.delete(fn);},hint:w=>hint=ctx.words(w),setProgress:n=>progress=n,sound:k=>sounds.push(k),complete:r=>{assert.equal(result,undefined);result=r;}};
 return {ctx,controls,keys,sprites,get result(){return result;},get progress(){return progress;},get hint(){return hint;}};
}
for(const lang of ['zh','en','ja'])test('three-language task/contact choices, real guide link and cleanup '+lang,()=>{
 const h=harness(lang),life=mount(h.ctx);assert.equal(h.controls.get('semester-task-0').element.hidden,false);assert.equal(h.controls.get('semester-task-2').element.hidden,true);h.controls.get('semester-visit').click();assert.equal(h.result,undefined);assert.ok(h.hint.length>10);
 for(const [round,task,window,path]of [[0,'course-plan','department',['up','up']],[1,'course-record','academic',['right','right','right','right']],[2,'graduation','department',['left','left','left','left']],[2,'credit','academic',['right','right','right','right']]]){
  h.controls.get('semester-task-'+round).change(task);h.controls.get('semester-window').change(window);for(const d of path)h.controls.get('semester-'+d).click();h.controls.get('semester-visit').click();
 }
 assert.equal(h.result.score,100);assert.equal(h.result.artifact.visits.length,4);assert.deepEqual(h.result.artifact.thirdActOrder,['graduation','credit']);assert.equal(h.progress,3);assert.equal(h.result.artifact.fictionalMap,true);assert.equal(h.result.artifact.consultationOnly,true);h.controls.get('semester-visit').click();life.destroy();assert.equal(h.keys.size,0);assert.ok(h.sprites.every(s=>s.removed));
});

test('arrow keys move from the map but never steal keys from controls or links',()=>{const h=harness('zh'),life=mount(h.ctx),key=[...h.keys][0],player=h.sprites.find(s=>s.props.id==='semester-player');let prevented=0;const up=tag=>key({key:'ArrowUp',target:{tagName:tag},preventDefault:()=>prevented++});for(const tag of ['INPUT','SELECT','TEXTAREA','BUTTON','A'])up(tag);assert.equal(player.props.y,76);assert.equal(prevented,0);up('DIV');assert.equal(player.props.y,54);assert.equal(prevented,1);life.destroy();});
