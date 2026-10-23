// Offline checkpoint only: never starts a browser, changes a source, or writes official R0.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(path.join(dir,p)));
const official=path.resolve(dir,'../layout-report.json'),expected='cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336';
assert.equal(sha(official),expected);
const native=read('artifact-native-all-r2/report.json'),ledger=read('artifact-typed-ledger/ledger.json'),preview=read('preview-reuse.json');
for(const [report,method] of [[native,'artifact-native-all.cjs'],[ledger,'join-artifact-ledger.cjs'],[preview,'preview-reuse-plan.cjs']]){assert.equal(report.method_sha256,sha(path.join(dir,method)));assert.equal(report.full_project_approved,false);}
assert.equal(native.manifest_sha256,sha(path.join(dir,'manifest.json')));
assert.deepEqual(ledger.summary,{contexts:72,proven_contexts:72,lines:2799,original_real_scroll_lines:2775,technical_missing_last_glyph_lines:24});
assert.equal(ledger.official_R0_sha256_before,expected);assert.equal(ledger.official_R0_sha256_after,expected);
assert.equal(preview.original_false_preserved,true);assert.ok(preview.groups.every(g=>g.original_whole_domain_pass===false));
const gaps=preview.groups.filter(g=>g.dynamic_branch_gaps.length),count=gaps.reduce((n,g)=>n+g.dynamic_branch_gaps.length,0);assert.equal(gaps.length,18);assert.equal(count,37);
assert.equal(preview.summary.separated_complete,12);assert.equal(preview.summary.dynamic_branches_with_existing_full_frames,86);assert.equal(preview.summary.dynamic_branches,123);
const plan={base:preview.base,full_project_approved:false,official_R0_unchanged:sha(official)===expected,remaining_families:18,remaining_dynamic_branches:37,two_newyear_gaps_are_subset:true,families:gaps.map(g=>({game:g.game,lang:g.lang,width:g.width,intent:g.intent,state:g.state,raw_report:g.raw_report,raw_sha256:g.raw_sha256,source:g.source,unchanged_native_inputs:g.unchanged_native_inputs,missing:g.dynamic_branch_gaps,minimum_next_step:g.minimum_next_step}))};
fs.writeFileSync(path.join(dir,'minimum-next-cases.json'),JSON.stringify(plan,null,2));
const lines=['# 尚缺的最小原生畫面補採清單','','本表由 checkpoint.cjs 依既有固定 JSON 計算。未啟動瀏覽器；全部仍為 NO。兩個英文收尾缺口已包含在 37 分支內，不重複計數。','','|遊戲／語言／寬度／意圖／狀態|尚缺 owner 與原文|來源行|','|---|---|---|'];
for(const g of gaps)for(const m of g.dynamic_branch_gaps)lines.push(`|${g.game} / ${g.lang} / ${g.width} / ${g.intent} / ${g.state}|${m.owner}: ${m.text.replace(/\|/g,'\\|')}|${m.source_line}|`);
lines.push('','每組 exact inputs、原 raw SHA、source SHA 在 minimum-next-cases.json；實際原 frame／靜態逐行重用收據在 preview-reuse.json。','', '## 執行限制與順序','','1. 固定使用原 08 來源；先核模組、CSS 與原 raw 收據。只補表列分支，不重跑其他已證項目。','2. constitution ja1440 preview-0：沿 JSON 的 font18、duration6、x50、y78、兩行及原色調設定，將原生控制區捲至 status 完整可見；點試播後自然等待 6 秒，採結束狀態的完整 Range／固定 safe／viewport／原生圖。不得改時鐘或 padding。','3. new-year：優先 EN1440 launch、flight 的 preview-2 收尾，再依表補其餘 17 組中的缺項。使用每組 JSON 的原生輸入及合法先前幕順序；不得跨意圖或替換時長。','4. 保持 ny-pose、ny-observation 在實際 viewport，對缺少的短時動態分支用快速 CDP 原生畫面採樣；保留前後同 shot、時間及原生文字／幾何／font 收據，不凍結、seek 或延長時鐘。若抓不到，維持 NO。','5. 靜態 scroll 域與動態逐分支分開合成；原 whole-domain false 保留。新證據須同 source/lang/width/intent/inputs/owner/text，完整墨跡在固定 safe、clip 與 screenshot viewport 內，且原畫面無新增遮擋。');
fs.writeFileSync(path.join(dir,'NEXT-STEPS.md'),lines.join('\n')+'\n');
console.log('CHECKPOINT YES artifact=72/72 lines=2799/2799 preview-separated=12/30 remaining=18families/37branches R0_unchanged=true full_project_approved=false');
