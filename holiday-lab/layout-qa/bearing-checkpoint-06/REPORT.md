# 06 首字截切候選與錯誤路由檢查

本階段不是全遊戲通過，正式 2076 契約仍 NO。

|項目|yes/no|實際證據|
|---|---|---|
|原和平英文首字確實被裁|yes|`bearing-clip-proof/receipt.json`；真 Range 不變，暫時解除遮罩差圖回復 1 個真實字形像素；原樣式已還原|
|2px 水平內距候選消除真截切|yes|`node holiday-lab/layout-qa/controls-bearing-candidate.cjs` → `BEARING_CANDIDATE YES`；320:42 frames、1440:43 frames；geometry0、horizontal_clip0|
|按鈕三態與完整捲動|yes|每寬13顆真按鈕三態；339/339非空白字元實際 Range 可到達；外紙 border/padding 完全相同|
|正式產品已套用並通過|no|只臨時 DOM CSS；由 root 建立下一固定來源後複驗|
|原錯誤路由完全可信|no|`error-audit-checkpoint-06/original-recipes-reproduced-red.json`：126 exact matches、1 mismatch、55 unmatched；原和平 duplicate 實際打到 clipped|
|和平路由修正後語意吻合|yes|`peace-corrected-15-matches.json`：15 matches、0 mismatch、0 unmatched；三語320真實60 frames、9 replay shots|
|中秋錯誤全域最大墨跡已證|no|`longest-runs/2026-10-22T23-33-53-772Z/report.json`：1,799,658合法數值組合、54真實候選 geometry0；排序依 native layout，不能等同全域最大 ink|
|完整動畫故事取證|no|06 newyear/ja320原 front 漏15字；collector 在1/5插入按鈕測試造成取證空窗，改為完整故事觀察後再測按鈕，待實跑|

1440 raw method44 是待捲到的垂直內容，完整339/339實捲收據補證；保留原始旗標，不寫成 rawmethod0。量測器與 asset map 未修改，仍採 frozen06 receipt。

完整原始資料保留本機絕對路徑、SHA於 `raw-manifest.json`，約29 MB候選資料未納版控；4張代表WebP與摘要已納入候選提交。跨機無法直接讀全部本機原圖，此限制未解除。

動畫取證修改過程：第一次移到故事後的候選雖故事完整，但已進選單，不能算開場按鈕，該候選不合格；正式 collector 改成獨立真 opening context 並檢查 intro-skip 仍可見。舊紀錄保留，不重寫原始來源。

正式 driver 修正複驗 yes：`LAYOUT_QA_URL=http://127.0.0.1:8843 node holiday-lab/layout-qa/front-collect.cjs --games=new-year --languages=ja --widths=320 --intro-button-states=1` → `FRONT_PARTIAL 32 frames`。原故事76/76、missing[]、mask全在viewport、reduced完整可讀、geometry0、source pre/post相同。開場按鈕在獨立真opening context，intro-skip仍可見；摘要front-ja320-corrected-summary.json。僅該32frames完成，並非全矩陣通過。

中秋動態語意補證：served06 三個 TARGETS 逐筆讀取，斷言實際 cutPosition/誤差公式，三語template只允許原有3個數值插值。`node holiday-lab/layout-qa/error-source-audit.cjs --reports=<原三份raw> --out=error-audit-checkpoint-06/original-recipes-dynamic-recheck.json` → matches150 / mismatches1 / unmatched31；增加24筆中秋 exact match，原和平錯路由仍留紅、31筆舊來源不同仍不給通過。未解最大ink與全分支覆蓋。
