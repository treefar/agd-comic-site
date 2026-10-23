# 20筆日文窗口名稱精確套用

2026-10-23，獨立worktree `C:/agywork/agd-ja-guide-terms`、分支`codex/ja-guide-terms`，固定基準`94ed07e7ce456cbbd48f025a9a44660ab8780bbc`。

只套用已審閱20筆候選：原文明指「註冊課務組」，日文原有登録・履修課／登録・教務組／学籍・教務担当，一致改為「註冊課務組（学籍・履修担当）」。保留各完整句的原程序、期限、分機、條件、承辦內容；不改任意教務處概念，也不改派業務。

|檔案|改動值數|
|---|---:|
|data/ja/messages.json|8|
|data/ja/step-details.json|4|
|data/ja/editorial.json|2|
|data/ja/flow-ui.json|6|

候選完整key／原文／old／new與來源鏈保存在`plan.json`。工具先重建真build優先序messages→ui→step-details→editorial→flow-ui，逐條確認winning source與固定基準old。全部前置檢查通過後才精確替換serialized property；保留JSON排版與其餘值。可重跑驗證固定commit，不依賴會隨提交改動的HEAD。

## 實際指令與輸出

```powershell
node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs --expect-before
# BEFORE: 0/20 changed; rows20 yes; winning sources20 yes; all other JSON values and keys unchanged; ui unchanged
# exit0，before-output.txt／before.json
node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs
# 未套用狀態預期失敗：AssertionError exact expected number of changed values，0 !== 20
# exit1，unapplied-check-output.txt（不是產品測試失敗）
node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs --apply
# WROTE exact20 property values across4 JSON files; existing formatting preserved.
# APPLIED: 20/20 changed; rows20 yes; winning sources20 yes; all other JSON values and keys unchanged; ui unchanged
# exit0，apply-output.txt
node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs
# APPLIED: 20/20 changed; rows20 yes; winning sources20 yes; all other JSON values and keys unchanged; ui unchanged
# exit0，verify-output.txt／verification.json
node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs --apply
# APPLIED:20/20… ; Already applied; no writes.
# exit0，idempotent-output.txt
node holiday-lab/translation-review/ja-guide-terms-applied/report.cjs
# 20值、4檔；其他key/value與locale/build/canonical來源未改
# exit0，report-output.txt／summary.json／ACCEPTANCE.md
git diff --stat
# 4 files changed, 20 insertions(+), 20 deletions(-)
git diff --check
# exit0，無輸出
```

完整20列逐條yes/no在`ACCEPTANCE.md`，逐列機器結果及SHA在`verification.json`；無手填驗收數。

|整體驗收|yes/no|
|---|---|
|精確20值對固定old→new，生效來源逐筆核對|yes，verification.json 20列|
|其餘四檔JSON鍵、鍵序、所有非目標值不變|yes，完整深比與目標白名單|
|ui.json不變|yes，完整深比|
|locale-ja.js、buildscript、中文師資與指南資料不變|yes，對固定commit逐字比對，僅正規化CRLF/LF|
|再次套用不重寫產品|yes，Already applied; no writes.|
|Build／DOM／長窗口名版面已驗|no，依主控工單保留合併後統一建置與DOM；不以來源檢查代替畫面驗收|
|全面測試／另啟server|no，L0文案，不跑全面測試也未啟服務|
|修改styles／遊戲／其他代理檔案／push／main／刪檔|no|

這是名稱一致性修正，不是最新處室業務分工或招生程序重新認證；原期限、電話與適用條件皆保留原始資料。主控合併後產生locale並驗證實際長標換行，之後才判畫面完成。
