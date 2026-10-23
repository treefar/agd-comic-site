# 唯一補採：字幕遊戲日文 1440 預覽收尾

已取得 constitution／ja／1440／default／game/preview-0 的自然 6 秒收尾原生畫面。獨立 typed join 證明此一 family 的原靜態捲動域與兩個動態分支；原 whole-domain false 保留，沒有改寫官方 R0 或舊報告。

|驗收項目|yes／no|實際證據|
|---|---|---|
|固定來源與原輸入一致|yes|13 項 served receipt 逐 byte SHA 等於原 08 raw，前後皆相同；sampler function／file、asset map 與原紀錄相符。font18、duration6、x50、y78、兩行、light；所有 input／pressed 值逐筆完全相同。|
|真點試播、自然經過 6 秒|yes|原生 click 後先讀到「設定した表示時間でプレビュー中。」；MutationObserver 原生 performance 時間差 6011.5ms 後得到完整收尾。沒有凍結、seek、改 clock／遊戲 API。|
|收尾全文完整可見|yes|「プレビュー終了。最後のコマを確認用に残します。」完整原始 Range／墨跡在既有 fixed safe、clip 與實際 viewport 內；2 行 baseline 原 Range 不變。|
|字型實際證據|yes|computed 16px / 26.4px system-ui, Noto Sans TC, sans-serif；CDP 實際 Microsoft JhengHei UI Regular、23 glyph。與原 previewing 的 computed font／fixed safe 一致，未換字體。|
|完整原 sampler 與畫面|yes|保存完整 sample、case nodes／blockers、CDP platform fonts、PNG；geometry0，截圖前後 window／內部 scroll 完全相同。PNG 已實際開圖檢查其收尾文字及紙框可見；這不是使用者美術確認。|
|來源／console／解碼|yes|13 receipt 前後相同；console、page、HTTP 錯誤0，圖片 decode failure0。|
|靜態域與動態分支 typed join|yes|原 28 static targets、33 行逐筆核原 raw／實際 input／measurements／safe／clip／viewport／圖 SHA；原 previewing 及新 ended 2/2 分支分開核對。|
|清除原 flags／全站 UI 通過|no|完整保留 SCROLL_CONTENT_PENDING 14 text nodes 原旗標與原 domain false。這一 family 的靜態域由既有逐行證據承接；不把單張圖宣稱整控制區已全顯示。不修改官方 R0／契約／sampler／safe／產品。|
|其他 preview family 補採|no|只做本組；新年短時分支與兩個 EN 收尾未動。沒有新矩陣或全索引執行。|

## 實際指令

```text
node holiday-lab/layout-qa/preview-gap-native-20261023/collect.cjs
NATIVE_PREVIEW YES constitution/ja/1440/default preview-0 ended natural_ms=6011.5 geometry=0 source_stable=true original_false_preserved=true
exit 0

node holiday-lab/layout-qa/preview-gap-native-20261023/verify.cjs
TYPED_PREVIEW YES family=1/1 staticTargets=28 staticLines=33 dynamicBranches=2/2 natural_ms=6011.5 original_domain_false=true R0_unchanged=true full_project_approved=false
exit 0
```

原生資料：latest.json → runs/2026-10-23T03-06-23-276Z/report.json，畫面為同資料夾 native-ended.png，完整 nodes／blockers 在 native-ended-case.json，完整 sampler evidence／違規在 native-ended-sample.json。原生 scroll 只用 status.scrollIntoViewIfNeeded；收尾不會自動改 inputs，且試播前後進度仍0/3。

typed-ledger.json 是新增獨立補證，保存原始 whole-domain false 與全部原靜態收據；未改 method-gap-plan-08 的 JSON、NEXT-STEPS 或索引。verify.cjs 逐項核圖 SHA、原 raw 身分、原 inputs、行墨跡、截圖 viewport、文字／來源、固定 safe 及官方 R0 SHA。可離線重跑 verify，無需重新玩遊戲。

本次未 stage／commit。檔案唯一新增於 preview-gap-native-20261023；既有長程序與其他代理成果保持不動。
