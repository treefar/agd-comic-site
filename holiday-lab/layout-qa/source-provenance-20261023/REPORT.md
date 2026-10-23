# 來源、建置輸入與服務輸出追溯

2026-10-23，source_agent: codex。本報告只解除有實際證據的來源追溯問題；`global_approved=false`。未改產品、sampler、contract、舊收據、官方 R0、coverage，也未建立或取代伺服器。

## 逐項結果

| 可判定問題 | YES／NO | 實際證據與界線 |
|---|---|---|
| 原08與目前來源分開？ | YES | ledger 283 筆 original 是舊 receipt claim、current 是現讀 bytes。282 SHA 相同；唯一 new-year.mjs 不同。原08從未回填。 |
| runtime283等於contract283？ | NO | 遞迴 build08/holiday-lab 實算283；兩集合共同277，runtime-only六個 audio，contract-only是 holiday-home.css 加五個非served inputs。membership.json 保存全部路徑與逐檔 SHA。 |
| contract同路徑 served278有依據？ | YES | 舊HTTP receipt278均與現存build08位元組相符，含build根目錄holiday-home.css；不能把278誤說成上述subtree集合交集。這是歷史HTTP證據，本輪未重發HTTP。 |
| 五個非served inputs 是同一種「compiled」？ | NO | ledger 分別標成 compiled-SSR-client、QA options、QA serialized function、historic QA entrypoint、preflight policy。每筆消費程式均已實讀。 |
| holiday-home 真generator可執行？ | YES | 隔離複製55個實際輸入，原封不動執行scripts/build.mjs；13 SOURCES、兩個翻譯generator、data/catalog均入列；exit0，37輸出，原輸入SHA未變。 |
| 可重現原08整包？ | NO | 隔離client bytes與08不同；未取得所有原08generator輸入的完整凍結副本，不能由單支holiday-home相同推論整包相同。 |
| 隔離產物與後續現存build有等價證據？ | YES，限範圍 | 隔離app-AACGKXYS.js SHA `ab16d49c430c55f12ebda41a56c62e9918b20b0bd14bb11929b1535f81533a7b` 與build11/app-TQ4G6C6Y.js位元組完全相同；08/10不同。名稱不同仍逐內容驗，不以名稱推定。 |
| SSR HTML原始位元組等同？ | NO | 各build的script檔名不同；只將`app-[A-Z0-9]+.js`替換成明示固定token後，HTML與08/10/11均相同。這是明確轉換後等價，不是原始SHA相等。 |
| 兩翻譯generator完整執行？ | YES | build stdout：Translations2315、Static candidates26、Unpaired paths21、Japanese2344。generated locale-en/ja各自與目前root同名來源SHA相同，詳build-analysis.json。 |
| QA module SHA等於function SHA？ | NO | 模組`0346d1…`、序列化函式`c24764…`分欄。phase-collect實際把`sampleLayout.toString()`與assets傳入evaluate；本輪未執行collector。 |
| 全部歷史QA captures都有完整method/options綁定？ | NO | phase collector有module/options/function欄位；R0 collect明示PRE_FREEZE_R0_ONLY且source_fingerprints空白。不能拿目前phase collector當舊collect，也未替每張舊capture補造當時method receipt。 |
| manifest目前preflight可通過？ | YES | 複製原ui-policy碼到本目錄，inspectProject只讀執行pass。查generator metadata、asset SHA、prompt存在、ui_targets與screens；不是美術或使用者確認。 |
| manifest原08preflight執行已證明？ | NO | 沒有原08實際preflight收據，不以目前政策通過回填歷史。 |
| new-year改動精確到內容？ | YES | build08對current逐字比較：只第64行scene0 JA focus `軽やかに越える` → `軽く跳ぶ`。第5行BRIEFS同詞未變；新短詞只影響第1幕replay三鏡。 |
| 後續JA native18既有證據本輪獨立重驗？ | YES，限範圍 | 原兩run raw before=after=current+build10、function SHA、18張JPEG SHA、sample起終鏡號、capture前後鏡號、geometry0全部核對。另核兩寬各9個native觀察鏡，140ms鏡1/7有多個可見且移動的原始觀察影格。未重跑browser。 |
| 舊min140 raw六列可改稱pass？ | NO | 原native_pass0、六statusfail保留；每列summary聚合在已有9 stable samples後發生TypeError(undefined.length)。未改raw，也未將其54samples整批重新驗成PASS。 |
| 新source全部new-year case已驗？ | NO | contract與v4均有138個new-year required/selected；現有18張是兩寬、JA、單一launch ending與固定timings的replay。不是其他focus/timing、三語、intro/control/result/error、normal/reduced-motion與所有字型的全面驗證。 |
| 缺path／相同內容冒認served regression有效？ | YES | 真RED：相同bytes的unrelated檔冒稱原build檔，驗證器未拒絕；修正expected build path後GREEN。另涵蓋traversal、missing、wrong SHA、wrong bytes、original mismatch、重複file、三身分分開。 |

