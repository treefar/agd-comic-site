# 目前本機成果盤點

2026-10-23；唯讀盤點，分支實查 `codex/holiday-prototypes`。本報告是唯一新增檔；未啟動 browser、HTTP、Build、Unity，未改產品／QA／清明凍結方法，未 commit、push、發布或刪檔。依 verify L0 重讀文件與來源；以下歷史測試結果不宣稱本輪重新執行通過。

## 可以看什麼

現存 `.review-local-09` 與 `.measure-integrated-11` 都是整合網站，各實算 356 檔。前者是既有本機審閱成果，後者是較新內部量測成果，不能拿 measurement 標記當交付批准。最新 `holiday-lab/latest-build.json` 指向 measure11，built_at=`2026-10-23T01:07:27.555Z`、public_release=false、purpose=measurement。本次沒有查詢現有服務程序或 port，不保證哪個網址現在仍在服務。

| 體驗 | 實際整合證據 | 完成範圍與限制 |
|---|---|---|
| 漫畫首頁 | `app.jsx:166` 掛 TopNav／GlobalClickFx，後接 Hero、News、About、Works、Faculty、Labs、Join、Footer；兩版 HTML 均有 festival-preview、faculty-portrait-image、指南與語言入口 | 已整合；本輪沒重新看畫面。build 有八章 SSR 存在檢查，不能替代視覺驗收 |
| EN／JA | `en-pages.jsx:11` 讀 lang，`siteCreateElement:38` 共用元件翻譯；`comic-components.jsx:456` 切換語言並保留 hash；locale-en/ja 納入 bundle | 已整合，網址 `/?lang=en#hero`、`/?lang=ja#hero`；不是另外兩套首頁。整站母語審閱、所有缺字修復仍未完成 |
| 在校指南 | `pages.jsx:2404` students route → StudentGuideDetail；`comic-components.jsx:424` 導覽到 `#/students/guide`；student-guide.jsx 有身分／分類／搜尋／展開卡與承辦資訊 | 已整合。既有 `guide-index-evidence/result.json` 9 checks、errors=[]；integration-guide 記載15項／47步／30FAQ。integration11 的49項 EN/JA 譯值增量已進 measure11；不擴張成所有詞義皆已審校 |
| 漫畫效果 | `app.jsx:5` style=shonen、halftone/speedlines/sfx=true；`applyStyleVars:19` 實際改色、網點、集中線、狀聲詞；`comic-components.jsx:212` GlobalClickFx | 已整合。效果可見品質、整包所有互動本輪未驗；功能存在不等於使用者美術確認 |
| 教師照片頭齊 | `chapters-2.jsx:87` FacultyPortrait → `FacultyPortraitModel.styleFor`；`faculty-portrait.js:175` 13組逐照片來源地標、眼線0.50、頭高0.66；未知／換圖回 null | 已整合；保留原像素。歷史 `faculty-portrait/browser.json` pass=true、6/6、errors0，但受測為 `.review-faculty-05`，非新包fresh證據 |
| 導覽避免孤字 | `styles.css:1400` nav a nowrap、flex-shrink0；EN/JA在761–1900用選單（手機另有原有規則），761–1180品牌允許balance；名稱保留完整 | 已整合；歷史 nav-wrap/result.json 實讀27/27 yes（3語×9寬）。本輪未重跑browser；不把文字nowrap推論成所有字型／所有寬皆成立 |
| 十五款節日試作 | `chapters-1.jsx:10` Hero實掛HolidayHome；holiday-home.jsx:9 15 entries、19全部入口、23點擊後iframe；catalog.mjs 同15款，runner／games／assets／audio在build-review白名單 | 已整合：元旦、春節、元宵、兒童、端午、中秋、教師、國慶、開學、畢展、和平、清明、勞動、光復、行憲。勞動維持既有版，本輪不續作。功能紀錄不能代替完整UI gate／真人手機／美術確認 |

兩版 `styles.css`、`student-guide.css`、`faculty-portrait.css`、`holiday-home.css` SHA逐一相等；因此上列CSS修正不是 measure11 才加入。新 bundle 內的每個React元件未反編譯逐一對比，不能僅憑 bundle不同就指稱某項元件新增或缺失。

## review09 與 measure11 的逐檔差異

本輪只遞迴兩個356檔輸出目錄，未掃巨大raw。相對路徑＋SHA256比對：28個同名檔不同，各1個bundle名稱替換；其餘同名檔相同。

