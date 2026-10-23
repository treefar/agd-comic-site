# 和平聆聽 preview 六筆整合 v4

日期：2026-10-23。僅本機診斷整合；不是新原生採樣、正式報告或上線版本。

## 改動範圍

- `coverage-index.cjs` 只新增 `--peace-preview=.../canonical-candidates.json` optional flag。使用專用 `loadPeacePreview` 驗原始來源、完整候選與固定方法後，接入六筆原始 wrapper 與 run。
- `assembly-plan.cjs` 只新增 `peace-listening-preview` kind，透過 `loadIndexedPeacePreview` 重新驗 indexed binding，再保留完整 pointer 與 wrapper SHA。
- 沒有修改 `verified-supplement.cjs`、`peace-preview-evidence.cjs`、`compare.cjs`、採樣器、runtime、v3 或舊證據。
- 新 `peace-preview-integration.test.cjs` 的六項回歸使用明示 synthetic CLI fixture，測 optional 行為、嚴格 loader 的錯誤傳遞、整個 nodes/blockers/flags/sample metadata 的保留與不隱式匯入。它們不充作玩家原生證據。

## 測試證據

```text
node --test holiday-lab/tests/peace-preview-integration.test.cjs
修正前 tests-red.txt：tests 6 / pass 2 / fail 4
修正後 tests-green-final.txt：tests 6 / pass 6 / fail 0 / exit 0
```

`tests-green.txt` 保留中途測試 fixture 的 VM realm prototype 差異失敗。最終僅將跨 realm JSON receipt 正規化再深比，沒有放寬產品斷言，也沒有刪除該次輸出。

## 實際單次 index

完整指令在 `index-command.json`：沿 v3/index-command.json 保留所有參數、8845 base、phase `2026-10-22T23-47-50-142Z`、front `2026-10-22T23-48-00-964Z`；只新增 peace flag 並更換 v4 out。

唯一執行 PID 69048，creation `2026-10-23T04:44:43.3753032Z`。來源前置收據在 `input-receipts-before.json`。未因 stdout 空白而重啟；終態與原輸出在 `index-status.json`、`index-stdout.txt`、`index-stderr.txt`。

實際 stdout：`COVERAGE required=2076 covered=2046 missing=30 geometryErrors=0; PARTIAL_RED`。PID 已終止；後附 Process handle 未取得 exit code，原 `index-status.json` 保留 `exit_code:null`，不能稱已捕捉 Node exit 0，也沒有重跑大 index。

## 已完成的獨立基準比較

```text
node holiday-lab/layout-qa/supplement-integration-20261023/compare.cjs <v3/coverage-current.json> <v4/coverage-current.json> <v4/baseline-comparison.json>
exit 0
pass true; before 2040; after 2046; required 2076; missing 30; added_count 6
all_prior_keys_preserved true
all_prior_run_bindings_preserved true
full_project_approved false
```

完整參數與原輸出在 `baseline-comparison-output.txt` 及 `baseline-comparison.json`，包含兩份 index／contract 的真 SHA。此比較包含舊 run 的 method fingerprints 與 eligible keys，沒有只比摘要數字。

組裝以一次性 `run-assembly.cjs` 的 `cp.spawn` 記錄真 close code；命令在 `assembly-command.json`，driver 28292／child 63924。**真 child close exit 0**，時間 `2026-10-23T04:49:39.183Z`。本輪仍是 `PARTIAL_RED / BLOCKED_PLAN_ONLY`。

## 完整計畫驗收

```text
node holiday-lab/layout-qa/supplement-integration-20261023/v4/check-plan.cjs
exit 0 （check-plan-output-final.txt）
pass true
selected 2046 / required 2076 / missing 30
prior_selected_full_wrappers_unchanged 2040
supplement_full_wrappers_sha_verified 126
peace_full_wrappers_sha_verified 6
peace_nodes 180 / peace_blockers 218
peace_flags_preserved [0,2,0,1,0,2]（proof 的語言優先順序）
inputs_before_after_unchanged true
official_unchanged true
official_sha256 cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336
full_project_approved false
```

`check-plan-output.txt` 保留首次工具誤把 contract 寬度優先順序與 proof 語言優先順序直接比陣列的紅燈。最後改成先驗六個唯一完整 key 集相等，再逐 key 重建原 wrapper／sample／flags；並另存 flags 的明確 proof 順序。沒有改 index、plan、原筆或允許缺 key。

| 驗收條件 | yes/no | 證據 |
|---|---|---|
| Optional flag 不影響未啟用的既有流程，嚴格 loader 失敗須往外拋出 | yes | 六項紅綠回歸；產品兩檔各只新增一行 |
| 實際覆蓋只增加指定和平六筆，全部舊 key／run source bindings 保留 | yes | root compare 真執行 exit 0；2040→2046 |
| 舊 126 筆 supplements 完整 wrapper SHA 可重建 | yes | 12 finite-literal-errors、90 qingming-sessions、24 finite-mobile-hints |
| 全部舊 2040 selected 記錄包含 wrapper SHA／pointer metadata 逐欄保持 | yes | `check-plan.cjs` 深等全部舊 row，不只比數量 |
| 和平六筆原 nodes／blockers／嵌入 sample 與 screenshot SHA 完整保留 | yes | 六個 wrapper SHA、180 nodes、218 blockers，sample 的 canonical JSON SHA 與原檔 SHA 皆核對 |
| 原 geometry array／sample violations 明確留在 wrapper_metadata | yes | 原 `[0,2,0,1,0,2]` 方法旗標數，沒有清空寬版 scroll／clip 待解事項 |
| 官方 R0 與 source before／after 不動 | yes | 固定 R0 SHA、`input-receipts-before.json` 與 `input-receipts-after.json` |
| 大 index 的 Node exit code 已確實取得 | no | 原始 null 留存；改以實體 index、完整 key/source/wrapper 與獨立重建驗證，不重跑 |
| 新 native/full matrix／遊戲通關／正式發布 | no | 沒有開瀏覽器或採集、沒有改舊原始證據、沒有清 flags、沒有寫 official report |

可以將本輪視為「v4 補件整合驗證通過」，不能將 2046 筆來源覆蓋稱為 2046 筆所有 UI 規則通過。仍缺 30 筆，原方法旗標仍待主控 typed ledger 逐項處理。未 stage、commit、push、修改 main 或刪檔。
