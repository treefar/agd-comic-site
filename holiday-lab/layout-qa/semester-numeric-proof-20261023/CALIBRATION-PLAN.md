# 原Range／Canvas等價校準最小計畫，尚未批准與執行

本輪只交離線方法。`native_equivalence=false`、`global_approved=false`。以下步驟要由root另行批准browser後才實作／執行。

## 第一批最小反證校準

固定08來源、原sampler、原asset-map、兩viewport（320×900、1440×1000）、三語與實際font／owner；不改產品與原證據。開始前及結束後讀原來源HTTP與font檔bytes SHA；先明確辨識font face／DPR、font size、weight、letter spacing、stroke、transform、font-feature-settings、font-kerning、variant、writing-mode及scroll。

1. 六個正常UI session（三語×兩寬），從真正按鈕開始semester，在起點用原方向callback做up/down，記正常步數0與2的`semester-position`。保留原Range／Canvas／CDP font與原sampler。這12筆是正常UI，不以長數字替寫冒充它。
2. 建獨立、明標`TECHNICAL-NUMERIC-PROBE`的診斷頁或隔離DOM副本；保留實際owner寬、font、CSS與完整來源字串，禁止畫新UI面板。以相同起點模板，在三語×兩寬×一位／十位，共12個技術context，各比較至少兩個數值不同且符合min0/even/max的DP witness。記這是至少24次技術量測，不是24個正常UI極值；不把高數值填入原遊戲state或產物。
3. 每個技術字串逐字元Range讀取位置與換行序列；同時記完整Canvas `width/actualBoundingBox*`、原sampler每行的Range、baseline與ink，CDP font。比較：同位數替換時prefix/suffix glyph-run與line-break是否相同；實際advance能否與1187/2048×fontSize縮放一致；hinted native ink是否在outline界＋**已證明**誤差內。不得任填1px容差，少數測點誤差上限也不能宣稱涵蓋未測glyph/context。

另須逐一測10個digit的原生bearings與advance槽條件；font outline在槽內不保證hinted native ink也在槽內。若pixel/hinting使字形越槽，原首末glyph公式不能直接套原生資料，必須改用已證保守逐glyph union，否則保持NO。

這批只用來反證或校準方法，無論通過與否都不會直接把數值全集或six error-longest改成YES。任何fallback、digit相關positioning、換行差異、Range/Canvas不等價、scroll或font異動均停止為NO。

## 後續完整範圍，需再審碼

- 45份原始語言／座標模板分別處理；同語不同座標不可先假設同寬。兩viewport與每個可達位數／guard仍要建立確切對映。
- 原CSS `h1,h2,p{overflow-wrap:anywhere}`，因此不能拿未換行數字段的首末glyph代替所有行。先證實每個layout分支的數字切分位置，再取`representatives.json`內對應每個連續substring的界；若要用獨立fragment envelope，應將各行極值及固定prefix/suffix合成保守整體界，不能聲稱這些不同witness的極值同時存在。
- 未換行完整classes僅是font-unit outline等價類；任一fragment獨立上下界則保證涵蓋該fragment的所有合法數字，但**兩者都尚不是原CSS逐行ink、安全區或scroll證明**。
- 如需要完整技術代表集合：Regular、min0/even的長度1包含5個完整類；長度10完整類加所有fragment extrema witness去重共147個。這些是離線技術字串，仍不是正常UI高步數軌跡。其他18 guard須取自身資料，不借用單一guard外推。
- 安全界跨過safe或任何必要假設證不成，就保持NO交root決策。不加步數上限、不縮字、不改原文案、不改sampler。
- 即使技術shaping校準成功，仍須連回正常UI可感知的代表與其他owner／hint／progress／scroll義務；不把數值單項代替整個error-longest。

## 輸出契約

未來每筆明列`normal-native`或`technical-probe`；保存template／numeric guard／witness／source/font/skin/method SHA、viewport/DPR、實際font、每行Range/Canvas、原flags及截圖。禁止把technical截圖編入正常UI原生capture清單，禁止改舊R0或原收據。
