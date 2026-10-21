# tune-collapsed

日期：2026-10-21（目錄依工單用 20261022）。

面板預設只顯示標題與三顆按鈕。展開可調 28 鍵；複製 JSON／還原預設會展開供檢視。統計列移入可收合區。390×844 畫面截圖在本輪 workspace work/panel-after.png 與 panel-expanded.png；已實際開圖檢查遊戲完整可見。

分支：codex/tune-collapsed；基準：e492e58。

| 驗收 | yes／no | 證據 |
|---|---|---|
| 預設遊戲可見面積 ≥70% | yes | 原版17.95%，修後100%；面板高度759.59→65.78px |
| 展開 28 滑桿可用 | yes | 逐支改到 max 並核對 TUNING；還原預設 |
| wo02check 行為相同 | yes | 扣墨42→72、公開版7／調校版12、JSON28鍵、errors=[]；收合按鈕初值按需求改展開 |
| 相關測試全過 | yes | 16/16；不改既有測試 |
| 範圍 | yes | 只 tuning.js 與本報告 |

## 實際指令輸出

```text
> node "C:\Users\treef\Documents\Codex\2026-10-21\c-projects-agdcomicsite-latest-handoff-md\work/panel-check.cjs" before
{
  "viewport": [
    390,
    844
  ],
  "panel": {
    "x": 62,
    "y": 8,
    "width": 320,
    "height": 759.59375
  },
  "game": {
    "x": 0,
    "y": 312.3125,
    "width": 390,
    "height": 219.375
  },
  "visibleGameRatio": 0.17948717948717952,
  "visibleSliders": 28,
  "buttons": [
    "複製 JSON",
    "還原預設",
    "收合"
  ]
}
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

28 !== 0

    at browser.viewport.width (C:\Users\treef\Documents\Codex\2026-10-21\c-projects-agdcomicsite-latest-handoff-md\work\panel-check.cjs:2:1021)
    at async exports.browser (C:\Users\treef\Documents\Codex\2026-10-21\c-projects-agdcomicsite-latest-handoff-md\work\common.cjs:7:785)
    at async C:\Users\treef\Documents\Codex\2026-10-21\c-projects-agdcomicsite-latest-handoff-md\work\panel-check.cjs:2:12 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 28,
  expected: 0,
  operator: 'strictEqual',
  diff: 'simple'
}

exit=1

> node "C:\Users\treef\Documents\Codex\2026-10-21\c-projects-agdcomicsite-latest-handoff-md\work/panel-check.cjs" after
{
  "viewport": [
    390,
    844
  ],
  "panel": {
    "x": 62,
    "y": 8,
    "width": 320,
    "height": 65.78125
  },
  "game": {
    "x": 0,
    "y": 312.3125,
    "width": 390,
    "height": 219.375
  },
  "visibleGameRatio": 1,
  "visibleSliders": 0,
  "buttons": [
    "複製 JSON",
    "還原預設",
    "展開"
  ]
}
expanded sliders=28 all 28 inputs update TUNING=yes; reset=yes

exit=0

> node C:/agywork/agd-site-qa-scripts/wo02check.cjs C:/agywork/agd-site-codex
{
 "panel": {
  "panel": true,
  "sliders": 28,
  "buttons": [
   "複製 JSON",
   "還原預設",
   "展開"
  ],
  "statsKeys": [
   "fails",
   "seconds",
   "jitterCount",
   "springLag",
   "stepsPerSecond"
  ]
 },
 "beforeSlider": {
  "inkBefore": 100,
  "inkAfter": 58,
  "drop": 42,
  "jitterDelta": 6,
  "state": "play"
 },
 "sliderNow": 12,
 "afterSlider": {
  "inkBefore": 100,
  "inkAfter": 28,
  "drop": 72,
  "jitterDelta": 6,
  "state": "play"
 },
 "statsLine": "失誤 0 · 0.0 秒 · 扣墨 0 次 · 落後 0.0 px · 步數/秒 0.0",
 "lsAfterSlider": 12,
 "publicLoad": {
  "costTouch": 7,
  "panel": false
 },
 "tuneReload": {
  "costTouch": 12,
  "panel": true
 },
 "copy": {
  "status": "請在下方全選複製",
  "totalKeys": 28,
  "costTouch": 12
 },
 "reset": {
  "costTouch": 7,
  "ls": null
 },
 "errors": []
}

exit=0

> node --test tests/en-play.test.mjs
✔ data/en/faculty.json 與中文版結構一致 (4.2392ms)
✔ data/en/curriculum.json 與中文版結構一致 (2.1342ms)
✔ data/en/labs.json 與中文版結構一致 (1.3726ms)
✔ data/en/works.json 與中文版結構一致 (1.1942ms)
✔ data/en/videos.json 與中文版結構一致 (1.1727ms)
✔ data/en/stats.json 與中文版結構一致 (1.8129ms)
✔ data/en/news.json 與中文版結構一致 (1.8942ms)
✔ data/en/admission.json 與中文版結構一致 (1.2536ms)
✔ play.json 每款遊戲的入口與封面都存在、層級有效 (2.2546ms)
✔ 創作不斷線：碰撞遮罩三段都從起點連到終點 (59.5664ms)
✔ 創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡 (6.0716ms)
✔ bundle.js 已包含英文頁與試玩區 (0.8975ms)
✔ 試玩區：五款都有雙語製作與授權欄位 (0.3718ms)
✔ 創作不斷線：調校預設鍵與原值完整 (0.9967ms)
AUTO-PLAY [{"level":1,"state":"won","fails":0},{"level":2,"state":"won","fails":0},{"level":3,"state":"won","fails":0}]
JITTER {"before":{"ink":72,"count":4},"after":{"ink":44,"count":4}}
✔ 創作不斷線：瀏覽器通關、即時調校、持久化與公開版隔離 (1576.2454ms)
✔ 創作不斷線：手感常數不可寫死回遊戲 (0.7151ms)
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1749.6369

exit=0

> git diff --stat e492e58
 play/creative-line/tuning.js | 9 +++++----
 1 file changed, 5 insertions(+), 4 deletions(-)
warning: in the working copy of 'play/creative-line/tuning.js', LF will be replaced by CRLF the next time Git touches it

exit=0
```
