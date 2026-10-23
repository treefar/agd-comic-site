# 國慶快速全集：供主控審碼，尚不可啟動

## 1. 完整來源域，不能只用字數或單欄聯集

`model.cjs` 的輸入來源 SHA 與原 08 served module 精確相同。它從 AST 取實際三語 readout template 與 messages，直接載入原 `frame`／`change`／`capture` 純規則；不手寫近似翻譯或四捨五入規則。

camera 是 -20…20 的整數，mid／far／fore 是 -30…30 的整數。每個 camera 的 61 個海岸／山 token 用原 frame／toFixed(1) 逐一求值，各自沒有重複；不能把不同 camera 的聯集任意拼接。每個 camera 都用原規則確認 fore=0 可到 blocked、fore=30 可到 clear。各幕目標 camera -12／0／12 不同，模板含這個分隔 token，跨幕不碰撞。

完整 readout 每語言為 `3×41×61×61×2=915,366`，三語兩寬仍是 **5,492,196**。`at(index)`／`index(tuple)` 提供無大陣列的 rank／unrank；`domain.json` 保存 41 組一維 token 證據及前後分散的十組真來源模型輸出。

但完整「拒絕 hint＋readout」聯合文字域是 **1,830,117／語言，三語兩寬 10,980,702**。其中 order 915,366；blocked 457,683；camera 401,868；coast 49,776；ridge 5,424。clear 且正常 order 的 615 組成功不能冒稱拒絕；相同 readout 仍可選 reversed 觸發 order 拒絕，所以 915,366 個 readout 全部有拒絕見證。

此去重僅是「實際顯示字串」的精確來源依賴：fore 只經視線後綴進 readout，order 只影響 hint 優先順序，五個 hint 原文在各語均互異。55,837,326 個完整控制狀態全部落在這些 joint 字串內。**沒有據此推定不同控制畫面、輸出數字、sprite、scroll 或 native layout 等價。** 後者仍是啟動前必須補證的義務。

## 2. 量測路徑與必要的等價條件

`fast-draft.js` 只供審碼。`extract-draft.cjs` 從原 frozen sampler 擷取 42 個完整 AST statement，保存每段 offset／SHA／原文；Range 分行、原位 baseline probe、Canvas actualBoundingBox、unclipped ink、祖先 clip、原 skin／safe／scroll 保全，以及 control／skin／stage-paper blocker 公式均保留。

明列的 adapter 只有：批次邊界已核 SHA 的 tiled／border fetch cache、只收 hint／readout 原 text node 的選取，以及環境守門。沒有改 safe、字距、font、line-height、字型 fallback 或公式。原 images paint-hit-order 掃描未包含在快 draft，故 paint 安全不能靠 draft 自動通過。

不能把中秋純 hint 的成功直接套到國慶 controls。國慶有完整 scroll 祖先、stage sprites、按鈕、slider、secondary paragraph；原 pilot 也全使用 height=1000，320×900 尚未校準。必須先完成以下六件事：

1. 同 origin 技術 clone 保留原完整 DOM／祖先／CSS／panel／paper，不移除或重排控制項；圖片解碼完成，所有原 skin source SHA 與 frozen map 一致。clone 只標技術探針，不作玩家截圖。
2. 正確六個 context：zh／en／ja 各 320×900、1440×1000。原 10 真例／60 探針只讀引用，不重做；其 320×1000 receipt 不能填入 900 context。需要主控另行授權最小的尺寸缺口校準。
3. 完整 computed longhands、DOM 結構、owner rect、scroll 祖先／scrollTop／scrollLeft、paper safe、每行全文／baseline／advance／ink，fast 與原完整 frozen 逐欄比對；CDP 實際 font face 與完整允許字元集逐 owner 驗證，並綁 Windows 字型檔 SHA。不能只比單一 font family 名稱。
4. 每批開始／結束各用完整 frozen 校準，源／字型／skin／computed／結構前後一致。不能把 modified AST 的本身輸出當成完整 frozen 的獨立對照。
5. 若只保留兩個 target 的文字採樣，要證明原 sampler 對其他 text node 的暫時 baseline 插入與恢復不會改變 target 的 Range／scroll／owner。所有原 target／祖先、controls 資料布局仍保留；不是把 target 搬到另畫的 panel。
6. 若省 paint hit-order，每一筆需有可審查的 stage clipping／target 不相交／control blocker 判定，以及完整法定向負例。沒有因果證據就保留原 paint 檢查或直接 NO；不能假設圖片不會蓋到 controls。

