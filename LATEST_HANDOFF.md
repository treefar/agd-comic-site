## 2026-10-24 最新：全項網站核對與本機8875，節日凍結

- source_agent: codex；TF-GO。使用者凌晨後一次接續已執行；本輪是網站檢查及必要修正，不是發布批准。最新有效 .measure-overnight-20261024-02，360檔、app-UVYLK6U2.js。首頁 http://127.0.0.1:8875/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/；8874首版與8873／8860舊版保留，不當最新。
- 所有先前網站需求整理47項：40 yes、7 no／缺件。完整逐項理由、指令、stdout／stderr／exit、來源與畫面在 C:/agywork/agd-holiday-prototypes/holiday-lab/reports/overnight-20261024/REPORT.md 及 verification.json；資料／工具／使用者三層分開，使用者新畫面確認0。
- 已修四PROGRAM整句及16個相依欄位三語48操作，115四技進修部一般單招30名已截止；移除統一面試、固定時段與未核保證。四日文職稱保留台灣助理教授／Assistant Professor，不直接等同日本助教。116完整附件、蔣天華中英官方職稱衝突及全處室官方日文名仍待核。
- 指南15卡全題來源核對，維持三欄／直白分類／身分索引／47步小說明，FAQ30→34、來源45→52；新增24組英日譯文。補畢業檢核與離校、請假補考、棄選、抵修免修及兩中心求助分流。105字說明由原回歸抓出後精簡91字，沒有放寬測試；原FAQ、流程及來源日期保留。當期完整附件與年度衝突逐題列缺件，10/24四站受阻／202空內容，不冒稱當日全文讀完。
- 獨立網站6/6、136 yes／0 no、36PNG，14來源＋360建置檔前後SHA一致；78照片原照HTTP SHA及78招生可見值。另日文兩寬角色、旋轉標題目視補驗，原圖不動。root唯讀重核通過。指南／身分／招生路徑及本輪引用回歸18/18；儀表板權威18/18，搜尋／篩選／展開另驗。不是全站逐字cmap、母語或實體手機認證。
- 主網站停止引用已知生成favicon；節日入口改暫緩提示，學生策展保留招生後、頁尾前。小颯完整原畫與署名保留，315原圖／凍結遊戲素材SHA未改；實際82 DOM引用含CSS漸層，不能當整包零AI或權利已全核。所有節日遊戲含勞動節凍結，未測玩／改遊戲／生圖／啟Unity／續跑巨量QA。
- TF-BASE指定交接夾本輪仍5份工單／腳本、未見Flora／胖倉鼠WebGL成品；只代表所查夾，未啟Unity、不重派、不下載大型舊來源。WebGL與7項保留缺口可在儀表板查，不宣稱全部完成。
- 每項本機codex短分支，整合分支codex/overnight-integrated24；未push、未發布、未碰main、未刪檔、C節完全未執行。四份原dirty＋R0、main refs與C節SHA保留；原失敗／partial／舊證據留存。Vault只本機更新，不執行私人整庫同步。
- 儀表板正本 holiday-lab/dashboard/out/index.html，重產 node holiday-lab/build-dashboard.mjs；新模式以本輪718個檔案SHA綁定核對網站證據，舊遊戲證據不轉新通過。驗證 node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs 。
- 下一輪第一件事：先看8875與本輪REPORT，按使用者具體回饋續修；先處理有證據的歷史EN對映／字串候選，再補當期官方附件、正式名稱與字型。TF-BASE有新完整包才驗包整合。保持遊戲凍結與C節邊界，不擴大發布。

```text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-overnight-20261024-02 --dashboard=holiday-lab/dashboard/out --port=8875
```

## 2026-10-23 最新裁定：10/24凌晨01:00後接續，節日遊戲全面凍結

- source_agent: codex。使用者要求等台灣時間2026-10-24 01:00後再繼續，把先前網站需求全部核對一次。已建立本對話一次性heartbeat並回讀確認ACTIVE；準備工單work-orders/20261024/AFTER-0100.md已在原專案與主工作樹各留一份，內容相同。現在僅保存排程與裁定，沒有先開始功能修改。
- 最新美術原則覆蓋舊生圖／節日指示：節日遊戲全部先不做、不測玩、不續跑大量QA（含勞動節）；保留原本漫畫與手繪風格，盡量利用小颯及現有學生作品，保留完整原圖和署名，不重畫、不修原圖、不改內容，不使用任何AI生成素材、不呼叫生圖／影音生成。已知生成素材只取消網站引用或換用已確認的既有作品／照片，原檔不刪；未知來源列待核。
- 凌晨核對範圍：中英日同版與資訊完整、導覽／頁尾／按鈕、換行缺字、職稱與處室名稱逐筆查證、教師照片版面頭高／水平線、4PROGRAM及相依欄位、在校指南所有既有題目／流程小說明／FAQ及當期官方來源。Flora／胖倉鼠僅查新回傳，完整成品才本機驗包／頁底整合，不啟Unity、不重派。
- 目前有效頁面仍8873／.measure-games-bottom-20261023-01，遊戲入口維持招生後、頁尾前；8860是舊版。未push、未發布、main／C節／四份原dirty均保留。原完整UI與使用者畫面確認缺口不升格。
- 排程準備分支codex/overnight-handoff。到時先讀此段、工單、主工作樹STATUS與相關研究，確認磁碟與服務再續；逐項列已核／已修／保留／缺件，驗收yes/no附實際指令與exit code，更新儀表板及交接，不自行碰C節或擴大發布。

## 2026-10-23 接續：遊戲試玩移至頁底，本機8873

- source_agent: codex。分支codex/games-page-bottom；使用者要求遊戲先放最底下，已將小型策展與節日試作從首頁首屏移至招生後、聯絡頁尾前。三語共用排版；小颯與原三件完整作品保留在首屏。
- 最新.measure-games-bottom-20261023-01（360檔、app-KOFDUUZD.js），http://127.0.0.1:8873/ ，試玩區 /#student-play ，儀表板 /progress/ 。8872為前輪導覽版，8860為更舊版本。
- 原症狀在8872重現heroGameControls=3、exit1；新版三語×390/1440，6/6真UI、24作品狀態、36PNG；DOM順序、14選項、iframe按需開啟、Esc關閉／焦點返回與六次小颯來源署名均通過。另新build導覽18/18；來源前後SHA相同。本輪主控工具複驗，不宣稱新的獨立代理驗收。
- 報告holiday-lab/reports/games-bottom-20261023/REPORT.md；green-r2/為有效首頁／頁底收據，navigation/為本輪導覽收據。第一版green/為測試循環到第四件卻等待第一件來源的工具錯誤，原檔保留，沒有改產品來配合測試。
- 重啟：node scripts/serve-local-review.cjs --site=.measure-games-bottom-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8873 。不push、不發布、不碰main、不刪檔、不執行C節；勞動節仍暫緩、未啟Unity或巨量QA。WebGL仍依前輪回查列待回，本輪未重查雲端。
- 下一輪先看8873首頁順序並依具體意見續修；不要按8860舊畫面判斷新版。其餘PROGRAM、指南缺件及WebGL新回傳另續，不自行擴大發布。

## 2026-10-23 接續：三語導覽修正版8872，WebGL回查仍待回傳

- source_agent: codex；TF-GO。使用者已要求「繼續」，本輪完成首頁／儀表板啟動、WebGL回查與英日桌面導覽修正；前輪關機暫停段屬歷史。本機分支codex/nav-language-desktop，未push／發布／main／刪檔／C節操作，勞動節仍暫緩。
- 最新 .measure-nav-language-20261023-02（360檔、app-C4CTM4HI.js），http://127.0.0.1:8872/ ，英文 /?lang=en 、日文 /?lang=ja ，進度 /progress/ 。8870為小颯前版；8860是更舊版；8871是本輪首版（章節定位真RED），都保留，不當最新。
- 桌面1181px以上改兩層共用導覽，上排AGD／系名／報名，下排八章節＋兩語言；移除英日761–1900強制隱藏。原字型、字級與小颯首圖／署名保留。手機平板仍是可展開選單。
- 另修app／hash路由寫死60px及作品定位80px：共用siteHeaderOffset依實際固定列高度加12px，章節標題可見。原症狀en1440 NAV_LAYOUT0/1；首版章節遮擋真RED保留；最新三語×390/1180/1181/1440/1900/2284，18/18實際UI通過，含完整label、手機展開／自動關閉、桌面章節定位及18PNG。
- 本輪Drive指定交接夾仍只有5份工單／腳本，近兩日Flora／倉鼠名稱搜尋只回兩工單；未收到可整合WebGL包。最新實查時間及完整回覆在holiday-lab/reports/nav-language-desktop-20261023/webgl-recheck.json，不拿19:49舊結果冒充本輪。未啟Unity、未重派、未下載舊大型包。
- 報告holiday-lab/reports/nav-language-desktop-20261023/REPORT.md，原始red／green／green-r2與proof.json；可回歸命令node scripts/test-nav-layout.cjs <本機base含結尾/> <新證據目錄>。本輪只宣告導覽／定位通過，不借前版全站或遊戲收據。
- 下一輪第一件事：先看8872三語導覽，按使用者具體回饋續修；只有TF-BASE有新回傳再驗包／整合。其餘4PROGRAM相依欄位、指南缺件、完整UI與母語／真人審閱仍待續，不重啟勞動或舊巨量工作。

```text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-nav-language-20261023-02 --dashboard=holiday-lab/dashboard/out --port=8872
```

## 2026-10-23 關機前保全：小颯首頁已驗、TF-BASE未見WebGL，依使用者要求暫停

- source_agent: codex；TF-GO。工作樹 C:/agywork/agd-holiday-prototypes，分支 codex/xiaosa-credit-review。使用者要求完成本段後暫停以便關機；不再新增工作或重送工單。8870是最新小颯本機審閱版，關機後服務會停止。
- 使用者確認首頁手繪為畢業生「小颯」所畫。本輪依舊首頁唯一手繪海報 src 與實圖比對，沿用 images/posters/clipstudio-grand-prize.jpg 完整原圖，放首頁輪播首張、補三語畢業生署名及作品頁 team；未改原圖、未生新圖、未推定未知指導教師。原三件作品、完整署名與手動切換保留。
- 新 .measure-xiaosa-review-20261023-01／app-BWFF7U3Q.js／360檔，http://127.0.0.1:8870/ ，儀表板 /progress/ 。獨立短驗收6/6組、24/24作品狀態、6/6來源點擊、30PNG；9來源＋9HTTP前後穩定，無溢位／例外／圖片404。只限本次首頁及來源頁，不是全站或新遊戲發布驗收；使用者尚未確認新畫面。
- TF-BASE最新實查2026-10-23台灣19:49:30：指定交接夾5份工單／腳本，未見本次Flora／胖倉鼠WebGL；另有舊Flora來源候選，身分與完整性未驗，未下載大型包、未啟Unity、未重派。只代表所查資料夾，不推論別處沒有上傳。
- 12正式名稱已經獨立驗收後合入本機 merge d234fc4f3b3297be1f4411e714a8c2eedeb59674；兩批累計24譯值、48次可見觀察、60PNG，root唯讀複核exit0。此為8867同儕凍結build證據，不冒稱8870全站母語審查。4 PROGRAM整句與相依欄位待下一輪一致修正，115本系一般單招30名已截止，其他學制不可混用。
- 指南選課／抵免／請假／休復學／轉系另補現行母法草稿：首版24步15FAQ，supplement-current-rules共100項文件證據檢查yes、0no，仍有現行流程及跨版本衝突待核，不等於正式規章全部確認。畢業／獎助／協助／就業四題只有9/9 checkpoint檢查，完整四題草稿未完成；原始資料保存，未直接套產品。
- 8866前版release12yes／1unknown仍限定前版；真背景hidden仍unknown，完整UI gate仍NO。儀表板將本輪暫停、資料、工具與使用者確認分開；不把前版收據套成8870全站通過。
- 合併第一次因長路徑及locale dirty失敗，Git回復時覆寫4份原dirty；已從Git dangling commit f7e62206a266093fe076a24ef66ef0f1e78e9cb7 找回，逐SHA恢復4/4，原檔留dirty、不混入本輪提交，原始恢復備份另納入本輪報告保存。後續Git一律加 -c core.longpaths=true；修正後合併成功、fsck exit0。
- 不push、不發布、不碰main、不刪檔、不執行C節；勞動節暫緩。所有子代理本輪已停止新增任務；本機伺服器保留至使用者關機，不自行關閉電腦。
- 重開後第一件事：先讀此段和 holiday-lab/reports/shutdown-20261023/REPORT.md，再用下列命令恢復8870，等使用者看首頁回饋；不得重跑舊巨量QA或已完成研究。WebGL等新回傳再核來源，剩餘PROGRAM與指南缺件依證據續接。

