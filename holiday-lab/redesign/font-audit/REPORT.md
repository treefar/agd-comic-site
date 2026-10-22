# 字體覆蓋與缺字稽核

日期：2026-10-22。範圍：唯讀 `C:/agywork/agd-holiday-prototypes` 與 `http://127.0.0.1:8800/?lang=zh|en|ja#hero`，Chromium 1440×1000。分支 `codex/font-audit`；沒有改產品、push、操作 main、刪檔或停止伺服器。

結論：已重現「特色字體沒有中文字形，瀏覽器自行換字體」，尚未重現真正顯示方框的缺字。日文首頁大標也落到繁中系統字型，字型角色不一致。先修明確的語言字型鏈與過重文字效果，再用使用者指出的確切字元補測；不能把本輪樣本通過寫成全站沒有缺字。

## 實際字體矩陣

|位置／語言|CSS 指定|CDP 實際渲染|判讀|
|---|---|---|---|
|中文首頁「畫出來，動起來。」|Bowlby One → Bangers → system-ui|Microsoft JhengHei UI Bold，8 glyphs|兩款拉丁特色字體無該 CJK glyph；系統備援成功，沒有證明 tofu|
|英文首頁「Draw it.Animate it.」|同上|Bowlby One，19 glyphs|符合拉丁特色字體用途|
|日文首頁「描いて、動かす。」|同上|Microsoft JhengHei UI Bold，8 glyphs|有字形但日文主標未走明確日文字型|
|中文章節「動畫與遊戲設計系 — 最新消息」|Bangers → Reggae One → Noto Sans TC → system-ui|Bangers 3、Reggae One 12 glyphs|同一行混用兩套字體；Reggae One 本輪常用繁中樣本有字|
|日文章節「アニメとゲームデザイン学科 — 最新情報」|同上|Bangers 3、Reggae One 17 glyphs|日文特色字有載入|
|中文新聞標題「設計力出海！動遊系赴日實習邁入第九屆」|Noto Sans TC 優先|Noto Sans TC Thin，18 glyphs；computed weight 900|內部 family 名稱含 Thin，不代表顯示細字；下載檔有可變字重軸|
|中文「碰！」|Bowlby One → Reggae One → Noto Sans TC → system-ui|Reggae One 1、Noto Sans TC Thin 1 glyph|字元／標點分由不同字體補足|
|日文導覽|Yu Gothic → Hiragino Kaku Gothic ProN → Meiryo → Noto Sans TC|Yu Gothic|日文導覽已有專用鏈，首頁主標沒有同樣受益|
|Zen Kurenaido|Google Fonts import|原始樣式未找到其他使用宣告|測試探針主動用過它；不能把探針觸發的下載當產品正在使用|
|JetBrains Mono|styles.css:324 宣告，未 import|未另查該元件的實際平台字型|可能使用 ui-monospace；不能宣稱外部 JetBrains 已載入|

證據：[audit.json](runs/2026-10-22T14-34-12.380Z/audit.json)，含每個目標節點 computed family、字重、描邊、行高、CDP 平台字型及逐字探針。原始碼雜湊在 [source-snapshot.json](source-snapshot.json)；此檔記錄的是稽核收尾時來源，不是網站歷史版本的承諾。

## 缺字、載入與效果的證據

1. **確定 fallback**：Bangers 與 Bowlby One cmap 不含樣本中的「鄧 U+9127、臺 U+81FA、畫 U+756B」等 CJK。逐字 CDP 與實際中文首頁標題都顯示 Microsoft JhengHei UI；並非只用 `document.fonts.check` 推斷。樣本英文箭頭「→ U+2192」也不在這兩款下載字型 cmap，應由一般文字／圖示字型處理。
2. **日文需要備援**：本輪已下載的 Noto Sans TC 子集不含「徳 U+5FB3、録 U+9332」。這是下載子集的實證，不能推論上游完整字型所有檔案也都缺字；亦不能因此宣稱畫面必定方框。日文導覽已用 Yu Gothic，日文主標實測卻仍用 Microsoft JhengHei UI，應統一 `html[lang='ja']` 的文字角色規則。
3. **不能泛稱 Reggae One 缺繁中**：Reggae One 與 Zen Kurenaido 的已下載子集都涵蓋本輪繁中樣本；分別為 2,994 與 2,236 個實際下載碼點的聯集。數字不是完整上游字集大小。本輪沒有真正 tofu 的可重現樣本，使用者原先指出的確切缺字頁面／字元仍待對照。
4. **沒有缺檔證據**：此次三語頁面與診斷探針合計 127 個 Google 字型 CSS／字型回應，failed request 0。FontFaceSet 的 `unloaded` 可只是 unicode-range 子集未被任何文字用到，不等同下載失敗；此輪成功也不能保證校園網路、離線或其他裝置都成功。
5. **描邊與擠字風險**：`.h-jojo` 蓋過 `.h-display` 的 CJK 字型鏈。實際主標 140px、4px 描邊、119px 行高（0.85）；章節標 50px、3px 描邊、5px 陰影。來源另有 skew、疊字、不同 shard 位移，以及彩蛋文字 9px 描邊、多層陰影。這些是筆畫相黏、重疊和裁切的可疑因素，不能說成 cmap 缺字。截圖中文主標有完整字形；視覺可讀性仍交使用者決定。
6. **Emoji 另算**：導覽的地球 emoji 依平台彩色 emoji 字型顯示；不要要求 Bangers 或 CJK 正文字型必須自帶 emoji，也不要把黑白／彩色不同判成缺中文字。

