# 十款節日遊戲獨立試玩

2026-10-22，source_agent: codex，受測本機候選 `.review-local-04`。結論：十款都能操作完成，但目前更接近「有插圖的創作練習」，還不能把技術通關當成遊戲體驗完成。優先修兩個成品回放問題，再改善照抄目標數字的工作感。

## 範圍與缺口

- 使用 Chromium 151.0.7922.34、1440 × 1000、真實 DOM 按鈕及滑桿、正常速度預覽。未直接匯入遊戲規則、未呼叫 `ctx.complete`、未修改產品狀態跳關。
- 先另跑 `probe.cjs`，從十款實際畫面收集說明、按鈕、滑桿與提示，再跑錯操作 → 調整 → 完成 → 三個回放鏡頭 → 重開。
- 繼承脈絡與既有 QA 已包含解法，故這是獨立代理試玩與說明檢視，不是學生盲測。下表把可見說明與解法輔助分開，不冒稱首次自行解出。
- 時間為代理自動操作時間，包含部分截圖與正常預覽，排除開場及回放；不是新手平均值，也不能據此證明一般玩家能在 30–90 秒完成。
- 角色要求的 `docs/prompts/MASTER_PROMPT_zh-TW.md`、`docs/policies/priority-rules.md`、`docs/policies/output-contract.md`、`docs/reference/review-theory-map.md` 在本工作樹、C:/Projects 與已查技能路徑找不到。本報告採 P0–P3、影響、證據、重現與 yes/no 修正判準，未宣稱遵循未取得的契約。
- 本輪未測實體手機、真人學生、母語語感、真實背景分頁暫停；未進行使用者美術確認。

## 驗收結果

| 項目 | yes／no | 實際證據 |
|---|---|---|
| 十款都有完整可見說明與控制項 | yes | `ui-probe.json` |
| 每款錯操作都未直接過關 | yes | `trial.json` 的 `wrongBlocked` 與 `failureFeedback` |
| 十款均由 DOM 操作完成 | yes | `trial.json` 的十個 `pass:true` |
| 每款至少看到三個實際回放鏡頭 | yes | 各 `replayCaptions` 與回放截圖 |
| 每款重開回到 0/3 | yes | 各 `reset:true` |
| 未捕捉到未處理頁面例外 | yes | `errors:[]` |
| 玩具配音成品回放會播放三種材質聲 | no | 預覽有 wood/metal/paper；回放只有 click，見 P1-01 |
| 月光剪接成品回放保留切前移動 | no | 350ms 仍停在 21.5%，切後突然變 35%，見 P1-02 |
| 已證明真人新手能於 30–90 秒完成 | no | 本輪是代理操作，沒有真人樣本 |
| 使用者已確認美術與好玩程度 | no | 尚未取得使用者對話確認 |

## 逐款判斷

| 遊戲 | 可見說明與解法使用 | 自動操作至結果 | 判斷 | 最應保留／改善 |
|---|---|---:|---|---|
| 明年的第一格 | 直接顯示三格目標時間與容許誤差；本輪已知解法，另試 300/300/300 被拒 | 5.93秒 | 應改善 | 起步/騰空/落地預覽可保留；先讓玩家看失衡動作，再由需要時展開數值提示 |
| 年獸表演課 | 直接顯示眉眼嘴/鞠躬四個目標；另試更誇張的驚喜仍被拒 | 1.34秒 | 應改善 | 原創角色與即時表情有記憶點；目前窄容許範圍把表演變成四個數值對答案 |
| 燈影借位 | 顯示投影位置、距離及順序目標；本輪以既有解法協助對齊 | 1.66秒 | 可保留題材，改善引導 | 光、紙、影的因果有潛力；一開始四項控制全開且背景燈/可動燈並存，需突出正在改哪一個因果 |
| 玩具聲音偵探 | 材質名稱與碰撞標記足以理解目標；本輪用已知 cue，第一段採可接受變體750ms | 9.86秒 | 可保留，先修P1 | 不靠聲音也能完成可保留；但「播放我的作品」應真正播放自己的配音 |
| 粽葉折疊局 | 文字直接提供左→右→上與140/140/160度；本輪依此完成 | 1.75秒 | 應改善 | 展開重試與葉面概念可保留；順序/角度已寫成答案，且未形成需要觀察空間關係的抉擇 |
| 月光剪接台 | 顯示時間、目標中心、大小、速度；本輪沿既有起點解法完成 | 4.46秒 | 可保留題材，先修P1 | 移動預覽可教形狀剪接；成品目前展示的跳位會反過來破壞教學 |
| 老師，這格謝謝你 | 動作與台詞語意可讀；每格合法停頓區間未顯示，本輪使用既有解法輔助 | 7.62秒 | 可保留，改善評分 | 感謝主題、不同台詞及停頓作品可保留；減少固定動作配對與失敗次數扣分 |
| 島嶼場景工作室 | 顯示鏡頭、海岸、山目標及遮擋狀態；本輪使用既有位移組合 | 1.51秒 | 應改善 | 前中遠景視差值得保留；畫面較像擺展示卡板，數值校準感比取景成就感強 |
| 新生第一張地圖 | 所有站點座標與辦事順序直接可見；本輪依同一路線完成 | 0.97秒 | 應改善 | 真指南連結可保留；空白5×3移動只考照座標按方向，沒有窗口選擇或資訊判斷 |
| 畢展策展接力 | Y、間距、資訊卡三個限制清楚；本輪使用22/52/82的變體配置 | 5.27秒 | 優先保留 | 相同限制有多個有效布局，玩家選擇真的留下來；再讓三種作品有不同觀眾需求與取捨 |

