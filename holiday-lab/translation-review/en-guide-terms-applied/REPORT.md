# 英文在校指南：29個精確用詞修正

基底 `94ed07e7ce456cbbd48f025a9a44660ab8780bbc`；獨立 worktree `C:/agywork/agd-en-guide-terms`、分支 `codex/en-guide-terms`。本批按 L0 文案範圍處理。

24處「註冊課務組」統一為 `Registration and Curriculum Division`，3句休學用語改與既有 leave of absence／return to study 一致，4個只有抵免語境的字句使用 credit transfer。31個分類項目有2個重疊段落，已合成同一old/new，所以實際只有29個不同key，沒有先後套用而退回前一修正。

完整每筆key、old、new、群組、字串修改區間、全部來源與實際winning file均在 `exact-plan.json`；不是全域搜尋取代。

|實際產品檔|變更值數|原因|
|---|---:|---|
|data/en/student-guide-ui.json|15|12單位名稱、1休學、2抵免|
|data/en/step-details-ui.json|7|5單位名稱與2休學、2抵免，內含2個跨群組重疊key|
|data/en/editorial.json|1|同一抵免程序段落後層覆蓋step-details，必須改真正winning來源|
|data/en/flow-ui.json|6|流程標籤／說明的真正後層來源|
|合計|29|15＋7＋1＋6|

原工單只列前兩檔。先查真 `scripts/build-translations.cjs` 次序後發現7個winning值不在初始白名單，主控於本輪明確擴授權editorial及flow兩檔後才套用。次序為ui → student-guide → guide-labels → step-details → editorial → flow。被editorial覆蓋的step-details同key舊值保留不改，因為它不是本輪生效值；plan明列兩層來源，沒有假稱改前層就能改畫面。

官方名稱依[教務處服務對象官方索引](https://www.aca.stu.edu.tw/服務對象-services/)與[英文組織頁官方索引](https://www.aca.stu.edu.tw/en/index-2/)支持的Division，查證日期2026-10-23；同頁亦將抵免學分配對Credit Transfer。完整當期官方原頁尚待核，這項來源限制保留於既有專責審校包，未把其他處室Section一律改Division，未新增程序、日期、資格或分機。

## 重疊合成

- 「若涉及抵免或學籍，再請註冊課務組協助確認」同時保留 `credit transfer` 與 `Registration and Curriculum Division`。
- 「說明要休學或復學」同時保留 `take a leave of absence or return to study` 與同一Division名稱。
- 每個群組提案都先比對同一個完整old，再取不重疊字串區間，由後向前一次組成final；任何區間重疊或winning old不符就停止，沒有靠後寫入覆蓋前結果。

## 驗收

|條件|yes/no|實際指令與輸出|
|---|---|---|
|24＋3＋4分類項與29個不同key精確相符|yes|`node holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs --plan` →groupCounts24/3/4、unique_keys29、overlap_keys2、allowed29、blocked_by_scope0。`plan-output.txt`|
|逐筆winning source及完整old核對|yes|`--verify` →all_winning_values_match true；exact-plan保留全部來源及最後winning file，沒有只改被覆蓋的前層。|
|四檔僅29個精確候選改值，其餘全部JSON值相同|yes|`--verify` →all_non_target_values_equal true；固定git show base全JSON重建expected後深比，15/7/1/6。|
|24單位key實際覆蓋次序會生效|yes|`--verify` →active_overlay_simulation.actual_winning_values_checked29、office_division_values24、changed_keys29。這是只讀記憶體合成，不寫locale，也不冒稱完整Build或DOM已跑。|
|免修／抵免同句pending保留|yes|`--verify` →pending_exemption_kept true，原值逐來源不變。|
|機構身份P1、Unity級別、教師與中文資料不動|yes|`--verify` →faculty_and_locale_unchanged true；faculty中英與locale同固定base（EOL正規＋git diff核對）。產品diff只有四個授權EN JSON。|
|locale、JSX、styles、遊戲未改|yes|`git status --short`僅四產品檔＋本報告資料夾；`git diff --stat`四檔29 insertions/29 deletions。|
|程式語法與空白檢查|yes|`node --check holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs`、`git diff --check` →exit0。package沒有lint script。|
|首次apply命令直接成功|no|首次寫入完成後，被禁改檔案CRLF與git show LF比較假紅，exit1；見 `first-attempt.md`。未重套或還原，修正唯讀guard後對同一實際結果verify成功。|
|Build／locale重產／DOM與換行已驗|no|本輪遵工單不Build、不啟server、不寫locale；由主控合併後統一處理。未跑遊戲大測試。|

最後 `--verify` 的完整實際輸出為 `verify-output.txt`，結構收據 `verification.json`，結尾 `pass:true`、`generated_locale_written:false`、`build_run:false`、`dom_verified:false`。所有讀取均從固定base與當前檔案取值，不把代理自述當驗收。

重跑只讀驗證：

```text
node holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs --verify
node --check holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs
git diff --check
```

`--apply`僅接受完整固定base原值；已套用後再次執行會拒絕，以免重覆覆寫。這是多檔preflight與寫前雜湊守門，不宣稱跨檔案系統原子交易。沒有push、main、刪檔、Unity操作。
