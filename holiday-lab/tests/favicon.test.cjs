const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
test('website omits its generated icon; the unchanged holiday page retains its declared local PNG',()=>{
 assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('<link rel="icon" href="data:," />'));
 for(const name of ['holiday-lab/index.html']){
  const html=fs.readFileSync(path.join(root,name),'utf8');
  const tag=html.match(/<link\b[^>]*\brel=["']icon["'][^>]*>/i)?.[0];
  assert.ok(tag,`${name} must explicitly declare its icon`);
  const href=tag.match(/\bhref=["']([^"']+)["']/)?.[1];assert.ok(href&&!/^(?:https?:|data:)/i.test(href));
  const file=path.resolve(path.dirname(path.join(root,name)),href);
  assert.ok(file.startsWith(root+path.sep));assert.ok(fs.existsSync(file),`${name} icon target must exist`);
  assert.ok(fs.readFileSync(file).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
 }
});
