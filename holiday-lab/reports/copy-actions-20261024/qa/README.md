# 翻譯動作文字：獨立窄驗準備

狀態：主控提供8882新凍結候選後，已執行單次fresh raw-r1四組，44 yes／0 no、exit0，browser已關閉。完整結果見REPORT.md。8881、原QA、產品、Build與分支均不修改。以下保留原準備與方法界線，不表示需要再執行。

只驗EN／JA各390、1440，共4組；每組只展開畢業卡對應FAQ與海外實習對應步驟，新動作全文可見、舊錯譯不見。檢查U+FFFD、水平溢位、console／pageerror／404、iframe與遊戲請求；不重跑導覽、其他功能、節日或Unity。

來源基準是`guide-final-docs-20261024/qa/ja-source-r3/result.json`的8881原47source及360build清單，原證據只讀。預期只差2個flow-ui、2個生成locale，各語言2個key；canonical guide及其他43source SHA須相同。新舊bundle嘗試反向4值還原SHA，結果如實記錄。所有source／build執行前後重算，HTTP內容須對應新凍結檔。

畫面直接以Playwright WebP輸出：畢業FAQ、海外實習步驟各1張，共8張；保存目標DOM、個案JSON、完整stdout／stderr／exit及程序關閉。此為既有Node Playwright方法的縮小版，不使用新的server helper或安裝依賴。

等主控給新base／build後才可執行：

```text
node holiday-lab/reports/copy-actions-20261024/qa/run.cjs <NEW-loopback-url/> <NEW-.measure-build> raw-r1 --freeze-ready
```

命令需fresh tag；舊port（含8881）由腳本拒絕。未測不寫通過；有方法失敗留原raw及receipt，以新tag修方法，不改產品配合測試。成功後另寫獨立REPORT，不能把字典一致性當母語認證或全站批准。
