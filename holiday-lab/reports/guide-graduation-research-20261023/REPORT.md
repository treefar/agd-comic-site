# 在校指南局部補研：證照認列／獎補助、英文能力檢定

2026-10-23。已讀既有 comprehensive-audit scope／REPORT 的指南缺件與 `data/students/guide.json` 的 graduation／certification／english 條目及來源，再補查兩個指定主題。交付可審文案與逐件來源摘要；**沒有改產品、資料字典、舊證據或交接檔，也沒有上線。** 本輪不是八個單位全站所有資料調研完成。

學生版見 [STUDENT-DRAFT.md](STUDENT-DRAFT.md)：每主題一個大流程、四個步驟、每步兩至三句說明、三個FAQ，段落均連到精確官方來源。研究細節與歧異見 [FINDINGS.md](FINDINGS.md)，逐件實讀範圍見 [sources.json](sources.json)。

## 三層證據，不混稱已讀現行全文

| 層級 | 本輪數量 | 真正讀到什麼 | 不能宣稱什麼 |
| --- | --- | --- | --- |
| 成功取得當日live原本文 | 2份 | S01課表PDF1份，兩頁已渲染檢視；S02公開證照系統HTML1份，公開流程與聯絡欄位全文 | 課表不是認列清單，系統說明不是個人核准結果；都不能代替最新完整辦法 |
| 官方搜尋索引的相關正文 | 7份 | S03、05、06、07、08、09、10；讀到年度、資格、流程、期限、聯絡與例外，已寫摘要 | 沒有當日live正文SHA，不能保證索引抓取後未改、仍有名額或是最新法規 |
| 仍不足以認定附件／現行規章已讀 | 3筆來源＋明確缺件 | S04歷史PDF1頁解析文字、S11手冊p5–7索引文字均未完成原頁視覺驗證；S12表單頁只讀外框、iframe內容未取得 | 不能把PDF文字索引當已驗頁，不能把iframe占位或連結當附件全文；最新辦法與表單維持未查得 |

總來源12筆；細分類由驗證器計算為：live PDF視覺1、live公開HTML1、官方索引正文7、PDF文字但未視覺2、iframe索引外框1。這是本題清冊數，不是全校資料總數或研究完成百分比。

## 這輪可補入審稿的重點

