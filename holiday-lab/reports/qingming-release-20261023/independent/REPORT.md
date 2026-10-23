# 清明新 domain 方法獨立審查報告

source_agent: codex

2026-10-23。結論：**來源域準備方法可採認；原生 UI 上界仍未證，error-longest 不通過。** 本代理沒有啟動 browser／HTTP、改產品、舊方法／raw、canonical、正式合約、main、C 節或勞動節，沒有 push／刪檔／build。

採認的準備收據：`../domain/preparations/2026-10-23T10-11-30-237Z/`。本輪來源／方法測試與唯讀核對輸出，均存在本目錄。這份結論不授權原生執行器啟動。

| 審查項目 | yes／no | 實際證據與界線 |
|---|---|---|
| 當前 game／runner／catalog／CSS／contract 五來源逐筆綁定 | yes | 作者固定 SHA；獨立 `current-source-audit.json` 另讀來源並核對相同 SHA；五種漂移負例各自拒絕 |
| 來源狀態域推導可重現 | yes | 213 分軸候選值、211 不重複 anchor、11 合法模式、22 audio recipes、6 context；錯誤在 phase0/1/2 的實際 mount callback 模型皆可到達 |
| 模擬明確與原生 UI 區分 | yes | `browser_witness=false`；runner pause/audio 為來源模型，dt=.1 callback 為純測試，不是 browser 操作或原生序列化 |
| 字數、任意容差或舊 credit 用來宣稱最長 | no | 新方法將 ink、font、safe、row、y-offset、scroll、完整 DOM／PNG 列待證；`historical_credit_transferred=false` |
| 213 值足以直接批准所有聯合布局 | no | 因果只證文字相依；232/context／1392 是條件候選，layout_factorization=false |
| 所有 owner 已完整列為後續義務 | yes | 來源預期 28 個；明列須真 DOM census，不得只驗六個 target；未知／缺 owner 必須停止 |
| 每次狀態後重等字型 | yes | 最新計畫要求 force layout → fonts.ready → loaded → Range/ink/CDP/PNG，取樣前後核穩定；尚未實作／執行 native collector |
| 同 valid-plan guard 的正反例有效 | yes | 作者 7/7；獨立 13/13。正例先通過，來源漂移、重值漏值、非法模式、缺 owner、假 native/layout/canonical、inert 操作均拒絕 |
| 最新 freeze 與方法、來源、支持檔 SHA 相符 | yes | 新 readonly `verify-preparation.mjs` 真 exit0：3 method、5 current source、10 support；plan 重算完全相同 |
| 字型／數字／所有 owner 的實際墨跡上界已證 | no | 無新 native run，沒有 Range/CDP/platform font/完整原生 PNG／捲動資料 |
| 原生執行或公開上線已批准 | no | native_launched、all_owner_upper_bound_proven、error_longest_closed、canonical_eligible、full_project_approved 均 false |

## 實際指令與結果

repo 根目錄：`C:/agywork/agd-holiday-prototypes`。

```text
node --test holiday-lab/reports/qingming-release-20261023/domain/domain.test.mjs
tests 7
pass 7
fail 0
skipped 0
EXIT=0

node --test holiday-lab/reports/qingming-release-20261023/independent/review-domain.test.mjs
tests 13
pass 13
fail 0
skipped 0
EXIT=0

node holiday-lab/reports/qingming-release-20261023/independent/verify-preparation.mjs holiday-lab/reports/qingming-release-20261023/domain/preparations/2026-10-23T10-11-30-237Z
{"pass":true,"scope":"source-plan-preparation-review-only","preparation":"C:\\agywork\\agd-holiday-prototypes\\holiday-lab\\reports\\qingming-release-20261023\\domain\\preparations\\2026-10-23T10-11-30-237Z","plan_sha256":"f6b4e3d72f2690a2ce569cf69f7e9217fec3887c84fe047fcf59eb97646dfee5","method_files":3,"current_source_files":5,"support_files":10,"contexts":6,"candidate_axis_strings":213,"source_model_recipes":22,"native_launched":false,"all_owner_upper_bound_proven":false,"error_longest_closed":false,"canonical_eligible":false,"full_project_approved":false}
EXIT=0
```

完整輸出：`author-v2-output.txt`、`independent-v2-output.txt`、`verify-preparation-v2-output.txt`。`offline-test-receipt-v2.json` 保存當次 before／after method SHA 與命令退出碼；方法在審查期間完全相同。可讀結果在 `verification.json`。

最新作者 domain.mjs SHA：`abcc161f80c0b946c58af56f8e67681fce4b3046c41e3f92d951cf87888ac482`。domain.test.mjs SHA：`e3b7a68fdc7d2128f79eeeb36d732c6f34b15eb86a9a002f7fb8626c1e8037f6`。prepare.mjs SHA：`b881c8139c43d9f63ed6123402f78d9ae7a2920d6114d31e55209204c0423b03`。

## 保留的真失敗

作者依審查補上 font-ready 原生義務後，舊準備 `10-09-57-042Z` 的 plan 與新方法不再相同。獨立 readonly 檢查真 exit1：`plan differs from current pinned source domain`，差異正是新增 font-ready invariant。原輸出保存於 `verify-preparation-output.txt`；舊準備不修改，也不能升格成通過。這是方法漂移保護的真 RED，不是原生遊戲失敗。

之後作者另產 `10-11-30-237Z`，獨立重跑 7+13 測試與 readonly，才得到本報告的 source-plan-only GREEN。首批測試的 method SHA 與輸出也保留，不與後批混用。

## 哪些原生證據才夠

完整規格與負例見 `PLAN.md`、`NEGATIVE-REVIEW.md`。核心要求如下：

1. 213 分軸候選 ×6 context，逐值保存原生 input/output 字串；每 context 正反 stepper 420 次須與候選一致。1278 個 direct 與2520 個 stepper 的計數本身不代表墨跡覆蓋。
2. 在正常原生控制下到 phase0/1/2 的 missed-window；各合法 hint/pause/audio 模式的全 owner 需真 witness 或精確來源＋原生不變性證明。原生之前的 pure recipes 不給這項信用。
3. 只有 output/row/group/controls/paper、全文行框、實際平台字型、安全區及其他 owner 相對布局的必要不變項精確成立，才可做分軸化約。hint/toolbar 的 y 位移與 controls/window 捲動另列，不能用 .01px 容差或只比四個尺寸。
4. 每個墨跡觀察對應原始完整 DOM／sample／blockers／flags／同張 viewport PNG；不能裁掉非 target、清 hidden_scroll_text 或合成新 DOM。每段內容正常捲動後完整可讀，來源、字型、診斷與擷取前後身份一致。
5. 每 owner／語言／viewport／適用布局重算 unclipped ink 的寬、高、面積與四邊極值，保留 ties 與真 witness。不能跨 owner／phase／語言借最大值，也不能把不同 frame 的極值拼成不存在的畫面。

目前真實缺少的是上述原生正規化、分離、全 owner、可見性與極值證據，不能靠再加純測試補完。尚未觀察到必須改產品的實際缺陷；若後續原生校準出現精確差異或字被裁切，應保留 exact context／owner／值／幾何與原圖，再由主控判斷產品更動。這一階段不應直接啟動百萬組 QA。
