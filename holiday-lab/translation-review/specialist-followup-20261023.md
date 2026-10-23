# 日英翻譯專責複核

2026-10-23；source_agent: codex。使用者追加授權：另組子代理檢查日文、英文翻譯，特別釐清「助理教授／助教」。僅本機審查，不發布、不 push、不碰 main、不刪檔、不處理交接 C 節。

## 分工與完成條件

- 日文：replay_fix，輸出僅 `specialist-ja-20261023/`。以前輪職稱、FAQ、139 筆譯文及後續 8 筆修正為基礎，檢查現況差異及未查證用語，不重做已完成的全部畫面。職稱、共同聘任、從聘、留職停薪與制度名詞優先。
- 英文：short_replay_verify，輸出僅 `specialist-en-20261023/`。逐筆比對中文語意，優先檢查職稱、學位、資格、正式專名與尚存 CHECK；不自行補造原文沒有的精度。
- 兩線皆交付檔案／key、原文、現譯、問題、建議、來源與日期、優先級；明列已覆蓋／未覆蓋及 yes／no 實際驗收輸出。代理審校不宣稱母語人士或校方認證。
- 主控確認來源與實際差異後才整合產品修正；本張工單本身沒有修改產品文字。

## 「助理教授」的回答

台灣「助理教授」通常以 Assistant Professor 表達；面向日本讀者可對照「助教」，這是跨制度的職稱表達，不能據此宣稱聘任資格、權責與升等制度完全相同。

九州大學官方職名表逐項列出：教授／Professor；准教授／Associate Professor；助教／Assistant Professor；另列ティーチング・アシスタント／Teaching Assistant。因此日本職級「助教」須與台灣常說的教學助理（TA）區分。若詳頁需要消歧，可附 Assistant Professor 或台灣原職稱；本輪尚未將此建議套進畫面。

- 官方表：<https://www.cm.kyushu-u.ac.jp/_cms_dir/uploads/2022/03/f2b1ca93e8fffd676f1ae90190e583d1.pdf>，2026-10-23 已讀全文第 1 頁。
- 文部科學省制度說明：<https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/003/gijiroku/06062315/006.htm>，2026-10-23 已讀；區分准教授、助教及助手，並說明舊助教授相關調整。
- JST JREC-IN 職種表：<https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html>，2026-10-23 已讀全文；明列助教相当為 Assistant Professor level，另列研究・教育補助者中的助手。
- researchmap 職名表 <https://researchmap.jp/outline/rmapv2/mig/job_class.pdf> 僅搜尋索引可讀，全文回 403；不得稱本輪已讀全文，也不以它單獨認證個別教師職位。
- 既有 `faculty-roles.json` 是舊審查快照；目前產品翻譯須讀 `locale-en.js`、`locale-ja.js` 與 canonical 資料，不把快照當作最新現值。

## 主控本輪實測

指令：`node holiday-lab/translation-review/post-specialist/verify-integration.mjs`

```text
pass: true
about_labs_values: 44
explicitly_corrected_previous_values: 2
neutral_degrees: 6
exact_dictionary_changes_from08: { en: 7, ja: 1 }
non_target_generated_values_equal: true
files_written: 0
exit code: 0
```

指令：`node holiday-lab/translation-review/check-current-ranks-20261023.cjs`

```text
count: 13
expected_values_match: 13/13
product_files_written: 0
pass: true
exit code: 0
```

完整實際輸出與三個來源 SHA 在 `current-ranks-20261023-output.txt`。這項驗證只確認當前來源值與既有核定對照一致，不宣稱重新認證 13 位教師的最新聘任身分。

