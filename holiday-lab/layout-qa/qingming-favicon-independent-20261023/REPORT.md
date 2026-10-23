# 清明 404 與核心流程獨立驗收

本輪範圍通過：繁中、英文、日文各 320×900 與 1440×1000，共 6 個情境，實際操作失誤、重試、自然完成三段、100 分結果、三段重播、關閉重播回結果、退出回列表。全程使用既有按鈕與滑桿，無 game state／時鐘／DOM 文字注入，也沒有 route mock。瀏覽器錯誤 0。

| 條件 | 結果 | 證據 |
|---|---|---|
| 六個完整核心流程 | YES | `run-2026-10-23T07-27-45-811Z/result.json`，各情境 `steps.json`、`artifact.json` |
| 首頁與 lab 宣告 icon 真 HTTP200／原 PNG SHA | YES | 12 次 explicit icon receipts；同一 SHA `356075a7feaaa023f1998b1214823c4371af8b70436427fdc7b7e282cb55efc1` |
| console error／pageerror／requestfailed／HTTP≥400／CDP loadingFailed | 皆 0 | 六份 `events.json` 保存原始 CDP request、response、loading 與 console |
| 原六情境自動頁籤 icon 請求 | NO，未由此 run 證明 | 預設 headless 沒有完整自動 icon 網路事件；`verify-output.txt` 真 RED 留存 |
| 完整 Chrome headless 自動 icon | YES，額外 2 fresh contexts | `icon-full-chrome-2026-10-23T07-34-30-256Z/{1,2}.json`，首頁與 lab 原始 CDP requestId／response200 |
| 8856 `/favicon.ico` 真 PNG | YES | 上述補充 `result.json`，HTTP200、66162 bytes、相同 PNG SHA |
| 未知資源仍真404 | YES | `/definitely-missing-independent-probe-20261023.png` 回404，非全站 fallback |
| 建置與已觀察來源保持不變 | YES | 全357檔 local前後相同；9個HTTP來源前後相同；424個實際response body SHA逐筆核同build檔案 |
| 全viewport畫面 | YES | 84張PNG，唯讀驗證器逐張核寬高 |
| 完整2076／全UI安全區／canonical／舊v3批准 | NO | 不在本輪範圍，所有 global/canonical flags 仍 false |

本機新建置為 `.measure-local-qingming-20261023-01`，六情境實際使用 `http://127.0.0.1:8854/`。補充 `/favicon.ico` 與未知資源請求使用 root 最終伺服器 8856；沒有宣稱六個遊戲情境在 8856 重跑。84 張截圖可由各情境資料夾直接查閱，包含首頁、intro、選單、遊戲、失誤、重試、成功階段、結果、三段重播與返回。

初版 verifier 將「圖示網址真200」與「自動頁籤請求」混為必要條件，因此 exit1；原 stdout 沒有覆寫。修正 verifier 的範圍後以完整 Chrome 的額外 raw CDP 補證自動請求，最後 strict offline verify exit0。`runtime.json.executable` 原欄位只是 Playwright API 的預設路徑，不能當實際啟動程序路徑；補充 probe 明確傳入完整 Chrome executablePath 並存 SHA。另有一份 `icon-headed-*` 額外診斷，在 root 禁止 headed 訊息抵達前已啟動，現已完成關閉，結果保留但不計驗收；沒有再啟 headed。

唯讀重核（不發 HTTP、不開 browser、不寫檔）：

```powershell
cd C:/agywork/agd-holiday-prototypes
node holiday-lab/layout-qa/qingming-favicon-independent-20261023/verify.cjs holiday-lab/layout-qa/qingming-favicon-independent-20261023/run-2026-10-23T07-27-45-811Z holiday-lab/layout-qa/qingming-favicon-independent-20261023/icon-full-chrome-2026-10-23T07-34-30-256Z
```

實際 exit0，輸出：`pass:true, contexts:6, explicit_icon_http_receipts:12, supplemental.automatic_icon_contexts:2, screenshots:84, response_bodies:424, build_files:357, source_files:9, full_project_approved:false, canonical_eligible:false`。完整指令／離開碼／資料路徑見 `verification.json`，實際 stdout 見 `verify-final-output.txt`。`node --test .../helpers.test.cjs` 實跑 2/2、exit0；本輪 UI 主執行 `run-output.txt` exit0；完整 Chrome 補充 `icon-full-chrome-output.txt` exit0。沒有修改產品、舊證據、勞動工具，沒有 commit/push/delete。
