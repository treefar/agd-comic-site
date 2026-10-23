# 清明新 domain 方法的負例審查清單

source_agent: codex

以下是新方法應拒絕的條件，尚未表示作者工具已執行這些測試。沒有真實 valid fixture 前，不拿「assert.throws 都綠」當通過。

| 負例 | 必須如何失敗 |
|---|---|
| 未修改原始 valid fixture 經同一 mutation harness | 必須先成功；缺 URL、__dirname、字型工具或檔案造成全拒絕時，整個負例批次無效 |
| 213 數量保留但刪掉 -30、重複 -29 | 逐 owner 值集合／唯一性拒絕，不能只比 length |
| 張力 .02 用 String 浮點候選代替原生 input/output | 缺正常化與實際事件收據，拒絕 native serialization 宣稱 |
| 只測滑桿，不測正反 stepper | 若宣稱所有原生輸入路徑字串域相同，拒絕該宣稱 |
| 把 phase0 next 或 paused=false＋paused hint 當合法模式 | 來源可達性拒絕 |
| 固定錯誤句的三語文字正確，但 progress 與 phase 不符 | 聯合原生狀態拒絕 |
| 純 callback/physics 模擬冒充原生 witness | 必須維持 candidate-only，不得給 native/canonical credit |
| 少一個 toolbar、label、output、button 或捲動後文字 owner | 全文 DOM／sample owner census 不符即拒絕 |
| 平台字型替換，僅 computed font-family 相同 | CDP platform font／字型檔收據不符即拒絕 |
| 換值令 output 或 row 字形/斷行/尺寸改變 .005px | 分離證明不能用任意 .01px 容差吞掉；精確差異需列為依賴，不宣稱不變 |
| hint 或 audio 讓 controls 的文件 y 改變 | 不得將舊 viewport frame 當新狀態已可見；要合法布局關係與實際可見證據 |
| 擷取時字型仍 loading | collector 與 readonly verifier 均拒絕 |
| 選了安全但墨跡面積不是該完整域最大值的代表 | 重算 unclipped ink 面積後拒絕 error-longest credit |
| 用 clipped ink、字元數、另一 owner／語言／寬度最大值 | exact owner/context 身份及極值定義拒絕 |
| 只留六個 target，把其他 sample nodes／blockers／flags 刪掉 | 原完整 sample hash／case配對拒絕，不能化簡成 target-only |
| output 被遮罩裁切，但 screenshot crop 看起來完整 | unclipped ink／固定安全區／原 viewport同張圖身份拒絕 |
| 取不同合法畫面的 owner nodes 拼成新 case | 原 case hash、sample／PNG 配對與事件鏈拒絕 |
| 舊 current_source 名字相同，bytes 已不同 | 當前 source closure before/after 與 HTTP body SHA 拒絕，不能搬舊 credit |
| 漂移來源、字型、method 任一 SHA 後仍保留 pass summary | verifier 必須重算實檔，拒絕 summary |
| 新 run 缺 after、晚到 Console/Network錯誤或 failure.json | 不完整／診斷未關閉，拒絕，不清原錯誤 |
| 最後把 plan-only 或 bounded domain 寫成 global/full_project_approved | exact scope 拒絕，不改 canonical或全域報告 |

審查執行時需記錄作者方法的精確 SHA、命令、真 exit code、各正反例名稱與未執行理由。純 source-domain 測試只能證來源模型的拒絕能力，不能代替原生排版 verifier 的測試。
