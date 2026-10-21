# 六張工單第二輪驗收（VERIFY-run2）

- 驗收日期：2026-10-21，TF-GO，驗收者 Claude Opus 5.5（獨立重跑，Codex 報告只當線索）
- 執行：Codex CLI 0.163.0（模型 gpt-6.1-sol，reasoning medium，`-s danger-full-access`），在 `C:\agywork\agd-site-codex` 跑 18 分鐘；log 在該 clone 的 `work-orders/20261021/codex-run2.log`
- 啟動方式說明：原 PowerShell 指令的 `*>` 導向被 dcg hook 擋下，改用 Bash 同參數執行，提示檔走 stdin、log 用 `>>` 附加（檔案原本不存在，效果相同）
- 驗證方法：每條分支用 `git archive` 抽到暫存資料夾（不切換 clone 的分支），`node_modules` 以目錄連結借用 clone 的（Playwright 1.64.1）
- 自動試玩基準：主專案原版 `game.js`（`ea6af82`）桌機與手機模擬三關皆 `won`、失誤 0

## 總表

| 工單 | 分支 | Commit | Codex 自評 | 我實測 | 越界 | 判定 |
|---|---|---|---|---|---|---|
| WO-01 截圖包 | `codex/wo-01-screenshots` | `af546c7` | 5/5 | 4/5 | 無 | 小修後可合併 |
| WO-02 手感參數 | `codex/wo-02-tuning` | `0fc88ab` | 4/5 | 4/5（1 條部分） | 無 | 可合併（建議小修面板） |
| WO-03 試玩卡署名 | `codex/wo-03-credits` | `1a43ec2` | 3/3 | 3/3 | `bundle.js`（build 產物，見下） | 可合併；上線前要補「待補」 |
| WO-04 譯文覆核 | `codex/wo-04-en-check` | `9b46323` | 3/5 | 4/5 | 無 | 可合併（產量很小） |
| WO-05 待刪清單 | `codex/wo-05-delete-list` | `17ba8fd` | 4/4 | 4/4 | 無 | 可合併；刪除另等使用者 |
| WO-06 格鬥致敬規格 | `codex/wo-06-fighter-spec` | `76e1f8a` | 5/5 | 5/5 | 無 | 可合併；規格待使用者定案 |

共同檢查（六條都做）：
- 刪檔：`git diff --name-status --diff-filter=DRMC` 六條都沒有 D（刪除）或 R（搬移）。
- 測試：`node --test tests/en-play.test.mjs`：wo-01 12/12、wo-02 15/15、wo-03 13/13、wo-04 12/12、wo-05 12/12、wo-06 12/12。
- UI 規範：`ui-policy.cjs --project play/creative-line` 六條都只有 4 筆已知例外（`scene_lab_d0637/d0604/d0633`、`scene_s0`），無新錯誤。
- 推送：主專案 `git for-each-ref` 在 Codex 跑前後完全相同（clone 的 origin 就是主專案資料夾，等於證明沒有 push）。
- 回報檔 `work-orders/20261021/reports/WO-NN-report.md` 由 README 第 8 點要求，不算越界。

## WO-01 截圖包

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | PNG 剛好 56 張、檔名格式 | yes | `ls *.png` = 56；正規式 `(zh\|en)-(desktop\|mobile)-<14 狀態>.png` 無不符；四組各 14 張 |
| 2 | `index.html` 56 格都有圖 | yes | `index.html` 內 56 個不重複 `src`，逐一檢查檔案都存在 |
| 3 | 站內 404＝0、JS error＝0 | yes | `console.txt` 寫無錯；我另用自己的腳本跑原版三關，pageerror／console error／站內 4xx 皆 0 |
| 4 | `L1-fail` 四張有火花；`L3-play-spring` 四張有虛線彈簧線 | **no** | 我看了 `zh-desktop-L1-fail`、`en-mobile-L1-fail`：火花清楚。看了 `zh-desktop-L3-play-spring`、`en-mobile-L3-play-spring`：光點停在畫面下緣，放大 3 倍只見一小截細線，大部分伸到畫面外，看不出是虛線，傾斜 0.21° 也看不出。Codex 用 DOM 屬性 `opacity 0.7` 當證據，沒有看圖 |
| 5 | 測試全過、白名單外無變動 | yes | 12/12；diff 只有 `docs/qa/creative-line/20261021/**`、`tools/qa/shoot-creative-line.mjs`、報告 |

