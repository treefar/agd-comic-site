// Read-only byte references. Receipt claims and currently readable bytes are separate types.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function bound(root,file){
 if(typeof file!=='string'||!file||path.isAbsolute(file)||/^[A-Za-z]:|\\/.test(file))throw Error('invalid path');
 const resolved=path.resolve(root,file),relative=path.relative(path.resolve(root),resolved);
 if(relative==='..'||relative.startsWith('..'+path.sep))throw Error('path outside root');
 const real=fs.realpathSync(resolved),base=fs.realpathSync(root),rel=path.relative(base,real);
 if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw Error('real path outside root');
 if(!fs.statSync(real).isFile())throw Error('path is not a file');
 return real;
}
function reference(root,file){const b=fs.readFileSync(bound(root,file));return {path:file,bytes:b.length,sha256:sha(b)};}
function verifyRef(root,ref){if(!ref||!/^[a-f0-9]{64}$/.test(ref.sha256)||!Number.isSafeInteger(ref.bytes))throw Error('invalid SHA/bytes reference');const actual=reference(root,ref.path);if(actual.sha256!==ref.sha256)throw Error('SHA mismatch: '+ref.path);if(actual.bytes!==ref.bytes)throw Error('bytes mismatch: '+ref.path);return actual;}
function compareIdentities(rows){const seen=new Set();return rows.map(r=>{if(!r.file||seen.has(r.file))throw Error('duplicate or empty input');seen.add(r.file);return {...r,current_equals_snapshot:r.current!=null&&r.snapshot!=null&&r.current===r.snapshot,current_equals_served:r.current!=null&&r.served!=null&&r.current===r.served,served_equals_snapshot:r.served!=null&&r.snapshot!=null&&r.served===r.snapshot};});}
function verifyLedger(root,l){
 if(l.type!=='source-bound-typed-ledger-v1'||l.global_approved!==false)throw Error('ledger type/global gate');
 const receipt=JSON.parse(fs.readFileSync(bound(root,l.original_receipt.path)));verifyRef(root,l.original_receipt);
 const seen=new Set();let references=0;
 for(const row of l.inputs){
  if(seen.has(row.file))throw Error('duplicate input');seen.add(row.file);
  if(row.original.type!=='receipt-claim'||row.original.sha256!==receipt.source_fingerprints[row.file])throw Error('source mismatch: '+row.file);
  if(row.current.type!=='readable-bytes'||row.current.ref.path!==row.file)throw Error('current source path mismatch');
  verifyRef(root,row.current.ref);references++;
  if(row.served.type==='historical-http-receipt'){
   const old=receipt.files.find(x=>x.file===row.file);
   if(!old||row.served.sha256!==old.served_sha256||row.served.base!==receipt.base)throw Error('served source mismatch');
   const expected=path.relative(root,path.join(receipt.build,row.file)).replaceAll('\\','/');
   if(row.served.build_ref.path!==expected)throw Error('served source path mismatch');
   verifyRef(root,row.served.build_ref);references++;
   if(row.served.build_ref.sha256!==row.served.sha256)throw Error('build/served SHA mismatch');
  }else if(row.served.type!=='no-same-path-output')throw Error('served type');
 }
 if(seen.size!==Object.keys(receipt.source_fingerprints).length)throw Error('missing input');
 for(const ref of l.evidence_refs||[]){verifyRef(root,ref);references++;}
 return {pass:true,inputs:seen.size,references,global_approved:false,historical_http_receipts_replayed:false};
}
module.exports={sha,bound,reference,verifyRef,compareIdentities,verifyLedger};
if(require.main===module){try{const root=path.resolve(__dirname,'../../..'),l=JSON.parse(fs.readFileSync(path.join(__dirname,'ledger.json')));console.log(JSON.stringify(verifyLedger(root,l),null,2));}catch(e){console.error('NO '+e.message);process.exitCode=1;}}
