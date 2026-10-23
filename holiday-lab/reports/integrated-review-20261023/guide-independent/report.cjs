const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {verify}=require('./verify.cjs'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const dir=path.join(__dirname,'runs/2026-10-23T11-02-24-863Z'),r=JSON.parse(fs.readFileSync(path.join(dir,'result.json'))),f=JSON.parse(fs.readFileSync(path.join(__dirname,'freeze.json'))),v=verify(dir),command=JSON.parse(fs.readFileSync(path.join(__dirname,'verify-command.json'))),tests=JSON.parse(fs.readFileSync(path.join(__dirname,'verify-tests-command.json')));assert.equal(command.exit_code,0);assert.equal(tests.exit_code,0);
const summary={...v,base:r.base,run:dir,source_stable:JSON.stringify(r.sourceBefore)===JSON.stringify(r.sourceAfter),http_stable:JSON.stringify(r.httpBefore)===JSON.stringify(r.httpAfter),http_files:r.httpBefore.length,exact_source_pointer_changes:r.sourceBefore.sourceDiff.reduce((n,x)=>n+x.differences.length,0),exact_generated_dictionary_changes:r.sourceBefore.dictDiff.reduce((n,x)=>n+x.differences.length,0),retained_values:r.sourceBefore.retainedRows.length,build_manifest_sha256:v.source_build_manifest_sha256,freeze_sha256:sha(fs.readFileSync(path.join(__dirname,'freeze.json'))),bundle:f.build_files.find(x=>x.file.startsWith('app-')),css:f.source_files.find(x=>x.file==='student-guide.css'),readonly_exit:command.exit_code,verifier_tests_exit:tests.exit_code};
fs.writeFileSync(path.join(__dirname,'summary.json'),JSON.stringify(summary,null,2)+'\n');
const text=`# 整合版本在校指南獨立驗收

結果：本機限定範圍通過。原生版本 ${r.base}，${v.contexts} 組 context、${v.target_observations} 次完整翻譯目標、${v.pngs} 張 PNG。來源、建置與服務 HTTP 均由本輪重新採證；沒有沿用8865批准。此結果不代表母語者確認、全站內容查證或發布批准。

## 可見範圍

六組指南 zh/en/ja 各320及1440寬；兩組日文招生 selection 頁320及1440，僅驗此次修改的實際內容容器。指南每次採樣讀取 #student-guide 全部實際渲染文字葉，包含超出首屏但可捲至的內容；關閉中的 details 不以合成 DOM 展開。

指南狀態：初始、以鍵盤開第一則FAQ、逐一開此次譯文所在真實卡片、搜尋無結果及清除還原。分類篩選、身分篩選、快捷鈕焦點、實際可見導覽選單亦操作。不是所有15張卡片／30則FAQ的全部展開排列。

孤尾判定沿用原凍結 measure-v2：多行文字最後一行只剩一個字母／中日文字及可伴隨標點為失敗；英文字尾整個單字可正常換行，另存 englishSingleWholeWordLastLine 旗標供審閱，不將 passing.、programs. 等正常整字換行冒稱零。原生 Range 行組與元素界線使用既有2px行組與1px子像素界線規則，未改為用字數推估或放寬容差；旋轉漫畫標題的Range行組不等於語言學的文字行。

## 逐條 yes／no

| 驗收 | yes／no | 本輪證據 |
|---|---|---|
| 精確12處來源pointer變動，其他鍵無語意變更 | yes | sourceBefore.sourceDiff 共${summary.exact_source_pointer_changes}；四來源5/2/4/1 |
| 英文5及日文7個生成字典值一致 | yes | dictDiff 共${summary.exact_generated_dictionary_changes}；產生器寫入攔截在記憶體，bytes完全相同 |
| 其他16候選維持原值 | yes | retainedRows=${summary.retained_values}，原source及locale雙核 |
| 12值各於320與1440實際頁面可見全文 | yes | targets=${v.target_observations}，每筆Range、平台字型與PNG |
| 指定指南狀態全可見葉納入 | yes | ${v.guide_layout_samples}次layout，${v.guide_leaf_observations}葉觀測；每葉對應owner，非唯一字數 |
| 量測前強制布局、fonts.ready及loaded | yes | 每個sample與shot前等待，readonly重新核對 |
| 指定範圍文字孤尾／水平溢位 | yes | 原規則下孤尾0、owner溢位0、page水平溢位0 |
| 導覽、分類、身分、快捷鈕及FAQ鍵盤操作 | yes | 六組operations全部核對；依實際hamburger可見性操作 |
| Console例外、網路錯誤 | yes | 八組errors均空；只涵蓋本輪實際要求資源 |
| 來源/build/HTTP前後穩定 | yes | ${v.source_files}來源、${v.build_files}build逐檔SHA、${summary.http_files}個HTTP的200與bytes/SHA前後一致 |
| 字型字級未用縮小或換字型規避 | yes | CSS僅append布局；font/zoom/transform宣告序列與前版一致，禁止hide等規避 |
| 新整合版原生EOL及bundle保存 | yes | freeze新錄SHA；與8865只有16文字檔CRLF差，其他bytes一致 |
| readonly能拒假通過 | yes | 16正反例通過：漏context/target/leaf、source漂移、loading、溢位、錯字、錯PNG、假母語／全域批准等均拒 |
| 全15卡及30FAQ每個展開狀態都驗過 | no | 超出此次最小充分範圍 |
| 母語者／全站／公開發布批准 | no | flags均false，本輪無發布 |

## 實際指令與輸出

工作目錄 C:/agywork/agd-holiday-prototypes。

\`\`\`powershell
node holiday-lab/reports/integrated-review-20261023/guide-independent/prepare.cjs
node holiday-lab/reports/integrated-review-20261023/guide-independent/run.cjs
node holiday-lab/reports/integrated-review-20261023/guide-independent/verify.cjs ${dir.replace(/\\/g,'/')}
# PLAIN_QA_RUN 指定上述run，再執行
node --test holiday-lab/reports/integrated-review-20261023/guide-independent/verify.test.cjs
\`\`\`

run-output.txt 保存八筆 PASS 與 PLAIN_COPY_INDEPENDENT pass。verify-command.json 保存實際spawn指令、stdout、stderr、exit_code=${command.exit_code}。verify-tests-command.json 保存同樣欄位，exit_code=${tests.exit_code}，stdout tests16/pass16/fail0。

\`\`\`json
${JSON.stringify(v,null,2)}
\`\`\`

實際新證據目錄：${dir.replace(/\\/g,'/')}。

bundle ${summary.bundle.file}：${summary.bundle.sha256}。student-guide.css：${summary.css.sha256}。freeze：${summary.freeze_sha256}。全部18來源與360建置檔SHA見freeze.json；方法SHA見method-freeze.json；驗收器自身SHA另見verification-method-freeze.json。

已用view_image檢視本輪 zh320初始、ja1440初始與ja320請假目標截圖，未宣稱使用者美術核准。完整圖保留於run資料夾。

研究16名稱的成果在 translation-review/proper-names-research-20261023/，與本QA分開。該研究發現的115招生名額落差仍是待確認內容；本輪排版及12詞句通過不會把它蓋掉。
`;
fs.writeFileSync(path.join(__dirname,'REPORT.md'),text);
const methodFiles=['prepare.cjs','verify.cjs','verify.test.cjs','report.cjs'];fs.writeFileSync(path.join(__dirname,'verification-method-freeze.json'),JSON.stringify({at:new Date().toISOString(),files:methodFiles.map(file=>({file,sha256:sha(fs.readFileSync(path.join(__dirname,file)))}))},null,2)+'\n');console.log(JSON.stringify(summary));
