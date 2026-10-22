# 系網漫畫版 交接檔（LATEST_HANDOFF）

最後更新：2026-10-22，TF-GO／Codex（僅英文版獲授權公開發布；遊戲留本機）。

## 2026-10-22 職稱更新與英文一致性方向

- 使用者要求中英文移除鄧樹遠「電競代理主任」。正式站已發布56b61b92f595ba503924dbd7b81d5b94a511dd6c，Pages run 39738977558成功；中文為「系主任 · 副教授」，英文為「Department Chair · Associate Professor」。首頁靜態師資卡、中文師資JSON、英文師資JSON三處均已改。
- 正式站HTTP200的中英JSON已重新讀取比對；首頁與app-KQGOEBYM.js不含舊職稱。npm run build、npm run check成功，發布測試5/5。
- 本機整合版分支codex/remove-acting-chair-local，程式提交4debed0；clone已從主專案本機fetch同步；試玩包解壓副本的bundle.js、index.html、中英師資JSON也已更新。歷史ZIP未重打包，遊戲未公開。
- 使用者詢問英文版盡量保留中文介面與資訊是否可行：可行；目前英文用獨立En元件與七頁分類，新聞只顯示10筆、論文只顯示前5筆，與中文詳情頁有差異；共用頂部導覽、頁尾、浮動按鈕仍是中文。後續宜共用元件與資料結構並完整翻譯導覽、詳情及按鈕；本輪尚未執行這項版型重構。

## 2026-10-22 英文版已獨立上線（遊戲保留本機）

- 使用者於2026-10-22對話明確授權：本次只將英文版合併並推上main上線；遊戲不發布，保留線上既有更新。此授權僅適用本次英文版，其餘C節待決項不變。
- 以遠端main的49adae7acf4d2daddaebd61d741380f4a663029b為底，建立codex/en-publish-only；工作樹C:/agywork/agd-en-publish。
- 已公開提交8f16c20b1676a8c25a00d88659f39f086d19417c；git push origin HEAD:main成功（一般fast-forward）。GitHub Pages run 39727684727成功，網址https://github.com/treefar/agd-comic-site/actions/runs/39727684727。
- 英文入口：https://treefar.link/agd-comic-site/#/en/intro 。七分頁：intro、highlights、faculty、curriculum、labs、works、visit；保留main既有英文首頁內容，新增導覽及其餘頁面。中文資料與app、共用元件、首頁章節、styles.css均與原main一致。
- 英文圖片依每筆slug/id使用main既有照片，沒有移入遊戲資產。線上data/play.json與play/creative-line/index.html均HTTP404；線上app-WFAVOGDV.js與本機建置位元組相同。
- npm run build、npm run check:report成功；node --test tests/en-release.test.cjs 5/5；本機桌機1440與手機390共14組頁面驗證通過。既有duplicate color警告未改；真手機未測。
- 原feature/en-site-and-play-zone仍保留完整遊戲整合版；不可把整條feature直接合進main，會帶回舊版站台與尚未核准發布的遊戲。未來遊戲上線也應從當時最新main另開分支選移。
- 本次範圍只推上述英文發布提交。遊戲、舊美術刪除、真手機手感、格鬥規格、未知授權與清理均未處理。
- 驗收報告與截圖：本次Codex對話outputs/en-release/VERIFY-en-release.md、smoke.json、live-delivery.json。

## 下一輪第一件事
1. 使用者試玩：完整解壓 AGDComicSite-Playtest-20261021.zip，雙擊 START.cmd 進入五款試玩區。試玩包位於本次Codex對話outputs/run4/，ZIP約60MB；完整SHA256見下。
2. 接手代理先讀 work-orders/20261022/VERIFY-run4.md 與 run4/acceptance.json；報告附逐項yes/no、真實指令輸出及負向控制。不要再把B表當未做待辦。
3. 在clone C:/agywork/agd-site-codex 或主專案開始前先 git status 與 git rev-parse HEAD。feature/en-site-and-play-zone 已整合六條分支；玩家程式／啟動器基準212f9a1，之後提交只補驗收與交接文件。兩邊用本機fetch＋ff-only同步，未push。
4. C節保持待使用者決定；不自動push、不刪檔、不做真手機代調、不補未知製作者授權、不定案格鬥規格。C節原文保持，原提交數是舊交接數字，現況以git查詢。

