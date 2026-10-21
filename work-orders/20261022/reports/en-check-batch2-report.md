# en-check-batch2

日期：2026-10-21（目錄依工單用 20261022）。

第二批完整查六個指定名稱；修正54個字串，CHECK由518降至510。西基原值已正確；ZIP-LAB原值保持且記來源可讀性限制。Hautecouture改用能對上松山與樹德合作的真正官網。分支承接5bb779b，與基準的異動不含前一項標點修復。

分支：codex/en-check-batch2；基準：5bb779b3a6d6b2668de8c5592160a116b4d37e98。

| 驗收 | yes／no | 證據 |
|---|---|---|
| 八檔validate-en全PASS | yes | 見實際8/8輸出 |
| 採用對照每列可開啟官方來源 | yes | 4筆採用來源均web.open取得正文／PDF；詳batch2證據；ZIP未採用 |
| CHECK下降數＝對照移除合計 | yes | 518→510，下降8＝逐筆表合計8 |
| 只改字串值 | yes | 驗證器＋precise-plan-check 54筆；中文括號原文與結構不變 |
| 相關測試全過／白名單內 | yes | 16/16；四資料檔、對照表、本報告 |

## 實際指令輸出

```text
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

> node tools/validate-en.mjs
admission.json	PASS	[CHECK]=0
curriculum.json	PASS	[CHECK]=0
faculty.json	PASS	[CHECK]=197
labs.json	PASS	[CHECK]=0
news.json	PASS	[CHECK]=37
stats.json	PASS	[CHECK]=262
videos.json	PASS	[CHECK]=0
works.json	PASS	[CHECK]=14

exit=0

> node --test tests/en-play.test.mjs
✔ data/en/faculty.json 與中文版結構一致 (3.7329ms)
✔ data/en/curriculum.json 與中文版結構一致 (1.7699ms)
✔ data/en/labs.json 與中文版結構一致 (1.2621ms)
✔ data/en/works.json 與中文版結構一致 (1.4149ms)
✔ data/en/videos.json 與中文版結構一致 (1.2078ms)
✔ data/en/stats.json 與中文版結構一致 (1.8822ms)
✔ data/en/news.json 與中文版結構一致 (1.9307ms)
✔ data/en/admission.json 與中文版結構一致 (1.5043ms)
✔ play.json 每款遊戲的入口與封面都存在、層級有效 (1.6783ms)
✔ 創作不斷線：碰撞遮罩三段都從起點連到終點 (62.3084ms)
✔ 創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡 (5.2254ms)
✔ bundle.js 已包含英文頁與試玩區 (0.997ms)
✔ 試玩區：五款都有雙語製作與授權欄位 (0.3272ms)
✔ 創作不斷線：調校預設鍵與原值完整 (1.2385ms)
AUTO-PLAY [{"level":1,"state":"won","fails":0},{"level":2,"state":"won","fails":0},{"level":3,"state":"won","fails":0}]
JITTER {"before":{"ink":72,"count":4},"after":{"ink":44,"count":4}}
✔ 創作不斷線：瀏覽器通關、即時調校、持久化與公開版隔離 (1614.1592ms)
✔ 創作不斷線：手感常數不可寫死回遊戲 (0.6678ms)
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1782.0949

exit=0

stats CHECK 265 -> 262
news CHECK 37 -> 37
works CHECK 16 -> 14
faculty CHECK 200 -> 197
CHECK total 518 -> 510; decrease=8; ledger sum=8
precise-plan-check: 54 changed strings; keys/order/arrays/non-strings/parentheses unchanged PASS
> git diff --name-status 5bb779b3a6d6b2668de8c5592160a116b4d37e98
M	data/en/faculty.json
M	data/en/news.json
M	data/en/stats.json
M	data/en/works.json

exit=0

> git add docs/qa/en-check/20261022-batch2.md
warning: in the working copy of 'docs/qa/en-check/20261022-batch2.md', LF will be replaced by CRLF the next time Git touches it

exit=0

> git diff --stat 5bb779b3a6d6b2668de8c5592160a116b4d37e98
 data/en/faculty.json                |  14 ++---
 data/en/news.json                   |  22 ++++----
 data/en/stats.json                  |  66 +++++++++++------------
 data/en/works.json                  |   6 +--
 docs/qa/en-check/20261022-batch2.md | 104 ++++++++++++++++++++++++++++++++++++
 5 files changed, 158 insertions(+), 54 deletions(-)

exit=0
```
