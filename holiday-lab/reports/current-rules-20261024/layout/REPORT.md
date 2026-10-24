# 8876 指南旋轉標題：16筆孤尾候選補驗

source_agent: codex；2026-10-24；本機 codex/short-lines24 工作項。產品、字體、原畫、遊戲與8876建置均未變更。

先前逐字 Range 以螢幕 top 座標分行，旋轉的同一行文字每個字 top 都不同，因此把「辦理資訊」「常見問題」「手続き案内」「よくある質問」各字誤分成不同列。本次只核對原始紀錄的16筆候選：中日文、390與1440、指南收合與展開、各兩個h2。不擴大成全站內文或跨裝置通過。

改用涵蓋整個原始文字節點的 Range.getClientRects()；這些h2各只有一個文字節點，所以一個片段可直接支持該段沒有自動折成第二行。先用獨立校準頁確認：旋轉單行回1片段、真正兩行回2片段、旋轉兩行仍回2片段。網站實測16筆皆1片段，保留16張原樣WebP。主控另目視手機「辦理資訊」與「よくある質問」兩張，均為完整單行。沒有為了消除誤報而縮字、移除旋轉或修改標題。

|驗收|yes/no|實際證據／邊界|
|---|---|---|
|單行與多行校準能辨識|yes|result-r2.json calibration 3/3|
|原16候選全部重新定位並量測|yes|observations 16/16；原文相符、單一節點、單片段|
|這16筆確實出現一字落下一行|no|不是產品孤尾；是舊逐字top分組誤判|
|16來源及360建置前後SHA相同|yes|result-r2.json before/after；並對前輪有效收據|
|有開遊戲或改產品以配合測試|no|僅指南路由；iframe數0；無產品寫入|
|全站內文、所有OS、實體手機均驗完|no|本項未涵蓋|

實際命令（cwd C:/agywork/agd-holiday-prototypes）：

```text
node holiday-lab/reports/current-rules-20261024/run.cjs layout-command-r2 holiday-lab/reports/current-rules-20261024/layout/check-lines.cjs
{"pass":true,"observations":16,"calibrations":3,"source_build_stable":true}
exit code 0；stderr空
```

完整stdout與stderr在上一層layout-command-r2.json。首次校準把44px誤當會換行，但實測ABCD只有40px，所以先擋下未測產品；原result.json、layout-command.json及check-lines.cjs.v1.txt保留。改成25px後校準如預期，才進網站量測；此為測試設定修正，不是產品bug。
