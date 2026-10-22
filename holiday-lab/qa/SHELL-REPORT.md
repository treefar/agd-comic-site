# 共用外框與首頁：獨立 QA

執行：2026-10-22T13:17:24.994Z；網址：http://127.0.0.1:8800。

命令：`node holiday-lab/qa/shell.cjs --base=http://127.0.0.1:8800 --only=intro-first-RAF`

結果：yes 0／no 1／總計 1。

| 驗收 | yes/no | 實際證據或錯誤 |
|---|---|---|
| intro-first-RAF-timestamp-regression | no | "Opening requested cg-0: http://127.0.0.1:8800/holiday-lab/assets/children/cg-0.webp" |

完整輸出、時間、各尺寸量測與失敗詳情見 shell.json。截圖在 screenshots/。

此腳本使用 Chromium headless 與真實網頁輸入；媒體完整解碼／音量屬工具證據，沒有實體裝置觸控或真人實聽。暫時注入的窄按鈕只在獨立瀏覽器測試頁，未修改來源。沒有 push、修改 main、刪檔。