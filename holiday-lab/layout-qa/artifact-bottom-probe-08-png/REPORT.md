# JA作品紀錄末行最小複驗

固定08 constitution / ja / 320×900，真UI通關三幕後展開作品紀錄；原生內scroll最大539，外頁再捲87px讓pre進viewport。沒有seek、凍時鐘或產品／sampler改動。

```text
node holiday-lab/layout-qa/artifact-bottom-probe-08-png.cjs
ARTIFACT_BOTTOM [{"name":"original","overhang":1,"scrollTop":539},{"name":"candidate-padding-bottom-2","overhang":0,"scrollTop":541},{"name":"restored","overhang":1,"scrollTop":539}] same_text=true restored=false
```

- yes：外頁捲動前後inner scroll相同。
- yes：只暫改pre padding-bottom:2px，保守墨跡上界轉clip內；generated紙框未改。
- no：不能宣稱原筆畫真裁1px。無損PNG深色筆畫遮罩對齊上移2px後完整12列相同；原／復原crop原始SHA相同。
- yes：字串、computed、scrollTop與保守墨跡上界復原；前輪report另有原raw全文／字型逐值一致收據。
- no：inline style attribute位元復原false，既有凍結sampler的scroll guard暫設style.overflowAnchor=none後恢復空值，將absent attribute正規化為空字串（browser-sampler.cjs第8、63行）；computed padding仍0。此false保留。
- no：尚未證24個JA context全反鋸齒像素覆蓋，strict ledger仍NO；未改安全區或總gate。

原／候選／復原PNG與WebP保留；last-glyph PNG僅裁切／nearest縮放。pixel-comparison.json保留RGB<160的深色筆畫分類與crop原始SHA，此閾值只作診斷，絕不作正式放行標準。