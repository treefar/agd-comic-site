# 日英翻譯獨立複核

2026-10-23。本輪可保留目前13位師資的核心職級譯法；既有28個建議譯值中，27個原案可保留、1個建議再補完整「獎助金」語意。全部仍為審閱候選，未改產品。這是指定範圍的來源／語意複核，沒有宣稱全站母語認證。

## 助理教授為何可譯「助教」

本次重新讀取[九州大學現行教員頁](https://www.isee.kyushu-u.ac.jp/staff.html)，頁面標示令和8年4月3日現在，助教對應 Assistant Professor、准教授對應 Associate Professor。[JST職種表](https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html)也將助教置於 Assistant Professor level，並把助手另外歸入研究／教育補助類。

[九州大學職名表第1頁](https://www.cm.kyushu-u.ac.jp/_cms_dir/uploads/2022/03/f2b1ca93e8fffd676f1ae90190e583d1.pdf)將 Teaching Assistant 列為ティーチング・アシスタント，與助教分列。因此日文「助教」在這裡是大學教師職級，不應誤解成台灣口語所說的教學助理TA。

[文科省制度改革說明](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/houkoku/attach/1342439.htm)區分自行教育研究的助教與以補助為主的助手，並另述舊助教授調整為准教授的脈絡。不能因舊職名有「助」字，就把舊助教授、助教與TA互換。此頁是歷史制度說明，本輪沒有拿它取代現行法規或推定樹德個人聘任資格。

樹德室設系[官方頁](https://www.idd.stu.edu.tw/系所成員/)本次直接取得403，但官方網域搜尋索引可讀到助理教授／Assistant Professor與副教授／Associate Professor；[動遊系官方頁](https://www.dgd.stu.edu.tw/系所成員/)索引也可見助理教授／Assistant Professor。這是校內英文用詞支持，不是13人的最新聘書。日語表達可保留，不表示台日職權、資格、待遇與升等制度法律等同。

## 13人逐筆結果

下表每人均讀 `data/faculty.json` 對應 role，再比目前 `locale-en.js`／`locale-ja.js` 的實際值，不從一位外推其他人。完整中英日職稱（含附註）、slug、JSON pointer與判斷保存在 `findings.json.rank_rows`。13人的精確當前值皆相符。

|姓名|中文核心職級|目前英文核心職級|目前日文核心職級|可保留／未證界線|
|---|---|---|---|---|
|鄧樹遠|系主任、副教授|Department Chair、Associate Professor|学科長、准教授|核心譯法yes；未另認證最新聘任|
|江雅媚|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|陳重光|助理教授、電競娛樂系合聘|Assistant Professor|助教|核心yes；合聘正式日文及系名pending|
|楊智彰|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|陳慶鴻|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|張純雅|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|邱士展|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|陳美蓉|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|吳焉昇|講師、電競娛樂系合聘|Lecturer|講師|核心yes；合聘正式日文及系名pending|
|王宗立|助理教授|Assistant Professor|助教|核心譯法yes；未另認證最新聘任|
|陳寀瑜|助理教授、從聘|Assistant Professor|助教|核心yes；從聘正式日文pending|
|蔣天華|副教授、從聘|Associate Professor|准教授|核心yes；從聘正式日文pending|
|尹立|助理教授、留職停薪|Assistant Professor|助教|核心yes；留停正式日文及當前狀態pending|

合聘／從聘現譯有保留原身份與說明，不直接判錯；校方正式日文人事詞、電競系正式英文全名、各人最新任用／留停狀態仍未獨立核定。沒有將講師統一改成助教，也未依九州某一份表的多種英稱反推台灣講師制度。

## 28個既有候選的保義複核

來源為前案 `dedicated-language-audit-20261023/findings.json`，26個中文key涉及28個建議值。這次重新讀每個 canonical path、實際兩語生成值及其定義檔，完整逐值表在 `REVIEW-TABLE.md`，原值／前案建議／本次建議／來源及yes-no在 `findings.json.value_rows`。

|群組|譯值數|本次判斷|
|---|---:|---|
|二技／四技／二專|4|保留學制修正。二技不是二專；保原名與本系名額待公告。英文長列舉仍可順句，屬P3文風選項，非本輪新錯譯。|
|日文長假／補請假|3|應修。請假情境用長期欠席、事後の欠席申請，比長期休暇準確；沒有修改期限或核准方式。|
|生效日期|1|應修。保留開始生效日，不混成有效期間／發行日。|
|補修／認列|1|應修。不自行限制成重修已修科目或學分認定。|
|證照畢業門檻認列|1|方向應修；前案建議再保完整獎助金語意，見下。|
|英語門檻送件認列|1|應修。不把成績及證明一律加成學分認列。|
|自傳|1|應修。不換成自己推薦書；原文件類別保留。|
|生輔組英文名稱|10|保留逐key統一Section；中文每筆確為生輔組，沒有機械替換所有教務或其他窗口。|
|清除篩選按鈕引用|1|保留一致性修正。生效按鈕是条件をリセット，並非messages.json單獨看到的絞り込みをクリア。|
|台灣技術士證原名|2|保留原證名與台灣技能檢定說明，不證成日本技能士的資格等同。|
|contact window等|3|可保留前案P3順句；不是新的行政事實錯誤。|

唯一修整前案全文的是 `EN-CERT-RECOGNITION-01`：

- 中文「認列與獎助金是兩件事」：原譯 `credit recognition` 無中文依據，應移除學分暗示。
- 前案 `certification awards` 沒有明說補助，保守寫成 `financial awards or subsidies`，讓獎與助都保留，不新增申請資格。
- 本次完整候選：`Whether a certification fulfills graduation requirements must first be checked against the department list; recognition toward graduation requirements and financial awards or subsidies are two separate matters, and application procedures must still be checked after passing.`

本次新查[樹德學務處英文組織頁](https://en.sao.stu.edu.tw/organization/)直接403，但官方網域索引列 Student Assistance Section，並列請假、兵役、獎助／減免等業務，可作名稱統一的交叉支持。原生輔組個別頁仍403，不聲稱完整當期程序已讀。[樹德社工學制頁](https://www.sw.stu.edu.tw/home?lang=en-US)也只有官方索引可讀，支持二技／四技的Bachelor's Program用法；本次重讀[JASSO台灣學制頁](https://ryugaku.jasso.go.jp/oversea_info/region/asia/taiwan/info_tw_university.html)的學校／學位段，確有台灣専科学校、副學士、學士區分。該頁2024-08-19更新，沒有把其統計與時程當成2026招生政策。

## 沿用與本次新增查證

- 沿用：前案28候選的發現與校務來源連結、13角色基準；未重做全文審查、瀏覽器截圖或過去49值DOM矩陣。
- 本次新增：13人逐筆當前值與7種role核對；28候選的中文來源、所有實際EN／JA值與定義檔逐筆複讀；重新查日本官方主來源及樹德官方索引；1筆獎助金保義修整。
- 未覆蓋：全部最新校規／招生資格、每人的實際聘任與證照、正式人事日文名、全部新聞作品與全站母語品質、版面／字型／可見DOM。沒有重建locale、Build或操作原QA凍結服務。
- repo內搜尋未找到額外AGENTS.md；依使用者給的全域AGENTS及限定寫入範圍。research skill要求背景研究，實際呼叫因thread limit reached未建立子代理，改由本代理親自讀主來源，未把失敗派工當研究完成。

## 實際命令與yes／no

工作目錄 `C:/agywork/agd-holiday-prototypes`，所有新輸出只在本資料夾。

```text
node holiday-lab/translation-review/independent-language-recheck-20261023/recheck.cjs
# exit0; faculty13, distinct_role_keys7, recommendation_keys26,
# recommendation_values28, retain_exact_proposal27, refine_proposal1,
# source_files17, product_writes no
node holiday-lab/translation-review/check-current-ranks-20261023.cjs
# exit0; expected_values_match13/13; product_files_written0; pass true
node holiday-lab/translation-review/independent-language-recheck-20261023/verify.cjs
# 實際輸出見verify-output.txt；檢核已封存來源SHA，不另建snapshot掩蓋漂移
```

第一次自有工具精確比中文 canonical raw 時，PROGRAM-02原多段換行和前案display key的空白不同，保留 `canonical-raw-format-red.txt`；實讀長度158對155，僅空白正規化後相同。現在只對canonical display key做空白正規化，並保留 `canonical_raw`；實際日英值與每個定義檔仍嚴格逐字比對，沒有刪英文空格來通過。

|驗收項目|yes／no|
|---|---|
|13人逐筆實際核心職級可保留，13/13 exact match|yes|
|助教／TA／助手／舊助教授區分有本次主來源|yes|
|28候選逐值保義、27原案保留／1案修整|yes|
|17來源檔在本次讀取前後SHA一致|yes|
|所有個人最新聘任及正式附屬人事名已認證|no，pending如上|
|全站／母語／版面／最新行政程序已重新認證|no|
|產品／locale／Build／舊QA／stage／commit／push／main／刪檔|no|
