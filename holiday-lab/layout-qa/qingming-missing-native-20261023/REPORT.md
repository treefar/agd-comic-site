# 清明唯一缺route：JA1440/default補驗完成

只補原失敗的清明／日文／1440×1000／default一組，沒有重跑原完成五route；沒有重啟任何既有程序。

|驗收項目|yes／no|實際結果|
|---|---|---|
|單次 hidden／headless collector|yes|driver57024、collector2352、launch_count1；03:36:14.949Z開始，03:48:29.960Z正常exit0。STATUS存在即拒重開，沒有自動restart。|
|完整route／分片保存|yes|193case，唯一session為JA1440/default、route-complete-layout-not-certified；每個完整shard與另存case深度相等，sample nodes／blockers／shot相符。|
|sample／image SHA及geometry|yes|193筆逐一核SHA，原policy獨立重算geometry0，與儲存結果一致。|
|三段回放及retry|yes|shot0／1／2各有同shot前後穩定截圖，retry真case存在。不是以解法API或學生盲測代替。|
|Console／網路|yes|console／page／HTTP errors皆0，stderr0。|
|來源13項逐鍵相同|yes|新before、collector內部before-after穩定檢查、獨立目前after逐項hash與舊原before相等。source-comparison.json保留每key原值。|
|舊after及連續不變|no|舊收據缺after；本次新點狀收據不能證明舊run整段continuous immutability，不補造true。|
|method flags／全站UI gate|no|169個原method violation完整保留於verification.json，沒有清除或宣稱完整UI通過。原恢復資料仍有未知flag1；本報告不組合或覆寫它。|

```text
node holiday-lab/layout-qa/qingming-missing-native-20261023/driver.cjs
LAUNCHED driver57024 collector2352
PARTIAL_RED 193 frames; geometry=0; phase-runs/2026-10-23T03-36-15-352Z
TERMINAL exit_code0 launch_count1 state terminal

node holiday-lab/layout-qa/qingming-missing-native-20261023/verify.cjs
FRESH_VERIFY frames193 complete_routes1 geometry_recomputed0 replay_shots[0,1,2] retry_observedtrue console/page/http0 source_files13 fresh_runtime_unchangedtrue old_after_availablefalse old_continuous_immutability_provenfalse unresolved_method_flag_count169 full_project_approvedfalse
exit0
```

完整stdout／stderr為stdout.log、stderr.log、combined.log；逐case／shard／sample／image收據為case-receipts.json，完整原method flags與驗收結果在verification.json。raw manifest是phase-runs/2026-10-23T03-36-15-352Z/report.json，SHA `c76c047a45e96e3a193472ae9b6cef58f185f2fa1410033d3ad046a80d38dd55`；fresh-run.manifest.json是同SHA可版控副本，不代表ignored全部raw已跨機備份。

指令含 --sharded=1、--games=qingming、--languages=ja、--widths=1440、--phase-only=1、--canonical=1、--all-errors=1、--button-states=1、--scrolls=1，固定8845；執行用QA程式逐檔SHA在manifest.json，驗證時仍相同。

此處不產全站coverage／composite；後續若adapter採來源點狀收據，仍須保留舊afterfalse、原unknown1與所有方法旗標。未stage／commit／push，未碰root全集或其他replay程序。
