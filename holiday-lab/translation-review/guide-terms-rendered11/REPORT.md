# 11版指南49個新譯值：獨立真DOM／排版／字型驗證

2026-10-23；固定`.measure-integrated-11`，`http://127.0.0.1:8852`，`app-TQ4G6C6Y.js`。只寫本資料夾，未改產品／其他報告／服務，也未stage或commit。本頁是內部測量版，不是新交付包或UIgate通過。

**98個分類案例：84個真可見全文、14個資料字典值未被現行指南引用。84個可見案例全部owner-contained、無水平溢出、cmap 3,528字元＋樣式配對missing0／unknown0／parse0。** 沒有把找不到的14例算成畫面通過。

## 目標、來源與真操作

JA採`ja-guide-terms-applied/plan.json`20個proposed；EN採`en-guide-terms-applied/exact-plan.json`29個new。固定`#/students/guide`，兩語各320／1440、height1000，四個context。`targets.json`保存完整key、預期全文、生效JSON來源。

每頁都等待真`#student-search`及guide.cards指定的15張卡片ready，再以實際summary click展開15個卡片details與30個FAQ details。共180次真click，全部open狀態有收據，未用DOM寫open或插入目標文字。來源資料與dictionary不當成可見；定位時在真指南尋找最小文字節點的實際parent owner，記完整raw text、matchedTextNode、卡片／FAQ及祖先details狀態。

每個可見owner保存整段Range所有行、owner bounds、CSS文字樣式、clipping ancestors與全文。檢查完整目標在該文字節點內、每行在owner內、無scrollWidth水平溢出、未被hidden／clip祖先裁掉。84例皆通過。這是DOM Range容納與可讀性幾何，不把它說成逐像素墨跡、裝飾紙框或全站paint-order驗證。

每個可見值另有獨立viewport截圖，run-02共84張；沒有替不存在的14例製造截圖。已抽看同源run-01的JA長步驟320、JA流程按鈕320、EN窗口聯絡320、EN休復學1440，run-01／02全部15來源SHA完全相同；沒有宣稱84張逐張人工審美認證。主控亦實看JA／EN320代表圖。

## 14個data-only案例的依據

JA34可見＋6 data-only；EN50可見＋8 data-only。以下4個中文key對應7個語言值，每值兩寬，共14。字典中的新值與plan精準一致，但中文key**完全不在served-guide.json的任何字串葉節點**，不是details未展開或等不到字就算過。

|語言目標ID|中文key／原因|
|---|---|
|JA-UNIT-08、EN-GUIDE-11|「先向系辦及註冊課務組確認程序」；原舊休復學step標題，現行status-military卡改為分支三項說明，該exact key已不被資料引用。|
|JA-UNIT-13、EN-GUIDE-17|「在可申請的期間填寫抵免系統並列印表格，備妥原校成績證明正本。依公告送開課單位與就讀系所簽核，再交註冊課務組複審，別只完成線上輸入。」；現行credit-transfer有五步流程，該舊整段已被拆分，未作整段render。|
|JA-UNIT-14、EN-GUIDE-18|「辦理前先聯絡系辦與註冊課務組，說明要休學或復學，以及自己的學籍情況。詢問導師或代理人可辦理的時間，再安排到校，避免領表後找不到簽核人員。」；現行status-military採各選項新段落，舊段不被引用。|
|EN-GUIDE-26|「休學先備學生證；委託代辦時確認委託書，領表後按公告期限完成離校及繳件。復學則依本人收到的通知辦理，並確認通訊資料正確，別只停止上課。」；同卡現行分支文案替換的舊段，僅在翻譯字典存在。|

`student-guide.jsx`實讀顯示從fetch的guide.cards映射steps／step_details／flow／faq／contact；不會單因字典有key就主動顯示。`served-guide.json`保留當次原資料（raw SHA與15來源收據一致），`classified.json`逐例記guideCanonicalKeyOccurrences=0。沒有改資料讓舊句重新出現，也不對當前替代句新增額外驗收範圍。

## CDP、cmap與來源凍結

先查每個真owner的CDP實際字體；再為每個文字run的字元建立隔離探針，複製family／weight／style／size／stretch／variation／features，逐字查CDP實際字體。探針只用來驗字型，從不當玩家可見內容。沿用integrated08-rendered的coverage.py及技術字體inventory方法，fontTools對實際檔案getBestCmap排除.notdef，優先PostScript alias，若採family subset/style聯集則在逐字報告揭露。沒有用document.fonts.check充當cmap，亦沒有隱藏unknown；本輪實際unknown為0。

