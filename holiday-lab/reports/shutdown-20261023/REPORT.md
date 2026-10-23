# 關機前成果與暫停交接

2026-10-23，source_agent: codex；TF-GO。依使用者要求，完成本段後暫停，不自行關閉電腦。

本機首頁 http://127.0.0.1:8870/ ，儀表板 http://127.0.0.1:8870/progress/ 。關機後服務停止；重啟命令見原專案LATEST_HANDOFF.md最新段。

| 驗收條件 | yes／no | 實際證據 |
|---|---|---|
| 小颯手繪原圖放首頁首件、保留完整原圖 | yes | holiday-home.jsx、雙語works資料；原圖SHA不變，object-fit:contain |
| 三語畢業生署名、來源頁與原三件作品保留 | yes | 獨立6/6 contexts，24/24作品狀態，6/6真點擊來源，30PNG |
| 原創作資料、照片及九份HTTP穩定 | yes | independent/run05/result.json與receipt.json；root唯讀方法及PNG SHA重核exit0 |
| TF-BASE兩款WebGL已收到可整合包 | no | 台灣19:49:30指定交接夾只有5份工單／腳本；舊Flora候選未核完整性，未下載／啟Unity／重送工單 |
| 12正式名稱獨立驗收後合入本機 | yes | d234fc4f3b3297be1f4411e714a8c2eedeb59674；累計24值／48次可見觀察／60PNG；只限8867原凍結範圍 |
| 儀表板由證據計算、暫停及使用者確認分開 | yes | build 34/34、18/18回歸、桌機／手機2/2＋離線smoke通過；工作中0、明確暫緩3由資料計算 |
| 整個網站／全部遊戲發布驗收已完成 | no | 完整UI gate仍NO，真hidden仍unknown，母語與使用者畫面確認未完成；8866歷史收據標清楚 |
| 指南全部現行規章及四題新草稿完成 | no | 五題現行母法補件100yes只核文件證據；四題只有checkpoint9/9，完整內容仍待續接 |
| 未push／未發布／main及C節未變／未刪檔 | yes | root/local-preservation.json逐項核對；只本機保存，勞動節維持暫緩 |

## 實際指令輸出

以下完整stdout／stderr／exit code在 ../official-names-followup-20261023/root/ 對應JSON；沒有以預期輸出代替實跑。

```text
node --test holiday-lab/reports/shutdown-20261023/xiaosa.test.cjs
tests 3 / pass 3 / fail 0 / exit0（此前RED3條失敗收據保留）

node holiday-lab/build-review.mjs .measure-xiaosa-review-20261023-01 --measurement
MEASUREMENT_ONLY 360 files / app-BWFF7U3Q.js / exit0

node holiday-lab/reports/shutdown-20261023/independent/run-v5.cjs
PASS 6/6 contexts, 24 poster states, 30 PNGs; source and HTTP bytes stable / exit0

node holiday-lab/reports/shutdown-20261023/root-review.cjs
PASS root readonly: 6 contexts / 24 states / 6 source clicks / 30 PNG;
9 current sources stable; independent method and PNG SHA preserved;
no global approval / exit0

node holiday-lab/build-dashboard.mjs
34/34 PASS / exit0

node --test holiday-lab/dashboard/progress-adapter.test.cjs holiday-lab/dashboard/ui-authority.test.cjs
tests 18 / pass 18 / fail 0 / exit0

DASHBOARD_QA_URL=http://127.0.0.1:8870 node holiday-lab/dashboard/smoke.cjs
DASHBOARD_SMOKE 2/2 + OFFLINE PASS / exit0
```

儀表板首次建置發現二進位原圖被當UTF-8雜湊，守門真失敗；修成read回傳Buffer後34/34通過。首次smoke發現代理8870只有Python靜態服務，/progress/404；確認PID43280精確命令及本輪專用目錄後，停止該服務，改成既有serve-local-review橋接，session74638，同一份frozen build未變，第二次smoke通過。第一次失敗收據均保留；未重啟未知或仍在工作的長任務。

獨立驗收早期四次測試等待selector／SPA時機錯誤詳列independent/REPORT.md，不是產品修正。只讀root重核另外保存，不改獨立原始收據。

第一次Git整合因長路徑及locale dirty失敗，Git回復時改寫四份原dirty；已從dangling commit f7e62206a266093fe076a24ef66ef0f1e78e9cb7找回4/4原SHA。完整恢復原檔另保存在official-names-followup-20261023/root/dirty-recovery/，原四檔仍留dirty，不加入本輪提交。後續Git加core.longpaths=true，守門檢查原檔、main refs、正式R0與C節。

剩餘工作保留：4 PROGRAM整句及相依欄位、指南現行規章／流程缺件、TF-BASE新WebGL回傳、全站UI與人工畫面確認。依使用者要求暫停，不再派工。

最終本機保存：主成果3498ce25f86871cab8bdce57105ab6bec38726be；原專案交接b97afdbb23223aa9af96a25beb28cac51bb59065；保存收據a7b06a5c0d9fc60743f90df8dd9fc0d97770c6a4。387個檔案入本輪範圍，363份證據共73,501,516 bytes逐一核對index與原檔SHA；四份原dirty／正式R0／C節／main refs均守門通過，兩repo fsck exit0。
