# 新對話接手總表｜系網漫畫版

更新：2026-10-24，台灣時間。source_agent: codex。這份文件是新對話的入口；歷史段落若與本表及 LATEST_HANDOFF 最上方衝突，以較新的使用者裁定為準。

使用者本輪表示「有覺得不錯」，想開新對話接手。記為對8897海報清晰度及角落資訊方向的正向回饋，保留這個方向；不等於全站驗收通過、發布批准或遊戲解凍。儀表板原使用者確認計數不在這個純文件回合擅自升格。

## 先到正確工作樹

| 用途 | 實際路徑／狀態 |
| --- | --- |
| 最新網站程式，開新對話時選這裡 | `C:/agywork/agd-holiday-prototypes` |
| 本表正本 | `C:/agywork/agd-holiday-prototypes/work-orders/20261024/NEXT-CHAT.md` |
| 原專案的同內容副本 | `C:/Projects/系網漫畫版_AGDComicSite/work-orders/20261024/NEXT-CHAT.md` |
| 原專案總交接 | `C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md` |
| 工作樹狀態交接 | `C:/agywork/agd-holiday-prototypes/holiday-lab/STATUS.md` |
| Vault專案紀錄，本機備援 | `C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md`；跨機先用manage-obsidian-memory解析Vault，不寫死磁碟 |
| 最新產品基底 | 分支 `codex/poster-corner24`，commit `c66ef5b0` |
| 本次純文件接手分支 | 工作樹 `codex/newchat-handoff24`，由上述產品基底接續；原clone `codex/newchat-receipt24` |
| 原clone上一輪交接基底 | `codex/corner-handoff24`，commit `24e077e7`；不是最新產品來源 |

重要：最新產品在agywork工作樹。不要拿原clone內較舊的網站檔覆蓋它。這輪所有成果未push；另一台電腦新clone不會自動取得這些本機分支。這次接手請使用同機既存工作樹，不自行搬遷、同步或發布。

## 第一輪閱讀順序

1. 完整讀本表，再讀原專案 `LATEST_HANDOFF.md` 最上方最新段落與原文C節。
2. 讀 `holiday-lab/STATUS.md` 最上方最新段落。
3. 讀 `holiday-lab/reports/poster-corner-20261024/REPORT.md`、`result.json`、`verification.json`。
4. 讀 `holiday-lab/dashboard/progress-policy.json` 了解當前權威狀態來源。
5. 要處理哪個缺口，再讀下方該項保存研究；不要重跑全部歷史QA。
6. 原工單 `work-orders/20261024/AFTER-0100.md`、`work-orders/20261021/VERIFY-run2.md` 留存歷史。裡面的8873等舊網址、舊工作序及遊戲測試安排，不能覆蓋最新8897與凍結裁定。

## 最新可看版本與重啟

| 頁面 | URL |
| --- | --- |
| 中文首頁 | `http://127.0.0.1:8897/?lang=zh` |
| 英文首頁 | `http://127.0.0.1:8897/?lang=en` |
| 日文首頁 | `http://127.0.0.1:8897/?lang=ja` |
| 在校指南 | `http://127.0.0.1:8897/?lang=zh#/students/guide`；英日改lang |
| 頁底既有學生策展示範入口 | `http://127.0.0.1:8897/?lang=zh#student-play` |
| 單頁儀表板 | `http://127.0.0.1:8897/progress/` |

目前量測建置：`.measure-poster-corner-20261024-03`，79檔，`app-3RVTPKHI.js`。`holiday-lab/latest-build.json`記錄完整路徑。8892為小海報、8894為舊橫條版；8895／8896是中途候選，其他舊候選保留，不能當最新版。

先檢查服務，已在跑就不重啟：

```powershell
Set-Location -LiteralPath 'C:/agywork/agd-holiday-prototypes'
Get-NetTCPConnection -LocalPort 8897 -State Listen -ErrorAction SilentlyContinue
git -c core.longpaths=true status --short
git -c core.longpaths=true branch --show-current
```

若服務確定未執行，且量測建置仍在，再啟動：

