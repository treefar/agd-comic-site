const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('locale-en.js','utf8')+';this.en=SITE_EN_MESSAGES;',ctx);vm.runInContext(fs.readFileSync('locale-ja.js','utf8')+';this.ja=SITE_JA_MESSAGES;',ctx);
const keys=new Set(Object.keys(ctx.en));const collect=x=>{if(typeof x==='string'&&/[㐀-鿿]/.test(x)&&!/^https?:|^mailto:/.test(x))keys.add(x.replace(/\s+/g,' ').trim());else if(Array.isArray(x))x.forEach(collect);else if(x&&typeof x==='object')Object.values(x).forEach(collect);};
for(const file of fs.readdirSync('data').filter(x=>x.endsWith('.json')))collect(JSON.parse(fs.readFileSync('data/'+file)));collect(JSON.parse(fs.readFileSync('data/students/guide.json')));
const digits=s=>{const values=s.normalize('NFKC').match(/\d+(?:[.,]\d+)*/g)||[],counts={};for(const value of values){const n=value.replaceAll(',','');counts[n]=(counts[n]||0)+1;}return counts;};
const englishClassifiers=new Set(['話','位','間','張','件','屆','題']);
const resolutions=fs.existsSync('docs/qa/japanese/numeric-resolutions.json')?JSON.parse(fs.readFileSync('docs/qa/japanese/numeric-resolutions.json')).resolutions:[];
const results={expectedKeys:keys.size,languages:{},englishClassifiers:[...englishClassifiers],review:[]};
for(const lang of ['en','ja']){const messages=ctx[lang],missing=[...keys].filter(k=>typeof messages[k]!=='string'||(!messages[k].trim()&&!(lang==='en'&&englishClassifiers.has(k))));assert.deepEqual(missing,[],lang+' missing translations');
const numericReview=[],shortReview=[];for(const key of keys){const original=digits(key),target=digits(messages[key]),lost=Object.entries(original).filter(([n,count])=>(target[n]||0)<count).map(([n])=>n);if(lost.length)numericReview.push({zh:key,translated:messages[key],lost});if(key.length>80&&messages[key].length<key.length*.35)shortReview.push({zh:key,translated:messages[key]});}
const unresolvedNumeric=numericReview.filter(row=>!resolutions.some(r=>r.language===lang&&r.zh===row.zh&&r.translated===row.translated&&r.resolved&&r.reason));
results.languages[lang]={messages:Object.keys(messages).length,missing,numericReview,unresolvedNumeric,shortReview};
}
fs.mkdirSync('docs/qa/japanese',{recursive:true});fs.writeFileSync('docs/qa/japanese/catalog-audit.json',JSON.stringify(results,null,2));console.log('EXACT COVERAGE',results.expectedKeys,'keys');for(const[lang,r]of Object.entries(results.languages)){console.log(lang,'missing',r.missing.length,'unresolved numeric',r.unresolvedNumeric.length,'short-paragraph review',r.shortReview.length);assert.equal(r.unresolvedNumeric.length,0,lang+' unresolved numeric changes');assert.equal(r.shortReview.length,0,lang+' paragraphs require review');}
