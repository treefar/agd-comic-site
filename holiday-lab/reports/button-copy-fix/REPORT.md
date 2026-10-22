# 按鈕文案與紙面安全區 L2：歷史證據與待複驗

2026-10-23（台灣）。目前產品僅保留四款自然短句；所有教師節／開學的局部 padding 與其 mock DOM/style 測試修改已依主控指示撤回。**目前尚未宣稱版面修完**，等待主控共用原圖九宮格與 sampler 新映射的凍結版，再跑本目錄回歸。

## 最終保留的產品差異

| 款式／實際 id | 英文原句 → 新句 | 其他 |
|---|---|---|
| teachers／teachers-line-3 | Thank you for always watching with patience. → Thanks for always watching patiently. | 保留 always、耐心、觀看與謝意；其他五句不動 |
| national-day／island-reset-shot | Reset this composition → Reset composition | 重排構圖原意不變 |
| peace-memory／peace-listen | Listen to the whole message → Listen in full | 完整聆聽原意不變 |
| labor／labor-save | Save the animation relay → Save relay | 接力語境由遊戲標題與說明提供 |
| labor／labor-preview | Preview relay (10× time) → Preview relay (10×) | 日文受け渡しを早送り（10倍）→リレー再生（10倍速）；保留接力及10倍速，提示仍說明為預覽 |

`semester-window-1` 的正式單位名 Registration and Curriculum Section 完整保留，產品無 diff。所有 id、key、規則、score、時間單位、其他文案、字級、素材與 safe 均未改。局部留白已撤回，不以 optional chaining 掩蓋 mock 缺介面。

## 真紅與候選紀錄（全部保留）

| 證據目錄 | 操作與實際結果 |
|---|---|
| candidate | 原8819教師節normal上越3.669／下越4.762px；國慶en1440右越1.091px；和平en320 hover下越0.120px。自然教師節短句仍hover下越0.120px，2/3通過，未拿候選當產品綠 |
| candidate-02 | 口號式 Always patient. Thanks! 三態能放下，但語意與自然度被主控退回，產品未採。stdout模式名稱誤印actual product，JSON仍標original/candidate；此輸出不作產品證據 |
| candidate-03 | 自然短句＋單一教師節選項上下18px，三候選三態通過；只是同頁候選 |
| candidate-labor | labor-save en320右越1.455；labor-preview en1440左右越1.098／1.381；日文320左越0.299、1440左越3.007；短句候選4/4三態通過。實際id為labor-preview，未照工單口語誤寫labor-play |
| product、product-all、product-all-final | 獨立build01／02目標18/18、30/30。最終帶id的90張viewport版在product-all-final；原product-all勞動兩按鈕檔名相同，部分截圖被後個覆寫，故重跑新目錄補齊，舊檔保留不混用 |
| candidate-teachers-all | 主控要求六台詞上下18px，另三句en1440仍水平紅，0/3；未把加高當通用修復 |
| candidate-teachers-all-02 | 實讀原padding左右32px／上下16px，再同頁六句改40／18，三條三態候選與當時全頁geometry0。但後續真圖發現en320另一台詞換3行，局部方案撤回 |
| product-all-03 | build03／8840的30/30目標綠僅歷史；不是全頁綠，不拿來證明最新產品 |
| candidate-semester | 初跑8819無新版semester-window-1，timeout保留，非產品本身壞掉 |
| candidate-semester-02 | 改用03／8840真新版：正式窗口en1440左右越1.163／2.784px，實讀padding32px，同頁+8變40px後三態候選全頁geometry0；沒有縮單位名 |
| product-all-complete-04 | 先前獲准的局部40/18與窗口40版本，build04／8841，36/36目標108態綠。此為**已撤回方案歷史**，不代表現行產品。主控改通用九宮格時04已建，因此已通知主控改用fresh05等新目錄，避免覆寫 |

