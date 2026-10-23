# 遊戲入口移至頁底

2026-10-23，source_agent: codex。分支codex/games-page-bottom。本機 http://127.0.0.1:8873/ ，建置.measure-games-bottom-20261023-01；未push、未發布、main／C節未動，勞動節繼續暫緩。

將小型策展與節日試作入口搬到招生資訊之後、聯絡頁尾之前；首頁首屏保留系所介紹與小颯／原三件學生作品。三語共用同一版型，遊戲選單14款非勞動節試作不變，點擊後才載入遊戲。沒有新增圖像或改遊戲內容。

| 驗收條件 | yes／no | 實際證據 |
|---|---|---|
| 舊版可重現首屏含遊戲入口 | yes | red/result.json，en1440，heroGameControls=3；實際exit1 |
| 新版首屏不含遊戲入口 | yes | 三語×390/1440，共6組heroGameControls=0 |
| 試玩位於招生之後、頁尾之前 | yes | 六組真DOM compareDocumentPosition核對；green-r2/result.json |
| 原四件作品、完整作者與來源保留 | yes | 24件輪播狀態、原圖contain、六次小颯來源頁可見署名 |
| 試玩可開啟、Esc關閉及返回焦點 | yes | 六組真iframe開啟清明，intro-skip可見，Esc後iframe=0、焦點回festival-start |
| 三語主導覽無回歸 | yes | 新build三語×六寬NAV_LAYOUT18/18 |
| 本輪畫面與來源穩定 | yes | 36PNG及來源前後SHA相同；新index／app HTTP200與建置SHA一致 |
| 全站或新遊戲已發布 | no | 僅本機，未做此授權；不重啟舊巨量QA或勞動節 |

實際指令輸出：

```text
node scripts/test-home-games-bottom.cjs http://127.0.0.1:8872/ holiday-lab/reports/games-bottom-20261023/red --reproduce
AssertionError: playtest controls remain in the hero; 3 !== 0
exit1

node holiday-lab/build-review.mjs .measure-games-bottom-20261023-01 --measurement
MEASUREMENT_ONLY: .measure-games-bottom-20261023-01; 360 files; no publication performed.
exit0

node scripts/test-home-games-bottom.cjs http://127.0.0.1:8873/ holiday-lab/reports/games-bottom-20261023/green-r2
PASS zh 390 / zh 1440 / en 390 / en 1440 / ja 390 / ja 1440
HOME_BOTTOM 6/6 PASS
exit0

node scripts/test-nav-layout.cjs http://127.0.0.1:8873/ holiday-lab/reports/games-bottom-20261023/navigation
NAV_LAYOUT 18/18
exit0
```

第一版green/為測試方法錯誤：輪播停在第四件卻等待第一件小颯的來源頁。原方法另存test-home-games-bottom-v1.cjs.txt及逾時原結果，修成循環回小颯再驗，沒有為此修改產品。完整stdout／stderr／exit code在official-names-followup-20261023/root/games-bottom-*.json。

本輪是主控沿既有方法做的工具複驗，沒有宣稱新的獨立代理驗收。儀表板、交接與本機保存結果追加於末尾。

## 儀表板與交接

node holiday-lab/build-dashboard.mjs → 34/34 PASS、exit0；node --test holiday-lab/dashboard/progress-adapter.test.cjs holiday-lab/dashboard/ui-authority.test.cjs → 20/20、exit0；DASHBOARD_QA_URL=http://127.0.0.1:8873 node holiday-lab/dashboard/smoke.cjs → DASHBOARD_SMOKE2/2 + OFFLINE PASS、exit0。儀表板採本輪6組／36PNG與18組新導覽收據；原始證據保留，使用者確認仍pending。Chrome已開8873首頁及儀表板，並展開頁尾前的節日試玩供查看。
