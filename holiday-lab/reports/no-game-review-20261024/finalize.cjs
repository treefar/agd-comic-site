const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');process.chdir(root);
const dir='holiday-lab/reports/no-game-review-20261024',site='.measure-no-games-20261024-01';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name).replaceAll('\\','/')]);
async function main(){
 assert.equal(read(dir+'/red-command.json').exit_code,1);for(const tag of ['apply','build','green'])assert.equal(read(dir+'/'+tag+'-command.json').exit_code,0);
 const ui=read(dir+'/browser.json');assert.equal(ui.cases.length,6);assert.deepEqual(ui.failures,[]);assert.equal(ui.cases.flatMap(c=>Object.values(c.assertions)).filter(Boolean).length,48);
 const html=fs.readFileSync(site+'/index.html','utf8'),bundle=html.match(/src="(app-[^"]+\.js)"/)[1];
 const http=[];for(const url of ['http://127.0.0.1:8883/','http://127.0.0.1:8883/'+bundle,'http://127.0.0.1:8883/holiday-lab/index.html','http://127.0.0.1:8883/holiday-lab/student-curation.html']){const r=await fetch(url),bytes=Buffer.from(await r.arrayBuffer());http.push({url,status:r.status,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
 assert.deepEqual(http.map(x=>x.status),[200,200,404,404]);assert.equal(http[0].sha256,hash(site+'/index.html'));assert.equal(http[1].sha256,hash(site+'/'+bundle));
 fs.writeFileSync(dir+'/http.json',JSON.stringify({observed_utc:new Date().toISOString(),command:'Node fetch: homepage, referenced bundle, two absent game paths',exit_code:0,results:http},null,2)+'\n');
 const pending=read('holiday-lab/reports/legacy-reader-review-20261024/verification.json').checks.filter(x=>x.result==='no');
 fs.writeFileSync(dir+'/pending-review.json',JSON.stringify({observed_utc:new Date().toISOString(),scope:'Read existing latest research and six outstanding rows; no fresh official research or Drive query in this turn',games_deferred_by_user:true,checks:pending.map(x=>({...x,current_decision:x.id==='webgl'?'依本次使用者裁定暫緩，不列網站本機審閱阻礙。未聲稱收到包件。':x.id==='formal-units'||x.id==='guide-currentness'?'官方資料／版本仍待核，現有提醒保留，不代校方裁決。':'保留驗證／來源限制；不是已確認的畫面缺陷，不自創發布門檻。'}))},null,2)+'\n');
 const old=read('holiday-lab/reports/legacy-reader-review-20261024/verification.json');
 const s={...old,observed_utc:new Date().toISOString(),site,port:8883,baseline_site:'.measure-copy-actions-20261024-01',baseline_note:'本次只移除首頁試玩區，使用者同意遊戲先不放。8883三語雙寬48項為主控檢查；其他逐項保留前版證據與限制，沒有新獨立全站驗收。舊8882建置仍完整留存。'};
 for(const c of s.checks)c.reason='8883本次未重驗此全項；以下保留前版範圍與限制。 '+c.reason;
 const change=(id,fields)=>Object.assign(s.checks.find(x=>x.id===id),fields);
 const ev=[dir+'/browser.json',dir+'/green-command.json',dir+'/http.json'];
 change('page-bottom',{title:'首頁暫不放遊戲／試玩入口',disposition:'已修正',result:'yes',reason:'依本次使用者裁定，移除首頁創作試玩整格及策展入口，不留節日暫緩提示。三語×1440/390六組無遊戲區、試玩控制與iframe；招生、頁尾與其餘章節保留。僅取消網站入口，不改原遊戲。',evidence:ev});
 change('build',{reason:'8883使用scripts/build.mjs --local-review建至全新目錄，不複製holiday-lab遊戲runtime；建置exit0。首頁與bundle HTTP200及SHA相同，兩遊戲路徑404符合本版排除範圍，並非清明遊戲故障。',evidence:[dir+'/build-command.json',dir+'/http.json']});
 change('independent',{reason:'本次移除首頁區塊由主控Chrome做三語雙寬48項，不宣稱新代理獨立驗收。前版8880/8881/8882獨立結果保留為其限定版本證據。',evidence:[dir+'/browser.json',...s.checks.find(x=>x.id==='independent').evidence]});
 change('webgl',{disposition:'保留',reason:'使用者本次同意遊戲先不放，Flora／胖倉鼠整合暫緩，不阻擋主網站本機審閱。本次未重新查Drive；最近保存回覆仍未收到指定夾完整包，不能聲稱已回傳或驗包通過。',evidence:[dir+'/pending-review.json',...s.checks.find(x=>x.id==='webgl').evidence]});
 change('guards',{reason:'本次check.cjs核原四dirty+R0、315既有素材／遊戲檔，共320檔SHA保持；361其他來源保持，main refs與原交接C節一致。不push、不發布、不刪檔、不啟Unity或生圖。',evidence:[dir+'/green-command.json']});
 change('festival-freeze',{reason:'所有節日遊戲繼續凍結；本次僅網站入口移除及排除runtime複製，未修改、測玩或開發遊戲，原檔SHA保持。',evidence:[dir+'/green-command.json',dir+'/http.json']});
 const byFile=new Map(old.sources.map(x=>[x.file,x]));byFile.set('app.jsx',{file:'app.jsx',bytes:fs.statSync('app.jsx').size,sha256:hash('app.jsx')});
 for(const file of [...walk(site),...walk(dir)]){if(file.endsWith('/verification.json'))continue;byFile.set(file,{file,bytes:fs.statSync(file).size,sha256:hash(file)});}
 s.sources=[...byFile.values()];fs.writeFileSync(dir+'/verification.json',JSON.stringify(s,null,2)+'\n');
 const p='holiday-lab/dashboard/progress-policy.json',policy=read(p);Object.assign(policy,{latest_local_review:site,latest_local_port:8883,resume_scope:'website-only-no-game-entry',games_bottom:false,games_visible:false,game_runtime_in_latest_build:false,dashboard_state_file:dir+'/verification.json'});fs.writeFileSync(p,JSON.stringify(policy,null,2)+'\n');
 console.log(JSON.stringify({pass:true,site,port:8883,bundle,build_files:walk(site).length,browser_contexts:ui.cases.length,browser_yes:48,checks:s.checks.length,yes:s.checks.filter(x=>x.result==='yes').length,no:s.checks.filter(x=>x.result==='no').length,source_bindings:s.sources.length,http:http.map(x=>x.status),public_release:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
