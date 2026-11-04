# WordPress 版系網同步（wp-sync ＋ wp-skin）

WordPress 版 https://www.dgd.stu.edu.tw/ 的 37 個舊頁面，內容由 `wp-sync/gen.js` 從漫畫版 `data/*.json` 產生；
外觀由 `wp-skin/` 的兩個 HFCM 片段提供。漫畫版資料改了，就照下面流程重新同步。

## 目前線上狀態（2026-11-04）

| 項目 | 位置 | 版本 |
|---|---|---|
| 37 頁內容 | WordPress 頁面（ID 見 `gen.js` 的 `buildAll`） | main `0de5a43` 的 `gen.js`，2026-11-04 寫入 14 頁（教師總表＋13 位老師） |
| 漫畫外衣 CSS | HFCM 片段 #7（Site Wide Header） | `20261104a`＝`wp-skin/dist/hfcm-header.html` |
| 點擊特效＋長頁跳轉列＋學校資料整理 | HFCM 片段 #15（Site Wide Footer，2026-11-03 新增） | `20261103e`（程式與 20261104a 相同，只差版本字串，未重貼）＝`wp-skin/dist/hfcm-fx-footer.html` |
| LINE 浮動鈕 | HFCM 片段 #14（原始碼不在 repo） | 1024px 以下由 #7 覆寫成 50px 小方鈕 |

2026-11-03 改版內容（使用者在對話中選定）：表格手機轉卡片、教師總表改角色卡、課程地圖改關卡軌道、
章節頭＋彩色區塊、沿用漫畫版點擊特效（狀聲詞、圖片噴墨＋合成音效）、長頁跳轉列、手機 LINE 鈕縮成小方鈕、桌機一起套。

20261103b（同日）：招生頁標題與 WordPress 頁面標題相同時不再重複輸出 h2，教師／實驗室總表人數改放導言；
平板 768px 實測 LINE 長條鈕會壓字，小方鈕斷點從 767px 放寬到 1024px。37 頁在 768、1024 寬度皆無水平溢出。

20261103c（同日）：老師反映 WordPress 版少了學校教師資料。原因是 10/06 第一次同步把各老師頁底部的學校外掛短代碼
`[SDTI type="getTeacherInfo" teacher_id=…]` 一起換掉了。代碼從各頁 10/06 前的修訂版本取回（`gen.js` 的 `SDTI`，12 位，楊智彰原本就沒有），
加回教師頁最下方「學校教師資料」區塊；陳美蓉的專書（`books` 欄位）兩版都補上；漫畫版教師頁加「看學校教師資料」按鈕連到 WordPress 頁。

20261104a（2026-11-04）：教師資料總檢查（PR #11）。手機教師卡 email 不在「.edu.」中間斷行。寫入前先比對線上內容，只更新有差異的 14 頁，其餘 23 頁不動；舊版從 WordPress 修訂版本還原。

### 換行地雷（2026-11-04）

`core.autocrlf=true` 時 checkout 會把 `wp-skin/comic-fx.html` 換成 CRLF，`build.mjs` 的去註解失效、`wp-skin/check.mjs` 報「fx 片段殘留 JS 註解」，`gen.js` 產出的 HTML 也可能夾 `\r`（未實測）。產出前先確認 `git ls-files --eol wp-skin wp-sync` 是 `w/lf`。

### 校園花絮與主選單（2026-11-04，PR #13）

- 新頁 `/campus-life/`（頁面 8155），內容由 `gen.js` 的 `campusPage` 從 `data/campus.json` 產生；照片在媒體庫，對應表 `wp-sync/campus-media.json`。外衣 `20261104b` 加 `agdc-album` 樣式。
- 新增活動：照片先放進漫畫版 `images/campus/<活動>/`，大圖上傳媒體庫（只傳大圖，學校主機擋過自製 `-s.jpg` 縮圖，原因不明），把 id 與 WordPress 產生的 768 寬縮圖後綴補進 `campus-media.json`，再照同步流程寫入 8155。
- 主選單（選單 12「FOOTER」，位置 primary）：「最新消息」後加「校園花絮」（項目 8177，子項「學生活動」「系學會剪影」連到頁內錨點）；「參訪」（4360）與「參訪聯繫師長」（3804）改掛「招生資訊」（6718）底下。改動用 REST `/wp-json/wp/v2/menu-items`。
- 還原選單：刪除 8177 與其子項，把 4360 的 parent 設回 0、3804 的 parent 設回 4360，順序照下面改前備份。
- 改前備份（menu_order:項目:標題:parent）：1:3820:最新消息:0、2:4357:系所簡介:0、6:4390:課程與成果:0、10:3792:特色實驗教室:0、19:4150:實習與就業:0、23:6718:招生資訊:0、29:6724:備審資料準備:6718、30:4360:參訪:0、31:3804:參訪聯繫師長:4360、32:3800:English:0（其餘子項的 parent 不變）。
- 學校站擋無頭瀏覽器（Playwright headless 回 AWS Access Denied），線上版面要用 App 內建瀏覽器或一般 Chrome 檢查。
### 學校教師資料短代碼的地雷

- 輸出是一整份獨立網頁：自帶 Bootstrap 4、jQuery 1.12、改全站字型的 `<style>`、折疊卡片。#15 先拿掉 `link/style/meta/title`，再把每張表改成 `details` 展開區。
- 學校系統不穩：2026-11-03 下午多次回 nginx「404 Not Found」頁，一次抓多位老師時更常失敗。抓不到時 #15 與 CSS `:has()` 會把整段隱藏。
- 不要一次大量呼叫（測試時一次一位、間隔幾分鐘）。
- 成功時的畫面只用 2024 年網頁時光機存檔測過，學校系統恢復後要在線上實看一次（含手機選單是否正常）。
- 代碼對應只有江雅媚、陳慶鴻用論文標題交叉核對過，其餘 10 位待學校系統恢復後逐一核對。

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
