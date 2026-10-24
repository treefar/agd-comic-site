# 8880新版指南獨立UI驗收

驗收對象：`http://127.0.0.1:8880/`，`.measure-guide-final-docs-20261024-01`，`app-NOWSESL2.js`。僅首頁導覽快看及學生指南。首輪`raw-r1`六組功能／呈現一致性檢查全綠：156 yes／0 no，實際exit 0。

這份報告只認8880這個凍結版。主控後續發現日文來源標題「112年改正规程」應為「112年改正規程」，已另排單字修正及新build的必要補驗；不能把本輪的字典一致性通過解讀為翻譯逐字完美或新版自動通過。原收據不修改，不重跑六組。

## 實際結果

|語言／寬度|yes|no|結果|
|---|---:|---:|---|
|繁中390|27|0|yes|
|繁中1440|25|0|yes|
|英文390|27|0|yes|
|英文1440|25|0|yes|
|日文390|27|0|yes|
|日文1440|25|0|yes|
|合計|156|0|限本輪功能／呈現一致性|

實際新資料為15卡、47大步／47段小說明、56FAQ、89來源。FAQ與來源數均從凍結資料讀取，未套用舊版數字。

|核對項目|yes/no|實際證據|
|---|---|---|
|新服務與凍結build一致|yes|前後7個入口／JS／CSS／data的HTTP回應皆200且SHA與build檔相同。|
|三語完整桌面導覽及手機選單|yes|桌面完整10連結；手機開啟、點章節後關閉。|
|指南三欄／一欄與身分索引|yes|1440為3欄、390為1欄，6個身分選項。|
|分類、轉學生、語言搜尋及重設|yes|逐組實際點擊，核對卡片集合；搜尋本語言「學分抵免」後可重設15卡。|
|15卡全部展開及數量|yes|每組15卡47步47說明56FAQ；來源資料89筆。|
|本輪10target內容|yes|6組共1194筆title／summary／大步／detail／warning／flow-note／聯絡標籤／FAQ，皆與凍結三語字典對應且可見。|
|15卡來源標題、caption與原URL|yes|6組768個卡片來源列，逐列核title／readability與原URL。|
|15卡FAQ來源|yes|6組684個FAQ來源連結，逐列核翻譯標題及原URL。|
|電話文字、tel href及承辦URL|yes|6組246筆實際連結；證照獎助副電話1712、職涯1713、實習1711契約成立。|
|來源caption無HTTP／DOM等技術收據|yes|所有實際顯示caption未命中HTTP、DOM、403、渲染等技術詞檢查。|
|UCAN說法僅限公開入口|yes|凍結文字及英譯明列公開入口顯示錯誤、登入後功能未驗；未擴寫成登入後系統全壞。|
|流程按鈕定位|yes|實點畢業流程第2步，焦點到`student-step-graduation-1`。|
|水平溢位、替代字元、console及404|yes|各組首頁／指南收合／展開文件寬未超viewport；指南無U+FFFD，console／pageerror／HTTP>=400均空。|
|遊戲只留頁底，完全未啟動|yes|入口位於招生後、頁尾前，iframe0、遊戲請求0；未點入口或測玩。|
|13教師卡及既有照片快取|yes|僅核13卡存在；原original SHA驗後本機攔截回應52次，沒有78次遠端重抓，不冒稱重新量過頭部幾何。|
|source/data及build前後穩定|yes|47個source/data、360個build檔逐份前後SHA一致，最後再核當時檔案也一致。|
|QA程序關閉|yes|finally已await `browser.close()`後才寫成功result；exec完成exit0。後續唯讀程序查詢本次check.cjs Node數量0。|
|日文單字錯誤全部已修|no|「改正规程」仍屬8880原版已知字案；由主控另分支精確改為「改正規程」後補驗。|
|所有字型cmap／實際fallback及翻譯語意全面通過|no|本輪只驗載入狀態、可見替代字元及字典對應，不重跑全站字形；日文字案亦已有待修。|

10張target：graduation、course-selection、credit-transfer、status-military、internship、overseas-internship、financial-aid、support-rights、career、certification。其餘5卡來源與FAQ來源仍全核，未進一步重查其官方政策全文。

## 實際指令輸出

```powershell
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/run.cjs http://127.0.0.1:8880/ .measure-guide-final-docs-20261024-01 raw-r1
```

stdout：

```text
PASS zh 390 27/27
PASS zh 1440 25/25
PASS en 390 27/27
PASS en 1440 25/25
PASS ja 390 27/27
PASS ja 1440 25/25
{"pass":true,"contexts":6,"green":6,"source_files":47,"build_files":360,"source_stable":true,"build_stable":true,"expectedCounts":{"cards":15,"steps":47,"faq":56,"sources":89}}
```

stderr空，exit 0。完整實際收據為`raw-r1-command.json`；固定入口`command.json`保留同一內容，非另一次執行。`result.json`同樣是`raw-r1/result.json`的原封複本。

最後只讀收據驗證：

```powershell
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/run-verify.cjs
```

stdout `yes:10,no:0`，stderr空，exit 0。`verify-command.json`及`verification.json`保存全部逐項結果。驗證完成時間`2026-10-24T02:37:46.243Z`，此時再次核對47／360全部SHA成立；之後主控獲准修新版本，不用新source回頭覆寫這份歷史成功收據。

程序查詢實際命令、stdout `0`、stderr空、exit0保存`process-closure.json`。沒有終止其他人的node、Chrome或服務；本機8880服務由主控保持運行。

## 原始證據與畫面

`raw-r1/`共90張直接WebP，全部原件SHA及RIFF/WEBP格式已核；各組JSON、HTML、所有SHA與實際檢查詳細列在result。沒有另做PNG轉檔或改寫畫面。

實際人工閱讀18張代表畫面，清單與SHA見`visual-review.json`：6張三語索引、6張手機／桌面target卡、6張FAQ。可讀出原漫畫風、手機直向流程、桌面三欄與來源文字。這是本代理目視紀錄，不代替使用者風格確認。

部分索引／卡片截圖因當時捲動位置從上一卡底部或索引中段開始，是viewport裁切，沒有宣稱單張截圖涵蓋整張長卡或整頁。英390索引圖從分類索引底部開始；欄數、字串與全部來源仍由該組實際DOM操作核對。原圖保留，不為了換圖再重跑六組。

測試使用獨立headless Chromium，未操控使用者Chrome頁。未登入校務系統、未送任何表單、未點外部來源或重新抓官方規章、未改任何產品／原照片／圖像／字型，未切git分支或發布。所有寫入限定本QA目錄；既有current-rules收據未動。

目前這個階段已收尾。下一個新build只需對受影響的日文來源標註補驗及必要不變性檢查，不重啟本輪六組大批QA。
