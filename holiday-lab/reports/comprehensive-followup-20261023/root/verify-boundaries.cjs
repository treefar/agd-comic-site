const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto'), cp=require('node:child_process'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'), original='C:/Projects/系網漫畫版_AGDComicSite';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const cOf=text=>text.match(/## C\.[\s\S]*?(?=\r?\n## )/)[0];
const current=fs.readFileSync(path.join(original,'LATEST_HANDOFF.md'),'utf8');
assert.equal(sha(cOf(current)),'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');
const main=cp.execFileSync('git',['rev-parse','origin/main'],{cwd:root,encoding:'utf8'}).trim();
assert.equal(main,'1b8322e69d84549db220d849afb1aac0fb9d7c2a');
assert.equal(sha(fs.readFileSync(path.join(root,'holiday-lab/layout-qa/layout-report.json'))),'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336');
const staged=cp.execFileSync('git',['diff','--cached','--name-status','--no-renames'],{cwd:root,encoding:'utf8'});
assert.ok(!staged.split('\n').some(s=>s.startsWith('D\t')));
console.log(JSON.stringify({pass:true,c_sha256:sha(cOf(current)),origin_main:main,canonical_R0_unchanged:true,staged_deletions:0,
  scope:'Local tracked boundaries only; no claim about remote changes or external source availability'},null,2));
