# 日英審校續批：P2、招生用詞與54個目標字串

2026-10-22；source_agent: codex。工作樹 C:/agywork/agd-translation-review，分支 codex/translation-followup，基準904ac79937407d748e1bfdbce22517d38acbf8f3。只寫 holiday-lab/translation-review/followup/*；產品未改、未push、未碰main、未刪檔、未啟動Unity。

## 可交付結果

- 剩9筆P2已逐筆讀目前源文與上下文，整理為14處實際修改，包含行憲遊戲PHRASES與分行pairs同步。
- 甄選名稱改提中立的 Selection-Based Admission／甄選入学（選抜入試），共18處引用；這是保留台灣制度原名的解釋性譯法，不冒稱官方核定英日名稱，也未把科技繁星的學校推薦制度混入。
- 主控核定3項原中文招生P1：115甄選上限6、技優非僅應屆獲獎者、115繁星錄取生即使放棄仍不得參加該年甄選。三語27處聯動，含canonical字段、JSX實際提示與全部對應字典鍵更名。
- 首頁3段＋指南12組FAQ，共15個語義單位、54個日英目標字串已逐句對照原中文：9單位保留、6單位提出針對性修正。另補4個新導覽選項的8條英日文；不替導覽查詢做資格保證。
- 全部freeze為exact-plan.json：78操作、9檔。root實跑dry-run exit0、product_files_written0；10/10回歸通過。產品套用後的Build／locale／畫面仍由root驗證。

## 套用方式與不覆蓋保證的範圍

先審 exact-plan.json 的每個 old/new、canonical鍵更名與來源。預設只檢查，不寫產品：

```text
node holiday-lab/translation-review/followup/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes
```

確認後才由主控加 --apply。此程式不呼叫Build、不改locale-en.js／locale-ja.js。每個來源字串/JSON值都必須old exact相同；新UI鍵必須不存在；鍵更名必須原鍵存在且新鍵不存在；全部preflight完成後，寫入前再比對所有輸入檔沒有並行變更。

基準SHA只回報漂移，沒有因root無關新改動就重寫成舊快照。程式從目前資料與JSX開始局部修改，保留其它新增內容；已以回歸模擬無關JSON鍵、JSX註解和並行變更。若root已自行改了計畫目標值或先加入同UI鍵，程式會停止，不能靜默覆蓋。此為多檔preflight，非檔案系統交易；真正磁碟寫入失敗時仍須檢查git diff，不能宣稱全部檔案原子回復。

白名單：`data/en/student-guide-ui.json`、`data/ja/messages.json`、`data/en/admission.json`、`data/admission.json`、`holiday-lab/games/constitution.mjs`、`pages.jsx`、`data/en/ui.json`、`data/en/step-details-ui.json`、`data/ja/ui.json`。沒有任何刪檔指令。對應generated locale須依原build重產，再驗新中文key有英日翻譯。

|組別|精確操作數|內容|
|---|---:|---|
|P2|14|9個決策；EN學制year在4個已逐筆核對的slug出現|
|招生原文P1|27|3項115限定錯誤、三語與中文鍵更名|
|甄選名詞一致性|18|英7、日11個實際引用（含Tooltip及長文）|
|FAQ後續|11|同教育階段、技優班名稱、休學/復學、抵免與窗口白話|
|新導覽UI|8|4個新中文鍵各有英日，不改guidePick判定|

## 九筆P2的最終決策

|ID|最終建議／採用條件|
|---|---|
|EN-RETURN|When should I return to study after a leave of absence?；與已核定休學用詞一致|
|EN-PROGRAM|Academic Year 115 · Four-Year Undergraduate Program (Day Division)；僅4個原year完全一致且slug逐筆相配的記錄|
|JA-PROGRAM|115学年度・4年制学士課程（昼間部）；不改學年或資格|
|JA-CEEC|台湾の大學入學考試中心（学測）；保留台灣實際專名，撤掉首輪自行轉造的学科能力測験寫法|
|EN-CONTACT|Visit the responsible office’s website ↗；實際連結是處室網站，首輪Contact建議改得更精確|
|EN-OVERSEAS-Q|Can I arrange my own insurance and visa for an overseas internship?；答案限制保留|
|EN-GAME-STORY|Every story is worth seeing.；同時pairs改Every story is／worth seeing.|
|JA-GAME-STORY|どの物語も、見る価値がある。；同時pairs改どの物語も、／見る価値がある。|
|JA-GAME-READING|字幕が人物や画面の端に重なっています。下の字幕エリアへ移動しましょう。；只改說明，不移動安全區|

遊戲首輪較長提案改為上述較短且保留「值得被看見」的句子。僅在記憶體套四個字串/分行改動，原evaluateCaption條件數字及規則AST未變，英/日×16/18px×2行共4種設定都判ok。這是純規則相容性，不是真實瀏覽器通關、美術或玩家理解驗收。套用後仍須驗字幕畫面與三格回放。

## 官方核查與仍未核定的名稱

- **selection**：[官方來源](https://www.jctv.ntut.edu.tw/enter42/apply/contents.php?academicYear=115&subId=182)。查核2026-10-22；official full page read；115 FAQ first-stage Q3/Q6。總申請數上限6，學校可另限本校報名系科數；不得套用116。沒有查得此頁核定英日名。用Selection-Based Admission與甄選入学（選抜入試）是保留原制度的解釋性譯法，不冒稱官方名稱。
- **skill**：[官方來源](https://www.jctv.ntut.edu.tw/enter42/skill/contents.php?academicYear=115&subId=160)。查核2026-10-22；official full page read；115 application qualifications and Q10。技優甄審資格包含符合簡章採認的競賽、勞動部乙級以上等；不是僅高職應屆競賽得獎，亦非任意證照皆可。
- **skill-procedures**：[官方來源](https://www.jctv.ntut.edu.tw/enter42/skill/contents.php?academicYear=115&subId=168)。查核2026-10-22；official indexed system instructions read；115 system instructions。此頁另有乙級技術士報名說明；與四技二專技優FAQ交叉核對，未套用二技enter/的規則。
- **technician-english**：[官方來源](https://laws.mol.gov.tw/Eng/PrintFLAWDAT0201.aspx?beginpos=2&id=FL015100)。查核2026-10-22；official full page read；2023-11-02 English regulation; Article5/7 terminology。官方英語有Class B及technician/technical certificate。此處只核英語等級用語，不以技術士考照報名規定替代大學技優招生規定。日文以台灣勞動部+原名技術士證避免誤認日本技術士。
- **xuehai-current**：[官方來源](https://edu.law.moe.gov.tw/LawContent.aspx?id=FL038574)。查核2026-10-22；official full page read；2025-11-04 amendment; sections2/4。學海築夢為非新南向國家實習，新南向學海築夢另類；研修和實習不能混譯。受補助條件同一教育階段不是同年級。沒有將參與實習等同必得補助。
- **xuehai-english**：[官方來源](https://english.moe.gov.tw/cp-14-16877-E246C-1.html)。查核2026-10-22；official full page read；2016-06-30 news; historical usage only。教育部此舊英文新聞使用Pilot Overseas Internships。不能據此斷言2026正式唯一英文名，也未查得Building Dreams Overseas已核定。保留學海築夢原名，英文可解釋為overseas internship program；不把目前創意譯名判成已證實錯名。此輪未自動改新聞正式名稱。
- **program-level**：[官方來源](https://ryugaku.jasso.go.jp/oversea_info/region/asia/taiwan/info_tw_university.html)。查核2026-10-22；official full page read in initial audit; no changed numerical policy used；JASSO page updated2024-08-19。以4年制学士課程區別專科；校方英語介紹另有four-year undergraduate programs。這是學制說明而非資格等同認定。
- **star-blocker**：[官方來源](https://www.jctv.ntut.edu.tw/star/?academicYear=115)。查核2026-10-22；official full page read；115-04-22 bulletin; URL query115 even footer already116。115科技繁星錄取生不論是否放棄，都不得參加115四技二專甄選；舊文案暗示放棄即可走全部管道，仍需修正。已依root核定加入canonical key_notes、導覽提示與兩語全部精確引用；限115該項甄選限制，不擴成全部管道永久禁報。

學海築夢/新南向學海築夢的2026唯一英日正式名稱未查得；沒有把2016教育部新聞的Pilot Overseas Internships武斷套成現行唯一名稱，也不把產品Building Dreams Overseas判成已證實錯名。保留原計畫中文名；若要英文解釋可用overseas internship program，須標為說明而非核定品牌名稱。本輪不自動改既有學海新聞名稱。

甄選FAQ及繁星首頁的頁尾可能已切116，但核查用academicYear=115及具日期公告內文；絕不把頁尾文字誤當115規則已變116。本輪不宣稱查到116簡章，也不改115招生名額、日程與費用。勞動部英文只用來核Class B等級/technician詞，不拿考照資格替代JCTV招生條件。

## 語義批次逐筆記錄

一個FAQ單位含中文問答與兩語問答，共4個目標字串；首頁段落每個2個目標字串。完整原/譯及判斷在semantic-reviewed.json。

|單位|判斷|具體核對|
|---|---|---|
|faq/graduation/0|retain|兩語保留入學年度112與113–115、16/20學分上限及類別/認列限制。這是語義核對，未重新驗原課表每頁。|
|faq/graduation/1|revise|英文Special Talent Program容易與特殊選才混淆，改解釋性skills-excellence class並留技優班原名；最低128、0學分必修、一般班不可套技優班均保留。|
|faq/credit-transfer/0|revise|日文將提出≠核准改白話，保留須自行確認退選與期限；窗口保留實際註冊課務組名。|
|faq/credit-transfer/1|revise|英文credit waiver改credit-transfer以區別免修；兩語截止日期及不可假定補交的意義保留。日文其他窗口別名仍待全站統一。|
|faq/english/0|retain|兩語區分分級免修與學分補足，8學分及入學年度核對均保留。未把免修等同學分取得。|
|faq/english/1|retain|兩語均保留先確認適用測驗/分數/效期/替代方案再報考，以及不可照搬別校/往年資訊。|
|faq/status-military/0|retain|兩語均保留登記日起含當日7日、逾期重新辦理與退費基準會變；沒有自行延長期限。日文再申請較泛，但本句未改行政規則。|
|faq/status-military/1|revise|英問句/答案統一leave of absence及return to study，保留通知、更新聯絡資料與兵役另詢的三個動作。|
|faq/overseas-internship/0|revise|日文同一学年段階可能被讀為年級，改同一の教育段階；英文same level of study並保留among other conditions，不把三條列舉當成全部資格。|
|faq/overseas-internship/1|revise|英問句刪除casually by oneself直譯；兩語答案均保留保險/合法簽證、不可預設觀光簽、補助須依核定契約。|
|faq/overseas-study-visit/0|retain|兩語均保留參訪≠實習/學分保證，須依當期課程/本系規定並先確認。英文大寫Overseas屬風格問題，未列為意義錯誤。|
|faq/overseas-study-visit/1|retain|兩語均保留歷屆照片≠本期招募，以及年級/名額/費用/補助各自查證。|
|home/hero-tagline|retain|英日均有將想像化為會動角色/故事的邀請語意，屬適合主視覺的文案轉譯，不要求逐字硬譯。|
|home/news-2026-10-06-unity-115-1|retain|兩語保留證照名、11/14–15、D0625、20人及授課教師；未重新驗證當期開班或發照機構名稱。|
|home/news-2026-10-06-after-effects-115-1|retain|兩語保留SSE-Adobe After Effects CC、12/5–6、D0625、20人及授課教師；未把原資料的證照名當成已完成發照官方核定。|

本批只審這12/30組FAQ，仍有18組FAQ及其餘長篇新聞/教師履歷/課程/實驗室/作品未逐句續審。54不是全站2310鍵的語義通過數；本批沒有重新驗課表全部學分規則、新聞開班狀態或證照發照正式名稱。這些仍以原資料/官方原文為準。

## 尚須root另處理的P1／驗證界線

- guidePick原邏輯曾將高中、已畢業/在職直接導向特定管道，也沒有乙級技術士查詢選項。此處只提供4新UI英日、修錯誤提示；root另承接邏輯修正，不能拿本翻譯套用稱導引邏輯已完整。
- 原selection content把適用對象寫成高職/綜高應屆，但115簡章也列普通型高中畢業滿1年以上等資格。此處freeze只修root核定三P1，不額外推定每種高中/同等學力都可報本系。後續須依115簡章逐類核對招生對象，不把仍未涵蓋者隱去。
- 未做母語者審閱、改譯後截圖/缺字/窄版/完整遊戲回放。新日文出現保留原名與較長句，請交字體/版面回歸；不靠縮小字或換字體掩蓋溢位。
- 之前verify-applied的未決甄選名稱guard以舊Recommendation用詞為當時基準；本輪若經root核定採中立譯名，要按新決策驗，不可把舊guard失敗稱職級P1回歸，亦不應為通過舊guard還原已審的新詞。

## 實際命令與逐條驗收

|驗收|yes／no|實際輸出或限制|
|---|---|---|
|保留舊提交、更新獨立基準、不reset|yes|原分支乾淨；git merge --ff-only codex/holiday-prototypes因cherry-pick分歧失敗，未reset；改依root允許從其HEAD切codex/translation-followup，舊分支保留|
|9筆P2全部有明確決策與實際引用|yes|build-plan：P2 group14操作；回歸核9個ID完整|
|3個115原文P1三語與key更名完整|yes|plan admission-policy27；回歸核對canonical新key/舊key消失、quota/code/year/timeline/fees不變|
|root目前樹old exact可套而不覆蓋非目標內容|yes|node apply-safe.mjs --project C:/agywork/agd-holiday-prototypes：exit0，78 operations/9 files，product_files_written0；root-dry-run.json|
|前置檢查失敗時不寫檔、並行變更有守門|yes|node --test apply-safe.test.mjs：10/10；JSON/token漂移、鍵碰撞、無關改動、並行改動、資料/遊戲規則範圍均測|
|字幕新句與既有規則相容|yes|check-caption-candidate.mjs：英日16/18兩行4種設定ok；未改門檻數值|
|新4鍵英日提案完成|yes|guide-ui8；日文保留台灣技術士證原名，避免等同日本資格|
|首頁/FAQ長句本批實際讀譯對照|yes|15單位、54目標字串；9保留/6修正；不是字典存在性假稱語義全過|
|已寫入產品、Build/Lint/畫面驗證|no|此代理責任是提案，未改產品；沒有執行root Build，也未以合成fixture當瀏覽器證據|
|全站所有日英長文皆已完成|no|其餘18FAQ與其它長文未逐句續審，仍待後續|

首次test fixture把repo相對路徑多退一層，出ENOENT且10測皆失敗；原輸出保留test-first-path-error.txt，改正fixture路徑後同組10/10通過。這是測試基礎設施錯誤，沒有為了測試改產品。另首次node -e候選字幕命令因PowerShell引號失敗，改為獨立mjs後成功；未把語法失敗算成遊戲不可用。

下一步：root審這份已freeze的78操作，確認自己的導引邏輯修正後再套用並Build；以新canonical/三語鍵/日期名額不變/新字幕回放/手機與字體做最小充分複驗。此代理沒有上線或變動舊試玩包。
