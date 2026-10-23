# 新年日文重播字幕孤字修正

2026-10-23。獨立 worktree `C:/agywork/agd-newyear-ja-caption`，分支 `codex/newyear-ja-caption`，基點 `4fa105460d104deb0f87813b82f282ae3bd1fc38`。根目錄產品與固定8845／8846服務未改動。

只將 `holiday-lab/games/new-year.mjs` 的第一幕重播 focus 日文從「軽やかに越える」縮成「軽く跳ぶ」。意思為輕巧地跳躍；第一幕任務仍完整說明跨越、空中較短與可讀落地。原候選「軽快に跳ぶ」在320較長的踏み出し字幕末行剩「ぶ」，故未採用。

## 可見結果

原 `original-orphan.jpg` 是主控真圖原檔副本，末行獨留「る」。可回歸原版紅燈 `red-04`：320三動作標籤×140／350／700共有6個孤字，1440沒有。候選 `green-02`：320剩3個孤字，1440沒有。最終 `green-03`：兩寬各9個排版邊界案例，全18個無孤字、水平溢出或字幕墨跡越安全框。

先用真滑桿、真預覽、真收下三幕完成作品，實際時間 `[360,140,360] / [240,600,240] / [700,140,300]`，第三幕真選起步意圖。兩寬均保存真artifact並觀察九個原生重播鏡頭；全18鏡頭無孤字，受影響第一幕六個字幕均單行。另 `native-shot.cjs` 只在真重播140ms空中鏡頭以測試RAF攔截暫停，截兩張viewport，**沒有寫入字幕或時間**。已實看320真圖與排版320起步／空中及1440最長起步。

主控追加第三幕意圖覆蓋：`native-intents.cjs` 在同8851固定版補flight／landing各320／1440共4個真context。前兩幕統一 `[360,180,360] / [240,600,240]`；第三幕flight `[240,600,240]`、landing `[240,180,600]`，皆真選意圖、真預覽後收下。新增36個原生鏡頭與原先launch18個合計54個JA真重播，六個context三種intent；launch首幕140與新增兩intent首幕180差別明列，不混稱同fixture。新增artifact與原始HEAD模組buildResult輸出逐筆對照，真字幕除第一幕短標外，所有後六字幕與原版完全一致。此補樣不重做其他語言／CG／選單或全矩陣。

18個邊界量測為不同性質的排版測試：從實際served module `buildResult`產生第一幕三個動作×140／350／700文案，暫停原生RAF後，將生成字串套入現存真字幕DOM，使用原有字型、樣式與固定安全區。這些均一時間向量不是合法通關作品，尤其第一幕700ms空中不符合俐落跨躍規則；不把它算成真通關。截圖背景姿態為暫停當下，僅用來檢查字幕排版，不宣稱與該測試字幕對應動作。

量測沿用唯讀 `browser-sampler.cjs` 與 `asset-safe-regions.json`，保存sampler SHA、每行字元Range、實際墨跡、安全框、viewport與前後served來源SHA。未改safe／素材／CSS／字級或單位。

## 指令與實際輸出

```powershell
node holiday-lab/translation-review/newyear-caption/check.cjs red-04
# NO ja/320 native9 typography9 orphan6 inkOutside0
# YES ja/1440 native9 typography9 orphan0 inkOutside0
# PASS false ; exit1
node holiday-lab/build-review.mjs .measure-newyear-caption-01 --measurement
# MEASUREMENT_ONLY ...356 files ; exit0（未採候選）
# CAPTION_BASE=8850 CAPTION_EXPECT=軽快に跳ぶ
node holiday-lab/translation-review/newyear-caption/check.cjs green-02
# NO ja/320 ... orphan3 inkOutside0 ; YES ja/1440 ... orphan0
# PASS false ; exit1
node holiday-lab/build-review.mjs .measure-newyear-caption-02 --measurement
# MEASUREMENT_ONLY ...356 files ; exit0（最終，僅供量測）
python -m http.server 8851 --bind 127.0.0.1 --directory .measure-newyear-caption-02
# CAPTION_BASE=http://127.0.0.1:8851 CAPTION_EXPECT=軽く跳ぶ
node holiday-lab/translation-review/newyear-caption/check.cjs green-03
# YES ja/320 native9 typography9 orphan0 inkOutside0
# YES ja/1440 native9 typography9 orphan0 inkOutside0
# PASS true ; exit0
node holiday-lab/translation-review/newyear-caption/source-check.cjs
# pass:true ; astDifferences:1 ; otherLanguagesIdentical:true ; exit0
node holiday-lab/translation-review/newyear-caption/compare-served.cjs
# YES 4/4 frozen served equivalence: only one Japanese literal; other byte differences CRLF/LF
node holiday-lab/translation-review/newyear-caption/native-shot.cjs
# YES native shot1 320 ; YES native shot1 1440 ; exit0
node holiday-lab/translation-review/newyear-caption/native-intents.cjs
# flight/landing各兩寬，4context ×native9；artifact unchanged，無孤字／水平溢出
node holiday-lab/translation-review/newyear-caption/verify.cjs
# summary.json由實際輸出計算
```

