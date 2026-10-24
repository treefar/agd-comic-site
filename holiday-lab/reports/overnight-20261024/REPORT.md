# 2026-10-24 系網全項本機核對

source_agent: codex；TF-GO。實際執行時間見各收據UTC；符合台灣10/24 01:00之後，未聲稱01:00準時執行。

最新版 http://127.0.0.1:8875/ ，儀表板 /progress/ ，指南 /?lang=zh#/students/guide 。-01／8874為105字說明超限前的保留版；舊8873、8860不可當本輪最新。

本輪完成逐項核對與有來源的必要修正，仍不是全站發布批准。節日遊戲全部凍結，不push、不發布、不碰main、不刪檔、不執行C節。

| 項目 | 處理 | yes／no | 實際結果與限制 | 原始證據 |
|---|---|---|---|---|
| 交接、工單、分支及保全錨點 | 已檢查 | yes | 三份指定文件完整載入並記錄SHA；主工作樹與原clone可讀。未以8860舊畫面判定新版。 | [root/before.json](root/before.json) |
| 中英日共用介面與資料 | 已檢查 | yes | 共用元件與中文正本保留；三語390／1440六組目前版通過，未另外建立精簡外文首頁。 | [qa/result.json](qa/result.json) |
| 桌面完整導覽 | 已檢查 | yes | 1440三語八章節及兩語言入口可見，保留既有兩層導覽。 | [qa/result.json](qa/result.json) |
| 手機選單與自動收合 | 已檢查 | yes | 390三語真點選選單與章節，選單可開啟並於跳轉後收合。 | [qa/result.json](qa/result.json) |
| 語言切換 | 已檢查 | yes | 三語皆實際操作切換連結，保留同版導覽；未只檢查字串存在。 | [qa/result.json](qa/result.json) |
| 頁尾與操作按鈕 | 已檢查 | yes | 六組頁尾mail／tel、About連結與代表按鈕操作通過；不是每個外部站點連結的存活保證。 | [qa/result.json](qa/result.json) |
| 固定標題列與章節定位 | 已檢查 | yes | 三語About定位均在固定列下方；既有動態offset與原styles未改。 | [qa/result.json](qa/result.json) |
| 導覽短末行與代表標題 | 已檢查 | yes | 指定寬度無橫向溢位；旋轉h2 Range候選已目視排除，另留畫面收據。未全面改寫所有內文換行。 | [qa/result.json](qa/result.json)、[qa/role-headings/result.json](qa/role-headings/result.json)、[qa/role-headings-command.json](qa/role-headings-command.json) |
| 現有字體與指定頁載入 | 已檢查 | yes | 首頁與指南六組fonts.loaded；本輪未換字體或縮字，已保留姓名與正式資格。 | [qa/result.json](qa/result.json) |
| 中日全站逐字缺字稽核 | 保留 | no | 本輪沒有重跑全站cmap／全部替補字型逐字稽核；fonts.loaded及代表畫面不能當成全字零缺字證明。 | [qa/result.json](qa/result.json) |
| 鄧樹遠中英文職稱 | 已檢查 | yes | 目前data/faculty與英文角色均不含電競代理主任；保留系主任／副教授，不改歷史報告。 | [program/REPORT.md](program/REPORT.md) |
| 教師頭部大小與水平眼線 | 已檢查 | yes | 六組各13位標記投影與原照HTTP SHA相符，共78原照觀察；以顯示定位達成，原照片未修圖。標記本身是人工近似。 | [qa/result.json](qa/result.json)、[root/current-verification.json](root/current-verification.json) |
| 日文助理教授職稱 | 已修正 | yes | 四個日文角色值改保留台灣原職＋Assistant Professor說明，維持合聘／從聘／留職狀態；另日文兩寬13角色補驗，不硬套日本助教。 | [program/REPORT.md](program/REPORT.md)、[root/program-green-r2.json](root/program-green-r2.json)、[qa/role-headings/result.json](qa/role-headings/result.json) |
| 全部正式職稱／處室外文名 | 缺件 | no | 已保留前輪12正式名稱修正；全校處室官方日文名稱未齊，蔣天華中英官網職稱亦衝突，不自行替校方選一職級。 | [program/REPORT.md](program/REPORT.md) |
| 四PROGRAM整句與相依欄位 | 已修正 | yes | 16個同頁欄位三語共48操作；115一般單招30名已截止，移除統一面試／固定時段／費用與證書保證；13可見值六組共78觀察。 | [root/program-apply.json](root/program-apply.json)、[qa/result.json](qa/result.json) |
| 翻譯資料覆蓋與資訊保留 | 已檢查 | yes | 1721個靜態資料字串中兩語各1720有字典，唯一未映射為應保留筆名小颯；動態明示三語另計。不能據此宣稱母語逐句正確。 | [root/translation-inventory-final.json](root/translation-inventory-final.json) |
| 歷史英文資料對映與語意覆核 | 保留 | no | build仍列21條stats歷史資料未成對及21個共字串衝突候選；共用頁仍由中文正本及已建字典呈現，未擅刪線上新資料。來源候選、正式專名與母語語意仍需另核。 | [root/build-r2.json](root/build-r2.json)、[root/i18n-catalog-frozen.json](root/i18n-catalog-frozen.json) |
| 在校指南標題、直白分類與三欄 | 已檢查 | yes | 維持四字標題、八分類、15卡；1440三欄與390單欄適配、索引無宣傳贅語。 | [qa/result.json](qa/result.json) |
| 新生／在校／轉學／畢業身分索引 | 已檢查 | yes | 六類身分索引及搜尋／分類組合回歸通過，實際篩選與重設可用。 | [root/guide-regression-green.json](root/guide-regression-green.json)、[qa/result.json](qa/result.json) |
| 大流程、每步小說明與FAQ | 已修正 | yes | 保留47步與小說明，FAQ由30增至34，52來源；新增24組英日翻譯及精簡後求助說明兩語key。原FAQ、卡片及來源日期保留。 | [root/guide-apply.json](root/guide-apply.json)、[root/support-shortening.json](root/support-shortening.json)、[root/guide-regression-green.json](root/guide-regression-green.json) |
| 畢業檢核：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：112–115一般日四技課表；1150610離校要點；2026/02/28檢核公告；保留缺口：個別班別及入學年仍須匹配；檢核公告資料算至114-1，不代表115-1即時成績；教務檢核PDF附件未視覺讀完 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 校外實習：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：112–115一般班課表；官網列版107系手冊；保留缺口：115本系要點適用、當期申請考核Word全文及校級實習辦法仍缺；107版不升格當期 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 證照認列：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：115一般班／技優班課表；114-2獎助公告；公開證照系統；保留缺口：現行完整認列清單、115-1獎助公告與各證照版本未得；107金額與114-2上限歧異不硬選 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 我要請假：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：2026/06簽核公告；1150202學則相關條文；2019歷史請假PDF；保留缺口：最新完整請假規則及全假別／時限附件未得；2019兩日與2026五日不可混成同一套 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 選課加退選：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：1140219選課準則；115-1加退選已截止公告；保留缺口：115-1棄選與特殊處理當期日程／表單仍缺；不公布由週次反推的日期 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 學分抵免：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：1140910抵免辦法全文；115-1程序；2018舊空白表；保留缺口：舊表在學一次與新辦法每事因一次不一致；當期印表版本仍待核；9/21截止不作現在受理 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 專題製作：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：112–115一般班課表；官網第十二屆108修訂辦法及三份DOCX；保留缺口：換組表二審前、舊辦法／分組表三審前衝突；當屆規定、人數、評分、補審與授權清單未核 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 英文門檻：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：115課表；2023門檻頁；通識修課與115-1英檢排程；保留缺口：現行全文、最新表單、證明效期歧異、115-1替代課清單與即時名額未核；10/24場報名截止不宣稱尚開 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 休學復學與兵役：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：1120426休學辦法；1150202學則；115-1注意事項；保留缺口：112細則提早復學例外與115學則未列例外衝突；退費條文錯引；當期表單／兵役個案未核 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 獎助與急難協助：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：115-1不利處境／低收已截止索引；生輔急難須知；勵學金入口；保留缺口：各方案當期全文／表單未全齊；勵學金只有標題摘要；115-2日期000年無效；所得資產門檻不得外推各急難 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 遇到困難找誰：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：2026/10/23官網正文：身心健康中心預約、115獨立特殊教育資源中心；保留缺口：現行申訴／性平全文和空白表未得；不保證保密無例外、不用活動分機代個案程序；10/24 live403 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 就業資源：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：職發中心官網職掌索引；系辦入口；保留缺口：UCAN與現行聯絡及當期職缺未逐項live核實；1712/1713索引線索不升格當日全面聯絡核准 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 繼續升學：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：116碩甄全文及115碩士考試歷史簡章；保留缺口：116設創所書審100%與口試文字衝突未解；116考試新簡章未得；附表四115／116字樣不代更正 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 海外實習：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：2026第九屆HC成果；教育部學海要點既存證據；109跨校歷史來函；保留缺口：本系115當期名額語言費用補助契約及返校期限未得；不以109別計畫或觀光簽證湊數 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 海外見學：逐題來源核對 | 已檢查 | yes | 已核對並保存版本：113發展計畫歷史活動；系網介紹與國際處入口；保留缺口：115本系招募團期、費用補助退費、認列學分及請假成果表未核；交換目錄不是見學規則全文 | [guide/matrix.json](guide/matrix.json)、[guide/REPORT.md](guide/REPORT.md) |
| 當期完整規章、表單及年度衝突 | 缺件 | no | 15題皆列現行性缺口；10/24四站web受阻，直接重取為202空內容。舊107／108規章、未讀附件、116設創所書審／口試衝突不當作現行已核。 | [guide/live-recheck.json](guide/live-recheck.json)、[guide/REPORT.md](guide/REPORT.md) |
| 小颯及既有學生作品／原始署名 | 已檢查 | yes | 首頁首張保留小颯完整手繪與畢業生署名；作品原圖與既有照片等315素材SHA未變，未生圖或改作品內容。 | [root/asset-audit.json](root/asset-audit.json)、[root/retained-assets.json](root/retained-assets.json) |
| 取消主網站已知生成素材引用 | 已修正 | yes | 主站favicon改為無圖示，頁底節日入口改暫緩；六組實際82項引用未命中已知生成清單，原PNG與凍結遊戲包留存。 | [root/icon-green.json](root/icon-green.json)、[root/asset-audit.json](root/asset-audit.json)、[qa/result.json](qa/result.json) |
| 全部素材製程與權利已確認 | 缺件 | no | 小颯作者由使用者確認；其他既有校方作品／照片的逐件製程與權利未全數另核，不能宣稱整包零AI或所有改編權已核。 | [root/asset-audit.json](root/asset-audit.json) |
| 試玩放招生後、頁尾前 | 已檢查 | yes | 共用首頁維持頁底策展入口與暫緩提示，首屏無遊戲控制；未回到首頁最上方。 | [root/frozen-entry-green.json](root/frozen-entry-green.json)、[qa/result.json](qa/result.json) |
| 全部節日遊戲凍結 | 保留 | yes | 包含勞動節，未開發／修改玩法／測玩／巨量QA；僅調整主網站入口，既有遊戲、素材與音訊檔保留。 | [root/retained-assets.json](root/retained-assets.json)、[qa/result.json](qa/result.json) |
| Flora／胖倉鼠WebGL成品 | 缺件 | no | 只回查指定TF-BASE交接夾，仍5份工單／腳本、未見成品；不推論其他位置，未啟Unity、未彈執行檔、未重派或下載舊大型包。 | [webgl/folder-recheck.json](webgl/folder-recheck.json) |
| 維持漫畫／手繪風格 | 保留 | yes | 只做必要網站文案、素材引用與入口修正；styles、章節版型與照片定位原樣，未全面換版、未換字體、未新增AI圖示。 | [root/current-verification.json](root/current-verification.json) |
| 本輪本機建置 | 已檢查 | yes | 最新.measure-overnight-20261024-02，app-UVYLK6U2.js，360檔；measurement本機驗證版，不是發布核准。 | [root/build-r2.json](root/build-r2.json) |
| 獨立三語與手機驗收 | 已檢查 | yes | 6組136項、36PNG，14來源與360建置檔前後相符；root再唯讀核SHA。partial／失敗批次保留，不採認為最終。 | [qa/command.json](qa/command.json)、[root/current-proof.json](root/current-proof.json) |
| 實體手機與母語審閱 | 保留 | no | 本輪是390模擬視窗與工具核對；實體手機、三語母語逐句與使用者新畫面確認未取得。 | [qa/result.json](qa/result.json)、[program/REPORT.md](program/REPORT.md) |
| 不push／不main／不刪檔／不C節 | 已檢查 | yes | 原四dirty與R0五檔SHA、main refs及C節相同；每項codex短分支，本輪只本機提交，未執行C節。 | [root/before.json](root/before.json)、[root/current-proof.json](root/current-proof.json) |

