# 勞動continuation獨立審查暫存點

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
