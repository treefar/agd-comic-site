# qingming：獨立本機試作

source_agent: codex；2026-10-22。唯一所有權games/tests/reports三檔；不push、不碰main、不刪檔、不改共用外框/C節。

|驗收|yes/no|實際證據|
|---|---|---|
|純規則紅綠循環|yes|先缺模組exit1，完成後下列測試exit0|
|多種合法操作、非法不完成、實際作品資料|yes|純規則測試與三語ctx操作|
|中英日控制與destroy|yes|三語各一個mount測試；Sprite id固定-sprite且無碰撞|
|Node語法|yes|exit0|
|真瀏覽器／圖像／字底驗證|no|待root整合獨立QA，fake ctx不代替實際通關|
|使用者美術確認|no|尚未確認候選圖|

## 實際指令與輸出

```text
node --test holiday-lab/tests/qingming.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/agywork/agd-hg-qingming/holiday-lab/games/qingming.mjs'
exit code 1

node --test holiday-lab/tests/qingming.test.mjs
✔ continuous line control reaches three different wind windows and saves actual flight (7.7831ms)
✔ fixed-step flight is stable across frame sizes; bad controls and retry do not invent captures (3.6955ms)
✔ three-language live flight and teardown zh (5.4345ms)
✔ three-language live flight and teardown en (2.1526ms)
✔ three-language live flight and teardown ja (1.719ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 151.3009

exit code 0

node --check holiday-lab/games/qingming.mjs
(無輸出)
exit code 0
```

## 精確瀏覽器解法（僅驗收者使用）

三段都可用 #kite-angle=0、#kite-length=100。第1/3段 #kite-tension=0，第2段=.44。每段按 #kite-play，以真實RAF持續飛行至進度跳下一段，再按play接下一段。可看 #game-progress 的0/1/2/3；總實際飛行約22秒，不能直接按完成。漏過可按 #kite-retry 回本段，會保存已完成前段。更慢/快的角度與微幅線長／張力變化也有合法解。

## 動態及原創界線

固定0.02秒內部步長；拆成不同RAF步長的首個命中位置誤差測試通過。不是拿既有Google發射侏儒換皮，沒有拋射、最遠距離計分或沿途種花；只操控紙鳶張力/線長/角度穿三段有限風窗。result用實際採樣路徑及capture做9鏡頭回放。

只用ctx與生成圖片，未畫Canvas/SVG/程序面板。提交前git diff --cached --check須實跑無輸出；格式警告若有，先修再提交。
