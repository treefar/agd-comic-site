const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
process.chdir(path.resolve(__dirname,'../../..'));const dir='holiday-lab/reports/original-home-20261024',site='.measure-original-home-20261024-04';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name).replaceAll('\\','/')]);
async function main(){
 for(const f of ['browser-r4','navigation-guide','curation-entry'])assert.deepEqual(read(dir+'/'+f+'.json').failures,[],f);assert.equal(read(dir+'/curation-completion.json').pass,true);assert.equal(read(dir+'/english-overlap-green.json').pass,true);assert.equal(read(dir+'/english-overlap-red.json').overlap,true);
 for(const tag of ['build-r4','green-build-r4'])assert.equal(read(dir+'/'+tag+'-command.json').exit_code,0);
 const before=read(dir+'/before.json');let raw=fs.readFileSync('chapters-1.jsx','utf8');const start=raw.indexOf('        {/* TIER 1'),end=raw.indexOf('        {/* TIER 2');let splash=raw.slice(start,end).replace('tier-1-1 tier-splash hero-original-tier"','tier-1-1 tier-splash"').replace('<h1 id="hero-title" className="h-display h-jojo"','<div className="h-display h-jojo"').replace('fontSize: "clamp(72px, 10vw, 140px)", margin: "10px 0 0"','fontSize: "clamp(72px, 10vw, 140px)", marginTop: 10').replace('<div className="hero-original-copy" style=','<div style=').replace('</h1>','</div>').replaceAll('\r\n','\n');assert.equal(splash,before.original_tier,'Original splash plus only semantic/scoping adaptations');
 const html=fs.readFileSync(site+'/index.html','utf8'),bundle=html.match(/src="(app-[^"]+\.js)"/)[1],paths=['/','/'+bundle,'/holiday-home.css','/holiday-lab/student-curation.html','/holiday-lab/student-curation.mjs','/holiday-lab/index.html'];const results=[];
 for(const p of paths){const r=await fetch('http://127.0.0.1:8887'+p),b=Buffer.from(await r.arrayBuffer());results.push({path:p,status:r.status,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});}
 assert.deepEqual(results.map(x=>x.status),[200,200,200,200,200,404]);assert.equal(results[0].sha256,hash(site+'/index.html'));assert.equal(results[1].sha256,hash(site+'/'+bundle));assert.equal(results[2].sha256,hash('holiday-home.css'));
 fs.writeFileSync(dir+'/http.json',JSON.stringify({observed_utc:new Date().toISOString(),method:'Node fetch',exit_code:0,results},null,2)+'\n');
 fs.writeFileSync(dir+'/user-scope.json',JSON.stringify({observed_utc:new Date().toISOString(),source:'2026-10-24 user reply in this chat',original_home_requested:true,new_en_ja_and_guide_retained:true,game_scope:'先放學生作品策展示範，節日遊戲繼續暫緩（建議）',full_new_visual_approved:false,public_release_authorized:false},null,2)+'\n');
 const old=read('holiday-lab/reports/no-game-review-20261024/verification.json');const s={...old,observed_utc:new Date().toISOString(),site,port:8887,baseline_site:old.site,baseline_note:'使用者要求恢復原漫畫首頁，保留最新英日／指南，並確認頁底只放既有學生作品策展示範，節日繼續暫緩。最新r4由主控驗證；未修改官方規定、字典、教師照片或原遊戲。'};
 for(const c of s.checks)c.reason='8887未重驗此全項，保留明列前版證據。 '+c.reason;
 const set=(id,reason,evidence,title)=>{const c=s.checks.find(x=>x.id===id);Object.assign(c,{reason,evidence});if(title)c.title=title;};
 const ui=[dir+'/browser-r4.json',dir+'/navigation-guide.json',dir+'/curation-entry.json'];
 set('page-bottom','使用者本次確認頁底只放學生作品策展示範。六組三語雙寬驗招生→策展→頁尾順序，首屏無策展控制／iframe；三語入口實際開啟，日文完成一輪策展。節日與Flora／胖倉鼠不開放。',ui,'學生作品策展放招生後、頁尾前');
 set('style','恢復既存origin/main的原漫畫splash：集中線、大字、跳動泡泡與PRESS START；未checkout或修改main。復原內容只加h1語意與CSS範圍class，反向逐字比對原tier相同。原畫顯示contain並保留小颯署名，未改圖。',[dir+'/finalize-command.json',dir+'/browser-r4.json',dir+'/green-build-r4-command.json']);
 set('shared-layout','8887六組三語雙寬主控檢查原首頁共同介面；既有完整外文翻譯與指南資料SHA保持。不是新全站逐頁翻譯驗收。',ui);
 set('desktop-nav','8887桌面三語完整導覽與指南路徑均存在；本次實際點PRESS START至消息、指南入口至15卡。其他桌面斷點沿用前版限定收據。',ui);
 set('mobile-nav','8887三語390px實際展開手機選單、點指南、確認自動收合；15卡及47說明，1欄無頁面橫溢。',[dir+'/navigation-guide.json']);
 set('guide-index','8887三語×1440/390開啟指南；每組15卡／47步小說明，桌面3欄、手機1欄，FAQ保留。既有指南及所有外文字典SHA相同，未重研規章。',[dir+'/navigation-guide.json',dir+'/green-build-r4-command.json']);
 set('art-original','小颯原圖SHA保持，改回原首頁下方原畫格，以contain完整顯示及獨立署名行。六組實際圖載入、完整框與署名不重疊；不代表所有其他素材製程／權利已核。',[dir+'/browser-r4.json',dir+'/green-build-r4-command.json']);
 set('short-lines','8887復原大字兩行，為英日長句留空間。1279英文首版說明與亮點泡泡重疊已留red，修後同寬green；三語1440/390六組標題／說明／泡泡無重疊與頁面橫溢。其他頁短末行仍依前版限定證據。',[dir+'/english-overlap-red.json',dir+'/english-overlap-green.json',dir+'/browser-r4.json']);
 set('build','8887新建置77檔，app-WMPKTSKM.js；只複製原有策展html/css/mjs三檔，不帶節日runtime。HTTP首頁／bundle／CSS／策展200，節日總入口404符合本版排除。',[dir+'/build-r4-command.json',dir+'/http.json']);
 set('independent','8887本次為主控Chrome驗收：六組首頁72項、六組導覽指南48項、三語策展入口21項，另一輪完成與英文紅綠。沒有新獨立代理；前版獨立收據保留其版本範圍。',ui);
 set('festival-freeze','依使用者新回覆，節日遊戲繼續暫緩；本次只接既有策展三檔且SHA不變，未改遊戲程式、美術或啟Unity／生圖。',[dir+'/user-scope.json',dir+'/green-build-r4-command.json']);
 set('guards','本段3個網站檔變更，其餘359來源、320保全檔及策展3檔SHA保持。359包含原有資料及素材，非359個程式檔；main refs保持，C節另在交接保存程序核對。不push、不發布、不刪檔。',[dir+'/green-build-r4-command.json']);
 const map=new Map(old.sources.map(x=>[x.file,x]));for(const file of ['app.jsx','chapters-1.jsx','holiday-home.css',...walk(site),...walk(dir)]){if(file===dir+'/verification.json')continue;map.set(file,{file,bytes:fs.statSync(file).size,sha256:hash(file)});}s.sources=[...map.values()];fs.writeFileSync(dir+'/verification.json',JSON.stringify(s,null,2)+'\n');
 const p='holiday-lab/dashboard/progress-policy.json',policy=read(p);Object.assign(policy,{latest_local_review:site,latest_local_port:8887,resume_scope:'original-home-new-languages-guide-curation-bottom',games_bottom:true,games_visible:true,game_runtime_in_latest_build:'existing-student-curation-only',dashboard_state_file:dir+'/verification.json'});fs.writeFileSync(p,JSON.stringify(policy,null,2)+'\n');
 fs.writeFileSync('holiday-lab/latest-build.json',JSON.stringify({out:path.resolve(site),built_at:new Date().toISOString(),files:walk(site).length,public_release:false,purpose:'original-home-local-review',game_scope:'existing-student-curation-only'},null,2)+'\n');
 console.log(JSON.stringify({pass:true,site,port:8887,bundle,build_files:walk(site).length,home_contexts:6,home_yes:72,guide_contexts:6,guide_yes:48,curation_contexts:3,curation_entry_yes:21,curation_completed_once:true,original_splash_reconstruction:true,checks:s.checks.length,yes:s.checks.filter(x=>x.result==='yes').length,no:s.checks.filter(x=>x.result==='no').length,source_bindings:s.sources.length,public_release:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
