# 兩份二進位 DOC 純 Node 解析獨立驗收

查驗日期：2026-10-24（台灣）；獨立執行時間：2026-10-24T03:19:49.858Z。本次只讀檔案，不執行 Word、網站、瀏覽器、網路、Build、Unity 或遊戲。

結論：正式終版 parsed-r2 的「兩原件全部已宣告文字 story 已讀取，沒有以 strings 片段或 body 非空冒充全文」為 **yes**。獨立檢查54項 yes、0項 no，實際 Node 命令 exit 0，stderr 空。這個結論限於文字流；原 Word 表格版面、圖像／嵌入物件、列印分頁及115學年度適用性沒有因此成立。

## 證據版本與方法

正式證據是 C:\agywork\agd-holiday-prototypes\holiday-lab\reports\legacy-reader-20261024/parsed-r2/extraction.json，對應 extraction-r3-command.json（extract-r2.cjs，exit 0）。worker 根目錄 extraction.json 是保留的第一輪失敗，evaluation 的區間 helper 對不相交 piece 使用負 slice end，誤把正文502抽成520、零長腳註抽成18；all_story_ranges_covered 為 false。此舊檔不列為通過證據。終版先取 piece 與 CP 區間交集，解決分段收據錯誤；兩輪 API 正文 SHA 相同，不能把 helper 錯誤說成原 DOC 缺文。

本驗收先讀實際安裝 word-extractor@1.0.4 的原碼、package.json 與 package-lock.json，再另寫未引用該套件 CFB 模組的讀取器，直接自原 DOC 解 FAT／DIFAT／directory／miniFAT 及 WordDocument、1Table。每條鏈檢查邊界與循環，依目錄長度完整取流。之後按 FIB 自述的陣列長度走訪，不只取固定偏移的正文長度；CLX 依 lcb 設界，逐 PRC／PCDT／CP／PCD 解讀到終點，按 file offset 讀每個 UTF-16 piece。再以原套件獨立實跑一次，擷取清理前後每個 CP 的差異，比對 worker 每個 story、每個 API 輸出與原始流 SHA。

套件安裝版與 lock 均為1.0.4；本輪沒有下載 npm 套件，故 lock integrity 僅是既存鎖定收據，沒有宣稱本輪重下載驗證發布包。實讀原碼及 SHA 存於 local-source-read.json；本輪 package 全檔前後相同。

## 原件與結構結果

| 項目 | 實習認定表 recognition | 實習評分表 evaluation |
|---|---|---|
| 原件 bytes | 31744 | 43008 |
| 原件 SHA-256 | 4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22 | 741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d |
| CFB 簽章 | d0cf11e0a1b11ae1 | d0cf11e0a1b11ae1 |
| CFB major／sector／mini sector | 3／512／64 bytes | 3／512／64 bytes |
| WordDocument／1Table | 8248／7629 bytes | 15416／11749 bytes |
| 完整 FIB 容器陣列 | csw14、cslw22、183對 fc/lcb、cswNew5 | 同左 |
| FIB 走訪終點／fcMin | 1630／2048 | 1630／2048 |
| FIB nFib／擴充首值 | 0x00c1／0x0112 | 同左 |
| CLX fc／lcb | 6066／21 | 10312／45 |
| CLX 終點 | 6087，正好等於 fc+lcb | 10357，正好等於 fc+lcb |
| 全部 piece 的 CP | [0,154] | [0,256,512,540] |
| 全部 piece 解碼單位 | 154 | 540 |
| 正文 CP | [0,144)，144 | [0,502)，502 |
| 頁首尾文字流 CP | [144,153)，9 | [502,539)，37 |
| 其餘文字 story | 腳註、巨集、註解、尾註、正文文字方塊、頁首尾文字方塊均宣告0 | 同左 |
| story 範圍以外尾端 | [153,154)，單一 CR | [539,540)，單一 CR |
| API 正文 UTF-16 單位／UTF-8 bytes | 144／312 | 502／990 |
| API 正文 SHA-256 | a00a3a226130eedf26ffde5acc879d12368cf2abe5afc69943d71437327d369c | 3f10639975b05b5b7cc2b07961712c74ee1da00bb67d2d117a8d2aff69c1ab02 |

