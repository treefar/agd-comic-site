# 《六樓出口》交接檔（LATEST_HANDOFF）

最後更新：2026-10-15（TF-BASE，Claude Opus 5.5）。本檔不發布到網站（scripts/build.mjs EXCLUDE）。

## 一句話

系網招生小遊戲：設計大樓 D 棟六樓 8 站循環走廊找異常（《8 番出口》式），系網漫畫風，含尋址任務、線索密碼門、邱士展老師 D0647 片場對決。

## 最新進度（2026-10-16 晚，TF-BASE）

- **已完成並提交**：開場寫實漫畫封面；由淺入深引導（第 1 圈只出明顯異常、卡住三層提示、求救鈕）；主角（大一新生）每站旁白放在畫面下方；第一輪每站只點 1 個、其他物件變彩蛋；5 位老師專長小遊戲＋簽名卡（文字卡暫代，AI 卡面被退回）＋集滿隱藏結局。私人試玩 Artifact 第 15 版。
- **進行中：六樓 5 間實驗室支線**（使用者 10-16 選：走廊門口進、系網照片轉漫畫、遊戲從自己的遊戲庫挑、星等三條件各一顆、成就牆）
  - 實驗室畫面：系網照片 15 張（使用者同意下載，不進 git）→ Codex 漫畫風 5 張；D0637 樣張使用者已確認通過，其餘 4 張已生成、待使用者看。
  - 小遊戲（AGY Flash 改編，主控驗收中）：D0604 繪圖板描線救援（時光屋 雪橇畫線師）、D0628 逐層列印（方塊迴旋）、D0631 虛擬製片靶場（折光港 風跡靶場灰盒）、D0633 VR 跑步機衝刺（天際奔逃）、D0637 影格接龍（幻夢接龍）。規則測試 45 項全過；主控修了 D0637 發牌（改倒推構造保證有解）；無頭瀏覽器冒煙測試進行中。
  - 宿主：`exit6/labs.mjs`（入口站點、1～3 星、成就與稱號、6 星解鎖作品展示、12 星解鎖招生分享卡）＋手帳成就牆，測試 7 項全過；**尚未提交、尚未接上 AGY 的遊戲檔**。
- 下一步：冒煙測試過關後把 5 款搬進 `exit6/minigames/lab-*`、跑端到端、提交、更新試玩版；等使用者確認 4 張實驗室圖。

## 位置與連結

