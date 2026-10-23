# 清明原生工具獨立審查

本報告只審工具與離線故障路徑，沒有啟動browser、HTTP、原生遊戲量測或建立核准檔。最終來源SHA與實際重驗輸出另存`final-review.json`及`final-tests.txt`；讀本報告時須一併核這兩份收據，不以進行中的v1 snapshot當最終版本。

最終v2方法範圍內，本輪回報的三項缺口均已補並重驗，沒有留下同項未修阻擋。親跑15個相關測試全綠（原作者10＋獨立5）；唯讀review核28個method files、19個native bindings及672個runtime file references，exit0。runtime v4含11個已安裝package的322個檔案、25個未安裝optional明列、Chromium distribution308檔；並非OS所有DLL的完整環境證明。

最終原作者freeze：`native-review-freeze-v2.json`，SHA `4883d940c38a4ac63d59364209102ecb49e220ca63b3754ccb677a8fdcd6a005`。三工具SHA已與原作者提供值逐一核對並保存final-review.json。這是工具準備審查結果，**不是已批准pilot，也不是完整native run通過**。

## 審查中找到並回報的具體問題

1. **相同文字的錯目標**：舊驗證器僅檢selector欄位和自行宣告owner；angle與tension同為`0`時可混淆。原作者補存DOM.querySelector／DOM.describeNode原response，核`id/for/data-layout-owner`、nodeName/backendNodeId與font nodeId；並要求target完整存在於sample且owner唯一。獨立負例覆蓋同為0但CDP仍指angle時請求tension、target不在sample、錯固定owner、query/font node錯配。
2. **runtime依賴未閉合**：舊快照僅package entry/package.json；實讀entry證明playwright-core需要lib/bootstrap/coreBundle、sharp需要constructor/input/output等。`dependency-audit-v1.json`保存這五個實存檔案SHA及`bound=false`。再讀sharp實作找到detect-libc／semver等；Chromium真正引擎另有chrome.dll與ICU/V8/pak，不能只綁chrome.exe。已回報作者擴大package依賴及browser distribution快照，最終收據要核新binding。
3. **事件與校準未進case鏈**：舊session.events未檢，stepper列只驗宣告方法／值。作者補真DOM input/output事件、calibration row event_index、case calibration SHA與完整事件prefix SHA，納入case→checkpoint鏈；獨立負例核錯input/output、錯hint、錯stepper控制項均拒絕。

進行中曾讀到timeBound尚未實作；原作者明確正在補、之後實作且有真RED→GREEN，因此不把中間狀態列為最終未修缺陷。

## 其餘檢查與界線

- 原PNG需完整解碼與精確viewport尺寸，不只驗header。case/sample/PNG各SHA連入順序checkpoint；前一hash、缺欄與任意path不符會拒絕。這是完整性核對，不能抵擋有人自行偽造全部資料後重算整條鏈；此工具以核准的執行程式和保存收據為信任起點。
- 全nodes／blockers與原flags逐值保存，target不得從sample外另造；原flags非空會保存失敗後停止，不能靠刪flags放行。
- source_before／source_after需13項HTTP200、bytes、SHA相符且case／事件時間夾在收據之間；font before/after需與目前磁碟清單相符。這仍是點狀收據，原`continuous_immutability=false`保留，不假稱連續不變。
- 實際font回應與owner-specific allowlist均要核；不能用任意非空font陣列代替實際目標。字型名稱與系統檔案清單穩定，不等於已證任意作業系統fallback行為。
- fresh `root-*` run、無failure檔、完整且沒有多餘檔案、36case／6session與633筆各session校準是預定pilot契約。沒有實跑，因此不聲稱這36張已存在或整合驗證成功。
- `approved=false`、`native_launched=false`、canonical candidates空、`full_project_approved=false`均須在最終freeze保留；本獨立審查不提供root批准，也不把工具測試通過改成canonical credit。

## 重驗入口

```text
node --test holiday-lab/layout-qa/qingming-native-independent-review-20261023/independent.test.cjs
node holiday-lab/layout-qa/qingming-native-independent-review-20261023/verify-review.cjs holiday-lab/layout-qa/qingming-error-domain-20261023/native-review-freeze-v2.json
```

`verify-review.cjs`只讀原作者freeze／bindings、重建runtime檔案指紋並核已知實際require依賴，從未呼叫run/launch/fetch。它不是`verify-native-run.cjs`完整原生run的替代品。

原作者測試另依`final-tests.txt`列出的實際命令執行。所有本審查產物只在本目錄；沒有更動清明白名單／產品／舊captures／sampler／contract，未stage／commit／push／delete。
