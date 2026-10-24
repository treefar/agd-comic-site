# 在校指南處室與聯絡窗口補查

查核日期：2026-10-24，台灣時間約08:56–09:03。只寫本研究目錄，未改產品、翻譯字典、分支或交接檔，未登入校務系統、聯絡任何人。

發現兩個可修正項目：指南請假窗口仍列舊分機2114，官方成員頁當日實際列2126；升學卡英文將招生選才組譯為Recruitment and Admissions Section，校方實際名稱為Admissions and Selection Division。另可把求助卡補成兩個中心的實際窗口，讓學生不用只繞回入口頁。

## 各窗口結果

|窗口|中文／英文核對|分機與分工|處理|
|---|---|---|---|
|註冊課務組|Registration and Curriculum Division，官方中英頁均有|動遊系2016，涵蓋選課、抵免、畢業學分、休退學等|保留；不沿用英文頁舊承辦姓名|
|招生選才組|Admissions and Selection Division，官方中英導航與英文正文均有|2004主辦碩博士招生；2015主辦四技單招及轉學等，兩者互列代理|保留中文與電話，修英文名稱|
|生活輔導組|Student Assistance Section，官方英文組織頁有|當日live：請假／獎懲2126、急難2124、獎助／減免2140；2134明列役期折抵|請假2114改2126；2134不外推所有兵役事項|
|職涯發展暨校友服務中心|Career Development and Alumni Service Center，研發處英文組織明列；母處Office of Research and Development|1711實習及學海築夢；1713證照、UCAN、就業等|保留研發處隸屬與現有分機，網址sao不當隸屬依據|
|通識教育中心|首頁為Center for general education；修課舊文部分仍寫學院|外語修課4202／4204，首頁總聯絡另列4203|中文中心與電話保留；英文建議按官方詞序、標題大小寫正規化|
|身心健康中心|中文首頁正文為新名稱，banner／footer仍舊名稱；英文學務組織有Student Wellness Center與相符職掌但沒有跳轉連結|首頁服務電話2127；預約頁2113／2125／2127／2178|中文求助窗口可補2127；英文先保留中文加用途說明，未宣告唯一對映完全核定|
|特殊教育資源中心|首頁說明115年獨立；英文學務組織連至新serc卻仍標舊合併中心名|新中心成員頁明列動遊系支持2149|可補獨立窗口及成員頁來源；新中心英文正名待核，不沿用舊合併名|
|國際及兩岸事務處|英文正文採International and Cross-Strait Affairs Office，頁內另有Department等variant|出國交流頁尾1610／1603／1606|現有1610保留；既有英文Office of…只作描述，不聲稱唯一官方拼法|

八個窗口均逐筆讀到當日官方Chrome DOM，來源與檔案在source-matrix.json。官方日文名稱本次未查得；描述譯法不等於日本行政單位或職位的正式等值，不主張現有日文全部核定。

## 舊索引與live衝突

同一生輔成員網址在搜尋服務仍回舊名冊及2114，當日Chrome則顯示新版表格，請假、獎懲、操行職掌與2126同屬一張table。原始live DOM、table文字與截圖均保存，採live內容。這不是由「2114沒出現」單獨推論2126，而是已直接讀到2126同表的請假業務。

現行特殊教育中心與身心健康中心的英文組織頁沒有完全同步。保留不一致證據，不自動把舊Counseling and Special Education Resource Center當115新中心正式名。

## 精確補正提案

proposal.json含10筆原值、候選值、JSON pointer及來源，未套產品：

1. /cards/3/contact/phone：2114→2126。
2. /cards/3/faq/1/a：同段只換分機，不重新認定其餘程序。
3. 英、日對應字典各一筆：中文key同步換2114→2126，值中的分機同步換；rename前先核新key不存在，不只改值而讓翻譯失聯。
4. 英文招生選才組contact及通識中心contact各一筆名稱補正。
5. /cards/10/contact：心理諮商2127與動遊系特教支持2149分流；需要另補所列英文／日文描述譯法，不冒稱官方日文。
6. 原life-contact來源的閱讀層級更新、追加special-members-20261024來源、求助卡source_ids關聯，共三筆；舊HTTP收據保留日期，不竄改成今日成功。

