# 15款遊戲與新版在校指南：本機試玩包 v2

狀態：已用主控確認的最終 `.review-local-09` 完成打包、實際解壓、逐檔SHA、HTTP及瀏覽器驗證。此為本機候選審閱版，尚未公開發布，不代替使用者美術確認。

## 交付物

- ZIP：`C:/agywork/agd-holiday-prototypes/holiday-lab/delivery-v2/.outputs/local09-01/holiday-preview-v2.zip`
- 大小：**40,584,255 bytes**；保留完整runtime，不為減小包體而裁圖或漏檔。
- ZIP SHA256：`7d7a9e65f6e8c80c21fec75fc934d866ff71f0a6ffa1f1ccd3c33433ead495e8`
- 來源：`C:/agywork/agd-holiday-prototypes/.review-local-09`，356個runtime檔。05候選ZIP完整保留但不再視為final；03、04未封包。未自行重新build或修改來源。
- 包內：366檔（356個網站runtime＋9個啟動／驗證／說明檔＋SHA清單）。`bundle-manifest.json`與`delivery-verification.json`保存完整逐檔資料。
- 已解壓且驗證的副本：`.outputs/local09-01/verification/unpacked-01/`；測試server已停止。

15款遊戲素材隨包；部分官網照片（含沿用官方原URL的師資主圖）、字型及學校處室連結需要網路。本輪沒有為封包另下載或改寫遠端照片，不能宣稱整站完全離線。

## 使用方式

1. 完整解壓ZIP，保留資料夾結構；電腦需要已安裝Node.js18以上，包內不自動下載或安裝。
2. 雙擊 `Start-Preview.cmd`。伺服器確認就緒後，以預設瀏覽器開啟 `http://127.0.0.1:8815/`，不用Unity，不直接用file://開網站。
3. 遊戲入口為 `/holiday-lab/`；新版指南為 `/?lang=zh#/students/guide`，中英日共用網站內容與路由。
4. 結束時雙擊 `Stop-Preview.cmd`。它先核對packageID和PID，只停止這份包的server，不停止其他專案。
5. 若啟動失敗，先讀 `launch-error.log`、`preview-server.log`。不反覆重試、不跳出Unity、不下載東西。占埠時可在終端執行 `Start-Preview.cmd --port=8823`。
6. `Verify-Files.cmd`可以重驗所有隨包檔案；啟動後產生的log/state不列入原始SHA清單。

重複雙擊Start會重用同一份包的健康server，不另開一份Node程序。關閉瀏覽器不等於停止server。未捏造BGM、未重新錄影片；既有影片交付維持原本唯一一支，不另放影片進本ZIP。

## 實際驗收逐條 yes/no

| 條件 | yes/no | 實際證據 |
|---|---|---|
| 只採用主控最終09，不用舊04或03 | yes | package-summary.json source=.review-local-09；來源檔數356 |
| 來源與runtime複本逐檔SHA一致 | yes | prepare verifiedCopies=356；複製後重查來源清單和SHA，未變動 |
| 15款唯一遊戲與每款5張CG存在 | yes | prepare前置檢查15模組與75張CG全部存在；後續逐檔HTTP/SHA涵蓋全部素材 |
| runtime全保留，ZIP無研究／tests／art-source／Unity | yes | 來源356檔全部納入；解壓精確清單 unexpectedFiles=0 |
| ZIP實際解壓後逐檔SHA一致 | yes | verifiedFiles=366，hashMismatches=0，unexpectedFiles=0；SHA清單本身另與portable複本比對 |
| 解壓包的全部runtime經HTTP讀回SHA一致 | yes | 356筆HTTP200＋body SHA256完全相同，非只檢查首頁與遊戲模組 |
| 15款入口全部實際呈現 | yes | holiday-lab cards=15，逐一核對15個open-ID，pageerror=[] |
| 新版指南三語、桌機／平板／手機實際呈現 | yes | zh/en/ja × 390/768/1440共9組，各15卡，47段逐步小說明，6個身分按鈕 |
| 實際展開收合內容再驗證說明 | yes | 9組都實點15個summary，47個[data-step-detail]:visible，detailsVisible=true |
| 指南三／二／一欄且無橫向溢出 | yes | 1440=3、768=2、390=1；每筆document寬等於viewport；實值見delivery-verification.json |
| 三語指南無頁面JS例外 | yes | 9組errors=[]；15款入口頁errors=[] |
| ZIP內ASCII CMD實際啟動server | yes | READY http://127.0.0.1:8822/ PID=58992；測試使用--no-browser |
| 重複啟動重用同一PID | yes | REUSED http://127.0.0.1:8822/ PID=58992；與第一次相同 |
| 包內Verify-Files.cmd可實跑 | yes | PASS SHA256 365 listed files；原始SHA清單自身由外部解壓驗證另核對 |
| 無Node明確提示、不下載 | yes | 限縮PATH實測exit1：Node.js 18 or later is required. No software is downloaded automatically. |
| 其他服務占埠時不停止該服務 | yes | 自建獨立外服務5356；launcher exit1並寫log；foreignServerPreserved=true。未使用現有8800/8785/8797 |
| 只停止本輪自己的server | yes | STOPPED own preview PID=58992，後續fetch拒絕連線，ownServerStopped=true |
| 實際打開使用者預設瀏覽器 | no | 本次使用--no-browser避免打開使用者分頁；正常雙擊路徑已備妥，但不宣稱實點通過 |
| 完整實體手機操作／完整美術人工核准 | no | 本輪是瀏覽器視窗及檔案交付驗證；不代替實機與使用者審閱 |
| 本輪重玩全部15款通關 | no | 本輪驗證包完整性、入口與指南，不把入口正常冒稱所有遊戲已通關；遊戲測試由主控其他報告記錄 |
| 推上公開站／main／Unity | no | 本輪未進行，僅本機交付 |

