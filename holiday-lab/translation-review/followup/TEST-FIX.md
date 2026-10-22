# 套用後可重跑的固定基準測試

2026-10-22；只修測試，不改產品或78操作計畫。

原測試fixture會複製目前產品檔，產品套用後因此以新值充當舊值；這是測試設計錯誤。已保留實際紅燈輸出 `test-applied-red.txt`（exit 1、10項中1通過9失敗，含 `OLD_EXACT_MISMATCH EN-RETURN`）。

fixture現在逐檔用 `git show 904ac79937407d748e1bfdbce22517d38acbf8f3:<path>` 讀取 `exact-plan.json` 指定的九個原始檔，固定在審校前版本，再複製到既有忽略的測試目錄。每次執行都重建相同輸入，產品目前是否已套用不影響測試。若該提交或檔案不存在，Git會直接報錯，不回退到目前產品。

|驗收|yes／no|實際結果|
|---|---|---|
|在已套用78操作的root重現原紅燈|yes|`node --test holiday-lab/translation-review/followup/apply-safe.test.mjs`：exit 1；1 pass、9 fail；輸出已保留|
|改固定基準後在相同已套用root重跑|yes|相同命令：exit 0；10 pass、0 fail；完整輸出 `test-fixed-baseline.txt`|
|測試輸入不再取目前產品內容|yes|九檔全部來自plan.source_commit的Git blob；fixture不再copyFileSync產品|
|重新改產品或78操作計畫|no|只改測試與本說明、兩份實測輸出；root既有未提交改動保留|
|Build／瀏覽器驗證|no|這次範圍是測試基礎修補，未執行產品Build或畫面驗證|

這10項檢查驗證計畫的前置檢查、修改範圍與規則相容性，不能當成已套用產品的整合、畫面或玩家通關驗證。
