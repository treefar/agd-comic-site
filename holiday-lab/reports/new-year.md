# 明年的第一格：子代理交付

2026-10-22。分支 `codex/hg-new-year`；只交模組、測試、此報告。沒有 push、main、刪檔、共同檔或 C 節修改。

## 玩法與實作

三幕的起步／騰空／落地各有三個時間滑桿。畫面位置由玩家的三段時間計算；必須試播完整動作才能送出。修改任何滑桿會使舊試播失效。失敗保留參數供重試，成功進入不同節拍的下一幕。結果保存三幕實際 timing、分數、嘗試次數；9格重播的停留時間與角色位置由保存參數推導。

## 逐條驗收

| 條件 | yes/no | 證據 |
|---|---|---|
| 測試先紅 | yes | 實跑 `node --test holiday-lab/tests/new-year.test.mjs` → exit 1，`ERR_MODULE_NOT_FOUND`，`tests 1 / pass 0 / fail 1` |
| 規則、非法輸入、不會自動完成、重置、不同輸入影響結果 | yes | 中心座標修正後重跑同指令：exit 0，`tests 4 / pass 4 / fail 0 / cancelled 0 / skipped 0 / todo 0`，duration 89.3814 ms |
| 契約互動走三幕、預覽閘門與卸載取消 frame | yes | 第4個測試 `mounted controls require a full fresh preview and teardown unsubscribes` 通過；使用測試 ctx，非瀏覽器畫面證據 |
| ES module 語法 | yes | `node --check holiday-lab/games/new-year.mjs` → exit 0，stdout 空白 |
| 中英日動態文字 | yes | 模組全部透過 `{zh,en,ja}`；標籤及回饋均提供三語。譯文尚未母語校閱 |
| 模組無自行繪圖或外連 | yes | 僅 ctx sprite、ui、onFrame，未建 Canvas/SVG/程序圖片／計時器／網路 |
| 實際瀏覽器及 Build | no | 此分支僅遊戲模組，主控的素材、共用外框與 Build 尚未整合；由主控獨立執行 |
| 實機手機、美術使用者確認 | no | 未執行／尚未獲確認，不能由邏輯測試替代 |

最新完整綠燈輸出：

```text
✔ no spontaneous completion; invalid timing cannot advance
✔ all three timing scenes are required and reset is fresh
✔ accepted variations preserve timing and alter playback
✔ mounted controls require a full fresh preview and teardown unsubscribes
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

## 主控瀏覽器解法

全部 Sprite 的 x/y 是中心百分比，已配合共用外框；最少有效動畫試播共2.88秒，操作閱讀目標30–90秒，沒有隱藏跳關。

原生 range 的實際 DOM id 由共用 ui 決定；本模組傳入穩定 id：`ny-hold-0`、`ny-hold-1`、`ny-hold-2`。每幕依序設下列數值，觸發 input；按 `ny-preview`，讓正常 ctx.onFrame 播滿後按 `ny-submit`。

| 幕 | 起步 ms | 騰空 ms | 落地 ms | 最少試播 |
|---|---:|---:|---:|---:|
| 1 | 400 | 180 | 380 | 960 ms |
| 2 | 320 | 140 | 320 | 780 ms |
| 3 | 500 | 220 | 420 | 1140 ms |

負面驗證：一開始直接送出不能前進；600/500/100完整試播後送出仍不能前進；試播完成後改任何滑桿，直接送出必須要求重新試播。重播應有9格。第二次使用440/160/400等容許變體，實際 artifact／重播停留時間必須改變。鍵盤使用 Tab 與原生滑桿方向鍵、按鈕 Enter；無強迫拖曳。30–90秒是目標遊玩長度，未以等待時間強制達成。
