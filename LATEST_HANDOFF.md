# 《六樓出口》交接檔（LATEST_HANDOFF）

最後更新：2026-10-15（TF-BASE，Claude Opus 5.5）。本檔不發布到網站（scripts/build.mjs EXCLUDE）。

## 一句話

系網招生小遊戲：設計大樓 D 棟六樓 8 站循環走廊找異常（《8 番出口》式），系網漫畫風，含尋址任務、線索密碼門、邱士展老師 D0647 片場對決。

## 最新進度（2026-10-16 晚，TF-BASE）

- **已完成並提交**：開場寫實漫畫封面；由淺入深引導（第 1 圈只出明顯異常、卡住三層提示、求救鈕）；主角（大一新生）每站旁白放在畫面下方；第一輪每站只點 1 個、其他物件變彩蛋；5 位老師專長小遊戲＋簽名卡（文字卡暫代，AI 卡面被退回）＋集滿隱藏結局。
- **六樓 5 間實驗室支線已接進走廊並提交（`1896af1`）**：循環圈走到 S2／S3／S4／S5／S7 會出現「進入 D06xx」按鈕，進去是系網照片轉的漫畫背景＋各自小遊戲（D0604 描線救援、D0628 逐層列印、D0631 虛擬製片靶場、D0633 VR 跑步機衝刺、D0637 影格接龍），結算 1～3 星，手帳有成就牆、稱號、6 星解鎖作品展示、12 星解鎖招生分享卡。D0637 發牌改倒推構造保證有解。
- **系網連結修正（`a8c761d`）**：隱藏結局、成就牆、分享卡的連結改由 `exit6/links.mjs` 決定，嵌在漫畫系網 `/exit6/` 時走 `../#/works` 等內頁，其他位置（私網、Artifact）改連官網首頁 https://www.dgd.stu.edu.tw/ 。
- **私網**：頭條卡 https://tf-private.pages.dev/six-floor-exit/ （頁面最上方有試玩按鈕），直接玩 https://tf-private.pages.dev/six-floor-exit/play/index.html ；「原型與內部研發」合集另有 `six-floor-exit-play`。只有登入的人看得到。
- **隱藏彩蛋「殺青派對」（`02ac794`，使用者 10-16 選：同機輪流比分、藏在 D0647、重組現有小遊戲、冠軍畫面＋分享卡）**：進 D0647 後點門上像素方塊旁的小遊戲手把貼紙（熱點不發亮；打贏片場對決後邱老師會暗示）→ 2～4 人輸入名字 → 抽 3 款、每款 20 秒，同輪大家同一個種子 → 每輪名次積分 3／2／1／0、同分並列 → 冠軍畫面＋可複製的分享文字。找到過就存檔，手帳會多「開一場殺青派對」鈕（密碼門不存檔，重整後不用再解）。規則 `exit6/party.mjs`；遊戲池排除 mg-3d（要連網）與 D0637（20 秒玩不完）。10 款小遊戲都改成吃 `api.seconds`（不傳仍是 60 秒）。除錯網址 `?debug&d0647` 直接進研究室。
  - 20 秒短版好不好玩**沒有真人試過**，只驗了會準時結束、分數是數字；mg-type 要先選字型按「開始對撞」才計時。
- 測試：`node --test scripts/test-exit6*.mjs` 72 項全過；端到端 `scripts/exit6-teacher-e2e.mjs`（先開 `npx http-server . -p 8090 -c-1`）26 項全過。
- **實驗室圖 5 張全部定稿**：D0637 樣張與 D0604、D0628、D0631、D0633 皆由使用者 2026-10-16 於對話確認（帳本 `art-src/exit6/ledger.jsonl` 有 approved 紀錄）。
- **待使用者**：老師同意後填名字；隱藏結局文案請系主任確認。私人試玩 Artifact 停在第 15 版（不含實驗室）。

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

## 復盤 2026-10-16（第二段：實驗室支線、私網試玩、連結修正）

### 1. 做了什麼、改了哪些檔

