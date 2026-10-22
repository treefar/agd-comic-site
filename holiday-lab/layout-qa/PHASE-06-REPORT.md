# 06版原紅燈複驗與主矩陣進度

2026-10-23。來源固定 `.measure-layout-06`／http://127.0.0.1:8818 。只修改量測器、路由與回歸測試；產品由root修正，本代理未修改產品。

| 驗收項目 | yes／no | 實際輸出／範圍 |
|---|---|---|
| 原04版artifact的9項strict safe紅燈全部轉綠 | yes | 原命令 `node holiday-lab/layout-qa/phase-collect.cjs --games=constitution --languages=zh --widths=320 --scrolls=1`；06 run `2026-10-22T16-19-31-620Z`：`PARTIAL_RED 33 frames; geometry=0`。04原紅證據未覆寫 |
| 06紀錄區完整內容不遺漏 | yes | 同run：562／562非空白grapheme、missing0、text_unchanged=true，真實scrollTop逐半clientHeight，前後served runtime receipt相同 |
| 06兩張固定紙面、合法字幕、3shot仍可用 | yes | light/dark paper、三幕preview與3個真shot均geometry0。沒有改動固定source rect或取消合法紙面底圖 |
| 畫面外paint-order缺口已改為實際捲頁 | yes | `browser-sampler.cjs` 實際scroll至交點，等兩個RAF、檢查原始document geometry未變才判hit；結束恢復原window scroll。若位置改變、交點不可達或hit目標不明，仍留紅旗 |
| 新負例真的能抓到viewport外既有圖片覆字 | yes | 真實caption-save位於900px以下，將既有actor PNG移到該文字上方；官方validator抓到unregistered-effect-negative。還原原parent／sibling／style及scrollY後負例消失。paused面板的inert僅在同步hit probe暫移除，原屬性立即恢復 |
| 1440控制面板量測不觸發捲動偏差 | yes | 新回歸：量測前後scrollTop、原文字document bbox、完整文字、overflow-anchor樣式相同；墨跡屬於原line box。測量期間禁止scroll anchoring並每次插／移baseline marker恢復原內捲動值 |
| 新lunar comic/reserved規則路由已更新 | yes | 逐讀 `reports/lunar-expression/REPORT.md` 與browser-test.cjs，兩套真三幕資料；第三幕同表情先錯intent拒絕再正確intent，artifact.poses[2].intent逐條檢查。原expressionProps不變 |
| 主矩陣已全部完成 | no | 分款執行中，狀態在各matrix-runs/status.json；只跑phase/help/settings/error/min/max/paused/result/實際內捲動/replay/retry，不含完整intro播放，不稱2076通過 |

修正paint-order後同款再測：run `2026-10-22T16-21-05-967Z`，`--phase-only=1`為29frames／geometry0，原light/dark紙面的PAINT_ORDER_OFFSCREEN_PENDING消失。artifact每個scroll frame仍會保存TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT原始提醒，再與實際562字完整覆蓋proof並列；幾何0與整份交付gate通過是兩回事。

主矩陣：

```powershell
$env:LAYOUT_QA_URL='http://127.0.0.1:8818'
node holiday-lab/layout-qa/phase-matrix.cjs --jobs=2
# matrix-runs/2026-10-22T16-23-19-889Z
node holiday-lab/layout-qa/phase-matrix.cjs --games=constitution,lunar-new-year --jobs=1
# matrix-runs/2026-10-22T16-26-41-446Z
```

第二行獨立批次是第一批前兩款的量測器修訂後重測。第一批前兩款含舊scroll anchoring偏差，僅保留診斷，**不拿其總紅燈數指控產品**。第一批由new-year起採修正後sampler（8c7eb283…），每run metadata保存完整SHA；後續若再修採樣器，以具體SHA區分，不能混成一份來源不明的PASS。

目前可重現、未放寬safe的待修例：英文單字W／A有1px左右bearing伸出各自free-text content box；標題Shadow Stage的g墨跡底超出h1 content約0.16px。1440可內捲動的控制紙面，字捲到外框上緣／下緣也仍可能碰框。來源、case、完整墨跡／safe與畫面記在各run。這些須由root決定產品留白／內遮罩或更精確原圖可寫區契約，採樣器不自行放寬。

所有原始phase／matrix runs保留本機，排除Git；只納代表證據與計算摘要。這不是跨機完整備份，路徑及SHA manifest不等於另一台已擁有所有畫面。過程不刪檔、不推送、不碰main、不停止使用者server。

## root確認無框紙張承載面後的修正

root實看paper.png後明確裁定：自由文字不應拿自己的CSS advance/content box當紙張邊界。已重新實看原始無框紙張；`asset-safe-regions.json`新增tiled_surfaces，SHA綁定原PNG。瀏覽器逐幀驗body實際背景URL、160px160px與repeat、served PNG SHA，僅無生成skin祖先且非stage的文字用#lab實際document border固定內縮8px；不依文字擬合、不用viewport。按鈕、controls、panel、舞台紙面原內框完全不變。先前W/A/h1微小紅是承載面選錯，保留原因及舊樣本，不當產品字體bug。

實際回歸證明：無框W/A及Shadow Stage可以通過；同紙真audio-toggle／既有sprite覆字仍被validator攔；h1移到固定8px界外仍紅；故意錯paper SHA則fail closed。新sampler SHA `72a4e2958d6a4e56fbdf9d5d1aa9e05b3c43a7ef52635a8ddc61b1cb25f7d329`。lantern/en/320真實重跑18frames geometry0，三shot完成，來源前後相同。

`matrix-export.cjs`只將相同sampler SHA的完成款納入current rows，舊sampler另列superseded，保留其raw來源但不混總數。`matrix-checkpoint-06/summary.json`是計算快照，重跑export可更新；`regression-summary.json`保留原artifact9紅→0與lantern小批證據。各款完整路由不等於每個錯誤分支、最短時序或全2076已通過。

新年短shot採證補充：全頁WebP耗時會跨180ms shot，之前捕不到時如實留下sameShot=false及路由缺證。新增stage+caption真實document clip的CDP JPEG採證，仍核對幾何起／結束shot及截圖before／after同ID，不freeze、不seek。driver預設維持原180ms短flight及原focus作品；只有顯式`--newyear-long=1`可作較長合法作品診斷，報告明示不能覆蓋短作品。`2026-10-22T16-33-11-350Z`為切換期間較長作品診斷，雖九shot可證，**不納入原短時序完成數**。
