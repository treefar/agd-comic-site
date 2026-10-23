# 兩款有限錯誤分支：原生缺口補採

固定08／8845，2026-10-23。**要求補採的12個情境、30組分支、60張PNG全部取得且目標量測通過**。這份是新增原生證據；沒有改寫`static-error-max-5`、舊矩陣、canonical資格或全專案UI gate。

可重跑結果在`runs/run-01/report.json`及`runs/run-01/verification.json`。本次只玩回憶對位第一幕、聆聽遊戲第一個成功錄取及四組拒絕組合，沒有完成全部關卡、結果或回放，沒有啟大矩陣。

## 實際範圍

|遊戲|情境|每情境補採|PNG|
|---|---:|---|---:|
|retrocession|三語×320／1440＝6|close段＋按Save後的固定拒絕hint；兩owner分張|12|
|peace-memory|三語×320／1440＝6|duplicate＋recorded、clipped拒絕、duplicate＋clipped、duplicate＋listening；每組兩owner分張|48|

原static5的21個缺文字／viewport項與15個同拒絕status組合有交疊，未把兩者直接相加。這批用上述30組實際分支補來源證據，而非以原文長度或近似state推定。

### 操作與自然時間

- Retro：第一幕正常range輸入x=-8、y=5、rotation=0、scale=1，點Save；progress維持0／3，真DOM回饋為close，固定hint為拒絕。沒有呼叫遊戲API或匯入規則來取代操作。
- Peace：選左側、框x20／y65／width24，點Listen並等待真progress變1。再點Listen得到duplicate＋recorded。選未聽者，框外x100／y35／width16，點Listen等待真clipped；再選已聽者點Listen得到duplicate＋clipped。最後將未聽者框正、點Listen，等真DOM出現listening，再正常choice切回已聽者並點Listen，得到duplicate＋listening。
- choice本身停止累計聆聽而不改status，所以最後一組是**保留「正在聆聽」的原生字串**，不是宣稱仍持續累計／已聽完第二人。這是現行產品真行為；本補採不替其提示一致性作體驗核可。
- 每次click／range／自然狀態觀察均存wall time、原生performance.now及progress。首段Listen事件紀錄到progress觀察約1189.6至1212.9ms；紀錄點在真click之後，不能拿這段時間差作精密最短時長測試。沒有改時鐘、取消RAF或注入heard／status／文字。

## 兩張圖如何證同一拒絕

每組先讀game-hint與secondary兩份完整文字作共同identity；正常scroll讓第一個owner可見，用原完整frozen sampler量測並截PNG，再正常scroll拍第二個owner。每張量測前、量測後、截圖後，以及整組結束，兩份原文都必須完全相同。60張都是不同實際viewport，**沒有說同一張圖同時看見兩個owner**。

每個目標核原Range分行／baseline、Canvas實墨跡、unclipped_ink、固定panel safe來源SHA及實際viewport內全文；不是只有DOM textContent或字數。所有原sample保完整nodes／blockers／method flags。PNG用CDP真viewport、原320×900或1440×1000，DPR1，不fullPage、不改視窗尺寸。

## 實測結果

|條件|結果|
|---|---|
|要求情境／分支／捕捉數|12／12、30／30、60／60|
|目標全文Range、原clip、fixed safe與實際viewport|60／60 yes|
|PNG簽章、尺寸、SHA與原native sample SHA|60／60 yes|
|同拒絕雙owner身份與前後文字不變|30／30 yes|
|CDP實際字型|60份皆MicrosoftJhengHeiUIRegular；保原glyphCount與computed font|
|瀏覽器|Chromium 151.0.7922.34，沿既有Node Playwright入口，headless；非真人盲測|
|來源before／after|game兩module、runner、lab.css、panel、paper全同static5固定08收據|
|原sampler／map|與freeze06檔案及函式SHA一致，沒有修改|
|Windows字型檔|msjh.ttc前後SHA相同；沒有宣稱新增逐字cmap認證|
|console／page／HTTP錯誤|12情境皆0|
|完整case幾何錯誤|本60 case共0；不把它擴稱全頁可及性／全專案通過|

其他offscreen controls仍可在原sample出現`SCROLL_CONTENT_PENDING`或`TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT`。這些flags照存；目標owner在另一張真scroll圖全文通過，**不會清除整頁其他未量內容**。沒有重寫舊static5的0／12 NO或其它gate。

## 實看與可讀性待修

已實看以下新圖：

- `runs/run-01/retrocession-en-320-close-rejection-game-hint-4.png`：原先窄版缺可見證的拒絕hint，現在完整在紙面與viewport中。
- `runs/run-01/retrocession-ja-320-close-rejection-archive-feedback-9.png`：實際「あと少し」中段完整可見。
- `runs/run-01/peace-memory-zh-320-duplicate-listening-peace-status-19.png`：正常操作保留的「正在聆聽」可見。
- `runs/run-01/peace-memory-ja-320-duplicate-listening-peace-status-51.png`：全文雖在safe內，末行是**「に。」**，屬使用者避免孤字偏好的可讀性待修（P3）。本輪不改遊戲文案或CSS，也不以量測綠冒稱此換行體驗已過。

這四張是代理實際檢視記錄，不是使用者美術確認。新圖全部保留，沒有裁切重繪玩家介面。

## 重跑指令與原輸出

```text
node holiday-lab/layout-qa/finite-errors-native-20261023/collect.cjs <全新run名稱>
# 僅在明確需要重採且新目錄不存在時執行；原run-01不覆寫。

node holiday-lab/layout-qa/finite-errors-native-20261023/verify.cjs run-01
# pass true
# sessions12 branches30 captures60
# target_full_range_fixed_safe_clip_viewport_pass60
# png_and_native_samples_sha_pass60
# source_before_after_stabletrue font_file_stabletrue
# whole_case_geometry_error_count0
# whole_finite_domain_provenfalse full_project_approvedfalse
```

這次實際採集使用`collect.cjs run-01`，exit0；stdout保留`run-01-output.txt`，離線驗證exit0的完整stdout在`verify-run-01-output.txt`。兩個read-only／採集工具都不會改產品或舊報告；新資料只在本目錄。

|驗收|yes／no|
|---|---|
|指定缺分支由真合法controls／click／scroll取得|yes|
|每組有全文、原safe、clip、PNG、CDP字型與來源收據|yes|
|分張viewport與同拒絕identity如實區分|yes|
|新證據可以供主控獨立整合有限域覆蓋|yes，原flags不在此自動更新|
|全phase／全部可達狀態／全UI已再驗|no|
|日320listening尾行孤字偏好已修|no，P3記錄保留|
|改產品／sampler／map／時計／舊報告／canonical flag|no|
|stage／commit／push／main／刪檔／Unity|no|

