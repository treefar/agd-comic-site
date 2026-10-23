# 整合版本在校指南獨立驗收

結果：本機限定範圍通過。原生版本 http://127.0.0.1:8866，8 組 context、24 次完整翻譯目標、36 張 PNG。來源、建置與服務 HTTP 均由本輪重新採證；沒有沿用8865批准。此結果不代表母語者確認、全站內容查證或發布批准。

## 可見範圍

六組指南 zh/en/ja 各320及1440寬；兩組日文招生 selection 頁320及1440，僅驗此次修改的實際內容容器。指南每次採樣讀取 #student-guide 全部實際渲染文字葉，包含超出首屏但可捲至的內容；關閉中的 details 不以合成 DOM 展開。

指南狀態：初始、以鍵盤開第一則FAQ、逐一開此次譯文所在真實卡片、搜尋無結果及清除還原。分類篩選、身分篩選、快捷鈕焦點、實際可見導覽選單亦操作。不是所有15張卡片／30則FAQ的全部展開排列。

孤尾判定沿用原凍結 measure-v2：多行文字最後一行只剩一個字母／中日文字及可伴隨標點為失敗；英文字尾整個單字可正常換行，另存 englishSingleWholeWordLastLine 旗標供審閱，不將 passing.、programs. 等正常整字換行冒稱零。原生 Range 行組與元素界線使用既有2px行組與1px子像素界線規則，未改為用字數推估或放寬容差；旋轉漫畫標題的Range行組不等於語言學的文字行。

## 逐條 yes／no

| 驗收 | yes／no | 本輪證據 |
|---|---|---|
| 精確12處來源pointer變動，其他鍵無語意變更 | yes | sourceBefore.sourceDiff 共12；四來源5/2/4/1 |
| 英文5及日文7個生成字典值一致 | yes | dictDiff 共12；產生器寫入攔截在記憶體，bytes完全相同 |
| 其他16候選維持原值 | yes | retainedRows=16，原source及locale雙核 |
| 12值各於320與1440實際頁面可見全文 | yes | targets=24，每筆Range、平台字型與PNG |
| 指定指南狀態全可見葉納入 | yes | 46次layout，10364葉觀測；每葉對應owner，非唯一字數 |
| 量測前強制布局、fonts.ready及loaded | yes | 每個sample與shot前等待，readonly重新核對 |
| 指定範圍文字孤尾／水平溢位 | yes | 原規則下孤尾0、owner溢位0、page水平溢位0 |
| 導覽、分類、身分、快捷鈕及FAQ鍵盤操作 | yes | 六組operations全部核對；依實際hamburger可見性操作 |
| Console例外、網路錯誤 | yes | 八組errors均空；只涵蓋本輪實際要求資源 |
| 來源/build/HTTP前後穩定 | yes | 18來源、360build逐檔SHA、15個HTTP的200與bytes/SHA前後一致 |
| 字型字級未用縮小或換字型規避 | yes | CSS僅append布局；font/zoom/transform宣告序列與前版一致，禁止hide等規避 |
| 新整合版原生EOL及bundle保存 | yes | freeze新錄SHA；與8865只有16文字檔CRLF差，其他bytes一致 |
| readonly能拒假通過 | yes | 16正反例通過：漏context/target/leaf、source漂移、loading、溢位、錯字、錯PNG、假母語／全域批准等均拒 |
| 全15卡及30FAQ每個展開狀態都驗過 | no | 超出此次最小充分範圍 |
| 母語者／全站／公開發布批准 | no | flags均false，本輪無發布 |

## 實際指令與輸出

工作目錄 C:/agywork/agd-holiday-prototypes。

```powershell
node holiday-lab/reports/integrated-review-20261023/guide-independent/prepare.cjs
node holiday-lab/reports/integrated-review-20261023/guide-independent/run.cjs
node holiday-lab/reports/integrated-review-20261023/guide-independent/verify.cjs C:/agywork/agd-holiday-prototypes/holiday-lab/reports/integrated-review-20261023/guide-independent/runs/2026-10-23T11-02-24-863Z
# PLAIN_QA_RUN 指定上述run，再執行
node --test holiday-lab/reports/integrated-review-20261023/guide-independent/verify.test.cjs
```

run-output.txt 保存八筆 PASS 與 PLAIN_COPY_INDEPENDENT pass。verify-command.json 保存實際spawn指令、stdout、stderr、exit_code=0。verify-tests-command.json 保存同樣欄位，exit_code=0，stdout tests16/pass16/fail0。

```json
{
  "pass": true,
  "contexts": 8,
  "guide_contexts": 6,
  "admission_contexts": 2,
  "translation_values": 12,
  "target_observations": 24,
  "pngs": 36,
  "guide_layout_samples": 46,
  "guide_leaf_observations": 10364,
  "source_files": 18,
  "build_files": 360,
  "source_build_manifest_sha256": "0ed257a771b7839b86d442d07caacf1732b39afee7e2ceade10ba3542afeeeab",
  "receipt_sha256": "e2d575628c762be80ef3f27fe99cdfa7d8a56628696d91451789873fb3b3ec16",
  "scope": "exact12 local translated guide and admission review; all rendered guide leaf text in specified UI states; admission changed container only",
  "native_speaker_approved": false,
  "public_release": false,
  "full_project_approved": false
}
```

實際新證據目錄：C:/agywork/agd-holiday-prototypes/holiday-lab/reports/integrated-review-20261023/guide-independent/runs/2026-10-23T11-02-24-863Z。

bundle app-X5G5MOSD.js：7c469f105caca6b5beabbd15c3bf7a814c8c6cb24b1bca5626aa50e1f7f02b28。student-guide.css：224adad44d517ae15a018bce8ac6ff93efa6d1fe37245751f0911fb5572ab05a。freeze：c6bd602578681123cc94c2922ec76b1d3b23d0b10aac0b100985a10dcf281a91。全部18來源與360建置檔SHA見freeze.json；方法SHA見method-freeze.json；驗收器自身SHA另見verification-method-freeze.json。

已用view_image檢視本輪 zh320初始、ja1440初始與ja320請假目標截圖，未宣稱使用者美術核准。完整圖保留於run資料夾。

研究16名稱的成果在 translation-review/proper-names-research-20261023/，與本QA分開。該研究發現的115招生名額落差仍是待確認內容；本輪排版及12詞句通過不會把它蓋掉。
