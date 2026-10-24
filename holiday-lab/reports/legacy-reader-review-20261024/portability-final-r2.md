# 可攜補核最終更正 r2

2026-10-24T03:26:28.901Z

最終判定：原全文驗收54 yes／0 no維持；可攜12個獨立條件均有證據；本次只修比對方法的7項確認為7 yes／0 no。此檔與 portability-final-r2.json 是補核最終結果，先前兩份方法失敗收據不刪除、不覆寫或冒充通過。

第一次 portability-review.json 為11 yes／1 no：錯把較晚保存的 local-source-read.json 當舊腳本文字，兩者其實同版。第一次更正 portability-delta-correction.json 為6 yes／1 no：又依更早閱讀印象多還原第2行。兩者唯一失敗都是驗收方法的版本基準錯誤，沒有解析失敗；其隔離回歸與其他11項通過仍保留原始實證。

本次以最初 evidence-before.json 的已凍結舊腳本SHA為唯一基準，將當前 extract-r2 的第10行相對原件路徑反向還原為原絕對路徑，得到 41a4522dfeca79b31e010a6ac2ace17b63326039cd0285f366ee315ff1538de0，逐byte精確等於舊SHA 41a4522dfeca79b31e010a6ac2ace17b63326039cd0285f366ee315ff1538de0。故54項查驗當時已是vendor／fresh tag header，這個凍結點之後只有第10行原件路徑差異。不能把再更早看過的runtime header當成當時的凍結檔。反向稿只存本驗收目錄，未執行。

| 檢查 | yes／no |
|---|---|
| two_failed_method_receipts_retained | yes |
| true_baseline_exact_SHA_single_path_delta | yes |
| other11_portability_conditions_still_proven | yes |
| original_DOC_whole_file_SHA_unchanged | yes |
| 47source_360build_match_old_frozen_snapshot | yes |
| worker_vendor_parsed_r2_and_prior_report_stable | yes |
| 54check_report_exactly_preserved | yes |

可攜實證沿用本輪真實fresh隔離回歸：vendor16檔逐件同已核安裝1.0.4、保留MIT LICENSE；無node_modules鏡像中執行未改的 regression.cjs，兩真DOC的全部API story SHA與parsed-r2同；Module._load追蹤兩個實際子程序無node_modules，直接載入vendor Ole。子程序stdout／stderr／exit均在 portability-regression-command.json（exit0、stderr空）。這限於binary DOC直接Ole入口，不聲稱npm通用主入口或DOCX無外部依賴。

兩原DOC全檔SHA、47source／360build、worker／vendor／parsed-r2與最初54項報告，最後再核仍不變。原報告SHA為64c2d44b32b6e842424bac8c10d97aa96cc338e4a62954d2cf5541678061eb4a。本次沒有重跑解析或網站，只有同步Node檔案核對。全部本任務Node程序已取得exit並終止，未啟背景工作。

本最終更正實際命令stdout／stderr／exit見 portability-final-command.json。逐SHA與精確單行before/after見 portability-final-r2.json。此前 portability-final.md 是失敗方法的中間報告，不能列為最終通過來源。

所有限制沿用原報告：未證表格視覺版面、Data／物件、完整Word格式語意及115學年度適用。沒有未覆蓋的已宣告文字story。本項完成，停止。