```powershell
node scripts/serve-local-review.cjs --site=.measure-poster-corner-20261024-03 --dashboard=holiday-lab/dashboard/out --port=8897
```

若建置遺失，先確認，不能宣稱舊頁面仍是新版。網站建置指令為 `node scripts/build.mjs --local-review --out=<新的未使用量測目錄>`；再只複製 `holiday-lab/student-curation.html`、`.css`、`.mjs` 到該建置的 `holiday-lab/`。不要拷貝節日runtime，不覆寫舊量測目錄，不啟Unity。

## 已完成、應保留的成果

- 原漫畫首頁、集中線、標題、泡泡、SFX及PRESS START保留；桌面導覽集中，右側四快捷連結保留。英日共用介面及在校指南保留。
- 海報鋪滿「畫出來，動起來」整格。只在顯示層依頁框裁切，八件原圖不改。預覽不透明度88%、停格96%、集中線6%。資訊與抽選在右下小面板：桌面304px／手機240px，完整作者及老師保留。
- 八件目錄在 `data/student-work-draw.json`；小颯原作與七件既有2026成果。原圖／作者／連結來源與SHA在 `holiday-lab/reports/student-work-draw-20261024/catalog-proof.json`。
- 抽選約2.7秒減速停格、相鄰結果不重複，保留暫停、立即停格、Escape、靜態模式及作品連結。使用穩定 `.swd-surface` 觀察離屏；不能改回會由div換a的觀察目標。
- 透明泡泡列曾擋住角落按鈕，現改為縮小列的實際寬度；不要又用整列padding製造透明攔截區。手機彩蛋已恢復浮動定位，不再多撐空白格。
- 在校指南目前15卡、89筆來源，涵蓋：畢業檢核、校外實習、證照認列、請假、選課、抵免、專題、英文、休復學／兵役、獎助／急難、求助、就業、升學、海外實習、海外見學。三欄及身分索引、大流程下的小說明與FAQ保留。
- 鄧樹遠不得出現「電競代理主任」；教師照片以版面調整頭部比例／水平線，原檔不改。已做過的翻譯及PROGRAM整句修正不要反向覆蓋。
- 頁底只放既有學生作品策展示範，維持招生後、頁尾前。不是節日遊戲恢復，也不是Flora／胖倉鼠WebGL已整合。

## 完整待辦與優先序

下面六項no包含來源或驗證範圍限制，不等於已發現六個網站bug，也不是自創新的發布門檻。先沿用保存研究，再針對實際缺口補資料。不要只改少數項就宣稱所有歷史需求完成。

