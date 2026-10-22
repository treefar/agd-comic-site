import fs from 'node:fs';
const p='holiday-lab/runner.mjs';let code=fs.readFileSync(p,'utf8');
const before="const controls=el('section',{id:'game-controls',class:'controls','aria-label':w(T.help)},layout);";
const after="const controlsPaper=el('div',{class:'controls-paper'},layout);const controls=el('section',{id:'game-controls',class:'controls','aria-label':w(T.help)},controlsPaper);";
if(code.split(before).length!==2)throw Error('Expected exact control renderer');fs.writeFileSync(p,code.replace(before,after));
const css='holiday-lab/lab.css';let style=fs.readFileSync(css,'utf8');const selector='#lab .game-card,#lab .controls,#lab .overlay,#lab .artifact-paper{';if(style.split(selector).length!==2)throw Error('Expected current generated frame rule');style=style.replace(selector,'#lab .game-card,#lab .controls-paper,#lab .overlay,#lab .artifact-paper{');
style+='\n/* Fixed generated paper frame; scroll only the writable interior. */\n.controls-paper{min-width:0;}\n#lab .controls{padding:0;border:0;background-image:none;max-height:582px;}\n@media(max-width:780px){#lab .controls{max-height:none;}}\n';fs.writeFileSync(css,style);