- 115入學課表p1普通班至少一張專業證照，p2技優班另有至少一學程及兩張電腦資訊相關證照要求；不通用到其他入學年，也沒有自行建立Unity／Adobe完整認列名單。[官方課表](https://info.stu.edu.tw/ACA/teacher/QryCoursedept/DownLoadFileori.asp?Sec=115116)
- 證照紀錄登錄、系上畢業認列與獎助申請分開。公開證照系統實際200，流程是學生登錄、職發審核，主要聯絡1713；系上認列問6102。[公開系統](https://info.stu.edu.tw/sao/certificate/item/index.asp)／[系辦入口](https://www.dgd.stu.edu.tw/常用表單/)
- 2026年8月公告明確屬114-2，讀到入學前不獎助、生效日起半年內、團體登錄後追加申請與出納匯款帳戶；沒有把這些當作已核定115-1規則。107PDF的甲級一萬元與2026公告乙級以上六千元差異保留，未擅自取較高金額。[114-2公告](https://www.stu.edu.tw/latestnews-single/?id=233658)
- 英文能力門檻與修課學分、獎助分數分開。2023官方公告的111起替代A／B都不是只考兩次就通過，仍有課程要求；111-2全英課表不能當115-1可選清單。[官方歷史公告](https://www.lcc.stu.edu.tw/2023/02/20/【重要】四技日間部學生請詳閱英文畢業門檻相關/)
- 115-1英檢頁索引列CSEPT報名10/14截止，查閱10/23已過；CEST其餘排程未保證當下仍受理。EnglishScore明示不認列畢業門檻，CEST前導與正式Linguaskill也沒有自行認作相同。[官方英檢頁](https://www.zzd.stu.edu.tw/英檢報名/)

## 逐條驗收 yes／no

| 項目 | yes／no | 實際證據與界線 |
| --- | --- | --- |
| 只補兩主題，既有指南與稽核來源已參照 | yes | `verification.json` inputs記三份本機原檔SHA；產品未寫入 |
| 官方primary來源清冊與逐件摘要落地 | yes | `sources.json` 12筆都有發布／適用／查閱／實讀段落／摘要／未證欄位 |
| 當日live狀態與讀取失敗保存 | yes | `node .../fetch-official.mjs` exit0；9筆HTTP收據為200兩筆、202五筆、403兩筆，raw body及SHA均保留。exit0只代表收據寫出，不代表9頁都成功 |
| 可讀PDF相關頁已驗 | yes，僅S01 | 兩頁抽字為空後以pypdfium2渲染，p1／p2 PNG實際檢視。原PDF及每張PNG SHA在verification.json |
| S04／S11 PDF視覺與最新版本已驗 | no | 官方舊PDF文字已讀，下載／截圖403；未以工具解析文字冒充視覺驗頁 |
| 學生版大流程、每步說明與每題3FAQ | yes | `node .../verify.mjs` exit0，結構實算兩主題各4步、3FAQ，每步2至3句；所有引用解回精確來源URL |
| 適用年度／班別、日期與舊公告界線 | yes | S01明分115普通／技優；S03標114-2；S05標111起與111-2課表；S06明分過期／未核實狀態；不混用 |
| 現行證照認列完整規章／清單／表單取得 | no | 系辦iframe內文未取得，未查得目前各屆各版本完整認列與申請表 |
| 115-1證照獎助現行規章／受理公告／帳戶表取得 | no | 只取得114-2官方索引正文與107歷史要點文字；當期經費、補件、金額與表單未核定 |
| 現行英文辦法全文／最新認列表單與替代課清單取得 | no | 只有2023公告、115課表與115-1英檢頁索引；成績效期歧異及特殊身分例外未解決 |
| 八單位全資料調研完成／學生稿可直接作正式規章 | no | 本輪是局部補研草稿；沒有擴稱完成 |
| 改網站、Build、上線、push／main／C／勞動／Unity | no | 此代理只寫本目錄，沒有執行這些操作或發外部訊息 |

## 實際命令與結果

工作目錄：`C:/agywork/agd-holiday-prototypes`。

```text
node holiday-lab/reports/guide-graduation-research-20261023/fetch-official.mjs
exit 0
HTTP 200: curriculum-115 (1329642 bytes), certificate-system (9279 bytes)
HTTP 202 empty: english-threshold-112, english-registration-115-1,
                career-contact, certificate-award-114-2, academic-faq
HTTP 403: certificate-award-107, handbook-113
```

完整收據、實際網址、content-type、時間、bytes與body SHA：`retrievals/2026-10-23T10-21-09-750Z/receipts.json`。S04官方PDF文字頁可由web取得，但請求原頁截圖仍403；S07／S09等web直接開啟亦403，沒有洗掉失敗。

```text
bundled python: import fitz ...
exit 1: ModuleNotFoundError: No module named 'fitz'

bundled python: import pdfplumber,pypdfium2 ... extract_text both pages
exit 0: PAGES 2; PAGE 1 [empty]; PAGE 2 [empty]

bundled python: pypdfium2.PdfDocument(...).render(scale=2).to_pil().save(...)
exit 0: rendered 1; rendered 2

node holiday-lab/reports/guide-graduation-research-20261023/verify.mjs
exit 0
source_count 12
read_classes: live_pdf_visual1 live_public_html1 official_index_body7
              pdf_text_without_visual2 index_shell_without_iframe1
retrieval_http_status_counts: 200=2 202=5 403=2
visual_pdf_pages 2
structure: 證照認列 steps4 faqs3; 英文門檻 steps4 faqs3
verification: structure-and-evidence-pass; current-complete-regulations-not-verified
product_writes 0; publication false
```

一次Node shell內嵌HTML解碼探索因引號離開碼1、無輸出，沒有修改來源；公開系統全文後由web原頁L0–L51讀取核對。最初r0/pdf短路徑不存在，改讀可用PDF技能與runtime；不把路徑錯誤、空抽字或索引成功當成實讀附件成功。

驗證器只檢查來源清冊、原檔SHA、PNG基本身份、引用與文案結構，**不能自動證明規章最新或取代人工資料判讀**。未跑Build、UI/E2E或登入測試，因本次沒有產品變更。

## 穩定來源與待補清單

原PDF SHA `21222bd6308ee5a854ab160903d3a7cc94e3390dcd3151739535a4a83bbe4bfc`；公開HTML SHA `a6ae73730ef63d62db2f928a5c1051716ea225ec04d97b8693fdc2325c2d7b65`。其他空白202 body的SHA只能代表空檔，不能代表官方正文；官方索引摘要的SHA是本輪筆記身份，沒有捏造上游本文SHA。

下一個資料缺口已具體列在FINDINGS.md末尾：系辦現行認列清單與表、職發115-1完整公告／要點／金額歧異、語文承辦現行辦法／效期／例外／申請表／替代課及CEST認列。這些缺件保留為未查得，不要求使用者先讀開發警語才能使用學生版流程，也不拿其他學校規則代替。
