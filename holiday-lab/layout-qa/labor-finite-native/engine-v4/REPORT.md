# Labor engine v4：兩項檢查收緊

2026-10-23。只新增 v4 工程與證據；v3、舊 freeze、產品及既有 native 資料不改。未建立核准、未啟動瀏覽器或全集。GLOBAL_BOUND=NO、使用者確認=NO。

| 驗收事項 | yes/no | 實際證據 |
|---|---|---|
| 原 P2 可先重現 | yes | `pass-consistency-red.txt`：1 pass / 1 fail，原 validator 未拒絕 `checks=false, pass=true` |
| 修後強制完整布林 checks 與 pass 一致 | yes | `engine.cjs` 的 `validateCase` 檢查非空布林 checks，並核 `case.pass === Object.values(case.checks).every(Boolean)`；`tests-freeze-final.txt` |
| 原幾何保存但未納入 pass 的缺口可先重現 | yes | `geometry-red.txt`：2 pass / 1 fail，原 validator 未拒絕保存紅 geometry 卻稱 clear |
| 幾何檢查納入 native pass | yes | `native.cjs` 先執行原 `inspectReport`，保存 `geometry_errors` 並加入 `checks.geometry_clear`；validator 獨立核此旗標與保存陣列一致 |
| false 證據保留，resume 不可當完成而跳過 | yes | 新測試保存完整原 flags/geometry false，再驗 `openAppender` 拒絕 `previous native failure` |
| 三項舊負例及新回歸 | yes | 30 tests / 30 pass / 0 fail，含雙程序 atomic claim、flags 原樣保存、完整 PNG 解碼與新 pass/geometry 負例 |
| 新 freeze 與實際 served/font 收據一致 | yes | `check-final-output.txt`：pass true；50 methods、30 body receipts、2 font files、2784 targets |
| 無核准即拒絕 | yes | `no-approval-output.txt`：`explicit root engine-v4 approval required`；實際 exit 1；檢查 run directory 不存在 |
| native / 全集已通過 | no | 本輪禁止 native/browser；沒有任何新增玩家畫面或 native credit |

## flags 與診斷界線

`method_flags` 仍等於原 sample.violations 是否為空，不清除 SCROLL 或其他 flags。`target_valid` 只呈現其餘檢查結果，`global_method_clear` 呈現原全 sample flags 狀態；兩者均不能取代整體 pass。原 full_range、unclipped、fixed_safe、safe、viewport、font 檢查保留。

`scroll-diagnostic.cjs` 唯讀核歷史 30 cases 與 sample SHA：11 筆 target 診斷有效但 global method 未清，11 筆皆只有非 target owner 的 SCROLL pending。這是舊資料診斷，不是豁免；舊桌面高度 900 原樣記錄，不能充作新契約桌面 1000 已驗。明細在 `historical-scroll-diagnostic.json`。

此修復讓 storage validator 核對「已保存 geometry_errors」與 checks/pass 的一致性；它沒有在 validator 內另行重算幾何。真正 native producer 仍先用原 inspectReport 產出陣列。合成測試不得稱為原生玩家驗收。

## 凍結與核准

- v4 freeze SHA-256：`c237fca824e8a00c4389770529564c06696f20f45f9087805a66a8298981845b`。
- 繼承 v3 freeze SHA-256：`8736fe3b16e9d423c7b89764969398067094dd30cebf250bbc35bb2523883ddb`；loadFreeze 逐項驗繼承方法、source bytes、字型與執行環境。
- schema 4；method `labor-finite-native-engine-v4`；新 approval scope `labor-finite-engine-v4`，必須綁完整 binding digest。v3 scope 不可沿用。
- viewport 固定 320×900 與 1440×1000；目標 2784。此數字是工程計畫，並非已測數。
- `collect.cjs` 目前仍只提供已審的 `--full` 路徑；本輪沒有新增有界 native pilot 模式。後續先由主控審查新 freeze 與核准範圍，不以任意未知參數假稱有界執行。
- 凍結後不再改 `.cjs`。`assertApproval` 的拒絕訊息仍有繼承的「engine-v3」字樣；實際檢查 scope 是 v4，跨版本負例已測，訊息不影響守門邏輯。

## 可重跑命令與真輸出

```text
node --test holiday-lab/layout-qa/labor-finite-native/engine-v4/engine.test.cjs holiday-lab/layout-qa/labor-finite-native/engine-v4/repro.test.cjs holiday-lab/layout-qa/labor-finite-native/engine-v4/pass-consistency.test.cjs
tests 30 / pass 30 / fail 0 / exit 0

node holiday-lab/layout-qa/labor-finite-native/engine-v4/check.cjs
pass true / methods 50 / body_bytes 30 / fonts 2 / targets 2784 / exit 0

node holiday-lab/layout-qa/labor-finite-native/engine-v4/collect.cjs --full --run=no-approval
AssertionError: explicit root engine-v4 approval required
exit 1 (預期拒絕) / RUN_DIRECTORY_EXISTS=False
```

`body_bytes: 30` 是程式輸出的收據筆數欄名，並非總位元組數。完整 stdout 在同目錄 `tests-freeze-final.txt`、`check-final-output.txt`、`no-approval-output.txt`、`freeze-output.txt`；紅燈輸出原樣保留。沒有 stage、commit、push、刪檔或產品修改。
