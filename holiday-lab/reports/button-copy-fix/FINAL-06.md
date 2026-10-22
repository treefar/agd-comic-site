# 通用九宮格06：限定回歸驗收

2026-10-23（台灣），受測 `http://127.0.0.1:8843/`，主控凍結 `.measure-button-slice-06`。本代理沒有重建／修改served檔案。四款label-only產品checkpoint為 `1dc686fc8e0a3415d3a856d0595b784102b97eb9`；共用CSS／日文開場與主站譯文由主控維護。

**46/46組、138態通過；所有有效樣本的目標墨跡及當前可讀DOM全頁geometry errors為0。** 主矩陣是5款6目標×三語×兩寬36組108態；補測教師節其他5句英文×兩寬10組30態，合併主矩陣的第3台詞即覆蓋六句、兩寬、normal／hover／pressed各態。沒有縮字級、放寬safe、裁字或更改正式單位名。

## 實際命令與原輸出

```powershell
# 精確複製當時已支援原圖四向slice的量測器／固定安全區資料到報告目錄留底，不改原檔。
$env:BUTTON_BASE='http://127.0.0.1:8843'
$env:BUTTON_SAMPLER='C:/agywork/agd-holiday-prototypes/holiday-lab/reports/button-copy-fix/sampler-06-frozen.cjs'
$env:BUTTON_ASSETS='C:/agywork/agd-holiday-prototypes/holiday-lab/reports/button-copy-fix/assets-06-frozen.json'
node holiday-lab/reports/button-copy-fix/browser.cjs product-nine-slice-06-frozen
# TOTAL 46/46; stable=true; errors=0 （exit0）
node holiday-lab/reports/button-copy-fix/combine-six.cjs product-nine-slice-06-frozen none six-frozen-summary.json
# YES combined 46/46 (36 main + 10 supplement); 138 valid states; visible geometry=0; slider=20; map=3; same runtime/sampler/map receipts
node --test holiday-lab/tests/teachers.test.mjs holiday-lab/tests/national-day.test.mjs holiday-lab/tests/peace-memory.test.mjs holiday-lab/tests/labor.test.mjs holiday-lab/tests/semester.test.mjs holiday-lab/tests/semester-tasks.test.mjs
# tests34 / pass34 / fail0 （pure-six-output.txt；exit0）
```

完整46列原輸出在 `product-nine-slice-06-frozen-output.txt`，同名目錄內有每態完整sample JSON與138張viewport webp，`results.json`含每步實值與來源；`six-frozen-summary.json`是機算驗收摘要，不手填數字。`combine-six.cjs`斷言46個唯一case、三態完整、safe=true、geometry errors空、無水平overflow、無未驗來源診斷，再寫出摘要。

sampler函式SHA-256：`c247641156d929b0de7d6aa70e509510e293a29d7d6ff45aaac99ad931e0dc1a`；固定安全區JSON raw SHA：`0604fa8281a50acaccc6d151dfa676f1323e3a3b453a4e03bc939ad17e73de2b`。凍結副本是來源存證，未自行重畫／推估安全區。

## yes／no

| 條件 | yes/no | 證據 |
|---|---|---|
| 5款6目標三語320/1440、三態全部在固定紙面內 | yes | 36主case、108態safe=true，真Range＋baseline＋actualBoundingBox |
| 教師節六台詞英320／1440各三態都安全 | yes | 12個教師節英文case、36態；各態當前可讀DOM全頁geometry0 |
| semester正式Registration and Curriculum Section完整、三語各兩寬安全 | yes | 原正式文字精準assert，6case／18態；沒有改術語或任務 |
| 全46組沒有水平溢出 | yes | 實讀documentElement.scrollWidth與innerWidth，horizontalOverflow=false |
| 窄版滑桿真輸入可操作 | yes | 20組聚焦實際range、按ArrowRight或ArrowLeft，驗step進位再還原；teachers400→500→400例存sliderKeyboard |
| 沒滑桿的semester真任務／窗口／移動仍可操作 | yes | 三語320實點任務、系辦窗口、上移，角色style before／after不同，存mapMovement |
| 真滑鼠normal、hover、mousedown押下狀態 | yes | 各case三態；非用類別字串偽裝狀態 |
| 前後served來源一致，且與同一sampler／安全區配套 | yes | before／after七筆raw SHA相等；凍結一輪完整46/46 |
| 代理實看教師英320、正式窗口英1440、勞動日320圖 | yes | 下列三個viewport已逐張打開；未宣稱使用者美術確認 |
| 34項既有功能測試仍通過 | yes | pure-six-output.txt，保留原fixture行為，無特殊padding介面 |
| 所有phase、所有內捲位置、截斷診斷都已清零 | no | 此限定快照仍保存SCROLL_CONTENT_PENDING／其他區域TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT；不是整體layoutgate |
| Build、發布／打包、Unity、push、main、刪檔 | no | 本最後複驗只讀主控06既有服務，唯新增報告與測試證據 |

可讀DOM全頁geometry0只指當次實際捲動位置中量測到的文字／阻擋物；沒有把尚待捲動或其他區域截斷診斷忽略成整體綠燈。這兩類raw診斷完整保留供主控全矩陣處理。

## 前一輪失敗也保留

05九宮格初版在 `product-nine-slice-final` 得37/46，失敗在被flex擠窄的滑桿加減鈕；06修此根因，教師節最早英320已可真操作且全頁幾何0。

06首次未凍結sampler完整輪為44/46：labor-save en1440某態素材fetch暫失（source_verified=false）、ja1440 hover等待timeout。重跑兩筆2/2，但組合收據檢查抓到sampler由194f85…換成c24764…，所以**不合併成46/46**。`combine-six-output.txt`保留該次被擋的AssertionError。後來同一凍結sampler完整重跑一次46/46，沒有重試覆寫，才是本報告依據。

## raw served SHA-256（前後一致）

| 檔案 | bytes | SHA-256 |
|---|---:|---|
| runner.mjs | 17486 | `e6b0c83b114ccf8b3b0eaf4a26a9d715a1268d80065766c75841d216d95fc9e1` |
| lab.css | 7213 | `e1973a54395e0e9c52f87ceb3af30d622354f9336b7b6c7e50e9e0a6cb109290` |
| games/teachers.mjs | 7469 | `7438262d1d96d921d5a13a243494c24f16e29002c5149c0b0146d625506c00fb` |
| games/national-day.mjs | 8736 | `9c697f08c24f9eae89ac55b71fc37bcfe8546c65b7ca3264a88155b5a63891fa` |
| games/peace-memory.mjs | 6591 | `cdc8fb49a17522f8e5f46989f3397170f75d4d207f25a40bed4c8b31ccda1d4e` |
| games/labor.mjs | 7626 | `21d00e4ae80d9a0034634508411a9341cf677c4fe74efb00c0ebcb72ccd92a58` |
| games/semester.mjs | 16626 | `b184437bf226354f8602ed5567c4ac941bff6539176f9575cf737a808d7fbcc9` |

代表viewport皆在本目錄下 `product-nine-slice-06-frozen/`：

- `teachers-teachers-line-3-en-320-product-normal.webp`
- `semester-semester-window-1-en-1440-product-normal.webp`
- `labor-labor-preview-ja-320-product-hover.webp`
