# 舊DOC純Node全文擷取完成

2026-10-24。兩份既存OLE Word原件的全部FIB文字story範圍已成功擷取並讀完；正式結果在`parsed-r2/`。這次不用Word／COM、不重下載原DOC、不改產品或舊報告。表格版面與115／本屆適用仍為unknown。

## 直接閱讀全文

- [產業實習認定表正文](parsed-r2/recognition-body.txt)：144個UTF-16字元、144個Unicode碼點；含換行與tab。
- [實習單位評分表正文](parsed-r2/evaluation-body.txt)：502個UTF-16字元、502個Unicode碼點；含換行與tab。
- `parsed-r2/{recognition,evaluation}-stories.json`：body、footnotes、endnotes、headers、footers、annotations、textboxes、headerTextboxes共8種story，每種另有UTF-8 txt。
- `fields.json`：已實讀的欄位標籤、CP位置、兩組評分項目與權重；不是推測版面。
- `parsed-r2/*-technical.json`及`extraction.json`：FIB、CLX、piece CP／檔案位置、story邊界、控制字、原件與輸出SHA。
- `parsed-r2/*-raw-ccp*.txt`、`*-raw-all-pieces.txt`、`*-worddocument.bin`、`*-table.bin`：清理前完整文字及原stream技術證據。

## 實讀內容

認定表完整標題為「樹德科技大學動畫與遊戲設計系／產業實習認定表」。欄位包括學生姓名、班別、學號、實習機構名稱及公司印章、機構地址、電話、實習日期、抵免事由、抵免時數，以及指導老師、系主任。表內沒有實填個人資料，也沒有寫最低時數或115當期截止日；不能由這張空白表推導現行門檻。

評分表原始第一行是「樹德科技大學動畫與戲系」，此處照原件保留，沒有自行補成正式系名。另有實習生姓名、學號、實習期間、機構、部門、主管／指導人及職稱。

|評核人|項目|表內佔比|
|---|---|---:|
|主管（指導人）|行政配合與實習態度|18%|
|主管（指導人）|實務學習能力|16%|
|主管（指導人）|專業認定能力|16%|
|主管（指導人）小計||50%|
|實習指導老師|行政配合與實習態度|18%|
|實習指導老師|實務專業技能|16%|
|實習指導老師|實習報告|16%|
|實習指導老師小計||50%|

兩組各有簽章及日期欄，末段是主管評分加指導老師評分的共計欄。上表只描述舊DOC的實際文字，不宣稱這些比例目前仍適用115。

## 為何能稱文字範圍完整

解析方式是word-extractor的OLE／FIB／CLX Piece Table流程，沒有用strings掃描片段。先讀實裝`word.js`、`word-ole-extractor.js`、`document.js`、`filters.js`及`buffer-reader.js`原碼，確認解碼、story順序、標記清理與getter選項後才使用。

|技術界線|認定表|評分表|
|---|---:|---:|
|原件bytes|31744|43008|
|FIB ccpText|144|502|
|FIB ccpHdd|9|37|
|其餘FIB文字story及ccpMcr|全0|全0|
|piece數|1|3|
|宣告CP界線|0,154|0,256,512,540|
|story合計CP|153|539|
|piece末端額外字元|單一CR|單一CR|
|原始正文U+0007表格標記|29|48|
|正文getter與raw去控制字後逐字相同|yes|yes|

所有piece都是UTF-16，各CP起訖、解碼長度與WordDocument檔案位移一致，未越界。另直接以保存的WordDocument byte ranges獨立UTF-16解碼，重建的整個piece文字與raw-all逐字相同。每個story range的實際長度等於FIB，連0長度的footnotes也實驗為空；最後各只餘一個CR，沒有被忽略的正文尾段。

頁首頁尾原始內容仍保存：認定表只有9個CR；評分表有控制標記及PAGE欄位，清理後頁尾含頁碼1。沒有正文以外的註腳、章末註、批註、正文文字方塊或頁首頁尾文字方塊內容。getter輸出全部無U+FFFD。這證成這兩份DOC的文字story完整，不是全格式、圖像或嵌入物件的版面驗收。

`filterUnicode:false`避免把原文引號／破折號改成ASCII。parser內建`clean`仍會把CR與列標記等轉成換行、儲存格標記轉tab，並移除欄位指令及特殊控制字；因此同時保留清理前raw。其段落樣式處理可能把表格列尾改成換行。這兩份正文清理前後去除控制字後逐字相等，未發現非控制正文遺失；不以字串非空代替此檢查。

