# 月光剪接台：子代理交付

2026-10-22。分支 `codex/hg-mid-autumn`；只交模組、測試、此報告。沒有 push、main、刪檔、共同檔或 C 節修改。

## 玩法與實作

依序剪出月亮→車輪→圓燈→月亮。每段速度與目標大小、位置不同，玩家調整起始位置、大小與剪接時刻，實際剪接位置是 `起點 + 速度 × 秒數`，不是三個互不相關答案。先試剪才能保留；修改會撤銷舊試剪資格。錯誤顯示時間／位置／大小差異供修正。結果6鏡頭使用玩家實際參數，保留三個剪接紀錄。

## 逐條驗收

| 條件 | yes/no | 證據 |
|---|---|---|
| 測試先紅 | yes | 實跑 `node --test holiday-lab/tests/mid-autumn.test.mjs` → exit 1，`ERR_MODULE_NOT_FOUND`，`tests 1 / pass 0 / fail 1` |
| 非法輸入、壞剪接、不會自動完成、重置與變化保留 | yes | 最新同指令 exit 0，`tests 4 / pass 4 / fail 0 / cancelled 0 / skipped 0 / todo 0`，duration 74.4452 ms |
| 契約互動三幕、試剪閘門與取消 frame | yes | 第4個測試 `mounted cut requires fresh preview, retains edits, and unsubscribes`；測試 ctx 非畫面證據 |
| ES module 語法 | yes | `node --check holiday-lab/games/mid-autumn.mjs` → exit 0，stdout 空白 |
| 中英日全部可見字串 | yes | 標籤、參考、差異、結果均三語；尚未母語校閱 |
| 模組無程序美術／外連／獨立計時器 | yes | 只有契約 ctx 的圖、文字、輸入及 onFrame |
| 實際瀏覽器及 Build | no | 主控的素材與共用外框待整合；需主控獨立驗證 |
| 實機手機、美術使用者確認 | no | 未執行／尚未獲確認 |

最新完整綠燈輸出：

```text
✔ invalid and badly timed edits never complete
✔ three real cuts required; reset has no saved edits
✔ position depends on chosen time and accepted edits retain variation
✔ mounted cut requires fresh preview, retains edits, and unsubscribes
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

## 主控瀏覽器解法

穩定 id：`ma-time`、`ma-x`、`ma-size`；設值並觸發 input，按 `ma-preview`，正常 ctx.onFrame 跑滿所選時間，按 `ma-submit`。

| 段 | 時刻 ms | 起點 x％ | 大小％ | 完成試剪所需 |
|---|---:|---:|---:|---:|
| 月→輪 | 900 | 21.5 | 20 | 900 ms |
| 輪→燈 | 1200 | 38 | 26 | 1200 ms |
| 燈→月 | 750 | 56.5 | 18 | 750 ms |

第三段精確數學起點56.25不符合0.5步進，使用56.5可通過（終點45.25，容許位置差4％）。時間容許±140ms，大小±3％。負面驗證：未試剪不能送出；初始500/10/12試剪後仍失敗；改時間會連動切換位置；試剪後改滑桿必須重試剪。不同容許變體如第一段950/23.5/20，artifact endX 與重播位置必須改變。所有操作可用 Tab／方向鍵／Enter，不強迫拖曳。目標30–90秒待主控實測。