- Repo：`C:\Projects\agd-comic-site`，分支 `feat/exit6-corridor-game`（**只在本機，未推 GitHub**；repo 是公開的，推＝程式與圖公開，合併 main＝網站上線）。
- 遊戲：`exit6/`（雙擊 `exit6/index.html` 可玩；畫面程式改 `exit6/main.mjs` 後跑 `npm run exit6:bundle` 產生 `game.js`）。
- 私人試玩連結（Artifact，只有使用者看得到）：https://claude.ai/artifact/TpnGnvUbdWK4UV4QX2imJ5 。發布版在 scratchpad 的 `exit6pub/`，換新 session 時要用 `url` 參數更新同一個 Artifact（先 `action: read`）。
- 進度儀表板 MOD：`C:\Users\USER\.claude\dev-mods\9641f657-c96f-4a98-9859-068cbcb53156\exit6-dashboard\`，指令 `/exit6`；資料由 `node scripts/exit6-status.mjs` 算出寫 `docs/exit6/status.json`；第三層「使用者確認」只讀 `docs/exit6/confirmations.json`。新 session 若不在同一個 session 資料夾，MOD 要用 `--plugin-dir` 或搬到新 session 的 dev-mods 才會載入。
- 文件（本機，`docs/` 被 .gitignore）：`docs/exit6/第二階段規格.md`、`research/彙整.md`（4 份調研）、`企劃書.md`、`拍攝清單.md`、`錄音稿.md`、`影片盤點.md`。

## 已完成（提交紀錄，分支歷史已重寫過，舊 Unity 音檔已清除）

| 內容 | 備註 |
|---|---|
| 8 站漫畫風（停站＋2 中間格）、12 異常圖 | Codex CLI 生圖，帳本 `art-src/exit6/ledger.jsonl`；風格使用者 2026-10-15 確認 |
| 果汁、系主任立繪 4 張（依系網官方照片） | 去背 `art-src/exit6/key_dean.py` |
| 真實時間光線 `time.mjs` | 讀裝置時間；每圈 stepFor 小時；第 4 圈前保證到晚上；相乘疊色（紅色不變色） |
| 六樓尋址 `quests.mjs`、手帳 | 3 件委託、紀念章「六樓郵差」 |
| SAM 沿邊框線與浮起 `outlines.mjs` | `art-src/exit6/outline_sam.py`，權重 `C:\AI\models\sam\sam2.1_b.pt`（使用者同意下載） |
| 線索鏈＋D0647 密碼 6068 `clues.mjs` | 路燈線索限晚上 |
| 邱士展老師立繪 4 張、D0647 場景、片場對決 `fight.mjs` | 使用者 2026-10-15 表示邱老師已同意；台詞使用者自己把關；遊戲內不出現「快打」 |
| 音效 9 個全 Kenney CC0 | `AUDIO_LICENSES.md`；dean、clear 自 kenney.nl 下載（使用者同意），原包已存雲端素材庫 |
| 測試 | `node --test scripts/test-exit6.mjs scripts/test-exit6-phase2.mjs scripts/test-exit6-fight.mjs`（38 項） |

## 本 session 收尾已完成（2026-10-15）

- 系辦門口卡關（「兩側海報」蓋住「門上告示」）已修，加「調查點互不重疊」測試（紅綠循環驗證）。
- 子代理用真實點擊座標試玩整局（電腦＋手機）：可從頭玩到破關，回報 13 項體驗問題，已修：
  先不要／回到走廊按鈕看不見、最後一擊無提示、太慢卻說按錯（fight.mjs 回報 reason: slow，有測試）、
  手機說明欄跳動（固定 4 行高）、玩家看到「待老師補充」（畫面以 pub() 隱藏）、凌晨顯示「深夜」、
  手帳鈕移到下方按鈕列、頂端標籤改顯示在下方、吐司移到上方、密碼錯誤訊息會清掉、第 4 線索提示延後、手帳頂端加關閉鈕、
  語音錄好前不載入（VOICE_READY=false，避免 404；錄好後改 true）。
- 未修：手機直拿場景小（16:9 先天限制，已有「橫放」提示）；部分熱點小於 44px；debug 模式 #dbg 標籤蓋到按鈕（只在 ?debug=1）。
- 測試 40 項全過；Artifact 第 8 版。

## 2026-10-16 已完成（TF-BASE）

- 開場改寫實漫畫封面：s0 電梯圖整張調色＋網點、標題逐字錯落粗明體＋紅網點陰影＋集中線、「請勿回頭」紅告示條、旁白框說明（提交 72b0a1e、b2cec08）。
- 由淺入深（使用者選：第 1 圈手把手、異常由明顯到細微、卡住給提示）：`exit6/coach.mjs`＋`game-core.mjs`。
  異常加 `tier` 1～3（我依畫面判斷，可再調）；第 1 圈只出 tier 1、第 2 圈固定正常、第 3 圈最多 tier 2；
  導覽圈前兩站黃框指示；異常站第 1 圈強線索、第 2～3 圈弱線索；卡住 8／16／26 秒三層提示，第 3 層圈出異常；連錯兩次重新給提示；「求救」按鈕 10 秒冷卻（提交 ffb88a6）。
- 測試：`node --test scripts/test-exit6.mjs scripts/test-exit6-phase2.mjs scripts/test-exit6-fight.mjs scripts/test-exit6-onboard.mjs`（47 項全過）。Artifact 第 11 版。
- 已知：Browser 預覽窗格隱藏時不推進 CSS 動畫，標題會停在透明的第一格；一般瀏覽器正常。
- AGY 工作區 `C:\agywork\exit6-mg`（不在 repo 內）：`research/` r1 小遊戲玩法、r3 新手引導、r4 實驗室謎題（全標 unverified）；
  `orders/_mg-contract.md` 是小遊戲共用介面規格（`window.EXIT6_MG[id].mount(root,{onEnd,rng})`）；`mg/` 是 AGY 做的 5 個灰盒雛形
  （mg-anim 動畫、mg-code 程式、mg-book 繪本角色、mg-type 視覺傳達、mg-3d 3D 列印，Three.js r128）。
  **已驗收並複製進 repo `art-src/exit6/phase3/`（提交 86f0e93），看 `驗收報告.md`**：規則測試 44 項全過、無頭 Chrome 亂按 62 秒無錯誤；
  mg-type、mg-code 難度要真人試。下一步：使用者試玩→挑老師並取得同意→寫宿主（走廊遇老師→mount→onEnd 發簽名卡）。
- 舊雛形盤點（Explore 子代理）：遊戲時光屋 57 款在 `G:\我的雲端硬碟\07_私密網頁\site\retro-game-house\`、GameWiki 40 款、折光港 10 款、字旋試場；3D 類沒有現成雛形。

## 2026-10-16 老師關卡宿主與簽名卡（提交 f9e8869、1313a8e；Artifact 第 12 版）

- 使用者選：5 個全接、名字先用專長代稱、依專長分散各站、卡面用 Codex 生圖。
- `exit6/teachers.mjs`：繪本 S4、視傳 S5、動畫 S6、3D S3、程式 S7；循環圈右下角「<代稱>的邀請」。`name` 全部 null，
  老師本人同意後把本名填進 `name` 並加進 `CONSENTED`（測試會擋未登記的本名）。
- 小遊戲在 `exit6/minigames/<id>/`（複製自 art-src/exit6/phase3/mg），點了才載入；3D 關卡先載 cdnjs three.js r128（離線會顯示載入失敗）。
  宿主每次給 `.mgstage` 內層容器，因為小遊戲會改容器樣式。贏了發卡，存 `exit6-save-v1.cards`，手帳卡冊 n/5，集滿開隱藏結局（文案是我寫的草稿，連 ../#/works、#/admission、#/labs）。
- 卡面：Codex 插圖 5 張**使用者 2026-10-16 退回（AI 感太重）**，帳本已記，原圖留 art-src/exit6/gen/card_*.png；現在是文字卡（`teachers.mjs` 的 mark，card: null），是暫代不是正式美術。
- 測試：`node --test scripts/test-exit6*.mjs` 54 項；端到端 `node scripts/exit6-teacher-e2e.mjs`（先開 `npx http-server . -p 8090 -c-1`）15 項全過。
- 待辦：老師同意後換本名與肖像；隱藏結局文案請系主任確認；mg-type、mg-code 難度要真人試；作品展示與招生分享卡還沒做。

## 2026-10-16 主角旁白與第一輪減量（提交 bf586a9；Artifact 第 13 版）

- 使用者選：主角旁白框、導覽圈每站 1 個必點、主角是剛入學的大一新生、點物件只顯示主角一句。
- `data.mjs` 每站 `narr {tour, loop}`、每個物件 `say`、每站一個 `must`；`story.mjs` 有 mustIndex／narrFor／spotAt。
- 畫面：換站跳 `#narr` 旁白框，**使用者 2026-10-16 指定放在畫面下方說明欄上面一行、不蓋畫面**（保留一行高度不跳版；手機橫拿時說明欄本來就疊在畫面下緣，旁白跟著疊）；
  循環圈點到非異常的物件＝彩蛋（浮起＋主角一句，不算點錯）；知識改收在手帳「看過的東西」。
