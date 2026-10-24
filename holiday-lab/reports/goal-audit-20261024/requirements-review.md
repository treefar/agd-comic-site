# 10/24交付要求審核：8881本機審閱階段

審核時間：2026-10-24 10:50左右（Asia/Taipei）。本檔只對既存檔案及原始收據做唯讀審核；沒有開瀏覽器、重跑測試、研究新官方資料、Build、修改產品或儀表板、切分支、啟停服務。8881維持供使用者審閱，沒有被本審核重啟或終止。

**結論：全項核對與本機審閱階段有實際交付證據；原需求仍有明列缺件及外部依賴，不能寫成無條件全部最終完成。六個no也不等於六個已知產品bug。** 特別是跨OS逐字證明、母語簽核與所有素材改編權保證，超出本次使用者指定的完成條件；不得因這些額外保證未取得，自創8881不合格或無限延長工作。

審核收尾時另有獨立語意審閱新證據：**TR01／TR02兩個key、四個英日值有精確最小修正建議，尚未套用。這屬使用者原本要求的翻譯檢查範圍，是具體必要待辦，不能用「母語審閱額外保證」理由忽略。** 8881與47source保持凍結；本審核只列下一步，不代主控修改。兩份舊DOC全文解析則已另派窄任務辦理，不能預先宣稱已完成。

最新基準：`http://127.0.0.1:8881/`、指南 `/?lang=zh#/students/guide`、儀表板 `/progress/`；`.measure-guide-final-docs-20261024-02`、360檔、`app-NOKAZJIM.js`。此處網址與版本依交接及已保存的服務綁定收據，本審核沒有重新發HTTP或新開頁面，因此不冒稱即時重驗服務。

## 一、8條交付要求逐條核對