## 五項消費鏈

1. `holiday-home.jsx` → build.mjs SOURCES串接 → SSR及client esbuild。隔離原generator已跑；靜態images未複製，build-review allowlist未跑，故不宣稱完整可發布包。CLI說明與全部55input/37output SHA在isolated receipt。
2. `asset-safe-regions.json` → phase-collect讀JSON並記asset_map_sha256 → browser evaluate的assets options。collect也讀同檔，但R0和新phase不可混。
3. `browser-sampler.cjs` → require取得sampleLayout → phase collector序列化function source。函式讀options.assets並對實際UI紙面素材做receipt，不是玩家runtime本體。
4. `collect.cjs` → R0入口，以p.evaluate(sampleLayout,{assets})量測；原始輸出缺凍結fingerprints，不能後補「當時就是這份」的保證。
5. `ui-art-manifest.json` → build-review呼叫外部ui-policy → inspectProject讀asset/prompt/targets。它是preflight輸入，無同路徑served output，不需假造bundle映射。

## 已執行命令與輸出

命令均在 `C:/agywork/agd-holiday-prototypes` 執行。

```text
node --test holiday-lab/layout-qa/source-provenance-20261023/provenance.test.cjs
初始：Cannot find module './provenance.cjs'，exit1（原紅測）
新增source-path回歸：tests3 pass2 fail1，Missing expected exception，exit1
修正後：tests3 pass3 fail0，exit0

node holiday-lab/layout-qa/source-provenance-20261023/reproduce-build.cjs
exit0，source_inputs_unchanged=true，inputs55，outputs37
原build warning保留：Duplicate key "color"（SSR/client各一次）

node holiday-lab/layout-qa/source-provenance-20261023/audit-native.cjs
pass=true，selected18，native_widths2，exact_diff_one_JA_phrase=true
old_raw_failures_preserved6，global_approved=false

node holiday-lab/layout-qa/source-provenance-20261023/build-ledger.cjs
verification pass=true，inputs283，references1284，global_approved=false
manifest=true；membership277 common／六runtime-only／六contract-only

node holiday-lab/layout-qa/source-provenance-20261023/provenance.cjs
唯讀核ledger的所有現存bytes/path與原receipt關係；不改ledger或任何原始證據。
```

## 剩餘NO與下一步

- 原08完整generator輸入快照缺失，因此原08app等價仍NO。可保留歷史輸出SHA，但不可把現在重建的bundle SHA回填。
- 本輪沒有新的HTTP、browser/native測試或人工畫面檢視，現存build11只證bytes，沒有新served run。
- 目前JA18可支援「短caption在固定條件下的原生replay幾何與來源」；其他contract focus/timing/width尚無對應短caption證據者需重測。嚴格current-source驗收仍需重驗受影響result/replay與三語必要狀態，08的138選項繼續綁08來源，不全面移轉。
- 所有全域layout、coverage、font、內容、美術、使用者確認仍由原gate決定；本工具與文件從未置為true。

所有新檔只在本白名單，未stage／commit／push／delete。既有來源、capture、contract、sampler、ledger、official R0均未改寫。
