# 固定08靜態錯誤全文：第三批

dragon-boat、teachers、exhibition 的有限拒絕全文與最大墨跡候選全部驗到，18組可作 canonical error-longest。national-day 五句固定hint亦全數驗到，但其 `island-readout` 有數值與「視線被擋」動態次級狀態，尚無全域墨跡界；該款6組只作補充證據，不計完整 error-longest 通過。

只新增本目錄，沒有改產品、sampler、safe map、contract、official R0或其他人報告；未push、碰main、刪檔或啟動Unity。沒有重啟長矩陣。

## 各款可判定結果

|遊戲|完整有限固定拒絕key|三語×兩寬候選群|真拒絕收據|hint全文／unclipped／原safe／geometry|完整error-longest資格|
|---|---|---:|---:|---|---|
|dragon-boat|order、face、coverage、crease|24|72|yes，6/6 context，unresolved0|yes，6組|
|teachers|action、line、rushed、slow|24|72|yes，6/6 context，unresolved0|yes，6組|
|national-day|order、blocked、camera、coast、ridge|30|90|yes，固定hint 6/6，unresolved0|no，動態island-readout尚未全域證；6組supplement-only|
|exhibition|walkway、info、spacing|18|18|yes，6/6 context，unresolved0|yes，6組|
|合計|16個固定key|96|252|24/24固定hint context|18 eligible、6補充|

數字來自 `verification.json` 與 `summary.json`，不是手填候選上限。`canonical-candidates.json` 保留全部24組原case、完整nodes/blockers、原ID/raw SHA與原圖SHA；每款的width、height、area最大實測墨跡代表分開列在contexts.representatives。沒有以字數最大冒充墨跡最大；因為有限候選全集逐筆驗過，最大者必然包含在此全集，不靠TopN猜測。

national-day的 `verification.games` 及六個candidate都明列：

```json
{"canonical_error_longest_eligible":false,
 "unproven_dynamic_secondary":[{"owner":"island-readout",
 "reason":"Numeric camera/coast/ridge context plus blocked sightline suffix has no global dynamic ink bound in this proof"}]}
```

其他三款為eligible true，scope仍限正常UI可達固定拒絕全文，不代表全遊戲、全控制區、成功作品或整體專案通過。`full_project_approved:false` 保留。

## 來源、guard與次級位置

固定服務是 `http://127.0.0.1:8845/holiday-lab/`。原始四run與讀源範圍在先行落地的 `SCOPE.md`。逐款AST從真正served模組解析三語literal，不以audit regex自身作唯一覆蓋證明：

- dragon-boat：messages物件扣除intro/adjust/ok/unfold後恰四個錯句。fold的優先分支、leaf/face有限選項、angle0..180、finished/done guard逐項對源。fold-status是動態覆蓋率、角度與建議，沒有複製四句拒絕全文。
- teachers：AST核唯一 `if(!r.accepted)`、`msg`條件鏈與唯一ctx.hint，action/line/rushed/default slow恰四句。pause native200..2400 step100，儲存守住panels<3。API range不另顯新錯句；preview不是提交必要條件，沒有第五句preview-required拒絕。dialogue與preview-status只顯玩家選句或預覽結束說明，不是拒絕全文副本。
- national-day：五個messages分支由order、blocked、camera、coast、ridge順序產生；非法欄位／越界值只回原state，正常UI有限選項與滑桿界線已核。island-readout的動態數值＋blocked後綴是另一個未證完整上界的義務，不能拿這份hint全覆蓋洗成過關。
- exhibition：AST核唯一 `if(!r.ok)`，walkway/info/default spacing恰三句。三個works由newShow固定建立，updateWork一對一map；nativeX10..90/Y20..80及方向鍵clamp保持合法，info轉布林。missing/range是API非正常UI狀態，亦不產第四個新literal。status的ready0..3是進度，preview hint是指示，不冒充拒絕全文副本。

完整精確source片段／行號與排除理由保留在 `guard_reachability`。runner、lab.css、panel與四個module的served source前後SHA都核同；原raw的runtime_receipts、sampler function SHA及safe map SHA也逐一核固定freeze。`source-pre.json`、`verification.source_pre/source_post`是當次來源收據。

## 原圖可見性與12張精確補圖

