# faculty-punctuation

日期：2026-10-21（目錄依工單用 20261022）。

只將 data/en/faculty.json 的 $[9].certs 四個英文逗號改回原文頓號。既有拼字與證照原值完整保留。

分支：codex/faculty-punctuation；基準：e492e58。

| 驗收 | yes／no | 證據 |
|---|---|---|
| 八檔全部 PASS | yes | validate-en 修前 faculty FAIL 1，修後8/8 PASS |
| 只改 $[9].certs 標點 | yes | 下列diff一行，四個頓號 |
| 範圍 | yes | 只有指定資料檔與報告；未改驗證器 |

## 實際指令輸出

```text
> node tools/validate-en.mjs
admission.json	PASS	[CHECK]=0
curriculum.json	PASS	[CHECK]=0
faculty.json	FAIL 1	[CHECK]=200
   - 純英文原值被改 $[9].certs
labs.json	PASS	[CHECK]=0
news.json	PASS	[CHECK]=37
stats.json	PASS	[CHECK]=265
videos.json	PASS	[CHECK]=0
works.json	PASS	[CHECK]=16

exit=1

> git diff -- data/en/faculty.json
diff --git a/data/en/faculty.json b/data/en/faculty.json
index 6f6fc24..bb81851 100644
--- a/data/en/faculty.json
+++ b/data/en/faculty.json
@@ -524,7 +524,7 @@
       }
     ],
     "education": "Ph.D., Institute of Manufacturing Engineering, National Cheng Kung University (Obtained in 2003)",
-    "certs": "Advanced Professional Certificate-Professional Manager, Adobe Certified Associate in Web Communication Dreamweaver CS3, Microsoft Technology Associate: Database Adminstration Fundmentals, Microsoft Technology Associate: Windows Operationg System Fundamentals, Microsoft Technology Associate: Security Fundamentals"
+    "certs": "Advanced Professional Certificate-Professional Manager、Adobe Certified Associate in Web Communication Dreamweaver CS3、Microsoft Technology Associate: Database Adminstration Fundmentals、Microsoft Technology Associate: Windows Operationg System Fundamentals、Microsoft Technology Associate: Security Fundamentals"
   },
   {
     "id": 1571,

exit=0

> node tools/validate-en.mjs
admission.json	PASS	[CHECK]=0
curriculum.json	PASS	[CHECK]=0
faculty.json	PASS	[CHECK]=200
labs.json	PASS	[CHECK]=0
news.json	PASS	[CHECK]=37
stats.json	PASS	[CHECK]=265
videos.json	PASS	[CHECK]=0
works.json	PASS	[CHECK]=16

exit=0

> git diff --stat e492e58
 data/en/faculty.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

exit=0
```
