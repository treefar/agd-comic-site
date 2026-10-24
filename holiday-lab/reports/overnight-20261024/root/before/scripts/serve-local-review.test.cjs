const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
const {createServer}=require('./serve-local-review.cjs');
test('review server isolates roots, serves real favicon bytes and preserves unknown 404 errors',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'agd-local-review-')),site=path.join(dir,'site'),dashboard=path.join(dir,'dashboard');
 fs.mkdirSync(path.join(site,'images'),{recursive:true});fs.mkdirSync(dashboard);
 fs.writeFileSync(path.join(site,'index.html'),'SITE');fs.writeFileSync(path.join(dashboard,'index.html'),'PROGRESS');
 const bytes=fs.readFileSync(path.resolve(__dirname,'../images/site-icon.png'));fs.writeFileSync(path.join(site,'images/site-icon.png'),bytes);
 fs.writeFileSync(path.join(dir,'private.txt'),'PRIVATE');
 const s=createServer({site,dashboard});await new Promise(r=>s.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+s.address().port;
 try{
  assert.equal(await(await fetch(base+'/')).text(),'SITE');assert.equal(await(await fetch(base+'/progress/')).text(),'PROGRESS');
  const icon=await fetch(base+'/favicon.ico');assert.equal(icon.status,200);assert.equal(icon.headers.get('content-type'),'image/png');assert.deepEqual(Buffer.from(await icon.arrayBuffer()),bytes);
  assert.equal((await fetch(base+'/missing-game.png')).status,404);
  assert.equal((await fetch(base+'/progress/%2e%2e%2fprivate.txt')).status,403);
  assert.equal((await fetch(base+'/bad%ZZ')).status,400);
  assert.equal((await fetch(base+'/progress',{redirect:'manual'})).headers.get('location'),'/progress/');
 }finally{await new Promise(r=>s.close(r));}
});