- 台詞是我寫的，使用者可再改口吻。

## 下一階段（建議開新 session 做）：老師關卡與實驗室支線

使用者 2026-10-15 已決定：
- 老師關卡先做 **4～5 位專長差異大的老師**，每位依專長設一個小遊戲關卡；名字與肖像要本人同意（邱士展已同意，其他老師要先問）。
- 獎勵：**老師簽名卡＋集滿解鎖隱藏結局**、**解鎖系上作品展示**（系網 `data/works.json`）、**招生資訊與分享卡**。
- 實驗室：**新增實驗室支線場景**（電繪 D0604、3D 列印 D0628、動捕 D0631、體感 D0633、偶動畫 D0637 等），要補拍內部或用核准管線生圖。
- **Three.js 只用在部分小遊戲**（例如 3D 列印拼裝、動捕姿勢配對），模型只用 CC0 或核准管線（Tripo／Meshy）；走廊維持 2D 漫畫風。
- 要調研更多遊戲，並從使用者過去的網頁專案整合現有資源（候選：`C:\Projects` 下 game-glossary、遊戲構圖視角_GameCameraLanguage、晴日茶桌_CozyBigTwo、巷口雀館_AlleyMahjong、文字戰鬥陀螺_WordSpinBattle、系網的 `_quiz-raw` 測驗、系網稽核測驗分享圖等，尚未盤點）。

