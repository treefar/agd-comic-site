# WO-04 英文譯文 `[CHECK]` 第一批覆核：獎項、影展、機構的官方英文名

> 對象：**執行代理 Codex**（可上網查）。驗收者：主控（跑驗證腳本）。沒有生成模型段落。

## 0. 範圍鎖
- 白名單：`data/en/stats.json`、`data/en/news.json`、`data/en/works.json`、`data/en/faculty.json`（只准改字串值，不准動鍵、順序、陣列長度、數字）、新增 `tools/validate-en.mjs`、新增 `docs/qa/en-check/20261021-batch1.md`。
- 黑名單：`data/*.json`（中文原檔）、`data/en/curriculum.json`、`labs.json`、`videos.json`、`admission.json`（這批不碰）、所有 jsx。
- 禁止：沒有官方來源就改寫；把 `[CHECK]` 拿掉卻沒改內容。

## 1. 任務
agy 初譯有 513 處標 `[CHECK]`（清單在 `C:\agywork\agd-en-translate\英文譯文待覆核清單.md`，唯讀）。其中最多的是獎項、影展、比賽、機構名稱。請只處理「能用官方網站或主辦單位英文頁面證實」的那些：換成官方英文名、保留括號內中文原名、移除 `[CHECK]`；證實不了的原樣保留。

## 2. 規格
1. 先把 `C:\agywork\agd-en-translate\validate.mjs` 複製成 `tools/validate-en.mjs`，路徑改成相對 repo（`data/` 與 `data/en/`），功能不變：結構一致、受保護欄位未改、無殘留漢字（括號與《》內除外）、數字都在。執行方式 `node tools/validate-en.mjs`。
2. 覆核範圍只限名稱類：獎項（例：時報金犢獎、放視大賞、巴哈姆特 ACG 創作大賽、金點新秀、TISDC、KT 科藝獎、青春設計節、全國技專校院實務專題競賽）、影展、國際發明展、機構與公司（Hautecouture、ZIP-LAB、智冠、西基……）。**人名、課名、職稱、敘述句這批不碰。**
3. 每一筆改動都要有來源：官方網站、主辦單位英文頁、該機構英文版網站。維基百科只能當線索不能當來源。找不到官方英文名 → 不改，留 `[CHECK]`。
4. 同一個名稱在四個檔裡要改得一致（先建對照表再批次替換）。
5. 產出 `docs/qa/en-check/20261021-batch1.md`：表格欄位 `中文原名 | 採用英文 | 來源 URL | 查到日期 | 影響檔案與筆數`；最後一節列「查過但沒找到官方英文名」的名稱（讓使用者決定）。
6. 改完跑 `node tools/validate-en.mjs`，四個檔都要 `PASS`，`[CHECK]` 總數要比改前少（改前數字寫在報告）。

## 3. 驗收條件（每條 yes／no）
1. `node tools/validate-en.mjs` 全部 PASS。
2. 對照表每一列都有可開啟的來源 URL（報告附你實際開過的證據：頁面標題或 30 字內摘錄）。
3. 四個檔的 `[CHECK]` 總數下降，且下降數 ＝ 對照表「影響筆數」合計。
4. `git diff data/en/` 只動了字串值（用 `tools/validate-en.mjs` 的結構檢查證明）。
5. `node --test tests/en-play.test.mjs` 全過；白名單外無變動。

## 4. 失敗路徑
網路被沙箱擋 → 交 `blocked` 報告，但仍要完成第 1 點的 `tools/validate-en.mjs` 搬移與對照表的「待查名單」。

## 5. 交件
`work-orders/20261021/reports/WO-04-report.md`，附改前／改後 `[CHECK]` 計數與 `validate-en` 輸出。
