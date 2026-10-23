# 08兩款：有限靜態錯誤全文的最大墨跡覆蓋

source_agent: codex。僅讀已完成08的 constitution／lunar-new-year原始量測、精確來源審核與served模組；沒有開新瀏覽器、改產品／sampler／map／契約或重跑全矩陣。

兩款可達的靜態拒絕全文是有限集合。已逐一驗完每個候選，因此集合內任何最大者都已包含，不必猜測TopN或靠字數挑「最長」。共23個全文、3語×2寬＝138個唯一全文語言尺寸組合，原始108＋228＝336筆真拒絕收據逐一核對。兩處呈現位置也核對：game-hint，以及caption-feedback／lny-observation；preview-required只在game-hint顯示。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| constitution有限全文完整涵蓋 | yes | small／fit／fast／contrast／safe／preview-required，共6鍵；108 exact source matches，三語兩寬6/6，unresolved0 |
| lunar-new-year有限全文完整涵蓋 | yes | 17鍵，包含眉毛接近平直與反方向兩種全文；228 exact matches，三語兩寬6/6，unresolved0 |
| 每鍵均由實際served AST逐字確認 | yes | 同時核對既有audit三語原文、module SHA與raw runtime_receipts，不由單一字串推別名 |
| UI不可達的API guard明確分開 | yes | 正常native滑桿／加減／選項路徑：constitution range、lunar invalid不可達；done在結果換頁／handler guard前阻擋。精確程式行與斷言保存在verification.json的guard_reachability；沒有注入非法值來假造UI案例。ok成功提示不算拒絕全文 |
| 全文墨跡而非文字存在即算通過 | yes | 每個必要owner的measurements依真baseline／x重建文字，與精確全文比對；unclipped_ink等於ink、全部墨跡在固定safe內，生成panel.png SHA與raw served收據一致 |
| 1440控制區捲動未被省略 | yes | 原primary有123個owner當時不在完整可見位置；逐state對應原control_scrolls與實際controls-scroll-N採樣，確認全文聯集missing[]、visible_domain_stable／text_unchanged／all_content_reachable=true，再要求該owner有完整、未裁切、安全的真墨跡節點。不是拿geometry0直接消除捲動缺口 |
| frozen sampler／asset map一致 | yes | raw metadata分別對sampler-freeze-06.json的function SHA與map SHA；未修改測量器或內框 |
| 最大寬／高／面積按真墨跡分別記錄 | yes | 每款／語言／寬度保存3種最大代表；12個canonical代表按實測bounding-area挑選，保留寬／高可能是另一候選的事實。有限集合已全驗，並未宣稱單一面積代表等於所有維度唯一最大 |
| 可供整合的error-longest候選 | yes，限兩款12組 | canonical-candidates.json含canonical ID、原ID、完整原case、原report SHA與12張留存代表圖。這是索引素材，沒有自行覆寫正式layout-report.json |
| 全部12張逐張人工美術確認 | no | 實看constitution-en-1440與lunar-new-year-en-1440兩張，兩處提示全文可讀；其他僅有真圖與幾何證據 |
| 所有數值錯設定組合、其他13款、動態最大 | no | 本輪只證有限靜態全文及已採的UI位置，沒有洗成所有數值狀態全驗；中秋動態最大不在本輪範圍 |
| 整體2076案例／正式交付閘門 | no | 原report仍有其他scroll／partial旗標，本輪不清除。主控須整合其餘證據及全專案來源指紋後跑正式gate |

第一版只看primary capture，所以如實回報兩款各3/6、FINITE_CANDIDATES NO；`verification-primary-only.json`、`check-primary-only.cjs`與output-01完整保留。這是證據範圍未涵蓋原本已有的1440真捲動採樣，並非123個產品錯誤。加入逐state原scroll證據後才12/12，沒有另拍改長時間或回填舊raw。

實際指令與最終stdout：

```powershell
cd C:/agywork/agd-holiday-prototypes
node holiday-lab/layout-qa/static-error-max/check.cjs
# constitution finite_keys=6 exact_matches=108 contexts=6/6 unresolved_rows=0
# lunar-new-year finite_keys=17 exact_matches=228 contexts=6/6 unresolved_rows=0
# FINITE_CANDIDATES YES; canonical representatives 12/12; no product changed
# exit0；原stdout為output-final-source-checked.txt
```

原始來源：

- constitution：`phase-runs/2026-10-22T23-47-50-569Z/report.json`，1276frames、6路、來源前後穩定。
- lunar-new-year：`phase-runs/2026-10-22T23-47-50-576Z/report.json`，1905frames、12路、來源前後穩定。
- 精確審核：`source-checkpoint-08/constitution-error-audit.json`、`lunar-error-audit.json`。
- 本輪逐候選／owner／原ID／原sample SHA／原圖SHA／捲動證據與最大墨跡：`verification.json`。
- 整合入口：`canonical-candidates.json`，刻意保留`full_project_approved:false`。

不push、不main、不刪檔、不Unity、不發布。