| 順序／狀態 | 待辦 | 完成判定與保存來源 |
| --- | --- | --- |
| 1，接手第一步 | 保留8897方向，先做只讀版本確認與必要複驗 | 確認服務、分支、建置、四dirty及原圖；看中英日首頁／手機、角落兩按鈕及作品目的頁。只修重現的問題，不全面換版 |
| 2，待核 | 全部正式職稱、處室中英日名稱及外文翻譯 | 逐筆對官方來源，列已確認／衝突／缺件；助理教授等不可憑近似職位硬換。先讀 `holiday-lab/reports/goal-audit-20261024/translation-review.json`、`requirements-review.md`及`holiday-lab/reports/followup-20261024/contacts/REPORT.md` |
| 3，待補當期資料 | 在校指南的正式規章、表單及適用年度 | 以學生15題逐題查處室及系網消息；核當屆實習、海外實習／見學、證照、英文與畢業門檻等。過期、未讀全文及版本衝突明列。先讀 `holiday-lab/reports/legacy-reader-20261024/REPORT.md`及`holiday-lab/reports/legacy-reader-review-20261024/`；舊DOC已補讀，不重做解析，舊表50%比例不能直接套本屆 |
| 4，待擴充驗證 | 中日全站缺字與短末行 | 先保留字體、以不影響原意的說法處理，姓名／正式資格不可改字；缺太多才考慮相近完整字型。先讀 `holiday-lab/reports/copy-actions-20261024/delta-verification.json`、`font-delta-command.json`，不可把局部字元檢查說成全站通過 |
| 5，待核來源 | 全站既有圖片製程與使用權 | 小颯作者已由使用者確認；其他既有作品／照片尚未逐件全核。來源不明列待核；已知生成素材停用網站引用但原檔留存。先讀 `holiday-lab/reports/overnight-20261024/root/asset-audit.json`，不得宣稱全站零AI或所有改編權已核 |
| 6，待實測 | 實體手機、英日母語審閱與最新版獨立複驗 | 已有Chrome模擬／歷史翻譯證據，最新8897是主控CSS窄驗，不能升格全站／真機／母語／完整WCAG。獨立驗收若安排，只查當前網站範圍，不帶起節日QA |
| 7，暫緩／待包件 | TF-BASE Flora／胖倉鼠WebGL | 最近保存回查是2026-10-24 11:13台灣時間，指定夾只見5份工單／腳本、無成品；本次沒有新查雲端。使用者已允許遊戲先不放，不阻擋網站審閱。僅有完整新包才做本機驗包／頁底整合；不啟Unity、不彈執行檔、不下載大型舊包、不重派遠端工單 |
| 8，凍結 | 所有節日遊戲，含勞動節 | 不新增、不修改、不測玩、不續跑巨量QA；歷史未完QA不是新對話的續跑清單。只有使用者重新明確授權才解凍 |
| 9，只有概念 | 《一揆》參考的原創校園冒險 | 影片已辨識；概念在 `holiday-lab/reports/student-work-draw-20261024/校園冒險參考.md`。沒有立項或實作，不自行開新遊戲、搬原作素材或生成美術 |
| 10，未獲新授權 | 對外整合、push、main、發布 | 目前僅本機。早期只上英文的例外不能當成本次發布授權；未來取得明確授權後，另比較當時線上最新更新，避免覆蓋他人更新，並排除暫緩遊戲 |

TF-BASE保存證據：`holiday-lab/reports/legacy-reader-review-20261024/webgl-recheck.json`；指定Drive資料夾為 `20261022-student-webgl`，ID `1AyLeNipIEaKPWxgy685eLpuldnlIEsiD`。目前狀態參考 `holiday-lab/reports/no-game-review-20261024/pending-review.json`，不要把舊回傳當此刻的新查詢。

## 最重要的程式與資料入口

| 範圍 | 路徑（相對最新工作樹） |
| --- | --- |
| 海報布局、透明度與角落面板 | `student-work-draw.css` |
| 元件、三語控制文字、署名及觀察器 | `student-work-draw.jsx` |
| 抽選計時與隨機模型／回歸 | `student-work-draw-model.js`、`tests/student-work-draw.test.cjs` |
| 八件作品資料 | `data/student-work-draw.json` |
| 原首頁／其他章節 | `chapters-1.jsx`、`chapters-2.jsx`、`holiday-home.jsx`、`holiday-home.css` |
| 網站共用布局／三語 | `app.jsx`、`pages.jsx`、`styles.css`、`locale-en.js`、`locale-ja.js`及`data/en/`、`data/ja/` |
| 指南 | `student-guide.jsx`、`student-guide-model.js`、`student-guide.css`、`data/students/guide.json` |
| 教師照片版面 | `faculty-portrait.js`、`faculty-portrait.css` |
| 網站建置／本機服務 | `scripts/build.mjs`、`scripts/serve-local-review.cjs` |
| 儀表板來源與產生器 | `holiday-lab/dashboard/progress-policy.json`、`holiday-lab/build-dashboard.mjs` |
| 儀表板權威與離線輸出 | `holiday-lab/dashboard/overnight-authority.cjs`、`holiday-lab/dashboard/out/index.html` |

## 驗收證據怎麼讀

