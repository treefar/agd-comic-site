# 2026-10-24 現列規章補查與8879本機審閱版

source_agent: codex；TF-GO。最新 http://127.0.0.1:8879/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/ 。原8876、01版8877、02版8878保留；不push、不發布、不碰main、不刪檔、C節不執行，節日遊戲凍結。

三組子代理分別補請假、英文/證照、專題/升學官方文件；root逐項套用後，另交未改產品的代理驗新版。15卡47步、42FAQ、63來源，86個精確文案雙語更新、舊key保留。來源註記48處白話化，原查核日期/URL/程序與raw證據留存。

|項目|處理|yes/no|實際結果與限制|證據|
|---|---|---|---|---|
|交接、工單、分支及保全錨點|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。三份指定文件完整載入並記錄SHA；主工作樹與原clone可讀。未以8860舊畫面判定新版。|holiday-lab/reports/overnight-20261024/root/before.json|
|中英日共用介面與資料|已檢查|yes|8879三語同版首頁及指南6組通過；共用介面程式未改，本輪僅更新指南資料與精確字典。不是全站所有路由重新驗收。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-proof-command.json|
|桌面完整導覽|已檢查|yes|8879三語1440完整導覽可見；未改導覽標籤或程式。前版UI點選證據保留。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/preserve-r3-command.json|
|手機選單與自動收合|已檢查|yes|8879三語390選單有限操作通過；不升格實體手機。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|語言切換|已檢查|yes|本輪以三個語言網址分別驗收；語言切換程式與導覽字典值未改，8876的UI切換收據保留，未宣稱新切換點選全覆蓋。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/current-rules-20261024/dictionary-final.json、holiday-lab/reports/current-rules-20261024/preserve-r3-command.json|
|頁尾與操作按鈕|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。六組頁尾mail／tel、About連結與代表按鈕操作通過；不是每個外部站點連結的存活保證。|holiday-lab/reports/followup-20261024/qa/result.json|
|固定標題列與章節定位|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。三語About定位均在固定列下方；既有動態offset與原styles未改。|holiday-lab/reports/followup-20261024/qa/result.json|
|導覽短末行與代表標題|已檢查|yes|8876的16筆旋轉h2候選已用完整文字Range與3種單/雙行校準補驗，全為單行；樣式與標題原文未改。8879另核6組無橫向溢位，不宣稱全內文孤尾0。|holiday-lab/reports/current-rules-20261024/layout/result-r2.json、holiday-lab/reports/current-rules-20261024/layout-command-r2.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|現有字體與指定頁載入|已檢查|yes|8879首頁與指南三語6組字體載入完成，無替代字元；不換字體、不改姓名。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|中日全站逐字缺字稽核|保留|no|維持no：舊有限字形核對保留，新資料10字已在既有字體cmap及CSS範圍找到，沒有另下載字體。全站實際逐字fallback、跨OS與真機仍未全核。|holiday-lab/reports/current-rules-20261024/font-delta.json、holiday-lab/reports/current-rules-20261024/font-delta-command.json、holiday-lab/reports/current-rules-20261024/delta-final.json、holiday-lab/reports/followup-20261024/fonts/REPORT.md|
|鄧樹遠中英文職稱|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。目前data/faculty與英文角色均不含電競代理主任；保留系主任／副教授，不改歷史報告。|holiday-lab/reports/overnight-20261024/program/REPORT.md|
|教師頭部大小與水平眼線|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。六組各13位標記投影與原照HTTP SHA相符，共78原照觀察；以顯示定位達成，原照片未修圖。標記本身是人工近似。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/followup-20261024/root/current-verification.json|
|日文助理教授職稱|已修正|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。四個日文角色值改保留台灣原職＋Assistant Professor說明，維持合聘／從聘／留職狀態；另日文兩寬13角色補驗，不硬套日本助教。|holiday-lab/reports/overnight-20261024/program/REPORT.md、holiday-lab/reports/overnight-20261024/root/program-green-r2.json、holiday-lab/reports/overnight-20261024/qa/role-headings/result.json|
|全部正式職稱／處室外文名|缺件|no|維持no：本輪官網正文支持語文暨國際教學中心正式英文；既有8窗口名稱核對保留。全校官方日文未取得，新特教中心英名同步與部分職稱矛盾仍未釐清。|holiday-lab/reports/current-rules-20261024/threshold/lcc-home-dom.json、holiday-lab/reports/followup-20261024/contacts/REPORT.md|
|四PROGRAM整句與相依欄位|已修正|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。16個同頁欄位三語共48操作；115一般單招30名已截止，移除統一面試／固定時段／費用與證書保證；13可見值六組共78觀察。|holiday-lab/reports/overnight-20261024/root/program-apply.json、holiday-lab/reports/followup-20261024/qa/result.json|
|翻譯資料覆蓋與資訊保留|已檢查|yes|原三語資料未縮減，15卡47步保留、FAQ34→42、來源53→63；新字典每語86項皆為明列審閱文案，無非預期變更或舊key刪除。不是母語逐句批准。|holiday-lab/reports/current-rules-20261024/dictionary-final.json、holiday-lab/reports/current-rules-20261024/current-verification.json|
|歷史英文資料對映與差異處理|已修正|yes|本次真建置未成對0、衝突0；前輪25項EN資料對齊保留，未改配對器。|holiday-lab/reports/current-rules-20261024/build-command-r3.json、holiday-lab/reports/current-rules-20261024/dictionary-final.json、holiday-lab/reports/followup-20261024/i18n/REPORT.md|
|在校指南標題、直白分類與三欄|已檢查|yes|8879指南15卡、直白八分類，三語1440三欄/390單欄通過；版型與索引程式未改。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|新生／在校／轉學／畢業身分索引|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。六類身分索引及搜尋／分類組合回歸通過，實際篩選與重設可用。|holiday-lab/reports/overnight-20261024/root/guide-regression-green.json、holiday-lab/reports/followup-20261024/qa/result.json|
|大流程、每步小說明與FAQ|已修正|yes|8879維持47步小說明，42FAQ及63來源；5個修正主題408文案觀察、59個實際引用來源708標題/註記觀察。流程及資料可由凍結提案完整重建。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-verification.json、holiday-lab/reports/current-rules-20261024/regression-final-command.json|
|畢業檢核：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：112–115一般日四技課表；1150610離校要點；2026/02/28檢核公告；保留缺口：個別班別及入學年仍須匹配；檢核公告資料算至114-1，不代表115-1即時成績；教務檢核PDF附件未視覺讀完|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|校外實習：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：112–115一般班課表；官網列版107系手冊；保留缺口：115本系要點適用、當期申請考核Word全文及校級實習辦法仍缺；107版不升格當期|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|證照認列：逐題來源核對|已修正|yes|已讀113/10/9證照獎助全文，分開學籍、半年申請、補件及畢業認列；完整本系認列表與115-1公告仍缺，未把舊金額當當期承諾。|holiday-lab/reports/current-rules-20261024/threshold/REPORT.md、holiday-lab/reports/current-rules-20261024/threshold/source-matrix.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-proof-command.json|
|我要請假：逐題來源核對|已修正|yes|已讀114/11/19現列規則兩頁與公開空白表；分清申請、簽核與心理假額，補3FAQ。2019不再作現行依據；2026公告/111操作節點與新版核決級距仍須生輔確認。|holiday-lab/reports/current-rules-20261024/leave/REPORT.md、holiday-lab/reports/current-rules-20261024/leave/source-matrix.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-proof-command.json|
|選課加退選：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：1140219選課準則；115-1加退選已截止公告；保留缺口：115-1棄選與特殊處理當期日程／表單仍缺；不公布由週次反推的日期|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|學分抵免：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：1140910抵免辦法全文；115-1程序；2018舊空白表；保留缺口：舊表在學一次與新辦法每事因一次不一致；當期印表版本仍待核；9/21截止不作現在受理|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|專題製作：逐題來源核對|已修正|yes|當前公開三DOCX原檔與前次相同，辦法仍108版；已向學生明示二審/三審差異。當屆規則、評分/補審仍缺，不代學校選期限。|holiday-lab/reports/current-rules-20261024/study/REPORT.md、holiday-lab/reports/current-rules-20261024/study/matrix.json、holiday-lab/reports/current-rules-20261024/study/attachment-comparison.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|英文門檻：逐題來源核對|已修正|yes|已讀114/12/24門檻辦法、113入學起修課辦法及3現列空白表；核112–115一般班基本門檻，補有效證明與替代條件。115-1全英課清單、105表適用衝突仍未核。|holiday-lab/reports/current-rules-20261024/threshold/REPORT.md、holiday-lab/reports/current-rules-20261024/threshold/source-matrix.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-proof-command.json|
|休學復學與兵役：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：1120426休學辦法；1150202學則；115-1注意事項；保留缺口：112細則提早復學例外與115學則未列例外衝突；退費條文錯引；當期表單／兵役個案未核|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|獎助與急難協助：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：115-1不利處境／低收已截止索引；生輔急難須知；勵學金入口；保留缺口：各方案當期全文／表單未全齊；勵學金只有標題摘要；115-2日期000年無效；所得資產門檻不得外推各急難|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|遇到困難找誰：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：2026/10/23官網正文：身心健康中心預約、115獨立特殊教育資源中心；保留缺口：現行申訴／性平全文和空白表未得；不保證保密無例外、不用活動分機代個案程序；10/24 live403|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|就業資源：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：職發中心官網職掌索引；系辦入口；保留缺口：UCAN與現行聯絡及當期職缺未逐項live核實；1712/1713索引線索不升格當日全面聯絡核准|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|繼續升學：逐題來源核對|已修正|yes|兩處現掛116A1與既有原檔同SHA；同頁書審100%/口試矛盾未更正，指南改明示詢問窗口，不認定免口試。所查索引未見116A4，不推論全校未公布。|holiday-lab/reports/current-rules-20261024/study/REPORT.md、holiday-lab/reports/current-rules-20261024/study/matrix.json、holiday-lab/reports/current-rules-20261024/study/attachment-comparison.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|海外實習：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：2026第九屆HC成果；教育部學海要點既存證據；109跨校歷史來函；保留缺口：本系115當期名額語言費用補助契約及返校期限未得；不以109別計畫或觀光簽證湊數|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|海外見學：逐題來源核對|已檢查|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。已核對並保存版本：113發展計畫歷史活動；系網介紹與國際處入口；保留缺口：115本系招募團期、費用補助退費、認列學分及請假成果表未核；交換目錄不是見學規則全文|holiday-lab/reports/overnight-20261024/guide/matrix.json、holiday-lab/reports/overnight-20261024/guide/REPORT.md|
|當期完整規章、表單及年度衝突|缺件|no|維持no：已補請假、英文門檻及證照母法/現列表單；其餘當期附件、專題二/三審、116口試、105免綁表與最新母法適用差異仍缺。不能把文件方法通過升格所有政策已釐清。|holiday-lab/reports/current-rules-20261024/leave/source-matrix.json、holiday-lab/reports/current-rules-20261024/threshold/source-matrix.json、holiday-lab/reports/current-rules-20261024/study/matrix.json|
|小颯及既有學生作品／原始署名|已檢查|yes|315原圖/凍結遊戲素材SHA保留，既有作品與署名不改；不表示權利全核。|holiday-lab/reports/current-rules-20261024/preserve-r3-command.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|取消主網站已知生成素材引用|已修正|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。主站favicon改為無圖示，頁底節日入口改暫緩；六組實際82項引用未命中已知生成清單，原PNG與凍結遊戲包留存。|holiday-lab/reports/overnight-20261024/root/icon-green.json、holiday-lab/reports/overnight-20261024/root/asset-audit.json、holiday-lab/reports/followup-20261024/qa/result.json|
|全部素材製程與權利已確認|缺件|no|8876前版限定證據保留；本輪未新增此項全範圍驗收。小颯作者由使用者確認；其他既有校方作品／照片的逐件製程與權利未全數另核，不能宣稱整包零AI或所有改編權已核。|holiday-lab/reports/overnight-20261024/root/asset-audit.json|
|試玩放招生後、頁尾前|已檢查|yes|8879六組僅核入口仍在招生後、頁尾前；沒點進遊戲或測玩，首屏無節日啟動入口。|holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|全部節日遊戲凍結|保留|yes|所有節日遊戲維持凍結，未啟遊戲/Unity/生圖或續跑巨量QA。|holiday-lab/reports/current-rules-20261024/preserve-r3-command.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|Flora／胖倉鼠WebGL成品|缺件|no|最近指定TF-BASE夾實查在2026-10-24T01:12:07.890Z：5份工單/腳本，未見成品；本段未重查，不以舊結果冒稱現在已驗包。保留待回傳、不啟Unity或重派。|holiday-lab/reports/followup-20261024/root/webgl-recheck.json|
|維持漫畫／手繪風格|保留|yes|原漫畫/手繪版型、CSS、元件及照片定位保持；只做必要學生文案/來源修正。|holiday-lab/reports/current-rules-20261024/preserve-r3-command.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|本輪本機建置|已檢查|yes|最新.measure-current-rules-20261024-03／360檔／app-FPPJGCJR.js，本機8879。01/02與8876保留；未發布。|holiday-lab/reports/current-rules-20261024/build-command-r3.json、holiday-lab/reports/current-rules-20261024/current-verification.json|
|獨立三語與手機驗收|已檢查|yes|最新版6組144yes／0no、54WebP；47source與360build前後相同，主控逐SHA及提案重建複驗。01版因切分支轉行尾真RED保留，02版138yes是歷史版。|holiday-lab/reports/current-rules-20261024/qa/raw-r3-command.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json、holiday-lab/reports/current-rules-20261024/current-proof-command.json、holiday-lab/reports/current-rules-20261024/newline-diagnosis.json|
|實體手機與母語審閱|保留|no|8876前版限定證據保留；本輪未新增此項全範圍驗收。本輪是390模擬視窗與工具核對；實體手機、三語母語逐句與使用者新畫面確認未取得。|holiday-lab/reports/followup-20261024/qa/result.json、holiday-lab/reports/overnight-20261024/program/REPORT.md|
|不push／不main／不刪檔／不C節|已檢查|yes|四dirty+R0五檔、main refs與C節SHA保持；本段本機codex分支提交，不push、不發布、不刪檔。|holiday-lab/reports/current-rules-20261024/preserve-r3-command.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|
|小颯首獎年份|已修正|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。主辦CELSYS2021-04-28公告支持第27屆；中英資料2022→2021，三語兩寬WIN2021與小颯署名可見，原畫不改。|holiday-lab/reports/followup-20261024/art/primary.json、holiday-lab/reports/followup-20261024/root/year-green.json、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|
|現行請假／求助分機與正式英文|已修正|yes|8876前版限定證據保留；本輪未新增此項全範圍驗收。生輔現行表請假2126取代舊索引2114；諮商2127與動遊特教2149分流。招生選才組Admissions and Selection Division、通識Center for General Education另有真UI驗證。|holiday-lab/reports/followup-20261024/contacts/REPORT.md、holiday-lab/reports/followup-20261024/root/contacts-green.json、holiday-lab/reports/followup-20261024/qa/new-targets/result.json|
|來源註記改成學生用語|已修正|yes|逐ID將48個舊來源註記改成20組白話說明；仍明列只核摘要/舊版/當期缺件，不改日期、URL或辦理規定。59個實際引用來源的三語註記可見驗收通過。|holiday-lab/reports/current-rules-20261024/source-notes-copy.json、holiday-lab/reports/current-rules-20261024/source-notes-green.json、holiday-lab/reports/current-rules-20261024/qa/raw-r3/result.json|

