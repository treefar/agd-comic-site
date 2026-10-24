# 原漫畫首頁＋新版英日／在校指南＋頁底策展

2026-10-24；source_agent: codex。分支 `codex/original-hero24`。僅本機審閱，不 push、不發布、不修改 main、不刪檔、不執行 C 節。

最新首頁 <http://127.0.0.1:8887/>；英文 `/?lang=en`、日文 `/?lang=ja`；在校指南 `/?lang=zh#/students/guide`；頁底 `/#student-play`；儀表板 `/progress/`。

新目錄 `.measure-original-home-20261024-04`，77 檔，`app-WMPKTSKM.js`。8883 是上輪無遊戲版；8884／8885／8886 是本次保留的中間候選，不當最新。

## 實際改動

使用者認為新簡約首頁不如原來，希望保留原首頁、加入新版英日及指南，遊戲放最下面。使用者另明確選擇「先放學生作品策展示範，節日遊戲繼續暫緩」。這不是新首頁畫面已確認，也不是發布批准。

1. 從既存 `refs/remotes/origin/main` 讀原 `chapters-1.jsx` 的第一個 splash，恢復集中線、大字、SFX、跳動對話泡泡、PRESS START 與亮點泡泡。沒有 checkout、fetch、merge 或修改 main。只加 h1 語意及 CSS 範圍 class；反向逐字重建與原 tier 相同。
2. 保留最新英日字典、導覽、師資職稱／照片顯示、所有指南與招生資料。指南仍 15 卡、47 步小說明、56 FAQ、89 來源；本次只重新驗顯示與入口，沒有重新查證全部官方規章。
3. 小颯原畫回到原本首頁第二格，顯示改 contain；署名獨立一行，避開圖片，不修改原圖。原漫畫其他章節保持；359 其他來源及 320 保全檔 SHA 不變。359 包含資料與素材，不能稱為359支程式。
4. 策展放在招生後、頁尾前。只複製既有 `student-curation.html/css/mjs` 三檔，與原件 SHA 相同；沒有帶節日 runtime、生成美術或啟動 Unity。三語入口可開啟，日文完成一輪「安排三展位、附三組署名、檢查完成」操作。

產品僅改 `app.jsx`、`chapters-1.jsx`、`holiday-home.css`。英日較長文案增加限定間距；手機排版沿用原版流式規則。保留原有字型與動態；`prefers-reduced-motion` 有限定停止動畫規則，但本輪未另模擬該偏好。

## 逐項 yes／no

| 驗收 | yes／no | 實際證據與限制 |
| --- | --- | --- |
| 檢查能抓到原漫畫首頁缺失 | yes | red-command exit 1：Original comic splash missing |
| 復原第一格原始內容，可逆重建一致 | yes | finalize-command exit 0，original_splash_reconstruction=true |
| 保留其餘章節與最新資料／字典 | yes | green-build-r4-command exit 0；只排除明列3檔及原畫框／署名顯示差異 |
| 本機 Build 成功 | yes | build-r4-command exit 0；77 檔，app-WMPKTSKM.js |
| 三語×1440/390 首頁排版 | yes | browser-r4.json：六組72 yes／0 no，12張直接截圖；動態名稱 bubbleBounce、pressStart 均存在 |
| 長標題、小說明與亮點泡泡無重疊 | yes | 同六組；另1279英文首版red overlap=true，最後green=false，保留兩份證據 |
| 小颯原圖完整顯示、署名不遮圖 | yes | 六組圖載入、contain、圖片框底線不超過署名頂線；原圖SHA保持 |
| 策展位於招生後、頁尾前且首屏無試玩控制 | yes | 六組 orderedChapters、curationAtBottom、noAutoFrame；bottom-current.png |
| PRESS START 與指南真實操作 | yes | navigation-guide.json：六組48 yes，手機實際展開／自動收合，桌面3欄／手機1欄，15卡47小說明及FAQ |
| 策展三語入口可用 | yes | curation-entry.json：三組21 yes，三作品、三展位選擇、三組署名，無 iframe／橫溢 |
| 策展完成一輪操作 | yes | curation-completion.json，日文3作品／3署名，結果可見；curation-complete-ja.png。不是新增遊戲開發或15款遊戲驗收 |
| 首頁、bundle、CSS、策展 HTTP 與本地一致 | yes | http.json：前五路徑200，首頁／JS／CSS SHA一致；節日總入口404是本版排除範圍 |
| 儀表板來源與摘要可重算 | yes | 50列44yes／6no／使用者0，1434份來源綁定；18/18 PASS，exit0；不是本版全站通過率 |
| 儀表板兩寬搜尋／展開／缺件篩選 | yes | dashboard-browser.json：14 yes，兩張直接截圖 |
| 四原 dirty＋R0、315素材／遊戲原件與 main refs 保持 | yes | green-build-r4-command：320保全檔不變；三個策展原檔也不變 |
| 所有正式規章、外文名稱衝突與素材權利已解 | no | 本次未重新研究，保留前版六項限制，未改成當期硬規定 |
| 新獨立代理、母語或實體手機全面驗收 | no | 本次由主控 Chrome 驗收；前版獨立證據只代表其原範圍 |
| 節日遊戲／Flora／胖倉鼠開放 | no | 使用者明確暫緩；未查新回傳、未測玩或改動這些遊戲 |
| 公開發布 | no | 本輪沒有發布授權，也未 push |

