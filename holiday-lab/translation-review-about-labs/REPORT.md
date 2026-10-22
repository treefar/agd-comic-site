# 系所介紹與實驗室：103鍵完整日英文審校

2026-10-23；固定來源提交`d48f5d9a479db1449d932b815a6cff4d0a827f76`。只新增本資料夾，沒有修改產品、發布、push、刪檔、換字型或啟動Unity。

本責任範圍103個唯一中文鍵、206個英日目標全部逐鍵讀完，涵蓋12間實驗室的名稱、簡介、內文與首頁About／Labs的標題、按鈕、統計、漫畫字效及拆分片段。44個譯值提出精確修改、134個保留；另28個片段語境值歸入2組整句修正，沒有把28個單字都算成翻錯。

## 首頁真正會看見的問題

用headless瀏覽器實讀8819凍結版，等networkidle與字型就緒，取得真的DOM文字：

|位置|英文實際文字節錄|日文實際文字節錄|
|---|---|---|
|系所介紹主標|We train professionals inanimation、game design…|育成アニメーション制作、…に必要な専門人材。|
|系所歷史段|firstDepartment／asAnimation／inVision／Awardsand，另殘留」，及、|2006成立句缺設立動詞；整段語序需要重新組合|

這是跨span拆詞翻譯造成的語序、空白與標點問題，單看字典有key會漏掉。`context-current.json`保留完整DOM與HTML；兩張`context-heading-*.png`是修改前截圖。代理已實看日文主標圖，不將它當修好證據。

`exact-plan.json/context_fixes`給兩組完整原意、英日整句、元件與精確source anchor。主控應使用整句富文字範本處理字序，保留動畫／遊戲原有紅藍強調與兩個年份的粗體。不要把全站「、」統一映射成逗號，也不要只補一個空格便宣稱日文完整。

主標日文提案：

> アニメーション制作、ゲームデザイン、映像・音声のポストプロダクション、インタラクティブデザイン（AR / VR）に携わる専門人材を育成します。

## 覆蓋與去重

|來源|處數|本批完成|
|---|---:|---|
|data/labs.json的12間實驗室|36|名稱、簡介、內文全部|
|首頁LABS資料|24|全部|
|首頁AboutChapter|44|全部，含跨節點片段|
|首頁LabsChapter|16|全部|
|合計|120|去重後103鍵、兩語206值|

先前明列已審鍵0；103鍵中33個是至少24字的長文。只有「放視大賞」與news的7個gallery欄位共用，它在本批核官方名並保留。`coveredKeys.json`列全部103鍵，`inventory.json/disjointIds`以key的SHA產生穩定ID；另組news／works應排除這103鍵，避免把同一字典鍵兩邊派工。

103列逐鍵的原文、當前活躍英日譯文、個別理由與保留／修改／上下文處置在`reviewed.json`。沒有用「只挑幾項」代表此範圍完成，也沒有宣稱本批已審完其餘news、works或在校指南動態狀態。

## 44個精確譯值提案

`exact-plan.json/operations`保存每筆真檔案、JSON pointer、完整old/new、當前活躍值、理由與proposal_only狀態。重點包括：

- 直噴機未說只能印衣服，移除direct-to-garment的限縮；腳踏車不擅縮成特定健身車型。
- 體感環境改成一般讀者較懂的motion-sensing，入口和同一實驗室名稱一起處理；虛擬運動館入口名稱也和內文一致。
- 停格動畫的立體造型是實體製作，避免被當成數位3D建模；不新增模型材料、軌道品牌或使用資格。
- 自媒體的We-Media／自メディア改成可理解的independent media／個人メディア；從標題、內文到首頁短名均保留對應。
- 「使用引擎開發」不譯成從零開發引擎；實況串流不強行增加実況解說；B1明確地下1階。
- 三創三項是創意、創新、創業，避免Three-Creativity把三項都變創意；保留「三創」原名和完整說明，不發明正式縮寫。
- 英文必修補required；空白的「屆」恢復cohorts；協同授課不等於共同開設課程。
- 日文20+的既有20名以上可作概數保留，不從加號推造更精確人數；所有統計數字、教室位置、軟體品牌與原連結保留。

