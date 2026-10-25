# 2026-10-25 第十一階段：冤枉汪泡泡上移、競箱團標語框移到右上（8902）

source_agent: claude（Opus 5.5）；TF-GO。分支 `codex/poster-mix24`，基於 commit `61c3c830`，本階段改動未 commit／push／發布／main／刪檔，C 節未動。建置 `.measure-poster-mix-20261024-33-retry5`（`app-YATSR7D6.js`，前 4 次 Windows 暫時鎖檔，第 5 次 BUILD_EXIT=0）。

## 使用者要求
1. 「冤枉汪左邊的三個汽泡可以上移多一點，這樣才不會留白太多」
2. 「競箱團中的「動畫、遊戲…」這一框可以移到右上，剛好補留白」

## 做法
- 單張設定，不影響其他海報：`data/student-work-draw.json` 冤枉汪 `focus.bubbles: "top"`、競箱團 `focus.tagline: "right"`。
- `student-work-draw.jsx` 依設定在首屏框加 `data-bubbles`／`data-tagline`，標語框位移量 `--hero-tagline-dx` 依畫面寬度計算；窄畫面時清除。
- `student-work-draw.css`：標題靠右且 `data-bubbles='top'` 時泡泡移到第一列頂端；標題靠左且 `data-tagline='right'` 時標語框絕對定位到右上（與校名同高，右邊界留 3.5%）。

## 逐條 yes/no
| # | 項目 | 結果 | 證據 |
|---|---|---|---|
| 1 | 冤枉汪三個泡泡移到左上，小狗不再被壓 | yes | `pw-run-10/zh-1440-showcase-07.png` |
| 2 | 競箱團標語框移到右上空處，不壓角色臉 | yes | `pw-run-10/zh-1440-showcase-02.png` |
| 3 | 首屏 9 組尺寸語言 0 重疊 0 裁切、快捷鈕正確、Console 0 | yes | `pw-run-10/result.json`（`allAuditsClean:true, consoleErrors:0`） |
| 4 | 調整模式 15/15 | yes | `pw-adjust-run-05/result.json` |
| 5 | 單元 35/35（抽選 15、調整 9、指南 11；新增 2 條回歸測試） | yes | `node --test tests/student-work-draw.test.cjs tests/student-work-adjust.test.cjs tests/student-guide.test.cjs` |
| 6 | 全套測試 | 未跑 | 本階段只改首屏三檔與資料，未動全套那 3 項既有失敗相關檔 |

## 觀察
- 競箱團的三個泡泡仍在左下（使用者沒要求移動）。
- 驗收腳本沿用 `../r9/pw-verify.cjs`、`../r9/pw-adjust.cjs`。
