# 學生作品新版獨立驗收接續點

source_agent: codex

- 只擁有本目錄；未改產品、舊01方法、main、C節或勞動節。
- 首次正式受測 .measure-student-hero-20261023-01／8862，單次程序79701已真terminal exit1（2026-10-23T09:37:28.611Z），沒有待跑或重啟。
- 首頁9/9與兩條節日嵌入core 2/2通過；策展3/9通過，6個手機context因真孤字末行失敗。
- 原raw runs/2026-10-23T09-35-46-407Z/result.json／失敗PNG與method都保留。最小原始失敗 red-minimal.json 含selector、全文行分組、raw SHA、所有6case與PNG。
- root已知，demo owner只修姓名不內斷與checkbox/button換行；等待root fresh02精確build/server後才按同一未改run.cjs重新驗證。不得把本次9/9home或2core當成02全新通過。
- 署名/圖片/正式標題權威：data/news.json id7140.gallery rank04/05/06。source-expectations.json逐筆保存完整designers/mentor，不把Dear英文副標當正式改名。
- 首頁前置不載/holiday-lab/assets插畫/UI背景；favicon images/site-icon.png是前輪生成UI複本，僅保留既有小型圖示，不宣稱所有像素零AI。

## 02 首次複驗的驗收工具缺陷（保全）

- 8863 首次複驗 runs/2026-10-23T09-41-28-837Z 的 collector 結束為 pass／exit0，但嚴格唯讀 verify.cjs 真 exit1：11 個換作品狀態的 fontStatus=loading，不可當作通過。font-readiness-red.json 保存逐筆最小證據。
- 根因是原方法僅初次等待 fonts.ready；換作品的新標題與完整署名會觸發新的字型子集載入。圖片 decode 不等於字型就緒。
- 舊 run／measure／verify／原 raw／PNG 全部保留。另開 run-v2.cjs、measure-v2.cjs、verify-v2.cjs、verify-v2.test.cjs；method-v2-freeze.json 記方法 SHA。每次量測／截圖先觸發 layout，再 await fonts.ready 與 loaded；collector 也斷言 loaded。demo 成功與切語言重設補留 layout。
- v2 負例 harness 明確提供 __dirname，另加 unchanged raw 正例與 loading 字型負例，避免負例因 harness 無法執行而假綠。舊測試未覆寫。
- v2 本次已啟動單一程序24108，仍使用未變產品 8863；完成前不宣稱驗收通過，不重啟。

## 最新有效結果：v2 全量與嚴格唯讀通過

- 單一程序24108已完成，terminal真exit0；沒有待跑或重啟程序。run目錄 runs/2026-10-23T09-48-25-302Z，8863產品未改。
- 9首頁／9策展／2嵌入核心通過，47PNG；54個layout快照全loaded，0 issue／0 orphan，errors全空，17個HTTP source before=after。
- verify-v2.cjs真exit0；raw SHA f0f201431cdc084410379424dca589f8f48ee4f653da98938493f5d3059731ea。聚合工具應require verify-v2.cjs，不使用舊verify。
- verify-v2.test.cjs unchanged-harness正例另抓到VM缺URL，原11pass1fail輸出保留；新verify-v3.test.cjs只補URL，全12pass／0fail／0skip，不改任何run或產品。
- REPORT.md、verification-v2.json、verify-output-v2.txt、verify-tests-v3.txt、run-v2-output.txt已落地，Test-Path／實讀已確認。method-v2-freeze.json內凍結SHA仍一致。
- 限定本輪首頁與策展本機審閱驗收，full_project_approved=false。未執行全站字型cmap／所有目的頁／全2076／實體手機／勞動節，未push。
