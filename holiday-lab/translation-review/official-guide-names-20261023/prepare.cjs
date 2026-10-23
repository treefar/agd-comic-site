const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=process.cwd(),out=__dirname;fs.mkdirSync(out,{recursive:true});
const sh=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const from='C:/agywork/agd-holiday-prototypes/holiday-lab/translation-review/proper-names-research-20261023/';
for(const [src,dst]of [['comparison.json','input-comparison.json'],['REPORT.md','input-REPORT.md']])fs.copyFileSync(from+src,path.join(out,dst));
const names=JSON.parse(fs.readFileSync(from+'comparison.json')).rows.filter(r=>r.review.candidate_as_name_change_supported===true);
assert.equal(names.length,12);const prior=JSON.parse(fs.readFileSync('holiday-lab/translation-review/plain-copy-20261023/input.json'));
const dirty=cp.execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean).filter(x=>!x.includes('official-guide-names-20261023')).map(x=>x.slice(3));
const files=[...new Set([...prior.sources.map(x=>x.file),...names.flatMap(r=>r.definitions.map(d=>d.file)),'student-guide.css','holiday-lab/build-review.mjs',...dirty])];
const snapshot=[];for(const file of files){assert(fs.existsSync(file),file);const dest=path.join(out,'preimage',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(file,dest);snapshot.push({file,sha256:sh(file),bytes:fs.statSync(file).size,dirty_at_start:dirty.includes(file)});}
const repl=[];
for(const row of names){const fromName=row.lang==='ja'?'技能士資格':(row.current.includes('Student Life Guidance Section')?'Student Life Guidance Section':row.current.includes('Student Life Guidance')?'Student Life Guidance':'Student Assistance Division');
const toName=row.lang==='ja'?'「技術士證」（台湾の技能検定資格）':'Student Assistance Section';
assert.equal(row.current.split(fromName).length-1,1,row.id+' single name');assert.equal(row.current.replace(fromName,toName),row.candidate,row.id+' name only');
for(const d of row.definitions){let obj=JSON.parse(fs.readFileSync(d.file));for(const k of d.pointer.split('/').slice(1))obj=obj[k.replace(/~1/g,'/').replace(/~0/g,'~')];assert.equal(obj,d.expected_raw,row.id+' preimage');}
repl.push({id:row.id,lang:row.lang,key:row.key,fromName,toName,definitions:row.definitions,expected:row.candidate,source_ids:row.review.primary_sources,scope:row.review.implementation_scope});}
fs.writeFileSync(path.join(out,'plan.json'),JSON.stringify(repl,null,2)+'\n');
fs.writeFileSync(path.join(out,'baseline.json'),JSON.stringify({head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),input_comparison_sha256:sh(from+'comparison.json'),input_report_sha256:sh(from+'REPORT.md'),dirty,files:snapshot,approved_name_count:repl.length,prior_semantic_count:prior.rows.filter(r=>r.direct_semantic_subset).length},null,2)+'\n');
console.log(JSON.stringify({head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),approved_names:repl.length,files:snapshot.length,dirty_preserved:dirty},null,2));

