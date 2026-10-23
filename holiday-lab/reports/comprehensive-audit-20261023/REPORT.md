# 原始範圍完成度稽核（2026-10-23）

source_agent: codex。只新增本目錄，未更動產品、STATUS、儀表板、C節、勞動節或既有證據；未開瀏覽器、Unity、Build或重跑已通過的大批案例。依 verify skill 做文件與既有證據核讀，不宣稱本次重新執行產品測試。

目前可審閱的是本機8863學生作品首頁、單款策展示範、14款非勞動節試作與在校指南。**整個原始需求尚未完成**：指南各處室所有資料調研／當期文件未齊，28個已複核譯值未套用，兩款學生遊戲沒有完整來源與WebGL產物，真人感受／真裝置／母語全文未取得。首頁與單款示範的方向已選，畫面與玩法仍待使用者回饋。清明與完整UI證據只是其中一條工作線，不能代替這些原需求。

## 判定方式

- done：該列限定產物或行為已存在且有相應既有證據，並不自動代表公開發布或使用者接受。
- incomplete：缺少原範圍的具體產物、調研或查核；不能因已有試作／工單而結案。
- deferred：使用者明確暫緩。
- user-review：產物已可看，下一個合理設計決策需要使用者看實際成果。
- unknown：證據或實際測試前提未取得，不猜測通過或失敗。

scope.json逐項列57列，資料、工具、使用者狀態及來源分開；這些列有層次重疊，**不換算全案完成百分比**。

## 原需求與本輪邊界

英文共用介面及鄧樹遠職稱移除已有2026-10-22獲授權的公開發布：1b8322e、Pages39743799524，正式入口 https://treefar.link/agd-comic-site/?lang=en 。本稽核只讀原發布收據，不宣稱現在重新連線測過線上站。後續日文、指南、遊戲、改版與學生作品示範仍為本機審閱範圍，不繼承英文那一次的公開授權。

節日原訂6–8個加開學／畢展，後經追加其餘假日成15款；勞動節後來明確暫緩。現況為14款可繼續看，舊勞動檔保留。新策展示範另列，不能當成第16個節日或把14款生成素材都已替換。使用者最新選擇是首頁不用AI插畫、學生作品加小互動、遊戲素材分批改且先看一款，不能自行擴成全體作品改編授權。

## 網站、語言、畫面與交付