- 最新CSS階段：`holiday-lab/reports/poster-corner-20261024/`。七組126條通過、Build exit0、11項HTTP／SHA、8897 Console error0；不是新全站驗收。HTML及JS與8894逐SHA相同，所以這階段未重跑模型測試。
- 之前模型及完整抽選：`holiday-lab/reports/student-work-draw-20261024/`；10模型回歸、十次實際抽選、八目的頁證據只限原本明列版本。
- 滿版與穩定觀察器：`holiday-lab/reports/full-frame-posters-20261024/`；不可把舊綠燈直接套修改後版本。
- 儀表板目前53列／47yes／6no／使用者確認0；數字是逐項核對狀態，不是全站完成率。權威狀態 `holiday-lab/reports/poster-corner-20261024/verification.json`，1926來源SHA。
- 每項改動後做相稱的Build、三語／手機及實際操作；逐條yes/no，附真實command、stdout、stderr、exit code與必要畫面。修改與驗收證據同批保存。舊失敗、未測、阻礙不刪、不轉成功。
- 既有各階段 `guard.cjs` 有鎖定當時分支；不要不讀程式就直接在新文件分支上跑，否則會因分支名稱不同失敗，不能誤判為產品壞掉。

儀表板需因新階段重產時：

```powershell
node holiday-lab/build-dashboard.mjs
node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs
```

## 保全與不可做的事

- 每項用 `codex/<短名>`，從現有最新工作樹基底開，不push、不發布、不碰main、不刪檔。不要先reset／clean／覆寫他人修改。所有Git指令加 `-c core.longpaths=true`。
- 原clone與工作樹當前本機記錄的 `origin/main` 都為 `1b8322e69d84549db220d849afb1aac0fb9d7c2a`；本回合未fetch，這不是GitHub即時狀態。
- C節完整保留、不執行。本回合前原文SHA：`95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680`。
- 不用AI生成插畫、UI、圖示、照片或影音；盡量沿用小颯及既有學生作品，保留原圖與正確署名。不全面換版。
- 不同步推送私人Vault；只更新既有專案紀錄的本機副本。開新對話不建立新排程或重播舊0100工單。
- 原四份tracked dirty及R0必須保留，值如下；其他歷史untracked QA目錄也不清理。新對話先比對實際狀態，不因看見dirty就認為是本輪造成。

| 原有檔（相對工作樹） | SHA-256 |
| --- | --- |
| `holiday-lab/layout-qa/labor-continuation-independent-review-20261023/CHECKPOINT.md` | `6722a0cdb1798daf25dbfff950103c633d17bfafebdf8858c4743ef3492d5f9d` |
| `holiday-lab/layout-qa/labor-finite-native/continuation-20261023/CHECKPOINT.md` | `02b74b6bae38cab26f17d6e085dd840c033990fc346d29020e9d394265389e5d` |
| `holiday-lab/layout-qa/phase-latest.json` | `f6762b3b724f9e7890def79ed876b4c34e1037528d7ec9e2d5863fa5fee5f593` |
| `holiday-lab/layout-qa/qingming-native-v3-20261023/CHECKPOINT.md` | `914e505961a0f653cd16d842cc9b7c65bcac664544dd4dc7f895c5abd8e64edb` |
| R0 `holiday-lab/layout-qa/layout-report.json` | `cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336` |

## 可直接貼到新對話

```text
請接續系網漫畫版專案。工作目錄用 C:/agywork/agd-holiday-prototypes。
先完整讀 work-orders/20261024/NEXT-CHAT.md，再讀 C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md 及 holiday-lab/STATUS.md 最新段落。
目前最新本機版是8897，.measure-poster-corner-20261024-03；保留原漫畫首頁、清晰滿版學生海報及右下小面板。我已表示這個方向不錯，不要重做首頁。
先核對分支、四份原有dirty、服務及保存證據，按總表優先序列出仍需處理的實際問題，再逐項修正與驗收。保留中英日、在校指南及線上既有更新。
不push、不發布、不碰main、不刪檔，C節完全不動。所有節日遊戲含勞動節仍凍結；Flora／胖倉鼠先暫緩，不啟Unity、不重派、不下載舊大包。
沿用現有學生原作及署名，不用AI生成素材。完成階段後更新儀表板、原交接及本機Vault紀錄；逐條yes/no附實際指令輸出、未測與阻礙，不把舊驗收升格為新版本全部通過。
```