現階段 `native_equivalence_proven:false`、`paint_hit_order_scope_proven:false`。draft 在尚未收到未來明確等價收據時、讀任何 DOM 前就拒絕；沒有 runnable engine 或預設全集啟動入口。

## 3. 不先假設減域

保守預設逐 joint pair 量 hint 與 readout，共 10,980,702 pair records。要降回 5,492,196 readout 加少量靜態 hint，必須另證：hint 位於 layout 前方所造成的高度／位移、panel 高度與可捲域、viewport 正常捲動，都不改 readout 相對安全幾何與真正換行／墨跡；其餘 fore／order 控制值造成的 output 字串／sprite／pressed state 不改 target containing block、clip 或 paint。

可做有限因果檢查的來源線索：runner 先建立 game-hint 再建立 game-layout；readout 是 controls 的正常 block paragraph；slider output min-width=44px、controls min-width=0、grid minmax(0,…)、stage overflow:hidden。這些是線索，**不是已證的 native layout 定理**。不得僅憑數字等寬、NN.N、字數、outline＋1px 宣稱投影完成。未證就使用完整 joint 域，或保留 NO。

## 4. 儲存、RAM 與時間預算

不建立 915,366 字串陣列或 10,980,702 full-case 陣列。外層按 4096 readout indices 分批（224 批／context，共 1344 批）；每批用 256 readout 小塊，最多 512 joint records，每塊立即轉 NDJSON、fsync／hash，回傳 Node 端後釋放。不在 JS 中累積所有原生結果。

每筆至少保留 domain key／phase／全部原 input witness／hint／readout 全文、兩個原完整 target nodes（包含行 Range／baseline／Canvas／ink／safe／clip）、blocker／字型／style receipt pointers、完整法邊界收據及原 flags，不用只留 bounding box 或最大值摘要。完整 computed／來源資料可存不可變共享 sidecar，每筆用 SHA 指回；不得省掉可還原的內容。

原 pilot readout fullnode 為 2250…2609 bytes。以每 joint「兩個同等大小 owner＋4096 bytes metadata」試算約 95.25 GiB，**這不是上界或實測全集大小**。加入部分批次、index、極值、原資料與安全餘裕，未壓縮方案可先預留約 150 GiB；目前 C 可用約 130 GiB，不能認為已足夠。若採 lossless gzip／zstd，需保存 compressed SHA 與完整解壓後原 NDJSON SHA，離線 streaming verify 全字串與欄位；先量小塊真資料比例，不以範例推全集壓縮保證。

實機 RAM 約 31.4 GiB，當時可用約 9.9 GiB（精確值見 resource-receipt.json）。目標 Node RSS≤512 MiB、單一 headless browser≤1.5 GiB、chunk≤16 MiB；這些是尚待真小塊驗收的工作預算，不是已量到。設 CDP heap／Node RSS 的批次前後上限與失敗保全，不靠 GC 次數猜穩定。

舊 full-frozen 約 8.36…10.42 readout/s，原 5,492,196 次外推173.89h。新的 joint 約兩倍；fast controls draft 尚未實測，不能套中秋 throughput 或承諾縮到幾小時。先有正確等價小塊才估成本，再由主控決定是否啟動。

## 5. 續跑與拒重複啟動

