# WordPress 版系網同步（wp-sync ＋ wp-skin）

WordPress 版 https://www.dgd.stu.edu.tw/ 的 37 個舊頁面，內容由 `wp-sync/gen.js` 從漫畫版 `data/*.json` 產生；
外觀由 `wp-skin/` 的兩個 HFCM 片段提供。漫畫版資料改了，就照下面流程重新同步。

## 目前線上狀態（2026-11-03）

| 項目 | 位置 | 版本 |
|---|---|---|
| 37 頁內容 | WordPress 頁面（ID 見 `gen.js` 的 `buildAll`） | 本分支 `gen.js`，資料來源日期 2026-11-03 |
| 漫畫外衣 CSS | HFCM 片段 #7（Site Wide Header） | `20261103b`＝`wp-skin/dist/hfcm-header.html` |
| 點擊特效＋長頁跳轉列 | HFCM 片段 #15（Site Wide Footer，2026-11-03 新增） | `20261103b`＝`wp-skin/dist/hfcm-fx-footer.html` |
| LINE 浮動鈕 | HFCM 片段 #14（原始碼不在 repo） | 1024px 以下由 #7 覆寫成 50px 小方鈕 |

2026-11-03 改版內容（使用者在對話中選定）：表格手機轉卡片、教師總表改角色卡、課程地圖改關卡軌道、
章節頭＋彩色區塊、沿用漫畫版點擊特效（狀聲詞、圖片噴墨＋合成音效）、長頁跳轉列、手機 LINE 鈕縮成小方鈕、桌機一起套。

20261103b（同日）：招生頁標題與 WordPress 頁面標題相同時不再重複輸出 h2，教師／實驗室總表人數改放導言；
平板 768px 實測 LINE 長條鈕會壓字，小方鈕斷點從 767px 放寬到 1024px。37 頁在 768、1024 寬度皆無水平溢出。

## 同步流程

1. `node wp-sync/check.mjs`、`node wp-skin/check.mjs` 都要 PASS；`node wp-skin/build.mjs` 產出 `wp-skin/dist/`。
2. 使用者在瀏覽器登入 WordPress 後台（密碼由使用者自己輸入）。
3. 頁面內容：在已登入的後台分頁，用 REST API 寫入
   `POST /wp-json/wp/v2/pages/<id>`，標頭 `X-WP-Nonce: wpApiSettings.nonce`，內容 `{content: html}`。
   寫入前先 `GET ...?context=edit` 備份 `content.raw`；寫入後比對回傳的 `content.raw` 與產出逐字相同。
4. HFCM 片段：後台 `admin.php?page=hfcm-update&id=<編號>`，編輯器是 CodeMirror，
   用 `document.querySelector('.CodeMirror').CodeMirror.setValue(新內容)` 後按「更新」。
5. 驗證：不帶登入（`credentials:'omit'`）抓正常網址，確認 `#agdc-skin` 的 `data-ver`、`AGD COMIC FX` 版本與
   `.agdc-` 結構都在；線上片段的 JS 會被轉成 CRLF，比對前先換回 LF。

## 地雷

- 學校站有人機驗證，`curl` 抓不到頁面；只能在瀏覽器裡操作。
- 外部網頁不能讀本機 `localhost` 檔案（瀏覽器私有網路限制），新內容要直接送進瀏覽器分頁。
- 子站管理員存檔會濾掉 `style`／`script`／`iframe`，但保留 `class`、`data-*`、`role`、`details`（2026-11-03 草稿頁實測）。
- 頁面標題 `h1` 由主題輸出在 `.thn_post_wrap` 第一個子元素；跳轉列要插在它後面，否則黃色標題貼紙樣式失效。
- 部分頁面外框選擇器是 `.page_wrap .single_wrap > .single_post`，手機內距規則要一起寫，否則蓋不過。

## 還原

- 頁面：WordPress 每頁都有修訂版本（後台「修訂」可還原到 2026-11-03 之前）。
- HFCM #7：在 `origin/main` 跑 `node wp-skin/build.mjs`，`dist/hfcm-header.html` 就是改版前內容
  （17230 字元，SHA-1 前 12 碼 `c6aa861677c0`，2026-11-03 核對過），貼回 #7。
- HFCM #15：後台把片段設為「非使用中」即可關掉點擊特效與跳轉列。
