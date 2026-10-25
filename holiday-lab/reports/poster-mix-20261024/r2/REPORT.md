# 2026-10-24 第二輪：套用 Fable 顧問 8 項（8900）

source_agent: claude（Opus 5.5）；TF-GO。分支 `codex/poster-mix24`，未 commit、未 push、未發布、未碰 main、未刪檔，C 節未動。建置 `.measure-poster-mix-20261024-03`（80 檔、`app-73QZMYRE.js`），服務 `http://127.0.0.1:8900/`。8897 原版保留；我開的 8898／8899 中途版已關閉（程序停止，檔案保留）。

## 使用者在對話中的選擇（選項題）
- 先做三條：手機加報名入口、浮動鈕不壓面板、報名鈕改導到可用處。
- 可讀性：手機海報變清楚、面板小字放大、指南搜尋變好用。（減動態全站開關未選，未做）
- 內容：拿掉內部用語。（新聞排序未選，未做）
- 《癡迷的現實》縮圖：下載進 images/。

## 逐條 yes/no

| # | 項目 | 結果 | 改了什麼 | 證據 |
|---|---|---|---|---|
| 1 | 手機選單有聯絡入口 | yes | `comic-components.jsx` 選單尾加 `LINE 聯絡系主任`（`.nav-mobile-only`，≥1181 隱藏）；「招生資訊」原本就在選單 | `browser.json` mobile_375x812 |
| 2 | 桌面浮動鈕不擋面板 | yes（1440 三語）／partial（1366） | `student-work-draw.jsx` 量面板位置設 `html[data-hero-panel-visible]`；`student-work-draw.css` ≥1181 時面板在畫面內就隱藏浮動鈕 | 1440 中英日各 29 步 blocked=[]；1366 只驗頁頂 |
| 3 | 頂欄按鈕不再導到「全部已結束」 | yes | `ADMISSION_OPEN=false` 時頂欄顯示「我適合哪個管道 →」連 `#/guide/start`；116 簡章公布後改 true 即恢復「立即報名」 | 三語 headerCta |
| 4 | `#join` 第一眼就有可用行動 | yes | `chapters-2.jsx` 黃色提示下加「3 題找出入學管道 →」「LINE 聯絡系主任」，不寫任何日期 | 三語 joinButtons |
| 5 | 手機海報不被集中線蓋住 | yes | hero 集中線 `opacity:.06!important`（只限 hero） | 375 寬 0.06＋截圖 |
| 6 | 面板字級 | yes | 署名 11→12px（手機 13）、靜態模式 11→12、按鈕 12→13 | 三語 fonts |
| 7 | 指南多詞＋同義詞搜尋 | yes | `student-guide-model.js` 空白分詞 AND；同義詞 獎學金→獎助／助學／勵學、多益→TOEIC、全民英檢→英檢（皆經測試確認目標詞存在於 guide.json） | 新測試＋zh 4 查詢 |
| 8 | 搜尋框免捲動可見 | yes | 搜尋列移到「分類索引」上方，搜尋時多一個「顯示 N／15 項資訊 ↓」跳轉 | y 1157→485 |
| 9 | 常用項目無固定藍底 | yes | 刪 `student-guide.css` `.sg-shortcuts button:last-child` | blueShortcuts=0 |
| 10 | 頁底無「暫緩」 | yes | 刪 `holiday-home.jsx` `#festival-paused-note` | 三語 pausedNote=false |
| 11 | 指南「尚未上線」黑條有開關 | yes | `scripts/build.mjs` 注入 `globalThis.AGD_REVIEW_BUILD`；審閱建置照常顯示，將來公開建置自動隱藏 | reviewBar=true（審閱建置） |
| 12 | 癡迷的現實海報離線可用 | yes | 下載 174,156 bytes 1280×720 JPEG 到 `images/news/7200-obsessive-reality.jpg`，資料保留 `imageSource` | `guard.json` new_image |
| 13 | 抽選回歸 | yes | | `test-draw-command.json` 10/10 |
| 14 | 指南回歸 | yes | 新增 2 個測試（先 red 後 green） | `test-guide-command.json` 11/11 |
| 15 | 全套 tests | no（既有失敗 3） | 56/59；3 個失敗涉及 data/admission.json、guide.json 來源註記日譯、works.json「小颯」英譯，三檔本輪皆未改（guard untouched=true） | `test-all-command.json` |
| 16 | Build | yes | exit 0、Unpaired 0 | 主控指令輸出 |
| 17 | 保全 5 檔、origin/main | yes | | `guard.json` |

## 中途失敗（保留不刪）
- 第一版浮動鈕隱藏用 IntersectionObserver，窗格內 callback 不觸發（fired=false），8899 實測靜態模式被擋。已改為 scroll/resize 量位置，8899 收據不升格。
- 做「改動前對照」時 tar 解壓遇中文長路徑中斷，`node --test` 拿到空清單，在暫存副本（%TEMP%\agd-head-baseline-1024）自動跑了歷史節日 QA 測試。檢查後工作樹無新增或修改檔、保全 SHA 不變；暫存副本未刪，留待使用者決定。此為意外執行，不是解凍節日 QA，也不當任何證據。

## 未做
真機、母語、完整 WCAG、Console 逐頁、1366 捲動中段、減動態總開關、新聞排序、海報縮圖 srcset、學長姐見證。
