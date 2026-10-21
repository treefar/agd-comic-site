# 系網改版工單索引（2026-10-21，TF-GO，規劃：Claude Fable 5.1；執行：Codex）

## 給執行代理（Codex）的共同規則：每張工單都適用

1. **先讀**：本檔、該張工單全文、repo 根目錄 `LATEST_HANDOFF.md`。`C:\AIHome\codex\AGENTS.md` 的全域規則照舊適用（繁體中文、不編造、驗證要有實際輸出）。
2. **分支**：從 `feature/en-site-and-play-zone` 開 `codex/wo-NN-<短名>`，一張工單一條分支、一個以上 commit；**不得 push、不得碰 `main`、不得合併**。commit 訊息繁體中文，結尾加 `Co-Authored-By: Codex <noreply@openai.com>`。
3. **範圍鎖優先**：只改該工單第 0 節白名單列出的路徑；白名單外 `git status` 出現任何變動，先還原再交件。
4. **不得刪檔**：要移除的東西只列清單（路徑、SHA-256、理由、復原方式），由使用者在對話確認後才動。
5. **美術硬線**：不得新增任何由程式畫出的美術（Canvas／SVG 繪圖、Pillow、Node Canvas）；畫面上的圖只能是 `play/creative-line/art/` 既有檔案。本輪工單不需要生圖，也不要叫任何生圖工具。
6. **驗證要跑真的**：每張工單的驗收條件逐條回答 yes／no，附實際指令與輸出摘錄。`node --test tests/` 必須維持全過。本機預覽用 `npx --yes http-server -p 8765 -c-1`（repo 根目錄）。
7. **做不到就交部分**：在交件報告寫「卡在哪一條、試過什麼」，不可用近似品替代而不說明。
8. **交件格式**：每張工單在 `work-orders/20261021/reports/WO-NN-report.md` 寫報告：做了什麼、改了哪些檔（`git diff --stat`）、驗收逐條 yes／no、沒做的與原因、下一步建議。最後回覆只列 `WROTE <路徑>` 清單與「我最不確定的一件事」。

## 工單清單（依優先序）

| 編號 | 標題 | 優先 | 預估 | 需要使用者介入 |
|---|---|---|---|---|
| [WO-01](WO-01-creative-line-screenshots.md) | 《創作不斷線》全畫面截圖包（目視驗收用） | P0 | 1～2 小時 | 否 |
| [WO-02](WO-02-creative-line-tuning.md) | 手感參數外部化＋手機現場調校面板 | P0 | 2～3 小時 | 否（調校本身要使用者拿手機做） |
| [WO-03](WO-03-play-credits.md) | 試玩區四款遊戲的作者署名與授權欄 | P1 | 1 小時 | 查不到的欄位要使用者補 |
| [WO-04](WO-04-en-check-review.md) | 英文譯文 `[CHECK]` 第一批覆核（獎項與機構官方英文名） | P1 | 2～3 小時 | 否 |
| [WO-05](WO-05-v1-rejected-list.md) | 舊版 AI 美術 `_v1-rejected` 移除清單（只列不刪） | P2 | 30 分鐘 | 是（確認後才刪） |
| [WO-06](WO-06-fighter-homage-spec.md) | 《小朋友齊打交》致敬版：三方構想合併成單一規格（不寫程式） | P2 | 2 小時 | 規格寫完要使用者定案 |

**不派給 Codex 的事**（寫在這裡避免重複開單）：真手機試玩與手感定案（使用者）；GitHub Pages 上 Unity WebGL 壓縮檔實測（要先決定推不推公開 repo，使用者）；18T 的 48 款網頁版篩選（檔案只在 TF-BASE 讀得到）；隱藏彩蛋的實驗室冷知識文案（要系上老師確認）；UI 規範檢查工具 `ui-policy.cjs` 對實景圖報錯（屬全域 skill，使用者已於對話決定例外，不改工具）。

## 現況摘要（Codex 開工前要知道的）

- 專案：`C:\Projects\系網漫畫版_AGDComicSite`，分支 `feature/en-site-and-play-zone`，最新提交 `0ec3276`，已推上 GitHub 同名分支（repo 公開；`main` 未動、網站未上線）。
- 英文版 8 頁在 `en-pages.jsx`，資料 `data/en/*.json`（agy 初譯，513 處 `[CHECK]` 待覆核，畫面會隱藏標記）。
- 試玩區：`data/play.json` 五款（創作不斷線、六樓出口、晴日茶桌、地窖大廚、死線防衛隊），成品在 `play/`。
- 《創作不斷線》v2：`play/creative-line/`，三關三種玩法（逐格／墨量／彈簧），場景沿用六樓出口實景漫畫圖，按鈕純文字，載入 1.8 MB。設計規格在 `C:\agywork\agd-game-research\claude\out\creative-line-levels.md`（repo 外，唯讀參考）。
- 打包：改任何 `.jsx` 後跑 `node build.mjs`，再把 `index.html` 與 `pages.jsx` 的版本字串 `20261021c` 往後 bump。`play/creative-line/` 是獨立網頁，不經打包。
- 測試：`node --test tests/`（目前 12/12）。