其餘13卡窗口已逐卡回讀，分機與來源關聯保存在input-guide.json及source-matrix.json。仍維持目前系辦、實習、證照、英文、畢業、海外交流等既有窗口；沒有把這次聯絡資訊查核擴張成其所有規章／表單／資格全文已確認。

## 讀取層級與證據

- web直接open六頁均403：raw/web-open.json；搜尋結果原回覆另存raw/web-search-*.json。搜尋索引僅供比較，不當live。
- Node直接HTTP八次均202且0 bytes，原0位元組body與SHA保留：http-attempts.json。不能稱這八次已讀全文。
- Chrome用獨立研究分頁實讀官方頁，僅讀公開內容。保存16份DOM與一份table文字、五張PNG；已關閉該研究分頁。沒有走校務登入或送出預約。
- Browser保存的是工具DOM快照及截圖，不宣稱HTTP原HTML body。原始web回覆保留工具文字，沒有將錯誤頁包裝成來源正文。

主要來源連結：[教務組織](https://www.aca.stu.edu.tw/組織簡介｜introduction-2/)、[教務英文](https://www.aca.stu.edu.tw/en/index-2/)、[生輔成員](https://life.sao.stu.edu.tw/en/單位介紹/組織與成員/)、[職發職掌](https://dcpi.sao.stu.edu.tw/業務介紹-成員/)、[研發處英文](https://www.rd.stu.edu.tw/en/introduction/)、[通識修課](https://www.zzd.stu.edu.tw/通識英文及外語修課/)、[通識首頁](https://www.zzd.stu.edu.tw/)、[身心健康首頁](https://ccdc.sao.stu.edu.tw/)、[預約頁](https://ccdc.sao.stu.edu.tw/預約諮商/)、[特教首頁](https://serc.stu.edu.tw/)、[特教成員](https://serc.stu.edu.tw/?p=60)、[學務英文](https://en.sao.stu.edu.tw/organization/)、[國際交流](https://www.oica.stu.edu.tw/出國交流/)、[國際處英文](https://www.oica.stu.edu.tw/en/2896-2/)。

## 實際驗證

```text
node holiday-lab/reports/followup-20261024/contacts/record.cjs http holiday-lab/reports/followup-20261024/contacts/collect-http.cjs
exit code 0；requests 8；各status 202、bytes 0；stderr空。

node holiday-lab/reports/followup-20261024/contacts/record.cjs verification holiday-lab/reports/followup-20261024/contacts/assemble.cjs
exit code 0；stderr空。
{"document_yes":10,"document_no":0,"knowledge_limits_no":2,"units":8,"proposals":10,"raw_files":35,"product_written":false}
```

|驗收條件|yes／no|證據|
|---|---|---|
|8單位逐筆查核且附實際來源|yes|source-matrix.json，每單位DOM檔／URL|
|15卡輸入已保存且產品guide SHA前後不變|yes|input-sha.json、verification.json|
|10筆proposal before逐欄符合目前值|yes|verification-command.json，無套用|
|新版請假2126與職掌同table證實|yes|raw/life-tables.json、life-members.png|
|動遊系特教2149實際官方成員分工|yes|raw/serc-members-dom.txt、serc-members.png|
|官方英文招生選才名稱與研發處隸屬已讀|yes|raw/academic-en-dom.txt、research-development-en-dom.txt|
|8單位英文均有當期唯一精確對映|no|新特教舊英文衝突；身心健康缺連結；國際處variant|
|官方日文名稱全部核定|no|本次未查得，不以自譯頂替|
|所有規章／表單／個人適用已完成|no|本次只核窗口，其他政策缺件仍按指南報告保留|
|產品Build與UI驗收已執行|no|唯讀研究未改產品；主控套用後需做相稱驗證|

最初rg指令使用Windows不支援的data/en/*.json路徑，exit1；已改成rg -g '*.json' data/en後exit0，依成功搜尋盤點引用，未以失敗結果當不存在。沒有測遊戲、Unity、生成素材、推送、發布、main操作、刪檔或C節動作。