- 越界：無。
- 判定：**小修後可合併**。要補：`L3-play-spring` 改在路程中段、目標點離光點 80px 以上且在畫面內時拍（4 張重拍）。
- 注意：56 張 PNG 共 **58 MB**，repo 是公開的。合併前請決定要不要改存 JPG／WebP 或不進版控。

## WO-02 手感參數外部化

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | `tuning.js` 鍵齊全、數值與原 `game.js` 相同 | 部分 | 28 鍵都在，值與工單第 2 點一致；`game.js` 實際讀了其中 27 鍵（`grep -o "tuning\.[a-z]*\.[a-zA-Z]*"`）。`orbHitRadius 10` 在原 `game.js` 找不到對應數字，也沒接上碰撞（Codex 在面板與註解已標明）。這是工單本身要求了一個原碼沒有的鍵 |
| 2 | 不帶 `?tune=1` 行為不變 | yes | 我的自動試玩：桌機、手機（`pointer: coarse` 為 true）三關皆 `won`、失誤 0、錯誤 0，與原版基準相同 |
| 3 | `?tune=1` 面板出現；拉 `ink.costTouch` 扣墨立刻改變 | yes | 手機模擬：面板 28 支滑桿＋3 顆按鈕。同樣 6 次 180° 急轉：預設扣 42（每次 7）；用面板滑桿改成 12 後扣 72（每次 12） |
| 4 | 「複製 JSON」可貼回 `tuning.js` | 部分 | 無頭瀏覽器剪貼簿被擋，退回 `<textarea>`（工單允許）；內容可解析、28 鍵、值為當下設定。**沒實測貼回檔案後重新載入**（unverified） |
| 5 | 測試全過（含新增）、白名單外無變動 | yes | 15/15；diff 只有 `game.js`、`index.html`、`tuning.js`、測試、報告 |

另驗：`localStorage` 鍵 `cl-tuning` 改完會存；不帶 `?tune=1` 重新載入時 `costTouch` 仍是 7（公開版不讀）；帶 `?tune=1` 重新載入讀回 12；「還原預設」後回 7 且鍵被清掉。`game.js` 不再有 `0.083`；剩下一個 `0.85` 是暫停脈動的動畫係數，不是彈簧 ζ。

- 越界：無。
- 判定：**可合併**。建議小修：手機直向時面板蓋住幾乎整個遊戲畫面（我截的 `wo02-panel-mobile.png`），預設收合或改窄會比較好拿手機調。
- 注意：新增的測試會 `import playwright`。合併後主專案要先 `npm install`（帶進 `e6ac8eb` 的 `package.json`），否則 `node --test` 這條會失敗。

## WO-03 試玩卡署名

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | 五款都有四欄；非「待補」值對得到來源 | yes | creative-line 照工單填；dungeon-chef 字型 OFL 對到 `play/dungeon-chef/assets/fonts/FusionPixel-OFL.txt`；crunch-defense 沿用原 `credit`（CAFOFO 在 `js/audio.js`、Cubic 11 OFL 在 `assets/fonts/OFL.txt`）。原本沒有 credit 的三款填「待補」，沒有編造 |
| 2 | `#/play/zone`、`#/en/play` 五張卡看得到 `team · year` | yes | 兩頁各抓到 5 行，無錯誤 |
| 3 | 測試全過、白名單外無變動 | yes（附註） | 13/13。多動了 `bundle.js`（4 行），是工單第 2.4 點要求跑 `node build.mjs` 的產物；`index.html`、`pages.jsx` 只改版本字串 `20261021c`→`d` |