```text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-xiaosa-review-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8870
```

報告：holiday-lab/reports/shutdown-20261023/independent/REPORT.md；holiday-lab/reports/tfbase-shutdown-check-20261023/REPORT.md；holiday-lab/reports/official-names-followup-20261023/REPORT.md。最終保存指令與檢查見shutdown-20261023/root/。

## 2026-10-23 最新：學生首頁、英日文案與指南已合成本機8866；五題補研交草稿

- source_agent: codex。主工作樹 C:/agywork/agd-holiday-prototypes，分支 codex/student-review-integrated；本機merge 73f91f6a8a12573bc86548358705689b1dceea7e 已合入 codex/plain-guide-layout。唯一衝突為.gitattributes，保留雙側規則；四份原實質dirty逐SHA保留，未提交舊勞動／清明暫存。
- 最新同版審閱：http://127.0.0.1:8866/ ，指南 /?lang=zh#/students/guide ，單款策展示範 /holiday-lab/student-curation.html?lang=zh ，儀表板 /progress/ 。建置 .measure-student-integrated-20261023-01 共360檔；重啟命令 node scripts/serve-local-review.cjs --site=.measure-student-integrated-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8866 。8863與8865舊收據保留，不當最新版。
- 使用者方向：首頁不用AI插畫，採三件完整學生作品／署名＋小型互動入口；節日入口合進「畫出來，動起來」主格，遊戲美術先一款策展示範，待畫面回饋再擴大。既有小favicon仍生成圖示；未逐件核學生作品製程／改編權，方向確認不等於畫面已確認。
- 新8866首頁9＋示範9＋代表嵌入2共20組通過，47PNG／54字型loaded；故障恢復另9組／15PNG；release 12yes／0no／1unknown，360HTTP/body SHA一致。真背景hidden未知，完整UI gate仍NO，不能升格全域發布通過。
- 新8866指南／招生獨立8組、12譯值24次觀察、36PNG、46指南layout／10364leaf，孤尾／越界0，18source／360build前後相同；root唯讀重核exit0。只改既有字型下換行，不縮字。16條一般文案回歸全過；其餘16名稱候選逐筆補研為12名稱有支持／4整句待核，未套產品、未作母語確認。
- 五主題補研另交審閱草稿：實習／海外實習／海外見學12步9FAQ（24來源、52項證據與結構檢查）；專題／升學10步6FAQ（21 URL、16項檢查）。官網AGD Files表單入口已由Chrome實讀後用既有學校Drive連接取相關文件，未讀教師／行政／個資；舊手冊107、專題108版本不能直接算115現行。專題換組截止、116招生附件及書審／口試衝突保留；現行海外甄選／見學仍待缺件，未套產品。
- 主報告 holiday-lab/reports/integrated-review-20261023/REPORT.md ，新獨立證據 guide-independent/REPORT.md ；補研 holiday-lab/reports/guide-internship-research-20261023/REPORT.md 、guide-capstone-study-research-20261023/REPORT.md ，名稱 holiday-lab/translation-review/proper-names-research-20261023/REPORT.md 。儀表板由上述原始收據計算，資料／工具／使用者三層分開。
- TF-BASE只回查原交接夾5份工單／腳本，兩源與WebGL未回，沒有重送或啟Unity。勞動節繼續暫緩；無push、發布、main修改、刪檔或C節操作。正式R0／舊巨量批次不續跑。
- 下一輪第一件事：看8866首頁、指南與單款示範回收具體意見；按補研缺件核現行規章及四條學制整句，再決定套用。不要直接放大美術或將舊規章／結構驗收當現行政策核定。最終儀表板回歸、smoke與本機保存結果見本輪主報告尾端。

## 2026-10-23 接續：學生首頁故障恢復補驗、翻譯獨立分支與指南補研

- source_agent: codex。主工作樹 C:/agywork/agd-holiday-prototypes，分支 codex/qingming-final-checks，本機保存 6c971a027a9e8f12696cfcdc6fcc43f208df0569；首頁仍以 .measure-student-hero-20261023-02／http://127.0.0.1:8863/ 為已驗證審閱版，單款示範 /holiday-lab/student-curation.html?lang=zh，儀表板 /progress/。
- 最新三題決策持續有效：首頁不用 AI 插畫、採學生完整作品＋小型互動入口，遊戲素材只先一款示範，等具體回饋再擴大。方向確認不是畫面或作品製程／改編權確認。
- 策展示範追加3語×HTTP503／空gallery／真等待載入時換語言，共9/9；15PNG、字型loaded、溢位與孤尾0、360runtime前後一致。root唯讀核對＋1正9負例10/10，沒有把故障注入當正常網路。詳細逐條yes/no與指令在 holiday-lab/reports/comprehensive-followup-20261023/REPORT.md。
- 清明只完成新來源域準備的獨立審查：作者7/7、獨立13/13、readonly exit0；28owner／213分軸候選／22來源模型序列。原生序列化、聯合布局、全部owner可見性／墨跡上界仍未證；error-longest、canonical、全站批准均false，未啟動巨量原生批次。
- 英日12處一般語意修正已在codex/plain-guide-copy本機保存（382f9c78／ffb00e52）；獨立01抓到指南中文手機3+1／孤尾真RED後，另開codex/plain-guide-layout僅修student-guide.css（5b2f838d），不縮字不改文案。最新 .measure-plain-copy-20261023-02／http://127.0.0.1:8865/?lang=zh#/students/guide ，獨立8/8頁面、24次譯文、36PNG、46指南layout／10364leaf，孤尾／越界0、18source／360build前後相同；root verify-v5重核exit0。原01／8864失敗及導覽工具失敗皆保留。此分支未合主工作樹，不把8863舊全站收據當8865新版全通過；其餘16正式名稱候選與母語確認仍待辦。
- TF-BASE既有交接夾10:06:12 UTC直接項目仍5份工單／腳本，未見兩源或WebGL；只代表該夾，不推論別處。沒有重送工單或啟Unity。
- 指南既有45來源／47步說明／30FAQ不等於8單位相關資料全已實讀；本輪另完成證照／英文兩題可審草稿，各大流程＋4步說明＋3FAQ。12來源分為live PDF視覺1／live HTML1／官方索引正文7／未視覺PDF文字2／iframe外框1，HTTP 200×2／202空×5／403×2保留。現行完整規章／認列清單／表單仍未取得，未套產品；見guide-graduation-research-20261023/REPORT.md。
- 本輪全部維持本機：不push、不發布、不碰main、不刪檔、不動C節、勞動節暫緩。完整UI gate與真背景hidden、實體裝置、母語逐句校對、使用者畫面確認仍保留。
- 下一輪第一件事：先看8863學生首頁／單款策展示範並回收畫面意見；讀本輪報告與8865獨立翻譯／排版驗收結果，再按具體缺件續補指南當期官方資料，不自行擴大美術或續跑舊巨量QA。

## 2026-10-23 最新：學生作品首頁與策展示範完成；本機8863待審

- source_agent: codex。工作樹C:/agywork/agd-holiday-prototypes，分支codex/hero-festival-review，本機commit d16d2ebc76652f59cff08ed6b223da4bf6ebec83（git fsck通過）。本輪依使用者三題確認：首頁不用AI插畫、學生作品＋小互動入口、遊戲先一款示範再決定擴大；方向確認不等同畫面已確認。
- 首頁主格改三件完整學生海報與完整署名／作品消息連結；節日試作折進「畫出來，動起來」同格，不再獨立大區塊。點擊前不載節日插畫或生成UI背景；小型favicon仍沿用既有生成播放圖示，不宣稱零AI位元。沒有逐件查證學生作品製程或新增公開改編授權。
- 獨立策展示範 student-curation.html：同三作品、安排三展位、資訊卡與入口淨空、三語／鍵盤／重設。原14遊戲未改美術；283個原lab runtime與前輪UI-polish03逐byte一致，勞動節維持暫緩。
- 最新.measure-student-hero-20261023-02（360檔），http://127.0.0.1:8863/ ，示範 /holiday-lab/student-curation.html?lang=zh ，儀表板 /progress/ 。8862為手機孤尾01，8861為舊生成CG候選，不當最新版。重啟：node scripts/serve-local-review.cjs --site=.measure-student-hero-20261023-02 --dashboard=holiday-lab/dashboard/out --port=8863 。
- 最後獨立v2於09:48:25Z新run：9首頁＋9示範＋2嵌入、47PNG、54份字型loaded量測，issues／orphans0，17來源前後相同；root嚴格重核及跨release同build SHA通過。raw SHA f0f201431cdc084410379424dca589f8f48ee4f653da98938493f5d3059731ea。發布工具12yes／0no／1unknown，360檔HTTP/body SHA一致；真背景hidden仍unknown。
- 原01六手機孤尾真RED、02首次collector表面pass但root因11份fontStatus loading拒絕、測試harness失敗全部保留；另凍結新v2逐狀態等字型，再以verify-v3.test完成12/12。不能拿表面pass當通過。姓名完整換行，不改字級、人名或原意。
- 主報告 holiday-lab/reports/hero-release-20261023/REPORT.md；摘要verification-followup-20261023-19.md；root/student-verification.json可重核。儀表板分學生首頁、單款示範與發布補驗，資料／工具／使用者三層分開；最後重產、回歸、smoke及本機保全結果見主報告追加。
- 完整UI gate仍NO，固定08歷史2046/2076不是本輪完成率；24個非勞動最長動態字串、完整墨跡／來源義務、實體裝置與母語校對另列。未產新ZIP、push、發布、碰main、刪檔或啟Unity；C節SHA95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680不變。
- 下一輪第一件事：先看8863首頁與單款策展示範，回收使用者具體畫面／操作意見後再決定擴大，不自行發布、改編學生角色或續跑勞動／舊巨量工作。

## 2026-10-23 最新：14款遊戲UI修整與字型核對完成；新版本機8860

- source_agent: codex。分支codex/game-ui-polish。原字型、字級與漫畫素材保留；只加均衡／長段落換行CSS，修日文320孤字末行。另修開學遊戲英文抵免搜尋詞與指南標題不符的真bug：Credit Transfer。勞動節暫緩，原檔與上輪凍結build byte SHA相同，未啟動其遊戲或續接。
- 最後 .measure-ui-polish-20261023-03（357檔）在8860凍結，子代理全新14款×zh/en/ja×320/1440共84/84真UI通過；1416states、420PNG、31608文字rows、18來源前後相同。root獨立readonly verify與5正反例通過，相關semester tests10/10。原01批真RED保留，不以舊綠燈代新版。
- 獨立字型技術驗收：中文687／英文85／日文602 codepoints、36樣式，16faces/9實檔name+cmap核對，本機候選stack缺字0、未知0；逐字fallback未全證。追加en/ja負號真按鈕CDP證Noto Sans TC glyph1，無須換字型。不是全站／全裝置／母語校對完成。
- 儀表板已加「本輪遊戲UI與換行」84/84，將歷史最長動態字串證據缺口與真畫面bug分開；build-dashboard34/34、dashboard回歸9/9、桌手機+離線smoke通過。固定08歷史2046/2076缺30與全域發布UI gate仍0/1，未篡改舊權威，未產發布ZIP。
- 目前入口：http://127.0.0.1:8860/ ，遊戲 /holiday-lab/ ，進度 /progress/ 。重啟：node scripts/serve-local-review.cjs --site=.measure-ui-polish-20261023-03 --dashboard=holiday-lab/dashboard/out --port=8860 。舊8856/8858/8859不是最新03版，不按舊入口判斷成果。
- 主報告 holiday-lab/reports/ui-polish-20261023/REPORT.md；摘要 reports/verification-followup-20261023-18.md；獨立原始結果 independent/runs/2026-10-23T08-07-41-848Z/result.json，SHA414857a2aa086e055c7360107911ae48adbe61977e8060bb7d3810a8ec86668f。root/verification.json與audit/font-README.md可重核。
- 小改版筆記 audit/design-notes.md：日文外來語按詞組分行、手機依任務→調整→試播分群；只是待審方向，不改凍結版美術。下一步先看本機修整版，再依使用者回饋決定小改版；勞動節仍不做。全動態組合、實體手機與使用者美術確認另列，不自行擴成巨量證明工作。
- 本輪未push、發布、碰main、刪檔、Unity；C節保持SHA95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680。

