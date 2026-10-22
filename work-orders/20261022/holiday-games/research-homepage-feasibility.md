# 節日首頁小遊戲：現有程式可行性研究

查閱：2026-10-22（Asia/Taipei）。來源代理：Codex／homepage_feasibility。只讀程式研究，沒有實作、Build、執行遊戲或啟動服務；唯一寫入本研究檔。以下「目前」為實讀結果，「建議」是尚待設計及實作的方案。

## 結論

可以做成首頁節慶特刊：保留AGD識別、導航與招生入口，在原Hero主格內增加節日插畫及「玩一局」按鈕。只有點擊後才建立遊戲iframe；關閉時卸載，回到原首頁。整合成本以新增一個受控節日元件、排程資料與獨立遊戲包為主，不必把整條舊試玩分支合回來。

目前三語審閱工作樹沒有節日排程、活動遊戲路由或遊戲容器。舊試玩clone有點擊載入iframe的模式可參考，但不能視為已完成三語、可及性、暫停、音效或發布隔離。

最重要的發布界線：**畫面藏起來不等於遊戲沒上線**。現有Build會複製未排除的根目錄，並保留舊dist。未來必須用明確的發行資源白名單及負向檔案驗證，不能只靠preview旗標。

## 實讀基準與差異

| 工作樹 | 實際分支／提交 | 本次角色 |
|---|---|---|
| C:/agywork/agd-student-guide-preview | codex/ja-comic-integration；ee0e25168455c66a68c38a9a69541379eaaa0f92 | 三語官網、指南與未來節日入口的研究基底 |
| C:/agywork/agd-site-codex | codex/remove-acting-chair-local；d5950cd42d4258090bc0c90e21550b068cf241c2 | 保留舊中英試玩區與既有遊戲的獨立clone，只讀參考 |

兩者版本及能力不同，不能用舊clone描述目前三語首頁，也不能整條合併舊clone來取得iframe。

## 可以沿用什麼、目前缺什麼

| 項目 | 實際程式與位置 | 可以沿用 | 目前缺口／注意 |
|---|---|---|---|
| 首頁主格 | [chapters-1.jsx:6](C:/agywork/agd-student-guide-preview/chapters-1.jsx:6)；主格12–20、主標31–48、既有PRESS START 79–91 | HeroChapter、Panel、網點與集中線；可把當期節日視覺放在此處 | Hero目前是固定JSX，沒有日期判定或節慶manifest。原PRESS START跳#news，不能直接改成遊戲而使原功能消失 |
| 首頁結構 | [app.jsx:164](C:/agywork/agd-student-guide-preview/app.jsx:164)；166–178依序導航、全域特效與各章 | 在Hero內或Hero旁插入節日入口，不需重排師資、作品、招生 | 詳情頁與首頁分開，不宜讓遊戲狀態擠占全站路由 |
| 導航及招生 | [comic-components.jsx:416](C:/agywork/agd-student-guide-preview/comic-components.jsx:416)；423招生、424指南、440品牌 | 既有導航、固定品牌、招生與指南 | 節日元件不應遮住導覽、改AGD為Google式字樣，或讓學生被迫遊玩後才能找資料 |
| 三語 | [en-pages.jsx:11](C:/agywork/agd-student-guide-preview/en-pages.jsx:11)；11–20語言與URL、27–51原生DOM文字／屬性翻譯；TopNav 456–459切換 | zh/en/ja共用UI、保留目前路由的語言連結 | iframe是獨立文件，不能期待父頁renderer自動翻譯遊戲。需明傳lang，遊戲內各語言另驗；新增活動標題、alt、aria-label及結算也要進字典 |
| 路由 | [pages.jsx:6](C:/agywork/agd-student-guide-preview/pages.jsx:6)解析#/type/slug；[pages.jsx:2389](C:/agywork/agd-student-guide-preview/pages.jsx:2389)分派 | 未來可新增獨立活動回顧路由 | 目前DetailView沒有holiday或play分派；新增路由屬新功能，不能稱現成 |
| 點擊特效 | [comic-components.jsx:212](C:/agywork/agd-student-guide-preview/comic-components.jsx:212)；217減少動態、222–227略過button/link/summary/data-no-fx | 節日開始／關閉按鈕可沿用免干擾規則 | 父頁的reduce判斷不會自動控制iframe內震動或粒子；遊戲必須另行遵守。iframe外若有點擊區，應明確data-no-fx避免重複反饋 |
| 舊試玩載入 | [en-pages.jsx:387](C:/agywork/agd-site-codex/en-pages.jsx:387) PlayCard；396–403 active才mount iframe；406關閉；411待機海報；449–470單一active ID | 「點才載入、關掉卸載、同時一款」狀態模式 | 只中英，直接取srcEn／src；未見此容器提供Esc、焦點回復、遊戲暫停訊息、錯誤重試、sandbox或三語契約。iframe allow含autoplay/fullscreen/gamepad，不應無條件複製全部權限 |
| 既有遊戲隔離 | [tests/en-release.test.cjs:3](C:/agywork/agd-student-guide-preview/tests/en-release.test.cjs:3) | 現有測試明確禁止play/、data/play.json、PlayZone/PlayCard及其dist輸出 | 新節日遊戲未來只能另列授權範圍，不能為方便而移除整條「既有遊戲不發布」保障 |
| Build | [scripts/build.mjs:18](C:/agywork/agd-student-guide-preview/scripts/build.mjs:18)固定SOURCES；22–26排除清單；48–51保留dist；106–109複製其他根目錄 | 沿用npm/esbuild、來源次序與現有首頁檢查 | 未來新增JSX須同步index.html script與SOURCES；未排除的holiday遊戲或work-orders資料夾會被複製。release檔案策略需先補強 |
| 本機預覽 | [scripts/serve-student-preview.cjs:2](C:/agywork/agd-student-guide-preview/scripts/serve-student-preview.cjs:2)；4只listen 127.0.0.1 | 現有dist伺服器可供本機審閱 | 此研究沒有重啟服務。別把127.0.0.1連結當對外公開或手機跨裝置可用網址 |

