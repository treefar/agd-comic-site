# Semester步數數字：來源繫結的離線技術證明

2026-10-23。這輪完成的是font table與符號數字域的可重跑技術模型；`native_equivalence=false`、`global_approved=false`。沒有開browser、沒有建立正常UI高步數截圖、沒有碰產品或舊證據。

## 可判定結果

| 問題 | YES／NO | 證據與界線 |
|---|---|---|
| Python/fontTools實際可用？ | YES | Get-Command實查`C:/Python314/python.exe`；實際import fontTools4.63.0。沒有使用缺fontTools的bundle Python。 |
| 真font與face已逐一綁定？ | YES | msjh.ttc、msjhbd.ttc各face1＝Microsoft JhengHei UI Regular／Bold；檔案bytes/SHA、UPEM2048、outline bounds、完整相關TTX已保存。 |
| 等寬等於同ink？ | NO | Regular advance均1187、Bold均1220，但10個glyph的x/y outline bounds各不同，font-audit.json逐glyph保存。 |
| digit在舊kern／GSUB／GPOS有相關引用？ | NO | 每face舊kern共583 pairs，任何一端為digit的pair0；GSUB所有lookup遞迴digit引用0，GPOS亦0，非只查digit-digit。GSUB features ccmp/vert（lookup4/1），GPOS mark（lookup4）；相關TTX可人工重查。 |
| digit outline全部位於自身advance槽？ | YES | 各glyph `0<=xMin<=xMax<=advance`，Regular/Bold皆成立。 |
| 45份來源template都分語言查驗？ | YES | 從原`ctx.ui.setText(location,W(...))` AST抽三個獨立TemplateLiteral；5列×3行×3語言。90個template-face組合均有cmap coverage；這不保證未來browser一定選該face。 |
| min/parity/max來自本輪新發現？ | NO | `route.length-1`、Array ceiling4294967294與奇偶guard沿用已查來源。此輪新增的是字型／DP證據，不重新包裝已知結論。 |
| 原4695狀態最短witness與2步延長均合法？ | YES，純模型 | 用同一凍結semester exports重播4695條witness；min_moves及位置吻合，起點up/down後再播witness時move+2，最終位置／round／task／window／訪問順序一致。高次數只是重複此合法cycle的符號recipe，不聲稱瀏覽器記憶體能分配所有route。 |
| 十進位完整未換行outline classes已有限化？ | YES | 19個min/parity guard×2font：33365個可達精確metric classes，每類保留合法numeric witness；完整run DP合計290188個節點（不含各fragment另算的節點），最大單層258，未枚舉四十億。 |
| 任意連續數字段切分都有保守極值？ | YES，font units | 保存8342個guard／font／位數／substring界；advance、xMin/xMax、yMin/yMax的上下界各有合法數值witness。獨立極值不必同時出現在同一數字中。 |
| 原Range/Canvas與outline模型已等價？ | NO | 字型含hinting/device相關表；native量測、像素hinting、fallback、DPR及行切分尚待校準。未從font units推定原CSS ink。 |
| `overflow-wrap:anywhere`逐行安全已證明？ | NO | 未換行run bbox與fragment envelope均不是現有CSS逐行墨跡／safe證明。先核實行切分／glyph run，再合成prefix/suffix與每行數字段的界。 |
| 舊6個native校準足以全域推論？ | NO | 本輪只讀舊report/sample，確認三語兩寬position使用Regular16px、weight400、letterSpacing normal，當時步數都是10。原post-run font檔SHA不能改稱pre-run；不把這6筆當高步數校準。 |
| 六個semester error-longest可改PASS？ | NO | 數字技術義務只完成離線層；全owner、native、safe／scroll／font義務仍未閉合。 |

## 兩個真font

| face | 檔案SHA-256 | 數字advance | outline y範圍 |
|---|---|---|---|
| Regular | `1fd5fc7046e0eea753988ee06d1a5a731df68475614e2174fbba9b4800f392ac` | 1187/2048 em | bottom -26..0；top1549..1583 |
| Bold | `7d55cd4801102131d991630cea74534dcf73a9fabf4a33e54fe05dfb4f5aa790` | 1220/2048 em | bottom -26..0；top1549..1590 |