表中的 CP／單位是 UTF-16 code unit，包含控制字，不是中文字數或頁數。兩檔所有 piece 都是未壓縮 UTF-16，實際取出的 byte 數與 CP 宣告逐段一致；不用推定其他編碼。FIB 基底 nFib 與擴充首值不同，已記錄兩者，不只用 nFib 把整份檔案武斷標成純舊版格式。

## 清理、欄位及表格

| 可判定事項 | yes／no | 實際證據與限制 |
|---|---|---|
| 所有已宣告文字 story 均有原字串及精確 CP 範圍 | yes | 自原件獨立解析後，逐 story SHA 與 worker 完全相同；零長 story 也實核為0。 |
| 每個 piece 都讀到宣告終點 | yes | 1／3個 piece、連續 CP 與 byte 範圍逐段核對，整段拼接 SHA 相同。 |
| 原始腳註／尾註分隔符及 PAGE 欄位沒有被原始證據漏掉 | yes | evaluation 頁首尾37單位完整保留；分隔符 U+0003／0004、PAGE 指令與結果1都在 raw story。 |
| 字元屬性階段沒有把可見正文當刪除文字抹去 | yes | 兩檔 character 差異0；此檔沒有靠套件刪除標記遮掉正文。 |
| 表格段落處理只改控制符 | yes | recognition 7處、evaluation 12處，均 U+0007→LF，無可見字改動；逐 CP 位置在 stage_diffs。 |
| API 純文字清理與原碼相符 | yes | CR→LF，剩餘 U+0007→Tab；控制符／欄位清理另以本驗收實作逐字重現。 |
| 清理後 API 等於所有原始碼位完全不變 | no | API 本來會移除欄位指令／分隔控制碼；故全文證據應以 raw story 與 API 合看，不能只留 body.txt。 |
| 頁碼欄位顯示結果保留 | yes | evaluation 兩個 footer 分別含無結果 PAGE、含結果1的 PAGE；API 為三LF、1、三LF。raw有完整指令，API未冒充原始碼位。 |
| 表格格線、合併儲存格、欄寬及行高完整還原 | no | 原始 BEL／Tab／CR 留存；API 僅展平的 Tab／換行，不能證視覺格線與合併關係。 |
| 完整解讀每一個 FIB 欄位的格式語意 | no | 套件只讀必要偏移，本驗收走完陣列容器並核文字相關欄位，沒有逐一實作183對欄位所指的全部格式結構。不能稱整個 Word 規格已解析。 |
| Word 圖像、形狀、Data、物件、列印頁面及視覺版面均核畢 | no | 只列出 CFB 目錄，沒有解析 Data 或物件及頁面。這些不是未覆蓋的已宣告文字 story。 |
| 原件內容可直接認定115學年度最新規定 | no | 解析器只證原件內容；沒有以成功抽文補出版本與適用年度。worker applicable_115=unknown、layout_verified=false 保留。 |

原件 evaluation 正文標題實際是「樹德科技大學動畫與戲系」。獨立讀原 CP 與套件同字，這是原件現存文字，不能擅補成「動畫與遊戲設計系」後再當原文。認定表「抵免事由／抵免時數」、評分表兩組18／16／16及各50%等皆在完整原始正文，不以段落搜尋取代全文讀取。

以上 no 是這次證據能主張的界線，不是自行新增網站發布門檻。沒有尚未讀出的已宣告文字區段；未證部分精確限於上述格式／物件語意、視覺版面及學年度適用。

## 逐條機器檢查

以下54條是本次程式實際判定，原始 detail、CP、SHA、字串與控制符明細均在 parser-review.json 對應位置；不把前節界線的 no 混入54條檢查數。