run-02每語每寬都有自己15檔before／after：index、app-TQ4G6C6Y.js、styles.css、student-guide.css、faculty-portrait.css、holiday-home.css、guide.json及實際改動的8個JA／EN JSON。四個context全部前後完全一致，也與全輪before／after、run-01收據一致。source-snapshots.json另保存9份guide＋字典資料，逐份raw SHA核對後供離線verify使用，不依賴當前工作樹或未來服務。

## 既有英文按鈕的字形觀察（不屬本次49值）

主控在320圖看到「office’ s」。限定重查一個既有`.sg-office-link`，`office-link-recon.json`證明真DOM是單一文字節點`Visit the responsible office’s website ↗`，U+2019後**直接接s，沒有插入空白**；CSS letterSpacing normal、wordSpacing0，CDP實際MicrosoftJhengHeiUIBold。Range記錄apostrophe x230／width3.234375，s起於233.21875，並無額外空格advance；website是真的換到下一行。

因此不列確定文字bug或新增P1；這是目前字形視覺與長文案換行的可讀性觀察。若後續要縮短，可另審`Visit the office website`，保留前往承辦處室網站的意思；本輪沒有套用、沒有為此改產品或重跑98例。相應代表圖office-link-en320.png與字元Range皆保留。

## 實際指令與輸出

```powershell
node holiday-lab/translation-review/guide-terms-rendered11/prepare.cjs
# TARGETS49 JA20 EN29 ... expected98 ; exit0
node holiday-lab/translation-review/guide-terms-rendered11/audit.cjs run-01
# TOTAL98/98 visible84 stabletrue errors0 ; exit0
# 首批只有全輪來源收據，為滿足每context before/after再跑同範圍一次，保留首批不覆蓋。
node holiday-lab/translation-review/guide-terms-rendered11/audit.cjs run-02
# TOTAL98/98 visible84 stabletrue errors0 ; exit0
$env:PYTHONIOENCODING='utf-8'
python holiday-lab/translation-review/guide-terms-rendered11/coverage.py --audit holiday-lab/translation-review/guide-terms-rendered11/run-02/visible-audit.json
# CASES84/84 CHARACTER_PAIRS3528 MISSING0 UNKNOWN0 FONT_PARSE_ERRORS0 ; exit0
node holiday-lab/translation-review/guide-terms-rendered11/collect-source-snapshots.cjs
# SOURCE SNAPSHOTS9 ... raw SHA equals run02 before/after ; exit0
node holiday-lab/translation-review/guide-terms-rendered11/office-link-recon.cjs
# insertedSpace:false, adjacent:true ; 單一實際字型／Range紀錄，exit0
node holiday-lab/translation-review/guide-terms-rendered11/verify.cjs
# 離線讀封存JSON；98分類、84全文、14data-only、3528字元、sourceStabletrue、layoutFailures0
# exit0，summary.json機算
```

stdout均存同名output.txt；沒有第三批全跑。verify完全依封存檔案離線重算，不啟瀏覽器、不連server。此輪未執行Build或全面測試，產品與樣式沒有改動，主控已有整合Build收據不冒稱本代理重跑。

## yes／no

|驗收|yes/no|
|---|---|
|49值×2寬完整分類，JA20／EN29來源精準|yes，98逐例classified.json|
|全部98例都是可見字且通過全文畫面|no，14 data-only分開保留|
|84可見全文owner-contained／無水平溢出或ancestor裁切|yes，Range／raw全文／open狀態逐例記錄|
|以真summary操作展開卡片及FAQ|yes，4頁各15卡＋30FAQ，共180click|
|84個真owner與3528字元樣式cmap，缺字／未知／parse0|yes，run-02/audit.json與coverage.json|
|每語每寬15份來源前後一致|yes，pages.receiptsBefore／After，另全輪一致|
|原英文按鈕有插入多餘空白|no，DOM與Range反證；視覺觀察另列非本次必修|
|全站／遊戲UIgate／可交付新包已通過|no，範圍限定本指南新譯值|
|修改產品、其他報告、服務、stage／commit／push／main／刪檔|no|
