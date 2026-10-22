# 首頁消息與作品：下一批日英文語義審校

2026-10-23；只新增本資料夾，沒有改產品、重建、發布、推送、刪檔或啟動Unity。接續既有職階／師資／FAQ審校，避免重做已明列審過的字串。

完成19段中文原文、38個英日目標值：13個譯值提出修正、25個保留，另有1項需中文原文與翻譯鍵同步處理的公司專名提案。這些是審閱提案，沒有宣稱已生效或新排版通過。

## 全部待審盤點與選擇理由

`inventory.json`完整列475處來源、348個唯一中文鍵。包含news/works/labs三份canonical JSON，以及首頁NEWS、WORKS、LABS、AboutChapter、WorksChapter、LabsChapter內的中文文字；短標籤也留表，正規化長度至少24字的長文有168個唯一鍵。不是整個網站所有動態拼接與其他元件的全集。

|來源範圍|中文來源處數|其中長文處數|
|---|---:|---:|
|news JSON|209|124|
|works JSON|55|20|
|labs JSON|36|21|
|首頁NEWS|57|37|
|AboutChapter|44|4|
|首頁LABS|24|12|
|LabsChapter|16|3|
|首頁WORKS|14|2|
|WorksChapter|20|2|

與先前明列語義審校資料對照，有8個唯一鍵已出現，剩340個唯一鍵待審。這8個鍵並非8篇全文；重複人名與共用句亦按相同精確鍵計。初審catalog只是盤點，不拿它當逐句審完。

先選讀者從首頁會遇到的最新三則證照課程、固定赴日實習頭條、前三個作品卡，以及點入後的兩篇作品介紹。原先三則各列標題／摘要／內文，排除兩個已審摘要，再加首頁赴日實習短標，形成19個不重複原文。其餘321個唯一鍵仍待後批處理；包括about與labs，本輪沒有宣稱完成其全文審校。

## 每段兩語的處置

|ID|原文範圍|英文|日文|
|---|---|---|---|
|01|Unity課程標題|保留|保留|
|02|Unity課程內文|保留|修正公告日相對用語|
|03|After Effects課程標題|保留|保留|
|04|After Effects課程內文|保留|修正公告日相對用語|
|05|Photoshop課程標題|保留|保留|
|06|Photoshop課程摘要|保留|保留|
|07|Photoshop課程內文|保留|修正公告日相對用語|
|08|赴日實習長標題|第九屆改ninth cohort、自然句式|保留|
|09|赴日實習摘要|清楚交代實習與交流、計畫留原名|保留|
|10|赴日實習全文|屆次、公司名、AR小標、人名及計畫名|公司名、實習選拔、上一屆、學用合一|
|11|Dear, All Robots作品卡標題|保留|保留|
|12|Dear, All Robots作品卡媒體報導|保留|保留|
|13|2026競賽佳績榜作品卡標題|保留|避免把入圍都稱受賞|
|14|4競賽14件入圍／7部畢製|保留|14件紀錄，不是14部作品|
|15|四部學生動畫影展作品卡標題|保留|保留|
|16|21+入圍／四大洲|保留|保留不同影展選出與提名階段|
|17|Dear, All Robots全文|保留|有機會不譯成必ず保證|
|18|失竊的祕方作品簡介|修正懸空句與老師稱呼|保留|
|19|赴日實習首頁短標|保留|刪日本海外重複表達|

完整原文／實際活躍現譯／新譯／保留理由都在`reviewed.json`。`exact-plan.json`的13筆操作各有真JSON檔案、pointer、完整old/new、理由、尚未採用旗標。英文操作4筆、日文9筆；不以原始英文欄位中的CHECK文字當成當前顯示漏譯。

英文Professor有時可作廣義敬稱，不能單憑一詞認定教師已被升職；本批原文只說老師，改成faculty advisor與原中文姓名，避免與正教授職階混淆，同時修好原英文不完整的開頭句。學生姓名、作品英名未取到本人核定，仍明列待確認，不因此自行重拼。

## 需要三語連動的公司名

