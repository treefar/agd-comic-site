# 2026-10-25 第七階段：回到滿版裁切（8902）

source_agent: claude（Opus 5.5）；TF-GO。分支 `codex/poster-mix24`，未 commit／push／發布／main／刪檔，C 節未動。建置 `.measure-poster-mix-20261024-20`（`app-3IXDAG4I.js`，`BUILD_EXIT=0`，紀錄 `../r4/build-20.log`）。

## 使用者裁定
不喜歡「整張縮小＋模糊底」；回到之前「整張滿版、只取部分畫面」的模式。切不好的告訴使用者，由使用者換海報。

## 改了什麼
- `student-work-draw-model.js` `compose()`：一律滿版（cover）。主角上下範圍放得進就置中；放不進時從主角頂端開始取景（保住臉），並回報 `fits:false`。
- `student-work-draw.jsx`：移除模糊底那張重複圖。
- `student-work-draw.css`：移除完整顯示模式與相關泡泡規則。
- `data/student-work-draw.json`：冤枉汪主角範圍改 [0.45, 0.88]（小狗＋門下半）。
- 其餘保留：8 件、作品資訊面板右下、快捷按鈕第二畫面出現、亮點泡泡左下單列、海報預先載入、繪製前套用構圖。

## 逐條 yes/no
| # | 項目 | 結果 | 證據 |
|---|---|---|---|
| 1 | 8 張全部滿版、無模糊底 | yes | `pw-run-03/result.json` 8 張 fit=cover；建置檔內 `swd-backdrop` 0 次；單元測試斷言 |
| 2 | 首屏 0 重疊 0 裁切（9 組尺寸語言）、快捷鈕首屏隱藏捲過出現、Console 0 | yes | `../r4/pw-run-03/result.json` |
| 3 | 單元 13/13、指南 11/11 | yes | `test-draw-command.json`、`test-guide-command.json` |
| 4 | 全套 59/62 | no（3 既有失敗，相關資料檔未改） | `test-all-command.json`、`guard.json` |

## 切不好的（請使用者決定是否換海報）
1440×900 目視（`../r4/pw-run-03/`）：
- **癒光之音**：大臉完整；手上的小角色在左下被亮點泡泡擋住一部分。
- **Dear, All Robots**：機器人頭與身體在；腿下半與手提箱被右下作品資訊面板擋到，貓被泡泡蓋到一點。
- **冤枉汪**：小狗與門完整；窗台的貓頭被切到。
其他尺寸（單元測試列出）：1920×1080 等較寬畫面時，今食堂、TV 秀、喀嚓、癒光之音、Robots、冤枉汪的主角都放不進，會從主角頂端取景。

## 未做
真機、母語、完整 WCAG、手機版、英日頂欄 1280–1599 仍兩列、1920 寬的逐張截圖。
