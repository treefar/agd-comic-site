// Whole generated dictionaries must equal the fixed pre-change dictionaries plus 49 reviewed values.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const baseline='94ed07e7ce456cbbd48f025a9a44660ab8780bbc',read=f=>fs.readFileSync(f,'utf8'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function dict(s,lang){const c={};vm.runInNewContext(s+`;this.m=SITE_${lang.toUpperCase()}_MESSAGES;`,c);return JSON.parse(JSON.stringify(c.m));}
const ja=JSON.parse(read('holiday-lab/translation-review/ja-guide-terms-applied/plan.json')),en=JSON.parse(read('holiday-lab/translation-review/en-guide-terms-applied/exact-plan.json')).operations;
const counts={};
for(const[lang,ops]of [['ja',ja],['en',en]]){
 const before=dict(execFileSync('git',['show',baseline+':locale-'+lang+'.js'],{encoding:'utf8',maxBuffer:10e6}),lang),expected=structuredClone(before),current=dict(read('locale-'+lang+'.js'),lang);
 for(const op of ops){assert.equal(before[op.key],op.current??op.old,lang+' old key');expected[op.key]=op.proposed??op.new;}
 assert.deepEqual(current,expected,lang+' entire generated dictionary');
 counts[lang]=Object.keys(current).filter(k=>current[k]!==before[k]).length;
}
assert.deepEqual(counts,{ja:20,en:29});
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function compare(a,b){const files=walk(a).map(f=>path.relative(a,f)),next=walk(b).map(f=>path.relative(b,f));assert.deepEqual(files,next);return {files:files.length,changed:files.filter(f=>!fs.readFileSync(path.join(a,f)).equals(fs.readFileSync(path.join(b,f))))};}
const delta09_10=compare('.measure-integrated-09/holiday-lab','.measure-integrated-10/holiday-lab'),delta10_11=compare('.measure-integrated-10/holiday-lab','.measure-integrated-11/holiday-lab');
assert.deepEqual(delta09_10.changed.map(f=>f.replaceAll('\\','/')),['games/new-year.mjs']);assert.equal(delta10_11.changed.length,0);
const old=read('.measure-integrated-09/holiday-lab/games/new-year.mjs'),next=read('.measure-integrated-10/holiday-lab/games/new-year.mjs');
const from="W('俐落跨門','A quick leap','軽やかに越える')",to="W('俐落跨門','A quick leap','軽く跳ぶ')";
assert.equal(old.split(from).length-1,1);assert.equal(next,old.replace(from,to));
const report={source_agent:'codex',pass:true,baseline,generated_values_changed:counts,all_other_generated_values_equal:true,
 runtime09_to10:{...delta09_10,scope:'Only one Japanese scene0 focus string; full source equality after exact replacement.'},
 runtime10_to11:delta10_11,game_runtime_unchanged_by_guide_terms:true,locale_sha256:Object.fromEntries(['en','ja'].map(l=>[l,sha(fs.readFileSync('locale-'+l+'.js'))])),
 full_project_layout_approved:false};
fs.writeFileSync('holiday-lab/translation-review/guide-terms11-integration.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
