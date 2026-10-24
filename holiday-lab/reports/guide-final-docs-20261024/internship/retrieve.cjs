// Download only actual public links observed in our official page DOM.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=__dirname;const r=JSON.parse(fs.readFileSync(path.join(dir,'rules-native.json'))),i=JSON.parse(fs.readFileSync(path.join(dir,'internship-native.json')));
const find=(links,fragment)=>links.find(x=>decodeURIComponent(x.url).includes(fragment))?.url;
const tasks=[
 ['school-rules',find(r.links,'學生校外實習辦法-1131009'),'pdf'],
 ['school-details',find(r.links,'學生校外實習施行細則_1130918'),'pdf'],
 ['school-emergency',find(r.links,'緊急事故處理作業細則-1130918'),'pdf'],
 ['school-overseas-selection',find(r.links,'專案計畫甄選要點-1120913'),'pdf'],
 ['student-system-guide',find(i.links,'學生校外實習說明_1131205學生版'),'pdf'],
 ['employment-contract',find(i.links,'實習合約書僱傭關係版本'),'odt'],
 ['nonemployment-contract',find(i.links,'實習合約書非僱傭關係版本'),'odt'],
 ['institution-evaluation',find(i.links,'校外實習機構評估表_V3.0'),'odt'],
 ['transfer-stop',find(i.links,'學生校外實習轉換停止實習機構申請表_V3.0'),'odt'],
 ['student-self-assessment',find(i.links,'實習生自評問卷_1130123'),'odt'],
 ['school-rules-index',r.url,'html'],['internship-index',i.url,'html']
];
(async()=>{const receipts=[];for(const [id,url,ext]of tasks){if(!url)throw Error('Missing observed link:'+id);const start=new Date().toISOString();try{
 const res=await fetch(url,{signal:AbortSignal.timeout(25000)}),b=Buffer.from(await res.arrayBuffer());const file='raw/'+id+'.'+ext;fs.writeFileSync(path.join(dir,file),b);
 receipts.push({id,url,started:start,finished:new Date().toISOString(),status:res.status,final_url:res.url,content_type:res.headers.get('content-type'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),file,pdf_signature:ext==='pdf'?b.subarray(0,5).toString()==='%PDF-':undefined,zip_signature:ext==='odt'?b.subarray(0,2).toString()==='PK':undefined});
 }catch(e){receipts.push({id,url,started:start,finished:new Date().toISOString(),error:String(e)})}
 fs.writeFileSync(path.join(dir,'retrievals.json'),JSON.stringify(receipts,null,2)+'\n');console.log(JSON.stringify(receipts.at(-1)));}
})();
