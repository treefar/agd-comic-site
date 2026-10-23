# 小颯首頁首圖：關機前獨立短驗收

2026-10-23。本機 http://127.0.0.1:8870/ ，build `.measure-xiaosa-review-20261023-01`、`app-BWFF7U3Q.js`。服務啟動前確認 8870 無 listener，僅啟動一次，session 57041。只驗本次首頁首圖、四作品切換及小颯來源頁；未跑全站、節日遊戲，未發布。

小颯署名與畢業生身分依使用者 2026-10-23 對話提供；本輪未另作外網身分研究。原三件作品逐筆對 `data/news.json` id7140.gallery No.04–06。

| 驗收條件 | yes/no | 實際結果 |
|---|---|---|
| zh/en/ja，320/1440，共六組 | yes | 6/6 完整操作成功 |
| 預設小颯原始直幅海報完整顯示 | yes | 六組 object-fit:contain、圖片自然尺寸有效；原圖來源/建置/HTTP SHA 相同 |
| 小颯署名與三語畢業生字詞 | yes | 精確 DOM 字串匹配；中英資料 team 都是小颯 |
| 未知指導教師不顯示 | yes | 首件 #student-work-mentor 不存在，資料 advisor 為「—」 |
| 四件可手動循環，原三件完整署名 | yes | 24/24 海報狀態；題名、所有作者、指導教師、來源、1–4位置逐筆匹配 |
| 無頁面水平溢位，字型載入完成 | yes | 24狀態 document.fonts.status=loaded；頁寬不超出 viewport（瀏覽器幾何取整1px界線） |
| 無圖片404或頁面例外 | yes | 六組 response>=400 與 pageerror 皆空 |
| 點作品來源到正確作品頁 | yes | 六組真點擊後 hash=/works/clipstudio-grand-prize，等待實際 TEAM／制作チーム內容與可見小颯署名 |
| 首頁無自動遊戲或生成節日背景請求 | yes | 24狀態 iframe=0、/holiday-lab/assets/請求=0 |
| 來源與實際 HTTP bytes 穩定 | yes | 9來源檔 before/after 相同；9 HTTP 檔與建置 bytes 相同且 before/after 不變 |
| 畫面證據保存 | yes | run05/ 共30張PNG；另目視 zh320、ja1440首圖，可見完整三角色與對應署名 |
| 全站／母語審核／公開發布已批准 | no | 不屬本輪範圍，不做此宣告 |

實際指令與終端輸出：

```text
node holiday-lab/reports/shutdown-20261023/independent/run-v5.cjs
PASS zh 320: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS zh 1440: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS en 320: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS en 1440: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS ja 320: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS ja 1440: 4 works, original credits, contain, graduate credit, no mentor, source route, fonts/overflow/images
PASS 6/6 contexts, 24 poster states, 30 PNGs; source and HTTP bytes stable
ACTUAL_EXIT=0

node holiday-lab/reports/shutdown-20261023/independent/verify.cjs
PASS readonly: 6/6 contexts; 24/24 poster states; 6/6 detail links; 30 PNG; 9 source + 9 HTTP files stable; no global approval
ACTUAL_EXIT=0
```

`run05/stdout.txt` 是真執行重導輸出；`verify.stdout.txt` 是唯讀複核真輸出。`run05/result.json` 保存全部逐步 DOM、HTTP狀態/byte/SHA與來源前後SHA。`receipt.json` 保存方法、驗證器、結果與30 PNG 的 SHA。

原始失敗保留：run.cjs 因網址含語言query而 glob 等待錯誤；run-v2/v3 對 SPA 舊節點與載入中間狀態採樣過早；run-v4 日文來源頁已將 TEAM 翻成制作チーム，英文等待selector逾時。均為測試方法缺陷，原結果/PNG未覆蓋，未改產品；run-v5以實際來源頁語言與原生完成節點等待，重跑完整六組。

本任務完成，停止新增測試與產品操作。儀表板、交接與停工由主控處理。
