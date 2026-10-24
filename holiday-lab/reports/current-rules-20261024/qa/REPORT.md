# 10/24新規則整合版：最終03版有限獨立驗收

最終結果：**8879／.measure-current-rules-20261024-03／app-FPPJGCJR.js**，6／6組、144條全yes，collector與只讀驗收器均exit0、stderr空。15卡／47步／42FAQ維持，47source與360build前後逐SHA相同；54張直接WebP已存於raw-r3。下方8878／r2是保留的上一版真實歷程，不能代03新版。

03版只加舊來源說明白話化，原規則、程序、日期與URL不因此升格成全已確認。本次擴查15卡實際引用的59個來源，title/readability各一欄共118欄／組、708次觀察，均有英日精確字典且在展開卡片實際渲染。63總來源中4個未被卡片引用：gender-contact、gender-event、student-appeal-organization-history、dept-news-index；沒有硬要求這4個不存在的卡片來源註記出現。

六組所有實際.sg-source-note另掃HTTP、DOM、403、202空、渲染、抽文、Chrome、瀏覽器、ブラウザ及レンダリング，均0命中。Root先前於02發現的舊dept-contact技術註記在03新en/ja英文卡畫面已改成學生用語，已實際看圖確認。

|03版驗收項目|yes／no|證據|
|---|---|---|
|三語390／1440六組，15卡47步42FAQ|yes|raw-r3/result.json；手機25／25、桌面23／23|
|5目標卡68欄／組翻譯與內容|yes|408次欄位觀察，按新canonical與生成locale，不用舊技術提案值|
|15卡59個實際引用來源標題與白話註記|yes|708次欄位觀察，未引用4項排除|
|實際來源註記沒有技術收據詞|yes|六組visible_source_notes與technical_source_notes，命中0|
|三欄／一欄、完整導覽、手機開關、頁底入口位置|yes|六組實際DOM及手機點擊；不點遊戲|
|無console／pageerror／HTTP錯誤或橫溢位|yes|六組收集清單皆空；字型loaded|
|47source、360build及HTTP綁同包前後不變|yes|原始逐檔SHA與7個HTTP body綁定|
|54WebP簽章與SHA吻合，QA程序退出|yes|verify-raw-r3-command.json，exit0；session19004已回exit0，browser已close|
|完整全站、節日遊戲、實體手機與逐glyph批准|no|本次限定網站／指南，未執行上述項目|

最終實際命令：

```text
node holiday-lab/reports/current-rules-20261024/qa/run.cjs http://127.0.0.1:8879/ .measure-current-rules-20261024-03 raw-r3
PASS zh 390 25/25
PASS zh 1440 23/23
PASS en 390 25/25
PASS en 1440 23/23
PASS ja 390 25/25
PASS ja 1440 23/23
{"pass":true,"contexts":6,"green":6,"sources":47,"build_files":360,"source_stable":true,"build_stable":true,"expectedCounts":{"cards":15,"steps":47,"faq":42}}
exit0，stderr空。

node holiday-lab/reports/current-rules-20261024/qa/run-verify-r3.cjs
pass true；contexts6／checks144／values408／source_values708／webp54／source_files47／build_files360。
exit0，stderr空。
```

raw-r3/result.json SHA256：**3f5912442685d9eb2c0a99892bf41ce40b043b30b8a6215a97880901445ce380**。最後verification.json為03版只讀重算摘要；原raw-r1／r2及它們的command／RED均保留不改。check-r2.cjs.txt保存上版方法。

六張新版視覺抽看見visual-review-r3.json：zh手機請假FAQ／桌面請假卡、en手機英文卡與來源註記／桌面英文FAQ、ja手機英文卡與來源註記／桌面請假FAQ。沒有宣稱所有54張均由使用者批准。

全部QA程序已結束；主控的8879本機伺服器handle12283仍保留，本代理未重啟或停止。未改產品、切branch／commit、測遊戲、Unity、push／發布、main／C節或刪檔。

## 下方保留02版驗收歷程

結果：8878／.measure-current-rules-20261024-02通過本次網站限定檢查。中、英、日各390與1440寬，共6組、138條檢查全yes。原始raw-r1的來源守門RED完整保留，未換成綠色或借其畫面批准第二版。

只檢查首頁導覽與在校指南；沒有開啟、測玩或修改節日遊戲、Unity或外部表單。完整全站發布、政策個案認定、實體手機及母語審查不在本結果內。

## 實際新版與資料綁定

- URL：http://127.0.0.1:8878/ ，指南 /?lang=zh#/students/guide，另以en、ja查同路由。
- frozen建置：.measure-current-rules-20261024-02，360檔；app-7Z4N7PF6.js。
- 首尾7個HTTP HTML／CSS／JS／guide原body SHA均吻合本機建置。
- 47份實際產品source（根目錄JS/JSX/CSS與data全部JSON）及360份build前後逐SHA相同。不是只比對mtime。
- 執行當時canonical為15卡、47步、42FAQ、63來源。FAQ從當時資料重算，未沿用舊34／37。
- 新譯文從當時生成locale-en.js／locale-ja.js讀取，對照當下新canonical；未拿raw提案內技術readability作畫面期待值。

## 逐項yes／no

