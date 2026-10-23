# 全面試作續驗16：恢復原作業與來源追溯

2026-10-23；source_agent: codex。使用者已說「繼續」，前次暫停解除；整體工作仍未完成。本輪只做本機驗證。最新結果：中秋783正常UI及810義務已獨立重核；勞動原批次在331成功後中斷，續接工具準備中。正式覆蓋仍2046／2076。

## 實際結果

| 驗收條件 | yes／no | 實際指令、輸出與界線 |
|---|---|---|
| 中秋續接前重核原247份 | yes | RESUME-PREFLIGHT-01.json：247份case/sample/PNG與原hash-chain、freeze04、來源／字型均一致，exit0；舊PID確認已停後才續接。SHA e0a80f31d48882bb18fd7e900ca081468d7583851916fafc0e2f15c4dc100f3f。 |
| 沿用原run、沒有重跑原247 | yes | node holiday-lab/layout-qa/mid-autumn-ui-resume-20261023/driver.cjs；原runner參數仍為 --full --freeze=…freeze-04.json --approval=…root-approval-04.json --run=root-ui-04 --resume。新runner43520／driver8248，launch寫existing_complete247。原暫停屏障移入operator-pause-records保存，未刪除。 |
| 中秋783正常UI目標驗證已全完成 | yes，限目標範圍 | 原runner06:03:50.780Z真exit0；root於06:05:00.032Z完成獨立verify-complete.cjs、exit0：jobs783、seed768、extrema42、obligations810、geometry0；所有PNG／case／sample／chain／source-font-method逐一核對。265份仍有其他owner原旗標，全域仍NO。 |
| 勞動新完整目標域工具可啟動 | yes | root讀full.cjs/guard/store/tests，node --test …/full.test.cjs：9pass0fail；preflight通過。root-approval.json SHA50a2b5b2b77d616a5df1c9c6d27cbb9c38e3e5f809bbc8aade1b7af95c9083ae。 |
| 勞動2784目標已全部驗完 | no | node holiday-lab/layout-qa/labor-finite-native/full-supervisor-20261023/driver.cjs；runner27896／driver63148；05:49:49.915Z captured180/2784，尚無terminal。精確2784targets、2754context-jobs，未縮小範圍。 |
| 勞動保留整頁原flags／false | yes | 新域驗證要求原9項check鍵、boolean、pass公式與原payload重算；已知非target flags須逐owner／clip證明才分開判定，未知與target flag仍失敗。不得把target域有效改稱整頁通過。 |
| 來源帳本主控獨立複驗 | yes | node --test holiday-lab/layout-qa/source-provenance-20261023/provenance.test.cjs → tests3 pass3 fail0、exit0；node …/provenance.cjs → pass=true, inputs283,references1284,global_approved=false,historical_http_receipts_replayed=false、exit0。原stdout及命令在root-verification-01.json。 |
| runtime與contract集合說明精確 | yes | 兩者各283，實際共277；runtime-only六audio；contract-only根目錄CSS與五輸入。舊同路徑served278另含根目錄CSS，不能混稱集合交集。membership.json留全部路徑。 |
| 原08整包generator可重現 | no | 新隔離原generator55inputs→37outputs、exit0；client與build11 byte-exact，與08不同。原08完整輸入快照及當時preflight收據缺失；不拿現況回填歷史。 |
| JA短caption影響範圍已查清 | yes，限範圍 | 唯一new-year.mjs第64行scene0 focus變更；既有JA18張只證兩寬固定timings／單一ending的replay。原min140六列summary fail與TypeError保留，未改稱整批pass；其餘138 required項不能全面移轉至新來源。 |
| 清明六個error-longest已關閉 | no | 1115 refs離線復原；136錯句100可見、36窄版status仍在viewport外，原NO保留。新11mode／314211配置文字投影只是來源域；pilot工具補CDP字型與獨立verifier中，未批准或啟動新browser。 |
| 開學高步數數字段已完成畫面驗收 | no | 來源／字型綁定DP與contiguous fragment保守界已建立，不能當overflow-wrap:anywhere逐行墨跡或正常UI高步數證明；native_equivalence=false。尚未開新browser。 |
| 國慶可沿用舊clone算完整通過 | no | 獨立唯讀複查指出舊真頁與clone的target paint unresolved、窄版高度與其他owner缺口；先做owner／stage clip因果分析，不重跑百萬full sampler。 |
| 覆蓋與全域gate已全部通過 | no | 正式仍2046/2076、缺30、PARTIAL_RED；本輪未改canonical、R0或dashboard數字。使用者美術／裝置／語言確認仍未取得。 |
| 不推送、不發布、不碰main、不刪檔、C節不動 | yes | root觀測兩repo refs/remotes/origin/main仍1b8322e69d84549db220d849afb1aac0fb9d7c2a；C節SHA仍95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680。沒有網站Build、新ZIP或Unity啟動。 |

