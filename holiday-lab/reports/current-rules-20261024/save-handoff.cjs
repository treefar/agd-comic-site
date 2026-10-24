const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),base=__dirname,original='C:/Projects/系網漫畫版_AGDComicSite',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),state=JSON.parse(fs.readFileSync(path.join(base,'verification.json'))),proof=JSON.parse(fs.readFileSync(path.join(base,'current-verification.json')));
assert.equal(proof.pass,true);const ui=JSON.parse(fs.readFileSync(path.join(base,'dashboard-ui-r2.json'))),authority=JSON.parse(fs.readFileSync(path.join(base,'dashboard-verify-command.json')));assert.equal(ui.pass,true);assert.equal(authority.exit_code,0);
const title='## 2026-10-24 最新：8879指南更新與三語來源白話化';
const yes=state.checks.filter(c=>c.result==='yes').length,no=state.checks.filter(c=>c.result==='no').length;
const note=`${title}

- source_agent: codex；TF-GO。最新本機 http://127.0.0.1:8879/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/ 。.measure-current-rules-20261024-03／360檔／app-FPPJGCJR.js。8876仍是前輪審閱版；8877為本輪01、8878為02，皆保留，不以舊版判斷新成果。
- 三組子代理分別完成請假、英文/證照、專題/升學補研，主控套提案；另由未改產品的代理獨立驗收。指南15卡47步不變、FAQ34→42、來源53→63。新英文/日文字典各86項，全部為明列文案，舊key不刪；真建置未成對/衝突均0。JA四處保留台灣115学年度第1学期，不套日本前期。
- 請假現列114/11/19規則2頁、公假/事假空白表已讀；分清送件、簽核及心理假假額。英文現列114/12/24辦法3頁、113入學起外語修課與3空白表、113/10/9證照獎助全文已讀。只核112–115日四技一般班基本門檻，不外推技優或全校。新規/舊操作路由、105免綁類別、115-1全英課/獎助、本系完整證照表仍保留缺件。
- 公開專題三DOCX與前次相同，辦法仍108版，二審/三審期限矛盾未解；兩處116A1與原件同SHA，書審100%/口試仍矛盾。指南明示詢問窗口，不代校方裁決；所查公開索引未得116A4，未推論全校未公告。來源註記48處改20組學生用語，保留摘要/舊版限制；查核日期、URL、規定與原始HTTP/研究收據不改。
- 03獨立6組144yes/0no，408文案及708來源欄位觀察、54WebP；47來源/360build前後SHA相同。主控完整重建guide、逐SHA核截圖/字典，29測試exit0。新增10字有限cmap/CSS range可用，未換字體；8876舊16旋轉h2候選亦補證是單行。不是全站實際fallback、母語或真機認證。
- 第一輪01因root在QA中切分支，5檔LF→CRLF觸發真正SHA失敗，已逐位元證明行尾原因；raw-r1不升格通過。02有138yes，但註記白話化後已被03取代。原校準/套用容器key/儀表板global名稱的工具失敗保留，修方法，不改產品配合。
- 儀表板${state.checks.length}列／${yes}yes／${no}no／使用者0，由current-rules-20261024/verification.json的960個檔案綁定重產；未重驗項目清楚標前版範圍。權威18/18，搜尋/展開/篩選及手機深色2組14yes。完整逐條報告、stdout/stderr/exit與限制：holiday-lab/reports/current-rules-20261024/REPORT.md 。
- 本機整合codex/current-rules-review24；項目分支codex/short-lines24、codex/leave-rules24、codex/study-copy24、codex/threshold-copy24、codex/source-notes24。315原圖/凍結遊戲素材、四dirty+R0、main refs與C節相同。未push、發布、main、刪檔或C節操作；節日全凍結，無生圖、Unity、測玩或大批遊戲QA。Flora/胖倉鼠本段未新回查，最近指定夾01:12UTC紀錄仍只有5工單，不冒稱即時已驗包。Vault只本機紀錄，不執行私人整庫推送。
- 下一輪第一件事：讀本段與REPORT，先回收使用者對8879畫面的具體意見。再按可得正式文件補缺；未知權利、母語/真機、全部職稱外文名及WebGL不可自行宣告完成。已有新證據才重驗，不重開節日工作。目標仍未宣告全面完成。

\`\`\`text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-current-rules-20261024-03 --dashboard=holiday-lab/dashboard/out --port=8879
\`\`\`

`;
const cpart=s=>{const i=s.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(i>=0);const t=s.slice(i),n=t.slice(1).search(/\r?\n## /);return n<0?t:t.slice(0,n+1);};
const file=path.join(original,'LATEST_HANDOFF.md'),old=fs.readFileSync(file,'utf8'),csha=sha(cpart(old));assert.equal(csha,'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');assert.ok(!old.includes(title));fs.writeFileSync(file,note+old);assert.equal(sha(cpart(fs.readFileSync(file,'utf8'))),csha);
const status=path.join(root,'holiday-lab/STATUS.md'),s=fs.readFileSync(status,'utf8');assert.ok(!s.includes(title));fs.writeFileSync(status,note+s);
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',v=fs.readFileSync(vault,'utf8'),front=v.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(front&&front[0].includes('source_agent: codex'));assert.ok(!v.includes(title));fs.writeFileSync(vault,front[0].replace(/^updated:.*$/m,'updated: 2026-10-24')+'\n'+note+v.slice(front[0].length));
const report=path.join(base,'REPORT.md');fs.appendFileSync(report,'\n儀表板已重產：dashboard-build-command.json／dashboard-verify-command.json為18/18；dashboard-ui-command-r2.json為2組14yes。第一版方法誤讀StatusDashboard，實檔為projectDashboard，原失敗保留；只修驗證方法，未改產品。交接與Vault均已本機更新，未執行私人Vault整庫推送。\n');
console.log(JSON.stringify({latest:'http://127.0.0.1:8879/',checks:state.checks.length,yes,no,c_unchanged:true,handoff_written:true,vault_record_written:true,private_vault_push:false}));