## 實際指令輸出

完整 command／cwd／stdout／stderr／exit_code 在同名 command JSON；成功收據 stderr 皆空。

```text
node holiday-lab/reports/original-home-20261024/check.cjs verify
修前 exit 1：AssertionError: Original comic splash missing

node scripts/build.mjs --local-review --out=.measure-original-home-20261024-04
exit 0
Translations: 2551 Static candidates: 29 Unpaired paths: 0
Japanese exact translations: 2595
[build] 完成：.measure-original-home-20261024-04/index.html 135.1 KB、app-WMPKTSKM.js 1283.6 KB

node holiday-lab/reports/original-home-20261024/check.cjs verify .measure-original-home-20261024-04
exit 0
{"pass":true,"original_splash":true,"other_chapter_content_unchanged":true,"latest_other_sources_preserved":359,"protected_files_preserved":320,"curation_files_preserved":3,"main_refs_preserved":true,"seasonal_runtime_copied":false,"build":".measure-original-home-20261024-04"}

node holiday-lab/reports/original-home-20261024/finalize.cjs
exit 0：首頁6組72項、指南6組48項、策展入口3組21項，完成一輪策展，原tier反向一致

node holiday-lab/build-dashboard.mjs
exit 0：50列／44yes／6no／使用者0

node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs
exit 0：18/18 PASS
```

Build 與 finalize 為已執行命令收據；不要覆寫舊候選或重跑 finalize 覆寫凍結結果。新版應用新目錄與新收據。可回歸的唯讀檢查是 check.cjs verify。

## 保留失敗與方法差異

- 01 的1279英文說明與泡泡確實重疊，原red保留；增加英日主格高度與底部空間後，04同寬green。不是只檢查語法。
- r2 首次檢查英文延遲載入圖尚未完成，另抓到手機圖片框與署名距離不足；r3 只增加百分比預留無法解決自動高度，該三個no保留。最後改為圖片與署名的flex流式配置，手機圖用自然高度，r4六組通過；沒有放寬驗收式。
- 起初用 `#hero a[href="#news"]` 操作會同時匹配 PRESS START／READ NEXT，工具拒絕且沒點擊；改用實際可見的精確名稱，產品沒有配合測試改字。navigation-method-error.json保留。
- 另一次 shell 修改腳本因引號解析失敗，整批未建置；改以單引號here-string傳入Node，沒有將該失敗當Build成功。8887服務在該批失敗後曾先啟動空目錄，稍後成功建置才開啟測試；最後HTTP／SHA以正式04收據為準。

下一步先看8887的恢復效果。原畫面仍待使用者審閱，節日不恢復；既有官方資料與來源限制照留，不執行C節或自行上線。
