# 元旦：有限拒絕文字的完整量測

來源為固定的 8845 審閱站及 `phase-runs/2026-10-23T00-02-29-772Z` 原始資料；沒有修改產品、sampler 或 safe-region map。

| 驗收 | yes/no | 證據 |
|---|---|---|
| 正常 UI 可觸發的 11 種拒絕文字逐項列出 | yes | custom-catalog.cjs、guard_reachability |
| 414 筆既有實際回饋與來源文字一致 | yes | exact-feedback-audit.json、verification.json |
| 中英日 × 320／1440 六情境均覆蓋 | yes | contexts 的逐項 coverage |
| game-hint 及適用的 ny-observation 均完整、未裁字、在紙面內 | yes | rows.nodes；需捲動者附原始 scroll proof |
| 六個代表保留完整原 case 及圖片 SHA | yes | canonical-candidates.json、representatives |
| 完整專案 UI gate 通過 | no | 本報告只證明此有限錯誤文字範圍，原始其他 method flags 保留 |

實際指令：`node holiday-lab/layout-qa/static-error-max-4/check.cjs`。

第一個檢查版本曾因來源守門字串與實際程式不一致而中止；`failure.txt` 留底。讀取實際來源後修正檢查，沒有修改遊戲邏輯。成功輸出另存 `verify-output.txt`。本證據使用舊固定來源；較新日文 focus 文句的來源差異與量測證據須另外對照，不能視作全站最新來源認證。
