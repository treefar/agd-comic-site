# 教務四題缺件補查

2026-10-24。只研究選課、學分抵免、休復學與畢業檢核，未重查請假、英文、證照。所有新增檔案均在本目錄；未改產品、未切分支／提交、未啟遊戲或Unity，未發布。

取得5份官方現列公開原始PDF，其中115-1選課日期表補到了棄選與特殊處理日程；畢業檢核11頁附件完成全文及影像驗讀。抵免舊手冊及退費附件仍保留版本衝突，未把「下載成功」寫成現行規章全部核定。

## 可交主控整合的檔案

- `proposal.json`：21個精確JSON pointer before/after，並核對card id；8個新來源以`/sources/-`與`id_absent`追加。保留原來3／5／3／3大步、三欄與身分分類。全guide SHA只當歷史快照，不阻擋其他代理修改。
- `translations.json`：38組新增可見字串英日功能翻譯建議；日文學期用「115学年度第1学期」，不改成日本學年前期。來源caption直接給學生看，HTTP／DOM／SHA／渲染細節留在報告。
- `matrix.json`：10題研究項目5 yes／5 no；逐題列版本、範圍及證據。
- `fetch-receipts.json`、`fetch-command.json`：5份原始PDF的匿名HTTP、時間、URL、位元組與SHA，以及實際stdout／stderr／exit 0。
- `pdf-inventory.json`、`pdf-command.json`、`visual-ledger.json`：頁數、原文、渲染與實際目視頁次。PDF圖只做驗讀，不拿來當網站新素材。
- `input-manifest.json`：研究輸入四卡及4份沿用原件的SHA；未覆寫前輪研究或原驗收證據。
- `verify-result.json`、`verify-command.json`：有限提案／證據檢查12 yes／0 no，完整實際輸出與exit 0。這不等於產品Build或UI驗收通過。

## 逐項研究驗收

|題目|yes/no|已證成／仍未證成|
|---|---|---|
|115-1棄選日程與入口|yes|官方選課母頁現掛日期表115/5/25、德科大教公字115022號；棄選2026/11/30上午10時至12/7上午9時，走校務系統。2026/10/24尚未開放。|
|115-1特殊處理日程及空白表|yes|一般特殊處理9/24已截止；現列G01 v3.2原表已讀。確認後非可歸責學生特殊個案仍須證明、請核書、教師／開課單位及教務核准，不能保證人人補選。|
|抵免次數的公開新舊判讀|yes|115-1母頁全文與1140910辦法均寫每一身分事由在學期間一次；新母頁不是舊表的「整段在學只一次」。不表示可分批送件或逾期受理。|
|當期登入後實際印表|no|現頁要求系統產出，但所連操作手冊仍2020/8/4，p5嵌圖可見舊「在學期間以一次為限」。未登入、未取得115-1個人印表，不能說系統已修正。|
|休復學表單與通知方式|yes|教務表單601／602／603明列到教務處領取，沒有公開下載連結；當期母頁明載領表7日含當日、期末先email，未回覆再掛號。只核公開方式，未實際領表或看個資。|
|112細則提早復學例外與115學則適用|no|官方目錄仍列1120426及1150202兩版，退費附件又附112例外。未取得正式適用釋示，不自行判舊例外有效或失效。|
|112退費錯引更正|no|當期退費附件第2頁第4條僅3款，第3頁第12條仍引第4條第1項第7款；未取得正式更正，不代改成第3款、不保證回溯。|
|115-1退費表與母頁一致性|no|附件日間部9/1–9/7為學費退2/3、雜費及其餘各費全退，母頁卻將學費、雜費等簡述一併退2/3。需承辦釐清，不把母頁總表當每案核算。|
|畢業檢核附件完整視覺驗讀|yes|2026/2/17封面、11頁全文及影像已讀；總表→展開明細→未對應／不採計原因→替代科目→人工複審。室設107示例不作動遊的學分標準。|
|115-1畢業檢核即時性|no|10/24現場重讀2026/2/28公告，仍寫資料計至114-1。未登入個人帳號，不宣稱115-1即時更新或個人畢業核定。|

## 重要原文與版本差異

選課日期表第1頁列：特殊選課9/24止；棄選11/30上午10時至12/7上午9時，棄選後仍需最低學分，同科目修業期間一次、成績W。頁末另列各階段確認結束後，非可歸責學生特殊理由可檢證明及請核書送簽；這是核准程序，並非公告自動延長。G01表頭寫加退選結束前，表內審核原則又說按公告及特殊原因審酌；提案不把持表等同任何時候皆可申請。

抵免115-1母頁完整列5步及「每一身分事由於在學期間僅可申請抵免一次」，8/3至9/21截止。教務表單L01明列登入系統申請。所連5頁手冊頁尾仍標2020/8/4，最後頁舊印表甚至有2010列印時間，足見範例不能證明115-1實際列印內容。可沿用「填寫→核對→送出→印表→初複審」，不沿用舊密碼、舊單位名稱、舊視窗或一次限制去斷言當期介面。

115-1休復學母頁載申辦期間115/6/23至116/1/4，領表7日含當日；逾期重新領表並改退費基準日。601休學表、602退學表、603復學通知都須至教務處領取。未讀605內部名冊，未登入個人帳號。兵役仍由另一正式承辦判定，不因學籍程序完成就視為兵役資料完成。

