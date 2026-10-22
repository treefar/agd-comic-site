# 新文字安全區規則：採樣器 R0／R1 checkpoint

2026-10-22。只新增根 `ui-layout-contract.json`、`holiday-lab/layout-qa/*` 與 `holiday-lab/tests/layout-sampler.test.cjs`。未改產品、打包腳本、全域規則；root另外修產品跑馬燈。本報告是更新規則下的新驗證，不改寫舊包功能驗證結果。

完成的可執行物：全案例契約、實際DOM墨跡／真底圖內框／非註冊圖層採樣器、真實圖壓字負例、跑馬燈完整內容檢查、5項可回歸測試。**完整交付gate仍是紅燈，尚未宣稱全面驗證完成。**

|項目|yes／no|實際證據|
|---|---|---|
|完整讀新SKILL與官方validator、建立根契約|yes|15款×三語×320/1440，23主狀態＋列表，共2076必要案例，283來源路徑|
|實際墨跡與來源內框，不用字元數或viewport當safe|yes|Canvas measureText／Range／baseline，8張原PNG固定紙面矩形與SHA、九宮實際映射；方法及限制見METHOD|
|小批真實R0與R1採樣|yes|new-year／zh／320×900，各13診斷案例；最新13筆只匹配10個必要矩陣格，不能寫2076全過|
|故意抬高未註冊圖層，官方validator抓到遮字，恢復後消失|yes|既有actor1 PNG移至「回首頁」文字；negative-proof與三張截圖，新增1遮擋錯誤，恢復0|
|跑馬燈由真紅變綠，沒有放寬safe|yes|09外框clip：墨跡出內框1；measurement01內層mask：幾何0|
|完整story及減少動態可達內容|yes（僅本小批）|與measurement catalog原句完全相同；普通實時觀察28.369秒72/72，reduce實際捲動72/72，兩模式幾何0|
|全部2076格、全部錯誤、最長動態字串及所有捲動完成|no|目前只單款／中文／320小批；尚缺2066個必要格，附加逐分支／逐按鈕狀態亦未完成|
|最終來源已freeze與指紋完整|no|root仍合併新year／P2翻譯；最終source_fingerprints刻意留空，僅保存當時served診斷receipts|
|舞台字幕紙面完整測量|no|constitution prop1/prop2未逐素材建內框，現在UNMAPPED fail closed，未拿全stage充數|
|新整包可交付／公開|no|官方gate仍exit1；未push、未發布、未把measurement包當試玩交付|

## 實際執行與結果

在 `C:/agywork/agd-holiday-prototypes`：

```powershell
python holiday-lab/layout-qa/create-insets.py
node holiday-lab/layout-qa/create-contract.cjs
node holiday-lab/layout-qa/collect.cjs
node C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs --project C:/agywork/agd-holiday-prototypes
# root另修產品內層mask並建 .measure-layout-01
node holiday-lab/serve-review.mjs .measure-layout-01 8814
$env:LAYOUT_QA_URL='http://127.0.0.1:8814'
node holiday-lab/layout-qa/marquee-check.cjs
node holiday-lab/layout-qa/collect.cjs
node --test holiday-lab/tests/layout-sampler.test.cjs
node holiday-lab/layout-qa/summarize.cjs
```

```text
IMAGE_INSETS 8 source PNGs; no product image modified
CONTRACT 2076 required cases; 283 source paths; not yet sampled or frozen
R0 intro/start: geometry-errors=1
NEGATIVE YES actual raised sprite detected; restored layer has no negative blocker
YES no-preference geometry=0 full-story=72/72 observed=28.369s
YES reduce geometry=0 full-story=72/72 observed=0.198s
R1 intro/start: geometry-errors=0 method-limitations=0
tests 5 / pass 5 / fail 0
R1 official gate: pass=false, cases=13, error_count=2351, GATE_EXIT=1
```

5項測試綠燈代表採樣器／負例／已知缺口的驗證正常，不代表全面版面PASS。2351個gate錯誤包含未freeze、2066缺必要案例、283缺最終來源指紋與診斷負例1項；並非2351個已確認產品畫面bug。R0 gate原2353項另有跑馬燈真出框與完整內容未證明，已保留。

原始證據：

- 原09 R0：[report](runs/2026-10-22T15-47-01-202Z/report.json)、[真負例](runs/2026-10-22T15-47-01-202Z/negative-effect.png)、[負例恢復紀錄](runs/2026-10-22T15-47-01-202Z/negative-proof.json)。
- 修後完整內容：[proof](runs/2026-10-22T15-50-54-864Z/marquee-proof.json)、[普通起始](runs/2026-10-22T15-50-54-864Z/no-preference-start.png)、[減少動態末端](runs/2026-10-22T15-50-54-864Z/reduce-end.png)。
- 最新R1含CDP實際字型：[report](runs/2026-10-22T15-53-04-870Z/report.json)、[墨跡明細](runs/2026-10-22T15-53-04-870Z/intro-start-measurement.json)、[還原畫面](runs/2026-10-22T15-53-04-870Z/restored-effect.png)。
- 官方原文輸出：`gate-r0-output.json`／`gate-r1-output.json`；測試：`tests-r1-output.txt`。所有來源都標當時served URL、hash與build身份，沒有拿09報告配新來源。

8814只供measurement-only包量測（exec session18415），8800／09維持給使用者看。沒有啟動Unity、繪製程序介面、刪除任何舊報告或停止伺服器。

下一階段等root宣告freeze後，先實看constitution prop1/prop2紙面並建內框，接新year第三幕intent／錯誤與新譯文，才擴實際通關／結果／回放和其餘語言解析度。每個尚未量的部分仍維持no；打包線如何使用gate由root負責，本代理未改打包流程。
