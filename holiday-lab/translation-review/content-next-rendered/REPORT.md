# 第一批新消息與作品：可見文字與字型驗證

source_agent: codex。原始量測版03固定在8840；不是後來08或全站的畫面認證。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 13筆新譯值與一段中文正式公司名，兩寬目標出現 | yes | `node holiday-lab/translation-review/content-next-rendered/audit.cjs http://127.0.0.1:8840 all` →28/28、來源前後一致；`command-output-with-wait.txt` |
| 實際文字Range／owner與頁面水平溢出 | yes | `runs/2026-10-22T17-24-23-485Z-all/audit.json` 含每項raw、Range、owner及viewport截圖，頁面錯誤0 |
| 實際字體＋逐字可用性 | yes | `python holiday-lab/translation-review/content-next-rendered/coverage.py --audit holiday-lab/translation-review/content-next-rendered/runs/2026-10-22T17-24-23-485Z-all/audit.json` →CASES28/28、CHARACTER_PAIRS4188、MISSING0、UNKNOWN0、FONT_PARSE_ERRORS0；coverage.json保留font SHA與對映方法 |
| 原17/28視為產品缺字或缺資料 | no | 首次只等#root導致抓取過早；改等真正目標文字後28/28。初次raw保留，不冒稱11項產品bug |
| 後續44／82、全站字型、所有上下文字形與墨跡 | no | 本次只此批delta；字族fallback聯集與同樣式逐字探針不能取代所有塑形、邊框／遮擋驗收 |

內容語意依固定 `translation-review-content-next/exact-plan.json`，正式名稱來源與套用收據另見同批根目錄報告。未發布。
