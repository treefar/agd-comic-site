# QA 完整報告分片儲存修復模組

本分支只交付深模組、回歸測試與整合規格，尚未接入 collector／consumer；沒有宣稱已修復已終止的 semester 採樣或已重跑採樣。

## 問題與修法

原 `phase-collect.cjs:15` 每 20 cases 對整份 report 執行 `JSON.stringify(report,null,2)`，單一聚合字串會觸及 Node 字串上限。根據主控實查，semester 程序已 exit 1，原 log 為 `RangeError: Invalid string length`，最後有效 report 為 535,311,587 bytes；這份實際程序診斷由主控提供，本分支沒有重新啟動／修改原採樣程序。

本測試用 4000 字元門檻重現同一聚合失敗，沒有建立 512 MB fixture。修復後 writer 以小 JSON token 串寫（字串每 512 個 UTF-16 code units 轉義，64 KiB buffer），每個完整 case 獨立檔案與 SHA。完整 header 另存，manifest 最後 rename 提交；保留原 schema_version、所有 nodes、blockers、metadata、原 ID、欄位與案例順序。同 ID 的不同 width／intent 以原序號分檔，不去重、不以 ID 當檔名。

## 接入介面

```js
const {createLayoutReportWriter,readLayoutReport,readCaseSummaries,verifyLayoutReport}
  = require('./layout-report-store.cjs');
const writer=createLayoutReportWriter(reportFile);
// 每個 c 完整建好且當次幾何／screenshot 證據已確定後呼叫一次。
writer.appendCase(c);
// header 可傳現有 report；cases 會排除，舊 case 不重寫。
writer.checkpoint(report);
const report=readLayoutReport(reportFile,{cacheSize:2});
// 真 Array：length、at、迭代、map/filter/reduce 與既有 full object 讀取相容。
const fullCase=report.cases[0];
const smallIndex=readCaseSummaries(reportFile); // 不載入 case nodes/blockers
verifyLayoutReport(reportFile); // 有界 cache，逐片驗 SHA／identity／summary
```

另有 `writeLayoutReport(file, report)` 供一次性小檔轉換，不適合每 20 frame 重新呼叫。writer 為新 generation，不會自動接續舊 manifest；回復既有採樣需主控另設 resume 來源與失敗狀態，不能把未採到的內容補造。

v2 的 report.json 是 `layout_report_store_version:2` manifest，report 的業務 `schema_version` 原值存在完整 header；v1 舊完整 JSON 維持原樣讀取。reader 預設最多快取兩個 full cases；summary 是小索引（ID／width／height／intent／original_state／replay_shot／geometry_errors／screenshot）。metadata/header 會一次讀取，舊 v1 也仍一次解析；本次解決聚合 full-case nodes，不宣稱任意單一巨型 shard/header 的無限容量。

## Reader 改動清單（主控分派，尚未改）

| consumer | 需整合位置／理由 |
|---|---|
| phase-collect.cjs:15,40 | factory 一次建立；case 完成後 appendCase；persist 只 checkpoint。原 sample/.case.json 保留，錯誤／PARTIAL 不改。collect.cjs、front-collect.cjs 若改寫 v2 也需同樣接入 |
| phase-matrix.cjs:7 | details 改 readLayoutReport；geometry/filter 改 summaries，避免 filter 留住完整 nodes |
| coverage-index.cjs:3 | 主 raw report 改 reader；純 ID／geometry／screenshot 改 summaries。min140/static proof 是不同自訂 report，不可盲目全部替換 |
| error-source-audit.cjs:19 | raw metadata 改 reader；不需載 cases |
| controls-closure-08.cjs:2–4 | raw 改 reader；選 frames 先用 summary 找 index，再按需讀 full cases。現 map/filter 會保留 full payload，僅換 reader 仍可能保留過多記憶體 |
| artifact-closure-08.cjs、controls-dynamic-supplement-08.cjs、coverage-pending-08.cjs | 讀 phase raw 的 JSON.parse 改 reader；其自有 proof／sample JSON 保持原解析 |
| static-error-max/check.cjs、static-error-max-2/check.cjs、static-error-max-3/check.cjs | 各自 read helper 目前直接 parse raw；需區分 phase report 與單 case／自有 proof，原 SHA 與完整 case 比對仍保留 |
| phase-summary.cjs、source-receipt-08.cjs、matrix-export.cjs、export-followup.cjs | phase report 來源需支援 v2；僅 status／summary 本身的 JSON 不改 |
| 其他歷史診斷工具 | 完整搜尋結果在 reader-search-output.txt；含 freeze／map／status 的命中不代表 phase report consumer，逐來源辨識後才改 |

v2 raw_sha256 只代表 manifest bytes，驗證完整來源時必須連同 manifest 內每片 SHA／header SHA 驗證，不能直接把舊單檔 SHA 語意平移成全內容已驗。`readCaseSummaries` 為索引讀取，故意不驗每片存在；不能單憑索引宣稱 full case 已驗。readLayoutReport 取個別 case 時驗該片，verifyLayoutReport 逐片完整驗。

reader 回傳的 cases 視為唯讀資料；LRU 被移出後會重讀原片，消費端不能依賴在記憶體修改 case 能保存。若消費端自行 `.map(c=>c)`、filter 或 JSON.stringify 整份回傳值，仍可能把所有 full nodes 留住／重新聚合；這屬消費端需改的範圍。

## 驗證

`node reports/report-store-repair/check-repair.cjs`：保留臨時的 legacy aggregate mutant，執行同一測試後 exit 1 且抓到 Invalid string length；真模組 exit 0。原 module-missing RED、首次 GREEN、mutant RED、最終 GREEN 輸出皆留存。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 低門檻原聚合錯誤能重現 | yes | mutation-red-output.txt；legacy_range_error_reproduced=true |
| 完整 JSON 值深比、Unicode、跨 chunk surrogate／控制字元 | yes | green-output.txt |
| v1／v2、真 Array、lazy getter、小 LRU | yes | green-output.txt；初始 case loads=0，兩片容量逐項斷言 |
| 同 ID 不同 width／intent 不丟失 | yes | green-output.txt；8 cases 原序保留 |
| 缺片、SHA 錯、identity 錯、重複 index、逃逸路徑拒絕 | yes | green-output.txt |
| 失敗 checkpoint 不替換舊 manifest，案例原值變動不回寫 | yes | green-output.txt |
| collector／全部 reader 已接入 | no | 此分支範圍不含整合 |
| 512 MB 實體檔／live collector／全站 build 測試 | no | 依工單禁止；只測 QA 純模組，不改產品 |

測試所有資料只新增 temp，沒有刪除測試資料；failed pending shards 也保留，模組沒有刪除／清運功能。沒有 push、main 變更或重啟程序。
