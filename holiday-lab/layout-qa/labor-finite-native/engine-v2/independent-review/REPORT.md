# Labor engine-v2 獨立審查

結論：**目前不應啟動全集**。找到 2 個 P1、1 個 P2，可用本目錄隔離負例穩定重現。沒有修改原17份凍結程式／計畫／收據／測試，沒有啟瀏覽器、native 或外部 API。

## 問題

### P1：resume 的檢查與取得 lease 之間沒有互斥

位置：`collect.cjs:10`、`collect.cjs:13`、`engine.cjs:40`。

兩個 resume 可先各自讀到相同舊 lease、都確認舊 PID absent。A 寫新 lease 後，B 的 `writeLease` 重新計算下一個 seq，直接接受第二個 owner，沒有重新查最新 lease 或比較已驗證 predecessor。`wx` 只排除同一個 seq filename 的寫入，不排除這種前後兩個 seq 的競爭。兩邊隨後都有機會建立 native browser，造成同 target 重測及其中一份結果未進已完成紀錄。

負例用確定的順序交錯重現兩個 stale precheck，再連續取得兩個 lease；**沒有真的啟動兩個程序或 native**。原 `assertResume` 本身對 live／reused／uncertain 的拒絕正確，缺口是在它和 claim 之間。

修法應在新版本實作整個 verify／最新 lease PID 檢查／claim 的原子互斥；claim 必須綁預期 predecessor，且 native 開始前確認自己仍是唯一有效 owner。只在 `writeLease` 多查一次、但沒有原子 compare-and-claim，仍有相同時間窗。不得覆寫目前 freeze-v2。

### P1：fullcase 可洗掉原 sample method flags，仍被寫入及驗證

位置：`engine.cjs:15` 的 `validateCase`，由 append 與 verifyRun 共用。

驗證了完整 `nodes`／`blockers`，卻沒有驗證 `c.method_violations` 與 `sample.violations` 一致。負例提供原 sample 的非空 synthetic flag，同時把 fullcase 旗標設成空陣列；append 成功，原 sample 雖仍保存，但 fullcase 對外旗標已不同，不能聲稱兩者完整一致。

目前 native producer 在 `native.cjs:24` 的確直接複製 `sample.violations`；本項是存檔／驗證守門缺口，不是宣稱已觀察到正式 native 擦除旗標。新版本至少要在 append 與離線 verify 強制原 flags 全值相同，不能只相信 case.pass 或 producer 當下應該會複製。

### P2：24 bytes 的截斷 PNG 也被視為完整 screenshot

位置：`engine.cjs:26` 的 `validatePNG`。

目前只核8 bytes signature及寬高。負例只有24 bytes，缺 IHDR 完整內容／CRC、IDAT 和 IEND，仍通過。SHA／inventory只能證同一份截斷資料沒有再變，不能證它是可解碼的完整畫面。新版本應在承認 screenshot 前核 PNG chunk／CRC／IEND 與解碼完整性；測試 fixture 可以明確標合成，但不能讓 production validator 把它當有效原圖。

## 已核到的正向行為與界線

| 項目 | yes／no | 證據／限制 |
|---|---|---|
| 精確2784 targets、320×900／1440×1000 | yes（計畫） | 原 buildPlan 獨立執行；六個context、完整input schedule／18 choices／6 ranges、job fingerprints |
| callbacks 使用正常 UI | yes（讀碼） | click＋native fill／input，再比完整實際inputs與DOM；未見直接改game state／text／clock；本輪未做native實測 |
| 整體 freeze 授權、舊 module-only 不採認 | yes | collect 另綁 freeze SHA，assertApproval 綁完整binding；原unit負例和獨立正向守門均過 |
| 源／style／assets／雙字型檔前後body收據 | yes（讀碼與freeze指紋） | loadFreeze核17方法，liveReceipts每target前後讀實際body與兩font檔；未在本審查跑2784個新source/native |
| target CDP 記錄 | yes（讀碼） | 每個target讀CSS.getPlatformFontsForNode並限制Regular／Bold；尚不能宣稱完整2784實際CDP都已量過 |
| 原frozen sampler／map／contract | yes（指紋） | source-pre／source-post：17方法加freeze全相同 |
| 本機完整freeze檔案完整性 | yes | 獨立執行loadFreeze exit0；原body bytes、兩font檔、Node／Chromium／Playwright版本檔及plan全核，無fetch／browser |
| full nodes／blockers／任意原sample欄位完整保存 | yes（工程） | 原15測試隔離重跑，包括1MiB額外sample、shard roundtrip；不是native畫面通過 |
| method flags 原樣一致 | no | 上述P1真負例 |
| PNG完整可解碼 | no | 上述P2真負例 |
| crash half-write／partial journal不吞掉 | yes（工程） | image／sample／case／journal各階段注入中止，原守門拒絕orphan／missing checkpoint；沒有自動修復或清檔 |
| 已完成shard續跑不覆寫 | yes（工程） | 明確terminated fixture續跑，首shard SHA相同 |
| live／reused／uncertain PID單次判斷 | yes | 原與獨立負例均拒；跨流程原子claim仍NO |
| 本輪啟動native／全集／批准 | no | 全部合成工程fixture；P1未修前不建議批准 |

## 實際命令

```text
node holiday-lab/layout-qa/labor-finite-native/engine-v2/independent-review/prepare.cjs
17 frozen code files and freeze verified
exit0

node --test holiday-lab/layout-qa/labor-finite-native/engine-v2/independent-review/original-tests-isolated.cjs
tests15 pass15 fail0
exit0

node --test holiday-lab/layout-qa/labor-finite-native/engine-v2/independent-review/repro.test.cjs
tests4 pass1 fail3
exit1（預期：3個應拒絕的情況實際被接受）
```

原測試只複製到本目錄，把3個 imports 指回原模組；所有 test-runs 都留在本目錄，不執行會寫原 test-runs 的原測試入口。原始／複本 SHA與精確改動見 `test-copy-receipt.json`。原測試未改。

`repro-output.txt`、`repro-repeat-output.txt` 保留兩次相同紅結果，後一次工具實際 exit1；`original-tests-output.txt` 為15綠結果。`source-pre.json` 與 `source-post.json` 全值相同。沒有發現P0；不以這些工程測試取代原生／玩家驗收。
