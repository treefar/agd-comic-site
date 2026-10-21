# WO-03 執行報告

分支 `codex/wo-03-credits`。狀態：完成，3/3（作者待補不視為造假補齊）。未 push、未碰 main。

## 欄位 → 來源 → 原句

| 遊戲／欄位 | 來源檔案與原句 |
|---|---|
| creative-line team 中英、year 2026 | 本工單 §2.2 指定 `動遊系 × Claude／Codex 協作（2026-10）`／`AGD × Claude/Codex collaboration (Oct 2026)`；年份取自同句 |
| creative-line license 中英 | 原 data/play.json credit：`場景為系上實驗室實景照片轉漫畫（沿用《六樓出口》）。`／`Scenes are real photos of our labs turned into comics (shared with Sixth-Floor Exit).` 原封分離到 license |
| creative-line credit 中英 | 原 data/play.json：`原創玩法致敬：電流急急棒（朝日電視台節目單元）。`／`An original homage to the TV-show game Irritating Stick (TV Asahi).` 保留原文 |
| dungeon-chef license 中英 | play/dungeon-chef/assets/fonts/FusionPixel-OFL.txt 第 1、6 行：`Fusion Pixel Font`；`This Font Software is licensed under the SIL Open Font License, Version 1.1.` 中譯只是授權摘要，其他素材明列待補 |
| crunch-defense credit、license 中英 | 原 data/play.json credit 全句保留：`素材授權：BGM 為 CAFOFO（Unity Asset Store 授權）、字型 Cubic 11（OFL）。`／`Assets: BGM by CAFOFO (Unity Asset Store licence), font Cubic 11 (OFL).`；素材佐證 play/crunch-defense/js/audio.js 第 2–3 行 `CAFOFO Casual Music Pack Vol 1，Unity Asset Store 單人商用授權`，play/crunch-defense/assets/fonts/OFL.txt `[Cubic 11]` 與 SIL Open Font License 1.1 字樣 |

四款的 team、year 都填雙語物件 `{zh:"待補",en:"待補"}`。工單 §2.1 說 year 為字串，但 §2.5 驗收要四欄皆有 zh/en，本次採後者以支援相同 t() 顯示與測試。未知 credit/license 也填待補。

翻查：四個入口 index.html、各資料夾檔名清單（README、meta.json、授權、素材 provenance）、six-floor-exit/*.mjs、dungeon-chef/js/*.js、crunch-defense/js/*.js、上述兩份字型授權檔。沒有找到完整遊戲製作者／製作年份。cozy-big-two/index.html 的 `companyName:'Treefar'` 是 Unity 設定，不能證明團隊與作者，沒有拿它填 team；字型檔存在也不自動證明授權。

## 實際指令與輸出

`node --test tests/en-play.test.mjs` 新增欄位測試先紅（creative-line.team.zh undefined），填資料後：

```text
tests 13
pass 13
fail 0
```

`node build.mjs` → exit 0，`bundle.js 已更新`。既有重複 color 警告（合併暫存檔 2182–2183 行）未越界處理。index.html 兩處與 pages.jsx 一處均改成 20261021d。

Playwright 真實開頁，讀取各卡片 team · year（`getByText(...,{exact:true}).count()`）：

```text
#/play/zone {"unknownCards":4,"knownCards":1,"total":5}
#/en/play {"unknownCards":4,"knownCards":1,"total":5}
```

## 逐條驗收

1. yes：五款皆有 team/year/license/credit 雙語非空欄；所有非待補來源列如上，既有 credit 未新增無依據主張。
2. yes：中文與英文頁各五張顯示 team · year。license 併在 credit 行，相同整句去重。
3. yes：13/13。只改指定資料、PlayCard 顯示、版本字串、追加測試，以及 build 必然產物 bundle.js 與本報告（依工單明確要求 build）；未改 src/poster/tier。既有 codex-prompt-run2.txt 未動。

`git diff --stat`：data/play.json 只新增／精簡四欄、en-pages.jsx 3 行、index.html 4 行、pages.jsx 2 行、tests 6 行、bundle.js 4 行；完整統計見提交。

下一步：使用者補四款正式作者／年份，以及 six-floor-exit、cozy-big-two 的素材授權，並補齊地窖大廚其他素材來源。本輪未測 Unity WebGL 壓縮檔載入，屬索引明列的另案。
