import fs from 'node:fs';
const file='holiday-lab/games/constitution.mjs';let text=fs.readFileSync(file,'utf8');
const edits=[
 ["color:draft.tone==='dark'?'#fff':'#191d22',opacity:'1'});const v=evaluateCaption(index,draft,ctx.lang);caption.style.display=v.ok?'flex':'none';", "color:draft.tone==='dark'?'#fff':draft.tone==='low'?'#c8c0a8':'#191d22',opacity:'1'});const v=evaluateCaption(index,draft,ctx.lang);const paperFits=captionLines(index,ctx.lang,draft.lines).every(s=>units(s)*draft.font<=150)&&draft.font*draft.lines*1.05<=55&&draft.x>=36&&draft.x<=64&&draft.y>=76&&draft.y<=79;caption.style.display=paperFits?'flex':'none';"],
 ['完整草稿（尚未套入場景）｜','完整草稿｜'],
 ['Full draft (not applied to the scene) ·','Full draft ·'],
 ['全文の下書き（場面には未反映）・','全文の下書き・'],
 ['// Only a readable layout is painted into the comic scene; no cropped text is discarded.','// Only fitting geometry is painted into the scene; contrast/time experiments remain visible.']
];for(const [before,after]of edits){if(text.split(before).length!==2)throw Error('Exact token missing: '+before);text=text.replace(before,after);}fs.writeFileSync(file,text);
