# 和平紀念日：實際聆聽預覽六情境

資料：`runs/2026-10-23T02-38-30-428Z/report.json`。這款遊戲沒有獨立預覽按鈕；此證據記錄正常操作後的聆聽期間。沒有修改時鐘或直接寫入遊戲狀態。

| 驗收 | yes/no | 證據 |
|---|---|---|
| 中英日各 320／1440 寬度 | yes | 六個互異情境 |
| 量測及截圖前後仍顯示聆聽、進度為 0 | yes | before／after |
| 隨後自然完成聆聽、進度變 1 | yes | collector 實際等待、natural_completion |
| 原始完整 sampler、幾何錯誤 0 | yes | sample／full_case、離線重驗 |
| 實際 viewport 圖片 SHA 相符 | yes | 六張 PNG |
| 遊戲與 UI 資產量測前後不變 | yes | before／after source receipts |
| 整個專案 UI gate 已通過 | no | 原始 method flags 保留，其他要求尚未完成 |

實際重驗指令：`node holiday-lab/layout-qa/peace-listen-preview/verify.cjs`。輸出另存 `verify-output.txt`。
