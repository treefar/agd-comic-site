# 來源追溯暫停點

## 2026-10-23 接續結果

本段更新取代下方「尚未建立」的歷史狀態。已建立 `REPORT.md`、`ledger.json`、`membership.json`、`build-analysis.json`、`native-audit.json`、`manifest-audit.json` 及唯讀 `provenance.cjs`。實際跑過原generator的隔離root為 `isolated-1792733490376/root/`，exit0、55 inputs未變、37 outputs；build11 bundle內容精確相同，08/10不同，原08完整bundle重現仍NO。283 contract、282 current=snapshot、278歷史same-path served；runtime subtree283交集277，六audio runtime-only、holiday-home.css與五非served inputs contract-only。

原缺module紅測已轉綠，新增same-bytes unrelated served path真RED（缺拒絕）→修正expected build path→3 tests GREEN。獨立唯讀核JA18 raw/sample/shot/JPEG/hash/geometry與兩寬原生140ms觀察；舊min140六fail保留。`global_approved=false`，未新增browser/native、HTTP或正式build。下一步由主控決定current-source剩餘case重測與原08完整snapshot缺口，禁止把本輪結果整批回填到舊來源。

2026-10-23，source_agent: codex。使用者要求到段落暫停以重開程式，依主控訊息立刻停止新功能／新測試／native。此檔是現況，不是完成報告。

## 實際已落地

- 本資料夾 `SCOPE.json`：五個非 served inputs、只讀與全域 NO 範圍。
- `provenance.test.cjs`：兩個預期回歸測試，要求三種來源身分分開、重複路徑拒絕、越界／錯 SHA／錯內容拒絕。
- `tests-red.txt`：實際 `node --test holiday-lab/layout-qa/source-provenance-20261023/provenance.test.cjs` exit 1；原因是尚未建立 `provenance.cjs`。尚無綠燈，不聲稱工具完成。
- 尚未建立 ledger、轉換重現程式、隔離建置、正式 REPORT，沒有執行新 build／generator／browser／native。

## 實際已讀來源

所有相對路徑都相對 `C:/agywork/agd-holiday-prototypes/`。

1. `holiday-lab/layout-qa/supplement-integration-20261023/v4/plan-current/plan.json` 的 source_checks：283 contract 項目；五個 served_same_path=false 如下。new-year 是唯一 same08=false：目前 SHA `42565e8c5c9e60240f686254a430c62e027c4d93a91a32e20c419799b15be7e7`，08 SHA `a6203561b7d3712508f213baceda92e4de4b4979ddb9bedbbbbe750d1ed9e950`。
2. `holiday-lab/layout-qa/source-checkpoint-08/source-receipt.json`：原 base8845、build `.measure-integrated-08`，原 compiled_inputs／source_fingerprints／逐檔 source/build/HTTP 欄位。此原檔未改。
3. `holiday-lab/layout-qa/source-receipt-08.cjs`：已讀原實作，對 build 同路徑檔比較 SHA；無同路徑的五個 inputs 只列未完成，不含編譯等價證明。沒有執行它，避免覆寫舊收據。
4. `scripts/build.mjs`：完整已讀。SOURCES 包含 holiday-home.jsx；先執行兩翻譯 generator，再串所有 source，以 esbuild 產 SSR／client bundle。ROOT 依腳本位置；TMP 固定 ROOT/.build-tmp；正式原地執行會寫 locale／docs／.build-tmp，**下輪不可直接在 root 執行**。可考慮先隔離完整 generator 所需來源／data／scripts，再在本白名單子資料夾建置。
5. `scripts/build-translations.cjs` 與 `scripts/build-ja-translations.cjs`：實際讀 data，寫 cwd 的 locale-en.js／locale-ja.js，英文另寫 docs/qa。全部必須隔離。
6. `holiday-lab/build-review.mjs`：建置前用外部 ui-policy 檢查 manifest；其後複製 runtime allowlist，會寫 root holiday-lab/latest-build.json，所以**不可直接執行**。
7. `holiday-lab/layout-qa/collect.cjs`：歷史 R0 入口，require browser-sampler／asset map；以 sampleLayout.toString() 及 assets 傳入實際 browser evaluate。它也寫舊 layout-report.json 等，**不可執行**。不能將此檔誤當現在的 phase-collect。
8. `holiday-lab/layout-qa/phase-collect.cjs` 的 require／assets／metadata／evaluate 實際引用：保存 sampler function SHA、asset map SHA、current collector SHA，實際評估序列化函式及 assets。僅讀相關行，未完整審該大檔。
9. `holiday-home.jsx`：目前 component 來源已讀；動態 import catalog、正常使用者點擊後載 iframe，屬 bundle 來源，不能要求與 served JSX 同路徑比對。
10. `ui-art-manifest.json` 前段與 `C:/AIHome/claude/skills/game-ui-art/scripts/ui-policy.cjs` 實際 inspectProject：manifest 是 preflight 輸入，逐素材 hash／prompt／ui_targets 檢查，不是玩家程式碼輸出。尚未執行完整 manifest 驗證。
11. `.measure-integrated-08/` 頂層實查：`app-XINNZ4MW.js`、index.html、CSS 等。未做重建或 bundle 等價宣稱。
12. `holiday-lab/layout-qa/newyear-ja-caption-current/REPORT.md`、aggregate.json、verify-aggregate.cjs、check.cjs 前段：後續 fixed10／8847 日文「軽く跳ぶ」18 stable capture（兩寬×九鏡）；原1440不穩鏡3／7保留，再定向補兩張。aggregate 明示 source current42565…、sampler function c24764…、full_project_approved=false。**本輪未重跑 verify-aggregate，因它會覆寫 aggregate**；尚未逐原 sample／PNG／source receipts 獨立核實，不當本輪已驗證。
13. `holiday-lab/layout-qa/newyear-min140/runs/2026-10-23T00-05-50-129Z/report.json` 開頭：舊 fixed08／8845、真140ms timings，只讀前段，尚未完整逐新舊 caption case 比較。
14. `package.json`、`C:/AIHome/claude/skills/verify/SKILL.md` 已讀。

