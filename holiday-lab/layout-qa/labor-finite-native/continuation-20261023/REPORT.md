# 勞動獨立續接 r2：離線工具交付，待主控審碼批准

2026-10-23。`continue.cjs`、`attempt.cjs`、`cleanup.cjs` 與故障測試已落地；r2 freeze／唯讀完整前綴重驗／live source-font preflight 完成。**新增 native 0，沒有新 approval，`continuation-attempt/` 不存在。** 原 full folder、freeze、332筆attempt、331筆有效資料及原失敗均未修改。

## 固定續接義務，不重開2784

- 原完整plan：2784 targets／2754 context-jobs。前綴精確原plan `[0..330]` 共331筆，逐筆重驗原完整case/sample/nodes/blockers/inputs／九checks／flags／PNG／inventory/hashchain，均domain有效且原pass331。
- 原seq331為額外歷史失敗attempt：`labor/zh/320x900/output-3-2/output:labor-start-3`。原record只留 `accepted:false / capture_error:"TypeError: fetch failed"`，沒有PNG。**原始source步驟位置、完整cause／stack未知，不補猜。**
- 新scope只含原plan `[331..2783]` 精確2453 targets／2428 distinct context-jobs；第一筆明列 `is_retry:true`、`original_seq:331`，是重新核准的失敗義務重採。原前331筆不再native。
- 最後union按原完整plan逐筆比對331有效prefix與2453有效新targets，無缺漏、重複或跳序才domain_complete。原seq331失敗保留，故若新2453全部成功，總歷史attempt為2785，不能把原失敗刪掉湊成2784。

## r2實作與失敗保全

原 source/font/runtime/dependency binding、正常v4 native、原strict guard/store全部只讀重用。新suffix使用獨立fresh container、獨立owner／lease、immutableattempt與全case/sample/PNG、inventory/checkpoint/hashchain；沒有重開舊run、偷接舊owner、limit、skip、watcher、自動retry或resume入口。任何target／完整性失敗保留後停止。

每筆另有新範圍context receipts：

1. start保存新seq／原plan index／完整target／首筆明列重採。
2. 正常native回傳完整資料後，**實讀原** `data.case.source_before`／`source_after` 保存provenance、原值與hash references。沒有額外兩輪per-target HTTP；原native內部原本的before/after來源檢查保持原樣。
3. native-return receipt綁原完整case、sample與PNG SHA／bytes；原資料原樣交strict store保存，沒有為放metadata改寫原case。
4. end與immutable receipt鏈綁start／來源／return refs、engine checkpoint、上一context receipt SHA。唯讀verifier重新讀原資料重算guard，再獨立核context的原source值、原payload/PNG SHA與鏈結。

若capture拋錯，保存實際Error的name/message/stack、cause的code/errno/syscall等可取得欄位；沿舊native無法知道內部before-source或after-source位置時，stage明列 `native.capture: internal source stage unknown`。新native-create錯誤可明列native-create。這些是新attempt的診斷，沒有替原seq331補造欄位。

若native已回傳完整case/sample/PNG、之後context寫入或驗證失敗，仍保存完整原資料；該context不計credit。若只回傳部分物件，另存partial receipt／可取得欄位及PNG bytes，engine保存capture_error，不冒稱完整native pass。half-write、未完成attempt／context、孤兒資料或receipt變動一律拒收，不自動修補。

## domain與整輪終態分開

`verifyUnion()`預設與CLI均明列：

- `domain_complete`：331有效原prefix與新2453有效原target、source context全部完成。
- `run_complete / complete`：還須最後真live source/font驗證、native關閉成功的immutable cleanup receipt，以及唯一成功completion record；任何terminal failure均為false。
- `terminal_failure`、`new_failed_context`、`cleanup`：保留失敗與未知，不隱藏。`total_historical_attempts = 332 + new_attempts`，包含新失敗attempt。
- 原case.pass、原flags／globalfalse與target-domain有效性分開；`global_ui_pass:false`、`full_project_approved:false`不會因union完成轉true。

r2修掉獨立審查提出的cleanup終態缺口：成功路徑固定 **final-source → native-close（保存cleanup.json）→ completion**。close拒絕會保存cause/stack／failure，不建立completion；primary failure與cleanup同時失敗時各自保存，close只嘗試一次，不以清理錯誤覆蓋原始失敗。

