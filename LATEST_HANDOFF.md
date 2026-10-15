# 《六樓出口》交接檔（LATEST_HANDOFF）

最後更新：2026-10-15（TF-BASE，Claude Opus 5.5）。本檔不發布到網站（scripts/build.mjs EXCLUDE）。

## 一句話

系網招生小遊戲：設計大樓 D 棟六樓 8 站循環走廊找異常（《8 番出口》式），系網漫畫風，含尋址任務、線索密碼門、邱士展老師 D0647 片場對決。

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
