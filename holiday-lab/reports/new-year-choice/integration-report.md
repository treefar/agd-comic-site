# New Year 整合操作腳本驗證（2026-10-23 台灣時間）

範圍：只更新 `holiday-lab/qa/playthrough.cjs` 的 new-year 操作情境、過期的語言提示斷言，以及可重跑的 new-year 專用測試矩陣。其他遊戲 recipe 與所有遊戲原始碼未修改。測量版本由主代理建立 `.measure-layout-03`，網址 `http://127.0.0.1:8815`；本次沒有重建或修改該輸出。

## 可重跑指令與實際輸出

舊腳本由當時 HEAD 取出，存於 `integration-red/old-playthrough.cjs`，不覆蓋工作中的新腳本：

```powershell
$env:HOLIDAY_QA_URL='http://127.0.0.1:8815'
$env:HOLIDAY_QA_GAMES='new-year'
$env:HOLIDAY_QA_CASE='new-year/zh/1440'
node holiday-lab/reports/new-year-choice/integration-red/old-playthrough.cjs
```

實際離開碼 1：

```text
FAIL new-year zh 1440: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#result-score') to be visible
TOTAL 0/1 passed; fail
```

舊第 2 幕 `[320,140,320]` 無法完成「留住騰空」，所以第三個 submit 仍無法得到結果。根因是 fixture 與舊規則綁定，沒有放寬新遊戲判準。

```powershell
node --check holiday-lab/qa/playthrough.cjs
$env:HOLIDAY_QA_URL='http://127.0.0.1:8815'
$env:HOLIDAY_QA_NEWYEAR_MATRIX='1'
node holiday-lab/qa/playthrough.cjs
```

語法檢查離開碼 0；瀏覽器測試離開碼 0，實際輸出：

```text
PASS new-year zh 320: completion, real artifact, 3 replay shots, retry, resources
PASS new-year zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS new-year en 320: completion, real artifact, 3 replay shots, retry, resources
PASS new-year en 1440: completion, real artifact, 3 replay shots, retry, resources
PASS new-year ja 320: completion, real artifact, 3 replay shots, retry, resources
PASS new-year ja 1440: completion, real artifact, 3 replay shots, retry, resources
PASS new-year en 1440: completion, real artifact, 3 replay shots, retry, resources
PASS new-year ja 320: completion, real artifact, 3 replay shots, retry, resources
TOTAL 8/8 passed; pass
```

完整 JSON、每組配時與截圖：`integration-2026-10-22T16-02-22-747Z/playthrough.json`。最後兩組分別為真正鍵盤操作與減少動態；其餘六組使用正常動態，320px 使用觸控操作。

## 配時與必要斷言

| 作品 | 第 1 幕 | 第 2 幕 | 第 3 幕 | 收尾意圖 |
|---|---|---|---|---|
| A（320px） | 360 / 180 / 360 | 240 / 600 / 240 | 600 / 220 / 260 | 期待起步 |
| B（1440px） | 560 / 240 / 400 | 320 / 680 / 300 | 220 / 240 / 620 | 站穩落地 |

全部均為實際 DOM 滑桿、按鈕與真實時間試播，不匯入遊戲規則、不呼叫 complete、不注入內部狀態。鍵盤組從開場起使用 Tab 尋找可聚焦元件、Enter 按鈕，以及 Home／方向鍵調滑桿；無滑鼠點擊或程式設定焦點。

| 驗收項目 | yes／no | 證據 |
|---|---|---|
| 舊 recipe 真正重現失敗 | yes | `integration-red/playthrough.json`，0/1、exit 1 |
| 三語，各 320／1440 共六組通關 | yes | JSON 前六組 pass |
| 第三幕才顯示意圖選項，實際選擇並存入作品 | yes | recipe 明確選擇，assert artifact focus |
| 每幕配時改變後，直接提交先被拒絕 | yes | 每幕驗進度不變與三語 fresh-preview 提示，再完整試播 |
| 三幕均完成各自不同 brief | yes | assert `quick-leap / floating / your-ending` 與每幕進度 |
| 場次切換保留前一幕實際輸入 | yes | 逐幕讀取三個 range 值比對 |
| 兩組不同作品真實保留配時與不同意圖 | yes | `twoDistinctWorks: true`；逐筆 artifact 配時比對 |
| 鍵盤完整通關、回放與重試 | yes | en1440 `keyboard: true`，Tab／Enter／Home／方向鍵 |
| 減少動態可完成、回放與重試 | yes | ja320 `reducedMotion: reduce` |
| 預設靜音可通關 | yes | 全八組 `HTMLMediaElement.play` 呼叫數為 0 |
| 回放至少三個真實 shot、重試回到 0/3 | yes | 全八組實際 DOM 驗證；本次不宣稱觀察完整九個 shot |
| 無重複 ID、缺圖、水平溢出、Console／page／request 錯誤 | yes | 全八組各別 checks 與空錯誤陣列 |
| 新文字 ink／safe region 全部通過 | no | 屬主代理 layout collector；本次只有實看英文 320px 全頁，不取代精確安全區驗證 |
| 其他十四款整合、真人盲測通過 | no | 本次僅 new-year 回歸；已知 fixture 的代理測試不等同真人盲測 |

## 來源收據

測試開始與結束 served `games/new-year.mjs` SHA-256 相同：

```text
a6203561b7d3712508f213baceda92e4de4b4979ddb9bedbbbbe750d1ed9e950
```

執行時 `qa/playthrough.cjs` 原始位元組 SHA-256（Git 可能依 checkout 換行轉換，之後重跑應重算）：

```text
686c0e3998e4744548cd4befac88bc4e911f06c2f126436e0c3752cbf328a764
```

其餘 served runner、catalog、十款原有遊戲來源與每組 stylesheet SHA 均保留於 JSON。本次沒有啟動 Unity、push、main 操作、刪檔或干預既有伺服器。
