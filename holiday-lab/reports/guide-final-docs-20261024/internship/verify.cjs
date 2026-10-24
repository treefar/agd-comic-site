const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../../..');
const read=n=>JSON.parse(fs.readFileSync(path.join(d,n),'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks=[];const ck=(name,yes,detail)=>checks.push({name,answer:yes?'yes':'no',detail});
const r=read('retrievals.json');
for(const x of r){const f=path.join(d,x.file),b=fs.readFileSync(f);ck(x.id+' byte/SHA',b.length===x.bytes&&sha(f)===x.sha256,{status:x.status,bytes:b.length,sha256:sha(f)});if(x.pdf_signature)ck(x.id+' PDF',b.subarray(0,5).toString()==='%PDF-',x.url);if(x.zip_signature)ck(x.id+' ODT',b.subarray(0,2).toString()==='PK',x.url);}
const comparison=read('department-comparison.json');
for(const c of comparison){const m=read('department-'+c.id+'.json');ck('department-'+c.id+' raw SHA',sha(path.join(d,m.local_file))===m.sha256,{same_as_prior:c.same_as_20261023,modified:c.modified_time});}
const proposal=read('proposal.json'),g=JSON.parse(fs.readFileSync(path.join(repo,'data/students/guide.json')));
for(const op of proposal.operations){
 const current=op.pointer.slice(1).split('/').reduce((a,k)=>a[k],g);
 ck(op.pointer+' before',JSON.stringify(current)===JSON.stringify(op.before),'precise baseline guard');
 if(typeof op.after==='string'){
  const n=[...op.after].length,detail=op.pointer.endsWith('/detail');
  ck(op.pointer+' length',detail?n>=25&&n<=100:n<=120,n);
  ck(op.pointer+' EN/JA proposals',!!op.translations?.en&&!!op.translations?.ja,'review suggestions, not official translations');
 }else if(op.pointer.endsWith('/faq'))ck(op.pointer+' FAQ120',op.after.every(x=>[...x.a].length<=120),op.after.map(x=>[...x.a].length));
}
const ids=new Set([...g.sources.map(x=>x.id),...proposal.new_sources.map(x=>x.id)]);
ck('new source ids unique',ids.size===g.sources.length+proposal.new_sources.length,proposal.new_sources.map(x=>x.id));
ck('new sources have no technical reader jargon',proposal.new_sources.every(x=>!/(HTTP|DOM|SHA|下載|渲染)/.test(x.readability)),'student-facing source text');
ck('career-contact source untouched',proposal.new_sources.every(x=>x.id!=='career-contact')&&proposal.operations.every(x=>!x.pointer.startsWith('/sources/')),'owned by another team');
ck('all references resolve',proposal.operations.every(x=>(x.source_ids||[]).every(id=>ids.has(id))),'existing + proposed source ids');
const text=id=>read('raw/'+id+'-text.json').map(x=>x.text).join('\n');
ck('school rules contain duties and separate department standards',text('school-rules').includes('成績之評核標準')&&text('school-details').includes('各系所應訂定'),'full rule text');
ck('school detailed submission rule read',text('school-details').includes('實習成果報告書、實習生自')&&text('school-details').includes('共同'),'article12');
ck('guide route actually present',text('student-system-guide').includes('校務資訊系統→學務資訊→校外實習(實習紀錄輸入)'),'PDFpage3 plus native observed page');
ck('overseas enrolment and return actually present',text('school-overseas-selection').includes('未休學')&&text('school-overseas-selection').includes('應向本校報到'),'school112 item8(2)');
ck('retained visit unchanged',JSON.stringify(proposal.retained[0].before)===JSON.stringify(proposal.retained[0].after),'no new cohort documents => preserve accurate warning');
const visual=['school-rules-page-1.png','school-rules-page-2.png','school-details-page-1.png','school-details-page-2.png','school-overseas-selection-page-1.png','school-overseas-selection-page-2.png','school-overseas-selection-page-3.png','school-emergency-page-1.png','school-emergency-page-2.png','student-system-guide-page-3.png','student-system-guide-page-17.png','student-system-guide-page-18.png'];
ck('12 visually read page PNGs saved',visual.every(x=>fs.existsSync(path.join(d,'raw',x))),visual);
fs.writeFileSync(path.join(d,'visual-evidence.json'),JSON.stringify({note:'These 12 actual rendered pages were opened and visually read. Other rendered PNGs are not claimed as visually read.',images:visual.map(x=>({file:'raw/'+x,sha256:sha(path.join(d,'raw',x))}))},null,2));
const baseline=read('baseline-8879.json');ck('own8879 baseline three cards',baseline.cards.length===3&&baseline.url.startsWith('http://127.0.0.1:8879/'),baseline.main_review_label);
const translations=read('translations.json');
ck('all28 translation proposals are three-language pairs',translations.pairs.length===28&&translations.pairs.every(x=>x.zh&&x.en&&x.ja),translations.pairs.length);
ck('all new source text has EN/JA proposals',proposal.new_sources.every(x=>['title','readability','note','published_or_document_date'].every(k=>translations.pairs.some(t=>t.zh===x[k]))),'Chinese original policy names retained; functional explanations only');
ck('all card operations have identity guard',proposal.operations.every(x=>x.card_id_guard===g.cards[Number(x.pointer.split('/')[2])].id),'no whole-file SHA locking');
ck('all source appends have id-absent guard',proposal.source_operations.every(x=>x.guard.id_absent===x.after.id),'do not duplicate sources');
const result={generated_at:new Date().toISOString(),kind:'technical_evidence_not_current_cohort_policy_approval',checks,yes:checks.filter(x=>x.answer==='yes').length,no:checks.filter(x=>x.answer==='no').length};
fs.writeFileSync(path.join(d,'verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));process.exitCode=result.no?1:0;
