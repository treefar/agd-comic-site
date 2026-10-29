# 官網師資頁 vs 本機 faculty.json 差異（2026-10-29）

- 官網專任教師 13 位，個人頁全部找到並讀取；官網頁底標「資料來源：動遊系首頁（更新日期 2026-10-06）」，內容已由本機資料回寫，不是獨立來源，舊版原文已不在公開頁上。
- 比對方式：每筆欄位去空白、統一破折號後雜湊比對。官網沒有研究計畫、產學合作段落。
- 讀取方式：curl／WebFetch 遇 AWS WAF 驗證頁，改用瀏覽器正常載入。

| 老師 | 狀態 | 官網有本機無 | 類別 | 矛盾 |
|---|---|---|---|---|
| 鄧樹遠（tengshuyuan） | ok | 1 | other | role：本機「系主任 · 副教授」／官網「系主任 · 副教授 · 電競娛樂系代理主任」 |
| 江雅媚（chiangyamei） | ok | 0 | — | 無 |
| 陳重光（chenchungkuang） | ok | 0 | — | 無 |
| 楊智彰（yangchihchang） | ok | 0 | — | 無 |
| 陳慶鴻（chenchinghung） | ok | 0 | — | 無 |
| 張純雅（changchunya） | ok | 0 | — | 無 |
| 邱士展（chiushinchan） | ok | 0 | — | 無 |
| 陳美蓉（chenmeijung） | ok | 0 | — | 無 |
| 吳焉昇（wuyenshen） | ok | 0 | — | 無 |
| 王宗立（wangtsungli） | ok | 0 | — | 無 |
| 陳寀瑜（chentsaiyu） | ok | 0 | — | 無 |
| 蔣天華（chiangtienhua） | ok | 0 | — | 無 |
| 尹立（yinli） | ok | 0 | — | 無 |

補充：陳慶鴻未比 achievements（依指示）；本機目前比官網多 11 筆。陳美蓉的 books 只有本機有。