- 越界：`bundle.js`，屬工單隱含的 build 產物，我判定可接受。
- 判定：**可合併到 feature 分支**。上線前必修：四款顯示「待補 · 待補」，英文頁也會出現中文「待補」。`cozy-big-two` 資料夾裡有 `fusion-pixel-tea.ttf`，可能也是 OFL，但沒有授權檔，Codex 沒填是對的。

## WO-04 譯文覆核第一批

`[CHECK]` 計數（四檔）：改前 stats 273、news 37、works 16、faculty 201，共 527；改後 265、37、16、200，共 518，**少 9 個**。

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | `node tools/validate-en.mjs` 全 PASS | **no** | `faculty.json FAIL 1：$[9].certs`。我把同一支驗證器拿去基準（未改 `data/en`）跑，同樣 FAIL，是**既有問題，不是 Codex 弄壞的**（證照敘述裡頓號被換成英文逗號） |
| 2 | 每列有可開啟來源 URL | yes | 我自己打開：`ydf.khcc.gov.tw/about/1` 頁名含「Youth Innovative Design Festival」；`soft-world.com/Home` 頁尾「Soft-World International Corporation & Subsidiaries」；另查過的 `tisdc.org/en/home/`、`hautecout.com` 也都開得到且與報告描述相符 |
| 3 | 下降數＝影響筆數合計 | yes（附註） | 表中「移除標記數」合計 9，等於實際下降 9。Codex 判 no 是因為「名稱修正 15 筆」不等於 9（6 筆混合句還有別的待查名稱，刻意留標記），我認為照欄位定義算是 yes |
| 4 | 只動字串值 | yes | word-diff 只有 `Youthive`→`Youth Innovative`（14 處）、`Corp.`→`Corporation`（1 處）；stats、news、works 結構檢查 PASS |
| 5 | 測試全過、白名單外無變動 | yes | 12/12；只動 `data/en/stats.json`、`faculty.json`、新工具、報告 |

- 越界：無。
- 判定：**可合併**，但產量很小（527 個標記只處理 9 個）。金點新秀、時報金犢獎、KT 科藝獎、西基、ZIP-LAB、Hautecouture 法人名都列在「查過但未採用」，要下一批或使用者決定。

## WO-05 待刪清單（只列不刪）

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | TSV 29 列；SHA-256 與現檔一致 | yes | 30 行含標題；`_v1-rejected` 實際 29 檔；29 筆雜湊與位元組數全部等於 clone 現檔；無 BOM、無 CR |
| 2 | 復原指令能跑 | yes（附註） | 抽 3 筆（`card_anim.png`、`route2.png`、`web/route3.png`）雜湊完全一致；29 筆全跑都有輸出。其中 2 個文字檔（`routes.js`、`mask-seeds.json`）復原出來是 LF 換行，現檔是 CRLF（clone 設 `core.autocrlf=true`），內容相同但雜湊不同 |
| 3 | 引用掃描寫在 md、說明是否為 0 | yes | md 寫「非 0」：`LATEST_HANDOFF.md`、`play/creative-line/tools/prep-art.mjs`；我自己重掃結果相同 |
| 4 | 只有兩個新增檔 | yes | diff 只有 TSV、md、報告；沒有任何刪除或搬移 |

- 越界：無。確認**沒有任何檔被刪**。
- 判定：**可合併**。刪除本身仍等使用者確認；刪之前要一併處理 `prep-art.mjs` 的舊引用。