主控根因修正：原整張按鈕圖被拉伸，固定內框與長句不合，逐句padding會造成不同尺寸的新換行。主控接管共用CSS的原圖九宮格，量測代理接管真映射。本代理停止逐句修留白，只保自然短句。

## 指令與原輸出

每輪完整JSON、raw sample、viewport及原stdout均在對應目錄。瀏覽器腳本不匯入遊戲規則；使用真DOM、滑鼠normal/hover/mousedown與原版browser-sampler／asset-safe-regions。Canvas僅measureText，沒有繪製UI。每次保留全部nodes/blockers/violations；新版腳本亦保存全頁geometry errors，目標邊距以unclipped ink計算，0容差，不以裁切掩蓋。

```powershell
node holiday-lab/reports/button-copy-fix/browser.cjs candidate
# TOTAL 2/3; stable=true; errors=0 （exit 1）
node holiday-lab/reports/button-copy-fix/browser.cjs candidate-labor
# TOTAL 4/4; stable=true; errors=0
node holiday-lab/build-review.mjs .measure-button-copy-04 --measurement
# MEASUREMENT_ONLY: .measure-button-copy-04; 356 files; no publication performed.
$env:BUTTON_BASE='http://127.0.0.1:8841'
node holiday-lab/reports/button-copy-fix/browser.cjs product-all-complete-04
# TOTAL 36/36; stable=true; errors=0 （舊局部padding版歷史）
node holiday-lab/reports/button-copy-fix/verify-code.cjs
# YES teachers/national-day/peace-memory/labor: only approved label copy
# YES semester: unchanged
node --test holiday-lab/tests/teachers.test.mjs holiday-lab/tests/national-day.test.mjs holiday-lab/tests/peace-memory.test.mjs holiday-lab/tests/labor.test.mjs holiday-lab/tests/semester.test.mjs holiday-lab/tests/semester-tasks.test.mjs
# tests34 / pass34 / fail0（撤回局部padding與fixture後，label-only-pure-output.txt）
```

初增特殊DOM操作時，舊teachers mock沒有querySelector曾17/20紅；獲准補fixture後20/20綠。群組留白精準assert先2/5紅、semester先1/4紅，後合計34/34綠。這些紅綠輸出完整保存；隨局部方案撤回，fixture也回到原行為測試，最新34/34重跑通過，沒有保留不再適用的style斷言。

所有build均measurement only，完整正常build含主控JSON譯文與runner當時版本；出現既有SSR/client duplicate color兩警告，exit0。未把這些warning當lint通過。原07／8819與09／8830沒有改buildfiles或啟停；本代理03／8840、歷史04／8841服務留給主控，未發布。

## 收據與驗收界線

每輪results.json的before/after是HTTP Buffer raw SHA，包含所測遊戲、runner與lab.css；前後一致，沒有用Git正規化SHA替代。sampler及固定asset map SHA也保存。`final-summary.json`專指舊02歷史摘要，不是本輪最新完成章。

| 條件 | yes/no |
|---|---|
| 原8819三紅、勞動四紅、03正式窗口真紅有證據 | yes |
| 新自然譯文保原意；正式單位名與遊戲行為完整 | yes |
| 目前僅四個產品檔有label差異，semester及兩fixture無diff | yes，verify-code及git diff已核 |
| 局部padding、所有誤標／失敗／歷史證據保留 | yes |
| 最新label-only純測試34/34 | yes |
| 最新通用九宮格版三語兩寬三態與全頁geometry已複驗 | no，等待主控凍結URL |
| 所有全頁、所有捲動、所有狀態layoutgate完成 | no，限定證據不能替代全矩陣 |
| 全部逐張人工／使用者美術確認、真人盲測 | no；代理已實看原三紅、候選教師節與勞動英日代表截圖，未冒稱美術確認 |
| push、發布、碰main、刪檔、Unity | no |

下一步：主控提供九宮格新凍結URL後，設定BUTTON_BASE，以新目錄跑product-all-complete，再核對真全頁errors與served SHA；不覆蓋03／04歷史。
