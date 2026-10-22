# peace-memory：獨立本機試作

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
node --test holiday-lab/tests/peace-memory.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/agywork/agd-hg-peace-memory/holiday-lab/games/peace-memory.mjs'
exit code 1
```

## 綠燈實際命令與輸出

```text
node --test holiday-lab/tests/peace-memory.test.mjs
✔ partial and clipped listening never complete; different orders preserve different work (2.8046ms)
✔ leaving the reading window resets partial attention and rejects illegal inputs (0.1914ms)
✔ three-language mount and teardown zh (1.3055ms)
✔ three-language mount and teardown en (0.7765ms)
✔ three-language mount and teardown ja (0.3904ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 79.784

exit code 0
node --check holiday-lab/games/peace-memory.mjs
(無輸出)
exit code 0
git diff --check
(無輸出)
exit code 0
```

## 精確瀏覽器解法（只供驗收，不顯示給玩家）

#peace-person 的三個選項按鈕為 #peace-person-0/1/2，可任意順序。例2→0→1：每次將 #peace-x 分別設80/20/50，#peace-y=65，#peace-width=24，再按 #peace-listen，讓實際ctx.onFrame累計至少1.2秒。等待說明顯示收錄後換下一位。也可X稍微偏移且加寬，並非唯一數字解。初始X50/Y50包不住左側訊息，按聆聽後不能完成。

三語所有可見文字由W物件提供；結果artifact及≥3重播鏡頭取實際玩家輸入。只用ctx.ui與Codex生成Sprite，不畫SVG/Canvas/程序面板。規則與場景均屬虛構創作，不把紀念日史事或法律推論包成答案。
