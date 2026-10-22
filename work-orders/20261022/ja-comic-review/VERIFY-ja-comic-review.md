# 三語漫畫網站與在校指南審閱驗收

2026-10-22，TF-GO／Codex。分支 codex/ja-comic-integration，功能提交 0d9bbd244e47daea171d0dc341cb50ca2661249e（前階段 d53f834）。僅本機審閱，未 push、未改 main、未公開指南或遊戲。

## 可直接查看

- [中文指南](guide/index.html)、[英文指南](guide/index.html?lang=en#/students/guide)、[日文指南](guide/index.html?lang=ja#/students/guide)。原本 outputs/student-guide-official/index.html 也已更新為相同版本。
- 整站本機：[日文首頁](http://127.0.0.1:8797/?lang=ja#hero)、[中文指南](http://127.0.0.1:8797/#/students/guide)。單檔已內建資料、程式、樣式；字型與學校外連仍需網路，其他主站頁面需本機8797伺服器。
- [狀態儀表板](dashboard/index.html)、[研究報告](research-flows/RESEARCH.md)、[處室查閱與缺件](research-flows/coverage.json)。

## 已交付的畫面與內容

- 中文、英文、日文共用官網元件、導覽、頁尾與按鈕，保留漫畫格、網點、章節與翻頁入口。功能按鈕、FAQ不觸發點擊特效；減少動態效果偏好有效。
- 15項資訊、47個可點流程節點與對應說明、30題FAQ、45筆來源記錄。先看流程，再看下方段落；點節點會聚焦對應說明。
- 抵免依[教務處程序](https://www.aca.stu.edu.tw/抵免學分/)修正為5階段，初審後先自行加退選，再送註冊課務組與查核定。休復學與兵役、求助窗口分流，沒有畫成人都必須走完的順序。
- 3筆相關消息：畢展/專題、證照班明示僅官方消息索引及過去活動；[HC實習成果](https://www.stu.edu.tw/latestnews-single/?id=223564)有單篇官方網址，明示歷屆成果而非當期甄選。不由本機news id猜官網文章URL。
- 移除學生求助卡及FAQ對教職員職場調查/活動聯絡的程序引用；來源物件保留歷史，未刪檔。

## 實際驗收（逐項yes／no）

| 結果 | 指令或檢查 | 實際結果／證據 |
|---|---|---|
| yes | `node scripts/build.mjs` | exit 0；完整輸出：[build.txt](build.txt) |
| yes | `node scripts/check-dist.mjs` | exit 0；完整輸出：[check.txt](check.txt) |
| yes | `node --test tests/student-guide.test.cjs tests/japanese.test.cjs tests/en-release.test.cjs tests/shared-language.test.cjs` | exit 0；完整輸出：[tests.txt](tests.txt) |
| yes | `node scripts/audit-review-translations.cjs` | exit 0；完整輸出：[catalog.txt](catalog.txt) |
| yes | `node scripts/review-guards.cjs` | exit 0；完整輸出：[guards.txt](guards.txt) |
| yes | 主站完整三語路由（d53f834） | `PASS trilingual route checks 321 guide action runs 12`；[原始結果](before-flows/browser-results.json)。其後修改集中指南流程、資料與補譯。 |
| yes | 最新 `QA_QUICK=1 node scripts/trilingual-smoke.cjs` | `PASS trilingual route checks 60 guide action runs 12`；[最新結果](browser/results.json)。1440/390頁面、指南1440/768/390/320三語，分類、搜尋、8快捷、FAQ鍵盤、特效、減少動態、47節點跳轉與分流無箭頭皆驗。 |
| yes | `QA_LANGS=zh,en,ja C:/agywork/agd-guide-qa-venv/Scripts/python.exe scripts/student-guide-text-audit.py` | 18組（1440/390/320、FAQ收合/展開），違規合計0，`negative-control detected`；[結果](text-audit.json)。先前英文標籤旋轉及箭頭行高失敗證據亦留底，未排除檢查規則。 |
| yes | `node scripts/review-delivery-smoke.cjs <輸出目錄>` | `PASS exported guide: 3 languages, 47 paragraphs, search and language switching`；[結果](delivery-smoke.json)。 |
| yes | 翻譯覆蓋與數字複核 | `EXACT COVERAGE 2310 keys`；英日缺漏0、未處理數字差異0、疑似截短長段落0。[字典檢核](catalog-audit.json)、[英文數字逐筆判定](numeric-resolutions.json)。不把自動覆蓋等同母語審校。 |
| yes | `build-dashboard.js`／`verify-dashboard.js --authority scripts/review-dashboard-authority.cjs` | `25/25 PASS`；資料、工具、使用者三層分開，使用者確認0。[資料](dashboard-input.json)。 |
| yes | `node work/dashboard-smoke.cjs` | `PASS dashboard desktop/mobile: search, filters, counts, no overflow`；[結果](dashboard-smoke.json)。無可展開資料列，展開列檢查不適用。 |
| yes | 原交接C節、原中文主站JSON及styles.css、main refs保護 | `PASS unchanged C section, original Chinese fields/styles and main refs; added guide explanations authorized true`。只允許已列出的抵免、休復學步驟與錯誤來源修正；[基準](baseline-guards.json)。 |

完整執行環境：程式命令於 C:/agywork/agd-student-guide-preview 執行；Playwright及Sharp透過 PLAYWRIGHT_MODULE/SHARP_MODULE 指向 C:/agywork/agd-site-codex/node_modules。QA_URL預設127.0.0.1:8797，QA_OUTPUT指本資料夾。

26項回歸測試通過；流程新測試先觀察到缺少流程資料而失敗，完成資料與介面後轉綠。功能提交前.githooks/pre-commit另實跑26測試及中文6組文字邊框，均過。Build既有duplicate color警告仍在；未執行Lint（專案無獨立Lint指令）。

## 來源可讀範圍與待確認

依8組單位盤點辦法、表單、FAQ、入口與消息，共37筆研究來源：本輪全文5、官方索引19、前輪PDF5、前輪研究8。沒有宣稱各單位所有歷年資料均已全文讀取；45是網站來源記錄池，含歷史/研究限制記錄，不是45份現行規章通過確認。

當屆專題/畢展文件、完整實習與證照細則、現行英檢門檻、完整請假/學生權益受理文件、當期海外甄選及見學費用補助仍待取得。部分校方正文403，已標索引或歷史，未代填猜測條件。實體手機與日文母語審校未執行。

日文與英文指南原AGY翻譯已回收，沒有重跑付費或原批次。首批runner把自身log判FAKE的原始報告保留，經逐筆鍵與內容核對，不將它改寫成runner PASS；後續隔離批次正常完成。

## 重開預覽與下一步

在 C:/agywork/agd-student-guide-preview 執行 `node scripts/serve-student-preview.cjs dist 8797`，再開上述本機連結。若8797已在監聽就沿用，不重複啟動。

下一步由主任審閱圖解、白話內容與日文；缺少文件按coverage向承辦確認。未獲新的公開授權前，不 push、不上線，也不發布遊戲。原正式站保持1b8322e。
