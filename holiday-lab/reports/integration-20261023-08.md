# 2026-10-23：08 整合與英日專職審校

source_agent: codex。此為本機量測與審閱工作的階段紀錄，未發布。

固定來源：`.measure-integrated-08`，內部服務 `http://127.0.0.1:8845/`，`app-XINNZ4MW.js`。產品與首批證據提交 `80286ca`；師資專職審讀提交 `f052eb4`。

| 驗收 | yes／no | 實際指令與輸出 |
|---|---|---|
| 日英兩位代理分工已執行 | yes | 職稱組完成 `translation-review-title-check/final-specialist/REPORT.md`；第二位代理續驗 `translation-review/integrated08-rendered/`，未以派工當完成 |
| 助理教授／副教授術語有官方逐筆依據 | yes | JST 職種表：Assistant Professor level／助教、Associate Professor／准教授；文科省職制通知實讀。通用對照，不宣稱法定唯一英文名 |
| 13 位教師職稱與實際英日頁 | yes | `node holiday-lab/translation-review-title-check/final-specialist/check.cjs http://127.0.0.1:8845`；`dom.cjs` 同 URL → `DOM_PAGES 26/26 TEXT_VALUES 144 SOURCE_SERVED_STABLE true JS_ERRORS 0`；這是與現行中文對照，非最新人事認證 |
| 六筆碩士細類／九筆證照正式名稱已取一手證明 | no | 專職報告逐筆列 pending，不能由科系名猜 MA／MFA／MSc／Master of Design；未擅改個人資料 |
| 13＋44＋82 譯值已套用及生成 | yes | 三批 `apply-safe.mjs` 的 `--verify-applied --require-generated`／`--verify --generated` → 13、44、82 全數通過、0 寫入。套用收據在各資料夾 `root-applied.json`；本輪合計139項，不是全站總量 |
| 開拓規則矛盾未偷偷改原條件 | yes | News/Works83提案排除完整段落1筆，實際82。`excluded-pending.json` 留底；不是83全套 |
| 中文既有消息與資料保留 | yes | `tests/shared-language.test.cjs` 固定已發布基準，只允許既有招生核實及兩處合作方正式公司名修正；其餘逐資料深比對 |
| About 兩處完整句、顏色與粗體 | yes，07來源 | 獨立 `about-context-rendered/REPORT.md`：12/12，英文日文8整句、中文4原文不變，764字元樣式組 missing0／unknown0。08同實作；不把07截圖誤稱08新跑 |
| 第一批13譯值與一個中文公司名段真DOM／cmap | yes，03來源 | `content-next-rendered/command-output-with-wait.txt` →28/28；`coverage.py` →4188字元配對、missing0／unknown0／parse0。raw `runs/2026-10-22T17-24-23-485Z-all/`；不能當全站字型通過 |
| 08新增44／82及Works整句真DOM與字體 | no，續驗 | 第二位代理工作中。Works單元3/3、About單元4/4屬內容保護，不能冒充瀏覽器全驗 |
| 08 Build成功 | yes | `node holiday-lab/build-review.mjs .measure-integrated-08 --measurement` →exit0、356檔。`reports/integrated-build-08.txt`；原兩處duplicate color警告與21個unpaired path診斷仍保留 |
| 全Node檢查 | yes | `node --test tests/*.test.cjs holiday-lab/tests/*.test.mjs holiday-lab/tests/layout-sampler*.test.cjs` →187/187、fail0；`reports/node-tests-integrated08.txt`。未拿舊179/180代替 |
| 四款改標籤後真功能回歸 | yes，中文1440 | `HOLIDAY_QA_URL=http://127.0.0.1:8845 HOLIDAY_QA_GAMES=teachers,national-day node holiday-lab/qa/playthrough.cjs` →2/2；`EXTRA_QA_URL` 同址、`EXTRA_QA_GAMES=peace-memory,labor node holiday-lab/extra-qa/playthrough.cjs` →2/2。均含真DOM通關、實際作品、3回放、重試；實際PowerShell指令紀錄見functional-labels08-main/extra.txt |
| 原英文字母T左側1px截切已修正 | yes，限重現範圍 | controls左右2px保原圖框；`layout-qa/controls-bearing-served-08/report.json` →85frames、26按鈕三態、339/339全文可捲、geometry0。未動態加CSS冒充產品 |
| 儀表板更新且數字由證據計算 | yes | `node holiday-lab/build-dashboard.mjs` →23/23；`node holiday-lab/dashboard/smoke.cjs` →2/2。15模組目前SHA各有功能通關收據、使用者確認0；不是最新整包安全區核准 |
| 全2076必要版面案例／新包可交付 | no | 08 phase/errors/buttons與front90＋archive6仍量測；完整正式報告尚未合成，現行打包閘門維持未通過。沒有出新ZIP或把量測版替換8800 |
| TF-BASE兩款Unity來源／WebGL已回件 | no | 本輪實查交接夾仍5份工單／腳本；未開Unity、未重送舊工作、未更動遠端權限 |

`reports/integration-20261023-followup.md` 是較早中間狀態；本表更新截至08。所有舊失敗、候選、服務及試玩ZIP保留，未刪檔。未push、未碰main、未發布；交接C節固定SHA未變。

下一步：回收08日英新增文案真DOM／字體及完整遊戲版面矩陣，按實際缺口修正；正式閘門通過才建新的整體試玩包。
