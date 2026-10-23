# 學生作品首頁與策展示範（2026-10-23）

source_agent: codex。分支 `codex/hero-festival-review`，僅供本機審閱。

首頁以三件學生完整海報、作品名、創作者與指導教師為主視覺，手動切換，連到對應系網消息。節日試作收進「畫出來，動起來」同格的折疊入口，點擊才載遊戲。新增一款獨立「策展接力」互動示範：安排三個展位、附資訊卡、保持入口淨空。

作品來源逐筆核對 `data/news.json` id7140 的第04／05／06件，沒有裁拆海報、重繪學生角色、改人名或宣稱新增改編授權。首頁主視覺與入口不載節日生成插畫或生成UI背景；小型favicon仍沿用既有生成播放圖示，沒有宣稱全部素材零AI。學生作品本身的製作流程未逐件查證。

## 本機入口

- 首頁：<http://127.0.0.1:8863/>
- 策展示範：<http://127.0.0.1:8863/holiday-lab/student-curation.html?lang=zh>
- 進度：<http://127.0.0.1:8863/progress/>
- 原節日試作：<http://127.0.0.1:8863/holiday-lab/>

最新凍結建置 `.measure-student-hero-20261023-02`，360檔，bundle `app-KRCSVWHY.js`。8862是有手機孤尾的01版；8861是已撤換主視覺的舊生成CG候選，兩者保留作比較，不當最新入口。

重啟命令（工作目錄 `C:/agywork/agd-holiday-prototypes`）：

```text
node scripts/serve-local-review.cjs --site=.measure-student-hero-20261023-02 --dashboard=holiday-lab/dashboard/out --port=8863
```

## 逐條驗收與實際輸出

| 項目 | yes／no | 實際指令與結果 |
|---|---|---|
| 首頁同格整合與學生完整作品 | yes | `student-independent/run-v2.cjs`，`STUDENT_QA_URL=http://127.0.0.1:8863` → exit0；9/9首頁，三語×320／390／1440；逐筆完整海報、署名、手動切換與來源錨點核對 |
| 點擊前不載節日插畫、生成UI背景或遊戲 | yes | 同批九組 `beforeClickForbidden=[]`、`prePlayForbidden=[]`；14非勞動選項保留，無iframe／遊戲／audio預載 |
| 獨立策展示範操作 | yes | 同批9/9示範；入口、缺資訊、重疊必失敗；鍵盤可完成、切語言保留配置、重設可用；海報contain、署名完整 |
| 原玩法嵌入與可用性 | yes | 同批新年EN1440與清明JA320兩條完整通關及三段重播；Esc、跨iframe焦點、背景inert、關閉還原通過 |
| 字型穩定後的版面證據 | yes | v2共54份版面量測均 `fontStatus=loaded`；issues0、orphans0，47PNG；不是全字元實際fallback或實體手機認證 |
| 主控獨立重核 | yes | `root/verify-student-current.cjs .measure-student-hero-20261023-02 student-independent/runs/2026-10-23T09-48-25-302Z release-student/runs/2026-10-23T09-41-13-935Z`（目錄前綴為本報告目錄）→ pass=true；17個Hero來源與release同build SHA逐筆相符 |
| 正式本機建置 | yes | `node holiday-lab/build-review.mjs .measure-student-hero-20261023-02 --measurement` → exit0，360files；素材政策257assets／9screens；既有21個翻譯未配對路徑仍列明；沒有發布資格 |
| 網站章節與metadata保留 | yes | `root/check-site-build.cjs .measure-student-hero-20261023-02` → 8項true；八章節、SEO、viewport、favicon、bundle及本機CSS齊全 |
| 消息連結實際導向 | yes | `node holiday-lab/reports/hero-release-20261023/root/source-route-smoke.cjs` → `SOURCE_ROUTES 3/3 PASS`；中文三件來源可讀、圖與署名完整，捲到對應work錨點；不代表所有消息版面全驗 |
| 發布前技術補驗 | yes | `release-student/run.cjs --site=.measure-student-hero-20261023-02 --base=http://127.0.0.1:8863` → exit0，12yes／0no／1unknown；全360檔HTTP200與body SHA一致，來源前後不變 |
| 真背景分頁暫停 | no（未取得前提） | Headless Chrome兩分頁仍 `document.hidden=false`，保留unknown，未注入假旗標；鍵盤暫停與音效停止另有真操作通過 |
| 完整發布UI合約 | no | `ui-layout-policy.cjs --project .` 真exit1，完整原stdout在 `root/current-layout-policy.json`；正式R0仍為13案例先導與原負例，不覆寫或升格 |
| 使用者對畫面與玩法的確認 | no（待審） | 三題選項只確認方向，不等同使用者已看過並接受新畫面；其他遊戲美術不自行擴改 |