### 特別注意：舊註解不等於有效的preview隔離

[pages.jsx:1863](C:/agywork/agd-student-guide-preview/pages.jsx:1863)的isPreviewNew實際直接return true；[pages.jsx:1871](C:/agywork/agd-student-guide-preview/pages.jsx:1871)的isPreviewQuiz也直接return true。雖然附近註解仍提?preview=new，不能照抄後宣稱「只有本機可見」。這些是先前已獲授權公開的招生／測驗，不是新節日遊戲的安全閘門。

## 建議的首頁體驗（尚未實作）

1. 非節日：沿用現有首頁，主要內容不變；可在不影響招生的位置提供「節日回顧」入口。
2. 節日期間：主格出現當期原創插畫、節名及一個開始按鈕；不用打開頁面就播放音樂或啟動遊戲。AGD品牌、原「繼續看系上」及招生導航保留。
3. 點擊開始：開啟可關閉的遊戲區，才mount該活動iframe並載入其資源；父頁GlobalClickFx不加入遊戲畫面。聲音預設關閉，由玩家選擇。
4. 遊玩中：有清楚的離開／關閉按鈕，不用碰難發現的彩蛋才進入。切換分頁、關閉或換語言時，遊戲暫停或卸載，不繼續吃資源／出聲。
5. 關閉：卸載iframe、停止該遊戲音訊與計時，焦點回到開始按鈕，回到原瀏覽位置；不強迫填資料或分享。
6. 過期：自動恢復正常Hero；回顧頁明示年份、原活動期間與適用語言，不把過去的活動當今日節慶。

若要全螢幕，另提供明確按鈕；本研究不假定手機一定接受全螢幕。單指與鍵盤均應有對應操作，不依賴hover、拖曳精度或雙手。

### SSR／日期邊界

[app.jsx:225](C:/agywork/agd-student-guide-preview/app.jsx:225)會對中文預渲染首頁hydrate；[scripts/build.mjs:42](C:/agywork/agd-student-guide-preview/scripts/build.mjs:42)的SSR window只含最小location替身。因此未來不能在初次render直接依使用者的日期、網址參數或localStorage換另一套Hero，否則可能與預渲染HTML不一致。

建議SSR先提供不含遊戲iframe的中性Hero／節日預留容器，掛載後選擇活動；避免阻擋主內容與明顯版面跳動。排程每筆明列Asia/Taipei起訖，結束採不包含終點的區間，並測23:59:59→00:00:00、年度切換、背景分頁回來及裝置時區不在台灣的情況。這是未來驗收要求，不是現有程式已具備。

## 建議排程資料（規格例，非實際節日日期）

```json
{
  "schemaVersion": 1,
  "timezone": "Asia/Taipei",
  "calendarYear": 2027,
  "events": [
    {
      "id": "original-festival-project",
      "calendarLabel": "實際節日另依政府來源填入",
      "calendarDate": null,
      "isPublicHoliday": null,
      "governmentClosureDates": [],
      "schoolClosureDates": [],
      "displayFrom": null,
      "displayUntilExclusive": null,
      "priority": 10,
      "reviewState": "draft",
      "publishState": "local_only",
      "gameId": "original-game-id",
      "locales": ["zh", "en", "ja"],
      "poster": null,
      "gameEntry": null,
      "archiveAllowed": true,
      "sources": [],
      "lastVerifiedAt": null,
      "approvedAt": null
    }
  ]
}
```

