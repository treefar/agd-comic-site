# 日文、英文翻譯審校：高風險首批

2026-10-22；source_agent: codex。獨立分支 codex/translation-review；只寫 holiday-lab/translation-review/*，未改產品、未發布、未 push、未啟動 Unity。

## 先回答「助理教授就是助教嗎」

以日語讀者熟悉的職級表達，台灣「助理教授／Assistant Professor」譯為「助教」有依據，現譯可以保留。日本 JST 的職種表將助教列在 Assistant Professor 層級，並將准教授列在 Associate Professor 層級；文科省對助教的說明以自行從事教育研究為主要職務。因此不是台灣日常所稱的教學助理，也不能改成舊制的助教授。這是職稱翻譯，不是宣告兩地聘任資格、權責、待遇或升等制度完全相同。

短卡建議保留「助教」；詳頁如需消除疑慮，可另附「台湾の職位：助理教授／Assistant Professor」。系主任·副教授現譯学科長・准教授亦保留。13位教師逐人對照在 faculty-roles.json，不從單一樣本推論全部身份。

- [JST 職種一覧表](https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html)：本輪已讀頁面，助教/准教授與英文級別明列。
- [文科省：大学教員の職の在り方](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/houkoku/attach/1342439.htm)：本輪已讀，作助教與補助性職務區別的制度背景。
- [本系師資官方頁](https://www.dgd.stu.edu.tw/系所成員/)：搜尋索引明列 Assistant Professor助理教授；直接讀取403，未宣稱已重查全部教師最新身份。產品基準身份仍是實讀的 data/faculty.json。

## 覆蓋與限制

- 已盤點英文鍵 2310、日文鍵 2339；英文鍵在日文找不到對應為 0。這只證明字典配對，不能證明翻譯正確、沒有路由漏翻或畫面無缺字。
- 高風險字串 393 筆已另列 high-risk-strings.json；13位師資角色已逐筆核對。已選出 24 筆首批審校決策：2 保留、21 建議修正、1 待官方制度用語確認。P1含2筆保留核定及1筆待確認，不是15筆全部都錯。
- 主站/指南字典與15遊戲/共用外框共19檔抽取 396 組三語字面或模板骨架，保留來源檔/行與SHA。計算字串、條件拼接、實際操作可達狀態及翻頁後文案不一定能由此完整涵蓋。
- 本輪完成術語與明列句子的首批語義審校；沒有宣稱已逐句人工審完2310筆長篇。獎項、論文、公司、課程等正式英日名稱仍需逐筆原官方資料核定；未以機器檢查代替母語審校。
- 未操作8805或其他服務、未開瀏覽器，因此可見畫面/行寬/改譯後字幕通關尚未驗證。字體真缺字由 glyph-copy 專員另審，未因備援字型而換字或改專名。

## 逐筆決策

完整機器可讀 proposals 是 recommendations.json（applied全部false，附精確來源位置）。下表的原句為網站實際中文字串；現譯不憑預期造出。

|ID／層級|原文|現譯|建議|類型與理由|
|---|---|---|---|---|
|JA-RANK-KEEP／P1|助理教授|助教|助教|verified_keep；JST列助教為Assistant Professor層級，文科省指出它以自行教育研究為主要職務；不是台灣教學助理。短卡保留；詳頁可附原職稱助理教授與英文，避免宣稱跨制度資格完全等同。|
|JA-ASSOC-KEEP／P1|系主任 · 副教授|学科長・准教授|学科長・准教授|verified_keep；JST將准教授對應Associate Professor。系主任對應学科長符合此頁系層級；不改成学部長。|
|JA-JOINT-01／P1|助理教授 · 電競娛樂系合聘|助教・eスポーツエンターテインメント学科兼任|助教・eスポーツエンターテインメント学科との共同任用（原職：助理教授・合聘）|appointment_relationship；合聘是共同聘任；只寫兼任會模糊與非常勤兼任教師的差別。校方舊彙編的合聘辦法第4條區分主聘/從聘。此為解釋譯法，不冒稱校方正式日譯；2026最新法規版本尚待人事確認。|
|JA-JOINT-02／P1|講師 · 電競娛樂系合聘|講師 · eスポーツ・エンターテインメント学科兼任|講師・eスポーツエンターテインメント学科との共同任用（原職：講師・合聘）|appointment_relationship；逐筆核對此教師role，與助理教授筆分開，不從單一對照推所有職級；兼任不完整表達共同聘任。|
|JA-SECONDARY-01／P1|助理教授 · 從聘|助教 · 兼任|助教・共同任用（本学科は従たる所属）|appointment_relationship；從聘表示共同聘任中的次要聘任單位，不是直接等同part-time。必要時附原文從聘。|
|JA-SECONDARY-02／P1|副教授 · 從聘|准教授 · 兼任|准教授・共同任用（本学科は従たる所属）|appointment_relationship；這筆副教授逐筆保留准教授層級，補上從聘關係，不把從聘一律替成兼任。|
|JA-UNPAID／P1|助理教授 · 留職停薪|助教 · 休職中|助教・無給休職中|meaning_omission；休職中未表達停薪，補無給即可保留原中文資訊；不推定休職原因或復職日期。|
|EN-ABSENCE／P1|學生請假與獎懲簽核公告|Announcement on Student Leave of Absence and Reward/Discipline Sign-off|Announcement on Student Absence Requests and Approval of Rewards and Disciplinary Measures|terminology_ambiguity；請假是單次/數日缺席申請；同站另用leave of absence表示休學，應區分，避免學生點錯程序。原中文與guide.json請假/休學卡可直接核對；不是對官方公告另增規定。|
|EN-ACADEMIC-LEAVE／P1|休學復學與兵役|Suspension of Studies, Resumption of Studies, and Military Service|Leave of Absence, Return to Study and Military Service|terminology_ambiguity；Suspension可能讓英語讀者理解成紀律停學；此卡是學生申辦休學/復學，與單次請假分開命名。|
|EN-STATUS-NOTICE／P1|115-1休學退學注意事項|Notes on Suspension and Withdrawal for Semester 115-1|Leave of Absence and Withdrawal: Semester 115-1|terminology_consistency；與休學卡統一leave of absence；不改學期或公告適用範圍。|
|EN-RETURN／P2|休學後如何知道復學時間？|How do I know when to resume studies after suspension?|When should I return to study after a leave of absence?|terminology_consistency；與休學/復學術語一致，避免suspension暗示停學處分。|
|JA-OFFICE-01／P1|教務處註冊課務組（動遊系）|教務処学籍・教務課（アニメとゲームデザイン学科担当）|教務処・註冊課務組（学籍・履修担当／本学科担当）|office_consistency；現站同一單位有学籍・教務課、登録・履修課、登録・教務組及学籍・教務担当等寫法。建議保留實際中文單位名，加固定功能解釋；不虛構學校已有正式日文部門名。|
|JA-OFFICE-02／P1|考試相關另洽教務處註冊課務組|試験関連は別途教務処登録・履修課にお問い合わせください|試験については、教務処・註冊課務組（学籍・履修担当）へ|office_consistency；現站同一單位有学籍・教務課、登録・履修課、登録・教務組及学籍・教務担当等寫法。建議保留實際中文單位名，加固定功能解釋；不虛構學校已有正式日文部門名。|
|JA-OFFICE-03／P1|註冊課務組（動遊系）|登録・履修課（アニメとゲームデザイン学科担当）|註冊課務組（学籍・履修担当／本学科担当）|office_consistency；現站同一單位有学籍・教務課、登録・履修課、登録・教務組及学籍・教務担当等寫法。建議保留實際中文單位名，加固定功能解釋；不虛構學校已有正式日文部門名。|
|EN-SKILLS-CLASS／P1|這份指南以日間四技在校生為主。一般班、技優班與不同入學年度可能不同；申請資格和日期請以各處室當期公告為準。|This guide is primarily for current students in the day division Four-year program. General classes, the Special Talent Program, and different admission years may vary; please refer to current announcements from respective administrative offices for application eligibility and dates.|This guide is mainly for students in the four-year undergraduate day program. Rules may differ by entry year and class, including regular classes and skills-excellence classes (技優班). Check the current notice from the responsible office for eligibility and dates.|program_name_precision；Special Talent Program可能與其他特殊選才學程混淆。保留技優班原文並使用解釋性英譯；不宣稱這是校方核定英文名稱。|
|EN-PROGRAM／P2|115 學年度 · 四技日間部|AY 115 · Four-Year College Day Division|Academic Year 115 · Four-Year Undergraduate Program (Day Division)|education_system_clarity；四技是大學部，不是英美語境的two-year college。校方英文介紹使用four-year undergraduate programs；英文加Undergraduate更清楚。民國學年未自行改算。|
|JA-PROGRAM／P2|115 學年度 · 四技日間部|115学年度 · 4年制課程 昼間部|115学年度・4年制学士課程（昼間部）|education_system_clarity；4年制課程並非錯，但補學士課程可明確區分專科学校。JASSO對臺灣大學部/科技大學制度的說明作讀者用語依據，不把日本學制套成台灣法律。|
|JA-CEEC／P2|大學入學考試中心（學測）|大学入試センター（学測）|台湾・大学入学考試中心（学科能力測験）|proper_name_disambiguation；現譯大学入試センター容易被當成日本的同名機構。保留臺灣原機構字樣並標臺灣，避免轉譯成另一個國家的機關。英文CEEC本身可保留。|
|JA-SELECTION-HOLD／P1|甄選入學|推薦選抜入試|甄選入学（台湾の入試区分）|pending_official_term；現譯推薦選抜入試多了推薦概念。應以當期簡章確認是否每類都須推薦，未確認前保留制度原名；暫不全站批次取代。|
|EN-CONTACT／P2|前往承辦單位 ↗|Go to Responsible Unit ↗|Contact the responsible office ↗|plain_language；Responsible Unit像內部組織用語；office對學生較直接。連結仍是原官方URL，不更動服務內容。|
|EN-OVERSEAS-Q／P2|出國實習的保險和簽證，可以自己隨便買辦嗎？|Can insurance and visas for overseas internships be purchased and arranged casually by oneself?|Can I arrange my own insurance and visa for an overseas internship?|plain_language；刪除casually by oneself的逐字語氣，保留學生想問可否自行安排的意思；答案原有須照計畫/承辦要求仍保留。|
|EN-GAME-STORY／P2|每個故事，都值得被看見。|Every story can be seen.|Every story deserves to be seen.|meaning_shift；can be seen只表示看得到，漏掉值得的價值與包容語氣。此句是虛構遊戲字幕，不是政策。|
|JA-GAME-STORY／P2|每個故事，都值得被看見。|みんなの物語を、大切に。|どの物語も、見てもらう価値がある。|meaning_shift；現譯みんなの物語を、大切に是珍惜故事的改寫，未保留值得被看見；建議較忠實版本。若採用，必須同步captionLines分行與字幕可讀性條件，不能只改PHRASES。|
|JA-GAME-READING／P2|字幕碰到人物或舞台邊緣，移到下方閱讀區。|字幕が人物や舞台の端に重なっています。下の読書エリアへ。|字幕が人物や画面の端に重なっています。下の字幕エリアへ移動しましょう。|natural_instruction；舞台與読書エリア在字幕編排語境較不自然，画面/字幕エリア可清楚指向實際操作區，沒有改安全區位置。|

## 重要採用邊界

1. 合聘/從聘四筆：優先修正身份關係。建議「共同任用」是向日語讀者說明共同聘任的譯法，不冒稱人事室已核准正式日文名稱，也不以「兼任」推成非常勤。從聘須保留主從關係，不能反過來改成主聘。
2. 職稱相關原文、教師姓名、系名、招生制度、資格名稱不為了字體去掉關鍵資訊。若要短版，利用詳頁/說明保留原文，不以縮寫改變身份。
3. 註冊課務組同一窗口目前有多種日譯，會使學生誤認不同單位。建議原中文名＋固定日文功能說明；英文 Registration and Curriculum Section / Division of Registrar and Curriculum 亦應統一為同一窗口後再核定正式名稱。
4. 甄選入學的推薦選抜一筆先保留制度原文，等當期簡章確認，不在本輪全域取代所有招生名詞。
5. 行憲遊戲PHRASES若採改譯，captionLines預設分行、字幕適配規則與重播文字都須同批調整並重新實玩。只改一個PHRASES字串會讓一行/兩行內容不一致，也可能把原來可通關的布局改成塞不下。
6. 遊戲事件名、台灣年節與日本同名節日的日期不能互套；本輪沒有改法定假日名稱或日期。

## 官方來源的可讀狀態

- [校方合聘辦法舊彙編](https://wpc.stu.edu.tw/wp-content/uploads/sites/7/2019/11/7.E4BABAE4BA8BE5AEA4.pdf)：官方搜尋索引可讀主聘/從聘與共同聘任定義；直接PDF403。只作名詞關係旁證，沒有宣稱是2026最新聘任辦法。
- [校方英文學制介紹](https://about.stu.edu.tw/en)：搜尋索引明列four-year undergraduate programs；直接403。僅作學制英語說明，不改任何本系畢業規定。
- [JASSO：臺灣大學與大學院](https://ryugaku.jasso.go.jp/oversea_info/region/asia/taiwan/info_tw_university.html)：本輪可完整讀取，頁面標2024年8月19日更新；只使用科技大學/學士課程一般用語，不引入頁面費用、資格或統計。
- [大考中心官方首頁](https://www.ceec.edu.tw/Default.html)：官方搜尋索引含CEEC英文名，直接讀取timeout；只用於機構辨識，沒有對當期考試規則下結論。
- [教務處抵免流程](https://www.aca.stu.edu.tw/抵免學分/)與[通識外語修課](https://www.zzd.stu.edu.tw/通識英文及外語修課/)直接403；產品既有中文與其原查核來源仍保留，未新增或改寫抵免/免修資格。
- researchmap職階PDF在root與本輪搜尋摘要可見，但直接403，未當成全文已讀證據。
- 搜尋曾回傳南臺科技大學（stust.edu.tw），已與樹德stu.edu.tw分開，未拿南臺規則替本校制度。

## 實際驗證

|驗收|yes／no|指令與實際輸出|
|---|---|---|
|盤點實際英日字典並保留來源SHA|yes|node holiday-lab/translation-review/scan.cjs：enKeys2310、jaKeys2339、missingJa0、highRisk393、faculty13|
|抽取15款模組三語字串來源|yes|node holiday-lab/translation-review/scan-local.cjs：files19、triplets396、games15|
|建議逐筆存在於檢查基準並非假造現譯|yes|node holiday-lab/translation-review/verify.cjs：8 yes／0 no；對照exact source/current與13個slug|
|高風險術語/漏配回歸檢查可重跑|yes|verify.cjs檢查職級不混淆、英文鍵漏配、來源數量、原譯漂移與未決詞|
|所有建議已套入產品並通過畫面|no|applied0，故未跑改譯Build/排版/遊戲通關|
|全站逐句語義、母語者審校與所有路由完成|no|本輪是首批高風險審校，長篇與各動態狀態仍待續|
|因現譯可保留而誤判助教翻錯|no|核定保留，不建立虛假的修正需求|

verify.cjs預設exit0只表示審校資料結構與來源錨點檢查通過；--strict會因尚有21筆建議未採用而exit2，不把未修內容當品質綠燈。未執行Build/Lint/畫面，原因是無產品變更，且不能對未套入的譯句宣稱排版通過。

下一個具體任務：主控先採用/修訂P1共同聘任與請假休學區分、統一承辦單位詞彙，補當期甄選制度確認；再對剩餘長篇逐類續審，依實際畫面校短句。所有產品改譯都需三語一致性、無缺字及可讀性回歸。

## 主控可執行的 P1 修正

`node holiday-lab/translation-review/apply-p1.mjs` 預設只做 dry-run；本輪實際輸出：`Preflight PASS: 12 source-anchored P1 decisions; 12 exact patches; 2 data files.`，`DRY RUN ONLY: no product files modified.`。計畫在 `apply-p1-plan.json`。

主控閱讀原→新與diff後，可執行 `node holiday-lab/translation-review/apply-p1.mjs --apply`。只會寫 `data/ja/messages.json`、`data/en/student-guide-ui.json`，每一筆先要求原值完全一致；所有檔案的前置比對都成功後才開始寫檔，任何漂移即停止。未處理的P2、核定保留職稱與待確認甄選名稱均不套用。之後用原建置流程重產locale並驗證中文原文未變、職稱/窗口/請假與休學、版面/缺字。

注意：這12筆先修明列位置；註冊課務組在其餘長句中仍有其他日譯，完整窗口一致性仍需後續逐筆處理。若主控想縮短教師卡文字，保留共同任用/從聘關係，原職說明移詳頁；不要只為短句退回兼任或把助教當誤譯。

## 套用後驗證：與初審快照分開

前述 `verify.cjs` 是「審校前快照」的來源與建議資料驗證。8／8 是當時的實際結果，保留不改寫。產品其後更新照片、runner、語系時，來源 SHA 不同會使它回報快照過期；也不會自動把舊 recommendations 的 applied 旗標當作當前狀態。此結果不能解讀為12筆 P1 的新資料失敗，亦不可用初審舊綠燈證明套用成功。

套用後請另執行：

```text
node holiday-lab/translation-review/verify-applied.mjs --project C:/agywork/agd-holiday-prototypes
```

此程式只讀參數指定專案，不 Build、不重產 locale、不寫任何產品檔。依12筆已審計畫逐一檢查：

- 兩個來源 JSON 的新值完全相同。
- 重建後的 locale-en.js / locale-ja.js 活躍字典使用同樣新值，而非仍有舊譯。
- 助理教授／副教授保留核定職級，未決甄選名稱未自行套用。

本輪對 root 的實測（詳 applied-root-output.json）：來源 JSON 12 yes／0 no；生成語系 0 yes／12 no；exit 1。這表示 root 已正確套用資料，但當下生成 locale 仍待既有 Build 流程更新，不能宣稱畫面已生效。沒有在這個驗證器內自行建置或替 root 修改檔案。重建後以同指令重跑，來源與生成字典皆12 yes且3個保留條件通過，才會 exit 0。

驗證器回歸實跑：`node --test holiday-lab/translation-review/verify-applied.test.mjs`，7／7 pass。涵蓋完整套用、舊值拒絕、資料已改但locale過期、單筆來源漂移、職級誤改、未決詞擅改、縮小為11筆不得過關；另比對讀取前後的所有 fixture 產品檔 SHA 相同。測試 fixture 只寫本審校資料夾，非 root 產品。未因這7個合成情境通過而宣稱全站翻譯或真實畫面驗證完成。
