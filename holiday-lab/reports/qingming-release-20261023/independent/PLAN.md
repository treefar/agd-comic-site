# 清明 error-longest 新方法獨立審查計畫

source_agent: codex

目前只完成當前來源與判定規則的唯讀盤點，尚未啟動瀏覽器，尚未取得新 domain 方法的原生證據。`current-source-audit.json` 記錄實讀的 9 份來源 SHA、AST 抽取的滑桿與文字寫入、6 個合約 context 及 10 組代表輸入。所有上界／canonical／全站批准狀態均為 false。

## 最小可完成步驟

1. 對作者新 domain 檔案建立精確 SHA 清單，核對它只綁當前清明、runner、catalog、CSS、資產安全區、sampler、合約與判定器；核對純測試不啟 browser、不改產品或舊證據。
2. 獨立核對文字與依賴域：213 分軸值、3 phase 固定錯誤、合法 hint／pause／audio 模式，列所有可見文字 owner。純邏輯或模擬 action recipe 僅當候選，不當原生到達證明。
3. 審查 readonly verifier 對缺樣本、錯 owner、來源漂移、錯字型、裁切、假最長、合成 DOM 與舊證據移轉的拒絕能力。負例必須從真正可通過的同一 harness 正例出發，不能全因缺環境而假綠。
4. 若新方法只做到 source plan，就明確交付「準備可審、原生上界未證」；若之後有主控核准的新 native run，再逐檔核 SHA 與完整證據。本代理不自行啟動 browser，不先排海量矩陣。

## 當前原始碼可證到哪裡

- `games/qingming.mjs:22` 原生 range 宣告是角度 -30..30/1、長度 50..150/1、張力 0..1/.02，分別 61、101、51，共 213 個 owner 值；聯合格點是 314211。這只是來源的候選格點，沒有證明瀏覽器浮點與 range 正規化的輸出字串。
- `games/qingming.mjs:26` 的 missed-window 分支將 running 設為 false，再寫唯一固定三語 `kite-status` 錯誤句；phase 仍可為 0、1、2。phase 3 會先 complete 並離開 gameplay，不能列成第四個錯誤 phase。
- retry 保留 status、改 hint；pause 改 hint 為暫停，resume 改回 catalog blurb。phase 1／2 可保留 next hint，phase 0 沒有 next 的原生路徑。這導出 3+4+4=11 個候選聯合模式，再乘音訊兩態共 22；仍需真 UI 路徑證明。
- slider callback 只改 draft 與自己的 output；但排版是否可分離，必須另證。`.slider-row` 為 flex、output 僅有 min-width 44 與 tabular-nums，不能由 CSS 名稱或數字字元數推得實際墨跡等寬。
- `.hint`、toolbar／actions 換行可改 `.game-layout` 的文件 y 位；controls 在桌面有 max-height 582 的原生捲動。固定文字不等於固定安全區／viewport 可見性。
- 合約要求 all_visible_text、all_error_feedback、實測墨跡選最長，required_cases 只是下限。`static-proof-contexts.cjs` 對未證 dynamic secondary 會拒絕清明 error-longest；global policy 本身主要驗幾何與必要 key，不能把填入 error-longest 名稱當作上界證明。

## 足夠的原生 UI 證據

| 義務 | 最小充分內容 | 不能替代的內容 |
|---|---|---|
| 來源與執行身份 | 新 run 的實際 HTTP bytes、status、來源 before／after SHA、當前本機原檔、browser／font／method SHA 對齊；每 case 時間在來源前後收據之間 | 舊 source 相同檔名、join 時才補的 SHA、作者宣稱 |
| 真 UI 到達錯誤 | 每個 phase 由原生開始／成功換段／自然 missed-window 進入，保存按鈕與滑桿事件、progress/status/hint/input/output 快照；不能直接塞 state 或改 textContent | 純 physics 模擬、只呼叫 advance、合成 DOM、inject clock/state |
| 213 值 ×6 context 字串域 | 各軸每個值的原生 input.value 與 output.textContent，相同字串逐筆唯一；真 range 與正反 stepper 鏈驗瀏覽器正規化 | JS 的 String(i/50)、只測 min/max、213 總數相同但缺值／重值 |
| 分軸排版分離 | 每個受影響 owner 的全文、Range 各行、實際 platform font、unclipped ink、output/row/container/font/safe 的原生對照；其他軸的變動不改該 owner 尺寸、斷行、安全區或影響控制列 | 任意 .01px 容差、只比 row width/height、只比 font-family 字串 |
| 3 phase 固定錯誤與 hint/audio 模式 | 6 context 各自保留 phase0/1/2 的錯誤；合法 22 模式的實際 owner 集合與幾何依賴需覆蓋或來源＋原生不變性證明 | 把一個 phase 或一種 hint 的 PNG 複用為全部 phase／全部模式 |
| 所有 owner | toolbar 連結／音訊、標題與副文案、pause/leave、progress、hint、help/status、三個 label／output／正負按鈕、play/retry；由全文 DOM inventory 對 sample，未知 owner 必須停止並列缺口 | 只留六個 target、只驗 kite-status、丟掉不可見的捲動內容 |
| 安全區與可見性 | 真原生 scroller／window 捲動，完整原始 sample nodes/blockers/flags、generated paper 固定安全區、完整 viewport PNG 與同張圖身份；每個完整字串至少有可讀的 owner frame | clipped ink 面積、局部 crop、把 hidden_scroll_text／原始 flags 清掉 |
| 真上界與代表畫面 | 對每 owner、lang、viewport、適用布局狀態重算 width/height/area/left/right/top/bottom 極值，保留極值 witness；error target 的代表需實際達到該完整域的最大墨跡面積 | 字數、任意較安全但面積較小的拒絕畫面、不同 owner 的最大值互借 |
| 組合為 error-longest | 完整原始 case 不改；其他 owner 的上界、可讀性與原始 method flags 仍可追溯。不同 owner 的極值可來自不同合法 frame，必須分列 witness，不能合成一張不存在的 super-frame | 拼接 nodes／假裝所有 owner 的最大墨跡在同一張圖出現 |

213 個分軸值若原生不變性成立，可將數字 owner 的聯合組合化約；它不會自動消除 22 模式的全文幾何、上下位移、按鈕 skin／狀態與 scroller 義務。211 個唯一 anchor 配置加其他 21 模式可產 232/context、1392 個候選工作，但「工作數算得出來」不等於此化約已被原生證明。任何 layout/font/safe/flow 依賴改變，應保留真失敗，重新分析最小受影響組合，不直接退成百萬樣本掃描。

## 缺口與停止條件

目前沒有新 native run，213 字串的原生正規化、所有 owner 分離、22 模式真 UI 路徑、完整捲動可讀性與每 owner 上界均未證。若作者新工具只輸出 source-derived plan，這是合理可交付成果，不能宣稱 error-longest 已通過。

若實際字型、底圖安全區或原生 scroller 令某 owner 無法完整可讀，應列出 exact context／selector／值／原生幾何與截圖，回主控判斷是否改產品。此代理不改產品，不擴任意容差或換成合成 DOM。舊 canonical、舊方法／raw、C 節與勞動節不動。
