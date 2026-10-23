# 固定08版面驗證快照

實際 index 輸出（exit0）：

```text
COVERAGE required=2076 covered=1620 missing=456 geometryErrors=0; PARTIAL_RED
```

- yes：原兩批12+12與新第三批24 context的來源/raw/原圖/finite guards全重驗；42 eligible，national6只列supplemental_only，完整error-longest六項仍missing。
- yes：新精確context與dynamic-secondary fail-closed回歸5 tests／5 pass／0 fail；node --check coverage-index.cjs exit0。
- no：456 required cases仍未取得完成列／完整scope，原scroll、paint、animation等方法缺口未被這個coverage計數消除。
- no：不是正式UI gate pass；官方R0 report未更動，未出包。
- no：此為固定08/8845實測快照；10/11的單JA字串delta與補證由root獨立連結，未冒充本raw來源。

長程序真存活/PID/CPU/log時間見 live-process-1620.json；沒有重啟或修改active collector。

完整重跑參數見本commit的static-context-support/REPORT.md。