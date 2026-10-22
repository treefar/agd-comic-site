# 四向九宮格與原生基線量測 checkpoint

這是更新文字安全區規則下的新增驗證。未宣稱全 2076 組完成，也未將舊來源重新標成 06。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 原生成 normal／hover／pressed／disabled 逐張綁 SHA，四邊切線由既有 paper_rect 推得 | yes | `asset-safe-regions.json`；normal `[34,31,35,31]`、hover `[34,31,36,31]`、pressed `[34,31,35,31]`、disabled `[34,31,36,31]` |
| panel 原 48 slice／18px border 不變 | yes | 設定與實際瀏覽器回歸同驗 |
| 實際 computed slice、四邊 border、fill、stretch、width=1、outset=0、當次 HTTP 圖檔 SHA 均核對 | yes | `evidence.nine_slice_asset_receipts` 與每個 `safe_sources`；未知或不符為方法紅燈 |
| 真生成按鈕原台詞至少三行，四態皆在既定內框 | yes | `node --test holiday-lab/tests/layout-sampler-nine-slice.test.cjs`，3/3；原字、原圖，僅測試用固定 160px 承載寬 |
| 錯 slice、錯 SHA、真文字移出內框會被拒絕 | yes | 同檔回歸。未放寬 safe |
| 過窄 ± 的零寬 baseline marker 不得落到新行冒充原字基線 | yes | 保留原 Range、插入前後比對；候選位置不在原行或推動原文字即拒絕。單一 ASCII／U+2212 極窄字另以同字同字型的隱藏無框原生 DOM 校準，寬高及原 Range 須相符；做不到仍 NO |
| 原 05 窄 ± 真水平出框仍為紅 | yes | 同檔回歸；`baseline-probe/receipt.json` 保留原末端 marker 落到下一行的數值 |
| 原 sprite 移到文字上可攔截，復原後清除 | yes | 固定版全 19 測試包含原真圖層負例 |
| root 舊全測試紅已保留 | yes | `holiday-lab/reports/node-tests-20261023-slice06.txt` 原結果 180 tests／179 pass／1 fail；不能被本檔取代 |
| 固定版重新執行本責任範圍測試 | yes | `followup-checkpoint-07/frozen19-test-output.txt`：19 tests／19 pass／0 fail；雜湊見 `sampler-freeze-06.json` |
| 06 關鍵按鈕初批 | yes | `button-runs/2026-10-22T23-21-40-602Z/report.json`，42 態 geometry 0；來源為 8843，非舊 05 |
| 全 15 款／三語／兩寬／所有錯誤／最長動態值／完整 intro 與每個按鈕 | no | 新 06 phase 及 front 主矩陣已啟動，見下方；錯誤配方語意和最長值仍逐條審查，不以已知通關數字冒充盲測 |

## 真正執行命令

```text
node --test holiday-lab/tests/layout-sampler.test.cjs holiday-lab/tests/layout-sampler-phase.test.cjs holiday-lab/tests/layout-sampler-front.test.cjs holiday-lab/tests/layout-sampler-nine-slice.test.cjs
tests 19 / pass 19 / fail 0

LAYOUT_QA_URL=http://127.0.0.1:8843
node holiday-lab/layout-qa/button-diagnostics.cjs
42 real button states / geometry 0

node holiday-lab/layout-qa/phase-matrix.cjs --jobs=2 --all-errors=1 --button-states=1 --canonical=1
MATRIX_RUN .../matrix-runs/2026-10-22T23-25-03-760Z

node holiday-lab/layout-qa/front-matrix.cjs --jobs=2 --archive=1
FRONT_MATRIX .../front-matrix-runs/2026-10-22T23-25-14-943Z
```

命令列中的環境變數需依使用的 shell 設定；兩個矩陣目前進行中，沒有最終 PASS 輸出。正常 intro 觀察真正經過的時間，不 seek、不凍結；跑馬燈另確認原字串每個非空白字元實際進入遮罩，並先真正捲頁使遮罩完整位於視窗內。舊 scrollIntoView 四捨五入使遮罩下緣差 0.297px 的完整視窗證明保持 NO，新增明確捲入 8px 是定位修正，並未改素材 safe。

## 限制

- 本機原始 `*-runs` 沒有整份納版控，代表圖與摘要另存；不能宣稱已跨機備份全部原始證據。
- 既有回歸包含固定歷史 HTTP server 的真負例；移到另一台機器時，需先提供對應凍結測量版並啟動伺服器，不能把連不到來源當成功。
- Canvas 只做文字技術量測；沒有畫 UI 或新美術。透明圖 AABB 是保守遮擋檢查；不支援的旋轉／濾鏡與無法核定基線仍留方法紅燈。
