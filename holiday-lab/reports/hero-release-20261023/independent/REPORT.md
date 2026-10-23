# 首頁Hero整合獨立驗收（2026-10-23）

受測主控凍結建置：.measure-hero-festival-20261023-01，入口http://127.0.0.1:8861。只寫本目錄，沒有改產品、正式合約、歷史權威或勞動節。

| 驗收項目 | yes/no | 實際結果 |
|---|---|---|
| 修改前先重現 | yes | baseline.cjs 對舊8860三語×320/390/1440共9組，HolidayHome均在tier-splash之外，結構要求真exit1；baseline-8860/result.json與4張PNG保留 |
| 同一個主視覺格內整合 | yes 9/9 | #festival-preview唯一，位於#hero .tier-splash內，不再是.comic-page直屬上方區塊；#hero-title唯一 |
| 原Hero資訊與連結 | yes 9/9 | 主標全文存在，#news/#about/#labs三個重要Hero連結保留；桌機ZH及手機JA實圖已目視，其他導覽完整流程不是這條的宣稱 |
| 三語／雙手機＋桌機 | yes 9/9 | zh/en/ja×320/390/1440；文字Range控制項外溢、隱藏裁切X、全頁橫向捲動與CJK孤字末行0 |
| 選擇與懶載入 | yes 9/9 | 14選項皆非labor；切清明後更換現有CG，仍不建iframe，不請求games/audio；點試玩才建立iframe |
| modal鍵盤與背景 | yes 9/9 | 背景inert、body scroll鎖；close ShiftTab進iframe末焦點，iframe末Tab回close；Esc卸載iframe，焦點回festival-start，inert／scroll恢復 |
| 開啟時焦點 | yes 6/6補證 | initial-focus.cjs真觀察zh/en/ja×320/1440：初始焦點均在modal內；iframe intro()自行focus合法，未硬要求close；Esc及回焦點亦過 |
| 減少動態 | yes 9/9 | emulateMedia reduce後Hero內沒有持續循環動畫；並未偽造遊戲時鐘 |
| 新年嵌入完整核心 | yes | en1440：真失誤→三段作品→100/100→3段重播→關閉；artifact保存 |
| 清明嵌入完整核心 | yes | ja320：真失誤→重試→三次正常風勢捕捉→100/100→3段重播→關閉；artifact保存 |
| 瀏覽器執行／網路錯誤 | yes | 9首頁及2嵌入路徑皆errors0，沒有labor請求或操作 |
| 來源與PNG原始核對 | yes | 10份HTTP來源before/after SHA相同；20張PNG的SHA／尺寸與方法、既有DOM driver SHA均重核 |
| 唯讀重核與負例 | yes | verify.cjs真exit0；verify.test.cjs 8/8 pass，含假summary、藏孤尾、提前遊戲請求、labor選項、變更來源、偽PNG與假全域批准 |
| 全部2076／全部動態字元／實體手機／使用者美術確認 | no | 不在本輪獨立Hero範圍；full_project_approved=false，未升格完整發布gate |

正式命令：

```powershell
$env:HERO_QA_URL='http://127.0.0.1:8861'
node holiday-lab/reports/hero-release-20261023/independent/run.cjs
# 真exit0：9個首頁PASS、2個嵌入核心PASS、HERO_ACCEPTANCE pass
node holiday-lab/reports/hero-release-20261023/independent/verify.cjs holiday-lab/reports/hero-release-20261023/independent/runs/2026-10-23T09-03-53-114Z
# 真exit0：contexts9, embedded_routes2, pngs20, full_project_approvedfalse
node --test holiday-lab/reports/hero-release-20261023/independent/verify.test.cjs
# tests8 pass8 fail0，exit0
node holiday-lab/reports/hero-release-20261023/independent/initial-focus.cjs
# INITIAL_FOCUS 6/6 PASS，exit0
```

原始結果runs/2026-10-23T09-03-53-114Z/result.json，SHA cd66c38391482443854794e29c004306389163db75f19e4f48bd0dd715c4a235；compact verification.json、verify-output.txt、verify-tests.txt與20張PNG都保留。沒有修改正在量測中的方法或來源，沒有另起相同批次。

字型限制：本次實讀document.fonts.status為loaded、Range盒與ZH1440/JA320實圖沒有方框；沒有做Hero全部字元逐字cmap/fallback，不能據此宣稱全站缺字0。完整遊戲84組是前輪獨立範圍；本輪只補整合後的兩條真嵌入流程，其他遊戲來源是否與03一致由主控另行比對。
