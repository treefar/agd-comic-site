# WO-06 執行報告

分支 `codex/wo-06-fighter-spec`。狀態：規格交付完成，5/5；遊戲尚未開工、待使用者定案。未 push、未碰 main。

產出 `docs/design/fighter-homage/SPEC.md`（10節）與 `scene-shotlist.md`（8張拍攝需求）。未新增程式或美術。整併三方：採 Claude 名稱／課程招式與手機點擊；Codex 的溫和雜訊對手與作品恢復回饋；agy 的四職業與普攻／技能／奧義層次。三關各獨立 twist 與7–8項果汁，RM關閉項目、數值與聲音均明列。

## 真實資料核對表

以下每列由 Node 讀本 clone JSON，使用 find/some 精確字串核對，不從單一樣本推論：

| SPEC項目 | data檔／鍵 | 實際核對原文 |
|---|---|---|
| 格格3招 | curriculum.json tracks.key=anim | 手繪動畫、動畫分鏡設計、3D 角色動畫 |
| 回路3招 | curriculum.json tracks.key=game | 基礎程式設計、遊戲人工智慧、沉浸式體驗設計 |
| 網點3招 | curriculum.json tracks.key=art | 繪畫表現技法、色彩學、漫畫創作實務 |
| 混剪3招 | curriculum.json tracks.key=cross | 影音媒體製作、生成式 AI 應用、永續數位創作 |
| 第一關／S01 S02 S07 | labs.json slug=d0637 | 偶動畫實驗室 |
| 第二關／S03 S04 S08 | labs.json slug=d0604 | 電繪實驗室 |
| 第三關／S05 S06 | labs.json slug=d0631 | 動作捕捉實驗室 |
| 結算作品卡 | works.json id=stolen-recipe | 畢業專題《失竊的祕方》 |

faculty.json 只作師資總覽導覽，不把虛構角色與真人配對；未引用其他真人姓名、作品或課名。

## 實際指令與輸出

以 `@' ... '@ | node` 讀兩份 md 與 JSON：正規式檢查 `^## (\d+)\.` 得1至10連號；逐筆核對上述12課、3間實驗室、1作品；逐列照片檢查6欄完整，結果：

```text
COURSE PASS anim / 手繪動畫
COURSE PASS anim / 動畫分鏡設計
COURSE PASS anim / 3D 角色動畫
COURSE PASS game / 基礎程式設計
COURSE PASS game / 遊戲人工智慧
COURSE PASS game / 沉浸式體驗設計
COURSE PASS art / 繪畫表現技法
COURSE PASS art / 色彩學
COURSE PASS art / 漫畫創作實務
COURSE PASS cross / 影音媒體製作
COURSE PASS cross / 生成式 AI 應用
COURSE PASS cross / 永續數位創作
LAB PASS d0637 / 偶動畫實驗室
LAB PASS d0604 / 電繪實驗室
LAB PASS d0631 / 動作捕捉實驗室
WORK PASS stolen-recipe / 畢業專題《失竊的祕方》
SPEC PASS chapters=10 photoRows=8 urlMentions=6; no code/art created
```

`node --test tests/en-play.test.mjs`：tests 12 / pass 12 / fail 0。純文件沒有 build；沒有執行遊戲或拍攝，表中所有效能與工期數值皆是未實測目標。

實際 web open 的來源：

- https://www.lf2.net/en/intro.html → Little Fighter 2 Official Website；作者與1999創作年，原版保留權利。
- https://www.lf2.net/en/progress.html → Progress；`Release of LF2 version 0.1 25 Jan 2000`。
- https://www.lf2.net/ → Little Fighter 2 remastered；確認目前入口區分重製與原版。
- https://store.steampowered.com/eula/3249650_eula_0 → End User License Agreement (EULA) for Little Fighter 2 Remastered；讀§1、§2、§5，不將重製條款當成原版授權。
- https://www.lf2.net/en/terms.html → 無法讀取；原版完整再利用條款明列unverified。1999創作年與2000年可定位首版不同，兩者分開寫。

## 逐條驗收

1. yes：10節齊，12課／3實驗室／1作品精確核對通過。
2. yes：至少2個可開官方來源；實際開了4個有效來源，另列1個失敗網址。
3. yes：8張，每張有地點、機位、時段、用途、個別避拍事項。
4. yes：重讀全文與搜尋，無程序繪製角色／背景的提案，DOM僅呈現來源影像與純文字；Canvas備案限制亦明寫。
5. yes：新增本單兩個白名單文件；另有必交報告與既有codex-prompt-run2.txt。沒有其他修改。

## 需要使用者一次定案的選項

| 題目 | 選項（推薦置首） |
|---|---|
| 名稱 | 軸線擂台（建議）；靈感救援隊；動遊大亂鬥：專題大作戰 |
| 第一個交付 | 兩角三關，再擴四角（建議）；一角一關；一次四角三關 |
| 技術 | 原生DOM圖集（建議）；Canvas只呈現影像切片，先量測再定 |
| 暴力 | 紙片擊退散開（建議）；無血液誇張拋飛；僅推開與復原作品 |
| 原作致敬標示 | 製作紀錄列來源、遊戲原創名（建議）；說明頁明列非官方與未授權，發布前另確認 |
| 體積超標處置 | 減影格壓縮重測（建議）；先交兩角部分切片；等使用者另定體積 |

這是規格內的可選清單，不是已取得的定案。手機點擊、純文字UI、實景漫畫、單人對AI與雙人v2，依本工單已鎖，不重問。

`git diff --cached --stat` 於提交前執行，只含上述兩份設計文件與本報告；完整統計見提交。

## 六張工單接手索引

每張皆獨立從 feature/en-site-and-play-zone 建分支，沒有合併。回到該起始分支後，報告只存在各自分支；使用 `git show <分支>:work-orders/20261021/reports/WO-NN-report.md` 讀取，或 checkout 對應分支再開文件。

| 工單 | 分支／提交 | 驗收 |
|---|---|---|
| 01 | codex/wo-01-screenshots / af546c7 | 5/5 |
| 02 | codex/wo-02-tuning / 0fc88ab | 4/5，orbHitRadius原程式不存在，未改玩法 |
| 03 | codex/wo-03-credits / 1a43ec2 | 3/3，四款作者年份仍待補 |
| 04 | codex/wo-04-en-check / 9b46323 | 3/5，baseline certs驗證錯誤；混合句保留標記 |
| 05 | codex/wo-05-delete-list / 17ba8fd | 4/4，29檔只列不刪 |
| 06 | codex/wo-06-fighter-spec / 本提交 | 5/5，待使用者定案 |

最不確定：真手機上的點擊走位與四角圖集能否同時滿足3MB與可讀動作，必須用M2／M4實測，規格文件無法代替結果。下一個具體工作：主控先檢視WO-01截圖並補WO-03作者資料；另開允許修正certs標點的工單，才可讓WO-04原驗證器全綠。WO-06由使用者一次定案後才開新遊戲專案。
