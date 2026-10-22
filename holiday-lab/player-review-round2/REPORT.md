# 三款新版獨立代理試玩：08 凍結候選

2026-10-23（台灣），受測 `http://127.0.0.1:8820`，候選 `.measure-layout-08`，分支 `codex/holiday-prototypes`。執行者為 Codex 代理，沒有使用虛構學生身分。

結論：三款已呈現可見因果、不同意圖／順序的作品與回放；六件作品皆可在靜音下完成，探索失敗與繞路後仍是 100 分。可交付本機試玩。P1-03 的三款玩法改善已有代理觀察支持，真人學生理解與自主創作仍未驗證，不能據此宣稱整體結案或證明好玩。

## 資訊缺口與方法

- 角色指定四份文件 `docs/prompts/MASTER_PROMPT_zh-TW.md`、`docs/policies/priority-rules.md`、`docs/policies/output-contract.md`、`docs/reference/review-theory-map.md` 在本專案不存在，無法依未知契約補造格式。本報告採 P0–P3、影響、證據與 yes/no。
- 已讀 `webapp-testing/SKILL.md` 與探索證據方法。桌機 1365×900、無頭 Chromium、中文、預設靜音；不操作使用者 Chrome、8800、Unity 或既有工作頁。
- 第一階段沒有讀遊戲程式、既有答案／測試／開發報告；依中文 UI、原生方向鍵／按鈕／滑桿探索。沒有修改時鐘、遊戲狀態、React、complete 或隱藏值。
- 完成六件作品後，才搜尋原 P1-03 與春節規則，核對提示根因。`reproduce.cjs` 是探索後整理的已知路徑回歸，速度不能當學生盲測時間。最初的 Node REPL 工具變數錯誤與一個已關閉頁面重用只涉及自己的測試環境，已更正；不屬產品缺陷。
- `served-before.json`／`served-after.json` 保留 HTML、三款遊戲、runner、replay-model、catalog、CSS、guide 資料的 served SHA-256；僅存取 Buffer 計算指紋，第一階段未閱讀其內容。`verified-results.json` 記錄前後是否一致。

## 探索紀錄與實際差異

| 款式 | 看見 → 猜測 → 操作 → 回饋 | 兩件作品與因果證據 |
|---|---|---|
| 跨年 | UI 說騰空應短於前後；先試預設 350/350/350，完整試播後得到「像在慢慢飄」。改 80 再試得到「來不及看清」，試到 200 可進第二幕。過早按收下則提示完整試播，不消耗進度。 | A 第三幕享受騰空，350/700/350；B 期待起步，700/250/350。B 先保留350/600/350只換意圖，會要求起步更有份量，證明意圖改規則。回放各段停留與心情保留。`new-year-meaningful-failure.png`、`new-year-work-B-choice-failure.png`、`verified-new-year-*-replay-*.png`。 |
| 春節 | 依提示放大眼嘴、傾斜眉。+30 被說眉很平，改−30才接受；第二幕按提示把眼睛放鬆、眉回平、保留笑口。第三幕誇張喜劇要求大眼深鞠躬。 | A 誇張：眉0／眼1.5／嘴1／鞠躬40；B 含蓄：眉0／眼0.9／嘴0.3／鞠躬15。含蓄模式套用A參數會提示收回深鞠躬，並非換標籤就過。`lunar-work-B-choice-failure.png`、`verified-lunar-*-replay-*.png`。 |
| 開學 | 未選事情就問會被阻擋。第二幕真的走去授課教室問選課紀錄，提示「到課不等於選到」及課程代碼／問題畫面，改找註冊課務組才前進。 | A 第三幕先畢業缺項→系辦，再抵免→註冊課務組；B 反過來。詢問第一件只累積1/2，兩件都完成才結束；回放順序對調且保持「諮詢，非核准」。`semester-wrong-window.png`、`semester-work-B-first-consult.png`、`verified-semester-*-replay-*.png`。 |

第三幕的開學選擇屬諮詢路線／順序，沒有改變學校正式程序；兩個順序都能完成。這比真假選項有實際作品差異，但策略代價仍偏輕，不能解讀為深度分支。