## 2026-10-23 最新：清明404已修復並獨立驗收；本機成果與進度儀表板可看

- source_agent: codex。本輪分支 codex/qingming-local-review；不推送、不發布、不碰main、不刪檔，C節保持原SHA。使用者指定勞動節暫緩，覆蓋下方舊「下一輪先做勞動2453」指示；本輪沒有啟動勞動續接或Unity。
- 實際修正首頁與holiday-lab明確宣告既有PNG favicon；本機server /favicon.ico 回真PNG200，未知資源仍404。新增favicon與server回歸／故障注入測試3/3通過。
- 新內部審閱建置 .measure-local-qingming-20261023-01（357檔）。獨立清明 zh/en/ja ×320/1440 六組真UI完整流程6/6、錯誤0、84張PNG、424個response body核SHA；全357檔與9來源前後不變。另2個完整Chrome headless context證明自動圖示200。root唯讀verify exit0；僅404與核心流程，不冒稱全UI/canonical通過。原v2失敗與v3未批准狀態保留。
- 獨立網站smoke：zh/en/ja ×1440/390 六組通過；指南15卡、47步驟含說明、30FAQ，搜尋／身分／語言切換均通過；13教師照片實載與容器一致，不等於頭部對齊人工確認。
- 儀表板已有四欄：可以先看、正在處理、待確認、明確暫緩。資料／工具／使用者確認分開；build-dashboard 34/34、回歸9/9、DASHBOARD_SMOKE 2/2 + OFFLINE PASS。2046/2076僅固定08歷史覆蓋，並非新build完整通過率；完整UI gate仍0/1，未交ZIP。
- 本機首頁 http://127.0.0.1:8856/ ，指南 /#/students/guide ，清明 /holiday-lab/?game=qingming&lang=zh ，進度 /progress/ 。server僅綁127.0.0.1；若關閉，以工作樹下 node scripts/serve-local-review.cjs --site=.measure-local-qingming-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8856 重啟。
- 主報告 holiday-lab/reports/verification-followup-20261023-17.md；獨立原始驗收 holiday-lab/layout-qa/qingming-favicon-independent-20261023/REPORT.md、holiday-lab/reports/current-preview-smoke-20261023/REPORT.md。下一步先由使用者看本機成果；依回饋修既有版面與內容，勞動節保持暫緩，C節不動。

## 2026-10-23 最新接續點：中秋目標驗證完成；兩個失敗批次已保全

- source_agent: codex。中秋root-ui-04已783/783真exit0，root完整重核810義務、PNG/來源/字型/原比較皆過，geometry0；518原旗標空、265保其他owner旗標，global/canonical仍NO。完整資料本機commit5064130（8484 QA檔/549249014 bytes逐一index核對）。
- 勞動原full已331成功＋1失敗、exit1；ECONNRESET原始紀錄不改。continuation-20261023工具準備中，原331成功不重跑、新2453含原失敗明列重採。獨立審查真負例：缺completion仍報complete、terminal HTTP failure被忽略、unknown attempt總數少算；作者正修domain_complete/run_complete與attempt總數，尚未freeze／審完或啟動。
- 清明v2先導由root21tests及獨立review過後單一啟動root-pilot-01，06:10:12.703Z exit1；zh320六target pass/geometry0，但Console404使run停止且缺source_after，不能算完整通過。另一次明標新導航診斷CDP證/favicon.ico為404/Other，舊run未存location不得回填。原v2、方法、freeze與失敗6份全保本機commit63e156b；v3只規畫新隔離方法/精確Console+Network分類、保原flags/globalfalse，尚未准native，禁止直接重跑v2或改measure08。
- 中秋canonical-review只唯讀補證；404688是67448去重文字×6context，42見證各自極值，不能冒稱面積最長；766原fast fullnode缺欄不能補造。新typed adapter仍未建。
- 開學離線proof root5tests/全部DP verifier已過，native equivalence仍NO；來源283/1284核對過但原08完整輸入快照仍缺。國慶calibration39只CHECKPOINT，39recipe/312ownerframes工具尚未完整且未准native。
- 工具最新CHECKPOINT：勞動首版continuation freeze76d1f950…89962僅prepare成功，不得批准；cleanup-close終態故障測試仍待修與獨立複驗，須另建r2不覆寫。清明v3已建目錄/20繼承檔，分類器、新scope/freeze/verifier尚未完成；兩者無新native run。
- 下一輪第一件事：讀reports/verification-followup-20261023-16.md與三代理CHECKPOINT，確認上述三原native已terminal不重啟。先審勞動continuation最終freeze/獨立負例修復與精確331＋2453 union；完成root批准後才單一啟動。再審清明v3，原v2方法不能改。
- 正式權威仍v4 coverage2046/2076缺30，dashboard重產27/27但整包UI0/1、使用者0。未push、發布、碰main、刪檔、C節改動；未新網站Build/ZIP或Unity啟動。8845是同.measure-integrated-08內部量測server，不是新審閱上線版。原673MB fast raw仍本機ignored，所有local commits未宣稱跨機備份。

## 2026-10-23 14:05 最新：中秋783目標完成；勞動331成功後中止

- source_agent: codex。使用者「繼續」後同run續接已完成中秋783正常UI。原runner43520於06:03:50.780Z真exit0；root於06:05:00.032Z獨立verify-complete exit0，783 case/sample/PNG與768seed＋42extrema共810義務全核，geometry0、原0.05px比較[]、方法/來源/font一致。root-complete-verification-01.json保存原stdout。265份仍有其他owner原旗標，canonical_promoted/global_bound/full_project皆false，未直接升覆蓋。
- 勞動runner27896於05:59:23.731Z真exit1，TypeError fetch failed／ECONNRESET。原332attempt已root readonly full.cjs --verify exit0，331完整成功、最後seq331為capture_error，沒有回傳PNG/sample，原失敗完整保留。不能確定before或after fetch，不補造上下文。未重啟2784；獨立continuation工具準備原331成功前綴＋2453剩餘，首筆明列重採原失敗義務，尚未批准或啟動。
- 來源283inputs/1284refs root複驗通過，原08完整generator快照仍缺；開學source/font數字DP及全部fragment重算root5tests/readonly exit0，33365classes/8342bounds，native equivalence仍NO。國慶39recipe/312owner-frame工具已CHECKPOINT未完整，改優先勞動續接；清明新pilot工具v2凍結後獨立審查中，尚未開browser。
- 正式覆蓋仍2046/2076缺30；dashboard本輪重產27/27，完整UI0/1、使用者0，無新版介面變更所以未重跑相同smoke。JA320實圖仍見其他段落短末行，已入報告待修。
- 報告holiday-lab/reports/verification-followup-20261023-16.md。原兩native程序均已terminal，禁止按舊live記錄重啟。下一步先審勞動continuation精確union與清明v2獨立報告，再評估新native；中秋typed bound/canonical adapter仍待建立。
- 未push、未發布、未碰main、未刪檔；C節保持原SHA。未新網站Build/ZIP／Unity啟動。原673MB fast raw仍本機ignored；本輪完整已結束native資料將本機Git保全，不宣稱跨機備份。

## 2026-10-23 已依使用者「繼續」恢復本機驗證

- source_agent: codex。此為最新狀態；下方暫停記錄保留為歷史。中秋原247份逐筆重新核對後，將暫停屏障移入operator-pause-records保留，未刪檔；同root-ui-04以--resume接續，沒有重跑原247。8845恢復同.measure-integrated-08，freeze04/source/font重新核對通過。
- 2026-10-23T05:49:49.915Z觀測：中秋554/783，runner43520 creation2026-10-23T05:31:17.6311460Z／driver8248；勞動180/2784目標，runner27896 creation2026-10-23T05:39:47.3243860Z／driver63148。均未terminal，只追同job，不因等待重啟。精確程序／原stdout：reports/resume-observation-20261023-16.json。
- 勞動另審新full-domain-reviewed工具，9tests及preflight過後才批准獨立scope；保留原wide false/flags，只以精確owner證據判定target域，不代表整頁PASS。full-freeze972bda82020a5f60241a0105e858d64545d565c3e18368492d05bdaeac37cd3c。
- 來源帳本283inputs／1284refs，root複驗3tests＋readonly verifier exit0；runtime283與contract283交集277，舊同路徑served278含根目錄CSS，分開記。原08完整generator快照缺／當時preflight缺／新短JA其餘情境尚未全驗，仍NO。新原generator隔離55input→37output，client只與build11 byte-exact。
- 清明1115舊證據已離線恢復，136錯句100可見／36窄版未可見保留；新文字投影／pilot工具補字型負例與獨立verifier中，尚未批准或啟動browser。開學只做source/font-bound數字DP與fragment保守界，native equivalence仍NO。國慶另獨立唯讀owner因果審查，未啟新量測。
- 正式覆蓋仍2046/2076缺30；本輪未改canonical／正式R0／dashboard數字，沒有新網站Build或ZIP、push、發布、碰main或刪檔；C節SHA不變。TF-BASE沒有新來源回報，未啟Unity。
- 下一輪第一件事：核上述同PID+creation與各launch terminal；活著只追同job。中秋完後獨立store.verify783及810義務，勞動完後full.cjs --verify；遇真失敗先保留與診斷，不自動重跑。清明／開學工具須root審碼批准才可開browser。詳reports/verification-followup-20261023-16.md。

## 2026-10-23 使用者要求暫停：可重開程式

- source_agent: codex。使用者要重開程式，已停止新工作與三子代理。中秋root-ui-04於05:05:57.241Z受控停在247/783，剩536；runner43892/driver51568均absent，原browser已finally關閉。store.verify實跑exit0，case/sample/PNG/hash-chain/checkpoint各247、零未提交attempt；原32凍結方法SHA不變。
- 暫停屏障mid-autumn-ui-validation-20261023/OPERATOR_PAUSE_REQUEST.cjs保留，令每筆開始前guard在上一筆完成後阻斷下一筆（exit1是明確operator pause，非UI失敗）。PAUSE-CHECKPOINT.json與reports/PAUSE-20261023.md已寫精確續接：只在使用者恢復後移屏障保留、重核freeze04/live sources/247份，對同root-ui-04加--resume補剩536，不重跑已完成項、不另建替代run。
- 三代理CHECKPOINT已落地：qingming-error-domain-20261023、labor-finite-native/full-domain-reviewed-20261023、source-provenance-20261023；都是未完成、未准native，不把骨架/真RED說成完成。三者無自有背景程序。
- 覆蓋仍2046/2076缺30；勞動12實際校準與本輪既有成果保留，未新Build/ZIP/推送/發布/碰main/刪檔，C節不變。暫停後不自行測試或派工，等使用者繼續。

## 2026-10-23 最新：覆蓋2046項、中秋正常UI驗證已啟動

