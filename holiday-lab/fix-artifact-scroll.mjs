import fs from 'node:fs';
const file='holiday-lab/runner.mjs';let code=fs.readFileSync(file,'utf8');
const before="el('pre',{class:'result-artifact',id:'result-artifact',text:JSON.stringify(data.artifact,null,2)},detail);";
const after="const paper=el('div',{class:'artifact-paper'},detail);el('pre',{class:'result-artifact',id:'result-artifact',text:JSON.stringify(data.artifact,null,2)},paper);";
if(code.split(before).length!==2)throw Error('Expected exact artifact renderer');fs.writeFileSync(file,code.replace(before,after));
const css='holiday-lab/lab.css';let style=fs.readFileSync(css,'utf8');const selector='#lab .game-card,#lab .controls,#lab .overlay{';if(style.split(selector).length!==2)throw Error('Expected generated paper style');style=style.replace(selector,'#lab .game-card,#lab .controls,#lab .overlay,#lab .artifact-paper{');style+='\n/* The paper owns padding; only its interior scrolls, so text never travels across its frame. */\n.result-artifact{padding:0;margin:0;}\n';fs.writeFileSync(css,style);
