// Public read-only downloads. Never logs in or reads student records.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath}from'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),stamp=new Date().toISOString().replace(/[:.]/g,'-'),out=path.join(dir,'retrievals',stamp);fs.mkdirSync(out,{recursive:true});
const urls=[
['curriculum-115','https://info.stu.edu.tw/ACA/teacher/QryCoursedept/DownLoadFileori.asp?Sec=115116'],
['certificate-system','https://info.stu.edu.tw/sao/certificate/item/index.asp'],
['certificate-award-107','https://s3-ap-northeast-1.amazonaws.com/stu-wordpress/wp-content/uploads/sites/71/2018/12/樹德科技大學學生考取專業證照獎助要點.pdf'],
['handbook-113','https://wpc.stu.edu.tw/wp-content/uploads/sites/21/2024/08/STU113新生選課手冊_1130820.pdf'],
['english-threshold-112','https://www.lcc.stu.edu.tw/2023/02/20/【重要】四技日間部學生請詳閱英文畢業門檻相關/'],
['english-registration-115-1','https://www.zzd.stu.edu.tw/英檢報名/'],
['career-contact','https://dcpi.sao.stu.edu.tw/業務介紹-成員/'],
['certificate-award-114-2','https://www.stu.edu.tw/latestnews-single/?id=233658'],
['academic-faq','https://www.aca.stu.edu.tw/常見問題｜qa/']];
const results=await Promise.all(urls.map(async([id,url])=>{const r={id,url,checked_at:new Date().toISOString()};try{const response=await fetch(url,{signal:AbortSignal.timeout(30000)}),bytes=Buffer.from(await response.arrayBuffer());Object.assign(r,{status:response.status,final_url:response.url,content_type:response.headers.get('content-type'),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),is_pdf:bytes.subarray(0,5).toString()==='%PDF-'});r.file=id+(r.is_pdf?'.pdf':'.html');fs.writeFileSync(path.join(out,r.file),bytes,{flag:'wx'});}catch(e){r.error=e.message;}return r;}));
fs.writeFileSync(path.join(out,'receipts.json'),JSON.stringify(results,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({out,results},null,2));
