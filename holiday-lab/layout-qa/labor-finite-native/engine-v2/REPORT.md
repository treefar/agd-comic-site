# Labor engine-v2：待主控查碼的新方法

2026-10-23。四項工程補強已新增於此資料夾，**15/15故障／單元測試通過，新freeze已建立；沒有啟動browser、完整run或重拍先導。GLOBAL_BOUND=NO。** 舊pilot／collector／50張PNG與舊freeze相關檔案均未改寫。

新freeze：`freeze-v2.json`

`8b7c461f60a93f67800c6a6fb338cd26226719920a43766ee1473a0e3f3bca30`

這是方法凍結收據，不是主控批准，也不是原生排印通過報告。

## 檔案入口

|檔案|用途|
|---|---|
|`plan.cjs`|完整2,784個target及2,754個job，完整schedule、預期DOM10欄、6 ranges、18 choices、job/target fingerprints|
|`process-guard.cjs`|真CIM PID＋CreationDate查詢；live／reused／uncertain拒絕續跑|
|`engine.cjs`|既有layout-report-store的完整case/sample單筆shards、immutable checkpoint、NDJSON hash-chain與逐筆續跑驗證|
|`native.cjs`|待審原生adapter，正確contract viewport、正常輸入／scroll／原frozen sampler、PNG、CDP與雙字型檔收據|
|`binding.cjs`、`freeze.cjs`|完整方法／原body bytes／雙字型／contract／plan新freeze，既有freeze不能覆寫|
|`collect.cjs`|必須新engine-v2 approval；先驗舊程序已終止，再驗重、取得exclusive新lease，才允許新browser|
|`engine.test.cjs`|故障注入；只使用明標test-fixture，不是玩家原生證據|
|`check.cjs`|唯讀真CIM＋新freeze／live source receipts檢查，不開browser|

## ① Viewport

實讀root `ui-layout-contract.json.resolutions`及create-contract原碼，新方法嚴格使用：

- 窄版320×900。
- 寬版1440×1000。

plan、原生context、完整case、PNG IHDR尺寸與viewport proof都逐筆比對。舊先導寬版1440×900保持原樣，只是歷史證據；**不稱1440×1000原生校準已完成**。本輪單元測試有1000高的header-only測試夾具，但不是可解碼原生截圖或正式美術，不能拿來替代瀏覽器實測。

## ② 程序與approval

使用Windows `Get-CimInstance Win32_Process`查ProcessId、CreationDate、ExecutablePath與CommandLine，查詢失敗／輸出不完整明列uncertain，不以kill(pid,0)或單看檔案存在推定已停止。

續跑同時必須：

1. 明確`--resume`，且原run存在。
2. 原lease、receipt及鏈完整；讀取上一個PID及creation。
3. CIM明確absent才可續。相同PID/creation仍在＝live拒絕；同PID不同creation＝reused拒絕；CIM不確定＝拒絕。不自動重啟／殺程序。
4. 完整驗證舊case、sample、PNG、預期及checkpoint後，以`wx`取得下一個exclusive lease；並行搶同sequence會失敗，不覆蓋原lease。

lease與receipt均immutable，包含前一lease／meta hash；每case事件再綁writer lease ref。半份lease、缺receipt或竄改都拒絕。完成工作時不自行宣告程序已死；下次仍由CIM查證。

新approval必須`scope=labor-finite-engine-v2`、approved=true、完整`binding_sha256`以及新freeze檔案的`freeze_sha256`均一致，舊module-only approval不適用。本資料夾沒有替主控建立approved收據。

freeze綁定：

- 17個方法碼／依據檔的SHA與byte length：全部v2 `.cjs`（含測試）及原domain／snapshot、layout-report-store、frozen sampler/map/06收據、contract與原geometry policy。
- 30個固定08 served body：HTML、catalog、runner、replay model、CSS、labor模組、CSS引用UI資源及labor場景／角色／道具／CG資源，原始bytes存在`body-bytes/*.bin`，逐URL保存SHA與長度；並與原pilot五個已固定來源對照。
- msjh.ttc、msjhbd.ttc兩檔SHA／長度與實際PostScript face對映。
- 完整plan SHA、2,784 targets、2,754 jobs、正確兩種viewport。
- Node版本／執行檔、Chromium執行檔、Playwright package、主機與平台。這不是整個Windows／所有第三方程式的全球定理。

`loadFreeze`會重新核方法檔、原body bytes、字型檔、plan、執行檔與host；每新原生target前後再讀全部served body與雙字型，和binding逐筆相同才採納。方法改動必須新freeze／新approval，不沿用舊先導授權。

## ③ 不再聚合完整case

每target一個`records/000000/`資料夾。PNG先寫入；完整sample透過既有`createLayoutReportWriter`寫單筆shards；完整case也透過同一既有store寫單筆shards。每個store manifest只含一筆，沒有隨每target重寫全部過往full cases。

