# constitution：同一頁，都看懂

2026-10-22；codex獨立分支。所有權限games/tests/reports三檔。不push、不碰main、不刪檔、不修改C節。

|驗收|yes/no|實際證據|
|---|---|---|
|純規則紅綠循環|yes|先缺模組exit1，完成後5/5測試exit0|
|字級、分行、時間、對比、人物安全區實際約束|yes|evaluateCaption測試逐項拒絕失敗參數|
|多種合法結果、保存實際排版|yes|不同位置及停留時間產生不同artifact|
|中英日操作與清理|yes|三語各一個mount測試，必須完整預覽才可保存|
|Node語法／staged diff檢查|yes|下列指令exit0，無輸出|
|真瀏覽器、圖片、字底驗證|no|待root整合獨立QA；fake ctx不是瀏覽器驗收|
|使用者美術確認|no|尚未於對話確認候選圖|

## 實際指令與輸出

```text
node --test holiday-lab/tests/constitution.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/agywork/agd-hg-constitution/holiday-lab/games/constitution.mjs'
exit code 1

node --test holiday-lab/tests/constitution.test.mjs
✔ legibility, reading time, contrast and face safety are independent constraints (1.3123ms)
✔ three real multilingual captions accept different safe layouts and preserve choices (1.6874ms)
✔ three-language caption stage and cleanup zh (1.4846ms)
✔ three-language caption stage and cleanup en (1.1679ms)
✔ three-language caption stage and cleanup ja (0.6972ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 86.7989
exit code 0

node --check holiday-lab/games/constitution.mjs
(無輸出)
exit code 0

git diff --cached --check
(無輸出)
exit code 0
```

## 精確瀏覽器解法（驗收者用）

每格調整 #caption-lines 選第2個按鈕（-1）、#caption-duration=6、#caption-x=50、#caption-y=78、#caption-tone選淺紙深字（-0）。三格的 #caption-font 依序18、20、18。每格先按 #caption-preview，等待6秒後 #caption-save；更改設定會清除已預覽狀態。另一可行排版x=52、duration=7。初始字太小、停留太短、低對比且擋住人物，不可保存。

## 真實排版回放

三格分別保存使用者字級、分行、位置、紙色、停留時間與當時舞台寬。結果保留caption/artifact並輸出root已同意的textLayers；fontSize換算成1280px舞台基準，縮放後維持當時文字相對畫面的尺寸。回放顯示實際文字，不以通用完成圖取代作品。

只使用生成圖與動態文字；未程序繪製介面。內容為虛構漫畫與閱讀設計目標，不宣稱是法律規定或歷史事件。
