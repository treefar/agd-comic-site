# 全面試作續驗15：和平六案例整合與中秋真UI啟動

2026-10-23；source_agent: codex；本機 codex/holiday-prototypes。此輪為實際進展，仍未完成整體目標。

## 可感知成果

和平日六個實際聆聽預覽已納入新索引：2046／2076、缺30、geometry0。root已檢視EN1440與JA320原截圖；聆聽文字可見，JA仍有既有短末行，不把本批說成所有文字排版已完。第一批EN1440未可見原圖保留，採用另次正常操作補圖；5＋1取完整frame，不混拼nodes。

離線儀表板仍用 holiday-lab/dashboard/out/index.html；來源轉v4，資料／工具／使用者三層分開，顯示15款功能通關、整包UI0／1、使用者確認0。沒有重新Build網站、替換8800或產新ZIP。

## yes／no與實際執行輸出

|條件|yes／no|實際命令與輸出|
|---|---|---|
|新index增加六項且沒有掉舊scope|yes|coverage-index命令見v4/index-command.json；stdout：COVERAGE required=2076 covered=2046 missing=30 geometryErrors=0；原PowerShell後附handle未取得ExitCode，status如實null，不報exit0、不重跑。|
|獨立baseline保舊keys及方法／來源綁定|yes|node holiday-lab/layout-qa/supplement-integration-20261023/compare.cjs holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json holiday-lab/layout-qa/supplement-integration-20261023/v4/coverage-current.json holiday-lab/layout-qa/supplement-integration-20261023/v4/root-baseline-comparison.json → exit0；before2040 after2046 added6；all_prior_keys_preserved=true、all_prior_run_bindings_preserved=true。|
|組裝結果與完整原case/sample相符|yes|assembly child63924真close exit0；root實跑 node holiday-lab/layout-qa/supplement-integration-20261023/v4/check-plan.cjs → exit0；2040舊selected深等，舊126及新6wrapper SHA逐筆重建。|
|新和平完整payload、flags保留|yes|root-peace-check/check.cjs → exit0；6cases、indexed_roundtrip6、180nodes、218blockers、flags[0,2,0,1,0,2]、full_project_approved=false。|
|相關回歸含方法／eligiblekeys漂移拒絕|yes|node --test holiday-lab/tests/coverage-baseline.test.cjs holiday-lab/tests/peace-preview-evidence.test.cjs holiday-lab/tests/peace-preview-integration.test.cjs → tests13 pass13 fail0。新增baseline負例先3pass1fail（Missing expected exception），修compare後綠；兩整合入口各僅+1行。|
|dashboard正式驗證／互動／手機|yes|node holiday-lab/build-dashboard.mjs → 27/27 PASS、exit0；node --test holiday-lab/dashboard/ui-authority.test.cjs →4pass0fail；node holiday-lab/dashboard/smoke.cjs → DASHBOARD_SMOKE 2/2 PASS、exit0，1440light/390dark均overflow=false、problems[]、errors[]。首次projection v4但authority仍v3為26/27真紅，修雙來源路徑後轉綠，保留root-dashboard-first-red.json。|
|中秋正常UI工具回歸與方法freeze|yes|root重跑plan/png/store/store-faults/runner/scope六testfiles →20pass0fail；freeze04 livepreflight exit0，32方法／30HTTP bodies／雙字型／原0.05px比較未放寬。|
|中秋全部正常UI驗證已完|no|原404688全集及完整stream已驗，但新783工作未完；2026-10-23T04:53:15.523Z root實查runner43892/creation04:51:46.2473260Z present、journal26筆、terminal不存在。首筆全checks=true、comparison=[]、flags=[]、geometry=[]、PNG完整解碼一致。只是初段，不能報783完成。|
|工具誤判未改舊失敗結果|yes|root-ui-03首筆14檢查true，唯hint-only nodes配全blockers造成42個斷引用假紅，04:49:38.302Z真exit1；原case/pass=false/PNG/terminal保留。新04以完整nodes＋完整blockers修復，三真錯位／裁框／遮擋負例仍拒絕，顯式新approval後單一啟動。|
|勞動v4已跑原生全集|no|v3三漏洞由獨立23tests驗封；另P2 pass矛盾被實證，v4兩收緊（pass公式／geometry也納入checks）代理報30tests。root另派獨立審v4與受限6context校準工具，沒有准full；不可用工程綠燈當新1440x1000畫面通過。|
|翻譯專職增量有交付|yes|translation-review-followup-20261023/REPORT.md及issues.json；root唯讀verify exit0：13角色一致、6學位中性化已整合、9資格仍待一手資料；指南24Division與遊戲6Section差異留P2。沒有改凍結遊戲文案。|
|TF-BASE兩WebGL來源或Build已回|no|本輪實查共享交接夾仍5工單／腳本，沒有兩來源或Build；未啟Unity。|
|正式UI gate／source-build provenance／使用者確認已完|no|R0 SHA仍cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336；剩5款error-longest各6；完整flags ledger、283來源清單差異、5非同路徑input/build provenance及使用者美術確認仍未閉合。|

## 主要來源

- v4/coverage-current.json SHA 48921202d1a5427010632a3da320dc2b31775d4b8803ea9d61536a5d93c36eeb；plan-current/plan.json與plan-consistency.json。
- 和平canonical-candidates.json SHA 123787797c259fbba494da472f36b912c9c33f02f9a70a081c22615abd84c481；原完整frame與內嵌sample。
- 中秋freeze04 SHA55ef47dc52f9a1ff8ca36157cc3649aff64566b1b9495a26ee9da2bea7b52ab6；root-approval-04 SHA8262fb3dc71f189165873a5bc2430d21048a65e324afc29abb41576a8008ba8c；plan cdd0a41c138f337b5dc56f96020821f850f49aed9554dbed54260eb830798ac8。
- 中秋driver51568/runner43892；launches/root-ui-04/launch.json、stdout.log、stderr.log、terminal.json。只追同creation，不因timeout重啟。原03已terminal，不resume假綠。

下一輪第一件事：核對43892同creation／原driver session46854與log，若terminal先讀原terminal及failure，活著就只追同job；完成後逐sample/PNG/rolling驗783與810義務。回收勞動v4獨立審查與6context受限pilot工具，主控先審再准native，不自行跑v4full。其餘國慶／開學／清明完整錯句域與全域gate保留原範圍。

未push、未碰main、未刪檔、C節不動。大型原始中秋673MB NDJSON仍本機ignored，不能宣稱已跨機備份。新凍結工具與已完成補件會做本機Git保全，正在變大的04原始輸出不假稱完整封存。

## 本機保全與勞動複核補記

04:57:00Z已暫存522檔，其中501 QA檔／38,599,922 bytes逐一以Git blob格式重算，與index完全同位元組；不含仍增長的root-ui-04輸出。root-archive-check.json為實際收據。一般git diff --check會將保留的原CRLF及Node assertion空白輸出列警示；以cr-at-eol辨識行尾後仍有原stdout空白行警示，保留不改寫。限定程式／文件的cached diff --check實際exit0。原始stdout不是產品程式排版，不為lint修飾證據。

勞動v4另位代理已隔離重跑30／30，但新增9個check鍵集合刪除負例真紅：刪safe鍵再將pass改true仍可被舊validator接受。原v4不改、不准full。獨立bounded wrapper會精確鎖原9鍵／bool／pass公式並綁native SHA，只準備六context各兩筆原plan校準，尚未啟native；不把這個受限用途當2784全集驗收。