系網老師專長（`data/faculty.json`）：鄧樹遠 遊戲設計／劇本／剪輯；江雅媚 數位媒體／介面／角色場景；陳重光 繪本／角色造型；楊智彰 Unity／VR／程式／大數據；陳慶鴻 電腦動畫／動態影像；張純雅 視覺／動畫美術／策展；邱士展 動畫導演／特效／鏡頭語言；陳美蓉 視覺傳達／CI／廣告；吳焉昇 平面／網路多媒體／影像處理；王宗立 3D 角色／動畫／後製；陳寀瑜 介面／遊戲理論／互動裝置／企劃；蔣天華 互動遊戲／AR VR MR／IoT；尹立（留職停薪）。

**新 session 的第一個具體任務**：派 3 個子代理平行調研（①依老師專長的小遊戲與實驗室謎題設計、參考 WarioWare／雷頓教授／節奏天國／密室逃脫等；②盤點 `C:\Projects` 可重用的網頁專案資源與授權；③Three.js 可用的 CC0 3D 素材與核准管線），彙整後用選項請使用者挑 4～5 位老師並取得同意。

## 待使用者處理

- 推上 GitHub 前：確認沒問題後刪除本機備份分支 `backup/exit6-before-filter`（內含舊 Unity 音檔）與 `refs/original/`。
- 補 6 處「待老師補充」文字（地墊作者、天橋彩繪、牌樓由來、櫥窗海報出處）。
- 系主任語音 8 句（錄音稿 `docs/exit6/錄音稿.md`，檔放 `exit6/audio/<id>.m4a`）。
- 音效只看數據挑選，需要親耳試聽。

## 復盤 2026-10-16

### 1. 做了什麼、改了哪些檔

今天 13 個提交（`72b0a1e`～`87dffd9`），分五段：開場封面 → 由淺入深引導 → AGY 小遊戲雛形 → 老師關卡宿主與簽名卡 → 主角旁白與第一輪減量。

mod 記錄到的檔案（後半段）與用途：

