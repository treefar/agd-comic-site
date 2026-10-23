// 只整理本資料夾待審執行器；pilot原程式已另存collect-pilot01.cjs，不覆寫原raw。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const file=path.join(__dirname,'collect.cjs');let s=fs.readFileSync(file,'utf8');
function replace(oldText,newText){assert.equal(s.split(oldText).length,2,'Expected one engine fragment');s=s.replace(oldText,newText);}
replace("collector_sha256:hash(fs.readFileSync(__filename)),sampler_sha256:","collector_sha256:hash(fs.readFileSync(__filename)),domain_sha256:hash(fs.readFileSync(path.join(dir,'domain.cjs'))),sampler_sha256:");
replace("assert.equal(report.collector_sha256,hash(fs.readFileSync(__filename)));","assert.equal(report.collector_sha256,hash(fs.readFileSync(__filename)));assert.equal(report.domain_sha256,hash(fs.readFileSync(path.join(dir,'domain.cjs'))));");
replace("const texts=p=>p.evaluate(()=>Object.fromEntries(['game-hint','labor-status','labor-loads'].map(id=>[id,document.getElementById(id).textContent])));",`const texts=p=>p.evaluate(()=>Object.fromEntries([...['game-hint','labor-status','labor-loads','game-progress'].map(id=>[id,document.getElementById(id).textContent]),...[0,1,2,3,4,5].map(i=>['output:labor-start-'+i,document.querySelector('output[for="labor-start-'+i+'"]').textContent]) ]));`);
replace("await p.locator('#'+owner).scrollIntoViewIfNeeded();await p.locator('#'+owner).evaluate(","await p.locator(selector(owner)).scrollIntoViewIfNeeded();await p.locator(selector(owner)).evaluate(");
replace("selector:'#'+owner","selector:selector(owner)");
replace("n=sample.nodes.find(n=>n.owner===owner);","actualOwner=await p.locator(selector(owner)).evaluate(n=>n.dataset.layoutOwner),n=sample.nodes.find(n=>n.owner===actualOwner);");
replace("checks={full_text:reconstructed===identity[owner],","checks={full_text:d.fullTextCoverage(n.text,n.measurements,identity[owner]),");
replace("const name=`${job.lang}-${job.width}-${job.id}-${owner}`","const name=`${job.lang}-${job.width}-${job.id}-${owner.replaceAll(':','-')}`");
replace("owner,schedule:job.schedule,expected,inputs:","owner,actual_owner:actualOwner,reconstructed,raw_range_join_exact:reconstructed===identity[owner],schedule:job.schedule,expected,inputs:");
fs.writeFileSync(file,s);console.log('Prepared reviewed-engine candidate; no native full run started');
