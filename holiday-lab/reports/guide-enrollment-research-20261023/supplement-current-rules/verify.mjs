import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const old=path.dirname(base);const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks=[];const check=(id,ok,evidence)=>checks.push({id,status:ok?'yes':'no',evidence});
const pins={'REPORT.md':'e6ea2c15567c42d9e1bf937f9bda664b56896a942f581cda8ce06b715ab2d16f','student-draft.json':'fb048bce462bc2f576d1abb0757074984a311e56f5582fb584505e3f79c39aa9','source-catalog.json':'815622e2b82e1ff4c20044c2c4318c4c359add0d812db7826048955cd11b0ecc','verification.json':'63f58f4802cc42cb45712662b48abc755a94f88fc0422b4e207530c3d5fe37b5'};
for(const [file,sha] of Object.entries(pins))check('prior_unchanged_'+file,hash(path.join(old,file))===sha,{sha256:hash(path.join(old,file))});
const src=read(path.join(base,'sources.json')),draft=read(path.join(base,'student-draft.json')),v=read(path.join(base,'visual-pages.json')),g=read(path.join(base,'gap-status.json')),report=fs.readFileSync(path.join(base,'REPORT.md'),'utf8');
const all=new Map([...read(path.join(old,'source-catalog.json')).sources,...src.added_sources].map(s=>[s.id,s]));
check('five_added_sources',src.added_sources.length===5&&all.size===19,{added:src.added_sources.length,total:all.size});
for(const s of src.added_sources){const raw=path.isAbsolute(s.raw)?s.raw:path.join(base,s.raw);check('raw_'+s.id,hash(raw)===s.raw_sha256,{sha256:hash(raw),pages_read:s.pages,scope:s.read_scope});}
for(const x of v)check('visual_'+x.key+'_'+x.page,x.visual_read===true&&hash(x.png)===x.png_sha256&&hash(x.pdf)===x.pdf_sha256,{png:x.png,png_sha256:x.png_sha256,page:x.page});
check('visual_count_15',v.length===15,v.length);check('five_topics',draft.topics.length===5,draft.topics.length);
for(const t of draft.topics){check('structure_'+t.id,t.steps.length>=4&&t.steps.length<=6&&t.faq.length===3,{steps:t.steps.length,faq:t.faq.length});for(const [i,s]of t.steps.entries())check('sentences_'+t.id+'_'+(i+1),(s.text.match(/[。！？]/g)||[]).length===2,s.text);for(const x of [...t.steps,...t.faq])check('citation_'+t.id+'_'+(x.title||x.q),x.source_ids.length>0&&x.source_ids.every(id=>all.has(id)&&report.includes(']('+all.get(id).url+')')),x.source_ids);}
check('five_flowcharts',(report.match(/~~~mermaid/g)||[]).length===5,'Mermaid 5');
check('eight_prior_gaps',g.length===8&&g.filter(x=>x.status==='resolved_for_assigned_scope').length===1,g);
check('not_all_ready',report.includes('整體正式現行規章、表單與當期日程全齊仍為 no')&&g.some(x=>x.status==='not_ready'),g.filter(x=>x.status!=='resolved_for_assigned_scope'));
check('school_selected_only',src.added_sources.find(s=>s.id==='A19').read_scope.includes('非全16頁實讀'),'only 1,3,4,6,7');
check('no_signed_download_urls',!report.includes('download_url')&&!JSON.stringify(src).includes('download_url'),'No signed endpoint in report/catalog');
const summary={yes:checks.filter(x=>x.status==='yes').length,no:checks.filter(x=>x.status==='no').length};
const files=['REPORT.md','student-draft.json','sources.json','gap-status.json','visual-pages.json','assemble.mjs','verify.mjs'].map(file=>({file,sha256:hash(path.join(base,file))}));
const result={as_of:'2026-10-23',scope:'source/document-receipt verification only; not formal publication approval',summary,added_sources:5,combined_sources:19,new_visual_pages:15,formal_current_rules_complete:false,checks,manifest:files};fs.writeFileSync(path.join(base,'verification.json'),JSON.stringify(result,null,2)+'\n');const stdout=JSON.stringify({summary,added_sources:5,combined_sources:19,new_visual_pages:15,formal_current_rules_complete:false,report_sha256:hash(path.join(base,'REPORT.md'))},null,2)+'\n';fs.writeFileSync(path.join(base,'verification-output.txt'),stdout);process.stdout.write(stdout);process.exitCode=summary.no?1:0;