115-1退費組合附件共7頁。第1頁是當期表，2至3頁附112休學辦法，4至6頁附106年教育部收費辦法，7頁退費附表。本輪目視1、2、3、7頁；4至6頁雖文字抽出，未逐頁視覺複核或查該外部法規當期性，不能把整份組合附件當成2026完整現行法。原112第12條錯引在新掛附件仍存在。

畢業說明11頁全讀後可補：先看總表是否通過與各類應修／符合學分，展開未過明細；未對應可能是抵免、替代或免修，應帶核准文件核對，不自行重複修課。已停開必修依開課單位指定替代科目；系統初審與預定畢業當學期成績後人工複審分開。未把範例室設專業58學分、外系10學分等數字套入動遊。

## 官方來源鏈及讀取時間

Chrome新建研究分頁，僅此分頁順序讀取；未碰使用者8879三頁或其他代理分頁。最初根網址被網站導向舊英文首頁，點官網「中文(台灣)」才回到中文目前母頁，未把舊英文113-1頁當成115-1。研究頁已關閉。

實際URL與ISO讀取時間完整保存於：

- `home-dom.json`：https://www.aca.stu.edu.tw/ ，目前首頁的選課、抵免及2/28畢業公告連結。
- `course-dom.json`：https://www.aca.stu.edu.tw/選課資訊/ ，現掛115-1日期表。
- `forms-dom.json`：https://www.aca.stu.edu.tw/教務表單｜download/ 的實際編碼URL；G01、601／602／603及L01取得方式。
- `credit-dom.json`：https://www.aca.stu.edu.tw/抵免學分/ ，115-1完整程序及2020操作手冊鏈。
- `status-dom.json`：https://www.aca.stu.edu.tw/學生休學、復學及退學/ ，115-1程序及會計退費附件鏈。
- `audit-dom.json`：2026/2/28畢業檢核公告的實際完整編碼URL與附件。
- `rules-dom.json`：https://www.aca.stu.edu.tw/教務法規/ ，實際點開註冊課務法規tab，目錄仍列1150202學則、1120426休學、1140219選課、1140910抵免。只證明當日仍掛同Drive id／檔名，不能由此宣稱4份原件當日重新下載或位元組未變。

### 5份新原件

|檔案|頁數|匿名HTTP|SHA-256|
|---|---:|---:|---|
|raw/course-dates-1151.pdf|2|200|0e6a5283fdd664c518d7eb4fbf17ec5921811943e9fcaef19129be2053a18493|
|raw/special-course-form.pdf|1|200|8a33c05bfddf2ac613ec347af7332b67588ccad3844533cea3292f243d04bed8|
|raw/credit-system-manual.pdf|5|200|13e421dfd27805862e0061905d8eb1a96b02a9957d99b872bd2f86378c29619d|
|raw/refund-1151.pdf|7|200|977366b4e0c2cea24aaae2b715fbb290c089aec64c30c1abe3df600ecca67d06|
|raw/audit-manual.pdf|11|200|8d874354fa9c8260bb71b289a835f39c7f464d8a95181afa42619a2839db96ee|

沿用4原件：20261023 supplement的credit／course／intermission及support-career的school-regulations，SHA於`input-manifest.json`及驗證輸出。沒有為了新日期重抓已讀全文。

## 實際命令與結果

所有命令由`run-command.cjs`保存完整執行器、參數、cwd、stdout、stderr、exit code，沒有將預定執行當作已執行。重跑提案驗證會檢查主控尚未套用前的before；套用後不要覆寫原成功收據。

```powershell
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/run-command.cjs fetch-command node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/fetch.cjs
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/run-command.cjs pdf-command C:/Users/treef/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/read-pdfs.py
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/run-command.cjs assemble-command node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/assemble.cjs
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/run-command.cjs verify-command node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/verify.cjs
```

|指令|實際stdout摘要|stderr|exit|
|---|---|---|---:|
|fetch|5份status200、pdf true、anonymous none、原始SHA及位元組|空|0|
|pdf|5份頁數11／2／5／7／1，text_pages及rendered_pages均相同|空|0|
|assemble|changes21、new_sources8、translations38、matrix10、yes5、no5、product_written false|空|0|
|verify|12 yes／0 no，before／來源／字數／翻譯／原件SHA／未核限制等逐項輸出|空|0|

驗證只屬L0報告與文字提案：summary最多80字、step detail25至100字、FAQ最多120字，新可見字串38組全有英日提案。其他11卡不列改動，並保留所有歷史來源與舊http_recheck日期。不增加自動公告或日期切換功能，棄選文字明列尚未開放。

環境例行讀檔曾嘗試不存在的`guide-enrollment-research-20261023/FINDINGS.md`，工具exit 1；確認實際檔案後改讀`REPORT.md`／`sources.json`／`gap-status.json`及overnight矩陣，沒有補造該檔或覆寫前輪資料。

沒有Build、UI大批QA、個人系統登入、表單提交、校方聯絡或新的背景程序。產品整合及獨立UI驗收由主控另行安排。5項no保留成缺件結案，停止擴搜。