- **六樓 5 間實驗室支線**（提交 `1896af1`）：循環圈 S2／S3／S4／S5／S7 出現「進入 D06xx」，進去是系網照片轉的漫畫背景＋各自 60 秒小遊戲，結算 1～3 星，手帳加成就牆、稱號、6 星解鎖作品展示、12 星解鎖招生分享卡。
  - `exit6/labs.mjs`：實驗室資料、星等規則、稱號與獎勵、成就存檔（新檔）。
  - `scripts/test-exit6-labs.mjs`：上面規則的 7 項測試（新檔）。
  - `exit6/main.mjs`、`exit6/index.html`、`exit6/game.js`：入口按鈕、`openLab`／`startLabGame`／`labEnd`、成就牆、分享卡（mod 沒列到，但有改）。
  - `exit6/minigames/lab-d06xx/`、`exit6/frames/lab_d06xx.webp`：5 款小遊戲與 5 張漫畫背景（mod 沒列到）。
  - `scripts/exit6-teacher-e2e.mjs`：端到端加實驗室入口、三星結算、成就牆存檔，共 22 項。
  - `C:/agywork/exit6-mg/orders/_lab-contract.md`：給 AGY 的實驗室小遊戲共用規格 v2（`lab`、`stars`、`flawless`）。
  - `C:/agywork/exit6-mg/lab/lab-d0637/game.js`：修 `scale` 宣告前就被用到的錯誤。
- **系網連結修正**（提交 `a8c761d`）：`exit6/links.mjs`（新檔）＋`scripts/test-exit6-links.mjs`（mod 沒列到）。嵌在系網 `/exit6/` 時走 `../#/works` 等內頁，其他地方連官網首頁。
- **交接與帳本**（提交 `642b7ef`、`4c067a5`）：`LATEST_HANDOFF.md` 最新進度段；`art-src/exit6/ledger.jsonl` 記 4 張實驗室圖使用者通過。實驗室 5 張圖全部定稿。
- **私網**（不在 repo）：`site/six-floor-exit/`（頭條，頁首有試玩按鈕）、`site/six-floor-exit-play/`（原型合集），已部署，門禁 302。
- **Vault**：`專案紀錄/SixthFloorExit_六樓出口.md`、`待提煉/代理記憶候選/2026-10-16/20261016-120000-claude-code-exit6.md`。
- **暫存腳本**（scratchpad，不留存）：`narr_below.py`（旁白框移到下方的改檔腳本）、`layoutshot.mjs`（量版面位置的無頭截圖）、`lab_host.py`（實驗室接進宿主的改檔腳本）、`d0637_deal.py`（D0637 發牌改倒推構造）。
- 另外改了 `~/.claude/skills/treefar-site-publish/SKILL.md`：補一條 `new-item.ps1 -Force` 會洗掉 `hub` 標記的踩雷（mod 沒列到）。

### 2. 踩雷與根因

- **D0637 第 2、3 輪老是同一副牌**：`isSolvable` 搜尋上限 600 步，把有解的局誤判成無解，每次都退回固定牌局，第 3 輪每發一局要 3 秒。改成倒推構造（從排好的時間軸倒著把牌放回各疊），保證有解、不用搜尋；測試改成每輪 200 個種子貪婪法全部解完、牌局種類超過 150 種。
- **D0637 `ReferenceError: Cannot access 'scale' before initialization`**：`startRound(0)` 寫在 `let scale` 之前。移到宣告之後。
- **私網試玩版的「看學長姐作品」連錯**：程式寫死 `../#/works`，放在私網時會連到 `six-floor-exit/#/works`。改由 `links.mjs` 依所在路徑決定。
- **部署被 `test-hubs.ps1` 擋下**：`RESULT: 1 FAILED: game-prototypes-hub embedded members == flagged members`。根因是 `new-item.ps1 -Force` 重建時把 `pages.json` 那筆的 `"hub":"game-prototypes-hub"` 洗掉。重跑 `tools\build-hubs.ps1` 補回後部署成功（上傳 12 檔）。
- **`hubs.json` 改不進去**：檔案是 CRLF 換行，用 LF 字串比對找不到；只加 `groups` 沒效果，合集成員看的是 `members`。改成先偵測換行，兩邊都加。
- **多步指令整段沒跑**：指令裡夾了 `rm`，被 Blast Radius 擋下。刪檔拆出來，Artifact 改用 `files: null` 移除。
- **回覆跳成英文**：被 Stop hook 擋兩次，改寫成繁體中文。

### 3. 額度花費