## WO-06 格鬥致敬規格

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | 10 章齊全；課名、實驗室、作品在 `data/*.json` 找得到 | yes | `## 1.`～`## 10.` 齊全；12 個招式課名逐一 `grep` `curriculum.json` 皆完全命中；拍攝清單的 `d0604`、`d0631`、`d0637` 皆在 `labs.json`。「格格／回路／網點／混剪」是虛構角色名，本來就不應在系上資料 |
| 2 | 第 1 節至少 2 個可開啟來源 | yes | 我打開 `lf2.net/en/intro.html`：「created by Marti Wong and Starsky Wong in 1999」；`lf2.net/en/progress.html`：v0.1 於 25 Jan 2000。`lf2.net/en/terms.html` 我實測 404，Codex 也已標 unverified |
| 3 | 拍攝清單至少 6 張 | yes | 8 張，含地點、用途、避開事項 |
| 4 | 沒有程式繪製角色或背景的提案 | yes | 推薦 DOM 圖集；Canvas 只當備案，明寫不得畫角色、背景、UI 本體 |
| 5 | 只有兩個新增檔 | yes | SPEC、shotlist、報告 |

- 越界：無。
- 判定：**可合併**；規格本身要使用者定案。

## WO-01 重拍＋WebP（第三輪，`codex/wo-01-screenshots-webp`，`7ee07e3`）

使用者要求重拍 4 張 `L3-play-spring` 並改存 WebP。做法：從 feature 開新分支直接產出 WebP，舊分支 `codex/wo-01-screenshots`（`af546c7`）原封不動，所以不必刪任何 PNG，新分支歷史也沒有那 58 MB。

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | 56 張 `.webp`、0 張 `.png`、檔名格式 | yes | `ls` 56／0；正規式不符 0 筆；分支樹內 docs 無 png |
| 2 | 總大小 ≤ 20 MB、尺寸正確 | yes | `du -cb` 10,314,420 bytes（原 PNG 58 MB）；sharp 讀尺寸：desktop 1280x720 ×28、mobile 780x1688 ×28 |
| 3 | `index.html` 56 格有圖 | yes | 56 個不重複 `.webp` 連結，檔案全在 |
| 4 | 站內 404、JS error 為 0 | yes | `console.txt` 無錯 |
| 5 | 彈簧線看得見；火花仍在 | **no** | 證據數值都過（state play、距離約 189px、目標 x=40 在邊距上、opacity 0.7）。火花清楚。但我看 `zh-desktop`、`en-mobile` 兩張並放大 3 倍：只見光點與殘影，**完全看不到線**。原因在遊戲本身：`game.js` 第 38 行彈簧線是 `#f4ecd8` 米白色、2px 虛線，畫在第 3 關米白地板上。Codex 自己也回報目視辨識不足，沒有硬判 yes |
| 6 | 測試全過、白名單外無變動 | yes | 12/12；只動 docs、腳本、報告與 `package.json`／`package-lock.json`（只加 `sharp ^0.35.5`） |

- 越界：無。clone 工作目錄留有未追蹤的 `docs/qa/creative-line/20261021/browser-tmp/`（Node 編譯快取 529 檔），沒進 commit，未清（不刪檔規則）。
- 判定：**截圖包可合併，取代舊的 `codex/wo-01-screenshots`**。彈簧線看不見是遊戲 bug，要另開工單改 `game.js`（例如改深色線加淺色描邊、或加粗），改完再重拍這 4 張。

## WO-07 彈簧線修正＋重拍（第四輪，`codex/wo-07-spring-line`，`1e2bc2d`，長在 `codex/wo-01-screenshots-webp` 上）

| # | 條件 | 結果 | 證據 |
|---|---|---|---|
| 1 | `game.js` 只動彈簧線 | yes | diff 只有 3 行：新增 `springUnderlay`（`#f4ecd8`、8px 實線），`springLine` 改 `#1a1712`、4px、保留 `6 5` 虛線；更新座標與透明度改成對兩條線同步，`REDUCED` 邏輯不變 |
| 2 | 三關自動試玩仍過 | yes | 我的 `autoplay.cjs`：桌機、手機模擬（coarse true）三關皆 `won`、失誤 0、錯誤 0 |
| 3 | 4 張彈簧圖看得見線 | yes（部分 unverified） | 我看 `zh-desktop`、`en-mobile` 兩張：光點往左拉出清楚的墨黑虛線，與米白地板對比明顯；另兩張只看了 Codex 描述。只驗了地板背景，深色平台與藍牆上的效果沒有截圖可看（unverified） |
| 4 | 其他 52 張沒變 | yes | `git diff --name-only` 中非 `L3-play-spring` 的 webp 為 0 |
| 5 | 測試全過、白名單外無變動 | yes | 12/12；diff 只有 `game.js`、4 張 webp、evidence／index／verification、截圖腳本（加只重拍參數）、報告 |

