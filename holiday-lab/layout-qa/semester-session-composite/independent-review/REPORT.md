# Semester session coverage adapter：獨立審查

結論：**修後在「契約 case 覆蓋組合」範圍通過**。目前固定證據是原10個完整 session 加新2個完整 session，90個精確 canonical keys 正確；原320個 partial cases 排除。沒有給 full method／字形上界／全 gate／發布許可。

只新增本 independent-review；沒有改 adapter、tests、build、產品、core、原 raw，沒有啟動 collector、重跑其他路線或重驗全684個 frame，也未 stage／commit。

## 實際證據核對

`node check-actual.cjs` → exit0，完整輸出 actual-output.txt／actual-results.json。

| 驗收 | yes／no | 實際結果 |
|---|---|---|
| 原10完整＋新2完整來源 session 精確對映 | yes | 12個slot各恰1筆complete，原status／metadata不重寫 |
| 原 partial 被排除 | yes | 320筆；讀summary算得3328筆來自完整sessions，與root結果一致 |
| 90筆是精確契約集合，不是只比數量 | yes | 6種語寬各15個phase state，唯一ID／width／height key完全相同 |
| 90 canonical fullshard／原圖／geometry獨立核對 | yes | 只載這90筆，store逐片SHA／identity、原圖SHA、same-shot與inspectReport均過 |
| error-longest仍缺6 | yes | 六種語寬均未被此組合填補 |
| 現有13筆來源比較綁定真正新after | yes | 與fresh verification的SHA／bytes／HTTP／started／finished逐欄相等，實際時間都晚於fresh terminal |
| 點收據被擴稱連續不可變或舊collector after | no | source_scope明列point receipts；original_after_receipt_available=false |
| 原unknown1／method NO仍保留 | yes | old checkpoint2897＋known extra21、unknown1；fresh global979含sample method978，原fully_recovered=false |
| 所有gate／full method／字形上界／發布已通過 | no | full_project_approved=false；此adapter只供case覆蓋 |

15個phase state由實際phase collector與契約逐筆核對：help、settings、game/initial、dynamic-min、dynamic-max、paused、preview、phase-1、phase-2、result/summary、artifact-open、replay/shot-0/1/2、retry。沒有把phase-only未涵蓋的首頁流程也算入，也沒有用完整session中額外的第4重播鏡頭取代缺少的error-longest。

原metadata與progress逐值深比相同。對應物件仍可從原raw_file／raw_case_index完整讀取，沒有轉成只有欄位摘要的假案例。來源／case檔SHA與root evidence_files逐筆核對；其餘full cases沒有為本次審查重新hydrate或重新採樣。

## 找到的三個守門缺口與修後複驗

原adapter SHA：`a8fdfc6ce49bccc394261e2ecf87f1de941a56cea22f0bcac9df7c2319bf6a5c`。

原4／4 tests綠，但獨立三個最小fixture可重現錯誤接受（negative-results.json／negative-output.txt）：

1. fresh run在2026年，after填1970年仍接受；只驗日期可解析與內部先後，沒有核其在新run之後。
2. fresh verification記實際after bytes10，而comparison同一列填bytes11仍接受；未逐欄綁定真after。
3. 原recovery.original_violations_fully_recovered=false，verification改true仍接受並輸出true，即使unknown仍1，造成矛盾的NO欄位。

這三項是可重用adapter的收據／來源一致性漏洞，**不代表目前90筆原實證有誤**；獨立actual核對已確認目前真資料沒有這些矛盾。已回報root，由root在其ownership修正，本審查未碰core。

修後adapter SHA：`250d0c0fd5e5030c3394e45ea404d683703befa6893a9bb5a53d178e2526ba45`。

`node --test holiday-lab/tests/semester-session-evidence.test.cjs` → **5 passed、0 failed**（unit-postfix-output.txt）。root新增回歸的真紅→綠在上一層provenance-red／green-output；本審查另獨立實跑修後5個測試。

`node negative-probes.cjs postfix` → 三個原負例現在全部拒絕，分別為：

- After receipt time order。
- Comparison/actual after receipt binding。
- Recovery NO consistency。

完整修後輸出在negative-results-postfix.json／negative-postfix-output.txt。原先三個accepted結果與初次4test輸出保留，沒有覆寫成全綠。

修後讀碼確認：before map與fresh真收據綁定；兩組source key皆去重且精確同集合；comparison逐欄綁定actual after；after不早於fresh開始、fresh不早於old；ov的NO／unknown與old.recovery一致且unknown>0時不能fully_recovered=true。其餘session唯一性、4shot、console／page／HTTP、圖片／fullshard SHA、geometry、canonical去重與來源scope沒有放寬。

## 範圍與保留限制

本結果只允許root後續在coverage-index明確接入這組case coverage。根據來源收據可說三個觀察點bytes SHA相同，不能說整段時間連續不可變，不能把新after貼回原metadata。原未知terminal flag1、原978個method flags與error-longest缺6仍各自列NO，不能由90個case覆蓋消除。

fixtures位於本資料夾忽略目錄，全部留存、不刪；code／輸出／JSON結果留本白名單供root收錄。沒有擴大採樣或生成其他composite。
