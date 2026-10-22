# 年獸眉毛方向提示 L2 限定複驗

2026-10-23（台灣）。root09 `.measure-layout-09`，既有服務 `http://127.0.0.1:8830`；分支 `codex/holiday-prototypes`。

結果：三語 × 320／1440 共 6/6 組通過。固定眼 1.5、嘴 1、鞠躬 0，只改眉 +30、0、−30。+30 會提示反方向，0 才提示近水平；兩者送出均維持 0/3。−30 即時觀察可拍攝，實際送出進 1/3。操作前後保留當前輸入。

## 紅燈與根因

既有 root08 紅燈保留在 `holiday-lab/player-review-round2/REPORT.md` 的 P2，及 `lunar-brow-plus30-misleading.png`：+30 明顯傾斜卻說眉毛很平。本代理已讀原報告與現行程式；原回饋只按 `surprise-brow` 原因取固定文字，未區分正向傾斜與近水平。root09 `expressionFeedback(reason,values)` 對眉≥8 改取反方向提示，即時觀察與失敗送出共用此函式。本輪沒有修改產品，也沒有重新聲稱獨立學生盲測。原08紅燈來自另一代理既有探索，本輪重跑09綠燈，不偽稱本輪親自暫時還原產品做紅綠。

## 實際執行

```powershell
node holiday-lab/reports/lunar-expression/brow-fix-verification/browser.cjs 2>&1 | Tee-Object holiday-lab/reports/lunar-expression/brow-fix-verification/command-output.txt
```

實際程序離開碼 0；完整原輸出在 `command-output.txt`：

```text
YES zh-320: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
YES zh-1440: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
YES en-320: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
YES en-1440: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
YES ja-320: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
YES ja-1440: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained
TOTAL 6/6; sourceStable=true; errors=0
```

真 UI：略過開場→開始→實際 range 輸入→可見觀察／提示→拍攝按鈕。無匯入遊戲規則、無內部狀態注入、無時鐘修改。三種角度每種保存角色區／觀察區／送出後的 1000px 高 viewport PNG，共 54 張，沒有用全頁圖充當 viewport。手機需真實捲動，部分截圖不含完整角色；角色區與觀察區分開留證。桌機控制區也使用原有內捲框，沒有改 CSS。

## yes／no 驗收

| 條件 | yes/no | 證據 |
|---|---|---|
| zh/en/ja 各 320 與 1440 真 UI 操作 | yes | `results.json` 六列全部 pass |
| +30 與 0 回饋文字不同，分別指出反向／近水平 | yes | 每列 angles 的 observation、hintBefore、hintAfter |
| +30、0 送出被拒，−30 進第二幕 | yes | 每列 progress 依序 0/3、0/3、1/3 |
| 即時觀察與失敗送出提示完全一致 | yes | 程式逐字 assert；成功後切第二幕，改核對進度而非誤比下一幕文字 |
| 眉毛畫面 transform 為 +30／0／−30，其他輸入不變 | yes | browStyle、values 及三角度截圖；submit 後亦驗值 |
| served 來源前後完全相同 | yes | `results.json` before／after 三筆 raw SHA |
| pageerror 與 console error 為 0 | yes | 六組 pageErrors、consoleErrors 均空 |
| 代理實看畫面 | yes | 已實看 zh1440 三角度、zh320 +30、ja320 +30；圖面確有三種眉斜角及相符說明 |
| 全54張逐張人工檢視／整體 layoutgate 通過 | no | 本輪限定提示回歸，不把位置／字串 assert 冒稱完整圖面安全驗收 |
| 全遊戲通關矩陣／真人學生盲測／手機實機／母語審校 | no | 未執行，超出限定工單 |
| 本輪 Build／Lint／Unity Console | no | 使用 root 已建09；僅新增測試證據，沒有重建產品 |
| 修改其他檔案、啟停服務、push、發布、碰 main、刪檔、Unity | no | 唯一產出為此證據目錄 |

## served 收據

前後 raw bytes 與 SHA-256 一致，來源從 8830 HTTP response Buffer 計算，未抄工作樹雜湊：

| 檔案 | bytes | SHA-256 |
|---|---:|---|
| games/lunar-new-year.mjs | 14800 | `79981ce5881980141fa9be5e996901ca4875eb0c41a2a21547724f28a2b78bf7` |
| runner.mjs | 17492 | `724748d5be5d5dda03783b7adff37c0ab06e21e48e93d949eb1d67b474479695` |
| lab.css | 6395 | `d8bb6f5e7d2c3c10b0d903d23fb8525fca222b1aad138d76200eb8206acb3c15` |

代表畫面：`zh-1440-brow30-stage-before.png`、`zh-1440-brow0-stage-before.png`、`zh-1440-brow-30-stage-before.png`、`ja-320-brow30-observation-before.png`。此結論僅涵蓋年獸眉毛三種輸入的方向提示修正；不將三款遊戲整體或美術使用者確認擴張為通過。
