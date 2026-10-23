# 尚缺的最小原生畫面補採清單

本表由 checkpoint.cjs 依既有固定 JSON 計算。未啟動瀏覽器；全部仍為 NO。兩個英文收尾缺口已包含在 37 分支內，不重複計數。

|遊戲／語言／寬度／意圖／狀態|尚缺 owner 與原文|來源行|
|---|---|---|
|constitution / ja / 1440 / default / game/preview-0|caption-preview-status: プレビュー終了。最後のコマを確認用に残します。|30|
|new-year / zh / 1440 / launch / game/preview-2|ny-pose: 騰空|14|
|new-year / zh / 1440 / launch / game/preview-2|ny-pose: 落地|14|
|new-year / zh / 1440 / launch / game/preview-2|ny-observation: 重點和你選的心情相符。這是你的收尾。|62|
|new-year / zh / 1440 / flight / game/preview-2|ny-pose: 起步|14|
|new-year / zh / 1440 / flight / game/preview-2|ny-pose: 落地|14|
|new-year / zh / 1440 / flight / game/preview-2|ny-observation: 重點和你選的心情相符。這是你的收尾。|62|
|new-year / zh / 1440 / landing / game/preview-2|ny-pose: 起步|14|
|new-year / zh / 1440 / landing / game/preview-2|ny-pose: 騰空|14|
|new-year / zh / 1440 / landing / game/preview-2|ny-observation: 重點和你選的心情相符。這是你的收尾。|62|
|new-year / en / 1440 / launch / game/preview-2|ny-pose: Flight|14|
|new-year / en / 1440 / launch / game/preview-2|ny-pose: Landing|14|
|new-year / en / 1440 / launch / game/preview-2|ny-observation: The emphasis matches your chosen feeling. This ending is yours.|62|
|new-year / en / 1440 / flight / game/preview-0|ny-pose: Flight|14|
|new-year / en / 1440 / flight / game/preview-2|ny-pose: Launch|14|
|new-year / en / 1440 / flight / game/preview-2|ny-pose: Landing|14|
|new-year / en / 1440 / flight / game/preview-2|ny-observation: The emphasis matches your chosen feeling. This ending is yours.|62|
|new-year / en / 1440 / landing / game/preview-0|ny-pose: Flight|14|
|new-year / en / 1440 / landing / game/preview-1|ny-observation: The airborne moment lingers. Keep it, or try another rhythm.|62|
|new-year / en / 1440 / landing / game/preview-2|ny-pose: Launch|14|
|new-year / en / 1440 / landing / game/preview-2|ny-pose: Landing|14|
|new-year / en / 1440 / landing / game/preview-2|ny-observation: The emphasis matches your chosen feeling. This ending is yours.|62|
|new-year / ja / 1440 / launch / game/preview-0|ny-pose: 空中|14|
|new-year / ja / 1440 / launch / game/preview-1|ny-observation: 空中の瞬間が残ります。保存するか、別のテンポを試しましょう。|62|
|new-year / ja / 1440 / launch / game/preview-2|ny-pose: 空中|14|
|new-year / ja / 1440 / launch / game/preview-2|ny-pose: 着地|14|
|new-year / ja / 1440 / launch / game/preview-2|ny-observation: 選んだ気持ちと動きが合っています。自分だけの締めくくりです。|62|
|new-year / ja / 1440 / flight / game/preview-0|ny-observation: 軽快に跳び、前後も読めます。保存するか、別のテンポを試しましょう。|62|
|new-year / ja / 1440 / flight / game/preview-1|ny-pose: 着地|14|
|new-year / ja / 1440 / flight / game/preview-1|ny-observation: 空中の瞬間が残ります。保存するか、別のテンポを試しましょう。|62|
|new-year / ja / 1440 / flight / game/preview-2|ny-pose: 踏み出し|14|
|new-year / ja / 1440 / flight / game/preview-2|ny-pose: 着地|14|
|new-year / ja / 1440 / flight / game/preview-2|ny-observation: 選んだ気持ちと動きが合っています。自分だけの締めくくりです。|62|
|new-year / ja / 1440 / landing / game/preview-0|ny-observation: 軽快に跳び、前後も読めます。保存するか、別のテンポを試しましょう。|62|
|new-year / ja / 1440 / landing / game/preview-2|ny-pose: 踏み出し|14|
|new-year / ja / 1440 / landing / game/preview-2|ny-pose: 空中|14|
|new-year / ja / 1440 / landing / game/preview-2|ny-observation: 選んだ気持ちと動きが合っています。自分だけの締めくくりです。|62|

每組 exact inputs、原 raw SHA、source SHA 在 minimum-next-cases.json；實際原 frame／靜態逐行重用收據在 preview-reuse.json。

## 執行限制與順序

1. 固定使用原 08 來源；先核模組、CSS 與原 raw 收據。只補表列分支，不重跑其他已證項目。
2. constitution ja1440 preview-0：沿 JSON 的 font18、duration6、x50、y78、兩行及原色調設定，將原生控制區捲至 status 完整可見；點試播後自然等待 6 秒，採結束狀態的完整 Range／固定 safe／viewport／原生圖。不得改時鐘或 padding。
3. new-year：優先 EN1440 launch、flight 的 preview-2 收尾，再依表補其餘 17 組中的缺項。使用每組 JSON 的原生輸入及合法先前幕順序；不得跨意圖或替換時長。
4. 保持 ny-pose、ny-observation 在實際 viewport，對缺少的短時動態分支用快速 CDP 原生畫面採樣；保留前後同 shot、時間及原生文字／幾何／font 收據，不凍結、seek 或延長時鐘。若抓不到，維持 NO。
5. 靜態 scroll 域與動態逐分支分開合成；原 whole-domain false 保留。新證據須同 source/lang/width/intent/inputs/owner/text，完整墨跡在固定 safe、clip 與 screenshot viewport 內，且原畫面無新增遮擋。
