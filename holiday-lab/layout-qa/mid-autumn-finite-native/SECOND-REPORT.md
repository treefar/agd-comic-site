# 中秋有限訊息原生墨跡：第二個有界先導

720個候選與第一先導的完整 frozen 結果一致；10個既有真玩家提示校準一致，13個候選極值另用完整 frozen 函式複核一致。這證明本次有界探針的加速量測可重現原法，**未完成67,448訊息／context全集，GLOBAL_BOUND仍為NO**。

## 固定範圍與方法

來源固定08／`http://127.0.0.1:8845`，三語、320／1440共6個context，各120候選。本次720是先前720的逐筆對照，沒有新增第二批720不同候選。10個真例沿用第一先導已由真UI操作、拒絕送出取得的記錄；本次在同源clone重新量測並逐欄對照，沒有把clone稱為新玩家截圖。

`extract-ink-ast.cjs`以AST擷取原函式39個完整statement；`ink-extraction.json`保存原文、原檔位置及逐段SHA。Range、分行、baseline、Canvas實墨跡、stroke、scale、clip、安全區和cleanup相關原statement保留。反覆HTTP／hash改成批前後完整原法驗證的來源收據adapter；clone中不存在的其他按鈕、圖片、stage與paint blocker分支未執行。這不是完整sampleLayout的替代品，也不能直接用於國慶controls或其他UI。

|來源|SHA-256|
|---|---|
|未修改browser-sampler.cjs|0346d164923e507a4f7df7888a93482fa00ae7871016e96f5f2343c05703e207|
|原frozen函式|c247641156d929b0de7d6aa70e509510e293a29d7d6ff45aaac99ad931e0dc1a|
|未修改asset-safe-regions.json|0604fa8281a50acaccc6d151dfa676f1323e3a3b453a4e03bc939ad17e73de2b|
|擷取產物ink-only-generated.js|06af9460e27e9661820bb5ac134161ceac10d3811b3499902e8333eb9add31e8|

每批前後查實際served game、runner、lab.css、panel、paper及Windows `msjh.ttc` SHA；六context均一致。每候選檢查原owner／body computed不變欄位和字元白名單，拒收其他元素。文字不同造成的自動高度、實際分行、clip和safe每筆重算，沒有快取幾何值。clone保留`height`與`block-size:auto`，避免舊高度使不同訊息被錯裁。

對照欄位含relative Range／baseline／ink／safe、行文字與行數、owner高度、computed字型。所有數值須有限、物件與陣列結構相同；允許0.05 CSSpx比較誤差，實際最大差僅`4.263256414560601e-14`，為浮點量級。

## 實際指令與結果

以下在`C:/agywork/agd-holiday-prototypes`執行；browser先導已跑完，重驗請用新輸出目錄，不覆寫`second-01`。

```text
node holiday-lab/layout-qa/mid-autumn-finite-native/extract-ink-ast.cjs
node holiday-lab/layout-qa/mid-autumn-finite-native/second-pilot.cjs second-01
YES zh/320 candidates120 fast1.063s rate112.9/s same-as-full120 true2 worst-full3
YES zh/1440 candidates120 fast0.631s rate190.3/s same-as-full120 true1 worst-full2
YES en/320 candidates120 fast0.975s rate123.0/s same-as-full120 true1 worst-full2
YES en/1440 candidates120 fast0.657s rate182.6/s same-as-full120 true2 worst-full2
YES ja/320 candidates120 fast0.864s rate138.9/s same-as-full120 true2 worst-full2
YES ja/1440 candidates120 fast0.488s rate246.0/s same-as-full120 true2 worst-full2
SECOND PASStrue candidates720 true10 estimatedMinutes43.83 GLOBAL=NO

node holiday-lab/layout-qa/mid-autumn-finite-native/verify-second.cjs
exactOriginalASTStatements:39
candidates:720
trueNativeCalibrations:10
fullFrozenWorstWitnessChecks:13
all720OriginalResultsEqual:true
all10TrueResultsEqual:true
sourceFontSkinBatchBoundariesStable:true
fullUniverseStarted:false
globalBoundProven:false
```

完整stdout見`second-01-output.txt`、`verify-second-output.txt`；逐筆原始值與收據見`second-01/report.json`，統計由`verify-second.cjs`重算至`summary-second.json`。本文件的摘要不取代原始輸出。

## 效能與限制

|context|120筆batch秒數|每秒候選數|擷取core平均ms|完整core複核平均ms|
|---|---:|---:|---:|---:|
|zh320|1.0633|112.86|4.267|32.675|
|zh1440|0.6306|190.31|2.698|50.100|
|en320|0.9755|123.01|4.016|34.767|
|en1440|0.6572|182.60|2.862|27.800|
|ja320|0.8640|138.88|3.513|35.167|
|ja1440|0.4878|246.03|1.855|39.300|

第一先導完整原法720筆37.0594秒，估六context全集5.7861小時；第二先導browser batch合計4.6783秒，依各context速率估43.8253分鐘。**兩者不是整個任務牆鐘時間**：第二數值不含batch返回後逐筆與舊資料比較、反覆寫報告、頁面初始化、批前後收據／字型驗證、極值複核及未來checkpoint成本。正式全集會更久，43.83分不是承諾完成時間。

實際Resource Timing顯示完整函式反覆抓paper（transferSize3416）與panel（99887），本次約4至24.5ms／請求。加速同時含收據快取、未適用paint／blocker省略及browser RPC批次化；沒有獨立拆解實驗，不能宣稱HTTP或雙rAF單獨就是全部瓶頸。各次core和resource原數據保存在報告。

字型證據需區分：第一先導10真例有逐owner CDP，本次10校準逐筆同CDP；舊720沒有逐筆CDP，故只可稱720的computed字型逐筆一致。六context批前後另把全部56允許字元交CDP，均為單一`MicrosoftJhengHeiUIRegular`，並核字型檔SHA。不得把這項批次不變量冒稱舊720逐筆CDP記錄。

目前120候選在一次browser evaluate回傳後，才由Node逐筆比舊結果；本次全部一致，未遇需要即刻中止的差異。未來全量工具應在browser內逐候選即時拒收不合法幾何／字元／環境，不能只在批末給pass。具體checkpoint、rolling hash、極值真UI與獨立原法複驗方案見`FULL-RUN-PROPOSAL.md`；它是待主控決定的規格，尚無全量啟動入口。

## 逐條驗收

|條件|yes/no與證據|
|---|---|
|先存提案與AST依賴，再跑第二有界先導|yes，SECOND-PILOT-PLAN.md、ink-extraction.json|
|39原statement逐段SHA與原文精確相符|yes，離線verify-second exit0|
|720與舊完整結果逐欄相符|yes，720／720|
|10真提示校準與13完整極值複核相符|yes，10／10、13／13|
|來源／字型／skin批前後穩定|yes，六context收據與CDP|
|原sampler、map、產品、契約未修改|yes，原SHA及工作範圍|
|第一CORS紅、第一37秒與5.8小時估計保留|yes，pilot-01與第一REPORT保留|
|新720均是真玩家畫面|no，原生技術clone探針|
|全部404,688 context候選已跑／全域最長已證|no，全集未啟動，GLOBAL_BOUND=NO|
|整個遊戲／全頁UI gate已通過|no，僅pure hint有界方法校準|
|啟動全集／完整矩陣／改服務／push／main／刪檔|no|

