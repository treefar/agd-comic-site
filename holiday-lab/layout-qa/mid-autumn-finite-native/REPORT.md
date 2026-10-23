# 中秋有限原生訊息域：計數、10真例與720次效能先導

2026-10-23。唯一產出本資料夾；固定08 `http://127.0.0.1:8845`。產品、frozen sampler、asset map、contract、舊proof與服務完全未改。**本輪只完成先導，GLOBAL_BOUND仍NO，沒有啟動全集或完整矩陣。**

## 可達域，不拆錯time–x依賴

從served原module讀實際slider specs及submit handler：time300–1600、step50共27值；x0–80、step0.5共161值；size10–32、step1共23值。每幕99,981輸入，三幕299,943；純JS枚舉及去重用0.680秒，沒有把這些輸入送進瀏覽器排版。

每個輸入直接呼叫同served module的submit，在當幕用`x + speed*time/1000`算endX、再abs與toFixed(1)，時間用Math.round；因此time與x是同組計算，不將兩種誤差獨立展開，也保留JavaScript浮點及四捨五入的實際結果。只取alignment拒絕，排除accepted；UI範圍內不會產生invalid。每幕可達性另由真UI依序接受前幕的合法作品證實。

|幕|輸入|接受|拒絕|當幕唯一錯誤數值tuple|
|---|---:|---:|---:|---:|
|0|99981|581|99400|24908|
|1|99981|595|99386|31801|
|2|99981|574|99407|33920|
|合計／跨幕去重|299943|1750|298193|67448|

三幕錯誤使用相同三語template，數值tuple以實際格式化字串去重並保一組真輸入witness；跨幕同字不重複量。每語67,448個不同訊息、三語兩寬共**404,688次**原生排版。domain.json含全部精確slider集合、template literals、去重集合SHA、120個先導witness及10個真例；沒有保存或啟動新百萬排版批。

範圍僅alignment數值錯誤訊息；未試剪提示、正常說明與其它靜態狀態已有不同驗收工作，不能混稱此有限域已驗遊戲全部文字。

## 10組真操作先核對，再跑probe

10組真UI均透過fill＋input調slider，確認瀏覽器值等於指定step，再真preview到結束、真submit。phase1/2先真接受前幕 `[time900,x21.5,size20]`、`[1200,38,26]`，沒有注入round/state或改時鐘。拒絕後progress維持當幕，實際hint逐字等於同handler推導。10張true-*.png是這些真提示的viewport；未把clone圖冒充玩家畫面。

|例|語言／寬|幕|time／x／size|
|---|---|---:|---|
|0|zh320|0|300／0／10|
|1|zh1440|1|1600／80／32|
|2|en320|2|300／80／32|
|3|en1440|0|1000／45／15|
|4|ja320|1|300／0／10|
|5|ja1440|2|1600／80／32|
|6|zh320|0|900／21.5／32|
|7|en1440|1|1200／38／10|
|8|ja1440|2|750／0／18|
|9|ja320|0|1600／0／20|

這些例子涵蓋三幕、六context、零時間／位置／大小誤差、極端正負運動與不同小數。仍只是10個比對點，不以它們猜全域。

技術clone另開同8845 origin的頁面、載同lab.css，以原`#lab > #game-hint.hint`結構、所有computed longhands及原生成panel呈現；保實際寬／font／padding／border-image，僅把computed像素height與block-size回復auto，讓換字後依原規則長高。clone不進真game-hint寫文字，不作玩家截圖，明標probe。

文字與安全框量測**直接呼叫原sampleLayout.toString()**，函式SHA `c247641156d929b0de7d6aa70e509510e293a29d7d6ff45aaac99ad931e0dc1a`，map SHA亦與sampler-freeze-06一致。沒有自寫近似Canvas算法或outline＋guard替代。比較真hint與clone的完整行文字、baseline、Range advance、每行ink、整體ink、安全框與owner高度，統一減去各自owner外框原點；CDP實際字型集合亦相同。

10/10逐值一致，數值比較拒收NaN／空safe，預設0.05 CSSpx量化容差；實際整體relativeInk最大差只有`2.842170943040401e-14`。每個probe完整sampler violations為空。**這是經驗校準，不是對所有67,448字串的clone等價定理。**

pilot-01歷史保留：第一次用about:blank clone，Range／ink雖同，但sampler的paper／panel SHA fetch受CORS擋住、safe={}，所以整體0/10、未進先導。修正是先導頁取得同源，未放寬safe或修改sampler；pilot-02才有完整10/10與以下720量測。

## 720次先導實測與成本

從排序後全部tuple均勻取120個確定witness，六context各量120，共720；約各context全集的0.178%。不是只挑字數最長，也不以字數推墨跡。每候選在clone中實際改該probe文字、讓瀏覽器原生換行，再跑完整frozen Range／baseline／Canvas ink／source-paper驗證。所有120點在每context都保完整原生輸出。

|context|樣本|秒|筆／秒|推估67,448筆分鐘|
|---|---:|---:|---:|---:|
|zh320|120|6.188|19.39|57.97|
|zh1440|120|6.737|17.81|63.11|
|en320|120|4.991|24.05|46.75|
|en1440|120|6.440|18.63|60.32|
|ja320|120|6.615|18.14|61.96|
|ja1440|120|6.090|19.71|57.05|

