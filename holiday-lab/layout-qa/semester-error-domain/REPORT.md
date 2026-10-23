# Semester錯誤文字域：工程checkpoint

已完成來源投影與最小校準；剩餘6context的game/error-longest仍NO，未啟全集。

|驗收|yes／no|實際證據|
|---|---|---|
|固定8845原始來源與完成proof同SHA|yes|12檔HTTP200/body/bytes/SHA/time，semester `b184437b…`；`source-receipts.json`。|
|所有callback、寫入與兩種第三幕順序逐讀|yes|`source-causal-audit.json`保存8個含狀態/UI的函式、13項assignment、文字/choice/button來源；4個UI callback逐源碼綁定。|
|可達聯合文字投影|yes|4,695狀態、19提示、6錯誤task/window配對；每筆正常UI witness與步數奇偶/min guard。|
|舊12完整session的錯誤全文逐筆對源|yes|288筆匹配；只讀metadata，未重跑原684或2964。old NO保留。|
|投影與原始mount callback相同|yes|19/19提示代表witness、各動態owner三語值逐筆深比；technical oracle，不稱瀏覽器畫面。|
|三語雙寬真UI校準|yes|6/6，手機900／桌機1000；七owner全文相同，原sampler獨立重算geometry0，真viewport截圖。|
|regular/bold實際CDP前後與來源前後|yes|Microsoft JhengHei UI Regular／Bold，源12檔一致；隱藏第0幕label無paint另解釋。|
|原SCROLL flags全清|no|桌機3組共6flag完整保留，沒有放寬safe或換sampler。|
|系統字型檔pre-run bytes receipt|no|有CDP字型前後及系統字型檔post-point SHA；不能冒稱已保存pre檔案bytes。|
|動態步數全域墨跡證明|no|無產品步數上限，必須處理十進位數值/位置奇偶/min guard與shaping/wrap，未用粗抽樣作全集。|
|完整game/error-longest與全案通過|no|只是工程checkpoint；後續計畫在FULL-RUN-PLAN.md，待root查碼批准。|

實際執行：

```text
node --test holiday-lab/layout-qa/semester-error-domain/domain.test.cjs
初次：MODULE_NOT_FOUND，1 failed（tdd-red-output.txt）
最終：5 passed, 0 failed，exit0（tdd-final-output.txt）

node holiday-lab/layout-qa/semester-error-domain/domain.cjs
DOMAIN YES states4695 hints19 rejectPairs6 contexts12 orders2; numeric-native=NO GLOBAL=NO

node holiday-lab/layout-qa/semester-error-domain/calibrate.cjs
6個CALIBRATION YES；BOUNDED YES 6/6; source12 before/after; full-domain NO

node holiday-lab/layout-qa/semester-error-domain/audit.cjs
AUDIT YES contexts12 exact-feedback288; callback-functions8 writes13; oracle19/19; native6/6; numeric-native=NO GLOBAL=NO

node holiday-lab/layout-qa/semester-error-domain/verify.cjs
SEMESTER_VERIFY YES states4695 callbacks-source-bound; hints19 oracle19; complete-contexts12 exact-feedback288; native6 geometry0 retainedflags6; CDP regular/bold before/after; source12 stable; numeric-native=NO GLOBAL=NO
exit0（verify-final-output.txt）
```

中途oracle fake element缺dataset、verify缺來源指紋物件、以及把hidden label的空CDP glyph list當變更的失敗輸出均保留；只修自己的oracle／驗證輸入，不改產品或原證據。新本地domain約20MB，尚未提交或確認跨機備份；本輪未stage／commit／push／main／delete，也未動清明、國慶、勞動、mid-autumn frozen或任何既有live程序。