## 目前狀態
- 主專案：C:/Projects/系網漫畫版_AGDComicSite；執行clone：C:/agywork/agd-site-codex。分支均feature/en-site-and-play-zone。
- 本輪六條：codex/hide-pending 2576ae7、codex/tune-collapsed efe4204、codex/tuning-roundtrip 2fd7f99、codex/spring-backgrounds be6da33、codex/faculty-punctuation 5bb779b、codex/en-check-batch2 8ca0a85。全數獨立重跑後合併，合併點d0e7eb1，0衝突。
- 獨立驗收工作樹：C:/agywork/agd-run4-verifier，保留未清理。六分支相關測試分別17/16/16/16/16/16，全通過。
- 整合版 node --test tests/en-play.test.mjs：17/17；node tools/validate-en.mjs：8檔PASS；英文CHECK 518→510。
- node build.mjs exit0，既有duplicate color警告仍在；輸出bundle與提交版一致。沒有額外重寫介面或改遊戲。
- 中英試玩卡5張皆無待補，可真正開啟／關閉iframe；已知team·year保留。390×844調校面板預設收合，遊戲可見100%，28鍵可用；扣墨42→72、公開／調校localStorage隔離、JSON28鍵維持。
- JSON實際貼回磁碟tuning.js後，桌機／手機三關通過，再用原始bytes還原，SHA256一致。六組語系／裝置／調校組合各三關won、0失誤、0錯誤。
- 平台與藍牆四張圖重新拍攝並逐張代理目視可辨識虛線；未改顏色或程式，未宣稱使用者對話確認。
- 英文來源本輪重新開啟金點主辦部會、金犢官方PDF、KT藝術節、HC真正官網；ZIP-LAB可讀性待確認，原值未改。
- ui-policy工具仍exit1，只有既有4張實景例外，沒有新問題。
- agy補助審查：ReadFile被擋；改附文字重送後240秒TIMEOUT，未提供可用判定，不納入驗收。
- **真手機從未測過**。其餘四款只做啟動及第一段操作冒煙，不宣稱完整通關；《創作不斷線》完整三關已測。

## 本輪試玩交付
- ZIP：AGDComicSite-Playtest-20261021.zip，59,982,468 bytes。完整解壓後雙擊START.cmd；Windows內建PowerShell即可，無需npm安裝。既有React CDN與網路字型需網路。
- ZIP SHA256：0a9d073e68e5e291b7dde2c99581028b688aa05deba4e562f8ed5d1f724c9603。
- ZIP已真正解壓到 work/run4/unpacked-playtest，用包內PowerShell伺服器實跑五款第一段操作，全部通過、JS/站內HTTP錯誤0。554個runtime檔案逐一雜湊一致；PS1 UTF-8 BOM、CMD純ASCII，PowerShell5.1/7解析皆過。
- 可重跑QA：tools/qa/run4/README.md；啟動器範本：tools/playtest/。
- 離線狀態儀表板：work-orders/20261022/run4/dashboard/index.html（2026-10-21重產；資料／工具／使用者狀態分開，使用者確認仍為0）。

## A. 環境整理（本輪使用clone，主專案junction未拆）
1. **`node_modules` 目前是目錄連結**（junction，指向 `C:\agywork\agd-site-codex\node_modules`），不是正式安裝。處理方式：
   - 先確認是連結：PowerShell `(Get-Item node_modules).LinkType` 應為 `Junction`。
   - 只拆連結、不碰目標內容：`cmd /c rmdir node_modules`（**不可加 `/s`，不可用 `Remove-Item -Recurse`／`rm -rf`**，那會刪到 clone 裡的真套件）。
   - 再 `npm install`（`package.json` 已有 devDependencies `playwright ^1.64.1`、`sharp ^0.35.5`）；Chromium 沒裝就 `npx playwright install chromium`。
   - 驗收：`node --test tests/en-play.test.mjs` 16/16。
2. 文字檔換行：clone 設 `core.autocrlf=true`，工作目錄是 CRLF、git 內是 LF。比對雜湊時要說明用的是哪一邊。

## B. 本輪六項已完成（以下保留原工單規格）
每項做完寫 `work-orders/20261022/reports/<名稱>-report.md`：做了什麼、`git diff --stat`、驗收逐條 yes／no 附實際指令輸出。

