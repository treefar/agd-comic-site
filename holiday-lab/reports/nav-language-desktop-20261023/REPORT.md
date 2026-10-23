# 三語主導覽修正與 TF-BASE 回查

2026-10-23，source_agent: codex。分支 codex/nav-language-desktop；只本機審閱，不push、不發布、不改main、不刪檔、不執行C節，勞動節暫緩。

最新首頁 http://127.0.0.1:8872/ ，英文 /?lang=en 、日文 /?lang=ja ，儀表板 /progress/ 。既有8870／8860來源保留；8871為本輪第一版，已有章節定位真RED，不當最新版。

## 可感知的修正

桌面1181px以上三語共用兩層導覽：上排完整系名／AGD標誌與報名按鈕，下排八個章節及兩個語言入口。沒有縮小字級或換字型；標籤保持完整字詞。手機與平板繼續用可展開選單。

原因是styles.css將英日文761–1900px整排導航設成display:none。移除語言專用隱藏規則後，採共用桌面排版。另兩處章節捲動寫死60px，一處作品深連結寫死80px，會讓章節標題被固定列遮住；pages.jsx新增共用實際高度量測，app.jsx與路由／作品定位使用該值加12px空間。

| 驗收條件 | yes／no | 實際證據 |
|---|---|---|
| 重現英文桌面只剩圖示 | yes | red/result.json：en1440 NAV_LAYOUT 0/1，desktop navigation hidden |
| 修正後中英日桌面完整導覽可見 | yes | green-r2/result.json：三語×1181／1440／1900／2284；八章節＋兩語言，整個標籤單行且在視窗內 |
| 手機／平板開關及點選章節正常 | yes | 三語×390／1180真點擊展開、點章節後aria-expanded=false |
| 固定列不遮章節標題 | yes | 12組桌面實際點About，target位置在header bottom之下；首版green/真RED保留 |
| 本輪18組全部通過、沒有頁面例外 | yes | NAV_LAYOUT18/18；每組實際DOM、幾何、字型loaded、PNG與SHA |
| 新建置及回歸方法綁定 | yes | proof.json：五份目前來源SHA、原始結果SHA、index與app真HTTP200／建置byte相同；360檔本機量測版 |
| TF-BASE兩款新WebGL已回傳 | no | webgl-recheck.json：指定夾仍5份工單／腳本；近兩日名稱搜尋只有兩份工單，不代表所有其他位置均無檔案 |
| Unity已啟動或重送遠端工單 | no | 沒有執行上述動作；沒有下載大型舊專案 |
| 全站／新遊戲可公開發布 | no | 本輪只驗導覽與定位，既有全UI／母語／使用者確認缺口保留 |

## 實際指令及輸出

```text
node scripts/test-nav-layout.cjs http://127.0.0.1:8870/ holiday-lab/reports/nav-language-desktop-20261023/red --reproduce
FAIL en 1440: desktop navigation hidden; desktop only hamburger shown ...
NAV_LAYOUT 0/1
exit1

node holiday-lab/build-review.mjs .measure-nav-language-20261023-02 --measurement
Translations: 2315 Static candidates: 26 Unpaired paths: 21
Japanese exact translations: 2344
MEASUREMENT_ONLY: .measure-nav-language-20261023-02; 360 files; no publication performed.
exit0

node scripts/test-nav-layout.cjs http://127.0.0.1:8872/ holiday-lab/reports/nav-language-desktop-20261023/green-r2
PASS zh/en/ja × 390/1180/1181/1440/1900/2284
NAV_LAYOUT 18/18
exit0
```

完整UI stdout／stderr／exit code：../official-names-followup-20261023/root/nav-desktop-ui-r2.json；build對應nav-desktop-build-r2.json。red與第一版green/收據都保留。第一次green有真章節遮擋RED，另zh390的fontStatus因測試在觸發layout前就等fonts.ready而採樣過早；方法修成先觸發layout再等待字型，重跑新目錄，沒有改舊失敗紀錄。

關機前暫停狀態已由使用者本次「繼續」撤回，儀表板只恢復本輪導覽修正範圍；舊大量QA沒有重啟。最終儀表板與本機保存結果追加在此檔末尾。

## 最終儀表板結果

node holiday-lab/build-dashboard.mjs → 34/34 PASS、exit0；node --test holiday-lab/dashboard/progress-adapter.test.cjs holiday-lab/dashboard/ui-authority.test.cjs → 19 tests、19 pass、0 fail、exit0；DASHBOARD_QA_URL=http://127.0.0.1:8872 node holiday-lab/dashboard/smoke.cjs → DASHBOARD_SMOKE 2/2 + OFFLINE PASS、exit0。完整命令收據在official-names-followup-20261023/root/nav-desktop-dashboard-*.json。Chrome已實際開啟8872英文首頁與儀表板，日文切換及回英文後等相應語言標籤可見，完整導覽皆存在。