截圖：`evidence/local09/guide-{zh,en,ja}-{390,768,1440}.png`。已抽看中文桌機、英文手機、日文平板，看到流程展開、各步小說明及自然換行；此為代理閱讀檢查，不寫使用者美術通過。完整9張隨報告留存。

## 05候選與09差異

05候選包仍在`.outputs/faculty05-01/holiday-preview-v2.zip`，不是目前交付版，不覆寫、不刪除。09修正Chrome等中寬畫面的浮動行動按鈕遮擋；本輪逐筆比較05與09 runtime manifest，356對356，只有`styles.css`的SHA不同、removed=[]，見`runtime-diff-local09.json`。app、詞典、照片、遊戲模組與素材都相同。CTA與照片21組交疊檢查由主控另出報告，不把本包9組指南驗證冒稱為21組照片驗證。

## 真正執行的命令與輸出

```text
node holiday-lab/delivery-v2/prepare-bundle.mjs --source C:/agywork/agd-holiday-prototypes/.review-local-09 --out holiday-lab/delivery-v2/.outputs/local09-01 --expected-games=15 --label=15-games-new-guide-local09
{
  "source": "C:\\agywork\\agd-holiday-prototypes\\.review-local-09",
  "sourceFiles": 356,
  "verifiedCopies": 356,
  "games": 15,
  "packageFiles": 366,
  "zip": "C:\\agywork\\agd-holiday-prototypes\\holiday-lab\\delivery-v2\\.outputs\\local09-01\\holiday-preview-v2.zip",
  "zipBytes": 40584255,
  "zipSHA256": "7d7a9e65f6e8c80c21fec75fc934d866ff71f0a6ffa1f1ccd3c33433ead495e8",
  "bundle": "C:\\agywork\\agd-holiday-prototypes\\holiday-lab\\delivery-v2\\.outputs\\local09-01\\portable"
}
exit 0

node holiday-lab/delivery-v2/verify-delivery.mjs --package holiday-lab/delivery-v2/.outputs/local09-01 --port=8822
PASS ZIP extraction 366 files; SHA mismatches=0; unexpected files=0
PASS HTTP200 + body SHA256 for all 356 runtime files
PASS 15 game entries; three-language guide at desktop/tablet/mobile; identity tags; full details
PASS CMD start/reuse/ASCII/missing-Node/foreign-port/stop; no Unity; own server stopped
ZIP SHA256 7d7a9e65f6e8c80c21fec75fc934d866ff71f0a6ffa1f1ccd3c33433ead495e8
exit 0
```

啟動相關原始輸出保存於`delivery-verification.json.launcher`；prepare完整stdout為`prepare-output-local09.txt`，verify為`verify-output-local09.txt`。Node語法檢查全7支mjs exit0，詳細列表見`syntax-output.txt`。本輪打包與驗證首次完整執行即通過，沒有為測試成功更換資料或重建產品。

## 風險與範圍

- P0：本輪未發現交付阻擋；不是完整安全／授權或校規審查。
- P1（已以驗證排除）：錯封舊版／遺漏runtime。09已凍結，356檔複本、解壓、HTTP三層SHA一致。
- P2（測試通過）：占埠／重複啟動／停止錯誤server。packageID＋PID驗證、缺Node和外埠處理實跑通過。
- P3（已說明）：Node18需求、部分官網遠端照片與字型需連網；未把本機遊戲包誇大為整站完全離線。

唯一寫入與提交範圍是`holiday-lab/delivery-v2/`。保留舊delivery、所有舊輸出；無刪檔、不push、不碰main、不改來源、不停止既有伺服器。共享repo其他協作者修改不納入本commit。

## 保留可重跑腳本

`prepare-bundle.mjs`必填source和新out，不自動build，來源檔不在runtime白名單時直接停止，包含新faculty-portrait.css與replay-model.mjs。新輸出目錄必須不存在；驗證每次建立新的unpacked序號，保留既有檔。要用下一個真正最新build時由主控給路徑，再選新的out，不覆寫本包。
