const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root='C:/agywork/agd-holiday-prototypes',out=__dirname,read=n=>JSON.parse(fs.readFileSync(path.join(out,n))),old=JSON.parse(fs.readFileSync(path.join(root,'holiday-lab/reports/comprehensive-followup-20261023/root/webgl-source-recheck.json')));
const first=read('01-current-folder-accounts.json').actual_results,last=read('05-final-recheck-and-older-nested.json').actual_results,secondary=read('02-folder-metadata-index-and-failed-search.json').actual_results,third=read('03-related-names-parent-and-orders.json').actual_results,fourth=read('04-limited-older-flora-and-recent-folders.json').actual_results;
const value=(rows,label)=>rows.find(x=>x.status==='fulfilled'&&(x.value.label===label||x.value.account===label)).value,final=value(last,'handoff_final_recheck'),files=final.result.structuredContent.files,prior=old.files.map(x=>({id:x.id,title:x.title,mime_type:x.mime_type,size:x.size,modified_time:x.modified_time})).sort((a,b)=>a.id.localeCompare(b.id)),now=files.map(x=>({id:x.id,title:x.title,mime_type:x.mime_type,size:x.size,modified_time:x.modified_time})).sort((a,b)=>a.id.localeCompare(b.id));assert.deepEqual(now,prior);assert.equal(files.length,5);assert.ok(files.every(x=>x.file_or_folder==='file'));
const existing=[...value(fourth,'existing_flora_demo').result.structuredContent.files,...value(fourth,'existing_flora_project').result.structuredContent.files.filter(f=>f.file_or_folder==='file')],nested=value(last,'existing_flora_nested').result.structuredContent.files;for(const n of ['Assets','Packages','ProjectSettings'])assert.ok(nested.some(f=>f.title===n));
const result={schema:1,observed_started_utc:value(first,'personal').at.current_time,observed_final_utc:final.at.current_time,observed_final_taiwan:'2026-10-23 19:49:30 UTC+8',method:'Current authenticated Google Drive connector folder/metadata/fetch/search; no Unity or browser execution',account_discovery:'list_folder tool metadata explicitly listed allowed account link IDs; persisted tool-account-discovery.txt. No account ID guessed.',folder:old.folder,folder_read:'success',direct_children:files,child_folders:0,same_five_metadata_as_old_observation:true,old_observation_not_used_as_current_evidence:true,webgl_build_return_observed:false,webgl_build_received:false,webgl_integratable_now:false,absence_elsewhere_proven:false,related_scope:{parent_folder:value(third,'parent_folder').result.structuredContent.files,related_name_search:value(third,'related_names_corrected').result.structuredContent.results,recent_folders:value(fourth,'recent_return_folders').result.structuredContent.results},older_archive_candidates:existing,older_flora_nested:{url:'https://drive.google.com/drive/folders/1fqcb9Ndexm-so52k0djr6mO3LKV6QGz1',entry_count:nested.length,unity_shaped_directories:['Assets','Packages','ProjectSettings'],identity_confirmed:false,complete_source_verified:false,webgl_build_verified:false},limitations:['學校帳戶對該folder回空，個人帳戶列5項；不拿前者推全域不存在。','初次相關名搜尋raw q語法錯誤HTTP400，已留底並以Google Drive合法name contains語法更正成功。','關聯搜尋工具限制可搜尋MIME類型，不能以此排除任意ZIP/RAR二進位檔；本輪folder listing有列到舊ZIP/RAR但未下載檢查內部。','較早Flora候選不是TF-BASE本次回傳；檔名不作同款身分認定，也不斷言壓縮檔內沒有WebGL。','僅指定folder/parent與有限關聯候選，未證TF-BASE本機或其他未列位置不存在。'],downloaded_build:false,downloaded_large_archives:false,unity_started:false,remote_job_resent:false,sharing_modified:false,product_written:false,shutdown_performed:false};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({folder_read:result.folder_read,at:result.observed_final_utc,children:files.length,child_folders:0,webgl_return_observed:false,older_archive_candidates:existing.map(f=>({title:f.title,bytes:f.size})),unity_started:false,product_written:false}));
const report=`# TF-BASE 關機前回傳查證

截至 **2026-10-23 19:49:30（台灣；11:49:30 UTC）**，指定[WebGL交接資料夾](${old.folder})可讀，仍只有5份原工單／腳本，沒有子資料夾、Build log或已回傳WebGL產物。此結論來自本輪兩次新list_folder，不把10:06 UTC舊觀測當目前狀態。

兩份工單本輪實讀仍標SOURCE_UNAVAILABLE，修改日為10月22日。父資料夾本輪也只列該交接folder。關聯名稱及近期WebGL相關folder搜尋未找到新的回傳資料夾，但不是宣稱TF-BASE本機、其他Drive位置或壓縮檔內沒有WebGL。

## 另外找到的舊候選

| 名稱 | 大小 | 修改時間 | 判定 |
|---|---:|---|---|
${existing.map(f=>`| [${f.title}](${f.url}) | ${Number(f.size).toLocaleString('en-US')} bytes | ${f.modified_time} | 舊壓縮檔；未下載核內部，不當本次WebGL回傳 |`).join('\n')}

較早[Flora目錄](https://drive.google.com/drive/folders/1fqcb9Ndexm-so52k0djr6mO3LKV6QGz1)可讀到Assets／Packages／ProjectSettings及其他Unity形式檔案；僅是舊來源候選，尚未核作品身分與完整性。本輪未深入Library／Assets、未開Unity，也未取5.68GB的同名壓縮檔來臨時建置。

## 本輪可核對的結果

| 項目 | yes／no | 證據 |
|---|---|---|
| 當前交接folder新查詢成功 | yes | 11:47:41及11:49:30 UTC皆5項，真metadata見01／05 JSON |
| 相對舊metadata是否仍同五項 | yes | id/title/mime/size/modified逐筆完全相同；不是引用舊值冒充新查詢 |
| 可見WebGL index／loader／wasm／data完整組合 | no | 指定folder只有五份工單／腳本；未有可驗清單 |
| 本輪可直接把兩款整合進站 | no | 尚無已確認WebGL產物；不使用未核壓縮檔冒充 |
| 已證其他地方完全沒有來源或WebGL | no | 未做全域完整盤點；相關搜尋有MIME限制 |
| 下載大型檔／啟Unity／重送工單／修改分享／發布 | no | 均未執行 |

已連接Google Drive工具在本代理可用，帳戶link_id來自工具自身明列的帳戶metadata，沒有猜ID。個人Drive列出五項；學校帳戶對同folder回空，該空結果只代表此帳戶查詢範圍，不代表其他帳戶亦空。一次關聯搜尋因自寫raw q語法錯誤回400，保留02證據；改正語法後03成功，未將查詢失敗當作未回傳。

實際採證：list_folder（指定folder及parent）、get_file_metadata（folder）、fetch（工單索引及兩工單）、metadata名稱搜尋、近期folder搜尋與有限舊Flora folder listing。沒有新登入或權限變更，不需Chrome備援。

\`\`\`powershell
node holiday-lab/reports/tfbase-shutdown-check-20261023/assemble.cjs
\`\`\`

完整工具結果及真觀測時間保存在01–05 JSON；result.json為機讀判定。這項查證完成後不再開新QA或建置，交主控保全與暫停；本代理未執行系統關機。
`;
fs.writeFileSync(path.join(out,'REPORT.md'),report);const manifest=fs.readdirSync(out).filter(n=>n!=='manifest.json').sort().map(file=>{const b=fs.readFileSync(path.join(out,file));return{file,bytes:b.length,sha256:sha(b)};});fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({at:new Date().toISOString(),files:manifest},null,2)+'\n');
