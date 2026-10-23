# 分片報告接入驗證

依 verify 的 bug 修復分級處理：保留原始 RangeError、低門檻 mutation 紅綠測試，再驗實際瀏覽器採樣及相容 reader。

| 驗收 | yes/no | 實際證據 |
|---|---|---|
| store 模組回歸測試 | yes | `node --test holiday-lab/tests/layout-report-store.test.cjs`，9/9 |
| collector 不再聚合完整 cases 字串 | yes | `--sharded=1` 逐筆 append；記憶體 report.cases 只保留 id 與 geometry_errors；完整原 c 仍存 shard 與 .case.json |
| 真瀏覽器流程完成 | yes | constitution/zh/320，21 frames、三段自然回放、route complete、geometry0 |
| 每片 full case 與原 .case.json 深比一致 | yes | verify.cjs，21/21；逐片 SHA、identity 驗證 |
| v1 舊單檔與 v2 分片 coverage 相同 | yes | verify.cjs：兩者均 14/2076，missing 清單完全相同 |
| plan-only assembly 支援分片 | yes | 新增可選 --index／--out 供隔離驗證；v1／v2 均選56例，全部 wrapper SHA 相同，官方 R0 不動；v2 pointer 明示須經 logical reader 解析 |
| 新 phase-matrix 使用分片並支援 v1/v2 | yes | 新啟動傳入 --sharded=1，reader 改為深模組；實際新整批矩陣尚未重跑 |
| 既有載入中的 matrix／collector 相容 | yes | 原程序未重啟；無新旗標仍寫 legacy。這也表示既有 legacy 長程序尚未獲得分片修復，仍須監看 |
| coverage 完整驗 shard，而非只相信 manifest | yes | verifyLayoutReport 逐片驗 SHA 後才計完整列；索引另標示 hash scope |
| 所有歷史診斷工具均已改讀 v2 | no | 目前接入 phase-matrix、coverage-index、error-source-audit；舊 closure／static／export 工具的來源仍須逐項確認，不可直接交付 v2 給未支援者 |
| 全專案 build／全部 UI gate 通過 | no | 本次只修改 QA 工具；執行 CJS 語法、純模組及真 DOM 整合驗證，沒有重建未變動的網站或改官方 R0 |

實際 smoke 指令：

```text
LAYOUT_QA_URL=http://127.0.0.1:8845
node holiday-lab/layout-qa/phase-collect.cjs --games=constitution --languages=zh --widths=320 --phase-only=1 --scrolls=0 --sharded=1
PARTIAL_RED 21 frames; geometry=0; .../phase-runs/2026-10-23T02-50-42-725Z
```

該指令 exit 0，PARTIAL_RED 表示其窄範圍不構成完整契約證明。`verify-output.txt` 保存後續實際讀檔重驗輸出；`runs/` 保存 v1/v2 相容性測試的真輸出。這次沒有改 sampler、asset map、產品或 UI 素材；沒有 push、發布、碰 main 或刪檔。
