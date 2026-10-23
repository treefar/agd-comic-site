const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),V=require('./verify.cjs');
test('source binding rejects changed bytes, missing files and boundary overclaims',()=>{
 const dir=fs.mkdtempSync(path.join(__dirname,'ref-fixture-')),file=path.join(dir,'source.txt');fs.writeFileSync(file,'actual');const ref={path:'source.txt',bytes:6,sha256:crypto.createHash('sha256').update('actual').digest('hex')};
 assert.equal(V.checkRefs(dir,[ref]),1);assert.throws(()=>V.checkRefs(dir,[{...ref,sha256:'0'.repeat(64)}]),/SHA/);assert.throws(()=>V.checkRefs(dir,[{...ref,path:'missing'}]),/ENOENT/);
 assert.throws(()=>V.checkBoundary({mathematical_model_proven:true,native_equivalence:true,global_approved:false,browser_or_native_run_started:false}),/native/);
});
