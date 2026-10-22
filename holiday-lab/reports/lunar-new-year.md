# 年獸表演課：子代理交付

2026-10-22。分支 `codex/hg-lunar-new-year`；只交模組、測試、此報告。沒有 push、main、刪檔、共同檔或 C 節修改。

## 玩法與實作

同一原創年獸依序演驚喜、開心與拜年。眉角、睜眼、嘴形和鞠躬角度滑桿即時改變生成圖層的 transform。三幕有不同參考，容許個人變化。錯誤保留參數，可按歸零重新設計。結果3鏡頭保存實際眉眼嘴與姿態，不是固定演出。呼吸微動用 ctx.onFrame，減少動態模式不呼吸；無攝影機或情緒辨識。

## 逐條驗收

| 條件 | yes/no | 證據 |
|---|---|---|
| 測試先紅 | yes | 實跑 `node --test holiday-lab/tests/lunar-new-year.test.mjs` → exit 1，`ERR_MODULE_NOT_FOUND`，`tests 1 / pass 0 / fail 1` |
| 非法表情、錯誤順序、不會自動完成、重置、變化保留 | yes | 中心座標修正後重跑同指令 exit 0，`tests 4 / pass 4 / fail 0 / cancelled 0 / skipped 0 / todo 0`，duration 95.4412 ms |
| 契約互動走三幕、實際輸入寫入結果、取消 frame | yes | 第4個測試 `mounted sliders capture three actual poses and clean up frame subscription`；測試 ctx 非畫面證據 |
| ES module 語法 | yes | `node --check holiday-lab/games/lunar-new-year.mjs` → exit 0，stdout 空白 |
| 中英日所有可見字串 | yes | 各標籤、數值參考、成功失敗均為三語物件；尚未母語校閱 |
| 素材／UI不由模組生成 | yes | 只用 ctx 的生成 Sprite、UI；沒有程序美術／外連／自訂 RAF |
| 實際瀏覽器及 Build | no | 主控素材／外框尚未合併，此模組分支無可獨立顯示的頁面，待主控獨立驗證 |
| 實機手機、美術使用者確認 | no | 未執行／尚未獲確認 |

最新完整綠燈輸出：

```text
✔ neutral expression never wins; rejects missing or nonfinite controls
✔ surprise then smile then bow are separate tasks
✔ different accepted expressions change saved creation and transforms
✔ mounted sliders capture three actual poses and clean up frame subscription
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

## 主控瀏覽器解法

全部 Sprite 以中心百分比定位；臉部圖層會隨鞠躬中心旋轉，不固定懸在原位置。目標30–60秒，沒有強制等待時間。

穩定滑桿 id 是 `lny-brow`、`lny-eyes`、`lny-mouth`、`lny-pose`，每次設值觸發 input，再按 `lny-submit`。按鈕 `lny-reset-pose` 只重置目前表情，不清掉已完成幕。

| 幕 | 眉角 | 眼 | 嘴 | 鞠躬 |
|---|---:|---:|---:|---:|
| 驚喜 | -20 | 1.4 | 0.7 | 0 |
| 開心 | 10 | 0.8 | 1 | 0 |
| 拜年 | 0 | 0.7 | 0.5 | 30 |

負面驗證：初始中性直接拍照不能前進；第一幕不能用拜年數值跳過；成功三幕後才出結果。變體 -16/1.4/0.8/0 也可通過第一幕，artifact 及重播眉嘴的變形必須隨之改變。鍵盤 Tab／原生 range 方向鍵／Enter，無強迫拖曳。目標遊玩30–90秒，尚待主控實測可讀性與節奏。

## P1複驗：圖層與輸入DOM id衝突

2026-10-22。只將三個Sprite id改為lny-brow-sprite、lny-eyes-sprite、lny-mouth-sprite，原輸入id與玩法都不變。

| 驗收 | yes/no | 實際證據 |
|---|---|---|
| 回歸測試確實抓到三個重複id | yes | 修復前5 tests / pass 4 / fail 1；AssertionError實際duplicates為lny-brow、lny-eyes、lny-mouth |
| 修復後所有DOM id唯一 | yes | 新增測試同時收集sprite、text、button、slider的id；下列5/5綠燈 |
| 原滑桿id保持不變 | yes | 測試逐筆比對lny-brow、lny-eyes、lny-mouth、lny-pose |
| 語法與差異檢查 | yes | 下列各exit code 0 |
| 真實瀏覽器與整合Build | no | 由主控cherry-pick後獨立複驗，本次只跑所屬模組測試 |

紅燈實際命令：node --test holiday-lab/tests/lunar-new-year.test.mjs，exit code 1，duration 90.8615 ms。錯誤：AssertionError [ERR_ASSERTION]: DOM ids shared by sprites and input controls must never collide，actual [lny-brow, lny-eyes, lny-mouth]，expected []。

修復後本次完整輸出：

```text
node --test holiday-lab/tests/lunar-new-year.test.mjs
✔ neutral expression never wins; rejects missing or nonfinite controls (0.8454ms)
✔ surprise then smile then bow are separate tasks (0.2614ms)
✔ different accepted expressions change saved creation and transforms (0.7463ms)
✔ mounted sliders capture three actual poses and clean up frame subscription (2.0063ms)
✔ sprite and control DOM ids are unique while stable slider ids remain unchanged (0.4429ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 85.4334
exit code 0

node --check holiday-lab/games/lunar-new-year.mjs
(無輸出)
exit code 0

git diff --check
warning: in the working copy of 'holiday-lab/games/lunar-new-year.mjs', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'holiday-lab/tests/lunar-new-year.test.mjs', LF will be replaced by CRLF the next time Git touches it
exit code 0
```
