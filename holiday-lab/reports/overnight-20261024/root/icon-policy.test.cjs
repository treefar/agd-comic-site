const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..');
test('website does not reference the known generated icon; original file is retained',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(html,/<link rel="icon" href="data:,"\s*\/>/);
 assert.ok(!html.includes('href="images/site-icon.png"'));
 assert.ok(fs.statSync(path.join(root,'images/site-icon.png')).size>0);
});
test('local default favicon is explicitly absent, while a missing image still returns 404',async()=>{
 const {createServer}=require(path.join(root,'scripts/serve-local-review.cjs'));
 const server=createServer({site:root,dashboard:path.join(root,'holiday-lab/dashboard/out')});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const base='http://127.0.0.1:'+server.address().port;
 const icon=await fetch(base+'/favicon.ico');assert.equal(icon.status,204);assert.equal((await icon.arrayBuffer()).byteLength,0);
 assert.equal((await fetch(base+'/this-image-does-not-exist.png')).status,404);
 }finally{await new Promise(r=>server.close(r));}
});
