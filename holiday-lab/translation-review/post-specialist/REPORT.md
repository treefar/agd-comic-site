# 專職複查後的八項精確修正

source_agent: codex。整合分支`codex/holiday-prototypes`；本機09量測版在8846，使用者8800穩定試玩版保留。

- 六筆英文碩士移除原中文未提供的MA／MFA等細類，一律採`Master's degree`。獨立分支`codex/faculty-neutral-degrees`，原提交3928b20，整合提交ac7ba78；保原學校、領域及年份。
- 日文「影音後製 / 自媒體」補回音聲，採`映像・音声ポストプロダクション / 個人メディア`。
- 英文DB105實驗室完整說明補回配樂以外的「影視」，在`film scoring`後補`film and television production`；其餘全文不動。

後兩筆由第二位翻譯代理在08真DOM核出，主控對中文來源逐項確認；整合提交b775698。原08報告與固定計畫保留，不能把原44項計畫的兩個舊值當目前仍應相等。

| 驗收 | yes／no | 實際指令與輸出 |
|---|---|---|
| 六個學歷欄與其他資料分開核對 | yes | 獨立neutral-degrees報告9yes／0no；13人的其他英文字段、所有中文與九筆證照不變 |
| 兩處漏譯只改指定欄位 | yes | `node holiday-lab/translation-review/post-specialist/apply-lab-copy.mjs --apply` →operations2、all_non_target_values_equaltrue；固定80286ca前後整份JSON深比，`root-applied.txt` |
| 三批139個譯值及六學歷整合生成 | yes | `node holiday-lab/translation-review/post-specialist/verify-integration.mjs` →13及82原計畫通過，About/Labs44含明列兩個修正通過；整份EN／JA字典與08相比恰EN7、JA1，其餘全部相同。`integration-output.txt` |
| 09 Build | yes | `node holiday-lab/build-review.mjs .measure-integrated-09 --measurement` →exit0、356檔、app-M56TOGNW.js；既有兩個duplicate color警告與21個unpaired path診斷仍列明 |
| 相關語系／中文資料保護 | yes | `node --test tests/shared-language.test.cjs tests/japanese.test.cjs` →13/13、fail0，`related-tests.txt` |
| 六學歷真DOM／字型 | yes | 12/12目標，420字元樣式配對missing0／unknown0／parse0，另見neutral-degrees-rendered/REPORT.md |
| 兩漏譯真DOM／字型 | yes | 第二位代理僅補09兩句×兩寬4/4，106字元樣式配對missing0／unknown0／parse0；`integrated08-rendered/delta09-output.txt`、`cmap-delta09-output.txt`，不是重跑原256候選 |
| 09遊戲是否與08同一執行內容 | yes | `game-runtime-delta.json`：全部283個holiday-lab執行檔逐byte相同。08原矩陣base／SHA保留，可用差異收據連結，不回填成09重跑 |
| 全部Node187項在09重跑 | no | 187/187屬08；此次L0文案以Build、相關13項及精確來源／生成／畫面驗證，不冒稱09又跑完整遊戲測試 |
| 全UI2076／新試玩包／正式上線 | no | 08完整矩陣仍在執行，正式打包閘門尚未完成；09僅供內部量測，沒有新ZIP／發布 |

未push、未碰main、未刪檔。正式學位名稱與證照一手確認仍是另一件事，這些文案修正不作個人資格認證。