- review09 bundle：`app-K6E6TA3D.js`；measure11：`app-TQ4G6C6Y.js`。
- 17資料檔：`data/admission.json`、`data/news.json`；`data/en/` 下 admission、editorial、faculty、flow-ui、labs、news、step-details-ui、student-guide-ui、ui、works（皆.json）；`data/ja/` 下 editorial、flow-ui、messages、step-details、ui（皆.json）。
- 8遊戲：`holiday-lab/games/` 下 constitution、labor、lunar-new-year、national-day、new-year、peace-memory、semester、teachers（皆.mjs）。
- 另 `holiday-lab/lab.css`、`holiday-lab/runner.mjs`、`index.html`。
- measure11 內所有 `holiday-lab/` 輸出相對路徑，與目前同路徑原始runtime檔逐筆比較，缺檔／SHA不同清單為 `[]`。此結論是盤點當下快照，不涵蓋root稍後修 favicon 的變更。

歷史來源 `integration-20261023-11.md` 記錄 build exit0、兩個 duplicate color 警告、21 unpaired paths；10→11 runtime283檔相同、指南49譯值增量。這是較前版本10的對比，與本節09→11的8遊戲差異不矛盾。本輪沒有重新執行那些歷史測試。

## 建置入口、輸入與副作用

`holiday-lab/build-review.mjs:7` 先拒絕既存out，不清舊目錄；非measurement先跑完整layout policy，兩模式都跑 UI art policy，接 `scripts/build.mjs --local-review --out=...`，最後再複製節日runtime。

`scripts/build.mjs:11` 沒有 `--local-review` 直接exit1。package的 `npm run build` 不加參數會被阻擋；不可改旗標或跳過政策來冒稱交付通過。

實際13支bundle輸入（舊註解稱6支不準）：locale-en.js、locale-ja.js、en-pages.jsx、tweaks-panel.jsx、comic-components.jsx、holiday-home.jsx、chapters-1.jsx、faculty-portrait.js、chapters-2.jsx、pages.jsx、student-guide-model.js、student-guide.jsx、app.jsx。另讀根index.html模板、data及兩個翻譯生成腳本，使用React18.3.1／esbuild0.28.2。

根靜態輸出白名單是 data、images、styles.css、student-guide.css、faculty-portrait.css、holiday-home.css、.nojekyll；不是所有根檔自動複製。節日白名單只有 index.html、lab.css、runner.mjs、replay-model.mjs、catalog.mjs、games、assets、audio。build-review再拒絕 .git、work-orders、art-source、audio-source、tests、reports、play-zone、uploads、dashboard、LATEST_HANDOFF、CONTRACT.md 被帶入輸出。

建置副作用不能忽略：重寫根 locale-en.js、locale-ja.js，`docs/qa/i18n-data-missing.json`、i18n-catalog.json、i18n-missing.json；覆寫共用 `.build-tmp/ssr.cjs`，最後重寫 `holiday-lab/latest-build.json`。新out不隔離這些共用生成檔，不能和另一個build平行執行。根build本身不拒絕已存在out，必須走build-review的fresh guard。

## 最小安全操作命令（本次未執行）

在root完成favicon修正與獨立驗收、確認沒有其它build後，於 `C:/agywork/agd-holiday-prototypes` 執行。先確認新名稱不存在；若存在就換新名，不刪舊檔。

```powershell
node C:/AIHome/claude/skills/game-ui-art/scripts/ui-policy.cjs --project .
node C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs --project .
```

前者核manifest、257素材SHA／提示詞／Codex來源、9screens和ui_targets程序皮膚規則；不render、不作美術品質判定。後者讀 `ui-layout-contract.json` 指向的 `holiday-lab/layout-qa/layout-report.json`，核完整required_cases、來源指紋、節點ink/safe與blockers。歷史layout-gate11-output為pass=false；本輪實讀R0仍13cases、source_fingerprints={}。所以完整交付目前 NO，不能因來源覆蓋提高便跳過它。

要新增可供內部本機看的量測成果，現成入口是：

```powershell
node holiday-lab/build-review.mjs .measure-current-preview-20261023-01 --measurement
```

此命令有明示measurement、仍執行art policy；不代表可打包發布。非measurement正式review命令會先遇現存完整gate：

```powershell
node holiday-lab/build-review.mjs .review-current-preview-20261023-01
```

完整gate真通過才用後者。這兩條是可選路徑，不要連跑兩次充當驗證。favicon若要複製實體新根檔，必須由root在顯式白名單實作；目前不會自動帶入。若用模板data URI，須新輸出HTML及真Network確認，不能回填舊pilot。兩個舊輸出index均沒有明示icon link；本盤點未重現404。

