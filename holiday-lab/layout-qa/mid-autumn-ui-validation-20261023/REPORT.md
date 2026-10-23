# 中秋真 UI 對照工具交付與首筆失敗

## 當前工具 freeze04，主控另行核准 root-ui-04 已啟動

主控確認首筆為工具假紅後，明確指定改以**完整 nodes＋完整 blockers** 執行原 inspectReport，保留所有幾何約束。本包只改 scope.cjs 該投影並加入原真 fullsample 回歸；原 root-ui-03／freeze03／failure 原樣保留。freeze03 因方法更新已失效，不得再核准或 resume。

- 當前 `freeze-04.json` SHA：`55ef47dc52f9a1ff8ca36157cc3649aff64566b1b9495a26ee9da2bea7b52ab6`。完整 783 工作／810 obligations 計畫不變。
- full-graph-red-output.txt：原真 sample 原投影確實 42 假紅，測試 exit1。
- tests-04-output.txt：20 tests／20 pass／0 fail。原真 sample 完整引用圖為 0 geometry；另外故意移出安全區、縮窄裁框、加入真遮擋三負例仍全拒。
- freeze-04-check-output.txt：B.load＋30 live HTTP bodies／兩字型核對 exit0。
- 主控已另行核准 root-approval-04.json（SHA `8262fb3dc71f189165873a5bc2430d21048a65e324afc29abb41576a8008ba8c`）。root-ui-04 唯一啟動：driver PID 51568／creation `2026-10-23T04:51:44.9917850Z`，runner PID 43892／creation `2026-10-23T04:51:46.2473260Z`，工具 session 46854。這是工具修復後的**顯式新授權**，不是自動 retry，不覆寫第一次失敗。
- 最新初段：首筆 index43468 與第二筆65531 均完整 append 後 pass，stdout completed=2／783，stderr 空，尚無 terminal。實際動態進展以 launches/root-ui-04/stdout.log／stderr.log／terminal.json 為準；本報告不是全批完成收據。

當前精確查核命令（根目錄；不開 native）：

```powershell
node -e "const B=require('./holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/binding.cjs');const f=B.load('./holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/freeze-04.json');B.receipts(f.binding).then(r=>{require('node:assert/strict').deepEqual(r,f.binding.source_receipts);console.log(f.sha256)});"
```

主控已寫 `root-approval-04.json`，approved=true、scope=`mid-autumn-ui-full-frozen-v1`，精確綁 freeze04 SHA／freeze-04-check-output.txt 內 binding SHA／同一 plan SHA、maximum_native_jobs=783、single_headless_job=true。本包沒有自行建立核准。以下是**已執行一次的當前命令，禁止再次啟動同一工作**：

```powershell
node holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/driver.cjs --freeze=C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/freeze-04.json --approval=C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/root-approval-04.json --run=root-ui-04
```

以下保留 freeze03 初次交付與失敗的歷史時點；不能將其舊核准或示範命令套用到當前工具。

本包完成固定 08／8845 計畫、完整凍結、分片儲存、故障測試與單次啟動 driver。主控審碼、19 tests 與 live receipts 後核准 freeze03，已執行唯一 root-ui-03；首筆正常 UI 已取得 full sample／PNG，因下述工具缺陷於 04:49:38.302Z terminal exit 1。**未重啟、未改凍結程式、783 工作尚未完成，未批准全域或發布。**

## 最新實際執行

- 主控 root-approval-03.json SHA `d0e1db0afe3e75b617f83dcdcd3112eb4ea7c21861912c0efcfc0ba2439df2bf`；launch_count=1。
- driver PID 67924／creation `2026-10-23T04:49:26.5504520Z`，runner PID 39868／creation `2026-10-23T04:49:27.7448830Z`。啟動時 CIM 均 present，實際 terminal exit 1，不是 timeout。
- 首筆 `mid-autumn/zh/320x900/source-index-43468`、phase 1、輸入 time=650／x=0／size=17。原 N.compare=[]；原 flags=[]；全份 inspectReport geometry_errors=[]。文字、完整 Range、安全框、viewport、來源、雙字型、輸入及 phase 等檢查全 true。
- 唯一失敗 `target_geometry_clear=false`：本包 targetGeometry 只提供 hint node，卻保留 blockers 原 own_text_ids；完整 policy 因 42 個其他文字引用不在 hint-only nodes，判『底圖關聯到不存在文字』。這是本包投影方法缺陷，不能當玩家文字碰撞，也不能清掉原資料改成 pass。已回主控，等待新方案／新 freeze；本輪未修改任何凍結程式或重跑。
- 完整第一 case/sample/shards/PNG 存 `runs/root-ui-03/records/000000/`；attempt／failure／journal／checkpoint 原樣保留。`first-native-failure.json` 存精確 case ref SHA、全部 checks 與 42 errors。有效完成數為 0；一筆失敗已保存，不得當完成並略過。
- `launches/root-ui-03/{launch.json,stdout.log,stderr.log,terminal.json}` 是實際程序紀錄。以下『未執行』說明指核准前工具交付時點；以本節最新實況為準。

