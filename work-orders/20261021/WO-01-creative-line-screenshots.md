# WO-01 《創作不斷線》全畫面截圖包（目視驗收用）

> 對象：**執行代理 Codex**。驗收者：使用者（看截圖）。沒有生成模型段落。

## 0. 範圍鎖
- 白名單（可新增）：`docs/qa/creative-line/20261021/**`、`tools/qa/shoot-creative-line.mjs`、`package.json`（只准加 devDependency 與 script）、`.gitignore`（只准加 `node_modules/`）。
- 黑名單：`play/**`、`data/**`、`*.jsx`、`bundle.js`、`index.html`、`styles.css` 一律不改。遊戲行為不對就寫進報告，不要順手修。
- 禁止：開啟任何編輯器 GUI、改全域設定、push。
- 截圖只能用真實瀏覽器算出的畫面，不得用程式合成或修圖。

## 1. 任務
主控從未親眼看過 v2 的遊戲畫面（瀏覽器窗格被隱藏，截圖只拿到舊畫面）。請用無頭瀏覽器把每個狀態、兩種語言、兩種視窗各截一張，做成一頁對照表，讓使用者 5 分鐘內看完全部畫面。

## 2. 規格
1. 工具：優先 `npx --yes playwright@1.58.0 install chromium` 後用 Playwright；若下載被沙箱擋，改用本機 Chrome／Edge 的 `--headless=new --screenshot`；兩者都不行就交 `blocked` 報告。版本以你實際裝到的為準，寫進報告。
2. 伺服器：repo 根目錄 `npx --yes http-server -p 8765 -c-1 --silent`，頁面 `http://127.0.0.1:8765/play/creative-line/index.html`（英文加 `?lang=en`）。
3. 狀態操控全部走頁面暴露的 `window.__cl`（唯讀遊戲程式，先讀 `play/creative-line/game.js` 最底部那段看有哪些方法）：`newGame()`、`startLevel(i)`、`play()`、`setTarget(x,y)`、`step(dt)`、`path`、`state`。沿 `path` 餵 `setTarget` 加 `step(1/60)` 可自動過關；要「失敗瞬間」就 `setTarget(orb.x, 5)` 往上撞。
4. 必拍清單（每張檔名固定 `<lang>-<viewport>-<state>.png`）：
   - `cover`
   - `L1-ready`、`L1-play`（走到路程一半）、`L1-fail`（失敗後 0.1 秒內，要看到火花）、`L1-card`
   - `L2-ready`、`L2-play-ink`（拖出墨線後）、`L2-lowink`（墨量 < 30，可連續抖動製造）、`L2-card`
   - `L3-ready`、`L3-play-spring`（彈簧線拉開、畫面有傾斜）、`L3-card`
   - `final`
   - `paused`（任一關放手後）
   - 共 14 個狀態 × 2 語言（`zh`、`en`） × 2 視窗（`desktop` 1280×720；`mobile` 390×844、`deviceScaleFactor 2`、`isMobile`＋`hasTouch`）＝ 56 張。
5. 每張截圖同時記錄主控台 error 與 404，彙整到 `console.txt`；外部字型與 `unpkg.com` 的網路錯誤可忽略但要列出。
6. 產出 `docs/qa/creative-line/20261021/index.html`：純靜態對照表，列（狀態）× 欄（zh 桌機、zh 手機、en 桌機、en 手機），每格縮圖點開看原圖；頁首寫拍攝時間、瀏覽器版本、commit。這是 QA 文件不是遊戲 UI，可用簡單 HTML 表格。
7. 腳本 `tools/qa/shoot-creative-line.mjs` 要能重跑：`node tools/qa/shoot-creative-line.mjs --out docs/qa/creative-line/<日期>`。

## 3. 驗收條件（每條 yes／no）
1. `docs/qa/creative-line/20261021/` 內 PNG 剛好 56 張，檔名符合第 2 點格式。
2. `index.html` 開啟後 56 格都有圖，沒有破圖。
3. `console.txt` 裡，站內（`127.0.0.1:8765`）的 404 為 0；JS error 為 0。不是 0 就逐條列出，不要修。
4. `L1-fail` 四張都看得到火花圖（`art/fx2/spark.png`）；`L3-play-spring` 四張都看得到虛線彈簧線。
5. `node --test tests/en-play.test.mjs` 全過；白名單外 `git status` 無變動。

## 4. 失敗路徑
Playwright 與 Chrome 都不可用 → 交 `WO-01-report.md` 寫明錯誤全文與試過的指令，狀態 `blocked`。部分狀態截不到（例如 `L2-lowink` 抖不出來）→ 其餘照交，缺的標在 `index.html` 對應格並寫原因。

## 5. 交件
`work-orders/20261021/reports/WO-01-report.md`，含 `index.html` 的相對路徑與你自己看過後認為「畫面明顯有問題」的 3 件事（沒有就寫沒有）。
