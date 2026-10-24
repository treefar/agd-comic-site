const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
module.exports=async function bind(base,build){
 const html=fs.readFileSync(path.join(build,'index.html'),'utf8'),origin=new URL(base).origin;
 const refs=['index.html',...[...html.matchAll(/(?:src|href)="([^"<>]+\.(?:js|css)(?:\?[^"<>]*)?)"/g)].map(m=>m[1])];
 const rows=[];for(const ref of new Set(refs)){const u=new URL(ref,base);if(u.origin!==origin)continue;const rel=decodeURIComponent(u.pathname.slice(1))||'index.html',file=path.resolve(build,rel);if(!file.startsWith(path.resolve(build)+path.sep))throw Error('HTTP reference out of build');const res=await fetch(u,{signal:AbortSignal.timeout(10000)}),bytes=Buffer.from(await res.arrayBuffer()),expected=sha(fs.readFileSync(file));rows.push({url:u.href,file:rel,status:res.status,sha256:sha(bytes),expected,match:res.status===200&&sha(bytes)===expected});}
 if(!rows.length||rows.some(x=>!x.match))throw Error('Served HTML/code does not match frozen build: '+JSON.stringify(rows));
 return rows;
};
