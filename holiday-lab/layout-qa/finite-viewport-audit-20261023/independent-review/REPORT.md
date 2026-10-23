# 有限錯句viewport降級與integration：獨立審查

結論：**兩個真守門缺口修正後，這輪限定範圍通過**。54 contexts的既有viewport audit判讀正確，24個原本eligible的320窄context必須降級；這不是全gate或發布通過。沒有重新跑大index、collector、全684路線或改原proof／R0／sampler／contract。

## 固定audit實證

`node check-actual.cjs` → exit0，actual-output.txt／actual-results.json：

- 全54 contexts的keys／chosen captures／owner可見性重新計算，27可見、27不可見；不可見全為320。
- national-day六組原本全部supplement-only，不能把其三個窄context再當成新增覆蓋扣除。因此實際需要降級的是其餘遊戲24個eligible窄context。
- 所有group的verification SHA逐組相同；每個context選原frame，合計66個原fullcase owner receipts核原case SHA、ID、width／height、viewport dimensions、unclipped_ink與screenshot proof原值。
- audit SHA為 `bcf631cb85ac565d6c2c6da35d702996d0eae493a56f66cd9c7ed4bd5ee3ef84`。原proof／verification沒有覆寫。

這是既有chosen frames的viewport範圍證據，不能說其他未檢查替代frame都不可見，也不能代替字形全域上界、動態次級owner或method flags的獨立證明。

## 找到的兩個真缺口

原隔離CLI／cache輸出在 cli-results.json、cli-output.txt、cache-results.json、cache-output.txt，原結果保留：

1. **assembly可越過index的可見性降級。** 六個小fixture context使用auditA（窄false）產生index covered3／supplement3；assembly同A selected3，但改傳同verification、窄true的auditB仍exit0、selected6。原index run沒有綁定audit path／SHA／eligible keys，assembly可把已降級案例升回。
2. **共用verification的SHA守門受resolve順序影響。** 正確group先resolve後，同一vf的另一group即使expected SHA全0仍eligible=true；反過來先resolve錯group才拒絕。verified Set只按檔名，跳過後續group的expected SHA比對。

兩項由root在其core ownership修正；本審查不改core。現在resolver cache儲存actual digest且每group比expected；index明列visibility_audit_file／SHA與canonical_eligible_keys；assembly只讀index綁定audit，另傳不同path／SHA即拒，並將每個候選的computed eligibility與index keyset交叉驗證。

## 正式紅綠回歸

新增唯一授權測試檔：`holiday-lab/tests/finite-visibility-integration.test.cjs`，七個可重跑node:test；fixture只在本白名單忽略目錄建立並保留。

為保留真修前證據，snapshot-before.cjs只將修前已讀取的行還原，再逐byte驗證三個core檔SHA必須完全等第一次CLI測試記錄；不是近似替代版本。三個SHA與receipt在snapshot-before-receipt.json，對應小core snapshot留存。

`node run-regression.cjs`：

- 修前exact snapshot：exit1，**2 pass／5 fail**；integration-red-final-output.txt。
- 同一套測試對修後live core：exit0，**7 pass／0 fail**；integration-green-output.txt。
- 原最早CLI／cache結果及第一份red輸出均未覆寫。
- 最後連既有scope／static-context／semester-session測試一起實跑：**19 passed／0 failed**，final-unit-output.txt。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| --static沒明確--finite-viewport即拒 | yes | 小CLI與正式回歸 |
| stale verification／錯dims／缺context／duplicate拒 | yes | 原隔離CLI與既有scope測試 |
| false viewport只留supplement，不列covered | yes | 6context fixture只covered3、supplement3 |
| assembly不能換auditB升回窄context | yes，修後 | exact snapshot真紅→live core真綠 |
| 共用vf錯expected SHA不依resolve順序 | yes，修後 | 冷／熱cache兩種順序皆拒 |
| 正向同A audit path／SHA／eligible keyset相同 | yes | 正式回歸；另不給assembly override時依index綁定audit |
| 缺index scope／keyset升級、移除、重複均拒 | yes | 正式回歸 |
| assembly不偷讀舊固定static1／2 | yes | fixture故意放舊固定檔，index沒有明列時selected0 |
| semester只引已審90 logical refs、保原fullnodes | yes，讀碼與既有實證 | index方法SHA＋case_refs綁定；assembly經原reader取raw_case_index完整物件，不拼摘要nodes；先前獨立90精確key證據仍有效 |
| 本輪獨立重跑大index／全assembly／collector | no | 依工單只跑小fixture；由root跑正式版 |
| 舊1848／56歷史報告等同本版green | no | 沒改舊檔，也不把它當本版驗證輸出 |
| full method／R0／全gate／發布通過 | no | scoped index／plan-only，原flags與缺口不清 |

19測試的命令為：

```text
node --test holiday-lab/tests/finite-visibility-scope.test.cjs holiday-lab/tests/layout-static-proof-contexts.test.cjs holiday-lab/tests/semester-session-evidence.test.cjs holiday-lab/tests/finite-visibility-integration.test.cjs
```

修後core SHA、測試SHA、紅綠exit code在regression-verification.json。正式大index若是修前載入的程序，其run缺新bind欄位，不能直接拿舊輸出當新schema；root另做明示來源與一致性核對的新bound copy，本審查沒有重啟或混用兩份大程序。

僅本independent-review及授權新test有寫入；未stage／commit／push／main／刪檔。資料仍是技術scope驗證，不代替使用者視覺確認。