| 優先 | 項目 | 範圍（白名單） | 驗收（yes／no） |
|---|---|---|---|
| P0 | **英文頁不要顯示中文「待補」**：四款試玩卡現在顯示「待補 · 待補」，`#/en/play` 也是中文。值為「待補」時該行不顯示（中英皆然），不改資料 | `en-pages.jsx` 的 `PlayCard`、`bundle.js`（`node build.mjs` 產物）、`index.html`／`pages.jsx` 版本字串 `20261021d`→`20261022a`、`tests/en-play.test.mjs`（只新增） | `#/play/zone` 與 `#/en/play` 五張卡都沒有「待補」字樣；creative-line 仍顯示 `team · year`；測試全過 |
| P0 | **調校面板在手機直向會蓋住整個遊戲**：改成預設收合（只露標題列與三顆按鈕），點「展開」才出現滑桿 | `play/creative-line/tuning.js` | 390×844 手機模擬 `?tune=1` 截圖，遊戲畫面可見面積 ≥ 70%；展開後 28 支滑桿可用；`node C:/agywork/agd-site-qa-scripts/wo02check.cjs <repo根>` 結果與現在相同 |
| P1 | **驗「複製 JSON 貼回 `tuning.js`」**（之前 unverified）：把面板複製的 JSON 貼回檔案等號後，頁面能正常載入、三關可過 | 只驗不改；若壞掉才改 `tuning.js` | 貼回後 `autoplay.cjs` 三關 won；報告附貼回前後 diff（驗完還原） |
| P1 | **彈簧線在深色平台與藍色牆上的可見度**（之前只驗了米白地板） | 只截圖不改程式；截圖放 `docs/qa/creative-line/20261022/` | 兩種背景各 1 張桌機 1 張手機，人眼看得到虛線；看不到就寫報告，不要自己改顏色 |
| P1 | **`faculty.json` 既有驗證失敗**：`node tools/validate-en.mjs` 報 `faculty.json FAIL 1：$[9].certs 純英文原值被改`（原文頓號被換成英文逗號；合併前就存在） | `data/en/faculty.json` 只改 `$[9].certs` 的標點 | `node tools/validate-en.mjs` 八檔全 PASS |
| P2 | **英文 `[CHECK]` 第二批**：四檔還剩 518 個（stats 265、news 37、works 16、faculty 200）。先查 WO-04 列為「查過但未採用」的：金點新秀、時報金犢獎、KT 科藝獎、西基、ZIP-LAB、Hautecouture 法人名 | 同 WO-04（`work-orders/20261021/WO-04-en-check-review.md` 第 0 節），對照表寫 `docs/qa/en-check/20261022-batch2.md` | 同 WO-04 第 3 節；每筆有可開啟的官方來源 URL；維基不算來源 |

## C. 要使用者決定的事（Codex 不要自己做）
1. **推上 origin**：本機多 20 個提交；repo 公開，推之前使用者要自己看過內容。
2. **`_v1-rejected` 29 檔要不要刪**：清單在 `work-orders/20261021/DELETE-LIST-creative-line-v1.tsv`／`.md`。刪之前還要一併處理 `play/creative-line/tools/prep-art.mjs` 對 `art/ui`、`art/fx`、`art/web`、`tools/mask-seeds.json` 的舊引用。一次刪 20 檔以上要使用者在對話確認。
3. **手機手感**：使用者拿真手機開 `play/creative-line/index.html?tune=1` 調，調完按「複製 JSON」貼回 `tuning.js`。
4. **《小朋友齊打交》致敬版規格定案**：`docs/design/fighter-homage/SPEC.md` 第 10 節的選項。LF2 原版再利用條款仍是 unverified（`lf2.net/en/terms.html` 404）。
5. **試玩卡「待補」的實際內容**：六樓出口、晴日茶桌、地窖大廚、死線防衛隊的製作者、年份、授權要使用者提供（`cozy-big-two` 有 `fusion-pixel-tea.ttf` 但沒有授權檔）。
6. **清理**（使用者同意才動）：
   - 臨時分支 `merge/codex-run2` 與工作樹 `C:\agywork\agd-site-merge`（內容已全部進 feature）。
   - 已合併的 `codex/wo-0N-*` 分支、`codex/attempt1-partial`。
   - `C:\agywork\agd-site-attempt1-docs-untracked`：第一次失敗留下的未追蹤 `docs/`（23 檔，含瀏覽器暫存），從主專案搬出來的備份。
   - `C:\agywork\agd-site-codex` clone 裡的未追蹤暫存：`docs/qa/creative-line/20261021/browser-tmp/`（約 529 檔 Node 編譯快取）與 `work-orders/20261021/codex-*` 提示檔與 log。

## 使用者裁定（不要再問）
- 減少 AI 美術，盡量用系上實景後製；場景沿用《六樓出口》的實景轉漫畫圖。
- 《創作不斷線》按鈕與面板比照《六樓出口》用純文字。
- 試玩區選入：創作不斷線、六樓出口、晴日茶桌、地窖大廚、死線防衛隊。
- Dots 暫不使用（工作單 agd-comic-site#1 留著）；不用 Claude API、不用雲端 session；副戰力只用 Codex 與 agy。
- `ui-policy.cjs` 對 4 張實景圖報錯是已知例外（記在 `play/creative-line/ui-art-manifest.json`），不改工具。
- 截圖包用 WebP，不放 PNG 進公開 repo。

