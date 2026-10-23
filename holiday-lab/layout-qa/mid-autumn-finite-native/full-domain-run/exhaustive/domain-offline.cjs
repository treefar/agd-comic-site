// Independent domain formula from AST, no network and no game imports.
const fs=require('fs'),assert=require('assert/strict'),path=require('path'),{independentlyDerive}=require('../verify.cjs'),C=require('./core.cjs');
function load(manifest){const source=fs.readFileSync(manifest.domain.source_file,'utf8');assert.equal(C.sha(source),manifest.domain.moduleSHA);assert.equal(C.smallHash(manifest.domain.sorted_file),manifest.domain.sorted_file_sha256);const d=independentlyDerive(source);assert.equal(d.ordered.length,C.TOTAL);assert.equal(C.sha(d.ordered.map(t=>t.key).join('\n')),manifest.domain.tupleSetSHA);return{...d,text:(t,lang)=>{const l=d.literals[lang],v=t.tokens;return l[0]+v[0]+l[1]+v[1]+l[2]+v[2]+l[3];}};}
module.exports={load};
