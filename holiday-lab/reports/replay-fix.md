# 成品回放修正與複驗

2026-10-22，source_agent: codex。範圍為共用回放器；不更改各遊戲規則，不啟動 Unity、不 push、不發布、不碰 main、不刪檔。

## 改動

- 玩具配音依各段實際保存的 `material` 與 `cue` 播放音效。
- 月光剪接依保存的 `frames` 插值位置，切換後使用保存的終點；清明的真實路徑資料亦由同一機制讀取。
- 行憲字幕依保存的語言、換行、位置、紙帶、文字色與字級顯示。ResizeObserver 在舞台改變時調整字級，離開時解除。
- 桌機作品縮到手機時，原比例可使字幕降到 9.78px；實際截圖發現後加 16px 最小閱讀字級。保存的創作資料不變，桌機保留比例，較小舞台採可讀性保護。
- 分頁 hidden 訊號會停止聲音，回到可見時不補跑隱藏時間；離開回放會取消 RAF、停止音效、移除事件監聽與 ResizeObserver。
- `replay-model.mjs` 納入本機 build 的 runtime 白名單。

## 紅燈證據

以 `REPLAY_BASELINE=1` 將瀏覽器收到的 runner 替換為既有提交 `1f7ad61`，遊戲模組與玩家操作均維持相同。沒有呼叫 `complete`、沒有改遊戲狀態跳關。舊 renderer 仍忽略已保存的音效、frames 與文字資料。

```text
$env:REPLAY_BASELINE='1'; node holiday-lab/tests/replay-browser.test.cjs
NO children replay plays wood, metal and paper at the saved cues: page.waitForFunction: Timeout 10000ms exceeded.
NO mid-autumn replay interpolates saved motion and pauses on hidden signal: must move within shot: 21.5 -> 21.5
NO constitution replay keeps actual multiline captions and resizes their saved type: locator.waitFor: Timeout 1500ms exceeded.
TOTAL 0/3; page errors 0
exit code 1
```

完整資料見 `replay-fix-evidence/red.json`。字幕最小字級另先新增失敗測試，出現 `does not provide an export named 'captionFontSize'`、exit 1，再實作後轉綠；這項是新增閱讀保護的 TDD，並非把缺少函式錯誤冒充原來回放缺字的症狀。

## 綠燈與逐條驗收

| 條件 | yes／no | 實際證據 |
|---|---|---|
| 木、金屬、紙三段回放皆呼叫真實 Audio.play 並成功開始解碼播放 | yes | `green.json`，三種材質分別在 shot 0／1／2，`started:true` |
| 音效停止與無隱藏期間的新播放 | yes，模擬 hidden 訊號 | 真實音效啟動後送 visibilitychange；捕捉 pause，隱藏 1100ms 未新增 play |
| 月光同一鏡頭內位置會隨保存時間前進 | yes | `green.json` 的 first／moving，非原本固定 21.5% |
| 月光切後位置等於保存的 endX | yes | `afterCut.left === artifact.cuts[0].endX` |
| 模擬 hidden 期間位置不前進、恢復不補跑 1100ms | yes，模擬訊號 | hiddenBefore／hiddenAfter 相等，resumed 仍在原鏡頭 |
| 行憲三段字幕逐段吻合實際保存的日文與換行 | yes | `allCaptions` 與各 artifact.words.ja 逐筆比對 |
| 390px 字幕至少 16px、無 DOM 溢位 | yes | mobile.fontSize 16、overflow false、實際截圖 |
| 離開後無字幕節點、無後續音效 | yes | exitRemovesText、exitStopsReplay |
| 真正切換瀏覽器背景分頁已驗證 | no | 本輪只模擬 document.hidden，不能代替真背景分頁證據 |
| 真人學生可讀性、好玩程度與使用者美術確認 | no | 本輪為代理自動操作與截圖檢視 |

```text
node --test holiday-lab/tests/replay-model.test.mjs holiday-lab/tests/children*.test.mjs holiday-lab/tests/mid-autumn*.test.mjs holiday-lab/tests/constitution*.test.mjs
tests 21
pass 21
fail 0
exit code 0

node holiday-lab/build-review.mjs .review-replay-02
UI policy: pass true, assets 257, screens 9, errors []
REVIEW_ONLY: .review-replay-02; 342 files; no publication performed.
exit code 0

$env:REPLAY_BUILD_DIR='.review-replay-02'; node holiday-lab/tests/replay-browser.test.cjs
YES children replay plays wood, metal and paper at the saved cues
YES mid-autumn replay interpolates saved motion and pauses on hidden signal
YES constitution replay keeps actual multiline captions and resizes their saved type
TOTAL 3/3; page errors 0
exit code 0

node --check holiday-lab/runner.mjs
node --check holiday-lab/tests/replay-browser.test.cjs
exit code 0
```

Build 有既存 JSX `color` 重複 key 警告（client／SSR 各一筆）；本修正未處理首頁元件。回放測試只覆蓋上述三款與共用回放行為，不代表新增五款或全部十五款已完成整合驗收。畫面檢視見 `replay-fix-evidence/constitution-mobile-ja.png` 與 `mid-autumn.png`；圖像仍是待使用者確認候選。

可重跑的瀏覽器測試自行啟動 8803 測試伺服器、記錄實際 served runtime SHA-256，結束後只停止自己啟動的程序。指定 `REPLAY_BASE_URL` 時不啟停外部伺服器。獨立五款 QA 使用的 8804／`.review-replay-01` 保持不動；最新最小字級保護在 `.review-replay-02`，主控最終整合 build 應採目前來源。