## 硬規則（照全域 AGENTS.md）
- 不 push、不碰 `main`、不刪檔（要刪先列清單給使用者確認）。
- 不生圖、不用程式畫美術；畫面上的圖只能用既有素材。調校面板是除錯工具，用純 HTML 表單元素。
- 驗證要實際跑指令並貼輸出；做不到就交部分並寫明卡在哪。

## 驗收工具（repo 外，可直接用）
`C:\agywork\agd-site-qa-scripts\`（Playwright 從 `C:/agywork/agd-site-codex/node_modules/playwright` 載入，自帶靜態伺服器，不需 http-server）：
- `node autoplay.cjs <repo根> ["?lang=en"|"?tune=1"] [desktop|mobile] brief`：三關沿 `path` 自動試玩，印出每關狀態、失誤、錯誤數。
- `node wo02check.cjs <repo根>`：調校面板、滑桿改 `costTouch` 前後扣墨、`localStorage` 持久化與公開版隔離、複製 JSON、還原預設。
- `node wo03check.cjs <repo根>`：開 `#/play/zone`、`#/en/play` 數試玩卡的 `team · year` 行。
- `node mergeshot.cjs <repo根> <輸出.png>`：拍一張第 3 關彈簧線並印出兩條線的屬性。
- `node crop.cjs <來源png> <輸出png> x y w h`：放大 3 倍裁切，看細節用。
- 參考基準：原版三關以 `autoplay.cjs` 跑都是 `won`、失誤 0。