| # | 檢查 | yes／no | 實際收據 |
|---|---|---|---|
| 01 | baseline_47_sources | yes | parser-review.json /checks/0 |
| 02 | baseline_360_build | yes | parser-review.json /checks/1 |
| 03 | pinned_parser_actual_version | yes | parser-review.json /checks/2 |
| 04 | final_worker_receipt | yes | parser-review.json /checks/3 |
| 05 | r1_failure_preserved | yes | parser-review.json /checks/4 |
| 06 | recognition_input_sha_cfb | yes | parser-review.json /checks/5 |
| 07 | recognition_technical_matches_final | yes | parser-review.json /checks/6 |
| 08 | recognition_independent_streams | yes | parser-review.json /checks/7 |
| 09 | recognition_complete_fib_clx | yes | parser-review.json /checks/8 |
| 10 | recognition_independent_pieces | yes | parser-review.json /checks/9 |
| 11 | recognition_ccpText_full_range | yes | parser-review.json /checks/10 |
| 12 | recognition_ccpFtn_full_range | yes | parser-review.json /checks/11 |
| 13 | recognition_ccpHdd_full_range | yes | parser-review.json /checks/12 |
| 14 | recognition_macro_story_zero | yes | parser-review.json /checks/13 |
| 15 | recognition_ccpAtn_full_range | yes | parser-review.json /checks/14 |
| 16 | recognition_ccpEdn_full_range | yes | parser-review.json /checks/15 |
| 17 | recognition_ccpTxbx_full_range | yes | parser-review.json /checks/16 |
| 18 | recognition_ccpHdrTxbx_full_range | yes | parser-review.json /checks/17 |
| 19 | recognition_one_tail_CR | yes | parser-review.json /checks/18 |
| 20 | recognition_raw_parser_matches_independent | yes | parser-review.json /checks/19 |
| 21 | recognition_no_printable_char_dropped_by_properties | yes | parser-review.json /checks/20 |
| 22 | recognition_only_table_row_delimiters_changed | yes | parser-review.json /checks/21 |
| 23 | recognition_header_plc_matches | yes | parser-review.json /checks/22 |
| 24 | recognition_body_independent_clean | yes | parser-review.json /checks/23 |
| 25 | recognition_headers_independent_clean | yes | parser-review.json /checks/24 |
| 26 | recognition_footers_independent_clean | yes | parser-review.json /checks/25 |
| 27 | recognition_all_API_stories_reproduced | yes | parser-review.json /checks/26 |
| 28 | recognition_API_zero_replacement_chars | yes | parser-review.json /checks/27 |
| 29 | evaluation_input_sha_cfb | yes | parser-review.json /checks/28 |
| 30 | evaluation_technical_matches_final | yes | parser-review.json /checks/29 |
| 31 | evaluation_independent_streams | yes | parser-review.json /checks/30 |
| 32 | evaluation_complete_fib_clx | yes | parser-review.json /checks/31 |
| 33 | evaluation_independent_pieces | yes | parser-review.json /checks/32 |
| 34 | evaluation_ccpText_full_range | yes | parser-review.json /checks/33 |
| 35 | evaluation_ccpFtn_full_range | yes | parser-review.json /checks/34 |
| 36 | evaluation_ccpHdd_full_range | yes | parser-review.json /checks/35 |
| 37 | evaluation_macro_story_zero | yes | parser-review.json /checks/36 |
| 38 | evaluation_ccpAtn_full_range | yes | parser-review.json /checks/37 |
| 39 | evaluation_ccpEdn_full_range | yes | parser-review.json /checks/38 |
| 40 | evaluation_ccpTxbx_full_range | yes | parser-review.json /checks/39 |
| 41 | evaluation_ccpHdrTxbx_full_range | yes | parser-review.json /checks/40 |
| 42 | evaluation_one_tail_CR | yes | parser-review.json /checks/41 |
| 43 | evaluation_raw_parser_matches_independent | yes | parser-review.json /checks/42 |
| 44 | evaluation_no_printable_char_dropped_by_properties | yes | parser-review.json /checks/43 |
| 45 | evaluation_only_table_row_delimiters_changed | yes | parser-review.json /checks/44 |
| 46 | evaluation_header_plc_matches | yes | parser-review.json /checks/45 |
| 47 | evaluation_body_independent_clean | yes | parser-review.json /checks/46 |
| 48 | evaluation_headers_independent_clean | yes | parser-review.json /checks/47 |
| 49 | evaluation_footers_independent_clean | yes | parser-review.json /checks/48 |
| 50 | evaluation_all_API_stories_reproduced | yes | parser-review.json /checks/49 |
| 51 | evaluation_API_zero_replacement_chars | yes | parser-review.json /checks/50 |
| 52 | 47_source_before_after_stable | yes | parser-review.json /checks/51 |
| 53 | 360_build_before_after_stable | yes | parser-review.json /checks/52 |
| 54 | worker_originals_parser_evidence_untouched | yes | parser-review.json /checks/53 |

