# Labor engine-v3獨立唯讀審查

原三項漏洞已封住：續跑TOCTOU、flags洗掉、24-byte PNG假截圖。隔離重跑23／23通過，未改原v3／freeze／v2／產品，未啟browser／native／full，也不構成啟動核准。另發現一個P2離線pass一致性缺口，主控已收到，將以新版本修正。

## 逐條結果

|檢查|yes／no|定位與實測|
|---|---|---|
|原stale-precheck不能取得兩個owner|yes|lease.cjs:6–17以epoch wx claim為線性化點，在claim內重讀latest predecessor、自身PID/creation及舊owner狀態；原相同負例與兩OS程序競態都通過。|
|live／reused／uncertain拒絕，partial claim不自動清|yes|process-guard.cjs:10–16；engine.cjs:34–39核claim／termination鏈；原測試含precheck與claim之間插入owner、claim後PID復活等。|
|fullcase flags與sample flags完整一致|yes|engine.cjs:20強制deepEqual；append與verifyRun共用validateCase，原洗旗標負例在PNG前被拒絕。|
|完整PNG chunk／CRC／IEND／解壓|yes|png.cjs:4–11；signature／viewport／CRC逐chunk，最後pngjs解碼精確raster。24bytes、截斷、尾隨、錯CRC及改zlib後重算CRC均拒絕。|
|未經核准不會啟native|yes|collect.cjs:6–8，實際無approval命令exit1，錯誤exact explicit root engine-v3 approval required；沒有產run。|
|320900／14401000與2784target|yes（工程）|engine.cjs:8、plan.cjs:4–14；獨立原測試核完整schedule、18 choices／6 ranges、DOM與job identity。|
|方法／source body／font guard|yes（離線）|binding.cjs:31 loadFreeze核52方法／decoder依賴、30原body與2font檔、runtime、plan及v2繼承；獨立VM負例font/body各因精確drift訊息拒絕，不是prototype假紅。|
|正常UI與直接DOM／CDP／safe／viewport|yes（讀碼）|native.cjs:17–26真click/fill/input、完整輸入/DOM前後比對、原sampler、CDPtargetfont、PNGclip；未見game-state或clock注入。不代表本輪跑過新native。|
|immutable recovery與完整sample|yes（工程）|原測試含1MiB任意sample保留、image/sample/case/journal中止拒絕、shard／checkpoint／lease竄改拒絕、續跑不重寫原shard。|
|pass與原checks／flags不可矛盾|no（P2）|見下；append／verifyRun／openAppender仍可接受自相矛盾pass。|
|本輪新native／全集／全域UI或BOUND已驗|no|沒有啟動或核准；工程測試不能代替原生畫面。|

## P2：offline未獨立驗證case.pass一致性

定位：engine.cjs:15–26的validateCase沒有驗`c.pass`；engine.cjs:65只拒絕`pass===false`，:66/collect.cjs:20再依has略過已存target。

本資料夾`faults.cjs`使用明標synthetic fixture：保留非空sample.violations及完全相同case.method_violations，設`checks.method_flags=false`卻`pass=true`。append成功；verifyRun保留該旗標但接受true；openAppender回報has(target)=true，可以當完成而跳過。完整診斷在fault-results.json，不改任何原資料或假稱有這張玩家畫面。

native.cjs:25–26目前確實以全部checks推導pass，正確producer會給false。此發現不是宣稱已觀察到原生洗白，而是storage／offline守門沒有獨立驗證，不能用producer目前應該正確代替。建議新版本在append／verify共用驗證`case.pass === Object.values(case.checks).every(Boolean)`，保留false及全部原flags，續跑不得把false算完成。主控另交engine-v4修此單點；本報告不修改v3。

## 執行與界線

```text
node .../engine-v3-independent-review-20261023/prepare.cjs
PREPARE YES frozen 8736fe3b16e9d423c7b89764969398067094dd30cebf250bbc35bb2523883ddb; isolated test copies3
exit0

node --test .../engine-tests-isolated.cjs .../regressions-isolated.cjs
tests23 pass23 fail0
exit0（original-tests-output.txt）

node .../engine-v3-independent-review-20261023/faults.cjs
INDEPENDENT_FAULTS source/font/noapproval closed; pass-vs-flags inconsistency OPEN
exit0（診斷完成，不是P2通過；faults-output.txt）
```

三份原測試只複製並改imports／fixture來源，所有新test-runs與race-worker輸出留在本資料夾。兩OS程序競態使用明示synthetic PID provider，不冒稱兩個真正採樣owner。source-before.json與source-after.json的v3 freeze／52方法完全相同，loadFreeze亦重驗原v2繼承。

目前collect只有明確`--full`，沒有合法bounded pilot／limit模式。不能猜加`--limit`便會減量；若主控要先跑新原生pilot，須有明確獨立授權與受審工程入口。此報告不提供approval檔，不啟任何native／browser，不stage／commit／push／main／刪檔。
