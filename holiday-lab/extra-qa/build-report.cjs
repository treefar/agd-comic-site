const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,runs=fs.readdirSync(path.join(root,'runs')).sort().map(n=>({name:n,data:JSON.parse(fs.readFileSync(path.join(root,'runs',n,'results.json'),'utf8'))}));
const expected=['peace-memory','qingming','labor','retrocession','constitution'].flatMap(id=>[`${id}/zh/1440`,`${id}/zh/390`]).concat('constitution/ja/390');
const selected=new Map(),history=[];for(const run of runs)for(const c of run.data.cases){const key=[c.game,c.lang,c.width].join('/');history.push({run:run.name,key,status:c.status,error:c.error||null});if(c.status==='pass')selected.set(key,{run:run.name,...c,receipts:run.data.receipts});}
const complete=expected.every(k=>selected.has(k)),sameSources=[...selected.values()].every(c=>JSON.stringify(c.receipts.before)===JSON.stringify(c.receipts.after)&&JSON.stringify(c.receipts.before)===JSON.stringify(runs[0].data.receipts.before));
const result={complete,sameSources,expected:expected.length,passed:expected.filter(k=>selected.has(k)).length,history,selected:[...selected.values()]};
fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify(result,null,2)+'\n');
let md='# 追加五款：獨立 DOM 試玩驗證\n\n2026-10-22；唯讀固定預覽 http://127.0.0.1:8804/ （.review-replay-01）。只寫 `holiday-lab/extra-qa/*`，未改遊戲或renderer、未push／main／刪檔／停伺服器。\n\n';
md+='先讀五份原開發報告與真實runner／控制DOM；來源雜湊在 report-sources.json。全部以實際按鈕、滑桿、RAF、結果DOM操作，不匯入遊戲規則、不直接呼叫complete、不加速遊戲時鐘。手機390按鈕使用touchscreen.tap；滑桿使用原生DOM輸入事件。已知解答回歸不等同學生盲測，通關秒數不能推論實際學生需時或30–90秒體驗。\n\n';
md+='|遊戲|語言／寬|錯誤→修正→完成|三段回放→重試|Console／網路／解碼圖|已知解操作秒數|證據|\n|---|---|---|---|---|---:|---|\n';
for(const key of expected){const c=selected.get(key);md+=c?`|${c.game}|${c.lang}／${c.width}|yes|yes|yes|${c.knownSolutionSeconds}|[結果](runs/${c.run}/results.json)、[畫面](runs/${c.run}/${c.replayScreenshot})|\n`:`|${key}|未完成|no|no|no|未驗證|無通過證據|\n`;}
md+='\n|驗收|yes／no|證據|\n|---|---|---|\n';
md+=`|5款中文桌面與390、代表性日文390共11組|${complete?'yes':'no'}|${result.passed}/11有完整通過紀錄|\n|所有採用結果為同一份served runtime|${sameSources?'yes':'no'}|每輪runner/model/catalog/CSS/5遊戲SHA前後與各輪一致|\n`;
md+='|真實錯誤被阻擋、修正後保存實際輸入|'+(complete?'yes':'no')+'|heard順序、path與retry、6工作排程、3對位、3字幕設定均查結果artifact|\n';
md+='|回放不是只看完成分數|'+(complete?'yes':'no')+'|3個不同data-shot、caption、每段解碼圖片；qingming同shot內位置改變；constitution三段有實際字幕DOM|\n';
md+='|圖像可讀性／美術已由使用者確認|no|本輪工具擷取與代理檢視不代替使用者確認|\n|學生盲測／樂趣與難度完成驗證|no|本輪為已知解答回歸|\n|全部15款／全部語言／全部裝置都驗證|no|本輪只追加5款與明列11組|\n\n';
md+='首輪失敗與更正：原檢查僅在networkidle後立即讀naturalWidth，在labor兩種寬度與peace-memory390遇到新shot圖片尚在解碼的瞬間，錯判為破圖。原紀錄保留於首輪results.json（HTTP/console/request皆無錯），沒有以刪除失敗改寫歷史。驗證器已改成等待當前圖片complete且naturalWidth>0，最多5秒；只重跑這3組並核對served SHA。若等待後仍失敗會保留complete與naturalWidth，不把暫時載入中稱為缺檔。產品沒有因這3筆變更。\n\n';
md+='labor初始進度實際是1/6（首件有效工作）而非0/3；重試比對各款原始進度，不套用錯誤假設。qingming先以合法但會失敗的線長150／張力1真實飛行到失敗，再用retry調整通關；完成artifact保留失敗路徑。constitution需每格真正等6秒預覽結束，才收下。\n\n';
md+='實際指令（輸出原文見command-output.txt、retest-desktop-output.txt、retest-mobile-output.txt）：\n\n```powershell\n$env:EXTRA_QA_URL=\'http://127.0.0.1:8804\'\nnode holiday-lab/extra-qa/playthrough.cjs\n# 首輪image等待競態修正後，僅重測3組；歷史保留\n$env:EXTRA_QA_GAMES=\'labor\'\nnode holiday-lab/extra-qa/playthrough.cjs\n$env:EXTRA_QA_GAMES=\'peace-memory,labor\'\n$env:EXTRA_QA_WIDTH=\'390\'\nnode holiday-lab/extra-qa/playthrough.cjs\nnode holiday-lab/extra-qa/build-report.cjs\nnode --check holiday-lab/extra-qa/playthrough.cjs\ngit diff --check -- holiday-lab/extra-qa\n```\n\n';
md+=`彙整實際輸出：\n\n\`\`\`text\nMATRIX ${result.passed}/11 ${complete?'YES':'NO'}\nSAME_SERVED_SOURCES ${sameSources?'YES':'NO'}\n\`\`\`\n`;
fs.writeFileSync(path.join(root,'REPORT.md'),md);console.log('MATRIX '+result.passed+'/11 '+(complete?'YES':'NO'));console.log('SAME_SERVED_SOURCES '+(sameSources?'YES':'NO'));assert.ok(complete&&sameSources,'full bounded matrix and stable sources required');