## 實際指令與輸出

- node holiday-lab/build-review.mjs .measure-overnight-20261024-02 --measurement：exit0，360檔、app-UVYLK6U2.js；完整stdout/stderr在root/build-r2.json。
- node --test tests/student-guide.test.cjs tests/student-guide-audience.test.cjs tests/admission-guide-eligibility.test.cjs（併本輪guide-integrity）：18/18，exit0；root/guide-regression-green.json。前一回15/16因求助105字超過既定100字，未放寬測試，精簡91字後通過。
- icon-policy、review-server：3/3；shared favicon：1/1；frozen-entry：1/1；PROGRAM：2/2；dashboard adapter：3/3。各命令完整參數、stdout/stderr及exit均保留root/*.json。
- 獨立UI完整命令在qa/command.json：6/6、136yes、36PNG、78照片SHA、78招生可見值，source/build stable。root/verify-current.cjs唯讀再核exit0。
- 靜態字典1721字串，兩語各1720：唯一小颯筆名不翻；21資料對映與21字串衝突候選另存，不能當母語逐句正確。
- 舊tools/validate-en.mjs在此工作樹不存在，嘗試為exit1（root/english-validator.json），未拿原clone舊資料通過替代。

## 保留的失敗與方法限制

舊8873 baseline照片收集器跨切頁有body取消，原partial留存；8874新批因root字數回歸抓到105字後中止，不採認。最終只採8875 green-02。首個PROGRAM單測漏用實際renderer的空白正規化，修正測試後green-r2；首個資料盤點的收據標籤撞到輸出檔，原檔未覆寫，final另存。沒有刪除原失敗或改產品來配合錯誤方法。

## 下一步

先由使用者看8875首頁／指南與儀表板；待TF-BASE真正回傳完整WebGL再驗包整合。補齊15題當期附件／衝突、正式處室外文名、全字型與母語／實體手機核對後，才另外評估發布。遊戲繼續凍結，C節完全未授權。

## 儀表板與交接

node holiday-lab/build-dashboard.mjs → exit0；47列、40yes／7no、使用者0，摘要由規則計算。verify-dashboard --authority → 18/18、exit0。原交接、STATUS與既有Vault專案紀錄已本機更新，未執行私人Vault同步。

儀表板獨立補驗 qa/dashboard/：1440／390兩組、17yes／0no、3PNG、exit0，搜尋WebGL／缺件篩選／來源展開／重設／深色均通過。手機文件無橫溢，表格保留容器內水平捲動。Chrome已另開本輪首頁與儀表板並保留供審閱。
