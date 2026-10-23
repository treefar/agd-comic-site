# 日英專責獨立審查：職稱判斷與本輪修正候選

2026-10-23；目前來源唯讀審查。結論：**「助理教授 → Assistant Professor → 助教」可保留為日語職級表達**。另整理26個中文key的修正候選，涉及28個日英譯值；未自動改產品。逐字原文、目前EN／JA、完整建議、JSON pointer／程式行號、來源URL、日期、優先級與yes／no見`findings.json`，可直接閱讀`REVIEW-TABLE.md`。

## 先回答助理教授與助教

- [九州大學現行教員頁](https://www.isee.kyushu-u.ac.jp/staff.html)標示令和8年4月3日現在，同頁分列准教授／Associate Professor與助教／Assistant Professor。本輪已全文讀取。
- [JST JREC-IN職種表](https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html)將助教列Assistant Professor level，助手另外放在研究・教育補助者類。本輪已全文讀取。
- [文科省教員組織說明](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/houkoku/attach/1342439.htm)區分自行從事教育研究的助教與補助職務的助手；助教不能被理解成舊制助教授。本輪已全文讀取，這是制度改革說明文件，非對樹德人事的認證。
- [九州大學職名表PDF](https://www.cm.kyushu-u.ac.jp/_cms_dir/uploads/2022/03/f2b1ca93e8fffd676f1ae90190e583d1.pdf)第1頁另列ティーチング・アシスタント／Teaching Assistant，與助教分開。TA是教學助理，不能因中文同樣出現「助」就與Assistant Professor互換。
- 樹德[室內設計系官方頁索引](https://www.idd.stu.edu.tw/系所成員/)也有助理教授／Assistant Professor及副教授／Associate Professor。此為校內一般用詞支持；[動遊系個別教師頁](https://www.dgd.stu.edu.tw/系所成員/)本輪直接取得403，沒有宣稱重新核定13人的聘任。

目前13位來源與兩語職級逐人相符，共7個不同role key。副教授→Associate Professor／准教授、助理教授→Assistant Professor／助教、講師→Lecturer／講師均可保留。**這是翻譯用法判斷，不代表台日聘任資格、職權、待遇或升等制度法律等同**。若需讓台灣讀者安心，詳頁可加「台湾の職位：助理教授／Assistant Professor」的解釋；只是可選方案，本輪未套。

合聘、從聘與留職停薪目前有共同任用、従たる所属、無給休職中的解釋，未誤刪原身份；校方正式日語人事名仍pending。既有兩筆「電競娛樂系」英文Industries的正式機構名與縮稱身份問題也沿用pending，沒有依相似名字擅自展開。個人學位、證照與現在聘任事實沒有用日本職稱對照表代為核定。

## 可審閱修正

|組別|key數／優先級|問題與具體方向|
|---|---|---|
|PROGRAM|2／P2|進修招生把二技寫成JA「2年制大学」、EN「two-year college」，未分清二技學士與二專層次。建議保留二技／四技／二專原稱並說明學程；兩語均保留「本頁沒有動遊系名額、依當期招生公告」限制。|
|JA-ABSENCE|3／P2|請假卡仍把長假寫成長期休暇，容易讀成寒暑假；改長期欠席，補請假採事後の欠席申請。前批已修的FAQ句不重提；此處為其餘仍生效的三個key。|
|JA-EFFECTIVE-DATE|1／P2|證照「生效日期」被寫成有効期間（発行日），把開始日、期間及發行日混在一起。建議有効開始日。|
|JA-MAKEUP|1／P2|「補修」被限縮為再履修，暗示必須重修曾修過的課；建議不足科目の追加履修，與同卡補缺課情境一致。|
|EN-CERT-RECOGNITION|1／P2|證照作畢業門檻的認列被加成credit recognition；建議recognition toward graduation requirements，避免暗示授予課程學分。|
|EN-ENGLISH-RECOGNITION|1／P2|英語修課成績與能力證明的認列方式，一律寫成how credits are recognized；建議明指submitted grades and certificates，保留兩類證明的區分。|
|JA-APPLICATION-DOCUMENT|1／P2|甄選資料的「自傳」被改成自己推薦書；建議保留自伝並加自己紹介・経歴的說明，不替學校另定文件正式日文名。|
|EN-STUDENT-ASSISTANCE|10／P2|同一生輔組還有Student Assistance Division、Student Life Guidance／Section等寫法。依現行聯絡卡與校方英文索引，逐key建議統一Student Assistance Section；分機與業務不動。|
|JA-QUALIFICATION-NAME|2／P2|技優正文與提醒把台灣技術士證譯成技能士資格；已註台灣勞動部，故不宣稱它已冒充日本資格，但建議保留「技術士證」原證名加台灣技能檢定說明，避免建立未證資格對映。|
|JA-CLEAR-BUTTON|1／P3|空結果說明叫學生按「絞り込みをクリア」，按鈕程式的現行字典值卻是「条件をリセット」；建議使用同一名稱。|
|EN-CONTACT-PLAIN|3／P3|contact window／intake window偏直譯；依句子改point of contact／office to contact／responsible office，不改程序。|

26個建議key中22個P2、4個P3；不是26個新發現群組。PROGRAM兩key同時改EN與JA，其餘各改一語，所以是28個譯值。另7列職稱保留、2列既有機構名待確認，共35列、13組。人數13與職稱不同key數7分開計算。

所有建議只以原中文保義；沒有新增期限、資格、分機、補件義務、學位類別、個人持證事實或機構身份。二技學制另由[樹德官方社工學制索引](https://www.sw.stu.edu.tw/home?lang=en-US)的two-year bachelor’s program支持；[JASSO台灣學制頁](https://ryugaku.jasso.go.jp/oversea_info/region/asia/taiwan/info_tw_university.html)輔助區分學士與副學士，未把2024頁面數字套為2026政策。生輔組官方頁本輪直接403、官方索引可讀，取得層級如實記在`sources.json`，未稱完整當期官方全文已核。

## 逐頁覆蓋與界線

本輪從目前locale、中文資料與實際JSX讀取：`en-pages.jsx`確認翻譯只作用DOM文字與可及性標籤，ID、URL和條件不翻；實讀兩個build程式的資料配對與覆蓋順序。盤點EN2315、JA2344有效key，中文資料與AST候選共2822列。**盤點列數不是2822句語義已過，也不是2822個可見DOM**；AST中包含網址、程式條件及直接指定各語的分支，沒有一律當漏翻。

|頁面／資料|本輪來源複核|沿用與未覆蓋|
|---|---|---|
|導覽、頁尾、主要按鈕|讀TopNav、FooterChapter與StudentGuideDetail實際程式及對應字典，含8導覽、返回／搜尋／重設／窗口連結；身份標籤6種是直接語言分支，未誤報缺字典。|不把共享介面存在當翻譯完整的保證；沒有重開各裝置DOM。|
|師資|13人職級、12個有值學歷與9份有值證照欄複讀；沒有學位的欄位未新增學位。英文原證照名稱保留並非必然日文漏翻。|此前349欄詳審與六筆中立碩士修正沿用；未新驗全部論文題名、公司正式名及個人證書。|
|在校指南|15標題、15摘要、30問＋30答、47段詳細步驟、47個流程標籤，以及相關提醒／聯絡欄對照本次活躍兩語。|這些是內容語義複讀，不是重查全部最新校務法規，也不宣稱每個來源metadata已重新核准。|
|招生8頁|8標題／8摘要／8正文，28則重點與14個費用欄對照；保留115限定、6志願上限、技優條件、過期資訊與本系名額待公告等已有更正。|日期、名額是否最新與原中文的事實正確性不是本輪重新核定；沒有借翻譯修改招生制度。|
|首頁About／Labs／News／Works、課程頁及細項|全源盤點目前值；既有About完整句、139值、Works完整標題、六學位與兩實驗室漏譯證據作前案依據，不重複全面截圖。|沒有逐字重新簽認所有新聞、作品、論文、課名與專有名；不宣告全站全文母語審校完成。|
|前批49個窗口新譯|本輪逐key核對JA20與EN29，目前生成locale仍與已整合計畫精確相同。|先前98case／84可見DOM的證據沿用原11版；本輪沒有重新產生98張圖或宣稱新渲染驗收。|

未執行新Build、browser matrix、字型cmap或正式上線，因本輪是產品唯讀研究／審查；新增譯文若由主控採用，仍須在該整合版另驗實際長度、完整句與換行。既有大量`[CHECK]`／正式專名pending不因畫面看不到CHECK就結案。

## 可重跑驗收與實際輸出

在`C:/agywork/agd-holiday-prototypes`執行，所有輸出只進本資料夾：

```text
node holiday-lab/translation-review/dedicated-language-audit-20261023/prepare.cjs
# locale EN2315 JA2344；41來源；2822盤點列；productWrites0
node holiday-lab/translation-review/dedicated-language-audit-20261023/review.cjs
# groups13 rows35；keep7 recommend26 pending2；productWrites0
node holiday-lab/translation-review/dedicated-language-audit-20261023/verify.cjs
# pass true；sourceFiles41；roles13；prior49CurrentValues49
node holiday-lab/translation-review/check-current-ranks-20261023.cjs
# expected_values_match 13/13；product_files_written0；pass true
```

原始輸出分別是`prepare-output.txt`、`review-output.txt`、`verify-output.txt`、`current-ranks-output.txt`；41檔前後SHA與逐人值存在`summary.json`。重跑verify不重新取snapshot；產品漂移會明確失敗，不能靜默把新值當舊審查結果。prepare用於另建新當次盤點，不應在保留本次證據時覆寫它來掩蓋漂移。

本輪工具初版只用raw EN欄位尋找定義，遇到四種role原資料有`[CHECK]`而生成字典會去標記，曾出現`RANK-03 EN definitions`紅燈；原輸出保留`verify-raw-definition-red.txt`。修的是本審查工具按已實讀build的相同去標記轉換辨認來源，並保存raw欄位及轉換旗標，不是修改產品或忽略職稱問題。現在精確生成值與來源對得上，不代表原CHECK的身份待核已通過。

|完成條件|yes／no|
|---|---|
|助理教授／助教／TA／助手以官方來源區分|yes|
|目前13人職級逐筆查實際值|yes，譯值核對；個人最新聘任事實另列no|
|每個修正候選有完整中英日、key／來源path、來源取得層級與日期|yes|
|已修49值沒有被當作未修重新列案|yes，49／49精確相符|
|41個產品來源前後SHA相同|yes|
|推薦方案已改譯／建置／渲染驗收|no|
|全站每一字、官方專名、個人資格都已認證|no|
|stage／commit／push／main／刪檔／Unity／擴大遊戲pilot|no|

