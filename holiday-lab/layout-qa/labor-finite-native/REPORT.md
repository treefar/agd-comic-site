# 勞動節 error-longest：有限文字域與原生先導

2026-10-23。**GLOBAL_BOUND=NO；沒有啟動完整原生全集，沒有改coverage／assembly。** 已確認完整正常輸入域為4,608,273,662,721個組合；其中負載文字僅取決於729種分工，精確投影為190個不同三元組。完成10組真拒絕的三個主要owner先導，另以同10組補數值／進度adapter，共50張原生PNG。這些樣本不等於全集最大值已證明。

只新增本資料夾，產品、mid-autumn凍結檔、sampler、map、契約與舊證據均只讀；不stage／commit／push／main／刪檔／Unity。

## 實際來源與完整 joint domain

實讀 `holiday-lab/games/labor.mjs`、`holiday-lab/runner.mjs`、既有labor測試與原frozen sampler。此款無額外core模組匯入，evaluate就在labor.mjs。真正採集來源是舊固定08 `http://127.0.0.1:8845/holiday-lab/`，不是工作樹或新測量版。

`source-snapshot.json` 保存served原始bytes：

- labor：`21d00e4ae80d9a0034634508411a9341cf677c4fe74efb00c0ebcb72ccd92a58`
- runner：`e6b0c83b114ccf8b3b0eaf4a26a9d715a1268d80065766c75841d216d95fc9e1`
- CSS：`5b6d2ca17621f9a6e2aebcc5fb0f1ca86056787aedafd14e72e1bdfdd427644d`
- paper／panel SHA也封存；12段精確guard、原純函式前綴與失敗字串statement及SHA見 `catalog.json`。

正常UI有6工作，每個artist∈{0,1,2}、start∈{0,…,42}且step1。因此joint輸入是 `3^6 × 43^6 = 4,608,273,662,721`，不能把完整狀態域寫成729。工作時長依序[10,12,8,10,12,8]，休息段A20–26、B0–10、C0–8。按實際短路順序評價：range → deadline → dependency → break／overlap迴圈 → load → ok。

精確joint關係由固定來源中的純 `evaluate` statement計算，未用自己猜的近似規則；VM只在Node讀取純函式／常數，不mount或修改瀏覽器遊戲state。所有文字定義也從同一份固定來源擷取。任意source byte變動會fail closed。

### 拒絕文字owner

|owner|精確可達文字域／關係|合法見證|
|---|---|---|
|game-hint|五種拒絕：deadline、dependency、break、overlap、load，各語5句|source既有fixture逐一真save拒絕|
|labor-status|save拒絕瞬間與同次game-hint是同一reason原文，各語5句|同次拒絕後正常scroll分張採|
|labor-loads|729種artist完整指派，時長加權後只有190種joint (A,B,C)，總和60|任何指派把6個start全設0，必在job1因前序未完成而dependency拒絕，故每個負載都有合法拒絕見證|
|六個output[for=labor-start-i]|每一個文字值0..42，合計258個owner/value|artist皆A、其餘start0、目標start依值設定，必拒絕；原生input與clamp／step另核|
|game-progress|拒絕可達0 / 6至5 / 6，合計6句|精確六個完整schedule見catalog，純模型逐筆驗證皆拒絕|

不能把負載三欄各當獨立0..60自由組合；例如[2,2,56]雖總和60仍不可由這六個時長分配得到。catalog保留所有190個三元組、每組完整artist／start見證及729指派對映索引，沒有漏值或重複頂替。

`range`會回傳[0,0,0]，但需非法陣列、artist、start等，正常UI的固定六筆、三選項、整數range不能觸發。沒有把它算進正常UI拒絕全集。`ok`只出現在成功前status，成功提交進結果，不屬error-longest。初始化status的提示在同一mount呼叫最後被draw覆寫，沒有玩家可操作中間狀態。

