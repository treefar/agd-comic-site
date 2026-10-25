# 2026-10-24 接手複驗＋首頁輪播換圖（8898）

source_agent: claude（Opus 5.5）；TF-GO。分支 `codex/poster-mix24`（由 `codex/newchat-handoff24`／c66ef5b0 基底開出）。未 commit、未 push、未發布、未碰 main、未刪檔，C 節未動。

## 使用者本輪要求
1. 接續 8897 方向，先核分支、服務、dirty、保存證據。
2. 確保新系網穩定，且相對舊系網（origin/main）只增不減：英日強化、在校指南、首頁底圖、頁底遊戲區，原功能沒被拔掉。
3. 請 Fable 當顧問，從功能性、可讀性、吸引新生提出改進。
4. 底圖輪播拿掉小颯的圖，改挑不同畫風、能吸引高中生的作品海報。

## 逐條 yes/no

| # | 項目 | 結果 | 證據 |
|---|---|---|---|
| 1 | 8897 服務在跑、HTML 與 app JS 與量測建置逐 SHA 相同、英日／progress 200 | yes | `takeover-check-command.json`（exit 0） |
| 2 | 四份原 dirty＋R0 SHA 不變 | yes | `guard.json` protected 5/5 |
| 3 | C 節 SHA 仍為 95ae06fb… | yes | `takeover-check-command.json` c_ok=true |
| 4 | origin/main 仍為 1b8322e6 | yes | `guard.json` |
| 5 | 相對 origin/main 沒有任何檔案被刪除／改名 | yes | `git diff --diff-filter=D/R origin/main HEAD` 輸出空白（主控對話紀錄） |
| 6 | 程式檔被刪的行都是「同處改寫」而非功能移除（首頁主標改 h1、語言鈕兩語→三語、測驗題文字依簡章修正、AboutChapter 加英日整句） | yes | 主控逐檔讀 `git diff origin/main HEAD` |
| 7 | 中文資料檔沒有被刪的鍵或項目 | yes | `data-regression-command.json`：19 檔，被刪項目只在 en |
| 8 | en 被刪兩個 ui 鍵 | yes（正常） | 對應中文句已依簡章改寫，舊譯文鍵作廢 |
| 9 | en 得獎／榮譽清單「變短」 | yes（誤判，實為補齊） | `stats-en-command.json`：en 125→144 筆，結構與中文完全一致；data-regression 按索引比對才誤報，exit 1 原樣保存 |
| 10 | 輪播拿掉小颯、加入不同畫風 | yes | `data/student-work-draw.json`；`browser.json` 輪播一圈 8 件、hasXiaosa=false |
| 11 | 首頁右側原有小颯原畫格保留 | yes | `browser.json` sideXiaosaKept=true |
| 12 | 新增《癡迷的現實》署名、指導、連結與 news 7200 一致 | yes | 新增回歸測試，`test-draw-command.json` 10 pass |
| 13 | 10 組代表抽選相鄰不重複、署名與目的地正確 | yes | `test-draw-command.json` TEN_DRAWS |
| 14 | Build | yes | `node scripts/build.mjs --local-review --out=.measure-poster-mix-20261024-01` exit 0，79 檔 |
| 15 | 英日 375 寬無橫向捲動、日文實點抽選停格 | yes | `browser.json` |
| 16 | 8 張原圖檔未改 | yes | `guard.json` original_images git_unchanged 8/8 |
| 17 | 儀表板改綁本階段 | 見下方 | `update-dashboard.cjs` |
| 18 | 實體手機、母語、完整 WCAG、Console 逐頁 | no（未測） | 本輪未做 |

## 八件輪播與排序理由（依高中生第一眼吸引力）
1. 今食堂：日系動漫插畫，高中生最熟悉的畫風。
2. 葛柏 TV 秀：像素遊戲風，直接連到「遊戲」。
3. 喀嚓：童話奇幻群像，色彩飽和。
4. 癡迷的現實：1980 搖滾漫畫拼貼，國際影展 13 項（新加入）。
5. 癒光之音：悅曲：奇幻厚塗。
6. Dear, All Robots：美式街景插畫。
7. 競箱團：手繪線稿漫畫。
8. 冤枉汪：極簡扁平。

未選：《人造人》《失竊的祕方》縮圖中央有大標題字，會和首頁主標打架；《神癒》團隊在 news 圖庫無 designers 欄；系官網四張約 950px 的圖是頒獎合照，不是海報。

## 風險與限制
- 《癡迷的現實》海報是 YouTube 遠端縮圖（maxresdefault 1280×720），沒下載進 repo。斷線時元件會顯示既有錯誤文字與作品連結。若要完全離線穩定，需使用者同意下載該圖進 `images/`。
- 輪播第一張在載入後 1.8 秒就會換下一張，所以使用者實際第一眼可能是第二張。

## Fable 顧問
完整建議：`holiday-lab/reports/takeover-claude-20261024/fable-advice.md`（12 條，未套用，待使用者挑選）。
