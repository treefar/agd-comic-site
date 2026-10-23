# 清明六個完整session：嚴格來源adapter與固定只讀驗證

本包只提供清明90個實際完整canonical key及原資料指標，不是138個全信用，不改任何metadata、原旗標、root index／assembly或舊proof。六context只選原五個完成route加新JA1440/default；舊JA1440失敗session的120筆全數排除。

|驗收項目|yes／no|實際結果|
|---|---|---|
|實讀清明contract|yes|從ui-layout-contract.json讀到清明138 required keys，逐id／width／height比較；只實際對應90，沒有alias或擅造error-longest。|
|六session／三shot／retry|yes|ZH／EN／JA各320、1440，共6；各metadata完成、三shot0/1/2、Console／page／HTTP errors空；每context亦核實際shot case及retry，不只信metadata。|
|完整資料檢查|yes|1115筆完整來源case逐一讀v2 shard，與原case deepEqual、sample nodes／blockers／shot deepEqual、case／sample／image SHA核對、圖像格式及尺寸讀取、geometry原政策重新驗算0。只保留ref及method flags，不把全部node累積成巨型JSON。|
|排除原失敗JA1440|yes|120筆原partial都保留為excluded refs；它們不混入90候選，只有fresh JA1440的15key可採。|
|點狀來源13項|yes|原before hash＝新before hash＝新獨立after，逐key完整一致。獨立HTTP200、實際body bytes／SHA、開始及結束時間保留；after開始>=新run開始。13份實際body在point-receipts-*，不是手填bytes。|
|舊after及未知旗標|no（原缺口保留）|old_after=false、unknown1、flags_complete=false保持；原697checkpoint flags、20已知額外、1未知及新169 sample method flags仍在原proof/ref，沒有清除。|
|連續不變／全案通過|no|source_scope固定point_receipts_not_continuous_immutability，full_project_approved=false；不把點狀收據冒稱全時間區間不變。|
|TDD及拒收負例|yes|先無adapter的真red exit1留底，實作後5組測試exit0：缺session／shot metadata／實際shot／retry、舊partial來源／重複session、unknown NO矛盾、hash／bytes／status／時間不符皆拒絕。|
|固定只讀verify|yes|inputs.json記實際files/options；verify.cjs只讀，重跑adapter後與evidence.json和明標v2完全deepEqual；完全不改evidence、點收據或metadata。實際exit0。|

## 實際指令

```text
node --test holiday-lab/layout-qa/qingming-session-composite/adapter.test.cjs
tests5 pass5 fail0
exit0

node holiday-lab/layout-qa/qingming-session-composite/capture-points.cjs
POINT_SOURCES 13/13 hash/status200/bytes/content/time verified; oldAfter=false continuous=false
exit0

node holiday-lab/layout-qa/qingming-session-composite/run.cjs
QINGMING_ADAPTER contexts=6/6 fullCaseRefs=1115 excludedOldPartial=120 canonical=90/138 sourcePoints=13 unknownOld=1 continuous=false full_project_approved=false
exit0（run-final-output.txt）

node holiday-lab/layout-qa/qingming-session-composite/freeze-version.cjs
FROZEN_V2 same actual current evidence; canonical90 refs1115 excluded120 GLOBAL=NO
exit0

node holiday-lab/layout-qa/qingming-session-composite/verify.cjs
QINGMING_FIXED_VERIFY YES contexts6 canonical90/138 refs1115 excluded120 sourcePoints13 oldUnknown1 oldAfterfalse continuousfalse GLOBAL=NO
exit0
```

freeze.json：adapter SHA `7ffb99a859fd7fcaa0cb6c71be33388df0b49701f4c747bfc278c984af9ce70d`；inputs SHA `8615bcf9218d08ef5b310baa8763278e821878462db21f82427f53a4cd572374`；evidence.json與evidence-v2.json SHA皆 `48b182baf67368cc3b925419cf5a906de8a7803af37a10f6106a1d6a1548926c`。

版本說明：初次實跑後增加foreign-game guard與實際shot負例，已真重跑adapter與5tests，再實際重新驗讀產明標evidence-v2，不拿先前執行假稱新code已驗。現adapter／inputs／v2及alias已凍結，後續只用verify.cjs；不要再用run／capture-points／freeze-version覆寫原證據，程式變更須另產新版本。

root若同步child驗證，可執行上述verify.cjs，exit0才讀evidence.json。輸出summary很短，不回傳整份nodes；完整canonical指標見canonical-keys.json及evidence.cases，完整來源逐筆refs見full_source_case_refs。48個未由本adapter覆蓋的required keys仍明列missing，不改用其他proof或把它們算入90。

只讀root整合review另見independent-root-integration-review.md。該finding只涉及parent在child後的二次載入綁定，不否定本adapter已驗的固定proof；root已表示等待目前索引程序terminal後修正。全案仍NO。

本輪未stage／commit，沒有改root三檔、semester helper、原sample／PNG或任何長程序。
