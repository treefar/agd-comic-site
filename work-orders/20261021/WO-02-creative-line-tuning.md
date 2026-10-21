# WO-02 《創作不斷線》手感參數外部化＋手機現場調校面板

> 對象：**執行代理 Codex**。驗收者：主控（跑測試與自動試玩）＋使用者（之後拿手機調）。沒有生成模型段落。

## 0. 範圍鎖
- 白名單：`play/creative-line/game.js`、`play/creative-line/index.html`、新增 `play/creative-line/tuning.js`、`tests/en-play.test.mjs`（只准新增測試，不准改既有斷言）。
- 黑名單：`play/creative-line/levels.js`、`masks.js`、`art/**`、`tools/**`、`data/**`、`*.jsx`。
- 禁止：改玩法規則本身（逐格／墨量／彈簧的機制不變）、新增任何程式繪製的圖形（調校面板用純 HTML 表單元素即可，它是除錯工具不是玩家 UI，用 `?tune=1` 才出現）。

## 1. 任務
設計規格（`C:\agywork\agd-game-research\claude\out\creative-line-levels.md` 第 2、3 節，唯讀）明說觸控的抖動閾值與彈簧延遲「必須在手機上試玩調整」。現在數值全寫死在 `game.js`，老師拿手機測時改不了。請把所有手感數值集中到 `tuning.js`，並做一個手機上能直接拉的調校面板，調完能把設定複製出來貼回檔案。

## 2. 規格
1. `tuning.js` 定義 `window.TUNING`，**至少**包含下列鍵（值＝目前 `game.js` 裡的數字，一個都不能改）：
   - `common`: `grabRadius 68`、`touchOffset 40`、`orbHitRadius 10`、`failFreeze 0.25`、`rewind 0.25`、`forgiveAfterFails 2`、`ghostAfterFails 3`、`checkpointAfterFails 6`、`checkpointRatio 0.25`、`maxSpeed 900`
   - `step`: `interval 0.083`、`maxJump 48`
   - `ink`: `sampleMs 50`、`angleMouse 70`、`angleTouch 90`、`costMouse 10`、`costTouch 7`、`regenAngle 30`、`regenPerSample 1.5`、`minSpeed 80`、`lowInk 30`、`shakeInk 15`
   - `spring`: `omega 14`、`zeta 0.85`、`afterimageMinSpeed 100`、`tiltMaxDeg 2.5`、`tiltSpeedDiv 160`
   - `stars`: `maxFails 2`（三星的失誤上限）
   `game.js` 改成讀 `TUNING`，不留任何同義的魔術數字（`grep -n "0.083\|14,\|0.85" game.js` 應只剩註解）。
2. 面板：網址帶 `?tune=1` 才建立，固定在畫面右側，半透明深色底，每個鍵一個 `<input type=range>`（合理的 min／max／step 自訂）＋即時數值；改動立刻生效，不用重新整理。加三顆按鈕：「複製 JSON」（寫到剪貼簿，格式與 `tuning.js` 的物件一致）、「還原預設」、「收合」。觸控裝置上可拖動面板。
3. 統計列（面板頂端，不需 `?tune=1` 也要在 `window.__cl.stats` 讀得到）：本關失誤數、本關秒數、抖動扣墨次數、彈簧平均落後（目標點與光點距離的移動平均，px）、每秒步數（逐格關）。
4. 持久化：面板改過的值存 `localStorage` 鍵 `cl-tuning`，下次載入套用；「還原預設」會清掉。正式玩家（沒帶 `?tune=1`）不讀這個鍵，確保公開版手感一致。
5. `window.__cl` 新增 `tuning`（目前生效的物件）與 `stats`。
6. 新增測試（`tests/en-play.test.mjs`）：讀 `tuning.js` 文字，斷言第 1 點列出的每個鍵都存在且為數字；讀 `game.js`，斷言不再出現字面 `0.083`、`omega`／`zeta` 以外的 `14`＋`0.85` 組合（寫法由你決定，但要能抓到「有人又把數字寫死回去」）。

## 3. 驗收條件（每條 yes／no）
1. `tuning.js` 存在，鍵齊全，數值與改動前 `game.js` 完全相同（報告要貼對照表）。
2. 不帶 `?tune=1` 時畫面與行為與改動前一致：用 WO-01 的方法或自己寫的自動試玩，三關沿 `path` 都能 `won`、失誤 0。
3. `?tune=1` 時面板出現；拉動 `ink.costTouch` 後，連續抖動的扣墨量立刻改變（報告附前後數據）。
4. 「複製 JSON」產生的文字能直接貼回 `tuning.js` 且頁面正常載入。
5. `node --test tests/en-play.test.mjs` 全過（含新增測試）；白名單外無變動。

## 4. 失敗路徑
剪貼簿 API 在 `http://127.0.0.1` 被擋 → 改成把 JSON 顯示在 `<textarea>` 讓人手動全選複製，並在報告註明。其餘做不到就交部分並寫明卡在哪一條。

## 5. 交件
`work-orders/20261021/reports/WO-02-report.md`，附：鍵值對照表、三關自動試玩結果、面板截圖一張（可用 WO-01 的工具）。