## 五個輸入，已讀出的角色與剩餘 NO

| input | 已讀實際消費鏈 | 尚未證明 |
|---|---|---|
| holiday-home.jsx | build.mjs 的 SOURCES→串接→SSR/client esbuild | 隔離重建與08／目前served bundle 的精確關係 |
| holiday-lab/layout-qa/asset-safe-regions.json | collect／phase collector 讀 JSON，傳 sampleLayout({assets}) | 原08／當前／各真測 receipt 的逐 SHA 與完整 options 對應 |
| holiday-lab/layout-qa/browser-sampler.cjs | require sampleLayout→toString→browser evaluate | 函式 SHA／模組 SHA／凍結收據逐對應，不可拿 module SHA 冒稱 function SHA |
| holiday-lab/layout-qa/collect.cjs | 原 R0 執行方法，不應 served | 原 R0 原報告與該歷史 collector 的精確來源繫結；當前不能當新 phase collector |
| ui-art-manifest.json | build-review 呼叫 ui-policy，讀素材 hash／prompt／targets | 完整 manifest 查核、與原08 preflight 收據的可證界線 |

主控提的「source-provenance 既有報告／source-freeze-08／current-code」精確檔案尚未找到。已訊息回主控詢路徑；使用者要求暫停後不再搜尋。勿憑名稱補造路徑。原任務所述 runtime283=278common+5runtime-only 尚未逐檔獨立核出，因此維持 NO。

## 下輪第一件事

先核本檢查點與 SCOPE／紅測檔確實存在，再取得主控所指原 source-freeze/current-code 的精確路徑。建立本範圍 provenance.cjs 讓既有紅測轉綠，產 typed ledger：每項 original snapshot／current／served 分開，五個消費鏈各用實際 source 行／SHA／完整輸入回證；可隔離重建的 bundle/generator 只在本目錄子資料夾執行，不寫 root locale／.build-tmp／正式 build，不替換任何 server。之後唯讀獨立驗後續日文 18 capture 與舊140資料，具體列未重驗 case，不把舊新來源回填成相同。global 始終 false。

## 程序與禁止操作

本來源追溯任務沒有啟動背景程序或 browser；所有唯讀命令與一次紅測均已結束，無本任務程序需關閉。未啟新中秋工作；PID43892 是先前主控核准、目前由主控追蹤並負責安全停的 root-ui-04，本代理依明確指示**不操作、不停止、不重啟**。未 stage／commit／push／main／delete，未改 runtime／contract／sampler／原收據。
