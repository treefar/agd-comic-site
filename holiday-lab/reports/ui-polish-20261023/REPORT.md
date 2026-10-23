# 既有遊戲UI與字型修整（2026-10-23）

本輪完成14款非勞動節遊戲的選定核心流程驗收：中、英、日 ×320/1440，共84/84。保留原字型、字級與漫畫美術，未發布。

## 實際修正

- lab.css：短標題、選項與短狀態使用均衡換行；日文嚴格換行；長說明採pretty段落排版。修掉日文列表兩個「マ」、新生地圖標題「プ」、未選狀態「択」、互動作品按鈕「品」、草稿設定「秒」，以及設定／錯誤提示／長字幕說明僅剩一字加標點的末行。沒有縮字、刪內容或省略號。
- games/semester.mjs：英文抵免提示由舊Credit Waiver and Transfer改為目前指南實際標題Credit Transfer，解決真搜尋0結果。既有semester-tasks測試9/10紅轉10/10綠；獨立新版真操作可找到並展開卡片。
- 小改版僅規畫：日文外來語依詞組斷行，手機按任務→調整→試播分群；保留資訊、減少閱讀干擾。詳audit/design-notes.md，沒有改凍結版美術。

## 逐條驗收

| 項目 | yes/no | 實際指令與輸出 |
|---|---|---|
| 先重現再修正 | yes | font/check.cjs before → exit1，日文320兩標題各孤尾「マ」；audit原84初始頁另發現4處；獨立01真RED保留 |
| 原字型與字級保留 | yes | git diff只增加文字換行CSS；既有font-family與font-size值未改，未下載或替換字型 |
| 原列表問題回歸 | yes | FONT_QA_URL=http://127.0.0.1:8860 的font/probe.cjs final03；font/check.cjs final03 → FONT_WRAP 6/6 PASS，孤尾0/overflow0/errors0 |
| 抵免搜尋修復 | yes | node --test holiday-lab/tests/semester-tasks.test.mjs → 10passed 0failed；獨立03 semester英語雙寬真搜尋及卡片展開通過 |
| 最後建置 | yes | node holiday-lab/build-review.mjs .measure-ui-polish-20261023-03 --measurement → exit0，357檔，art preflight257assets/9screens/pass；既有duplicate color警告保留 |
| 子代理獨立真UI | yes | independent/run-v2.cjs（完整環境／命令見獨立REPORT）→ exit0，84/84；intro/menu/help/settings/玩法/失敗/各階段/結果/重播/重試。不得進labor，來源前後一致 |
| 主控重新核驗 | yes | node holiday-lab/reports/ui-polish-20261023/root/verify-current.cjs holiday-lab/reports/ui-polish-20261023/independent/runs/2026-10-23T08-07-41-848Z/result.json → exit0，contexts84、states1416、PNG420、文字rows31608、sources18；layout0/orphan0/errors0 |
| 主控正反例與相關回歸 | yes | node --test holiday-lab/reports/ui-polish-20261023/root/verify-current.test.cjs holiday-lab/tests/semester-tasks.test.mjs → tests15 pass15 fail0，exit0；含假pass、藏溢位、舊CSS與假全域批准負例 |
| 完整發布UI合約 | no | ui-layout-policy.cjs --project . → exit1，原始輸出root/layout-policy-output.txt。固定08歷史2046/2076缺30不是30個產品bug；未升格canonical或全域完成 |
| 勞動節／main／C／推送 | no（未執行） | 勞動節原檔SHA與上一凍結build相同；main參照與C節SHA未變，見root/boundaries.json；未push/發布/刪檔/Unity |

原獨立01批失敗有兩種：真產品問題（英文抵免搜尋及長說明孤尾）與驗收腳本過嚴分數假前提。先故意失誤後，元宵／端午／國慶可合法96分、教師節97分；新驗收按artifact與產品公式核分，沒有修改遊戲湊100。原RED保留，03以完整新84重新驗證，未混用舊綠燈。

實體手機、全動態組合、母語逐句與使用者美術確認不在本次自動驗收範圍；指定流程通過不代表全站與發布閘門已完成。

## 本機入口

首頁：http://127.0.0.1:8860/ ；遊戲：http://127.0.0.1:8860/holiday-lab/ ；儀表板：http://127.0.0.1:8860/progress/ 。

重啟：在C:/agywork/agd-holiday-prototypes執行 node scripts/serve-local-review.cjs --site=.measure-ui-polish-20261023-03 --dashboard=holiday-lab/dashboard/out --port=8860 。

字型技術驗收與儀表板結果在下方補記；所有原始圖、方法與JSON保留於本目錄，root/verification.json記最後來源與SHA。

## 字型技術驗收

獨立字型代理綁最後03 raw收據，實讀16faces／9份Windows字型檔name與cmap：中文687、英文85、日文602個不重複codepoints，36組樣式，候選stack缺字0／unknown0／font_errors0；不是每字實際fallback全證明。CDP抽樣正黑體family缺U+2212負號，但獨立追加en/ja真按鈕探針確認實際以Noto Sans TC畫出glyph1，已保存minus-font-probe.json與兩張PNG，沒有方框、無須換字型。其餘逐字fallback仍未知；沒有宣稱全站字型全通過。

## 儀表板與交接

node holiday-lab/build-dashboard.mjs →34/34 PASS；node --test holiday-lab/dashboard/progress-adapter.test.cjs holiday-lab/dashboard/ui-authority.test.cjs →9passed 0failed；DASHBOARD_QA_URL=http://127.0.0.1:8860 的 node holiday-lab/dashboard/smoke.cjs → DASHBOARD_SMOKE 2/2 + OFFLINE PASS，exit0。搜尋「勞動」現在會命中多張含暫緩說明的卡片，原smoke硬要求1筆曾真RED；改按宣告的search_fields逐列算預期命中，且仍另驗paused篩選恰1張勞動節卡，不修改產品湊測試。

LATEST_HANDOFF、STATUS、Vault專案紀錄均已更新；C節SHA未變，未推送。主控第一次呼叫獨立verify漏帶目錄參數而exit1，補上REPORT實際命令後exit0，沒有因此重跑遊戲或改證據。

## 本機版控保全

已將1082份本輪報告／證據與兩個產品來源（合計548911669 bytes）逐檔核對Git index原位元組相同；詳root/git-preservation.json。本輪只在codex/game-ui-polish本機提交。raw／方法目錄設-text，避免換行轉碼損壞SHA；勞動原檔未修改。原始RED與失敗測試保留，非發布包。
