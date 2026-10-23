// Fresh local-review receipts. Technical passes never grant publication or art approval.
const path=require('node:path'),assert=require('node:assert/strict');
const titles={'runtime-allowlist':'Runtime檔案白名單','all-runtime-http-body-sha':'全部檔案HTTP與SHA核對','server-private-path-and-real-missing-status':'私密路徑與真404／403／400','server-listens-on-loopback-only':'僅限本機連線','keyboard-pause-audio-cleanup-zh':'中文鍵盤／暫停／音效／卸載','keyboard-pause-audio-cleanup-en':'英文鍵盤／暫停／音效／卸載','keyboard-pause-audio-cleanup-ja':'日文鍵盤／暫停／音效／卸載','reduced-narration-scroll-zh':'中文減少動態與敘事捲動','reduced-narration-scroll-en':'英文減少動態與敘事捲動','reduced-narration-scroll-ja':'日文減少動態與敘事捲動','local-game-with-third-party-network-blocked':'阻擋第三方網路仍可操作','module-load-failure-has-readable-recovery':'模組故障提示與返回','real-background-visibility-evidence':'真實背景分頁暫停'};
module.exports=function(root,policy,read){
 if(!policy.hero_receipt||!policy.release_receipt)return null;
 const hpath=path.join(root,policy.hero_receipt),rpath=path.join(root,policy.release_receipt);
 const heroRaw=read(policy.hero_receipt),releaseRaw=read(policy.release_receipt);
 const heroMethod=policy.hero_verifier||'holiday-lab/reports/hero-release-20261023/independent/verify.cjs';
 const releaseMethod=policy.release_verifier||'holiday-lab/reports/hero-release-20261023/release/verify.cjs';
 assert.ok(['holiday-lab/reports/hero-release-20261023/independent/verify.cjs','holiday-lab/reports/hero-release-20261023/student-independent/verify.cjs','holiday-lab/reports/hero-release-20261023/student-independent/verify-v2.cjs','holiday-lab/reports/integrated-review-20261023/home/verify-v2.cjs'].includes(heroMethod));
 assert.ok(['holiday-lab/reports/hero-release-20261023/release/verify.cjs','holiday-lab/reports/hero-release-20261023/release-student/verify.cjs','holiday-lab/reports/integrated-review-20261023/release/verify.cjs'].includes(releaseMethod));
 read(heroMethod,false);read(releaseMethod,false);
 const hero=require(path.join(root,heroMethod)).verify(path.dirname(hpath));
 const release=require(path.join(root,releaseMethod)).verify(path.dirname(rpath));
 assert.equal(hero.pass,true);assert.equal(release.pass,true);assert.equal(hero.contexts,9);assert.equal(hero.embedded_routes,2);
 assert.equal(path.resolve(release.site),path.resolve(root,policy.local_build));assert.equal(heroRaw.base,releaseRaw.base);
 const releaseBytes=new Map(releaseRaw.source_before.map(row=>[row.path,row.sha256]));
 for(const [file,sha]of Object.entries(heroRaw.sources.before))assert.equal(releaseBytes.get(file),sha,'Hero and release receipts must describe the same build: '+file);
 assert.equal(release.public_release,false);assert.equal(release.labor_played,false);
 assert.equal(releaseRaw.checks.length,13);assert.equal(release.yes+release.no+release.unknown,13);
 return {hero,release,checks:releaseRaw.checks.map(c=>({id:c.id,title:titles[c.id]||c.id,result:c.result==='yes'?'pass':c.result==='no'?'gate_no':'unknown',scope:'本機技術補驗；不代表完整發布或美術已確認',source:policy.release_receipt}))};
};
