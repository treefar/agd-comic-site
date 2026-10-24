const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=__dirname,project=path.resolve(dir,'../../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const beforeBytes=fs.readFileSync(path.join(dir,'raw/guide-before.json')),before=JSON.parse(beforeBytes);
const currentBytes=fs.readFileSync(path.join(project,'data/students/guide.json')),current=JSON.parse(currentBytes);
const proposal=JSON.parse(fs.readFileSync(path.join(dir,'proposal.json'))),matrix=JSON.parse(fs.readFileSync(path.join(dir,'source-matrix.json')));
const translations=[...JSON.parse(fs.readFileSync(path.join(dir,'translations.json'))).translations,...JSON.parse(fs.readFileSync(path.join(dir,'source-visible-translations.json'))).pairs];
const checks=[]; const check=(id,pass,detail)=>checks.push({id,yes:!!pass,detail});
const get=(v,p)=>p.split('/').slice(1).reduce((x,k)=>x?.[k],v);
check('proposal-input-sha',sha(beforeBytes)===proposal.guide_input_sha256,{expected:proposal.guide_input_sha256,actual:sha(beforeBytes)});
for(const c of proposal.changes)check('before'+c.pointer,JSON.stringify(get(current,c.pointer))===JSON.stringify(c.before),{file:c.file,pointer:c.pointer,unchanged:JSON.stringify(get(current,c.pointer))===JSON.stringify(c.before)});
for(const id of ['financial-aid','support-rights','career'])check('owned-card-'+id,JSON.stringify(current.cards.find(c=>c.id===id))===JSON.stringify(before.cards.find(c=>c.id===id)),{});
const candidate=structuredClone(before);
for(const c of proposal.changes){const bits=c.pointer.split('/').slice(1),key=bits.pop();bits.reduce((x,k)=>x[k],candidate)[key]=c.after;}
candidate.sources.push(...proposal.new_sources);
const ids=new Set(candidate.sources.map(s=>s.id));
check('all-new-source-ids-unique',ids.size===candidate.sources.length,{candidate_source_count:candidate.sources.length});
for(const id of ['financial-aid','support-rights','career']){
 const c=candidate.cards.find(x=>x.id===id);
 check(id+'-three-steps',c.steps.length===3&&c.step_details.length===3,{});
 check(id+'-summary-80',Array.from(c.summary).length<=80,{length:Array.from(c.summary).length});
 c.step_details.forEach((d,i)=>check(id+'-detail-'+i+'-25-to-100',Array.from(d.detail).length>=25&&Array.from(d.detail).length<=100,{length:Array.from(d.detail).length}));
 c.faq.forEach((f,i)=>check(id+'-faq-'+i+'-120',Array.from(f.a).length<=120,{length:Array.from(f.a).length}));
 const refs=[...c.source_ids,...c.step_details.flatMap(d=>d.source_ids),...c.faq.flatMap(f=>f.source_ids)];
 check(id+'-valid-source-references',refs.every(x=>ids.has(x)),{missing:refs.filter(x=>!ids.has(x))});
}
const visibleNew=[];
for(const c of proposal.changes){
 if(c.pointer.startsWith('/cards/')&&typeof c.after==='string'&&!c.pointer.endsWith('/source_ids'))visibleNew.push(c.after);
 if(c.pointer.startsWith('/cards/')&&c.pointer.endsWith('/faq')){const old=new Set(c.before.flatMap(f=>[f.q,f.a]));visibleNew.push(...c.after.flatMap(f=>[f.q,f.a]).filter(x=>!old.has(x)));}
 if(c.pointer.includes('/sources/')&&c.pointer.endsWith('/readability'))visibleNew.push(c.after);
}
for(const s of proposal.new_sources)visibleNew.push(s.title,s.published_or_document_date,s.readability);
check('new-visible-copy-has-en-ja-suggestions',visibleNew.every(x=>translations.some(t=>t.zh===x&&t.en&&t.ja)),{count:visibleNew.length,missing:visibleNew.filter(x=>!translations.some(t=>t.zh===x&&t.en&&t.ja))});
check('old-http-recheck-preserved',proposal.changes.every(c=>!c.pointer.includes('http_recheck')),{changed_http_receipts:[]});
check('new-source-captions-plain',proposal.new_sources.every(s=>!/(HTTP|DOM|403|202|瀏覽器|渲染|抽文|下載)/i.test(s.readability)),{});
const dls=JSON.parse(fs.readFileSync(path.join(dir,'raw/download-results.json')));
for(const d of dls){const b=fs.readFileSync(path.join(dir,d.file));check('attachment-'+d.id,d.valid&&sha(b)===d.sha256,{bytes:b.length,sha256:sha(b),status:d.http});}
const extraction=JSON.parse(fs.readFileSync(path.join(dir,'raw/extraction-results.json')));
const pageCount=extraction.reduce((n,r)=>n+(r.pages||0),0);
let rendered=0;for(const e of extraction)if(e.pages)for(let i=1;i<=e.pages;i++){const p=path.join(dir,'pages',`${e.id}-p${i}.webp`);if(fs.existsSync(p)&&fs.statSync(p).size>0)rendered++;}
check('all-pdf-pages-rendered',pageCount===25&&rendered===25,{pageCount,rendered});
check('expected-research-gaps-explicit',matrix.questions.filter(q=>!q.yes).length===2,{no:matrix.questions.filter(q=>!q.yes).map(q=>q.id)});
check('own-browser-tab-closed',JSON.parse(fs.readFileSync(path.join(dir,'raw/browser-cleanup.json'))).closedTabId==='1509779748',{});
const guard={before_sha256:sha(beforeBytes),after_sha256:sha(currentBytes),entire_file_unchanged:sha(beforeBytes)===sha(currentBytes),owned_three_cards_unchanged:checks.filter(c=>c.id.startsWith('owned-card')).every(c=>c.yes)};
const manifest=[];for(const folder of ['raw','pages'])for(const f of fs.readdirSync(path.join(dir,folder))){const p=path.join(dir,folder,f);if(fs.statSync(p).isFile()){const b=fs.readFileSync(p);manifest.push({file:folder+'/'+f,bytes:b.length,sha256:sha(b)});}}
fs.writeFileSync(path.join(dir,'evidence-manifest.json'),JSON.stringify(manifest,null,2));
const out={schema:1,checked_at:new Date().toISOString(),verification:'research documents only; not product/build/browser acceptance',yes:checks.filter(x=>x.yes).length,no:checks.filter(x=>!x.yes).length,pass:checks.every(x=>x.yes),guard,candidate_counts:{cards:candidate.cards.length,steps:candidate.cards.reduce((n,c)=>n+c.steps.length,0),faq:candidate.cards.reduce((n,c)=>n+c.faq.length,0),sources:candidate.sources.length},checks};
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(out,null,2));
console.log(JSON.stringify({pass:out.pass,yes:out.yes,no:out.no,guard,candidate_counts:out.candidate_counts},null,2));
if(!out.pass)process.exitCode=1;