- Immutable freeze 綁 exact source／sampler function／map／generated AST／guard／browser version／OS font／六個 dimensions／domain tuple semantics／批次大小；任一修改需新 run，不覆寫舊 receipt。
- `store.cjs` 是小型工程 prototype：每 row 一次 JSON.stringify，保留 Unicode／全部 payload，逐行 rolling hash，整檔 SHA 與 byte count。verify 用 stream／readline，不讀 giant report。少一筆、重複 key、順序錯、byte tamper 都拒；synthetic fixtures 明列 native_credit=false。
- 工作單位以 readout index 與 order／normal variant 明確排序。`ok` 的 normal pair 必須由原 capture 重算而跳過，不能靠 count 相近就接受；每批 expected key stream 從原 source model獨立重算。
- 整批與原生 boundary receipts 驗證後才新增 `wx` immutable checkpoint；鏈結前一 checkpoint SHA、rolling before／after、NDJSON compressed／uncompressed SHA、原 source／font before／after、兩個 owner 的七種極值完整原 node。失敗殘批保留為 uncredited，不覆寫也不計 complete。
- 單一 hidden headless job，必須另附 root approved=true 且綁 freeze SHA、上限、single_job。準備清單或模型通過不構成授權。PID lock 採 `wx`，存在即拒，不偷鎖；正式 runner 還須用 CIM PID＋CreationDate＋command SHA 判活，未知視為仍活。dead lock 也須 root 顯式續跑／新 attempt，沒有 watcher、自動重試或因看不到程序就重啟。
- 續跑先 streaming 驗完既有完成批，再從最後完成 cursor 接續，保留殘批。完整域結束只標 `native-universe-complete-pending-independent-ui-validation`；之後仍需真正極值回到正常 UI、固定 seed 完整 frozen 複驗、原圖與全案 gate，不能直接 GLOBAL YES。

本輪只設計與測工程 primitive；上述 production checkpoint／CIM resume runner、快法 native 校準、全集和玩家重現均未實作／未執行，不以 store 單元測試冒充它們完成。

## 6. 無損 gzip 替代與資源硬停

依主控要求，新增 `gzip-store.cjs`：每個 immutable batch 以 `wx` 建 gzip NDJSON。每 row 所有原 native 欄位原樣保留，附原始 UTF-8 行 rolling SHA；另綁整份解壓前 compressed SHA、解壓後原 NDJSON SHA、兩份 byte counts。每行單獨序列化，不產巨型整份 JSON。stream 解壓逐行核 domain key／rolling／全文 payload，Unicode 不改；undefined、NaN 等會在 JSON 中被靜默改寫的值直接拒收，不刪欄位或 metrics。批前後 source／style／CDP／full-frozen 收據仍是必填的完整 metadata 或不可變 SHA sidecar。

已對**既有**兩份 pilot report 做一次純壓縮實驗，沒有覆寫原檔、沒有新 native：report metadata、trueCases、probeContexts 原物件全部保留，包含後一份 report 明示沿用的重複收據，不為提高樣本數或省容量而去重。99 個存檔 records（包含 metadata／context headers）解壓後逐物件與原值 deepEqual；原兩份 report SHA 前後相同。原 NDJSON 4,576,303 bytes，gzip 220,312 bytes，比例 **4.814%**。這是現存 pilot 的實測，含重複／高度重複的 style，**不是全集比例或上界**；直接外推全域容量只能叫估計，不能構成容量足夠的通過條件。完整 receipt 在 `compression-result.json` 和 `compression-pilot/<timestamp>/receipt.json`。

正式 job 預計採以下硬限制，啟動前凍結，不在跑到一半自行調高：

- live C free 保留至少 **32 GiB**，另留 64 KiB 寫入緩衝；每個輸入 row 前及每個 gzip 輸出 chunk 前現查剩餘空間，不能只查啟動時。
- 每個壓縮 immutable batch **64 MiB** 上限；單行 **4 MiB** 上限。prototype 已有真負例測試硬停與 failure receipt，沒有 complete receipt 就不得建立完成 checkpoint。
- 全 job（包含已完成與失敗殘批）壓縮輸出硬上限規劃 **64 GiB**；production runner 要從既有 manifest／實際檔案大小 streaming 累加查證，不能只靠 progress 數字。此跨批 budget runner 尚未實作，所以不能啟動全集。
- 任一上限碰到即關閉 stream、fsync 已完成 checkpoint、保留當批殘檔與 `stopped-uncredited-partial` 失敗收據，狀態為 stopped-resource-limit／GLOBAL NO，不續假綠、不自動清檔、不自動重啟。後續只在主控明確授權及新資源收據下續跑。

`gzip-store` 只證原資料保存完整性，回傳 native_credit=false；不能把壓縮驗證轉成新原生採樣或全域安全認證。
