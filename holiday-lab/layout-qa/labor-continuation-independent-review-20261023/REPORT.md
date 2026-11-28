# 勞動continuation獨立離線複驗

2026-10-23。r2工具離線複驗通過；新2453個target尚未採集，沒有批准或啟動continuation。`global_ui_pass=false`、`full_project_approved=false`。

## 原三個負例與修後結果

| 情境 | 舊實際結果 | r2獨立複驗 |
|---|---|---|
| 全target資料完整，但completion缺失 | complete:true | domain_complete=true；run_complete／complete=false |
| 全target資料完整，最後global source失敗且failure存在 | complete:true，failure未露出 | domain可完整；run_status=failed、complete=false，terminal_failure原值保留 |
| 第一個新attempt unknown、未credited | total_historical_attempts=332 | 332＋新1＝333；attempted=true、validly recollected=false |

舊負例保留於`terminal-negative-v1.json`與原樣來源`continue-source-v1.cjs.txt`，SHA `acccb72cf1a70b4f07897e054d0f0686eeed1e4050ae2400f4c3d1a28a844fb1`。舊腳本exit1是真負例，重跑它仍應是紅，不能改舊快照洗成綠。

修後不是只測摘要helper：`terminal-final.test.cjs`抽取**現行原封不動verifyUnion／reconcile／terminalState函式**，以離線store/context/terminal fixtures直接重播缺completion、final-source failure、unknown first attempt、cleanup failure與完整成功五種情境。每份函式來源範圍與SHA在`terminal-final-receipt.json`；I/O與原生資料是明標stub，不是假原生run。

## 最終來源與集合

- r2 freeze：`labor-finite-native/continuation-20261023/continuation-freeze-r2.json`，SHA `c1b4937e2ace9504ed537cee973a387051227688d43944dd03791cf0a453ac07`。
- plan原bytes SHA：`7460aa03682c3bcdf855fc00deb6034d8f2845d5edf3946cf6dcc1aa8fb9edef`。
- 親跑`continue.frozen()`，只讀重核原full／engine綁定、原332attempt chain與3650項舊evidence refs；舊last hash仍`e6584a44e16c3eee86fc9b4e01c95f38f3367d08a98cc784f14011eeadf2b22b`。
- 331筆成功prefix保留；原seq331失敗仍是額外歷史attempt，無PNG，不計成功。新plan精確為原full從index331起的2453筆suffix，順序與target深比相同，沒有與331prefix重疊，union為2784。
- continuation scope／新freeze／plan／base snapshot與明示seq331 recollection均必須重新批准；舊full scope拒絕。首版未批准freeze保留，現行程式只用r2。
- 最終method SHA與大小在`final-review.json`，包含attempt／cleanup／continue／作者test；審查前後freeze不變。

## 故障與時序

| 義務 | 實測結果 |
|---|---|
| per-target不新增兩輪HTTP | wrapper只保存原`data.case.source_before/after`與provenance；獨立故障測試將global.fetch換成拒絕counter，完整raw／partial／native error／halfwrite四路均counter0。 |
| 完整native return後置故障 | 原case/sample/PNG逐值／bytes保存；context source_complete=false，不能因engine domain valid便credit。 |
| partial return或ECONNRESET | partial case與PNG原bytes可保存；原cause／stack／stage保留。內部source stage未知就寫unknown，不冒認before-source；沒有domain credit。 |
| halfwrite | 原PNG與已寫sample保留；store.verify拒絕未完attempt／orphan資料，不能credit。 |
| context end完整性 | 每個receipt連結prev-context SHA、end SHA與engine checkpoint；獨立篡改本測試fixture的end立即被拒絕。 |
| final-source／cleanup／completion順序 | 現行execute原函式離線抽取驗證：final-source→native-close成功、immutable cleanup receipt→completion。 |
| cleanup拒絕／completion寫入拒絕 | 都不產有效completion，failure保存對應stage；close只呼叫一次。final-source主錯誤再遇cleanup錯誤時，主failure不被替換。 |
| 沒有cleanup成功收據 | 即使domain完整，有completion也會拒絕；不把finally的close失敗漏在completed之外。 |

`execute-flow.test.cjs`保留現行execute精確來源與五種離線control-flow測試收據（`execute-flow-receipt.json`）。假native只為注入close/capture返回；沒有載入或啟動真native模組。儲存格式測試使用原seq0資料的唯讀副本，僅作故障fixture，**沒有把它列成新suffix見證**。

## 實際命令與結果

```text
node --test holiday-lab/layout-qa/labor-continuation-independent-review-20261023/independent.test.cjs holiday-lab/layout-qa/labor-continuation-independent-review-20261023/execute-flow.test.cjs holiday-lab/layout-qa/labor-continuation-independent-review-20261023/terminal-final.test.cjs
tests6，pass6，fail0，exit0

node holiday-lab/layout-qa/labor-continuation-independent-review-20261023/verify-review.cjs
pass=true，immutable_prefix331，new_planned_suffix2453，union_plan2784
old_attempts332，old_evidence_refs3650，HTTP_calls0
native_module_loaded=false，new_continuation_run_present=false，exit0
```

stdout在`final-tests.txt`，只讀方法／原資料核對結果在`final-review.json`。`verify-review.cjs`禁止fetch，且確認真native模組在require.cache始終不存在；不呼叫prepare／preflight／execute。

## 尚未驗證與批准邊界

本次只證明凍結工具、原成功prefix與規劃suffix、離線故障路徑；沒有證明新2453份原生結果已存在，沒有新live HTTP／font／source前後收據，沒有真browser cleanup或完整continuation integration結果。若原生執行時遇到新故障仍須停下，不能自動重試／skip／resume。

離線核對沒有發現本次三項負例在r2仍未修復的阻擋；此結論不能取代root審碼及明示新scope批准。沒有修改作者檔案／產品／舊full evidence，全部獨立測試與收據只寫本目錄，未stage／commit／push／delete。
