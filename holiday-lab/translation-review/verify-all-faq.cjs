// Reconcile both human-readable semantic batches with the final compiled maps.
const fs=require('fs'),assert=require('node:assert/strict'),vm=require('vm');
const norm=s=>s.replace(/\s+/g,' ').trim(),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const guide=read('data/students/guide.json'),first=read('holiday-lab/translation-review/followup/semantic-reviewed.json').units.filter(u=>u.id.startsWith('faq/')),last=read('holiday-lab/translation-review/faq-remainder/reviewed.json').units;
const all=[...first,...last],ids=new Set(all.map(x=>x.id)),expectedIds=guide.cards.flatMap(c=>c.faq.map((_,i)=>`faq/${c.id}/${i}`));
assert.equal(all.length,expectedIds.length);assert.equal(ids.size,all.length);for(const id of expectedIds)assert.ok(ids.has(id),id);
const patches=read('holiday-lab/translation-review/followup/exact-plan.json').changes,late=read('holiday-lab/translation-review/faq-remainder/exact-plan.json').changes;
const maps={};for(const lang of ['en','ja']){const sandbox={};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(`locale-${lang}.js`,'utf8')+`;this.messages=SITE_${lang.toUpperCase()}_MESSAGES`,sandbox);maps[lang]=sandbox.messages;}
const rows=[];for(const c of guide.cards)for(const [index,faq]of c.faq.entries()){
 const id=`faq/${c.id}/${index}`,unit=all.find(u=>u.id===id);assert.equal(unit.question.zh,faq.q);assert.equal(unit.answer.zh,faq.a);
 for(const [part,key]of [['question',faq.q],['answer',faq.a]])for(const lang of ['en','ja']){
  let expected=unit[part][lang];
  for(const patch of patches){if(!patch.file.startsWith(`data/${lang}/`))continue;const pointer=patch.pointer?.slice(1).replaceAll('~1','/').replaceAll('~0','~');if(norm(pointer||'')===norm(key)&&patch.kind==='set-json'){assert.equal(expected,patch.old,patch.id);expected=patch.new;}}
  for(const patch of late)if(patch.file.startsWith(`data/${lang}/`)&&patch.key===key){assert.equal(expected,patch.old,patch.id);expected=patch.new;}
  assert.equal(maps[lang][norm(key)],expected,`${id}/${part}/${lang}`);rows.push({id,part,lang,compiled_value_verified:true});
 }
}
const result={faq_pairs:expectedIds.length,target_strings:rows.length,unique_review_units:ids.size,pass:true,scope:'semantic review coverage and compiled values; not a fresh audit of every underlying school regulation',rows};fs.writeFileSync('holiday-lab/translation-review/all-faq-result.json',JSON.stringify(result,null,2));console.log(`FAQ_SEMANTIC_AND_COMPILED ${expectedIds.length} pairs / ${rows.length} strings PASS`);
