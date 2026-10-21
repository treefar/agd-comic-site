# WO-01 WebP 截圖包執行報告

分支：`codex/wo-01-screenshots-webp`，直接從 `feature/en-site-and-play-zone` 的 `e6ac8ebc51f2269b87e48867b0743d9c88de70e5` 建立。未修改、rebase 或 cherry-pick 舊截圖分支，僅以 git show 讀取其腳本與報告；未 push，未碰 main。

結果：**部分完成，5/6。第 5 條數值通過，彈簧線目視辨識仍不足，保守判 no。**

## 產出與重跑

`docs/qa/creative-line/20261021/` 包含 56 張 WebP、`index.html`、`console.txt`、`evidence.json`、`verification.json`。對照表頁首記錄拍攝時間、瀏覽器與來源 commit。

本次拍攝：2026-10-21T13:44:56.515Z（台灣 2026-10-21 21:44:56）；Playwright 1.64.1、Chromium 156.0.8078.4。

啟動 repo 根目錄的靜態 HTTP 伺服器於 `127.0.0.1:8765` 後執行：

```powershell
node tools/qa/shoot-creative-line.mjs --out docs/qa/creative-line/20261021
```

桌機 viewport 1280×720、DPR 1；手機 viewport 390×844、DPR 2、isMobile true、hasTouch true。14 個狀態與舊版相同，雙語、雙視窗，共 56 張。

轉檔只使用 `sharp(pngBuffer).webp({ quality: 85 }).toFile(...)`，PNG 來自 Playwright `page.screenshot({type:'png'})` 記憶體 buffer。同尺寸、不縮放、不裁切、不調色、不修圖，PNG 不落地；只新增 sharp 一個直接 devDependency，lockfile 其餘新增項目為其相依套件。

## 實際指令與輸出

上述拍攝指令 exit code 0，完整輸出資料已保存於 `verification.json`，摘要如下：

```text
webp: 56
png: 0
bytes: 10314420
MB: 10.31442
dimensionsValid: true
gallery: 56
sparks: [1, 1, 1, 1]
logs: []
```

另以 Node 讀取 evidence.json、列舉實際檔案，將固定 14 狀態乘兩語言、兩視窗的預期檔名與實際檔名逐筆比對，輸出：

```text
exactNames: true
webp: 56
png: 0（遞迴檢查）
bytes: 10314420
MiB: 9.836597442626953
trackedOutsideWhitelist: []
```

容量與尺寸可重查：

```powershell
node -e 'const fs=require("fs"),d="docs/qa/creative-line/20261021/",e=JSON.parse(fs.readFileSync(d+"evidence.json"));console.log({webp:e.dimensions.length,bytes:e.dimensions.reduce((s,m)=>s+m.bytes,0),dimensionsValid:e.dimensions.every(m=>m.width===(m.file.includes("-mobile-")?780:1280)&&m.height===(m.file.includes("-mobile-")?1688:720))});'
```

```text
{ webp: 56, bytes: 10314420, dimensionsValid: true }
```

```powershell
node --test tests/en-play.test.mjs
```

```text
tests 12
suites 0
pass 12
fail 0
cancelled 0
skipped 0
todo 0
```

```powershell
git diff --check
```

exit code 0；只有 package.json 與 lockfile 的 Git LF/CRLF 提示，沒有 diff 格式錯誤。

舊版容量以 `git ls-tree -rl codex/wo-01-screenshots docs/qa/creative-line/20261021` 篩選 `.png` 並加總 blob 大小：56 張、60,335,298 bytes（60.335298 MB，57.540224 MiB，約為前次所稱 58 MB）。本次為 10,314,420 bytes（10.314420 MB，9.836597 MiB），減少約 82.91%，小於 20 MB。

## 逐條驗收

| 條件 | yes／no | 實測證據 |
| --- | --- | --- |
| 1. WebP 56 張、PNG 0 張、檔名符合 | yes | 拍攝腳本與另次檔名全集比對輸出如上，包含遞迴 PNG 0 張。 |
| 2. 總容量 ≤20 MB、每張尺寸正確 | yes | sharp metadata 逐張驗證：桌機 1280×720、手機 780×1688；總計 10,314,420 bytes。 |
| 3. 對照表 56 格都有圖、無破圖 | yes | Chromium 開啟 index.html，56 個 img 全設 eager、decode 成功，complete 且 naturalWidth>0 為 56。 |
| 4. 站內 404 0、JS error 0 | yes | console.txt：`No console errors, JS errors, HTTP errors or failed requests.`；logs 為空。 |
| 5. 彈簧數值與四張實圖、火花 | no | 四組彈簧數值均通過且線段在畫面內；已逐張開啟四張彈簧與四張火花原圖，火花可見，但彈簧細線在淺色地板上難以明確辨識，無法宣稱目視通過。 |
| 6. 既有測試全過、白名單外無本輪變動 | yes | node --test 為 12/12；本輪新增／修改僅在白名單。開工前已有三個未追蹤文字檔，保留原樣並排除提交，見下。 |

