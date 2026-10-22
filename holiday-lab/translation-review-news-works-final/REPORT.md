# News／Works 剩餘全量英日審校

已審完整 218 個中文鍵、436 個英日值，非抽選前 20 段。產出 83 個精確值修改提案、1 則歷史 HC 公司原名修正提案、1 組 Works 完整主標修正；目前都沒有套進產品。

固定來源：`cbcfed1e8a5ad25b64a69e052941a6d103f22487`；查核日：2026-10-23。

|範圍|實際數量|
|---|---:|
|原始唯一鍵|348|
|先前語義批次|8|
|上一批首頁消息／作品|19|
|About／Labs coveredKeys|103|
|上述排除聯集|130|
|本批唯一鍵|218|
|本批 source occurrences|307|
|本批英日值|436|
|精確值提案|83|
|整段主標 context 值|6|
|語義保留值|347|

來源 occurrences：`data/news.json` 179、`chapters-1.jsx` 49、`data/works.json` 51、`chapters-2.jsx` 28。同鍵跨檔逐筆列在 inventory／REVIEW；CRLF 工作樹的舊 offset 不直接套在 Git blob，已用固定 AST 的行號與完整字串重新定位，並保留原 snapshot pointer。

## 讀者會先看到的問題

- 首頁 Works 英文實際顯示「20 YEARS OF STORIESAWARDSKEEP COMING。」：20 話誤成 20 年，且片語相黏。日文「連載 20話実績途切れることなく。」也沒有自然的完結句。已用實際 served build 逐語讀 DOM 並截圖，提案改整個 localized rich-text 主標，保留黃色 span，不改全域標點字典。
- 首頁摘要英文漏四項比賽名、兩個影展獎名，補完整原資訊；未確認正式外文獎名時保留中文專名，加自然說明，不發明官方名字。
- `Unity Certification User` 修為官方 `Unity Certified User`；`After Effect CC` 補為 `After Effects CC`。課程日期、教室、名額、分機、Email 與原有全勤條件不互相搬用。歷史公告「即日起」明確繫於公告發布日。
- 日文把十位「專業師資」增成「専任教員」，提案移除多加的聘任身分；技專實務專題不一律限縮成「卒業制作」。
- 「上萬」不是至少兩萬，將 `tens of thousands` 改 `over 10,000`；「20+ 國際影展」不改成二十筆入選；「21 項以上」維持至少二十一項。沒有因數字看來矛盾就重算原始統計。
- 喀嚓、葛柏秀與音樂遊戲的英文直譯改自然句，保留原玩法，不新增機制；競箱團的「好奇偷拆」不譯為「誤拆」。

## 名稱與原事實的界線

