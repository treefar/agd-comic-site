# 字體缺字剩餘範圍盤點

2026-10-24。唯讀本機 8875／`.measure-overnight-20261024-02`，沒有更動產品、字型、原句或作品，沒有開啟節日遊戲、Unity、生圖或影音管線。

本輪沒有確認的缺字案例，因此保留原字型與原句，`proposal.json` 修改清單為空。這是有限字集的可用性驗證，不是整站零缺字或全裝置視覺通過。

## 實際核對

|層級|本輪結果|可信界線|
|---|---|---|
|三語首頁、展開全部指南與FAQ|6狀態、6,598可見文字列、1,419種非空白字元|1440px Windows Chromium；排除頁底試玩子樹；不是所有詳頁|
|CDP實際字型家族與cmap|79,079字元／文字節點配對全部有字形可用；missing 0、unknown 0、解析錯誤0|同文字父節點的實際字型聯集；不冒稱每一字實際由哪個字型繪出|
|CSS unicode-range|解析681個font-face描述；下載檔cmap先與對應range取交集|469個描述未被本輪頁面載入，不能當完整上游字型已取得；描述數不是獨立檔案數|
|現有網路字型檔|本輪觀察83個字型回應與1CSS；81字型復用舊已下載bytes，2份新遇子集留證|外部CSS刻意復用原已讀快取，不能宣稱重新下載到Google當日最新版；每份SHA可重算|
|主網站資料候選字集|30個JSON、8,553字串、2,204種非空白字元，已知字型聯集中均可找到|含未顯示值與技術字串，不代表8,553筆都在active DOM驗過；未讀節日遊戲資料|
|指南資料候選字集|688種字元均有已知字形；「侵」未在6頁可見字集出現|來源標題等候選資料與目前實際顯示分開，不偽造可見觀察|

來源及方法：`scan.json` 保存每個可見文字節點的原文、定位、computed family／weight／style及CDP平台字型；`coverage.json` 保存字型檔SHA、實際name table別名、字元表、CSS range與未知範圍；`font-rules.json` 保存實際CSS／HTML行號。六張PNG保留作有限頁面證據，沒有逐字目視整個長頁的宣稱。

## 目前字型鏈

- 正文主要指定Noto Sans TC；章節依角色使用Bangers、Reggae One、Bowlby One，再由正文／系統備援補字。Bangers與Bowlby不含繁中漢字並不等於產品缺字。
- 日文正文及指南／導覽／頁尾明列Yu Gothic、Hiragino Kaku Gothic ProN、Meiryo、Noto Sans TC。此機實際見Yu Gothic／Yu Gothic Medium，未在Windows冒稱驗過macOS的Hiragino。
- 本輪實際平台字型另包括Microsoft JhengHei UI／微軟正黑體、MingLiU、MS Gothic、Segoe UI Emoji／Symbol，以及符號備援Cambria Math。每個家族由字型檔name table核對，不由檔名猜家族。
- JetBrains Mono只見CSS宣告，本輪英文實驗室文字實際走Consolas與Cambria Math；不宣稱JetBrains已載入，也沒有因此任意換字型。

## 首輪方法缺口與修正

初次cmap重算exit 1、49筆unknown，缺字候選仍為0。原因是採樣器已報Cambria Math、Consolas、Arial Black，離線讀檔清單卻漏了這三個實際家族。`coverage-v1.json`、`coverage-v1.py.txt`保留首輪；補讀這三類本機檔案，逐份name table與cmap確認後，重算79,079／79,079、unknown0。沒有把工具漏讀寫成產品缺字，也沒有改字句湊通過。

## 剩餘範圍與處理

|項目|yes／no|後續判斷|
|---|---|---|
|本輪6狀態字形可用性|yes|可保留原字型、姓名與正式資格|
|實際讀CSS range與字型cmap|yes|不能用fonts.loaded替代|
|完整上游字體字集已取得|no|469個描述未載入；不額外大量抓字型湊數|
|所有新聞／教師／實驗室／作品／招生詳頁已實際逐筆渲染|no|本輪靜態資料候選有覆蓋，但active DOM只6狀態；需要具體頁面問題才加有限補驗|
|每字實際fallback、組字與所有字重逐筆證明|no|父節點聯集只能證字形可用，不能代替逐字平台選擇／組字|
|手機、其他OS、離線與校園網路全面完成|no|本輪1440px本機Windows，未冒稱實體手機／跨平台通過|
|所有筆畫裁切／描邊／短末行屬字型問題|no|這些須分開看版面，不能由cmap結果推導|

若之後出現真缺字，先保留頁面URL、文字、codepoint、實際字型與截圖，再提不改原意的等義說法。人名、校系與正式資格不改；大量真缺字才比較相近字型。本輪沒有真缺字，不為了提出提案而改字。

## 可重跑的有限方法

在專案根目錄，使用現有本機服務、bundled Playwright、Python fontTools及已保存字型檔：

```text
node holiday-lab/reports/followup-20261024/fonts/scan.cjs http://127.0.0.1:8875/
node holiday-lab/reports/followup-20261024/fonts/source-corpus.cjs
python holiday-lab/reports/followup-20261024/fonts/coverage.py
node holiday-lab/reports/followup-20261024/fonts/verify.cjs
```

`scan-command.json`、`coverage-command.json`及`verification-command.json`記實際指令、stdout、stderr與exit code。新程式沒有重新開站或終止他人的服務；字型二進位與本機系統檔路徑保存在scan／coverage，跨機若檔案不可讀就應列未知，不能假裝原字型存在。驗證只針對本機8875凍結版，與原獨立QA的360建置檔SHA再核對；不將此結果借給後續未建置的新文字。
