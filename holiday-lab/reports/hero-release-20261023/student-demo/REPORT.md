# 學生作品策展接力：本機示範

2026-10-23。只新增獨立展示頁，不改原 exhibition 與其餘 14 款試作。三語頁面使用原生表單安排三件學生作品：每個展位一件、附作品與作者資訊、入口淨空。原始海報完整 contain，不裁圖；沒有新生成圖、角色、遊戲面板或音效。

入口：`holiday-lab/student-curation.html?lang=zh`；另有 `en`、`ja`。首頁與最終本機審閱 build 由主控整合，本代理沒有 build、push、改 main、刪檔、啟動 Unity 或操作勞動節／C 節。

## 來源

直接相對讀取 `../data/news.json`，既有消息 id 7140（slug `2026-04-29-awards-showcase`）共有七筆 gallery。選用原始 rank 04／05／06，回傳原 gallery 物件、保留原作品名與完整署名，沒有重新猜譯人名。

| 作品 | 作者 | 指導老師 | 完整介紹路由 |
| --- | --- | --- | --- |
| Dear, All Robots | 王愛吉 · 黃承義 · 梁潔美 · 林巧玲 · 馬聖淞 | 陳美蓉 | `#/news/2026-04-29-awards-showcase/work-04` |
| 喀嚓 | 吳立凡 · 張自祥 · 陶延娣 · 鄭羽軒 | 鄧樹遠 | `#/news/2026-04-29-awards-showcase/work-05` |
| 今食堂 | 許瑗玶 · 高樂怡 · 陳書凱 · 黎躒嬈 | 鄧樹遠 | `#/news/2026-04-29-awards-showcase/work-06` |

上述作品是既有系網消息素材；本輪沒有逐件查證學生製作流程是否使用 AI，也沒有新增改作／公開重用授權查證，不能宣稱「學生作品零 AI」或新授權完成。使用者此次明確選擇不用 AI 插畫、以學生作品展示為核心，因此本頁以文字排版、原生表單與原始完整海報組成，沒有另生成遊戲 UI 圖像。這些限制留在本報告，沒有在學生操作流程加入開發警語。

## 驗收

本輪先寫五項規則測試，實跑 RED：`node --test holiday-lab/tests/student-curation.test.mjs` → exit 1，`ERR_MODULE_NOT_FOUND`（runtime 尚未新增）。其後實作再重跑 GREEN，原始 stdout 現保存在同目錄 `stdout.txt`；可重算資料在 `checks.json`。

| 項目 | yes／no／待驗 | 實際指令與輸出 |
| --- | --- | --- |
| 選定三件與原 gallery 逐筆一致，完整署名且圖片存在 | yes | `node --test holiday-lab/tests/student-curation.test.mjs`：第一項測試通過 |
| 起始入口／重疊／缺資訊不能通關 | yes | 同上：第二項測試通過 |
| 三件不同展位＋全資訊可通關，回傳實際左右順序 | yes | 同上：第三項測試通過 |
| 六種排列均合法；少資訊或擋入口均失敗 | yes | 同上：第四項測試通過 |
| 編輯不修改原狀態、重設新狀態、無效輸入拒絕 | yes | 同上：第五項測試通過 |
| 全部純邏輯測試 | yes | 同上：`tests 5 / pass 5 / fail 0`，exit 0 |
| runtime 語法 | yes | `node --check holiday-lab/student-curation.mjs`：無輸出，exit 0 |
| 相對來源、contain、未引用新生成素材／外站字型／音效 | yes | `node holiday-lab/reports/hero-release-20261023/student-demo/verify.mjs`：`direct-source-full-poster-no-new-generated-assets: yes`，exit 0 |
| 最終 build、三語 320／390／1440 真實鍵盤與操作、來源路由 | 待獨立驗收 | 主控統一 build 後，由 `hero_independent_acceptance` 驗收。此項不能由純邏輯測試或 CSS 字串代替 |
| 使用者對畫面與策展玩法的接受 | 待使用者確認 | 工具驗證不代替使用者審閱 |

重算命令：

```text
node holiday-lab/reports/hero-release-20261023/student-demo/verify.mjs
```

## 獨立驗收操作契約

