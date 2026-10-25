# 2026-10-25 第十階段：套用使用者調整、資訊面板精簡（8902）

source_agent: claude（Opus 5.5）；TF-GO。分支 `codex/poster-mix24`，未 commit／push／發布／main／刪檔，C 節未動。建置 `.measure-poster-mix-20261024-31`（`app-7OT6BK5U.js`，BUILD_EXIT=0）。

## 使用者提供
1. 調整模式匯出的 5 筆設定（`user-adjust-2026-10-25.json`）：TV 秀、喀嚓、癒光之音、Dear All Robots、競箱團。
2. 「靜態模式」放到面板上方空白處，讓下方不留白、面板變小。

## 逐條 yes/no
| # | 項目 | 結果 | 證據 |
|---|---|---|---|
| 1 | 5 筆設定寫入 `data/student-work-draw.json` 的 `focus.manual` | yes | `node scripts/apply-poster-adjust.cjs` 輸出 5 行；單元測試驗證 manual 合法 |
| 2 | 「左右位置」在放大 100% 時不影響畫面 | 說明 | 海報寬度等於畫面寬度時沒有左右空間；放大超過 100% 才生效 |
| 3 | 靜態模式移到資訊面板右上（與作品名同列） | yes | `pw-run-09` 截圖；面板少一行 |
| 4 | 首屏 9 組尺寸語言 0 重疊 0 裁切、快捷鈕正確、Console 0 | yes | `../r8/pw-run-09/result.json` |
| 5 | 調整模式 15/15 | yes | `../r8/pw-adjust-run-04/`；兩條測試假設依新資料更新（下一張不再必然無手動設定；清空草稿後只剩資料內設定），非產品變更 |
| 6 | 單元 22/22（抽選 13、調整 9）、指南 11/11 | yes | `test-*-command.json` |
| 7 | 全套 68/71 | no（3 既有失敗） | `test-all-command.json`、`guard.json` |

## 觀察
- Dear All Robots 依使用者設定，露出馬路、車子與機器人上半身，腳與貓在畫面底部。
- 冤枉汪、今食堂、癡迷的現實沒有手動設定，仍用自動取景。