## freeze03 歷史時點：固定版本與範圍

- 根驗證：`verification-2026-10-23T04-25-44-378Z.json`，SHA `79cfb47fba92eedaa312dc5c65c7af7efe18df947d58993d68ac4e827c809da5`，404688／404688、缺 0、native_universe_complete=true；這不等於 UI 對照完成。
- `plan-01.json` SHA `cdd0a41c138f337b5dc56f96020821f850f49aed9554dbed54260eb830798ac8`：六 context，每組 128 原 seed，共 768；七原極值每組，共 42。按 context/index 合併為 **783 工作，810 obligations 全保留**。
- 原 fast row 全欄、原始行 SHA、rolling 前／當列／批後、checkpoint 與前鏈、source 前後、computed/cache SHA 均保留。766 工作沒有當時未保存的 fullnode，明列 null／`field_not_recorded_for_non_extremum_fast_row`；不補造。42 極值 obligations 的原 fullnode 與 SHA 另逐筆繫結。
- 歷史凍結 **freeze-03.json** SHA `c43b003aa45e4e6f0761265597b9f036a324986a1c9927ab911e39fbd045a664`，binding SHA `71e5682991e7ceff68014a10e05dc3a922981657437b9020b389b4d55dea2f5b`。32 方法、30 HTTP bodies、兩實際字型及 Node／Chromium／Playwright／主機繫結。freeze-01／02／03 均為保留歷史，當前不能核准或執行。
- 正確 viewport 為 320×900／1440×1000。每筆新 context 從正常介面合法完成前幕，真 range fill／input、預覽、等原自然完成 caption、送出。不寫 state／hint／時鐘，不 seek、不 clone 代替玩家畫面。

## 真正判定與原 flags

當前 freeze04 的 `pass` 是 `target-real-ui-fast-comparison-v1`：目標 game-hint 完整 Range、baseline、相對 ink／safe／line／computed、原 N.compare 0.05px、實際 viewport、固定 panel、輸入與 phase、雙 CDP 字型及來源不變。幾何用原 inspectReport、**完整 nodes 加完整 blockers**，不只目標 node。原 sample 所有 nodes／blockers／evidence／violations 與全份 geometry_errors 仍完整保存。freeze03 曾用 hint-only nodes 的投影已證有引用斷鏈缺陷，禁止重用。

`scope.cjs` 只將可精確連到其他 owner/node 的既有 flags 分列；SCROLL_CONTENT_PENDING 必須與完整 hidden_scroll_text 個數相同且每筆 owner 都不是 game-hint。未知 flag、缺 owner 證據、目標 flag 一律阻斷 target。每 case 的 method_scope 是原 violations 的分類，儲存與再讀時重新計算，原 violations 不被清空。`global_method_clear` 另列，full_project_approved 永為 false。最後 summary 也不宣稱全域方法清白。

實讀原 bounded-02 十真例，五例有全案 flags：四例 ma-intro 未完整捲讀，一例 ma-actor-1 對 text-12／13／14 paint hit unresolved；該例 game-hint 的 id 不在三者內。原資料與 SHA 見 existing-flags-scope-receipt.json。這只證明需要明確範圍，**不能預言 783 工作全部會通過**。真目標失敗仍停止並保留完整部分成果，不自動重做。

## 持久化與排他

每工作先寫 immutable attempt；full sample、full case 用既有 sharded writer 保存，不丟任何 nodes/blockers。PNG 逐 chunk CRC、IHDR、IDAT、IEND、inflate 與五種 scanline filter 真解碼，驗 pixel SHA。case 原 flags 與 sample 原 flags 必須逐值深等。NDJSON、每個 shard／sample／PNG SHA、完整 inventory、canonical bytes、checkpoint／rolling journal 一起驗；半寫、未知 attempt、已失敗工作禁止自動 resume。