| 項目 | 判定 | 資料／工具／使用者 | 真正尚缺 |
| --- | --- | --- | --- |
| 英文共用介面公開版 | done | deployed 1b8322e；2026-10-22 212 routes +28 delta +16 live；authorization recorded | 本輪沒有重新連線查站；只認定既有發布已完成，不冒稱即時線上健康。 |
| 移除鄧樹遠電競代理主任 | done | zh/en published；release report confirms role；requested | 後續日文採學科長／准教授；不把電競合聘他人職稱一起移除。 |
| 中英日共用介面與完整主網站 | user-review | local built；prior321 routes; selected later deltas；pending | 日文及新版指南未發布；全文母語審校、專名仍未全部核定。 |
| 13人核心職級與助理教授／助教／TA區分 | done | current role values checked；independent13 exact values；pending | 個人最新聘任／九筆證照／正式學位、人事附註與電競系英文全名仍待一手來源。 |
| 26key／28譯值候選尚未套用 | incomplete | reviewed proposals present；17 source SHA +28 pointer precheck；not required for semantic-only edits | 可先處理12語意值；其餘10 office、4學制、2證名分組。見translation-candidates.json。 |
| 全站英日逐句母語與正式專名 | unknown | large dictionaries built；bounded independent reviews；not obtained | 2310+字典覆蓋不是全文母語認證；正式機構／資格仍有待查。 |
| 保原字型、缺字與孤字末行修整 | done | no font swap; selected wrapping fixed；84 game contexts; candidate stack missing0 unknown0；pending | 限既有來源與本機量測；每字實際fallback及全部長文／平台未證。 |
| 導覽不要剩一字換行 | done | nowrap links +early compact nav；prior27 widths/languages；pending | 不是全站任何長度字串永不換行。 |
| 教師頭高與水平眼線 | user-review | 13 exact-source transforms；78 source matches; annotated geometric alignment；pending | 人工標記近似，幾何誤差不是生物辨識精度；使用者尚未看圖確認。 |
| 分流按鈕不遮老師照片 | done | page flow under1900px；21 selected language/width contexts；pending | 沒有刪掉各分流連結。 |
| 清爽原創小改版三案 | user-review | A/B/C local comparison；36 layout +4 interactions reported；not selected | 首頁學生作品方向已選；不能推論整站A案或三案已被確認。 |
| 學生作品同格首頁 | user-review | 3 whole posters +credits +source links；current9 contexts +2 embedded；direction confirmed; appearance pending | 小favicon生成圖仍保留；未證學生製程零AI／新增改編授權。 |
| 單款學生作品策展示範 | user-review | 3 works,3 exhibition slots,keyboard/reset；current9 contexts；pending | 先回收此款意見再擴大；不把整個14款素材替換當完成。 |
| 節日首頁同格入口／平時回顧／點擊才載 | done | 14 non-Labor choices +archive；9 current lazyload contexts；pending | 學生作品主格取代大CG；尚未定案每季主視覺如何輪替。 |
| 正式開學與畢展日期 | incomplete | catalog dates null；no official event dates set；not supplied | 須查本系正式當期公告；不可編日期或以其他系活動套用。 |
| 真人試玩樂趣與30–90秒 | unknown | mechanics implemented；automation is not blind playtest；not obtained | 需要實際玩家與感受；工具通關不等於符合使用者預期。 |
| Flora WebGL | incomplete | work orders and preflight ready；no source/no real wasm build；TF-BASE handoff selected | 完整來源、產品身分、版本、模組、Build與瀏覽器實玩都尚缺；queued不是執行。 |
| 你是一隻胖鼠 WebGL | incomplete | work orders and preflight ready；no source/no real wasm build；TF-BASE handoff selected | 完整來源、產品身分、版本、模組、Build與瀏覽器實玩都尚缺；queued不是執行。 |
| 不反覆跳Unity選擇器的背景方式 | done | background testing instructions；preflight PS5.1/7 recorded; not game build；requested | 只完成工作方式與防護，不宣稱已在TF-BASE執行。 |
| 本機發布技術補驗 | done | current360 files；12yes0no1unknown; full UI approval false；pending | done只指已完成本次技術清單，不代表可公開發布。 |
| 真實背景分頁暫停 | unknown | pause/cleanup logic present；headless never met hidden=true prerequisite；not obtained | 未注入假hidden；需可建立真隱藏前提的原生瀏覽器實測。 |
| 實體手機測試 | unknown | emulated320/390 available；no actual mobile proof；not obtained | Chrome窄viewport不是iOS/Android真裝置。 |
| 完整發布UI／來源／墨跡義務 | incomplete | contract and partial evidence；historical2046/2076; gate false；pending | 30為歷史最長動態字串證據缺口，含Labor6；不是30畫面bug，也不是整個原始用戶範圍。 |
| 最新可攜試玩檔 | incomplete | historicallocal09 ZIP exists；historical unpack/HTTP proofs only；not approved for new package | 最新8863尚無新ZIP；不交舊ZIP冒充新成果，完整gate與審閱分開。 |
| 離線儀表板與權威數字 | done | single-file offline dashboard；latest34 checks,11 regression,2+offline smoke reported；pending | 資料／工具／使用者三層分開；不得拿歷史coverage當總完成率。 |
| 原clone交接與狀態同步 | done | latest8863 recorded；file exists+SHA recorded；not required | 本機Git保存不等於跨機push備份。 |

## 在校指南逐項

目前data/students/guide.json標as_of=2026-10-22、publication_status=review_draft_only；15卡、47步驟、47段詳細說明、30FAQ、45來源、8分類。45是目前資料數；歷史35來源不能當目前分母。來源數量不代表正文全部讀過或當期規章完整。