| 工單原條次與原範圍 | 已證明 | 未證明／外部依賴與判定 |
| --- | --- | --- |
| **1.** 讀交接、工單、STATUS及研究；核最新版8873、原圖、分支、四dirty與C節 | `overnight-20261024/root/before.json`記三份指定文件完整讀入、bytes／lines／SHA與兩工作樹分支、原保護檔及C節SHA；後續原圖、dirty及main保全收據仍在。最新8881交接沒有把8860或8873冒充現版。`live-main-readonly.json`及`main-ancestry.json`有當時main只讀比對，`news-preservation.json`保留21則消息與既有更新差異。 | 這是已執行的歷史開工／保全證據，不是本分鐘重讀所有舊畫面。禁止main、push、刪檔與C節的限制仍持續，不能因有早期發布授權而沿用到本輪。**本條有證據完成；限制持續有效。** |
| **2.** 中英日同介面／資訊、桌面導覽、手機選單、語言切換、頁尾按鈕、短末行、缺字、章節定位逐項核對 | 8880獨立三語×390／1440六組156 yes、0 no；8881只改JA資料一字，另做JA兩寬20 yes並證45個其他source與293個圖像／字型檔不變。語言切換、頁尾、定位、教師及代表標題另有8876／8879明列範圍的原收據；不是只拿字典完整度當UI通過。 | 8881沒有重跑全站所有路由六組；這與「改動相稱、勿重複大批測試」相符，不自行補成全站批准。真機、所有OS、每字實際fallback未證。**已完成限定功能與已報症狀核對；全站零缺字保證仍未證。** |
| **3.** 逐筆核人名、職稱、正式資格與處室外文；鄧樹遠無電競代理主任；助理教授不硬套；教師頭部比例與水平線、原照保留 | `overnight-20261024/program/REPORT.md`有13位教師逐人title_checks、4個日文職稱修正；鄧樹遠現角色不含舊職稱。`followup-20261024/contacts`逐筆8窗口；正式英文已有依據者已用。照片有六組共78個標記投影／原照SHA證據，後版保留定位與照片，沒有修原圖；頭部標記是人工近似，並非真人視覺等尺寸的絕對保證。 | 蔣天華官網中英角色相互矛盾、新特教中心英文未同步、部分中心英名variant及官方日文未取得。保留原中文職稱＋功能描述是可審閱處理，不是假稱已取得官方日文等值；逐筆核實要求不能刪掉。**已做逐筆查核與可證修正，剩正式對映及官方矛盾列未解。** |
| **4.** 四PROGRAM整句及相依欄位、115已關閉／116待公布、整頁一致 | 16個同頁欄位、三語48項修正及四PROGRAM都有精確before／after；115一般單招30名已截止，移除統一面試、固定時段及未核費用／證書保證。保存13可見值六組78觀察。未用116未知數字補空。 | 不能以此稱116所有招生簡章已實讀，或設創所116A1口試矛盾已解。原要求是清楚分已關閉與待公告，已保守呈現；當期116正式更正另列第5條缺件。**本條修正及相依一致性已有證據。** |
| **5.** 指南直白分類、三欄、身分索引、大流程／小說明／FAQ；選課、學籍、請假、實習、海外實習、海外見學、證照、英文、畢業、專題、升學、獎助、求助、就業；處室與系網消息、當期規章／表單／日期／年度；未讀／衝突／缺件誠實揭露 | 全15卡逐題有矩陣與來源；15卡47步、56FAQ、89來源，更新10卡，其他5卡保留。當期教務、校級實習、學海、急難、助學、申訴、性平與公開表單補研，精確提案可完整重建產品；三語實際文案、來源列、FAQ鏈及電話已驗。海外見學有卡、有歷史／當期限制，沒有被刪除或以交換規則代替。流程沿用文字／版面，沒有新生圖。 | 當屆系內文件、完整證照認列表、專題二／三審與116口試、早復學與退費矛盾等仍未齊；部分資料只有公開流程，不是登入後功能與個人資格核定。**「逐題核對並明列缺件」已做；「每題所有當期正式細則齊備且衝突解除」未證。** 日期欄 `published_or_document_date`部分只在資料、不在來源列渲染；不可宣稱每個文件版本日期都顯示在UI，適用年度仍須依各卡正文、限制與原來源確認。 |
| **6.** 只核TF-BASE指定新回傳；有完整WebGL才驗包整合，缺包留待回傳、不Unity／舊大包／重派 | `webgl-recheck.json`於2026-10-24T02:10:24 UTC實查指定夾5工單／腳本、0子夾，未見WebGL。沒有假稱包已到或轉而開Unity、重派；頁底入口位置六組已核招生後、頁尾前。 | 指定夾沒包不等於TF-BASE所有位置均無成品；兩款完整WebGL仍是外部交付依賴。**「查回傳、缺包明列」已做；「兩款可試玩」未完成但不應在缺包時自行造包或開Unity。** |
| **7.** 真bug先重現後修；相稱Build／三語手機驗證；逐條yes／no、命令stdout／stderr／exit及畫面；已核／已修／保留／缺件 | 8881 Build exit0；37回歸＋1日文字案測試exit0；原red、apply、green都保存。8880六組156項與8881JA兩組20項、92張WebP，來源／build SHA守門與精確單字反向還原。方法錯誤cases0的紅收據保留，沒有改產品配合錯方法。50列逐項分類、44 yes／6 no，未將來源方法通過升格政策全面核定。 | 沒有完整跨裝置、全站所有外部連結與所有資料語義批准；也沒有要求每次資料改字後重跑舊遊戲或78張遠端教師照。**本條的實際最小充分證據已交，沒有必要為額外保證重啟巨量QA。** |
| **8.** 更新儀表板、交接、可重算數字、本機網址、原失敗與證據保存、使用者確認不擅升格 | 儀表板重產50列、44 yes／6 no、使用者0；權威18／18、桌面手機深色互動14 yes。原專案交接最新8881段、STATUS與Vault本機記錄的寫入收據exit0，C節不變、私人Vault不push。50列check引用的46個去重證據路徑在本審核時皆存在。 | 使用者尚未對8881新畫面確認，不能把工具通過當使用者接受。這是等待審閱，不是代理可自行補造的測試條件。**交付更新已有證據，保留8881等待具體意見即可。** |

上表未把「凍結節日、沿用原風格、不AI生圖、不改原作、頁底試玩、不發布、不main、不刪檔、不C節」漏掉：這些為8條共同限制。`saved-guard-command.json`保存315素材、5保護檔、13不變程式檔、5其他卡、main與C節一致、deleted_tracked_files=0、festival_games_frozen=true。既知生成favicon及節日素材網站引用已停用，原檔保留；這不同於重做凍結遊戲。

