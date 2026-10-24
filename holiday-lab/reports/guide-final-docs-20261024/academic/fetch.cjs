const fs=require('fs'),path=require('path'),crypto=require('crypto');const d=__dirname;
const read=f=>JSON.parse(fs.readFileSync(path.join(d,f)));const rows=[
 ['course-dates-1151',read('course-dom.json').links.find(x=>x.text==='115-1學生選課日期及注意事項')],
 ['special-course-form',read('forms-dom.json').links.find(x=>x.context?.includes('G01')&&x.text==='pdf')],
 ['credit-system-manual',read('credit-dom.json').links.find(x=>x.text.includes('操作說明'))],
 ['refund-1151',read('status-dom.json').links.find(x=>x.text==='會計室網頁')],
 ['audit-manual',read('audit-dom.json').links.find(x=>x.href.includes('1cKNlaqq'))]
];
fs.mkdirSync(path.join(d,'raw'),{recursive:true});
(async()=>{const results=await Promise.allSettled(rows.map(async([id,source])=>{const u=new URL(source.href);const driveId=u.hostname==='drive.google.com'?(u.searchParams.get('id')||u.pathname.split('/d/')[1]?.split('/')[0]):null;const url=driveId?'https://drive.google.com/uc?export=download&id='+driveId:source.href;const r=await fetch(url),b=Buffer.from(await r.arrayBuffer()),pdf=b.subarray(0,5).toString()==='%PDF-';const file='raw/'+id+(pdf?'.pdf':'.response');fs.writeFileSync(path.join(d,file),b);return{id,source,url,final_url:r.url,status:r.status,bytes:b.length,pdf,file,sha256:crypto.createHash('sha256').update(b).digest('hex'),authentication:'none',at:new Date().toISOString()};}));const receipt=results.map((r,i)=>r.status==='fulfilled'?r.value:{id:rows[i][0],error:String(r.reason)});fs.writeFileSync(path.join(d,'fetch-receipts.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(receipt.some(r=>!r.pdf))process.exitCode=1;})();
