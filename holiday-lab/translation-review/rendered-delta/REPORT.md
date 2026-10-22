# 新譯文真DOM、字型與逐字覆蓋複驗

2026-10-23（原始收據時間採UTC）。本輪只寫 'holiday-lab/translation-review/rendered-delta/*'；不改產品、既有audit、字型或文字，不build/push/main/delete/Unity。

最終受測版：http://127.0.0.1:8818，runs/2026-10-22T16-20-10-293Z-all。新17條FAQ與3段招生資格共20個目標，在390與1440寬度各測一次，40/40真DOM可見；1844個非空白字元/案例組合，missing 0、unknown 0、font parse error 0。

## 紅燈與修正後複驗

8817的招生詳頁在390三語均未顯示新資格段（3/3缺席），已保存recon.json完整body、index SHA與三語整頁截圖；沒有用隱藏probe冒稱已顯示。root確認AdmissionDetail未呈現a.content並補上真實Panel，之後於8818三語390+1440全部找到。

8817的FAQ亦先完成34/34、逐字1330組無缺/unknown。8818新增日文標題使字典與8817不同，所以最終40案例全部在8818重測，沒有把舊版本成果混成新結果。初版腳本誤把打包版不存在的locale-en.js當獨立receipt，收到404即停止且留下兩份未完成run；改為記index實際引用的hashed app bundle後重跑成功，沒有忽略錯誤繼續宣稱通過。

## 方法與界線

- 依頁面實際HTML/JSX對應定位；等networkidle與document.fonts.ready，FAQ頁全部60個details展開。逐句以真正可見DOM文字節點找new值，招生資格用全文節點內的子字串Range。
- 每個真正目標節點記錄CSS computed與CDP CSS.getPlatformFontsForNode。再以同語言、同family/weight/style/size/variation/features的隔離單字探針查CDP逐字實際字型，對照字體檔cmap；未使用document.fonts.check當覆蓋證據。探針只驗字型，不算產品文字可見的證據。
- 優先比實際PostScript名，遇Chromium可變字重合成名稱（例如Noto-Sans-TC-Thin-Black）則依實際family alias比該族的subset/style cmap聯集，coverage.json逐字標明此fallback，沒有假稱全為精確face對映。這確認字元可用，不等於上下文塑形或字形美術驗收。
- 重用既有下載/系統字體cache，最終解析91個字體檔並記SHA；另保存受測頁實際回傳的2份新字體response。未換字型，也未拿無關字體的有字證據補未知。
- Range client rect檢查視窗橫界、承載元素邊界、overflow裁切與scroll寬度；10頁皆無水平頁溢位。這是排版框檢查，不是字形墨跡與所有裝飾/遮罩的完整paint-order驗收。
- 每案例保存元素與當時viewport各一張，共80張；代理另抽查8張，詳visual-review.json，沒有聲稱其餘32個元素圖已逐張目視確認。

## 逐條實測