- source_agent: codex。本輪實際進展：和平preview6補齊，v4索引2046/2076、缺30、geometry0；root獨立check-plan/compare exit0，2040舊selected及全部來源/方法綁定保留，126舊＋6新wrapper SHA完整核對。權威為holiday-lab/layout-qa/supplement-integration-20261023/v4/coverage-current.json（SHA48921202d1a5427010632a3da320dc2b31775d4b8803ea9d61536a5d93c36eeb）；原index ExitCode未取得null如實保留，assembly真exit0，不重跑index。
- Root相關13tests、和平6payload往返、180nodes/218blockers/原flags均保留。離線dashboard/out/index.html已改v4並重產；27/27、4tests、1440light/390dark smoke2/2全過，UI整包0/1及使用者0；首次authority還讀v3真紅26/27已保留並修正。
- 中秋原404688完整stream驗證已過且不重啟；真UI plan768 seed＋42 extrema合併783工作。freeze03唯一root-ui-03於04:49:38 exit1：工具hint-only nodes卻帶全blockers造成42斷引用假紅，原完整幾何0/比對[]及失敗全部保留。freeze04改全nodes+全blockers，root20tests/原真sample/三真geometry負例及30HTTP/2font live核對已過，明確新核准後單一root-ui-04啟動。
- root-ui-04 driver51568/runner43892，creation04:51:46.2473260Z，session46854；2026-10-23T04:53:15.523Z root實查present、26筆journal、無terminal，首筆checks全true/compare[]/flags[]/geometry[]/PNG完整解碼一致。freeze04 SHA55ef47dc52f9a1ff8ca36157cc3649aff64566b1b9495a26ee9da2bea7b52ab6、approval8262fb3dc71f189165873a5bc2430d21048a65e324afc29abb41576a8008ba8c；尚未完783，不得重啟或算canonical6完成。
- 勞動v3三漏洞由另一代理23tests獨立複驗，另P2 pass矛盾實證；新v4加pass公式/geometry收緊，代理30tests已凍結，另一代理獨立審查與受限6context pilot準備中，未准full。正式v4不是全域PASS。 另位代理隔離30tests全過，卻再實證9個checks鍵可刪除safe後繞過；不准full，另備精確9鍵與fresh/no-resume的12筆有界native校準工具，尚未啟動。日英增量已核13職階/6學位中性化整合，9資格仍待一手證明，Division/Section差異留P2，不改凍結遊戲。
- 報告holiday-lab/reports/verification-followup-20261023-15.md；剩中秋/國慶/開學/清明/勞動error-longest各6、所有method flags/provenance/使用者確認仍NO。TF-BASE本輪仍5工單無來源/WebGL，未啟Unity。未新網站Build/ZIP/推送/發布/碰main/刪檔；8800與舊ZIP保留，C節不動。大raw本機ignored，非跨機備份。
- 05:00:36Z最新：root核43892同creation present，中秋158/783，checkpoint157/event hash一致、未terminal。勞動受限工具後續已由root審碼/4tests/live核對批准並實跑唯一root-calibration-01（session99550/PID22340），真exit0；6context共12完整case/PNG/source/font/checks重算，手機6pass/桌機6因未全scroll保false，target_valid12/geometry0，不給2784或canonical額外credit。root-bounded-verification.json/報告15有逐項原值；v4 full仍不准。
- 下一輪第一件事：核同43892 creation及session46854/launches/root-ui-04，活著追同job，terminal讀原failure不要自動重啟；完後逐case/sample/PNG驗783與810義務。回收勞動v4獨立審查/有界pilot工具，先審再核准新native，不啟full。

## 2026-10-23 最新：覆蓋2040項、126份完整證據已整合

- source_agent: codex。上一goal輪為實際進展，本輪再次推進：清明90、和平/光復有限錯句12、窄版提示24，合計126份完整case納入新索引。最新2040/2076、缺36、geometry0；與1914基準逐key/來源綁定比較，全保留無降級。權威索引 holiday-lab/layout-qa/supplement-integration-20261023/v3/coverage-current.json；plan-current/plan.json同2040，126新wrapper全nodes/blockers/SHA指標獨立重算相符，正式R0不寫。
- 主控24/24 tests與索引/assembly/check-plan真exit0。補了證據後讀的raw manifest/case/sample/image SHA、source map與完整case比對；獨立VM真紅接受90→修後正常90、改source/改payload各精確拒絕，最新profile helper再複驗同樣通過。不同collector的sampler欄位依實讀schema處理，不用名稱猜語意。原首次234小索引為誤用舊矩陣名、v2缺欄位拒絕均留檔不採用；v3實際正確phase23-47-50-142/front23-48-00-964。
- 剩36：中秋/國慶/開學/清明/勞動 error-longest各6、和平preview6。中秋原18628/68760已04:23:46.635Z terminal exit0，404688/404688；root完整stream verify04:25:44 exit0、6ctx各67448/132批、missing0，驗證SHA79cfb47fba92eedaa312dc5c65c7af7efe18df947d58993d68ac4e827c809da5。中秋6 canonical仍NO，必須768 seed＋42 extrema正常UI檢查後才可閉合。component報告mid-autumn-domain-verified-20261023/REPORT.md；不重啟原job。
- 三代理續分工：labor-v2凍結未跑，獨立真負例指出resume雙owner、flags可被洗與截斷PNG三缺口，另開v3修復，不改v2證據或批full；mid-autumn-full-witnesses工具準備中，等全集後seed128/context與極值真UI。national-fast-domain僅設計，手機900/快法等價未證；semester投影/6native校準不代表無上限步數已證。清明剩6錯句域另排。
- 主報告 holiday-lab/reports/verification-followup-20261023-14.md；詳細yes/no與實際stdout見integration目錄。新網站Build/新ZIP/發布/push/main/刪檔均無，8800與舊ZIP保留，C節SHA不變；TF-BASE實查仍5工單，無來源/WebGL，不啟Unity。大型raw只本機，沒有跨機備份宣稱。
- 離線儀表板已重產 holiday-lab/dashboard/out/index.html（本機原目錄，不新造另一套），主控重跑build/authority27/27、4正式負例tests、桌機/手機smoke2/2皆exit0；顯示2040/2076、缺36、整包UI0/1與使用者確認0。另國慶/開學/勞動來源/存檔27正式tests主控27/27。stdout在supplement-integration-20261023/root-dashboard-*與root-domain-*；沒有新網站Build或發布。
- 下一輪第一件事：中秋原18628/68760已terminal不可重啟，完整offline驗證已過；讀mid-autumn-ui-validation-20261023工具/plan與故障tests後root審碼，才啟單一正常UI seed/extrema驗證。和平另run修唯一EN1440可見性，不抹原失敗；Labor-v3修三真負例，原v2凍結且不可啟full。之後統一接6preview並更新索引/plan/dashboard。剩全部method flags/source provenance/短末行/使用者確認仍NO。

## 2026-10-23 最新：嚴格可見覆蓋1914項、中秋全集已啟動

- source_agent: codex。本輪實際進展：開學補採684 frames完成，舊10個完成session與新2個session嚴格組合90個canonical案例。新增選中畫面viewport稽核，撤回24個窄版過度計入項；故1848舊快照減24加90，最新1914/2076、缺162、geometry0。索引 semester-session-composite/coverage-bound-current.json；plan-current/plan.json與plan-consistency.json逐key相符。這是PARTIAL_RED，不是正式gate通過。
- 主控實跑相關28 tests全過；中秋全集工具7工程測試及繼承3072筆串流核對已過。中秋單一engine 18628／driver 68760已在2026-10-23T03:31:28.847Z啟動，當次觀測2026-10-23T03:47:28.476Z：CHECKPOINT zh-1440 51712/67448 total=121208/404688 GLOBAL=NO。prepared-01 freeze SHA 64b5b6840c243d33cee047b1c3e206ea43a30904b134636d920387505b6d3448。觀測後數字會變，先查同PID及log，不因等待逾時重啟；全域完整性、真正極值與seeded full UI仍未驗完。
- 清明原46996已terminal exit1（舊JSON聚合爆限）；1042案例恢復並重驗，原after缺與unknown1保留NO。唯一缺JA1440補採2352/57024於03:48:29.960Z正常exit0，193frames，三shot/retry與sample/image/geometry由代理逐筆核對；root讀完報告，嚴格6context composite由font_coverage_audit續做，未計新覆蓋。開學22768已結束，不重跑。
- 窄版8款×3語：150真拒絕、165新PNG、96 secondary義務（新15＋舊81跨run逐筆核對）離線verify主控exit0；source/font穩定、Range/safe/clip/viewport及全case geometry0。finite-hints-native-20261023/REPORT.md。尚須strict typed adapter才計入覆蓋，不改舊eligible。新peace/retro60張與constitution真6011.5ms收尾亦已補證；60張trace派生輸入另存，不能假稱原case有inputs，完整join仍未完。
- 日英獨立複核已完成：13人核心職級可保留、28候選中27原案保留，EN-CERT-RECOGNITION-01需將獎助金補完整financial awards or subsidies；root verifier exit0，17來源SHA穩定/productWrites0。正式機構與任用附註仍pending，未套產品。代理轉查勞動：全部輸入不只729，僅負載字串可投影729指派，因果與合法拒絕見證仍在建證，不冒稱完整輸入域。
- 主報告 holiday-lab/reports/verification-followup-20261023-13.md。沒有新網站Build、ZIP或8800替換；8852仍11內部量測。官方R0不變，遊戲不發布，未push／未碰main／未刪檔，C節SHA不變。TF-BASE來源/WebGL仍待回，未啟Unity。大raw僅本機，未宣稱跨機備份。
- 下一輪第一件事：只追同18628/68760中秋live程序與log，清明2352/57024已terminal不可重啟。回收清明6context composite、24窄hint typed adapter及和平/光復12context最大面積守門測試後由root接索引/assembly；原coverage仍1914/2076。中秋全集串流/真UI極值/seed、國慶完整域、勞動負載因果投影與其他未閉合項仍必須完成。正式gate前不產新ZIP。

## 2026-10-23 最新：分片存檔修復、2964案例復原與獨立複驗

- source_agent: codex。前一輪完成翻譯專責派工；本輪為實際進展：模組9/9、獨立8/8及六種負例、真DOM21frames與三段回放，v1/v2 coverage一致14/2076，組裝計畫56wrapper SHA全同。主報告：C:/agywork/agd-holiday-prototypes/holiday-lab/reports/verification-followup-20261023-12.md。本輪沒有網站Build12，8852仍11內部量測，8800與舊ZIP保留。
- semester原535MB報告聚合字串爆限，已終止；在新ignored recovered-run恢復2964 fullcase、sample／image SHA與11session metadata原值。原10complete，JA1440 graduation partial／credit未開始；末旗標全文缺1、無原after，明列NO。單一新定向補採collector22768／driver69380／session27559，原清明46996仍live；不重啟原其他程序。勞動1571frames／光復622frames已結束geometry0，完整method仍未結案。
- 最新固定08覆蓋1848/2076、缺228、geometry0（report-store-integration/coverage-current.json），不含恢復partial或另存peace6預覽。元旦11有限key／414精確match／6context已證；peace6真聆聽預覽已驗。artifact72/72、2799/2799行補證；preview12/30閉合，剩18family／37branch原false保留，僅另補constitution JA1440原生收尾。
- 日英新審查26key／28譯值候選，13職階與49既有值、41來源SHA核對，未套產品；專名／校務全文與個人資格不冒稱認證。中秋第二先導720原法對照、10真例、13完整極值相符，全集仍未啟；國慶60探測／10真例，原法全量約174h未啟，GLOBAL均NO。
- 儀表板23/23真重驗，15模組功能／外框56yes1未驗／使用者確認0；全UI gate仍NO，官方R0 SHA不變。TF-BASE本輪仍僅5工單／腳本，未回來源，未啟Unity。未push、未發布、未碰main、未刪檔，C節不動。大raw只留本機，沒有跨機備份成功宣稱。
- 下一輪第一件事：追同一22768／69380／session27559及46996真狀態，完成才讀分片與來源收據；依精確typed ledger補原生缺口、回收peace／retro有限錯句審查，再更新索引。舊closure/export未全支援v2需逐來源改，不以manifest索引當fullcase。正式gate通過前不產新ZIP／不發布。

## 2026-10-23 最新：指南日英49值已整合（11僅內部量測）

