# 英文專責組：獨立差異審校

2026-10-23；只新增本資料夾，未改產品、重建 locale、push、main、刪檔或啟動 Unity。先讀既有初審、title-check、faculty-copy、followup、FAQ與post-specialist報告，沒有重翻已核定的139個修正值。

本輪具體發現是同一「註冊課務組」在24個活躍字典key有三種寫法：12個 `Registration and Curriculum Section`、6個 `Division of Registrar and Curriculum`、6個省略為 `Registration and Curriculum`。逐key原文、現譯、建議全文、來源檔案／JSON pointer／行號在 [findings.json](findings.json)。沒有用單一英文字取代全校其他單位。

[教務處服務對象官方索引](https://www.aca.stu.edu.tw/服務對象-services/)直接把註冊課務組配對為 `Registration and Curriculum Division`，[官方英文組織頁索引](https://www.aca.stu.edu.tw/en/index-2/)亦相同，因此建議24處統一此名稱，原程序、分機、負責單位均保留。兩頁完整當期原文仍未成功重取，先明列「官方索引支持、完整當期全文待核」；先前報告的Section用法不等於官方唯一名稱。查證日皆為2026-10-23。

## 差異、保留與待確認

|項目／P級|原文與現況|判斷與精確建議|
|---|---|---|
|註冊課務組／P2|24個key，三種現譯|24筆中文均實際指同一註冊課務組；以官方索引支持的Division統一。個別原句完整新舊對照附JSON，其他組名不動。|
|休學／P2|3句流程仍有 `suspension` 或 `suspend or resume studies`|既有主標題與FAQ已採leave of absence；3句建議一致使用leave of absence／return to study。動詞suspend studies可理解為暫停就學，不把它全部誤判為紀律處分。保留程序、兵役窗口及期限。|
|學分抵免／P2|5個key有waiver/waived|四個只有抵免語境的key建議用Credit Transfer，官方同頁索引有直接配對。另一句同時含「抵免」與「免修」保留待逐段確認，不能一律把免修改成學分已獲認列；學雜費的tuition waiver另屬金額減免，已排除。|
|合聘機構名稱／P1待確認|陳重光、吳焉昇兩筆把電競娛樂系擴成 `Department of Esports and Entertainment Industries`|[官方電競系網索引](https://www.esim.stu.edu.tw/)使用 `Department of Esports and E-entertainment Science`。目前縮稱到全名的個別對應仍待確認，不能直接宣告兩者完全相同。先保留職級與Joint Appointment；核實指的是同一系後再採其官方名，不補造Industries。此P1是身份／專名風險待核，未冒稱兩筆聘任錯誤。|
|Unity證照層級／P2待確認|中文未註等級者，現譯使用泛稱Certified Programmer／Artist|[Unity官方完整頁](https://unity.com/products/unity-certifications)分User／Associate／Professional等級，不能由通稱推定個人等級或效期。已明列的Certified User兩項保留；沒有級別的等待本人原證書或官方badge，不擅加User、Professional、Instructor。這是既有待證清單的複核，不是新發現個人證書無效。|
|13位教師職級／保留|Assistant Professor／Associate Professor／Lecturer|目前逐人實值與原中文職級一致；英文Assistant Professor是助理教授，Teaching Assistant是教學助理，不能互換。個人現在聘任事實與譯名正確性分開。|
|六個碩士中立用詞／保留|全部已改Master’s degree|原中文沒有MA／MFA／MSc等細類，六筆source與生成字典均一致，不再提相同修正。正式學位細類仍待原資料證實。|
|33個導覽／頁尾／按鈕／指南標籤／保留|含8主導覽、選單開關、頁尾與指南分類|活躍字典值都有，抽查語意無新增明確錯誤。不是全站畫面驗收或每個動態按鈕都已操作。|

職稱一般對照可由[本系官方名單索引](https://www.dgd.stu.edu.tw/系所成員/)佐證；但該索引的人數與個別中英職級有出入，直接頁403，不能用來覆蓋目前13位資料。[國立臺東大學官方教師頁索引](https://soc.nttu.edu.tw/p/412-1033-5143.php?Lang=zh-tw)亦明確分列Teaching Assistant與Assistant Professor；這只支持詞義區分。既有臺師大職稱表舊URL本輪404，沒有假稱重新全文讀到。完整來源與取得層級在 [official-sources.json](official-sources.json)。

## 已覆蓋與未覆蓋

一次盤點目前2315個活躍英文key；既有139值由原唯讀integration verifier重驗通過，另核六學位、13職稱與33標籤。指南514個中文資料字串均有exact key對應，missing0；這包括來源／方法metadata，只證字典覆蓋，不能說514句都重新語義核定或都實際render。

原始EN資料仍有468個含 `[CHECK]` 的欄位，活躍locale為0個；build會去除標記，故「畫面沒有CHECK」不等於那些正式作品名、論文名、公司名與資格都已查證。468是欄位含標記數，不是468個不同錯誤；既有236個含專名欄待證紀錄也沒有因此結案。

未做新產品patch、全站截圖、改字後Build、字型／排版驗收；未完成所有機構及個人資格核定。沒有把南臺科技大學的stust.edu.tw資料拿來核定樹德stu.edu.tw的單位名。

## 實際驗收

|條件|yes／no|實際指令與結果|
|---|---|---|
|既有139值及生成字典未退回|yes|`node holiday-lab/translation-review/post-specialist/verify-integration.mjs` →13、82、44值通過，明列兩個後修正；six degrees6；pass true；files_written0。完整輸出 `existing-integration-output.txt`。|
|13職稱與六學位活躍值相符|yes|`node holiday-lab/translation-review/specialist-en-20261023/audit.cjs` →role_ranks13/13 YES，six_neutral_degrees YES。|
|24同單位名稱逐key、有來源位置|yes|同指令 →office_occurrences24；JSON逐筆含原key／現譯／proposed／source_locations，不換其他單位或連結。|
|指南資料有exact字典覆蓋|yes|同指令 →guide_chinese_strings514、guide_exact514、guide_missing0；僅此層級。|
|產品前後SHA不變|yes|同指令 →source_unchanged YES、files_written_to_product0，完整前後SHA存 `review.json`。|
|審校程式語法有效|yes|`node --check holiday-lab/translation-review/specialist-en-20261023/audit.cjs` →exit0。|
|所有CHECK、正式專名、個人證照皆已核定|no|468原始含標記欄仍保留；本次官方證照頁只核產品分類，不證個人持證或效期。|
|全站語義／畫面已驗收|no|whole_site_semantic_review NO；沒有用字典存在或既有verifier代替全站人工語義與畫面。|

完整本輪stdout在 `output.txt`。供主控抽核、決定是否整合，沒有自動套用提案。
