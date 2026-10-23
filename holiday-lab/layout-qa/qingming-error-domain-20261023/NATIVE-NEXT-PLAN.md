# 清明後續原生量測計畫（未核准、未執行）

本輪未啟動 browser、native、server 或全集。既有 1115 份影像是原 WebP，保留原檔，不改稱新 PNG。

## 可判定完成條件

本輪離線完成：1115 refs 原 bytes/SHA、完整 nodes/blockers/flags、影像完整解碼及 geometry 重算相符；136 固定拒絕句見證逐份可見性與全文稽核。此條已完成，不代表六個 error-longest。

六個 canonical 完成仍需：逐 owner 的合法文字聯合狀態全集、可達見證、相同 source/font/sampler/safe/viewport 下的實際 unclipped ink 極值及完整畫面。不能用字數、笛卡兒積或任意 clone 假定極值。

## 先做來源與合法性工具，再由主控審碼

1. 固定本目錄 source 三檔與13份 HTTP source bytes；source_before/source_after 必須逐 URL、HTTP200、bytes、SHA、時間順序完整。原 after=false/unknown1 不因新量測改寫。
2. 為 source-bound status/hint/progress/pause/control-output 建立轉移系統，所有分支逐一附原行與 guard。原 `domain.cjs` 的回收快照保留 joint proof=false；後續 `text-projection-v2.json` 與 TEXT-DOMAIN-PROOF.md 已補11個error文字模式及33個一般文字模式的來源因果；原生serialization與row幾何仍待pilot，未核准不可執行。
3. 瀏覽器 range 的 serialization 需要原生校準，包含 tension 的 .02 增減；宣告51格不能代替原生字串全集證明。`native-run.cjs` 僅支援pilot，每語寬一個bounded session，共6 session；`mode=full`明確拒絕。
4. 現行pilot共36張PNG：6context ×6 owner（status、hint、progress、三個numeric output），全部在phase0真miss後停止物理advance；各owner各自真scrollIntoView。每context另外逐213候選值直接range回填，再走420次真stepper（angle120、length200、tension100）。總direct1278、stepper2520；每context633筆觀察。原54張草案已由此方案取代，不執行舊案。pilot不計error-longest credit。
5. 每context精確尺寸為 zh/en/ja ×320×900或1440×1000，DPR1、原設定 reduced-motion。只有真 UI click/range input、自然 frame 經過。錯誤路徑 length150/tension1、保留 phase 不變；成功換段路徑 angle0/length100、tension依phase為0/.44/0，需自然 wait progress，不設時鐘、不改 state/text/style。
6. 每個目標以實際 scrollIntoView 操作將 status/hint/progress納入真viewport；必要時多張，不能把 controls全nodes卻只截其中一個owner冒稱全UI可見。CDP DOM/CSS啟用；逐字型 getPlatformFontsForNode，保留字型檔 SHA before/after；原 sampler不刪欄，full nodes/full blockers/full flags全部存檔。
7. PNG使用 CDP captureScreenshot 實際viewport且 before/after scroll一致；每份 case/sample/PNG獨立SHA、完整解碼、原geometry重算、Range全文重建、unclipped ink/safe/clip/viewport包含檢查。`original_flags_empty=false` 會原樣保存完整sample.violations、case.original_method_flags、PNG與checkpoint後停止；不得刪掉旗標或繼續當成功。其他false同樣保留原失敗，不改safe。若PNG解碼失敗，已寫出的原PNG與sample仍保留，failure.json記錄例外，不補造case。
8. 單一fresh run目錄，append-only checkpoint逐case寫入；輸出不可覆寫。啟動前查PID/creation及checkpoint，未明確停下不可重跑；resume須檢查已存case完整SHA與方法freeze。失敗不用同一run換工具重跑。

## 審碼前的故障TDD義務

工具已建立，尚未取得新native核准。`native-tools.cjs` 包含root approval＋方法SHA、full拒絕、target完整性、CDP font完整欄位與owner-specific原生字型allowlist、實際PNG decoder、numeric row幾何分解檢查。`verify-native-run.cjs` 是唯讀重算器，核36張原PNG、完整nodes/blockers/flags、targetchecks、checkpoint hash chain、全部source/font before-after、6context/session與校準完整性，不容多檔或未提交attempt。

故障TDD已覆蓋新增動態write/未知owner selector、缺node/blocker/flags/measurement、假字型空物件/錯family或postScript/glyphCount/原response不一致、截斷PNG/錯尺寸、viewport外文字、HTTP404/缺來源/byte或SHA錯、少校準值/row幾何改變、錯phase/hint、改chain/任意path/少checkpoint欄位、未核准/full及方法漂移。真decoder bypass注入exit1保留，恢復後測試綠。原生full run未執行，未宣稱其整合驗證通過。

root先審目前 `native-run.cjs`、`native-tools.cjs`、`verify-native-run.cjs`、`text-projection.cjs` 及測試stdout；核准檔必須 `approved=true`、`reviewed_by=root`、`mode=pilot`、fresh `root-*` run_name及 `native-tools.bindings()`完整清單。此輪沒有產生任何approved=true檔案。只有收到主控明確核准後才能呼叫 `node native-run.cjs --run <approval.json>`。

pilot完成且唯讀驗證通過後，才可審1392配置的完整normalUI工具。這1392是文字與CSS分解成立後的完整配置計畫，尚未實作full執行器、未啟動、未計canonical。

目前可交主控的 `verify.cjs` 僅唯讀重算既有證據，不具啟動任何瀏覽器的路徑。

## 最後審碼補強

- `DOM.querySelector`原回應、`DOM.describeNode`原回應、selector、id/for/data-layout-owner、font nodeId要指向同一個實際元素。相同文字0的angle與tension owner不能互換；target node必須逐值存在完整sample且owner唯一。
- 每個range/click事件保留當下真DOM input/output/status/hint/progress；213 direct＋420 stepper校準各自指向event_index。每個case將校準檔SHA、session.events prefix SHA與長度一起納入checkpoint chain。
- 凍結recover.cjs、geometry policy實際檔案、Node execPath/version/執行檔SHA、Chromium精確版本/路徑/執行檔SHA、Playwright/sharp/parser及遞迴已安裝dependencies整包排序檔樹SHA。現行runtime快照為runtime-identifiers-v4.json：11package/322files與完整Chromium實際目錄檔樹（含chrome.dll、ICU、snapshot、pak），未安裝的25個optional依賴明列，未冒充已載入。
- 唯讀原生verifier逐session及全局要求source_before.finished ≤ 每份case.native_time ≤ source_after.started，明確拒絕failure.json；校準事件時間也要落在該session來源前後界內。
- 目前沒有native-runs、approved=true檔或任何新browser程序。`native-review-freeze-v2.json`才是這輪最後審碼freeze；v1留下作歷史，不覆寫。
