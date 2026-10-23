// Read-only verification. Full mode recomputes prefix DP; never rewrites proof/capture data.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),M=require('./numeric-model.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function checkRefs(root,refs){for(const r of refs){const b=fs.readFileSync(path.resolve(root,r.path));assert.equal(b.length,r.bytes,'bytes '+r.path);assert.equal(sha(b),r.sha256,'SHA '+r.path);}return refs.length;}
function checkBoundary(p){assert.equal(p.native_equivalence,false,'native equivalence must remain NO');assert.equal(p.global_approved,false,'global must remain NO');assert.equal(p.browser_or_native_run_started,false,'browser must remain unstarted');assert.equal(p.mathematical_model_proven,true);}
async function verify(full=true){
 const dir=__dirname,root=path.resolve(dir,'../../..'),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f))),p=read('proof.json'),fonts=read('font-audit.json'),r=read('representatives.json'),coverage=read('template-font-audit.json');checkBoundary(p);let refs=checkRefs(root,p.evidence_refs);
 if(fs.existsSync(path.join(dir,'freeze.json')))refs+=checkRefs(root,read('freeze.json').refs);
 for(const f of fonts.fonts){checkRefs(root,[f.font]);assert.equal(f.digits_within_advance_slots,true);assert.deepEqual(f.digit_kern_pairs,[]);assert.deepEqual(f.unsupported_kern,[]);assert.deepEqual(f.other_shaping_tables_present,[]);for(const t of ['GSUB','GPOS'])assert.deepEqual(f.tables[t].digit_references,[]);}
 assert.equal(coverage.all_covered,true);assert.equal(coverage.rows.length,90);assert.ok(coverage.rows.every(x=>x.missing.length===0));
 let classes=0,fragments=0;
 for(const group of r.groups){
  const f=fonts.fonts.find(x=>x.subfamily===group.font);assert.equal(group.font_sha256,f.font.sha256);
  const actual=M.classes(group.guard,f.digits);assert.deepEqual(actual,group.whole_numeric_run.classes);assert.deepEqual(M.bounds(actual),group.whole_numeric_run.conservative_bounds);classes+=actual.length;
  for(const fragment of group.all_contiguous_fragment_extrema){
   if(full){const rows=M.classes(group.guard,f.digits,{length:fragment.length,segment:fragment.segment});assert.equal(rows.length,fragment.exact_metric_class_count);assert.deepEqual(M.bounds(rows),fragment.bounds);}
   else for(const [field,b]of Object.entries(fragment.bounds))for(const side of ['lower','upper']){const n=b[side+'_witness'];assert.equal(M.metrics(n,f.digits,fragment.segment)[field],b[side]);assert.ok(Number(n)>=group.guard.min&&Number(n)<=group.guard.max);assert.equal(Number(n)%2,group.guard.parity);}
   fragments++;
  }
 }
 assert.equal(classes,p.counts.metric_classes);assert.equal(fragments,p.counts.fragment_bounds);
 return {pass:true,refs,groups:r.groups.length,metric_classes:classes,fragment_bounds:fragments,all_fragment_DP_recomputed:full,native_equivalence:false,global_approved:false};
}
module.exports={checkRefs,checkBoundary,verify};
if(require.main===module)verify(!process.argv.includes('--quick')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error('NO '+e.message);process.exitCode=1;});
