# 聆聽／回憶對位：既有原生有限錯誤文字複核

固定08／8845。結論：**兩款皆NO，12個候選皆eligible=false**。這次完成的是既有證據稽核，不是遊戲閘門通過；沒有啟動瀏覽器、遊戲、完整矩陣或修改產品。12個代表均保留完整原case與ID，未將代表重新命名冒充新量測。

|原資料|原frames|核SHA的相關sample／圖|目標owner列|缺字串context|未閉合字串／context|
|---|---:|---:|---:|---:|---:|
|peace-memory／2026-10-23T00-50-47-924Z|680|478|603|6|12|
|retrocession／2026-10-23T02-53-45-604Z|622|414|522|6|9|

總計892份原native sample及原圖SHA複核，1125筆owner資料；不是新拍892張。`summary.json`由離線`verify.cjs`重算，完整來源／原始method flags／Range／baseline／墨跡／固定safe／viewport與scroll證保留於`verification.json`。

## 有限域與可達性

讀固定served module的AST，逐個W呼叫保存原文／行號／offset，不靠字數挑最長。`catalog.cjs`另核實際runner的native range與stepper範圍、固定choice、dt clamp、pause與完成銷毀；API-only invalid狀態的排除與normal UI路徑分開記。

- **peace-memory**：拒絕hint有clipped／duplicate兩種；`peace-status`完整域另有initial、listening、recorded、clipped四種。初始狀態列為參考，不當作duplicate可達狀態。成功聽完至少一人後，choice與duplicate handler都不改status，因此duplicate可能保留recorded、clipped或listening；不能只核game-hint。`peace-voice`只在成功錄下聲音時更新，並非拒絕／status handler，未冒稱該owner與任意其他UI全域均已證。
- **retrocession**：拒絕hint固定一句；`archive-feedback`有error>=4、1.8<error<4、error<=1.8三段固定字串，全部列入。ready段是可提交提示，不是拒絕，但依完整secondary域一起核。各滑桿有界且phase由成功推進，range／round API guard不新增正常UI可達的另一種拒絕文字。

原game／runner／lab.css／panel／paper的served SHA前後相同，且與兩份原report收據完全一致。原sampler檔SHA、函式SHA及safe map SHA均與sampler-freeze-06一致。源文字快照另存`source-snapshot.json`，不能以目前工作樹換行或後來版本替代固定08。

## 明確未閉合項

1. **retrocession close：6個context完全沒有原native文字**。原622frames中`archive-feedback`只找到far與ready，沒有中文「很接近了」、英文Close或日文あと少し。其他兩段再長、再多capture，都不能替未量的中段作墨跡證。
2. **peace listening：6個context完全沒有原native文字**。原680frames沒有`peace-status`「正在聆聽」／Listening／聴いています。這可以在重複聆聽拒絕時保留，不能當成與拒絕無關而排除。
3. **peace duplicate相同拒絕來源的secondary組合**：18個context／status組合中，只有1440的3個clipped組合有相同capture全文證。recorded6與listening6均沒有相同拒絕capture，320的clipped3亦未同時閉合。recorded雖在一般成功後另有量測，不冒稱已證duplicate當時的同一組狀態。
4. **兩款窄版game-hint原viewport未見全文**：三語320的peace clipped-hint、duplicate-hint，以及retro anchors-hint，共9個字串／context有Range與紙面safe資料，但原拍攝時已捲至controls，hint不在原viewport。這是可見影像／位置證據缺口，**不是新增紙面越界bug的判定**。

因此peace 6個缺文字＋6個窄hint=12未閉合字串context；retro 6個缺close＋3個窄hint=9，共21項。duplicate的15個未閉合同拒絕組合是另一維度，與21不能直接相加當不同缺句數。

## 判準與原證保全

