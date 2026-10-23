const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const from=path.join(__dirname,'../static-error-max-3/check.cjs');let s=fs.readFileSync(from,'utf8');
const a=s.indexOf('const config='),b=s.indexOf('\nconst {staticCatalog',a);assert.ok(a>0&&b>a);
s=s.slice(0,a)+"const config=[{game:'new-year',run:'2026-10-23T00-02-29-772Z',variable:'feedback',excluded:['invalid'],secondary:'ny-observation'}];"+s.slice(b);
const line=s.indexOf('console.log(`FINITE_CANDIDATES '),end=s.indexOf('\n',line);assert.ok(line>0&&end>line);
s=s.slice(0,line)+"console.log(`FINITE_CANDIDATES ${result.all_finite_candidates_proven?'YES':'NO'}; contexts ${result.canonical_candidates.filter(c=>c.finite_coverage_pass).length}/6; no product changed`);"+s.slice(end);
fs.writeFileSync(path.join(__dirname,'check.cjs'),s);
fs.writeFileSync(path.join(__dirname,'method-origin.json'),JSON.stringify({source:from,sha256:crypto.createHash('sha256').update(fs.readFileSync(from)).digest('hex'),changes:['single new-year config with exact secondary','console context denominator6'],sampler_changes:0,product_writes:0},null,2));console.log('READY New Year finite error check; full original case/images/guards retained');
