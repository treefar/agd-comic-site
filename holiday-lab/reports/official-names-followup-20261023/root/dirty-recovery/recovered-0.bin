# 勞動continuation獨立審查暫存點

## 最終r2複驗更新

下方「尚未freeze／未全綠」是中途保全歷史，已由本段取代。作者最終r2 freeze SHA `c1b4937e2ace9504ed537cee973a387051227688d43944dd03791cf0a453ac07`已取得；plan原SHA `7460aa03682c3bcdf855fc00deb6034d8f2845d5edf3946cf6dcc1aa8fb9edef`已核。

已親跑獨立6tests全部通過，詳`final-tests.txt`。不只terminalState helper，也抽取現行verifyUnion／execute完整原函式，以明標純離線fixtures驗五種terminal與五種control-flow故障分支，詳`terminal-final-receipt.json`、`execute-flow-receipt.json`。舊三個真RED原樣保留，不覆寫。

親跑真唯讀`verify-review.cjs`／`continue.frozen()`重核331成功prefix、2453規劃suffix、原332attempt及3650舊refs；fetch0、真native module未載入、沒有新continuation run。結果`final-review.json`與正式`REPORT.md`可獨立閱讀。

目前是「r2工具離線複驗通過」，仍不是新2453原生採集完成或批准。下一步只能由root審碼並決定明示新scope批准；本代理未新HTTP／browser／native。沒有背景程序。

2026-10-23，source_agent: codex。依root要求保全。**本輪尚未完成最終審查，不是PASS，不代表批准native。**

## 寫入範圍與實際狀態

僅擁有本資料夾`labor-continuation-independent-review-20261023/`。未改作者continuation／產品／舊full evidence，未browser／native／新HTTP，未stage／commit／push／delete。原作者仍在補故障路徑，尚未提供最終freeze與精確SHA，因此不能把中間版本當最終已通過。

已實讀：`labor-finite-native/continuation-20261023/attempt.cjs`、`continue.cjs`、`continuation.test.cjs`，以及`full-domain-reviewed-20261023/store.cjs`、`full.cjs`。

## 三個已實際重現的負例

精確來源快照：`continue-source-v1.cjs.txt`，原檔內容原樣保存；SHA與AST函式來源範圍在`terminal-negative-v1.json`。`terminal-negative-v1.cjs`抽取原封不動的verifyUnion/reconcile到純VM，注入離線store/context/terminal fixtures；沒有偽裝成正常原生run，也沒有觸發網路或瀏覽器。VM的deepEqual只將fixture跨realm原型正規化，不改被測函式邏輯。

實際命令：

```text
node holiday-lab/layout-qa/labor-continuation-independent-review-20261023/terminal-negative-v1.cjs
exit 1，三個false_positive=true
```

| 負例 | 舊實際輸出 | 應有界線 |
|---|---|---|
| 331成功prefix＋2453suffix資料完整，但沒有completion | complete:true | domain可以complete，run／整批不能complete |
| 全target資料完整，但最後global source失敗、failure.json存在 | complete:true，terminal failure未露出 | failure保留，run_complete／complete=false |
| 一筆新unknown attempt、無credited新target | total_historical_attempts:332 | 原332＋新1＝333；attempt與credited分欄 |

這份舊負例腳本日後仍應exit1，因為它重播**已保存的舊邏輯**；不能把它改成綠或改快照洗掉歷史。修後需另建對現行最終方法的獨立GREEN測試。

## 作者回覆的修復進度，尚待獨立複驗

- 已讀到新`terminalState()`：domain_complete／run_complete／complete分開，default complete只指run_complete；有failure回failed與terminal_failure；total_historical_attempts按332+new_attempts。作者表示已跑其6測試，但本獨立審查尚未以最終freeze驗證，不把作者自述當本輪PASS。
- per-target wrapper目前改保存原`data.case.source_before/after`及provenance，不新增兩輪HTTP。仍須以注入fetch counter的純故障測試確認0額外HTTP。
- 新context receipt已讀到：prev_context SHA、end檔SHA、engine checkpoint reference，將context end鏈結；仍須針對end篡改／半寫／原資料保留獨立故障測試。
- 原331成功prefix、seq331失敗額外保留、2453suffix與2784精確union，需要最終freeze後再跑只讀base／plan核對。

另外已將一個**尚未實際注入重現的讀碼風險**回報作者：completion寫出後finally的native.close若throw，不會進前面的catch，可能有完成檔卻未保存cleanup failure。這不是上述三個已實際負例之一；待作者回應或離線假native.close試驗，不能先寫成已證缺陷或已修復。

## 下一個具體工作

1. 取得原作者最終continuation freeze／plan與attempt.cjs、continue.cjs精確SHA；未取得前保持「修復中／未驗」。
2. 所有獨立測試fixture只寫本資料夾。不要直接跑作者continuation.test.cjs，因其會寫作者`test-evidence/`，超出本代理白名單。
3. 對現行terminalState測三個舊負例、完成＋failure衝突、未完成target卻有completion；對wrapper測full raw後置故障／partial native return／ECONNRESET／halfwrite，確認無credit、原資料和cause保留且fetch0。
4. 對最終freeze核來源SHA、只讀verifyBase與331/2453集合／原seq331失敗；不得呼叫prepare、preflight（會HTTP）或execute/native。
5. 最終報告分「已修並獨立驗證」「仍未驗／NO」「原生未啟動」，交root審碼後才由root決定下一步。

本審查沒有背景程序需要停止。

## 後續離線複驗進度（仍未freeze）

已新增`independent.test.cjs`，所有fixture只在本目錄。實際跑到的wrapper測試涵蓋full raw後置故障、partial return連PNG原bytes、ECONNRESET cause／unknown stage、halfwrite，以及context end篡改；這三個相關test項目通過，fetch counter為0。精確union純fixture測試亦在同一批通過。

整批目前**未全綠**：作者正在將cleanup成功改成completion的必要前提，terminalState測試使用的舊成功fixture未帶cleanup receipt，被新assert拒絕；這不是已確認的產品缺陷。等待作者提供最終cleanup資料shape後更新獨立fixture再重驗。`independent-current.txt`保留目前3 passed／1 failed實際輸出，不宣稱PASS。

cleanup風險已回報，作者現行程式出現`completion without successful immutable native cleanup`檢查，但本輪還未讀完最終實作或取得freeze，不能僅憑訊息／單條assert稱已閉合。
