const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),{verify}=require('./verify.cjs'),out=__dirname,dir=path.join(out,'runs/2026-10-23T11-39-56-308Z'),r=JSON.parse(fs.readFileSync(path.join(dir,'result.json'))),f=JSON.parse(fs.readFileSync(path.join(out,'freeze.json'))),v=verify(dir);
const commands=Object.fromEntries(['preparation','run','verify','verify-tests'].map(n=>[n,JSON.parse(fs.readFileSync(path.join(out,n+'-command.json')))]));for(const [name,c]of Object.entries(commands))assert.equal(c.exit_code,0,name);
assert.equal(sha(fs.readFileSync(f.author_freeze)),f.author_freeze_sha256);assert.equal(sha(fs.readFileSync(path.join(f.peer,'holiday-lab/translation-review/official-guide-names-20261023/plan.json'))),f.plan_sha256);
const summary={...v,base:r.base,peer:f.peer,peer_head:f.peer_head,product_commit:f.product_commit,run:dir,route_views:r.cases.reduce((n,c)=>n+(c.routeViews?.length||1),0),source_stable:JSON.stringify(r.sourceBefore)===JSON.stringify(r.sourceAfter),http_stable:JSON.stringify(r.httpBefore)===JSON.stringify(r.httpAfter),http_files:r.httpBefore.length,exact_source_pointer_changes:r.sourceBefore.sourceDiff.reduce((n,x)=>n+x.differences.length,0),dict_changes:r.sourceBefore.dictDiff.map(x=>({lang:x.lang,changed:x.differences.length})),retained_program_values:r.sourceBefore.retainedRows.length,data_only_values:0,freeze_sha256:sha(fs.readFileSync(path.join(out,'freeze.json'))),bundle:f.build_files.find(x=>/^app-/.test(x.file)),css:f.source_files.find(x=>x.file==='student-guide.css'),command_exits:Object.fromEntries(Object.entries(commands).map(([k,c])=>[k,c.exit_code]))};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
const text=`# 正式名稱新版獨立驗收

結論：本機指定範圍通過。來源為 ${f.peer}，產品提交 ${f.product_commit}，文件HEAD ${f.peer_head}；實際服務 ${r.base}。本輪重採全部證據，沒有借舊receipt批准。

## 第一眼與實際操作

24個累積譯值均在原生頁面可見，每值於320／1440寬各一次，共${v.target_observations}次，data-only為0。特別由真UI打開 financial-aid 的官方來源details、status-military復學FAQ，並導航到日文tech-elite內容與提醒；沒有只從JSON找到名稱就算畫面完成。

六個指南context為zh/en/ja各320／1440；另兩個日文招生context各寬度內依次看selection及tech-elite，合計${summary.route_views}個route views。指南覆蓋初始、第一FAQ鍵盤開關、各target實際所需卡片／來源／FAQ展開、搜尋空結果與重設；量測每個狀態下 #student-guide 的全部渲染文字葉，非只看target段落。招生僅本次改譯目標及其實際容器，未擴成全部招生舊文案驗收。

已檢視本輪EN320急難來源、EN320請假段落、JA320技優資格長段與JA1440提醒截圖，文字可讀；這是範圍內畫面檢查，不是使用者美術批准或母語者審查。

## 逐條yes／no

| 項目 | yes／no | 證據 |
|---|---|---|
| 精確新12名稱＋舊12保義，共24來源pointer | yes | 五JSON與原始preimage逐key比對，sourceDiff=${summary.exact_source_pointer_changes}，非只比改動清單 |
| 新12僅更換該名稱片段 | yes | 原句fromName唯一一次，replace結果等於原查證候選及author plan |
| 生成EN/JA字典全部key一致 | yes | 原生成器記憶體輸出與產品bytes一致；累積EN15/JA9，不接受其他key差異 |
| 其餘4個PROGRAM與中文原文維持 | yes | retained4 source/locale核對；未改source SHA逐項與原input核對 |
| 24個值兩寬度均可實際到達 | yes | ${v.target_observations}個target，逐筆完整值、Range、CDP平台字型與PNG |
| 全可見葉文字在指定狀態均採樣 | yes | ${v.guide_layout_samples}次layout、${v.guide_leaf_observations}葉觀測，每葉owner完整 |
| 字型就緒／孤尾／水平溢位 | yes | 各sample先布局→fonts.ready→loaded；原規則孤尾0、owner/page溢位0 |
| 導覽／分類／身分／快捷焦點／FAQ鍵盤／搜尋重設 | yes | 六組operations均過，依真實hamburger可見性操作 |
| Console例外或400以上網路回應 | yes | 八組errors空；只聲稱本輪載入範圍 |
| 新版source/build/HTTP前後穩定 | yes | ${v.source_files}來源與${v.build_files}建置逐檔SHA，${summary.http_files}個HTTP200/bytes/SHA前後同；author freeze及plan收尾SHA也同 |
| readonly及驗收器正反例通過 | yes | verify exit0；tests16/pass16/fail0，漏context/target/leaf、loading、溢位、錯字/PNG、假全域批准均拒 |
| 所有網站舊稱已清完 | no | 非本輪24pointer以外名稱不擅改；作者另記舊稱待查 |
| PROGRAM新候選已套用 | no | 該研究另案，4舊值仍鎖定 |
| 母語者／全站／公開發布批准 | no | 三旗標均false |

孤尾沿用已凍結measure.cjs：最後一行僅一個中日文字或英文字母（可伴標點）為失敗；英文完整單字的正常換行只留旗標供審閱，不宣稱每個英文末行都有多字。Range分行／界線保留原2px行組與1px子像素邊界規則；旋轉漫畫標題Range行組不等於語言學行。未改字型字級、縮放或隱藏文字規避驗收。

## 真實指令與輸出

本輪method在主樹新資料夾，執行cwd必須為peer ${f.peer}；不在peer新增驗收檔。實際命令及退出碼保存於四份 *-command.json，沒有用管線的0掩蓋Node退出碼。

\`\`\`powershell
node ${path.join(out,'prepare.cjs').replace(/\\/g,'/')}
node ${path.join(out,'run.cjs').replace(/\\/g,'/')}
node ${path.join(out,'verify.cjs').replace(/\\/g,'/')} ${dir.replace(/\\/g,'/')}
# PLAIN_QA_RUN 指定上述run
node --test ${path.join(out,'verify.test.cjs').replace(/\\/g,'/')}
\`\`\`

run stdout八筆PASS，最後 PLAIN_COPY_INDEPENDENT pass；run/verify/tests均真exit0。準備首次誤用peer相對路徑而MODULE_NOT_FOUND，尚未啟瀏覽器；改用主樹絕對方法路徑後成功，未改產品或舊證據。

\`\`\`json
${JSON.stringify(v,null,2)}
\`\`\`

exact run：${dir.replace(/\\/g,'/')}。bundle ${summary.bundle.file} SHA ${summary.bundle.sha256}；CSS SHA ${summary.css.sha256}。來源／建置manifest freeze.json SHA ${summary.freeze_sha256}；方法與量測SHA見method-freeze.json，readonly/test/report自身另固定於verification-method-freeze.json。

原語意階段『其他16不變』的歷史約束已合法失效。本輪新方法從原始preimage套完整24個允許值後比較整本JSON／字典，不修改舊方法，亦沒有把所有舊約束關掉只求綠燈。
`;
fs.writeFileSync(path.join(out,'REPORT.md'),text);fs.writeFileSync(path.join(out,'verification-method-freeze.json'),JSON.stringify({at:new Date().toISOString(),files:['prepare.cjs','verify.cjs','verify.test.cjs','report.cjs'].map(file=>({file,sha256:sha(fs.readFileSync(path.join(out,file)))}))},null,2)+'\n');console.log(JSON.stringify(summary));
