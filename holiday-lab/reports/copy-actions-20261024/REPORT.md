# 四筆英日文案精確修正

已套用2個中文key、4個外文值：`data/en/flow-ui.json`與`data/ja/flow-ui.json`各2值。僅改工作來源，沒有Build、git操作或變更8881凍結版本。

| 原義 | 英文修正 | 日文修正 |
| --- | --- | --- |
| 分級後免修課程 | placement exemptions → placement-based course exemptions | クラス分け免除 → 習熟度判定に基づく履修免除 |
| 返校程序與成果交件 | return report → report back to the university，另列成果提交與依計畫限制 | 帰校報告 → 帰校手続き，保留成果提出與計画に従って |

依據為`goal-audit-20261024/translation-review.json.proposed_changes`四項已審值；提案SHA、四筆完整before／after及產品原檔SHA均在`baseline.json`。套用前先讀兩份實檔，四筆精確before均吻合；以完整JSON entry唯一匹配替換，保留既有排版與其餘字元。

驗證依verify的先red再修正流程。本次是字串語意修正，回歸證明作用對象及動作保留，不將腳本當母語真人簽核。

| 實際指令 | yes／no | 實際結果 |
| --- | --- | --- |
| `node holiday-lab/reports/copy-actions-20261024/baseline.cjs` | yes | 兩份345-key原映射保存，精確before成立；exit 0 |
| `node holiday-lab/reports/copy-actions-20261024/run.cjs red` | no，預期重現 | 8 yes／10 no；其中4個語意條件全部失敗；stderr空，exit 1 |
| `node holiday-lab/reports/copy-actions-20261024/apply.cjs` | yes | 先驗完四筆before再寫入；4值／2key；stderr空，exit 0 |
| `node holiday-lab/reports/copy-actions-20261024/run.cjs green` | yes | 18 yes／0 no；stderr空，exit 0 |

red／green及apply各有`*-command.json`完整指令、cwd、起訖、stdout、stderr及exit code；逐條結果在`red-result.json`、`green-result.json`。`en-before.json`、`ja-before.json`是本次原始映射，不回寫產品。

green檢查兩語各345個key及順序全數保留，除各2個目標值外，其餘各343值逐一相同；四值均精確等於已審候選，沒有新增日期或數字條件。分級語意明確指向課程免修，返校程序與成果提交為兩個動作，沒有新增親赴某窗口或時限。中文key、來源key與日期key完全不變。本代理不寫繁中及來源資料檔，其他代理的修改不還原。

可再次執行同一green回歸指令；後續證據會以時間戳另存，原red／green不覆寫。`apply.cjs`設計為一次性精確before套用，已套過後會因before不符拒絕，不可當回歸指令反覆執行。

未執行Build、locale生成、瀏覽器／手機驗收：依主控範圍，本輪只改兩份工作字典；主控將另建新候選並獨立窄驗。未碰metadata、交接檔、main、push、刪檔、遊戲、Unity或生成素材。
