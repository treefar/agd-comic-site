const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=__dirname,c=JSON.parse(fs.readFileSync(path.join(root,'coverage.json'),'utf8'));
let n=0;function yes(label,test){assert.ok(test,label);console.log('YES '+label);n++;}
yes('105 captured states',c.pages.length===105);
yes('all inspected Han/kana character-node pairs have cmap evidence',c.counts.positions===c.counts.cmap_verified);
yes('no unverified platform font coverage',c.unknown.length===0);
yes('no missing glyph candidate in bounded corpus',c.missing_candidates.length===0);
yes('zero font parse errors',c.font_parse_errors.length===0);
const sources=JSON.parse(fs.readFileSync(path.join(root,'evidence/run-manifest.json'),'utf8'));
yes('selected raw scan receipts have zero JS sampling errors',sources.filter(s=>s.selected).every(s=>s.errors.length===0));
const corpus=JSON.parse(fs.readFileSync(path.join(root,'evidence/corpus.json'),'utf8'));let pairs=0,nodes=0;const chars=new Set();for(const p of corpus.pages)for(const row of p.texts){nodes++;const set=new Set([...row[0]].filter(c=>{const cp=c.codePointAt(0);return(cp>=0x3040&&cp<=0x30ff)||(cp>=0x3400&&cp<=0x9fff)||(cp>=0xf900&&cp<=0xfaff)||(cp>=0x20000&&cp<=0x323af)}));pairs+=set.size;for(const c of set)chars.add(c);}
yes('compact actual text corpus independently reproduces all coverage totals',corpus.pages.length===105&&pairs===c.counts.positions&&nodes===c.counts.text_nodes&&chars.size===c.counts.unique_cjk_characters);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence/manifest.json'),'utf8'));
yes('six representative WebP evidence files with matching SHA',manifest.length===6&&manifest.every(e=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'evidence',e.output))).digest('hex')===e.output_sha256));
console.log('RESULT '+n+' YES / 0 NO');console.log('NOT VERIFIED: all individual detail routes, later game states, every screenshot visually read, mobile full guide, emoji and non-CJK glyph coverage, cross-platform, final build.');
