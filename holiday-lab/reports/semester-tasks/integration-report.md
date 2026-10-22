# Root 新生地圖整合驗證（2026-10-23）

只修改 `holiday-lab/qa/playthrough.cjs` 的 semester 新 recipe、專用矩陣旗標與本目錄 `integration-*` 證據。未修改產品模組、layout、指南、CSS、人名或其他遊戲。使用主代理固定測量版 `.measure-layout-08`，網址 `http://127.0.0.1:8820`；沒有重建、打包、停止或接管該 server。

## 紅燈 → 同案例綠燈 → 八組

舊腳本先原樣複製到 `integration-red/old-playthrough.cjs`，保留當時 root 的 lunarMatrix、generic keyboard range 與歷史 full-matrix invalidated 邏輯。

```powershell
$env:HOLIDAY_QA_URL='http://127.0.0.1:8820'
$env:HOLIDAY_QA_GAMES='semester'
$env:HOLIDAY_QA_CASE='semester/zh/1440'
$env:HOLIDAY_QA_NEWYEAR_MATRIX='0'
$env:HOLIDAY_QA_LUNAR_MATRIX='0'
node holiday-lab/reports/semester-tasks/integration-red/old-playthrough.cjs
```

實際離開碼 1，原始輸出保留 `integration-red/output.txt`：

```text
FAIL semester zh 1440: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#result-score') to be visible
TOTAL 0/1 passed; fail
```

更新後同一個 `semester/zh/1440`：

```powershell
node --check holiday-lab/qa/playthrough.cjs
$env:HOLIDAY_QA_URL='http://127.0.0.1:8820'
$env:SEMESTER_MATRIX='1'
$env:HOLIDAY_QA_GAMES='semester'
$env:HOLIDAY_QA_CASE='semester/zh/1440'
node holiday-lab/qa/playthrough.cjs
```

語法檢查及執行離開碼 0，實際輸出：

```text
PASS semester zh 1440: completion, real artifact, 4 replay shots, retry, resources
TOTAL 1/1 passed; pass
```

同案例綠燈 JSON：`integration-2026-10-22T16-50-57-072Z/playthrough.json`。

八組矩陣可重跑指令（只開一種矩陣）：

```powershell
$env:HOLIDAY_QA_URL='http://127.0.0.1:8820'
$env:SEMESTER_MATRIX='1'
$env:HOLIDAY_QA_CASE=''
$env:HOLIDAY_QA_GAMES=''
$env:HOLIDAY_QA_NEWYEAR_MATRIX='0'
$env:HOLIDAY_QA_LUNAR_MATRIX='0'
node holiday-lab/qa/playthrough.cjs
```

亦接受同義旗標 `HOLIDAY_QA_SEMESTER_MATRIX=1`。每次建立新的 `reports/semester-tasks/integration-<時間>/`，不覆寫過去矩陣。這次實際離開碼 0：

```text
PASS semester zh 320: completion, real artifact, 4 replay shots, retry, resources
PASS semester zh 1440: completion, real artifact, 4 replay shots, retry, resources
PASS semester en 320: completion, real artifact, 4 replay shots, retry, resources
PASS semester en 1440: completion, real artifact, 4 replay shots, retry, resources
PASS semester ja 320: completion, real artifact, 4 replay shots, retry, resources
PASS semester ja 1440: completion, real artifact, 4 replay shots, retry, resources
PASS semester en 1440: completion, real artifact, 4 replay shots, retry, resources
PASS semester ja 320: completion, real artifact, 4 replay shots, retry, resources
TOTAL 8/8 passed; pass
```

最後兩組分別是真鍵盤 en1440 與減少動態 ja320；其餘六組使用正常動態，320px 使用觸控點擊。完整 JSON、24 張指南查找與各狀態截圖：`integration-2026-10-22T16-52-13-674Z/`。已知 fixtures 的代理 DOM 回歸不是學生盲測。

## 驗的是什麼

每組先在未選任務時重走舊三站座標，到站仍是 0/3 且不出現結果；回到起點後才選任務、選真窗口、自己按方向移動。前三次諮詢另故意選授課教室，確認錯站提示能指出程序窗口與下一步。四次成功諮詢加上初始／舊走法／錯窗口共 7 次失敗，artifact attempts=11、score=100。

