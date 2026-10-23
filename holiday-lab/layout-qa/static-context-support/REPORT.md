# 有限錯誤補證索引的精確context支援

- yes：原兩批12context identity驗證保持通過。
- yes：依verification宣告game，逐一對正式contract.required_cases中的error-longest id/width/height；四遊戲必須正好24context，少一半、重複、錯height或別款game皆拒絕。
- yes：coverage-index其他source/raw/image/finite guard原封保留。
- yes：新增proof必須明示canonical_error_longest_eligible:true且unproven_dynamic_secondary為空，才能計完整契約error-longest；national-day六份固定hint證明只留supplement-only。all_finite_candidates_proven不能略過這個scope條件。
- no：context結構與scope單元測試不等於全部UI通過，仍需完整index實跑；全UI gate仍NO。
- no：未改frozen sampler／安全區／官方report或產品。

實際指令與輸出（exit0）：

```text
node --test holiday-lab/tests/layout-static-proof-contexts.test.cjs
ℹ tests 5
ℹ pass 5
ℹ fail 0

node --check holiday-lab/layout-qa/coverage-index.cjs
（無輸出，exit0）
```

實際三批完整index（exit0）：

```text
LAYOUT_QA_URL=http://127.0.0.1:8845
node holiday-lab/layout-qa/coverage-index.cjs --phase=2026-10-22T23-47-50-142Z --front=2026-10-22T23-48-00-964Z --min140=newyear-min140/runs/2026-10-23T00-05-50-129Z/report.json --static=static-error-max/canonical-candidates.json,static-error-max-2/canonical-candidates.json,static-error-max-3/canonical-candidates.json --out=source-checkpoint-08/coverage-live.json
COVERAGE required=2076 covered=1620 missing=456 geometryErrors=0; PARTIAL_RED
```

42 canonical eligible；national6 supplemental-only且required missing保留。曾產出1584的暫態因未排除national scope而撤回，沒有提交或宣稱通過。
