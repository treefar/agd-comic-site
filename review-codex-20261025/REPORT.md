VERDICT: ISSUES

# 系網公開版英日文與三語內容檢查

檢查日期：2026-10-25（台灣時間）。對象：http://127.0.0.1:8910/ ，實際供應程式包為 app-TQKQ5SJH.js。

依工單第 5 節完成可執行的 B、C 靜態檢查。確認 11 項問題：P0 0 項、P1 7 項、P2 4 項。A 排版未完成：Playwright 載入成功，但 Chromium 啟動遭系統拒絕，回傳 spawn EPERM；無實際瀏覽器畫面、截圖或尺寸驗收，因此本報告不能作為排版放行依據。

## 1. 問題表

「靜態」代表核對實際供應資料、語系字串與既有元件的靜態輸出；不代表已在瀏覽器重現。以下均無經確認的 P0。

| # | 嚴重度（P0 會擋上線／P1 該修／P2 可之後修） | 語言 | 頁面網址 | 尺寸 | 問題 | 證據（截圖檔名或原文） | 建議修法 |
|---|---|---|---|---|---|---|---|
| E01 | P1 | 中／英／日 | http://127.0.0.1:8910/?lang=zh#/students/guide <br> http://127.0.0.1:8910/?lang=en#/students/guide <br> http://127.0.0.1:8910/?lang=ja#/students/guide | 未實測（靜態） | 公開版在校指南頁尾仍宣告為審閱版本。該段沒有公開版條件判斷。 | student-guide.jsx 的 sg-editor-note：「本頁為審閱版本。」；英文「This page is a review draft.」；日文「なお、本ページはレビュー版です。」。公開 JSON 的 publication_status 也仍為 review_draft_only。 | 公開版移除審閱宣告，保留必要的規定適用性提醒；同步三語字串與公開資料狀態。 |
| E02 | P1 | 英 | http://127.0.0.1:8910/?lang=en#/admission/selection | 未實測（靜態） | 招生流程把「非應屆生」譯成不畢業的學生，改變申請對象意思。 | 原文「非應屆生個資登錄」對應「Personal data registration for non-graduating students」。 | 改為「Personal data registration for graduates from previous years」等能明確表示往屆畢業生的用語。 |
| E03 | P1 | 英 | http://127.0.0.1:8910/?lang=en#/faculty/tengshuyuan <br> http://127.0.0.1:8910/?lang=en#/faculty/chenmeijung <br> http://127.0.0.1:8910/?lang=en#/faculty/yangchihchang <br> http://127.0.0.1:8910/?lang=en#/news/2026-08-19-obsessive-reality-5-more-festivals <br> http://127.0.0.1:8910/?lang=en#/news/2026-04-08-unity-114-2 | 未實測（靜態） | 三位教師的英文姓名在師資頁與消息正文使用不同拼法。 | 鄧樹遠：TENG, SHU-YUAN／Deng Shu-yuan；陳美蓉：CHEN, MEI-JUNG／Chen Mei-rong；楊智彰：YANG, CHIH-CHANG／Yang Zhi-zhang。已各自核對同名中文人物與指定消息正文，不是只比較大小寫或姓名前後順序。 | 以各教師確認的英文姓名建立單一對照；逐篇統一正文、卡片與翻譯資料。這裡僅確認不一致，未另查個人正式拼法。 |
| E04 | P1 | 英 | http://127.0.0.1:8910/?lang=en#/works/fangshi-2025 <br> http://127.0.0.1:8910/?lang=en#/news/2025-08-28-bahamut-acg <br> http://127.0.0.1:8910/?lang=en#/news/2025-06-17-stolen-recipe <br> http://127.0.0.1:8910/?lang=en#/faculty/tengshuyuan <br> http://127.0.0.1:8910/?lang=en#/news/2026-04-29-awards-showcase | 未實測（靜態） | 同一作品在跨頁被譯成不同片名／遊戲名，妨礙讀者辨識作品。 | 《人造人》：Android／Zephyranthes；《神癒》：Divine Healing／Holy Algorithm；《喀嚓》：Click／Kacha；《今食堂》：Jin Diner／Today Restaurant。各組均核對了相同中文作品名與其實際靜態輸出。 | 向團隊核定作品正式英文名稱後逐筆統一；尚未核定時保留中文原名，避免另創多套譯名。 |
| E05 | P1 | 中／英／日 | http://127.0.0.1:8910/?lang=zh#/news/2025-08-28-bahamut-acg <br> http://127.0.0.1:8910/?lang=zh#/news/2025-05-21-fangshi-2025 <br> 同路由另加 lang=en／ja | 未實測（靜態） | 《人造人》同一團隊的創作者姓名有異字，三語沿用後亦不一致。 | 8/28 消息：「博浩原、戎軒頤、陳政民、李育賢」；5/21 消息：「博浩原、李育賢、戎軒頤、陳政名」。英文相應為 Chen Zheng-min／Chen Zheng-ming；日文也分別保留陳政民／陳政名。 | 向原作品署名或團隊核對正確姓名，再同步三語。不能僅依兩篇消息推定哪個字正確。 |
| E06 | P1 | 三語共用資料 | http://127.0.0.1:8910/data/students/guide.json <br> 使用頁：http://127.0.0.1:8910/?lang=zh#/students/guide | 不適用（HTTP／JSON） | 公開 JSON 帶出內部查核 metadata 與 holiday-lab 路徑。 | sources[6].evidence_path 為 holiday-lab/reports/current-rules-20261024/leave/raw/announcement-20260618.body；另有 http_recheck 等查核欄位。共 28 個路徑字串、26 個不同路徑，HEAD 均為 404；上述代表路徑另用 GET 確認也是 404。 | 公開資料輸出時以欄位白名單移除內部證據路徑與作業紀錄，對外保留實際官方來源網址。28 筆來源欄位與回應見 raw-marker-hits.json、local-resource-checks.json。 |
| E07 | P2 | 英 | http://127.0.0.1:8910/data/en/faculty.json <br> http://127.0.0.1:8910/data/en/news.json <br> http://127.0.0.1:8910/data/en/stats.json <br> http://127.0.0.1:8910/data/en/works.json | 不適用（HTTP／JSON） | 發布包仍公開帶有內部 [CHECK] 的翻譯資料。此項限公開資料檔，不宣稱畫面顯示 [CHECK]。 | 共 487 個字串欄位含 [CHECK]：faculty 178、news 21、stats 279、works 9。例如 works[0].title：「ClipStudio International Illustration Contest · Grand Prize (ClipStudio 國際插畫大賽 · Grand Prize 國際首獎) [CHECK]」。這四份資料均實際 GET 200。 | 發布前區分工作翻譯稿與公開用資料；完成查證後再移除標記，或不發布未供畫面使用的工作資料檔。不要只在最後的顯示字串清除標記。 |
| E08 | P2 | 英 | http://127.0.0.1:8910/?lang=en#/stats/international | 未實測（靜態） | 英文內文有整句中文重複附在後面，超出保留人名、作品原名與正式文件名的用途。 | 「Inviting international experts to offer workshops (including creators from South Korea and Japan) (邀請國際專家開設工作坊 - 含韓國、日本創作者)」；另有「Suspended due to Covid-19 (因 Covid-19 暫緩)」。 | 保留英文敘述；若無雙語註記需求，移除一般敘述的整句中文副本。不要把學生作品原名或語言切換選項一併刪掉。 |
| E09 | P2 | 日 | http://127.0.0.1:8910/?lang=ja#/students/guide | 未實測（靜態） | 文件標題把中文「官網」直接帶進日文，讀起來不自然。 | 「学生履修規則（官網掲載版：2025年2月19日）」與「学生単位認定規則（官網掲載版：2025年9月10日）」。 | 改為「公式サイト掲載版」，兩筆分別修正；原始文件的正式中文名稱可以另作註記。 |
| E10 | P1 | 英 | http://127.0.0.1:8910/?lang=en#/stats/employment <br> 首頁：http://127.0.0.1:8910/?lang=en | 未實測（靜態） | 94% 被直接稱為 employment rate，但同頁公式把服役與留學也計入，指標名稱與計算範圍不一致。 | 標題「AY 109-112 · Average Employment Rate 94%」；註解「Employment Rate = (Employed + Military Service + Advanced Study Abroad + Freelancing) ÷ Valid Tracked Individuals.」。首頁也顯示「94% graduate employment」。 | 向統計原始資料確認指標正式名稱與分子／分母，採能涵蓋該範圍的名稱並在首處說明。現有證據不足以自行改百分比。 |
| E11 | P2 | 中 | http://127.0.0.1:8910/?lang=zh#/labs/db101-1 <br> 首頁：http://127.0.0.1:8910/?lang=zh#labs | 未實測（靜態） | 商品周邊的「周」誤寫為週次的「週」，標題與內容用字不一。 | data/labs.json，slug=db101-1 的 name：「週邊商品設計實驗室」；shortDesc 已使用「動漫遊戲周邊一條龍」。 | 一致使用「周邊商品設計實驗室／周邊商品」；修改前搜尋所有引用，若須忠實保留校方既有掛牌名稱，先由主控確認名稱規則。 |