最新赴日實習中文寫「オートクチュール株式会社」。[合作方官方公司概要](https://hautecouture.jp/about/)實列「株式会社オートクチュール」，並列英文hautecouture Inc.、松山據點及2015年與樹徳科技大学技術交換提携。這三個身分錨點支持它是文章的合作方。

另有[不同公司的官方頁](https://hautecouture.co.jp/about/)使用「オートクチュール株式会社」，成立時間與代表不同。前後順序不能視為可隨意交換的別名；也沒有把這家不同公司當本系合作方。

因此另列`canonical_proposals[0]`：最新文章中文只更正此公司名，英文與日文亦同批修。因整段中文是日文查表鍵，必須把舊長鍵遷移成新長鍵，不能只改canonical或只改可見日文。提案清楚保存from/to。其他歷史文章或未選中的位置尚未批次修改，不宣稱公司名已全站統一。

## 原文事實與正式名稱的界線

- [校方赴日實習新聞](https://www.stu.edu.tw/latestnews-single/?id=223564)官方索引能讀到第九屆、四人、松山、近三個月及AR等內容；直接頁面403。用它支持明列事實，沒有聲稱重驗每句引述，也不補資格、薪資、簽證或保證錄取。
- [CommonWealth原採訪](https://english.cw.com.tw/article/article.action?id=4814)可全文讀取，支持片名、媒體報導與「仍有機會」的敘述強度；不把未來方向保證成必然。
- 三則115-1證照公告未找到可獨立讀取的同筆官方課程頁。本批保留原日期、名額、教室、考試、全勤要求與聯絡方式；翻譯對照通過不等於現在還有名額或開放報名。Unity「第二張證照」的具體課程脈絡亦未另行核定，未擅改成全球證照排名。
- 學海築夢的英文在本批未取得核定名稱，提案留制度中文原名及overseas internship說明。博物館、協會、AR活動的既有英譯、學生自用羅馬字、作品The Stolen Recipe正式英名仍列待確認，不套用同名或拼音推測。
- 14件與7部是忠實保留來源的計數單位，未宣稱本批重新計算四大競賽全部名單。語義審校、事實核定與正式名稱核定分開。

官方可讀狀態與逐項用途在`official-checks.json`。

## 實際驗收與重跑

|驗收|yes／no|實際指令輸出或限制|
|---|---|---|
|全部範圍先盤點再選批次|yes|`node holiday-lab/translation-review-content-next/inventory.cjs` → 475處、348鍵、168長文鍵、340待審鍵、選19|
|19段各有兩語保留／修正理由|yes|`node holiday-lab/translation-review-content-next/review.cjs` → source_units19、target_values38、revised_values13、retained_values25|
|來源、活躍字典、完整old值與計畫一致|yes|`node holiday-lab/translation-review-content-next/verify.cjs http://127.0.0.1:8819` → `CONTENT_REVIEW 12 yes 0 no SOURCES 19 COMPILED_VALUES 38/38 PRODUCT_FILES_WRITTEN 0`|
|實際編譯版本可讀到38個當前譯值|yes|讀8819實際index與hashed app，解析兩語字典AST；沒有執行bundle或把探針當畫面|
|漂移可拒絕|yes|只在記憶體複製品注入old值漂移，`negative_in_memory_drift_rejected` yes；未寫任何產品|
|來源前後不變|yes|本輪所讀受保護檔案SHA前後相同，收據在verification.json|
|所有13新譯已套用並在真頁面驗過|no|本批只交提案，未改產品、Build或做新譯文DOM／字型／排版檢查|
|全站或321個剩餘鍵已審完|no|本批僅19段；about/labs與其餘消息作品後批續審|
|母語者與本人正式名稱均確認|no|沒有母語者簽核，未確認項如上|

首次編譯抽取只有31/38，原因是工具只認StringLiteral，但esbuild把七個多行英文值編成無插值TemplateLiteral。讀實際bundle後補靜態template解析，才得到38/38；初次紅燈完整保留`verification-first-compiled-red.json`及txt。沒有把工具漏抽誤報成產品缺譯，也沒有放寬來源精確相等條件。

原始輸出`verify-output.txt`，完整機器收據`verification.json`。主控採用後應照原建置流程重建locale，對變更的首頁與對應詳頁做英日窄版／桌面、字型及長文顯示檢查；公司名修正須連同canonical與長鍵遷移一起處理。此只讀驗證器檢查的是採用前精確基準，不可在採用後把old值漂移當成修正失敗。

## 補交：安全套用器與固定基準回歸

主控已核准本批canonical公司名更正。新增`apply-safe.mjs`，預設dry-run；本代理仍未對root執行apply。

```text
node holiday-lab/translation-review-content-next/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes
node holiday-lab/translation-review-content-next/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --apply
node holiday-lab/translation-review-content-next/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --verify-applied
```

最後一條以真實固定版本build scripts的虛擬輸出，驗證新英文與日文長鍵均不遺漏，但不寫locale檔。主控照既有流程真正重建locale後，再加`--verify-applied --require-generated`，會額外核對磁碟上的兩份locale，舊字典會被拒絕。這仍不能取代新譯文的真頁面排版與字型檢查。

- 計畫與全部fixture來源固定在`d48f5d9a479db1449d932b815a6cff4d0a827f76`，使用git show，沒有拿可變工作樹產品充當期望基準。計畫、13筆數量、檔案／pointer、old/new或canonical超出公司名的變更，均拒絕。
- 全4檔先讀取，核13筆exact old、canonical只變公司名、JA舊鍵存在及新鍵不碰撞，再於記憶體中改值和遷移鍵。任何一筆preflight失敗都不寫產品。
- 以固定版本的實際英文／日文生成器及當前真overlay，在虛擬檔案輸出中生成字典，逐筆核13個新值及公司名新鍵，舊長鍵不殘留。不是另寫一個可能忽略overlay順序的簡化生成器。讀取的JSON、JSX、build scripts、可選檔案存在狀態與data目錄清單均保留供並行重驗。
- apply前再比較所有已讀來源、可選檔與目錄清單；target、overlay、build來源或新增data檔並行變更均拒絕。prepare回傳物被竄改亦拒絕。保留非目標欄位和其他新增資料；不重寫整個根目錄。
- 真正apply只依序寫4個JSON檔，不宣稱跨檔原子交易；磁碟I/O故障仍可能留下部分寫入，主控應檢查git diff與輸出。沒有用清檔、重設或還原其他代理改動處理失敗。

實測：

|驗收|yes／no|實際輸出|
|---|---|---|
|固定基準回歸測試|yes|`node --test holiday-lab/translation-review-content-next/review.test.mjs` → 15 pass、0 fail；`apply-test-green.txt`|
|root只讀preflight|yes|`node apply-safe.mjs --project C:/agywork/agd-holiday-prototypes` → operations13、canonical_changes1、generated_translation_values13、product_files_written0；`root-apply-dry-run.json`|
|root來源前後SHA相同|yes|`node prove-root-dry-run.mjs C:/agywork/agd-holiday-prototypes` → source_unchanged true；`root-dry-run-evidence.json`含4檔JSON及兩份locale前後SHA|
|實際套用／重建／驗新鍵|yes|只在TEMP固定基準副本中執行，4JSON套用、真pinned build scripts產locale、verify-applied requireGenerated通過；非root產品|
|漂移、越界、缺鍵、碰撞、並行、overlay遮蓋有拒絕測試|yes|15測試逐項明列；完整非目標JSON深比、額外root欄位保留，before/after SHA驗拒絕無寫入|
|本代理已替root套用|no|沒有執行root --apply；由主控操作|

最初測試因尚未實作套用器而紅，原輸出保留`apply-test-red.txt`。第一輪實作13/14，唯一失敗是TEMP執行真生成器找不到Babel依賴；測試子行程明確提供現有NODE_PATH後轉綠。它不是產品失敗，也沒有跳過真生成器測試。追加來源目錄並行案例後，最終15/15；暫存副本清單保留`fixture-locations.json`，未刪除。