Young Pin Design Award 經[主辦英文頁](https://www2.goldenpin.org.tw/en/young-pin-design-award-participate/)及[2026 官方文件](https://storage.googleapis.com/tdri/yodex/2026/exhibitor_download/file_path/165/image_7928d5.pdf)支持，現有名稱正確，沒有誤改成另一個 Golden Pin Design Award。

歷史 HC 新聞第 16 筆的松山市、HC、張純雅／尹立、八學生六加二、工作任務，獨立支持同一合作方。以[公司原頁](https://hautecouture.jp/about/)核對 `株式会社オートクチュール／hautecouture Inc.`，只提出這筆公司名的精確修正。第八年、七月八日、學生名單及其餘內容保留；另一同音公司的名字不全域替換。

三家產業簡稱各自查官方：智冠的[Soft-World](https://www.soft-world.com/Home)、HC 的[公司原頁](https://hautecouture.jp/about/)、西基原頁明列的[CGCG Inc.](https://www.cgcg.com.tw/index-C.html)。沒有由一筆對照推導其他兩家。

以下來源問題另列 `sources.json`，沒有默默修中文或拿譯文保留當外部查證：

- 人造人有 Zephyranthes／Android、神癒有 Holy Algorithm／Divine Healing 等異名，沒有取得創作者正式對照；藤川黎星的兩種羅馬字亦未核本人。陳政名／陳政民為中文原資料本身衝突，不猜哪個對。
- [CELSYS 第 27 回官方新聞](https://www.celsys.com/en/topic/2021042802)日期為 2021-04-28，作品資料年欄為 2022。須先確認 year 欄意義，未擅改年份、得主或回次。
- [開拓第十五屆官方頁](https://www.f-2.com.tw/short_mangas/第十五屆開拓極短篇原創大賞/)列「入選作品」集刊，canonical 卻寫「所有作品」；啟動碼與連載媒合的版本亦未核實。語義提案按中文恢復 all works，但這句發布應等原公告版本釐清，不能把它當最新活動辦法。
- [Elsevier 2025 Version 8](https://elsevier.digitalcommonsdata.com/datasets/btchxktzyw/8)標題與日期可讀，後續正文取得兩次逾時。[官方方法 FAQ](https://www.elsevier.support/mendeley/answer/topcited-scientists-database-faqs)提示 composite score 前十萬或主要次領域前 2% 等條件，原中文「從八百萬人嚴選前 2%」可能過度簡化。未下載原表核 1470 人、四連年、個人引用數，也未用較新的 FAQ 數據覆蓋 2025 原文。
- 歷史影展結果、正式類別名、近五年／109–114 學年、就業率與累計成果未全部取得原證書或處室統計。本輪完成的是逐鍵翻譯語義審查，不是每件歷史事實的重新認證。

## 可重跑驗證

工作目錄：`C:/agywork/agd-holiday-prototypes`。

```powershell
node holiday-lab/translation-review-news-works-final/inventory.cjs
node holiday-lab/translation-review-news-works-final/review.cjs
node holiday-lab/translation-review-news-works-final/read-context.cjs
node holiday-lab/translation-review-news-works-final/verify.cjs
```

實際輸出在 `verification-output.txt`，機器證據在 `validation.json`。13 yes／0 no：

```text
yes scope_348_minus_130_equals_218
yes all_436_explicit_semantic_notes
yes no_overlap_with_prior_batches
yes all_307_fixed_origins_exact_CRLF_reanchored
yes all_436_pinned_active_values_exact
yes all_436_current_active_values_exact
yes all_83_exact_targets_preflight
yes targets_allowlist_and_unique
yes historical_HC_only_company_name_and_safe_rename
yes actual_Works_context_defect_captured
yes counts_derived_83plus6plus347
yes all_436_served_compiled_values_exact
yes product_SHA_readonly
```

實際 served build `http://127.0.0.1:8819`，`app-35FXRUI2.js` SHA-256：`14553b6796946bd0c474fe4c0c7285ac7dd65a47b73411093333e9049b6353df`。讀取其編譯後字典比對 436 值，支援 StringLiteral 與無插值 TemplateLiteral；不是只看未使用的 raw EN 欄。

最初驗證器將「Game分類完整。」等短筆記錯排除，原因是任意設了至少七字門檻；已修成逐筆非空與合法決策檢查，再得上述實測通過。這是驗證器條件修正，非產品翻譯測試曾通過後失敗。

未執行：產品套用、locale 重建、改後排版與母語者人工驗收、Build、公開上線。原因：本批授權限獨立審閱與精確提案，主控負責套用與整合驗收。13 項 yes 不能解讀為提案已發布或所有來源待確認已解決。

## 接手順序與檔案

1. `REVIEW.md`／`reviewed.json`：218 鍵各自 EN／JA 判斷與 source anchors；`coveredKeys.json` 供後續排除。
2. `exact-plan.json`：83 個真實檔案路徑、完整 old/new、理由及是否為新增 override。EN 依實際 build precedence 選取生效來源；raw `[CHECK]` 值與 active stripped 值分開保留。
3. 歷史 HC 的 canonical 更名必須成批 preflight，再搬 JA 舊長鍵至新長鍵、先拒絕新鍵碰撞，確保 EN/JA 新鍵生成及舊鍵清除。不能只改 canonical 或只改日文字串。
4. Works 主標為整段語境提案，三個鍵共六語值不混入 83 筆字典操作。源事實有衝突的規則句先釐清，其他忠實語義修正可分批整合。
5. 套用後由主控重建，獨立驗新增／未改字段、實際 DOM、短標換行與英日完整資訊，再交使用者本機審閱。

所有新產出限本資料夾；未改先前凍結 helper／tests、產品、main 或他人報告。