完整case保有原sample全部nodes、blockers、原違規／geometry及所有診斷；sample shard另外保存原始sample整體，含其他欄位。`readLayoutReport`可取回完整case與完整sample。沒有只拿target node冒充全case，也沒有丟掉非target blocker。

所有record檔案SHA／長度列inventory。每次commit只append一筆小型`events.ndjson`，包含完整job/target identity、預期、case/sample/PNG refs、writer lease及前一event hash；fsync後以`wx`新增對應immutable checkpoint。checkpoint綁event hash與journal byte位置。原full nodes不進NDJSON重複聚合。

故障時不靜默截掉尾巴：半行NDJSON、append後缺checkpoint、只有PNG/sample/case的orphan record，都拒絕續跑。證據保留待人工判斷，不刪檔或自動修復。

1MiB原sample測試將全case／sample物件的aggregate JSON.stringify直接設為拋錯，仍能通過完整儲存與重建；字串由既有store分塊序列化。讀取續跑時逐筆驗重，不把完整case重建成累積大JSON字串。

## ④ 逐checkpoint驗重

`verifyRun`逐筆核：

- 完整target／job identity、計畫順序之外的唯一target ID、schedule、expected evaluation及fingerprint。
- 6組原生range min/max/step/value、18個選項pressed狀態、完整inputs前後。
- game-hint/status/loads/progress＋6outputs的預期全文，DOM前後，原Range完整非空白字形覆蓋；DOM本身仍逐字比對。
- 全served source與兩font receipts前後，非只單一module SHA。
- PNG／sample／完整case及其全部shards的bytes、SHA、inventory；不允許多出orphan檔。
- viewport尺寸、scroll前後、實際CDP字型名、原case與完整sample nodes/blockers一致。
- NDJSON sequence、前後hash-chain、每筆immutable checkpoint與byte位置、lease鏈。

已記錄的原生失敗case不會在下次resume當作成功跳過。新原生adapter仍以未裁切ink、fixed safe與viewport判定目標，並保留全頁geometry；全集從未執行，因此沒有宣布其全部排版通過。

## 實際測試與紅燈留存

`tdd-red.txt`：先缺實作紅。`tdd-green-initial.txt`：Windows對read-only descriptor執行fsync的EPERM真紅；改成exclusive writable descriptor寫完fsync，未吞掉錯誤。`tdd-expanded-01.txt`：只加空白竄改checkpoint未被結構比較抓到，真紅保留；補canonical bytes SHA及plan file SHA，不能靠重新parse當不曾改檔。

最終`engine.test.cjs`實際15/15 pass：

|檢查|結果|
|---|---|
|兩種contract尺寸，寬版不沿用900|yes|
|完整case＋全sample＋blockers roundtrip|yes|
|重複／未知target拒絕|yes|
|半行NDJSON／重複event拒絕|yes|
|after-image／sample／case／journal四種partial寫入拒絕|yes|
|PNG／sample manifest／case manifest竄改拒絕|yes|
|改method／source／font／plan或舊approval拒絕|yes|
|錯DOM／input／source／viewport／fullsample拒絕|yes|
|live／reused／uncertain PID及未明確resume拒絕|yes|
|lease／receipt／checkpoint竄改及半份lease拒絕|yes|
|原失敗case不默認成功略過|yes|
|完整plan唯一性、DOM10欄／range6／choice18／job SHA|yes|
|1MiB全sample不aggregate stringify|yes|
|已確認terminated的測試run續寫不改第一份shard|yes，測試程序provider；非原生browser crash演練|

真CIM smoke也執行成功：`check-output.txt`有PID40264與creation `2026-10-23T04:17:20.0133540Z`，同PID/creation live self resume確實拒絕；最終再次執行結果見`check-final-output.txt`。新freeze與live body/font receipts核對exit0。這不是模擬provider的自述。

## 可重跑命令與限制

工作目錄`C:/agywork/agd-holiday-prototypes`：

```text
node --test holiday-lab/layout-qa/labor-finite-native/engine-v2/engine.test.cjs
# 15 tests / 15 pass / 0 fail
node holiday-lab/layout-qa/labor-finite-native/engine-v2/check.cjs
# pass true; live_self_resume_refused true;
# methods17 / body_bytes30 / fonts2 / targets2784;
# browser_startedfalse / full_startedfalse / global_boundfalse
```

無approval的full入口已真跑，`no-approval-output.txt`為exit1；在任何run或browser建立前擋下。`tool-check-output.txt`記全部9份CJS語法0、自有diff check0、`actual runs directory exists=False`。

`freeze.cjs`不能重跑覆寫現有freeze。要改方法，須先保存此次檔案與收據，再交主控決定新freeze；本輪不自行擴跑。

**尚未做：** v2的1440×1000原生校準、真browser中斷重啟、2,784 targets全集、native最大值與獨立複驗。故GLOBAL與UI gate仍NO。舊寬900證據、原粗體前後收據缺口仍是歷史事實，不因新方法碼補齊就倒算通過。沒有stage／commit或改其他資料夾。
