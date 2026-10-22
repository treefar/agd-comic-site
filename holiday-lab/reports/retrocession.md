# retrocession：獨立本機試作

source_agent: codex；2026-10-22。唯一所有權為本款games/tests/reports三檔。未push、未碰main、未刪檔、未改共同外框/C節。

|驗收|yes/no|實際證據|
|---|---|---|
|純規則先紅後綠|yes|紅 exit 1；綠 exit 0|
|非法操作不完成、不同有效輸入保留不同作品|yes|下列實跑Node測試|
|中英日ctx操作與destroy|yes|各一項mount測試|
|Sprite及控制DOM id無碰撞|yes|fake ctx逐筆收集所有id；Sprite固定-sprite後綴|
|語法與diff檢查|yes|兩項exit 0/0|
|實際瀏覽器通關、素材畫面/文字安全區|no|待root整合與獨立QA，沒有以fake ctx冒充|
|使用者確認美術|no|圖像由root供應候選；尚未確認|

## 紅燈實際命令（輸出節錄）

```text
node --test holiday-lab/tests/retrocession.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/agywork/agd-hg-retrocession/holiday-lab/games/retrocession.mjs'
exit code 1
```

## 綠燈實際命令與輸出

```text
node --test holiday-lab/tests/retrocession.test.mjs
✔ all anchor points matter, not a single translated landmark (1.2955ms)
✔ rigid transforms preserve distances in 16:10 space and accepted variation changes output (1.5539ms)
✔ three-language alignment callbacks and cleanup zh (1.1265ms)
✔ three-language alignment callbacks and cleanup en (0.3222ms)
✔ three-language alignment callbacks and cleanup ja (3.3779ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 90.6699

exit code 0
node --check holiday-lab/games/retrocession.mjs
(無輸出)
exit code 0
git diff --check
(無輸出)
exit code 0
```

## 精確瀏覽器解法（只供驗收，不顯示給玩家）

#archive-x/y/rotation/scale 依三關可用解：(-10,5,0,1)、(10,-3,12,1)、(-4,-5,-10,1.15)，各按 #archive-save。可用x偏移+0.2等合法近似；三個錨點平均誤差≤1.8均接受。畫面只提示位置/角度/間距，不顯示這些目標數字。

三語所有可見文字由W物件提供；結果artifact及≥3重播鏡頭取實際玩家輸入。只用ctx.ui與Codex生成Sprite，不畫SVG/Canvas/程序面板。規則與場景均屬虛構創作，不把紀念日史事或法律推論包成答案。
