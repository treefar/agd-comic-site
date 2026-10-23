const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),P=require('./provenance.cjs');
test('every declared input is unique and exact original/current/served identities stay separate',()=>{const s=[{file:'a',snapshot:'old',current:'new',served:'old'}];assert.deepEqual(P.compareIdentities(s)[0],{...s[0],current_equals_snapshot:false,current_equals_served:false,served_equals_snapshot:true});assert.throws(()=>P.compareIdentities([...s,...s]),/duplicate/);});
test('bound paths reject traversal, wrong bytes and falsely relabeled source',()=>{const dir=path.join(__dirname,'tests-data',crypto.randomUUID());fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'input.txt'),'原文\n');const ref=P.reference(dir,'input.txt');assert.equal(P.verifyRef(dir,ref).sha256,ref.sha256);assert.throws(()=>P.verifyRef(dir,{...ref,path:'../input.txt'}),/path/);assert.throws(()=>P.verifyRef(dir,{...ref,sha256:'0'.repeat(64)}),/SHA/);fs.writeFileSync(path.join(dir,'other.txt'),'different');assert.throws(()=>P.verifyRef(dir,{...ref,path:'other.txt'}),/SHA|bytes/);});
test('served source identity rejects a same-byte unrelated file, missing source and original mismatch',()=>{
 const dir=path.join(__dirname,'tests-data',crypto.randomUUID());fs.mkdirSync(path.join(dir,'build'),{recursive:true});
 for(const f of ['a','unrelated','build/a'])fs.writeFileSync(path.join(dir,f),'same bytes');
 const digest=P.reference(dir,'a').sha256;
 const receipt={build:path.join(dir,'build'),base:'http://historical.invalid',source_fingerprints:{a:digest},files:[{file:'a',served_sha256:digest}]};
 fs.writeFileSync(path.join(dir,'receipt.json'),JSON.stringify(receipt));
 const l={type:'source-bound-typed-ledger-v1',global_approved:false,original_receipt:P.reference(dir,'receipt.json'),inputs:[{file:'a',original:{type:'receipt-claim',sha256:digest},current:{type:'readable-bytes',ref:P.reference(dir,'a')},served:{type:'historical-http-receipt',sha256:digest,base:receipt.base,build_ref:P.reference(dir,'build/a')}}]};
 assert.equal(P.verifyLedger(dir,l).pass,true);
 const changed=structuredClone(l);changed.inputs[0].served.build_ref=P.reference(dir,'unrelated');assert.throws(()=>P.verifyLedger(dir,changed),/served.*path/);
 const missing=structuredClone(l);missing.inputs[0].current.ref.path='missing';assert.throws(()=>P.verifyLedger(dir,missing),/path|ENOENT/);
 assert.throws(()=>P.verifyRef(dir,{...P.reference(dir,'a'),path:'missing'}),/ENOENT/);
 const original=structuredClone(l);original.inputs[0].original.sha256='0'.repeat(64);assert.throws(()=>P.verifyLedger(dir,original),/source mismatch/);
});
