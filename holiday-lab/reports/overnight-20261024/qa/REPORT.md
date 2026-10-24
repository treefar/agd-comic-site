# 本機系網獨立驗收：8875

source_agent: codex；2026-10-24。有效候選為 `.measure-overnight-20261024-02`、`http://127.0.0.1:8875/`。本代理只寫本資料夾，沒有改產品、切分支、啟伺服器、執行遊戲、Unity、生圖或影音生成；未 push、發布、碰 main、刪檔或執行 C 節。

固定入口：[result.json](result.json)、[command.json](command.json)。原始有效資料另在 green-02/result.json。6 組中／英／日文 × 390／1440 通過，136 個有實際斷言的 yes、0 no，36 張 PNG 全有 SHA。這是本輪限定網站頁面驗收，不是全站、真手機、母語或完整遊戲發布批准。

## 逐項結果

| 驗收項目 | yes/no | 實際證據與限制 |
|---|---|---|
| 正確候選與 HTTP 程式一致 | yes | 首頁 HTML 與 5 個本機 script/CSS，共 6 HTTP/body SHA 對凍結 build |
| 根來源前後未變 | yes | 14 個來源 source_before/source_after SHA 相同 |
| 凍結 build 前後未變 | yes | 360 檔 before/after SHA 相同 |
| 三語桌機完整導覽 | yes | 每組 8 章節＋2 語言，桌機 nav 可見、無 hamburger 代替 |
| 三語手機開關、點章節後關閉 | yes | 390px 真點 hamburger／About，再查 aria-expanded |
| 語言切換可操作 | yes | 真點 EN 或日本語，再核 URL／document.lang；非直接改全域變數 |
| About 標題不被固定導覽遮住 | yes | 章節 top ≥ header bottom−2px |
| 頁尾聯絡與章節操作 | yes | 實讀 mailto／tel 與翻譯標籤，真點 footer About；未撥電話、寄信或送表單 |
| 在校指南三欄／手機單欄 | yes | 1440px 3 欄，390px 1 欄；每組都是 15 卡 |
| 身分索引、篩選及重設 | yes | 6 個身分按鈕、卡片標籤，實際切第 2 項再回全部 |
| 大流程下有小說明 | yes | 每組 47 步／47 段小說明，15 卡皆有流程節點 |
| FAQ 可打開 | yes | 每組 34 題，真點首題並驗答案存在 |
| 招生四 PROGRAM 及同頁可見相依值 | yes | 每組 13 個可見 after 值，共 78 次觀察，全部在實際招生頁文字中找到 |
| 招生全部 16 欄都有畫面曝光 | no | schedule_short、fees/apply、fees/tuition 不在此詳情畫面；這 3 欄僅屬主控 JSON 套用／回歸範圍，不假列可見 |
| 13 教師頭高／眼線幾何 | yes | 6 組共 78 頭，原有逐人 landmark 投影；頭高最大誤差 0.0087px、眼位 0.0165px，物理頭高差 <0.75px |
| 13 教師來源原圖未換寫 | yes | 每組 13 個實際 HTTP 照片 body SHA 對原有原圖 SHA，共 78 筆一致 |
| 日文助理教授不硬套日本助教 | yes | 補驗 ja390／1440 各 13 職稱；10 位助理教授顯示台灣原職＋Assistant Professor，無「助教」 |
| 已測頁面字型載入、橫向安全區 | yes | fonts loaded、documentWidth ≤ viewport+1；指南 headings/buttons/steps 抽查 overflow 記錄為 0 |
| 已測頁面 JS／HTTP 錯誤 | yes | 六組 page errors／badResponses 都為空 |
| 短末行候選已辨別 | yes，有限範圍 | 範圍是 headings/buttons/guide-step/summary/footer/nav 的直接文字，不是每個網站字元；詳見下段 |
| 遊戲未啟動 | yes | 沒點節日 details、遊戲連結／iframe；指南觀察 iframe 0；未執行遊戲 QA |
| 已驗實體手機、所有瀏覽器／母語 | no | 本輪只有 Chromium 390／1440，沒有冒充使用者確認 |
| 網站所有素材已證零 AI | no | 本輪提供實際引用清單，不重新認定全部作品製程／授權或未知來源 |

