# 清明v3原生工具準備範圍

scope固定 `qingming-native-v3-favicon-scoped-pilot-v1`，僅新目錄、新方法freeze、新root-v3-* run。原v2所有方法、runtime、inputs、freeze、失敗run不改；root-pilot-01仍failed，不能拿後來的fresh-navigation診斷回填缺少的location或source_after。

保留原6context（zh/en/ja ×320×900／1440×1000）、36份完整sample/PNG、1278 direct range與2520 stepper觀察、1392後續normalUI配置。沿用六個逐函式SHA相同的原target/PNG/calibration/DOM mapping/輸入/來源檢查helper；full仍不支援。

每個session保留：

- 原console_errors、http_errors、page_errors，絕不清空。
- 每則Console的type、原text、完整原location與收取時間。
- CDP Network.requestWillBeSent、responseReceived、loadingFinished、loadingFailed完整raw事件及requestId、URL、resourceType、status等投影欄位。raw與投影必須相符。
- pageerror原message、name、stack、收取時間。
- 每個case的diagnostics_checkpoint包含各raw陣列prefix長度與SHA，納入原case/checkpoint鏈。既有nodes/blockers/sample flags、DOM/font receipts、PNG真解碼、source/font before-after與事件/校準鏈全部保留。

只有精確符合實際fresh-navigation收據的favicon URL `http://127.0.0.1:8845/favicon.ico`、HTTP404、resourceType Other、同requestId request/response、相同Console location與原404文字，才可分列non-target診斷。規則來源完整留於favicon-diagnostic-source.json、diagnostic-contract.json。沒有location、response或raw CDP等欄位時，不推測其為favicon。

任何遊戲資源404、其他URL／status／type、未知console/page error或Network loadingFailed都stop。每次真UI action記錄後及每份case前後重新查核；若捕獲期間才出現錯誤，已落地的原case/sample/PNG與flags仍保留，阻斷後續工作。context關閉後再重算診斷，防止晚到事件被丟掉。favicon可分類時原console/http旗標仍保留，global_method_clear/full_project_approved永為false。

不route mock、不清Console、不新增favicon、不改.measure08或server。這份工具不包含發布或canonical promote。

verify-native-run.cjs僅唯讀，逐張重算36份完整PNG、nodes/blockers/flags、targetchecks、來源字型前後、exact scope、session原診斷分類、raw prefix與hash chain。failure.json、舊scope、少context／PNG／校準、任何未知錯誤都拒絕。verify-prepared.cjs僅核離線準備、原v2仍未改、原failed仍無法轉pass；不是原生run驗證。

root核准前不啟動。核准需approved=true、reviewed_by=root、新scope、mode=pilot、maximum_contexts=6、maximum_cases=36、fresh root-v3-*名稱及當前native-tools.bindings()精確清單。範本approved=false，不能直接執行。主控核准後若需啟動，使用 `node native-run.cjs --run <新核准檔>`；本輪沒有執行該命令。