- mod 量到：累計工作時間約 64 分鐘；本 session 約 US$187.86；最高用量窗口是週 32%。
- 最耗的一步（推估，mod 沒有分步數字）：實驗室支線整段。要讀 AGY 交回的 5 款遊戲大檔、在無頭 Chrome 反覆跑冒煙與端到端測試、D0637 來回修三次，對話還因此壓縮過一次。其次是 Codex 生 5 張實驗室圖（每張約 100 秒）。私網部署與連結修正相對便宜。

### 4. 下一步與規則建議

下一步：
1. 老師同意後在 `exit6/teachers.mjs` 填 `name`、加進 `CONSENTED`。
2. 隱藏結局文案請系主任確認。
3. 私人試玩 Artifact 還停在第 15 版（沒有實驗室），要不要更新由使用者決定；私網試玩版已是最新。
4. 推 GitHub 前：刪本機備份分支 `backup/exit6-before-filter` 與 `refs/original/`，並確認 `art-src/exit6/ref_labs/` 照片沒進 git。

規則建議（只提案，沒改規則檔）：
- **工具修正優先於規則**：`07_私密網頁/tools/new-item.ps1` 用 `-Force` 重建時應保留原本的 `hub` 欄位。修好就不用靠人記；在那之前，skill 已補一條踩雷。
- **`agy-max` skill 或 AGY 工單範本**：有隨機關卡的小遊戲，規格要寫「關卡用構造法保證有解，不用搜尋驗證」，驗收要「每輪至少 200 個種子全部可解」。這次是主控事後才抓到。
- **專案 AGENTS.md（agd-comic-site）**：遊戲內連回系網的網址一律經 `exit6/links.mjs`，不要寫死 `../#/`；遊戲會同時放在系網、私網和 Artifact 三處。
- hook：無新提案。

下一輪建議：Claude Sonnet 5.5／推理強度中等。剩下的是填老師名字、改文案這類小改動，規格都清楚。

## 復盤 2026-11-03

（TF-BASE，Claude Code；WordPress 版系網 www.dgd.stu.edu.tw 與漫畫版同步、改版、教師資料補齊。程式工作在 `C:/agywork/agd-wp-revamp` worktree，已全部合併進 main：PR #2～#10。）

### 1. 做了什麼、改了哪些檔

**WordPress 版（線上已更新）**
- 37 頁內容依漫畫版正本同步（含拿掉鄧樹遠「電競娛樂系代理主任」），之後改成漫畫版型：章節頭、彩色區塊、教師角色卡（含 300×300 小照片）、課程地圖關卡軌道、表格手機轉卡片、招生頁「已截止」印章、長頁跳轉列、點擊特效（狀聲詞、圖片噴墨）、手機與平板 LINE 小方鈕、拿掉重複標題。
- HFCM #7（外衣 CSS）從 20261008c 升到 20261103e；新增 HFCM #15（點擊特效＋跳轉列＋學校資料整理）。
- 13 位老師頁加回「學校教師資料」：10/06 首次同步時誤刪了學校外掛短碼 `[SDTI getTeacherInfo]`；學校外掛當天一直回 404，改為擷取校務系統「專任教師簡歷表」做成固定內容（只收專業履歷，不含員編、照片、任職日、修業年月；學歷不另列）。
- 教師資料：評鑑報告創新教材 60 筆、業師協同 5 筆、楊智彰學歷；Codex 網路查證後核對來源的 17 筆近年得獎；陳美蓉專書；職稱依校務系統加 (技)；合聘改為職稱下方小字；鄧樹遠學歷「設計學博士候選人」、陳慶鴻學歷補完整。

**檔案（repo 內，用途）**
- `wp-sync/gen.js`：WordPress 37 頁 HTML 產生器；新增 agdc- 版型、角色卡照片、合聘、創新教材、業師協同、專書、學校資料固定內容（沒有就退回即時短碼）。
- `wp-sync/check.mjs`：產生器回歸檢查；新增標題重複、學校短碼與固定內容、專書區塊等檢查。
- `wp-sync/school-data.json`（新）：校務系統簡歷固定內容，13 位。
- `wp-sync/README.md`（新）：同步流程、地雷、還原方式。
- `wp-skin/comic-skin.css`：外衣第 13 節（漫畫版型、手機 13b、學校資料、角色卡照片、合聘小字）。
- `wp-skin/comic-fx.html`（新）：點擊特效、跳轉列、學校外掛輸出整理。
- `wp-skin/build.mjs`、`wp-skin/check.mjs`：產出去註解的特效片段並檢查。
- `pages.jsx`、`chapters-2.jsx`：漫畫版教師頁加創新教材、業師協同、專書、「看學校教師資料」按鈕、合聘小字；備用名單同步職稱。
- `data/faculty.json`、`data/en/faculty.json`、`data/ja/messages.json`、`data/en/ui.json`、`data/ja/ui.json`、`tests/production-baseline.json`（每次正本變更都登記使用者核准）、`locale-en.js`、`locale-ja.js`（建置產物）。

