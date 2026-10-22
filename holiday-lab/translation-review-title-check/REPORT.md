# 日、英文職稱獨立複核

2026-10-23；本批只新增 `holiday-lab/translation-review-title-check/`，未改產品、重建、推送、發布、刪檔或啟動 Unity。先讀既有初審、faculty-copy 與 faculty-rendered 報告，沒有重翻先前已審的349欄。

台灣「助理教授」在這份日文網站譯為「助教」可保留。英文是 Assistant Professor；日本[JST職種表](https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html)明確列出對應層級。日本的助教是教師職階，不能因中文字面相同便當成台灣的教學助理。這是讀者用語的職階對照，不宣告兩地聘任制度、權責與待遇完全一樣。

|中文原職稱|英文|本網站日文|
|---|---|---|
|教授|Professor|教授|
|副教授|Associate Professor|准教授|
|助理教授|Assistant Professor|助教|
|講師|Lecturer|講師|

四筆英文分別參照[臺師大官方職稱表](https://www.ntnu.edu.tw/oia/doc/0329title.pdf)，四筆日英層級分別核對JST同頁。沒有從單一職稱推導全部。此表含教授作完整語彙說明，現有13位資料沒有教授職階，不冒稱額外有一位教授。

「助教授」是日本舊職稱，不用來翻譯本網站現職助理教授；現行准教授與助教在JST表是不同層級。[文科省制度討論原頁](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/houkoku/attach/1342439.htm)另區分自行教育研究與研究教學補助，也另外提及TA。中文教學助理的 Teaching Assistant 應保留TA語意，不能一律套成本頁的助教職階。

## 現行13位逐人結果

下表取自本輪 `results.json`，核對真正活躍翻譯鍵及8819凍結版實際編譯字典；不是只看未使用的原始英文資料。

|教師|中文職稱|英文職階|日文職階|逐筆職階與附加關係|
|---|---|---|---|---|
|鄧樹遠|系主任 · 副教授|Associate Professor|准教授|yes；Department Chair／学科長，無代理主任|
|江雅媚|助理教授|Assistant Professor|助教|yes|
|陳重光|助理教授 · 電競娛樂系合聘|Assistant Professor|助教|yes；Joint Appointment／共同任用|
|楊智彰|助理教授|Assistant Professor|助教|yes|
|陳慶鴻|助理教授|Assistant Professor|助教|yes|
|張純雅|助理教授|Assistant Professor|助教|yes|
|邱士展|助理教授|Assistant Professor|助教|yes|
|陳美蓉|助理教授|Assistant Professor|助教|yes|
|吳焉昇|講師 · 電競娛樂系合聘|Lecturer|講師|yes；Joint Appointment／共同任用|
|王宗立|助理教授|Assistant Professor|助教|yes|
|陳寀瑜|助理教授 · 從聘|Assistant Professor|助教|yes；Secondary Appointment／従たる所属|
|蔣天華|副教授 · 從聘|Associate Professor|准教授|yes；Secondary Appointment／従たる所属|
|尹立|助理教授 · 留職停薪|Assistant Professor|助教|yes；Without Pay／無給休職中|

合聘、從聘不改成兼任或part-time；它們的當前翻譯是共同聘任關係的解釋，不冒稱校方核定正式日文。完整英日句、中文精確鍵與每個布林檢查都保留在JSON。

## 實際驗收

使用 verify skill 的證據分級；本批是獨立資料與編譯字典檢查，未做產品修改，不另跑全站Build或遊戲測試。

|驗收|yes／no|實際命令與輸出|
|---|---|---|
|13人逐一核對中文、英文、日文職階|yes|`node holiday-lab/translation-review-title-check/check.cjs http://127.0.0.1:8819` → `FACULTY_RANKS 13/13 FAIL 0`|
|真正編譯後字典與本機活躍鍵一致|yes|同指令 → `COMPILED_EN_JA PASS`；解析真實app bundle AST，沒有執行bundle冒充瀏覽器|
|核對前後產品來源未改|yes|同指令 → `SOURCE_STABLE true`；7檔前後SHA相同|
|把raw英文的CHECK當成當前畫面錯誤|no|`pages.jsx`的useDataset讀中文canonical，再由活躍locale轉譯；raw值另欄保留，未混用|
|本輪已重新確認13人最新人事身份|no|官方系所成員頁回403；本輪是忠實翻譯現有canonical資料，無法宣稱當前人事任命已重新驗實|
|本輪已實際逐頁看26個個人頁|no|未做瀏覽器DOM／字形墨跡／排版檢查；前批faculty-rendered的18案例仍維持其原本範圍|
|正式學位、所有公司與作品名稱已認證|no|先前236筆含專名欄位認證仍待確認，本輪未把它們重算成已通過|

完整原始命令輸出：`check-output.txt`。來源SHA、實際served index/app/faculty收據：`results.json`。官方可讀狀態、用途與限制：`official-sources.json`。

## 下一批最需要補的依據

現有張純雅、邱士展、陳美蓉、吳焉昇、蔣天華、尹立六筆中文只列碩士，英文卻指定MA/MFA/MSc/Master of Design等類型；需本人或授予學校一手資料才能核定。`results.json/pendingDegrees`逐人保留原文、英日現譯與待確認原因，沒有擅改學位。

作品、公司、證照與正式發表題名沿用先前逐欄待查表，優先找本人、主辦機關、出版者或授予單位原頁。找不到就保留原中文並標解釋譯名，不能用同名作品、拼音推測或別校規則補成官方名稱。母語者審校仍未執行。
