# 全面試作續作：指南日英術語整合與原生短鏡驗證

2026-10-23；source_agent: codex。上一目標輪屬於進展：兩語獨立審校已落地並找到確切差異。本輪繼續整合實作，沒有把全面試作縮成翻譯單項完成。

## 可見成果與分工

- 日文獨立分支 `codex/ja-guide-terms`，2b7d032 整合為 daeb9d7：四個 JSON 精確20值，保留原校務條件與中文單位名稱。
- 英文獨立分支 `codex/en-guide-terms`，f2836f0 整合為 c3bcb89：四個 JSON 精確29值，包含24處單位名稱、3項休學與4項抵免的兩個重疊句合併。
- 主控統一重產兩份 locale，整份字典與固定94ed07e相比只有 JA20、EN29 值差異；其他譯值完全一致。正式機構身份、學位／證照、免修／抵免混合句待證項未套用。
- 新建 `.measure-integrated-11`，356檔、`app-TQ4G6C6Y.js`，8852僅內部量測；8800舊審閱版與舊ZIP未動。建置有既有 duplicate color 兩警告及21個unpaired paths，沒有把警告說成0。

## 實際命令與 yes／no

| 驗收 | yes／no | 實際命令／結果 |
|---|---|---|
| JA20值、生效來源及完整非目標JSON不變 | yes | `node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs --verify` → APPLIED20/20、winning sources20、other values/keys unchanged；exit0（於重產locale前） |
| EN29值、重疊兩句合成及pending保留 | yes | `node holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs --verify` → all_winning_values_match、all_non_target_values_equal、pending_exemption_kept=true；exit0（於重產locale前） |
| 主控新建置成功 | yes | `node holiday-lab/build-review.mjs .measure-integrated-11 --measurement` → assets257/screens9 policy pass；Translations2315/JA2344；356 files；exit0。measurement不代表可交付 |
| 整份生成字典只變49值 | yes | `node holiday-lab/translation-review/verify-guide-terms11.cjs` → JA20/EN29、all_other_generated_values_equal=true；exit0 |
| 保留遊戲與既有公開中文內容 | yes | 上列腳本10→11 runtime283檔逐byte相同；`node --test tests/japanese.test.cjs tests/shared-language.test.cjs` →13 passed/0 failed，含固定公開中文基準保護 |
| 雙寬實際指南文字與版面 | yes（有限範圍） | 獨立 guide-terms-rendered11：320/1440共98目標，84實際可見且owner-contained/無水平溢出，14為7個不在served指南資料的舊字串×兩寬，另列not-rendered |
| 可見新譯的實際字型cmap | yes（有限範圍） | 84 cases、3528 character-style pairs，missing0/unknown0/font parse errors0；不是像素級墨跡全域定理 |
| 新春節JA短字幕原生回放補證 | yes（有限範圍） | `node holiday-lab/layout-qa/newyear-ja-caption-current/verify-aggregate.cjs` →18 stable captures/0 geometry errors/source stable；舊2跨鏡失敗保留，僅補3/7兩鏡，沒凍結動畫或改140ms輸入 |
| 春節目前程式與真DOM功能 | yes（有限範圍） | `node --test holiday-lab/tests/new-year.test.mjs` →4/4；8847真DOM new-year/zh/1440 →1/1，完成/作品/3鏡/重玩/資源皆pass |
| 儀表板數字依目前模組與來源計算 | yes | `node holiday-lab/build-dashboard.mjs` →15模組功能/15、使用者確認0、權威與格式23/23；`node holiday-lab/dashboard/smoke.cjs` →2/2 |
| 完整2076 UI交付閘門 | no | `node C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs --project .` →exit1，R0原13case且final fingerprints intentionally absent；實際輸出 layout-gate11-output.txt |
| TF-BASE兩個Unity專案源及WebGL已回傳 | no | 本輪實讀交接夾仍5份既有工單/腳本，沒有實際來源或build；未啟Unity、不改遠端權限 |
| 新版試玩包／正式發布已交付 | no | 完整UI gate尚未通過，不新增ZIP、未push、未發布、未碰main、未刪檔、C節不動 |

主控首次誤用不存在的英文工具檔名 `apply.cjs` 得到 MODULE_NOT_FOUND，隨即改用實際 `apply-verify.cjs` 重驗 exit0；不是產品執行失敗，也沒有用失敗命令宣稱通過。原代理首次apply後CRLF guard假紅另見其 first-attempt.md，最後完整比對才作驗收。

## 尚需完成

固定08的完整長矩陣仍在原程序運作；不可因本輪49譯值或18短鏡通過就宣稱整體交付完成。原已提交索引快照1434/2076（來源08），剩餘靜態錯誤最大值、動態文字／scroll／marquee等方法缺口維持NO。

新增第三批 `6c27587`：dragon-boat／teachers／national-day／exhibition 共16固定錯句、96有限候選群、252真拒絕收據；前三者中的dragon-boat、teachers及exhibition共18個eligible context，national6個僅補充，動態island-readout未被固定hint證明。12張mobile原圖的hint原不在viewport，代理針對同來源、phase0、控制recipe與精確文字正常捲動補拍12 PNG，原WEBP/fullcase/SHA均保留。主控已讀完整REPORT，來源第一次ECONNRESET與精確重讀記錄亦保留，沒有重啟長矩陣。正式R0不改。

最後已提交索引 `c5e3258`：1620/2076，缺456、幾何0、national6個supplement-only仍在missing。主控讀實際JSON確認，並重跑`node --test holiday-lab/tests/layout-static-proof-contexts.test.cjs`：5 passed/0 failed，包含錯height／重複／未宣告game與動態secondary不得自動放行的負例。前述1434只保留歷史快照，不是最新值。front已15/15完成、3174幀／0幾何；phase仍11/15，semester52792、qingming46996實查live。此快照不把剛完成的front額外幀數手動加進覆蓋。

主控依契約report路徑實算正式R0 SHA為`cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336`、13 cases，確實未改。另派中秋有限域native先導，只准最多1000候選做真hint/clone一致性及效能驗證，不啟百萬全集；不能以outline＋1px未證定理清掉GLOBAL_BOUND=NO。

下一輪第一件事：讀指南DOM最終報告與新static第三批，核原08程序是否仍活著及其新增完成列；把已獨立確認的原始證據整合進型別明確的驗證表，補齊真缺口後才產正式總report、跑交付gate與新版試玩包。TF-BASE來源到齊後再走6000.5.10f1隱藏batch守門，不能因本機有Editor就當遠端遊戲已完成。
