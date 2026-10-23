import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const heading='## 2026-10-23 最新：整句翻譯與固定按鈕框（整合驗證中）';
const block=`${heading}

- source_agent: codex。本機分支codex/holiday-prototypes，未push、未發布、未碰main、未刪檔。8800/.review-local-09與舊local09 ZIP保留；最新09/.measure-integrated-09在8846僅內部量測，不當新版交付；08/8845固定供既有完整遊戲矩陣。產品提交80286ca、ac7ba78、b775698；08整合續報holiday-lab/reports/integration-20261023-08.md，09精修見translation-review/post-specialist/REPORT.md。
- 三款創作深化已合併；semester真整合8/8、24次真指南、每組4次諮詢/4回放。獨立代理實際探索三款各兩作品，保留08年獸錯眉向P2；root09已分正向傾斜/近水平提示，6/6提示複驗、8/8功能回歸，原紅與54張viewport留存。不冒稱真人學生測試。
- 共用按鈕原整圖縮放會使長句貼框；改原生成素材四向九宮格、固定12px框，slider保44px不被flex壓窄。06由固定sampler一次46/46組、138態及當前可讀DOM geometry0，20次窄版真range進退、3語窗口移動皆過。所有03/04局部padding、05窄stepper失敗保留；這不是全scroll/fullphase gate，FINAL-06.md列明限制。
- 日英審校完成FAQ30組/120值、師資13位349來源欄/698值，及另組13位職階忠實對照13/13。首頁消息/作品/About/Labs的盤點348唯一鍵，前8、19、103、218精確分工完成語義審查；並非全站2310字串母語認證，正式專名/六筆碩士類型/部分原事實衝突仍待確認。
- 本輪13消息作品譯值+一處canonical公司名已套；主控讀合作方官方about確認株式会社オートクチュール/hautecouture Inc.及松山/樹德合作，JA長key與EN生成鍵連動。舊編譯守門真紅→重建後verify-applied通過；03真DOM28/28、4188字元配對missing0/unknown0。首輪17/28是等待#root過早的工具假缺席，改等真正目標文字後全過，舊輸出保留。
- About/Labs44與News/Works82已套，合計本輪13+44+82=139譯值；另兩處canonical僅修合作方正式公司名，中文其他內容由基準測試保護。開拓全段1筆因作品資格矛盾排除，沒有擅改原條件。08 build exit0，三批生成校對13/44/82皆yes。About整句07獨立12/12、764字元樣式cmap missing0/unknown0；Works完整標題保中文20話與黃色重點，3測試通過。08新增44/82可見DOM及字體由第二位翻譯代理續驗。
- 使用者追加專職英日翻譯組，已由兩位代理分工。職稱組f052eb4：JST/MEXT逐筆查證，助理教授→Assistant Professor→助教是通用對照，與TA及舊助教授分開；13位職稱/26個英日頁/144文字值真DOM通過，0JS錯誤。後續獨立codex/faculty-neutral-degrees六個education只移除原文未提供的MA/MFA等細類，改一般Master's degree，保學校/領域/年份；3928b20整合為ac7ba78。09實際12/12句、420字元樣式cmap missing0/unknown0；九筆證照與正式學位名稱仍未重新取一手認證。
- 第二位翻譯代理已分類08的44+82值及Works整標，共256個目標：244實際可見、13994字元樣式cmap missing0/unknown0；12 data-only與10個刻意二行省略的摘要另列，不洗成全文畫面通過。兩UNKNOWN原是Cambria Math的▸缺字體檔收據，實讀Windows registry/TTC解決，未換字體。查出日文影音漏音聲、英文配樂之外漏影視，root兩筆精確修正b775698，09四目標/106字元cmap通過。整份字典與08相比只有EN7+JA1共8值改動；其他值全同，13相關測試與09 Build通過。283個holiday-lab runtime於08/09逐byte全同，舊遊戲量測不改base或回填SHA。
- 原英文T字左側真1px截切，root controls加左右2px；08獨立原case85frames、26按鈕三態、339/339全文捲動與geometry0，來源278逐byte相同/5編譯或QA輸入另列。root08全Node187/187、四款label變更功能4/4（教師/國慶/和平/勞動，含通關/三回放/重試）、dashboard23/23及smoke2/2，15模組SHA收據可追查，不等於整包layout核准。舊175/176、179/180及局部padding真紅保留。
- 08完整phase/all-errors/按鈕三態及front90+archive6仍在跑；06活批次保留未重啟，sampler/assetmap仍freeze。已完成constitution/lunar/lantern/children phase及newyear/lunar/lantern front；正式coverage本次510/2076，均geometry0但不等於全gate。最短合法140ms已另組真DOM6/6、54同鏡墨跡/真圖全過，實際rAF呈現148.9–151.2ms如實留底；日文320字幕末字孤行P2保留。static-error-max另補兩款有限候選全測證據，未用字數冒充最大墨跡，完整報告待回。官方ui-layout-policy仍未閉合，禁止新版出包。
- TF-BASE交接夾本輪仍只有5份工單/腳本、兩遊戲源及WebGL待回；未啟Unity或更改遠端權限。下一輪第一件事：核對08兩矩陣live PID/輸出，整合兩款static-error-max真採樣證據並列最小剩餘清單；完成正式gate才產新包。C節SHA維持95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680。Vault專案紀錄已備援；索引發現兩個同名列60/379，未猜選覆寫或刪重複，詳vault-index08-pending.json。

`;
const oldHeading='## 2026-10-23 最新：翻譯審校與三款玩法深化（本機驗證中）';
function replaceLatest(text){let start=text.indexOf(heading);if(start<0)start=text.indexOf(oldHeading);if(start<0)throw Error('LATEST_BLOCK_MISSING');let end=text.indexOf('\n## ',start+3);if(end<0)throw Error('NEXT_BLOCK_MISSING');return text.slice(0,start)+block+text.slice(end+1);}
const project='C:/Projects/系網漫畫版_AGDComicSite',handoff=project+'/LATEST_HANDOFF.md';
if(!execFileSync('git',['-C',project,'branch','--show-current'],{encoding:'utf8'}).trim().startsWith('codex/'))throw Error('UNEXPECTED_ORIGINAL_BRANCH');
if(execFileSync('git',['-C',project,'rev-parse','refs/remotes/origin/main'],{encoding:'utf8'}).trim()!=='1b8322e69d84549db220d849afb1aac0fb9d7c2a')throw Error('ORIGINAL_MAIN_CHANGED');
const original=fs.readFileSync(handoff,'utf8'),section=s=>s.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0],sha=s=>createHash('sha256').update(s).digest('hex');if(!section(original)||sha(section(original))!=='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680')throw Error('C_SECTION_CHANGED');
fs.writeFileSync(handoff,replaceLatest(original));if(section(fs.readFileSync(handoff,'utf8'))!==section(original))throw Error('C_SECTION_CHANGED_AFTER');
const status='holiday-lab/STATUS.md';fs.writeFileSync(status,replaceLatest(fs.readFileSync(status,'utf8')));
const memory='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶',record=memory+'/專案紀錄/系網漫畫版_AGDComicSite.md';const note=fs.readFileSync(record,'utf8');if(!note.includes('source_agent: codex'))throw Error('MEMORY_AGENT_MISSING');fs.writeFileSync(record,replaceLatest(note));
const index=memory+'/05 專案索引.md',rows=fs.readFileSync(index,'utf8').split('\n');
const hits=rows.map((s,i)=>s.startsWith('| 系網漫畫版 AGDComicSite |')?i:-1).filter(i=>i>=0);
if(hits.length!==1){
 fs.writeFileSync('holiday-lab/reports/vault-index08-pending.json',JSON.stringify({source_agent:'codex',date:new Date().toISOString(),index,matching_rows:hits.map(i=>i+1),status:'not_updated',reason:'More than one project row; preserve the index rather than guessing which duplicate to change.',handoff_and_project_record_updated:true,push_performed:false},null,2));
 console.log('VAULT_INDEX_NOT_UPDATED: ambiguous rows '+hits.map(i=>i+1).join(','));
}else{
 const n=hits[0],cells=rows[n].split('|');
 cells[3]=' 2026-10-23：未發布，8800舊09與ZIP保留。新09/8846僅量測：六學位回一般碩士、兩漏譯補回，16畫面/526字元cmap及13相關測試過；283遊戲runtime與08逐byte全同。英日職稱13人26頁144值、08主站244可見13994字元已複驗，12 data-only/10二行摘要分開。UI2076矩陣及TF-BASE兩源仍待，禁止新包。詳原LATEST_HANDOFF及專案紀錄，source_agent: codex ';
 rows[n]=cells.join('|');fs.writeFileSync(index,rows.join('\n'));
}
console.log('HANDOFF_STATUS_PROJECT_RECORD_UPDATED C_SHA='+sha(section(original))+'; no sync/push performed');
