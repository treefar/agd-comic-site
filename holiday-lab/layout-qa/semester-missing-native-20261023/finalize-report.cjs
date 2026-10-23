const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname,read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),status=read('STATUS.json'),v=read('verification.json'),source=read('source-comparison.json'),cases=read('case-receipts.json'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');assert.equal(status.state,'terminal');assert.equal(status.exit_code,0);
const rawManifest=fs.readFileSync(path.join(status.run,'report.json'));assert.equal(sha(rawManifest),v.manifest_sha256);fs.writeFileSync(path.join(dir,'fresh-run.manifest.json'),rawManifest);
const sessions=v.sessions.map(s=>({game:s.game,lang:s.lang,width:s.width,intent:s.intent,status:s.status,replay_seen:s.replay_seen,control_scroll_groups:s.control_scroll_groups.length,artifact_scroll:{expected_nonspace:s.artifact_scroll.expected_nonspace,seen_nonspace:s.artifact_scroll.seen_nonspace,missing:s.artifact_scroll.missing.length,all_content_reachable:s.artifact_scroll.all_content_reachable,visible_domain_stable:s.artifact_scroll.visible_domain_stable,text_unchanged:s.artifact_scroll.text_unchanged},error_branch_groups:s.error_branch_groups,button_state_receipts:s.button_state_receipts,case_indices:cases.filter(c=>c.intent===s.intent).map(c=>c.index)}));
const index={raw_run:status.run,raw_manifest_sha256:v.manifest_sha256,case_receipts:'case-receipts.json',case_receipts_sha256:sha(fs.readFileSync(path.join(dir,'case-receipts.json'))),sessions,composite_generated:false,original_partial_not_included:true};fs.writeFileSync(path.join(dir,'case-session-index.json'),JSON.stringify(index,null,2));
const files=['stdout.log','stderr.log','combined.log','manifest.json','STATUS.json','verification.json','source-comparison.json','case-receipts.json','case-session-index.json','fresh-run.manifest.json'].map(name=>{const b=fs.readFileSync(path.join(dir,name));return {file:name,bytes:b.length,sha256:sha(b)};});fs.writeFileSync(path.join(dir,'artifact-manifest.json'),JSON.stringify({files,full_payload_local_only:status.run,raw_shard_paths_resolve_from:status.run,manifest_snapshot_is_not_standalone_payload:true,cross_machine_full_payload_backup_confirmed:false},null,2));
const yes=b=>b?'yes':'no',types={};for(const x of v.method_violations){const key=x.violation.split(/\s/)[0];types[key]=(types[key]||0)+1;}
const report=`# 日文1440缺漏兩路線：原生補測結果

只補 semester / ja / 1440 的 graduation-first、credit-first，單次 launch，未重跑原已完成10路線。collector PID ${status.collector_pid}，driver PID ${status.driver_pid}，工具 session 27559；開始 ${status.started}，結束 ${status.ended}，實際 exit ${status.exit_code}。

新 run：\`${status.run}\`。原 collector flags 為 \`--games=semester --languages=ja --widths=1440 --semester-orders=graduation-first,credit-first --phase-only=1 --canonical=1 --all-errors=1 --button-states=1 --scrolls=1 --sharded=1\`，origin 8845；完整 argv／來源 pre SHA 在 manifest.json。driver 以 windowsHide/headless 單一程序執行，STATUS存在即拒絕重啟。

## 玩家路線與逐項驗收

| 路線 | frame數 | 原 session 狀態 | 真重播 | controls捲動組 | 作品全文 Range 聯集 |
|---|---:|---|---|---:|---|
${sessions.map(s=>`| ${s.intent} | ${s.case_indices.length} | ${s.status} | ${s.replay_seen.join(',')} | ${s.control_scroll_groups} | ${s.artifact_scroll.seen_nonspace}/${s.artifact_scroll.expected_nonspace}，missing ${s.artifact_scroll.missing} |`).join('\n')}

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 只啟動一次、只補指定2 sessions | ${yes(v.checks.only_requested_two_sessions&&status.launch_count===1)} | STATUS.json、argv |
| 兩路線完成、各實播0/1/2/3 | ${yes(v.checks.both_routes_complete&&v.checks.both_four_shot_replays)} | 原 session/replay_seen，不修改原狀態 |
| 684 fullshards SHA／原完整c深比／sample／圖片SHA | yes | case-receipts.json逐index保留，verify exit0 |
| 獨立重算 geometry=0 | ${yes(v.checks.geometry_zero)} | inspectReport逐case重算並與原geometry_errors深比 |
| 控制區全部實際捲動組完整 | ${yes(v.checks.all_control_scroll_groups_complete)} | 原domain/text穩定、missing空 |
| 作品全文 Range聯集完整 | ${yes(v.checks.all_artifact_scrolls_complete)} | 原捲動receipt，未當成全墨跡上界證明 |
| console／page／HTTP錯誤為0 | ${yes(v.checks.no_console_page_http_errors)} | 原sessions arrays |
| 新run served前後與disk來源穩定 | ${yes(v.checks.served_before_after_stable&&v.checks.disk_sources_unchanged)} | collector真after==before＋獨立HTTP13檔含bytes／SHA／時間 |
| 13個舊before／新before／新獨立after逐鍵相同 | ${yes(source.all_three_observation_points_equal)} | source-comparison.json，三個觀察點 |
| method flags全清／全案通過 | no | 原${v.method_violation_count}筆flags保留；full_project_approved=false |
| 原recovery未知1flag／原after缺口已補成原收據 | no | 不改原metadata／unknown1，不偽造原collector after |

method flags分類：\`${JSON.stringify(types)}\`。geometry0與捲動文字可達不能抹掉原凍結sampler的method flags，也不宣稱所有日文字形墨跡上界已證。

## 來源相等的精確範圍

source-comparison.json證明13個來源在「舊run before、新run before、新run結束後獨立真HTTP after」三個觀察點逐鍵bytes SHA相同；新collector自己實際after map也與before相同。這**不是舊collector自己的after，也不宣稱整段期間連續不可變**。原unknown1與fullmethod NO保留，case覆蓋另列。沒有產生composite，case-session-index.json只索引這次2個完整sessions，由主控決定與原10完整sessions整合，原partial不能因此收編。

## 指令與保留資料

實際 \`node driver.cjs\` → collector terminal exit0；原stdout／stderr／combined逐bytes保留，stdout結尾為 \`PARTIAL_RED 684 frames; geometry=0\`。\`node verify.cjs\` → exit0；\`node source-comparison.cjs\` → exit0。完整stdout見verify-output.txt／source-comparison-output.txt，沒有更換sampler／safe／contract或繞過gate。

完整fullcase物件保存在原phase-runs新run分片；readLayoutReport按需驗每片SHA／identity，verify另和同run .case.json、sample nodes/blockers/replay_shot、原圖SHA逐筆比對。case-receipts.json保留每個原index、ID、intent、fullshard檔名與SHA，不按重複ID去重。fresh-run.manifest.json是原manifest bytes快照，相關片段路徑仍從原run解析；沒有確認完整raw跨機備份。

只在本白名單新增QA檔，collector依正常行為產生ignored phase-runs並更新phase-latest；未手動修改其他檔、未switch／stage／commit／push／main／刪檔，未重啟其他live collector。
`;
fs.writeFileSync(path.join(dir,'REPORT.md'),report);console.log(JSON.stringify({frames:cases.length,sessions:sessions.map(s=>({intent:s.intent,frames:s.case_indices.length,controls:s.control_scroll_groups,artifact:s.artifact_scroll})),method_types:types,log_bytes:files.filter(f=>f.file.endsWith('.log')).map(f=>({file:f.file,bytes:f.bytes})),manifest_sha256:v.manifest_sha256,composite_generated:false},null,2));