## 實際命令與檔案保全

執行命令：

~~~text
node holiday-lab/reports/legacy-reader-review-20261024/run-check.cjs
~~~

runner 的實際子命令：

~~~text
C:\Program Files\nodejs\node.exe C:\agywork\agd-holiday-prototypes\holiday-lab\reports\legacy-reader-review-20261024\check-parser.cjs
~~~

stdout（完整）：

~~~text
{"name":"recognition","input_sha256":"4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22","CFB":"d0cf11e0a1b11ae1","FIB_end":1630,"pieces":1,"CPs":[0,154],"story_units":[["ccpText",144],["ccpFtn",0],["ccpHdd",9],["ccpMcr",0],["ccpAtn",0],["ccpEdn",0],["ccpTxbx",0],["ccpHdrTxbx",0]],"tail":"\"\\r\"","body_sha256":"a00a3a226130eedf26ffde5acc879d12368cf2abe5afc69943d71437327d369c","stage_changes":{"character":0,"paragraph":7,"headers":9}}
{"name":"evaluation","input_sha256":"741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d","CFB":"d0cf11e0a1b11ae1","FIB_end":1630,"pieces":3,"CPs":[0,256,512,540],"story_units":[["ccpText",502],["ccpFtn",0],["ccpHdd",37],["ccpMcr",0],["ccpAtn",0],["ccpEdn",0],["ccpTxbx",0],["ccpHdrTxbx",0]],"tail":"\"\\r\"","body_sha256":"3f10639975b05b5b7cc2b07961712c74ee1da00bb67d2d117a8d2aff69c1ab02","stage_changes":{"character":0,"paragraph":12,"headers":15}}
{"yes":54,"no":0,"pass":true}
~~~

stderr：空字串；exit code：0；signal：null；error：null。

基準使用既存8882獨立QA快照 C:\agywork\agd-holiday-prototypes\holiday-lab\reports\copy-actions-20261024\qa\raw-r1\result.json（SHA 2438593e7a573cef528d092446c669bdf2b952156a6fb4953ae7256b3b3fa42c）。本輪只讀該快照並重新核檔案 SHA，未打網站：47份 source 與360份 .measure-copy-actions-20261024-01 build 檔均與舊快照相同，且本輪前後一致。worker腳本、原證據、parsed-r2終版、安裝parser全檔與鎖檔共 68 檔前後 SHA 一致；兩原DOC另外逐件核原始SHA。before／after快照是分開檔案，沒有把舊紀錄改成今天重新實讀。

本驗收只啟自己的 Node 同步程序，未啟服務、瀏覽器或背景子程序；check runner 已取得 exit 0並終止。不停止使用者8881／8882服務。只寫本驗收目錄，沒有修原件、worker、產品、build或舊報告。

交付：

- [完整逐條與原始字串](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/parser-review.json)
- [實際 stdout／stderr／exit](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/check-command.json)
- [獨立CFB／FIB／CLX檢查程式](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/check-parser.cjs)
- [本機實讀原碼與SHA](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/local-source-read.json)
- [來源前／後快照](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/product-before.json)、[後快照](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/product-after.json)
- [worker與parser前快照](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/evidence-before.json)、[後快照](C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024/evidence-after.json)

本項驗收完成，停止，不新增研究、UI驗證或產品修改。
