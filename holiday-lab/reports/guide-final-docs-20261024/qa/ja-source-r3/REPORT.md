# 8881日文單字限定補驗

對象：`http://127.0.0.1:8881/`，`.measure-guide-final-docs-20261024-02`，360檔，`app-NOKAZJIM.js`。JA390及JA1440各10 yes／0 no，共20 yes／0 no；實際exit 0。這是兩個日文來源顯示的限定補驗，其他功能沿用8880 `raw-r1`的6組證據，沒有宣稱新版本重新跑完六組。

重要：修正key屬`appeal-public-forms.published_or_document_date`。目前renderer只顯示來源title、readability及checked_at，不顯示這個文件日期欄。所以正字與錯字在兩組UI皆不可見；本輪證成兩份JA字典的精確修正及既有來源列沒有副作用，沒有宣稱「新正字已顯示在畫面上」，也未擅自新增日期欄。

## 精確差異與不變性

|項目|yes/no|實際結果|
|---|---|---|
|JA資料僅1key／1字|yes|`data/ja/flow-ui.json`的「現在掲載の112年改正规程」改為「現在掲載の112年改正規程」，其餘映射相同。|
|生成字典僅同1key／1字|yes|`locale-ja.js`反向替換單字後，位元組SHA可精確還原8880原字典；沒有行尾差異。|
|其它45個source/data檔不變|yes|與raw-r1的47檔快照逐份比對，僅上列2個JA檔改動；繁中及英文檔SHA相同。|
|新舊app內容只有該一字|yes|新app反向替換該文字後，SHA精確等於原app；index.html只是引用新app名，build資料另有JA flow-ui變動。|
|保留圖像與字型原件|yes|新舊build內293個圖像／字型檔逐份SHA相同；沒有新圖或原圖修改。|
|新build與服務相符|yes|index、guide、JA資料、app及CSS前後實際HTTP200／SHA一致。|
|來源原URL與既有title/readability|yes|兩組以實際`appeal-public-forms`原URL定位，標題與說明維持正確字典對應；2張直接WebP可見。|
|正字文件日期欄UI可見|no|欄位目前未渲染；`correct_visible:false`，不是字型缺字或本輪產品回歸。|
|錯字UI可見|no|兩組皆`incorrect_visible:false`，頁面沒有「改正规程」。|
|溢位、U+FFFD、console、404、iframe|yes|兩組皆無水平溢位／替代字元／console或pageerror／HTTP>=400／iframe。|
|只做限定兩組及無遊戲|yes|未跑首頁或其他語言，不點遊戲、不測玩、不啟Unity。照片若請求仍只用舊original SHA快取，不遠端重抓。|
|前後及最終47／360 SHA|yes|兩組補驗前後47source/data與360build全穩定；補驗後純收據驗證再逐份核當時實際檔案。|
|QA程序關閉|yes|result記`browser_closed:true`；程序查詢check-ja-source-r3.cjs Node數量0，stdout0、stderr空、exit0。|

新JA資料SHA：`babeb1aca52c401d51c9ce45919b8da14003d674b11ee361bd8551e1f9c8f494`。

新JA生成字典SHA：`2f0ffe62be1e01cfafbb1851b46fa0d7fdf7358133606050a522fe94b19044f1`。

新app SHA：`1775ddeabec3c17c579bcfc12cf5a897791897e4bdd3d85adbf84c0f78c53224`。

## 方法紅與修正

`../ja-source-r2/result.json`保留`pass:false,cases:0`及exit1。原因是方法一開始錯把key當成readability去找來源；實際欄位是published_or_document_date。當時在進入guide UI前停止，不是產品錯誤。source/build/HTTP比對的已取得證據仍保留，未刪原紅或覆寫為綠。

依實際guide及student-guide.jsx修正方法，另開fresh `ja-source-r3`。測試預期改為真實renderer契約：字典精確修正，既有來源title/readability/URL仍顯示，文件日期欄不假稱可見。沒有修改產品配合測試。

## 實際指令與輸出

```powershell
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/run-ja-source-r3.cjs
```

stdout：

```text
PASS ja 390 10/10
PASS ja 1440 10/10
{"pass":true,"contexts":2,"yes":20,"source_files":47,"build_files":360,"source_stable":true,"build_stable":true,"browser_closed":true}
```

stderr空，exit0。完整命令收據為`../ja-source-r3-command.json`，本目錄`command.json`保留原封副本。頂層result維持base/build/source_before/source_after/build_before/build_after/cases/pass；各case有checks與shots，額外delta欄保存新舊比較。

```powershell
node C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/run-verify-ja-source.cjs
```

只讀收據驗證7 yes／0 no、stderr空、exit0，完整stdout見`verify-command.json`。最終核SHA時間`2026-10-24T02:44:23.060Z`。同時重核8880原凍結118檔全部未變，r2紅仍保留。

本代理已實際閱讀本目錄2張WebP：390來源標題正常換行，1440單列顯示；兩者均只有來源title、readability及查核日期，沒有文件日期內容。這是代理目視紀錄，不代替使用者風格確認。

所有產出限QA目錄，沒有產品、git、原始素材或舊證據變更。補驗、程序與報告均已收尾；不再重跑UI或改本QA目錄。