這些是解釋性翻譯改善，實驗室正式英日名稱未取得校方核定時仍標未確認。沒有把譯名提案當成學校已正式更名。

## 官方依據與未核事項

- [放視大賞執行單位TAIC](https://taic.info/vision-get-wild)可全文讀取，明列放視大賞及Vision Get WILD；保留既有名稱。[金犢獎主辦官方資料](https://www.ad-young.com/WebMethod/GetHomePageTopYear)的雙語subject欄支持Times Young Creative Awards。僅核名稱，未據此核定所有得獎數或招生規則。
- [系網英文介紹](https://www.dgd.stu.edu.tw/%E8%8B%B1%E6%96%87/)官方索引支持2011更名，[系網舊教師頁](https://www.dgd.stu.edu.tw/jerome/)官方索引支持民國95年成立與原「全國第一」敘述。直接英文頁403；保留原歷史主張，但不宣稱另完成全國系史排名研究。
- [系網support頁](https://www.dgd.stu.edu.tw/support/)索引列部分實驗室名稱與代號，直接403；沒有取得12間完整最新雙語規格，設備數量與功能未重新實地盤點。
- [HC公司概要](https://hautecouture.jp/about/)正式列株式会社オートクチュール，前批已實讀公司名、松山據點及樹德合作史。本批只提案修選定日文側欄的公司名稱，其他年度、人數與國家數均不動。
- 平均15+年、12間、120+獎、四加四攝錄音室、4年128學分、4年22人／3國8公司／9場／5學期／20+／600+等仍按來源翻譯，不把語義通過當成每個現況數字新核定。「不需後期製作」是原稿宣稱，適用條件仍待單位界定，不新增普遍技術保證。
- Maker文化通論的歷史與文化主張未另做研究驗證，只忠實翻原稿並去除「特異な興味」的貶義。搜尋出現南臺STUST與別校設備，均未拿來核定樹德本系。

逐項狀態與用途在`official-checks.json`，未核正式名稱與原文事實邊界亦在`reviewed.json/pending`。母語者、本人正式名稱確認與使用者畫面核可仍未執行。

## yes／no與原始指令

|驗收|yes／no|實際指令輸出／界線|
|---|---|---|
|103鍵全部有兩語個別處置|yes|`node holiday-lab/translation-review-about-labs/review.cjs` → keys103、target_values206、revised_values44、context_values28、retained_values134|
|120來源處逐筆固定基準查證|yes|`node holiday-lab/translation-review-about-labs/verify.cjs http://127.0.0.1:8819` → fixed_source_occurrences_120 yes|
|讀真正活躍鍵及實際編譯字典|yes|同指令 → `ABOUT_LABS_REVIEW 11 yes 0 no KEYS103 COMPILED 206/206 PRODUCT_FILES_WRITTEN0`|
|44個真JSON舊值在fixed與root一致|yes|同指令 → 44_target_old_values_exact yes；不是只看raw英文資料|
|About問題有真DOM前置證據|yes|`node read-context.cjs` → 兩語主標及歷史段已讀；完整context-current.json|
|103coveredKeys、跨origin分工可重用|yes|complete_disjoint_scope／remaining_news_works_disjoint皆yes；共享1鍵明列|
|未偷偷改產品或用新譯探針假稱已生效|yes|來源SHA前後相同；產品寫入0，所有新譯仍proposal_only|
|新譯已套用並完成窄版、字形墨跡與排版驗證|no|未改產品、未Build；截圖是前置問題，不是提案套用畫面|
|官方正式名稱、所有數字及母語者審校完成|no|限制如上，不將語義對照充作身份／設備／制度查證|

首次固定blob來源驗證假紅，是原inventory的JSX字元位置出自CRLF工作樹，而git show取出的檔案是LF。已用固定blob的AST行號與精確正規化文字逐筆重新錨定，再驗AST起點與來源值；舊位置另存original_snapshot_pointer，沒有擴大字元搜尋範圍硬過關。初次輸出保留`verification-first-offset-red.json`與txt。103個穩定ID與coveredKeys未變，最終120處皆通過。

優先整合兩個About完整句，再採44筆字典修正，照既有建置流程產locale並驗首頁與12個詳頁的英日顯示；僅有206個當前字典值通過仍不代表整頁自然、資訊完整或缺字／排版全部通過。
