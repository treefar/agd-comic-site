# 分片報告整合：獨立只讀審查

結論：本次指定的 writer／collector／matrix／coverage reader／error-source-audit 整合，最小充分重驗通過。沒有發現會截斷既有 21-case smoke 或讓 coverage 略過 shard SHA 的問題。另有一項後續 consumer 尚未支援 v2，見下表；不代表完整 UI gate 已通過。

僅寫入本 independent-review 目錄，沒有 stage、commit、啟動瀏覽器／矩陣、重啟或終止任何原程序。五個被審程式及原 smoke 的 SHA，在獨立驗證前後一致；詳見 latest.json 所指 verification.json。

|驗收項目|yes／no|證據|
|---|---|---|
|sharded=1 保存完整 case|yes|21/21 與 collector 另存的原 .case.json 深度相等；684 nodes、810 blockers；原順序、ID 完整，21 張 screenshot SHA 均相等。|
|report 不累積完整 nodes/blockers|yes|collector 保留 id／geometry_errors 摘要；writer manifest 只留 identity、summary、shard reference。append 會暫時再讀單一 case 取得 saved summary，未持有全部完整 case。|
|metadata、violations、Unicode、重複 ID 保留|yes|header SHA 在 metadata 暴露前核對；完整 v1/v2 深度對照保留控制字元、跨分段 surrogate；既有 9 項 store 測試亦全部通過。|
|每個 shard／header SHA 驗證|yes|真 smoke verifyLayoutReport 21/21；case SHA、header SHA、identity、index、路徑越界、缺 shard 六種負例全部拒絕。|
|coverage 不只信 manifest 摘要|yes|source 合格後先 verifyLayoutReport 全數載入核 SHA／identity／summary，再用摘要計算。隔離執行未修改的 coverage-index：v1/v2 均 14/2076、geometry0、missing 清單完全一致。|
|新 matrix 明確啟用分片並讀新舊格式|yes|原始 diff 確認新增 --sharded=1，exit handler 改用 readLayoutReport、readCaseSummaries。未真的啟動新矩陣。|
|舊已載入 matrix 的 collector 參數保持相容|yes|collector 只有 args.sharded==='1' 才分片；未帶參數仍輸出原 v1。原 matrix 的已載入程式不會被磁碟修改熱換。|
|本輪未重啟原長程序|yes|只讀程序清單；矩陣 PID71616、21612 的建立時間分別仍為07:25及07:47，qingming46996仍在。未列到21436，僅表示該次查詢時不在清單，沒有宣稱它仍 live 或由本輪重啟。|
|error-source-audit 可讀 v2|yes（程式路徑）|改為 readLayoutReport，header SHA 先核；此工具只比較 header metadata 裡的錯誤回饋，不宣稱逐 case 畫面檢核。未另重跑所有來源調研或錯誤全集。|
|所有後續工具均已支援 v2|no|assembly-plan.cjs:3 仍 JSON.parse(raw_file)，把 manifest.cases 當完整 case，v2 將缺 id／nodes／blockers。它目前僅 plan-only 且舊索引不含新 v2，未污染官方 R0；之後要用含 v2 的索引前，必須改 reader 並保留 shard provenance。已即時回報 root。|
|全量記憶體固定上界／所有舊大檔可讀|no（未宣稱）|case LRU 預設2、可設0；header 的 sessions／scroll proofs／violations、manifest 摘要仍隨資料量增長。v1 讀取仍需聚合 JSON.parse，已破損 legacy 大檔不會因新 reader 自動修復。此輪未做 GB 級壓力測試。|
|完整 UI gate 通過|no|僅報告儲存與指定 reader 整合驗證，沒有清除布局原旗標或補齊2076契約。|

## 實際重驗