- source_agent: codex。上一輪為進展，本輪由兩個獨立codex分支完成JA20／EN29值，整合daeb9d7／c3bcb89；其他生成譯值與固定94ed07e全同，原校務條件、pending機構／資格／免修句保留。報告：C:/agywork/agd-holiday-prototypes/holiday-lab/reports/integration-20261023-11.md。
- 主控build11 exit0，356檔、app-TQ4G6C6Y.js，8852/.measure-integrated-11僅內部量測，未替換8800舊審閱版與ZIP。13相關Node測試過；283遊戲runtime與10逐byte全同，09→10精確僅newyear第一幕JA短字幕。當前模組功能儀表板15/15、23/23權威格式與2/2smoke，使用者確認0。
- 新譯值實際指南雙寬320/1440共98目標：84可見且全文owner-contained／無水平溢出、3528字元樣式cmap missing0/unknown0；14為7個不在目前served guide資料的舊字典值，另列data-only，不洗成畫面通過。證據：translation-review/guide-terms-rendered11/。英語office’s實際DOM無插入空白，未把字形觀感誤認文字bug。
- 春節當前JA原生回放18 stable／0 geometry，兩個原跨鏡失敗保留，只補shot3/7兩張；沒有凍結動畫或延長140ms。真DOM newyear/zh/1440 1/1、相關純測試4/4；詳layout-qa/newyear-ja-caption-current/REPORT.md，不當完整UI完成。
- 完整UI gate本輪實跑exit1，正式R0仍13case且缺final source fingerprints，SHA cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336未改。固定08長批實查52792／46996 live；最新c5e3258索引1620/2076、缺456，仍PARTIAL_RED。front15/15已完成；第三批固定錯句18 eligible、national6 supplement-only仍missing，scope負例5/5過。不得為清NO而改sampler／safe或丟原失敗。
- TF-BASE夾本輪仍只有5工單/腳本，兩遊戲源／WebGL未回，未啟Unity、未改遠端權限。未push、未發布、未碰main、未刪檔、C節不動。下一輪第一件事：核原08兩程序真狀態，回收新增完整列並處理精確method缺口；讀中秋finite-native先導真hint/clone一致性與每千例耗時，未批准前不啟全集。正式UI gate通過才產新試玩包。

## 2026-10-23 最新：日英專責差異複核（未套用候選）

- source_agent: codex。依使用者追加要求，日文／英文兩位子代理已交回獨立複核，主控讀報告並重跑 verify.cjs／audit.cjs，皆 exit 0。總報告：C:/agywork/agd-holiday-prototypes/holiday-lab/translation-review/specialist-followup-20261023.md；各語言報告在 specialist-ja-20261023/REPORT.md、specialist-en-20261023/REPORT.md。
- 助理教授→Assistant Professor→助教有官方 JST、九州大學職名表支持；助教與 Teaching Assistant（TA）分開，副教授對應准教授。當前13人職稱譯值13/13符合既有核對；未重新認證個人聘任事實或校方正式人事日譯。
- 新提案：日文20處、英文24處註冊課務組名稱不一致；另英文3句休學、4個抵免用語可精修，1個免修／抵免混合句待查。樹德教務處兩個官方索引支持 Registration and Curriculum Division，全文403；先前Section是產品用法，不能當官方唯一譯名。兩筆合聘機構Industries擴寫缺依據，對應待確認，不推定聘任本身錯誤。
- 未改產品、未重建、未發布、未push、未碰main、未刪檔、C節不動。139既有譯值整合verify仍通過；字典2315/2344鍵只是盤點，指南514 exact對應不是全部最新校務核定。468原始CHECK欄仍待逐項來源，不因建置去標記就視為核實。
- 下一步：逐項整合無歧義候選並驗新版長標排版；正式學位／資格／機構及當期流程來源不足保留待證。遊戲UI gate仍未閉合、TF-BASE兩遊戲來源未回，8800舊本機審閱版與ZIP保留；10/8847只是內部量測，未作新版交付。不得用本翻譯報告宣稱整體完成。

## 2026-10-23 最新：整句翻譯與固定按鈕框（整合驗證中）

- source_agent: codex。本機分支codex/holiday-prototypes，未push、未發布、未碰main、未刪檔。8800/.review-local-09與舊local09 ZIP保留；最新09/.measure-integrated-09在8846僅內部量測，不當新版交付；08/8845固定供既有完整遊戲矩陣。產品提交80286ca、ac7ba78、b775698；08整合續報holiday-lab/reports/integration-20261023-08.md，09精修見translation-review/post-specialist/REPORT.md。
- 三款創作深化已合併；semester真整合8/8、24次真指南、每組4次諮詢/4回放。獨立代理實際探索三款各兩作品，保留08年獸錯眉向P2；root09已分正向傾斜/近水平提示，6/6提示複驗、8/8功能回歸，原紅與54張viewport留存。不冒稱真人學生測試。
- 共用按鈕原整圖縮放會使長句貼框；改原生成素材四向九宮格、固定12px框，slider保44px不被flex壓窄。06由固定sampler一次46/46組、138態及當前可讀DOM geometry0，20次窄版真range進退、3語窗口移動皆過。所有03/04局部padding、05窄stepper失敗保留；這不是全scroll/fullphase gate，FINAL-06.md列明限制。
- 日英審校完成FAQ30組/120值、師資13位349來源欄/698值，及另組13位職階忠實對照13/13。首頁消息/作品/About/Labs的盤點348唯一鍵，前8、19、103、218精確分工完成語義審查；並非全站2310字串母語認證，正式專名/六筆碩士類型/部分原事實衝突仍待確認。
- 本輪13消息作品譯值+一處canonical公司名已套；主控讀合作方官方about確認株式会社オートクチュール/hautecouture Inc.及松山/樹德合作，JA長key與EN生成鍵連動。舊編譯守門真紅→重建後verify-applied通過；03真DOM28/28、4188字元配對missing0/unknown0。首輪17/28是等待#root過早的工具假缺席，改等真正目標文字後全過，舊輸出保留。
- About/Labs44與News/Works82已套，合計本輪13+44+82=139譯值；另兩處canonical僅修合作方正式公司名，中文其他內容由基準測試保護。開拓全段1筆因作品資格矛盾排除，沒有擅改原條件。08 build exit0，三批生成校對13/44/82皆yes。About整句07獨立12/12、764字元樣式cmap missing0/unknown0；Works完整標題保中文20話與黃色重點，3測試通過。08新增44/82可見DOM及字體由第二位翻譯代理續驗。
- 使用者追加專職英日翻譯組，已由兩位代理分工。職稱組f052eb4：JST/MEXT逐筆查證，助理教授→Assistant Professor→助教是通用對照，與TA及舊助教授分開；13位職稱/26個英日頁/144文字值真DOM通過，0JS錯誤。後續獨立codex/faculty-neutral-degrees六個education只移除原文未提供的MA/MFA等細類，改一般Master's degree，保學校/領域/年份；3928b20整合為ac7ba78。09實際12/12句、420字元樣式cmap missing0/unknown0；九筆證照與正式學位名稱仍未重新取一手認證。
- 第二位翻譯代理已分類08的44+82值及Works整標，共256個目標：244實際可見、13994字元樣式cmap missing0/unknown0；12 data-only與10個刻意二行省略的摘要另列，不洗成全文畫面通過。兩UNKNOWN原是Cambria Math的▸缺字體檔收據，實讀Windows registry/TTC解決，未換字體。查出日文影音漏音聲、英文配樂之外漏影視，root兩筆精確修正b775698，09四目標/106字元cmap通過。整份字典與08相比只有EN7+JA1共8值改動；其他值全同，13相關測試與09 Build通過。283個holiday-lab runtime於08/09逐byte全同，舊遊戲量測不改base或回填SHA。
- 原英文T字左側真1px截切，root controls加左右2px；08獨立原case85frames、26按鈕三態、339/339全文捲動與geometry0，來源278逐byte相同/5編譯或QA輸入另列。root08全Node187/187、四款label變更功能4/4（教師/國慶/和平/勞動，含通關/三回放/重試）、dashboard23/23及smoke2/2，15模組SHA收據可追查，不等於整包layout核准。舊175/176、179/180及局部padding真紅保留。
- 08完整phase/all-errors/按鈕三態及front90+archive6仍在跑；06活批次保留未重啟，sampler/assetmap仍freeze。已完成constitution/lunar/lantern/children phase及newyear/lunar/lantern front；正式coverage本次510/2076，均geometry0但不等於全gate。最短合法140ms已另組真DOM6/6、54同鏡墨跡/真圖全過，實際rAF呈現148.9–151.2ms如實留底；日文320字幕末字孤行P2保留。static-error-max已提交6bd8850：兩款23個有限錯誤全文、336拒絕收據、654文字owner全部覆蓋；123捲動位置用原真捲動補證，12個canonical候選交索引，未用字數冒充最大墨跡。官方ui-layout-policy仍未閉合，禁止新版出包。
- TF-BASE交接夾本輪仍只有5份工單/腳本、兩遊戲源及WebGL待回；未啟Unity或更改遠端權限。下一輪第一件事：核對08兩矩陣live PID/輸出，整合兩款static-error-max真採樣證據並列最小剩餘清單；完成正式gate才產新包。C節SHA維持95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680。Vault專案紀錄已備援；索引發現兩個同名列60/379，未猜選覆寫或刪重複，詳vault-index08-pending.json。

## 2026-10-22 日英審校第二批本機套用（尚未取代09試玩版）

- 78操作／9產品檔已套用；首批職級維持助理教授→助教、副教授→准教授，合聘／從聘另說明。報告：C:/agywork/agd-holiday-prototypes/holiday-lab/translation-review/followup/ROOT-APPLIED.md。
- root實跑16 tests通過；翻譯測試曾因依賴已套用工作樹失敗，固定904ac79基準後轉綠，紅燈原始輸出保留。測量Build .measure-layout-02 exit0、356檔，兩筆既有duplicate color警告、21個stats未配對路徑仍列明。
- 同步三語修115甄選六校系、技優資格不限得獎應屆、繁星放棄仍禁當年甄選。導引可查合資格證照，非任意證照保證可報名；原selection對象仍需按簡章續查。
- 首頁3單位＋12FAQ共54日英字串已審；其餘18FAQ及其他長文未完成。新版字型／窄版／完整回放未驗完，不能引用09舊圖當新字串證據。
- 文字安全區新增2076必要案例契約與真DOM墨跡採樣器；跑馬燈真紅轉綠、72/72字元兩模式可達，負例真圖遮字可抓到；完整矩陣未跑完，交付gate仍紅。依game-ui-art第8節要求打包前強制執行 ui-layout-policy，measurement只供採樣，不得打包交付。
- 8800/.review-local-09與local09 ZIP保持既有版本；本輪未push、未發布、未碰main、未刪檔。下一輪先在測量版驗招生導引三語，再驗新文案字型與手機；新年新版仍在獨立分支待回收。TF-BASE兩遊戲原始碼未回，不重送背景工作、不跳Unity視窗。

# 系網漫畫版 交接檔（LATEST_HANDOFF）

最後更新：2026-10-22，TF-GO／Codex（僅英文版獲授權公開發布；遊戲留本機）。

## 2026-10-22 最新：節日番外篇全面本機試作（驗收收尾中）

