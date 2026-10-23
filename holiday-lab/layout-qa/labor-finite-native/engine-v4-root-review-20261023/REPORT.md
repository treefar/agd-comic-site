# Labor engine-v4 獨立複核與受限校準工具

日期：2026-10-23。僅新增本資料夾；未改 v4、v3、產品、sampler、契約或舊證據。**v4 仍未閉合，不批准 full。**

## 實質發現

**P2：storage validator 未鎖定完整 checks 鍵集合。** `engine-v4/engine.cjs:23–28` 只要求非空布林物件及兩個指定鍵；`pass` 取實際保留的 Object.values。精準負例先用完整九鍵且 `safe:false/pass:false` 通過原 validator，再刪 `safe` 並改 `pass:true`，原 validator 沒有拒絕。`keyset-negative.test.cjs` 的「應拒絕」測試實跑 exit 1／Missing expected exception，原輸出完整保留。沒有為此修改原 v4，也沒有新增 v5。

這是 validator 的完整鍵集合缺口；目前已凍結 `native.cjs:23` 實際 producer 仍提供完整九鍵。不能因此宣稱舊原生資料有被刪 check，亦不能把 producer 目前正確當成 storage 缺口已修。full 前應處理；本輪受限 wrapper 另外明確守住該邊界。

實際九鍵為：`exact_dom, fixed_safe, font, full_range, geometry_clear, method_flags, safe, unclipped, viewport`。不是十項。

## 逐條 yes／no

| 驗收事項 | yes/no | 本次新證據 |
|---|---|---|
| v4 明確核 pass 等於所有現存布林 checks | yes（有鍵集合限制） | 實讀 engine:23–28；隔離原 30 tests 全過 |
| v4 已鎖定完整 native checks 集合，不能刪 false check | no | 上述 P2 新負例，exit 1；保留未閉合 |
| 原 sample flags 與 case flags 深等，method_flags 不可改稱 clear | yes | 實讀 engine:22、25；隔離 flags-laundering 與 pass-consistency 測試過 |
| native 先以原 inspectReport 取得 geometry，再納入 pass | yes（程式／工程） | native:23；未執行新 native，不冒充畫面驗收 |
| validator 核 geometry_clear 與保存的 geometry_errors 一致 | yes | engine:26–27；紅 geometry／false 保存與 resume 拒跳測試過 |
| validator 自行重算原始 geometry | no | 作者已明列此邊界；本 wrapper 另用原 policy 重算並深等，不改原 validator |
| 舊續跑 TOCTOU、flags 洗白、假 PNG 三項未退化 | yes（工程） | 位元組相同隔離鏡像 30/30，包含雙 OS Node 競態與完整 CRC／解壓故障注入 |
| 原凍結 v4／繼承 v3／sources／fonts／runtime 仍有效 | yes | bounded --preflight 真 loadFreeze/liveReceipts，原 freeze 精確 SHA；after receipts |
| 本輪已執行新 320×900／1440×1000 正常 UI | no | native 尚未批准；未開 browser、未建立 bounded-runs |
| 可批准 2784 全集／GLOBAL_BOUND | no | P2 未閉合且無本輪原生校準；所有輸出 full_project_approved=false |

## 隔離重跑，不寫凍結目錄

`setup.cjs` 將原 v4 17 份 CJS、domain／source snapshot／report store 與兩份既有真 PNG，共 22 份，逐位元組複製至本資料夾 `isolated/` 對應路徑。沒有改寫 CJS；SHA before/copy 相同記於 `isolated-source-receipts.json`，測試產物只寫隔離鏡像。

```text
node setup.cjs
files 22 / all_byte_identical true / source_writes false

node --test isolated/holiday-lab/layout-qa/labor-finite-native/engine-v4/engine.test.cjs isolated/holiday-lab/layout-qa/labor-finite-native/engine-v4/repro.test.cjs isolated/holiday-lab/layout-qa/labor-finite-native/engine-v4/pass-consistency.test.cjs
tests30-output.txt：tests 30 / pass 30 / fail 0 / exit 0

node --test keyset-negative.test.cjs
keyset-negative-output.txt：tests 1 / pass 0 / fail 1 / exit 1（預期揭露真缺口）

node --test bounded-guard.test.cjs bounded-plan.test.cjs
bounded-tests-output.txt：tests 4 / pass 4 / fail 0 / exit 0
```

上述短路徑從本資料夾執行；實際重跑由 repo root 帶本資料夾完整前綴。雙程序測試使用真 OS 程序與明示 synthetic PID probe；不是兩個新玩家採樣程序。沒有把合成資料當原生校準。

## 新受限校準 wrapper，僅供主控審碼

工具：`bounded.cjs`、`bounded-guard.cjs`；固定計畫 `bounded-plan.json`。每個 zh/en/ja × 320×900/1440×1000 context 各兩筆，共 **12**：原計畫可達 `[60,0,0]` 的 `labor-loads` 極值與 deadline 分支 `game-hint`。每筆保留原 target 的完整 ID、job identity、schedule、inputs、expected、DOM，沒有用 full collector 加 limit。

獨立 scope：`labor-v4-independent-bounded-calibration-12`。核准必須綁以下原值，且 `approved:true`、`target_count:12`；full scope 或其它筆數均拒絕。

```text
v4_freeze_sha256
c237fca824e8a00c4389770529564c06696f20f45f9087805a66a8298981845b
wrapper_freeze_sha256
ec5f8b567f40c628221808ca7542e6b0e7a320dcac1b0e36e1c59814745f3b3e
plan_file_sha256
0de468bba6f974aff9e6ff452acacfa90c673f4c56f2fb10c5651cab61e2f19d
```

`bounded-freeze.json` 綁所有本目錄 CJS、原 v4 完整 binding digest、計畫 raw/canonical SHA 與九鍵。`--preflight` 每次核原 freeze／其繼承方法與 runtime、30 served body receipts、雙字型，以及本 wrapper code/plan。

Native module 只在專用核准通過後載入，使用原 `createNative` 正常操作、不改 state/text/時鐘。所有 captured case/sample/fullnodes/blockers/PNG/CDP fonts/source before-after 交原完整 shard store 保存；wrapper 再鎖完整九鍵、各 bool、完整 pass 公式、原 flags 深等、原 policy geometry 深等與各 check 原算式。`pass:false` 是保存的有效診斷結果，不能改為 true 或在摘要隱藏；可在同一 bounded 程序繼續下一個預定 target，但沒有 retry/resume/skip。任何語義或證據不一致則留原 reject 證據並停止。fresh-run 目錄若存在直接拒絕，不可用已完成案例補數。

```text
node bounded.cjs --prepare
exit 0（只建固定 plan/freeze；已執行，不可重做）
node bounded.cjs --preflight
exit 0 / pass true / target_count 12 / browser_started false / native_started false
node bounded.cjs --execute
exit 1 / explicit bounded approval required before preflight/browser
bounded-runs EXISTS=False
```

**下一個具體動作**：主控唯讀審查本 wrapper、P2 負例及新 freeze。若接受受限 scope，再由主控寫專用 approval，執行 `node bounded.cjs --execute <approval.json> <唯一新run名>`，只取得這十二筆新正常 UI 校準。它們對 2784 全集與任意字型全域定理的 credit 均為零；必須另外檢視真 PNG、原 flags/false 及故障紀錄。尚未寫核准，尚未執行。

本輪不繼續擴大 fixture 或重做原 30 測試的既有審查；未 stage、commit、push、動 main、刪檔或操作 Unity。
