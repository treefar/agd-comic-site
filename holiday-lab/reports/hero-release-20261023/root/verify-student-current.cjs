// Read-only integration recheck: independently saved receipts plus actual frozen bytes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=path.resolve(__dirname,'../../../..');
function verify(site,heroDir,releaseDir){
 const hero=require('../student-independent/verify-v2.cjs').verify(path.resolve(heroDir));
 const release=require('../release-student/verify.cjs').verify(path.resolve(releaseDir));
 assert.equal(hero.pass,true);assert.equal(hero.contexts,9);assert.equal(hero.demo_contexts,9);assert.equal(hero.embedded_routes,2);
 assert.equal(release.pass,true);assert.equal(path.resolve(release.site),path.resolve(site));
 const heroRaw=JSON.parse(fs.readFileSync(path.join(heroDir,'result.json'))),releaseRaw=JSON.parse(fs.readFileSync(path.join(releaseDir,'result.json')));
 assert.equal(heroRaw.base,releaseRaw.base);
 const releaseBytes=new Map(releaseRaw.source_before.map(row=>[row.path,row.sha256]));
 for(const [file,hash]of Object.entries(heroRaw.sources.before))assert.equal(releaseBytes.get(file),hash,file+' cross-receipt byte mismatch');
 const build=require('./check-site-build.cjs').check(root,path.resolve(site));assert.equal(build.pass,true);
 const baseline=path.join(root,'.measure-ui-polish-20261023-03','holiday-lab');
 const runtime=[];
 function walk(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=prefix+entry.name;if(entry.isDirectory())walk(path.join(dir,entry.name),p+'/');else runtime.push(p);}}
 walk(baseline);
 for(const file of runtime)assert.equal(sha(fs.readFileSync(path.join(baseline,file))),sha(fs.readFileSync(path.join(path.resolve(site),'holiday-lab',file))),file+' changed beyond student demonstration');
 const original='C:/Projects/系網漫畫版_AGDComicSite',handoff=fs.readFileSync(path.join(original,'LATEST_HANDOFF.md'),'utf8');
 const section=handoff.match(/## C\.[\s\S]*?(?=\r?\n## )/);assert.ok(section);
 const cSha=sha(Buffer.from(section[0]));assert.equal(cSha,'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');
 const refs=[root,original].map(cwd=>({root:cwd,branch:cp.execFileSync('git',['branch','--show-current'],{cwd,encoding:'utf8'}).trim(),main:cp.execFileSync('git',['rev-parse','origin/main'],{cwd,encoding:'utf8'}).trim()}));
 for(const ref of refs){assert.notEqual(ref.branch,'main');assert.equal(ref.main,'1b8322e69d84549db220d849afb1aac0fb9d7c2a');}
 const layoutReport=sha(fs.readFileSync(path.join(root,'holiday-lab/layout-qa/layout-report.json')));
 assert.equal(layoutReport,'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336');
 return {pass:true,site:path.resolve(site),hero,release,build,unchanged_existing_lab_runtime:runtime.length,c_section_sha256:cSha,unmodified_layout_report_sha256:layoutReport,refs,public_release:false,labor_played:false,full_project_approved:false,scope:'Student-work homepage and separate curation demo; legacy games retain byte identity, their full UI release gate remains unapproved'};
}
module.exports={verify};
if(require.main===module){try{console.log(JSON.stringify(verify(...process.argv.slice(2)),null,2));}catch(e){console.error(e.stack);process.exitCode=1;}}
