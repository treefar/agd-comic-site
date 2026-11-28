# 清明v3：完整診斷收據與精確favicon分域

2026-10-23。只交離線工具、測試與唯讀核驗；新native未啟動、沒有approved=true。原v2所有方法/runtime/inputs/freeze/run未改。原root-pilot-01仍failed，6份zh320 targetpass/geometry0不構成整run通過，缺失的location/source_after沒有回填。

## YES／NO

| 驗收項目 | YES/NO | 實際證據 |
| --- | --- | --- |
| 新隔離scope與方法freeze | YES | scope=`qingming-native-v3-favicon-scoped-pilot-v1`；method-freeze.json；36files/28bindings |
| Console原location與Network完整raw request/response/finish/failure保存工具 | YES，工具層 | 新session增加完整原事件；尚未執行新native |
| favicon精確分類，不洗原flags | YES，工具層 | 只有exact URL＋404＋Other＋同requestId request/response＋原Console文字/location可列non-target；raw與投影需一致 |
| 遊戲資源404／未知error仍stop | YES，工具層 | Console/page/HTTP/Network反例、missing location/raw、錯status/type/URL/id皆拒；每UI action及case前後合作式檢查 |
| 原nodes/fonts/PNG/source/font/chain檢查保留 | YES，原碼相同 | payload-compatibility.json核6個helper逐函式SHA一致；完整case、sample、PNG及原flags保留 |
| 不縮pilot或後續域 | YES | 6context/36PNG、1278 direct、2520 stepper、1392後續配置；full仍拒絕 |
| 舊v2與舊失敗未變 | YES | verify-prepared.cjs實跑exit0；原失敗缺raw診斷欄位不能轉成scoped pass |
| 新原生先導已通過 | NO | 沒有native-runs，沒有啟動browser/native/HTTP |
| 完整新run verifier已對原生run實跑 | NO | 工具與helper故障測試完成，但沒有獲准的新run可驗 |
| error-longest六canonical／整包UI／global通過 | NO | 所有global_method_clear/full_project_approved=false，未promote或改索引 |

規則來源是主控另次fresh-navigation原收據，完整byte copy在favicon-diagnostic-source.json，其SHA與來源路徑綁在V2-INHERITANCE.json／diagnostic-contract.json。這是新的診斷事實，不是原root-pilot-01缺欄位的替代品。

## 凍結方法

method-freeze.json SHA：`336801bea732063145909c7f22156e203e84fb99ab6fbceca809808a31297cee`。

- native-run.cjs：`6f52c3ca53595bee8375c6e9709d57b7c9d675df689e444c36c54acd8309b2b0`
- native-tools.cjs：`3855b30ae1b3ce5be80dee6edf1c55ae442262a1bff88833d3e638d48d15401a`
- diagnostics.cjs：`5d46ab15b5828ac9fa4f9af196d3cc893e8a93e545d32f6afdae2a626889eb72`
- verify-native-run.cjs：`5887b943db138d65e8eaf1761833cc60d36478d36004e9982b4913e56d633fc9`

runtime-identifiers-v4.json沿用原實檔快照：Node/Chromium/Playwright/sharp版本與SHA、11遞迴package322檔、Chromium308檔、原生binary、geometry policy等都保留。沒有以修favicon為由換runtime或修改server資源。

## 實際執行

工作根目錄 `C:/agywork/agd-holiday-prototypes`。

```text
node --test holiday-lab/layout-qa/qingming-native-v3-20261023/domain.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/recover.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/text-projection.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/native-tools.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/verify-native-run.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/diagnostics.test.cjs holiday-lab/layout-qa/qingming-native-v3-20261023/scope-tools.test.cjs
tests27 pass27 fail0 exit0
```

完整stdout：test-final.txt。

```text
node holiday-lab/layout-qa/qingming-native-v3-20261023/verify-prepared.cjs
QINGMING_V3_PREPARATION {"scope":"qingming-native-v3-favicon-scoped-pilot-v1","methods":36,"bindings":28,"pilot_contexts":6,"pilot_cases":36,"full_plan":1392,"old_failure_still_failed":true,"original_v2_unchanged":true,"native_started":false,"global_method_clear":false,"full_project_approved":false}
exit0
```

完整stdout：verify-prepared-output.txt。native-run.cjs與verify-native-run.cjs另經node --check，均exit0。

TDD原始紅燈保留於diagnostics-red.txt、diagnostic-prefix-red.txt、scope-tools-red.txt。legacy-approval-injection-red.txt是在新測試process只替新模組注入舊approval函式，真exit1抓到舊函式未查新scope/上限；原v2檔案沒有改，恢復新函式後測試綠。單元測試使用明確fixture，沒有把fixture稱成新原生證據。

## 新run唯讀核驗

verify-native-run.cjs保留原完整PNG真解碼、全部nodes/blockers/原flags、CDP DOM/font mapping、每筆source/font before-after、事件/校準/PNG/case/sample SHA鏈及source時序檢查。另新增：

- exact新scope、root-v3-*、6context/36cases與1392域守門；舊scope、full、縮域都拒絕。
- 重算完整session診斷分類；未知error即拒；原console_errors/http_errors/page_errors不可刪改。
- 重算case診斷prefix SHA，原Console/Network/pageerror原資料與case/checkpoint chain繫結。
- context關閉後再記完整session與診斷；晚到unknown error也失敗。
- 有failure.json、少sample/PNG/checkpoint／來源末收據或任何不完整義務，都不會當成功。

原始sample有flags時仍由相同N.target守門；original_flags_empty=false會保留原case/sample/PNG/checkpoint後停止。favicon分域不能把sampler flags改成空，也不會把global設成true。

## 未執行與下一步

未執行：新native/browser、HTTP、完整原生run verifier、網站Build／發布／stage／commit／push／main／delete。原因：主控只授權工具準備；產品未修改，沒有新run。

root先核method-freeze與方法、故障stdout及verify-prepared結果，必要時安排獨立審查。只有root明確核准新scope的fresh pilot後才可啟唯一新run；approval-template.json刻意approved=false。本輪沒有執行native-run。

中秋canonical審查因本任務轉向而停在已讀發現；已存mid-autumn-canonical-review-20261023/CHECKPOINT.md，尚未建立其離線面積/Pareto檢查或typed adapter，不把規畫列完成。

下一輪建議：GPT-6.1-sol／high；先審新scope診斷工具與負例，再由主控決定唯一新先導，保留原失敗。