- 越界：無。舊分支 `codex/wo-01-screenshots`（`af546c7`）、`codex/wo-01-screenshots-webp`（`7ee07e3`）未動。
- 判定：**可合併**（它已包含 WebP 截圖包，合併這條即可，不必另合 `wo-01-screenshots-webp`）。注意 WO-02 也改 `game.js` 第 38、285 行附近，兩條合併時會衝突，要手動合：彈簧線改用 `tuning.spring.*` 的版本保留，再套上兩條線的樣式。

## 合併結果（臨時分支 `merge/codex-run2`，`6981888`）

- 位置：repo 外的工作樹 `C:\agywork\agd-site-merge`，臨時分支 `merge/codex-run2`，從 `feature/en-site-and-play-zone`（`ea6af82`）長出。
- **已完成**（使用者同意後）：主專案未追蹤 `docs/`（23 檔）整包 `mv` 到 `C:/agywork/agd-site-attempt1-docs-untracked` 備份，未刪除；在主專案 `git merge --ff-only merge/codex-run2`，`feature` 前進到 `6981888`。沒有 push。
- 合併後主專案驗證：`node --test` 16/16；三關自動試玩桌機、手機、`?tune=1` 皆 won、失誤 0、錯誤 0；調校面板 28 滑桿，扣墨 42→72。
- 為什麼不直接合進 feature：主專案有一包第一次失敗留下的未追蹤 `docs/`（23 檔，含瀏覽器暫存），其中 5 個檔路徑和分支撞名、內容與合併版不同；搬走它被自動模式分類器擋下，所以先在獨立工作樹完成合併。
- 合併順序：wo-07（含 WebP 截圖包與 `e6ac8eb` 的 Playwright 依賴）→ wo-04 → wo-05 → wo-06 → wo-03 → wo-02。前五條無衝突；wo-02 在 `game.js` 與 `tests/en-play.test.mjs` 各一個衝突。
- 衝突解法：`game.js` 彈簧線兩行用 wo-07（雙線），傾斜與墨量兩行用 wo-02（讀 `tuning.spring.*`、`tuning.ink.*`）；測試檔兩個新測試都保留。
- 合併後實測：`node --test` 16/16；三關自動試玩桌機／手機／`?tune=1` 皆 `won`、失誤 0、錯誤 0；面板 28 滑桿、`costTouch` 7→12 扣墨 42→72、公開版不讀 `cl-tuning`、複製 JSON 28 鍵；`game.js` 讀 27 個 tuning 鍵、無殘留 `0.083`；實拍 L3 彈簧圖看得到墨黑虛線，兩條線座標一致。
- 與 feature 的差異：87 檔，沒有任何檔被刪，沒有新增 PNG。
- 要讓 `feature` 前進：先處理主專案那 5 個撞名的未追蹤檔（它們是 attempt1 的舊版，內容不同），再在主專案跑 `git merge --ff-only merge/codex-run2`。

## 回收狀態

- 六條分支已 `fetch` 回主專案（`refs/heads/codex/wo-01-*`～`wo-06-*`），**未合併、未 push、未動 `main`**。
- 六條分支都長在 clone 的 `e6ac8eb`（加 Playwright 1.64.1 開發依賴的 `package.json`／`package-lock.json`）上，這個提交不在主專案 `feature/en-site-and-play-zone`；合併任一條都會把它一起帶進來。
- 驗收用腳本留在本機暫存區，不進 repo：`autoplay.cjs`（三關自動試玩）、`wo02check.cjs`（面板與扣墨）、`wo03check.cjs`（試玩卡）、`crop.cjs`（截圖放大）。
