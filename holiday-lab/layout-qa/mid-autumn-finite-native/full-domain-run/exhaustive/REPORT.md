# 全集工程交付：待獨立 review，不啟動全集

新 engine 已泛化為每 context 132 批、完整 index0…67447，末批376。準備清單只繼承原六批3072筆；本輪新增原生量測為0，剩401,616筆未啟動。GLOBAL 及完整玩家UI gate 仍為 **NO**。

唯一新增範圍為本 exhaustive/；舊 bounded、原pilot、產品、sampler、map、契約皆唯讀，未 stage／commit，未啟任何新browser／矩陣／背景native job。

|項目|yes／no|實際驗證／界線|
|---|---|---|
|完整132批迴圈及末批376|yes（工程）|測試逐 context 從繼承index512接續，完整67448、不重複前512，132批、最後376；六context共404688。尚未執行新native批次。|
|末批與殘批拒收|yes|376接受；末批375／377、一般批511、錯誤起點均拒收。NDJSON少一行、重複index、byte tamper均不得credit。|
|stream verifier|yes（既有資料）|獨立AST聯合domain重算＋連續index／witness／JS文字／Range／Canvas／固定safe／rolling／檔SHA，真驗讀繼承3072。allow-partial僅代表完整性，不給domain完成；不帶allow-partial實際exit1。|
|來源／方法／font／DOM guard|yes（負例）|跨module來源、跨measurement semantics、跨engine fingerprint、font前後不同、900／1000 DOM不同、skin cache不同，均真測拒收。現有新native路徑仍待root批准後首批實測。|
|PID守門|yes（負例）|同PID同creation仍live、PID已重用、沒有明確resume的歷史lock均拒收；無法建立PID身分時也拋錯。沒有自動重啟。|
|無授權不執行|yes|engine不帶manifest／authorization真exit1，沒有browser或candidate。prepare產出的launch-request approved=false，不構成執行授權。|
|已量3072不重跑|yes|prepare逐批核原checkpoint／raw／source／method provenance，新的batch-0000是明標inherited-bounded指標；engine從ctx.next512開始。未冒稱舊資料由新engine重測。|
|手機900、桌機1000|yes（原校準及工程）|繼承10個真UI正確高度校準；新init／clone沿用已驗height函式；新batch與state均強制context高度，沒有用1000高舊pilot冒充900。|
|全域極值及seed128接口|yes（資料接口）|每批保存七種極值完整hint node；offline verify組出各context觀察極值。witnesses產正常UI phase/input/預期原文與固定seed128/context清單，並明標尚未執行。六context種子唯一、穩定、範圍合法測試通過；已讀前10筆實際witness／文字。|
|401616新native實測|no|此階段不啟動，等待root指定獨立代理 review loop及guard。|
|真正全域極值正常UI重現／128原完整法複驗|no|接口已備；全集實測後才有真正極值。現有observed maxima不當全域最大。|

## 與bounded版本的差異

- engine.cjs：由單批硬鎖改為 while(next<67448)，每次最多512、最後376；每context單一clone、單一順序headless browser。由實際verified checkpoint取 next／rolling，不從進度數字猜測。
- batch.cjs：沿用不變的AST生成 ink函式與原sampler；每tuple立即核非有限／全文／baseline／fixed safe及clip。批次前後真source／全56字元CDP／Windows字型檔／skin／full-frozen／DOM結構及computed一致才可完成。邊界失敗也回傳已量rows／極值，不把已發生資料吞掉。
- core／state：逐行NDJSON核索引、joint witness、原生JS格式文字、rolling及整檔SHA；immutable checkpoint具有前一checkpoint SHA鏈、domain／measurement semantics／engine fingerprint。首批繼承header另綁freeze內initial checkpoint SHA及原failed／parent report SHA。
- 持久化：原生NDJSON寫入本目錄 raw-runs/<run>/<context>/、fsync，驗讀後才建立 manifests/<run>/<context>/batch-NNNN.json；各批七種極值完整node留在版控範圍，進度及事件可增量記錄。failed partial使用獨立UUID，不覆寫、不算complete。
- 授權／PID：新的manifest綁定授權收據為必填；先無授權時直接拒絕。PID以CIM creation身分辨識，存活或不明PID不可重啟；歷史dead lock需root明確--resume=1，沒有watcher或自動重試。

## 實際指令輸出

以下路徑前綴為 `holiday-lab/layout-qa/mid-autumn-finite-native/full-domain-run/exhaustive/`。

```text
node --test <前綴>engineering.test.cjs
tests7 pass7 fail0 skipped0
exit0

node <前綴>prepare.cjs prepared-01
PREPARED prepared-01 inherited3072 new0; 132batch/context last376;
manifestSHA=64b5b6840c243d33cee047b1c3e206ea43a30904b134636d920387505b6d3448 NOT_AUTHORIZED
exit0

node <前綴>verify.cjs --manifest=<前綴>manifests/prepared-01/freeze.json --allow-partial=1
STREAM_VERIFY integrityYES 3072/404688 missing=401616 domainComplete=false GLOBAL=NO
exit0

node <前綴>verify.cjs --manifest=<前綴>manifests/prepared-01/freeze.json
Incomplete native universe; no all-domain credit
exit1（預期負例）

node <前綴>witnesses.cjs <前綴>manifests/prepared-01/freeze.json
WITNESS_INTERFACE 6 contexts seed128each;
first10=[43468,65531,41294,20421,7480,35823,48258,7217,44084,17611]; realUI/fullFrozen NOT_RUN
exit0
```

測試為工程模擬與先前3072真資料的離線驗讀，沒有用測試合成數據充當新native量測。完整stdout在test-output-final.txt、prepare-output.txt、verify-partial-output.txt、verify-incomplete-negative-output.txt、witness-output.txt。

## Root review／啟動入口

請獨立檢查 engine.cjs、batch.cjs、core.cjs、state.cjs、pid.cjs 的loop、完成條件與拒收路徑，再檢查 verify.cjs 和工程測試。若任一runtime程式修改，不可沿用prepared-01舊method freeze；需另建prepared-02等新準備清單，舊資料不刪、不覆寫。

root批准後可另寫授權JSON：approved=true、對應freeze SHA、total_per_context67448、maximum_new_native_measurements401616、single_headless_job=true。不要修改freeze本身或把現有launch-request=false冒充批准。實際啟動命令形式如下，本輪未執行：

```text
node <前綴>engine.cjs --manifest=<前綴>manifests/prepared-01/freeze.json --authorization=<root另寫批准收據>
```

如中斷，先讀job-lock與events，實際確認PID是否存活。只有root明確續跑時才加--resume=1；engine會重新驗讀既有完成批、method／source、rolling，保留殘批另開attempt，從最後完整批接續，不重測complete3072。首批已繼承512之後將依序測512…1023。

全集native完成只會標native-universe-complete-pending-independent-ui-validation。之後仍須正式offline完整驗讀、各context真正極值放回正常玩家UI、固定seed128/context用完整frozen獨立法比較；這些未做前不出GLOBAL YES。

## 原始資料保存風險

本目錄 `.gitignore` 精確只排除 `/raw-runs/`，`git check-ignore` 已真確認該範圍；程式、immutable freeze／checkpoint／極值SHA、進度及事件在可版控範圍。約615MB原始NDJSON是本機檔，未上傳、未備份、沒有宣稱另一台能直接讀取。每一checkpoint記完整原始路徑與SHA；原資料遺失即無法完成verify，不能靠一份hash宣稱測過。跨機需另保全原始raw與舊bounded繼承來源，且需維持同字型／瀏覽器／環境，否則guard應拒絕。
