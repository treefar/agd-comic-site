# 2026-10-23 本機整合階段紀錄

source_agent: codex。分支 codex/holiday-prototypes；維持不 push、不發布、不碰 main、不刪檔，原交接C節不改。

目前使用者的8800仍服務 `.review-local-09`。這輪 `.measure-layout-07` / 8819 是內部量測版，不能當成已通過的新試玩包；既有local09 ZIP保留。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 跨年從唯一配時改為三幕意圖 | yes | new-year-choice/REPORT.md；root合併並15項純測試通過。新版08組三語320/1440、鍵盤、減少動態完整DOM回歸8/8，來源與結果JSON在integration-2026-10-22T16-24-21-177Z。 |
| 年獸從唯一表情改為兩種拜年意圖 | yes | lunar-expression/REPORT.md；root合併、16項純測試通過。原審查誇張組可通過，探索不扣分；root新06真DOM8/8、三鏡回放。integration-2026-10-22T16-24-21-193Z。 |
| 整合測試抓得到舊解法失效 | yes | lunar-expression/integration-red-root.txt：舊第三幕0/1；修新fixture後首輪7/8，鍵盤helper把所有range誤當80..700/step10，改讀各實際min/max/step後8/8；失敗run全部保留。不是降低產品判準。 |
| 字幕最大設定不再裁掉完整文字 | yes（限定小批） | constitution-draft.test.mjs原3 fail→8 pass；超出幾何時完整草稿放在控制紙面，真設定明示、字至少16px；幾何可放時低對比／短時間試驗仍可見。layout-qa/PHASE-REPORT.md及後續原case複驗。 |
| 作品JSON捲動不再進紙框 | yes（限定小批） | 外層生成紙框負責padding、內層pre捲動；06原constitution zh320 33frames geometry0，562/562字可達、missing0。沒有放寬紙面內框。 |
| 操作區捲動不再進紙框 | yes（限定小批） | 07改外層controls-paper保留原生成紙框、內層原game-controls捲動；new-year ja1440 launch原框邊紅轉31frames geometry0。180ms短鏡頭真9shot同ID截圖，不freeze/seek。全14款矩陣另由代理續跑。 |
| 新字幕英文／日文仍能真正通關 | yes | followup/caption-browser/2026-10-22T16-23-18-586Z：zh1440/en390/ja390三組完整預覽、實際三行文案回放、重試全pass；是06，不冒稱07整包。 |
| 30組FAQ日英語義與編譯後值覆蓋 | yes | verify-all-faq.cjs → `FAQ_SEMANTIC_AND_COMPILED 30 pairs / 120 strings PASS`；兩批實際逐句審閱聯集與canonical 30組完全對應，不是字典鍵存在性計數。 |
| 剩餘18FAQ已套修正 | yes | faq-remainder/applied-root.json：17操作／2檔；10固定基準回歸pass；線上預約不誤成遠距諮商、抵實習不誤成免除、碩甄不擅加推薦。 |
| 四項115招生原文修正與三語完整資訊可見 | yes | selection-eligibility：正式簡章與FAQ交叉核對，保留普通科跨選25學分／450小時例外、綜高25學分時點與校系限制。原a.content未呈現：8817三語真紅→新增AdmissionDetail紙格→8818六案例真可見。名額／日期／其餘既有資料由精確例外基準測試保護。 |
| 新17FAQ＋資格段字型／窄版 | yes（限定新句） | rendered-delta/REPORT.md：40/40實際DOM、1844逐字組missing0 unknown0、頁面／Range框無溢位，11 runtime檔測前後SHA相同。沒有換字型，非全站墨跡／特效遮擋驗收。 |
| 師資文案審校與套用 | yes；新畫面待驗 | faculty-copy：13位349來源葉欄位（276語義＋73年）、698目標值逐欄審校；9操作已套，8生效＋1原已正確MTA raw同步；root10tests pass。236含專名欄的正式名稱未核定、六筆碩士類型未擅改。faculty-rendered代理正在07複驗。 |
| 整合Node檢查 | yes（此階段來源） | `node --test tests/*.test.cjs holiday-lab/tests/*.test.mjs holiday-lab/tests/layout-sampler*.test.cjs` → 163 pass/0 fail，node-tests-20261023-fixed.txt。初跑162/163：舊production整檔hash不容許已核定招生改文；改成固定原始hash＋逐欄核定例外，不略過名額／日期保護。 |
| 狀態儀表板已依目前模組收據重產 | yes | dashboard/refresh-20261023.txt：23/23，15模組有符合目前SHA的功能通關證據，0使用者確認；歷史外框56yes/1未驗另標，不稱最新整包。真瀏覽器搜尋／篩選／展開、1440淺色／390深色2/2。首輪probe誤擷取json fenced block的空結果保留，修抽取器後重跑。 |
| 完整2076必要案例與出包閘門 | no | 本輪官方ui-layout-policy exit1，reports/layout-gate-20261023.json；來源未freeze／必要案例缺漏與測試用負例仍在診斷報告。2351條不是2351產品bug。phase矩陣正在分款跑，不能以小批幾何0代替全量通過。 |
| 新生任務圖已整合 | no | 子代理d6402fa已交14pure/8DOM/24次真指南搜尋；root讀完方案，待補窗口三語名稱一致性後合併並整合複驗；不把代理分支成果冒稱已在07。 |
| 兩款TF-BASE WebGL | no | 2026-10-23實查Drive仍僅5份工單／背景測試文件，尚無原始專案或建置回件。未重送舊queue、未開Unity視窗、未更動遠端權限。 |

目前仍有其他新聞／作品／實驗室長文待語義審閱；上述FAQ和師資批次不代表全站字串均核定。代理的已知解通關也不等於真人學生理解、好玩程度或使用者美術確認。

下一步先回收semester窗口名修正與07師資畫面，再完成14款phase矩陣及真錯誤修補；最後補整份必要案例並通過官方閘門才產新試玩檔。原C節及線上既有英文更新保持。