## 重要路徑（repo 外，唯讀參考）
- 調研與構想：`C:\agywork\agd-game-research\{codex,agy,claude}\out\`，彙整 `C:\agywork\agd-game-research\彙整報告_系網試玩區.md`
- 關卡設計規格：`C:\agywork\agd-game-research\claude\out\creative-line-levels.md`
- 譯文覆核清單與原驗證器：`C:\agywork\agd-en-translate\`
- Codex 專用 clone：`C:\agywork\agd-site-codex`（origin 是主專案資料夾；在那裡 push 會直接推進主專案的分支，不可）
- 18T 遊戲清單：`G:\我的雲端硬碟\_跨機傳輸\18T遊戲清單_給系網調研_20261021.tsv`（147 列，48 列有網頁版）

## 復盤 2026-10-21

範圍：Claude Fable 5.1 接手後的規劃段（寫工單 → Codex 第一次失敗 → 修環境 → 開 Opus 對話控制 Codex）。Opus 之後的執行與驗收見上方各節與 `work-orders/20261021/VERIFY-run2.md`。

### 1. 做了什麼、改了哪些檔
| 檔案 | 用途 |
|---|---|
| `work-orders/20261021/README.md` | 六張工單索引、給 Codex 的 8 條共同規則、現況摘要；後修正測試指令 |
| `WO-01-creative-line-screenshots.md` | 56 張全狀態截圖包＋對照頁（原誤寫 15 狀態 60 張，已改 14／56） |
| `WO-02-creative-line-tuning.md` | 手感參數集中到 `tuning.js`，`?tune=1` 手機調校面板 |
| `WO-03-play-credits.md` | 試玩卡 team／year／license／credit 四欄，只抄來源檔不編造 |
| `WO-04-en-check-review.md` | `[CHECK]` 第一批：只改有官方來源的獎項與機構英文名 |
| `WO-05-v1-rejected-list.md` | 29 檔舊 AI 圖的刪除清單（含 SHA-256 與復原指令），只列不刪 |
| `WO-06-fighter-homage-spec.md` | 三方格鬥致敬構想合併成單一規格＋實景拍攝清單，不寫程式 |
| `LATEST_HANDOFF.md` | 新建交接檔（現況、使用者裁定、待決、下一輪第一件事） |
| `.gitignore` | `docs/` 改成 `docs/*` 並排除 `docs/qa/`、`docs/design/`，工單交付物才進得了版控 |
| （未列入 mod 清單）`codex/attempt1-partial` 分支 | Codex 第一次的 13 個部分成果，留存不驗收 |
| （未列入）`C:\agywork\agd-site-codex` | Codex 專用 ASCII 路徑 clone，預裝 Playwright 1.64.1＋Chromium，`package.json`／lock 已提交 |
| （未列入）`work-orders/20261021/codex-prompt-run2.txt` | 第二次給 Codex 的提示檔 |

### 2. 踩雷與根因
| 症狀 | 根因 | 修法 |
|---|---|---|
| `node --test tests/` → `Cannot find module '...\tests'` | Node 24 的 `--test` 不接受資料夾路徑；我沒先實跑就把指令寫進六張工單與交接檔 | 全部改成 `node --test tests/en-play.test.mjs`（commit `b0f0385`） |
| WO-01 寫 15 狀態 60 張 | 清單實際只有 14 種，數字是手算的 | 改 14／56；Codex 沒硬湊第 15 種是對的 |
| Codex 第一次六張全交白卷：`fatal: Unable to create '.git/index.lock': Permission denied`；Chrome／Edge headless `CreateFile: 存取被拒 (0x5)`＋`mojo ... crash server failed to launch`；`npm ERR ENOTCACHED` | `codex exec -s workspace-write` 沙箱把 `.git` 設唯讀、擋子程序開檔、斷網 | 改在獨立 clone 用 `-s danger-full-access`；Playwright 與 Chromium 先裝好，Codex 不必連網下載 |
| 我啟動 `danger-full-access` 被 auto 模式分類器擋下（`Create Unsafe Agents`），連背景等待的 Bash 也一起被擋 | auto 模式不允許代理再啟動不受沙箱限制的代理 | 開一個 `default` 權限模式、模型 Opus 的獨立對話去啟動，由使用者按允許；未繞過 |
| `docs/` 整個在 `.gitignore`，WO-01／04／06 的交付物會進不了 commit | 舊設定只考慮內部備忘 | `.gitignore` 放寬（commit `ea6af82`） |
| `git stash push -u <pathspec>` 後 13 檔仍留在 index（顯示 `A`） | stash 帶路徑規格時對未追蹤檔的行為不如預期 | 改開側分支 `codex/attempt1-partial` commit |
| `.gitignore` 用 `.Replace("docs/`n",...)` 沒換到 | 檔案是 CRLF | 改用 Edit 工具 |
| 探測 `.git` 寫入權限的指令被 dcg `rm-protected-file` 擋 | 我在同一行裡寫了 `Remove-Item '.git\...tmp'` | 改用 Bash 只讀 `index.lock` 是否存在 |

### 3. 額度花費
- mod 量到：累計工作時間約 14 分鐘；本 session 約 US$28.42；目前最高用量窗口：週 37%。
- 最耗的一步：一次輸出六張長工單＋README＋交接檔（約 1.2 萬字），其次是修環境時十幾次 PowerShell 往返與被擋重試。Codex 與 Opus 對話的額度不計在此。
- 浪費點：測試指令與截圖數兩處筆誤各多花一輪修正；三個被安全規則擋下的指令各白跑一次。

### 4. 下一步與規則建議
- 下一步：Opus 對話已把六張（加 WO-07 彈簧線修正）驗收並合併進 feature（HEAD `6981888`，16/16），見本檔「下一輪第一件事」與 B 節待辦。等使用者決定：推不推 origin、`_v1-rejected` 刪不刪、真手機調手感、格鬥規格定案。
- 規則建議（只提案，未改任何規則檔）：
  1. **`ai-fleet-handoff` 或新開 `codex-exec` skill**：記「`codex exec` 的 `workspace-write` 沙箱不能寫 `.git`、不能開瀏覽器、不能連 npm；需要分支／commit／截圖的工單要給獨立 ASCII clone＋`danger-full-access`，且這個啟動必須由使用者或 `default` 權限對話執行，auto 模式會被分類器擋」。
  2. **工單範本（`unity-ai-asset-gen/references/art-work-order-template.md` 或 `verify` skill）加一條**：寫進工單的每個驗證指令，主控要先在本機實跑一次並貼輸出；這次 `node --test tests/` 就是沒跑就寫。
  3. **repo 內新增 `AGENTS.md`**：記 `node --test tests/en-play.test.mjs`、`node build.mjs` 後要 bump 版本字串、`play/creative-line/` 不經打包、`docs/qa`／`docs/design` 進版控其餘不進。這是專案慣例，不該放全域。
  4. **hook 提案（低優先）**：PreToolUse 看到 `node --test <目錄>` 時提醒 Node 24 要給檔案路徑。
- 下一輪建議：Claude Code／claude-opus-5-5／high
  理由：獨立驗證或複驗；主線必須留在目前的 Claude 家族。
  狀態：只提出建議，不切換模型、不建立新工作、不自行派工。
