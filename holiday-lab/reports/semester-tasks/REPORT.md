# 新生第一張地圖：先選事情，再找窗口（2026-10-23）

分支 `codex/semester-tasks`，獨立工作樹 `C:/agywork/agd-semester-tasks`，由主代理 `e731c4d` 建立。所有權只含 `games/semester.mjs`、`semester*.test.mjs` 與本報告目錄。共用 renderer／CSS／qa／指南資料未修改；只做測量 build，沒有打包交付。

## 實際玩法

| 幕 | 學生先選的事情 | 可諮詢／程序窗口 | 這幕新增的判斷 |
|---|---|---|---|
| 1 | 核對必修缺項 | 系辦或註冊課務組 | 先說要問什麼；走到座標本身不能完成 |
| 2 | 選課紀錄疑問 | 紀錄維護的程序窗口：註冊課務組 | 到課不等於選到；授課教室不能代替系統紀錄維護 |
| 3 | 畢業缺項諮詢、抵免程序詢問 | 畢業缺項可先問系辦或註冊課務組；抵免程序疑問洽註冊課務組 | 玩家實際選哪件先問，可先畢業再抵免，也可反過來 |

每件事都必須「選任務 → 選窗口 → 自己移動到該站 → 到站詢問」。未選事情、未選窗口、尚未到站、窗口不符，各有不同原因與下一步。錯站會保留任務、所選窗口及位置，讓玩家修正；繞路與探索不扣分。

第三幕自由安排的是兩件獨立諮詢的先後，不是讓玩家改動正式抵免審核順序。畫面與結果均寫明：虛構漫畫示意圖，非真實校園導航；到站只是諮詢，不代表選課、抵免或畢業核准。

三幕共四次諮詢；第三幕完成第一件時仍是 2/3，第二件完成才到 3/3。artifact 記錄任務、窗口、到站步數、來源 ID、完整路線與 `thirdActOrder`。回放有四鏡，按實際路線播放人物位移，不用固定三個目的地假裝玩家路徑。

## 來源逐筆核對與限制

先逐筆讀本機 `data/students/guide.json` 的 15 張卡、各自 contact 與 source_ids，再完整閱讀選課、抵免、畢業及專題卡的步驟與來源限制。全 15 筆本機對照留在 `guide-contact-audit.json`；只有本次使用的三張卡重新做官方網路交叉核對，沒有宣稱全 15 張卡都重新取得即時官網全文。

