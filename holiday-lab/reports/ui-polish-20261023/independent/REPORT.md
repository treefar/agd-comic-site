# 既有遊戲 UI／字型獨立驗收

日期：2026-10-23。作者：獨立驗收子代理。產品唯讀；無 build、push、刪檔、C 節或勞動節操作。

最終來源：.measure-ui-polish-20261023-03，http://127.0.0.1:8860。最終一次完整 run：runs/2026-10-23T08-07-41-848Z。不混用 pilot 或前批 RED。

| 驗收 | yes/no | 實際結果 |
|---|---|---|
| 14 款非勞動節 × 三語 × 320/1440 | yes | 84/84 真 UI 核心流程；1416 個實際狀態；420 PNG |
| 選單／說明／設定／失敗／成功／重播／重試 | yes | 每組 intro/menu/help/settings/initial/wrong/result/replay/retry；開學四段重播，其餘三段 |
| 可見行盒外溢、控制項超框、hidden裁切、整頁橫捲 | yes | 1416 狀態檢查 0 問題；這是 DOM Range 行盒，並非所有 glyph 墨跡與底圖內框證明 |
| 中日文單一文字加標點末行 | yes | 1416 狀態候選 0；原 new-year settings/hint 與 constitution #caption-help 孤尾均轉綠 |
| 完成作品與合法分數 | yes | 依逐款實際 result builder 公式核對；作品三份（開學四份），不能以假定100分取代驗收 |
| 圖片與 Console／pageerror／requestfailed／HTTP錯誤 | yes | 每狀態圖片 decode/complete/naturalWidth；84組錯誤全0 |
| 字型已實載 | yes | document.fonts.ready 與每種 CSS family 代表節點 CDP actual platformFonts 均保存；多為 MicrosoftJhengHeiUIRegular，不將 family 字串當缺字證明 |
| 本次字元 cmap 覆蓋 | yes，限定候選stack | ../audit/font-coverage.json：31608可見文字row、36組樣式；en85/ja602/zh687不重複codepoints，候選stack缺字0/未知0；每字actualfallback仍未全證 |
| 來源前後相同 | yes | runner/lab.css/catalog/replay-model與14個game模組HTTP SHA before/after完全相同 |
| root可獨立重核 | yes | verification.json明列84個context、每個case.json及run result.json SHA，不信摘要 |
| 全動態組合／所有紙框精確墨跡／特效遮字／實體裝置／完整UI gate | no | 非這輪84情境驗收範圍；canonical/full_project皆false |

實際指令與輸出：

```powershell
$env:UI_ACCEPT_URL='http://127.0.0.1:8860'
node holiday-lab/reports/ui-polish-20261023/independent/run-v2.cjs
# exit0
# TOTAL {"cases":84,"flowsPassed":84,"issueCount":0,"orphanCandidates":0,"screenshots":420} pass

node holiday-lab/reports/ui-polish-20261023/independent/verify.cjs holiday-lab/reports/ui-polish-20261023/independent/runs/2026-10-23T08-07-41-848Z
# exit0; {"pass":true,"contexts":84,"states":1416,"screenshots":420,"orphanCandidates":0,"full_project_approved":false,"canonical_eligible":false}
```

唯讀 verifier stdout在 verify-output.txt。方法測試 node --test measure.test.cjs completion.test.cjs → 4/4 pass，exit0，method-tests.txt。嚴格原始重核／缺context／假全專案批准／藏孤尾／偽造100分／圖片未載／來源改動／偽造PNG雜湊負例 → 8/8 pass，exit0，verify-negative-tests.txt。

保留的真 RED：第一批84（runs/2026-10-23T07-57-24-609Z）exit1、58流程通過、24筆我方100分前提過嚴、2筆semester英文搜尋詞不匹配，另constitution-ja320同一長說明11個狀態出現「す。」末行。前批結果不改寫。v2修正方法分數前提；root修正實際英文提示與長說明排版後，以03全新84全部重新驗證。

已檢視新03 new-year-ja320、semester-ja320、exhibition-ja320實際長頁，文字未見壓框，原單字孤尾改善。這是代理畫面檢查，不代表使用者對美術／改版的確認。

小改版可另評估：日文外來語依詞組換行，避免把キャンパスマップ或インタラクティブ拆在不自然的位置；手機把任務、調整、試播分群以減少掃讀距離。維持資訊完整、原字型與既有生成素材，本輪凍結版不額外改設計。

特定負號補證：minus-font-probe.json 用同03真遊戲兩個額外headless頁，直接讀 en/ja #ny-hold-0-minus 文字U+2212及CDP，兩者actual Noto Sans TC / Noto-Sans-TC-Black、glyphCount1、isCustomFontfalse。兩張按鈕PNG已檢視，顯示負號而非方框；只證這兩個控制項，不將所有文字row的actualfallback未知改0。沒有為此改字型或下載字型。
