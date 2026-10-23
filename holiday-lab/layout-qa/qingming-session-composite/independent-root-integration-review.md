# Root補證整合：獨立只讀review

已讀 verified-supplement.cjs、coverage-index.cjs、assembly-plan.cjs 及相關tests。沒有修改這些root檔案；現在索引程序仍在執行，修正由root待terminal後處理。

|檢查|yes／no|判讀|
|---|---|---|
|固定清明proof路徑|yes|只允許qingming-session-composite/evidence.json，其他任意JSON不可直接接入。|
|parent expected base／sampler／map|yes|parent重載每raw時檢options，並以實際contract required key／dimensions檢查全部90wrapper。|
|只讀child及method fingerprint|yes|child執行固定verify.cjs，exit0才繼續；proof與四method前後SHA一致，索引snapshot及assembly重載亦檢method集合與canonical keys。固定child本輪已真exit0。|
|old NO與eligible範圍|yes|old afterfalse、unknown1、flags_completefalse保留；只90，不給清明138全信用。source_scope是點狀收據。|
|完整wrapper|yes（正常固定資料）|parent由原full-case shard取回nodes／blockers，不把summary冒充完整case。原geometry_errors=[]，正常固定資料與child已驗結果相符。|
|child之後raw再次載入的綁定|no（待root修）|parent當下沒有重新核raw manifest SHA到detail.raw_manifest_sha256，亦未把重讀完整case與detail.case_file及SHA做deepEqual、或再綁runtime_receipts到已驗point map。若child後raw被改，同key、非空node與stored geometry[]仍可能被接受。這是TOCTOU／防錯缺口，不是宣稱原始raw已遭變更。|

可重跑隔離負例：

```text
node holiday-lab/layout-qa/qingming-session-composite/root-integration-race-negative.cjs
REVIEW_NEGATIVE RED accepted90 changed-source/payload wrappers after simulated child success; no production edits
exit0（診斷成功重現缺口，不是產品通過）
```

負例先引用實際verify-output.txt的readonly child成功收據；在獨立VM中只模擬「驗證後的raw reader」返回改掉的runtime module hash及第一node文字，保留canonical key／非空nodes／geometry[]。目前root helper仍接受90。原root檔與raw沒有被改動；輸出JSON保存reviewed helper SHA、實際child receipt SHA及明確模擬標記。這不是偽造玩家截圖。

第一次fixture因VM與host的Array prototype不同，deepStrictEqual誤擋[]，原輸出留底；已只修隔離fixture的realm，最終負例排除這個假紅。root修後應以「同樣改源／改payload必被拒絕」作green驗收，不能永久要求root保持此漏洞。

建議root在原索引terminal後補：raw manifest/header／shard來源再次hash、完整case與case_file SHA／deepEqual、sample及圖像SHA、source map與已驗點狀收據綁定。修正不應把原method flags或unknown1清掉；應另產新版本index／assembly，舊候選輸出仍保留且GLOBAL NO。

## 修後獨立差異複驗（2026-10-23）

上文是原版本發現，原RED程式／JSON／stdout保留，不再作目前版本的斷言。新檔 `root-integration-race-green.cjs` 已實跑exit0，受驗helper SHA為 `405aaca2d773db2e0c945c032da921b990751a1f6d2eb2df48a4fde296fe1f43`。

|修後檢查|yes／no|實際結果|
|---|---|---|
|同realm正常對照可載入|yes|unchanged接受90，兩個原raw reader，零模擬變更。|
|驗證後reader來源map變更必拒絕|yes|AssertionError：`Parent source map changed`。|
|來源map不變、完整case文字變更必拒絕|yes|AssertionError：`Parent full case changed after child verification`。|
|排除VM prototype假紅|yes|metadata與每個完整case全部在helper VM內JSON.parse；正常90先通過後才執行兩項負例。|
|原RED與產品檔保持|yes|新增green證據，未覆寫RED，未改helper／raw／產品／原proof。|
|完整UI總驗收通過|no|此項只閉合parent重讀來源與完整case綁定缺口，old afterfalse／unknown1與原method flags仍保留。|

```text
node holiday-lab/layout-qa/qingming-session-composite/root-integration-race-green.cjs
RACE_GREEN YES unchanged90; changed source-map rejected at source map; changed full-case rejected at full case; same-realm JSON fixtures; production edits0; GLOBAL=NO
exit0
```

本測試模擬child已成功後的reader競態；引用既有實際只讀child成功stdout SHA，沒有把模擬child稱為本次另跑的真child。詳細結果與實際斷言訊息在新 `root-integration-race-green.json`。這不是新玩家畫面或全案通過證據。