| 項目 | 判定 | 資料／工具／使用者 | 真正尚缺 |
| --- | --- | --- | --- |
| 四字標題／白話分類／三欄索引／身分／流程／FAQ | done | 15 cards,47 details,30FAQ,8 categories,6 audience choices；prior9 index contexts; later6 selected smoke；pending | 桌3／中2／手機1欄；標籤不是資格。使用者內容審閱與法規研究另列。 |
| 畢業檢核 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 校外實習 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 證照認列 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 我要請假 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 選課加退選 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 學分抵免 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 專題製作 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 英文門檻 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 休學復學與兵役 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 獎助與急難協助 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 遇到困難找誰 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 就業資源 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 繼續升學 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 海外實習 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |
| 海外見學 | incomplete | summary+steps+all step_details+2FAQ present；prior selected guide DOM flow；pending | 尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。 |

原「要參考各單位的所有資料」要求沒有縮小成只補高頻15項。既有research-flows/coverage.json明示：針對15項辦事資訊，按8組承辦單位查辦法、表單、FAQ、入口與系網消息。未完成各單位全站歷年資料逐篇精讀，不能宣稱已讀所有資料。

下表為已記錄的具體缺件；這是已知缺件清單，不等於各處室全站歷年資料的完整清冊。要滿足原調研要求，還需先建立各單位網站／規章／公告／表單／附件全集清冊，再逐件標目前版本、讀取狀態、適用對象與相關指南條目，不能把索引當全文。

| 相關單位 | 實際仍缺的官方文件／內容 |
| --- | --- |
| 動畫與遊戲設計系 | 當屆專題/畢展辦法與分組、審查、交件表單；現行完整實習及證照認列辦法；下一屆海外實習甄選簡章；本期見學招募、費用補助與認列文件 |
| 教務處註冊課務組 | 目前仍受理的選課及抵免時程；115-1抵免已截止；抵免辦法現行全文與表單版本適用性；休復學及退費個案須承辦確認 |
| 學務處生活輔導組 | 現行完整學生請假規則及操作附件；本期兵役調查與補辦表單全文；各獎助個案文件；不得混用不同方案資格 |
| 研發處職涯發展暨校友服務中心 | 本系現行實習辦法及實習中/結束後考核；當期證照獎助仍可受理狀態；當期實習、就業職缺及海外甄選 |
| 通識教育中心及語文承辦 | 現行英文能力畢業門檻辦法全文及檢定/替代方案；分級免修與補足學分依入學年度核對 |
| 國際及兩岸事務處 | 本期見學團及校級出國申請文件；境外生來校交換流程不能套用本校生出國；歷史成果不是目前可報名證據 |
| 教務處招生選才組 | 外校各所資格、繳費及上傳期限須分開核對；本系升學輔導統一窗口未確認 |
| 諮商與特教資源中心及學生權益受理單位 | 現行學生申訴辦法、表單與收件窗口；現行校園性別事件申請調查入口；諮商官方頁直接開啟未成功，不用他校或第三方資訊填補 |

## 節日與開學／畢展逐項

| 項目 | 判定 | 資料／工具／使用者 | 真正尚缺 |
| --- | --- | --- | --- |
| 元旦｜明年的第一格 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 春節｜年獸表演課 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 元宵｜燈影借位 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 兒童節｜玩具聲音偵探 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 端午節｜粽葉折疊局 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 中秋節｜月光剪接台 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 教師節｜老師，這格謝謝你 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 國慶日｜島嶼場景工作室 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 開學｜新生第一張地圖 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 畢業展｜畢展策展接力 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 和平紀念日｜把話聽完整 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 清明節｜紙鳶借風 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 勞動節｜動畫接力班 | deferred | existing local prototype；prior function receipt only; no current test；pending | 使用者明確暫緩，不啟續接。 |
| 臺灣光復暨金門古寧頭大捷紀念日｜時光對照室 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |
| 行憲紀念日｜同一頁，都看懂 | user-review | existing local prototype；current selected core3lang×2width proof；pending | 玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。 |

