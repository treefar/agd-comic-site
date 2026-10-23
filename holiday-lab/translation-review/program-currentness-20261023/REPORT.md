# 進修部四條 PROGRAM 新候選

查證基準日：2026-10-23。已備妥 PROGRAM-01／02 各英文、日文共4候選，以及兩條共用中文原文候選。完整逐筆原值、pointer、新值、來源、相依欄位在 [proposals.json](proposals.json)。本輪只研究，未改網站、字典或交接。

## 可直接審閱的中文

摘要：

> 115學年度動遊系四技進修部一般單獨招生30名，現已結束招生。二技、二專及產學攜手為不同管道，該年度招生名單未列本系。

內容：

> 本系115學年度四技進修部一般單獨招生30名，採書面資料審查；截至2026年10月23日已結束招生。該年度二技、二專及產學攜手招生名單未列本系。
>
> 學制：二技、四技為學士課程；二專為二年制專科課程，修滿規定可取得副學士學位。報考前請核對各管道簡章的學歷、身分與應備資料。
>
> 四技進修部原則上安排週一至週五晚間，輔以週六、週日；特殊課程可另行排課，實際時段以課表為準。二技、二專的時段依各系科規定。
>
> 下一次招生請查看新學年度公告；舊名額不代表目前仍可報名。

這是新的審閱候選，尚未套用。英日文與上文逐段對齊，完整值放 JSON 避免在兩處抄寫後漂移。英文用 bachelor’s completion 說明二技為銜接學士課程，associate-degree 說明二專；日文保留二技／四技／二專並加白話課程說明，不宣稱學校官方日文專名或日台資格等同。

## 原文校核

| 原說法 | 結論 | 證據 |
|---|---|---|
| 目前未列本系名額 | no | 原生115核定表及一般單招表均列動遊系進四技30名；B6簡章也一致 |
| 本系二技、二專及產攜都有管道 | no | D1七系、C5五科均無本系；原生四技表本系產攜0，E7/E8/E9招生班別亦無本系 |
| 統一採書審＋面試 | no | 三一般單招列資料書審；E7/E8書面100%。專班契約的轉廠面試不是入學面試 |
| 所有管道免統測／學測 | 未證成 | B6/D1/C5考項及文件不列兩測，但未查得此概括保證；E7/E8/E9只明文不論有無統測且另有限制，不推及學測 |
| 固定18:30–21:30 | no | B6只列平日晚間輔週末、特殊可另排；D1/C5依系科有白天／整日／週末安排 |
| 115名額等於現在可申請 | no | 原生首頁二技／四技／二專卡片均標115招生已結束 |

## 原生來源與實讀層次

1. **Chrome原生表格**：已展開核定與進四技一般單招表，保存全部欄位／列的DOM JSON及實際螢幕截圖。核定表進四技30、進二技／二專空白；一般表本系運動0、一般30、產攜0。此輪已補足前輪只有官方搜尋擷取的缺口。[115核定及分管道表](https://reg.aca.stu.edu.tw/【115學年度】招生系所與名額)
2. **Chrome原生首頁**：三個學制卡片的標題、115年度與招生已結束，逐卡擷取到 native-closed-statuses.json；不靠搜尋索引推今日狀態。[招生首頁](https://reg.aca.stu.edu.tw/)
3. **官方簡章索引**：讀115欄實際PDF連結，不猜檔名。六份檔案均下載真HTTP200、檔頭PDF、有bytes與SHA，記於 download-receipts.json。[官方簡章索引](https://info.stu.edu.tw/aca/newirs/qryIRSpdf/qryIRSCourse.asp)
4. **B6四技一般單招**：看封面、時程、資格、印刷p8全表、應備資料、成績與複查考項；p8原生PDF渲染檢視在115B6-p9.png。該頁原檔也寫「面資料審查」，屬疑似漏「書」字，並非只有抽字錯誤。同頁紅字上傳欄、注意事項與後頁應備資料均指書審，不能把第一個「面」讀成面試。[B6，第9個實體頁](https://info.stu.edu.tw/attachfile/upload/IRS/file/115B6.pdf#page=9)
5. **D1二技一般單招**：印刷p4列七系、書審、各系時段及學士學位；核對時程與成績段落，p4渲染檢視保存。[D1，第5個實體頁](https://info.stu.edu.tw/attachfile/upload/IRS/file/115D1.pdf#page=5)
6. **C5二專一般單招**：印刷p4列五科、各科時段、書審與副學士，另看資格／時程／應備資料／成績。p4渲染檢視保存。[C5，第5個實體頁](https://info.stu.edu.tw/attachfile/upload/IRS/file/115C5.pdf#page=5)
7. **E7、E8、E9產攜**：回讀各班別清單，不從一份推全部。E7三班、E8單班與E9休閒餐飲班均非動遊；E7/E8選考書面100%，有另外報到與廠商媒合程序。其附件轉廠文字雖含面試，不納入一般入學說明。E9讀封面、p1–4及p6相關內容；未稱22頁全讀。[E7](https://info.stu.edu.tw/attachfile/upload/IRS/file/115E7.pdf)、[E8](https://info.stu.edu.tw/attachfile/upload/IRS/file/115E8.pdf)、[E9](https://info.stu.edu.tw/attachfile/upload/IRS/file/115E9.pdf)

PDF全文文字已機器抽出留底，人工／模型實讀僅上述頁段；不是把抽完全部頁面等同逐頁精讀。原生HTML、索引、PDF文字與渲染視覺分開登錄。本系30在兩份原生表與B6一致。另有他系範圍缺件：原生表休觀系產攜列15，E9休觀專班另列41；沒有足夠核准文號／涵蓋範圍說明可推兩數是否相加，故不計算全校產攜總量、不自行判定哪份應覆蓋另一份。B6考項疑似漏字也已明列，不擅自修來源。原網頁首頁目前導覽有116名額連結，本輪閱讀的是明確115網址與115簡章，不把不同年度混用。

## 只改四條仍會留下的矛盾

同一中文record另外有 schedule_short「書審＋面試」、key_notes/0「未列本系名額」、key_notes/2與stu_focus/0固定時段、timeline/0/label面試流程。若只換summary/content，讀者仍會看到矛盾，後續實作須另列相依欄位範圍。還有畢業證書完全相同、共用資源、費用較低與補助承諾，本輪沒有足夠原始資料證成；均列於 dependent_fields，不自動修改或補寫。

## 最小核對及實際輸出

```powershell
node holiday-lab/translation-review/program-currentness-20261023/propose.cjs
```

```json
{"values":4,"canonical_values":2,"canonical_stable":true,"research_input_stable":true,"product_written":false}
```

| 完成條件 | yes／no |
|---|---|
| 四個原ID、lang、definition pointer、目前與舊候選均保留 | yes |
| 兩條共用中文與四英日新候選已落地 | yes |
| 原生表格與招生結束狀態已實讀留檔 | yes |
| 六份官方PDF200/bytes/SHA留檔 | yes |
| 中文原文與研究輸入前後SHA不變 | yes |
| 概括的跨管道免統測／學測已證成 | no |
| 產品已套用／母語者確認／上線 | no |

中文data/admission.json前後SHA：a4b9a35be9b5b96d0783d1e79dda9d684f86565e7e26084415004c2db750123e。逐筆外語原值也核對未變。研究input、比較表、來源SHA見proposals.json與download-receipts.json。