每個owner必須同時滿足：原native measurements重建完整原句、unclipped_ink與ink相同、實墨跡在原固定safe內、panel來源SHA相同、原viewport包含全文；使用controls-scroll capture則另外要原scroll observer證全文可達／文字未變／domain穩定。原圖SHA、same-shot、viewport前後scroll一致與完整case geometry逐項核。沒有為求綠放寬任何框或改sample。

原sample的`TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT`、`SCROLL_CONTENT_PENDING`、paint unresolved等method flags照存。某目標在另一張真scroll capture完整，不代表整頁method flags或原始未完成項自動消除。此次不回寫任何原矩陣flag、contract或canonical R0。

`canonical-candidates.json`每款三語兩寬各1個，共12個，保留`full_original_case`、原report SHA、原case index／ID與原圖SHA，圖片在`representatives/`。候選只從已觀察拒絕畫面內的完整owner選取，另保width／height／area各觀察最大值；**因域不完整，它們只叫觀察候選，不叫全域最長**。

已實看英320兩款代表：圖中顯示controls及secondary，而頁首hint不在畫面，與viewport判斷一致。這不等於逐張美術認可或使用者驗收。

## 最小補測配方（本次未執行）

- Retro：第一幕用正常滑桿設x=-8、y=5、rotation=0、scale=1。與第一幕參考僅水平差2，依原transform公式平均誤差3.2，會落close段；按Save得到固定拒絕hint。這是供下一批實際操作的配方，數學推導不能當新native樣本。三語兩寬各操作一次；hint與secondary不在同viewport時，分開正常scroll拍攝並保存同一拒絕身份、兩者原文前後未變，不造近似state。
- Peace：先正常聽完左側一人（x20／y65／width24，自然等待progress=1），直接再按Listen，取得duplicate＋recorded。再選未聽者、移至x100／y35／width16按Listen取得clipped；選已聽者再按Listen取得duplicate＋clipped。最後選未聽者放正框、按Listen，等真status出現listening，立即用正常choice切回已聽者（該handler會停止listening但保留status），再按Listen，取得duplicate＋listening。不可直接setText、注入heard、變更時鐘或pending RAF。三語兩寬；若來不及切換而已完成第二段，需正常重試，不能改狀態補證。

## 指令與yes／no

```text
node holiday-lab/layout-qa/static-error-max-5/check.cjs
peace-memory: frames=680; native samples/images=478; owner rows=603; finite contexts=0/6; eligible=false
retrocession: frames=622; native samples/images=414; owner rows=522; finite contexts=0/6; eligible=false
FINITE_CANDIDATES NO; eligible=0/12; sourceStable=true

node holiday-lab/layout-qa/static-error-max-5/verify.cjs
pass:true; audit_complete:true; eligible:0/12 NO
verified_native_samples:892; retained_complete_original_cases:12
source_before_after_stable:true; new_browser_or_game_runs:0; product_writes:0
```

完整輸出是`check-output.txt`、`verify-output.txt`。先導補加source snapshot時審查工具曾有括號語法錯，連帶離線工具找不到新snapshot；原紅輸出分別保留`snapshot-tool-syntax-red.txt`、`snapshot-tool-dependent-red.txt`。修的是本目錄工具，原產品與原native資料未改，修後兩指令exit0。**工具exit0表示稽核完整且NO被正確保留，不表示兩款eligible通過。**

|條件|yes／no|
|---|---|
|逐個正常拒絕／secondary／slider guard讀實際source|yes|
|兩份固定原報告、原sample／圖、來源與frozen SHA已核|yes|
|三語兩寬均有逐字／逐owner coverage|yes，包含精確缺口|
|保完整原case／ID與每款6候選|yes，12個皆未eligible|
|所有有限分支已有native全文、墨跡與可見viewport證|no|
|error-longest eligible／完整UI gate通過|no|
|新操作遊戲／大矩陣／改sampler或map／改原flags|no|
|stage／commit／push／main／刪檔／Unity|no|

