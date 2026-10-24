# 可攜解析補核

2026-10-24T03:24:08.206Z

11 yes／1 no，實際隔離回歸 exit 0，stderr ""。既有54項報告不覆寫，其SHA仍 64c2d44b32b6e842424bac8c10d97aa96cc338e4a62954d2cf5541678061eb4a。

| 檢查 | yes／no |
|---|---|
| baseline47and360_unchanged_before | yes |
| all16_vendor_files_equal_actual_installed | yes |
| vendor_MIT_license_preserved | yes |
| extractor_delta_only_paths_dependency_and_fresh_output_tag | no |
| both_real_fixtures_exact_copy | yes |
| fresh_regression_exit0 | yes |
| fresh_real_DOC_regression_pass | yes |
| fresh_all_story_hashes_equal_frozen_r2 | yes |
| actual_load_trace_no_node_modules | yes |
| isolated_sandbox_has_no_node_modules | yes |
| 47source360build_stable_after | yes |
| worker_originals_vendor_prior_review_stable | yes |

vendor共16檔，逐檔與已核安裝原碼／MIT LICENSE相同。worker extract-r2僅第2行（輸出tag及載入vendor）、第10行（原件相對路徑）改動；反向還原後與先前實讀原碼完全一致，CP與清理邏輯不變。

在本驗收目錄建立無node_modules的鏡像，逐byte複製兩真DOC與當前腳本／vendor，以原樣regression.cjs執行fresh independent-r1。另由預載唯讀Module._load追蹤驗證兩個子程序真正載入vendor，沒有任何node_modules或外部依賴；此結論限binary DOC直接Ole入口，不宣稱package主入口或DOCX不需其宣告套件。兩子程序與本驗收同步執行均已結束，沒有背景程序。

原件全檔SHA、parsed-r2所有檔、當前worker腳本／vendor與先前parser-review.md/json收據，本補核前後未變；47source與360build依原快照核SHA也未變。未開網站、未啟Word、未網路、未修改原件或worker。

實際命令、env、完整stdout/stderr/exit見portability-regression-command.json；逐條detail、兩原件SHA、全部模組載入路徑見portability-review.json及portable-loads-*.json；前後收據見portability-before.json/portability-after.json。

本補核完成，停止。
