# 開學小遊戲原採樣資料恢復

恢復對象為 `phase-runs/2026-10-23T00-38-18-660Z` 已終止的原 run。本目錄只恢復已落地資料，沒有重新採樣、重啟 collector、操作瀏覽器或更動原 raw。

## 先行盤點

- 原 `progress.json` 記錄 2964 frames；原 `*.case.json` 共 2964 個，原檔名末尾序號 0…2963 連續、無重複。
- 實際 metadata 只有 **11 sessions**，不是 12。10 筆為 `route-complete-layout-not-certified`，皆記錄 replay 0、1、2、3。
- `ja / 1440 / graduation-first` 是第 11 筆，原狀態 `route-failed`，原 failure 為 `RangeError: Invalid string length`。`ja / 1440 / credit-first` 未開始，不能補成 session。
- canonical graduation-first 僅 **5／6 route-complete**，第 6 組部分採到；credit-first 為 5 complete、1 not-started。這是路線採樣完整度，不是版面通過／發布許可。
- 原 metadata 沒有 `runtime_receipts_unchanged` 或 after 收據；本次不補原 collect after，也不以新時間查到的來源偽稱原採樣全程來源穩定。

盤點先執行 `node recovery.cjs --inventory`，完整輸出與 session 狀態分別在 `inventory-output.txt`、`inventory.json`，再啟動恢復。

## 恢復方式

`recovery.cjs` 按原 capture 序號逐筆讀取完整 c；對原 sample 的 nodes、blockers、replay_shot 做深比，並驗原 screenshot SHA。每個完整 c 原封交現成分片 store，不按 ID 去重。新 `recovered-run/report.json` 為 v2 manifest，逐片保留原 ID、intent、width、nodes、blockers、geometry_errors、screenshot 等所有案例欄位。

原 sample 與原圖複製到新 run 的同名相對路徑，讓既有 `c.screenshot.file` 與衍生 sample 路徑維持有效，不為移動修改 c。原 `progress.metadata` 整體逐值保存，包括失敗狀態、failure stack 與既有 receipts；另加頂層 recovery 欄標示 recovered／original_collector_completed=false／original_after_receipt_available=false／new_capture_performed=false。

第一次恢復已完成所有分片／複製，但 violations 總數 guard 未過，exit1，原失敗 stdout 保留。沒有重跑複製；`finalize-existing.cjs` 直接驗既有分片、原樣製成 manifest。

`checkpoint-window.cjs` 使用兩個各4MiB視窗（metadata 本身約7MB，最後4MB找不到頂層邊界的失敗亦保留），精確擷取原有效 checkpoint 的 violations。實查最後有效 checkpoint 為 **2944 frames、2897 flags**，不是推測的2960。其全部 flags 已和前2944筆原 sample 逐字深比。

頂層 violations 保留這2897筆原文；後20frames的20筆 sample flags與已知 routefailure 另放 `recovery.extra_known_violations`（21筆）。progress 原 count2919比2897+21多 **1筆**，原 terminal collector 旗標全文未落地，**不補造**。`unrecovered_original_violation_count:1`、`original_violations_fully_recovered:false` 明列缺口。所有2964個完整 c／原 sample 與 metadata 仍可原值恢復；這不代表原最終 violations 全文已恢復。

沒有把 535,311,587-byte 原 report 讀成字串或 JSON.parse；驗證只以固定 64 KiB buffer 串流取得其 SHA。沒有聲稱完整 2964 frames 已存在原最後一次有效聚合 checkpoint，來源以逐 frame case／sample／image 為準。

## 驗收與限制

驗證指令：`node verify.cjs`，實際 exit0；完整 stdout 在 `verify-output.txt`，逐項機器結果在 `verification.json`。2964片 full case／原 c／原新 sample／原新圖片均完成逐筆核對，metadata exact value 通過。

| 項目 | yes／no | 依據 |
|---|---|---|
| capture 序號連續且無重複 | yes | inventory.json；verify 逐原檔序號核對 |
| 全部完整案例與原 c 深比相同 | yes | all_full_cases_deep_equal_original=true |
| 原／新 sample 與原／新圖片 SHA 逐筆核對 | yes | 原始逐項 receipts 與 verification |
| metadata exact value 保留 | yes | metadata_exact_value=true |
| 原最終 violations 全文完整恢復 | no | 原 checkpoint2897＋已知追加21；原 count2919中1筆全文未知，不補造 |
| 12 sessions 全完成 | no | 原 metadata 僅 11，complete10／partial1／not-started1 |
| canonical graduation-first 六組全完成 | no | 原資料只有5 complete，第6 partial |
| 有原始 postreceipt／原 run 正常完成 | no | 原 progress 無 after；恢復不創造原採樣收據 |
| 全案已通過／可發布 | no | full_project_approved=false |

`current-source-receipt.json` 另外記錄恢復後當下8845的13檔，bytes SHA 都等於原 before；其 is_original_collector_after=false，不能回推原採樣全程來源穩定。沒有把這份新收據加入原 metadata。

原始檔、原有效 report 與失敗狀態保留；未 push、未碰 main、未刪檔。未 stage／commit，本資料夾交主控另行保存。`.gitignore` 僅排除 `/recovered-run/`；頂層 `recovered-run.manifest.json` 是 manifest 原樣快照、`manifest-reference.json` 記原載入位置／SHA／檔數／bytes。快照的相對 shard 路徑仍從原 recovered-run 解析，不能把快照當獨立完整 report 交另一台讀取。

新 recovered-run 包含完整案例分片、sample、圖片，屬大份本機原始證據，**沒有確認跨機備份**；只將 manifest／code／receipts 納版控，不代表全部 shards／sample／images 或原 run 已備份。所有原始資料留原地，沒有清運授權。
