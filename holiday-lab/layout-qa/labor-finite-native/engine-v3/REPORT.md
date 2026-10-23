# Labor finite engine-v3 工程修補交接

日期：2026-10-23。範圍僅本 `engine-v3/`；原 v2、原負例、原 pilot 與中秋採樣均未修改。本報告為工程測試結果，並非玩家 UI 或有限全集驗收。

## 結論與逐條驗收

| 條件 | yes/no | 實際證據 |
|---|---|---|
| 保留三個 v2 真負例，先紅後綠 | yes | `same-three-red.txt`：原同類重現 1 pass / 3 fail；`tests-final.txt`：23 pass / 0 fail |
| 續跑互斥在同一原子 claim 內重查最新 lease 與 PID/creation | yes（工程測試） | `lease.cjs`；兩個真正 Node OS 程序同時通過死 PID 前置檢查後，只有一個取得續跑權；另測前檢與 claim 間插入第一 owner |
| 活 PID、重用 PID、不確定 PID 拒絕，且前檢不污染活 run | yes | 迴歸測試三類均無 claim 寫入；取得 claim 後 PID 復活則拒絕且保留 partial claim，後續 fail closed |
| case flags 與完整 sample flags 深等，不可清空洗掉 | yes | append 與 `validateCase` 均針對 flags 錯誤拒絕；原 flags 可原樣往返，offline `verifyRun` 使用同一檢查 |
| 真 PNG 完整結構、CRC 與解壓驗證 | yes | 原 24 bytes、缺 IEND、CRC 錯、尾隨內容、有效 CRC 但壞 zlib 均拒絕；原生既存 PNG 可完整解碼 |
| 正確契約 viewport、全 job/target 身分與新 freeze | yes（靜態／工程） | 320×900、1440×1000；459 job IDs/context、6 contexts 共 2,754 context-jobs、2,784 targets；新 freeze 綁 code/domain/runtime/sampler/map/source body bytes/雙字型 |
| 原 v2 freeze 仍完整有效 | yes | `check-final-output.txt` 的 `loadFreeze` 同時唯讀重驗繼承 v2；`v2-inheritance.json` 保存 9 檔 before/after 相同 SHA 與原 17-source freeze |
| 未經主控新核准能啟動 full | no | `no-approval-output.txt`：`explicit root engine-v3 approval required`，exit 1；`actual-runs-exists=False` |
| 新 1440×1000 原生校準／全集／GLOBAL_BOUND 已通過 | no | 本輪未開 browser、未採新 native、未啟全集；`global_bound=false` |

## 三個根因與修法

1. **續跑 TOCTOU**：舊 API 在各自確認前 owner 已死後，仍可直接寫入兩個 lease。新 `acquireResume` 先做非決定性的快速拒絕，再以每 epoch `wx` immutable claim 作跨程序線性化點；claim 內重新驗證最新 predecessor ref、自身 PID/creation、前 owner 已終止，再驗 predecessor 未變，最後安裝帶 claim/termination refs 的 lease。孤立、截斷或未完成 claim 均保留並拒絕自動續跑。舊 `writeLease` 明確拒絕，必須遷移到原子 API；不是假稱舊 API 保持不變。
2. **flags 洗白**：`case.method_violations` 必須與 `sample.violations` 深等；full nodes、blockers、flags 保留完整，不能只保存 target。故障測試確認拒絕原因就是 flags，沒有用 PNG 失敗掩蓋。
3. **PNG 假截圖**：逐 chunk 檢查界限、IHDR、IDAT、IEND 與 CRC，並以 `pngjs` 真正解壓成精確 width×height×4 raster；拒絕 IEND 後殘餘資料。decoder package 與所有 lib 實作納入 freeze。正向 fixture 重用既有正常原生截圖，不產生程序像素或新玩家證據。

繼承的 fullcase shard、完整 sample refs、NDJSON hash-chain、immutable checkpoint、PNG/source/font/DOM/expected/inputs 身分與竄改檢查仍在。新的 flags 與 PNG 驗證同時施於寫入及離線續驗。

## 可重跑指令與實際輸出

以下在 `C:/agywork/agd-holiday-prototypes` 執行，完整輸出均在本資料夾。

```text
node --test holiday-lab/layout-qa/labor-finite-native/engine-v3/engine.test.cjs holiday-lab/layout-qa/labor-finite-native/engine-v3/repro.test.cjs
exit 0
tests 23
pass 23
fail 0
duration_ms 2704.5982

node holiday-lab/layout-qa/labor-finite-native/engine-v3/check.cjs
exit 0
pass true
current_pid 39976; state present; creation 2026-10-23T04:34:13.1763340Z
live_self_resume_refused true
methods 52; body_bytes 30; fonts 2; targets 2784
browser_started false; full_started false; global_bound false

node holiday-lab/layout-qa/labor-finite-native/engine-v3/collect.cjs --full --run=no-approval
exit 1
AssertionError: explicit root engine-v3 approval required

node --check <本資料夾各 19 個 .cjs>
全部 exit 0（逐檔收據：tool-check-output.txt）
git diff --check -- holiday-lab/layout-qa/labor-finite-native/engine-v3
exit 0
```

前兩項最後執行時間約 2026-10-23T04:34:13Z。`check.cjs` 的 CIM 是真實目前 Node PID/creation；競態故障測試雖啟動兩個真 OS 程序，PID provider 是明示 synthetic fixture，不冒充兩個真採樣 owner。

## 凍結與執行界線

新 freeze：`freeze-v3.json`。

```text
SHA256 8736fe3b16e9d423c7b89764969398067094dd30cebf250bbc35bb2523883ddb
schema 3 / labor-finite-native-engine-v3
52 code/dependency files; 30 served body-byte files; 2 actual font files
viewports 320×900 / 1440×1000
targets 2784 / 459 job IDs per context / context-jobs 2754
inherited v2 freeze SHA256
8b7c461f60a93f67800c6a6fb338cd26226719920a43766ee1473a0e3f3bca30
```

approval scope 改為 `labor-finite-engine-v3`，須綁新 freeze 檔 SHA 與完整 binding hash；不能沿用 pilot/v2 approval。`inherit.cjs` 等遷移工具已納入 code freeze，僅供溯源，不應在凍結後重跑。

工程測試生成的 `test-runs/` 只是合成 case／故障 fixture；真正 `runs/` 不存在。未跑新的 1440×1000 玩家校準，因此不能用本報告把舊 wide900 pilot 改稱 wide1000 證據。沒有全站 Build 或 native matrix：本輪只改採樣工程，且新 native/full 明確待主控審碼。未 stage、commit、push、發布或操作 Unity。