上表「可保留」表示題材或核心因果值得繼續，不是正式美術或發布驗收通過。「應改善」也不等於完全不能試玩。沒有證據支持把任何題材永久判為不適合；不適合當作完成版交付的是「直接照數字填表就結束」的呈現方式。

## P0

本輪未重現會阻止十款完成、造成資料破壞或需要立即停站的 P0。

## P1-01：配音回放沒有配音

- 影響：玩家核心成果是材質與聲音落點，結果只保留字幕與圖像，按「播放我的作品」卻聽不到自己的作品。
- 重現：玩具聲音偵探 → 開聲 → 木750ms、金屬1200ms、紙1700ms依序預覽及保存 → 完成 → 播放我的作品 → 看完三段並多等2秒。
- 證據：`trial.json` 中 `children.previewAudio` 實際捕捉到 `wood.ogg`、`metal.ogg`、`paper.ogg` 的 `HTMLMediaElement.play`；`children.replayAudio` 只有 `click.ogg`。截圖見其 `replayScreenshot`。
- 程式核對：`holiday-lab/runner.mjs:52` 的 `replay` 只依 duration 切換 sprites/caption；`holiday-lab/games/children.mjs:15` 的成品資料有 cue 文字但無實際回放聲音安排。
- 修正判準：開聲回放時每段實際在保存的 cue 播一次正確材質聲 yes/no；重播、關閉與靜音不殘留/不重複 yes/no；靜音仍可見材質與落點 yes/no。

## P1-02：100分剪接成品仍出現圓心跳位

- 影響：原預覽教玩家讓移動的圓接上參考位置；成品回放卻停在起點，再跳到終點，削弱成果與「match cut」的教學因果。
- 重現：月光剪接第一段時間900、起點21.5、大小20，完成三段 → 回放。第一鏡0ms與350ms均為21.5%；第二鏡變35%。
- 證據：`replay-motion.json` 保存三個實際 DOM 樣本，artifact 同時保存 `start=21.5`、`endX=35`、`speed=15`、`score=100`。`replay-motion.cjs` 可獨立重跑。
- 程式核對：`holiday-lab/games/mid-autumn.mjs:38` 將切前鏡頭的 sprite 寫成 `x:cut.x`；共用 `replay` 沒有執行切前位移。
- 修正判準：900ms內圓心從21.5連續移到35 yes/no；切換前後圓心與大小相接 yes/no；換一組可接受起點/時間後回放也隨之改變 yes/no。

## P1-03：創作題目被數值答案主導

- 影響：核心循環容易變成讀數字→拉滑桿→送出→換下一組數字。玩家可執行但缺少觀察、猜想、測試、掌握的轉變；動畫、表演與景深題材的辨識度被相同表單操作稀釋。
- 證據：`ui-probe.json` 的跨年、年獸、粽葉、中秋、國慶均直接列出目標參數；`trial.json` 的年獸誇張驚喜被拒，錯誤提示只說睜眼/展笑/鞠躬。`lunar-new-year-exaggerated-surprise.webp` 及新版時間戳同名畫面留存。
- 注意：這是遊戲設計判斷，不是「完全沒有不同規則」的指控。十款確有不同邏輯，問題是玩家表層抉擇與學習循環太接近。
- 修正方向：第一幕只處理一種因果；第二幕加一個可觀察干擾；第三幕容許多種有效創作。目標值改為需要時才展開的提示；成功優先取決於玩家能感知的結果，而非抄到參數。
- 修正判準：不展開精確數值提示也能從畫面辨識失敗原因 yes/no；至少兩個明顯不同作品可完成 yes/no；每款第三幕新增不同抉擇而不是只換目標值 yes/no。應另找真人學生驗證理解，不能用本輪秒數代替。

