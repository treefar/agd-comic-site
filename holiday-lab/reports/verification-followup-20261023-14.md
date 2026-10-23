# 全面試作本機整合14

2026-10-23，source_agent: codex。全案未完成，本輪實際新增126個已驗canonical情境，未縮減原2076項要求。

## 實際成果

覆蓋1914→2040/2076、缺162→36。新增為清明90、和平/光復有限錯句12、8款中英日窄提示24；各原case與nodes/blockers保留，跨鏡只以明列收據連結。組裝計畫2040與索引逐key完全相同，126新wrapper的完整內容SHA、node/blocker數、原ID與指標獨立重算一致。這不是正式UI gate通過；R0 SHA仍cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336。

## 實際指令輸出

工作目錄 C:/agywork/agd-holiday-prototypes。完整索引參數在supplement-integration-20261023/v3/index-command.json，不用工具預設矩陣。

```text
node holiday-lab/layout-qa/coverage-index.cjs [v3/index-command.json的實際參數]
COVERAGE required=2076 covered=2040 missing=36 geometryErrors=0; PARTIAL_RED
# v3 PID37948/driver61148，單次開始04:09:35.018Z，04:12:42.917Z terminal exit0

node holiday-lab/layout-qa/supplement-integration-20261023/compare.cjs holiday-lab/layout-qa/semester-session-composite/coverage-bound-current.json holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json holiday-lab/layout-qa/supplement-integration-20261023/v3/baseline-comparison.json
pass true; before1914 after2040 added126; all_prior_keys_preserved true; all_prior_run_bindings_preserved true

node holiday-lab/layout-qa/assembly-plan.cjs --index=holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json --out=holiday-lab/layout-qa/supplement-integration-20261023/v3/plan-current
ASSEMBLY_PLAN selected=2040/2076 missing=36 current_source_matches=282/283 official_unchanged=cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336
# root session45861，exit0

node holiday-lab/layout-qa/supplement-integration-20261023/check-plan.cjs
pass true; supplement_full_wrappers_sha_verified126; exact_selected_and_missing_keys true; official_unchanged true

node --test --test-reporter=tap [root-related-tests.json的六份實際測試路徑]
# tests24 pass24 fail0 exit0；完整TAP存root-related-tests-output.txt
```

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

## 交付保全補記

主控另實跑國慶/開學/勞動來源模型與存檔六份測試檔：27 tests／27 pass／0 fail，exit0；完整TAP及路徑存root-domain-tests-output.txt、root-domain-tests.json。沒有由此啟動新native或全集。已完成設計與校準可本機版控保全，labor engine-v2仍由代理收尾，本次白名單明確排除。新QA證據與SHA方法套用-text並逐筆git raw-byte blob核對；詳archive-integrity.json。
