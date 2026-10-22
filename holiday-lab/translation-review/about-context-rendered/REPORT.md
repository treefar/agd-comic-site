# About兩完整句：獨立真DOM與字型複驗

2026-10-23（台灣）。新凍結版 `.measure-site-copy-07`／`http://127.0.0.1:8844`，只驗 About 的 intro／history，不拿根目錄後續44字典或13新譯28case作本次預期。產品、build、服務皆唯讀。

結果：**三語390／1440、兩段共12/12完整句通過；764個字元＋實際樣式／案例組合，cmap缺字0、未知0、字體解析錯誤0。** 紅藍強調保留；2006、2011及兩系名、三競賽仍是粗體700；整段Range在所屬panel內，六頁狀態無水平溢出。

## 固定預期與舊版紅燈

golden只取固定 `cbcfed1e8a5ad25b64a69e052941a6d103f22487` 的 `holiday-lab/translation-review-about-labs/exact-plan.json.context_fixes` 兩段，存為 `golden.json`。沒有從已修改產品字典反推預期。

舊8819在 `red-02/` 留12張真viewport與raw DOM：四個中文對照保留，英日8個完整句均不符golden。英文確見 `inanimation`、`firstDepartment`、`asAnimation`、`inVision`、`Awardsand`，日文intro以「育成」前置且缺完整句尾；這些是實際畫面／DOM，不是只對原始碼做推論。

中文版原JSX在「遊戲設計、 影音」有一個排版空格。新舊四個中文raw `textContent`逐字相同，沒有改字或改空格。只在中文完整句比對時，明確忽略「頓號後、漢字前」的排版空白；不刪年份與英文間空格，英日包含所有詞間空格精準比對。green-03有10/12 raw golden exact，另2個是此不變的中文intro排版空格，不能誤報12個raw字串逐byte相同。

## 方法

- 等待真 `[data-copy-id]` 的整段文字符合本次golden才往下做，不以`#root`存在或任意字數當ready。英日exact；中文只採上述有限排版正規化。
- 對完整容器 `textContent`比兩段，保留 `innerHTML`；`Range.selectNodeContents`涵蓋所有span／b及文字節點，不只抓其中一段。保存所有Range rect、panel owner bounds、水平溢出與元素scrollWidth。
- 每個實際文字run記computed family／weight／size等，整段查CDP `CSS.getPlatformFontsForNode`。逐個「非空白字元＋該run樣式」做隔離探針，再查CDP實際字型；粗體及大標各用真實樣式，沒有把整段都視為同一字重。
- 原樣複用既有 `content-next-rendered/coverage.py` 技術方法於本責任目錄，以fontTools4.63 `getBestCmap`排除.notdef。142份實際／快取字體收據交叉驗764組，85份本次response另存本目錄。沒有用`document.fonts.check`代替證據。
- 字體優先依實際PostScript名對映；Chromium可變字體合成名不足時，使用明記的family alias subset／style聯集。這確認可用字元，不能擴張成每個上下文glyph塑形／字形美術通過。

實際字族為Noto Sans TC Thin、Microsoft JhengHei UI、Yu Gothic、Yu Gothic Medium；名稱是CDP實報，不能由Thin一字推定所有run字重。粗體computed700及其逐字CDP／cmap另有記錄。

## 實際指令輸出

```powershell
node holiday-lab/translation-review/about-context-rendered/audit.cjs http://127.0.0.1:8819 red-02
# 八個英日條目goldenExact=false；四中文true
# TOTAL 12/12; stable=true; errors=0
node holiday-lab/translation-review/about-context-rendered/audit.cjs http://127.0.0.1:8844 green-03
# YES about-main-sentence/history-paragraph × zh/en/ja ×390/1440
# TOTAL 12/12; stable=true; errors=0
python holiday-lab/translation-review/about-context-rendered/coverage.py --audit holiday-lab/translation-review/about-context-rendered/green-03/audit.json
# CASES 12 / 12 CHARACTER_PAIRS 764 MISSING 0 UNKNOWN 0 FONT_PARSE_ERRORS 0
node holiday-lab/translation-review/about-context-rendered/verify.cjs
# summary.json：12case、6頁、英日raw exact8、中文raw unchanged4、764字元樣式組、missing0／unknown0、6來源前後穩定
```

以上離開碼0，原stdout各存 `red-02-output.txt`、`green-03-output.txt`、`cmap-03-output.txt`、`verify-output.txt`，完整機算摘要在 `summary.json`。

初版`red/`因中文上述空格誤判，初版`green/`因等待>40誤擋38字中文intro；兩份工具失敗均保留，並非產品缺內容。`green-02`雖12/12＋764cmap通過，但ready仍用>20，依主控要求改成完整golden ready後，重新跑`green-03`及cmap才是最終依據。沒有覆寫失敗或拿舊綠代替最新程式驗證。

## yes／no驗收

| 條件 | yes/no | 證據 |
|---|---|---|
| 固定golden兩句、三語兩寬逐段完整比對 | yes | verify.cjs、green-03/audit.json，英日8 raw exact；中文4 raw同舊版 |
| 原8819英日8個完整句缺陷重現 | yes | red-02 raw、viewport；新07英日沒有黏字或日文育成前置殘句 |
| 內容保留四領域與AR/VR、歷史年份／參訪／講座／競賽完整 | yes | 整句對golden，不能只以年份存在代替全文 |
| 紅動畫／藍遊戲與全部粗體資訊保留 | yes | 每個intro紅藍span實際文字、inline var及computed RGB；history每次7個b、weight700 |
| 真viewport／整段Range／owner／六頁水平溢出 | yes | 12張viewport、raw lines/owner，12rangePass；overflow0 |
| CDP實際字型＋逐字cmap | yes | 764組missing0／unknown0／parse0；font source SHA收據 |
| 07來源前後一致 | yes | index及其實際5個JS/CSS引用共6筆raw SHA相等 |
| 抽看圖 | yes | 已實看新en390 intro、ja390 history、zh1440 intro及舊en390 intro；完整清單外未冒稱逐張檢視 |
| 全部12張逐張目視／全站paint order、所有動畫無遮擋 | no | 本次Range框幾何不能取代全站墨跡或逐影格驗收 |
| 後續44字典、13新譯、Works或遊戲已在此輪重驗 | no | 本輪嚴格只兩段12目標 |
| Build／lint／產品測試／啟停server／push／發布／main／Unity／刪檔 | no | 純獨立瀏覽器驗證，沒有產品變更或這些操作 |

## 來源收據

07的 `index.html` raw SHA：`d6e709c73c0ad77a7a59549fb7904ff15eef54b266e0568448d6f654ab8aa143`；`app-JP3T52N6.js` raw SHA：`1837270b1aa7d8835687f49e3c2fd87e28f05be7ff1fdfdbf71069ac25804e35`。完整六筆前後值在green-03/audit.json，並未用根目錄最新source替代07 served來源。

代表圖：`green-03/about-main-sentence-en-390-viewport.png`、`green-03/about-history-paragraph-ja-390-viewport.png`、`green-03/about-main-sentence-zh-1440-viewport.png`。英文彎撇號sidebearing在Taiwan’s看起來較疏，但DOM碼點與cmap完整；不把排印視感推成缺字。