## 指令與收據

- build-command-r3.json：node holiday-lab/build-review.mjs .measure-current-rules-20261024-03 --measurement；exit0，360檔。
- regression-final-command.json：node --test 明列9個既有/新增檔加source-notes測試，共29 passed／0failed，exit0。每項新 factual 修正及註記均保留red與green。
- qa/raw-r3-command.json：三語390/1440六組144yes，408文案＋708來源欄位觀察、54WebP；47source與360build前後SHA相同，exit0。原照僅使用已核本機bytes快取，不冒稱新遠端78次抓照。
- current-proof-command.json：重算54截圖、全部來源/build SHA，依凍結提案完整重建guide，再核字典變更只有明列86項，exit0。
- preserve-r3-command.json：315素材、五個保護檔、13未動產品檔、main/C與其他10卡相同，exit0。
- font-delta-command.json：只對新增10字查既有字體cmap/CSS range，10可用；工具只提供合併stdout/stderr，未假造分流。不是全站實際fallback或真機證明。
- layout-command-r2.json：8876舊16旋轉h2候選重新量測皆1行，3項校準支持方法；不是全站孤尾0。

01版raw-r1因root在QA中切分支，五份LF轉CRLF導致原始SHA守門真RED；newline-diagnosis.json逐位元證明僅行尾，失敗留存。02版138yes是註記白話化前的歷史通過；03才是最新144yes。首次校準寬度、首次apply-leave讀錯翻譯容器key等方法失敗收據保留，不當產品修復證據。

## 明確未完成

本階段50列，44yes、6no；不是全站發布批准，使用者確認0。其餘現行表單/規章及版本衝突、全部正式外文名、逐字fallback與跨OS、素材完整權利、實體手機/母語、兩WebGL回傳仍缺。TF-BASE本段沒有新回查，不以舊metadata當即時狀態。

儀表板已重產：dashboard-build-command.json／dashboard-verify-command.json為18/18；dashboard-ui-command-r2.json為2組14yes。第一版方法誤讀StatusDashboard，實檔為projectDashboard，原失敗保留；只修驗證方法，未改產品。交接與Vault均已本機更新，未執行私人Vault整庫推送。
