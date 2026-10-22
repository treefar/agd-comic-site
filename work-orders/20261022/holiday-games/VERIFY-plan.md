# 節日番外篇企畫驗收

2026-10-22，TF-GO／Codex。範圍：研究、企畫、離線審閱資料與交接。沒有實作網站功能或遊戲。

## 完成條件與實際結果

| 結果 | 驗收項目 | 實際指令／輸出或證據 |
|---|---|---|
| yes | 台灣節日、Google案例、程式可行性三路研究均有原檔 | research-taiwan-calendar.md、research-google-doodles.md、research-homepage-feasibility.md；來源URL、日期、未知範圍分開。 |
| yes | 8款原創候選，每款有玩家動作、完成回饋、系所連結及比較界線 | PLAN.md、plan-data.json。不是8款完成品或已准公開。 |
| yes | 使用者三題選項已反映，未誤寫成各款已確認 | preferences.status=confirmed_by_user；8款候選user=pending；明列6–8節日加開學/畢展、30–90秒、節日主格點擊才玩與回顧。 |
| yes | 日期與星期、假期分類、研究檔案及範圍保護 | node work-orders/20261022/holiday-games/verify-plan.cjs → 7項yes，exit0；完整輸出verify-output.txt、verification.json。 |
| yes | 離線狀態頁由原資料計算，資料／工具／使用者狀態分開 | build-dashboard.cjs → 8候選／2校園事件／3研究；遊戲實測通過0、使用者已確認候選0。 |
| yes | 狀態頁格式及獨立權威核對 | node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js work-orders/20261022/holiday-games/dashboard --authority work-orders/20261022/holiday-games/dashboard-authority.cjs → 22/22 PASS；dashboard-verify.txt。 |
| yes | 狀態頁1440桌機／390手機深色的搜尋、篩選、展開、數字、橫溢 | node work-orders/20261022/holiday-games/dashboard-smoke.cjs → yes，search, filter, expand, counts, no overflow；dashboard-smoke.json。 |
| yes | 本機首頁與正式站ref、C節沒有被企畫工作改動 | 三語工作樹仍ee0e251且git status為空；origin/main仍1b8322e；C節SHA256=95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680。既有首頁bundle SHA256=c89e5800458da4e6459cc386b4adf9bc9a61c94907b0e05997ea545a2c6edda7，與上一輪交付相同。 |
| no | 遊戲實作、網站Build、玩法通關、真手機、實作後原創性並排比對 | 本輪僅規畫，沒有這些成果，不宣稱通過。未執行Lint／遊戲程式測試。 |
| no | 樹德2027完整校曆、當屆開學／畢展日期定案 | 尚缺校方文件，日期留null；沒有把政府辦公日曆直接當學校停課公告。 |

所有命令在C:/agywork/agd-holiday-plan執行。dashboard-smoke只暫時啟動8799供文件頁驗證，結束即關閉；沒有重啟或更動8797首頁、8785本機遊戲。

## 調研證據與限制

- 日曆子代理查現行條例及官方2027年曆；主控另讀人事總處2027新聞稿、現行條例與連假附表，確認學校校曆適用界線。官方年曆PDF主控直接開啟曾逾時，不把該次讀取說成成功；節日正日沿用研究中逐筆官方來源，並做資料一致性檢核。
- Google案例取8件官方作品／官方部落格，沒有實玩全部。Hip Hop舊遊戲端點404，仍有官方訪談與回顧可讀；不宣稱全部歷史遊戲如今可正常玩。
- 30–90秒是使用者確認的本案目標；未取得Google通用單局時長，也未完成本案新手實測。
- 原創性矩陣是企畫篩選；仍須在可玩版本比較時看目標、規則、關卡及回饋，不能以「工作名不同」證明原創。
- 工程研究發現排除清單式Build與保留舊dist的組包風險，已列P0前置，沒有順帶修改程式或移除既有不發布遊戲保障。

未push、不碰main、不刪檔、不修改C節。僅交審閱方案；首款、原型製作及公開發布仍是後續決策，這份企畫不是上線授權。
