# 本輪整合與指南索引驗證

2026-10-22；僅本機候選，未 push、未發布。美術待使用者確認。

| 驗收 | yes／no | 實際指令／結果 |
|---|---|---|
| 追加5款程式整合，共15款三語目錄與首頁選單 | yes | cherry-pick 98b22b3、03b06af、a4db510、f602fa6；peace/retrocession先前已合併；catalog test 2/2 |
| 五款新增圖完成技術裁切、來源登錄 | yes | node holiday-lab/prepare-art.mjs：Registered 257 assets；候選，不等同使用者美術確認 |
| 圖像介面政策檢查 | yes | build-review：pass true、assets257、screens9、errors[] |
| 指南身分與三語搜尋相容 | yes | node --test tests/student-guide-audience.test.cjs：3/3；首次測試誤傳字串取代translator而失敗，已修測試資料 |
| 三語三尺寸3/2/1欄、展開5步、轉學生/畢業生篩選、清除還原、30FAQ、不橫溢 | yes | node tests/student-guide-index-browser.cjs：9組yes、errors[]；result.json及9張截圖在guide-index-evidence |
| 清除篩選會還原身分 | yes | 首次瀏覽器測出2!==15，實際漏reset audience；已修並以同測重跑9組通過 |
| JSX可建置 | yes | 首次05因漏details closing失敗保留；修後06、07 build exit0。仍有既有duplicate color警告2筆 |
| Node整合測試 | yes | node --test holiday-lab/tests/*.test.mjs tests/student-guide*.test.cjs tests/japanese.test.cjs：108/108，原始輸出integration-tests.txt |
| 新5款本輪獨立瀏覽器驗證完成 | yes | extra-qa/REPORT.md：11/11，同served SHA；原10款歷史獨立通關及回放針對性複驗另列，不宣稱同一fresh包15全狀態已驗 |
| 回放修正針對性驗證交付 | yes | replay-fix.md：紅0/3→綠3/3、21純測試、手機字幕至少16px；真正背景切頁未驗 |
| 兩款TF-BASE WebGL完成 | no | 來源/遠端執行未取得；BACKGROUND-TESTING工單已同步Drive，SHA一致，不開UnityGUI |
| 中日缺字整站解決 | no | 初次稽核只驗首頁，未重現tofu；新任務優先等義改句、保留原字型，密集缺字才提相似字型 |

指南標籤僅為查找需求。畢業生對應就業資源、繼續升學閱讀，不宣稱有新增校友申請資格或服務。所有15項、47步說明、官方來源及FAQ均保留於原資料；卡片展開閱讀。

root程式變更：student-guide-model.js、student-guide.jsx、student-guide.css、styles.css、holiday-home.jsx、catalog.mjs。手機floating CTA改頁內流，避免遮住遊戲開始；h-jojo補既有CJK字體備援，未引入新字體。後兩項仍需最新build畫面複驗。

導覽不落單字：node tests/navigation-wrap-browser.cjs，三語×9寬（390/768/1180/1280/1440/1680/1920/2048/2484）27/27 yes。保持完整字串、不改名稱，空間不足用選單；全部項目同列、無橫溢。首個檢查把同一行不同字型片段數當行數而失敗，已改按實際矩形行中線分組，產品不因該驗證錯誤變更。日文1440/2484截圖及JSON在nav-wrap；2484實際畫面已檢視。

原10款新模組完整通關複驗：HOLIDAY_QA_URL=http://127.0.0.1:8805 node holiday-lab/qa/playthrough.cjs，首輪11/12通過，英文390只在回列表期待舊10款時失敗（實際15）。修測試預期後 HOLIDAY_QA_CASE=new-year/en/390 重跑1/1通過；前輪10款中文＋年獸日文已pass，原始失敗和補測均保留playthrough.json.previousRuns。沒有重跑已綠的11組。dashboard按每筆成功case及該輪模組SHA計算，15/15有目前模組通關證據，23/23 authority pass；外框仍04歷史56yes/1未驗，不混成最新整包全部驗收。
