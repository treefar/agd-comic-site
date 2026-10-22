import fs from 'node:fs';
const source=fs.readFileSync('holiday-lab/games/constitution.mjs','utf8');
const edits=[["'Every story can be seen.'","'Every story is worth seeing.'"],["'みんなの物語を、大切に。'","'どの物語も、見る価値がある。'"],["en:['Every story','can be seen.']","en:['Every story is','worth seeing.']"],["ja:['みんなの物語を、','大切に。']","ja:['どの物語も、','見る価値がある。']"]];
let candidate=source;for(const[old,next]of edits){if(candidate.split(old).length!==2)throw Error('Exact candidate token mismatch');candidate=candidate.replace(old,next);}const module=await import('data:text/javascript;base64,'+Buffer.from(candidate).toString('base64'));
const results=[];for(const lang of ['en','ja'])for(const font of [16,18]){const config={font,lines:2,duration:6,x:50,y:78,tone:'light'},v=module.evaluateCaption(0,config,lang);if(!v.ok)throw Error(JSON.stringify({lang,font,v}));results.push({lang,font,lines:module.captionLines(0,lang,2),result:v});}
console.log(JSON.stringify({mode:'in-memory string-only candidate; no product file write; no rule or threshold changes',results},null,2));