| 驗收 | yes／no | 證據／限制 |
|---|---|---|
| 已向兩位子代理發出各自明確邊界的專責複核指派 | yes | 日文與英文兩個獨立產出子目錄 |
| 台灣助理教授與日本助教的職稱對照有官方參照 | yes | 九州大學職名表；跨制度對照，非兩制度完全相同認證 |
| 當前 13 位教師職稱譯值與既有核對結果一致 | yes | check-current-ranks 實際 13/13，合聘／從聘／留職停薪讀自當前字典 |
| 原 13＋44＋82 筆修正及後續 8 值在當前生成字典保持一致 | yes | 上列腳本實際 exit 0；其中 2 值是對前批修正的再修正 |
| 全站日英翻譯已重新逐字完成獨立審校 | no | 兩線限定差異複核已交回，未宣稱所有字串逐字重新認證 |
| 所有教師學位、證照及正式專名已取得一手認證 | no | 未獲來源的項目仍待證，不補造 |
| 本輪已發布／推送修改 | no | 本機審查授權；未執行發布或 push |

## 兩組交回與主控複核結果

- 日文報告：`specialist-ja-20261023/REPORT.md`；20 個原文明指註冊課務組的生效 key 提出名稱統一候選，逐筆列覆蓋來源與完整 old/new。職稱 13 位、學歷欄 12 份、證照欄 9 份已作來源複讀；不認證個人證書或正式人事日譯。提交 e86946040ba3825105ba07af53cd8bfed8b6a158。
- 英文報告：`specialist-en-20261023/REPORT.md`；24 個單位名 key、3 句休學用詞、4 個純抵免語境修正候選；另 1 個同時含免修／抵免的語境待核。兩筆合聘機構名擴寫 Industries 缺官方名稱依據，保留身份對應待確認，不能直接斷言聘任本身錯誤。
- 英文官方頁索引支持 **Registration and Curriculum Division**；本輪重新搜尋兩個樹德教務處官方頁結果一致，但直接全文均 403。前輪 Section 是產品既有用法，不能當官方唯一譯名。不得拿南臺科技大學或其他學校的相似組名作樹德依據。
- 原始 EN 資料 468 個含 CHECK 欄、活躍字典 CHECK 為 0：建置會去掉標記，所以畫面沒標記不能證明正式專名都核實。數字是含標記欄位數，並非 468 個確定錯誤。
- 本輪只做獨立差異複核，沒有新產品 patch、沒有必要重建。139 值沿用檢查、13 職稱及兩組唯讀審查皆由主控實際重跑；未把字典涵蓋數當全站逐字或畫面驗收。

主控命令與實際輸出摘要（完整原始 stdout 在兩線資料夾）：

```text
node holiday-lab/translation-review/specialist-ja-20261023/verify.cjs
effectiveDictionaryKeys: 2344
independentReadCurrentRoles: 13
safeNameOnlyCandidates: 20
sourceFilesStable: 8
productEdits: 0
fullSiteWordByWordCertification: false
exit code: 0

node holiday-lab/translation-review/specialist-en-20261023/audit.cjs
active_english_keys: 2315
roles: 13
neutral_degrees: 6
labels: 33
guide_exact: 514 / guide_missing: 0
office_occurrences: 24
residual_leave_terminology: 3
existing139: YES
source_unchanged: YES
whole_site_semantic_review: NO
files_written_to_product: 0
exit code: 0
```

| 追加驗收 | yes／no | 實際範圍 |
|---|---|---|
| 日英兩組的獨立差異複核報告均已落地 | yes | 各 REPORT、候選 JSON、來源層級與實際輸出 |
| 主控已讀兩組報告並實際重跑各驗證 | yes | 上列兩指令 exit 0 |
| 20＋24 處名稱候選已套用產品並通過新版版面驗收 | no | 都是未套用提案，長標須另驗版面 |
| 全站翻譯、處室最新業務、個人資格已全部核定 | no | 報告明列限制及待證，不能由盤點或字典存在推論 |

下一步：以精確候選表逐項整合無歧義的術語修正，再重建並驗實際長標排版；正式機構對應、學位／證照與當期制度來源不足者繼續待證。沒有新增發布授權。