14款的84組核心流程收據為03版所選情境，不是所有無上限動態組合或真人趣味認證。新8863的283個既有lab runtime與該版逐byte相同，來源等價有主控收據；本次不重新測14款。catalog已有一般節日設定，但本次未重新對官方行事曆查核，不能新增「所有日期最新且官方確認」的宣稱。開學及畢展date/end仍null，是明確缺件。

## 可以自主完成的三個小任務

以下三項不依賴清明證明或使用者單款示範選案，也不新建遊戲、不擴美術、不需重跑全部舊案例。這裡只列工項，未開始套用或再派工。

1. **日文7個保義修正**：JA-ABSENCE-01/02/03、JA-EFFECTIVE-DATE-01、JA-MAKEUP-01、JA-APPLICATION-DOCUMENT-01、JA-CLEAR-BUTTON-01。只修長期欠席／事後欠席申請、有效開始日、補修非僅重修、自傳非推薦書、說明與實際清除按鈕一致。來源data/ja/messages.json及step-details.json；不新訂期限或資格。交付精確7值diff、locale生成比對、針對受影響頁面的全文與320/1440換行驗證。
2. **英文5個保義與白話修正**：EN-CERT-RECOGNITION-01、EN-ENGLISH-RECOGNITION-01、EN-CONTACT-PLAIN-01/02/03。移除原中文沒有的學分認列暗示、保留完整financial awards or subsidies、把窗口改成responsible office／point of contact等。來源data/en/student-guide-ui.json及step-details-ui.json；不新加證照認列資格或申訴期限。交付5值精確diff與所選頁的全文、按鈕查找及窄版檢查。
3. **官方文件補查第一批與全文清冊**：先為上述8個單位建立正式網站、法規、公告、表單、附件清冊與讀取／版本欄，並優先補目前真缺的當屆專題／畢展辦法及表單、現行實習／證照認列、英文畢業門檻全文與入學年度替代方案。先交可查證來源及逐段摘要，查不到／403／僅索引就明記，保留後續海外實習、見學、請假與權益等所有缺件，不把首批當全部調研完成。此任務可先自主做公開資料調研；遇未公開正式文件時列出確切文件名和承辦單位，不能編資格。

其他16譯值（10承辦單位名、4學制、2技術士證原名）在translation-candidates.json分組，不因可讀性修正就順帶核定個人資格／台日制度等同；獨立來源與正式名稱界線需保留。12個語意值只是最小可先做範圍，沒有刪除28值完整待辦。

## TF-BASE與分期終態

Flora與「你是一隻胖鼠」目前只有TF-GO上的來源盤點、工單、背景測試方式與防重送工具。queued-inspection.json仍queued-not-executed；Online、445可連或精確Editor已在TF-GO安裝，都不等於取得TF-BASE來源、執行權或成功Build。系網影片標「你是一隻胖倉鼠」，兩名字尚未由產品名／標題畫面交叉確認；不能自動建別名。

真正缺的是TF-BASE回傳的兩款來源位置、Assets/Packages/ProjectSettings、ProjectVersion、產品身分、Git/恢復點、6000.5.10f1與WebGLSupport守門、相容性實讀、背景Build log／產物、wasm傳輸及實際開始／結束／重試／卸載驗收。沒有這些不能自主產出真正移植版；此阻礙不是另寫更多工單能解除。本稽核未連遠端、重送隊列或開Unity。

可分期終態：本機可審閱版（已有）→使用者看首頁／照片／單款並回饋、同時自主補翻譯與研究→依回饋決定素材分批改的範圍→有真實來源後做兩款WebGL→完成選定發布範圍的技術驗收及正式公開授權。未取得回饋前不能自行定稿設計，但也不能因此把翻譯／原調研欠缺放著不做。

## 容易誤判的數字與證據