claim 固定 predecessor／序號後以 wx 取得 reservation，接著重新查目前與前 owner 的 PID creation，核 predecessor 未變，才寫獨立 installed receipt。owner 復活、PID reused／uncertain、競爭者、半 claim／缺 installed 一律 fail closed，不刪掉重來。writer 只接受當前安裝完成的 claim。

driver 只接受完整有效 approval；單一 hidden runner 子程序，launch_count=1、不重啟。持續保存 stdout.log／stderr.log，launch.json 記 driver 與 runner PID／creation、精確 args／run、freeze／approval SHA，terminal.json 記實際 exit／signal。若 PID creation 無法取得明列 uncertain，不猜、不重啟。

## 實際執行與 yes／no

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 原 404688 完成驗證／計畫來源繫結 | yes | plan-build-output.txt；783 工作、810 obligations |
| 故障 TDD 先紅 | yes | scope-lease-red-output.txt：缺 scope 模組與 post-reservation 復活 owner 負例真失敗；其他早期 red 檔保留 |
| 原 flags 保留／不能升全域、lease 重探修正 | yes | tests-03-output.txt：19 tests、19 pass、0 fail；包含 full shard 非空 flags roundtrip |
| 當前 freeze、本機執行環境、30 live bodies／兩字型未漂移 | yes | freeze-03-check-output.txt，實際 exit 0 |
| 舊 module-only approval 實際阻斷 | yes | old-approval-freeze03-output.txt 與 receipt：exit=1、forbidden run=False，未開 browser |
| 真 PNG decoder 測試 | yes | tests-03-output.txt：用既有真 PNG；截斷／CRC／尺寸不符皆拒 |
| 783 正常 UI／完整 fullsample／PNG／前後 CDP | no | 已核准執行一筆並保存真 full sample／PNG，工具投影假紅後 exit1；0／783 有效完成 |
| 全域安全、完整全案方法與玩家美術確認 | no | 本包不涵蓋、不發布 |

實際測試命令（根目錄執行）：

```powershell
node --test holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/plan.test.cjs holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/png.test.cjs holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/store.test.cjs holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/store-faults.test.cjs holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/runner.test.cjs holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/scope.test.cjs
```

## freeze03 禁止再用的歷史查核／核准／啟動命令

以下只記錄 freeze03 當時操作，當前已失效，禁止再次執行；當前唯一有效命令在本報告開頭 freeze04 節：

```powershell
node -e "const B=require('./holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/binding.cjs');const f=B.load('./holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/freeze-03.json');B.receipts(f.binding).then(r=>{require('node:assert/strict').deepEqual(r,f.binding.source_receipts);console.log(f.sha256,'783 jobs; native not started')});"
```

approval-template.json 是 freeze03 歷史假核准範本，刻意 approved:false。以下歷史示範沒有執行，當前禁止執行：

```powershell
node -e "const fs=require('node:fs'),p='./holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/';const a=JSON.parse(fs.readFileSync(p+'approval-template.json'));a.approved=true;fs.writeFileSync(p+'approval-root-03.json',JSON.stringify(a,null,2),{flag:'wx'});"
```

以下舊示範沒有執行；真正初次執行使用 root-approval-03.json 與 root-ui-03，已 terminal exit1。此舊示範當前禁止執行：

```powershell
node holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/driver.cjs --freeze=C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/freeze-03.json --approval=C:/agywork/agd-holiday-prototypes/holiday-lab/layout-qa/mid-autumn-ui-validation-20261023/approval-root-03.json --run=ui-full-03
```

查進展讀 launches/ui-full-03/launch.json、stdout.log、stderr.log、terminal.json。看不到程序先查 PID creation／檔案成長與 terminal，不重啟。driver 無 resume；若確定 terminal 且原資料完整並需續跑，必須明確以 runner 的 --resume，所有已完成工作逐 shard／PNG 驗過才略過；任何未完成 attempt 都會拒絕，不自行補跑。

本輪未 stage／commit／push，未改產品或舊證據。已依主控明確核准啟唯一 browser/native，失敗後未重啟，未以變更 flags 或判定修飾結果。
