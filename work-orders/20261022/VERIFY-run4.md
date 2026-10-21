# 六條分支獨立驗收與整合（第四輪）

日期：2026-10-21，TF-GO／Codex。程式驗證基準e492e58；在獨立工作樹 C:/agywork/agd-run4-verifier 逐條checkout不可變提交實測，未以先前報告代替證據。

## 獨立驗收

| 分支 | 提交 | 驗收yes/no | 實際結果 |
|---|---|---|---|
| codex/hide-pending | 2576ae7 | yes | 17/17；[實際輸出](run4/evidence/hide-pending-fresh.txt) |
| codex/tune-collapsed | efe4204 | yes | 16/16；[實際輸出](run4/evidence/tune-collapsed-fresh.txt) |
| codex/tuning-roundtrip | 2fd7f99 | yes | 16/16；[實際輸出](run4/evidence/tuning-roundtrip-fresh.txt) |
| codex/spring-backgrounds | be6da33 | yes | 16/16；[實際輸出](run4/evidence/spring-backgrounds-fresh.txt) |
| codex/faculty-punctuation | 5bb779b | yes | 16/16；[實際輸出](run4/evidence/faculty-punctuation-fresh.txt) |
| codex/en-check-batch2 | 8ca0a85 | yes | 16/16；[實際輸出](run4/evidence/en-check-batch2-fresh.txt) |

| 原驗收條件 | yes/no | 獨立證據 |
|---|---|---|
| 兩語系5張卡無待補、保留已知製作者年份 | yes | cards腳本逐頁檢查，並實際開iframe、等遊戲START出現、關閉回5張卡 |
| 手機直向收合遊戲可見≥70%、展開28鍵可用 | yes | 390×844實際可見100%；28鍵逐支改到min核對TUNING，還原、複製textarea、重載預設收合 |
| 原wo02check行為未退化 | yes | 42→72扣墨、公開版7／調校版12、28鍵JSON、errors=[] |
| JSON複製貼回磁碟檔案後三關通過 | yes | costTouch改8，實際檔案載入確認8；桌機與手機3關won/0失誤/0錯誤；finally用原始bytes還原並比SHA256 |
| 深色平台／藍牆各桌機手機虛線可辨識 | yes | 換一組座標重拍4張WebP並逐張開圖；原程式render，無改DOM線屬性、顏色或碰撞規則；靜態可見度測試 |
| certs只有指定標點改動且8檔PASS | yes | 獨立JSON逐值比對只有faculty:$[9].certs，四逗號改回頓號 |
| 英文第二批來源、台帳、結構 | yes | 54個字串；括號原文未動；518→510，54列移除合計8；4個採用官方來源重新開啟；8檔PASS |
| 白名單內、無刪除／搬移 | yes | 六分支name-status；無D/R，逐條檔案與原B表對照 |

### 負向控制

在舊版e492e58用相同新腳本：cards因待補7個命中而exit1；panel因舊面板攔截開始按鈕而exit1。新分支相同操作轉綠，證明斷言能抓到原問題。[完整輸出](run4/evidence/negative-controls.txt)

## 整合

六條依序合併至clone的feature/en-site-and-play-zone，全部ort自動合併、0衝突。合併點d0e7eb1；驗收與啟動器提交212f9a1。[合併指令輸出](run4/evidence/merge.txt)

| 整合驗收 | yes/no | 結果 |
|---|---|---|
| node build.mjs | yes | exit0；既有duplicate color警告未擴大範圍修正；bundle與已提交版本無差異 |
| node --test tests/en-play.test.mjs | yes | 17/17，fail0 |
| node tools/validate-en.mjs | yes | 8檔PASS，CHECK510 |
| 中英試玩卡開啟／關閉＋手機調校操作 | yes | 新的使用者操作測試全部通過，JS/站內HTTP錯誤0 |
| 六種語系／裝置／調校組合三關自動試玩 | yes | 每組3關won，fails0，errors0；共18次關卡結果 |
| 整合後JSON磁碟貼回與還原 | yes | 桌機／手機三關仍過，原檔SHA256復原一致 |
| ui-policy無新增錯誤 | yes | 工具exit1，仍只有既有4張實景例外；沒有把工具全PASS宣稱為真 |
| 五款遊戲啟動與第一段操作 | yes | 創作不斷線真pointer開始／放手暫停；六樓調查亮點後前進；晴日WebGL牌桌；地窖序章進到第2張；死線選第1關進playing |

實際指令：[整合log](run4/evidence/integration.txt)、[ui-policy](run4/evidence/ui-policy.txt)、[五款冒煙](run4/evidence/games-smoke.json)。

首次額外冒煙腳本漏掉六樓必點亮點、死線先選關才出現開工按鈕，依原碼修正測試步驟後重跑5/5，遊戲程式未改。agy補助審查首次ReadFile被擋，改附文字後240秒TIMEOUT；兩次均無可採用判定，不計入通過。

## 試玩交付

ZIP：AGDComicSite-Playtest-20261021.zip；59,982,468bytes；SHA256 0a9d073e68e5e291b7dde2c99581028b688aa05deba4e562f8ed5d1f724c9603。

完整解壓後雙擊START.cmd；PowerShell提供localhost伺服器，自動開試玩區。無需npm；既有React CDN與網路字型需網路。

從真正ZIP解壓副本啟動PowerShell伺服器，五款冒煙5/5且JS/HTTP錯誤0；554個runtime檔案的bytes與SHA256全符清單。啟動器PowerShell5.1與7皆實跑-Check，PS1 BOM正確、CMD純ASCII。[包體驗證](run4/evidence/package-integrity.json)、[包體實跑](run4/evidence/pack-smoke.txt)。

## 邊界

沒有push、沒有操作main、沒有清理分支／工作樹／暫存、沒有刪專案檔；C節事項不執行。真手機手感、實際製作者與授權補齊、格鬥規格定案等仍交使用者。

[狀態儀表板](run4/dashboard/index.html)分資料／工具／使用者三層；全部「使用者未確認」，不把代理測試當對話確認。

## 未執行項目與原因

- Lint：package.json沒有Lint腳本，本輪未新增工具鏈。
- 真手機：屬C節，未代使用者測手感。
- Unity Editor測試與Build：本輪只用瀏覽器驗既有WebGL檔，沒有操作Unity Editor或改Unity專案。
- agy實跑：headless無法跑命令，兩次補助審查皆沒有可用結果。

儀表板25/25檔案與權威驗證通過；桌機淺色／手機深色搜尋、篩選、列展開通過，頁面無橫向溢出。
