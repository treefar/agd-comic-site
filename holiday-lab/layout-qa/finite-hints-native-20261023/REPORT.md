# 320px 有限拒絕提示：原生可見性補採

2026-10-23。結果：本次限定的 **24 contexts、50 finite keys、150 次真 UI 拒絕**補採完成；165 張新原生 PNG 的完整提示文字、固定安全框、未裁切墨跡與實際 viewport 均通過。96 份 secondary 義務中，15 份重新拍攝、81 份明列跨 run 沿用並重新驗證。**不變更原 eligible，不宣告全遊戲／全站 UI 通過。**

## 實際範圍與過程

固定08：`http://127.0.0.1:8845/`。320×900，DPR1、touch、reduced-motion，Chromium `151.0.7922.34`。只做8款×中英日的有限拒絕分支及必要合法前序，不採其它狀態或寬版矩陣。

| 遊戲 | 每語 finite key | 三語真拒絕 | 需要新 secondary | 可重用舊 secondary |
|---|---:|---:|---:|---:|
| constitution | 6 | 18 | 15 | 0 |
| lunar-new-year | 17 | 51 | 0 | 51 |
| lantern | 3 | 9 | 0 | 0 |
| children | 2 | 6 | 0 | 0 |
| dragon-boat | 4 | 12 | 0 | 0 |
| teachers | 4 | 12 | 0 | 0 |
| exhibition | 3 | 9 | 0 | 0 |
| new-year | 11 | 33 | 0 | 30 |
| 合計 | 50 | 150 | 15 | 81 |

`plan.json` 保存原 static-error-max1..4 的逐 key／語言／phase／完整 inputs／guard／原 case ID 及來源索引；不是以24個 context 省略各 intent。lunar 第三幕 comic、reserved 都採；new-year 第三幕 launch、flight、landing 都採。兩者前序透過真選項與真提交完成。new-year 拒絕前所需預覽均等待真觀察完成；preview-required 分支刻意未預覽。exhibition 依原 driver 設定全部3件作品並存 DOM 座標與資訊透明度，不只改當前選中作品。

每次拒絕後正常 `scrollIntoView` 將 `game-hint` 移入 viewport。需要 constitution secondary 的同一拒絕分開正常捲動再採第二張，保留相同全文、完整 input、phase 身分；不聲稱兩個 owner 同張可見。沒有 import 遊戲改 state、setText、改時鐘、取消 RAF、修改產品／CSS／sampler／safe。

唯一採集：PID **47600**、exec session **37102**，`run-01-output.txt`。開始 `2026-10-23T03:25:52.305Z`、完成 `03:37:53.149Z`，720.844秒，正常 exit0；過程僅此一份，沒有逾時重啟。離線 verifier 另為 session75521，正常 exit0。

## 來源、字型與圖面證據

`source-snapshot.json` 封存固定 served 10份原始 source bytes（8遊戲＋runner/CSS），8 module SHA 對原 proof 相同；110 段精確 guard 查核。每張新圖保存完整原 frozen sample、CDP 實際字型、PNG／sample SHA、Range／baseline／ink／safe／clip／viewport、輸入與全文前後身分、來源與 `msjh.ttc` 前後收據。

- frozen `sampleLayout.toString()` SHA：`c247641156d929b0de7d6aa70e509510e293a29d7d6ff45aaac99ad931e0dc1a`
- safe map SHA：`0604fa8281a50acaccc6d151dfa676f1323e3a3b453a4e03bc939ad17e73de2b`
- `msjh.ttc` SHA：`1fd5fc7046e0eea753988ee06d1a5a731df68475614e2174fbba9b4800f392ac`
- 新165圖 CDP 實際字型均為 `MicrosoftJhengHeiUIRegular`；這不是全站 cmap 認證。
- 全部新 case 的原 `inspectReport` geometry errors 合計0；完整 sampler flags／全頁 nodes／blockers 原樣保存，不藉此升級為全案 pass。

81份舊 secondary 的原 report SHA、case index／ID／完整 case、module/runner/CSS/paper/panel SHA、完整 inputs、全文 Range、unclipped ink、fixed safe、實 viewport、PNG SHA 及 CDP font face 均重新查核。`verification.json.typed_cross_run_joins` 明列新 hint case 與舊 secondary case，`cross_run_reuse=true`、`not_same_capture=true`。原範例／來源未被重寫，不能把81份說成本次新截圖。

