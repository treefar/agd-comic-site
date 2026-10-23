// Preserve the approved packet and byte preimages before changing any translation.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,main='C:/agywork/agd-holiday-prototypes',packetFile=main+'/holiday-lab/reports/comprehensive-audit-20261023/translation-candidates.json';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.ok(!fs.existsSync(path.join(dir,'input.json')),'Do not overwrite the original preimage');
const packetBytes=fs.readFileSync(packetFile),packet=JSON.parse(packetBytes),approved=packet.rows.filter(r=>r.direct_semantic_subset);
assert.equal(approved.length,12);
const allowed=new Set(['data/ja/messages.json','data/ja/step-details.json','data/en/student-guide-ui.json','data/en/step-details-ui.json']);
assert.deepEqual(new Set(approved.flatMap(r=>r.definitions.map(d=>d.file))),allowed);
fs.writeFileSync(path.join(dir,'input.json'),packetBytes);
const rows=[];
for(const source of packet.sources){
 const fresh=fs.readFileSync(source.file),original=fs.readFileSync(path.join(main,source.file));
 assert.equal(sha(original),source.current,'Main must still equal audited input '+source.file);
 const equalBefore=sha(fresh)===source.current;
 if(!equalBefore){
  assert.equal(fresh.toString('utf8').replace(/\r\n/g,'\n'),original.toString('utf8').replace(/\r\n/g,'\n'),'Only CRLF byte differences may be aligned '+source.file);
  const saved=path.join(dir,'checkout-before',source.file);fs.mkdirSync(path.dirname(saved),{recursive:true});fs.writeFileSync(saved,fresh);
  fs.copyFileSync(path.join(main,source.file),source.file);
 }
 assert.equal(sha(fs.readFileSync(source.file)),source.current);
 rows.push({file:source.file,checkout_sha256:sha(fresh),input_sha256:source.current,byte_aligned:!equalBefore});
}
for(const file of [...allowed,'locale-en.js','locale-ja.js']){
 const saved=path.join(dir,'preimage',file);fs.mkdirSync(path.dirname(saved),{recursive:true});fs.copyFileSync(file,saved);
}
fs.writeFileSync(path.join(dir,'preparation.json'),JSON.stringify({packet:packetFile,packet_sha256:sha(packetBytes),sources:rows,approved:approved.map(r=>({id:r.id,lang:r.lang})),product_semantics_changed:false},null,2));
console.log(`PREPARE sourceSHA ${rows.length}/${rows.length}; CRLF-only aligned${rows.filter(r=>r.byte_aligned).length}; approved12; preimage6`);
