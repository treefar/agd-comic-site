# 本批師資譯文真DOM、字型與窄版複驗

2026-10-23；原始runtime收據用UTC時間。只新增holiday-lab/translation-review/faculty-rendered/*；不改產品、舊audit、字體或譯文，不build/push/main/delete/Unity。

固定受測07版 http://127.0.0.1:8819。本批8處新生效譯文＋1處原已正確的MTA顯示，390/1440合計18案例：18/18在各自真實faculty詳頁找到，CHECK已去除；文字框與頁寬無溢位。逐字660組：missing0、unknown0、font parse0。這不是全13位552語義值的DOM審完宣稱。

## 範圍與方法

- 用faculty-copy/exact-plan.json的expected_active_new逐項定位，逐slug真正開啟#/faculty/<slug>；9目標、16頁狀態。8處新譯文形成16案例，MTA原顯示不變形成2案例，分開計算。
- 等networkidle、document.fonts.ready；只有真可見文字節點找到期望句才進字型檢查。記computed CSS、目標節點的CDP實際平台字型，再以同family/weight/style/size/variation/features逐字探針與cmap交叉核對。探針不當成產品有顯示文字的證據，document.fonts.check亦不作覆蓋證明。
- 實際字型為Noto Sans TC Thin、Yu Gothic。優先比PostScript別名；Chrome變動字重的合成PS名則按實際family alias與其subset/style cmap聯集對照，每字mappings明記，非假稱全為精確face匹配。這是字元可用性，不是上下文塑形/美術驗收。
- 重用既有cache與系統字體，91份字體檔記SHA，另保留受測頁實際回傳的2份新font response；沒有換字型或用無關字體補未知。
- Range矩形檢查視窗橫界、承載框、overflow裁切及scroll寬度；全部頁無水平溢位。不是字形墨跡或全頁裝飾/遮罩驗收。
- 36張元素/viewport截圖都有保存；九個390目標全已代理看圖，另看3個1440目標，共12張。其餘6個1440元素未逐張目視，詳visual-review.json。

## 逐條結果

|目標|寬度|效果分類|真DOM且框無溢位|逐字組數|元素圖|
|---|---:|---|---|---:|---|
|tengshuyuan/courses/en|390|新譯文|yes|27|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-tengshuyuan-en-390-0.png)|
|chenchungkuang/courses/en|390|新譯文|yes|34|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenchungkuang-en-390-0.png)|
|changchunya/research/en|390|新譯文|yes|28|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-changchunya-en-390-0.png)|
|chenmeijung/achievements/2/en|390|新譯文|yes|31|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-en-390-0.png)|
|chenmeijung/papers/1/title/en|390|新譯文|yes|30|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-en-390-1.png)|
|yinli/papers/3/title/en|390|新譯文|yes|51|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-yinli-en-390-0.png)|
|wangtsungli/certs/en|390|原顯示保持正確|yes|35|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-wangtsungli-en-390-0.png)|
|chenchungkuang/experience/1/ja|390|新譯文|yes|27|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenchungkuang-ja-390-0.png)|
|chenmeijung/achievements/1/ja|390|新譯文|yes|67|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-ja-390-0.png)|
|tengshuyuan/courses/en|1440|新譯文|yes|27|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-tengshuyuan-en-1440-0.png)|
|chenchungkuang/courses/en|1440|新譯文|yes|34|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenchungkuang-en-1440-0.png)|
|changchunya/research/en|1440|新譯文|yes|28|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-changchunya-en-1440-0.png)|
|chenmeijung/achievements/2/en|1440|新譯文|yes|31|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-en-1440-0.png)|
|chenmeijung/papers/1/title/en|1440|新譯文|yes|30|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-en-1440-1.png)|
|yinli/papers/3/title/en|1440|新譯文|yes|51|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-yinli-en-1440-0.png)|
|wangtsungli/certs/en|1440|原顯示保持正確|yes|35|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-wangtsungli-en-1440-0.png)|
|chenchungkuang/experience/1/ja|1440|新譯文|yes|27|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenchungkuang-ja-1440-0.png)|
|chenmeijung/achievements/1/ja|1440|新譯文|yes|67|[截圖](runs/2026-10-22T16-38-19-309Z-all/faculty-chenmeijung-ja-1440-0.png)|

## 姓名與職級未誤改約束

name-role-constraints.cjs使用固定7bd59ab原始canonical/EN資料、基準locale，與8819實際收到的兩份faculty JSON及hashed app bundle比對。app以Babel AST讀取兩份真正編譯後locale物件，不執行應用bundle。

13人逐欄比id/slug/name/en/role，並比編譯後日英姓名/職級key/value；13/13一致。來源/編譯約束與本次18個DOM案例分開，不冒稱13個完整個人頁都逐欄在瀏覽器看過，也不再核定本人自用拼寫或官方職級對等。收據SHA與這次audit同版，summary程式有逐檔比對。

## Runtime收據

9檔測前/後SHA相同，完整收據在runs/2026-10-22T16-38-19-309Z-all/audit.json。

- index.html：b305394f5b73300a6ff18a2c55ea967a07331d4057a4670469932233248f952d
- styles.css：8517da71ab27d11360c02c5e297104840ba39f7d9f760b9b1330c0753ea23641
- faculty-portrait.css：02b986f10c3c277becf451cc634d228cf836f686209a29df215b4c30a469ebd4
- data/faculty.json：fb90191f0f3f9f3ccdda49b96e25588819c0662f23a11ba0194411581dba8d29
- data/en/faculty.json：64d10ea67555b375305d89509d064c423b0bbb8de00437f94a9b0e5725b41582
- data/ja/messages.json：5a65faa8fe81c3365a7e63b5410eaeee8d731b9b4c20bfb4658184e44337aa9e
- student-guide.css：43679385ebd03c8569c45dfe638d843079d2fd5d858b81e88058ee4fa0df07c0
- holiday-home.css：8afe1a994c5f246064278a2a3e3cc37fa55b02e05365a8883849c472e2c7c3f5
- app-35FXRUI2.js：14553b6796946bd0c474fe4c0c7285ac7dd65a47b73411093333e9049b6353df

## yes／no與實際命令

|驗收|yes／no|實際輸出/界線|
|---|---|---|
|本批18案例按各自slug真DOM找到|yes|node audit.cjs http://127.0.0.1:8819 all → ACTIVE18/18、LAYOUTtrue、RECEIPTStrue、ERRORS0，exit0|
|8處生效與1處原已正確分開|yes|16個新譯文案例＋2個canonical不變案例；實際使用expected_active_new，不找含CHECK的raw值|
|逐字實際字型與cmap|yes|python coverage.py --audit runs/2026-10-22T16-38-19-309Z-all/audit.json → CASES18/18 CHARACTER_PAIRS660 MISSING0 UNKNOWN0 FONT_PARSE_ERRORS0，exit0|
|13位姓名/職級約束保持|yes|node name-role-constraints.cjs http://127.0.0.1:8819 → NAME_ROLE_SOURCE_CONSTRAINTS13/13 PASStrue，exit0|
|姓名約束與DOM測試用同版runtime|yes|node summarize.cjs → 逐檔SHA相等；summary由實測資料計算|
|新字體/字串有unknown仍當通過|no|unknown0；沒有只看字體存在便稱不缺字|
|真缺字需要等義改寫/換字型|no|本批缺字0，沒有因此改字或換字型；人名/制度專名不動|
|全部13人全欄位DOM/墨跡/動畫遮罩皆完成|no|只驗這9目標，Range非墨跡；母語者/使用者確認不在此結果|

第一次重用FAQ單頁分組方法時，誤把不同faculty slug放同一頁，4/18可見；該失敗run完整保留。修成逐slug頁面並將slug加入截圖檔名後，才得到上述18/18；沒有把錯頁MISSING稱產品缺譯，也沒有覆寫舊圖。姓名約束腳本初次從bundled runtime找不到Babel，改用repo既有依賴後成功；不涉及產品修改。

重跑：node audit.cjs <凍結URL> all；python coverage.py --audit <新run>/audit.json；node name-role-constraints.cjs <同URL>；node summarize.cjs。新run保留舊證據，scope仍只此9目標。
