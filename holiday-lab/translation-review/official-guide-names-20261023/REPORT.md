# 正式名稱12筆：獨立本機實作

2026-10-23，工作樹 C:/agywork/agd-plain-guide-copy，分支 codex/official-guide-names，自5cc447aaa522d1599aa93bc2d409a213c4a7de5e開出。只替換10個英文生活輔導組名稱片段與2個日文台灣技術士資格名稱片段；前12保義修正及指南布局保留。

## 實際變更

| ID | 原名稱片段 | 新名稱片段 | source |
|---|---|---|---|
| EN-STUDENT-ASSISTANCE-01 | Student Assistance Division | Student Assistance Section | data/en/step-details-ui.json |
| EN-STUDENT-ASSISTANCE-02 | Student Life Guidance | Student Assistance Section | data/en/flow-ui.json |
| EN-STUDENT-ASSISTANCE-03 | Student Life Guidance | Student Assistance Section | data/en/flow-ui.json |
| EN-STUDENT-ASSISTANCE-04 | Student Assistance Division | Student Assistance Section | data/en/step-details-ui.json |
| EN-STUDENT-ASSISTANCE-05 | Student Assistance Division | Student Assistance Section | data/en/step-details-ui.json |
| EN-STUDENT-ASSISTANCE-06 | Student Life Guidance | Student Assistance Section | data/en/flow-ui.json |
| EN-STUDENT-ASSISTANCE-07 | Student Life Guidance Section | Student Assistance Section | data/en/student-guide-ui.json |
| EN-STUDENT-ASSISTANCE-08 | Student Life Guidance | Student Assistance Section | data/en/flow-ui.json |
| EN-STUDENT-ASSISTANCE-09 | Student Life Guidance | Student Assistance Section | data/en/flow-ui.json |
| EN-STUDENT-ASSISTANCE-10 | Student Assistance Division | Student Assistance Section | data/en/step-details-ui.json |
| JA-QUALIFICATION-NAME-01 | 技能士資格 | 「技術士證」（台湾の技能検定資格） | data/ja/messages.json |
| JA-QUALIFICATION-NAME-02 | 技能士資格 | 「技術士證」（台湾の技能検定資格） | data/ja/messages.json |

每筆完整pointer、原值、候選與name-only運算保存在plan.json；逐筆先核原值完全相同，且「原句只替換該一個名稱」恰等於核准候選，才改寫精確JSON property。四個資料檔保留原換行與其餘文字，沒有把資格、職種、年度、程序或時效一併改寫。四個PROGRAM值完全不動；維持並不表示原文已正確。

輸入原文與來源：[input-REPORT.md](input-REPORT.md)、[input-comparison.json](input-comparison.json)。英文名稱依原查證中的校方Student Assistance Section；日文採「技術士證」（台湾の技能検定資格）是台灣原名加描述，不宣稱查到正式日文名稱，也不等同日本技能士。此輪承接主控已審來源，不重複冒稱新的母語審查。

