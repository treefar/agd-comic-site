# 十二筆新譯文：最小缺字複驗

2026-10-22；預覽 `http://127.0.0.1:8813/` 對應 `.review-faculty-03`。獨立啟動8813，沒有動8800／8804／8805。server exec session 77517 留供root；未停止任何伺服器。

只驗新套用12筆P1文字，沒有重跑原105狀態，沒有改產品或舊紀錄。日文8筆、英文4筆全部已在active DOM找到，逐字實際字型與cmap核對通過，**本次不需避字改句或換字體**。

|範圍|active／cmap|實際字型|
|---|---|---|
|日文師資角色5筆：合聘2、從聘2、留職停薪1|5／5 yes|Yu Gothic|
|日文註冊課務組窗口3筆|3／3 yes|Yu Gothic|
|英文請假、休學、115-1公告、技優班說明4筆|4／4 yes|Noto Sans TC（CDP內部名 Noto Sans TC Thin）|

三頁為日文首頁師資錨點、展開日文指南、展開英文指南。各筆顯示原文、computed字型／字重、真正文字節點平台字型、逐字同樣字型鏈的CDP探針與截圖在 `audit.json`。這次逐字比對 **全部非空白字元**，含拉丁字母、標點／全形符號、漢字與假名，合計272個字元／修句配對；不是把先前漢字／假名結果套給英文。

`coverage.json`：12／12 yes、missing 0、unknown 0、font parse errors 0；復用上一批已取得的字型檔與本機字型，不另下載字體。人名、正式窗口原名、角色譯文均未修改。已檢視 `JA-JOINT-01.png`，字形完整可讀；沒有宣稱逐張完整視覺驗收或新04整包已通過。

首次腳本僅找exact text且hash切到guide後未等guide元件，出現7／12 active；並非缺字。已增加等待 `#student-guide`，來源連結尾端的「↗」與「其他協助」前綴則允許完整新句嵌入UI文字。首輪 `audit-first.json`／`audit-output.txt` 保留；修正後 `audit.json`／`audit-corrected-output.txt` 為12／12。`matchMode=1` 是exact，`2` 是UI前後綴；verify再次檢查完整新句確實包含在actual文字中。

實際命令與輸出：

```powershell
node holiday-lab/serve-review.mjs .review-faculty-03 8813
node holiday-lab/redesign/glyph-copy/post-translation/audit.cjs
$env:PYTHONIOENCODING='utf-8'
python holiday-lab/redesign/glyph-copy/post-translation/coverage.py
node holiday-lab/redesign/glyph-copy/post-translation/verify.cjs
node --check holiday-lab/redesign/glyph-copy/post-translation/audit.cjs
node --check holiday-lab/redesign/glyph-copy/post-translation/verify.cjs
node --check holiday-lab/redesign/glyph-copy/post-translation/compare-build.cjs
git diff --cached --check -- holiday-lab/redesign/glyph-copy/post-translation
```

```text
ACTIVE_TOTAL 12/12 PAGES 3 ERRORS 0
RESULT 12 /12 ALL_NONSPACE_CHARACTER_PAIRS 272 PARSE_ERRORS 0
RESULT 12/12 YES; 272 non-whitespace character/string pairs; 3 pages; no product writes
```

|驗收|yes／no|實際證據|
|---|---|---|
|12筆新譯文在新版active DOM出現|yes|audit-corrected-output.txt、verify-output.txt|
|中日／拉丁／符號逐字真實字型+cmap|yes|coverage-output.txt；272／272、missing0／unknown0|
|保留既有字體與原意|yes|沒有產品寫入、沒有替換句|
|同輪所有詳頁／所有語言／裝置通過|no|只驗指定12筆、1440px Windows Chromium3頁|
|最終05整包畫面已驗|no|本報告實際渲染取樣03；05文字／字型依賴另已比對一致，不把背景CSS調整宣稱成整包視覺通過|

提供最終05逐檔receipt：`audit.json` 的receipts含03 index、bundle、styles、student-guide CSS、兩份JSON與faculty-portrait CSS的SHA／大小。實際執行：

```powershell
node holiday-lab/redesign/glyph-copy/post-translation/compare-build.cjs .review-faculty-05 .review-faculty-03
```

03→05 的 index／bundle 因師資照片背景DOM增加而可變，不能硬要求整個bundle SHA相同。helper以Babel AST找出兩語完整字典，靜態讀StringLiteral與無插值TemplateLiteral，不執行bundle；逐鍵排序序列化後計算SHA。完整compiled locale與CSS字型鏈、兩份JSON結果如下，原文見 `receipt-05-corrected-output.txt`／`locale-font-receipts.json`：

```text
YES styles.css 24568f90a3e5eb6140043db56af68c7148ff7e12148081cf9bcffe7a409ca666
YES student-guide.css 43679385ebd03c8569c45dfe638d843079d2fd5d858b81e88058ee4fa0df07c0
YES data/ja/messages.json 2adc801b34da61e24aa0e69a7efc292e79129bfaaa648690eeadb6f9d4fd652d
YES data/en/student-guide-ui.json de6bb2add613822e75664ccac8803d8b8ebb1eeb82f6eed254fa363ade4ebfcd
ALLOWED_LAYOUT_BUNDLE_DELTA app-MPI5UJSD.js → app-K6E6TA3D.js
YES compiled locale-en 2310 entries b5749851d46e192f65033409b2d49b0d23867663502777dfd239b7555b0abb8c
YES compiled locale-ja 2339 entries 7bc7f4b859724c6b2ba13e47139f8446b78af1bbdfe8cc70c3030edbb393064a
YES font-family declaration chain 225339d782adf0fcfe3e77a49e9b5033c3cf9f794d36d7aeb6552ee33fe25ad0
ALLOWED_PHOTO_CSS_DELTA faculty-portrait.css
FONT_TEXT_RECEIPT_MISMATCHES 0; does not replace a full next-build visual check
```

首次AST helper未處理esbuild把多行純字串改成無插值TemplateLiteral，未找出字典；失敗輸出保留在 `receipt-05-output.txt`。修正靜態字串型別後重新完整解析，兩語各唯一字典、全字典SHA比對通過。未把parser失敗當成產品文字變更。

`faculty-portrait.css` 是預期可差異的照片補邊CSS，明確列出允許差異；font-family鏈另取三CSS的宣告清單核對。05依賴一致，可沿用03的12筆新值字形證據；仍不取代05整包畫面檢查。helper需本機03與05完整build，以及專案的 `@babel/parser`。