| 遊戲任務 | 真指南卡 ID | 已核對的官方依據 |
|---|---|---|
| 必修缺項／選課紀錄 | `course-selection` | [教務處 FAQs](https://www.aca.stu.edu.tw/常見問題｜qa/) 的選課紀錄與諮詢窗口；[組織分工](https://www.aca.stu.edu.tw/組織簡介｜introduction-2/) 的選課維護責任 |
| 畢業缺項諮詢 | `graduation` | 同一 FAQs 的修課缺項諮詢，以及指南本卡系辦／註冊課務組聯絡欄位；沒有把系辦諮詢寫成核准 |
| 抵免程序詢問 | `credit-transfer` | [115-1 官方抵免公告](https://www.stu.edu.tw/latestnews-single/?id=233794) 的程序疑問窗口；[註冊課務組服務索引](https://www.aca.stu.edu.tw/服務對象-services/) 列抵免服務 |

以上官方搜尋索引文字可讀；直接開啟三個 aca 頁面均為 403，未宣稱讀到即時全文。115-1 抵免期已結束，不把歷史公告當作仍受理。遊戲不列當期受理日、承辦人名或資格結論，僅訓練找窗口，實際規定再看指南與承辦。查核方式與未採用項目留在 `official-sources.json`。

設備借用沒有可核對的指南卡與窗口；專題現行內嵌表單／辦法也未核實，因此兩項都未硬編進遊戲。搜尋結果出現的其他大學資料一律未採用。

## 真指南連結

既有路由只支援 `#/students/guide`，不支援直接跳到卡片；本輪不改共用指南。遊戲提供真實同語言網址、對應卡名與「頁內搜尋」說明。測試真的點連結開頁，使用遊戲提供的搜尋詞輸入學生搜尋框，展開該卡，再讀取窗口，沒有用 HTTP 200 當驗證。

| 中文卡名 | 英文卡名 | 日文卡名 |
|---|---|---|
| 選課加退選 | Course Selection and Add/Drop | 履修登録・修正（科目追加・取り消し） |
| 畢業檢核 | Graduation Audit | 卒業要件の確認 |
| 學分抵免 | Credit Waiver and Transfer | 単位認定・免除 |

第一版遊戲英文卡名曾用泛稱，首次瀏覽器腳本讀指南標題再輸入，沒有抓到提示用詞可能不一致。已改為逐筆對上現有三語字典，新增純回歸測試；瀏覽器也改成只輸入遊戲本身顯示的詞，再建立 fresh02 全部重跑。第一輪結果另存 `run01/`，不可拿它替代最後版本。

## 兩條不同有效路線

| 作品 | 第1幕 | 第2幕 | 第3幕先後與窗口 |
|---|---|---|---|
| A | 必修缺項 → 系辦 | 選課紀錄 → 註冊課務組 | 畢業缺項 → 系辦，再抵免程序 → 註冊課務組 |
| B | 必修缺項 → 註冊課務組 | 選課紀錄 → 註冊課務組 | 抵免程序 → 註冊課務組，再畢業缺項 → 系辦 |

兩套使用不同諮詢先後及人物路線；不只是替同一座標結果換標籤。純測試另確認畢業缺項先到註冊課務組也可諮詢。

## 10 組代表輸出

```text
node holiday-lab/reports/semester-tasks/ten-combinations.mjs
course-plan -> department: YES ok
course-plan -> academic: YES ok
course-record -> classroom: NO wrong-window
course-record -> academic: YES ok
graduation -> department: YES ok
graduation -> academic: YES ok
credit -> academic: YES ok
credit -> department: NO wrong-window
credit -> classroom: NO wrong-window
no-task -> department: NO choose-task
```

離開碼 0，6 YES／4 NO；逐組讀過任務語意與窗口，完整輸入／狀態在 `ten-combinations.json`。

## Red／green 與 build

```text
node --test holiday-lab/tests/semester-tasks.test.mjs
✖ coordinates alone cannot complete an errand without choosing a task and contact
✖ the old three coordinate recipe cannot produce a completed creation
tests 2 / pass 0 / fail 2 / exit 1
```

先對舊模組實跑的 red，完整 assertion 留在 `red.txt`，不是只因缺 export 失敗。

```text
node --test holiday-lab/tests/semester*.test.mjs
tests 14 / pass 14 / fail 0 / exit 0

node --check holiday-lab/games/semester.mjs
exit 0

node holiday-lab/build-review.mjs .measure-semester-tasks-02 --measurement
MEASUREMENT ONLY: test build for layout capture; not cleared for packaging or delivery.
ui-policy pass=true, assets=257, screens=9, errors=[]
MEASUREMENT_ONLY: .measure-semester-tasks-02; 356 files; no publication performed.
exit 0
```

完整綠燈項目為 `green.txt`；測量輸出為 `build02.txt`。建置有原有 JSX duplicate color key 警告，未擅改該處。沒有執行打包或繞過交付 layout gate。

## 最後 DOM 驗證

```text
node holiday-lab/reports/semester-tasks/browser-test.cjs
YES zh-320: task/contact/travel, order=credit>graduation, guides=3, replay=4, retry, muted
YES zh-1440: task/contact/travel, order=graduation>credit, guides=3, replay=4, retry, muted
YES en-320: task/contact/travel, order=credit>graduation, guides=3, replay=4, retry, muted
YES en-1440: task/contact/travel, order=graduation>credit, guides=3, replay=4, retry, muted
YES ja-320: task/contact/travel, order=credit>graduation, guides=3, replay=4, retry, muted
YES ja-1440: task/contact/travel, order=graduation>credit, guides=3, replay=4, retry, muted
YES en-keyboard: task/contact/travel, order=credit>graduation, guides=3, replay=4, retry, muted
YES ja-reduced: task/contact/travel, order=graduation>credit, guides=3, replay=4, retry, muted
TOTAL 8/8; errors=0
exit 0
```

完整 `browser.json` 保留每組來源、24 次真指南開啟／搜尋／展開後的卡名與 contact、8 次試辦紀錄、實際路線與四鏡 caption。所有 query 都等於遊戲提供的詞，且實際找到同名標題；沒有用測試器讀到的正確卡名代填。操作均使用 DOM，不匯入規則、不注入狀態、不 teleport、不呼叫 complete。已知 fixtures 的代理操作不等同真人盲測。

| 驗收項目 | yes／no | 實際證據 |
|---|---|---|
| 先選事情、判斷窗口，到座標本身不能通關 | yes | 舊模組 red 0/2、新模組 green 14/14，DOM 無任務時被擋 |
| 第2幕有教室／紀錄維護的因果干擾 | yes | 每組刻意選教室並到站，收到具體原因及程序窗口／準備資料提示 |
| 兩種有效先後與不同窗口路線 | yes | A/B 的 `thirdActOrder`、visits、route 及回放不同；`distinctRoutesAndOrders=true` |
| 不自行重訂校務流程、不把到站當核准 | yes | 幕3及虛構標示明講獨立諮詢、非正式審核順序；artifact consultationOnly=true |
| 真指南連結、真輸入遊戲卡名、找到承辦欄位 | yes | 全八組各三卡，共24次；JSON 保存 query／heading／contact／URL，三語逐筆相同 |
| 三語 320／1440、觸控、鍵盤與減少動態 | yes | 8/8，en-keyboard 從遊戲到指南以 Tab／Enter／文字輸入操作，指南 summary 亦用真 Tab，無程式 focus |
| 回放按真實順序與路線動起來 | yes | 模型逐段驗 frames 終點；DOM 看四個真鏡頭及 caption 順序，正常動態兩個時間樣本位置不同 |
| 探索不暗扣分、重試乾淨、靜音可玩 | yes | 各組4次失敗＋4次成功，attempts=8、score=100；重試位置(0,2)、0/3；Audio.play=0 |
| Console／page error、缺圖、水平溢出 | yes（無上述錯誤） | 全八組空錯誤陣列、圖片已載入、scrollWidth檢查；不把它等同文字安全區通過 |
| 圖面已實際打開檢查 | yes | 實看 zh320第三幕、zh1440舞台、en1440錯教室、ja320第三幕；有原學生角色與舊生成建築，不新增程序畫面 |
| 真實墨跡／安全區 layout gate | no | 新文字與 choice 尚待主代理 collector；此輪未打包、不造報告 |
| 全15卡即時官網全文重新核實 | no | 全15卡是本機逐筆來源窗口審核；使用的三卡做官方索引交叉查核，直接全文有限制 |
| 真人學生理解、30–90秒體驗、使用者美術確認 | no | 未進行真人學生測試，也沒有使用者於對話確認 |
| 合併後全15款矩陣與 P1-03 整體結案 | no | 本工單只驗本款；三款代表玩法程式落地仍需整合與真人理解驗證 |

本次 headless Chromium `151.0.7922.34`。served 模組開始與結束 SHA-256 相同：

```text
569a7a6fcb81bf267cdfdac579f741d6ebb41263e7cddbd4c4d59347e5686c9b
```

真指南 JSON 的 served SHA-256：`81595129ae609d1913c4562500955a6ff1601782cf4fe11368ee5bcc9e3239fc`。同時保存實際讀取的 en／ja 字典與各張原素材 SHA；Git checkout 換行若有轉換，主代理以合併後 served 位元組重新建立收據。

## 整合與界線

- 新節點：`semester-brief`、`semester-task-0/1/2`、`semester-window`、`semester-plan`、`semester-guide-note`、`semester-guide`。第三幕 choice index 0 是畢業、1 是抵免；窗口 index 0 系辦、1 註冊課務組、2 授課教室。
- collector 需重新採第一幕／第二幕／第三幕兩種先後、錯站長提示、三語指南卡名與窗口按鈕；遊戲畫面實看不取代實際 ink／safe region 閘門。
- 主代理既有 qa 座標 recipe 須改為上表真實任務與窗口選擇，否則會被擋。此工單未修改共用 qa。
- 本輪只 transform 舊 generated map／角色／建築及既有 UI，沒有新增或重繪像素、圖示、面板。`source-receipt.json` 保存來源與各張既有素材 SHA。
- 測量 build 在獨立工作樹改出 `locale-en.js`、`locale-ja.js`、`latest-build.json`，不納入提交，不還原、不刪除。
- 新文字安全區、整合後全款矩陣、真人學生理解與使用者美術確認仍待主代理後續驗收；三款代表玩法迭代落地不等於 P1-03 整體已結案。

沒有啟動 Unity、push、main 操作、刪檔或接管其他伺服器。
