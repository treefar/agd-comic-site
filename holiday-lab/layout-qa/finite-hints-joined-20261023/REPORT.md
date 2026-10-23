# 24 組窄版有限錯句證據 adapter

已產生 24 個嚴格 typed canonical candidates，驗證器實跑 exit 0。範圍僅八款遊戲正常 UI 可達的有限錯句與明列 secondary 全文；`numeric_domain_proven:false`、`full_project_approved:false`。國慶未證動態 readout 完全排除。

## 成果

- `canonical-candidates.json`：24 個 320×900 candidates，各中英日；19 個採新原 case、5 個採舊可見 secondary 原 case。每個完整保留原 ID、inputs、nodes、blockers，沒有合併畫面。
- `audit.json`：50 finite keys、150 真拒絕分支、165 新 fullcases／PNG、81 舊 secondary，共 246 owner 收據。來源、原 phase／intent、全部 inputs、完整 Range、未裁墨跡、固定紙框、viewport、CDP 字型逐筆核對。
- 各 context 的 width／height／area／left／right／top／bottom 極值分開保存。代表達實測完整 context 最大面積；另對照原 static1..4 的 24 個窄版最大面積，24/24 精確相同。`old-maxima-comparison.json` 保存實值，驗證器禁止用較小新子集取代原最大值。
- `SCOPE.md`：範圍與完成條件；原窄版 visibility audit 的 NO 仍原封保留，只有新 typed proof 表達本次補證。

## 驗收

| 項目 | yes／no | 實際輸出／限制 |
|---|---|---|
| 固定最新原 verification | yes | 日期精確 `2026-10-23T03:45:53.289Z`，SHA 綁定；未重跑原 verifier |
| 八款原 finite catalog／guards | yes | 原 exact audit、served snapshot AST 三語 literal、原 guard／runner 原文逐筆核；來源檔案 SHA 全綁 |
| 24 contexts／150 branches 無少漏或重複 | yes | `audit-output.txt`：24／150 |
| 165 新 fullcase／sample／PNG | yes | 原 nodes／blockers／flags 全值、PNG SHA 與 320×900 尺寸逐筆 |
| 81 舊 secondary 真可見且與新拒絕對得上 | yes | 原 raw[index]／fullcase／全部 inputs、phase／intent、source、owner 全文、實際 CDP、safe／viewport、sample／原圖 SHA |
| 每個 candidate 本身達完整 finite context 最大 area | yes | 24/24；七項極值另存，不以字數代替墨跡 |
| 跨鏡／跨 run 可視為同一張畫面 | no | 各 owner 保留原獨立 viewport、原圖與原 inputs；僅以明確 typed receipts 連結 |
| 原 method flags／不可見 audit 被清除 | no | 原資料全只讀；新原 sample flags 與原 c 一致，不以本次結果覆寫舊 run |
| 全數值玩法域或官方整案 gate 通過 | no | 只證有限 literal／secondary domain；整案仍 NO |
| 使用者已確認畫面／美術 | no | 未宣稱玩家確認 |

## 實際命令

```text
node holiday-lab/layout-qa/finite-hints-joined-20261023/adapter.cjs
node holiday-lab/layout-qa/finite-hints-joined-20261023/candidates.cjs --verify
node --test holiday-lab/layout-qa/finite-hints-joined-20261023/adapter.test.cjs holiday-lab/layout-qa/finite-hints-joined-20261023/candidates.test.cjs
```

`audit-output.txt`、`verify-output.txt` 實際 exit 0；`tests-output.txt`：6 tests、6 pass、0 fail。負例涵蓋：少 context／branch、phase／intent／完整 inputs 不同、舊不可見 owner、缺 viewport 維度、錯全文／字型、原 method flags 被替換、nodes／圖片／來源替換，以及假升格 numeric scope。初始缺模組的真紅保留於 `red-output.txt` 和 `candidates-red-output.txt`。

第一次 audit 嚴格比對發現 collector 的 reuse receipt 在 plan 之外另有 `joined_by`、`new_rejection_identity`、`new_rejection_inputs` 三欄；原失敗輸出保留於 `initial-audit-mismatch.txt`。目前逐 plan 原欄完整比對，再把三個新增欄位逐值核對，未略過它們。

沒有開新瀏覽器、操作 UI、啟動或重啟 collector；沒有改產品、舊 proof／audit／eligible、sampler、map、契約、root index／assembly；沒有 stage、commit、push、碰 main 或刪檔。後續由主控獨立審核後決定是否接入索引。
