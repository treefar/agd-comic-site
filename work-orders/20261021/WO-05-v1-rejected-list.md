# WO-05 舊版 AI 美術 `_v1-rejected` 移除清單（只列、不刪）

> 對象：**執行代理 Codex**。驗收者：使用者（在對話確認清單後，刪除另外派）。沒有生成模型段落。

## 0. 範圍鎖
- 白名單：新增 `work-orders/20261021/DELETE-LIST-creative-line-v1.tsv` 與 `DELETE-LIST-creative-line-v1.md`。
- 黑名單：**其他一切**。本工單不得 `git rm`、不得 `Remove-Item`、不得移動任何檔案。
- 禁止：把清單寫成「建議刪除」以外的語氣；不得先刪再補清單。

## 1. 任務
`play/creative-line/_v1-rejected/`（29 個檔）是使用者 2026-10-21 退回的第一版 AI 生圖與對應程式（封面、三張路線圖、UI 與特效圖集、兩張課程卡、`routes.js`、`mask-seeds.json`）。repo 是公開的，推上去這些圖就會一起公開。依全域規則，一次刪 20 檔以上要先列清單給使用者確認。請產出可直接審核的清單。

## 2. 規格
1. `DELETE-LIST-creative-line-v1.tsv`：UTF-8 無 BOM、`\n` 換行，欄位 `相對路徑 \t 位元組 \t SHA-256 \t 理由 \t 復原方式`。
   - 理由統一寫 `2026-10-21 使用者退回：受眾不喜歡 AI 生成圖，改實景後製`。
   - 復原方式寫 `git show 8914554:<原路徑>`（原路徑＝搬家前的 `play/creative-line/art/...` 或 `routes.js`；用 `git log --follow` 查出來，每筆都要對）。
2. `DELETE-LIST-creative-line-v1.md`：給人看的摘要（檔數、總位元組、裡面有哪幾類圖），加一段「建議的刪除指令」（字面路徑、一行一檔，不用變數），以及「刪除後要跑的驗證」：`node --test tests/en-play.test.mjs`、`node C:/AIHome/claude/skills/game-ui-art/scripts/ui-policy.cjs --project play/creative-line`（後者預期仍因實景圖報 4 筆錯，屬已知例外）。
3. 另外檢查並寫進 md：repo 內還有沒有任何檔案引用 `_v1-rejected`、`art/web/`、`art/ui/`、`art/fx/`、`routes.js`、`mask-seeds.json`（`grep -rn` 排除 `_v1-rejected` 自己與 `work-orders/`）。有就列出來，這些引用也要一併處理才算乾淨。

## 3. 驗收條件（每條 yes／no）
1. TSV 列數 ＝ `_v1-rejected` 實際檔數（29）；每列 SHA-256 與現檔一致（報告附重算指令與結果）。
2. 每列的 `git show` 復原指令實際跑一次都能輸出內容（抽 3 筆貼證據）。
3. 第 3 點的引用掃描結果寫在 md，並說明是否為 0。
4. `git status` 只有兩個新增檔。

## 4. 失敗路徑
`git log --follow` 追不到原路徑 → 該筆復原方式改寫 `git show 0ec3276:<現路徑>`，並在 md 標註。

## 5. 交件
`work-orders/20261021/reports/WO-05-report.md`。刪除本身**不在本工單內**。