六批純量測共37.059秒；按各context實測速率相加，順序全集估**5.786小時**。不含10例的真預覽、頁面啟動、全部結果持久化成本、長時間抖動或重試，因此不是承諾ETA。pilot-02/report.json約4.96MB，以相同完整輸出密度粗推全集約2.79GB，未實際配置該資料或開背景長批。

720個probe violations0、原safe內失敗0；這只證已量的720，不說找到全集最大值。觀察最小左右／上下餘裕與逐context最大值原始資料可由summary.json及report重算；摘要不以這些觀察值替換固定safe或先前global NO。

|context|先導最大ink寬|先導最大ink高|先導最多行|
|---|---:|---:|---:|
|zh320|212.546875|65.165146|3|
|zh1440|420.835938|14.929142|1|
|en320|213.414063|42.622466|2|
|en1440|417.656250|16.919695|1|
|ja320|211.273438|65.165146|3|
|ja1440|434.835938|14.929142|1|

寬／高／四邊extent為分開的觀察極值，不假稱由同一訊息同時達到；summary各項附key、真輸入witness與完整訊息，可回查原生輸出。這些僅先導極值，不是全集最大值證書。

## 第二先導方法提案，尚未執行

已用Babel AST讀原sampleLayout：50個頂層statement，文字node迴圈在`const clipping=clips(el)...safe=safeFor(el)`之前有21個statement，原始source範圍與完整片段存sampler-ast.json。可考慮用**AST原封擷取**該Range／baseline／Canvas ink前綴及依賴，不手動重寫算法：

1. 必須保document.fonts.ready、DOM normalize／visible／owner、canvas font與letterSpacing／wordSpacing、rect／num／union、scrollGuards／lockInternalScroll與cleanup。
2. 必須保grapheme Range分行、baseline marker不改Range／在原行的拒收條件、single-glyph native fallback、flex wrapper與cleanup、sx/sy縮放、stroke、actualBoundingBox、shadow/filter/rotation拒收。
3. 每批另先驗固定source／字型／skin SHA；原完整skin/clips／cross-node paint並未包含在ink前綴，**不能省略後仍叫完整gate**。候選專用函式只能輸出ink，原safe映射與最差候選仍須完整frozen複核。
4. 第二次有界試驗可重用本輪720與10真例逐值對照，任何文字分行／baseline／ink或拒收條件不同都NO。先確認一致再談速度；不以改成字數、outline或寬鬆誤差加速。

目前尚未製作或執行該fast extractor／第二批先導，無法宣稱會快多少。本輪也沒有對HTTP SHA、paint、雙RAF各自計時，不能把完整37秒武斷歸因某一項；AST顯示它們在原流程中，實際成本占比仍待第二先導量測。先交主控評估是否值得；不自動接續404,688筆全集。

## 實際指令與yes／no

```powershell
node holiday-lab/layout-qa/mid-autumn-finite-native/domain.cjs
# 299943 inputs；67448 unique tuple；404688 six-context native count；0.680s；exit0
node holiday-lab/layout-qa/mid-autumn-finite-native/pilot.cjs pilot-01
# 0/10 full clone match；CORS source receipt failed；pilot0；GLOBAL=NO（歷史失敗留存）
node holiday-lab/layout-qa/mid-autumn-finite-native/pilot.cjs pilot-02
# YES true0…true9；六context各120；FINISH trueMatched10 pilot720 sourceStabletrue GLOBAL=NO；exit0
node holiday-lab/layout-qa/mid-autumn-finite-native/inspect-sampler-ast.cjs
# source SHA同freeze、50頂層statement、21個ink前綴statement；secondPilotNotStarted:true；exit0
node holiday-lab/layout-qa/mid-autumn-finite-native/verify.cjs
# 離線；10真例、720 witness、原函式/來源一致、完整數值與safe、成本summary機算；exit0
```

|條件|yes/no|
|---|---|
|UI三幕有限域與handler格式化精確，time-x依賴保留|yes，domain.json及served原source snapshot|
|10組真DOM拒絕與來源相同、前幕真通過|yes，pilot-02真例含progress與文字assert，10真viewport|
|10組真hint與同源clone完整行／ink／safe／CDP字型相同|yes，差異門檻內，實際ink差約浮點誤差|
|最多1000候選先導限制|yes，本次720 probe，未啟全集|
|720探針是真玩家畫面|no，技術clone，僅10真例有玩家截圖|
|全部67448訊息已量、原生最長墨跡或global bound已證|no，GLOBAL仍NO|
|第二個加速先導已跑或有已證速度收益|no，僅AST依賴盤點與提案|
|產品／sampler／map／契約／舊proof／服務被修改|no|
|push／main／刪檔／完整矩陣／生圖|no|

四個served來源前後一致；原module原bytes另以base64封存，離線驗證不依賴工作樹EOL或仍在線的server。最終summary.json的計數、秒數、餘裕均由原始輸出重算。未將L0工具exit0寫成全面UIgate或可交付包。

後續紀錄：主控另批准的第二個720對照先導已完成，詳見`SECOND-REPORT.md`與`summary-second.json`。本文件上列「第二先導未跑」是第一先導結案當時狀態，保留原始時序；未啟全集與GLOBAL_BOUND=NO仍成立。