- 節日日期、政府機關補假／連休、學校實際停課分欄；不把所有國際節日、傳統節日都標放假。
- 農曆節日逐年確認，不用固定西曆每年重複；未確認的日期、補假與來源用null，draft不進正式排程。
- 顯示期間是編輯決策，不等於法定假期。可預熱數日，但需另記理由；同日多活動用priority與人工覆核，避免一口氣換數個遊戲。
- reviewState與publishState分開；「企畫看過」不等於「可公開遊戲」。原創性、美術、三語及功能驗證也要分開記。
- preview可指定事件／測試日期，但正式Build必須排除這些強制開啟能力；不要把查詢參數當授權證明。
- 角色、UI、美術、聲音及程式授權另列manifest，不能沿用Google資源或以換皮冒充原創。

## 發布隔離建議（優先於遊戲擴充）

1. 開發分支及本機輸出與正式發行輸出分開；不合併舊feature或copy整個play目錄。
2. 新活動一個獨立ID、一份資源manifest；發布資料只列已獲主任對話授權的ID。遊戲程式不放進首頁共用bundle，使未點開始時不必下載。
3. 發行改以資源白名單組包，而非把根目錄整包複製。排除既有play/、data/play.json、研究工單與測試輸出；不能只把它們的入口藏起來。
4. 在「不刪檔」約束下，用全新的發行目錄與驗收清單，不清空舊dist；舊輸出留存，但不得將其中未列入本次manifest的舊檔搬進新發行包。
5. 之後如有新的公開授權，只從當時正式站最新基底選移新活動及必需介面；核對正式站既有資料／英文／招生更新，不回退到舊遊戲整合版。

## 未來yes／no驗收清單（本次沒有執行）

| 驗收題 | 判定證據 |
|---|---|
| 非活動期間是否顯示原首頁且沒有遊戲iframe？ | 虛擬日期測試、DOM及截圖 |
| 活動起訖是否以Asia/Taipei判斷，不受裝置時區影響？ | 至少三時區與前一秒／起點／終點各一秒的固定測試向量 |
| 活動期間是否保留招生、主導航及在校指南？ | 中英日桌機／手機實點，原入口與路由仍正確 |
| 點開始前是否完全未請求該遊戲JS／音效／場景？ | 清除快取後Network記錄，不只檢查iframe是否可見 |
| 一次是否只有一個遊戲實例？ | 連點開始、切活動、重開，iframe及計時器計數 |
| 關閉後是否停止聲音／運算並回復焦點及位置？ | 關閉、Esc、焦點及音訊／計時器觀察；不僅看面板消失 |
| 是否可用單指與鍵盤完成一局且避開首頁雙重特效？ | 真手機與鍵盤各完成一次；遊戲區父頁特效計數0 |
| 減少動態是否同時作用於父頁與遊戲？ | reduce模式下檢查震動、閃光、粒子及必要替代提示 |
| 三語是否含遊戲內文與結算，而不是只翻父頁？ | 每語逐一讀取遊戲DOM／可見文字與完成一局 |
| 遊戲載入失敗時是否還能關閉、重試、看招生？ | 模擬404／逾時及慢網路，不讓首頁永久鎖住 |
| 過期活動是否從首頁下架，回顧頁保留正確年份？ | 期間結束後的首頁及archive測試 |
| 正式包是否只含獲准活動，既有遊戲及工單不存在？ | 比對資源manifest；play/、data/play.json、未授權活動、work-orders等負向清單皆無 |
| 日曆／三語資料讀不到是否仍有完整官網可用？ | 失敗注入與console／原內容檢查 |
| 首頁與遊戲是否在320/390/768/1440px無文字裁切、頁面橫溢？ | 邊框／文字審查、DOM尺寸與目視截圖；另外真手機試用 |

效能可先提議「首頁不加遊戲執行包、只有海報與小量排程資料」作為硬界線；具體KB、載入秒數、FPS須以第一款實測後訂，不在研究階段捏造保證。

## 本次實際查閱輸出

```text
C:/agywork/agd-student-guide-preview
git branch --show-current → codex/ja-comic-integration
git rev-parse HEAD → ee0e25168455c66a68c38a9a69541379eaaa0f92
Test-Path data/play.json → False
Test-Path play → False

C:/agywork/agd-site-codex
git branch --show-current → codex/remove-acting-chair-local
git rev-parse HEAD → d5950cd42d4258090bc0c90e21550b068cf241c2
```

已實讀上述檔案與行號；未執行Build、測試、遊戲或網站發布。假期法律與日期、Google案例另由主控整合其他研究，不以本研究推定。
