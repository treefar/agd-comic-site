# Peace preview六context：分次原生證據的typed join

入口：`canonical-candidates.json`；固定驗證介面 `candidates.cjs` 的 `async verify(doc)`，純唯讀。只有`peace-memory/{zh,en,ja}/game/preview`，尺寸320×900／1440×1000，6個候選皆eligible。numeric／GLOBAL／使用者確認均NO。

## 逐項驗收

|驗收|yes／no|證據|
|---|---|---|
|完整原始full_case、nodes、blockers|yes|每candidate逐值等於所選新run的`cases[index].full_case`，不貼別張圖的node。|
|原sample／flags完整綁定|yes|sample嵌原report、保JSON pointer與canonical JSON SHA；整report bytes SHA一併驗。所選6個case合計5個原flags全保留。|
|真PNG SHA／bytes／完整解碼／viewport|yes|Sharp強制raw完整解碼，actual PNG為320×900或1440×1000；不是full-page冒稱viewport。|
|正常輸入與未聽過人物|yes|新DOM snapshot：person0按下、其他false；x20／y65／width24；開始前progress0、result_count0；未點記錄過人物。|
|量測與截圖前後真聆聽progress0|yes|新before／after snapshot含status、progress、輸入、選項、viewport、scroll、performance及wall time。|
|隨後自然progress1的值與時間|yes|新completion snapshot直接存current1與完成狀態，時間晚於after；沒有改dt、延長1.2秒或改時鐘。|
|實用regular／bold字型前後|yes|每row CDP before／during／after；所有實際postscript均對應登錄的Microsoft JhengHei UI regular/bold；兩字型檔前後bytes／SHA／時間一致。|
|served來源before／after與body|yes|新run保存38來源實際body、HTTP狀態、bytes／SHA／時間；與固定08及舊來源圖像逐檔同SHA。sampler/map另綁freeze。|
|原舊6缺失snapshot被補成舊時間點|no|沒有改原peace-listen-preview；只保歷史引用與其缺失。|
|第一次新run EN1440採樣完整|no|功能collector原輸出6/6，但離線發現EN1440 status不在visible sample；該raw/sample/PNG/flags保原NO。|
|第二run僅補必要EN1440|yes|經root額外授權，一次獨立driver／collector，在Listen後原生scroll status，再真採完整文字與PNG；成功1/1。|
|完整UI／數值域／使用者確認|no|僅preview來源case候選，不能清SCROLL flags或升格全gate。|

## 單次程序與分片來源

|run|driver／collector PID|collector OS建立時間|結果|
|---|---|---|---|
|native-run-01|20388／24056|2026-10-23T04:27:05.7375160Z|terminal exit0；六組直接狀態功能成功，但EN1440墨跡缺口另標NO。|
|native-run-02-en1440|26612／55592|2026-10-23T04:29:33.3009668Z|terminal exit0，只EN1440，完整status墨跡／PNG。|

兩個driver都以`wx`建立DRIVER.json，存在即拒絕重啟，沒有自動retry。第二次是主控明確追加的單context修復，使用另一份`native-collect-v2.cjs`／driver-v2，原collector bytes不改；`prepare-en1440.json`留原／新程式SHA與精確差異。

所選六候選是第一run的ZH320／ZH1440／EN320／JA320／JA1440，加第二run EN1440。不是同一run或同張畫面。第一run EN1440保留在`excluded_original_capture`，不計候選，不改原status欄位。

|context|before performance|after performance|自然完成performance|所選raw index|
|---|---:|---:|---:|---:|
|ZH320|866.200|1063.500|2065.100|run01／0|
|ZH1440|868.400|1167.700|2071.200|run01／1|
|EN320|856.000|1033.500|2057.500|run01／2|
|EN1440|922.000|1262.100|2070.400|run02／0|
|JA320|864.400|1022.900|2047.600|run01／4|
|JA1440|875.800|1151.200|2076.700|run01／5|

這些performance是各頁自己的原生毫秒時基，不是跨頁比較的時間，也不是把聆聽拉長的設定值。

## Root接入schema／profile

- `type = peace-active-listening-preview-v1`。`proof_scope`只限active listening preview case覆蓋。
- `candidates[].canonical_id, game, lang, width, height`；`canonical_preview_eligible=true`。
- `original_report`／`original_report_sha256`／`raw_case_index`／`json_pointer`。raw真欄位是`cases[index].full_case`與`cases[index].sample`。
- `full_original_case`保持原ID與全部nodes/blockers，不新增假的原欄位。原case本身沒有geometry_errors，故另存candidate的`original_geometry_errors`，重新inspectReport必為空。
- `sample`沒有假的獨立檔案路徑；它是report內嵌物件，保存原report SHA、JSON pointer及canonical JSON SHA。
- `screenshot.file/sha256/bytes/width/height/format`、實際scroll before/after。
- 新raw實際頂層欄名是`sampler_sha256`、`asset_map_sha256`；每candidate同名。不要讀不存在的sampler_function_sha256。doc的`native_runs[]`各綁run SHA／driver SHA與來源body收據。
- `normal_ui_input_receipt.snapshot`／`listening_receipt.before,after,completion`為所選同一row直接DOM快照。
- `font_receipt`含computed、CDP before/during/after、font_files before/after；`source_before/after`為相同固定08 source map，具體HTTP body收據由對應native_run提供。
- `historical_preview`只保舊row來源及原flags，`missing_direct_snapshots_not_backfilled=true`，不把舊collector-only推論當新直接證據。
- `original_method_flags`逐值保留；`original_fullcase_not_merged=true`。

## 實際命令

```text
node --test holiday-lab/layout-qa/peace-preview-joined/adapter.test.cjs
初次 MODULE_NOT_FOUND，exit1（tdd-red-output.txt）
最終5 passed, 0 failed，exit0（tdd-final-output.txt）

node holiday-lab/layout-qa/peace-preview-joined/native-driver.cjs
terminal exit0 PID24056
node holiday-lab/layout-qa/peace-preview-joined/native-driver-v2.cjs
terminal exit0 PID55592

node holiday-lab/layout-qa/peace-preview-joined/candidates.cjs --build
PEACE_PREVIEW_TYPED pass:true candidates:6 eligible:6（build-output.txt）

node holiday-lab/layout-qa/peace-preview-joined/verify.cjs
PEACE_PREVIEW_READONLY YES pass:true candidates:6 eligible:6 original_flags:5
numeric_domain_proven:false full_project_approved:false user_confirmed:false
native_launches:2 each_driver_single_launch:true png_full_decode:true
exit0（verify-full-decode-output.txt）
```

負例包括缺原fullcase、錯語言／height、來源漂移、非聆聽／未自然完成、PNG與sample digest不符、清掉原flags，均拒絕。新原生證據加入時第一次strict join抓到EN1440缺墨跡的失敗測試輸出保留，沒有為了綠燈忽略此缺口。只在本資料夾新增檔案，未stage／commit／push／main／delete，未改root helper／index／assembly／舊proof或其他程序。
