# 固定08有限拒絕全文第三批範圍

只新增本目錄；產品、sampler、map、contract、official R0與既有報告唯讀。不重啟或覆寫長矩陣、不push/main/刪檔/Unity。

固定服務：`http://127.0.0.1:8845/holiday-lab/`；三語zh/en/ja，各320與1440。

原始證據清單：

|遊戲／module|原始phase run|讀源初步有限拒絕key|
|---|---|---|
|dragon-boat／games/dragon-boat.mjs|2026-10-23T00-15-12-436Z|order、face、coverage、crease|
|teachers／games/teachers.mjs|2026-10-23T00-30-54-758Z|action、line、rushed、slow|
|national-day／games/national-day.mjs|2026-10-23T00-38-13-975Z|order、blocked、camera、coast、ridge|
|exhibition／games/exhibition.mjs|2026-10-23T00-45-10-222Z|walkway、info、spacing|

各run均在 `holiday-lab/layout-qa/phase-runs/<run>/report.json`。先核served byte SHA與raw source receipts，對AST逐筆核固定全文／handler分支／guard；不從樣本數或字數推導語義完整。

主拒絕全文均由ctx.hint呈現。另逐項檢查fold-status、teachers-dialogue／preview-status、island-readout、exhibition-status，分辨是否複製拒絕全文或不同性質的數值／預覽。national-day readout含隨數字改變的視線狀態；此動態全文不能因本批固定hint覆蓋就宣告全域最大墨跡已證。

有限全集每個候選都要有真DOM全文、原紙框safe、unclipped及獨立inspectReport；有內捲則另核真scroll聯集。僅有明確缺口才補定向case。寬／高／面積代表分開以墨跡量測取，不用字數。預期4款×3語×2寬＝24 canonical；不能迎合舊index固定12的假設。
