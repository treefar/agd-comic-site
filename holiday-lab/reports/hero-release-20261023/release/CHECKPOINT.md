## 2026-10-23 新01實跑已terminal

source_agent: codex。run session85989 exit0，無在跑browser；12 yes／0 no／1 unknown（headless無真hidden，不偽造）。新01 build357檔HTTP SHA全一致、loopback真listener、真404403400、三語鍵盤/暫停/Audio/卸載清理/reduced/scroller/斷第三方/故障恢復已完成。獨立verify exit0；release-verification.json、REPORT.md與runs/2026-10-23T09-04-22-409Z原始收據已保存。全域UI gate仍不升格；未封包。

# 發布補驗接續點（2026-10-23）

source_agent: codex。只寫本目錄；產品、合約、R0與歷史證據唯讀。無在跑browser，等root最終凍結build/server後執行一次。

## 已準備

- run.cjs：runtime全檔白名單/逐筆HTTP SHA；真404/403/400與圖示200；實際TCP loopback listener；zh/en/ja鍵盤range/預覽/暫停；真Audio載入、音量/靜音/暫停/卸載停止；3次重入listener不成長；reduced-motion及敘事3個scroll位置全文不變；封鎖第三方時本機玩法可用；精確module network fault的可讀錯誤/返回列表；真背景visibility如headless不支援則unknown，禁止偽造hidden。
- lib.cjs / lib.test.cjs：runtime與HTTP驗證；node --test .../lib.test.cjs已實跑3/3、exit0。node --check run.cjs已exit0。
- 不執行ZIP封包，不修改root ui-layout-contract來縮範圍。

待執行命令（source/base由root提供）：

`node holiday-lab/reports/hero-release-20261023/release/run.cjs --site=<FINAL_FROZEN_BUILD> --base=http://127.0.0.1:<PORT>`

每次新建runs/<UTC>/result.json，保留全部checks yes/no/unknown、source_before/after、所有HTTP receipt、瀏覽器文字/圖。source與方法不注入遊戲狀態；fault路由明確另列。

## 逐條發布清單（尚未對新版實跑）

| 項目 | 工具狀態 | 使用者狀態 | 下一步/界線 |
|---|---|---|---|
| 凍結runtime純檔白名單 | pending | 不需另確認 | 最終build逐檔，不建立ZIP |
| 全runtime HTTP200/body SHA | pending | 不需另確認 | 所有檔案與source manifest逐一比對 |
| 真404/403/400、favicon真PNG200 | pending | 不需另確認 | private/missing/traversal/malformed分開測 |
| TCP只綁127.0.0.1 | pending | 不需另確認 | 現跑Get-NetTCPConnection，不只看URL |
| 鍵盤調range/Tab/Enter操作 | pending | 不需另確認 | 三語共享外框代表流程，不取代14款已驗84 |
| 暫停inert、動畫凍結/恢復 | pending | 不需另確認 | 真requestAnimationFrame/native style |
| muted無音訊請求、Audio decode-ready/volume、暫停/卸載停止 | pending | 實聽仍待確認 | native media evidence不當真人實聽 |
| 重入監聽器不成長 | pending | 不需另確認 | 真add/remove registry，三次重入 |
| 減少動態與長敘事捲動可讀 | pending | 實體手機仍待確認 | 三個scroll位置非所有連續位置證明 |
| 封鎖外網時本機遊戲可開 | pending | 外部處室連結需網路 | 不誇大成整站完全離線 |
| module載入失敗可讀恢復 | pending | 不需另確認 | 故障注入另列，不能混正常錯誤0 |
| 真背景分頁停動畫/音效 | pending/可能unknown | 如headless無真hidden則需實際分頁檢查 | 不偽造visibility |
| 實體手機觸控、真人音效實聽、美術核准 | no（工具不可取代） | 待使用者確認 | 不代簽 |
| 完整2076-case發布UI gate | no | 勞動節暫緩 | 詳下方，不能改合約變綠 |
| 對外推送/發布 | no（未執行） | 僅本機授權 | 本輪不做 |

## 正式UI gate的客觀現況

目前合約required_cases=2076，其中labor=138。使用者明確暫緩labor，不能省掉這138項而宣稱同一份全域合約PASS。正式R0仍13cases、source_fingerprints=0，含刻意故障case new-year/zh/negative-effect；它是歷史負例與prefreeze，不可複製成新正式正向報告，也不可刪掉當沒發生。正確做法是保留原檔，未來新fresh正向capture與單獨negative fixture分檔，正式report只引用完整真正向收據；負例偵測能力在測試stdout呈現。

固定08歷史2046/2076缺30，其中非labor24；這24項是4款三語雙寬的game/error-longest完整動態墨跡證據，不是24個可見產品bug，但它們仍未變成新的全域證明。03的84核心流程也不是ink/paper-safe-zone合約全部義務。本輪共享外框/封包preflight可完成，不能因此把這些舊未完義務或labor/實機/美術升格成PASS。