24張原始代表圖是既有raw的WEBP，已逐byte複製到representatives並核原SHA，沒有轉成PNG後假稱原檔。完整原case和原viewport畫面都保留。

打開原圖後發現mobile原viewport常因按鈕操作捲到控制區，hint不在鏡頭中；沒有把這些圖宣稱成看得到錯句。主控明確允許後，僅補12個width320原代表候選、同source、同phase0、同error-driver控制recipe與精確同一句hint的真DOM PNG。正常scroll到hint後拍攝，沒有時鐘／seek／狀態寫入，也沒有再跑矩陣或frozen sampler。這12張PNG是新補充畫面，不能取代原fullcase或假稱原整個場景狀態就是該PNG。

`mobile-visible-hints.json`逐張連原canonical、原ID、raw SHA、舊圖與新圖SHA，列真控制值、scroll前後位置、文字不變與fully_in_viewport。12/12 exact、visible、page_errors0，source pre/post同。已打開日文國慶320 hint補圖檢視，原教師英文1440與展覽中文1440等原圖亦已看過；這不代替使用者美術確認。

## 實際驗收與未解除事項

|條件|yes/no|實際指令與輸出|
|---|---|---|
|四款全部固定拒絕全文來源吻合|yes|`LAYOUT_QA_URL=http://127.0.0.1:8845 node holiday-lab/layout-qa/error-source-audit.cjs --reports=<SCOPE四run> --out=static-error-max-3/exact-feedback-audit.json` →matches252、mismatches0、unmatched0。`audit-output.txt`|
|四款subset未覆蓋固定key為0|yes|audit.unreached依四款filter均0。工具整個15款catalog輸出的unreached330屬其他款，不宣稱15款都覆蓋。|
|96有限候選群、252實測hint完整safe|yes|`node holiday-lab/layout-qa/static-error-max-3/check.cjs` →各款6/6、unresolved0；finite24/24，eligible18/24，national6 supplement-only。`output.txt`|
|每份原fullcase獨立政策檢查|yes|同指令逐case獨立inspectReport返回[]，原full nodes/blockers保留；逐hint reconstructed全文相同，unclipped ink等於ink且在原來源紙框safe內。hint本身無須內捲補全文。|
|12張mobile hint真可見補圖|yes|`node holiday-lab/layout-qa/static-error-max-3/mobile-hint-witness.cjs` →12個YES、同phase0/key/full text、可見且來源前後穩定。`mobile-hint-output.txt`|
|source首次唯讀重取沒有暫態失敗|no|首輪完成dragon/teachers後fetch national遇ECONNRESET，退出1；`first-output.txt`與`failure.txt`保留。加入最多3次唯讀重取後再驗原raw，未重啟服務或矩陣、未新增大批DOM採樣。|
|所有原method flags已清|no|原teachers控制區仍有SCROLL_CONTENT_PENDING及某些選句CLIPPED旗標；national有stage image PAINT_HIT_TARGET_UNRESOLVED。它們完整保留在rows.related_method_violations，沒有因hint通過就改成全UI完成。|
|national動態readout全域最大與完整error-longest|no|island-readout數值＋blocked後綴沒有動態全域上界；六組只能補充，不覆蓋required canonical obligation。|
|程式語法及空白檢查|yes|`node --check`三個本目錄cjs、`git diff --check` →exit0；未跑遊戲大測試或Build，產品無修改。|
|全部專案可發布|no|本批只是有限固定拒絕全文證據，仍有明列未完成義務。|

最後完整stdout：

```text
dragon-boat finite_keys=4 exact_matches=72 contexts=6/6 unresolved_rows=0
teachers finite_keys=4 exact_matches=72 contexts=6/6 unresolved_rows=0
national-day finite_keys=5 exact_matches=90 contexts=6/6 unresolved_rows=0
exhibition finite_keys=3 exact_matches=18 contexts=6/6 unresolved_rows=0
FINITE_CANDIDATES YES; canonical representatives 24/24; canonical eligible 18/24; national6 supplement-only; no product changed
```

原始首輪網路失敗後的重試只重讀同一份既有raw、module與圖片，不是重跑252個真拒絕操作。沒有把來源數、語法正確或代理自述當成畫面語義證明。
