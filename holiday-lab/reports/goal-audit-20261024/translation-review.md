# 新增英／日文獨立語意審閱

查核：2026-10-24。已逐筆讀取122個新unique key的實際英文與日文，共244值，及五份已套文案／日文字元更正收據。8881畫面、產品、git與Build皆未操作。

發現2個key需明確化原本動作，共4個英日值有精確最小修正建議；原有1個正式單位英名疑問已由既存官方雙語正文解除，無未決專名；不當功能失敗。其餘已讀日期、否定、資格、審核與個案限制未見具體相反或新增承諾。逐筆原值、輸入SHA、來源收據與審閱標記均在translation-review.json。

| 項目 | 實際值問題 | 最小建議 |
| --- | --- | --- |
| TR01 日文分級免修 | 「クラス分け免除」成了免除分級本身 | 換成「習熟度判定に基づく履修免除」，明確是分級後免修課程 |
| TR02 英文返校報到 | 「complete the required return report」把報到變成一份報告 | 使用「report back to the university」，再獨立交成果；保留依計畫辦理 |

JSON的findings保留兩個key及中文證據，proposed_changes列出4個語言值的精確檔案、RFC6901 pointer及完整before／after。TR01英文同步將placement exemptions改成placement-based course exemptions；TR02日文同步將帰校報告と成果提出改成帰校手続きと成果提出。僅明確化原本動作，不增加親自到場、新時限或新資格，尚未套用。122筆rows各有en_status及ja_status，沒有從單一樣本推估其他項目。

日期已核：115-1及114-1保留台灣學年度／學期，沒有改成日本2026年度前期；11/30 10時至12/7 9時、9/24、9/21、七日含當日、六個月、申訴次日起30日、18–29歲均未反向或移動。民國112／113／114換算為2023／2024／2025的年月日未見錯誤。

義務與否定已核：未開放／已截止、逾期須理由證明核准、收件不等於核准、急難非保證核發、學籍維持、補助不一定免費、一般申訴與性平分流、諮商非前提，以及舊版與當期未核限制均有保留。舊113校級法規未被翻成115本系細則。

正式名稱：既存研究已支持Student Assistance Section對應生輔組，見holiday-lab/translation-review/proper-names-research-20261023/REPORT.md。本次不重做官方調研。PN01已改resolved_existing_evidence：回讀既存教務處英文組織正文及中文組織頁，後者同一link明列「註冊課務組 | Registration and Curriculum Division」。保留既有英名，不從其他單位的Section類推。

名稱逐筆證據：

- [holiday-lab/reports/followup-20261024/contacts/raw/academic-en-dom.txt](https://www.aca.stu.edu.tw/en/index-2/)：第39、45、48行；SHA-256 `dfd01d803393e89bdf339ad0533801345b95bd84ecaf2a68c2452a97049d9011`。
- [holiday-lab/reports/followup-20261024/contacts/raw/aca-organization-dom.txt](https://www.aca.stu.edu.tw/組織簡介｜introduction-2/)：第43行；SHA-256 `84e100d5af8d7840a85a1e7f6a70472d9c77b5d397d3de9fc571358b888574eb`。

學海築夢保留中文，括號作功能說明。文件標題的功能譯文不冒稱官方日文名。此122項沒有新增教師職稱，不外推教師職稱全部再驗。

實際唯讀Node驗證輸出：

```json
{
  "unique_keys": 122,
  "actual_values": 244,
  "structural_checks_yes": 6,
  "structural_checks_no": 0,
  "affected_keys": 2,
  "proposed_language_values": 4,
  "pending_name_evidence": 0,
  "resolved_official_name": 1,
  "product_modified": false
}
```

6項結構核對yes，stderr空、exit code 0，收據亦保存於JSON.execution。這6項不能取代244值的語意審閱；2個key的4值修正提案仍保留，PN01已依實讀雙語證據解除。未執行畫面、手機、Build或遊戲QA，因本組僅做文案獨立檢查。母語真人尚未簽核是審閱限制，不當功能失敗。
