// Download only already-observed anonymous official attachments; never submit forms.
const fs=require('node:fs/promises'), path=require('node:path'), crypto=require('node:crypto');
const dir=__dirname;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const manifest=JSON.parse(await fs.readFile(path.join(dir,'raw/download-manifest.json'),'utf8'));
 const results=[];
 for(let offset=0;offset<manifest.length;offset+=4){
  results.push(...await Promise.all(manifest.slice(offset,offset+4).map(async m=>{
   const started=new Date().toISOString();
   try{
    const r=await fetch(m.href,{signal:AbortSignal.timeout(20000)}); const b=Buffer.from(await r.arrayBuffer());
    const ext=path.extname(new URL(m.href).pathname); const valid=r.ok&&b.length>0&&(ext!=='.pdf'||b.subarray(0,5).toString()==='%PDF-');
    const file='raw/'+m.id+(valid?ext:'.response');
    await fs.writeFile(path.join(dir,file),b,{flag:'wx'});
    return {...m,started,finished:new Date().toISOString(),http:r.status,finalURL:r.url,contentType:r.headers.get('content-type'),bytes:b.length,sha256:sha(b),valid,file};
   }catch(e){return {...m,started,finished:new Date().toISOString(),valid:false,error:String(e)};}
  })));
 }
 await fs.writeFile(path.join(dir,'raw/download-results.json'),JSON.stringify(results,null,2),{flag:'wx'});
 console.log(JSON.stringify({count:results.length,valid:results.filter(x=>x.valid).length,results:results.map(x=>({id:x.id,http:x.http,bytes:x.bytes,valid:x.valid,error:x.error}))},null,2));
 if(results.some(x=>!x.valid))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
