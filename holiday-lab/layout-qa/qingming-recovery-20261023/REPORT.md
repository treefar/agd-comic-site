# 清明舊 run：恢復原始1042筆，保留原缺口

原 run 依 progress.metadata.date 與 matrix.started 核定為 `2026-10-23T00-55-59-140Z`；collector 程序在00:55:58.738Z派生，真正metadata為00:55:59.140Z。沒有以資料夾時戳推定來源。

|驗收項目|yes／no|實際結果|
|---|---|---|
|確認原程序已終止|yes|matrix qingming row exit1、ended03:29:01.437Z、matrix.finished03:29:01.445Z；原log明載Invalid string length，不是timeout觀察。|
|逐case連續與完整|yes|1042筆，ordinal0…1041連續唯一；全部恢復為完整v2 shard，與原 .case.json 深度相等；20,773 nodes、21,008 blockers。|
|原sample與圖像證據|yes|1042原sample／恢復副本及原image／恢復副本SHA皆驗，nodes／blockers／replay_shot逐值相等。|
|獨立重算geometry|yes|1042筆逐筆以原政策重新驗算，geometry0，原儲存結果完全相同。這不清除method flags。|
|前五個route完成|yes|ZH320、ZH1440、EN320、EN1440、JA320原status皆route-complete-layout-not-certified，各replay_seen含三shot。|
|最後JA1440原route完成|no|原status route-failed，RangeError Invalid string length；尚未三shot及retry。最後實際寫出的case是artifact-scroll-17，log最後成功輸出為16，兩者差別保留。|
|巨大report安全讀取|yes|525,981,313 bytes僅64KiB串流SHA；以固定4MiB buffer反向讀窗口，僅抽出violations欄位與metadata尾段，沒有整份parse或stringify。|
|精確checkpoint flags|yes|原aggregate最後checkpoint1022筆、697flags，與原sample前綴逐條完全相等。另20個後續原sample／原route failure可知flag獨立保留。|
|全原flag恢復|no|progress記718：697精確checkpoint＋20已知額外＋1未知。未知1維持NO，沒有推測或補造COLLECTOR_FAILURE文字。|
|舊after／continuous immutability|no|原progress metadata沒有after或runtime_unchanged收據。恢復仍保留原metadata，不新增true；目前來源相同也不能冒稱舊after。|
|官方整體UI通過|no|只恢復原證據；此報告不是完整layout gate，也未建立composite。|

## 實際指令

```text
node holiday-lab/layout-qa/qingming-recovery-20261023/inventory.cjs
INVENTORY frames1042 sessions6 complete5 partialJA1440/default terminal_exit1
exit0（inventory-output-fixed.txt）

node holiday-lab/layout-qa/qingming-recovery-20261023/recover.cjs
RECOVERY {frames:1042,checkpointFrames:1022,checkpointFlags:697,extraKnown:20,unknown:1,geometry:0,completeRoutes:5,oldAfter:false}
exit0

node holiday-lab/layout-qa/qingming-recovery-20261023/verify.cjs
RECOVERY_VERIFY frames1042 nodes20773 blockers21008 geometry0 complete_routes5 partial_routes1 unknown_original_flags1 old_after_available:false
exit0
```

原aggregate串流SHA：`5edfad52858f653323c5fd1c94f9566d7cee488173100677b0e1d8b4b1502ff9`。恢復manifest SHA：`9ac8071a3d9a0d4440864d3bd8de3df18c2cea8f7ffd4896eeca55aeb6194788`。完整逐case收據為recovery-receipts.json，獨立結果為verification.json；可離線重跑verify，既有manifest副本只驗SHA相等，不覆寫或刪除。

## 測量工程修正留底

首個inventory假設metadata秒數與spawn相同，實際0候選而退出；已保留inventory-first-date-assumption.cjs。修正為比較原matrix.started前後5秒內的真metadata日期，唯一找到相差402ms的run。

第一版只讀最後4MiB，因violations欄位本身6,817,028 bytes而拒絕，未擴大成聚合讀取；已保留recover-first-tail-assumption.cjs。新checkpoint-field.cjs使用固定4MiB反向窗口定位精確ASCII欄位位元組邊界，欄位copy再以64KiB buffer串流，僅parse該flags欄位及1,893,220-byte metadata尾段。所有窗口位置／長度／SHA都在aggregate-receipt.json；舊失敗不當產品bug。

`.gitignore`精確排除/recovered-run/，原shard／sample／image恢復副本在本機ignored目錄；recovered-run.manifest.json與逐檔SHA可版控，但不代表raw已跨機備份。原始phase-runs亦是既有本機證據，不能宣稱另一台直接可讀。

JA1440/default的新單次定向補缺由qingming-missing-native-20261023獨立記錄，沒有重跑原完成五route；composite由root後續處理。本輪未stage、commit、push，未改產品／sampler／其他代理檔案或停止任何server。
