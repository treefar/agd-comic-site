# 日英審校第二批：本機套用紀錄

2026-10-22；source_agent: codex。只在 codex/holiday-prototypes，未 push、未發布、未碰 main、未刪檔。

| 驗收 | yes／no | 實際結果 |
|---|---|---|
| 首批職級與聘任關係審核可回查 | yes | ../REPORT.md、faculty-roles.json；助理教授→助教，副教授→准教授。逐人核對13位，不把合聘／從聘直接當兼任。 |
| 第二批78操作已套用 | yes | `node holiday-lab/translation-review/followup/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --apply` → exit 0，operations 78、product_files_written 9；applied-root.json。 |
| 套用前逐項舊值檢查及並行修改保護 | yes | dry-run 78 operations、0 writes；apply前再次比對九檔。pages.jsx既有導引修正保留。 |
| 已套用後可回歸測試 | yes | `node --test holiday-lab/translation-review/followup/apply-safe.test.mjs tests/admission-guide-eligibility.test.cjs tests/layout-gate-entrypoints.test.cjs` → exit 0，16 pass、0 fail；root-retest.txt。原fixture依賴工作樹造成9 fail的實際紅燈保留，改固定Git基準後重跑。 |
| 本機測量Build | yes | `node holiday-lab/build-review.mjs .measure-layout-02 --measurement` → exit 0，356 runtime files、2314英譯／2343日譯。既有duplicate color警告2筆；21 unpaired paths均在stats獎項群組，未冒稱全部配對完成。 |
| 本批語義覆蓋有明確界線 | yes | 首頁3單位＋FAQ12單位，共54個日英字串；9保留、6修正。不是全站2314字串皆審過。 |
| 新字串缺字、窄版、全遊戲回放已驗完 | no | 本輪只完成來源、規則與測量Build。完整新版文字安全區矩陣尚缺，測量Build不得打包交付。 |
| 全站長文審校完成 | no | 尚有18組FAQ、其餘新聞／教師履歷／作品等。另發現甄選適用對象原文仍過度限於應屆，須按當年簡章逐類核對後再同步三語。 |

三個已修原文問題：115甄選最多六校系；技優甄審不只限競賽獲獎應屆生；115科技繁星錄取生即使放棄，也不得參加當年度四技二專甄選。來源與三語逐筆提案見 REPORT.md／exact-plan.json。未改名額、日期或費用。

目前供使用者審閱的8800仍是 `.review-local-09`，既有ZIP不變；本批尚未替換穩定試玩版。下一步先完成招生實際操作、改譯後字型與窄版，再處理剩餘FAQ；新遊戲與文字安全區驗證另依 layout-qa/REPORT.md 接續。