實際開圖抽看8款代表：constitution-en small、lunar-ja surprise-brow-opposite、lantern-ja position、children-ja sync、dragon-boat-ja coverage、teachers-en line、exhibition-ja spacing、new-year-ja focus-landing。提示完整入畫面，未見目標文字壓框或缺失；這不是使用者美術確認。另見窄版日文 `lny-intro` 末行「に。」與 new-year landing 提示末行「く。」的可讀性觀察，列P3待主控判斷，未改文案或斷行，完整文字／幾何 pass 不代表孤字偏好已解決。

代表真 PNG（皆在 `runs/run-01/`）：

- `constitution-en-320-small-game-hint-11.png`
- `lunar-new-year-ja-320-surprise-brow-opposite-game-hint-71.png`
- `teachers-en-320-line-game-hint-116.png`
- `new-year-ja-320-focus-landing-game-hint-164.png`

## 可重跑命令與實際輸出

工作目錄 `C:/agywork/agd-holiday-prototypes`。不重跑已結束的採集以覆蓋 run-01。

```powershell
node holiday-lab/layout-qa/finite-hints-native-20261023/prepare.cjs
# contexts24 required_rejections150 secondary_required96 secondary_reusable81 new_png_upper_bound165
node holiday-lab/layout-qa/finite-hints-native-20261023/snapshot.cjs
# files10 exact_module_hashes8 guard_checks110 product_writes0
node holiday-lab/layout-qa/finite-hints-native-20261023/collect.cjs run-01 > holiday-lab/layout-qa/finite-hints-native-20261023/run-01-output.txt 2>&1
# COMPLETE contexts=24 refusals=150 PNG=165 fullUI=NO
node holiday-lab/layout-qa/finite-hints-native-20261023/verify.cjs run-01 > holiday-lab/layout-qa/finite-hints-native-20261023/verify-run-01-output.txt 2>&1
# exit0; pass true, contexts24, finite_keys50, actual_refusals150,
# new_png165, reused_secondary81, required_secondary96,
# new_case_geometry_error_count0, source_and_font_stable true,
# full_project_approved false, original_eligible_flags_modified false
```

原準備工具曾因第一份舊 proof 的來源收據欄位不同而紅，保留 `prepare-receipt-red.txt`；修正自有工具後從原 raw metadata 的真收據核對，非修改產品或舊證據。採集運行中一次唯讀 checkpoint 恰遇 JSON 寫入中而 parse 失敗，未重啟或使用半寫資料；完成後 verifier 只讀最終檔案並通過。

## 逐條驗收

| 驗收 | yes／no | 證據 |
|---|---|---|
| 8款×3語320，50 keys 全覆蓋 | yes | plan、150 branch、24 context rows |
| 每 key 真 UI 拒絕、原 inputs／phase／intent 保留 | yes | report.sessions.branches；lunar雙意圖、新年三focus |
| 新165目標完整文字、原生墨跡、固定safe、clip、實viewport | yes | verification.new_target_rows＋原 sample／PNG |
| secondary96份完整義務 | yes | 新15＋舊81逐筆 typed cross-run join |
| 舊secondary同來源／完整輸入／全文／可見圖／字型重新驗證 | yes | verification.typed_cross_run_joins |
| 來源及msjh每張與批前後穩定、舊報告SHA未變 | yes | source_before/after、font_before/after、offline verify |
| 新165 case 原全頁geometry errors=0 | yes | 原frozen sampler＋inspectReport；不等於其它狀態通過 |
| 沒有產品／舊proof／旗標／safe／時計改寫 | yes | 只新增此資料夾；原proof SHA守住 |
| 已 stage／commit／push／發布 | no | 本任務禁止，交由root白名單整合 |
| 原 eligible 自動轉綠、全站UI或孤字問題全解 | no | 保持false；root另做join，P3如實保留 |

離線完整結果：`runs/run-01/verification.json`。本次不修改先前 static5／native60，也不追加其它矩陣。
