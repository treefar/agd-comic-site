# 國慶動態讀值：有限域／原生先導報告

結論：本次先導通過；全域最大文字安全證明仍為 **NO**。未啟動全集，也未把國慶六組 error-longest 改為可採認。產品、凍結 sampler、安全框與既有報告沒有修改。

## 實際來源與有限域

固定 `http://127.0.0.1:8845/holiday-lab/` 的 08 來源；各檔前後 SHA 在 `domain.json` 與兩份原始 report。`domain.cjs` 讀 served module 的 AST 模板及純規則；不用手寫近似文案。

- camera：整數 -20…20；fore、mid、far：整數 -30…30。三幕目標逐筆取實際 tasks。
- 同一 camera 同時影響海岸、山與視線；以實際 frame 計算每個 camera 的 61 個海岸值、61 個山值，不能任意拼接各欄聯集。
- 每個 camera 都有真 fore 見證可到 clear 與 blocked；order 不在讀值文字內。camera 及各幕目標值保留於文字，可分辨跨 camera／跨幕字串。
- 每語言完整讀值為 `3 × 41 × 61 × 61 × 2 = 915,366` 個；三語兩寬共 5,492,196 次原生量測。這是來源模型計數，未實際列舉／測完全集。
- 海岸聯集 161 值、山聯集 341 值，都為 NN.N 格式；camera 有四種符號／位數形式。這只是語法分類，**沒有宣稱等寬、換行或墨跡等價**。

## 真頁與技術 clone

10 組真頁皆由合法 slider／真正 capture／前幕成功操作到達拒絕狀態；涵蓋三語、320／1440、三幕、正負 camera、兩種視線後綴。完整 recipe、原始文字、實圖與來源列在 `pilot-01/report.json`；10 張 `true-*.png` 的 SHA 列在 `verification.json`。

clone 先載入同 origin，再複製原 `#lab` 完整祖先、控制紙框、生成 panel、CSS、語言與捲動位置。標題明列技術探針，不是玩家畫面；不改真頁 hint、不改字型或 safe。使用凍結 sampler 原函式與 asset map，函式／map SHA 均驗證。

10 組 actual／clone：逐項 computed longhand、CDP 實際字型、owner 尺寸、完整行文字／baseline／advance／ink、原 safe／panel 來源全吻合，geometry delta 為 0。比較允差 0.05 CSS px 僅供量化診斷；此結果只是 10 組實證，不是所有字串的等價定理。

## 原始失敗與續測

`pilot-01` 完成 10 真頁對照與 zh/320 的 10 個效能候選後，遇到沒有 id／owner 的捲動祖先，記錄 `Missing cloned scroll ancestor`。原 catch 沒設 process exit code，因此當次退出碼 0 **不能當作整份通過**；原 fatal 與輸出完整保留。

補上只用於 clone 定位的 DOM 結構 selector 後，`pilot-02 --reuse=pilot-01` 驗原 SHA、來源及已成功 receipts，續做其餘 50 個候選，沒有重跑前 10 真頁或 zh/320。後續 catch 已設非零退出碼。所有 10 真頁、10 clone、60 技術候選的 80 筆 owner receipts 均全文完整、無裁切、墨跡在原安全框內。

## 成本與限制

每語寬只測 10 個來源合法候選，共 60，未超過 1000 上限。原 full-frozen 方法約 8.36…10.42 筆／秒；按六組各自短樣本速度順序外推約 173.89 小時（7.25 天）。這不是持續長測或工期保證，尚未含長跑 I/O／失敗成本。依主控指示停止此慢方法，等待經獨立對照的 ink-only 小先導，不開全集。

仍未證明所有動態 `#island-readout` 數值與 blocked 後綴的全域最大墨跡／安全界。沒有以字數、數字等寬、格式類或 outline＋1px 推成 PASS；既有國慶 supplement-only 六組維持原狀。

## 驗收與實際輸出

| 驗收 | yes／no | 證據 |
|---|---|---|
| 來源模型與耦合數值域已落地 | yes | `domain-output.txt`、`domain.json` |
| 10 組真 DOM／同源 clone 全吻合 | yes | `true_dom_clone_matches: 10` |
| 僅 60 個 bounded 技術候選 | yes | `bounded_native_probe_candidates: 60` |
| 80 筆全文／墨跡在原 safe 內 | yes | `all_80_owner_receipts_complete_unclipped_original_safe: true` |
| 來源前後 SHA 穩定 | yes | `source_stable: true` |
| 原首次失敗／原圖保留 | yes | `pilot-01/report.json`、PNG SHA |
| 全域上界已證明 | no | `global_bound_proven: false` |
| 已啟動全集／全案批准 | no | `full_universe_started: false`、`full_project_approved: false` |

實際命令及完整輸出見各 `*-output.txt`：

```text
node holiday-lab/layout-qa/national-readout-finite-native/domain.cjs
node holiday-lab/layout-qa/national-readout-finite-native/pilot.cjs pilot-02 --reuse=pilot-01
FINISH trueMatched10 pilot60 sourceStabletrue GLOBAL=NO
node holiday-lab/layout-qa/national-readout-finite-native/verify.cjs
```

`verify-output.txt` 為離線逐項重驗實際 JSON 輸出；驗證來源／原 raw SHA／原圖 SHA／計數／全文與 safe，沒有開新 browser。此目錄不能替代 canonical error-longest 全域證據。