- 本輪可直接審閱：Chrome已保留 http://127.0.0.1:8800/?lang=zh#hero；伺服器session8730、來源.review-local-09（356檔）。中英日首頁、15款遊戲、新版指南、師資對齊與12筆P1譯文均在本機，不push、不發布、不碰main、不刪檔。8797/8785未動。原remote/main仍1b8322e；此clone沒有本地main分支。
- 最新試玩包 holiday-lab/delivery-v2/.outputs/local09-01/holiday-preview-v2.zip，40,584,255 bytes；SHA256 7d7a9e65f6e8c80c21fec75fc934d866ff71f0a6ffa1f1ccd3c33433ead495e8。解壓後Start-Preview.cmd，Node18+，不用Unity；遊戲素材隨包，部分官網照片/字型/處室連結需網路。366解壓逐檔SHA＋356 HTTP200/bodySHA、啟停/缺Node/占埠/重用與9組指南全pass；REPORT.md及原始輸出均留存。05與舊10款ZIP保留不當最新。
- 15款：原8節日＋開學/畢展，追加和平紀念、清明、勞動、臺灣光復、行憲。additional_holidays獨立分支完成5款，extra-qa桌機/390/日文代表11/11；原10款本輪12組首測11/12，唯一英文390仍期待10入口（實際15）是測試舊預期，修後單獨1/1pass，原始歷程保留。dashboard按成功case＋當輪模組SHA核對15/15，而非假造同一輪全狀態驗證。23/23 dashboard authority pass；外框56yes/1未驗仍是04歷史結果。
- Children材質音效/月光位移回放已在原分支修正；renderer支援audio/frames/textLayers，針對性瀏覽器紅0/3→綠3/3，手機字幕至少16px。257候選圖/75CG/6短音效來源完整；美術尚未使用者確認。
- 師資：13張原圖逐人標冠頂/下巴/眼中點，CSS等比縮放與裁切，66%頭高/50%眼線；13條原照1024×2純背景技術裁切伸展補邊，無改臉/重繪/重複人像。6組三語桌機/手機、78原照SHA/完整性、13位窗寬/投影頭高一致通過；不是生物辨識精度。完整報告/紅燈修法/座標/原始及派生SHA、桌手機拼版在reports/faculty-portrait。
- 真Chrome又發現1264px快捷4鈕遮第四位臉，root把<=1900px改頁內流，全部連結保留；21組三語×7寬零照片重疊。09與05逐檔比較僅styles.css變、355檔相同，app/語系/照片/字體鏈完全相同，無需重跑全部遊戲。reports/local09-delta.json及floating-cta-result.json。
- 指南3/2/1欄摘要＋展開完整15項47說明/30FAQ；全部/新生/在校生/轉學生/準畢業生/畢業生6身分，標籤僅查找需求非申請資格。9組三語/尺寸/身分/完整說明pass。導覽各項不拆字、英日空間不足提早選單，27組390–2484 pass。
- 字型：font_coverage_audit首批105狀態/1462種漢字假名/77608配對cmap有據，missing0/unknown0；沒有為改而改。使用者原則：先保留字型，真缺字一般說明優先等義換句，密集缺字才考慮相似字型，專名/人名/法規不改。後續個別詳頁/通關後文案/全手機跨平台尚未驗。新12筆譯文3頁/272字元配對含英文標點亦pass；03→05字典/字體鏈一致，05→09僅CTA CSS，證據可沿用。redesign/glyph-copy及post-translation報告。
- 日英translation_review獨立分支首批24決策：2保留/21建議/1待官方；根據日本JST與本系官方職級保留助理教授→助教、副教授→准教授，不誤為助手或舊助教授。已套12筆P1（合聘/從聘、留職停薪、英文請假/休學、日文註冊課務組及技優班），12資料＋12生成map＋3保留條件逐筆pass；8/8是審校前快照驗證，之後7/1快照漂移不能拿來當現產品判定，verify-applied.mjs才是套後檢查。全文2310長篇未逐句母語審校，9筆P2建議及甄選正式用詞仍待處理。
- 小改版3案研究與可操作比較稿已完成：redesign/style-options/index.html，36版面＋4互動pass，推薦A清爽漫畫；尚未經使用者選案，不擅套整站。僅已授權的索引/不拆字/遮擋/照片修改已整合。
- 最終Node113/113、UI素材政策257/9 pass，Build exit0；保留既有duplicate color警告2筆。reports/final-node-tests.txt、integration-guide.md及各子報告有逐條yes/no。舊delivery唯一影片保留（38.56s開場展示，預設靜音），沒有新造BGM或多交影片。
- WebGL仍未完成：TF-BASE原始專案/執行結果未到，Drive交接資料夾實查仍只有5份工單/腳本，不能把排隊當Build成功。使用者選TF-BASE開Codex，固定6000.5.10f1、單次hidden batch/PID/log、Chrome WebGL驗證，避免反覆Unity選擇視窗；不自行改權限或重送舊fleet queue。
- 待驗/待審：真背景分頁（模擬hidden不能代替）、實體手機、真人盲測樂趣/時長、母語逐句、使用者候選美術/照片/改版選案、學校開學畢展日期。下一輪第一件事：先交主任看09首頁/試玩包與老師/日文畫面，回收具體意見；回查TF-BASE工單回報，有真正Unity來源才做WebGL。對未改runtime不重跑生圖/15遊戲；可接translation_review的P2精確建議與剩餘字型詳頁批次，維持本機審閱。

## 2026-10-22 規畫：節日番外篇（未實作）

- 使用者已於對話確認6–8個台灣節日，加系上畢展/開學；30–90秒，結合動畫/遊戲/漫畫創作；節日期間換首頁主視覺，點擊才開始，平時可回顧。本輪只要求調研及規畫，沒有改首頁或實作遊戲，亦非公開授權。
- 文件分支codex/holiday-plan、工作樹C:/agywork/agd-holiday-plan。8個2027候選：元旦/春節/元宵/兒童/端午/中秋/教師/國慶，另2個校園事件日期留null。建議先選1款本機試點「燈影借位」，不是一次製作8款或已確認首款。
- 已派3路子代理，查官方台灣假期、8件Google官方互動案例、實讀首頁及舊iframe模式。日期/政府假期/學校停課/網站露出分欄；Google只參考策展、主動開始及回顧，不複製角色/素材/辨識性規則。30–90秒是本案目標，不是Google標準；尚未實玩全部歷史Doodles。
- 原創候選與比較矩陣見work-orders/20261022/holiday-games/PLAN.md，原始研究research-*.md，離線總覽dashboard/index.html。文件/日期7項yes、dashboard22/22權威及1440/390搜尋/篩選/展開/數字/無橫溢皆過。狀態明列遊戲實測0、使用者已確認具體候選0；三題方向已確認，兩者不可混算。驗收報告VERIFY-plan.md。
- P0實作前置：目前Build複製未排除根目錄並保留舊dist，單靠隱藏遊戲入口或preview參數不能保證未發布。未來需全新發行目錄、明確資源白名單及未授權遊戲/工單負向驗證；本輪沒有改Build，也不能整條舊遊戲分支合回去。
- 下一步主任選首款/題材後才開本機原型；補校曆/畢展日期、原創玩法比對及美術草稿，再驗新手/三語/真手機。8797三語首頁仍ee0e251，正式站仍1b8322e，遊戲/C節未動、不push、不刪檔。這個文件分支基底含舊本機程式，絕不可整條拿去發布。

## 2026-10-22 最新：三語漫畫網站與大流程指南審閱版

- 漫畫整合、完整主網站日文及中英日共用介面完成，功能提交d53f834及0d9bbd244e47daea171d0dc341cb50ca2661249e，分支codex/ja-comic-integration，工作樹C:/agywork/agd-student-guide-preview。與原repo共用Git；不必彼此fetch。只有本機審閱，未push／未發布，正式站仍1b8322e。
- 指南15項、47個可點流程節點及下方說明、30FAQ、45來源記錄。13項順序流程、休復學/兵役與學生求助2項分流；抵免已依教務處改5階段，先依初審加退選，不能等最後核定。原中文主站JSON及styles.css未改。學生求助卡移除教職員職場調查與活動聯絡的程序引用，來源留歷史。
- 依使用者追加，研究子代理查8組承辦單位的辦法/表單/FAQ/入口/消息，37筆研究來源：本輪全文5、官方索引19、前輪PDF5、前輪研究8。不聲稱全部資料全文已讀。系網畢展/證照消息僅確認索引，HC實習有官方單篇，均標示過去成果/學期而非當期報名。
- 26回歸、build/check、2,310原文鍵英日覆蓋與數字複核均過。主站321組三語路由在d53f834已過；指南流程追加後另重跑60組頁面與12組操作，47節點跳轉/分類/搜尋/FAQ/手機選單/特效均過。18組三語文字邊框0違規、負向控制有效；英文標籤旋轉和箭頭行高失敗留底。單檔3語47段/30FAQ/搜尋/切換皆過。既有duplicate color警告、真手機與日文母語審校未完成，沒有宣稱通過。
- 審閱入口work-orders/20261022/ja-comic-review/guide/index.html；整站本機http://127.0.0.1:8797/?lang=ja#hero，指南#/students/guide。舊outputs/student-guide-official/index.html也已更新。報告VERIFY-ja-comic-review.md、來源研究research-flows/、缺件coverage.json同層；dashboard/index.html已重產，25/25權威與桌機/手機互動通過，使用者確認0。PNG不納入本次備份。
- 下一步由主任審圖解、內容及日文；按coverage補當屆專題、實習/證照細則、現行英檢、請假/權益受理及當期海外甄選/見學文件。未獲新公開授權前不push、不上線、不發布遊戲。C節原文及main refs保持。8797伺服器沿用既有程序，不重複啟動；AGY原翻譯已完成，不重跑。

## 2026-10-22 最新：分類索引與海外見學

- 使用者刪除開頭宣傳式文句，改為可點八分類索引，點選後篩選並跳至辦理資訊；提交b3b5719。另新增海外見學獨立卡、快捷與2FAQ，分類名實習見學（id internships不變），提交7a345a328694521527bf17e78bbd6de8f850bc19。分支codex/student-guide-ui，未push、未發布，main/遊戲/C節均未動。
- 最新為15卡、30FAQ、8快捷、35官方來源；本期見學團/費用/補助/認列查不到，不以歷史展演營或交流照片保證目前可報名。來源限制保留。
- 12項回歸、build/check、五尺寸操作、六組字壓框皆過；單檔實測15/30、見學可開、口號不存在。狀態dashboard按最新JSON重產，22/22權威驗證，使用者確認仍0。當期文件與真手機仍待確認。
- 最新入口仍work-orders/20261022/student-guide-official-review/index.html；報告改讀REVISION-index-and-study-visit.md，初版14/28報告留作歷史。下輪先讓主任看更新稿，未獲專區公開授權前不發布。

## 2026-10-22 最新：在校指南改為官網版型，仍待審閱

- 依使用者最新指示，已將在校指南接入官網TopNav/BackBar/Footer與漫畫CSS；新分支codex/student-guide-ui，提交65af4643d0c729bb5d09056247aeafab68e9d4a2；工作樹C:/agywork/agd-student-guide-preview。基底main 1b8322e。未push、未發布、未刪來源檔，C節未動。
- 入口#/students/guide；八類、七快捷、14項短說明，各最多三步並附窗口及官方入口，後面集中28題FAQ。分類/搜尋同步篩FAQ。每項summary最長48字，每步最長18字，FAQ答案最長70字。
- 34官方來源重新取回，12有內容、22阻擋/空內容；讀取限制列research.md。現行專題、英檢及下一屆海外甄選待承辦確認；不把索引當全文、不把過期115-1期限當仍受理。研究技術細節收進折疊來源，學生頁只寫白話確認方式。
- 新3項測試0/3轉3/3，加原中英共11/11；npm run build/check成功，app-5VY3MYMQ.js。1440/1280/768/390/320五尺寸分類、搜尋、七快捷與FAQ鍵盤操作皆過，0錯誤、無頁面橫溢。文字審查1440/390/320、FAQ收合/全展開6組0壓線，刻意不良背景負向控制可抓到；本次commit已透過.githooks/pre-commit執行。既有duplicate color警告、真手機未測保留。
- 單檔審閱成果：本輪Codex對話outputs/student-guide-official/index.html；原repo備份work-orders/20261022/student-guide-official-review/index.html。已內建樣式、程式與資料；字型及學校外連仍需網路。報告VERIFY-site-draft.md、研究research.md、工具證據JSON同層。
- 本機預覽http://127.0.0.1:8797/#/students/guide，Node伺服器目前執行中；8785遊戲未動。單檔已實測14卡、28FAQ、搜尋海外1項、無頁面錯誤。離線狀態dashboard/index.html於2026-10-22重產，22/22格式及權威驗證、桌機/手機搜尋篩選通過；使用者確認仍0。
- 下一步先讓主任看新版與確認內容，取得缺少的當期正式文件後才準備上線；此授權不包含發布在校指南或遊戲。原學生紙上期刊版已被本官網版型審閱稿取代，下方紀錄供歷史追溯。

## 2026-10-22 最新：英文共用介面已上線；在校指南另交審閱