原始碼對照：`styles.css:2` 五款 import、`:28` 正文、`:324` mono、`:546` display、`:562` jojo；`index.html:43` novel 覆寫、`:50` webtoon；`student-guide.css:144–145` 日文覆寫。中文首頁已實際檢視截圖；三語截圖皆已存檔，沒有自稱使用者驗收。

## 三組可採字型角色

|方案|正文／導覽／按鈕|少量特色標題|日文與風險|
|---|---|---|---|
|A：先修一致性，成本最小|沿用 Noto Sans TC 400/500/700，CJK 標題 900|Bangers 或 Bowlby One 擇一，只用短英文標籤；CJK 不指定拉丁字體優先|日文角色明確用 Yu Gothic／Hiragino／Meiryo 鏈；仍依賴平台裝字，跨平台驗證未做|
|B：保留手寫感|同 A|核准自有「秋茄體無注音 ToneOZ-Tsuipita-TC」，只放短 CJK 標題／語氣文字|本輪字型 cmap 16,824 碼點，中英日樣本零缺字；這不是完整 Unicode 保證，部署前仍要試長句、字重與下載大小|
|C：清爽刊物感|同 A|核准自有 Bpmf GenYo Min R 只用少量繁中章名；英文短標沿用 Bangers|cmap 15,604 碼點，繁中樣本通過；日文「学 U+5B66、徳、録」缺字，不能直接當日文標題字型。Bpmf 系列帶 IVS 功能，需確認正式文字沒有意外注音選擇序列後才採用|

另查 Bpmf GenSeki Gothic R 同為 15,604 碼點、同樣缺上述日文字，可作繁中文字重／風格候選，但本輪未做畫面樣張。B、C 都只讀使用者核准 `字型_合法免費_from魯哥`；沒有從未授權資料夾取得字型，沒有把雲端候選字型拷進產品。

每款候選的原始相對路徑、SHA-256、name table 授權與缺字明細在 [cmap.json](cmap.json)。資料庫根目錄由 `resolve-vault.ps1` 現場解析為 `G:\我的雲端硬碟\06_素材庫`，腳本沒有寫死磁碟。

## 授權與來源（2026-10-22 查閱）

