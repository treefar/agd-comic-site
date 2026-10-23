# 日英翻譯第二位獨立檢查：08整合版與09兩筆修正

2026-10-23（台灣）。唯一修改範圍本資料夾，產品／build／服務唯讀。固定08 `.measure-integrated-08`／8845，後續09 `.measure-integrated-09`／8846僅驗兩筆漏譯，不重跑全批，也不冒稱真人母語審校或全站已驗。

**08：244個實際可見DOM案例、13,994字元＋樣式組，cmap缺字0／未知0。** 其中234個整個Range在owner內，10個為官網刻意兩行省略的新聞摘要，不能稱為全文畫面通過。另12案例（6個值×兩寬）只有資料／未採用literal，本頁不呈現。獨立語意複讀找到2筆P2漏譯；主控修正後，**09限定4/4 DOM、版面與106字元樣式cmap通過**。

## 固定範圍與分類

`prepare.cjs`從固定cbcfed1的About/Labs44項、a11cc9c的News/Works83項取計畫；明確排除主控未採用的FF完整段 `NEWSWORK-a9a863dd86b4-en`，故為44＋82＝126語言值。再加Works英日兩個完整標題，共128目標×390／1440＝256分類紀錄。`targets.json`含每筆原文、固定new、原檔／pointer／origin、路由；不以後來已改工作樹覆寫08預期。JA125舊key遷移逐字核計畫的canonical locale_migration與實際新key，未由單例猜別名。

初掃 `run-01` 256紀錄／242 visible；日文Works的`<br>`被innerText轉成空格，而日文golden沒有空格，是工具定位假missing。修locator同時接受raw textContent或實際BR換行後的完整句，**只補Works英日×兩寬4目標**，沒有重跑256。`works-heading-02` 4/4，保留黃色keep coming／途切れない與20數字。English raw因BR連接成stories.The，實際換行表示句間；日文raw整句精準符合。`merge.cjs`核對兩輪08的12個served來源SHA相等，再依id＋width替換四標結果；最終244 visible，並非把256全算可見。

### 未呈現的6值（每值兩寬，共12案例）

| id | 原來源與未呈現依據 |
|---|---|
| NEWSWORK-b49f9f603303-en／ja | data/news.json /6/excerpt；首頁同一題材採另一個inline摘要key（本批e3f98b3faa09已找到），NewsDetail內容採post.content || post.excerpt，有content時不顯示這份excerpt |
| NEWSWORK-166f1f7f20cb-en | data/news.json /13/excerpt及NEWS literal；屬未進本次首頁最近13則切片的舊Unity課程摘要，詳頁另有content |
| NEWSWORK-583b794a3cb8-en | data/news.json /16/excerpt及NEWS literal；舊HC實習摘要，未在本次首頁切片；同篇完整正文另已找到 |
| NEWSWORK-367818123e77-ja | data/news.json /17/excerpt及NEWS literal；舊金犢獎摘要未入本次切片，詳頁正文另已找到 |
| NEWSWORK-aa35a815774e-en | chapters-2.jsx WORKS陣列科研雙星標籤；WorksChapter只呈現WORKS.slice(0,3)與slice(3,6)，此標籤未採用，詳頁正文另已找到 |

以上均未找到對應alt／metadata冒充可見字。首頁切片與NewsDetail的實際程式已讀，`works-recon.json`亦保當頁所有heading／alt／文字。分類主張是「本次路由未呈現」，不是刪除或補造資料。

另有26個案例同時存在真img alt與可見圖說／標題，兩者分別存`alt`／可見DOM；沒有alt-only通過數，metadata-only亦0。10個Range診斷全在首頁次要新聞摘要：chapters-1.jsx明設WebkitLineClamp:2及overflow:hidden。實看顯示…與READ入口；Range含不可見後行，故保留outsideOwner，不為追綠放寬框或稱全文可讀。

## 獨立語意結果與09複驗

1. **P2日文短標漏音聲**：ABOUTLAB-c8219f24cbc1-ja，原文「影音後製 / 自媒體」，08真字是「映像ポストプロダクション / 個人メディア」。同批完整實驗室名有映像・音声，短標卻少聲音。主控改為「映像・音声ポストプロダクション / 個人メディア」。
2. **P2英文人才領域漏影視**：ABOUTLAB-089d19b70ab2-en，data/en/labs.json /7/content。原列動畫、配樂、影視、數位學習；08只有animation, film scoring, digital learning。film scoring是配樂，不能兼算影視。主控只在中間補film and television production。

兩筆08各390／1440的真DOM、原句及viewport俱存run-01。09只用已固定原目標組成delta09-targets.json，檢查兩筆×兩寬4目標：全文真DOM找到、Range安全、無水平溢出、cmap106組missing0／unknown0／parse0，source12筆前後穩定。六筆degree細類修正屬主控另一條獨立測試，不混入本4案例。

**P3來源待核，未擅換名稱**：同中文標題《人造人》在2025放視新聞NEWSWORK-40f8dbbbcbf7-en出現Zephyranthes，作品頁NEWSWORK-29e2e8f42740-en出現Android；同中文標題《神癒》亦出現Holy Algorithm／Divine Healing。僅同中文標題不足以推定兩則指同一件作品，作品同一性與正式英文片名皆待核，不能先建立別名對映。固定new沿用既有英文名，本輪未取得可完整比對作者／年份與正式片單的證據，不能選一個頂替。應回作者／正式片單確認；此為來源待查，不冒稱新查到抄襲或擅修事實。