|頁面/語言/寬度|新句ID|實際平台字型|可見且Range無溢位|逐字組數|元素截圖|
|---|---|---|---|---:|---|
|admission/zh/390|selection-eligibility/zh|Noto Sans TC Thin|yes|88|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-zh-390-0.png)|
|faq/en/390|faq/internship/1/question/en|Noto Sans TC Thin|yes|21|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-0.png)|
|faq/en/390|faq/internship/1/answer/en|Noto Sans TC Thin|yes|29|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-1.png)|
|faq/en/390|faq/leave/1/question/en|Noto Sans TC Thin|yes|21|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-2.png)|
|faq/en/390|faq/leave/1/answer/en|Noto Sans TC Thin|yes|35|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-3.png)|
|faq/en/390|faq/course-selection/0/answer/en|Noto Sans TC Thin|yes|24|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-4.png)|
|faq/en/390|faq/support-rights/0/question/en|Noto Sans TC Thin|yes|20|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-5.png)|
|faq/en/390|faq/support-rights/0/answer/en|Noto Sans TC Thin|yes|30|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-390-6.png)|
|admission/en/390|selection-eligibility/en|Noto Sans TC Thin|yes|44|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-en-390-0.png)|
|faq/ja/390|faq/leave/0/question/ja|Yu Gothic|yes|28|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-0.png)|
|faq/ja/390|faq/leave/1/question/ja|Yu Gothic|yes|27|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-1.png)|
|faq/ja/390|faq/leave/1/answer/ja|Yu Gothic|yes|69|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-2.png)|
|faq/ja/390|faq/capstone/1/question/ja|Yu Gothic|yes|31|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-3.png)|
|faq/ja/390|faq/capstone/1/answer/ja|Yu Gothic|yes|65|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-4.png)|
|faq/ja/390|faq/financial-aid/0/answer/ja|Yu Gothic|yes|81|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-5.png)|
|faq/ja/390|faq/support-rights/0/question/ja|Yu Gothic|yes|30|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-6.png)|
|faq/ja/390|faq/support-rights/0/answer/ja|Yu Gothic|yes|73|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-7.png)|
|faq/ja/390|faq/graduate-study/0/question/ja|Yu Gothic|yes|47|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-8.png)|
|faq/ja/390|faq/graduate-study/1/question/ja|Yu Gothic|yes|34|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-390-9.png)|
|admission/ja/390|selection-eligibility/ja|Yu Gothic|yes|125|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-ja-390-0.png)|
|admission/zh/1440|selection-eligibility/zh|Noto Sans TC Thin|yes|88|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-zh-1440-0.png)|
|faq/en/1440|faq/internship/1/question/en|Noto Sans TC Thin|yes|21|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-0.png)|
|faq/en/1440|faq/internship/1/answer/en|Noto Sans TC Thin|yes|29|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-1.png)|
|faq/en/1440|faq/leave/1/question/en|Noto Sans TC Thin|yes|21|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-2.png)|
|faq/en/1440|faq/leave/1/answer/en|Noto Sans TC Thin|yes|35|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-3.png)|
|faq/en/1440|faq/course-selection/0/answer/en|Noto Sans TC Thin|yes|24|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-4.png)|
|faq/en/1440|faq/support-rights/0/question/en|Noto Sans TC Thin|yes|20|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-5.png)|
|faq/en/1440|faq/support-rights/0/answer/en|Noto Sans TC Thin|yes|30|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-en-1440-6.png)|
|admission/en/1440|selection-eligibility/en|Noto Sans TC Thin|yes|44|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-en-1440-0.png)|
|faq/ja/1440|faq/leave/0/question/ja|Yu Gothic|yes|28|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-0.png)|
|faq/ja/1440|faq/leave/1/question/ja|Yu Gothic|yes|27|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-1.png)|
|faq/ja/1440|faq/leave/1/answer/ja|Yu Gothic|yes|69|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-2.png)|
|faq/ja/1440|faq/capstone/1/question/ja|Yu Gothic|yes|31|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-3.png)|
|faq/ja/1440|faq/capstone/1/answer/ja|Yu Gothic|yes|65|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-4.png)|
|faq/ja/1440|faq/financial-aid/0/answer/ja|Yu Gothic|yes|81|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-5.png)|
|faq/ja/1440|faq/support-rights/0/question/ja|Yu Gothic|yes|30|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-6.png)|
|faq/ja/1440|faq/support-rights/0/answer/ja|Yu Gothic|yes|73|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-7.png)|
|faq/ja/1440|faq/graduate-study/0/question/ja|Yu Gothic|yes|47|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-8.png)|
|faq/ja/1440|faq/graduate-study/1/question/ja|Yu Gothic|yes|34|[截圖](runs/2026-10-22T16-20-10-293Z-all/faq-ja-1440-9.png)|
|admission/ja/1440|selection-eligibility/ja|Yu Gothic|yes|125|[截圖](runs/2026-10-22T16-20-10-293Z-all/admission-ja-1440-0.png)|

