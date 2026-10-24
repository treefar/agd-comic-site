const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const d=__dirname,root='C:/agywork/agd-holiday-prototypes',worker=path.join(root,'holiday-lab/reports/legacy-reader-20261024');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(f),json=f=>JSON.parse(read(f));
const result=json(path.join(d,'parser-review.json')),receipt=json(path.join(d,'check-command.json'));
// Save the actual installed local source, not a fetched version or remembered API.
const modules=['word-ole-extractor.js','filters.js','document.js','ole-header.js','ole-directory-tree.js','ole-compound-doc.js','ole-allocation-table.js','ole-storage-stream.js','buffer-reader.js'];
const reviewRead={at:new Date().toISOString(),files:modules.map(f=>{const file=path.join(worker,'runtime/node_modules/word-extractor/lib',f),b=read(file);return {file,sha256:sha(b),bytes:b.length,source:b.toString('utf8')};}),package_lock:{file:path.join(worker,'runtime/package-lock.json'),sha256:sha(read(path.join(worker,'runtime/package-lock.json')))},worker_scripts:['extract.cjs','extract-r2.cjs'].map(f=>({file:path.join(worker,f),sha256:sha(read(path.join(worker,f))),source:read(path.join(worker,f)).toString('utf8')}))};
fs.writeFileSync(path.join(d,'local-source-read.json'),JSON.stringify(reviewRead,null,2)+'\n');
const checkRows=result.checks.map((c,i)=>`| ${String(i+1).padStart(2,'0')} | ${c.id} | ${c.yes?'yes':'no'} | parser-review.json /checks/${i} |`).join('\n');
const p='C:/agywork/agd-holiday-prototypes/holiday-lab/reports/legacy-reader-review-20261024';
const md=`# 兩份二進位 DOC 純 Node 解析獨立驗收

查驗日期：2026-10-24（台灣）；獨立執行時間：${result.at}。本次只讀檔案，不執行 Word、網站、瀏覽器、網路、Build、Unity 或遊戲。

結論：正式終版 parsed-r2 的「兩原件全部已宣告文字 story 已讀取，沒有以 strings 片段或 body 非空冒充全文」為 **yes**。獨立檢查54項 yes、0項 no，實際 Node 命令 exit 0，stderr 空。這個結論限於文字流；原 Word 表格版面、圖像／嵌入物件、列印分頁及115學年度適用性沒有因此成立。

## 證據版本與方法

正式證據是 ${worker}/parsed-r2/extraction.json，對應 extraction-r3-command.json（extract-r2.cjs，exit 0）。worker 根目錄 extraction.json 是保留的第一輪失敗，evaluation 的區間 helper 對不相交 piece 使用負 slice end，誤把正文502抽成520、零長腳註抽成18；all_story_ranges_covered 為 false。此舊檔不列為通過證據。終版先取 piece 與 CP 區間交集，解決分段收據錯誤；兩輪 API 正文 SHA 相同，不能把 helper 錯誤說成原 DOC 缺文。

本驗收先讀實際安裝 word-extractor@1.0.4 的原碼、package.json 與 package-lock.json，再另寫未引用該套件 CFB 模組的讀取器，直接自原 DOC 解 FAT／DIFAT／directory／miniFAT 及 WordDocument、1Table。每條鏈檢查邊界與循環，依目錄長度完整取流。之後按 FIB 自述的陣列長度走訪，不只取固定偏移的正文長度；CLX 依 lcb 設界，逐 PRC／PCDT／CP／PCD 解讀到終點，按 file offset 讀每個 UTF-16 piece。再以原套件獨立實跑一次，擷取清理前後每個 CP 的差異，比對 worker 每個 story、每個 API 輸出與原始流 SHA。

套件安裝版與 lock 均為1.0.4；本輪沒有下載 npm 套件，故 lock integrity 僅是既存鎖定收據，沒有宣稱本輪重下載驗證發布包。實讀原碼及 SHA 存於 local-source-read.json；本輪 package 全檔前後相同。

## 原件與結構結果

| 項目 | 實習認定表 recognition | 實習評分表 evaluation |
|---|---|---|
| 原件 bytes | 31744 | 43008 |
| 原件 SHA-256 | 4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22 | 741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d |
| CFB 簽章 | d0cf11e0a1b11ae1 | d0cf11e0a1b11ae1 |
| CFB major／sector／mini sector | 3／512／64 bytes | 3／512／64 bytes |
| WordDocument／1Table | 8248／7629 bytes | 15416／11749 bytes |
| 完整 FIB 容器陣列 | csw14、cslw22、183對 fc/lcb、cswNew5 | 同左 |
| FIB 走訪終點／fcMin | 1630／2048 | 1630／2048 |
| FIB nFib／擴充首值 | 0x00c1／0x0112 | 同左 |
| CLX fc／lcb | 6066／21 | 10312／45 |
| CLX 終點 | 6087，正好等於 fc+lcb | 10357，正好等於 fc+lcb |
| 全部 piece 的 CP | [0,154] | [0,256,512,540] |
| 全部 piece 解碼單位 | 154 | 540 |
| 正文 CP | [0,144)，144 | [0,502)，502 |
| 頁首尾文字流 CP | [144,153)，9 | [502,539)，37 |
| 其餘文字 story | 腳註、巨集、註解、尾註、正文文字方塊、頁首尾文字方塊均宣告0 | 同左 |
| story 範圍以外尾端 | [153,154)，單一 CR | [539,540)，單一 CR |
| API 正文 UTF-16 單位／UTF-8 bytes | 144／312 | 502／990 |
| API 正文 SHA-256 | a00a3a226130eedf26ffde5acc879d12368cf2abe5afc69943d71437327d369c | 3f10639975b05b5b7cc2b07961712c74ee1da00bb67d2d117a8d2aff69c1ab02 |

表中的 CP／單位是 UTF-16 code unit，包含控制字，不是中文字數或頁數。兩檔所有 piece 都是未壓縮 UTF-16，實際取出的 byte 數與 CP 宣告逐段一致；不用推定其他編碼。FIB 基底 nFib 與擴充首值不同，已記錄兩者，不只用 nFib 把整份檔案武斷標成純舊版格式。

## 清理、欄位及表格

| 可判定事項 | yes／no | 實際證據與限制 |
|---|---|---|
| 所有已宣告文字 story 均有原字串及精確 CP 範圍 | yes | 自原件獨立解析後，逐 story SHA 與 worker 完全相同；零長 story 也實核為0。 |
| 每個 piece 都讀到宣告終點 | yes | 1／3個 piece、連續 CP 與 byte 範圍逐段核對，整段拼接 SHA 相同。 |
| 原始腳註／尾註分隔符及 PAGE 欄位沒有被原始證據漏掉 | yes | evaluation 頁首尾37單位完整保留；分隔符 U+0003／0004、PAGE 指令與結果1都在 raw story。 |
| 字元屬性階段沒有把可見正文當刪除文字抹去 | yes | 兩檔 character 差異0；此檔沒有靠套件刪除標記遮掉正文。 |
| 表格段落處理只改控制符 | yes | recognition 7處、evaluation 12處，均 U+0007→LF，無可見字改動；逐 CP 位置在 stage_diffs。 |
| API 純文字清理與原碼相符 | yes | CR→LF，剩餘 U+0007→Tab；控制符／欄位清理另以本驗收實作逐字重現。 |
| 清理後 API 等於所有原始碼位完全不變 | no | API 本來會移除欄位指令／分隔控制碼；故全文證據應以 raw story 與 API 合看，不能只留 body.txt。 |
| 頁碼欄位顯示結果保留 | yes | evaluation 兩個 footer 分別含無結果 PAGE、含結果1的 PAGE；API 為三LF、1、三LF。raw有完整指令，API未冒充原始碼位。 |
| 表格格線、合併儲存格、欄寬及行高完整還原 | no | 原始 BEL／Tab／CR 留存；API 僅展平的 Tab／換行，不能證視覺格線與合併關係。 |
| 完整解讀每一個 FIB 欄位的格式語意 | no | 套件只讀必要偏移，本驗收走完陣列容器並核文字相關欄位，沒有逐一實作183對欄位所指的全部格式結構。不能稱整個 Word 規格已解析。 |
| Word 圖像、形狀、Data、物件、列印頁面及視覺版面均核畢 | no | 只列出 CFB 目錄，沒有解析 Data 或物件及頁面。這些不是未覆蓋的已宣告文字 story。 |
| 原件內容可直接認定115學年度最新規定 | no | 解析器只證原件內容；沒有以成功抽文補出版本與適用年度。worker applicable_115=unknown、layout_verified=false 保留。 |

原件 evaluation 正文標題實際是「樹德科技大學動畫與戲系」。獨立讀原 CP 與套件同字，這是原件現存文字，不能擅補成「動畫與遊戲設計系」後再當原文。認定表「抵免事由／抵免時數」、評分表兩組18／16／16及各50%等皆在完整原始正文，不以段落搜尋取代全文讀取。

以上 no 是這次證據能主張的界線，不是自行新增網站發布門檻。沒有尚未讀出的已宣告文字區段；未證部分精確限於上述格式／物件語意、視覺版面及學年度適用。

## 逐條機器檢查

以下54條是本次程式實際判定，原始 detail、CP、SHA、字串與控制符明細均在 parser-review.json 對應位置；不把前節界線的 no 混入54條檢查數。

| # | 檢查 | yes／no | 實際收據 |
|---|---|---|---|
${checkRows}

## 實際命令與檔案保全

執行命令：

~~~text
node holiday-lab/reports/legacy-reader-review-20261024/run-check.cjs
~~~

runner 的實際子命令：

~~~text
${receipt.command.join(' ')}
~~~

stdout（完整）：

~~~text
${receipt.stdout.trimEnd()}
~~~

stderr：空字串；exit code：${receipt.exit_code}；signal：${receipt.signal}；error：${receipt.error}。

基準使用既存8882獨立QA快照 ${result.baseline.file}（SHA ${result.baseline.sha256}）。本輪只讀該快照並重新核檔案 SHA，未打網站：47份 source 與360份 .measure-copy-actions-20261024-01 build 檔均與舊快照相同，且本輪前後一致。worker腳本、原證據、parsed-r2終版、安裝parser全檔與鎖檔共 ${JSON.parse(read(path.join(d,'evidence-after.json'))).length} 檔前後 SHA 一致；兩原DOC另外逐件核原始SHA。before／after快照是分開檔案，沒有把舊紀錄改成今天重新實讀。

本驗收只啟自己的 Node 同步程序，未啟服務、瀏覽器或背景子程序；check runner 已取得 exit 0並終止。不停止使用者8881／8882服務。只寫本驗收目錄，沒有修原件、worker、產品、build或舊報告。

交付：

- [完整逐條與原始字串](${p}/parser-review.json)
- [實際 stdout／stderr／exit](${p}/check-command.json)
- [獨立CFB／FIB／CLX檢查程式](${p}/check-parser.cjs)
- [本機實讀原碼與SHA](${p}/local-source-read.json)
- [來源前／後快照](${p}/product-before.json)、[後快照](${p}/product-after.json)
- [worker與parser前快照](${p}/evidence-before.json)、[後快照](${p}/evidence-after.json)

本項驗收完成，停止，不新增研究、UI驗證或產品修改。
`;
fs.writeFileSync(path.join(d,'parser-review.md'),md);
const cmdFile=path.join(d,'finalize-command.json');if(fs.existsSync(cmdFile))throw new Error('Do not overwrite receipt');
const stdout=JSON.stringify({report_sha256:sha(Buffer.from(md)),report_bytes:Buffer.byteLength(md),checks:result.checks.length,yes:result.yes,no:result.no,scoped_text_stories_verified:true,layout_verified:false,applicable_115:'unknown'});
fs.writeFileSync(cmdFile,JSON.stringify({at:new Date().toISOString(),command:[process.execPath,__filename],stdout,stderr:'',exit_code:0},null,2)+'\n');console.log(stdout);
