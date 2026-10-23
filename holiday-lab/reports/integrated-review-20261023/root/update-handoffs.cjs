const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname,root=path.resolve(dir,'../../../..'),notes=fs.readFileSync(path.join(dir,'phase-notes.md'),'utf8'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=[path.join(root,'holiday-lab/STATUS.md'),'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md','C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
const section=s=>{const start=s.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(start>=0);const tail=s.slice(start),next=tail.slice(1).search(/\r?\n## /);return next<0?tail:tail.slice(0,next+1);};
const outputs=[];for(const file of files){const before=fs.readFileSync(file,'utf8');assert.ok(!before.includes(notes.split('\n')[0]),'already prepended '+file);let after;
if(file.endsWith('LATEST_HANDOFF.md')){const c=section(before);assert.equal(sha(c),'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');after=notes.replace(/\r?\n/g,'\r\n')+before;assert.equal(section(after),c);}
else if(before.startsWith('---')){const end=before.indexOf('\n---',3)+4;assert.ok(end>4);after=before.slice(0,end)+'\n\n'+notes+before.slice(end).replace(/^\r?\n\r?\n/,'');}
else after=notes+before;
fs.writeFileSync(file,after);outputs.push({file,before_sha256:sha(before),after_sha256:sha(after),c_section_unchanged:file.endsWith('LATEST_HANDOFF.md')?true:undefined});}
fs.writeFileSync(path.join(dir,'handoff-update.json'),JSON.stringify({at:new Date().toISOString(),outputs,publication:false},null,2));console.log(JSON.stringify({updated:outputs.length,c_section_unchanged:true}));
