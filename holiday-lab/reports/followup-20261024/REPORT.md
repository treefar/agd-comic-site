# 2026-10-24 接續本機審閱段落

source_agent: codex；TF-GO。最新 http://127.0.0.1:8876/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/ 。已到使用者可審閱段落；不push、不發布、不碰main、不刪檔、不執行C節，節日遊戲繼續凍結。

本輪三組子代理分別完成英文資料對映、字形可用性、處室聯絡補研，root套用並交另一代理做新版UI驗收。21原有衝突／21未成對均歸零；實際字典只有8個已授權聯絡文案差異。小颯競賽年與官方證據一致為2021，原畫不改。

|項目|處理|yes/no|結果／限制|證據|
|---|---|---|---|---|
|交接、工單、分支及保全錨點|已檢查|yes|三份指定文件完整載入並記錄SHA；主工作樹與原clone可讀。未以8860舊畫面判定新版。|holiday-lab/reports/overnight-20261024/root/before.json|
|中英日共用介面與資料|已檢查|yes|共用元件與中文正本保留；三語390／1440六組目前版通過，未另外建立精簡外文首頁。|holiday-lab/reports/followup-20261024/qa/result.json|
|桌面完整導覽|已檢查|yes|1440三語八章節及兩語言入口可見，保留既有兩層導覽。|holiday-lab/reports/followup-20261024/qa/result.json|
|手機選單與自動收合|已檢查|yes|390三語真點選選單與章節，選單可開啟並於跳轉後收合。|holiday-lab/reports/followup-20261024/qa/result.json|
|語言切換|已檢查|yes|三語皆實際操作切換連結，保留同版導覽；未只檢查字串存在。|holiday-lab/reports/followup-20261024/qa/result.json|
|頁尾與操作按鈕|已檢查|yes|六組頁尾mail／tel、About連結與代表按鈕操作通過；不是每個外部站點連結的存活保證。|holiday-lab/reports/followup-20261024/qa/result.json|
|固定標題列與章節定位|已檢查|yes|三語About定位均在固定列下方；既有動態offset與原styles未改。|holiday-lab/reports/followup-20261024/qa/result.json|
|導覽短末行與代表標題|已檢查|yes|指定寬度無橫向溢位；旋轉h2 Range候選已目視排除，另留畫面收據。未全面改寫所有內文換行。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/overnight-20261024/qa/role-headings/result.json、holiday-lab/reports/overnight-20261024/qa/role-headings-command.json|
|現有字體與指定頁載入|已檢查|yes|首頁與指南六組fonts.loaded；本輪未換字體或縮字，已保留姓名與正式資格。|holiday-lab/reports/followup-20261024/qa/result.json|
|中日全站逐字缺字稽核|保留|no|8875限定6狀態79,079字元配對有字形；30資料檔2,204字元有可用glyph。8876新增古／折兩字已有限cmap與CSS range補驗。469未載入描述、逐字實際fallback／跨OS仍未全驗。|holiday-lab/reports/followup-20261024/fonts/REPORT.md、holiday-lab/reports/followup-20261024/root/font-delta.json|
|鄧樹遠中英文職稱|已檢查|yes|目前data/faculty與英文角色均不含電競代理主任；保留系主任／副教授，不改歷史報告。|holiday-lab/reports/overnight-20261024/program/REPORT.md|
|教師頭部大小與水平眼線|已檢查|yes|六組各13位標記投影與原照HTTP SHA相符，共78原照觀察；以顯示定位達成，原照片未修圖。標記本身是人工近似。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/followup-20261024/root/current-verification.json|
|日文助理教授職稱|已修正|yes|四個日文角色值改保留台灣原職＋Assistant Professor說明，維持合聘／從聘／留職狀態；另日文兩寬13角色補驗，不硬套日本助教。|holiday-lab/reports/overnight-20261024/program/REPORT.md、holiday-lab/reports/overnight-20261024/root/program-green-r2.json、holiday-lab/reports/overnight-20261024/qa/role-headings/result.json|
|全部正式職稱／處室外文名|缺件|no|指南8窗口當日Chrome逐筆實讀；招生、通識正式英文及請假／求助分機已更正。新特教中心英文官網仍有舊合併名稱，官方日文未查得；保留中文正式名＋功能說明，未冒認官方日譯。|holiday-lab/reports/followup-20261024/contacts/REPORT.md、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|
|四PROGRAM整句與相依欄位|已修正|yes|16個同頁欄位三語共48操作；115一般單招30名已截止，移除統一面試／固定時段／費用與證書保證；13可見值六組共78觀察。|holiday-lab/reports/overnight-20261024/root/program-apply.json、holiday-lab/reports/followup-20261024/qa/result.json|
|翻譯資料覆蓋與資訊保留|已檢查|yes|1721個靜態資料字串中兩語各1720有字典，唯一未映射為應保留筆名小颯；動態明示三語另計。不能據此宣稱母語逐句正確。|holiday-lab/reports/overnight-20261024/root/translation-inventory-final.json|
|歷史英文資料對映與差異處理|已修正|yes|42筆差異逐筆處理，25個資料操作；真建置未成對21→0、衝突21→0。既有17條及待核專名CHECK保留，runtime不改；不以此當母語簽核。|holiday-lab/reports/followup-20261024/i18n/REPORT.md、holiday-lab/reports/followup-20261024/root/delta-verification.json、holiday-lab/reports/followup-20261024/root/i18n-green.json|
|在校指南標題、直白分類與三欄|已檢查|yes|維持四字標題、八分類、15卡；1440三欄與390單欄適配、索引無宣傳贅語。|holiday-lab/reports/followup-20261024/qa/result.json|
|新生／在校／轉學／畢業身分索引|已檢查|yes|六類身分索引及搜尋／分類組合回歸通過，實際篩選與重設可用。|holiday-lab/reports/overnight-20261024/root/guide-regression-green.json、holiday-lab/reports/followup-20261024/qa/result.json|
|大流程、每步小說明與FAQ|已修正|yes|維持15卡47步小說明、34FAQ；目前53來源。這輪修正請假2126及諮商2127／特教2149分流；來源對學生用白話呈現，舊http檢查日期與歷史key保留。|holiday-lab/reports/followup-20261024/root/contacts-green.json、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|
|畢業檢核：逐題來源核對|已檢查|yes|已核對並保存版本：112–115一般日四技課表；1150610離校要點；2026/02/28檢核公告；保留缺口：個別班別及入學年仍須匹配；檢核公告資料算至114-1，不代表115-1即時成績；教務檢核PDF附件未視覺讀完|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|校外實習：逐題來源核對|已檢查|yes|已核對並保存版本：112–115一般班課表；官網列版107系手冊；保留缺口：115本系要點適用、當期申請考核Word全文及校級實習辦法仍缺；107版不升格當期|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|證照認列：逐題來源核對|已檢查|yes|已核對並保存版本：115一般班／技優班課表；114-2獎助公告；公開證照系統；保留缺口：現行完整認列清單、115-1獎助公告與各證照版本未得；107金額與114-2上限歧異不硬選|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|我要請假：逐題來源核對|已檢查|yes|已核對並保存版本：2026/06簽核公告；1150202學則相關條文；2019歷史請假PDF；保留缺口：最新完整請假規則及全假別／時限附件未得；2019兩日與2026五日不可混成同一套|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|選課加退選：逐題來源核對|已檢查|yes|已核對並保存版本：1140219選課準則；115-1加退選已截止公告；保留缺口：115-1棄選與特殊處理當期日程／表單仍缺；不公布由週次反推的日期|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|學分抵免：逐題來源核對|已檢查|yes|已核對並保存版本：1140910抵免辦法全文；115-1程序；2018舊空白表；保留缺口：舊表在學一次與新辦法每事因一次不一致；當期印表版本仍待核；9/21截止不作現在受理|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|專題製作：逐題來源核對|已檢查|yes|已核對並保存版本：112–115一般班課表；官網第十二屆108修訂辦法及三份DOCX；保留缺口：換組表二審前、舊辦法／分組表三審前衝突；當屆規定、人數、評分、補審與授權清單未核|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|英文門檻：逐題來源核對|已檢查|yes|已核對並保存版本：115課表；2023門檻頁；通識修課與115-1英檢排程；保留缺口：現行全文、最新表單、證明效期歧異、115-1替代課清單與即時名額未核；10/24場報名截止不宣稱尚開|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|休學復學與兵役：逐題來源核對|已檢查|yes|已核對並保存版本：1120426休學辦法；1150202學則；115-1注意事項；保留缺口：112細則提早復學例外與115學則未列例外衝突；退費條文錯引；當期表單／兵役個案未核|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|獎助與急難協助：逐題來源核對|已檢查|yes|已核對並保存版本：115-1不利處境／低收已截止索引；生輔急難須知；勵學金入口；保留缺口：各方案當期全文／表單未全齊；勵學金只有標題摘要；115-2日期000年無效；所得資產門檻不得外推各急難|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|遇到困難找誰：逐題來源核對|已檢查|yes|已核對並保存版本：2026/10/23官網正文：身心健康中心預約、115獨立特殊教育資源中心；保留缺口：現行申訴／性平全文和空白表未得；不保證保密無例外、不用活動分機代個案程序；10/24 live403|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|就業資源：逐題來源核對|已檢查|yes|已核對並保存版本：職發中心官網職掌索引；系辦入口；保留缺口：UCAN與現行聯絡及當期職缺未逐項live核實；1712/1713索引線索不升格當日全面聯絡核准|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|繼續升學：逐題來源核對|已檢查|yes|已核對並保存版本：116碩甄全文及115碩士考試歷史簡章；保留缺口：116設創所書審100%與口試文字衝突未解；116考試新簡章未得；附表四115／116字樣不代更正|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|海外實習：逐題來源核對|已檢查|yes|已核對並保存版本：2026第九屆HC成果；教育部學海要點既存證據；109跨校歷史來函；保留缺口：本系115當期名額語言費用補助契約及返校期限未得；不以109別計畫或觀光簽證湊數|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|海外見學：逐題來源核對|已檢查|yes|已核對並保存版本：113發展計畫歷史活動；系網介紹與國際處入口；保留缺口：115本系招募團期、費用補助退費、認列學分及請假成果表未核；交換目錄不是見學規則全文|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|當期完整規章、表單及年度衝突|缺件|no|15題皆列現行性缺口；10/24四站web受阻，直接重取為202空內容。舊107／108規章、未讀附件、116設創所書審／口試衝突不當作現行已核。|holiday-lab/reports/overnight-20261024/guide/live-recheck.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|小颯及既有學生作品／原始署名|已檢查|yes|小颯完整原畫與署名保留，315原圖／凍結遊戲素材SHA相同。82 DOM引用已分61 img／20 CSS／1停用icon並逐項追到精確資料或原照裁切紀錄；仍不代表再製授權全齊。|holiday-lab/reports/followup-20261024/art/asset-reference-map.json、holiday-lab/reports/followup-20261024/root/current-verification.json|
|取消主網站已知生成素材引用|已修正|yes|主站favicon改為無圖示，頁底節日入口改暫緩；六組實際82項引用未命中已知生成清單，原PNG與凍結遊戲包留存。|holiday-lab/reports/overnight-20261024/root/icon-green.json、holiday-lab/reports/overnight-20261024/root/asset-audit.json、holiday-lab/reports/followup-20261024/qa/result.json|
|全部素材製程與權利已確認|缺件|no|小颯作者由使用者確認；其他既有校方作品／照片的逐件製程與權利未全數另核，不能宣稱整包零AI或所有改編權已核。|holiday-lab/reports/overnight-20261024/root/asset-audit.json|
|試玩放招生後、頁尾前|已檢查|yes|共用首頁維持頁底策展入口與暫緩提示，首屏無遊戲控制；未回到首頁最上方。|holiday-lab/reports/overnight-20261024/root/frozen-entry-green.json、holiday-lab/reports/followup-20261024/qa/result.json|
|全部節日遊戲凍結|保留|yes|包含勞動節，未開發／修改玩法／測玩／巨量QA；僅調整主網站入口，既有遊戲、素材與音訊檔保留。|holiday-lab/reports/overnight-20261024/root/retained-assets.json、holiday-lab/reports/followup-20261024/qa/result.json|
|Flora／胖倉鼠WebGL成品|缺件|no|本輪再次只查指定TF-BASE交接夾（2026-10-24T01:12:07.890Z UTC），仍5份工單／腳本，未見WebGL。未啟Unity、未重派或下載舊包。|holiday-lab/reports/followup-20261024/root/webgl-recheck.json|
|維持漫畫／手繪風格|保留|yes|只做必要網站文案、素材引用與入口修正；styles、章節版型與照片定位原樣，未全面換版、未換字體、未新增AI圖示。|holiday-lab/reports/followup-20261024/root/current-verification.json|
|本輪本機建置|已檢查|yes|最新.measure-followup-20261024-01，app-3A2EBGL2.js，360檔；本機measurement審閱版，未發布。|holiday-lab/reports/followup-20261024/root/build.json|
|獨立三語與手機驗收|已檢查|yes|主6組148yes、補6組64yes，58張原圖；來源與360建置檔前後一致，主控唯讀再核。|holiday-lab/reports/followup-20261024/qa/command.json、holiday-lab/reports/followup-20261024/qa/new-targets-command.json、holiday-lab/reports/followup-20261024/root/current-proof.json|
|實體手機與母語審閱|保留|no|本輪是390模擬視窗與工具核對；實體手機、三語母語逐句與使用者新畫面確認未取得。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/overnight-20261024/program/REPORT.md|
|不push／不main／不刪檔／不C節|已檢查|yes|原四dirty與R0五檔SHA、main refs及C節相同；每項codex短分支，本輪只本機提交，未執行C節。|holiday-lab/reports/overnight-20261024/root/before.json、holiday-lab/reports/followup-20261024/root/current-proof.json|
|小颯首獎年份|已修正|yes|主辦CELSYS2021-04-28公告支持第27屆；中英資料2022→2021，三語兩寬WIN2021與小颯署名可見，原畫不改。|holiday-lab/reports/followup-20261024/art/primary.json、holiday-lab/reports/followup-20261024/root/year-green.json、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|
|現行請假／求助分機與正式英文|已修正|yes|生輔現行表請假2126取代舊索引2114；諮商2127與動遊特教2149分流。招生選才組Admissions and Selection Division、通識Center for General Education另有真UI驗證。|holiday-lab/reports/followup-20261024/contacts/REPORT.md、holiday-lab/reports/followup-20261024/root/contacts-green.json、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|