- 固定08的2046/2076、缺30，是歷史合約案例證據覆蓋；包含勞動6，非勞動24。它不是30個真畫面bug、不是新8863完整通過率，也不涵蓋指南研究、翻譯、WebGL、學生接受度等全部原需求。
- 儀表板games表labor有歷史tool=pass，但progress/labor明確preserved／unknown／paused；本輪沒有測或續接勞動，不能只讀其中一格宣稱當期驗收完成。
- 21個Unpaired paths已在原英文發布報告說明由人工字典補新增年份，不是21條漏譯；不是這次自主修正目標。
- 最新主報告、STATUS及原clone交接指8863／student02。implementation/STUDENT-REPORT.md保留較早8862待驗快照，不拿它當最新版否定後續獨立結果。
- 共用favicon仍是既有Codex圖示；學生海報具創作者欄不等於已證零AI製程或取得改編授權。
- 最新發布補驗12yes／0no／1unknown只代表其13項技術清單。真背景hidden尚未建立，完整UI與使用者確認仍false；不能靠改低階gate規則抹除原用戶需求。

## 實際指令與可重跑證據

```text
cwd C:/agywork/agd-holiday-prototypes
node holiday-lab/reports/comprehensive-audit-20261023/translation-precheck.mjs
TRANSLATION_PRECHECK sources 17/17; pointers 28/28; keys26 values28 semantic12 office10 program4 qualification2; productWrites0
exit_code 0
node holiday-lab/reports/comprehensive-audit-20261023/audit.mjs
AUDIT rows57 games15 guide15/steps47/FAQ30/sources45; sources33 stable=true; dashboardReceipts23/23; browser0 unity0 productWrites0
exit_code 0
```

前者重新核對17檔審查來源SHA與28個JSON pointer原值，沒有重新查官方網站或套用譯文；後者只讀33份當前來源與權威，23/23儀表板來源SHA相符。完整57列scope、15款日期、15指南及單位缺件、既有QA摘要均在scope.json。這些指令是稽核工具，不是新Build／UI測試。

本次探索命令曾把source_receipts誤當陣列而TypeError、讀不存在review.json而ENOENT、rg Windows glob參數格式錯誤；均只讀且未產產品變更。改讀實際schema／findings.json／明確路徑後取得上述結果，不把失敗探索算成測試。

## 來源SHA-256

下表是本稽核真正讀取的來源快照；完整路徑、bytes與讀取後穩定檢查在scope.json。