- 使用者已於對話授權驗證後將英文共用介面上 main，保留正式站更新，遊戲不得發布。發布工作樹 C:/agywork/agd-en-publish、分支 codex/en-shared-interface，基底56b61b9，提交1b8322e69d84549db220d849afb1aac0fb9d7c2a；一般fast-forward push origin HEAD:main成功。GitHub Pages run39743799524 build/deploy success。
- 新英文入口 https://treefar.link/agd-comic-site/?lang=en ，舊 #/en/intro 等入口自動轉換。中文與英文共用首頁、詳情、導覽、頁尾、影片、測驗及招生導引元件；新聞與論文不再截短。鄧樹遠中英職稱皆不含電競代理主任。
- 中文canonical JSON逐檔SHA與56b61b9一致、styles.css未變；英文同步近期名額46、6學年129件、實習22人、16年／130+件及新公告。8項回歸測試通過；全站96路由桌機中英加10路由手機中英共212組通過，最後字典修正再驗28組、測驗/導引20組、正式站16組，0頁面JS／站內HTTP錯誤。
- 正式站app-7MF5K2G6.js與本機建置bytes一致，SHA256 f966a21d967755d4656860cc99cbe55135ff473c0ee6d0bb06fc3498512f7c78。data/play.json與play/creative-line/index.html仍HTTP404。未發布遊戲、未刪來源檔、未改C節；既有duplicate color警告保留，真手機未測。專名沿用既有翻譯，不能宣稱全面重新官方查證。
- 英文發布報告、命令輸出與結果：work-orders/20261022/shared-interface-release/VERIFY-shared-interface.md。離線狀態儀表板：同層dashboard/index.html，2026-10-22重產；22/22權威/格式檢查與桌機/390px搜尋篩選展開均通過，工具通過與使用者確認分開。
- 在校指南為離線審閱稿，未進公開工作樹。14卡、34官方來源、七快捷、八白話分類：選課抵免2／請假休學2／畢業門檻2／專題製作1／實習機會2／證照就業2／繼續升學1／獎助協助2。另有專題製作、繼續升學、海外實習直達快捷。48項工具檢查通過。
- 專區入口 work-orders/20261022/student-guide-review/index.html；主任先審5個待確認問題。當期專題細則/表單、下一屆海外實習甄選/名額/費用/語言條件與部分處室分工未取得；部分校方網站僅可讀搜尋索引，逐筆標來源限制，過期日期標截止。不得把過去HC新聞當目前可報名，不得將草稿當現行完整規章。
- 原本機遊戲分支仍codex/remove-acting-chair-local，保留完整試玩版；不可把整條舊feature直接合進main。以下run4與舊英文七頁紀錄僅供歷史追溯，以本節為現況。

## 2026-10-22 職稱更新與英文一致性方向（歷史）

- 使用者要求中英文移除鄧樹遠「電競代理主任」。正式站已發布56b61b92f595ba503924dbd7b81d5b94a511dd6c，Pages run 39738977558成功；中文為「系主任 · 副教授」，英文為「Department Chair · Associate Professor」。首頁靜態師資卡、中文師資JSON、英文師資JSON三處均已改。
- 正式站HTTP200的中英JSON已重新讀取比對；首頁與app-KQGOEBYM.js不含舊職稱。npm run build、npm run check成功，發布測試5/5。
- 本機整合版分支codex/remove-acting-chair-local，程式提交4debed0；clone已從主專案本機fetch同步；試玩包解壓副本的bundle.js、index.html、中英師資JSON也已更新。歷史ZIP未重打包，遊戲未公開。
- 使用者詢問英文版盡量保留中文介面與資訊是否可行：可行；目前英文用獨立En元件與七頁分類，新聞只顯示10筆、論文只顯示前5筆，與中文詳情頁有差異；共用頂部導覽、頁尾、浮動按鈕仍是中文。後續宜共用元件與資料結構並完整翻譯導覽、詳情及按鈕；本輪尚未執行這項版型重構。

## 2026-10-22 英文版已獨立上線（遊戲保留本機）

- 使用者於2026-10-22對話明確授權：本次只將英文版合併並推上main上線；遊戲不發布，保留線上既有更新。此授權僅適用本次英文版，其餘C節待決項不變。
- 以遠端main的49adae7acf4d2daddaebd61d741380f4a663029b為底，建立codex/en-publish-only；工作樹C:/agywork/agd-en-publish。
- 已公開提交8f16c20b1676a8c25a00d88659f39f086d19417c；git push origin HEAD:main成功（一般fast-forward）。GitHub Pages run 39727684727成功，網址https://github.com/treefar/agd-comic-site/actions/runs/39727684727。
- 英文入口：https://treefar.link/agd-comic-site/#/en/intro 。七分頁：intro、highlights、faculty、curriculum、labs、works、visit；保留main既有英文首頁內容，新增導覽及其餘頁面。中文資料與app、共用元件、首頁章節、styles.css均與原main一致。
- 英文圖片依每筆slug/id使用main既有照片，沒有移入遊戲資產。線上data/play.json與play/creative-line/index.html均HTTP404；線上app-WFAVOGDV.js與本機建置位元組相同。
- npm run build、npm run check:report成功；node --test tests/en-release.test.cjs 5/5；本機桌機1440與手機390共14組頁面驗證通過。既有duplicate color警告未改；真手機未測。
- 原feature/en-site-and-play-zone仍保留完整遊戲整合版；不可把整條feature直接合進main，會帶回舊版站台與尚未核准發布的遊戲。未來遊戲上線也應從當時最新main另開分支選移。
- 本次範圍只推上述英文發布提交。遊戲、舊美術刪除、真手機手感、格鬥規格、未知授權與清理均未處理。
- 驗收報告與截圖：本次Codex對話outputs/en-release/VERIFY-en-release.md、smoke.json、live-delivery.json。

## 下一輪第一件事
1. 先核對發布工作樹codex/en-shared-interface與origin/main為1b8322e，讀work-orders/20261022/shared-interface-release/VERIFY-shared-interface.md；不要重做已上線的英文重構。
2. 讓主任審閱student-guide-official-review/index.html官網版型與28題FAQ；補現行專題文件、英檢條件、海外甄選及處室分工後再準備上線，未確認前不發布。
3. 本機遊戲等使用者試玩回饋。C節其餘待決項維持，禁止整條feature合併或順帶發布遊戲。
4. 開工前先查git status／HEAD，主專案與clone以本機fetch及ff-only同步；正式站main只接受另外獲授權的發布內容。

## run4整合時狀態（歷史）
- 主專案：C:/Projects/系網漫畫版_AGDComicSite；執行clone：C:/agywork/agd-site-codex。分支均feature/en-site-and-play-zone。
- 本輪六條：codex/hide-pending 2576ae7、codex/tune-collapsed efe4204、codex/tuning-roundtrip 2fd7f99、codex/spring-backgrounds be6da33、codex/faculty-punctuation 5bb779b、codex/en-check-batch2 8ca0a85。全數獨立重跑後合併，合併點d0e7eb1，0衝突。
- 獨立驗收工作樹：C:/agywork/agd-run4-verifier，保留未清理。六分支相關測試分別17/16/16/16/16/16，全通過。
- 整合版 node --test tests/en-play.test.mjs：17/17；node tools/validate-en.mjs：8檔PASS；英文CHECK 518→510。
- node build.mjs exit0，既有duplicate color警告仍在；輸出bundle與提交版一致。沒有額外重寫介面或改遊戲。
- 中英試玩卡5張皆無待補，可真正開啟／關閉iframe；已知team·year保留。390×844調校面板預設收合，遊戲可見100%，28鍵可用；扣墨42→72、公開／調校localStorage隔離、JSON28鍵維持。
- JSON實際貼回磁碟tuning.js後，桌機／手機三關通過，再用原始bytes還原，SHA256一致。六組語系／裝置／調校組合各三關won、0失誤、0錯誤。
- 平台與藍牆四張圖重新拍攝並逐張代理目視可辨識虛線；未改顏色或程式，未宣稱使用者對話確認。
- 英文來源本輪重新開啟金點主辦部會、金犢官方PDF、KT藝術節、HC真正官網；ZIP-LAB可讀性待確認，原值未改。
- ui-policy工具仍exit1，只有既有4張實景例外，沒有新問題。
- agy補助審查：ReadFile被擋；改附文字重送後240秒TIMEOUT，未提供可用判定，不納入驗收。
- **真手機從未測過**。其餘四款只做啟動及第一段操作冒煙，不宣稱完整通關；《創作不斷線》完整三關已測。

## 本輪試玩交付
- ZIP：AGDComicSite-Playtest-20261021.zip，59,982,468 bytes。完整解壓後雙擊START.cmd；Windows內建PowerShell即可，無需npm安裝。既有React CDN與網路字型需網路。
- ZIP SHA256：0a9d073e68e5e291b7dde2c99581028b688aa05deba4e562f8ed5d1f724c9603。
- ZIP已真正解壓到 work/run4/unpacked-playtest，用包內PowerShell伺服器實跑五款第一段操作，全部通過、JS/站內HTTP錯誤0。554個runtime檔案逐一雜湊一致；PS1 UTF-8 BOM、CMD純ASCII，PowerShell5.1/7解析皆過。
- 可重跑QA：tools/qa/run4/README.md；啟動器範本：tools/playtest/。
- 離線狀態儀表板：work-orders/20261022/run4/dashboard/index.html（2026-10-21重產；資料／工具／使用者狀態分開，使用者確認仍為0）。

## A. 環境整理（本輪使用clone，主專案junction未拆）
1. **`node_modules` 目前是目錄連結**（junction，指向 `C:\agywork\agd-site-codex\node_modules`），不是正式安裝。處理方式：
   - 先確認是連結：PowerShell `(Get-Item node_modules).LinkType` 應為 `Junction`。
   - 只拆連結、不碰目標內容：`cmd /c rmdir node_modules`（**不可加 `/s`，不可用 `Remove-Item -Recurse`／`rm -rf`**，那會刪到 clone 裡的真套件）。
   - 再 `npm install`（`package.json` 已有 devDependencies `playwright ^1.64.1`、`sharp ^0.35.5`）；Chromium 沒裝就 `npx playwright install chromium`。
   - 驗收：`node --test tests/en-play.test.mjs` 16/16。
2. 文字檔換行：clone 設 `core.autocrlf=true`，工作目錄是 CRLF、git 內是 LF。比對雜湊時要說明用的是哪一邊。

## B. 本輪六項已完成（以下保留原工單規格）
每項做完寫 `work-orders/20261022/reports/<名稱>-report.md`：做了什麼、`git diff --stat`、驗收逐條 yes／no 附實際指令輸出。

| 優先 | 項目 | 範圍（白名單） | 驗收（yes／no） |
|---|---|---|---|
| P0 | **英文頁不要顯示中文「待補」**：四款試玩卡現在顯示「待補 · 待補」，`#/en/play` 也是中文。值為「待補」時該行不顯示（中英皆然），不改資料 | `en-pages.jsx` 的 `PlayCard`、`bundle.js`（`node build.mjs` 產物）、`index.html`／`pages.jsx` 版本字串 `20261021d`→`20261022a`、`tests/en-play.test.mjs`（只新增） | `#/play/zone` 與 `#/en/play` 五張卡都沒有「待補」字樣；creative-line 仍顯示 `team · year`；測試全過 |
| P0 | **調校面板在手機直向會蓋住整個遊戲**：改成預設收合（只露標題列與三顆按鈕），點「展開」才出現滑桿 | `play/creative-line/tuning.js` | 390×844 手機模擬 `?tune=1` 截圖，遊戲畫面可見面積 ≥ 70%；展開後 28 支滑桿可用；`node C:/agywork/agd-site-qa-scripts/wo02check.cjs <repo根>` 結果與現在相同 |
| P1 | **驗「複製 JSON 貼回 `tuning.js`」**（之前 unverified）：把面板複製的 JSON 貼回檔案等號後，頁面能正常載入、三關可過 | 只驗不改；若壞掉才改 `tuning.js` | 貼回後 `autoplay.cjs` 三關 won；報告附貼回前後 diff（驗完還原） |
| P1 | **彈簧線在深色平台與藍色牆上的可見度**（之前只驗了米白地板） | 只截圖不改程式；截圖放 `docs/qa/creative-line/20261022/` | 兩種背景各 1 張桌機 1 張手機，人眼看得到虛線；看不到就寫報告，不要自己改顏色 |
| P1 | **`faculty.json` 既有驗證失敗**：`node tools/validate-en.mjs` 報 `faculty.json FAIL 1：$[9].certs 純英文原值被改`（原文頓號被換成英文逗號；合併前就存在） | `data/en/faculty.json` 只改 `$[9].certs` 的標點 | `node tools/validate-en.mjs` 八檔全 PASS |
| P2 | **英文 `[CHECK]` 第二批**：四檔還剩 518 個（stats 265、news 37、works 16、faculty 200）。先查 WO-04 列為「查過但未採用」的：金點新秀、時報金犢獎、KT 科藝獎、西基、ZIP-LAB、Hautecouture 法人名 | 同 WO-04（`work-orders/20261021/WO-04-en-check-review.md` 第 0 節），對照表寫 `docs/qa/en-check/20261022-batch2.md` | 同 WO-04 第 3 節；每筆有可開啟的官方來源 URL；維基不算來源 |

