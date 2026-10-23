# 六筆英文碩士學位：移除無依據細類

已在獨立分支 `codex/faculty-neutral-degrees` 完成六處文案修正。工作樹：`C:/agywork/agd-faculty-degree-copy`；建立來源為主控當時 HEAD `3cd12600626ff0051940158bc322459cea3e9c68`。

六筆英文全部改為一般 `Master's degree`；原學校、研究所／系所、領域及年份逐字保留。沒有等待證書來移除原中文未提供的 MA／MFA／MSc／MDesign，也沒有藉機另猜正式學位名。

|教師|修正前開頭|修正後開頭|原已知內容|
|---|---|---|---|
|張純雅|Master of Arts|Master's degree|視覺傳達設計研究所、雲科大、2006–2008|
|邱士展|Master of Fine Arts|Master's degree|多媒體動畫藝術學系、台藝大、2005–2009|
|陳美蓉|Master of Arts|Master's degree|應用藝術研究所視傳組、交通大學、2000取得|
|吳焉昇|Master of Arts|Master's degree|視傳系碩士班、樹德科大、2011取得|
|蔣天華|Master of Science|Master's degree|資訊管理系、樹德科大、2002取得|
|尹立|Master of Design|Master's degree|設計研究所、台科大、2000取得|

完整六筆中文、英語 before／after、實際 JSON pointer 及覆寫檢查保存於 `exact-six.json`；不是只記上表縮寫。這是消除翻譯多加的細類，不代表重新證明個人學歷取得或學校正式外文名稱。

## 實際核對

已逐一讀六人的 canonical 中文、raw 英文及生效 locale；六筆沒有 ui／editorial／flow 等活躍覆寫，所以只改 `data/en/faculty.json` 六個 `education` 欄。

使用 verify skill 的 L0 文案分級，執行資料與生成路徑核對；沒有把它稱為遊戲測試或全站 Build 通過。

```powershell
cd C:/agywork/agd-faculty-degree-copy
$env:NODE_PATH='C:/agywork/agd-holiday-prototypes/node_modules'
node holiday-lab/translation-review-title-check/neutral-degrees/check.cjs
git diff --check
git diff --numstat -- data/en/faculty.json
```

原始輸出在 `check-output.txt`，結果：

```text
yes exact_six_neutral_degree_changes
yes all_13_faculty_non_target_fields_deep_equal
yes canonical_Chinese_deep_equal_and_text_unchanged
yes no_active_override_six_before_values_match
yes certificates_all_13_unchanged
yes true_generator_exact_six_active_keys
yes all_non_target_generated_keys_unchanged
yes generator_input_SHA_unchanged
yes tracked_product_scope_only_faculty_English
RESULT 9 yes 0 no
6       6       data/en/faculty.json
```

`git diff --check` 無輸出、exit 0。真正的 `scripts/build-translations.cjs` 以虛擬輸出執行，核對生成後恰六個生效英文字串改變，其他字典值與 key 數完整保留；30 個生成輸入前後 SHA 相同。沒有寫出 locale 或 docs/qa 生成檔。

13 位教師完整英文 JSON 深比，除這六個欄位外全部相同；中文全文及各欄位相同，僅對 Git blob／Windows checkout 做 CRLF／LF 正規化後比全文。九筆證照、姓名、職稱、研究／課程及其他資料未動。

## 交付限制

|項目|yes／no|
|---|---|
|六筆文案完成，生成路徑可生效|yes|
|獨立工作樹／分支、範圍限六欄與本報告目錄|yes|
|主控產品或 Build 改動|no|
|locale 生成檔提交|no|
|全站 Build、遊戲、Unity、字型與改後畫面驗收|no；L0，本批無此執行|
|push、main、刪檔或發布|no|

交主控 cherry-pick 後統一生成與本機審閱，不在此分支改 root 的 Build 或既有 08 證據。
