# 有限錯句合併證據：和平紀念日、光復節

目前：12 組有限文字域已由原始資料逐筆驗證；主控審讀來源與 trace 後允許產生 12 個嚴格 typed canonical candidate，供後續獨立審核。不是官方 gate、所有數值排列認證或全站通過。

## 範圍與來源

- 僅本目錄新增程式、測試、報告與收據；未修改產品、sampler、契約、map、舊報告，未開瀏覽器、重啟 collector、stage、commit 或 push。
- `static-error-max-5`：和平紀念日 478 舊 sample／原圖、603 owner rows；光復節 414 舊 sample／原圖、522 owner rows。原 raw full case、原 `.case.json` 與 `raw.cases[index]` 全值比對。
- `finite-errors-native-20261023/runs/run-01`：12 contexts、30 branches、60 原 PNG／sample。每個分支的 hint 與 secondary 是兩張正常捲動的獨立 viewport，並非同一張畫面。
- `inventory.json` 保存輸入路徑與 SHA；`trace-evidence.json` 保存逐分支事件界線；`joined-verification.json` 保存全部來源、原 sample／圖 SHA、owner 全文／Range／safe／實際 CDP 字型、各方向與寬高面積極值。

## 逐項驗收

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 原來源前後、舊新來源與 frozen sampler／map 相同 | yes | `join-check.cjs` 逐鍵 assert，原 SHA 保留 |
| 892 舊 fullcase、sample、原圖皆依原 ID／index 查證 | yes | `join-output.txt`：478 + 414 |
| 60 新 sample、PNG 尺寸與 SHA、完整 nodes／blockers | yes | `join-output.txt`：60 |
| 每個使用的 owner 全文 Range、未裁墨跡、固定紙框、viewport、scroll 收據 | yes | 1185 rows 全核，其中 868 可見且 safe；317 舊不可見 rows 保留但不升格 |
| 實際 CDP 字型及 computed profile 逐 owner／語言／寬度相同 | yes | 舊原 node 與新 target 的實際 face 比對；glyphCount 不拿來要求不同句子相同 |
| 12 組正常 UI 可達有限文字域 | yes | `contexts[].coverage`；和平 status-initial 僅 reference、不納拒絕極值，光復 far／close／ready 均涵蓋 |
| 30 分支、60 capture 的正常 UI trace 完整 | yes | `trace-evidence.json`；輸入 fill 後實際 inputValue assert，再記值，原輸出數字逐項佐證 |
| 新 fullcase 自帶直接 DOM inputs snapshot | no | 原資料沒有 inputs；不新增、不改原 case，另附 derived evidence |
| 原 collector 執行當時 SHA | no | 只有本次 join-time collector source 指紋；未捏造原 runtime 收據 |
| 本次嚴格 typed canonical candidate 已產生 | yes | 12；僅新 wrapper 在有限 literal scope 為 eligible=true，原 static5 的所有 NO 保留 |
| 玩家美術／日文尾行確認 | no | P3「に。」短尾行保留，未宣稱使用者確認 |

## trace 的精確語意

和平每個 context 四個拒絕分支均核到：duplicate-recorded、clipped-rejection、duplicate-clipped、duplicate-listening。正常操作先記錄第一位聲音，再操作另一位，選回已聽者觸發 duplicate。最後一支選人 handler 已停止 listening、重設 progress／active，但保留 listening 狀態字串；本報告只證明字串可達且完整呈現，不稱仍持續播放聲音。

光復節每個 context 使用第一幕 x=-8、y=5、rotation=0、scale=1，按 Save，核完整 anchors hint 與 close secondary；數值由完整事件 prefix 對來源 defaults／handler 推導，附原 nodes 數字輸出，沒有把 derived 值寫回原 c。

每張 capture 都被上一個 UI 事件與下一事件的實際 native timestamp 夾住；兩張 owner 畫面期間，原 before／after identity 全文相同。collector 靜態來源未見直接改 draft／game state／時鐘或 hint 文案的呼叫。這些是對現存原 collector 原始碼和原事件收據的核對，不冒稱額外當時錄影或不存在的輸入快照。

## 重跑

```text
node holiday-lab/layout-qa/finite-error-joined-20261023/inventory.cjs
node --test holiday-lab/layout-qa/finite-error-joined-20261023/trace.test.cjs holiday-lab/layout-qa/finite-error-joined-20261023/geometry.test.cjs
node holiday-lab/layout-qa/finite-error-joined-20261023/join-check.cjs
node holiday-lab/layout-qa/finite-error-joined-20261023/candidates.cjs --verify
node --test holiday-lab/layout-qa/finite-error-joined-20261023/candidates.test.cjs
```

已實跑 join-check exit 0：contexts=12、required_finite_text_covered=true、legacy_samples_images=892、native_samples_images=60、owner_rows=1185、visible_safe_rows=868、canonical_candidates_emitted=0。初次缺模組的真紅輸出保留於 `trace-red-output.txt`；後續測試輸出另存，不覆蓋原紅。

上列 join-check 的 0 是產候選前的 audit 階段狀態；`inventory.json` 也保留該盤點時點，不冒稱當時已產候選。後續主控允許後執行 `candidates.cjs`，另產 `canonical-candidates.json`：12/12，`verify-output.txt` 實際 exit 0。驗證器強制精確 input SHA 集合、原 raw/index/fullcase/全部 nodes 與 blockers、原 method flags、sample／PNG、原 events／branch digest、derived inputs／全文 coverage／各極值一致。14 個回歸測試全過，包含遺漏／重複 context、漏來源 SHA、升格 numeric/global、竄改原 inputs／nodes／blockers、換 source／PNG／sample／eventlog／secondary proof。

每個 candidate 均保留 `direct_dom_input_snapshot:false`、collector 指紋僅 join-time、`numeric_domain_proven:false`、`full_project_approved:false`；`full_original_case` 和原 native case 逐值相同。`finite_literal_context` 仍保存產 wrapper 前未升格的原 audit record，該 record 不被改寫；只有外層 typed wrapper 表達本次獲准的有限文字證明範圍。兩張 owner 原圖透過原 branch 連結，不混成同一張畫面。

極值採實際墨跡寬、高、面積、左／右／上／下分列。各方向絕對文件座標會隨正常捲動改變，本報告不把它解釋成所有玩法數值排列的全域定理。原 method flags、原 static5 eligible=false 全部保留。