輸出另存各 `*-output.txt`。最終源為 `.measure-newyear-caption-02`／8851，不覆蓋root服務或矩陣。served raw SHA與CRLF計數見 `served-equivalence.json`；root CRLF與worktree LF造成位元組SHA不同，四檔正規化逐字比對證明只有一筆預期文案改動。每輪自身來源前後也一致。

工具調整歷史保留：red-01在虛擬時間暫停後等import，red-02在sampler等RAF時停住，均手動停止自己的測試程序，不能當紅綠結論；red-03／green-01錯用node.id篩選，導致字幕nodes空，原圖／孤字資料仍留底但不可作墨跡結論。改讀實際API的owner後重新跑red-04／green-02／green-03，未改量測器或安全區。原生截圖attempt01的等待亦使用RAF而在暫停後timeout；attempt02嘗試CDP虛擬時間，320成功但1440截圖期間已換鏡，斷言正確攔下，輸出與320原圖留底。最終改為取消該刻所有pending RAF，再還原原生RAF供測量，觀察等待用50ms timer，兩寬截圖前後同為原生shot1才採納；不將前兩次工具失敗算成產品失敗或通過。

## yes／no

| 驗收 | yes/no與依據 |
|---|---|
| 原320孤字可重現 | yes，original-orphan.jpg、red-04孤字6 |
| 最終320／1440第一幕三動作、140／350／700無孤字與越框 | yes，green-03共18案例，每筆有非空墨跡nodes |
| 真UI預覽／三幕完成／artifact／九鏡重播 | yes，兩寬三intent合計6context／54鏡，第一幕無孤字；新增後六字幕對原版相等 |
| 真140ms重播畫面已保留且實看 | yes，native-ja-320-140-flight.png；另有1440 |
| AST只有一個日文字串改變 | yes，source-check.json完整AST路徑；diff一行換一行 |
| 中英文／其他六個日文字幕／時間／精靈／artifact／規則不變 | yes，AST全樹比對與buildResult實輸出對照 |
| 原safe／字型／CSS／其他共用源不變 | yes，served-equivalence.json逐檔比對，CRLF差異明列 |
| 本機量測build成功 | yes，fresh01與02各exit0，並非打包或發布許可 |
| 全站／全遊戲版面閘門或真人日文母語審校通過 | no，本輪僅限定字幕修正 |
| push／main／刪檔／Unity／改root服務 | no，皆未做 |

Build副產物locale-en.js／locale-ja.js／latest-build.json留在本worktree未stage，不併入產品提交。未跑全套遊戲測試與lint：本次只有一個可由AST證明的日文微文案，專案沒有lint script；真DOM紅綠、原生完成與排版邊界為本次驗證範圍。

## 2026-10-23追加：停格圖不能證明原時長

前文「真140ms重播畫面」精確指：從真實完成作品的shot1取得、**取消pending RAF後的停格排印圖**。圖中140是保存作品的輸入數值；截圖本身經過時序干預，不能證明該鏡在未干預時實際播放140ms，也不能當成未凍時鐘的原生動態截圖。`native-shots.json`與原圖保持原樣，補充解讀見`native-shots-clarification.md`。

54鏡的證據來自另外兩條未暫停觀察路徑：`green-03/report.json`的launch18鏡是在該context執行freeze之前先完成；`native-intents/report.json`的flight／landing36鏡從未呼叫freeze。它們證明真UI能完成、保存artifact、依序出現九鏡及其字幕，不以首次看見的epoch差代替精密時長測量。主控將另用未凍時鐘collector在整合版補140ms同鏡動態採樣；本資料夾的停格圖不取代該工作。