| 檔案 | 用途 |
|---|---|
| `exit6/teachers.mjs` | 5 位老師（專長代稱、站點、對應小遊戲、邀請文、一句話）、發卡、集滿判定、名字同意閘門；卡面後來改 `card: null`＋`mark` 文字卡 |
| `scripts/test-exit6-teachers.mjs` | 老師關卡規則 7 項測試（站點不重複、本名閘門、只有贏才發卡、集滿只觸發一次、壞存檔不壞） |
| `exit6/story.mjs` | 主角旁白與物件台詞的純函式：mustIndex／narrFor／spotAt |
| `scripts/test-exit6-story.mjs` | 4 項：每站 1 個必點、台詞長度與無佔位字無本名、兩圈旁白不同、彩蛋點擊判定 |
| `scripts/exit6-teacher-e2e.mjs` | 無頭 Chrome（CDP）端到端 20 項：走導覽圈→接受邀請→亂按 62 秒→發卡→3D 關卡→繪本與視傳版面→集滿結局→旁白與彩蛋→手機卡冊 |
| `LATEST_HANDOFF.md` | 各段現況與本復盤 |
| scratchpad `teacher_patch.py` | 一次性：把宿主覆蓋層、邀請鈕、卡冊、隱藏結局插進 main.mjs／index.html（不進 repo） |
| scratchpad `story_data.py` | 一次性：在 data.mjs 補 narr／must／say |
| scratchpad `story_ui.py` | 一次性：旁白框、導覽圈只亮必點、彩蛋點擊、手帳「看過的東西」 |
| scratchpad `card_text.py` | 一次性：卡面改文字卡、帳本記退回、改測試 |
| scratchpad `cardshot.mjs` | 一次性截圖：文字卡卡冊與簽名卡畫面給使用者看（不是回歸測試） |

mod 沒記到但同樣改過的：`exit6/main.mjs`、`exit6/index.html`、`exit6/data.mjs`、`exit6/game.js`（打包產物）、`exit6/minigames/*`（10 檔）、`exit6/coach.mjs`、`exit6/game-core.mjs`、`scripts/test-exit6-onboard.mjs`、`art-src/exit6/gen-batch.mjs`（cards 組）、`art-src/exit6/ledger.jsonl`（5 筆生成＋5 筆退回）、`art-src/exit6/phase3/**`（雛形、調研、驗收報告、smoke.mjs）。

### 2. 踩雷與根因

| 症狀（確切訊息） | 根因 | 修法 |
|---|---|---|
| esbuild `The symbol "loaded" has already been declared` | 新加的腳本快取取名 `loaded`，跟既有預載 Set 同名 | 改名 `mgScripts` |
| esbuild `Unexpected end of file`（main.mjs:855） | 在一行內的程式中間插了 `//` 註解，把後面的 `} } });` 一起註解掉 | 註解移到上一行 |
| 端到端 `mg-book：容器保有高度` 失敗，畫布 top −297px | 小遊戲 mount 時改宿主容器 `position: relative`，`inset:0` 失效、高度塌成 0 | 宿主每次給新的 `.mgstage`，並設 `width/height:100%` |
| python 補丁 SyntaxError（字串中間斷行） | 用 sed 改 python 檔時 `\n` 被吃成真正換行 | 改用 Edit 工具、字串用 `chr(10)` |
| 指令被 Blast Radius 擋下 10 分鐘「no answer」整段沒跑 | 多步指令裡夾了一行 `rm`（目標其實不存在） | 拆掉刪檔，Artifact 改用 `files: null` 移除 |
| Browser pane 截圖標題全透明、小遊戲倒數不動 | pane 隱藏時 `document.timeline` 與 `requestAnimationFrame` 都不推進 | 改用無頭 Chrome（CDP）驗證 |
| 5 個分頁同時跑冒煙，倒數幾乎不動 | 無頭 Chrome 背景分頁畫面更新被降速 | 一次只跑一個遊戲並 `Page.bringToFront` |
| AGY 報告 FAKE（白名單外變動） | 主控自己在同一工作區寫了 jobs／out 檔 | 確認是誤判；outRoot 放工作區外、派工期間不寫該資料夾 |
| AGY r2 讀檔被拒、零產出 | refs/ 是目錄連結指到工作區外；agy 又自行去讀 Vault | 複製 .md 到 refdocs/，再用 conversation 續接叫它直接寫 |
| AGY 雛形測試 3 項失敗 | 2 項是 AGY 寫錯測試期望值，1 項是規則判斷順序錯（Bug 格先被判成沒管子） | 主控修，紅綠循環確認 |
| 冒煙：導管除錯 12 秒就結束、字體對撞 2 秒就贏、3D 亂按把時間扣光 | 規格沒寫清「失敗重來」與第 1 階強度 | 派 AGY 第二輪修正並重測 |
| 卡面插圖被退回 | Codex「工作桌靜物」卡面 AI 感太重 | 改文字卡暫代；帳本記退回，原圖留 gen/ |