遊戲提供「開啟在校指南｜選課加退選」後，實際點擊新分頁連到 `/?lang=zh#/students/guide`，依遊戲給的詞在「輸入問題或關鍵字」搜尋，看到對應「選課加退選」卡及正式課表／加選提醒。沒有先讀測試來補卡名。證據 `semester-guide-search-course.png` 與 `observation-log.json` 的 guideUrl／搜尋後內容。此處只驗連結與內容對應，沒有向外部學校系統送出申請。

## 優先問題

| 優先度 | 判斷與影響 | 重現與證據 | yes/no |
|---|---|---|---|
| P0 | 本次限定範圍未發現無法試玩的阻擋；未據此擴張為全站安全通過。 | 六作品結果與回放。 | 通關 yes |
| P1 | 原 P1-03「數值答案主導」在三款已改善：能依關係提示修正，同一第三幕參數不能直接換心情過關，開學順序進入作品。真人是否能自主理解、學會後再創作仍缺觀察。 | 六作品、`observation-log.json`、`verified-results.json`；探索後才讀原 `holiday-lab/player-review/REPORT.md:66`／`:120`。 | 三款代理改善 yes；P1-03整體結案 no |
| P2 | 春節驚喜眉毛方向提示不準確：+30明顯傾斜卻說「眉毛卻還很平」，玩家可能反覆加大同方向，形成猜隱藏答案。需要區分方向錯誤與近水平。 | 第一幕，眉+30／眼1.5／嘴1／鞠躬0，按拍攝得到上述提示；眉改−30、其餘不變即進第二幕。`lunar-brow-plus30-misleading.png`、`lunar-brow-minus30-before-submit.png`、`lunar-brow-minus30-accepted.png`。探索後源碼核對 `games/lunar-new-year.mjs:8` 接受眉≤−8，證實方向條件。 | 提示精確 no；原08紅燈保留 |
| P3 | 成長感以三幕練習和回放比較為主，尚未驗學習遷移、重玩動機或記憶保持。地圖按指令走路仍可能產生作業感。可用真人第二次不看提示重做、訪談選擇理由來判斷。 | 本輪只有代理操作，不能提供真人推論；第三幕兩順序的路線與回放僅證作品有別。 | 學習遷移證明 no |

## 可判定驗收

| 條件 | 結果 | 證據 |
|---|---|---|
| 三款各有初始、失敗與兩作品／回放 | yes | 初始 `*-initial.png`；失敗 `*-meaningful-failure.png`；全頁回歸 `verified-*-result.png`、`verified-*-replay-*.png` |
| 所有探索後作品仍100分，沒有暗扣分 | yes | 探索後六作品原始結果截圖；已知路徑六作品的 `verified-results.json` |
| 第三幕選擇改變規則／諮詢作品，而非只有標籤 | yes | 跨年與春節同參數換意圖失敗；開學兩個第三幕回放順序相反 |
| 真指南能從遊戲開啟並搜尋對應卡 | yes | `semester-guide-search-course.png`、`observation-log.json` |
| 新版served來源前後一致 | yes，`sourceStable:true` | 兩份SHA清單；執行腳本不一致會非0退出 |
| 真人學生／手機實機／英文日文母語／美術使用者確認 | no | 本輪未執行；不得以無頭代理代替 |
| 修改產品、push、發布、碰main、刪檔 | no | 只新增本資料夾檔案與證據commit |

可重跑：`node holiday-lab/player-review-round2/reproduce.cjs`（8820服務需仍在；可設 `REVIEW_BASE`）。只用可見UI，不匯入遊戲規則。原始探索紀錄與初版截圖保留，後來的回歸不覆蓋原08失敗結論。

實際回歸執行結果：離開碼0，`{"works":6,"sourceStable":true}`。跨年A回歸採騰空600毫秒，最初探索A採700毫秒，兩者皆通過；兩份證據分別保留，不冒稱參數完全相同。時間序列的 sample 是第幾次採樣，截圖與瀏覽器呼叫有耗時，不當成精確播放毫秒。未執行 Build、Lint、Unity Console，因本工單沒有產品程式變更；驗證內容為實際瀏覽器UI與served指紋。

藝術風格、商業授權／抄襲判斷未在此輪取得足夠來源，均未判通過；若要對外使用需人工確認。本輪沒有新增此類風險的具體指控。