## 短末行與畫面檢視

Range 字元 y 座標初篩在中文「辦理資訊／常見問題」、日文「手続き案内／よくある質問」共 8 個版位產生候選。這些 h2 都有旋轉，字元 y 隨 x 改變，工具會把同一行錯分成數行，不能視為真孤尾。本輪另保存 role-headings/ 的 6 張實際畫面和 transform 值；實際檢視中文 390 辦理資訊、中文 390 FAQ、日文 390 手続き案内、日文 1440 FAQ，均為完整單行。保留候選原始資料，不把旋轉標題改成沒有設計效果來配合測試。首頁量測的同類直接文字候選均為空；沒有宣稱所有內文與所有頁面都完成缺字或孤尾普查。

教師 landmark 本來是逐張目視近似的冠頂／下巴／眼睛中點，0.02px 量級只代表這些標記點的 CSS 投影誤差，不是人臉辨識精度或重新丈量的生物特徵。本輪保留原圖，沒有生圖或修改照片像素。

## 素材實際引用

result.assets 去重 82 筆，來自首頁、捲動後首頁、指南收合／展開的實際 DOM：img currentSrc、所有元素的 CSS backgroundImage／maskImage、favicon；各 context 仍保留 visible、載入尺寸與自然尺寸。CSS 漸層亦記入，不能將 82 全當作 82 張圖片。新版 favicon 是 `data:,`；舊 8873 的 site-icon.png 留在 baseline-assets.json 作差異，不因新候選停用就刪舊檔。

此盤點證明本輪所見頁面的引用，不涵蓋未開啟的作品詳頁、所有輪播狀態或遊戲內部素材，也不把未識別來源宣告為無 AI。沒有點任何遊戲來擴張素材盤點。

## 指令與真實輸出

```text
node holiday-lab/reports/overnight-20261024/qa/check.cjs http://127.0.0.1:8875/ .measure-overnight-20261024-02 green-02
PASS zh 390 23/23
PASS zh 1440 21/21
PASS en 390 24/24
PASS en 1440 22/22
PASS ja 390 24/24
PASS ja 1440 22/22
{"pass":true,"contexts":6,"green":6,"source_stable":true,"build_stable":true,"unique_assets":82}
exit code 0

node holiday-lab/reports/overnight-20261024/qa/role-headings.cjs
CHECK ja 390 13 roles; 2 rotated headings
CHECK ja 1440 13 roles; 2 rotated headings
CHECK zh 390 2 rotated headings
{"pass":true,"contexts":3,"errors":[]}
exit code 0
```

工具回傳合併 output，沒有分流 stderr，command.json 與 role-headings-command.json 的 stderr 因而明列 null／原因，不捏造空 stderr。每個 PNG 的檔名和 SHA 位於所屬原始 JSON；role-headings 補驗與主 6 context 分開，不灌成 9 個完整網站組。

## 未採認的過程保留

1. baseline-01 為舊 8873；首個 zh390 已完成 19/20，唯一失敗是照片 response.body 收集器在切語言導航後失效。另實際 13 張照片 SHA 全對，但還有 2 次先前導航取消。第 2 組卡在跨頁 body promise，依主控指示 Ctrl-C 停止，exit1，不重跑舊版。原 check-v1.cjs.txt、圖片、partial JSON、baseline-command.json 保留。這不是產品修復；新版收集器只在第二次首頁 faculty 階段收圖，離頁前等待，單張設 8 秒上限。
2. green-01 為 8874 首版，已完成 zh390、zh1440、en390，工具觀察通過。主控另查出說明 105 字違反既有 100 字限制，要求中止；本批 Ctrl-C exit1、partial-superseded，不作最終證據。主控將其精簡為 91 字後建新的 -02；本報告只採 green-02。
3. 一次 PowerShell 字串 patch 解析失敗，未執行 Node 或寫檔；改用 QA 專用 patch-check.cjs，node --check exit0。原產品完全未動，沒有為了讓 QA 通過修改網站。

完整指南資料政策、校規版本、部門資格與來源限制由主控與研究報告承接；本驗收證明渲染與操作，不把頁面可開當作全部校規全文已查明。