## 二、六個no：必要工作、可執行下一步與外部依賴

| no id | 原要求與額外保證的分界 | 是否仍有必要工作／精確下一步（本審核未執行） | 既有來源路徑 |
| --- | --- | --- | --- |
| `font-global` | 使用者確實要求留意中日缺字，先等義改句、不能改姓名資格，大量缺字才換近似字體。**所有OS、每字實際fallback、全部字重／離線網路保證不是額外的必達門檻。** | 目前沒有確認的缺字bug，沒有必要先換字型或批改文句。有限Windows採樣、30 JSON候選字集及新增24字都有證據。若要補原範圍尚無active DOM證據的詳頁，下一步只列其實際URL、可見字串／codepoint與字型，對新候選留畫面、重現後再修；有新回報才啟動相稱補驗。不能僅為把全站保證no轉yes而重跑所有組合。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/followup-20261024/fonts/REPORT.md`、`scan.json`、`coverage.json`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/font-delta.json`、`delta-final.json`。 |
| `formal-units` | **網站實際使用的人名、正式職稱／資格與處室譯名逐筆核對是原要求。** 蒐齊全校所有未被本站使用單位的官方日文、或將台日職級法律完全等值，並非要求。 | 必要缺口仍要保留，不能稱全站正式專名都已核定。下一步由實際使用值對既有title_checks／8窗口matrix列未解項，保留中文原名及描述譯法；只在校方有正式新名／更正證據時套用。蔣天華中英衝突、新特教英名與官方日文缺件屬校方原資料依賴，不以重複搜尋或自行命名消除。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/overnight-20261024/program/proposal.json`的`title_checks`；同目錄`REPORT.md`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/followup-20261024/contacts/source-matrix.json`與`REPORT.md`。 |
| `guide-currentness` | **當期正式來源、逐題大流程與說明、FAQ、適用年度及未讀／衝突明列都是原要求，不能縮成只有索引。** 但工作明文允許缺件、版本衝突不冒稱已解；個別學生校務登入與資格核定不是本次公開指南研究。 | 有一項明確可再做的本機文件工作：讀既有`department-recognition.doc`及`department-evaluation.doc`全文（以可用的只讀DOC解析／既有Word檢視方式；不用Unity、送表或校務登入），保存原件SHA及完整文字／可讀性。**解析成功也只證舊表全文，不能證115適用。** 其餘當屆系內細則／海外見學招募與費用／證照表、專題及116口試正式更正等，下一步是有新正式文件才讀並更新；現在保留明確未知，不推論校方一定沒公告。UCAN公開入口錯誤及校內當期履歷預約缺件已在卡內如實說明，不必透過登入來補全系統保證。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/internship/raw/department-recognition.doc`、`department-evaluation.doc`；同組`department-comparison.json`、`matrix.json`、`REPORT.md`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/academic/matrix.json`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/support/source-matrix.json`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/current-rules-20261024/study/matrix.json`及`threshold/source-matrix.json`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/overnight-20261024/guide/matrix.json`。 |
| `art-provenance` | **不使用AI生成、取消已知AI引用、沿用完整手繪原作及正確署名是原要求。** 工單也明定來源不明列待核，不宣稱零AI。所有既有照片／作品的全部改編權保證是額外保證，且使用者明說不改作，不能反過來要求先取得「改編」權才交本機原作審閱。 | 已知生成引用停用與315原件保全已有證據；不能把來源未明偷偷改成來源已清。下一步若有需要，只對asset-audit中仍實際引用且未明的項目補既有作者／校方出處或權利備註；有證據為AI才停止該引用，原檔不刪。不需要生成新圖或為未進行的改編取全套保證。既有逐件製程／權利未知仍誠實列no，不能宣稱整包零AI。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/overnight-20261024/root/asset-audit.json`（`known_ai_references:[]`、`zero_ai_production_certified:false`與逐項來源）；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/preserve-final-command.json`。 |
| `webgl` | 兩款可試玩是前述目標；本次裁定明定**只核指定新回傳，缺包留待回傳**，不能改以重建Unity、抓大舊包或重派完成。 | 必要的指定夾回查已做，現在沒有可自行驗的包。下一步須等TF-BASE送回完整WebGL與檔案清單／必要啟動說明，再只核新包完整性、啟動與頁底整合；未到包前不做這些相依操作、不無限輪詢。本輪資料不足以說兩款已完成，也不足以說TF-BASE其他位置無檔。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/webgl-recheck.json`：指定夾`1AyLeNipIEaKPWxgy685eLpuldnlIEsiD`、5檔、0子夾；時間2026-10-24T02:10:24 UTC。 |
| `real-phone` | 使用者要求手機介面、翻譯檢查與獨立驗收，已有390寬與三語操作證據。**實體手機設備認證、母語者逐句簽核、使用者新畫面確認不能混為同一個未達產品要求。** | 實體／母語保證未做並非已知bug，也不能為了50列全綠自行要求新硬體、找人傳訊或延伸工作。下一步是使用者看8881提出具體問題後，精確重現與修正；若未來明確安排真機或母語審稿，再限定任務。使用者確認0持續如實保留，不由代理代填。 | `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/REPORT.md`、`qa/verification.json`、`qa/ja-source-r3/verification.json`；`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/dashboard-build-command.json`。 |

