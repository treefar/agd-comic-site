# 中秋文字全域界：第二位獨立唯讀審查

2026-10-23。僅本`independent-review/`產出；作者proof／verification／產品／sampler／contract／服務未修改，未重跑完整矩陣或百萬組字串。

結論：**設計輪廓界可重現，六個既有真案例可核對；當前允許字元的Canvas量測也被作者界含蓋。但作者的任意完整文字全域證明，仍缺「hinting／Canvas相位誤差必受1px界限制」的證據，不能無條件接受global_bound_proven。** 沒有找到現有六圖的越框反例，不能把證明缺口說成玩家畫面已壞。

## 已獨立核對

- 實際`C:/Windows/Fonts/msjh.ttc` SHA `1fd5fc7046e0eea753988ee06d1a5a731df68475614e2174fbba9b4800f392ac`，face1 PostScript `MicrosoftJhengHeiUIRegular`、2048 UPM。使用fontTools4.63.0逐glyph重算ControlBounds，29651 glyph、29641非空。
- 全face設計界確為`[-345,-535,2584,2036]`單位，16px下`[-2.6953125,-4.1796875,20.1875,15.90625]`。3個composite stored bbox與重算有不足1字體單位的小差（完整列font-audit.json），不影響全face extrema，且不在允許輸入closure內。
- hmtx全非負；583個水平kern配對advance+kern全非負，最小232單位。實際允許glyph有16個適用kern配對，均列出及實測。GPOS只有type4 mark attachment；允許輸入與保守GSUB closure無任何MarkCoverage glyph，所以這個face的GPOS不會獨立移動本批glyph。
- 56個允許Unicode字元逐筆cmap對照。保守啟用所有GSUB features closure有68 glyph，新增12全出自lookup1的`vert`；水平`horizontal-tb`／normal功能不啟用vert。lookup0屬`ccmp`，允許字元組合無可達ligature輸出。因此此實際水平文字的可達glyph仍是56，不是隨機挑幾個範例。68個glyph bbox／advance／輸出witness全留font-audit.json；沒把vert輸出的witness字串誤稱瀏覽器已選到該glyph。
- 六個新唯讀browser context（三語×320／1440）都以CDP確認允許字串只用該實際face；computed為16px、25.6px行高、horizontal-tb、normal字距／功能；Canvas設定逐項採用目前凍結sampler的模型（font、alphabetic、left、字距與wordSpacing），無畫圖。
- 每context全部56允許單字＋16適用kern pair實測；單字實際Canvas界全為`xmin=-1,ymin=-4,xmax=16,ymax=14`的聯集，**皆在全face設計界＋1內**。這是完整允許單字集合的有限實測，非少數例子猜全字體。
- 原六個真正失敗流程案例重新讀取raw、按baseline/x排序重建全文，全部與feedback相符；重新算ink在原safe內、sample與viewport SHA一致、原geometry_errors為空。作者verification及原raw／font-bound SHA與served四來源前後也核對一致。

## 精確的未證前提

1. `font-bound.py`只取未hint的glyf輪廓及hmtx/kern，然後把`raster_guard_css_px`直接設1。字體實際有`fpgm/prep/cvt`，保守closure中58glyph含instructions；腳本沒有分析其作用或證明Canvas的度量偏移上界。
2. 「每glyph輪廓和Canvas差至多1px」甚至有本批允許字元的直接反例：`4`輪廓xMin=0.1640625，Canvas xMin=-1，差1.1640625；`.`輪廓xMax=2.75，Canvas xMax=4，差1.25。24個允許字元至少一邊超出自己輪廓＋1，六context相同。**這不推翻目前較鬆的whole-face＋1界**，但推翻把1px當一般hinting定理的理由；不能把「全face很鬆剛好包住」等同已證任何context。
3. 完整允許單字集合及適用kern pair排除了大量不確定性，也未見橫向GSUB上下文替換；但是作者仍未給出Canvas對任意混合行、fractional glyph origin／native shaping run邊界的度量聯集定理。有限單字／配對實測不能不經論證就自動升格為所有長度字串的raster界。沒有重新做百萬枚舉來掩蓋這個前提。
4. 原`close-proof`右側最小餘裕只有0.8125px（已扣1px guard），因此guard的理由會影響正式結論，不能以「大致夠」略過。其他三側餘裕18.3046875／19.09375／20.4203125px；安全紙框映射與自動高度／字級保持等後段算式本身未見錯誤。

