// Finish this explicitly bounded phase and preserve a restartable handoff.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root='C:/agywork/agd-holiday-prototypes';process.chdir(root);
const edit=(f,old,next)=>{const s=fs.readFileSync(f,'utf8');assert.ok(s.includes(old),f+': missing preimage');fs.writeFileSync(f,s.replace(old,next));};
const policyFile='holiday-lab/dashboard/progress-policy.json',policy=JSON.parse(fs.readFileSync(policyFile));
policy.xiaosa_receipt='holiday-lab/reports/shutdown-20261023/independent/run05/result.json';
policy.xiaosa_manifest='holiday-lab/reports/shutdown-20261023/independent/receipt.json';
fs.writeFileSync(policyFile,JSON.stringify(policy,null,2)+'\n');
edit('holiday-lab/dashboard/followup-proof.cjs','  return out;',`  if(policy.xiaosa_receipt){const raw=read(policy.xiaosa_receipt,false),r=JSON.parse(raw),m=read(policy.xiaosa_manifest);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),m.result_sha256);assert.equal(r.status,'pass');assert.equal(r.contexts.length,6);assert.equal(m.pngs.length,30);assert.deepEqual(r.sources_before,r.sources_after);for(const [file,hash]of Object.entries(r.sources_after))assert.equal(crypto.createHash('sha256').update(read(file,false)).digest('hex'),hash);for(const c of r.contexts){assert.equal(c.pass,true);assert.equal(c.states.length,4);assert.equal(c.source.teamVisible,true);assert.equal(c.errors.length,0);assert.equal(c.badResponses.length,0);}assert.equal(r.full_project_approved,false);out.xiaosa={contexts:r.contexts.length,states:r.contexts.reduce((n,c)=>n+c.states.length,0),pngs:m.pngs.length,full_project_approved:false};}
  return out;`);
edit('holiday-lab/dashboard/progress-adapter.cjs'," if(policy.project_paused){",` if(followup.xiaosa){const row=rows.find(r=>r.id==='hero-integrated'),x=followup.xiaosa;row.headline='小颯手繪首圖與原三件作品已合入8870；三語手機／桌面獨立短驗收通過，等你看。';row.proof_summary+=' 8870小颯首圖另驗'+x.contexts+'組、'+x.states+'個作品狀態、'+x.pngs+'PNG，署名、完整原圖及來源連結通過。';row.source_files.push(policy.xiaosa_receipt,policy.xiaosa_manifest);row.links.push(...links([link('小颯新版短驗收','holiday-lab/reports/shutdown-20261023/independent/REPORT.md')]));}
 if(policy.project_paused){`);