**暫存檔（scratchpad，不在 repo）**：`serve-dir.cjs`、`serve.cjs`、`bridge.html`（本機預覽伺服器）、`eval/add-eval.cjs`、`add-eval-i18n.cjs`、`add-awards.cjs`、`add-teng.cjs`（只新增不覆蓋的資料寫入腳本）、`pr-body.md`～`pr5-body.md`（PR 說明）、`scripts/extract.py`、`index.py`（子代理解析評鑑報告 docx 用）。另有 `C:/agywork/codex-awards-20261103/WORK_ORDER.md`（Codex 網路查證工單與成果）。

### 2. 踩雷與根因

| 症狀 | 根因 | 處理 |
|---|---|---|
| `curl` 抓學校網站回「Human Verification」、REST 回 401 `rest_login_required` | 學校站有人機驗證；REST 需登入 | 改用內建瀏覽器，使用者自行登入後以 `wpApiSettings.nonce` 呼叫 REST |
| 線上頁面 `fetch('http://localhost…')` 回 `TypeError: Failed to fetch`；iframe 也收不到 | 瀏覽器私有網路限制 | 新內容改用 raw.githubusercontent 讀（先推分支）、或注入 JS；大量資料從瀏覽器回本機改走剪貼簿（按鈕複製→`Get-Clipboard`→比對 SHA-1） |
| `node -e` 內 `'\n'` 變成真換行，`gen.js` 出現 `SyntaxError: Invalid or unexpected token` | Bash 吃掉 heredoc／引號內一層反斜線（hook 有提醒） | 改用 Edit 工具或先寫成檔案 |
| 跳轉列插入後頁面黃色標題貼紙消失 | 插在 `.thn_post_wrap` 第一個子元素前，`h1:first-child` 樣式失效 | 改插在 h1 後面 |
| 3 頁手機內文仍只有 283px | 外框選擇器 `.page_wrap .single_wrap > .single_post` 權重較高 | 手機規則補同一選擇器 |
| 外衣檢查失敗（keyframes 的 0%／40% 被當選擇器） | `check.mjs` 範圍規則沒處理 `@keyframes` | 檢查前先移除 keyframes 區塊 |
| 老師反映「教師資訊不完全」 | 10/06 首次同步整頁覆蓋，誤刪學校外掛短碼 | 以修訂版本取回 12 組識別碼，最後改為校務系統固定內容 |
| 學校外掛回 nginx 404，且輸出整份 HTML（含 Bootstrap 4、jQuery 1.12） | 學校外部系統不穩；一次呼叫 12 位更易失敗 | #15 先剝樣式再整理；`:has(table)` 隱藏失敗區塊；最後改固定內容 |
| `gh pr merge` 被擋：`[Merge Without Review]` | 該輪使用者未明確說要合併 | 先只開 PR，取得使用者「合併」指示後再合併 |
| PDF 網址觸發下載對話框 | 該站直接回應下載 | 改在本機用 PyMuPDF 讀（`pdftoppm` 未安裝、主控台 cp950 亂碼→寫 UTF-8 檔再讀） |
| 陳慶鴻頁一度未被檢查到 | 憑記憶猜 slug（chenchingshung）回 404 頁，檢查程式未報錯 | 一律從資料取 slug |
| 漫畫版合併後頁面仍顯示舊資料 | GitHub Pages 快取約 10 分鐘 | 以 `cache:'no-store'` 驗資料檔與程式包，10 分鐘後再看頁面 |
| 語言 hook 擋下 PR 說明裡老師識別碼的用詞 | zh-lint 規則（台灣用語） | 改「識別碼」「短碼（shortcode）」 |

