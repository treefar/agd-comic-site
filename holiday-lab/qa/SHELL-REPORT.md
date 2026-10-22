# 共用外框與首頁：獨立 QA

執行：2026-10-22T13:19:26.081Z；網址：http://127.0.0.1:8800。

命令：`node holiday-lab/qa/shell.cjs --base=http://127.0.0.1:8800 --only=guide-preservation`

結果：yes 3／no 0／總計 3。

| 驗收 | yes/no | 實際證據或錯誤 |
|---|---|---|
| guide-preservation-zh | yes | {"cards":15,"details":47,"faq":30,"sources":15,"faqExpanded":true,"consoleErrors":[]} |
| guide-preservation-en | yes | {"cards":15,"details":47,"faq":30,"sources":15,"faqExpanded":true,"consoleErrors":[]} |
| guide-preservation-ja | yes | {"cards":15,"details":47,"faq":30,"sources":15,"faqExpanded":true,"consoleErrors":[]} |

完整輸出、時間、各尺寸量測與失敗詳情見 shell.json。截圖在 screenshots/。

此腳本使用 Chromium headless 與真實網頁輸入；媒體完整解碼／音量屬工具證據，沒有實體裝置觸控或真人實聽。暫時注入的窄按鈕只在獨立瀏覽器測試頁，未修改來源。沒有 push、修改 main、刪檔。