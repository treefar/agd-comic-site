# 勞動完整有限域工具：暫停交接

2026-10-23。使用者要求到段落暫停、重開程式，主控已要求立即停止新功能／測試／native。本檔是本工單唯一新增檔案，**工具未實作、未 ready、未 freeze、未批准採集**。

## 本段已完成

- 只有唯讀分析：重讀原 `engine-v4-root-review-20261023/bounded-guard.cjs`、原 `browser-sampler.cjs` 的 flags 生成規則，以及歷史 scroll diagnostic。
- 唯讀載入主控已完成的 `engine-v4-root-review-20261023/bounded-runs/root-calibration-01`。原資料可由 v4 `verifyRun` 讀出；本段沒有修改該 run、原 review、freeze 或 native12。
- 觀察該既有 12 筆：手機六筆原 flags 空；桌機保留 SCROLL pending，EN/JA 部分另有精確 non-target `TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT`。只是分析既有資料，**不是本段新增 native、完整域結果或 UI PASS**。
- 已向主控提出兩層與 fresh-only 設計，尚未寫任何執行工具或新測試。

## 必須保留的來源與界線

- 原 v4 freeze SHA：`c237fca824e8a00c4389770529564c06696f20f45f9087805a66a8298981845b`。
- 原 bounded review freeze SHA：`ec5f8b567f40c628221808ca7542e6b0e7a320dcac1b0e36e1c59814745f3b3e`。
- 全原 plan 必須是 2784 targets／2754 context-jobs，320×900、1440×1000；不得縮域或消除不利資料。
- v4 的 P2「可刪 false check」仍未閉合，原負例保持紅。新 full 工具的 storage 寫入與 offline verify 均需精確九鍵與獨立重算，不能只靠 producer 自述。
- 每筆原完整 case 的 pass／global flags 必須照原樣保存。新 `domain target measurement` 有效性另判；不能把整包原 false 改為 true，也不能授整包 UI PASS。
- 尚無新 approval scope、plan、freeze、collector、storage wrapper 或完整域證據。

## 已討論但尚未實作／驗證的設計

1. 重用原正常 v4 native，建立新的獨立 guard。九鍵逐鍵／布林／pass 公式、原 flags 深等、全 case geometry 原 policy 重算、完整 source/font/DOM/PNG 都需獨立核。
2. Domain 有效性要求除 `method_flags` 外全部八項 checks true，且全 case geometry 清、精確 target owner 沒有待解旗標。unknown 一律 NO。
3. 精確 non-target scroll 分類僅擬議：SCROLL pending 數字必須等於完整 hidden_scroll_text 長度，逐筆 owner／clip 有證且不等於 actual target owner；TEXT_CLIPPED 必須精確 owner＋原 text，並有實際 clipped ink。不得只靠前綴或範例推全域。此分類**尚未寫碼或通過測試**。
4. 擬採 fresh/full-only；atomic mkdir 取得 run owner，加原 lease genesis／最新 owner 驗證；每 target immutable attempt start/end、完整 sharded case/sample/PNG、inventory/checkpoint/hash-chain。原 flags false 照存；真正 target failure 先保存再停，不自動 retry/resume/skip。
5. Storage wrapper 與 offline verify 都需重跑獨立 guard；原 v4 的 openAppender 不可直接用來跳過原 false。

## 重開後第一個具體動作

先讀本檔與主控最新交接，確認使用者已恢復工作。然後唯讀重驗原 v4／bounded freeze 與已存在 native12，**先完成新 full guard 的最小失敗測試**（九鍵缺失、target／unknown flag、false 原樣保留與 domain 層分離），再實作 guard；其後才做 storage／attempt／atomic-owner／offline verify 與故障測試。全部工具完成、新 freeze 與主控審碼批准以前，不開新 browser/native/full。

## 暫停時程序與驗證狀態

- 本工單沒有啟動任何背景程序、browser、native、full run 或新測試；沒有需要關閉的自有工作程序。
- 本段唯讀 Node／PowerShell 指令均已同步結束，沒有留待重啟的程序或 session。
- 未 stage、commit、push、修改 main、刪檔或還原他人修改。
- 原其他成果由主控接手；不要把本 checkpoint 誤認成 full 工具交付。
