# 新年最短合法騰空：140 ms 獨立驗證

source_agent: codex。固定 08 `http://127.0.0.1:8845/holiday-lab/?game=new-year`，三語、320／1440；僅新增本資料夾的 QA／報告，沒有改產品、素材、契約、sampler 或時鐘。

實際以 DOM 滑桿、完整試播、提交完成三幕：`[360,140,360]`、`[240,600,240]`、`[500,140,300]`，第三幕選 launch。第一、三幕飛行都是目前規則允許的真正最短 140 ms，沒有改用 180 ms 或較長方案。

| 驗收 | yes／no | 原始證據 |
|---|---|---|
| 三語兩寬真操作完成並保存實際輸入 | yes | 六組 `artifact.takes[].timing` 精確相同，第三幕 launch，100 分；`runs/2026-10-23T00-05-50-129Z/report.json` |
| 不凍時鐘、不 seek、不寫入遊戲狀態 | yes | `check-01-source.cjs` 為原執行碼；只透過 DOM 輸入及點擊，原生 rAF 僅讀觀察，真實 elapsed 完整播放 |
| 九個真實鏡頭依序呈現、每段字幕對應儲存時間 | yes | 六組九鏡頭皆出現、轉換序列逐次 `+1 mod 9`；所有觀察字串含該鏡頭原始 duration，圖片已載入且頁面未 hidden |
| 140 ms 騰空實際有多個移動姿勢 | yes | 每組 shot 1／7 原生幀皆至少9；多次觀察合計 shot1 18幀、shot7 9幀。角色在短鏡有9–16個不同姿勢，非固定圖片 |
| 140 ms 輸入等於實際牆鐘精確140.000 ms | no | 真 rAF 觀察為148.9–151.2 ms，保留逐次 timestamp。這是實測結果，不把離散畫面更新誤寫成精確140 ms |
| 九鏡頭各有同鏡墨跡與真圖 | yes | 每目標由原時間重新真實播放、定向採樣；frozen sampler 54／54與 screenshot 前後 shot 一致，抽樣耗時15.0–75.6 ms、geometry0、method violations空 |
| 字型／墨跡採樣器維持凍結版本 | yes | function SHA `c247641156d929b0de7d6aa70e509510e293a29d7d6ff45aaac99ad931e0dc1a`，來源程式未改 |
| 來源穩定、Console／JS無錯 | yes | 10份served runtime與生成圖片 pre/post SHA逐筆相同；六組 console/page errors均空 |
| 54張全部逐張人工驗看 | no | 實看英1440第三幕與日320第一幕；其餘由實際同鏡截圖及墨跡幾何驗證，未冒稱逐張美術確認 |
| 整份2076必要案例、整體包或使用者美術已核准 | no | 本輪只補最短140 ms缺口，不作全站或整包通過宣告 |

第一版 QA 末尾把 `inspectReport()` 回傳的陣列誤當 `.errors`，導致六組原 stdout 都是 `Cannot read properties of undefined (reading 'length')`、exit 1。原始 runtime 操作、九鏡墨跡與54張圖均已採完，沒有重跑或延長短鏡來掩蓋。原錯誤碼保留為 `check-01-source.cjs`；`check.cjs` 已修 API 用法但未重跑整輪。只讀 `verify-recording.cjs` 對原報告的真 nodes／blockers 重新執行官方 checker，另寫 `verified.json`，原報告 SHA 留存不覆寫。

```powershell
cd C:/agywork/agd-holiday-prototypes
node holiday-lab/layout-qa/newyear-min140/check.cjs
# 本輪實際使用其修正前版本，output-01.txt：六組末尾工具錯，exit 1
node holiday-lab/layout-qa/newyear-min140/verify-recording.cjs holiday-lab/layout-qa/newyear-min140/runs/2026-10-23T00-05-50-129Z
# NATIVE 6/6; STABLE_INK 54/54; GEOMETRY 0; SOURCE_STABLE true
# exit 0，stdout保留verify-output.txt；原runtime採樣沒有重跑
```

另外觀察到日文320第一幕 caption 最後「る」單字換行，`ja-320-shot-1.jpg` 有實圖。文字完整、無安全區溢出，屬後續避免孤字的排版 P2，沒有把它錯報為 geometry 錯誤，也沒有越權改產品。

沒有 Build、push、main、刪檔、Unity 或發布動作。