- 既有五款 Google Fonts 的 OFL 原文已附 `LICENSE-*.txt`，保留其版權與授權；官方來源：[Noto Sans TC OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstc/OFL.txt)、[Bangers metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/METADATA.pb)、[Reggae One metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/reggaeone/METADATA.pb)。Bangers metadata 只列拉丁相關子集；Reggae One 主 script 為 Jpan，不能以外觀猜字體來源。
- [秋茄官方介紹](https://toneoz.com/blog/tsuipita/)說明開源、可商用與無注音版本；自有檔案旁的 OFL 標示 ToneOZ Tsuipita 2024、衍生自 Peak、SIL OFL 1.1。本次僅推薦核准庫中的無注音版本。
- [ButTaiwan bpmfvs 官方專案](https://github.com/ButTaiwan/bpmfvs)提供注音 IVS 字型規格；兩款自有字型 name table 均內嵌 SIL OFL 1.1。採用時必須一併保留原授權與名稱要求，不把「免費」解釋成可任意重命名。

## 載入／備援與驗收策略

- 全站先按語言定正文、標題、英文字標三種角色，再移除 inline family 對角色的覆蓋；`.h-jojo`、novel 樣式也要一起處理，不能只改 body。
- 明確繁中鏈可為 `'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif`；日文鏈可先沿現有 `'Yu Gothic','Hiragino Kaku Gothic ProN',Meiryo,sans-serif`。這些平台字型不是本輪取得的可重新散布字型，不要將其檔案打包。跨平台穩定日文若需新增 webfont，先從核准庫確認來源、cmap 與授權再做。
- 保留 `font-display:swap`，讓字型未到時先顯示可讀字。正式採用自有字型可自架同源 WOFF2 並附 OFL；先量檔案與實際用字，不同時預載全部 Noto unicode-range 子集，也不為未使用的 Zen Kurenaido 付出下載。
- 正文、導覽、指南卡片不描邊、不歪斜；漫畫特色集中在少量英文短標或 CJK 大章標。先試章標 0–1px 描邊、1.15–1.3 行高，再看三語長標與手機；這是待實作設計策略，不是已通過的產品修改。
- 每次新增人名、公告、日文翻譯時，把實際文字加入 `samples`，檢查 cmap 與逐字平台字型；不得只看 fonts.check。整合端還要補手機、三欄指南、長 FAQ、斷網備援和實際使用者缺字例子。本輪未改上述產品行為。

## 可重跑命令與實際輸出

在 `C:/agywork/agd-font-audit` 執行；需要既有 8800 伺服器、bundled Playwright Chromium、Python fontTools，且候選字型所在核准雲端庫可讀。

```powershell
node holiday-lab/redesign/font-audit/audit.cjs
$env:PYTHONIOENCODING='utf-8'
python holiday-lab/redesign/font-audit/cmap.py
node holiday-lab/redesign/font-audit/verify.cjs
node --check holiday-lab/redesign/font-audit/audit.cjs
node --check holiday-lab/redesign/font-audit/verify.cjs
git diff --check
```

實際重點輸出：

```text
PAGES 3 FONT_RESPONSES 127 FAILED_REQUESTS 0
Noto Sans TC Thin 6638 {'zh': '', 'ja': '徳録', 'en': ''}
Bangers 222 ... 'en': '→'
Bowlby One 212 ... 'en': '→'
Reggae One 2994 {'zh': '', 'ja': '', 'en': ''}
Zen Kurenaido 2236 {'zh': '', 'ja': '', 'en': ''}
CANDIDATE ToneOZ-Tsuipita-TC 16824 {'zh': '', 'ja': '', 'en': ''}
CANDIDATE Bpmf GenSeki Gothic R 15604 {'zh': '', 'ja': '学徳録', 'en': ''}
CANDIDATE Bpmf GenYo Min R 15604 {'zh': '', 'ja': '学徳録', 'en': ''}
ERRORS 0
RESULT 10 YES / 0 NO
NOT VERIFIED: all site routes, all Unicode, user-reported exact missing character, mobile visual acceptance.
```

首次 Python 執行遇到 Windows cp950 解碼／輸出錯誤；已明確指定輸入 UTF-8 與輸出環境重跑成功，不把失敗次數隱去。Node 語法檢查與 diff check 成功時為空輸出、exit 0。

|驗收項目|yes／no|實際證據|
|---|---|---|
|完成三語首頁實際渲染採樣|yes|audit.cjs exit 0；PAGES 3|
|用實際字型回應與逐字 CDP，不只 fonts.check|yes|127 回應與 characters/platform；verify 10 YES|
|解析已下載字型與候選 cmap|yes|fontTools ERRORS 0，cmap.json|
|確認原先所有缺字都消失|no|未取得使用者確切缺字頁面／字元，也未修改產品|
|整站所有路由／所有 Unicode／手機完成驗證|no|此輪範圍限三語首頁與明列樣本|
|提出三組合法字型角色與備援策略|yes|上表與原始授權；未部署新字型|
|只寫白名單、沒有 push／main／刪檔／停 server|yes|獨立 codex/font-audit 分支，只有 font-audit 產出|

三語驗收字串在 audit.cjs `samples`，可直接擴充。截圖：[中文](runs/2026-10-22T14-34-12.380Z/home-zh.png)、[英文](runs/2026-10-22T14-34-12.380Z/home-en.png)、[日文](runs/2026-10-22T14-34-12.380Z/home-ja.png)。這些是工具擷取證據，不代表使用者視覺確認。