## C. 要使用者決定的事（Codex 不要自己做）
1. **推上 origin**：本機多 20 個提交；repo 公開，推之前使用者要自己看過內容。
2. **`_v1-rejected` 29 檔要不要刪**：清單在 `work-orders/20261021/DELETE-LIST-creative-line-v1.tsv`／`.md`。刪之前還要一併處理 `play/creative-line/tools/prep-art.mjs` 對 `art/ui`、`art/fx`、`art/web`、`tools/mask-seeds.json` 的舊引用。一次刪 20 檔以上要使用者在對話確認。
3. **手機手感**：使用者拿真手機開 `play/creative-line/index.html?tune=1` 調，調完按「複製 JSON」貼回 `tuning.js`。
4. **《小朋友齊打交》致敬版規格定案**：`docs/design/fighter-homage/SPEC.md` 第 10 節的選項。LF2 原版再利用條款仍是 unverified（`lf2.net/en/terms.html` 404）。
5. **試玩卡「待補」的實際內容**：六樓出口、晴日茶桌、地窖大廚、死線防衛隊的製作者、年份、授權要使用者提供（`cozy-big-two` 有 `fusion-pixel-tea.ttf` 但沒有授權檔）。
6. **清理**（使用者同意才動）：
   - 臨時分支 `merge/codex-run2` 與工作樹 `C:\agywork\agd-site-merge`（內容已全部進 feature）。
   - 已合併的 `codex/wo-0N-*` 分支、`codex/attempt1-partial`。
   - `C:\agywork\agd-site-attempt1-docs-untracked`：第一次失敗留下的未追蹤 `docs/`（23 檔，含瀏覽器暫存），從主專案搬出來的備份。
   - `C:\agywork\agd-site-codex` clone 裡的未追蹤暫存：`docs/qa/creative-line/20261021/browser-tmp/`（約 529 檔 Node 編譯快取）與 `work-orders/20261021/codex-*` 提示檔與 log。

## 使用者裁定（不要再問）
- 減少 AI 美術，盡量用系上實景後製；場景沿用《六樓出口》的實景轉漫畫圖。
- 《創作不斷線》按鈕與面板比照《六樓出口》用純文字。
- 試玩區選入：創作不斷線、六樓出口、晴日茶桌、地窖大廚、死線防衛隊。
- Dots 暫不使用（工作單 agd-comic-site#1 留著）；不用 Claude API、不用雲端 session；副戰力只用 Codex 與 agy。
- `ui-policy.cjs` 對 4 張實景圖報錯是已知例外（記在 `play/creative-line/ui-art-manifest.json`），不改工具。
- 截圖包用 WebP，不放 PNG 進公開 repo。

## 硬規則（照全域 AGENTS.md）
- 不 push、不碰 `main`、不刪檔（要刪先列清單給使用者確認）。
- 不生圖、不用程式畫美術；畫面上的圖只能用既有素材。調校面板是除錯工具，用純 HTML 表單元素。
- 驗證要實際跑指令並貼輸出；做不到就交部分並寫明卡在哪。

## 驗收工具（repo 外，可直接用）
`C:\agywork\agd-site-qa-scripts\`（Playwright 從 `C:/agywork/agd-site-codex/node_modules/playwright` 載入，自帶靜態伺服器，不需 http-server）：
- `node autoplay.cjs <repo根> ["?lang=en"|"?tune=1"] [desktop|mobile] brief`：三關沿 `path` 自動試玩，印出每關狀態、失誤、錯誤數。
- `node wo02check.cjs <repo根>`：調校面板、滑桿改 `costTouch` 前後扣墨、`localStorage` 持久化與公開版隔離、複製 JSON、還原預設。
- `node wo03check.cjs <repo根>`：開 `#/play/zone`、`#/en/play` 數試玩卡的 `team · year` 行。
- `node mergeshot.cjs <repo根> <輸出.png>`：拍一張第 3 關彈簧線並印出兩條線的屬性。
- `node crop.cjs <來源png> <輸出png> x y w h`：放大 3 倍裁切，看細節用。
- 參考基準：原版三關以 `autoplay.cjs` 跑都是 `won`、失誤 0。

## 重要路徑（repo 外，唯讀參考）
- 調研與構想：`C:\agywork\agd-game-research\{codex,agy,claude}\out\`，彙整 `C:\agywork\agd-game-research\彙整報告_系網試玩區.md`
- 關卡設計規格：`C:\agywork\agd-game-research\claude\out\creative-line-levels.md`
- 譯文覆核清單與原驗證器：`C:\agywork\agd-en-translate\`
- Codex 專用 clone：`C:\agywork\agd-site-codex`（origin 是主專案資料夾；在那裡 push 會直接推進主專案的分支，不可）
- 18T 遊戲清單：`G:\我的雲端硬碟\_跨機傳輸\18T遊戲清單_給系網調研_20261021.tsv`（147 列，48 列有網頁版）

## 復盤 2026-10-21

範圍：Claude Fable 5.1 接手後的規劃段（寫工單 → Codex 第一次失敗 → 修環境 → 開 Opus 對話控制 Codex）。Opus 之後的執行與驗收見上方各節與 `work-orders/20261021/VERIFY-run2.md`。

### 1. 做了什麼、改了哪些檔
| 檔案 | 用途 |
|---|---|
| `work-orders/20261021/README.md` | 六張工單索引、給 Codex 的 8 條共同規則、現況摘要；後修正測試指令 |
| `WO-01-creative-line-screenshots.md` | 56 張全狀態截圖包＋對照頁（原誤寫 15 狀態 60 張，已改 14／56） |
| `WO-02-creative-line-tuning.md` | 手感參數集中到 `tuning.js`，`?tune=1` 手機調校面板 |
| `WO-03-play-credits.md` | 試玩卡 team／year／license／credit 四欄，只抄來源檔不編造 |
| `WO-04-en-check-review.md` | `[CHECK]` 第一批：只改有官方來源的獎項與機構英文名 |
| `WO-05-v1-rejected-list.md` | 29 檔舊 AI 圖的刪除清單（含 SHA-256 與復原指令），只列不刪 |
| `WO-06-fighter-homage-spec.md` | 三方格鬥致敬構想合併成單一規格＋實景拍攝清單，不寫程式 |
| `LATEST_HANDOFF.md` | 新建交接檔（現況、使用者裁定、待決、下一輪第一件事） |
| `.gitignore` | `docs/` 改成 `docs/*` 並排除 `docs/qa/`、`docs/design/`，工單交付物才進得了版控 |
| （未列入 mod 清單）`codex/attempt1-partial` 分支 | Codex 第一次的 13 個部分成果，留存不驗收 |
| （未列入）`C:\agywork\agd-site-codex` | Codex 專用 ASCII 路徑 clone，預裝 Playwright 1.64.1＋Chromium，`package.json`／lock 已提交 |
| （未列入）`work-orders/20261021/codex-prompt-run2.txt` | 第二次給 Codex 的提示檔 |

### 2. 踩雷與根因
| 症狀 | 根因 | 修法 |
|---|---|---|
| `node --test tests/` → `Cannot find module '...\tests'` | Node 24 的 `--test` 不接受資料夾路徑；我沒先實跑就把指令寫進六張工單與交接檔 | 全部改成 `node --test tests/en-play.test.mjs`（commit `b0f0385`） |
| WO-01 寫 15 狀態 60 張 | 清單實際只有 14 種，數字是手算的 | 改 14／56；Codex 沒硬湊第 15 種是對的 |
| Codex 第一次六張全交白卷：`fatal: Unable to create '.git/index.lock': Permission denied`；Chrome／Edge headless `CreateFile: 存取被拒 (0x5)`＋`mojo ... crash server failed to launch`；`npm ERR ENOTCACHED` | `codex exec -s workspace-write` 沙箱把 `.git` 設唯讀、擋子程序開檔、斷網 | 改在獨立 clone 用 `-s danger-full-access`；Playwright 與 Chromium 先裝好，Codex 不必連網下載 |
| 我啟動 `danger-full-access` 被 auto 模式分類器擋下（`Create Unsafe Agents`），連背景等待的 Bash 也一起被擋 | auto 模式不允許代理再啟動不受沙箱限制的代理 | 開一個 `default` 權限模式、模型 Opus 的獨立對話去啟動，由使用者按允許；未繞過 |
| `docs/` 整個在 `.gitignore`，WO-01／04／06 的交付物會進不了 commit | 舊設定只考慮內部備忘 | `.gitignore` 放寬（commit `ea6af82`） |
| `git stash push -u <pathspec>` 後 13 檔仍留在 index（顯示 `A`） | stash 帶路徑規格時對未追蹤檔的行為不如預期 | 改開側分支 `codex/attempt1-partial` commit |
| `.gitignore` 用 `.Replace("docs/`n",...)` 沒換到 | 檔案是 CRLF | 改用 Edit 工具 |
| 探測 `.git` 寫入權限的指令被 dcg `rm-protected-file` 擋 | 我在同一行裡寫了 `Remove-Item '.git\...tmp'` | 改用 Bash 只讀 `index.lock` 是否存在 |

### 3. 額度花費
- mod 量到：累計工作時間約 14 分鐘；本 session 約 US$28.42；目前最高用量窗口：週 37%。
- 最耗的一步：一次輸出六張長工單＋README＋交接檔（約 1.2 萬字），其次是修環境時十幾次 PowerShell 往返與被擋重試。Codex 與 Opus 對話的額度不計在此。
- 浪費點：測試指令與截圖數兩處筆誤各多花一輪修正；三個被安全規則擋下的指令各白跑一次。

### 4. 下一步與規則建議
- 下一步：Opus 對話已把六張（加 WO-07 彈簧線修正）驗收並合併進 feature（HEAD `6981888`，16/16），見本檔「下一輪第一件事」與 B 節待辦。等使用者決定：推不推 origin、`_v1-rejected` 刪不刪、真手機調手感、格鬥規格定案。
- 規則建議（只提案，未改任何規則檔）：
  1. **`ai-fleet-handoff` 或新開 `codex-exec` skill**：記「`codex exec` 的 `workspace-write` 沙箱不能寫 `.git`、不能開瀏覽器、不能連 npm；需要分支／commit／截圖的工單要給獨立 ASCII clone＋`danger-full-access`，且這個啟動必須由使用者或 `default` 權限對話執行，auto 模式會被分類器擋」。
  2. **工單範本（`unity-ai-asset-gen/references/art-work-order-template.md` 或 `verify` skill）加一條**：寫進工單的每個驗證指令，主控要先在本機實跑一次並貼輸出；這次 `node --test tests/` 就是沒跑就寫。
  3. **repo 內新增 `AGENTS.md`**：記 `node --test tests/en-play.test.mjs`、`node build.mjs` 後要 bump 版本字串、`play/creative-line/` 不經打包、`docs/qa`／`docs/design` 進版控其餘不進。這是專案慣例，不該放全域。
  4. **hook 提案（低優先）**：PreToolUse 看到 `node --test <目錄>` 時提醒 Node 24 要給檔案路徑。
- 下一輪建議：Claude Code／claude-opus-5-5／high
  理由：獨立驗證或複驗；主線必須留在目前的 Claude 家族。
  狀態：只提出建議，不切換模型、不建立新工作、不自行派工。