語意複讀重點為影音／人才領域完整、實習22人／4年／3國8公司、競賽14入圍與7作品、證照講座報名限制、專題故事因果等。126筆source新值逐pointer核對；不是126份真人母語簽核，也未重新查證歷史設備現況、官方獎名、學位或統計真偽。

## 實際字型與cmap

逐可見文字owner取真DOM，保存Range、owner、computed style、CDP實際字型；每個文字run依其family／weight／size／variation等建立隔離單字探針，再查CDP。探針只驗字型，不算產品可見內容。fontTools對實際／已快取字體getBestCmap排除.notdef，優先PostScript alias，必要family subset／style聯集在coverage逐字標記。沒有使用document.fonts.check當覆蓋證據。

原run-01 cmap13966組unknown2，都是父owner原有的▸（U+25B8，非新譯文），實際CDP為Cambria Math／CambriaMath；原inventory缺該字體檔，並非產品缺字。原輸出及coverage保留；cp950列印該字時另發生UnicodeEncodeError，也保留。唯讀HKLM Fonts的Cambria & Cambria Math (TrueType)解析cambria.ttc，用Windows原檔TTC實測cmap後解除unknown，**沒有改字、假填alias或複製／發布系統字型**。`cambria-registry.json`存registry/path/bytes/SHA，merge後318個字體收據、13994組missing0／unknown0／parse0。

## 實際指令與原輸出

```powershell
node holiday-lab/translation-review/integrated08-rendered/prepare.cjs
# targets128 / planned126 / excluded1
node holiday-lab/translation-review/integrated08-rendered/audit.cjs
# TOTAL256/256; visible242; stabletrue; errors0（分類完成，不等於256可見通過）
$env:WORKS_ONLY='1'
node holiday-lab/translation-review/integrated08-rendered/audit.cjs works-heading-02
# TOTAL4/4; visible4; stabletrue; errors0
# merge.cjs另須SUPPLEMENTAL_FONT指定registry實際解析的Windows Fonts/cambria.ttc。
node holiday-lab/translation-review/integrated08-rendered/merge.cjs
# MERGED256 classifications;244visible DOM;10Range diagnostics;12data-only;alt attributes26
python holiday-lab/translation-review/integrated08-rendered/coverage.py --audit holiday-lab/translation-review/integrated08-rendered/merged/audit.json
# CASES244/244 CHARACTER_PAIRS13994 MISSING0 UNKNOWN0 FONT_PARSE_ERRORS0
# 09限定：INTEGRATED_BASE=8846、INTEGRATED_TARGETS=本目錄delta09-targets.json，WORKS_ONLY不設定。
node holiday-lab/translation-review/integrated08-rendered/audit.cjs delta09
# TOTAL4/4;visible4;stabletrue;errors0
python holiday-lab/translation-review/integrated08-rendered/coverage.py --audit holiday-lab/translation-review/integrated08-rendered/delta09/visible-audit.json
# CASES4/4 CHARACTER_PAIRS106 MISSING0 UNKNOWN0 FONT_PARSE_ERRORS0
node holiday-lab/translation-review/integrated08-rendered/verify.cjs
# summary.json由實際檔案機算
```

最終各指令exit0；所有stdout檔同名留底。覆蓋完整128個預期在兩寬的256分類；cmap只涵蓋244個真可見DOM owner，不能把12資料值當成可見字驗完。

## yes／no

| 條件 | yes/no |
|---|---|
| 固定計畫44＋82與Works整標有逐項來源／分類 | yes，126值＋兩標，無FF完整段混入 |
| 08有244個實際可見DOM、13994組cmap無缺／未知 | yes，merged/audit.json與coverage.json |
| 全256都是畫面可見／全文安全 | no，12 data-only、10兩行省略診斷分開保留 |
| Works英日四整標及黃字保留 | yes，works-heading-02；日文BR工具假missing不當產品失敗 |
| hidden alt／metadata冒充真DOM | no；26 alt屬性與其真可見文字分存，metadata0 |
| 兩筆P2確實找到並於09四目標驗新值 | yes，delta09 full text／layout／106組cmap通過 |
| source前後一致 | yes，08與Works補樣12筆SHA相同；09另12筆各自穩定，沒有混成同版 |
| 抽看畫面 | yes，已實看08英實驗室390、日短標390、Works英390／日1440、英新聞兩行摘要390；09兩代表亦抽看 |
| 全244張逐張美術／墨跡paint-order／真人母語審校 | no，Range框及cmap不能取代這些 |
| About07十二案例、既有13詞28案例、root功能／degree重做 | no，依限定範圍避免重複 |
| 改產品／建置／啟停server／push／發布／main／刪檔／Unity | no，僅本資料夾產出 |

08 app-XINNZ4MW.js與09 app-M56TOGNW.js的raw SHA及其餘12筆收據各在audit.json before／after。代理所見是本機Chromium／Windows字體環境，不擴張成所有裝置皆無缺字。