E01–E11 的可重查資料存於 [findings-recheck.json](findings-recheck.json)；重查腳本為 [recheck-findings.cjs](recheck-findings.cjs)，在本資料夾可執行 node recheck-findings.cjs。腳本只讀網站來源、以 GET／HEAD 連到 8910，並只在本資料夾寫入 findings-recheck.json。已實際執行，11 項問題條件皆仍成立；這不是「網站測試通過」。

E06 的 26 個 404 都是公開 JSON 內的內部證據路徑；目前檢查到的靜態 HTML 並未把它們輸出為可點擊連結，請勿把此數字解讀為 26 個使用者導覽壞連結。

## 2. 逐項 yes/no 與實際覆蓋

此表的 yes/no 回答「本項是否可判定符合工單、通過檢查」。no 可能是已發現問題，或未取得必要畫面證據；原因分開列出。

| 項目 | 通過 yes/no | 實際檢查頁面與尺寸 | 原因／界線 |
|---|---|---|---|
| A 排版英文 | no | 瀏覽器無法啟動；1440×900、1920×1080、390×844 均未實測。所有路由均無畫面證據。 | 未完成，不能判定文字溢出、重疊、截斷、按鈕換行、頂欄擁擠或整頁水平捲軸。 |
| A 排版日文 | no | 同上，三種尺寸均未實測。 | 未完成，不能判定通過。 |
| B 翻譯英文 | no | 97 個路由靜態內容；首頁、課程地圖、在校指南、招生導引首題、家長指南、作品牆、測驗首題、影片牆，以及消息 21、作品 7、師資 13、實驗室 12、招生 8、統計 8、影片詳情 20。未實測尺寸。 | 依第 5 節完成資料與靜態字串檢查，發現 E01–E04、E07、E08、E10。沒有逐畫面人工校對的證據。 |
| B 翻譯日文 | no | 同一批 97 個路由，以日文語系重做靜態內容檢查；未實測尺寸。 | 發現 E01、E09；E05 的中文姓名矛盾也沿用到日文。未宣稱全面的日文母語校訂已完成。 |
| C 內文 | no | 同一批路由的中英日共 291 份靜態輸出；另核對 31 份本機 JSON，以及 64 個本機資源／metadata 路徑。未實測尺寸。 | 發現 E01、E05、E06、E10、E11 等內容問題。外部連結、外部圖片與實際互動未驗證。 |