edit('holiday-lab/dashboard/progress-adapter.cjs',"row.limitation='另有舊Flora來源候選", "row.limitation='只查既有交接夾；另有舊Flora來源候選");
edit('holiday-lab/dashboard/presentation.js',"['release-tools','本輪發布工具補驗','1項待真實可見狀態']", "['release-tools',pausedReview?'8866前版發布補驗':'本輪發布工具補驗','1項待真實可見狀態']");
const testFile='holiday-lab/dashboard/progress-adapter.test.cjs';
edit(testFile,"test('current guide and homepage receipts describe one build without global approval'", "test('official names keep peer proof distinct from the new homepage without global approval'");
edit(testFile,'assert.equal(v.target_observations,24);assert.equal(v.guide_leaf_observations,10364);','assert.equal(v.target_observations,48);assert.equal(v.guide_leaf_observations,17814);');
edit(testFile,"assert.equal(d.followup.guide_integrated,true);assert.match(d.rows.find(r=>r.id==='guide').limitation,/新版與首頁同一build/);", "assert.equal(d.followup.official_names,true);assert.equal(d.followup.guide_integrated,undefined);assert.match(d.rows.find(r=>r.id==='guide').limitation,/8867來源與凍結build範圍明列/);");
edit(testFile,"mutate==='build'&&file===policy.release_receipt)r.source_before[0].sha256", "mutate==='build'&&file===policy.official_names_merge)r.independent_receipt_sha256");
fs.appendFileSync(testFile,`\ntest('shutdown pause and bounded Xiaosa proof remain separate from approval',()=>{const d=adapter(root);assert.equal(d.policy.project_paused,true);assert.equal(d.rows.filter(r=>r.workflow==='working').length,0);assert.equal(d.followup.xiaosa.contexts,6);assert.equal(d.followup.xiaosa.states,24);assert.equal(d.followup.xiaosa.pngs,30);assert.equal(d.followup.xiaosa.full_project_approved,false);assert.match(d.rows.find(r=>r.id==='review').headline,/已暫停/);assert.equal(d.followup.shutdown_tfbase.items,5);assert.ok(d.rows.every(r=>r.user==='pending'));});\n`);
edit('holiday-lab/dashboard/smoke.cjs',"assert.equal(await p.locator('.work-card:not([hidden])').count(),1);", "assert.equal(await p.locator('.work-card:not([hidden])').count(),contract.rows.filter(r=>r.workflow==='paused').length);");
const candidates='holiday-lab/reports/shutdown-20261023/homepage-image-candidates.json',a=JSON.parse(fs.readFileSync(candidates));
a.identification_basis='舊首頁僅一張手繪海報；由舊HTML src及實圖比對，對應使用者所指首頁手繪。使用者未逐字指定檔名，保留此區別。';
a.selected_asset='images/posters/clipstudio-grand-prize.jpg';a.credit_source='使用者2026-10-23對話：畢業生小颯';
fs.writeFileSync(candidates,JSON.stringify(a,null,2)+'\n');
const note=`## 2026-10-23 關機前保全：小颯首頁已驗、TF-BASE未見WebGL，依使用者要求暫停

- source_agent: codex；TF-GO。工作樹 C:/agywork/agd-holiday-prototypes，分支 codex/xiaosa-credit-review。使用者要求完成本段後暫停以便關機；不再新增工作或重送工單。8870是最新小颯本機審閱版，關機後服務會停止。
- 使用者確認首頁手繪為畢業生「小颯」所畫。本輪依舊首頁唯一手繪海報 src 與實圖比對，沿用 images/posters/clipstudio-grand-prize.jpg 完整原圖，放首頁輪播首張、補三語畢業生署名及作品頁 team；未改原圖、未生新圖、未推定未知指導教師。原三件作品、完整署名與手動切換保留。
- 新 .measure-xiaosa-review-20261023-01／app-BWFF7U3Q.js／360檔，http://127.0.0.1:8870/ ，儀表板 /progress/ 。獨立短驗收6/6組、24/24作品狀態、6/6來源點擊、30PNG；9來源＋9HTTP前後穩定，無溢位／例外／圖片404。只限本次首頁及來源頁，不是全站或新遊戲發布驗收；使用者尚未確認新畫面。
- TF-BASE最新實查2026-10-23台灣19:49:30：指定交接夾5份工單／腳本，未見本次Flora／胖倉鼠WebGL；另有舊Flora來源候選，身分與完整性未驗，未下載大型包、未啟Unity、未重派。只代表所查資料夾，不推論別處沒有上傳。
- 12正式名稱已經獨立驗收後合入本機 merge d234fc4f3b3297be1f4411e714a8c2eedeb59674；兩批累計24譯值、48次可見觀察、60PNG，root唯讀複核exit0。此為8867同儕凍結build證據，不冒稱8870全站母語審查。4 PROGRAM整句與相依欄位待下一輪一致修正，115本系一般單招30名已截止，其他學制不可混用。
- 指南選課／抵免／請假／休復學／轉系另補現行母法草稿：首版24步15FAQ，supplement-current-rules共100項文件證據檢查yes、0no，仍有現行流程及跨版本衝突待核，不等於正式規章全部確認。畢業／獎助／協助／就業四題只有9/9 checkpoint檢查，完整四題草稿未完成；原始資料保存，未直接套產品。
- 8866前版release12yes／1unknown仍限定前版；真背景hidden仍unknown，完整UI gate仍NO。儀表板將本輪暫停、資料、工具與使用者確認分開；不把前版收據套成8870全站通過。
- 合併第一次因長路徑及locale dirty失敗，Git回復時覆寫4份原dirty；已從Git dangling commit f7e62206a266093fe076a24ef66ef0f1e78e9cb7 找回，逐SHA恢復4/4，原檔留dirty、不混入本輪提交，原始恢復備份另納入本輪報告保存。後續Git一律加 -c core.longpaths=true；修正後合併成功、fsck exit0。
- 不push、不發布、不碰main、不刪檔、不執行C節；勞動節暫緩。所有子代理本輪已停止新增任務；本機伺服器保留至使用者關機，不自行關閉電腦。
- 重開後第一件事：先讀此段和 holiday-lab/reports/shutdown-20261023/REPORT.md，再用下列命令恢復8870，等使用者看首頁回饋；不得重跑舊巨量QA或已完成研究。WebGL等新回傳再核來源，剩餘PROGRAM與指南缺件依證據續接。

\`\`\`text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-xiaosa-review-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8870
\`\`\`

報告：holiday-lab/reports/shutdown-20261023/independent/REPORT.md；holiday-lab/reports/tfbase-shutdown-check-20261023/REPORT.md；holiday-lab/reports/official-names-followup-20261023/REPORT.md。最終保存指令與檢查見shutdown-20261023/root/。

`;
const prepend=f=>{const s=fs.readFileSync(f,'utf8');assert.ok(!s.includes('## 2026-10-23 關機前保全：'));fs.writeFileSync(f,note+s);};
prepend('holiday-lab/STATUS.md');prepend('C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md');
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',v=fs.readFileSync(vault,'utf8'),m=v.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(m);fs.writeFileSync(vault,m[0]+note+v.slice(m[0].length));
const report='holiday-lab/reports/official-names-followup-20261023/REPORT.md';fs.appendFileSync(report,`\n## 關機前最終狀態\n\n作者名稱已獨立8組／48次可見觀察／60PNG通過；root在peer工作目錄唯讀核對exit0後，本機merge d234fc4f3b3297be1f4411e714a8c2eedeb59674。上表原「待驗／未合」為當時checkpoint，現已完成此兩項。原研究首版與補件分開保存；補件100yes／0no只驗文件證據，不批准全部現行規章。四題協助／生涯草稿仍未完成。\n\n第一次整合exit128（長路徑及locale dirty）；Git回復覆寫4份原dirty，已從f7e62206a266093fe076a24ef66ef0f1e78e9cb7恢復4/4原SHA。v1方法／實際錯誤與恢復原檔全部保留；v2加core.longpaths=true及失敗復原守門，成功合併、fsck0。詳見root/integration-commands.json、integration-r2-commands.json、integration-result.json與dirty-recovery/。root第一次唯讀cwd錯誤收據保留；peer cwd重核才是有效exit0。\n\n使用者要求暫停關機，所有後續研究已停止，不宣告整體目標完成。最新小颯首頁另見shutdown-20261023/REPORT.md。\n`);
const attrs=['official-names-followup-20261023','shutdown-20261023','tfbase-shutdown-check-20261023','guide-enrollment-research-20261023','guide-support-career-research-20261023'].map(x=>'/holiday-lab/reports/'+x+'/** -text').concat(['official-guide-names-independent-20261023','program-currentness-20261023'].map(x=>'/holiday-lab/translation-review/'+x+'/** -text'));
fs.appendFileSync('.gitattributes','\n# Preserve exact shutdown and independent evidence bytes.\n'+attrs.join('\n')+'\n');
console.log('Updated bounded dashboard, regression expectations, handoff and Vault. No publication or deletion.');
