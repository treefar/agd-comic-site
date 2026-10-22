# 階段／結果／回放採樣 checkpoint

日期：2026-10-23（UTC 原始 run ID 為 10-22）。只改量測器、固定內框映射與測試，未改產品、未 push、未碰 main、未刪除原始證據。

## 本輪可判定結果

| 項目 | yes／no | 實際證據 |
|---|---|---|
| 兩張 constitution 紙帶已看原圖並固定內框 | yes | prop1 284×99，內框 x18/y18/w249/h64；prop2 282×101，內框 x20/y20/w243/h60；`asset-safe-regions.json` 有原圖 SHA。採用實際 object-fit contain 的留白與縮放，不拿整個 stage |
| 已有 15 款可持續擴充的真 DOM 通關路由 | yes | `phase-driver.cjs` 15 IDs；沒有 import 遊戲規則、寫 ctx.complete、改遊戲 state 或 seek 時鐘。這是路由已建，不是 15 款全部已實跑 |
| constitution 中日320／日1440 已走到結果、3 shot及重試 | yes | `phase-checkpoint/summary.json` 對應來源8815；日1440有內捲動待補及嚴格安全區紅燈，不能稱版面通過 |
| 新年第三幕三種意圖及各9個真實回放 shot | yes | 8815／zh／320，launch、flight、landing三條路徑，95幀，三份 artifact 的 focus 由 driver 直接檢查；每條九個 shot 均有 sample 前後相符的 screenshot shot ID |
| 8815 最大設定字幕出框有保留 | yes | 舊 max frame：font24、duration9、x70、y85、lines1、tone low；墨跡上界702.453125，紙面安全上界703.5943827，上越1.1412577px |
| 8816 新完整草稿修正複驗 | yes | initial/error/min/max/paused 全部 geometry0。max 的 `caption-readable-draft` 完整句「每個故事，都值得被看見。」維持24px；設定明示24px、1行、9秒。固定內框未放寬，合法light/dark及3 shot仍為geometry0 |
| artifact原始JSON每字可透過內捲動抵達 | yes | 8816真實scrollTop半頁逐步、Range逐grapheme，562／562、missing0、文字前後相等；其可抵達不代表安全區完全通過 |
| artifact嚴格安全區 gate | no | 8816結果展開＋8個scroll frame仍各1錯，共9 geometry錯；pre 的實際overflow clip包含padding邊緣，寫入安全區仍是content box。保留原始ink、clipped ink、實際safe和TEXT_CLIPPED...提醒，不當成圖層互壓大範圍假紅 |
| 全15款×三語×320/1440完整矩陣 | no | 本輪先交可重跑小批；全部錯誤分支、最長字串、intro middle/end、全部控制面板捲動、各按鈕hover/pressed/disabled仍未全覆蓋。2076不是已通過數 |
| 可發布／最終來源指紋通過 | no | 所有新報告明示PARTIAL_RED；只保存各served來源前後SHA相等receipt，未冒充全契約source_fingerprints。03與04分開保存 |

## 實際命令與輸出

在 `C:/agywork/agd-holiday-prototypes` 執行：

```powershell
python holiday-lab/layout-qa/create-insets.py
# IMAGE_INSETS 8 UI PNGs; 2 constitution prop PNGs; no product image modified
node --test holiday-lab/tests/layout-sampler.test.cjs holiday-lab/tests/layout-sampler-phase.test.cjs
node holiday-lab/layout-qa/phase-summary.cjs
```

完整實際 stdout 分別留 `phase-checkpoint/verify-tests.txt`、`verify-summary.txt`。8項舊／新增回歸先通過，再新增原紅→修正草稿與三意圖／562字兩項紀錄檢查，最終項數以 verify-tests.txt 為準。既有真實抬高 sprite 負例與還原證據仍通過，未用合成矩形取代。

可重跑小批：

```powershell
$env:LAYOUT_QA_URL='http://127.0.0.1:8816'
node holiday-lab/layout-qa/phase-collect.cjs --games=constitution --languages=zh --widths=320 --scrolls=1
# PARTIAL_RED 33 frames; geometry=9
$env:LAYOUT_QA_URL='http://127.0.0.1:8815'
node holiday-lab/layout-qa/phase-collect.cjs --games=new-year --languages=zh --widths=320 --intents=launch,flight,landing
# 該次實跑：PARTIAL_RED 95 frames; geometry=3（3份展開JSON）
```

collector支援逗號參數指定15款、zh/en/ja、320/1440，但不自動宣稱整矩陣完成；無效ID直接拒絕。每幀量測的重複文字會normalize，flex字幕的暫時baseline wrapper必須驗證前後Range相等，否則fail closed。圖片先decode再採樣；短shot截圖前後ID不同會保留紅旗並重新等下一輪，不凍結回放。短回放沒有逐幀CDP字型採樣，以同來源靜態文字平台字型佐證並明列這項限制。

## 證據版本與限制

`phase-checkpoint/evidence` 保留舊max／新max、dark紙、shot1、scroll末頁與新年landing shot8等代表WebP＋完整case JSON。`summary.json` 逐檔SHA、大小、原始本機路徑、served runtime receipts與frame數可重新核對。

原始 `phase-runs` 保留本機不刪，約數十MB，透過本範圍 `.gitignore` 排除重複原始幀；未版控的原始檔不是跨機備份，另一台不能僅憑manifest讀到所有畫面。summary涵蓋五份主要run；其餘開發中run仍在本機，未混成一份最終PASS。

早期16:07樣本有未等待新shot圖片decode的unmapped紅燈；16:08早期一般文字baseline marker分割節點會造成重複採樣偏差。已加前後normalize，真瀏覽器重測文字／幾何不變。16:13兩次開發中scroll樣本把被裁切全文當可見墨跡，造成9至28項假互壓，**不當產品真錯**；最終16:14樣本改以actual clipped ink做幾何，但保留全文unclipped和完整內容提醒，仍9項嚴格safe錯，不淡化未完工作。日文1440較早的17項也須以最終clip算法與完整控制面板實際捲動複驗，不能直接指為17個產品bug。

仍有全頁畫面中、目前viewport之外的圖片paint-order待補，使用PAINT_ORDER_OFFSCREEN_PENDING保留紅燈。圖片alpha採保守AABB；pseudo元素／SVG／Canvas／video未全映射；精確glyph raster邊緣以Canvas actualBoundingBox和Range估測，平台fallback字型透過CDP實查。上述技術量測不代表學生盲測或使用者美術確認。
