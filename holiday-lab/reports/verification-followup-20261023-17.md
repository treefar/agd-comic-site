# 清明404修復與本機成果交付（2026-10-23）

完成範圍：修正實際圖示資源、獨立清明核心流程驗收、現有網站審閱與進度儀表板。勞動節依使用者指示暫緩。

| 驗收項目 | yes/no | 實際指令與輸出 |
|---|---|---|
| favicon回歸與server故障注入 | yes | node --test scripts/serve-local-review.test.cjs scripts/serve-local-review.fault.test.cjs holiday-lab/tests/favicon.test.cjs → tests3 pass3 fail0，exit0；修正前favicon測試真1fail |
| 本機新建置 | yes | node holiday-lab/build-review.mjs .measure-local-qingming-20261023-01 --measurement → exit0，357檔，art preflight257assets/9screens/pass；保留既有duplicate color警告 |
| 清明獨立六組核心流程 | yes | 獨立run.cjs --run http://127.0.0.1:8854/ C:/agywork/agd-holiday-prototypes/.measure-local-qingming-20261023-01 → exit0；zh/en/ja ×320/1440，intro→失敗→重試→三次成功→結果→三段重播→返回，errors0 |
| root重新唯讀驗證原始證據 | yes | node holiday-lab/layout-qa/qingming-favicon-independent-20261023/verify.cjs holiday-lab/layout-qa/qingming-favicon-independent-20261023/run-2026-10-23T07-27-45-811Z holiday-lab/layout-qa/qingming-favicon-independent-20261023/icon-full-chrome-2026-10-23T07-34-30-256Z → exit0，pass:true,contexts:6,screenshots:84,response_bodies:424,build_files:357,source_files:9 |
| 真favicon200且未知資源404 | yes | 12份explicit icon收據；另完整Chrome headless兩context自動icon200；8856 /favicon.ico 66162bytes PNG200，未知資源404。圖示SHA356075a7feaaa023f1998b1214823c4371af8b70436427fdc7b7e282cb55efc1 |
| 現有網站獨立smoke | yes | node holiday-lab/reports/current-preview-smoke-20261023/smoke.cjs（實際完整參數見該REPORT/stdout）→ exit0，6/6，指南15卡47說明步驟30FAQ，27PNG；bridge-8856.cjs → exit0，8檔HTTP/disk SHA相同 |
| 儀表板資料權威 | yes | node holiday-lab/build-dashboard.mjs → 34/34 PASS；node --test holiday-lab/dashboard/progress-adapter.test.cjs holiday-lab/dashboard/ui-authority.test.cjs → tests9 pass9 fail0，exit0 |
| 儀表板桌機／手機／離線 | yes | node holiday-lab/dashboard/smoke.cjs → DASHBOARD_SMOKE 2/2 + OFFLINE PASS，exit0；已檢視1440淺色及390深色overview PNG |
| 完整UI／2076新建置驗收 | no | ui-layout-policy.cjs --project . → exit1；完整UI gate 0/1，歷史固定08覆蓋2046/2076缺30，不轉嫁為新build全通過 |
| 勞動節續接／對外發布／ZIP | no | 使用者指定暫緩與本機審閱；本輪未執行2453native、push、發布、main變更、刪檔或Unity |

初版獨立verifier要求headless shell自動取icon導致真RED，原verify-output.txt保留；補充完整Chrome自動請求證據後最終唯讀驗證通過。儀表板更新驗收收據後，尚未重產時回歸8/9真RED亦未冒稱通過；重產34/34後回歸9/9。原清明v2失敗、v3分類工具尚未批准的記錄不改。

照片檢查只驗實載與容器；頭部視覺對齊、全站字型與母語審校仍待確認。完整UI gate未通過，因此只提供已授權的內部本機審閱，不交發布包。

入口：http://127.0.0.1:8856/ 、http://127.0.0.1:8856/progress/ 、http://127.0.0.1:8856/holiday-lab/?game=qingming&lang=zh 。

原始證據：清明目錄REPORT.md、verification.json、84PNG及424response收據；網站smoke目錄REPORT.md/result.json；dashboard/smoke-result.json。主分支與C節核對收據見本輪REPORT後續保全段。
