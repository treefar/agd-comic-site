# 日文1440缺漏兩路線：原生補測結果

只補 semester / ja / 1440 的 graduation-first、credit-first，單次 launch，未重跑原已完成10路線。collector PID 22768，driver PID 69380，工具 session 27559；開始 2026-10-23T03:01:25.189Z，結束 2026-10-23T03:09:34.765Z，實際 exit 0。

新 run：`C:\agywork\agd-holiday-prototypes\holiday-lab\layout-qa\phase-runs\2026-10-23T03-01-25-509Z`。原 collector flags 為 `--games=semester --languages=ja --widths=1440 --semester-orders=graduation-first,credit-first --phase-only=1 --canonical=1 --all-errors=1 --button-states=1 --scrolls=1 --sharded=1`，origin 8845；完整 argv／來源 pre SHA 在 manifest.json。driver 以 windowsHide/headless 單一程序執行，STATUS存在即拒絕重啟。

## 玩家路線與逐項驗收

| 路線 | frame數 | 原 session 狀態 | 真重播 | controls捲動組 | 作品全文 Range 聯集 |
|---|---:|---|---|---:|---|
| graduation-first | 342 | route-complete-layout-not-certified | 0,1,2,3 | 49 | 1801/1801，missing 0 |
| credit-first | 342 | route-complete-layout-not-certified | 0,1,2,3 | 49 | 1799/1799，missing 0 |

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 只啟動一次、只補指定2 sessions | yes | STATUS.json、argv |
| 兩路線完成、各實播0/1/2/3 | yes | 原 session/replay_seen，不修改原狀態 |
| 684 fullshards SHA／原完整c深比／sample／圖片SHA | yes | case-receipts.json逐index保留，verify exit0 |
| 獨立重算 geometry=0 | yes | inspectReport逐case重算並與原geometry_errors深比 |
| 控制區全部實際捲動組完整 | yes | 原domain/text穩定、missing空 |
| 作品全文 Range聯集完整 | yes | 原捲動receipt，未當成全墨跡上界證明 |
| console／page／HTTP錯誤為0 | yes | 原sessions arrays |
| 新run served前後與disk來源穩定 | yes | collector真after==before＋獨立HTTP13檔含bytes／SHA／時間 |
| 13個舊before／新before／新獨立after逐鍵相同 | yes | source-comparison.json，三個觀察點 |
| method flags全清／全案通過 | no | 原978筆flags保留；full_project_approved=false |
| 原recovery未知1flag／原after缺口已補成原收據 | no | 不改原metadata／unknown1，不偽造原collector after |

method flags分類：`{"TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT":428,"SCROLL_CONTENT_PENDING":550}`。geometry0與捲動文字可達不能抹掉原凍結sampler的method flags，也不宣稱所有日文字形墨跡上界已證。

## 來源相等的精確範圍

source-comparison.json證明13個來源在「舊run before、新run before、新run結束後獨立真HTTP after」三個觀察點逐鍵bytes SHA相同；新collector自己實際after map也與before相同。這**不是舊collector自己的after，也不宣稱整段期間連續不可變**。原unknown1與fullmethod NO保留，case覆蓋另列。沒有產生composite，case-session-index.json只索引這次2個完整sessions，由主控決定與原10完整sessions整合，原partial不能因此收編。

## 指令與保留資料

實際 `node driver.cjs` → collector terminal exit0；原stdout／stderr／combined逐bytes保留，stdout結尾為 `PARTIAL_RED 684 frames; geometry=0`。`node verify.cjs` → exit0；`node source-comparison.cjs` → exit0。完整stdout見verify-output.txt／source-comparison-output.txt，沒有更換sampler／safe／contract或繞過gate。

完整fullcase物件保存在原phase-runs新run分片；readLayoutReport按需驗每片SHA／identity，verify另和同run .case.json、sample nodes/blockers/replay_shot、原圖SHA逐筆比對。case-receipts.json保留每個原index、ID、intent、fullshard檔名與SHA，不按重複ID去重。fresh-run.manifest.json是原manifest bytes快照，相關片段路徑仍從原run解析；沒有確認完整raw跨機備份。

只在本白名單新增QA檔，collector依正常行為產生ignored phase-runs並更新phase-latest；未手動修改其他檔、未switch／stage／commit／push／main／刪檔，未重啟其他live collector。
