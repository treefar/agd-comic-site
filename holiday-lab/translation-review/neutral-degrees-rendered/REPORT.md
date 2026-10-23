# 六筆英文學位：09實際頁面複驗

source_agent: codex。固定 `.measure-integrated-09`／`http://127.0.0.1:8846/`，沒有更換字體。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 六位教師原中文只有碩士，英文不再加學位細類 | yes | 依 `neutral-degrees/exact-six.json` 六筆完整新句，不是只找Master字樣；學校／領域／年份原樣保留 |
| 六筆新句、390／1440真DOM | yes | `node holiday-lab/translation-review/neutral-degrees-rendered/audit.cjs http://127.0.0.1:8846 all` →ACTIVE12/12、LAYOUTtrue、RECEIPTStrue、ERRORS0；`output.txt` |
| 逐字實際字體與cmap可用 | yes | `python holiday-lab/translation-review/neutral-degrees-rendered/coverage.py --audit holiday-lab/translation-review/neutral-degrees-rendered/runs/2026-10-23T00-09-31-184Z-all/audit.json` →CASES12/12、CHARACTER_PAIRS420、MISSING0、UNKNOWN0、FONT_PARSE_ERRORS0；`cmap-output.txt` |
| 文字容器／頁面水平溢出與來源穩定 | yes | raw audit保存每句Range、owner、真viewport、實際CDP字體與HTTP前後SHA；來源不變 |
| 人看得到修改結果 | yes，限定抽看 | 主控實看張純雅390的教育欄真viewport圖，可讀Master's degree與完整學校、年份；未冒稱12張逐張美術確認 |
| 正式學位細類／本人學歷重新認證 | no | 本次只移除翻譯多加的MA／MFA／MSc／Master of Design，未取得新證書或查證個人資格 |
| 全站字型、所有字形塑形、墨跡邊框或美術使用者確認 | no | 同樣式字元探針及cmap確認可用性，不替代全站像素驗收 |

原始run：`runs/2026-10-23T00-09-31-184Z-all/`，準備碼 `holiday-lab/prepare-neutral-degree-render.mjs`。沿用已審過的DOM／字體方法，原13譯值collector保留；未發布、未改字型、未push。
