// New Year finite rejection catalog, read from served AST; no game-rule imports.
const assert=require('node:assert/strict'),{parse}=require('@babel/parser');
const {staticCatalog:objectCatalog}=require('../static-error-max-3/custom-catalog.cjs');
function walk(n,fn){if(!n||typeof n!=='object')return;fn(n);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(x=>walk(x,fn));else if(v&&typeof v==='object')walk(v,fn);}
function staticCatalog(source,c){
 const catalog=objectCatalog(source,c),ast=parse(source,{sourceType:'module'}),preview=[];
 walk(ast,n=>{if(n.type==='CallExpression'&&n.callee.name==='W'&&n.arguments.length===3&&n.arguments.every(a=>a.type==='StringLiteral')&&n.arguments[0].value==='先完整試播。改時間或心情後，都要再看一次。')preview.push(n);});
 assert.equal(preview.length,1);catalog['preview-required']=Object.fromEntries(['zh','en','ja'].map((l,i)=>[l,preview[0].arguments[i].value]));assert.equal(Object.keys(catalog).length,11);return catalog;
}
function reachability(source,runner){
 const needles=["if(!previewed){ctx.hint(","if(dead||state.done)return","min:80,max:700,step:10","if(!r.ok){ctx.sound('error');ctx.hint(feedback[r.reason]);return;}","if(!verdict.ok)return feedback[verdict.reason]","ctx.ui.setText(observation,message);ctx.hint(message)","owned.push(ctx.ui.text('ny-instructions'","const [launch,flight,landing]=timing,total=launch+flight+landing","(round===2&&!FOCUS.some(x=>x.value===focus))","playing=false;previewed=false;draw(0);showBrief()"];
 for(const n of needles)assert.ok(source.includes(n),'Changed module: '+n);
 for(const n of ["Math.min(max,Math.max(min,Number(n)))","input=el('input',{id,type:'range',min,max,step,value","input.addEventListener('input',()=>{output.textContent=input.value;onInput(Number(input.value));})","function results(g,data){clear();"])assert.ok(runner.includes(n),'Changed shared input: '+n);
 return {normal_ui_only:true,excluded_reason:{invalid:'Integer round0..2 is maintained until completion; three bounded sliders80..700step10 and fixed FOCUS choices cannot produce invalid; callbacks guard dead/done. Invalid is an API-only unchanged-state result.',done:'Third accepted take completes and destroys controls; callbacks guard dead/done.',secondary:'Preview rejection text is placed in ny-observation and game-hint. A premature keep only changes game-hint to the separate preview-required literal. ny-pose is one of three fixed phase words; no dynamic numerical refusal sentence.'},source_checks:needles.map(exact_source=>({line:source.slice(0,source.indexOf(exact_source)).split('\n').length,exact_source}))};
}
module.exports={staticCatalog,reachability};
