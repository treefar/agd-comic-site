# 專責日文獨立複核：名稱一致性與師資職稱

2026-10-23。僅本資料夾產出，未改產品。可直接審閱`REVIEW-TABLE.md`的20筆精確全文候選及`CURRENT-ROLES.md`的現行13位教師逐筆對照。`packet.json`保存key、原文、現譯、生效檔案、所有同key定義與來源SHA；沒有拿舊faculty-roles.json的兼任／休職中當目前產品。

本輪是**獨立複核報告＋具體修正候選**，不是另起全站翻譯計畫，也未做全站逐字認證。已有首輪、followup、faculty-copy、FAQ／資格與About／Labs／News／Works各批語義及DOM證據，不重跑其全面截圖／矩陣。

## 新發現：20筆窗口名稱不一致，P2

生效順序依真`build-ja-translations.cjs`：messages → ui → step-details → editorial → flow-ui。不能只改messages，因後層會覆蓋；表格每筆列最後真正生效檔案，另存全部definition鏈。

|生效檔案|候選數|目前用語|
|---|---:|---|
|data/ja/messages.json|8|登録・履修課|
|data/ja/step-details.json|4|登録・教務組|
|data/ja/editorial.json|2|登録・教務組|
|data/ja/flow-ui.json|6|学籍・教務担当|

20筆中文原文都明確指「註冊課務組」，日文卻與已採用的短標「註冊課務組（学籍・履修担当）」不同。建議一致採該原單位名＋解釋，讓學生能對照實際看板與中文公告。完整old/new全文在表及JSON，其他句子、時間、條件、電話、承辦流程均不動，applied全部false。長標套用後必須另驗實際版面；不能用本來源審閱報告冒充改譯後DOM驗收。

**名稱統一與業務指向分開**：這20筆僅因原文已明指該單位才提出；沒有把所有「教務處」「課務」「学籍」概念機械改成註冊課務組，也沒有把系辦、導師、生輔組、通識中心改派過去。是否每項最新業務實際仍由該組受理，本輪未逐項重查最新處室公告，`businessRoutingVerifiedAgainstCurrentOfficePolicy:false`。guide既有來源的403／202狀態保留；不能把翻譯名稱一致說成新核過全部校務程序。未發現可據一手來源斷言的新「窗口業務指錯」案例，所以這類不編造P1；仍保留待查界線。

## 現行13roles與官方職稱

13位逐筆對照皆保留原職級與既有共同聘任關係，沒有新誤升等：副教授→准教授、助理教授→助教、講師→講師。JST JREC-IN明列助教的Assistant Professor level，助手另列研究・教育補助者；九州大學官方表也把助教與TA分列。文科省說明2007年舊助教授改准教授並另設助教，因此不應把台灣助理教授譯成TA、助手或舊助教授。這是日語職級表達，不是聘任資格、權責或待遇互認。官方來源、URL、查核日及讀取狀態見`SOURCES.md`。

陳重光／吳焉昇現行已是「との共同任用（原職…合聘）」；陳寀瑜／蔣天華已是「共同任用（本学科は従たる所属）」；尹立已是「無給休職中」，不再只寫兼任／休職中。這些解釋保留了共同聘任、次要所属、無薪而非離職的核心，暫不再改。但**校方人事核定的正式日譯unknown，繼續pending**；舊校方法規彙編本輪直讀403，不把日本跨機構cross-appointment制度套成樹德校內主從聘，也不自行決定誰是主聘。

留停來源另查台灣教育人員留職停薪辦法，語義是保留職缺並停止支薪；該法第3條對公立人員的適用不能直接套成私立樹德個案程序，故只用於說明詞義，不查問或推定個人休職原因。

## 學歷、資格與其餘覆蓋

- 本輪來源複讀12份有值education：修士／博士層級、領域、年份大意對原文；陳重光／陳慶鴻原文未列學位，現譯也未擅補。楊智彰原資料沒有education，未捏造一份。未重新驗個人學位證書、校方官方日文科系名稱或取得狀態；歷史國立交通大學未改新校名。
- 9份certs欄讀取並沿用faculty-copy既有資格待核。三位包含中華民國技術士的翻譯應避免被當日本技術士資格；目前已有中華民国限定，尚不構成已誤宣稱日本證照的確定新錯。可審閱的後續方向是補「台湾の資格」「原証名」說明，不直接換成日本技能士認定或新增級別。日本文科省來源證明兩制不能由同漢字等同；個別證照真偽、正式品牌譯名保持pending。
- 導覽與按鈕：已讀ui.json全部83項，包含HOME／NEWS／ABOUT／WORKS、返回／搜尋／選單、八分類、海外實習／見學及資格限制。大意可保留；不是83個畫面皆重開。部分英文裝飾標不從字典存在推定實際render已翻，沿用既有DOM證據。
- 在校指南／FAQ：新增全文複讀的是20筆窗口相關句，含請假考試、選課加退選、抵免、休復學、文件與結果確認；沒有把送件當核准、過期公告當仍開放，這些限制維持。其餘指南／FAQ沿用既有faq-remainder／selection-eligibility／followup；未重新宣告每一條FAQ或最新招生制度都由本代理認證。
- 主網站About／Labs／News／Works長文沿用本代理上一批integrated08-rendered與09 delta、以及faculty-copy等原報告；此輪不把2344個合成key數冒充2344句新增人工審完。

## yes／no與實際驗證

|條件|yes/no|
|---|---|
|現行13roles逐人核對，沒有沿用舊role快照|yes，CURRENT-ROLES.md／packet.json|
|助教／TA／助手／舊助教授以官方JST／MEXT／大學來源區分|yes，SOURCES.md|
|校方合聘／從聘／留停正式人事日譯已核定|no，unknown／pending，不虛構|
|所有20個不一致key、生效來源與精確old/new已列|yes，REVIEW-TABLE.md與unit-name-candidates.json|
|改派業務窗口或重查所有最新業務分工|no，名稱統一與業務判定分開|
|新增學位／資格／機構正式名|no|
|2344個effective key只是盤點，非全站逐字認證|yes，覆蓋與沿用範圍分列|
|本輪全站DOM截圖／Build／完整矩陣|no，唯讀提案，未改產品，依主控限定不重跑|
|push／main／刪檔／還原他人檔案|no|

```powershell
node holiday-lab/translation-review/specialist-ja-20261023/prepare.cjs
# 2344 effective keys；20 candidates（8/4/2/6）；13 roles；12 education；9 certs；applied0
node holiday-lab/translation-review/specialist-ja-20261023/verify.cjs
# 8 source SHA穩定；逐key有效來源／完整候選精準；13角色條件逐筆通過；productEdits0
```

實際輸出存`prepare-output.txt`及`verify-output.txt`，機算摘要`summary.json`。採集日期2026-10-23，不將403全文或搜尋摘要假稱已讀全文，亦不冒稱真人日語母語審校。