上述「下一步」是交接清單，沒有在本輪自行開新工作。舊DOC全文屬確實可做的有界補研，主控已另交guide_content24於`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/goal-audit-20261024/legacy-docs/`辦理；本審核只讀到進行中檔案，未有可採的完成REPORT，**不預先轉yes、也不重複執行**。不以此聲稱所有其他no都可透過更多工具立即解除；本屆效力、正式更正與WebGL回傳仍需相應外部證據。亦不能刪去尚未證明的原要求，只因這次選擇交本機審閱版就將其改為不需完成。

### 新得翻譯提案：與六個廣義no分開列

實讀`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/goal-audit-20261024/translation-review.md`：122個unique key共244個英日值逐筆審閱，結構6yes／0no；發現兩項原動作語意不夠精確。它們是新證據，不推翻8880／8881原來字典對應與功能收據，也不能因原測試全綠就略過。

| 新發現 | 目前狀態 | 必要下一步及精確來源 |
| --- | --- | --- |
| TR01分級後免修，不是免除分級本身 | 英文`placement exemptions`與日文`クラス分け免除`有最小改譯建議，未套產品。 | 主控依`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/goal-audit-20261024/translation-review.json`的`proposed_changes`精確before／after，核來源後改為placement-based course exemptions／習熟度判定に基づく履修免除；保留條件，不自造免修資格。 |
| TR02返校報到與成果報告分開 | 英文`complete the required return report`及日文`帰校報告と成果提出`有最小明確化建議，未套產品。 | 同一JSON內對應指標改為report back to the university／帰校手続きと成果提出，依計畫處理，不增加一定親自到場、時限或資格。套用後僅做文案相稱的精確差異、翻譯渲染與必要Build驗證，不重跑凍結遊戲。 |
| PN01註冊課務組英名 | **已由既存官方雙語同列證據解除**，無需改名。 | 同份審閱JSON的resolved_existing_evidence與`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/followup-20261024/contacts/raw/aca-organization-dom.txt`、`academic-en-dom.txt`支持Registration and Curriculum Division；不把這一筆仍算缺件，也不藉此聲稱全部正式專名都已解。 |

因此目前可清楚執行的收尾是主控審核四個語言值提案、等待另組DOC解析實際結果，再按原範圍交付；跨OS／母語認證／全部改編權不應被加入這個收尾條件。本審核未授權或派出任何新工作。

## 三、實際收據交叉核對

本節是讀取已存在命令JSON的結果，**不是重新執行這些命令**。各JSON保存精確執行器、參數、cwd、stdout、stderr及exit_code；本審核讀到下列stdout與exit，stderr皆空字串。

