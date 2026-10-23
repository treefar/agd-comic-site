# 首頁同格節日試玩實作（2026-10-23）

source_agent: codex。僅修改chapters-1.jsx、holiday-home.jsx、holiday-home.css；未build、push、刪檔、改main/C或勞動節原檔。其他代理同時作業，未覆寫別人修改。

## 交付

原上方獨立節日區移入同一個Hero Panel。桌機左主標、右既有節日CG＋選擇／試玩，底部保留三條原系所亮點連結；手機改為同格自然上下排，沒有另加上方大卡。保留看系上消息、原彩蛋與三語資訊。Hero只選14款非勞動節作品；原全列表仍保留。

CG輕微浮動沿用既有圖像的transform，減少動態時停止。按鈕與選單底圖都沿用既有Codex生成素材的九宮格，未程序生成新UI、美術或字型。

開啟modal才建iframe、載遊戲及音效。背景body兄弟元素保留原inert狀態後暫設inert；關閉還原原inert與overflow並回試玩按鈕。same-origin iframe首尾Tab／ShiftTab與外層關閉鍵形成循環，Esc／origin+source正確訊息可關閉。

## 實際驗證

| 項目 | yes/no | 命令／結果 |
|---|---|---|
| 修改前真RED | yes | node holiday-lab/reports/hero-release-20261023/implementation/hero-check.cjs before → exit1，festival belongs inside original Hero panel，0 !== 1；before/result.json與PNG保留 |
| JSX語法 | yes | esbuild.transformSync兩個JSX → JSX_PARSE 2/2 PASS，未執行產品build |
| 新01三語320／390／1440 | yes | HERO_QA_URL=http://127.0.0.1:8861 node holiday-lab/reports/hero-release-20261023/implementation/hero-check.cjs after01 → HERO pass 9/9，exit0；9PNG與result.json |
| 結構／未點擊資源 | yes | 唯一festival-preview在原tier-splash/Panel內、14選項且labor0；點前無iframe/games/audio請求 |
| 互動 | yes | 逐組選清明→開關→背景inert／還原→Esc關閉→焦點回festival-start；pageerror0、橫向溢位0 |
| 代理目視 | yes，僅代理檢查 | 已看ZH1440、JA320 viewport PNG，同格完整可讀，資訊未壓框。不是使用者美術確認 |
| 獨立驗收／完整發布gate | no，本報告不冒稱 | 另由獨立代理與root負責，本實作探針不代替發布UI完整合約 |

各產品來源SHA見source-receipts.json。測試使用root統一建置的01，未自行改凍結版或重建。