| 作品 | 第1幕 | 第2幕 | 第3幕順序 |
|---|---|---|---|
| A（1440一般組、ja減少動態） | 必修缺項 → 系辦 | 選課紀錄 → 註冊課務組 | 畢業缺項 → 系辦，再抵免程序 → 註冊課務組 |
| B（320一般組、en鍵盤組） | 必修缺項 → 註冊課務組 | 選課紀錄 → 註冊課務組 | 抵免程序 → 註冊課務組，再畢業缺項 → 系辦 |

逐筆比對四個 taskId／windowId、第三幕順序、虛構地圖與僅供諮詢標示。四個真實 replay shot 都要出現，且各 caption 必須符合實際 task 順序；不是看到三個鏡頭就提早通過。

指南測試會讀遊戲當下提供的搜尋詞，真正點 `semester-guide` 開新頁，在學生搜尋框輸入該詞，確認對應卡 heading 相同，再展開讀承辦欄位；不以 HTTP 200、或測試器另讀正確卡名代填。鍵盤組用原生 Tab／Enter／文字輸入，指南 summary 也用 Tab 到達，沒有程式 focus。

## yes／no 驗收

| 項目 | yes／no | 實際證據 |
|---|---|---|
| 舊 recipe 紅燈、同案例新 recipe 綠燈 | yes | 0/1 exit1 → 1/1 exit0 |
| 三語320／1440＋鍵盤＋減少動態 | yes | 8/8，各 case 記錄 keyboard／reducedMotion |
| 舊座標無任務不能通關 | yes | 八組共24次到舊站，`oldCoordinatesBlocked` 全部0/3 |
| 真任務／窗口、四次諮詢及兩種第三幕順序 | yes | artifact 每組四筆 visits；`twoTaskOrdersAndRoutes=true` |
| 全部四個回放鏡頭 | yes | `replayShots` 每組4個、`checks.replay4Shots=yes`，caption逐幕比對 |
| 真開指南、按遊戲詞真輸入、驗到對應卡與窗口 | yes | 八組各3卡，共24次，保留 query／heading／contact／URL／截圖 |
| 新英日窗口名稱仍正確 | yes | 真控件比對 Section／註冊課務組（学籍・履修担当），無換id或假按鈕 |
| 探索不扣分、靜音、重試與離開 | yes | attempts=11仍100分；Audio.play=0；重試0/3；手機可回15款列表 |
| 主要遊戲頁無 Console/page／failed request、缺圖與水平溢出 | yes | 每 case 對應空錯誤陣列與 checks；指南另捕捉 pageerror |
| 前後18份來源收據完全相同 | yes | 15game＋runner／catalog／lab.css，逐份 raw SHA 比對 |
| 其餘共用 recipe、lunarMatrix、range 與歷史失效記錄保留 | yes | `integration-protected-code.json`；Git LF比較9個其他 recipe及保護段相同，其餘5款產品未動 |
| 真實墨跡安全區／全15款重新E2E／真人理解測試 | no | 本工單僅semester整合QA；不拿來源未變代替其他款完整E2E，不取代collector或真人 |

已實看 root 08 英文1440第三幕與日文320第三幕。桌機 controls 保留內捲區，整張截圖不會同時顯示所有控制；測試真實完成下方按鈕與連結操作，但不以截圖取代安全區驗收。

## Raw 來源與界線

本輪讀的是 root 8820 實際 served bytes，semester 檔 16626 bytes：

```text
b184437bf226354f8602ed5567c4ac941bff6539176f9575cf737a808d7fbcc9
```

開始與結束相同，沒有抄獨立工作樹的 f4d… 或把 LF 正規化雜湊當 raw 收據。每份來源前後值都在矩陣 JSON，整理在 `integration-evidence.json`。本次執行時 QA 檔 raw SHA-256：`db752329f0c43918ebb8a0e49183b305821529263feff3403b4a59ebfe960d17`；主代理若再改 QA 或 runtime，應重跑相應範圍。

Build：使用主代理已建固定08；本輪僅QA工具修改，跑 `node --check` 與實際腳本，不另跑產品 build，也不打包。沒有改產品或 layout、沒有碰8819／8800、沒有啟動Unity、push、main操作或刪檔。
