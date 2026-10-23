# 新本機版獨立首頁／指南 smoke

2026-10-23。受測 `.measure-local-qingming-20261023-01`，主流程8854，完成後補驗統一入口8856。僅新增本目錄檔案；沒有改產品／QA、凍結方法、伺服器或既有證據；沒有測勞動，也沒有開啟任何節日遊戲。

結論：本機審閱 smoke **yes**，六組流程6/6；完整UI gate／母語審校／照片頭齊人工確認 **no，非本次範圍**。

| 實際驗收 | 結果 | 證據 |
|---|---|---|
| zh/en/ja ×1440/390首頁語言 | yes 6/6 | html lang、首頁節日標題實讀中文「節日番外篇」、EN「Festival Stories」、JA「季節の番外編」；15項選單存在，未啟遊戲 |
| 導覽真操作 | yes 6/6 | 真點news與faculty、必要時展開hamburger，再由選單進指南；不是直接改DOM觸發 |
| 指南15卡／步驟／詳細段落 | yes 6/6 | 每張實點展開，按來源各卡核steps與details數；各組47steps＋47詳細段落均非空。實讀標題：在校指南／Student Guide／在学生ガイド |
| FAQ | yes 6/6 | 各組30項；實點第一項開啟並驗答案文字存在，未宣稱逐一審校30答案語意 |
| 搜尋／清除／身分 | yes 6/6 | 用該語言的抵免卡實際標題搜尋，目標留存且項數縮小；不可能字串得0；清除回15；轉學生及畢業生逐卡ID與source模型對照相同，再清除回15 |
| 語言切換保route | yes 6/6 | zh→en、en→ja、ja→zh各兩尺寸真點選單語言，仍為 `#/students/guide`、15卡與正確html lang |
| 桌手機整頁水平捲動 | yes 36/36檢查點 | 首頁、faculty、指南全展開、兩身分、換語言後各量documentElement.scrollWidth ≤ innerWidth+1；不是全節點墨跡安全區驗收 |
| 13教師照片 | yes 6/6 | 各張捲動所在卡、decode；78筆實載naturalWidth>0/complete，normalized=true、同class展示容器、既有translateX設定及正方展示slot。不宣稱人工視覺頭齊通過 |
| Console／page／HTTP／請求失敗 | yes 各組0 | 原始console含location、所有response含URL/status/resourceType、page stack與request failure保留於result.json各case.raw；rawerrors.json合併0錯誤。HTTP檢查為所有>=400，不只404；不清除或分類忽略錯誤 |
| 受測來源前後SHA | yes | result.json before/after完全一致，sourceStable=true；包含build HTML/bundle/CSS/guide/faculty、相關源檔與smoke.cjs自身 |
| 8856與8854等價／開啟 | yes | bridge-8856.json：8檔兩port與磁碟SHA全等，另8856首頁／英文指南／progress三頁真開啟，三頁console error/page/http/requestfailed皆0 |

`smoke.cjs` 及 `bridge-8856.cjs` 是可重跑完整工具，所有輸出限定本目錄。重跑會覆寫本目錄同名收據；本輪未重跑，不把新結果覆蓋任何舊失敗。各case JSON與總result保存完整收據，總result為回應body SHA收集完成後的最終版本。

實際命令（cwd `C:/agywork/agd-holiday-prototypes`）：

```powershell
node holiday-lab/reports/current-preview-smoke-20261023/smoke.cjs
node holiday-lab/reports/current-preview-smoke-20261023/bridge-8856.cjs
```

兩者真 exit code 0，原實際stdout如下；六組輸出另存stdout.txt。

```text
YES zh/1440: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
YES zh/390: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
YES en/1440: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
YES en/390: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
YES ja/1440: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
YES ja/390: 5 steps; errors {"console":0,"pageerrors":0,"http":0,"requestfailed":0}
TOTAL 6/6; stable=true; pass=true
{"pass":true,"bytes":8,"pages":3,"errors":[]}
```

畫面：每語言尺寸各home／guide／guide-credit-details／faq四張，共24PNG；另8856 home／guide／progress三張，共27張，皆viewport截圖。六組24張SHA離線重算吻合；8856三張SHA在bridge收據。本輪已實看中文桌機首頁、日文手機首頁及英文桌機詳細段落圖片，這不取代使用者審閱全部畫面。

本次使用現成服務與Node Playwright，沒有新增server、安裝套件、執行Build或修改source。沒有收集完整CDP字型墨跡／完整2076 UI矩陣，沒有驗實體手機、母語語意、教師臉部像素或清明遊戲狀態；清明404原生驗收由root另交，不能以本首頁smoke替代。
