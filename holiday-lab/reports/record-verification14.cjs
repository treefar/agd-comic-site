const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=process.cwd(),qa=path.join(root,'holiday-lab/layout-qa'),dir=path.join(qa,'supplement-integration-20261023'),read=f=>JSON.parse(fs.readFileSync(f)),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),index=read(path.join(dir,'v3/coverage-current.json')),comparison=read(path.join(dir,'v3/baseline-comparison.json')),plan=read(path.join(dir,'v3/plan-consistency.json')),tests=read(path.join(dir,'root-related-tests.json')),launch=read(path.join(qa,'mid-autumn-finite-native/full-domain-run/exhaustive/root-launch-status.json'));
assert.equal(index.covered,2040);assert.equal(index.missing_count,36);assert.equal(comparison.added_count,126);assert.equal(comparison.pass,true);assert.equal(plan.pass,true);assert.equal(plan.supplement_full_wrappers_sha_verified,126);assert.equal(tests.exit_code,0);assert.equal(tests.passed,24);assert.equal(tests.failed,0);
const original='C:/Projects/系網漫畫版_AGDComicSite',handoff=path.join(original,'LATEST_HANDOFF.md'),vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',csha='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680',c=s=>{const m=s.match(/## C\.[\s\S]*?(?=\r?\n## )/);assert.ok(m);return hash(m[0]);},before=fs.readFileSync(handoff,'utf8');assert.equal(c(before),csha);assert.equal(cp.execFileSync('git',['-C',original,'rev-parse','refs/remotes/origin/main'],{encoding:'utf8'}).trim(),'1b8322e69d84549db220d849afb1aac0fb9d7c2a');const r0=hash(fs.readFileSync(path.join(qa,'layout-report.json')));assert.equal(r0,'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336');
let processReceipt;try{processReceipt=JSON.parse(cp.execFileSync('powershell',['-NoProfile','-Command','Get-Process -Id 18628 -ErrorAction Stop | Select-Object Id,StartTime,CPU | ConvertTo-Json -Compress'],{encoding:'utf8'}));}catch{processReceipt={live_confirmed:false,requires_terminal_status_check:true};}
const block=`## 2026-10-23 最新：覆蓋2040項、126份完整證據已整合

- source_agent: codex。上一goal輪為實際進展，本輪再次推進：清明90、和平/光復有限錯句12、窄版提示24，合計126份完整case納入新索引。最新2040/2076、缺36、geometry0；與1914基準逐key/來源綁定比較，全保留無降級。權威索引 holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json；plan-current/plan.json同2040，126新wrapper全nodes/blockers/SHA指標獨立重算相符，正式R0不寫。
- 主控24/24 tests與索引/assembly/check-plan真exit0。補了證據後讀的raw manifest/case/sample/image SHA、source map與完整case比對；獨立VM真紅接受90→修後正常90、改source/改payload各精確拒絕，最新profile helper再複驗同樣通過。不同collector的sampler欄位依實讀schema處理，不用名稱猜語意。原首次234小索引為誤用舊矩陣名、v2缺欄位拒絕均留檔不採用；v3實際正確phase23-47-50-142/front23-48-00-964。
- 剩36：中秋/國慶/開學/清明/勞動 game/error-longest各6，和平真聆聽preview6已有獨立原生證據但尚未接索引。中秋同一engine18628/driver68760仍按原prepared-01跑；本次真程序觀測${JSON.stringify(processReceipt)}，最近checkpoint ${launch.last_line}（${launch.last_stdout}）。不得改runtime/manifest或逾時重啟，全集後尚須串流、極值、seeded真UI驗證，GLOBAL仍NO。
- 三代理續分工：labor-finite-native/engine-v2修雙字型/320x900與1440x1000/分片/PID續跑，未批全集；national-fast-domain精確joint10,980,702，僅設計和gzip實驗、native0，手機高度及快法等價未證；semester-error-domain只做可達投影/校準，不把無上限步數當有限sample。清明adapter舊afterfalse/unknown1及所有原flags完整保留，清明剩6錯句域另排。
- 主報告 holiday-lab/reports/verification-followup-20261023-14.md；詳細yes/no與實際stdout見integration目錄。新網站Build/新ZIP/發布/push/main/刪檔均無，8800與舊ZIP保留，C節SHA不變；TF-BASE實查仍5工單，無來源/WebGL，不啟Unity。大型raw只本機，沒有跨機備份宣稱。
- 下一輪第一件事：查同18628/68760真狀態與log，完成才串流驗全集並取真正極值/128seed每context；回收labor-v2/semester/國慶設計後先查碼再啟指定測量。接和平既有6preview、清明6有限/動態域，再重產索引。所有UI method flags、來源283的非served/build provenance、日文短末行與使用者實玩/美術確認尚未閉合，禁止以2040/2076或geometry0宣稱全案完成。

`;
const report=`# 全面試作本機整合14

2026-10-23，source_agent: codex。全案未完成，本輪實際新增126個已驗canonical情境，未縮減原2076項要求。

## 實際成果

覆蓋1914→2040/2076、缺162→36。新增為清明90、和平/光復有限錯句12、8款中英日窄提示24；各原case與nodes/blockers保留，跨鏡只以明列收據連結。組裝計畫2040與索引逐key完全相同，126新wrapper的完整內容SHA、node/blocker數、原ID與指標獨立重算一致。這不是正式UI gate通過；R0 SHA仍${r0}。

## 實際指令輸出

工作目錄 C:/agywork/agd-holiday-prototypes。完整索引參數在supplement-integration-20261023/v3/index-command.json，不用工具預設矩陣。

\`\`\`text
node holiday-lab/layout-qa/coverage-index.cjs [v3/index-command.json的實際參數]
COVERAGE required=2076 covered=2040 missing=36 geometryErrors=0; PARTIAL_RED
# v3 PID37948/driver61148，單次開始04:09:35.018Z，04:12:42.917Z terminal exit0

node holiday-lab/layout-qa/supplement-integration-20261023/compare.cjs holiday-lab/layout-qa/semester-session-composite/coverage-bound-current.json holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json holiday-lab/layout-qa/supplement-integration-20261023/v3/baseline-comparison.json
pass true; before1914 after2040 added126; all_prior_keys_preserved true; all_prior_run_bindings_preserved true

node holiday-lab/layout-qa/assembly-plan.cjs --index=holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json --out=holiday-lab/layout-qa/supplement-integration-20261023/v3/plan-current
ASSEMBLY_PLAN selected=2040/2076 missing=36 current_source_matches=282/283 official_unchanged=${r0}
# root session45861，exit0

node holiday-lab/layout-qa/supplement-integration-20261023/check-plan.cjs
pass true; supplement_full_wrappers_sha_verified126; exact_selected_and_missing_keys true; official_unchanged true

node --test --test-reporter=tap [root-related-tests.json的六份實際測試路徑]
# tests24 pass24 fail0 exit0；完整TAP存root-related-tests-output.txt
\`\`\`

首次索引因未給固定08的matrix名稱而只234項，不採用、不覆寫1914基準。v2完整讀到mobile拒絕收據時，因主控錯用sampler_function_sha256欄而拒絕；實讀native的sampler_sha256後按schema修正，3正式回歸tests與24真案例preflight通過再跑v3。失敗stdout/stderr/status全留，不是產品遊戲失敗，也沒有同時重跑舊工作。

## 方法防誤判

獨立review發現child驗證後parent重新讀raw只看key/geometry[]的缺口。原VM負例接受90份被改來源/文字的模擬wrapper；新增parent raw/case/sample/image SHA、runtime map對實際point receipts、fullcase深度等值及sample nodes/blockers/flags比對。兩正式回歸tests先紅後綠，獨立same-realm正常對照90通過，source-only與payload-only各以精確錯誤拒絕；profile修正後再獨立重驗。原紅燈沒有覆寫。

## yes/no逐條

|驗收|yes/no|證據|
|---|---|---|
|原2076項範圍保留、原1914全部保留|yes|baseline-comparison.json，added126|
|新2040索引與計畫選中/缺項完全一致|yes|v3/plan-consistency.json|
|126新完整case來源/node/blocker/指標SHA核對|yes|check-plan實際exit0|
|原NO、method flags、舊缺after/unknown1保留|yes|typed candidates與qingming evidence及原raw|
|24相關正式tests|yes|root-related-tests-output.txt，24/24|
|中秋404688全集已完成並全域證明|no|同18628仍須看terminal/stream/extrema/seed，不用checkpoint當完成|
|國慶快法等價/新native全集已完成|no|native0、設計/壓縮實驗保留，10,980,702joint非已測|
|勞動與開學完整動態域已完成|no|先導與工程續作，未批長全集|
|全UI method與最新來源provenance閉合|no|282/283對08相同，另5非served路徑與新JA字幕等仍待typed source ledger|
|新Build/試玩ZIP/發布/push/main/刪檔|no|本輪QA工具/報告，8800舊審閱版保留|

和平preview6已有peace-listen-preview真資料，尚未接索引；剩五遊戲error-longest各6。TF-BASE交接夾本輪實讀仍僅5工單/腳本，無兩款源或WebGL；沒啟Unity。新source方法和完成證據會本機提交，ignored raw不宣稱已備份。C節與origin/main指紋守住。
`;
const reportFile=path.join(root,'holiday-lab/reports/verification-followup-20261023-14.md');assert.ok(!fs.existsSync(reportFile));fs.writeFileSync(reportFile,report);fs.writeFileSync(handoff,block+before);assert.equal(c(fs.readFileSync(handoff,'utf8')),csha);const status=path.join(root,'holiday-lab/STATUS.md');fs.writeFileSync(status,block+fs.readFileSync(status,'utf8'));const old=fs.readFileSync(vault,'utf8'),fm=old.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(fm);fs.writeFileSync(vault,fm[0]+'\n'+block+old.slice(fm[0].length).replace(/^\s*\r?\n/,''));const result={at:new Date().toISOString(),source_agent:'codex',covered:index.covered,missing:index.missing_count,added:comparison.added_count,full_project_approved:false,official_R0_sha256:r0,C_section_sha256:csha,middle_job_process_receipt:processReceipt,vault_remote_sync_performed:false};fs.writeFileSync(path.join(root,'holiday-lab/reports/verification14-invariants.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
