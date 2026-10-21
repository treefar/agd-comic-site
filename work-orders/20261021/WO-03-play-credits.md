# WO-03 試玩區四款遊戲的作者署名與授權欄

> 對象：**執行代理 Codex**。驗收者：主控（跑測試）＋使用者（補查不到的欄位）。沒有生成模型段落。

## 0. 範圍鎖
- 白名單：`data/play.json`（只准改既有四筆的 `credit`、新增 `team`、`year`、`license` 欄位；不准改 `src`、`poster`、`tier`）、`en-pages.jsx`（只准改 `PlayCard` 內顯示 `credit`／`team` 的那幾行）、`tests/en-play.test.mjs`（只准新增）。
- 黑名單：`play/**` 內任何檔案（唯讀，拿來查資料）、`data/en/**`、其他 jsx。
- 禁止：編造作者、年份、授權；查不到就填 `"待補"`。

## 1. 任務
試玩卡目前沒寫作者。四款遊戲（`six-floor-exit`、`cozy-big-two`、`dungeon-chef`、`crunch-defense`）的成品資料夾都在 `play/` 底下，請從裡面的 README、`meta.json`、`index.html` 的 `<meta>`、授權檔（`OFL.txt` 等）、`docs/素材provenance*.md` 之類的檔案，把能證明的資訊抄出來，填進 `data/play.json`，並讓卡片顯示。

## 2. 規格
1. 每款新增／補齊欄位（中英雙語物件，格式同既有 `pitch`）：
   - `team`：製作者（系上專案名或「動遊系 × AI 協作」之類，**只能抄來源檔案的字句**，附來源路徑在報告）
   - `year`：字串，例 `"2026"`
   - `license`：素材授權一句話（例：「BGM：CAFOFO（Unity Asset Store 授權）；字型：Cubic 11（OFL）」），來源檔案找不到就 `"待補"`
   - `credit`：保留既有內容，若與 `license` 重複就精簡
2. `creative-line` 那筆：`team` 填 `{"zh":"動遊系 × Claude／Codex 協作（2026-10）","en":"AGD × Claude/Codex collaboration (Oct 2026)"}`，`license` 填場景來源那句（已在 `credit`）。
3. `PlayCard`（`en-pages.jsx`）在 `credit` 上方加一行小字：`team · year`；`license` 併入 `credit` 行。只改顯示，不改版面結構。
4. 改完 `.jsx` 要 `node build.mjs`，並把 `index.html`／`pages.jsx` 版本字串從 `20261021c` bump 到 `20261021d`（這兩處是本工單唯一允許碰 `index.html`／`pages.jsx` 的地方）。
5. 新增測試：`play.json` 每款都有 `team`、`year`、`license`、`credit` 四欄，且 `zh`／`en` 都非空字串。

## 3. 驗收條件（每條 yes／no）
1. `data/play.json` 五款都有四欄；每個非 `"待補"` 的值在報告裡都能對到來源檔案路徑與原句。
2. 本機開 `#/play/zone` 與 `#/en/play`，五張卡都看得到 `team · year`。
3. `node --test tests/en-play.test.mjs` 全過；白名單外無變動。

## 4. 失敗路徑
某款完全找不到作者資訊 → 四欄填 `"待補"`，報告列出你翻過的檔案清單，交給使用者補。

## 5. 交件
`work-orders/20261021/reports/WO-03-report.md`，附「欄位 → 來源檔案 → 原句」對照表。
