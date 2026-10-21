# 系網漫畫版 交接檔（LATEST_HANDOFF）

最後更新：2026-10-21（TF-GO，Claude Fable 5.1 規劃；前段由 Claude Opus 5.5 實作）

## 下一輪第一件事
Codex 讀 `work-orders/20261021/README.md`，依優先序從 **WO-01**（截圖包）開始；每張工單開自己的 `codex/wo-NN-*` 分支，不 push、不碰 `main`。

## 目前狀態
- 分支 `feature/en-site-and-play-zone`，本機最新 `0ec3276`（三個本機提交尚未推：`6e91607`、`8914554`、`0ec3276`；GitHub 上同名分支停在 `0cc8b2e`）。repo 公開，`main` 與線上站未動。
- 英文版 8 頁（`#/en/*`）＋試玩區（`#/play/zone`、`#/en/play`）：本機 `npx --yes http-server -p 8765 -c-1` 可預覽；`node --test tests/en-play.test.mjs` 12/12。
- 《創作不斷線》v2（`play/creative-line/`）：三關三種手感，實景漫畫場景，純文字按鈕，1.8 MB。自動試玩三關皆過；**真手機未測、畫面未目視**。
- 已知未通過：`ui-policy.cjs` 對 4 張實景圖報「非 Codex 來源」，屬使用者 2026-10-21 於對話決定的例外（記在 `play/creative-line/ui-art-manifest.json`）。

## 使用者本輪裁定（不要再問）
- 減少 AI 美術，盡量用系上實景後製；場景沿用《六樓出口》的實景轉漫畫圖。
- 這款遊戲的按鈕與面板比照《六樓出口》用純文字。
- 試玩區選入：創作不斷線、六樓出口、晴日茶桌、地窖大廚、死線防衛隊。
- Dots 暫不使用（工作單 agd-comic-site#1 留著）；不用 Claude API、不用雲端 session；副戰力只用 Codex 與 agy。

## 待使用者決定（工單做完才問）
1. 手機試玩後手感怎麼調（WO-02 面板調完貼回 `tuning.js`）。
2. `_v1-rejected` 29 檔要不要刪（WO-05 清單）。
3. 何時推分支、合併 `main` 上線。
4. 《小朋友齊打交》致敬版規格定案（WO-06）。

## 重要路徑（repo 外，唯讀參考）
- 調研與構想：`C:\agywork\agd-game-research\{codex,agy,claude}\out\`，彙整 `C:\agywork\agd-game-research\彙整報告_系網試玩區.md`
- 關卡設計規格：`C:\agywork\agd-game-research\claude\out\creative-line-levels.md`
- 譯文覆核清單與驗證器：`C:\agywork\agd-en-translate\`
- 18T 遊戲清單：`G:\我的雲端硬碟\_跨機傳輸\18T遊戲清單_給系網調研_20261021.tsv`（147 列，48 列有網頁版）