Regular在16px的純hmtx advance是9.2734375px；十位未換行advance92.734375px。這是離線縮放值，沒有稱為Canvas或逐行Range實測值。Bold供已觀測其他角色的字型稽核，並未假造semester-position有Bold分支。

## 數學範圍與證明

令每個digit的advance為A，outline bbox為`[l,b,r,t]`。沒有digit相關kern／substitution／positioning且glyph位於槽內時，長度L的未換行數字：

```text
advance = L*A
xMin = first.l
xMax = (L-1)*A + last.r
yMin = min(each.b)
yMax = max(each.t)
```

第一glyph的xMin不大於A，之後glyph的xMin不小於A；最後glyph的xMax不小於(L-1)A，之前glyph的xMax不大於(L-1)A，所以首尾公式成立。同理可對任意連續substring獨立使用。**不是所有digit ink相同，也不是只憑位數就能判ink。**

DP每層只保留`lower-tight, upper-tight, first digit, last digit, min-bottom, max-top`及一條最小合法prefix witness。相同狀態有相同可接後綴與metric摘要，所以合併不丟失可達metric class。首位無leading zero（0自身例外），最後一位檢查parity，完整prefix始終受精確十進位上下界限制。每個完成class及fragment extrema witness都在原guard內。guard數與state對映取自原domain，不跨語言借用字串寬度。

條件式的完整字串結論只到：若native確認原face、feature與letter-spacing、run分割／換行位置不隨digit值改變，固定長度替換就不改prefix/suffix advances與numeric槽位置；每個實際行片段的ink依其首尾和高度摘要決定。目前尚未證實這些native前提，因此不將完整字串或safe標YES。

## 產物與重跑

- `font-audit.json`＋兩份`*-ui-tables.ttx`：真字型SHA、各digit metrics、全部kern/GSUB/GPOS引用稽核。
- `templates.json`／`template-font-audit.json`：三語45來源template與90組cmap coverage。
- `state-map.json`：4695來源state對19guard及cycle witness recipe。
- `representatives.json`：33365完整classes與8342片段極值；約25 MB，不是截圖或UI。
- `proof.json`：來源、方法、字型、舊校準的精確refs與所有NO。
- `CALIBRATION-PLAN.md`：root尚未批准的最小正常UI／技術probe分開方案。
- `freeze.json`：本批方法與結果的SHA清單；`verify.cjs`只讀核對。不得把重製後的新freeze當成舊輸出未變的證據。

唯讀重驗：

```text
node --test holiday-lab/layout-qa/semester-numeric-proof-20261023/numeric-model.test.cjs holiday-lab/layout-qa/semester-numeric-proof-20261023/verifier.test.cjs
node holiday-lab/layout-qa/semester-numeric-proof-20261023/verify.cjs
```

`verify.cjs`完整模式會重新計算全部fragment DP及每類witness，並重驗font／來源／freeze SHA，不寫檔。`--quick`只省去fragment全集重算，仍核整run DP與每個極值witness，必須保留輸出的`all_fragment_DP_recomputed=false`，不可冒稱完整重驗。

必要時重製離線結果（會寫**本目錄**；不是唯讀驗證）：

```text
C:/Python314/python.exe holiday-lab/layout-qa/semester-numeric-proof-20261023/audit-fonts.py
node holiday-lab/layout-qa/semester-numeric-proof-20261023/prove.cjs
C:/Python314/python.exe holiday-lab/layout-qa/semester-numeric-proof-20261023/audit-template-fonts.py
node holiday-lab/layout-qa/semester-numeric-proof-20261023/freeze.cjs
```

實際TDD：model module未存在時exit1；實作後綠燈。verifier module未存在時另有exit1，補實作後綠燈。最終5tests全部通過，含真font metadata的4294967000..4294967294兩parity、9/10、99/100、999/1000跨位數及非整串segment，與狹段brute逐class／extrema對照；未窮舉4b。

未執行browser/native／新HTTP／人工畫面驗收，因root明確未批准這一步。未stage／commit／push／main／delete，未改產品、舊semester-error-domain、captures、sampler、contract或先前來源追溯交付。