來源查證參照：[校方英文組織](https://en.sao.stu.edu.tw/organization/)、[生輔組職掌](https://life.sao.stu.edu.tw/en/單位介紹/組織與成員/)、[115四技二專技優簡章資格頁](https://www.jctv.ntut.edu.tw/downloads/115/skill/115_enter42_rule.pdf#page=11)。查證原報告有403／搜尋擷取等讀取界線，這裡不把它升格為各業務全文或資格重新審定。

## 逐條yes／no及實際輸出

指令共用前綴：node holiday-lab/translation-review/official-guide-names-20261023/command.cjs；cwd為此獨立工作樹。每個tag有實際command/stdout/stderr/exit_code JSON及-output.txt。

| 項目 | yes/no | 指令／stdout |
|---|---|---|
| 修改前有真失敗測試 | yes | names-red-v2 --test .../names.test.cjs → exit1，tests21/pass4/fail17；12筆名稱都仍舊值而失敗 |
| 僅套核准10英文＋2日文名稱 | yes | apply-v2 .../apply.cjs → exit0，APPLIED names12 EN10 JA2 in4 source files; exact name fragments only; PROGRAM4 unchanged |
| 語系字典用原生成器產生 | yes | generation .../generate.cjs → exit0，Translations:2315 / Japanese exact translations:2344；原生成器VM限寫兩locale，docs/qa輸出先導到新證據generation-audit/ |
| 精確12指標、其他keys與中文不變 | yes | names-green --test .../names.test.cjs → exit0，tests21/pass21/fail0；12筆逐值＋整個source object逐key核對 |
| 前12保義修正與4PROGRAM保留 | yes | 同21測試中，各source/locale逐值核；financial awards or subsidies保留 |
| 新phase覆蓋前後兩批 | yes | 從原plain-copy/preimage套前12及本12後，整個EN/JA字典逐key完全相同；EN共15變、JA共9變，總24值 |
| 舊snapshot在新階段仍全綠 | no，預期階段不適用 | legacy-snapshot --test .../plain-copy-20261023/copy.test.cjs → exit1，12pass/4fail；詳下節，不改舊測試 |
| fresh measurement建置成功 | yes | build03 holiday-lab/build-review.mjs .measure-official-guide-names-20261023-01 --measurement → exit0，360files，app-WGMMQQRX.js |
| 建置後新測試再次通過 | yes | names-postbuild --test .../names.test.cjs → exit0，21/21 |
| 舊02所有建置檔保持不變 | yes | freeze-v3-command .../freeze.cjs → exit0，old02immutable360；新build對比舊02有354檔逐byte相同 |
| 原dirty與本機指標完整保留 | yes | baseline.json保存6dirty起始SHA／原文，5檔原EOL或原內容保留；latest指標由build更新，latest-build-change.json列前後且不stage |
| 新版實際畫面／缺字／孤尾已獨立驗收 | no，待另一代理 | 本代理未啟瀏覽器或HTTP服務；不借舊8865收據宣稱新字串畫面已過 |
| 全站／遊戲／發布通過 | no，非本次範圍 | 只做名稱資料、字典和新measurement；無push/main/C/勞動/Unity/刪檔/生圖 |

## 舊snapshot為何失敗

舊測試前12語意案例仍12/12通過。其餘4個測試要求：原四source檔的未核准keys不變、EN字典只有前批5變、JA字典只有前批7變、其餘16候選仍原值；這些是前一階段範圍，本輪核准的12名稱正好從那16中落地，故4測試真失敗而不能拿舊綠燈套新版。

原plain-copy測試、01/02freeze、原收據均未改。新names.test.cjs保留同等逐key完整比較，另定新允許delta＝原12保義＋本12名稱；沒有把4PROGRAM納入可變。新RED/GREEN均是實跑，舊失敗stdout保存在legacy-snapshot.json及-output.txt。

## 證據與保留邊界

- 新freeze採freeze-v3.json（19來源、360build檔SHA）。最初freeze.json命名與命令wrapper收據同名，最後留下的是命令收據；已改用獨立新檔freeze-v3.json，請勿把freeze.json當manifest。
- names-red第一版把整本字典值差印得過大，保留names.test-v1.cjs.txt與names-red原輸出；v2改列完整差異keys，判定仍是所有keys/所有值完全相同。apply首次命令少路徑而MODULE_NOT_FOUND，未改產品，apply.json保留，apply-v2才實際套用。
- 此目錄.gitattributes指定-text保存input/preimage/raw收據位元組，避免Git CRLF轉換讓證據SHA不再吻合；未改產品換行政策。
- 搜尋另見EN步驟「若是復學、轉入…」、EN流程「依目前狀況選一項…」、JA招生「技優甄審不限…」仍有相似舊稱；它們不在核准12 pointer內，保持原值，不擅自增加替換。這是本次搜尋範圍的待查項，不宣稱全站完整清單。
- build本身重跑原語系生成器；git diff只出現白名單6產品檔及原latest-build可變指標，舊QA內容沒有新差異。生成器顯示Unpaired paths21與Static candidates26只是既有診斷，不當成21漏譯或本輪全部翻譯完成。

## 交接

新目錄：C:/agywork/agd-plain-guide-copy/.measure-official-guide-names-20261023-01；尚未啟服務，交主控及獨立代理安排。需要驗指南zh/en/ja代表畫面與日文招生兩值的實際呈現，特別關注名稱變長後的換行；不得動student-guide.css來預先湊驗收。

精確來源變更：[source-delta.json](source-delta.json)；建置差異：[build-delta.json](build-delta.json)；起始保全：[baseline.json](baseline.json)。原dirty六檔不納入提交；白名單提交只包含4資料＋2locale及本新報告目錄。精確提交與fsck結果補於COMMIT.md，獨立畫面結果由主控整合。