歷史狀態不能略過：修改input會重畫status／loads，但不自動清除舊hint，所以一般歷史狀態不保證hint=status。這份有限域只在真save拒絕瞬間綁定同一schedule/reason；完整joint reason/load可行性依原evaluate判定，不將五reason和190loads無條件相乘。時間預覽只移動工作紙與opacity，結束用同schedule重畫；沒有新增時間數字文字。preview／pause／初始blurb、靜態help／labels／buttons、result／replay另屬既有phase，不以此模型重新認證。

## TDD與代表輸出

`domain.test.cjs`先跑缺模型紅（`tdd-red.txt`），最小模型後7/7綠；補全部動態owner與換行覆蓋測試後9/9綠（`tdd-green-expanded.txt`）：

- 729指派全部唯一、190負載，缺一筆／重複／非法artist皆失敗。
- joint總和與實際加權可達性；不允許非法獨立負載組合。
- 每指派都有全0時間的dependency拒絕見證。
- 非法start43、step0.5、artist3失敗。
- labor或runner source改動失敗；不靜默接受漂移。
- 十組fixture涵全部五拒絕、三個60極值與[20,20,20]。
- 六output各43值、進度0..5完整見證，459 jobs／464 targets每context。
- 真DOM仍須逐字相同；Range軟換行略去空白可區分，漏字與截斷仍失敗。

`catalog-output.txt`有10組代表性模型實輸出，不以語法成功當語意完成。完整先導配方為domain.fixtures()：all-A、all-B、all-C、balanced、deadline、rest、overlap、heavy、max-slider、mixed。完整schedule、語言、寬度、原因均在catalog／每run report，沒有用近似狀態替代。

## 真UI與原frozen sampler校準

只用headless正常選項click、range.fill＋真input事件、save.click與正常scroll。沒有import遊戲改state、setText、改CSS、改時鐘或取消RAF。每張圖前後核對完整schedule、六個原生min/max/step/value、原全文、source與regular字型收據。保留原full frozen sample、CDP字型、原viewport PNG、全nodes／blockers／geometry、原Range／baseline／Canvas ink、safe／clip與自然performance.now。

|run|單一PID／session|實際規模與時間|結果|
|---|---|---|---|
|pilot-01|38636／89391|10真拒絕、30目標PNG；30.918秒|原raw pass=false保留；5英文軟換行空白誤判，非缺字或safe失敗|
|pilot-02-numeric|12652／56038|同10組僅補progress/output，20目標PNG；20.944秒|raw pass=true；涵三語320／1440及0／42數值、六output selector adapter|

兩run各涵zh/en/ja×320/1440，不是全遊戲矩陣。來源每張與批前後一致、console/page/HTTP errors0；50張原墨跡未裁切、固定safe與實viewport均YES，原全case geometry errors合計0。所有截圖保持320或1440×900、DPR1，正常捲動到目標，沒有把其它viewport外文字當可見。

### 保留的紅與方法修整

pilot-01五個英文句子的每行Range文字在軟換行處省略空白。直接join不會等於DOM全文，故原raw pass=false。原 `report.json`、sample／PNG及當次程式 `collect-pilot01.cjs`均保留。沒有改raw成綠，也沒有再拍30張來藏紅。

`verify-pilots.cjs`另驗：DOM全文精確等於固定來源預期；原逐行Range按原baseline順序連接後，**只排除空白**核對所有非空白字形完整覆蓋；原文字與軟換行差異仍保存。所有50目標通過，且截字／漏字測試會失敗。此修整沒有改Canvas ink、安全框、字體或sampler。候選新collector使用此檢查，原兩份collector各以SHA綁原run。

### 字型界線：粗體前後收據尚有缺口

pilot-01主要三owner的CDP實字型均MicrosoftJhengHeiUIRegular，原`msjh.ttc`每張前後一致。pilot-02進度等數字出現MicrosoftJhengHeiUIBold；當次只記了regular的檔案收據，因此**不能宣稱粗體檔前後已證穩定**。