成功後root可另開本機服務，以下只列命令不啟動，也不占用既有8800：

```powershell
node holiday-lab/serve-review.mjs .measure-current-preview-20261023-01 8856
```

8856需先確認空閒，不代表本輪已核可用。serve-review只listen 127.0.0.1，Cache-Control:no-store；不存在檔案真404，沒有SPA fallback、mock或favicon特例。普通檔案網址不適合取代HTTP，因有fetch／ES modules。`npm run serve`固定dist，不適用此新out；`scripts/check-dist.mjs:35`同樣固定讀dist、不接受out，不可拿它驗新measure後聲稱成功。新包必須另做指向精確out的驗證。

## 儀表板與剩餘NO

既有 `holiday-lab/dashboard/out/index.html` 已存在，可直接本機開啟單檔儀表板。`data.json`有15遊戲、57外框檢查、16來源覆蓋列，逐列加總2046/2076、缺30；中秋／國慶／開學／清明／勞動各缺6。完整UI列明確gate_no。不要手填數字或因清明404分類完成就提高文字域覆蓋。

root刷新既有儀表板的精確入口（本次未執行）：

```powershell
node holiday-lab/build-dashboard.mjs
node holiday-lab/dashboard/smoke.cjs
```

前者會寫dashboard/data.json與out，呼叫既有project-dashboard builder＋authority verifier。dashboard被build-review禁止帶入網站，若使用者需同時看網站與進度，應分別開本機網站與這個離線HTML，不改runtime白名單偷帶內部資料。

仍為NO：本輪fresh包的畫面／Console／Network驗收、新清明404修復驗收、完整2076 UI交付gate、使用者美術確認、整站母語審閱、實體手機、真背景切頁、TF-BASE兩款Unity/WebGL來源與build。清明舊失敗run保留，root負責新驗收；此報告不替其宣告成功。

## 本輪實際只讀驗證與stdout

- `Get-Location`、`git branch --show-current` → 根目錄正確、`codex/holiday-prototypes`。
- `Get-Content`、`rg -n` 讀上述build／policy／元件／來源／歷史報告；第一次PowerShell把glob直接傳rg得到os error123，改用目錄＋`-g 'integration*.md'`成功，未改產品。
- Node fs/crypto遞迴兩個小輸出目錄，SHA比對stdout：review09 files356、measure11 files356；onlyReview/onlyMeasure各1 bundle；changed清單28；current-v-measure11 `[]`；四CSS same=true。
- Node只讀既有JSON：nav27/27yes；portrait pass=true/cases6/errors0/build=.review-faculty-05；guide checks9/errors0；R0 cases13/sourceFingerprints0；dashboard存在true、來源列加總2046/2076。
- 未執行：所有Build、瀏覽器／HTTP／原生擷取、程式測試。原因：工單限唯讀盤點，不把歷史綠燈說成本輪fresh驗證。

盤點當下SHA256：

| 檔案 | SHA256 |
|---|---|
| scripts/build.mjs | 4af86a72c839162650e3c205131f1774f095db3a727a7af78136a34d36100144 |
| holiday-lab/build-review.mjs | 780a1ca35b32f9392d5fcc4b18e8b34d5da49b59c1e7c88e07e2a829dfe95eff |
| app.jsx | 2211b424c5058accc36c7383a877e41e8f31ed82afc5db6cbc65183c758085e4 |
| comic-components.jsx | 9adf454ca704e06f986f36fba9e99fe1f63a35719bce5925c3da4fc18a56a57e |
| styles.css | 8517da71ab27d11360c02c5e297104840ba39f7d9f760b9b1330c0753ea23641 |
| faculty-portrait.js | 3c49876da2f68ef6b10bddae00c54d5e53756b1b00827c3200e5573363c389a4 |
| holiday-home.jsx | 6e3a3071558b5963db9b16a53ceae32be44d8e5e9f176c7e41acd5b7ebcd7f2c |
| student-guide.jsx | 292733cd7f17a892b64c6e037a87b18fa13ef8863330ad423e88bbab9a3fd960 |
| ui-layout-contract.json | 00633d6b0f19913062c919f93a938bcfe9f0614455c160dd4fe702e836c49ae4 |

本報告交付條件：實碼與現存檔盤點 yes；提供精確待執行命令及副作用 yes；新本機成果／清明404已修且獨立驗收 no（由root續作）。
