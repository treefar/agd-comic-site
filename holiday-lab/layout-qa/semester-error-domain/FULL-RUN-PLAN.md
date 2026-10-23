# Semester error-longest：工程續跑計畫，待root查碼批准

目前只完成來源投影、既有收據逐句核對與6個原生校準。沒有啟動全集，不產正式layout-report，不把剩餘6個error-longest標為通過。

## 固定來源與資料入口

- HTTP固定08：`http://127.0.0.1:8845/holiday-lab/`。module raw SHA `b184437bf226354f8602ed5567c4ac941bff6539176f9575cf737a808d7fbcc9`，16,626 bytes。`source-receipts.json`保存12檔HTTP body／狀態／bytes／時間，`source/`保留實際內容。
- 遊戲pure core就是同一個semester.mjs內的exports，沒有另找一個不存在的core檔。runner的UI選項callback、進度、hint、pause與result另逐讀；所有state寫入與callback函式位於`source-causal-audit.json`，不改原函式。
- 只讀`semester-session-composite/evidence.json`，12完整session；原10完整＋新JA1440兩路，原partial不收編。`source-causal-audit.json`從實際session取288筆錯誤feedback，逐筆精確等於原模組來源投影。未重跑684或2964。

## 聯合域與因果

每個狀態保留`round, selectedTask, selectedWindow, position, ordered visits(taskId/windowId), current hint`，用原pure exports轉移。route／attempts只從遊戲文字投影移除，沒有從結果JSON或result範圍移除。以移動數最少、再事件數最少持續鬆弛到固定點，共4,695個文字狀態，每筆保合法UI事件witness；不是從一個語言或一條路線外推。

|來源／owner|精確範圍與guard|
|---|---|
|task選項|第0幕只有course-plan；第1幕只有course-record；第2幕兩鍵都可點，已完成者會出task-completed拒絕並保留原state。|
|window選項|department／academic／classroom三項，先選task才能成功；不是任意識別字輸入。|
|wrong-window|course-plan/classroom；course-record/department、classroom；graduation/classroom；credit/department、classroom，共6組。每組獨立取stop.name＋該task.next，三語分別實值，不用翻譯字數推測。|
|game-hint|19種全部來源值，其中12種拒絕文字、其餘7種初始／選擇／成功提示。每種19/19均以未改原mount重播witness、逐owner三語深比。|
|progress|可持續遊玩幕為0/3、1/3、2/3；完成同步寫3/3後queueMicrotask進result。終局屬既有result證據，不把game/error-longest假造為可停留的第3幕。|
|semester-plan|task為本幕可選值或空；window為選定三窗口或空；第2幕已問數只有0/2、1/2。它與實際visits／hint／guide聯合，不能獨立笛卡兒亂配。|
|semester-position|column 1..5、row 1..3；steps為`state.route.length-1`。成功move新增一點；碰邊不新增、不render，但保留edge提示；選擇與詢問可在同位置改hint。|
|guide/link/note|shown=selectedTask或最後完成task；否則在校指南。course-plan/course-record共course-selection；graduation與credit各自卡片。第3幕兩種先後皆保留，完成第一件後last會不同。|
|attempts/result artifact|拒絕與成功詢問都增加attempts；遊戲畫面沒有attempts讀值。它與任意繞路都存入結果JSON，**不宣稱artifact全文集合有限或已全部驗證**。|

第三幕不是「意圖選擇」控制器，而是兩個任務完成順序。domain同時列`graduation,credit`與`credit,graduation`的實際成功witness，不能借用new-year的intent參數。

不可達的pure guard單列：非現有task/window識別字、無效方向不在正常UI；round>=3時callback先return或runner已卸載，沒有done錯誤文字；makeResult的throw不是正常UI提示。鍵盤四向與方向鍵同go；焦點在button/a/input/select/textarea時onKey忽略。pause時controls inert且runner不轉送key；resume把hint改回blurb，此分支納入投影。

## 尚未閉合的數值域

遊戲沒有步數上限。對每個投影狀態，保存最短合法move數m；可在合法路徑插入來回兩步，回到相同文字狀態，所以符號域是`n >= m`且`n % 2 === (x+y)%2`。成功Array長度帶來保守語言上界`n <= 4,294,967,294`；這**不是說瀏覽器資源能實際完成所有值**，也不是產品限制。實際成功分配的UI軌跡才是可達域。

數值十進位最多10位，不能以「10位都同寬」「挑8888888888」「用最多字數」替代證明。英中日的prefix/suffix、換行、font fallback、數字pair shaping與末位parity都必須聯合；目前這部分維持NO。

## root批准後的最小充分工程路徑

1. 先批准語意投影／witness／來源與callback完整性。凍結domain、method、font、skin SHA。完整finite文字投影為4,695×6context=28,170筆；不要立即把它當原生全跑數量，先依**每owner的原始可見文字＋固定寬／font／safe／clip／有效layout分支**做可驗等價去重，保留每筆來源對映，不能跨owner或跨意圖亂併。
2. 12種拒絕hint的72 context先用既有12session原完整case／scroll收據精確尋找。task-completed是舊error-driver未明列的可達分支，先查原case再定向補；未找到即NO。不得因288條既有feedback都能比對，就推成所有12拒絕都已有原生墨跡證據。
3. 對動態`semester-position`另建**明標技術probe**：直接使用保存的完整文字／原font／原owner固定safe／clip，建立帶最小值、上界、奇偶限制的十進位prefix DAG。先證實原生Range/Canvas的整串shaping與分段模型一致；若有kerning、fallback或wrap歧異，就不能用獨立digit最大值洗過。
4. 若能建立嚴格保守glyph/layout界，需逐prefix狀態保存可驗上界、真可達極值witness及反例。界不能放大safe，也不能把所有n生成一大JSON。若界仍跨安全區，停止NO，交root產品決策；不可自行加遊戲步數上限、改文案或縮字。
5. 工程executor若需要：固定512 bounded batch、逐筆NDJSON、每筆case/source/font/skin/method guard、rolling SHA、全索引及checkpoint；未驗完的batch不算complete，不自動重啟。先一批經獨立code review，再由root授權全量。這輪未啟任何全集executor。
6. 每個真極值回正常UI／原frozen sampler與viewport截圖複驗，保留原method flags；六個game/error-longest仍須全owner閉合，不能由hint有限集合通過直接關掉secondary數值義務。

## 已做原生校準的精確範圍

6個session，三語×320×900／1440×1000；手機credit/department錯窗口，桌機graduation/classroom錯窗口，使用domain保存的真control點擊，未注入game state、未改時計。每個七個動態owner字串與投影完全相同。保存原sampler完整nodes/blockers／viewport WebP／CDP各owner字型前後／來源12檔前後收據；geometry0，但桌機3組共6個原SCROLL flags保留。

CDP實際字型是Microsoft JhengHei UI Regular／Bold，custom=false，包含750/800權重映射；沒有猜成Segoe或Noto。第一個`.control-label`屬第0幕，進第2幕後hidden，因此after glyph list空，這不是字型缺字。verify只在此精確selector＋2/3狀態承認無paint；其他仍有paint的regular/bold角色前後必一致。系統msjh.ttc／msjhbd.ttc有登錄名稱及post-run bytes SHA，但**沒有捏造pre-run字型檔bytes收據**；這是未閉合項，後續批次必在開始前加檔案收據。
