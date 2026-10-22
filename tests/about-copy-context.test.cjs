const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),React=require('react');
const {parse}=require('@babel/parser'),{execFileSync}=require('node:child_process');
// Fixed reviewed complete sentences catch concatenation errors between highlighted fragments.
const plan=JSON.parse(execFileSync('git',['show','cbcfed1e8a5ad25b64a69e052941a6d103f22487:holiday-lab/translation-review-about-labs/exact-plan.json'],{encoding:'utf8'}));
const text=n=>n==null?'':Array.isArray(n)?n.map(text).join(''):typeof n==='object'?text(n.props.children):String(n);
function render(lang,kind){const source=fs.readFileSync('chapters-1.jsx','utf8'),ast=parse(source,{sourceType:'script',plugins:['jsx']}),node=ast.program.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='AboutLocalizedCopy');assert.ok(node,'the actual shared About component needs a whole-sentence renderer');const ctx={React,siteLanguage:lang};vm.runInNewContext(source.slice(node.start,node.end)+';this.copy=AboutLocalizedCopy;',ctx);return ctx.copy({kind});}
for(const lang of ['en','ja'])for(const [kind,id]of [['intro','about-main-sentence'],['history','about-history-paragraph']])test(`About ${lang}/${kind} joins as the complete reviewed sentence`,()=>{
 const actual=render(lang,kind),expected=plan.context_fixes.find(r=>r.id===id)[lang];assert.equal(text(actual),expected);
 const children=React.Children.toArray(actual.props.children),styled=children.filter(n=>React.isValidElement(n));
 if(kind==='intro'){assert.equal(styled.filter(n=>n.type==='span').length,2);assert.deepEqual(styled.map(n=>n.props.style.color),['var(--accent-red)','var(--accent-blue)']);}
 else{const bold=styled.filter(n=>n.type==='b').map(text);assert.ok(bold.includes('2006'));assert.ok(bold.includes('2011'));assert.ok(bold.length>=5);}
});
