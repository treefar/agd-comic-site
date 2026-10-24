# 舊實習兩表內容獨立審查

已精讀正式終版parsed-r2兩份正文、所有非空stories與raw story／tail；正文與首讀版逐位元相同，原DOC SHA吻合。只審內容，不改產品、來源、parser或前輪證據。

## 產業實習認定表

原件SHA：`4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22`。正文144個UTF-16 units／312 bytes。正文第4行標題為「產業實習認定表」。

可讀欄位：學生姓名、班別、學號；實習機構名稱、地址、電話；實習日期起訖；抵免事由、抵免時數；指導老師與系主任欄。全部逐字引文及body行號、raw UTF-16位置在JSON.documents[0].quotes，不將空格或合併儲存格外觀自行補成新欄位。

明寫的要求只有機構名稱旁「（需加蓋公司印章）」（正文第11行）。「指導老師：」「系主任：」在第25行；可確認有這兩欄，沒有文本說明先後簽核、核准生效或全欄必填。未列認列資格、時數上限、抵免算法、送件期限、附件清單與補件程序，均unknown。

## 實習單位評分表

原件SHA：`741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d`。正文502個UTF-16 units／990 bytes。實際原字首行是「樹德科技大學動畫與戲系」，構面是「專業認定能力」；同時見於processed body與raw ccpText，不補成「動畫與遊戲設計系」或「專業認知能力」。

基本欄位為實習生姓名、學號、實習期間起訖、實習機構、部門、單位主管（指導人）及職稱。考核有兩組：主管（指導人）評分與實習指導老師評分。

| 評分者 | 原文字句與所印佔比 | 位置（擷取body行） |
| --- | --- | --- |
| 主管（指導人） | `行政配合與實習態度 / 18%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:12 |
| 主管（指導人） | `實務學習能力 / 16%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:13 |
| 主管（指導人） | `專業認定能力 / 16%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:14 |
| 主管（指導人） | `合計 / 50%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:16 |
| 實習指導老師 | `行政配合與實習態度 / 18%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:22 |
| 實習指導老師 | `實務專業技能 / 16%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:23 |
| 實習指導老師 | `實習報告 / 16%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:24 |
| 實習指導老師 | `合計 / 50%` | holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:26 |

可直接核算兩組各18＋16＋16＝50，所印50＋50＝100；這只是原表佔比的算術核對，不增加評分規則。原表最後的明示式是：

> 主管（指導人）評分_______ + 實習指導老師評分__________共計      分

位置：holiday-lab/reports/legacy-reader-20261024/parsed-r2/evaluation-body.txt:34。未說明各格輸入百分制原始分或已加權分、如何乘權重、四捨五入、最低構面分數或及格門檻，不能再自行補一條乘法公式。

主管與指導老師各有簽章及日期欄（正文第18、28行）。未寫每格必填、缺評處理、交件時限或申覆程序，均unknown。

## 全stories與範圍核對

認定表非空processed stories為body與只有換行的header；評分表為body、只有換行的header及頁尾頁碼1。終版raw非空story各為ccpText與ccpHdd，另各有單一回車tail；註腳、尾註、批註、文字框及頁首文字框均空。非空內容全部已讀，沒有由頁碼或欄位控制碼補造規則。

原始首讀evaluation曾出現declared502／raw520，正式parsed-r2已修range-helper，現在144／144、502／502，全部宣告story範圍吻合，pieces CP吻合。processed正文SHA兩版完全相同，所以前一個helper診斷不能說成parser正文截斷。原資料未回寫，首讀診斷另保留在JSON.first_read_documents。

正式擷取收據：`legacy-reader-20261024/extraction-r3-command.json`；已回讀command／stdout／stderr與exit0，細節及SHA保存在JSON.final_extraction。本次唯讀比對輸出：

```json
{
  "documents": 2,
  "original_SHA_matches": 2,
  "body_same_as_first_read": 2,
  "final_raw_body_units": [
    [
      "recognition",
      144
    ],
    [
      "evaluation",
      502
    ]
  ],
  "technical_checks_yes": 14,
  "technical_checks_no": 0,
  "layout_verified": false,
  "applicable_115": "unknown",
  "product_modified": false
}
```

stderr空，exit0。14項yes是原件、正文與文字範圍核對，不能代替版面或當屆效力。表格邊框／合併格／紙本版面未核；115當屆適用unknown，不把舊表比例、抵免欄位或簽章外觀直接套115。