## 實際執行

- root/build.json：node holiday-lab/build-review.mjs .measure-followup-20261024-01 --measurement，exit0，360檔/app-3A2EBGL2.js。
- root/guide-current-regression.json：指南／身分／招生路徑／分機／資料對映／年份21測試通過，exit0。
- qa/command.json：主6組148yes；qa/new-targets-command.json：補6組64yes，均exit0、來源與建置前後SHA相同，未開任何遊戲。
- root/font-delta-command.json：新增2字2/2可用，沒有下載新字體；完整字集／每字實際fallback仍未全核。
- root/current-proof.json：主控核來源、原圖315／dirty＋R0五檔、main refs與C節相同，exit0。

初版QA誤抓#admission而非#join，新增target誤等h1而作品用DetailHeader，均為工具錯誤；原失敗留存，修方法後重驗，未改產品配合。Delta gate初見古／折exit1是待補兩字，不是產品缺字；有限補驗已另留。原8875證據保留其版本，本輪不借用其全站通過。

## 剩餘

完整當期規章／表單及版本衝突、未核正式外文專名、全站逐字／跨裝置字型與真人審閱、作品完整製程／權利、兩款WebGL回傳仍待處理，不宣稱全面完成。先讓使用者看8876；後續依具體意見，不自啟節日／Unity或擴大發布。
