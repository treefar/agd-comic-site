# 2026-10-23 整合續驗紀錄

source_agent: codex。此為持續中的本機試作，不是發布或新版試玩包驗收。

| 驗收 | yes／no | 實際證據與指令 |
|---|---|---|
| 新生任務與窗口術語已在主控分支整合 | yes | 3f4760c、1059121；`reports/semester-tasks/integration-report.md`。root08 八組真DOM通關8/8、24次真指南查找、每組四次諮詢與四個回放鏡頭；18份來源收據前後一致。 |
| 跨年／年獸／開學有獨立探索試玩 | yes，限定代理 | `player-review-round2/REPORT.md`、7423e1a；六個不同作品，三款各兩種第三幕選擇，探索後100分。不是真人學生觀察。 |
| 年獸錯誤眉向不再誤稱水平 | yes | 原08真圖紅燈保留；`lunar-brow-feedback.test.mjs`修前缺export失敗、修後相關測試通過。09 `brow-fix-verification/REPORT.md`三語兩寬6/6：+30反向、0近水平、−30接受；54張真viewport圖。 |
| 年獸修改後完整功能回歸 | yes | `HOLIDAY_QA_URL=http://127.0.0.1:8830 HOLIDAY_QA_LUNAR_MATRIX=1 node holiday-lab/qa/playthrough.cjs`，實際8/8；`lunar-expression/integration-2026-10-22T17-01-33-814Z/playthrough.json`。不是完整文字安全區驗收。 |
| 08→09改動範圍可追查 | yes | `node holiday-lab/verify-measurement-delta.mjs .measure-layout-08 .measure-layout-09 holiday-lab/games/lunar-new-year.mjs holiday-lab/reports/measurement-08-09-delta.json` →355/356檔完全相同，唯一lunar模組。07→08亦只有semester模組不同。 |
| 13位教師職稱有第二組獨立日英複核 | yes，忠實對照現行中文資料 | `translation-review-title-check/check-output.txt` →13/13、FAIL0、COMPILED_EN_JA PASS；91792ad。助理教授→Assistant Professor→助教有JST依據。未重新查實全體最新人事狀態；六筆碩士類型及正式專名仍待一手資料。 |
| 新消息與作品審校提案有落地 | yes；尚待套用 | `translation-review-content-next/REPORT.md`、d48f5d9：19段／38譯值、13修正提案、25保留；另一項已由主控讀合作方官方about查證的中文公司名修正，須連動JA長鍵。完整盤點範圍348唯一鍵，本批後321鍵待續，未冒稱全站完成。 |
| 本次Node全檔檢查已全過 | no | `node --test tests/*.test.cjs holiday-lab/tests/*.test.mjs holiday-lab/tests/layout-sampler*.test.cjs`：當時175/176，`node-tests-20261023-followup.txt`。唯一採樣器fixture在非同步mount前取sprite而null，代理正修實際等待；後續新增公司名基準測試另有套用前預期紅，不拿舊綠取代。 |
| 儀表板依當時真模組收據重產 | yes，限定55b49cd階段 | `node holiday-lab/build-dashboard.mjs` →23/23；`node holiday-lab/dashboard/smoke.cjs` →2/2。當時15模組功能通關、0使用者確認；後續按鈕產品修改需更新對應收據。歷史外框56yes／1未驗另列，不宣稱最新整包。 |
| 四款按鈕貼框已全修完 | no，修復中 | 原真圖／墨跡：教師節三行英文、國慶重排、和平完整聆聽、勞動儲存與10倍速預覽。`reports/inspect-layout-errors.cjs`只做診斷，實際候選與修復由獨立代理驗三態；未以短句候選代替新產品通過。 |
| 全部2076必要案例及打包閘門 | no | `node C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs --project .` →exit1、13個舊診斷案例；`layout-gate-20261023-followup.txt`。phase、前段90組與09提示delta屬分批證據，尚未合成完整報告，不出新包。 |
| TF-BASE兩款WebGL已有來源／建置回件 | no | Drive交接夾本輪再次實查仍只有5份工單／腳本。沒有啟Unity、重送舊工作或更動遠端權限。 |

8800的`.review-local-09`及既有ZIP持續保留。8819／8820／8830分別是07／08／09內部量測服務；沒有用內部量測版替換使用者穩定版。

尚未push、發布、碰main或刪檔；原交接C節維持固定SHA。下一步整批套用精確翻譯提案、驗新文案真DOM與字型，回收四款按鈕及完整版面矩陣，通過打包閘門才交新的整體試玩包。
