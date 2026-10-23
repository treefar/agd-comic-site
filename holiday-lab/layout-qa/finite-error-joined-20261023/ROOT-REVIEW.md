# 主控獨立驗證

2026-10-23，source_agent: codex。實讀source-trace.cjs、candidates.cjs、catalog/guards、joined-verification與12個面積值；主控先指出選取新60子集未設完整domain最大面積assert的缺口。逐context核對12/12數值確實與完整finite ctx.extrema.area.value相等，代理補守門與較小真safe refusal負例，未覆寫原candidate。

主控實際執行：

```text
node candidates.cjs --verify
# 在本資料夾；exit0，pass true，candidates12
# proof_scope normal-ui-reachable-finite-error-and-secondary-literals-only
# numeric_domain_proven false；full_project_approved false

node --test holiday-lab/layout-qa/finite-error-joined-20261023/trace.test.cjs holiday-lab/layout-qa/finite-error-joined-20261023/geometry.test.cjs holiday-lab/layout-qa/finite-error-joined-20261023/candidates.test.cjs holiday-lab/layout-qa/finite-error-joined-20261023/max-area.test.cjs
# repo root，exit0
ℹ tests 16
ℹ pass 16
ℹ fail 0
```

12份typed candidates可供索引整合；本輪未接入coverage或assembly，因此當前權威覆蓋仍1914/2076。原static5 NO、完整nodes/blockers、原method flags及缺直接DOM inputs的限制保留；derived trace不改寫成原case的inputs，也不把join-time collector指紋說成原runtime receipt。全案數值域、正式UI gate與使用者美術確認未通過。