## P2

1. **失敗提示與調整方向不對應。** 年獸四個參數任一超差都回同一句，跨年只說停格太久/太短，不指明哪一格。證據 `failureFeedback`、`flatTimingFeedback`、`exaggeratedSurpriseFeedback`。應先指出可見現象，例如「騰空幀來不及看清」，再給必要提示。
2. **學習嘗試被當作扣分。** 教師漫畫同樣正確的三格，先試錯一次後結果97；`teachers.mjs:9` 依 attempts 扣分。對創作入門練習會鼓勵照解法一次做對，抑制試看別句台詞。應改以成品可讀性或玩家自選挑戰評分，探索不扣隱藏分。
3. **校園辦事只剩座標搬移。** 三站位置全部列出且沒有資訊/路徑取捨，四方向按鍵可在約1秒代理操作完成；地圖是虛構並已明示，這點沒有誤導，但辦事內容尚未被玩法承接。可改成選擇「要改選課程／借用設備／詢問作品」對應窗口，再連真指南。
4. **部分場景素材像展示卡板。** 島嶼及月光的卡板、道具很多，但主角/正在對齊的物件偏小。見兩款 initial/replay 截圖。優先放大當下因果，淡化旁觀參考卡，避免需要靠右側數字理解全部事情。候選美術仍待使用者確認。

## P3

- 先挑玩具配音、燈影、策展作為第一批玩法深化：各自有聲畫同步、投影、空間配置三個容易展示差異的因果。這是依本輪畫面與規則作的排序，未經學生偏好調查。
- 結果頁可增加「再做一版、比較兩版」的明確動機，保留上一版而不是只歸零。先完成核心回放，再做分享或節日獎勵。

## 實際執行輸出

```text
node holiday-lab/player-review/probe.cjs
exit code 0
十款 controls / hint / inputs / buttons 已寫 ui-probe.json

node holiday-lab/player-review/browser-trial.cjs
YES new-year: wrong blocked, complete=5.93s, replay=3 shots, reset=yes
YES lunar-new-year: wrong blocked, complete=1.34s, replay=3 shots, reset=yes
YES lantern: wrong blocked, complete=1.66s, replay=3 shots, reset=yes
YES children: wrong blocked, complete=9.86s, replay=3 shots, reset=yes
YES dragon-boat: wrong blocked, complete=1.75s, replay=3 shots, reset=yes
YES mid-autumn: wrong blocked, complete=4.46s, replay=3 shots, reset=yes
YES teachers: wrong blocked, complete=7.62s, replay=3 shots, reset=yes
YES national-day: wrong blocked, complete=1.51s, replay=3 shots, reset=yes
YES semester: wrong blocked, complete=0.97s, replay=3 shots, reset=yes
YES exhibition: wrong blocked, complete=5.27s, replay=3 shots, reset=yes
TOTAL 10/10 completed; errors=0
exit code 0

node holiday-lab/player-review/replay-motion.cjs
first: shot0 left21.5%
second (+350ms): shot0 left21.5%
after (+1000ms): shot1 left35%
firstCut: time900, x21.5, size20, endX35, speed15, score100
noMovementWithinFirstShot: true
exit code 0
```

初次試玩腳本以 `innerText()` 讀取收合 details 內的 artifact，測試器得到空字串而解析失敗，十款其實均到達結果頁但未完成回放檢查。已保留 `trial-harness-red.json`，改用 `textContent()` 後重跑完整十款。這是測試器修正，不計成遊戲產品故障或假稱先紅後綠的產品修復。

## 建議交付判斷

可以交主任作本機試玩並保留現有十款；先不要以「十款已完成、配音/剪接作品回放完整、已證明好玩」作公開發布結論。下一步先修 P1-01、P1-02並依同一實際 DOM 測試複驗，再以其中三款改善玩家抉擇與可見因果。P1-03需要玩法迭代與真人學生觀察，單純把數字藏起來還不夠。