## 彈簧畫面與取證細節

實際 L3 path 共 325 點，30%～60% 多數落在 y 約 694～702，後續 path 點不滿足目標 40px 邊距。腳本沿路徑走到第 98 點（30.1538%），搜尋可走區內的目標，使用 `window.__cl.walk` 約每 1px 檢查原始光點到目標的完整連線。設定目標後以公開 step 介面走 5 個 1/60 秒步長，把光點移離下緣，然後等待兩個原生 requestAnimationFrame，執行遊戲原本的 frame/render；shot 另等一個原生 RAF 後再截圖。

沿用舊版凍結 performance.now、攔截遊戲 RAF 回呼的方式，以便固定狀態；本次原生 RAF 實際排程繪製，render 讀取的模擬 dt 為 0，遊戲進度只由公開 step 推進。這是可重跑的狀態截圖，不代表連續真實時間的手感測試。沒有修改遊戲、DOM 造型或美術。

| 圖片 | orb (x,y) | target (x,y) | 距離 px | state | opacity | scene transform |
| --- | --- | --- | --- | --- | --- | --- |
| zh-desktop-L3-play-spring.webp | 224.5752, 666.9638 | 40, 628 | 188.6430 | play | 0.7 | rotate(-0.8deg) |
| zh-mobile-L3-play-spring.webp | 224.5752, 663.9910 | 40, 620 | 189.7451 | play | 0.7 | rotate(-0.8deg) |
| en-desktop-L3-play-spring.webp | 224.5752, 666.9638 | 40, 628 | 188.6430 | play | 0.7 | rotate(-0.8deg) |
| en-mobile-L3-play-spring.webp | 224.5752, 663.9910 | 40, 620 | 189.7451 | play | 0.7 | rotate(-0.8deg) |

line 的 x1/y1 等於表內 orb，x2/y2 等於 target，完整未四捨五入值在 evidence.json；目標 x∈[40,1240]、y∈[40,680]。desktop 301 次、mobile 303 次 walk 採樣全可走，四圖 fails 都為 0。

逐張開啟最終 WebP 後的目視紀錄：

- zh-desktop：光點在左下方黑色體感平台前的地板，線段應向左上延伸，但米色細虛線融入地板，無法清楚辨識全段。
- zh-mobile：光點在中央遊戲區左下方平台前，縮小後彈簧線尤其淡，無法清楚辨識。
- en-desktop：光點與殘影在左下平台前地板，彈簧線與淺色地板對比不足，無法清楚辨識全段。
- en-mobile：光點在遊戲區左下平台旁，後方殘影可見，細彈簧線在手機尺寸下難辨。

四張 L1-fail：皆在恐龍前腳下方、小人物左上方看見紅黃放射狀火花；手機圖也可辨識。

最不確定的一件事：彈簧米色 2px 虛線在實際手機上的辨識度。此次圖像已入框，仍不能以 opacity 數值代替視覺辨識。依範圍鎖，只在報告記錄，不修改遊戲線條樣式。

## 範圍與收尾

開工前既有未追蹤檔案，未改、未刪、未納入提交：

```text
work-orders/20261021/codex-last-message-run2.txt
work-orders/20261021/codex-prompt-run2.txt
work-orders/20261021/codex-prompt-run3.txt
```

只提交 QA 輸出、指定腳本、sharp dependency 與本報告。預覽伺服器用完關閉；交件後切回 `feature/en-site-and-play-zone`。未跑完整網站 build／其他 E2E，原因是此次只變更截圖工具與靜態 QA 輸出，遊戲與網站程式均未修改；已依工單執行指定回歸測試與實際 Chromium 對照表驗證。

瀏覽器暫存統一置於白名單內的 `docs/qa/creative-line/20261021/browser-tmp/`，其中 Node 自動產生 compile cache；遵守不刪檔規則，保留為未追蹤暫存，不納入提交。提交前檢查共 64 個 staged 檔案，temporaryStaged 為空，白名單外 staged 檔案為空。