## 解析器來源、授權與可攜方法

依主控明確授權，僅在本目錄runtime安裝`word-extractor@1.0.4`，MIT，來源[作者程式庫](https://github.com/morungos/node-word-extractor)。實際命令：

```text
npm install --ignore-scripts --no-audit --no-fund --save-exact --prefix C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-20261024/runtime word-extractor@1.0.4 --registry=https://registry.npmjs.org
```

實際stdout為`added 7 packages in 4s`，stderr空、exit0。`install-command.json`照實保存執行後取得的輸出，未為補收據重裝。Node24.15.0、npm11.12.1的實際資料在`npm-metadata.json`，含全部相依版本、resolved及integrity；runtime/package.json與package-lock.json保留。

精確integrity：

```text
sha512-PyAGZQ2gjnVA5kcZAOAxoYciCMaAvu0dbVlw/zxHphhy+3be8cDeYKHJPO8iedIM3Sx0arA/ugKTJyXhZNgo6g==
```

除了lock比對，還讀回既存npm快取tarball18813 bytes，實算SHA512與上值相同，結果在verification.json。沒有執行安裝scripts，沒有改根package。

為離線及跨clone重核，`method/vendor-word-extractor-1.0.4/`保存未改的13份lib原碼及LICENSE、package.json、README共16檔71478 bytes，逐檔SHA在`method/source-manifest.json`。正式extract-r2使用這份副本，OLE路徑只依賴Node內建模組，不依賴未追蹤node_modules；已實跑回歸證實。node_modules保留在隔離runtime但不放交付manifest／不提交。

## 失敗方法與最終路徑

第一輪正式API正文已成功，但本代理附加的診斷range helper錯把非相交piece交給負slice，造成評分表raw範圍520而非FIB502、0長度註腳錯帶字元，`all_story_ranges_covered:false`。這是具體方法紅，原根目錄`extraction.json`、`extraction-command.json`及所有初版文字保持原樣，不能當正式raw範圍證據。

修正只針對本代理helper，以CP交集判斷後才slice，未修改安裝的parser。另有一次PowerShell內嵌引號導致準備命令失敗、未產生extract-r2，對應`extraction-r2-command.json`保留MODULE_NOT_FOUND／exit1。改用prepare-r2.cjs後成功執行；最終正確結果是`parsed-r2/`，實際收據`extraction-r3-command.json`為exit0。

兩輪API正文SHA完全相同：

|正文|SHA-256|
|---|---|
|recognition-body.txt|a00a3a226130eedf26ffde5acc879d12368cf2abe5afc69943d71437327d369c|
|evaluation-body.txt|3f10639975b05b5b7cc2b07961712c74ee1da00bb67d2d117a8d2aff69c1ab02|

原件SHA仍為`4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22`及`741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d`。

## 可回歸的一條命令

在本報告目錄執行，輸出名稱須全新：

```text
node regression.cjs regression-new-01
```

它真正重新讀取兩份原始DOC，經正式extract-r2寫至fresh目錄，並斷言每story raw range長度等於FIB、ccpFtn0、尾CR1、既知正文SHA及獨立位元組解碼，不是只驗舊JSON，也沒有複製range函式當測試。路徑依clone相對解析，不使用Word或網路。

已實際跑`regression-01`；再將來源路徑改為相對clone後實跑`regression-02`，兩檔皆pass、exit0。每次都有`regression-extract-command.json`的實際parser stdout／stderr／exit與`regression-result.json`；原方法紅未覆寫。最終回歸是`regression-02/`，正式供人閱讀的完整文字仍採`parsed-r2/`。

`node run-verify.cjs`實際9 yes／0 no、stderr空、exit0，完整輸出在verify-command.json；這9項只涵蓋套件integrity、原件、CP、stories、控制字、欄位文字與失敗證據保留，不含表格版面或當屆效力。

## 逐項結論

|項目|yes/no/unknown|
|---|---|
|兩份DOC的完整FIB文字story已擷取及實讀|yes|
|每story字數、控制字、piece CP與正文邊界保存|yes|
|兩份原件SHA不變、純Node回歸通過|yes|
|本系認定／評分文字欄位與佔比可讀|yes|
|表格合併、欄寬、列高、頁面版式完整重建|unknown|
|115／本屆直接採用舊表及其評分比例|unknown|

沒有進行網站Build、互動驗收、Word／COM／Unity、AI或產品修改，未改舊報告、未切分支／提交。所有本輪產出限legacy-reader-20261024，本段完成後停止。