完整的 97 個路由及三語網址列於 [page-inventory.md](page-inventory.md)。逐頁文字與 HTML 分別見 [static-page-text.json](static-page-text.json)、[static-page-html.json](static-page-html.json)。

補充：工單提到的 #/guide/start，實際是「我適合哪個管道」的招生導引；頂欄的在校指南連到 #/students/guide。兩者均納入靜態檢查，此路由差異沒有列為網站缺陷。

## 3. 實際方法與檢查結果

1. 完整讀取 WORK-ORDER.md；工具回報的工作目錄即本審閱資料夾。所有明確寫入均在此資料夾內。未使用 git、刪檔、套件安裝、Build、Lint 或伺服器啟停命令；因此沒有網站 Build／Lint／瀏覽器 Console 結果可回報。
2. 以 GET 實際讀取本機首頁、其引用的 app-TQKQ5SJH.js 及 31 份 JSON。首頁與程式包和 dist 對應檔案完全一致，31 份資料亦與來源檔逐份相同，證據見 [local-data-checks.json](local-data-checks.json)。英文／日文已生成語系表分別有 2552／2595 個 key；和既有 SSR 產物的語系表完全相同。
3. 在 Node 記憶體中使用既有 .build-tmp/ssr.cjs，預載上述本機資料，以三語各產生 97 個路由的靜態輸出。切換語言、重建翻譯快取只發生在記憶體。課程地圖原本須由 effect 載入資料，另在記憶體將其唯一資料狀態初始化為已讀取資料，補看載入完成後內容。此方法只提供元件文字與資料流的輔助證據，沒有執行瀏覽器 effect、版面計算或操作流程。
4. 資源檢查：38 個本機資源回應 200：32 個圖片網址、5 份樣式表、1 份程式包；首頁另以 GET 確認 200。26 個不同的內部 metadata 路徑回應 404。原始結果見 [local-resource-checks.json](local-resource-checks.json)。200 只證明 HTTP 可取得，未做瀏覽器影像解碼、lazy loading、切換 fallback 或背景圖逐張畫面驗收。
5. 已列出 230 個不同的外部引用，但未發出請求，見 [external-links-not-tested.json](external-links-not-tested.json)。全程網路僅連到 http://127.0.0.1:8910/，未開啟原官網或外部查證網站。所有 fetch 使用 redirect:manual，未跟隨轉址到外部。
6. 自動掃描後人工核對問題原文；不把任何漢字都判為漏翻。語言選單「中文／日本語」、學生原作署名、作品原名與正式文件原名沒有一概列為問題。原始資料的數字對照按 slug／id 配對；未將順序不同的資料列直接當作數字矛盾。原始差異清單 [numeric-differences-by-slug.json](numeric-differences-by-slug.json) 僅為候選，包含數字改寫成英文單字、學年度換算與括號重複，不代表全是錯誤。
7. 最後以 SHA-256 重驗 46 份已讀取來源與建置檔案，46 份均未變動，見 [source-integrity-check.json](source-integrity-check.json)。此為所列檔案的前後內容核對；未執行全站 git status，依工單保留給主控驗收。

