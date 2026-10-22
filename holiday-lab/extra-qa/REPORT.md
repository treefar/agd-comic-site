# 追加五款：獨立 DOM 試玩驗證

2026-10-22；唯讀固定預覽 http://127.0.0.1:8804/ （.review-replay-01）。只寫 `holiday-lab/extra-qa/*`，未改遊戲或renderer、未push／main／刪檔／停伺服器。

先讀五份原開發報告與真實runner／控制DOM；來源雜湊在 report-sources.json。全部以實際按鈕、滑桿、RAF、結果DOM操作，不匯入遊戲規則、不直接呼叫complete、不加速遊戲時鐘。手機390按鈕使用touchscreen.tap；滑桿使用原生DOM輸入事件。已知解答回歸不等同學生盲測，通關秒數不能推論實際學生需時或30–90秒體驗。

|遊戲|語言／寬|錯誤→修正→完成|三段回放→重試|Console／網路／解碼圖|已知解操作秒數|證據|
|---|---|---|---|---|---:|---|
|peace-memory|zh／1440|yes|yes|yes|4.35|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/peace-memory-zh-1440-replay.png)|
|peace-memory|zh／390|yes|yes|yes|4.12|[結果](runs/2026-10-22T14-57-36-853Z/results.json)、[畫面](runs/2026-10-22T14-57-36-853Z/peace-memory-zh-390-replay.png)|
|qingming|zh／1440|yes|yes|yes|21.45|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/qingming-zh-1440-replay.png)|
|qingming|zh／390|yes|yes|yes|21.2|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/qingming-zh-390-replay.png)|
|labor|zh／1440|yes|yes|yes|5.17|[結果](runs/2026-10-22T14-57-26-108Z/results.json)、[畫面](runs/2026-10-22T14-57-26-108Z/labor-zh-1440-replay.png)|
|labor|zh／390|yes|yes|yes|5.08|[結果](runs/2026-10-22T14-57-36-853Z/results.json)、[畫面](runs/2026-10-22T14-57-36-853Z/labor-zh-390-replay.png)|
|retrocession|zh／1440|yes|yes|yes|0.58|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/retrocession-zh-1440-replay.png)|
|retrocession|zh／390|yes|yes|yes|0.25|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/retrocession-zh-390-replay.png)|
|constitution|zh／1440|yes|yes|yes|19|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/constitution-zh-1440-replay.png)|
|constitution|zh／390|yes|yes|yes|18.74|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/constitution-zh-390-replay.png)|
|constitution|ja／390|yes|yes|yes|18.71|[結果](runs/2026-10-22T14-54-36-187Z/results.json)、[畫面](runs/2026-10-22T14-54-36-187Z/constitution-ja-390-replay.png)|

|驗收|yes／no|證據|
|---|---|---|
|5款中文桌面與390、代表性日文390共11組|yes|11/11有完整通過紀錄|
|所有採用結果為同一份served runtime|yes|每輪runner/model/catalog/CSS/5遊戲SHA前後與各輪一致|
|真實錯誤被阻擋、修正後保存實際輸入|yes|heard順序、path與retry、6工作排程、3對位、3字幕設定均查結果artifact|
|回放不是只看完成分數|yes|3個不同data-shot、caption、每段解碼圖片；qingming同shot內位置改變；constitution三段有實際字幕DOM|
|圖像可讀性／美術已由使用者確認|no|本輪工具擷取與代理檢視不代替使用者確認|
|學生盲測／樂趣與難度完成驗證|no|本輪為已知解答回歸|
|全部15款／全部語言／全部裝置都驗證|no|本輪只追加5款與明列11組|

首輪失敗與更正：原檢查僅在networkidle後立即讀naturalWidth，在labor兩種寬度與peace-memory390遇到新shot圖片尚在解碼的瞬間，錯判為破圖。原紀錄保留於首輪results.json（HTTP/console/request皆無錯），沒有以刪除失敗改寫歷史。驗證器已改成等待當前圖片complete且naturalWidth>0，最多5秒；只重跑這3組並核對served SHA。若等待後仍失敗會保留complete與naturalWidth，不把暫時載入中稱為缺檔。產品沒有因這3筆變更。

labor初始進度實際是1/6（首件有效工作）而非0/3；重試比對各款原始進度，不套用錯誤假設。qingming先以合法但會失敗的線長150／張力1真實飛行到失敗，再用retry調整通關；完成artifact保留失敗路徑。constitution需每格真正等6秒預覽結束，才收下。

實際指令（輸出原文見command-output.txt、retest-desktop-output.txt、retest-mobile-output.txt）：

```powershell
$env:EXTRA_QA_URL='http://127.0.0.1:8804'
node holiday-lab/extra-qa/playthrough.cjs
# 首輪image等待競態修正後，僅重測3組；歷史保留
$env:EXTRA_QA_GAMES='labor'
node holiday-lab/extra-qa/playthrough.cjs
$env:EXTRA_QA_GAMES='peace-memory,labor'
$env:EXTRA_QA_WIDTH='390'
node holiday-lab/extra-qa/playthrough.cjs
node holiday-lab/extra-qa/build-report.cjs
node --check holiday-lab/extra-qa/playthrough.cjs
git diff --check -- holiday-lab/extra-qa
```

彙整實際輸出：

```text
MATRIX 11/11 YES
SAME_SERVED_SOURCES YES
```