## Runtime收據

11個實際runtime檔案測前/測後SHA相同；完整URL、bytes、SHA在audit.json的receipts。包含index、hashed app bundle（內含兩語locale）、樣式及受測資料，不用root工作檔SHA冒充瀏覽器收到的runtime。

- index.html：739d81fd13e9aae6cc9f7bbc6f2175d39f208884110efc5ca76beaebc994e793
- styles.css：8517da71ab27d11360c02c5e297104840ba39f7d9f760b9b1330c0753ea23641
- student-guide.css：43679385ebd03c8569c45dfe638d843079d2fd5d858b81e88058ee4fa0df07c0
- data/students/guide.json：81595129ae609d1913c4562500955a6ff1601782cf4fe11368ee5bcc9e3239fc
- data/admission.json：a4b9a35be9b5b96d0783d1e79dda9d684f86565e7e26084415004c2db750123e
- data/en/admission.json：aa1b5c3f4706eec932b08a82563407105421990b4c044e2158e085264d18366a
- data/ja/messages.json：47328f28725a636a0a7c9a46917241c2bc7b7a31825ba1d3cc6f1636c218362f
- data/en/student-guide-ui.json：7ebb842208823d4a1ffe9ceb17237dc9cb6f2a4af9e4518a9f843852d78b0dfb
- faculty-portrait.css：02b986f10c3c277becf451cc634d228cf836f686209a29df215b4c30a469ebd4
- holiday-home.css：8afe1a994c5f246064278a2a3e3cc37fa55b02e05365a8883849c472e2c7c3f5
- app-6PWQ5TH2.js：059628598d9126d9c3f4a1e0db0a30bad5023eb9db9bccb564bbd63c250f7496

## yes／no驗收與實際指令

|驗收|yes／no|實際輸出|
|---|---|---|
|8817缺少招生段落有真DOM紅燈|yes|node recon.cjs http://127.0.0.1:8817 → zh/en/ja exactParagraphInBody false；保留原截圖|
|8818的17FAQ＋3資格段於兩寬度逐條找到|yes|node audit.cjs http://127.0.0.1:8818 all → ACTIVE 40/40，LAYOUT true，RECEIPTS true，ERRORS 0，exit0|
|逐字實際字型與cmap交叉核對|yes|python coverage.py --audit runs/2026-10-22T16-20-10-293Z-all/audit.json → CASES 40/40，CHARACTER_PAIRS 1844，MISSING 0，UNKNOWN 0，FONT_PARSE_ERRORS 0，exit0|
|實際字型來源與runtime有收據|yes|字體檔91份SHA，runtime 11檔前後同SHA；actual families為Noto Sans TC Thin、Yu Gothic|
|有真缺字需要等義改寫|no|missing0/unknown0，沒有為缺字改句或換字體；人名/職稱/制度原名不動|
|全部截圖逐張視覺審閱|no|只抽查8個元素截圖，清單與觀察已記；80張全部有保存|
|全站、遊戲、其它語句或其它作業系統皆已驗完|no|只測20目標、10頁狀態、兩寬度；不擴大覆蓋宣稱|
|字形墨跡/固定導覽/所有動畫影格無遮罩|no|Range是框幾何；長元素截圖頂部可能有sticky nav蓋舊intro，不能當全站paint-order驗收|

英文彎撇號有較寬sidebearing，university’s/guide’s視覺有空隙，但碼點連續且cmap有字，屬文字精緻度，不是真缺字。本輪保留字詞與字體，沒有新增必修文案變數。

重跑：node audit.cjs <凍結版本URL> all，再以coverage.py --audit <輸出run>/audit.json檢查；新執行會開新run，不覆寫舊證據。summarize.cjs會驗40案例與coverage結果後計算摘要；不讀可變產品文字作通過替代品。