版本指紋：

- 程式包 SHA-256：4a2cf7fc82a725d0d8ec4c254a6ee896223a0d20fdb180f0e35e4f1fe0f66f8b
- 實際供應首頁 SHA-256：e4f058add15f511dd9a9ea06b3cdc57641588be0cd5bd74ee2a59ba4b62c985c
- 使用的既有 SSR 產物 SHA-256：728a8dd5c4df819fde65c2c532c40a3bcd5fc901fa5ecbcdec8489e8da181cb6

統計資料由實際檢查結果計算，見 [audit-summary.json](audit-summary.json)。環境錯誤與替代方法見 [execution-limitations.txt](execution-limitations.txt)。沒有產生截圖，也沒有將靜態輸出稱為畫面驗收。

## 4. 沒檢查到的頁面、狀態與原因

- 所有頁面的英文、日文三種指定尺寸排版均未檢查到；原因是瀏覽器程序啟動遭拒絕（spawn EPERM）。1440×900 連第一次頁面開啟都未成功，1920×1080、390×844 亦沒有測得畫面。
- 所有頁面的瀏覽器載入後行為、手機選單展開、sticky 頂欄遮擋、捲動定位、輪播其餘七張、播放／暫停、隨機抽選、搜尋與篩選操作均未實測。首屏海報的八筆資料有讀取，但未逐張視覺驗收；依工單不回報已移除的「創作試玩」。
- #/guide/start 只取得首題靜態狀態；後續題目、各回答組合與推薦結果未逐一操作。#/quiz/start 也僅首題，未檢查全部答題路徑、結果及分享。作品牆與影片牆只取得預設資料狀態。
- 在校指南的 details 內文有納入靜態字串檢查，但未操作展開／收合、FAQ、來源選單，也未確認閉合狀態下的實際可見範圍。
- 舊 #/en/... 轉址只讀取 en-pages.jsx 的對照邏輯，未在瀏覽器驗證跳轉、網址保留與捲動。不能據此宣稱舊英文連結全部正常。
- 原官網、外部報名短網址、官方 PDF、社群、LINE、地圖、YouTube 嵌入與外部圖片未連線驗證；按範圍鎖只連本機，未跟隨任何外部轉址。因此 C 的壞連結／壞圖檢查仍有這些缺口。
- 不在本次 97 個路由清單的隱藏路由、任意錯誤 slug、未出現在現有資料與元件中的頁面均未另行窮舉。

## 5. 待確認，未當成已證實缺陷

- http://127.0.0.1:8910/?lang=zh#/stats/employment 的主題範圍是 109–112 共四學年度，但摘要卡另寫「5 年總畢業生 300+」。可能是不同統計期間；目前未列出該五年範圍，請補來源與期間，不能自行把 5 改成 4。
- http://127.0.0.1:8910/?lang=zh#/admission/joint 的「5 名（設計 3+1／資電 1／商管 1+1）」含一般生與原住民名額的不同口徑。資料表是一般生 5、原住民外加 2，不宜直接判定「應改 7 名」；可明寫「一般生 5 名，原住民外加 2 名」，並請主控對正式簡章確認。
- http://127.0.0.1:8910/?lang=zh#/stats/international 寫「2018/7 ~ 2021/11 · 因 Covid-19 暫緩」。起始日期與停辦原因的搭配需回原始計畫紀錄查核，本次未取原官網證據，沒有代填年份。
- 97 個路由的靜態產生沒有拋出例外，僅表示本次預載資料下可產生文字；不能證明實際頁面零 Console 錯誤、互動正常或排版合格。

主控下一步：處理已列 P1，並在可啟動瀏覽器的環境補跑英日各三尺寸與重要互動；完成前保留 A 未完成狀態。
