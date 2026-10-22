const fs=require('node:fs'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const original='C:/Projects/系網漫畫版_AGDComicSite',file='docs/qa/japanese/baseline-guards.json';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const ref=(cwd,name)=>{const r=require('node:child_process').spawnSync('git',['rev-parse','--verify',name],{cwd,encoding:'utf8'});return r.status===0?r.stdout.trim():null;};
const handoff=fs.readFileSync(original+'/LATEST_HANDOFF.md','utf8'),c=handoff.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0];if(!c)throw Error('C section not found');
const actual={cSection:sha(c),guideData:sha(fs.readFileSync('data/students/guide.json')),styles:sha(fs.readFileSync('styles.css')),main:ref(process.cwd(),'refs/heads/main'),remoteMain:git(process.cwd(),'rev-parse','origin/main'),originalBranch:git(original,'branch','--show-current'),originalMain:ref(original,'refs/heads/main')};
fs.mkdirSync('docs/qa/japanese',{recursive:true});if(!fs.existsSync(file)){fs.writeFileSync(file,JSON.stringify(actual,null,2));console.log('BASELINE SAVED',actual);}else{const assert=require('node:assert/strict'),expected=JSON.parse(fs.readFileSync(file));const {guideData:beforeHash,...protectedExpected}=expected,{guideData:afterHash,...protectedActual}=actual;assert.deepEqual(protectedActual,protectedExpected);
// The user explicitly requested new step explanations. All previous guide fields remain protected.
const before=JSON.parse(fs.readFileSync('docs/qa/japanese/guide-before-details.json')),after=JSON.parse(fs.readFileSync('data/students/guide.json'));
const {cards:beforeCards,sources:beforeSources,...beforeMeta}=before,{cards:afterCards,sources:afterSources,...afterMeta}=after;assert.deepEqual(afterMeta,beforeMeta);assert.equal(afterCards.length,beforeCards.length);
const amendments=fs.existsSync('docs/qa/japanese/flow-review-amendments.json')?JSON.parse(fs.readFileSync('docs/qa/japanese/flow-review-amendments.json')):{};
assert.ok(Object.keys(amendments).every(id=>['credit-transfer','status-military','support-rights'].includes(id)));
beforeCards.forEach((card,i)=>{const{source_ids:oldRefs,...oldFields}=card,{source_ids:newRefs,step_details,flow,flow_type,flow_note,related_news,...newFields}=afterCards[i];const change=amendments[card.id]||{};assert.ok(Object.keys(change.fields||{}).every(key=>['steps','faq'].includes(key)));assert.deepEqual(newFields,{...oldFields,...change.fields});assert.ok(oldRefs.every(id=>newRefs.includes(id)||(change.removedSourceIds||[]).includes(id)));});beforeSources.forEach(s=>assert.deepEqual(afterSources.find(x=>x.id===s.id),s));
console.log('PASS unchanged C section, original Chinese fields/styles and main refs; added guide explanations authorized',beforeHash!==afterHash);
}
