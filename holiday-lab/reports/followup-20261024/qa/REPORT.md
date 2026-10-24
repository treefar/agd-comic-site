# 8876 新版網站獨立驗收

2026-10-24。本代理沒有修改本輪產品，僅在本 QA 目錄執行獨立驗收。固定網站為 `http://127.0.0.1:8876/`、`.measure-followup-20261024-01`，360 檔、`app-3A2EBGL2.js`。未重開 server19888，未進遊戲、未啟Unity、未生圖、未切分支、未推送／發布／刪檔或執行C節。

## 主驗收

有效原始資料 `main-r2/result.json`，固定入口副本 `result.json`；實際命令 `command.json`、exit code 0。

|情境|yes／no|
|---|---|
|中文390|25 yes／0 no|
|中文1440|23 yes／0 no|
|英文390|26 yes／0 no|
|英文1440|24 yes／0 no|
|日文390|26 yes／0 no|
|日文1440|24 yes／0 no|

合計6／6組、148 yes／0 no。包含八章節與兩語言導覽、手機展開／自動收合、實際語言連結、About定位在固定標題列下、頁尾連結、13教師頭高與眼線投影、78張照片HTTP原照SHA、15指南卡／三欄與手機單欄／身分篩選、47步小說明、34 FAQ、招生修正可見值，以及頁底入口位在招生 `#join` 後、頁尾前。沒有開啟遊戲iframe。主16來源與360建置檔前後SHA完全相同；HTTP頁面與程式引用綁定固定建置。

`document.fonts.status`只作載入狀態檢查，不代表新文字cmap或全站零缺字。完整新值字型差異由主控另行核對，不能把上一輪8875字型證據當8876全部通過。

原始幾何診斷另有16筆孤尾候選，全部集中在中日指南兩個旋轉章節h2，於兩寬及收合／展開重複。Range依每字top分組，將「辦理資訊／常見問題／手続き案内／よくある質問」各字列為不同一行；這疑似旋轉造成的方法假陽性，未算入主斷言，保留原值、不宣稱孤尾為0或已證實產品缺陷。各已量測狀態bounds為0；全部短末行的最終目視仍不在本次通過宣告內。

## 新增目標有限補驗

有效原始資料 `new-targets-r2/result.json`，固定入口副本 `new-targets/result.json`；命令 `new-targets-command.json`、exit code 0。三語390／1440共6組、64 yes／0 no。

- 三語作品詳頁均顯示 `WIN · 2021`、沒有 `WIN · 2022`，保留小颯署名。
- 請假聯絡電話與FAQ均為2126；FAQ不再顯示舊2114。歷史來源備註不在此禁止範圍內，沒有抹去來源歧異。
- 心理諮商2127與動遊系特殊教育支持2149分列兩個不同聯絡單位與電話連結。
- 英文兩寬均實際顯示 `Admissions and Selection Division`、`Center for General Education`。
- 15題／34 FAQ、無遊戲iframe、無頁面例外或HTTP 4xx／5xx；新目標10來源及360建置檔前後SHA相同，HTTP before／after皆綁定固定建置。

這是網站操作與指定新值驗收，未重新判定校規適用、所有外文母語品質、全部處室正式日文名或全站所有詳頁。

## 保留失敗與工具補正

1. 初次準備把多層JavaScript塞在PowerShell inline字串，解析失敗，尚未開瀏覽器。改存 `prepare.cjs`／`run.cjs` 執行，`prepare-failure.json` 保留原因，沒有改產品。
2. 首輪主測額外斷言誤抓不存在的 `#admission`，實際招生section是 `#join`。`main/result.json` 六組只有該位置斷言no，其他項目yes；`check-v1.cjs.txt`、`command-v1.json`留底。修正測試定位後重新完成主六組，沒有為測試改產品DOM。
3. 首輪新目標等待作品頁不存在的h1，實際 `DetailHeader` 使用 `.chapter-header .title`。六組各只記工具逾時，沒有假稱產品失敗。原方法與原收據保存為 `new-targets-v1.cjs.txt`、`new-targets/result-v1.json`、`new-targets-command-v1.json`；讀實際pages.jsx後改等待真正標題與WIN文字，僅重跑新目標六組。

## 畫面與圖片載入診斷

主測36張、目標22張有效PNG完整保留，另存無損WebP供審閱。英文390作品最初截圖是在lazy插圖出現前拍攝；隨後以相同網址390／1440兩狀態獨立診斷，等待500ms可見圖像已完成載入（natural 2535×1265，顯示366×182.625及817.328×407.844），沒有證成永久圖片失效、沒有改產品。原早拍圖及後讀圖均保留；代表作品圖宜看 `work-image-diagnostic/en-390.webp`。

`visual-read.json`只記實際抽看圖片與觀察，不宣稱使用者美術確認。`image-manifest.json`記60份WebP的原PNG／新格式SHA、尺寸、逐像素無損一致及原檔留存，未重畫素材。

## 可重核

```text
node holiday-lab/reports/followup-20261024/qa/verify.cjs
```

其實際stdout／stderr／exit code另存 `verification-command.json`。重跑網站量測應使用新的輸出tag與相同固定版本，不覆寫本輪原始收據。已核情境之外的完整全站、實體手機、跨OS、離線、遊戲與WebGL皆不在本驗收範圍；不將212條有限斷言升格為全專案發布批准。
