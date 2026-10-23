# 08第二批：元宵與兒童節有限靜態拒絕全文

source_agent: codex。範圍只有已完成08的lantern／children，新增本資料夾；既有static-error-max、產品、契約、sampler與map均未修改。沒有開新瀏覽器或重跑矩陣。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| lantern全部UI可達靜態拒絕全文 | yes | 實讀served AST的render messages及submit ternary，只有position／size／order三鍵。54筆原真拒絕收據、三語兩寬6/6、unresolved0 |
| children全部UI可達靜態拒絕全文 | yes | AST確認唯一if(!r.accepted)內唯一ctx.hint，參數是r.reason===material的封閉兩支ternary，兩支都逐字W文字、沒有第三個隱藏拒絕分支；只有material／sync兩鍵。36筆真收據、三語兩寬6/6、unresolved0 |
| 沒有漏掉拒絕的secondary文字位置 | yes | lantern只寫ctx.hint(messages[state.feedback])；lan-readout是動態數值，不是拒絕副本。children只在失敗save的ctx.hint寫這兩句；children-preview-status是預覽狀態，不是拒絕副本。兩款本批均只要求game-hint這一個真owner，沒有沿用前批「兩處呈現」的假設 |
| API-only guard與成功提示有來源依據 | yes | lantern非法adjust只回原state、finished callback提前return；intro／adjust／ok不是拒絕。children native cue範圍0..2400匹配evaluateTake range，save先擋dead／takes>=3；即使API傳range錯誤，顯示層的非material分支仍是已覆蓋sync全文。逐條exact source／行號在guard_reachability |
| 五個全文三語兩寬全部驗完 | yes | 5×3×2＝30個唯一全文語言尺寸組合，全數有實際捕捉；90個原receipt的game-hint逐一核對。不用字數猜TopN，因此真正最大者必在已驗有限全集中 |
| 文字存在之外，全部墨跡可讀且在固定紙框內 | yes | 每個owner依baseline／x重建measurements全文，比原文；ink與unclipped_ink相同、全部在原safe內；panel.png SHA對raw served收據。這90個拒絕bubble不需要額外捲動補證，未將其他控制區捲動推成已驗 |
| 原始來源／凍結方法一致 | yes | 原report source stable、兩模組與runner served SHA、AST三語字句與既有audit逐一吻合；sampler與map SHA對sampler-freeze-06.json。原raw、sample與截圖SHA各自保留 |
| 最大寬／高／面積分開記錄 | yes | 12個語言尺寸context分別保存width／height／area代表，按實際墨跡矩形而非文字長度；三種最大可能不同。canonical選area代表，但全候選均已驗完 |
| 12個完整error-longest候選與圖片落地 | yes | canonical-candidates.json保留canonical ID、原ID、完整原case、raw report SHA與12張原圖SHA；沒有改寫正式layout-report.json |
| 代表圖人工觀看 | yes，限2張 | 實看lantern-en-1440、children-en-1440，拒絕bubble全文可讀且未壓框。未宣稱12張皆人工看過或美術已核准 |
| 其他控制區／動態readout及preview-status所有排列全驗 | no | 本批只補靜態拒絕全文。原方法對其他垂直可捲內容的旗標保留；不把此結果擴張為所有動態數值、全部畫面或其他遊戲 |
| 整體2076必要案例或交付gate已通過 | no | full_project_approved明確為false，主控仍須整合其餘證據與正式gate |

實際指令：

```powershell
cd C:/agywork/agd-holiday-prototypes
node holiday-lab/layout-qa/static-error-max-2/check.cjs
# lantern finite_keys=3 exact_matches=54 contexts=6/6 unresolved_rows=0
# children finite_keys=2 exact_matches=36 contexts=6/6 unresolved_rows=0
# FINITE_CANDIDATES YES; canonical representatives 12/12; no product changed
# exit0；原stdout為output.txt，追加封閉AST分支檢查後為output-source-structure.txt
node --check holiday-lab/layout-qa/static-error-max-2/check.cjs
git diff --check -- holiday-lab/layout-qa/static-error-max-2
# 兩者無輸出，exit0
git diff --stat -- holiday-lab/layout-qa/static-error-max
# 無輸出；前批資料夾未修改
```

來源：lantern原`phase-runs/2026-10-23T00-05-39-086Z/report.json`，716frames；children原`phase-runs/2026-10-23T00-10-53-661Z/report.json`，540frames。兩者各6條真路由、來源穩定。既有54／36 audit在`source-checkpoint-08/lantern-error-audit.json`、`children-error-audit.json`。

本批完整逐候選結果：`verification.json`；供明確索引的入口：`canonical-candidates.json`。不push、不碰main、不刪檔、不Unity、不發布。