| 原始收據（均在 `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/`） | 實際stdout摘錄／判讀 | exit |
| --- | --- | ---: |
| `build-final-command.json` | `Translations: 2551 ... Unpaired paths: 0`；`.measure-guide-final-docs-20261024-02`，`app-NOKAZJIM.js`，360檔，`MEASUREMENT_ONLY`／no publication。這是本機量測建置，不是發布核准。 | 0 |
| `regression-command.json` | `tests 37`、`pass 37`、`fail 0`；日文字案另`japanese-source-green.json`1測試，非把37說成38在同一指令內。 | 0 |
| `qa/raw-r1-command.json` | `PASS zh 390 27/27`、zh1440 25/25、en390 27/27、en1440 25/25、ja390 27/27、ja1440 25/25；合計156，對象8880／01，47source與360build穩定。 | 0 |
| `qa/ja-source-r3-command.json` | `PASS ja 390 10/10`、`PASS ja 1440 10/10`，對象8881／02，20項；source／build穩定、browser_closed。 | 0 |
| `data-save-final-command.json` | `pass:true`、15卡47步56FAQ89sources、`reconstructed_exactly:true`、EN122／JA121實際變更、舊key刪除0、非預期0、未成對0、衝突0。 | 0 |
| `saved-proof-command.json` | 8881、first_contexts6／first_checks156、delta_contexts2／delta_checks20、92畫面、47source、360build、新字24；`full_project_approved:false`與`public_release:false`。 | 0 |
| `saved-guard-command.json` | protected_files5、preserved_assets315、unchanged_product_source_files13、other_cards_unchanged5、main_and_c_unchanged true、deleted_tracked_files0、festival_games_frozen true。 | 0 |
| `dashboard-build-command.json`、`dashboard-verify-command.json`、`dashboard-ui-command.json` | 50列／44yes／6no／使用者0；18／18 PASS；1440與390各7項，共14yes，source_stable true。 | 各0 |
| `handoff-command.json` | latest8881；handoff_written／status_written／vault_written／c_unchanged true；private_vault_push false。實際寫入器有read-back與C節SHA斷言。 | 0 |

`qa/ja-source-r2-command.json`的原方法紅留存；r3報告明確說明日期欄不渲染，因此只證兩份JA字典精確改字與原來源列無副作用。沒有把「新正字可見」這個未成立敘述包進通過數。

50個checks中的44 yes涵蓋已修、已核與保留的歷史限定證據，6 no涵蓋缺件與擴張保證；它不是44／50條功能通過率。`full_project_approved:false`更不是「已知6個故障」的反面值，不能直接拿欄位名稱代替其實際涵義。

## 四、審核輸入保全與本次唯讀指令

2026-10-24T02:50:48.987Z實際讀檔重算：

| 輸入 | SHA-256 |
| --- | --- |
| `C:/Projects/系網漫畫版_AGDComicSite/work-orders/20261024/AFTER-0100.md`，7704 bytes | `a74a2d646ee0f144ae6e36f582a99024caff45071abd8b7b3720079236375dc2` |
| `C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md`，102667 bytes | `0b655291200d21b3d38e789d0c53ce3e9447e63c611af80451742c82c033cc24` |
| `C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/verification.json`，265989 bytes | `2bcd95a5755d792519463247794f1e63b8096d925c76a3d4fff2bcdbcf94ad08` |
| 同目錄`saved-proof-command.json`，813 bytes | `0e4ddc870030d7920b645aa3f5a62b9c9a5c8271e5b02c5892e770342a56e14c` |
| 同目錄`saved-guard-command.json`，557 bytes | `2d13e298f8bded730cf21a25a91094bc90162d5f074848daf31ad85d53f46fde` |

本次只執行`Get-Location`、`Get-Content`、`Get-ChildItem`、`Test-Path`、`rg`與Node `readFileSync`／`existsSync`／SHA重算；沒有執行任何現有測試腳本或服務命令。Node讀verification並按`result`欄重算的實際stdout為`total:50, yes:44`及6個no；去重的46個check evidence路徑實際stdout為`{"checkEvidenceFiles":46,"missing":[]}`，exit0。

最初直接輸出整個交接／verification造成工具截斷，未據截斷文字判定全部已讀；改以最新8881段、check的精確result及每份收據定向讀取。一次誤用`followup-20261024/font/REPORT.md`（正確為`fonts/REPORT.md`）使該混合只讀命令exit1；隨後讀正確實檔exit0，沒有把不存在路徑當成沒有字型證據。原工具失敗不代表網站故障。

本審核唯一寫入物為本檔。現在停止，不啟新測試、研究、產品修改或派工；保留8881供使用者體驗。
