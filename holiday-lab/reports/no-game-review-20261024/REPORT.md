# 8883 本機網站審閱：恢復服務、暫不放遊戲

2026-10-24，source_agent: codex。分支 `codex/no-game-review24`。僅本機，未 push／發布，不碰 main、不刪檔、不執行 C 節。

## 可直接看

- 首頁：<http://127.0.0.1:8883/>
- 在校指南：<http://127.0.0.1:8883/?lang=zh#/students/guide>
- 儀表板：<http://127.0.0.1:8883/progress/>
- 新建置 `.measure-no-games-20261024-01`，74 檔，`app-UC6CEXXC.js`。8882 原版留存且服務恢復，最新以 8883 為準。

使用者回報連不到網頁；本輪查 8882 沒有 listener，重啟既有 server 後 Chrome 首頁載入成功。使用者續指示先核待辦，遊戲先不放；依此只從 `app.jsx` 移除首頁試玩 section，不動遊戲原件。建置直接走既有網站 builder，不走會複製遊戲 runtime 的 review wrapper；沒有繞過生成素材審核來交付遊戲。

原漫畫版面、小颯完整原畫／署名、學生作品、三語與指南內容保留。作品介紹中的「遊戲」類別與招生適性測驗保留；這次停放的是策展／節日／WebGL 試玩。

## 六項待核已一起核對

本輪讀取最新研究與原始收據，沒有把以前的查詢日期當成今日新研究，也沒有再查 Drive。

| 待核項目 | 本次確認結果 | 處理 |
| --- | --- | --- |
| 正式職稱、處室外文名 | 官網仍有已記錄的中英職稱衝突，例如蔣天華；部分處室沒有可證正式日文名 | 保留官方來源差異與功能翻譯說明，待校方釐清；不自行等同日本職稱 |
| 當期規章與表單 | 舊實習 DOC 全文已讀，不等於 115 當屆適用；本系當期實習／海外實習／海外見學與完整證照表、專題及其他版本衝突仍未齊 | 已有提醒保留，不把過期資料寫成當期硬門檻 |
| 素材來源與權利 | 小颯作者已由使用者確認；其他既有作品／照片逐件製程與權利未全部核實 | 不加新素材、不改原圖，不宣稱全包零 AI 或所有改編權已確認 |
| 全站逐字缺字 | 沒有本次新發現的具體缺字；全站逐字 fallback／跨 OS 未全驗 | 保留限制，不因此換掉字型；新問題有具體字句再處理 |
| 真機、母語與使用者畫面審閱 | 本次有 Chrome 手機尺寸模擬，不是真手機或母語簽核 | 保留未驗；不自創成阻止本機審閱的新門檻 |
| Flora／胖倉鼠 WebGL | 最近保存的指定夾回覆仍未見完整包；本輪沒有新查詢 | 使用者已同意遊戲先不放，改暫緩，不阻擋主網站本機審閱 |

詳 `pending-review.json`，每項保留原 evidence。50 項總表仍 44 yes／6 no；這是跨版本限定證據清單，不是新版本全站通過率或發布批准。本輪未重新獨立派代理。

## 本輪實測 yes／no

| 驗收條件 | yes／no | 實際證據 |
| --- | --- | --- |
| 舊首頁仍有試玩入口，檢查能抓到需求差異 | yes | Chrome 8882：section=true、curationLinks=1、iframe=0；red-command exit 1 |
| 只移除首頁試玩 section，其餘來源保持 | yes | green-command：361 其他來源不變；含既有資料及素材，不是 361 個程式檔 |
| Build 成功且本版不帶遊戲 runtime | yes | build-command exit 0；74 檔，未建立 holiday-lab 輸出子夾 |
| 首頁與所引用 JS 可連線、HTTP 內容 SHA 正確 | yes | http.json：200、200，與本地 build 一致 |
| 本版遊戲入口檔案不對外提供 | yes | http.json：兩個 holiday-lab 路徑均 404，符合排除範圍，非遊戲 bug |
| 三語 × 1440／390 沒有試玩區、試玩控制或 iframe | yes | browser.json，6 組，各 8 項共 48 yes；六張直接截圖 |
| 其餘八章節、招生後頁尾順序、小颯原畫／署名保留、無頁面橫溢 | yes | 同 browser.json；畫面只證明本次指定範圍 |
| 四原 dirty＋R0、315 素材／遊戲檔、main 與原交接 C 節保持 | yes | green-command，共 320 檔 SHA 相同 |
| 儀表板權威數字及證據一致 | yes | dashboard-build-command、dashboard-verify-command：18／18 PASS，exit 0 |
| 儀表板兩寬搜尋／展開／六項篩選／無橫溢 | yes | dashboard-browser.json：14 yes；兩張直接截圖 |
| 所有當期官方規章及名稱衝突已解 | no | pending-review.json，沒有代校方裁決 |
| 新獨立代理全站、真人母語、實體手機驗收 | no | 本輪未執行，沒有新增該範圍變更或將其當成本機審閱門檻 |
| 遊戲已整合／試玩／發布 | no | 使用者指示暫不放，遊戲凍結 |

原方法錯誤 `browser-method-error.json` 保留：CUA 的唯讀 DOM 不提供 compareDocumentPosition，第一次未取得判定；後改用實際章節 DOM 順序，產品沒有為了配合工具而改動。其他失敗收據不覆寫。

## 可回歸指令與原始輸出

各 `*-command.json` 保留完整 command／cwd／時間／stdout／stderr／exit_code。

```text
node holiday-lab/reports/no-game-review-20261024/check.cjs verify .measure-no-games-20261024-01
exit 0
{"pass":true,"only_product_change":"remove homepage play section","other_sources_preserved":361,"protected_files_preserved":320,"main_and_c_preserved":true,"build":".measure-no-games-20261024-01","game_runtime_in_build":false}

node scripts/build.mjs --local-review --out=.measure-no-games-20261024-01
exit 0
Translations: 2551 Static candidates: 26 Unpaired paths: 0
Japanese exact translations: 2595
[build] 完成：.measure-no-games-20261024-01/index.html 132.5 KB、app-UC6CEXXC.js 1279.1 KB

node holiday-lab/build-dashboard.mjs
exit 0；50 列、44 yes、6 no、使用者確認 0

node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs
exit 0；18/18 PASS
```

Build 指令為本次已執行收據；要另做候選，必須換新輸出目錄，不能混寫舊建置。這段沒有發布、合併 main 或恢復任何凍結遊戲的授權。

## 收尾

原專案交接、工作樹 STATUS 與既有 Vault 專案紀錄已讀回更新，`handoff-r2-command.json` exit 0，C 節 SHA 仍為 `95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680`。沒有推送私人 Vault。第一次交接腳本誤列工作樹中不存在的 LATEST_HANDOFF.md，在寫入原專案後失敗；原 receipt 保留。修為先核實三個實際目標、已寫相同段落不重複，第二次完成其餘兩處，沒有建立假交接副本或刪除資料。

儀表板來源綁定 1288 份，`dashboard-final-command.json` 再核 18／18；沒有把後來新增的畫面或文件偷加進原本的凍結清單。首頁／頁尾最後實際畫面另存 homepage-current.png、footer-current.png，Chrome 保留最新首頁與儀表板頁籤。