## 實際離線命令與輸出

| 命令／項目 | 真結果 | stdout |
| --- | --- | --- |
| 首次test（工具尚未存在） | 缺continue.cjs，exit1 | `red-output.txt` |
| r2 `node --test continuation.test.cjs` | 7 tests／7 pass／0 fail，exit0 | `tests-r2-output.txt` |
| r2 `node continue.cjs --prepare` | 原332attempt／331prefix全payload/PNG重驗、原writer PID確定absent、live source/font receipts吻合，exit0 | `prepare-r2-output.txt` |
| `node continue.cjs --execute`（無approval） | native載入前拒絕，exit1 | `no-approval-r2-output.txt` |
| `node continue.cjs --preflight` | r2方法／完整原證據／source/font/runtime/deps／原writer absence再驗，exit0 | `preflight-r2-output.txt` |

7 tests涵蓋精確suffix／完整union、missing/duplicate/未知或無context不得計credit、原失敗歷史不可消失、terminal final-source失敗不可稱run完成、額外失敗attempt計數、fake native.close拒絕／只一次、完整returned資料後置故障仍全存、partial return、ECONNRESET cause/unknown stage、half-write、新批准守門。wrapper故障測試以全域fetch counter證明額外HTTP為0。fake process probe與fake close僅為工程測試，沒有冒充新原生證據。

這些測試使用少量原有效資料副本，僅落本目錄test-evidence；原331筆驗證是唯讀，不是重新操作／重採331筆。

## 新freeze與scope

唯一可供r2審碼的freeze：

```text
continuation-freeze-r2.json
c1b4937e2ace9504ed537cee973a387051227688d43944dd03791cf0a453ac07

continuation-plan.json
7460aa03682c3bcdf855fc00deb6034d8f2845d5edf3946cf6dcc1aa8fb9edef

base_snapshot_sha256
3ece6d2bf7a08082c3631dabc2bf44108b592bfa17bd55d6bd1857bcec08e8d5

scope
labor-explicit-continuation-original331-prefix-new2453-20261023
```

freeze綁新四份CJS、完整原source/font/runtime/dependency binding、原freeze與plan、331有效prefix及原失敗完整3650份檔案／inventory references、原last hash、原失敗本體、精確suffix計畫與明列重採義務。每次preflight/union重新讀原檔、以原strict store驗全部原payload/PNG，不只信摘要。

首版 `continuation-freeze.json` SHA `76d1f950a26f7cfc84e0a50e6c6eb6602ca3919e3549124b7ecaf7bf76789962` **已被r2取代、不可批准**，保留不覆寫；它沒有收到approval或執行。r2明綁它的SHA與取代理由。

主控審碼接受後才可另建批准檔；本輪沒有寫以下實檔：

```json
{
  "approved": true,
  "scope": "labor-explicit-continuation-original331-prefix-new2453-20261023",
  "freeze_sha256": "c1b4937e2ace9504ed537cee973a387051227688d43944dd03791cf0a453ac07",
  "plan_file_sha256": "7460aa03682c3bcdf855fc00deb6034d8f2845d5edf3946cf6dcc1aa8fb9edef",
  "base_snapshot_sha256": "3ece6d2bf7a08082c3631dabc2bf44108b592bfa17bd55d6bd1857bcec08e8d5",
  "prefix_count": 331,
  "new_target_count": 2453,
  "full_union_target_count": 2784,
  "explicit_recollection": {
    "original_seq": 331,
    "target_id": "labor/zh/320x900/output-3-2/output:labor-start-3",
    "approved": true
  }
}
```

```text
node continue.cjs --preflight
node continue.cjs --execute <新continuation專用批准檔.json>
node continue.cjs --verify
```

尚未執行新native／2453suffix／新union實際全域採集；原因是本輪僅工具準備，必須先交主控審碼與新scope批准。沒有承諾HTTP暫態錯誤不再發生，也沒有加入自動retry掩蓋失敗。原產品、原full folder與freeze、國慶暫存scope、sampler/map/contract/coverage均保持原狀，未stage／commit／push／刪檔。
