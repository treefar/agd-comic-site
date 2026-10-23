# 固定 08 文字量測缺口：階段補證

本次只補原始資料的量測方法缺口，未改產品、字體、固定安全區、frozen sampler、asset map、契約或官方 R0；沒有新增大型遊戲矩陣。全站 UI gate 仍為 **NO**，本報告不授權出新包或上線。

|驗收項目|yes／no|實際結果與限制|
|---|---|---|
|精確彙整原缺口|yes|24 個日文 artifact、30 個 preview family、2 個特定新年收尾；manifest.json 保留原 raw、文字、字型、clip、maxscroll 與固定 safe。|
|技術原生 glyph probe 與真玩家圖逐 RGBA 對照|yes|constitution ja320 的原圖、候選 padding2、恢復原圖，3/3 crop 完全相等；unclipped reference 相等，真裁切負例有差異。技術 probe 有明確標記，不冒充玩家畫面。|
|24 個日文末字各自驗證|yes|24/24，逐組同 saved 全文、font/platform font、寬度、clip、最大內捲、Range、原 raw 身分；原生完整參考逐 RGBA 相等，24/24 縮短 clip 的真負例可偵測。|
|artifact 獨立 typed ledger|yes|72/72 contexts、2799/2799 行：2775 原玩家實際捲動行收據，加 24 技術原生末字收據。只限原 72 組，不推論後續未納入遊戲。|
|preview 靜態 scroll 域|yes|30/30 原靜態域逐行可重用，原截圖 viewport、固定 safe、clip 及 scroll 保持條件均核對。|
|preview 動態完整分支|no|123 分支中 86 有同 source/lang/width/intent/實際 inputs/owner/text 的完整原 frame；37 缺原生可見證據。|
|preview 分離後補證|部分 yes|12/30 family 的靜態域與全部動態分支已各自閉合；剩 18 family 仍 NO。原 text_unchanged/domain false 全數保留，未改寫為 true。|
|兩個 EN1440 新年 ny-observation 收尾|no|launch／flight 的完整收尾仍缺，已包含在 37 分支內，不額外重複計數。|
|官方 R0 保持原始內容|yes|前後 SHA 均 cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336。|
|全 2076 契約／全 UI 通過|no|本次沒有組裝正式報告，也不清除其他未解旗標。|

## 實際指令與輸出

於 C:/agywork/agd-holiday-prototypes 執行：

```text
node holiday-lab/layout-qa/method-gap-plan-08/build-manifest.cjs
METHOD_GAPS {"artifact":24,"preview":30,"newyear":2} full_project_approved=false

node holiday-lab/layout-qa/method-gap-plan-08/artifact-native-benchmark.cjs
ARTIFACT_NATIVE_BENCHMARK YES original3_RGBA=3/3 native_unclipped_equal=true negative=true

node holiday-lab/layout-qa/method-gap-plan-08/artifact-native-all.cjs
ARTIFACT_NATIVE_TOTAL 24/24 full_project_approved=false

node holiday-lab/layout-qa/method-gap-plan-08/join-artifact-ledger.cjs
ARTIFACT_TYPED contexts=72/72 lines=2799/2799 original_R0_unchanged=true full_project_approved=false

node holiday-lab/layout-qa/method-gap-plan-08/preview-reuse-plan.cjs
PREVIEW_REUSE {"families":30,"static_domain_complete":30,"separated_complete":12,"dynamic_branches":123,"dynamic_branches_with_existing_full_frames":86,"two_specific_newyear_still_NO":2} original_false_preserved=true full_project_approved=false
```

上述成功命令 exit 0。首輪 all-context 測量曾 exit 1、0/24，原因為 CDP CSS agent 尚未 enable；保留 artifact-native-all-r1.cjs 與 artifact-native-all/report.json。R2 僅修技術 driver 的 DOM.enable／CSS.enable，未修改產品。preview-reuse-before-viewport.* 是保留的先前版本；最終依 preview-reuse.json，包含實際截圖 viewport 與來源 focus 對映檢查。

## 方法與證據界線

原生 probe 的紙面使用既有生成素材和固定 08 CSS，文字由瀏覽器真實 DOM 渲染；未程序繪製介面。原 clip 依既有紙框、border18、padding16、原 pre height230 與真實 maxscroll 取得，不按字形調整。技術 probe 的最後字形 Range 與原始量測座標逐值一致，實際平台字型與 glyphCount 也核對；fallback 本身不是缺字。

RGBA 對照是原生 clipped 與同位置 unclipped 參考的全部色彩／透明度位元組，不用灰階閾值推定；24 組各自有真的裁切負例。參考圖與技術圖不等於玩家新試玩或使用者美術確認。各原圖、crop、raw、method SHA 保存在 JSON。

preview 只重用既有原 frame，來源 handler 與實際輸入逐組查核；靜態 line 與動態完整 owner 分開證明。保留原始 whole-domain false，不以 source 可達性取代畫面實測。最小後續補採清單見 NEXT-STEPS.md、minimum-next-cases.json；尚未執行的 37 分支維持 NO。

可離線重跑 join-artifact-ledger.cjs、preview-reuse-plan.cjs、checkpoint.cjs。前兩者會重核原圖／來源收據並更新各自技術報告；不要任意重建 manifest 後混用舊 native proof。原始玩家圖及 raw 仍依其既有保存位置；本資料夾沒有複製整批歷史原圖。
