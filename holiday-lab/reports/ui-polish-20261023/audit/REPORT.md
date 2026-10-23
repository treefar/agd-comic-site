# 現有遊戲UI只讀探索（2026-10-23）

範圍：14款非勞動節遊戲 × zh/en/ja × 320/1440，共84組；測試現有8856內部審閱版。僅真按跳過開場、開始創作，逐字DOM Range分行，不改產品／時間／遊戲狀態。沒有執行勞動節，沒有headful視窗。

實際指令：node holiday-lab/reports/ui-polish-20261023/audit/initial-audit.cjs

實際stdout尾：constitution ja 1440 0；DONE 84 rows 3 with issues。exit0。結果JSON的status pass只指「探索已完成」，不表示排版驗收通過。

| 項目 | yes/no | 實際結果 |
|---|---|---|
| 完成84組頁面探索 | yes | 84rows，pageErrors0 |
| 所有初始頁面無橫向溢位 | yes | 84組pageOverflow=false |
| 所有已掃短文無單字末行 | no | 3個日文320頁面，4個單字末行 |
| 字型缺字驗收／全動態最長字串／重播 | no | 本次未涵蓋，不由初始頁推論 |

## 應先修的真缺陷

1. semester ja320：H1「はじめてのキャンパスマッ／プ」，來源holiday-lab/catalog.mjs；#semester-plan「用事：先に選択｜窓口：未選／択」，來源holiday-lab/games/semester.mjs:57。
2. exhibition ja320：#exhibition-select-2「架空のインタラクティブ作／品」，來源holiday-lab/games/exhibition.mjs:3。
3. constitution ja320：#caption-draft-settings「全文の下書き・12px・1行・2／秒」，來源holiday-lab/games/constitution.mjs:26。

原始逐字行分組見initial-audit.json，三張*-ja-320.png為實頁全長截圖。已目視semester-ja-320.png，標題末行孤字與狀態孤字確實可見。共同CSS：holiday-lab/lab.css以overflow-wrap:anywhere作保底，沒有短標題／短標籤的均衡換行策略。

最小修法方向：先對短標題／按鈕／狀態行嘗試balance或語意分段，不縮小字；數字與單位避免拆開。exhibition日文可評估把冗長「架空のインタラクティブ作品」精簡為保原意的較短用語，但翻譯須另校對。是否採用須在真正320px頁面重驗，這份報告未假裝候選已驗過。

## 歷史缺證不是30個產品bug

固定08 coverage-current.json的missing30全部為五款mid-autumn/national-day/semester/qingming/labor ×三語雙寬的game/error-longest。該檔geometry_errors=0、red=[]。缺的是最長動態錯誤字串完整證據，不等於30個確定溢位；勞動依指示不處理。

## 可重用驗收入口

- holiday-lab/layout-qa/phase-driver.cjs exports {ids,wrong,solve,range,click}；可只讀import後過濾labor，在新本輪資料夾以record callback記錄各階段，options.onGuide可驗真指南。原碼含15款真DOM已知解法，未import遊戲規則或直接改狀態。
- holiday-lab/layout-qa/browser-sampler.cjs exports {sampleLayout}；參數assets來自asset-safe-regions.json；可用原始DOM Range＋Canvas measureText量實際墨跡，另以ui-layout-policy inspectReport檢查。但它會暫加量測marker，必須存method violations，不能把未驗baseline當pass。
- font檢查可讀取CDP CSS.getPlatformFontsForNode，再解析實際字型cmap；document.fonts.check只代表可用，不是每字不缺。可參考translation-review/about-context-rendered/audit.cjs，其每字／樣式技術探針與實際文字收據分開。
- 不直接跑qa/playthrough.cjs或extra-qa/playthrough.cjs來取本輪證據：它們寫舊qa/playthrough.json或latest.json，且前者預設只10款、後者只追加5款。請用新獨立本輪輸出位置保留舊證據。

建議最小充分新批：14款 ×三語雙寬84contexts；intro、menu、help/settings、初始失敗、各成功階段、結果、3段replay、retry與archive，另抽slider min/max/choice labels；字元與來源SHA綁定。此為實用有限範圍驗收，不宣稱窮盡所有輸入組合。