## 接續位置

即時數量會繼續增加；以上為固定時間點，不能用舊數字判定程序停止。完整程序creation／command line與原stdout在 `resume-observation-20261023-16.json`。

- 中秋：mid-autumn-ui-resume-20261023/launches/resume-01；同root-ui-04。完成後獨立store.verify全部783與810義務，再評估typed canonical。
- 勞動：labor-finite-native/full-supervisor-20261023/launch-01；full-domain-reviewed-20261023/full-run。完成後 `node …/full.cjs --verify`，遇失敗先讀原資料，不自動重跑。
- 清明／開學／國慶：只在各自新QA目錄工作，不改產品、sampler、map、舊證據。新的browser批次須主控讀實碼與測試後再批准。

原247中秋證據已在先前本機commit保全；正在增長的續接輸出與勞動全集尚非完成封存。原673MB中秋raw仍ignored本機資料，未宣稱跨機備份。

## 06:05 中秋完成後主控獨立重核

`node holiday-lab/layout-qa/mid-autumn-ui-resume-20261023/verify-complete.cjs` 真exit0；輸出原封保存在 `root-complete-verification-01.json`。重建source-bound domain與原seed/extrema plan，完整store.verify全部783 case/sample/PNG、810義務無缺重、原0.05px比較全為[]、geometry0、方法／HTTP body／雙字型收據一致。

context件數：zh320=132、zh1440=130、en320=130、en1440=130、ja320=131、ja1440=130。完整鏈末SHA `e386f4ff21fdb40cdcebb3d198aeecc6baa661a3d5c8295a3775a4287070f299`。

518份原整頁method旗標為空，其餘265份仍保留非被測提示的原paint／捲讀旗標，包括EN／JA的ma-intro各130次；原flag次數可重疊，不能相加當case數。這只完成目標提示的正常UI／原技術probe等價校準，`canonical_promoted=false`、`global_bound_proven=false`、`full_project_approved=false`。下一步要建立並獨立驗證typed極值證明與canonical adapter，沒有直接修改覆蓋分子。

## 主控畫面檢視與本機保全

主控實際開圖 `mid-autumn-ui-validation-20261023/runs/root-ui-04/records/000581/viewport.png`（JA320，source-index23613）：被測錯誤提示全文在紙面內；頁面上方說明仍有短末行「ごう。」，下方操作說明亦有短末行。這是已看見的排版缺口，不把目標文字測試通過說成整頁排版／日文／美術通過。驗證期間不改凍結產品；後續在新版本修正並重驗受影響範圍。

136個完成檔已保全到本機commit `c3a8e47`，包含來源帳本、恢復／勞動工具與本報告；QA index blob逐一與工作檔位元組一致。程式／Markdown的cached diff --check exit0，git fsck --connectivity-only exit0。未納入仍增長的native輸出，不把本機commit說成已push或跨機備份。

## 後續離線複驗

