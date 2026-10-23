// Offline evidence inventory only. Writes stay inside this audit directory.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const file='holiday-lab/translation-review/independent-language-recheck-20261023/findings.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=JSON.parse(fs.readFileSync(file));
const receipts=Object.entries(packet.source_receipts.before).map(([file,expected])=>({file,expected,current:sha(file),matches:sha(file)===expected}));
const pointer=(obj,p)=>p.split('/').slice(1).reduce((a,k)=>a[k.replace(/~1/g,'/').replace(/~0/g,'~')],obj);
const rows=packet.value_rows.map(row=>{
 const kind=row.id.startsWith('PROGRAM-')?'program-wording':row.id.startsWith('JA-QUALIFICATION-')?'qualification-original-name':row.id.startsWith('EN-STUDENT-ASSISTANCE-')?'office-name':'semantic-only';
 const definitions=row.source_file_definitions.map(d=>({file:d.file,pointer:d.pointer,sha256:sha(d.file),raw_matches:pointer(JSON.parse(fs.readFileSync(d.file)),d.pointer)===d.raw,expected_raw:d.raw}));
 return {id:row.id,lang:row.lang,key:row.key,priority:row.priority,kind,direct_semantic_subset:kind==='semantic-only',current:row.current_value,candidate:row.independent_proposal,decision:row.decision,reason:row.reason,definitions,canonical_locations:row.canonical_locations,source_urls:row.source_urls};
});
assert.equal(rows.length,28);assert.equal(new Set(rows.map(r=>r.key)).size,26);
assert.ok(receipts.every(r=>r.matches),'Current source drift must not be silently adopted');
assert.ok(rows.every(r=>r.definitions.every(d=>d.raw_matches)),'Every JSON pointer must still match the reviewed original');
assert.equal(rows.filter(r=>r.direct_semantic_subset).length,12);
const report={created_at:new Date().toISOString(),scope:'offline exact-source precheck; no translation applied or browser run',candidate_file:file,candidate_sha256:sha(file),sources:receipts,rows,counts:{keys:26,values:28,semantic_only:12,office_name:10,program_wording:4,qualification_original_name:2},source_files_stable_after:receipts.every(r=>sha(r.file)===r.current),product_written:false};
fs.writeFileSync(path.join(out,'translation-candidates.json'),JSON.stringify(report,null,2));
const message=`TRANSLATION_PRECHECK sources ${receipts.filter(r=>r.matches).length}/${receipts.length}; pointers ${rows.flatMap(r=>r.definitions).filter(d=>d.raw_matches).length}/${rows.flatMap(r=>r.definitions).length}; keys26 values28 semantic12 office10 program4 qualification2; productWrites0`;
fs.writeFileSync(path.join(out,'translation-output.txt'),message+'\n');console.log(message);
