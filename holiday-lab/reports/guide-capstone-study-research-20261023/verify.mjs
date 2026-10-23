import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const b=path.dirname(fileURLToPath(import.meta.url));
const get=f=>JSON.parse(fs.readFileSync(path.join(b,f),'utf8'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const c=get('source-catalog.json'),d=get('draft.json'),g=get('gaps.json'),v=get('page-visual-ledger.json'),forms=get('graduate-forms.json');
const report=fs.readFileSync(path.join(b,'REPORT.md'),'utf8');
const rows=[];function check(name,ok,actual){rows.push({name,result:ok?'yes':'no',actual});}
const ids=new Set(c.sources.map(s=>s.id));
check('unique_source_urls',new Set(c.sources.map(s=>s.url)).size===21,c.sources.length);
let hashOK=0,pdfOK=0,docxOK=0,emptyOK=0;
for(const s of c.sources){const p=path.join(b,s.file),bytes=fs.readFileSync(p);if(sha(p)===s.sha256&&bytes.length===s.bytes)hashOK++;if(s.pdf_signature&&bytes.subarray(0,5).toString()==='%PDF-')pdfOK++;if(s.file.endsWith('.docx')&&bytes[0]===80&&bytes[1]===75)docxOK++;if(s.access_layer==='empty_http202_no_body'&&bytes.length===0)emptyOK++;}
check('source_sha_bytes',hashOK===21,hashOK+'/21');
check('pdf_signatures',pdfOK===7,pdfOK);
check('docx_signatures',docxOK===3,docxOK);
check('empty_pages_not_counted_as_read',emptyOK===9&&c.counts.actual_nonempty_sources===12,{empty:emptyOK,nonempty:c.counts.actual_nonempty_sources});
check('topics_five_steps_three_faq',d.topics.length===2&&d.topics.every(t=>t.steps.length===5&&t.faq.length===3),d.topics.map(t=>({id:t.id,steps:t.steps.length,faq:t.faq.length})));
const steps=d.topics.flatMap(t=>t.steps);
check('each_step_two_to_three_sentences',steps.every(s=>s.sentences.length>=2&&s.sentences.length<=3&&s.sentences.every(x=>x.endsWith('。'))),steps.map(s=>s.sentences.length));
const blocks=d.topics.flatMap(t=>[...t.steps,...t.faq]);
check('all_draft_blocks_grounded_sources',blocks.every(s=>s.sources.length&&s.sources.every(id=>ids.has(id))),blocks.length);
check('draft_rendered_without_dropped_text',d.topics.every(t=>t.steps.every(s=>s.sentences.every(x=>report.includes(x)))&&t.faq.every(q=>report.includes(q.answer))),true);
check('pdf_visual_evidence_sha',v.length===30&&v.every(p=>fs.existsSync(path.join(b,p.image))&&sha(path.join(b,p.image))===p.sha256),v.length);
check('seven_annexes_individually_read',forms.length===7&&forms.every(f=>f.visually_read&&v.some(p=>p.source_id==='graduate116A1'&&p.pdf_page===f.pdf_page)),forms.map(f=>f.number+':'+f.pdf_page));
check('concrete_gap_items',g.length===11&&['P01','P02','G01','G02','G03'].every(id=>g.some(x=>x.id===id)),g.length);
check('cohort_dates_conflicts_explicit',report.includes('三審前與二審前有文件衝突')&&report.includes('2025/10/1至2025/11/3')&&report.includes('2026/1/19至2026/3/9')&&report.includes('2026/9/29 10:00至2026/11/2')&&report.includes('附表四')&&report.includes('書審100%'),true);
check('anonymous_access_not_claimed',c.discovery_chain.anonymous_public_access_verified===false&&c.sources.filter(s=>s.id.startsWith('capstone-')).every(s=>s.anonymous_public_access_verified===false),false);
check('mother_receipt_sha',sha(c.discovery_chain.mother_receipt)===c.discovery_chain.sha256,c.discovery_chain.sha256);
check('no_bearer_urls_stored_in_data',!fs.readdirSync(b).filter(n=>/\.(?:json|md|txt)$/.test(n)).some(n=>/https:\/\/sdmntpr|[?&]sig=[A-Za-z0-9%]/.test(fs.readFileSync(path.join(b,n),'utf8'))),true);
const result={checked_at:new Date().toISOString(),scope:'Document/source/structure checks only; not policy applicability approval, independent review, product build or publication',command:'node holiday-lab/reports/guide-capstone-study-research-20261023/verify.mjs',checks:rows,passed:rows.filter(r=>r.result==='yes').length,total:rows.length,all_passed:rows.every(r=>r.result==='yes')};
fs.writeFileSync(path.join(b,'verification.json'),JSON.stringify(result,null,2)+'\n');
const out=rows.map(r=>(r.result==='yes'?'YES ':'NO  ')+r.name+' '+JSON.stringify(r.actual)).join('\n')+'\nDOCUMENT_SOURCE_VERIFY '+result.passed+'/'+result.total+' '+(result.all_passed?'PASS':'FAIL')+'\n';
fs.writeFileSync(path.join(b,'verification-output.txt'),out);process.stdout.write(out);if(!result.all_passed)process.exitCode=1;