- `#placement-0/1/2`：原生 select，值為 `entrance,left,center,right`。
- `#info-0/1/2`：原生 checkbox。只把該作品的完整原始資訊標為已放上展位，不編造新作者。
- `#curation-check`、`#curation-reset`。起始配置 `entrance,left,left`，資訊全 false；直接檢查必有 `li[data-issue=entrance/overlap/information]`。
- 合法配置＋全部資訊，再按檢查：`#curation-result` 解除 hidden，`#curation-result-order li[data-work-index]` 反映實際由左至右排列；編輯後成功結果收回。
- 重設回原起始值，焦點回 `#placement-0`。語言切換 `#curation-lang-zh/en/ja` 保留配置與檢查狀態，更新文字與來源／回首頁連結。
- `#poster-0/1/2`、`#work-credits-0/1/2` 與原 gallery 逐筆核對；海報錨點指向上述 work 路由。
- `#curation-source` 為來源消息；`#curation-home` 回首頁。載入失敗顯示本語系訊息與 `#curation-retry`，不偽造作品。
- 預期網路僅此頁 HTML／CSS／JS、原 `data/news.json` 與三張原海報；不請求 `holiday-lab/assets/`、不開 iframe、不播放 audio。

本報告只描述新示範；沒有把既有 84 項核心流程驗收、歷史 2076 全域 UI 合約或暫緩的勞動節發布門檻改成通過。

## 手機孤尾修復追加紀錄（2026-10-23 17:41）

新 student01 獨立驗收真實發現六個手機情境失敗：ZH320 的「鄭羽軒」「黎躒嬈」末字落單、ZH／EN390 的「馬聖淞」末字落單、JA320 的 checkbox 說明與「展示をチェック」末字落單；切語後也能重現。原始失敗在 `../student-independent/runs/2026-10-23T09-35-46-407Z/result.json`；該目錄與原 `checks.json`、`stdout.txt` 均保留，不以修復後數據覆寫。

根因：原署名是一整段可逐漢字換行的 text node；日文 checkbox 缺少均衡換行；手機兩顆按鈕用相同 flex 寬度分配，文字可在最後一字斷行。

修正：每個姓名包成 `span.credit-name` 並 `white-space:nowrap`，空格與 ` · ` 分隔逐字保留。成功結果署名也使用相同分組；checkbox 說明用 `text-wrap:balance`；按鈕文字整段 nowrap，容器原有 flex-wrap 可讓整顆按鈕換列。沒有刪改姓名或縮小字級。

| 修復驗收 | yes／no／待驗 | 實際指令與輸出 |
| --- | --- | --- |
| 原症狀可重現 | yes | 修復前 `node holiday-lab/reports/hero-release-20261023/student-demo/mobile-regression.cjs`：`pass:0, fail:6`，exit 1；逐列實際字形證據在 `mobile-runs/2026-10-23T09-39-17-031Z/result.json` |
| 相同手機原生操作與字形量測轉綠 | yes | 修復後同命令：`PASS zh 320/390, en 320/390, ja 320/390`、`pass:6, fail:0`，exit 0；證據在 `mobile-runs/2026-10-23T09-40-07-903Z/result.json` |
| 初始／合法通關／切換語言後重設 | yes | 上述 6 個情境各實際操作三階段，18 份 DOM 文字行量測的 `issues` 與 `orphans` 全空。僅以真 select／checkbox／按鈕操作，不注入作品或通關狀態 |
| 完整作者姓名與分隔不變 | yes | `node holiday-lab/reports/hero-release-20261023/student-demo/mobile-repair-verify.mjs`：新增署名分組測試及原五項測試，共 `tests 6 / pass 6 / fail 0`，exit 0 |
| runtime 語法 | yes | 同 repair verifier 內實跑 `node --check holiday-lab/student-curation.mjs`：exit 0 |
| fresh student02 最終 build 獨立驗收 | 待驗 | 主控擁有 build，另一位代理重新驗收；本代理沒有改凍結的 student01 或獨立驗收方法 |

修復測試輸出另存 `mobile-repair-checks.json`／`mobile-repair-stdout.txt`。`mobile-regression.cjs` 是可回歸的輕量本機 HTTP／headless 測試：啟動時鎖定來源檔案位元組，只提供本頁、原 news 與三張海報；沿用獨立代理的唯讀量測函式，沒有修改該函式。其證據只代表來源頁手機修復；不聲稱已驗證最終部署包或獨立驗收通過。截圖在操作完成的最後階段拍攝，檔名是最初語系，實際畫面已切至下一語系；各階段語系與文字行請以 result.json 為準。
