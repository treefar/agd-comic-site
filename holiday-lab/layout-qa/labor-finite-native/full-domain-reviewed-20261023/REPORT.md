# 勞動完整 target-domain 工具：待主控審碼

2026-10-23。本輪已交付可執行的 `full.cjs`、`guard.cjs`、`store.cjs`、`full.test.cjs`；新完整計畫與 freeze 已建立，**沒有批准採集，沒有啟動 browser/native/full-run，沒有新的畫面或完整域結果**。

## 已執行的驗證

| 項目 | 實測結果 | stdout |
| --- | --- | --- |
| 首次 L3 測試 | guard 尚未實作，MODULE_NOT_FOUND／exit 1；工具呼叫輸出留在本次對話 | 對話工具輸出 |
| 新工具回歸與真資料整合 | 9 tests、9 pass、0 fail、exit 0 | `tests-output.txt` |
| 原 v4 完整九鍵缺口負例 | 1 test、0 pass、1 fail，子程序 exit 1；原問題仍紅 | `original-v4-negative-output.txt` |
| 新 plan/freeze | 2784 targets、2754 context-jobs、200 個 dependency files，exit 0 | `prepare-output.txt` |
| 唯讀 full preflight | 完整來源與字型 receipts／原方法／新方法／dependency tree 一致，exit 0 | `preflight-output.txt` |
| 無新批准直接 execute | 在 native 載入前拒絕，exit 1，`full-run` 不存在 | `no-approval-output.txt` |

九個測試包含精確九鍵、每鍵布林、完整 pass 公式、geometry 矛盾、flags 洗白、假 PNG、target/unknown flags、hidden scroll 數量／owner／clips 失證、fresh atomic claim、不可重複 attempt、owner 變更、half-write、target 失敗完整保存後停、以及攻擊者重建 shard/SHA/inventory/checkpoint 後仍被 offline 獨立九鍵重算拒絕。沒有把合成程序身分探針冒充真 OS 競態驗證；本輪未重跑舊 30 個 engine tests。

只讀原 `root-calibration-01` 的十二筆真 case/sample/PNG，逐筆新 guard 重算全過。原手機六筆 `pass:true`、桌機六筆 `pass:false` 與完整原 flags 均未修改。這只是新 guard 對既有資料的整合測試，**對 2784 全集的採集 credit 是零**。測試副本與故障注入只落在本目錄 `test-evidence/`，不是新原生證據。

## 可審查的實作

- `guard.cjs` 重用原 bounded guard 的唯讀完整九鍵與原 policy 重算。case 的 `checks/pass/global_method_clear/target_valid/method_violations` 原樣保存，另外傳回 `domain.valid`，沒有把整個 case 轉綠。
- target-domain 要求八個非 `method_flags` 的 target checks 全 true；全 case geometry、DOM before/after、完整 nodes/blockers、sources/fonts before/after、CDP font faces、viewport scroll proof、解碼 PNG 均接受原嚴格 guard 重核，另核 target_node、lang、diagnostics 與 rejection source identity。
- 只有兩種原始旗標可明確分離：精確 `SCROLL_CONTENT_PENDING N ...` 必須等於完整 hidden ledger 長度，且逐筆 owner 與 target 不同、有正有限 ink/clips、實際有一個裁切矩形與 ink 完全分離；精確 `TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT owner text` 必須唯一對到原 non-target node，且原 ink 是 unclipped ink 內實際縮小的矩形。隱藏 target、未知旗標、缺證或不唯一，一律 domain NO。原旗標與原 global false 不移除。
- `store.cjs` 用 atomic `mkdir` 取得唯一 fresh owner。保存 owner、lease genesis、完整 plan/meta；start/end/checkpoint 使用 exclusive write。每次寫入前與 commit 前重查 owner 檔、實際程序身分、meta/plan。沒有 resume、retry、skip 或接手 owner 入口。
- 每筆完整 case 與完整 sample 使用原 sharded report store，PNG 原 bytes 另存，原 case 的 screenshot 欄位亦原樣保存；引用與 SHA 存在外部 inventory，不改寫原 case。每筆 event 綁前一 hash、target、lease、完整 shard inventory 與獨立 domain 結果。offline 再讀原 case/sample/PNG 重算 guard 與 domain，比對保存結果。
- 真正 target 失敗或 guard 拒絕先保存完整已回傳資料、outcome、attempt end、inventory/checkpoint，再停止。native 在回傳資料前拋錯時只能保存 attempt 與 exception；不宣稱有尚未取得的 case/sample/PNG。half-write／未完成 attempt／孤兒資料一律拒絕 offline 驗證，不自動修復。
- collector 固定原完整 2784 plan，2754 distinct context-jobs，zh/en/ja 與 320×900／1440×1000。使用原正常 v4 native 的 click/fill/save/scroll，不改 source/text。只有固定 `full-run/` 一次採集，沒有傳入子集、limit 或第二個 run 名稱的 CLI。
- 完整 verification 逐筆釋放 case/sample/PNG，只留摘要與 lazy loader，避免把 2784 份完整 node evidence 同時保留在記憶體。

## 新 freeze 與專用批准範圍

```text
scope
labor-complete-target-domain-reviewed-2784-20261023

full-freeze.json SHA-256
972bda82020a5f60241a0105e858d64545d565c3e18368492d05bdaeac37cd3c

原 v4 freeze SHA-256
c237fca824e8a00c4389770529564c06696f20f45f9087805a66a8298981845b
```

`full-freeze.json` 另外綁完整 source/font/runtime binding、新工具所有 CJS、原 bounded-guard、完整 plan 的 raw/canonical SHA，以及 Playwright、playwright-core、pngjs 套件完整依賴檔案樹 200 份。原 v4 binding 再綁原 native/plan/domain/sampler/policy/PNG decoder、原始 source bytes 與字型、Node/Chromium 執行檔。舊 pilot/bounded/full approval 均不接受。

主控審碼接受後才建立新 approval，欄位如下；本輪沒有寫任何 `approved:true` 檔案：

```json
{
  "approved": true,
  "scope": "labor-complete-target-domain-reviewed-2784-20261023",
  "freeze_sha256": "972bda82020a5f60241a0105e858d64545d565c3e18368492d05bdaeac37cd3c",
  "plan_file_sha256": "928efb53f74fa0378db969c2f485e39470e3284550dc02e94812d6fd9e590468",
  "v4_freeze_sha256": "c237fca824e8a00c4389770529564c06696f20f45f9087805a66a8298981845b",
  "target_count": 2784,
  "context_job_count": 2754
}
```

```text
node full.cjs --preflight
node full.cjs --execute <新專用批准檔.json>
node full.cjs --verify
```

`--verify` 不開 browser、不重新採集；完整成功還必須核 `completion.json` 的 source_after 與獨立計算的統計、最後 hash。任何失敗保留原證據與 `failure.json`，不允許接續。`global_ui_pass` 與 `full_project_approved` 的交付值固定 false，不能把 target-domain 的有效性當整頁 UI 通過。

未執行：新 native/full、畫面檢視、完整 2784 採集；原因是依工單必須先交主控審碼並取得新 scope 批准。未修改產品／舊 engine／sampler／contract／map／原證據或 root 索引；未 stage、commit、push、main、刪檔。
