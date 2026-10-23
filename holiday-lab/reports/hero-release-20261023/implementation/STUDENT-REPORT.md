# 學生作品首頁實作回報

source_agent: codex；日期：2026-10-23。此報告描述學生作品版，原 REPORT.md／after01 為上一版 CG 整合的歷史證據，不能用來宣稱本版瀏覽器驗收通過。

## 可審閱成果

首頁原「畫出來，動起來。」卷頭主格已放入三件系網既有作品完整海報，保留作品名、創作者、指導教師及對應消息入口。使用上一件／下一件手動切換，不自動播放。小型「試做一場小型策展」入口連到另一工作者製作的 student-curation.html。原 14 款節日試作收進同格 details，保留三語選擇、點擊才載入、Esc／關閉／焦點回復及焦點限制機制。

主控建立本機版本 `.measure-student-hero-20261023-01`，網址 http://127.0.0.1:8862/ 。主控提供的 root/student-site-build.json 記錄 8 項網站靜態建置檢查通過，bundle 為 app-KRCSVWHY.js、SHA-256 1071e6f301221b8b55a759d5a80582bc4d06be3ddf3102d426522d36fefe053a。此為 measurement 本機版，該收據 full_release_approved 為 false。獨立代理正在執行本版瀏覽器驗收；本報告不填入尚未取得的獨立 PASS，也未重複跑 9 組 GREEN。

## 來源逐筆核對

資料均來自 data/news.json，id 7140、日期 2026-04-29；原訊息路由由 pages.jsx 的 NewsDetail 核對，使用 work-NN 錨點。

| 作品 | 創作者 | 指導教師 | 消息路由 |
| --- | --- | --- | --- |
| Dear, All Robots | 王愛吉 · 黃承義 · 梁潔美 · 林巧玲 · 馬聖淞 | 陳美蓉 | #/news/2026-04-29-awards-showcase/work-04 |
| 喀嚓 | 吳立凡 · 張自祥 · 陶延娣 · 鄭羽軒 | 鄧樹遠 | #/news/2026-04-29-awards-showcase/work-05 |
| 今食堂 | 許瑗玶 · 高樂怡 · 陳書凱 · 黎躒嬈 | 鄧樹遠 | #/news/2026-04-29-awards-showcase/work-06 |

三張海報均為本機既有 1200×1697 JPEG，以 object-fit:contain 完整顯示，未切成圖集。署名存在只代表系網已有這些來源欄位，不能推論製作過程零 AI，也不代表新增改編授權。

## yes／no 與實際指令輸出

| 項目 | yes／no | 證據 |
| --- | --- | --- |
| 三件海報、作品名、作者、教師及消息路由逐欄與 news7140 一致 | yes | student-metadata.cjs 的實際輸出如下 |
| 首頁元件 CSS 不引用 holiday-lab/assets 生成圖 | yes | 同上；目前普通網站文字按鈕、連結與原生選單，未引用 ui17 背景 |
| JSX 可轉譯 | yes | 本機 esbuild transformSync 2 檔，實際輸出如下 |
| 需求在舊版能測出失敗 | yes | student-before/result.json：舊 8861 找不到學生海報，並記錄原 CG／UI 請求 |
| 本版 9 組瀏覽器驗收已由本代理執行 | no | 依主控指示避免重複，改由獨立代理執行並由主控整合 |
| 本代理已建置或發布 | no | 建置由主控統一執行；本代理未執行 build／push |

```text
node holiday-lab/reports/hero-release-20261023/implementation/student-metadata.cjs
STUDENT_METADATA 3/3 + HERO_CSS_GENERATED_IMAGE0 PASS
exit_code: 0
```

```text
node -e "const fs=require('fs'),esbuild=require('esbuild');for(const f of ['chapters-1.jsx','holiday-home.jsx'])esbuild.transformSync(fs.readFileSync(f,'utf8'),{loader:'jsx',jsxFactory:'siteCreateElement'});console.log('JSX_PARSE 2/2 PASS');"
JSX_PARSE 2/2 PASS
exit_code: 0
```

重跑語法檢查時首次誤向 Codex 共用 runtime require esbuild，實際回傳 MODULE_NOT_FOUND；改用專案已安裝的 esbuild 後取得上述 PASS。未安裝新套件。

```text
# 修改學生版前對舊 8861 執行，完整結果留在 student-before/result.json
node holiday-lab/reports/hero-release-20261023/implementation/student-hero-check.cjs student-before
STUDENT_HERO fail 0/1
AssertionError [ERR_ASSERTION]: Hero uses an attributed student poster
0 !== 1
exit_code: 1
```

可回歸瀏覽器測試 student-hero-check.cjs 已交付，包含三語各 320／390／1440、三件作品手動切換與完整署名、contain、策展入口語系、點擊前生成圖請求 0／iframe 0、14 選項且無 labor、頁面溢位與 pageerror。獨立代理另有自己的驗收碼，未把本代理自述當成驗收結果。

## 素材與範圍邊界

- 本輪首頁主視覺、學生作品展示與試作入口不再使用生成插畫；共用 favicon 保留主控前輪修復的既有 Codex 播放圖示，不擴成品牌重製，不能宣稱「首頁零 AI 位元」或全站素材均無 AI。favicon SHA-256：356075a7feaaa023f1998b1214823c4371af8b70436427fdc7b7e282cb55efc1。
- 舊節日遊戲在使用者點擊後仍會載入既有生成素材，依使用者選擇分批調整；網站自然文案已標示開發試作與素材將分批調整，未在學生流程加入技術警語。
- 完整網站及遊戲發布門檻由主控與獨立代理整合；本報告不宣稱美術人工通過、使用者確認或可公開發布。
- 僅改本代理擁有的 chapters-1.jsx、holiday-home.jsx、holiday-home.css 與 implementation 報告／測試。未刪檔、未碰 main／C 節／勞動節／Unity，未覆寫其他工作者變更。

## 本版來源 SHA-256

| 檔案 | SHA-256 |
| --- | --- |
| chapters-1.jsx | 4cea353f5f1117b2d7f6e0078a3b1c251fa57b6774c9733b184a1fb8c6e55475 |
| holiday-home.jsx | a6a5a00f0f5c6166d56022d50fae6f7b729878c8271140e96bc5a573b3894a38 |
| holiday-home.css | f9e99c56044eaee508706ad8f819167c4c53ab2b161ba8f359ca52f60d64cf81 |
| data/news.json（唯讀來源） | 383829735c7d4b4076333f5f9ac7a0f10eb18de8b8279202495b0ae14953ee16 |
