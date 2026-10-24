const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
process.chdir(path.resolve(__dirname,'../../..'));
const heading='## 2026-10-24 最新：8883不放遊戲，本機服務已恢復';
const note=heading+`\r\n\r\n- source_agent: codex；TF-GO。使用者回報連不到，查8882無listener後恢復原服務；後續裁定待辦一起核對、遊戲先不放。本次最新 http://127.0.0.1:8883/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/ 。8882舊版保留，別用舊版判斷新成果。\r\n- codex/no-game-review24只從app.jsx移除首頁創作試玩section，原遊戲／素材全留。新.measure-no-games-20261024-01／74檔／app-UC6CEXXC.js，直接網站builder未複製holiday-lab runtime。首頁與bundle HTTP200且SHA相同；遊戲路徑404符合本版排除，不是新清明故障。無遊戲入口／iframe，招生、頁尾及其餘章節保留。\r\n- red exit1→僅移除3行→Build exit0→green exit0。主控Chrome三語×1440/390六組48yes，原畫／署名、章節／頁尾順序與無橫溢；不是本輪新代理獨立全站驗收。361其他來源及四dirty+R0+315素材共320保全SHA不變，main與原交接C節一致。不push、不發布、不碰main、不刪檔；所有節日凍結，未測玩／修改遊戲／Unity／生圖。\r\n- 六項待核重讀既有最新研究並逐項整理：正式外文名／職稱衝突、當期規章表單及版本衝突、素材製程權利、全站逐字缺字、真機母語審閱、WebGL。前五項保留原限制；不是六個已知bug，不自創發布門檻。本輪未新查官方或Drive，不拿舊查詢冒充當日回覆。WebGL依使用者新裁定暫緩，不再當主網站本機審閱的阻礙；不整合任何遊戲，亦不聲稱已到包。\r\n- 儀表板新no-game-review-20261024/verification.json：50列44yes/6no/使用者0，包含明列前版限定證據，不是8883全站通過率。權威18/18，兩寬搜尋／展開／六項篩選14yes；最新本機版本8883。報告holiday-lab/reports/no-game-review-20261024/REPORT.md；command JSON保留stdout/stderr/exit，browser.json與直接截圖保留，CUA不支援compareDocumentPosition的方法錯誤也保留。\r\n- 下一輪第一件事：先看8883與儀表板的缺件／保留，收具體畫面意見；正式規章／處室職稱有新依據才做相依修正。遊戲全部先不放，不因包件之後到達自動恢復整合或節日工作；仍不發布與不執行C節。舊DOC全文與四個英日值已閉合，不重做。\r\n\r\n重啟：node scripts/serve-local-review.cjs --site=.measure-no-games-20261024-01 --dashboard=holiday-lab/dashboard/out --port=8883\r\n\r\n`;
const c=t=>{const i=t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(i>=0);const s=t.slice(i),n=s.slice(1).search(/\r?\n## /);return n<0?s:s.slice(0,n+1)};
const sha=t=>crypto.createHash('sha256').update(t).digest('hex'),original='C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';const cBefore=sha(c(fs.readFileSync(original,'utf8')));
const writes=[];
const targets=[original,'holiday-lab/STATUS.md','C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
for(const p of targets)assert.ok(fs.existsSync(p),'Missing actual handoff '+p);
for(const p of targets){
 let s=fs.readFileSync(p,'utf8');if(s.includes(heading)){assert.ok(s.includes(note),'Existing section differs: '+p);writes.push(p);continue;}if(s.startsWith('---')){const end=s.indexOf('\n---',3);assert.ok(end>0);const n=s.indexOf('\n',end+1);s=s.slice(0,n+1)+'\r\n'+note+s.slice(n+1);}else s=note+s;
 fs.writeFileSync(p,s);assert.ok(fs.readFileSync(p,'utf8').includes(heading));writes.push(p);
}
assert.equal(sha(c(fs.readFileSync(original,'utf8'))),cBefore);
const attr='.gitattributes',line='/holiday-lab/reports/no-game-review-20261024/** -text';let a=fs.readFileSync(attr,'utf8');if(!a.includes(line))fs.writeFileSync(attr,a+(a.endsWith('\n')?'':'\r\n')+line+'\r\n');
console.log(JSON.stringify({pass:true,updated:writes,c_section_sha:cBefore,vault_local_only:true,push:false,public_release:false}));
