const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(d,p),'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks=[];const ck=(name,yes,detail)=>checks.push({name,answer:yes?'yes':'no',detail});
const c=read('source-catalog.json');
for(const r of c.direct_receipts){
 if(!r.file)continue;
 const p=path.join(d,r.file),b=fs.readFileSync(p);
 ck(r.id+' receipt integrity',b.length===r.bytes&&sha(p)===r.sha256,{status:r.status,bytes:b.length,sha256:sha(p)});
 if(r.pdf_signature)ck(r.id+' PDF signature',b.subarray(0,5).toString()==='%PDF-',b.subarray(0,8).toString());
}
for(const r of c.public_documents){
 const p=path.join(d,r.local_file),b=fs.readFileSync(p);
 ck(r.title+' original ZIP',b.subarray(0,2).toString()==='PK'&&b.length===r.file_size_bytes&&sha(p)===r.sha256,{bytes:b.length,sha256:sha(p)});
 ck(r.title+' same as prior raw',r.same_as_20261023,r.modified_time);
}
const get=id=>c.public_documents.find(x=>x.local_file==='raw/'+id+'.docx').content;
ck('two review deadline still present',get('capstone-change').includes('二審前'),get('capstone-change').split('\n').find(x=>x.includes('二審前')));
ck('three review deadline still present',get('capstone-rule').includes('最遲須於三審前')&&get('capstone-group').includes('三審前'),'rule and group form');
ck('listed rule revision is 108',get('capstone-rule').includes('108年12月30日'),get('capstone-rule').split('\n').slice(0,3));
const a=fs.readFileSync(path.join(d,'raw/graduate116A1.pdf')),b=fs.readFileSync(path.join(d,'raw/institute116.pdf'));
ck('both current PDF raw bytes equal',a.equals(b),sha(path.join(d,'raw/graduate116A1.pdf')));
const old=path.join(repo,'holiday-lab/reports/guide-capstone-study-research-20261023/raw');
ck('current PDF equals prior read source',a.equals(fs.readFileSync(path.join(old,'graduate116A1.pdf'))),'reuse prior text and rendered pages explicitly');
const page=JSON.parse(fs.readFileSync(path.join(old,'graduate116A1-text.json'))).find(x=>x.pdf_page===16);
ck('same page contradictory text still bound',page.text.includes('100%')&&page.text.includes('計畫書及口試'),{pdf_page:16,printed_page:15,book_review:'100%',oral:'考生應擬定跨域學習研究計畫書及口試'});
const index=c.direct_receipts.find(x=>x.id==='A4-index');
ck('checked index has115A4 but not116A4',index.pdf_links.some(x=>x.endsWith('/115A4.pdf'))&&!index.pdf_links.some(x=>x.endsWith('/116A4.pdf')),'bounded index observation only');
const p=read('proposal.json'),guide=JSON.parse(fs.readFileSync(path.join(repo,'data/students/guide.json'),'utf8'));
for(const op of p.operations){
 const actual=op.pointer.slice(1).split('/').reduce((a,k)=>a[k],guide);
 ck(op.pointer+' exact before',actual===op.before,{before:op.before});
 ck(op.pointer+' concise <=100 chars',[...op.after].length<=100,{length:[...op.after].length});
}
ck('proposal contains no resolution claim',p.operations.every(x=>!x.after.includes('確定免口試')&&!x.after.includes('一律二審')),'conflicts explicitly retained');
const result={generated_at:new Date().toISOString(),kind:'technical_artifact_validation_not_school_rule_approval',checks,yes:checks.filter(x=>x.answer==='yes').length,no:checks.filter(x=>x.answer==='no').length};
fs.writeFileSync(path.join(d,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));process.exitCode=result.no?1:0;