|項目|yes／no|實測範圍與證據|
|---|---|---|
|三語桌面完整10條導覽|yes|1440寬3組；完整nav可見，漢堡按鈕不取代選單|
|三語手機選單可開關|yes|390寬3組，實際點漢堡及about連結後關閉|
|指南15卡，桌面三欄／手機一欄|yes|6組computed grid columns及卡數|
|身分索引6選項存在|yes|6組sg-identities按鈕數；本輪未重做所有身分組合|
|47步與每步小說明、42FAQ完整|yes|6組DOM計數，details與FAQ展開後讀取|
|請假／英文／證照／專題／升學5卡文案有譯文且渲染正確|yes|每組68目標欄位，合計408次觀察；段落以各卡文字範圍對照，FAQ以FAQ列表對照|
|新來源標題與白話閱讀說明三語有映射且出現|yes|每組26欄位（13來源的title/readability），合計156次觀察|
|5卡官方來源URL與新canonical一致|yes|讀取各卡sg-sources href逐筆對照；未點進外部網站或表單|
|教師卡仍13張，未重新抓78張遠端照片|yes|只數首頁卡；既存originals先核13原SHA，遇照片請求回本機原檔cache，明記不是遠端HTTP新驗收；未重拍人像|
|頁底入口仍招生後、頁尾前|yes|DOM前後關係6組；未點入口，iframe 0|
|頁面無console error、pageerror或HTTP≥400|yes|6組事件收集皆空|
|頁面無橫向捲動、字型載入完成|yes|首頁／指南收合／指南展開3狀態各6組|
|未誤載節日遊戲路徑|yes|禁止路由攔截清單6組皆空，不是啟動後再關掉|
|47source與360build前後穩定|yes|raw-r2/result.json兩組完整SHA及HTTP收據|
|54張直接WebP可讀且SHA吻合|yes|每組首頁、索引、5卡、請假FAQ、英文FAQ各9張；RIFF/WEBP簽章與SHA已複核|
|所有缺字／字型fallback逐glyph完成|no|只查字型loaded與U+FFFD，沒有把此項當全站glyph驗收|
|所有指南卡互動／所有來源全文再驗|no|只查本次5目標卡；其餘卡結構與計數保留，不重跑舊大量測試|
|全站或節日遊戲發布核准|no|full_project_approved false；未測遊戲、未push／發布|

展開資料使用受限collector把details.open設為true，讓每個目標段落及來源可讀；手機選單則實際點擊。未宣稱本輪逐一人工點完所有FAQ與每種篩選操作。

## 原始失敗與第二版真綠

raw-r1：8877／.measure-current-rules-20261024-01，6組畫面條件都綠，但整體exit1，source_stable false。當時五檔因主控提交後切分支而LF→CRLF，逐SHA診斷由主控保留於newline-diagnosis.json；守門依真實bytes拒絕是正確結果，不能自動忽略。

主控重新凍結02版並改8878，保證QA期間不切分支、不改產品／build，再以fresh raw-r2重跑相同六組，加請假與英文FAQ畫面。raw-r2 source_stable及build_stable均true，整體exit0。兩版證據並存。

新增只讀驗收器verify.cjs複查當下實體source/build檔、HTTP、六組欄位、54WebP及原始收據SHA；raw-r2成功，raw-r1仍必須被拒絕。曾在驗收器launcher尚未建立前誤呼叫run-verify.cjs而MODULE_NOT_FOUND；錯誤摘錄與工具完整輸出保留，之後建立launcher再執行，沒有修改UI收據或產品配合。

## 實際命令、stdout／stderr與exit

```text
node holiday-lab/reports/current-rules-20261024/qa/run.cjs http://127.0.0.1:8877/ .measure-current-rules-20261024-01 raw-r1
PASS zh 390 24/24
PASS zh 1440 22/22
PASS en 390 24/24
PASS en 1440 22/22
PASS ja 390 24/24
PASS ja 1440 22/22
{"pass":false,"contexts":6,"green":6,"sources":47,"build_files":360,"source_stable":false,"build_stable":true,"expectedCounts":{"cards":15,"steps":47,"faq":42}}
exit 1；stderr空。

node holiday-lab/reports/current-rules-20261024/qa/run.cjs http://127.0.0.1:8878/ .measure-current-rules-20261024-02 raw-r2
PASS zh 390 24/24
PASS zh 1440 22/22
PASS en 390 24/24
PASS en 1440 22/22
PASS ja 390 24/24
PASS ja 1440 22/22
{"pass":true,"contexts":6,"green":6,"sources":47,"build_files":360,"source_stable":true,"build_stable":true,"expectedCounts":{"cards":15,"steps":47,"faq":42}}
exit 0；stderr空。

node holiday-lab/reports/current-rules-20261024/qa/run-verify.cjs
raw-r2：pass true，contexts6，checks138，values408，source_values156，webp54，source_files47，build_files360；exit0，stderr空。
raw-r1：stderr「Overall receipt is not green / false !== true」，exit1（預期拒絕）。
launcher整體exit0，兩項實際退出碼均符合預期。
```

完整指令（含執行檔絕對路徑）與stdout／stderr在raw-r1-command.json、raw-r2-command.json、verify-raw-r2-command.json、verify-raw-r1-command.json。raw-r2/result.json SHA256：0e74615b8023b98efba5666f4408813ca684e4429f93bf466b80e6215f505669。

實際抽看新r2六張：zh-390-leave-faq、zh-1440-guide-index、en-390-english-faq、en-1440-leave-faq、ja-390-leave-faq、ja-1440-english-faq；內容與來源可讀、未見裁斷。另r1六張代表視覺抽看只留歷史，不作新版批准。視覺記錄在visual-review.json。

兩輪browser都已finally close、Node collector與launcher均已退出；最後session25520回exit0。主控保留8878伺服器handle87730不屬QA子程序，本代理未關閉或重啟它。未改產品／切branch／commit、刪檔、main／C節或啟動任何遊戲、Unity。
