# 春節新版日文字幕：原生回放補證

source_agent: codex；2026-10-23。固定 `.measure-integrated-10`／8847，未覆寫舊量測或 8800 審閱版。11 的 283 遊戲檔與 10 逐 byte 相同，另見 `translation-review/guide-terms11-integration.json`。

本次日文第一幕短字幕為「軽く跳ぶ」，其餘規則／時間／角色素材都保持。原長句縮句另有獨立分支排印證據；本報告補上不暫停動畫的 140ms 真播放收據。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 日文 320／1440 皆以真輸入完成作品並觀察九鏡原生播放 | yes | 第一批 report.json 的實際 rAF observer、保存 timing 與 moving sprite frame |
| 兩寬九鏡的畫面、取樣起迄與前後 shot 均一致 | yes | 原16＋補2，共18；aggregate.json 列每張來源與 SHA |
| 固定 sampler 及原始安全框幾何檢查 | yes | verify-aggregate.cjs 重跑 inspectReport，18 個案例各0 geometry errors |
| 沒有因140ms短鏡而暫停、改時鐘或延長原輸入 | yes | 採集器沿用真播放；每次僅重播，原始 timing 不改 |
| 原跨鏡失敗被保留 | yes | 第一批1440的shot3／7 after跨到下一鏡，原截圖／raw均保留 |
| 完整2076案例、任意字型全域上界及使用者美術確認皆完成 | no | 本報告只證新版字幕有限回放，不取代正式UI gate |

實際命令：

```text
node holiday-lab/layout-qa/newyear-ja-caption-current/check.cjs
ja/320 stable ink/screenshots 9/9; geometry 0
ja/1440 stable ink/screenshots 7/9; geometry 0
```

第一批 `runs/2026-10-23T00-45-20-992Z`。命令 exit0 只代表原生作品回放完成，不代表每張截圖穩定；沒有把兩張不穩定畫面計入通過。

```text
node holiday-lab/layout-qa/newyear-ja-caption-current/prepare-targeted.cjs
node holiday-lab/layout-qa/newyear-ja-caption-current/targeted.cjs
TARGETED 1440 Japanese shots 3 and 7; up to 8 fresh native attempts
ja/1440 ... stable ink/screenshots 2/9; geometry 0
```

第二批 `runs/2026-10-23T01-03-43-409Z`，只採兩個目標，第一個原生重播嘗試即各取得穩定畫面。原採集器輸出字串沿用固定分母9，因此該行的2/9並非兩目標失敗7張；以 raw 的兩個 target 和後續精確彙整為準。

```text
node holiday-lab/layout-qa/newyear-ja-caption-current/verify-aggregate.cjs
pass: true
stable_captures: 18
widths: [320,1440]
targeted_retry: [3,7]
original_unstable_retained: 2
geometry_errors: 0
source_stable: true
full_project_approved: false
exit code: 0
```

另實際執行 `node --test holiday-lab/tests/new-year.test.mjs`：4 passed／0 failed；固定10之真DOM `HOLIDAY_QA_GAMES=new-year HOLIDAY_QA_CASE=new-year/zh/1440`：1/1 pass，包含完成、作品、三鏡回放、重玩及資源。其原始 playthrough.json 保存歷史，不假稱重跑全站。
