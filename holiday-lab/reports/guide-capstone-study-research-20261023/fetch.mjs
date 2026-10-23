import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));fs.mkdirSync(path.join(dir,'raw'),{recursive:true});
const entries=[
 ['curriculum114','https://info.stu.edu.tw/ACA/teacher/QryCoursedept/DownLoadFileori.asp?Sec=114116','pdf'],
 ['curriculum115','https://info.stu.edu.tw/ACA/teacher/QryCoursedept/DownLoadFileori.asp?Sec=115116','pdf'],
 ['graduate116A1','https://info.stu.edu.tw/attachfile/upload/IRS/file/116A1.pdf','pdf'],
 ['graduate115A1','https://info.stu.edu.tw/attachfile/upload/IRS/file/115A1.pdf','pdf'],
 ['graduate115A4','https://info.stu.edu.tw/attachfile/upload/IRS/file/115A4.pdf','pdf'],
 ['deptforms','https://www.dgd.stu.edu.tw/常用表單/','html'],
 ['exhibition','https://www.dgd.stu.edu.tw/畢業展/','html'],
 ['deptnews','https://www.dgd.stu.edu.tw/support/','html'],
 ['graduateIndex','https://info.stu.edu.tw/aca/newirs/qryIRSpdf/qryIRSCourse.asp','html'],
 ['apply116','https://info.stu.edu.tw/aca/NEWIRS/A1app.asp','html'],
 ['examPage','https://reg.aca.stu.edu.tw/master_entrance_examination','html'],
 ['designSchool','https://www.design.stu.edu.tw/','html'],
 ['designInstitute','https://www.ad.stu.edu.tw/','html'],
 ['architecture','https://www.hcd.stu.edu.tw/','html'],
 ['publicRestPosts','https://www.dgd.stu.edu.tw/wp-json/wp/v2/posts?search=%E5%B0%88%E9%A1%8C&per_page=20','json'],
 ['publicRestPages','https://www.dgd.stu.edu.tw/wp-json/wp/v2/pages?slug=%E5%B8%B8%E7%94%A8%E8%A1%A8%E5%96%AE','json']
];
const rows=[];for(let i=0;i<entries.length;i+=4)await Promise.all(entries.slice(i,i+4).map(async([id,url,ext])=>{const row={id,url,started:new Date().toISOString(),method:'ordinary public HTTPS GET; no login'};try{const r=await fetch(url,{signal:AbortSignal.timeout(25000)}),b=Buffer.from(await r.arrayBuffer()),file=path.join(dir,'raw',id+'.'+ext);fs.writeFileSync(file,b);Object.assign(row,{status:r.status,final_url:r.url,content_type:r.headers.get('content-type'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),file:path.relative(dir,file).replaceAll('\\','/'),pdf_signature:b.subarray(0,5).toString()==='%PDF-'});}catch(e){row.error=e.message;}row.finished=new Date().toISOString();rows.push(row);fs.writeFileSync(path.join(dir,'fetch-receipts.json'),JSON.stringify(rows,null,2));console.log(id+' '+(row.status??'ERROR')+' '+(row.bytes??0));}));
console.log('FETCH total'+rows.length+' PDF'+rows.filter(r=>r.pdf_signature).length+' emptyOrFailed'+rows.filter(r=>!r.bytes||r.status!==200).length);
