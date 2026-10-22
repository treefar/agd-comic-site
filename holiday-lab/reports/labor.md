# labor：獨立本機試作

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
node --test holiday-lab/tests/labor.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/agywork/agd-hg-labor/holiday-lab/games/labor.mjs'
exit code 1

node --test holiday-lab/tests/labor.test.mjs
✔ dependencies, overlap, breaks, workload and bounds are real constraints (2.0296ms)
✔ multiple legitimate production schedules change the saved replay (3.0724ms)
✔ resource failures explain rest, conflicting jobs and excessive work distinctly (0.3621ms)
✔ three-language schedule callbacks and preview cleanup zh (2.6527ms)
✔ three-language schedule callbacks and preview cleanup en (1.1795ms)
✔ three-language schedule callbacks and preview cleanup ja (2.2533ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 179.7889

exit code 0

node --check holiday-lab/games/labor.mjs
(無輸出)
exit code 0
```

## 精確瀏覽器解法（僅驗收者使用）

六件工作以 #labor-worker-0..5 選ABC（按鈕後綴0/1/2），#labor-start-0..5 調開始。一組可行：負責人[0,1,2,0,1,2]、開始[0,10,22,10,22,34]。另一組：負責人[0,1,2,2,1,2]、開始[0,10,22,8,22,34]。可按 #labor-preview 看10倍縮時交接，再 #labor-save；初始全A/0會失敗。最後保存artifact jobs/load/finish與實際排程一致。

## 動態及原創界線

兩鏡頭×三工序可並行，前置/工作重疊/休息/負荷/收件時間各自判斷。兩種以上合法排程會改變artifact與回放工作位置。預覽明標10倍縮時，不把虛擬50時間單位冒稱真實50秒。這是虛構動畫合作，不是現實勞動法規教學。

只用ctx與生成圖片，未畫Canvas/SVG/程序面板。提交前git diff --cached --check須實跑無輸出；格式警告若有，先修再提交。
