# 第四輪可重跑驗收

在repo根目錄使用已安裝的Playwright／sharp：

```
node tools/qa/run4/independent-ui.cjs . cards
node tools/qa/run4/independent-ui.cjs . panel
node tools/qa/run4/extra-checks.cjs . roundtrip
node tools/qa/run4/extra-checks.cjs . spring
node tools/qa/run4/extra-checks.cjs . names
node tools/qa/run4/games-smoke.cjs .
```

roundtrip會暫時寫入tuning.js，無論成功失敗都在finally用原始bytes還原；不要與其他任務同時修改該檔。certs模式只在codex/faculty-punctuation個別分支執行，不適用包含後續譯文修正的整合版。names模式的基準是5bb779b，逐筆驗字串、括號及台帳。

輸出預設為work-orders/20261022/reports/run4-local，可用AGD_QA_OUT指定外部目錄。驗收沒有刪檔；不要把瀏覽器快取加入版控。測外部試玩包時可用AGD_QA_NODE_MODULES指向本repo的node_modules。