| 來源 | SHA-256 |
| --- | --- |
| holiday-lab/STATUS.md | 85e7bb6d119ab81d1b40fae13a9a238b8aa6579deb0f03798c161cd060c2e72d |
| C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md | 837a929574629b882a49a3980ca444d8fc465c480e404313c5b67c68f0dcaf28 |
| holiday-lab/catalog.mjs | 3ff982b58d12e560e94d90ef3032ec389e48207d50bbec91268f914a56882dad |
| holiday-lab/dashboard/data.json | a87a18c4ed4adb30dd43cb6cdc0563d85924fe428ef91d6639af84197b065736 |
| holiday-lab/dashboard/out/dashboard-data.json | 9c06fda2ce90a75598b890a77d38de3be03b21370c09a99201ff322830846aaf |
| holiday-lab/dashboard/progress-policy.json | 0fae9cc9292dcd8bd7d5c2a2ffb2cfa544fa82117cf9bf59e9c228dd63bec2df |
| holiday-lab/dashboard/progress-source-receipts.json | 96160ac2df991d511c4382b5db54860d9436d0bb4d3bd6af7d7dbab315566bd3 |
| holiday-lab/layout-qa/supplement-integration-20261023/v4/coverage-current.json | 48921202d1a5427010632a3da320dc2b31775d4b8803ea9d61536a5d93c36eeb |
| holiday-lab/reports/ui-polish-20261023/REPORT.md | 263fca882c744c16f3803c1a735c66e5d794ae819db64906f5748c47e8c73224 |
| holiday-lab/reports/ui-polish-20261023/root/verification.json | 2d0357352137bab1068df92b4aa527e3443d195efee7e3490078eab9d5458c98 |
| holiday-lab/reports/ui-polish-20261023/audit/font-coverage.json | f6341d0f3451053c6b605b2fdf1f4fe3a5ba0122949045b77bdd611f3a7b901a |
| holiday-lab/reports/ui-polish-20261023/audit/design-notes.md | 28d196b269ce926f7affcbd9d87b84e2228a7489059b3b914576a96ba175ce17 |
| holiday-lab/reports/hero-release-20261023/REPORT.md | 83dcecb87c616f246377394d5944926fb1e4089fda2eb14608d01903e8f1a53c |
| holiday-lab/reports/hero-release-20261023/root/student-verification.json | 1e6a86a98d54f163f4e95116f9b0549cac3afeb344a74a234d3c1b40d151bc1f |
| holiday-lab/student-webgl/REPORT.md | ec94d9dca3ff70bc9e25bd0af6076b0341f7effd0ce51139a10770effa696b12 |
| holiday-lab/student-webgl/queued-inspection.json | 9bc5d7d99cb8eea665725066511872afc6fb3bc110256f87b064bd94a9cdac92 |
| holiday-lab/student-webgl/WORK-ORDER-index.md | 358d85d728c923c633b2199bb50364433f75c2cb146ade31ec1206c79a6aa126 |
| holiday-lab/student-webgl/BACKGROUND-TESTING.md | b954bff5d38d51a9dff4ee6a9a37c48e9460c59966862c48c184fe76063771da |
| data/students/guide.json | 81595129ae609d1913c4562500955a6ff1601782cf4fe11368ee5bcc9e3239fc |
| student-guide-model.js | 1721bc47fbbbffccdc696250f7aff8f24449a868ad7d3e69f8fd1c6fc6ed270c |
| C:/Projects/系網漫畫版_AGDComicSite/work-orders/20261022/ja-comic-review/research-flows/coverage.json | 5004e0040a1dee96f953d4f43fd27e9b5e7d0fff9420fd31155cd1cc125216dc |
| holiday-lab/reports/guide-index-evidence/result.json | 71b7f9bf14a99002dcacd8c3c053e430af18b0b4bedc95db8be6d3d42523a899 |
| holiday-lab/reports/current-preview-smoke-20261023/REPORT.md | 8d002be103ea55f5ef8a40c25dfb14fac030a809c02f6b7c8bba9d7b6a722331 |
| holiday-lab/reports/faculty-portrait/REPORT.md | 9eaa20a69f57b1e3b0e3cc4bb6edadb57aff5f078b9772c52f3573b3221c826a |
| holiday-lab/reports/faculty-portrait/browser.json | 80a2756a71ec9d4ccf6b19dc0812ba01af94ba1c080f6490e8df6b612bab7564 |
| holiday-lab/reports/floating-cta-result.json | 11f42e2884a5e92e01d76e41ff023b7ff911c25dbdbfc5e2ab2e3f4e755825c4 |
| holiday-lab/redesign/style-options/REPORT.md | 295308dd606810949d546dacd665ee86f340ddbf2f25858d3aecd8174ae13825 |
| holiday-lab/translation-review/independent-language-recheck-20261023/findings.json | 90eb2ab1158062087cded37d7159aafd44bece3a88412fa608d6013dbde8af58 |
| holiday-lab/translation-review/independent-language-recheck-20261023/REPORT.md | 17cddf0f141ad96e40d0f4a7695649d98324cdfdbcb4bdb36b652858a7e87070 |
| holiday-lab/translation-review/dedicated-language-audit-20261023/REPORT.md | 742a3946744b420ad24786efc5751b642e5361ad220f314b76553947290cc9d2 |
| holiday-lab/translation-review/guide-terms-rendered11/summary.json | 4869b2ce5611a4e572ed9641f16275b659ca77c05f489ea36f3f1361c69c9a79 |
| C:/Projects/系網漫畫版_AGDComicSite/work-orders/20261022/shared-interface-release/VERIFY-shared-interface.md | bc1617eaf3371a0cb4f1f1205995f0c0171b8f6152c4463f7575de3d9e2b84ee |
| docs/qa/i18n-catalog.json | 33e577941432b649dc054260e9cfff498c601a0d2f94aeab8d8da7e6f218a809 |

翻譯17檔的「前案預期SHA／當前SHA／一致性」、28值完整原文／候選／pointer／定義來源SHA，另見translation-candidates.json，避免把不完整摘要當套用工單。