### 3. 額度花費

- mod 量到：累計工作時間約 118 分鐘；本 session 花費約 US$150.55；目前最高用量窗口：週 29%。
- 最耗的步驟（依過程判斷，沒有逐步計費數據）：
  1. 發布 Artifact 前完整讀 10 個 AGY 小遊戲檔（約 250KB，約 7 萬 token）。
  2. 長對話脈絡反覆帶入（大量 Bash／截圖輸出）＋多張全尺寸截圖判讀。
  3. 端到端測試反覆重跑（每次約 3 分鐘，跑了 6 次以上）。
- AGY 線（Gemini Flash High）承擔 4 份調研＋5 個雛形＋1 輪修正，不吃 Claude 額度。

### 4. 下一步與規則建議

下一步（依序）：
1. 使用者試玩第 15 版，回饋旁白台詞口吻、第一輪難度、小遊戲難度（mg-type、mg-code 待真人試）。
2. 老師本人同意後：`teachers.mjs` 填 `name` 並加進 `CONSENTED`。
3. 卡面正式美術：使用者決定方向（手繪、實拍、其他管線）後再做；文字卡是暫代。
4. 第二批小遊戲與實驗室支線（候選：惡意彈窗大掃除、手感果汁調校師、名導演黃金觀景窗、定格時光機 D0637）。
5. 隱藏結局文案請系主任確認；作品展示與招生分享卡尚未做。

規則建議（只提案，沒有改規則檔）：
- **agy-max `references/pitfalls.md`**：網頁小遊戲工單要寫「不得改 mount 進來的 root 樣式」，宿主端一律給新的內層容器；另記「主控在 watchDir 寫檔會害 FAKE 誤判」與「目錄連結指到工作區外會被拒，要複製」。
- **verify skill 或自動記憶**：Claude 內建 Browser pane 隱藏時 rAF／CSS 動畫不跑，動畫與遊戲驗證改用無頭 Chrome；無頭多分頁要一次一個。
- **image-gen-routing**：記一筆「Codex 的專長主題工作桌靜物卡面，使用者 2026-10-16 判定 AI 感太重」，之後卡片類插圖先出 1 張樣張給使用者看再批次。
- **全域習慣（不建議寫成規則）**：多步指令別夾刪檔，避免整段被 Blast Radius 擋住；這屬單次經驗，放自動記憶即可。

下一輪建議（next-round-advisor 格式）：
- **下一輪工作**：依使用者試玩回饋微調，或開第二批小遊戲／實驗室支線
- **判定任務類型**：遊戲功能迭代（網頁前端）
- **主線代理**：Claude Code
- **建議模型**：Claude Opus 5.5
- **推理強度**：high
- **檔位注意**：Claude 對話只推薦 Claude 家族；Claude Code 的 /effort 可調整當前模型
- **接續方式**：新對話＋本交接檔（對話已很長）
- **理由**：要同時顧遊戲設計、教學節奏與多檔整合；機械工作（雛形、調研）照舊派 AGY Flash High
- **重新評估條件**：使用者只要文案或數值微調時，降為 Sonnet／medium
- **套用狀態**：僅建議，尚未切換、尚未派工