可接受的範圍為「固定Chromium／本機字體／此56字元與16px下，設計界及有限實測一致、六個真案例安全」。若要維持任意完整文字的數學certificate，需補同renderer的hinted glyph與定位誤差界、或明確把Canvas量測模型的可達glyph bounds與任意位置聯集關係推導完整；不能只引用這份單字實測，也不能改safe或把global旗標當成證據。字體、瀏覽器、CSS、DPR／字型環境改變均須重新評估；本輪不宣稱跨機通過。

## yes／no

| 問題 | yes/no |
|---|---|
| 實際face／全glyph設計輪廓／hmtx／kern／GPOS可獨立重現 | yes，font-audit.json |
| 當前允許輸入及所有features的GSUB closure有逐筆對映 | yes，56→68，新增12只屬vert；水平56 |
| 6個CDP context及全部允許單字Canvas被whole-face＋1含蓋 | yes，336單字與96配對紀錄 |
| 既有6個真流程全文、原safe與原圖SHA獨立核對 | yes，verify.cjs與summary.json |
| 一般「輪廓→Canvas偏移≤1px」成立 | no，4與句點等直接反例；並非目前畫面越框 |
| 作者已充分證明任意完整字串全域Canvas界 | no，guard／fractional origin聯集前提未證 |
| 本輪發現實際既有六圖排版失敗 | no |
| 全站或正式交付版面gate通過 | no，本輪只審這份證明 |
| 改作者proof／產品／sampler／contract或服務 | no |

## 實際命令

```powershell
$env:PYTHONIOENCODING='utf-8'
python holiday-lab/layout-qa/mid-autumn-bound-proof/independent-review/font-audit.py
# exit0，29651／29641；whole-face與68glyph closure實算
node holiday-lab/layout-qa/mid-autumn-bound-proof/independent-review/canvas-audit.cjs
# exit0，六context各56單字／16kern pair；wholePlus1=true，ownOutline1Failures=24
node holiday-lab/layout-qa/mid-autumn-bound-proof/independent-review/verify.cjs
# exit0，summary.json機算；universalRasterGuardProven=false
```

原輸出各存`*-output.txt`。Python初次讀UTF8 JSON誤用Windows預設cp950的失敗另留attempt01；明確UTF8後重跑。Canvas初次以witness取glyph會把vert同輸入variant取錯，原輸出另存attempt01，改成逐筆canonical cmap glyph後重跑，最終不使用該錯誤版本的per-glyph比較。從未執行作者會覆寫verification的close-proof腳本。

收尾收據補充：本輪期間作者自行更新`verification.json`，SHA由Canvas審查時的`61e62a1d0a962fff4ee4f8e125857ae7c66ecbf595bc0d90b5c00b039816d35f`變為`a8117e8b36b2e03208aca2ce1f36a34737c39e58ab5d5e2a346646fa57a67417`，目前作者旗標亦已是`global_bound_proven:false`。前文的核對一致針對測量當時收據；不能再稱作者verification前後穩定。served四源、原raw、font-bound與字型檔均保持一致，數學餘裕數值亦未改。verify初次刻意嚴格SHA斷言攔下這次並行更新，失敗輸出保留；最終summary單列`authorVerificationChangedDuringReview:true`與作者現值，不默默當同一份證據，也不重寫作者檔。
