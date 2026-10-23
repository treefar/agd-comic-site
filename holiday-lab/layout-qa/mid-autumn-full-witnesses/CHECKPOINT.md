# 中秋完整域後真UI見證工具：暫停實作交接

2026-10-23，依主控轉向先修Labor-v3。本資料夾目前只有設計／來源實讀checkpoint，**尚無可執行見證collector或正式plan**。沒有啟動browser／native、沒有改原mid-autumn-finite-native任何檔案，也沒有拿partial extrema當全域。

已實讀原檔（全部唯讀）：

- `mid-autumn-finite-native/full-domain-run/exhaustive/witnesses.cjs`：固定每context128個LCG indices，seed從 `AGD-mid-autumn-fixed-seed-20261023|<context>` SHA首8hex取得；不可換seed或挑掉壞例。
- 同層`core.cjs`：67448/context、512/batch、6contexts、rolling step、原Range／ink／safe完整驗證。
- 同層`verify.cjs`：只有verified404688、6context各67448與132batches才native_universe_complete；allowPartial不等於完成。
- 同層`domain-offline.cjs`／`state.cjs`：原AST域與tupleSetSHA、逐checkpoint chain／rows SHA／來源／font／method核對。
- `full-domain-run/execute.cjs`：舊10真UI校準；各phase前幕正常配方為[900,21.5,20]、[1200,38,26]，由真preview/submit推進。
- `full-domain-run/native.cjs`／`native-layout.cjs`：N.init、attempt、measure、compare等；320×900／1440×1000，原compare允許0.05px。
- 同層exhaustive `engine.cjs`／`pid.cjs`：現行完整域執行及鎖介面，不能照抄其可覆寫lock來做新工具互斥。

原freeze位置：`mid-autumn-finite-native/full-domain-run/exhaustive/manifests/prepared-01/freeze.json`。本次實跑Get-FileHash結果：`64b5b6840c243d33cee047b1c3e206ea43a30904b134636d920387505b6d3448`，與主控指定相同。原module SHA `a8c3bdf7368b51e69a41665e68b4ab8b50829be5f6089ebfd2cf757936f19dd1`；tupleSetSHA `38a457b3db317c087e8c50edc7d1522bf9f3be1fd028e23f362c5312b3cac97d`。執行程序由主控管理；本代理未重啟或干預18628／68760。

## 待實作介面

1. 必須先接收不可變offline verification檔，核其原manifest SHA、verified=404688、native_universe_complete=true、6context各67448／132batches；再呼叫原offline verify（allowPartial=false）重新驗證。未完成就拒絕建立正式plan。
2. 原`sampleIndices(context,128)`固定768個sample obligations；每context的全域left/right/top/bottom/width/height/lines共7個extremum obligations，六context共42類。若index重疊，合併實際UI工作，但各sample序號／各極值metric義務分開保存，不能消失。
3. 每個index記domain tuple／phase／input／原文、原NDJSON檔SHA與行號／byte位置／row原值SHA、rolling前後／checkpoint SHA／extrema refs、原fullnode及來源refs；不能只有文字長度或一個index。
4. 真UI正常完成前幕，正確viewport，正常preview等待與拒絕；不import state、setText或改clock。
5. 每例保存完整原sampler的nodes／blockers／flags／原Range／baseline／ink／safe、CDP字型與source/font前後、未改viewport的真PNG。相對owner座標與fast原筆依原0.05px標準逐欄比；原flags不清空，不宣告全案。
6. 小分片／完整case與sample refs／immutable NDJSON hash-chain checkpoint。完整驗重後才續跑；已complete的index不可重做。跨流程原子claim取得後，必須再次核最新lease身分與PID/creation，不能重犯Labor-v2先判dead再另寫lease的TOCTOU。

## 尚未完成與驗收

|項目|yes／no|
|---|---|
|原witness/core/verify/domain/正常10例與native介面實讀|yes|
|固定seed／obligation／來源索引與比較標準設計落地|yes，僅設計|
|已建立正式完整plan|no|
|已有可執行collector／故障TDD|no|
|已驗offline404688 complete|no，本輪未跑串流驗證|
|已啟新browser/native/full job|no|
|原mid-autumn檔案／manifest／engine已改寫|no|

恢復第一件事：先確認主控收妥的完整offline verification不可變檔及SHA，再以此介面做TDD與plan builder；尚未經主控審碼批准前，不啟原生見證工作。
