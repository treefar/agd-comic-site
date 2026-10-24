# 進修招生整頁與日文職稱核對

source_agent: codex；2026-10-24，Asia/Taipei。只交研究提案；未改產品、未切分支、未生圖、未執行遊戲或 Unity，沒有 push／發布／main／刪檔／C 節操作。

可以套用的精確清單在 [proposal.json](proposal.json)：招生 16 個同頁欄位，各中文、英文、日文共 48 操作，包含先前四個 PROGRAM 外語整句；另有 4 個日文職稱值。每筆都有檔案、JSON pointer、before、after、來源與理由。保留原有電話與連結，year 仍為 115 歷史年度，沒有把未實讀的 116 名額或日期補進去。

## 本輪確認與可修正處

115 核定表及一般單招表列動遊系四技進修部一般單招 30 名，二技、二專與產攜名單未列本系。原「本頁未列本系名額」錯誤，不能只改善英文學制名而留下錯誤中文。[115 名額表](https://reg.aca.stu.edu.tw/【115學年度】招生系所與名額) 本輪以官方搜尋正文複查，前輪原生 Chrome 表格、DOM、PNG 仍在 program-currentness-20261023 保存。

本輪官方搜尋擷取的招生首頁，四技、二技與二專進修部均顯示 115 招生已結束，並寫請期待 116。直接 open 招生頁回 403；因此「查核至 10/24」指本輪官方搜尋正文擷取，並非本輪 Chrome 原生頁最新狀態。[招生首頁](https://reg.aca.stu.edu.tw/) 原始回應完整保存於 web-research-02.json，不以舊 10/23 截圖冒充本輪。

已保存 B6 明列本系一般單招、書面資料與四技學士學位；其原生考項疑漏「書」字，仍保留原件並結合該頁紅字、應備資料與後頁核對，不將其讀成面試。時段為原則平日晚間輔週末，特殊課程可另排。原文統一「書審＋面試」「免統測／學測」「18:30–21:30」均不宜沿用。[115B6](https://info.stu.edu.tw/attachfile/upload/IRS/file/115B6.pdf)

相依欄位 quota、schedule_short、key_notes、stu_focus、timeline、fees 一起提出修正，避免概要說截止，其他地方仍邀請面試或保證時段。證書「完全相同」、所有資源共用、費用較低及工讀補助承諾欠直接來源，改成已證成的學位層次或明確的查詢指引，沒有編造新金額或資格。D1/C5/E7/E8/E9 各管道的既有原文與實讀頁範圍全保留；不把他系名額／規定套到動遊系，也不推導全校產攜總數。

## 日文「助理教授」

本系官方教師頁逐人並列台灣原職與英文。江雅媚、楊智彰、王宗立、陳寀瑜等列 Assistant Professor；部分教師加 (T)。鄧樹遠列主任、Associate Professor／副教授(技)。現有 data/faculty.json 共 13 人的角色逐筆登錄在 proposal.title_checks，沒有依一個樣本批改中文職級。[本系教師頁](https://www.dgd.stu.edu.tw/系所成員/)

日本文科省通知說明日本新設准教授、助教不訂公定英文，Assistant Professor 可以參考，不能據此推出台灣助理教授與日本助教的法律／聘任條件等同。[文科省通知，記 7](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/003/gijiroku/06062315/006.htm) 本提案用「助理教授（台湾の職名／Assistant Professor）」並保留合聘、從聘、留職停薪原有狀態，不把日本職稱硬套台灣任命。

此為保守的職稱呈現提案，非學校官方日文專名或母語簽核。合聘／從聘各人目前任命不是本輪教師主頁全能證明，保留已有資料而未新認定。蔣天華官方同列英 Assistant Professor (T)、中副教授(技)，本身衝突；本輪維持中文副教授，沒有單憑英文降等。技術職 suffix 是否須另補中文，亦留原產品資料，不擴大本輪修正。

鄧樹遠中英文角色實讀均未含電競／Esports／acting，無需再改。這項只判定目前兩筆角色，不保證所有歷史報告或舊凍結 build 都沒有歷史字樣。

## 處室與資格舊修正

既有 12 筆正式名稱修正逐一定義回讀，均仍等於其 plan.expected：10 筆生輔組英文 Student Assistance Section、2 筆台灣「技術士證」說明。原研究依生輔組中英文官方組織／職掌支持名稱部分；本輪英文組織頁直接 open 403，不將這次失敗說成新全文查證。正式日文單位名未查得，不另造名稱；也不藉這 12 個名稱批准整段獎助／兵役／請假政策。[前輪逐筆研究](../../../translation-review/proper-names-research-20261023/REPORT.md)

## 實際命令與結果

```text
cwd C:/agywork/agd-holiday-prototypes
node holiday-lab/reports/overnight-20261024/program/assemble.cjs
{"fields":16,"operations":48,"title_operations":4,"faculty_checked":13,"program_values":4,"all_before_present":true,"product_written":false}
exit code 0

node holiday-lab/reports/overnight-20261024/program/verify.cjs
{"yes":75,"no":0,"product_written":false}
exit code 0
```

完整指令輸出與 exit code 在 assembly-command.json、verify-command.json；逐條 yes/no 在 verification-result.json。工具回傳合併 output，未另提供 stderr 欄，因此不虛構分流 stderr。前期 rg 的 Windows glob 參數錯誤與一次搜尋服務錯誤未當證據，最後使用 JSON 精確指標驗證；未改產品配合工具。

| 驗收 | yes/no | 邊界 |
|---|---|---|
| 先前四 PROGRAM 整句均有精確替換提案 | yes | 英日各 summary/content |
| 招生相依 16 欄三語一起處理 | yes | 48 指標，不只改兩個摘要 |
| 每筆 before 與本輪實檔一致 | yes | replace 精確相等，JA add 確認不存在 |
| 4 日文職稱與全數姓名引用有登錄 | yes | 原職保留，不宣稱任命全已重新核定 |
| 原 12 名稱修正仍符合已核 plan | yes | 未把名稱證據擴大為程序證據 |
| 產品來源 SHA 在研究前後一致 | yes | 5 來源 SHA 保存於 proposal |
| 116 所有新簡章與職稱矛盾已解決 | no | 未實讀全部 116；蔣天華官網雙語衝突待校方更新 |
| 已套產品、重建或瀏覽器驗收 | no | 本子任務只產出提案，交主控分支實作 |
| 母語者審閱／全站批准／發布 | no | 未執行，不升格 |

實作注意：中文 canonical 改字後，日文字典要新增對應的新中文 key；保留舊 key 不刪。locale-en.js、locale-ja.js 必須由既有建置重產，不能只手改生成檔。套用後本研究 before 檢查會預期轉為不符，應以主控另存的套用收據與新頁面驗證證明 after，而非回寫原提案抹掉 before。
