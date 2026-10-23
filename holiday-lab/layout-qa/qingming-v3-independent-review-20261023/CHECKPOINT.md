# 清明v3分類工具獨立審查保全

2026-10-23。root最新指示：本輪不擴修凍結v3；**v3未批准**。真正的網站favicon404修復將由root在當前source及新本機build完成，原.measure08／v2／v3均不改。

已親跑只讀`qingming-native-v3-20261023/verify-prepared.cjs`，exit0（36methods／28bindings）；相關原負例17tests全部通過。原stdout在`prepared-output.txt`、`author-negative-tests.txt`。method-freeze SHA `336801bea732063145909c7f22156e203e84fb99ab6fbceca809808a31297cee`。

獨立找到並實際重現的有限範圍負例：

1. diagnostics.classify接受response排在request之前的精確favicon404Other，回target_clear=true。
2. request／response兩邊的requestId同為空字串也會回target_clear=true。
3. case prefix已有console404但缺response時，prefix本身classify=false；完整session稍後補response後classify=true，verifyCheckpoint只核prefix雜湊仍會通過，沒有重分類該prefix。

`diagnostic-negative.cjs`保存合成unit fixture與原診斷來源SHA，輸出`diagnostic-negative.json`並exit1。這些不是正常原生trace，也沒有在真run重現，不誇大成所有v3 native結果都無效；但工具尚未批准，不將分類target_clear當網站404已修或global PASS。

本目錄只寫獨立收據，未修改凍結工具／產品／舊run，沒有browser／native／HTTP。勞動節已暫緩，不跑2453。

root另授權新任務：可在`qingming-favicon-independent-20261023/`準備不改產品的E2E程式。等待root提供新build/port後，才直接驗三語×320/1440六context的icon200、無favicon404與所有console/page/resource錯誤，以及清明真UI失誤→重試→成功三段→結果／重播／返回，保存source before-after、完整viewport與raw requests。不改game state／時鐘／DOM文案，不把此核心流程當2076全gate或canonical。
