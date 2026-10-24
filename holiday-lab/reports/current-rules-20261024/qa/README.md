# 新版有限驗收方法（03版已完成）

最後通過：8879／.measure-current-rules-20261024-03，raw-r3。6組144條，47source／360build前後穩定，詳REPORT.md與verification.json。原raw-r1來源SHA失敗及raw-r2真綠保留，不混作03版。

只接受主控通知的新建置與新base；check.cjs硬拒8873／8876舊網址。僅zh/en/ja×390/1440六組、首頁導覽與指南，不開遊戲、外部來源、不登入。所有畫面直接存WebP。

計數從執行當時新guide.json讀取，保留15卡、47步不變，FAQ按資料重算，不寫死34／37。請假／英文／證照／專題／升學的摘要、步驟小說明、提醒、FAQ、flow note以當時生成locale定義逐值對比真DOM；03版將15卡實際引用59個來源的標題與readability納入，三語均有映射且可見。來源URL核對原href，不代學生送件。首頁只查13教師卡數，原照快取逐SHA沿用，不重拍78照或重新下載人像。

源碼與data全JSON逐SHA前後守門，新frozen build全部檔案逐SHA，HTTP index/code/guide body綁同包。不將資料夾名或HTTP200當新版內容。console error/pageerror/HTTP>=400、橫溢位、字型載入、replacement文字及誤載節日請求都保留。

執行方式（待主控提供）：

```text
node holiday-lab/reports/current-rules-20261024/qa/check.cjs http://127.0.0.1:NEW_PORT/ .measure-NEW_BUILD fresh-tag
```

準備階段曾只跑node --check，不曾對舊8876包宣告新版通過；之後依新build通知才執行r1／r2／r3。實體裝置、逐glyph及全站所有頁面不是本短測範圍。