```text
node holiday-lab/layout-qa/report-store-integration/independent-review/verify.cjs
YES real_smoke_full_cases: 21/21 exact saved case equality, order/ID unchanged; nodes=684 blockers=810; 21 screenshot SHA verified
YES manifest_and_header: manifest does not accumulate nodes; original metadata, violations and source receipts retained in verified header
YES bounded_case_cache: lazy Array; zero initial case loads; cache1 eviction actually re-reads
YES negative_fail_closed: 6/6: case SHA/header SHA/identity/index/path/missing shard rejected; all fixtures local
YES unicode_metadata_violations: legacy/v2 full deep equality, control character and split-boundary surrogate retained
YES exact_coverage_consumer: unchanged copied coverage-index executes v1/v2: both14/2076, geometry0, identical missing list, full shards verified; outputs isolated
YES collector_matrix_wiring: opt-in preserves unflagged legacy; new matrix flag and reader present; sharded retention excludes nodes/blockers
YES read_only: original smoke + five reviewed files unchanged during independent verification
INDEPENDENT_REVIEW 8/8 focused checks; full UI gate remains NO
exit 0

node --test holiday-lab/tests/layout-report-store.test.cjs
tests 9 / pass 9 / fail 0 / skipped 0
exit 0
```

測試前將該 child shell 的 TEMP／TMP 指到本目錄 test-temp，確保 fixture 沒寫到其他範圍。測試包含聚合 stringify 低上限重現紅燈、分片轉綠、lazy LRU、缺 shard、SHA／identity／順序／路徑負例、增量 checkpoint、snapshot 不受 caller 後續變更、Unicode、失敗寫入不取代原 manifest。完整 stdout 為 output.txt、node-test-output.txt。

獨立 verify 的 coverage 對照使用本目錄內隔離 repo，複製原程式後核 SHA 相同；沒有修改真正 matrix-runs 或 root 原 report-store-integration/verify.cjs 的輸出。原 smoke 固定為 phase-runs/2026-10-23T02-50-42-725Z/report.json。

## 記憶體與故障界線

readLayoutReport v2 是帶 getter 的真 Array，沒有 eager 展開 nodes；預設 LRU2，verifyLayoutReport 用 cache0，coverage 只保留摘要。使用者若自行 [...r.cases]、filter 回傳全部完整 case 或 stringify 整份 lazy report，仍會由 consumer 再累積資料，不能宣稱全域防爆記憶體。當前指定 coverage 路徑沒有這種完整 case 累積；有限 static candidate 分支只取其代表 case，規模有限，未額外全量重跑。

header 寫入為串流 JSON，但讀取仍是單 header JSON.parse；此處保留全部 sessions／scroll proofs／違規，沒有為減少大小而截斷。按目前分片目的，修正的是全 report 聚合字串上限，不是保證任何單 case 或單 header 永遠不超限。舊已載入矩陣仍會產生 legacy，需由 root 既有 recovery 流程處理；本審查沒有擅自重啟。

## 後續修正獨立複驗：assembly-plan

保留前表原始 NO finding 作為修正前證據。root 隨後改用 readLayoutReport，新增 --index／--out，並明示 v2 pointer 指向完整 logical report，而非物理 manifest entries。只複驗這一 delta，未拿先前 8/8 當新程式驗證。

```text
node holiday-lab/layout-qa/report-store-integration/independent-review/verify-assembly.cjs
ASSEMBLY_DELTA YES exits=0,0 selected=56/2076 wrapperSHA=56/56 logical_v2_pointer=true R0_unchanged=true full_project_approved=false
exit 0
```

獨立實際執行修後 assembly-plan 兩次，輸出限本 independent-review 內：v1/v2 各 selected56/2076，每筆 canonical wrapper SHA、完整 node／blocker 計數、順序相同；原 R0 SHA 不變且 will_write=false、BLOCKED_PLAN_ONLY。root 的 assembly-compatibility.json 與 v1／v2 stdout 亦已讀取並固定 SHA，收據在 assembly-delta-verification.json。故原「assembly reader 未支援 v2」finding 已有修後 YES 證據；其他尚未完成的 UI gate 與記憶體界線不變。
