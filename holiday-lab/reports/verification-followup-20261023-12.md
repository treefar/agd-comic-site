# 全面試作：第十二次驗證續報（沒有新版網站建置）

2026-10-23，source_agent: codex。本輪修 QA 工具與補驗資料；最新網站量測版本仍是 11／8852，8800 舊審閱版與既有 ZIP 保留。未 push、發布、碰 main 或刪檔。

| 驗收項目 | yes／no | 實際結果／證據 |
|---|---|---|
| 分片報告模組與接入 | yes | store tests 9/9；獨立 focused checks 8/8、六種竄改負例拒絕；report-store-integration/REPORT.md |
| 真 collector 維持完整案例 | yes | constitution/zh/320 真流程 21 frames、三段回放、geometry0；21 fullcase 與原 .case.json 深比相等 |
| v1／v2 coverage 與組裝計畫相容 | yes | 兩種 coverage 均14/2076、missing 相同；plan 均56/2076、全部 selected wrapper SHA 相同、官方 R0 不動 |
| 開學舊資料復原 | yes，僅案例 | 2964/2964 完整case、原新sample及圖片SHA、11 session metadata 逐值相同；semester-recovery-20261023/verification.json |
| 原最後旗標與原採樣後來源收據完整 | no | checkpoint2944frames／2897flags；後20 sample flags及routefailure共21另外保留，原count還有1旗標全文缺失；無原collector after，不補造 |
| 開學12條路線完成 | no | 原10 complete、JA1440 graduation-first partial、credit-first未開始；定向補這兩條，新單一collector22768／driver69380，原樣本保留 |
| 元旦有限拒絕文字 | yes，限固定08來源 | 11有限key、414精確對應、六context、0unresolved；static-error-max-4/REPORT.md；新版日文字幕來源差異另列 |
| 和平紀念日實際聆聽預覽 | yes，六情境 | 真自然聆聽，採樣／PNG前後狀態穩定、隨後自然完成；verify.cjs 6/6 exit0；未合併到本次覆蓋數字 |
| artifact 缺字元技術補證 | yes，限原72組 | 2799/2799行（2775原scroll＋24末字技術收據）、24真裁切負例；method-gap-plan-08/REPORT.md |
| preview 動態分支全部補齊 | no | 12/30 family 已分別證明；剩18 family／37分支，原false保留；正在定向補constitution日文1440一組 |
| 日英專責審查完成報告 | yes | 26 key、28譯值候選；13人職階、前49修正值、41來源SHA核對；未套候選，非全站母語認證 |
| 全集數值文字最大墨跡已證 | no | 中秋720／10真例／13完整函式先導相符，第二先導4.68秒；尚未啟404688全集；國慶60探測、10真例相符，原法全量約174小時未啟；兩份GLOBAL NO保留 |
| 完整覆蓋與正式 UI gate | no | 新索引1848/2076、缺228、geometry0，仍PARTIAL_RED；官方R0仍原13例、沒有final fingerprints，SHA不變 |
| 儀表板 | yes，功能層 | node holiday-lab/build-dashboard.mjs →23/23 PASS；15模組功能通關、外框56yes/1未驗、使用者確認0；不是完整UI gate |
| TF-BASE WebGL | no | 本輪實查仍只有5工單／腳本，沒有兩款源專案或成品，未啟Unity |

新增覆蓋索引實際指令：

```text
LAYOUT_QA_URL=http://127.0.0.1:8845
node holiday-lab/layout-qa/coverage-index.cjs --phase=2026-10-22T23-47-50-142Z --front=2026-10-22T23-48-00-964Z --min140=newyear-min140/runs/2026-10-23T00-05-50-129Z/report.json --static=static-error-max/canonical-candidates.json,static-error-max-2/canonical-candidates.json,static-error-max-3/canonical-candidates.json,static-error-max-4/canonical-candidates.json --out=report-store-integration/coverage-current.json
COVERAGE required=2076 covered=1848 missing=228 geometryErrors=0; PARTIAL_RED
exit 0
```

缺項：semester96、qingming96、peace-memory12、mid-autumn6、national-day6、labor6、retrocession6。沒有把恢復的partial run或尚未正式接入的peace六預覽偷偷計數。

接入範圍是 phase collector／matrix、coverage、error-source-audit、plan-only assembly；其他歷史 closure／export 工具尚須逐來源確認 v2 支援，不能把 manifest index 冒充 full cases。舊已載入 matrix 保持 legacy、不重啟；新 matrix 才傳 --sharded=1。原大raw與約955MB recovered-run仍留本機，Git僅收頂層收據／manifest快照／程式；沒有跨機備份成功的宣稱。

下一步先追同一個22768／69380／session27559，以及原清明46996，不能因觀察逾時重啟。定向原生preview與peace／retro有限錯句補證由不同代理處理。新完整結果須逐來源、字型、圖片、method flags核對後才更新正式報告；完整gate通過以前不產新試玩ZIP、不發布。
