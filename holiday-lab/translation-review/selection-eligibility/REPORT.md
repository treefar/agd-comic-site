# 甄選一般組資格：第四項招生P1精確提案

2026-10-23。獨立工作樹 `C:/agywork/agd-selection-eligibility`、分支 `codex/selection-eligibility`，固定基準 `329da94a490f24f80c998aceb5b637de22090987`。只新增 `holiday-lab/translation-review/selection-eligibility/*`，產品未改、不build、不push、不碰main、不刪檔、不啟動Unity。

原段落把甄選對象限為高職/綜高「應屆畢業生」，漏掉依規定可報的非應屆、普通科畢業滿1年及同等學力等資格。本輪只修這個資格段及其日英譯文；其餘文字、流程、志願上限、名額與日期保留。

## 三語建議與精確位置

中文資格段：

> 115學年度一般組：高職等專業群科畢業生不限應屆；普通科畢業滿1年，或符合簡章同等學力等資格者也可申請。綜高應屆須截至高三上修畢專門學程25學分。普通科應屆原則不適用；若截至高三上跨選專業群科或專門學程達25學分或450小時，依簡章另核。須取得115統測成績，且符合群類、校系及其他資格限制；青年儲蓄帳戶組另核。

完整三語old/new在 `exact-plan.json`，共3操作：

|檔案|精確修改|
|---|---|
|data/admission.json|slug=selection的content，只替換一個資格段|
|data/en/admission.json|同slug的content，只替換Target Audience資格段|
|data/ja/messages.json|舊中文全文正規化key更名為新中文全文key，日文value只換資格段|

英日均保留一般組115限定、專業群科含符合規定的應屆與既畢業者、普通科畢業滿1年、同等學力等條件、綜高高三上25學分、普通科跨選25學分/450小時例外，以及統測群類/校系限制。沒有將任何身分直接判定為符合本系，也未把一般組條件套青年儲蓄帳戶組。

已搜尋實際來源引用：舊中文資格句在canonical content與日文全文key；英文來源在結構化selection.content。其它科技繁星等仍有自己的應屆資格文字，並非本項來源，不一併替換。generated `locale-en.js`/`locale-ja.js`由root之後照現有流程重建，本提案不改它們；兩語後置字典均無舊/新完整content key覆蓋。

## 官方逐條核對

查核2026-10-23；[官方115 FAQ](https://www.jctv.ntut.edu.tw/enter42/apply/contents.php?academicYear=115&subId=182)與[115正式簡章B03.pdf](https://www.jctv.ntut.edu.tw/downloads/115/apply/ugcdrom/files/B03.pdf)本輪均可讀。詳見 `official-checks.json` 的逐條來源及實際PDF文字證據。

|項目|實讀位置|提案處理|
|---|---|---|
|專業群科並非僅應屆|FAQ一般組1；簡章印刷p2|不限應屆，但其它資格限制仍依簡章|
|普通科畢業滿1年、同等學力等|FAQ一般組1/2；簡章p2貳二(一)2|納入可依規定申請，不保證個案合格|
|綜高應屆修課條件|FAQ一般組4；簡章p2貳二(一)1(2)|以正式簡章截至高三上25學分為準|
|普通科應屆跨選例外|FAQ一般組3與簡章p2貳二(一)1(3)交叉核對|不照FAQ一句全部排除；25學分/450小時且截至高三上須另核|
|統測及報考群類|FAQ統測1/3、第一階段3/5/6；簡章p2資格前言|須有115統測成績且符合群類/校系及其它資格限制|

**簡章位置是印刷p2、PDF第9頁（零起算pageno=8）。** PDF文字可讀，實際條款轉錄在來源JSON。web screenshot呼叫未返回可保存的影像，所以沒有宣稱做完圖片閱讀。

FAQ對綜高簡寫25學分或450小時，對普通科應屆又只寫不可以；正式簡章則明列綜高應屆25學分與普通型高中跨選450小時或25學分例外。因此主文依正式簡章分清條件，不把任意450小時活動算作專門學程，也不把普通科應屆一概排除。

未逐一重查全部校系甄選辦法，也未替個案作資格核定；簡章其它零分科目、已錄取等限制仍由「其他資格限制」保留。這是重點摘要，不冒稱完整資格清單或116規則。

## 主控審後套用方式

預設只讀：

```text
node holiday-lab/translation-review/selection-eligibility/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes
```

審完3筆可由root加 `--apply`。每筆old全文須精確相同；新日文key須尚不存在。全部檢查完成後，寫前重比所有原檔，偵測並行改動即停止；其它新內容保留。多檔寫入不是原子交易，磁碟錯誤時須檢查diff。套用後需root重建locale並驗新key翻譯與畫面；不應直接重跑套用工具期待已套用old值仍存在。

## 逐條驗收與實際輸出

|驗收|yes／no|實際指令/輸出|
|---|---|---|
|從指定root基準建立獨立分支|yes|`git worktree add -b codex/selection-eligibility C:/agywork/agd-selection-eligibility 329da94a490f24f80c998aceb5b637de22090987` → HEAD329da94|
|原官方各資格逐項查核|yes|官方FAQ及正式PDF文字實讀；例外與來源差異明記|
|三語old/new精確且有日文key遷移|yes|`node .../build-plan.cjs` → 3 operations /3 files；完整值在exact-plan.json|
|其餘流程、所有名額日期及其它records不變|yes|`node --test .../review.test.mjs`：逐字比較資格段以外content；逐欄深比所有records|
|固定基準fixture可重跑|yes|所有輸入用`git show 329da94:<path>`；fixture套用後重建原基準仍通過|
|old漂移、key碰撞、越界、並行更動都阻止寫入|yes|回歸注入錯值/新key/改quota目標/並行改檔，實際觸發拒絕並比對SHA|
|只修改提案中的3處、保留無關新增|yes|回歸在fixture實際套用，保留rootNote並驗證日文其它key不變|
|回歸通過|yes|`node --test holiday-lab/translation-review/selection-eligibility/review.test.mjs` → exit0、10 pass、0 fail；test-output.txt|
|目前root old exact可套且dry-run不寫檔|yes|`node .../apply-safe.mjs --project C:/agywork/agd-holiday-prototypes` → exit0、3 operations、product_files_written0；三檔前後SHA相同，root-dry-run-evidence.json|
|已改產品、重建locale、檢查畫面|no|本輪只交提案；未build或驗畫面，交root審後整合|
|所有個案/所有校系已確認可報|no|摘要仍須看群類、校系與完整資格；不作個案保證|

這10項測試檢查提案套用守門與範圍，不把關鍵詞存在冒稱招生制度已由測試核定；制度依上述官方逐條查核，最終仍依完整簡章。