- 開學：root實跑 `node --test holiday-lab/layout-qa/semester-numeric-proof-20261023/numeric-model.test.cjs holiday-lab/layout-qa/semester-numeric-proof-20261023/verifier.test.cjs` → tests5 pass5 fail0、exit0。含真font的10位上界／兩parity／跨位數與substring負例。
- root實跑 `node holiday-lab/layout-qa/semester-numeric-proof-20261023/verify.cjs` → exit0；pass=true, refs41,groups38,metric_classes33365,fragment_bounds8342,all_fragment_DP_recomputed=true,native_equivalence=false,global_approved=false。已讀model/prove/verify實碼。這是字型outline模型與來源證明，未替代瀏覽器逐行墨跡驗證。
- 國慶：root實跑 `node --test holiday-lab/layout-qa/national-independent-review-20261023/projection.test.cjs` → tests6 pass6 fail0、exit0。十筆舊真頁有三筆命中readout自身paint unresolved，原PNG也只是元素crop；手機viewport為320×1000，不能充當320×900完整畫面。代理已交精確來源域與上限39筆正常UI校準方案；僅批准準備工具／故障測試，尚未批准啟動browser。

## 05:59 勞動節原批次實際中止

上表180／2784是先前觀測。原supervisor在2026-10-23T05:59:23.731Z記錄runner27896 exit1、launch_count1、automatic_restart=false；stderr原值 `TypeError: fetch failed`，cause `read ECONNRESET`。原native的source_before／source_after都可能發出fetch，目前例外未附是哪一段的上下文，不推測已完成哪些未回傳操作。

root在確認terminal後執行 `node holiday-lab/layout-qa/labor-finite-native/full-domain-reviewed-20261023/full.cjs --verify`，session12360真exit0，輸出如下：

```json
{"count":332,"complete":false,"stopped":true,"last_hash":"e6584a44e16c3eee86fc9b4e01c95f38f3367d08a98cc784f14011eeadf2b22b","original_pass_count":331,"original_false_count":0,"domain_valid_count":331,"global_ui_pass":false,"full_project_approved":false,"scope":"labor-complete-target-domain-reviewed-2784-20261023","browser_started":false,"native_started":false}
```

331個完整成功目標與第332個失敗attempt均保留。失敗seq331對應 `labor/zh/320x900/output-3-2/output:labor-start-3`，原records/000331只有capture_error，沒有回傳case/sample/PNG；不捏造影像或當成功。原工具fresh-only且無resume，沒有重新啟動2784整批。

代理先把國慶39recipe／312逐owner-frame工具存CHECKPOINT，轉準備獨立續接方案：原331成功不重跑；新scope明列重採失敗義務及其後餘項共2453，逐筆核對原前綴與續接union。尚未批准或啟動續接；原失敗與freeze不可改寫。

## 清明v2先導實跑與原失敗

root讀修後三工具，親跑21tests全綠、唯讀獨立review核28methods／19bindings／672runtime refs exit0，才建立新root批准；freeze SHA4883d940c38a4ac63d59364209102ecb49e220ca63b3754ccb677a8fdcd6a005。

實際指令 `node holiday-lab/layout-qa/qingming-pilot-root-20261023/driver.cjs`，session43047、driver23840／runner42484 creation2026-10-23T06:09:53.6926310Z。唯一root-pilot-01於06:10:12.703Z真exit1；第一組zh320的六個目標case/sample/PNG/checkpoint已保存，六target pass=true、geometry0，但session結束時Console有一條404，未完成session/global source_after，所以整批仍FAIL、不能執行完整run verifier假稱通過。

原Console callback只有字串，沒有location；原http_errors[]也不代表沒有404。root另做一次明標新導航診斷（未開始遊戲），保存 `qingming-pilot-root-20261023/console-diagnostic-01.json`：Console location為 `http://127.0.0.1:8845/favicon.ico`，CDP Network response同URL/status404/resourceType Other。這是新診斷的精確證據，不能回填成舊失敗當時已存的location。

後續僅準備隔離v3方法：保存完整Console/Network與原錯誤，只有精確favicon URL＋404＋Other可判為非目標診斷；任一遊戲資源或未知錯誤仍阻擋，global仍false。不route mock、不清Console、不改凍結measure08／伺服器、不改v2方法／run／freeze。v3尚未批准或啟動。

## 本輪階段保全

已結束的中秋全部783與勞動332attempt原始資料，共8484個QA檔、549249014 bytes逐一驗index blob一致；本機commit `5064130`，git fsck --connectivity-only exit0。另dashboard依原權威v4重產27／27，仍2046／2076、缺30、UI0／1、使用者0；沒有網站產品Build或新版試玩ZIP。介面未變，不重跑相同smoke。
