# 國慶39 recipes／312 owner frames：切換工單前保全

2026-10-23。主控要求優先處理勞動舊 full 的獨立續接；本工具暫存此處，**未 ready、未 freeze、未批准、未啟動 browser/native**。

已落地：`calibration.test.cjs`（初次缺模組紅燈，stdout `red-output.txt`）、`util.cjs`、`plan.cjs`、`binding.cjs`、`guard.cjs`、`store.cjs`。每份均已完成單次原子 patch，沒有背景程序。

固定範圍由主控同意為39正常UI state recipes／312逐owner frames。每recipe八個動態owner正常捲讀，全部frame需完整原sample/nodes/blockers/flags、全viewport PNG、實際for-selector owner mapping、原DOM/input/recipe、stage/image/target clip祖先與hit evidence。不能將312張圖稱39張全UI。

尚未寫：`native.cjs`、`calibrate.cjs`、完整fixture及故障整合測試、draft freeze與REPORT。因此目前測試仍缺模組，**不得宣稱測試通過／工具完成**。`calibration.test.cjs` 的 `g.testScene()` 尚待改為測試檔本地fixture，不應在正式guard提供synthetic helper。

已寫guard/store仍待逐行審核：guard需補全target mapping/scene image來源逐筆bind、字型與scroll/hit公式的獨立驗證；store目前按固定frame順序保存原case/sample/PNG與immutableattempt/inventory/hashchain，正常domain NO與原globalfalse分開，完整性／capture錯誤才fatal。這個diagnostic NO繼續固定有界計畫的政策尚須主控審碼接受，不能當全域有效性credit。

`binding.cjs --prepare` 尚未執行；尚無plan.json/freeze-draft.json/approval/run。來源與runtime依賴只在未來prepare/read-only check時讀取，不會開browser。其body/font beforeafter的live verification亦尚未實跑。

回來第一步：重讀主控最新指示與本檔，先補純fixture讓既有測試進入可判定的紅／綠，再完成normal-UI native與CLI；準備完成交主控審碼，禁止自行採集。不要修改產品、coverage、舊sampler/map/contract、原證據或其他scope。