本次唯讀Windows Fonts登錄證實UI Regular對msjh.ttc，UI Bold對msjhbd.ttc，留 `font-registry-output.txt`；兩檔現在SHA留 `font-post-pilot.json`，明記post-only，不倒填成前後證據。待審的新 `collect.cjs`已加入兩字型檔每張前後與批前後收據，CDP只接受這兩個實際PostScript名；尚未在全集執行。原先導raw完整保留，GLOBAL仍NO。

實看代表圖：`runs/pilot-01/en-320-rest-labor-status.png`、`ja-320-all-C-labor-loads.png`、`runs/pilot-02-numeric/en-1440-max-slider-output-labor-start-4.png`。目標文字、0／42與負載極值可見，沒有因此宣稱美術已由使用者確認。

## 待主控查碼的全集提案，不是啟動指令

每context 190loads＋5hint＋5status＋258outputs＋6progress＝464個目標；六context最多2784目標，2754次合法拒絕。第一版提到1200只含前三owner，已明確撤回完整性主張；正式catalog包含數字owner。這是完整**文字集合**的原生排印候選，不等於4.6兆個任意歷史狀態都經等價證明。

`collect.cjs`的`--full`在任何browser或run建立前要求主控查碼後的明確approval收據，需scope=`labor-finite-owner-domain`、approved=true、module SHA相符；本資料夾沒有替主控生成收據。實際無approval執行被阻擋，見`full-blocked.txt`，沒有full run目錄／程序。

續跑設計：固定run名，`--resume`只讀原checkpoint；核對collector／domain／sampler／map SHA、原jobs、已存PNG/sample SHA、批前source/font一致後才跳過已採case。未完成job正常重設全部6artist及start後重做拒絕；不依賴舊browser state。每張sample與PNG落地後checkpoint，單一PID與log；看不到輸出先查程序及檔案成長，不因等待重啟。resume與完整模式目前只有程式／純測試、未做實際中斷重啟演練，列no待主控查碼。

不可從50樣本宣布190負載的native最大值，亦未證每種reason／load歷史組合的DOM排版等價。正式跑前仍需主控審核此owner投影範圍與字型修整。先導取樣約1秒/target含配置；全集的配置/target比例較高，不以此直接承諾完成時間。

## 可重跑驗收與實際輸出

工作目錄 `C:/agywork/agd-holiday-prototypes`；不要重跑snapshot覆寫固定證據，不要對既有run新建採集。

```text
node --test holiday-lab/layout-qa/labor-finite-native/domain.test.cjs
# 9 tests / 9 pass / 0 fail
node holiday-lab/layout-qa/labor-finite-native/catalog.cjs
# assignments729, unique_load_strings190, full_input_states4608273662721,
# guards12, proposed_full_targets2784, full_startedfalse, global_boundfalse
node holiday-lab/layout-qa/labor-finite-native/verify-pilots.cjs
# pass true; 30+20 native targets;
# exact_dom_plus_all_nonwhitespace_range_coverage true;
# native_ink_safe_clip_viewport true; regular_ms_jh_and_source_stable true;
# bold_font_before_after_recorded false; full_started false; global_bound false
```

|完成條件|yes／no|
|---|---|
|原碼推導完整joint輸入及所有拒絕動態文字owner|yes；不是729完整狀態|
|729指派完整、190負載逐筆及合法見證，非法／漏值／source drift failclosed|yes，9/9測試|
|十組真UI、五拒絕、極值及三語雙寬代表|yes；50 PNG含數字adapter補採|
|原frozen Range/ink/safe/clip/viewport與原PNG留存|yes|
|原raw紅、原collector及差異留存|yes，沒有倒填綠|
|regular font與served源前後穩定|yes|
|pilot02粗體字型檔前後穩定已證|no；post-only與待審新guard分開|
|全集／真正native最大值／resume重啟演練完成|no|
|GLOBAL_BOUND可轉YES或直接改coverage／assembly|no|
|已改產品／凍結檔／stage／commit／發布|no|
