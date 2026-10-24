# 儀表板獨立補驗

2026-10-24，source_agent: codex。只讀 `http://127.0.0.1:8875/progress/`，沒有執行舊 smoke、任何遊戲、產品修改或 Git 操作。原網站驗收結果不覆寫。

1440／390 兩視窗共 17 個實際斷言通過；[result.json](result.json) 保存逐條 yes/no、來源前後 SHA、HTTP body SHA、請求與 PNG SHA，[command.json](command.json) 保存真正分流的 stdout／stderr、exit code 0。47 列、40 yes、7 no、使用者 0 均由資料核對；WebGL 搜尋、展開結果限制／證據、缺件 7 列、清搜尋及全部篩選恢復 47 列均實際操作。桌機深色亦確認色盤切換，3 張截圖留存。page exceptions、外部 requests 都是 0；來源三檔前後相同。

| 條件 | yes/no | 邊界 |
|---|---|---|
| 桌機／手機功能與摘要數字 | yes | 1440 9/9、390 8/8 |
| 文件本身無橫向捲動 | yes | documentWidth 不大於 viewport+1 |
| 手機表格六欄全部同屏、無內部水平捲動 | no | 通用 table-wrap 為 795px 內容／356px 視窗，保留內部水平捲動；展開的原因與路徑在手機寬度內換行 |
| 深色模式與來源穩定 | yes | 實際 emulateMedia、對照背景及 source SHA |
| 母語／使用者或全站批准 | no | 不是本項驗收範圍 |

實看 mobile-missing.png：七項缺口與 WebGL 原因、來源文字可讀；手機表格右側狀態欄需在表內橫向捲動，不能把文件無橫溢寫成所有欄位都同屏。

```text
node holiday-lab/reports/overnight-20261024/qa/dashboard/run.cjs
PASS dashboard 1440 9/9
PASS dashboard 390 8/8
{"pass":true,"contexts":2,"source_stable":true,"errors":[]}
exit code 0
stderr: ""
```

run.cjs 以 spawnSync 呼叫 check.cjs，完整分流落地，沒有重跑前一份網站六語寬度批次。