發布補驗13條各自yes／unknown及原stdout見 `release-student/REPORT.md`。包含本機綁定、私密路徑、真404、鍵盤、音效停止與卸載、減少動態、斷第三方網路、模組故障恢復。

## 失敗紀錄與修法

- 學生01獨立批 `09-35-46-407Z` 真exit1：首頁9/9、示範3/9；六個手機情境出現姓名或日文短文字孤尾。只修每姓名完整換行、勾選說明均衡換行、按鈕整顆換列，沒有縮字、刪人名或改原意。原RED與source-only RED→GREEN另留底。
- 學生02首次 `09-41-28-837Z` collector寫pass，但主控嚴格verify真exit1：11個換作品狀態 `fontStatus=loading`。該批不採認，原檔不改。另凍結v2方法，每次改文字後先觸發layout、等fonts.ready與loaded再量測，collector與readonly都要求loaded。
- 最後採認 `student-independent/runs/2026-10-23T09-48-25-302Z`。raw SHA256 `f0f201431cdc084410379424dca589f8f48ee4f653da98938493f5d3059731ea`；release raw SHA256 `895b215fcb9d15a7e0b293c5d606ac7bc83260511ec3be3a8a50aae9f8a307b6`。
- verifier負例另保留harness缺URL的真失敗；新 `verify-v3.test.cjs` 只補測試環境，12/12 pass、0skip，unchanged-harness正例也通過；不改產品、v2 verifier或原raw。

## 保留範圍與下一步

原holiday-lab 283個runtime檔與上一輪UI-polish03逐byte一致，包含勞動節原檔；新示範另增三個runtime，沒有把它算成舊14款美術全部完成。原84組驗收仍只限相同的舊lab來源，不能冒稱這輪整個首頁或完整發布通過。

固定08歷史覆蓋2046/2076、缺30不是新build完成率，也不是30個真畫面bug。24個非勞動最長動態字串證明、完整來源／墨跡義務、實體裝置、母語逐句與使用者美術審閱仍待處理。勞動節暫緩，C節不動，不續跑舊巨量工作。

下一輪第一件事：先看8863學生作品首頁與策展示範，回收具體畫面／操作意見，再決定是否擴大其他遊戲素材替換；沒有確認就不發布或自行改編學生作品。首頁小改版保留官網漫畫格、網點與原資訊，採完整作品而非大幅生成角色；更進一步的動態展示需有適合影格與使用範圍，不能拿海報硬拆動畫。

本輪未push／發布／碰main／刪檔／啟Unity；兩clone origin/main仍 `1b8322e69d84549db220d849afb1aac0fb9d7c2a`。C節SHA256 `95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680`；正式layout-report SHA不變。儀表板與本機保全結果在下面追加。

## 儀表板與最後核對

- `node holiday-lab/build-dashboard.mjs` → actual exit0，34/34 PASS；15工作列、13條發布補驗，摘要12/13按來源計算；全UI仍0/1、使用者確認0。主視覺方向已確認，畫面與單款示範仍待使用者審閱。
- 最初彙總Node測試實跑39項，38pass／1fail，exit1：唯一失敗為來源已更新而儀表板尚未重產。原stdout保留 `root/final-node-tests.json`；其中28項產品／驗收器測試通過。重產後只重跑受影響儀表板兩檔：11pass／0fail，exit0，見 `root/dashboard-tests-green.json`，沒有改測試掩蓋舊資料。
- `DASHBOARD_QA_URL=http://127.0.0.1:8863 node holiday-lab/dashboard/smoke.cjs` → `DASHBOARD_SMOKE 2/2 + OFFLINE PASS`，actual exit0；桌機淺色、手機深色、搜尋篩選、成果連結、離線來源檔、展開收合均有實測。來源與數字分層保持。
- `root/final-readonly-command.json` 保存最後主控CLI完整實際參數、exit0與原stdout；root/student-verification.json為其parsed結果。C節、兩個origin/main、283個舊lab檔與正式R0均核對不變。
- 交接同步至原clone `C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md`、本樹 `holiday-lab/STATUS.md` 與Vault專案紀錄。本輪不執行Vault整庫同步／push；本機提交不宣稱跨機備份。
- 本機保全前逐筆計算Git blob SHA：316個新證據／byte-bound產品檔與index完全相同；339個staged檔沒有layout-qa、勞動或翻譯待辦檔。`git diff --cached --check`（允許CRLF）exit0。原先其他未完成工作留在工作樹，沒有混入本次提交。