### 3. 額度花費

- mod 量測：累計工作時間約 100 分鐘；本 session 約 **US$62.07**；最高用量窗口：週 8%。
- 最耗的步驟：把產生器（約 16K 字元）、外衣 CSS（約 14K）、特效腳本（約 6K）原文經對話送進瀏覽器做預覽與上線，以及多次整頁手機截圖。其次是子代理讀 8 MB 評鑑報告（約 20 萬 token）。Codex 網路查證約 28 萬 token（走 ChatGPT 訂閱，不計入本 session 美金）。後半段改用「推分支→瀏覽器讀 raw.githubusercontent」與剪貼簿傳資料後，單次上線成本明顯下降。

### 4. 下一步與規則建議

**下一步**
1. 問陳慶鴻老師「手機版不完全」是哪一頁哪一段（目前兩版都重現不出；可能是今天修正前的舊表格）。
2. 英文新增句子都標 `[CHECK]`，需人工確認（教材 60、業師 5、得獎 12、職稱與合聘、專書譯名）。
3. 學校資料固定內容日期為 2026-11-03，建議每學期由使用者登入校務系統後重抓一次（`wp-sync/README.md` 有流程）。
4. 尚未處理：評鑑報告表 3-3-7 服務領導帶隊 18 筆（使用者未選）；江雅媚證照是否補「正指導師」與 2025 年 5 張新證照；楊智彰職稱是否加 (專)；漫畫版個人頁照片下方空白網點帶。
5. `C:/Projects/agd-comic-site` 主 checkout 仍在 `feat/exit6-corridor-game` 分支（本復盤即寫在此分支的交接檔，未 commit）。

**規則建議（只提案，未改規則檔）**
- `agd-comic-site` skill 增加「WordPress 版」一節：REST＋nonce 寫入、HFCM 以 CodeMirror `setValue` 更新、上線前後以 SHA-1 比對、Pages 快取 10 分鐘、學校資料固定內容的重抓流程與個資範圍（只收專業履歷）。理由：這些都無法從程式碼推知，下次同步一定會再遇到。
- `browser-bot-runner` skill 補「瀏覽器→本機傳大資料走剪貼簿＋SHA-1 比對；本機→瀏覽器先推分支用 raw.githubusercontent」。理由：本次最大成本來源。
- 不建議新增 AGENTS.md 全域規則：涉及的地雷都是本專案特有，放 skill 即可。

下一輪建議：Claude Code／claude-opus-5-5／high
理由：剩下的是資料核對與老師回饋後的修正，需要逐筆查證；主線留在 Claude 家族。
狀態：只提出建議，不切換模型、不建立新工作、不自行派工。

## 補記 2026-11-14：2026-11-11 系網風格調整提案（與《六樓出口》無關，記在這裡是因為這個 clone 只有這份交接檔）

claude-code（TF-BASE）封存「系網圖片風格調整提案」對話前，依對話紀錄整理。這一輪只提案與樣張，沒有改站，沒有任何方向定案。

- 成果在 `docs\style-proposal\`（`docs/` 被 `.gitignore` 排除，不進版控）：`系網圖片風格調整提案_20261111.md`、`系網整體設計風格提案_20261111.md`、`measure-20261111.json`、`mock\design-mock.html`（長卷、集字、甲原畫桌、乙黑白漫畫四個分頁）。
- 私人 Artifact：https://claude.ai/artifact/2m2Kdns2CeYNLXpFjMAxhB
- 使用者意見：甲、乙被退（太素）；集字被退（太嚴肅）；「長卷」交出後還沒回覆。
- 下一步：①等使用者看「長卷」決定；②書法字庫來自商業光碟、不可公開，能不能用在公開系網要使用者決定；③定案後才寫風格規格卡（`art-deai`）與改站；④測驗分享圖 4 張的提示詞含作品名，重生時要拿掉；師資肖像底圖 13 張來源查不到。
- `mock\_preview.html` 是暫存檔，可刪（當時刪除被安全機制擋下）。
- 完整四輪紀錄與提案副本在 Vault：`00 Codex 永久記憶\專案紀錄\附件\系網漫畫版_AGDComicSite\風格提案_20261111\`；摘要在 `專案紀錄\系網漫畫版_AGDComicSite.md`「2026-11-14 補記」。
