// Offline evidence audit only. No source cases are mutated and no browser is opened.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {inspectReport}=require('C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs');
const {catalog,guards}=require('../static-error-max-5/catalog.cjs'),{auditTrace}=require('./source-trace.cjs');
const qa=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(f),json=f=>JSON.parse(read(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const norm=s=>s.replace(/\s+/gu,''),keys=['x','y','width','height'];
const rect=r=>r&&keys.every(k=>Number.isFinite(r[k]))&&r.width>=0&&r.height>=0;
const same=(a,b)=>rect(a)&&rect(b)&&keys.every(k=>Math.abs(a[k]-b[k])<1e-8);
const inside=(a,b)=>rect(a)&&rect(b)&&a.x>=b.x-1e-8&&a.y>=b.y-1e-8&&a.x+a.width<=b.x+b.width+1e-8&&a.y+a.height<=b.y+b.height+1e-8;
const measured=n=>[...n.measurements].sort((a,b)=>a.baseline-b.baseline||a.advance.x-b.advance.x).map(m=>m.text).join('');
function fonts(fs){assert.ok(fs?.length);assert.ok(fs.every(f=>f.postScriptName&&f.glyphCount>0));return fs.map(({familyName,postScriptName,isCustomFont})=>({familyName,postScriptName,isCustomFont})).sort((a,b)=>a.postScriptName.localeCompare(b.postScriptName));}
function ownerFacts(n,text,c,panel,scrollProof=true){
 assert.ok(n&&n.measurements?.length);const vp=c.screenshot.viewport_proof;
 assert.equal(vp.scroll_unchanged,true);assert.deepEqual(vp.before,vp.after);assert.equal(c.screenshot.same_shot_verified,true);
 const facts={whole:norm(measured(n))===norm(text),unclipped:same(n.ink,n.unclipped_ink),safe:inside(n.unclipped_ink,n.safe),fixedPaper:n.safe_sources?.some(s=>s.asset==='holiday-lab/assets/ui/panel.png'&&s.sha256===panel)===true,inside_actual_viewport:inside(n.unclipped_ink,vp.clip),scroll_proven:scrollProof};
 for(const m of n.measurements){assert.ok(rect(m.ink)&&rect(m.advance)&&Number.isFinite(m.baseline));assert.equal(m.baseline_probe?.range_unchanged,true);assert.equal(m.baseline_probe?.on_original_line,true);}
 return facts;
}
function sampleImage(c,sampleFile,imageFile,expectedSample){
 const sb=read(sampleFile),s=JSON.parse(sb);assert.equal(sha(sb),expectedSample);assert.deepEqual(s.nodes,c.nodes);assert.deepEqual(s.blockers,c.blockers);
 assert.deepEqual(inspectReport({schema_version:1,source_fingerprints:{},cases:[c]}),[]);assert.deepEqual(c.geometry_errors,[]);
 const ib=read(imageFile);assert.equal(sha(ib),c.screenshot.sha256);
 if(c.screenshot.format==='png'){assert.equal(ib.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(ib.readUInt32BE(16),c.width);assert.equal(ib.readUInt32BE(20),c.height);}
 return {sample_file:sampleFile,sample_sha256:sha(sb),image_file:imageFile,image_sha256:sha(ib),sample_violations:s.violations};
}
function main(){
 const oldFile=path.join(qa,'static-error-max-5/verification.json'),newFile=path.join(qa,'finite-errors-native-20261023/runs/run-01/report.json');
 const old=json(oldFile),fresh=json(newFile),snap=json(path.join(qa,'static-error-max-5/source-snapshot.json')),trace=auditTrace(snap,fresh,read(path.join(qa,'finite-errors-native-20261023/collect.cjs')).toString());
 assert.deepEqual(old.source_pre,old.source_post);assert.deepEqual(fresh.source_before,old.source_pre);assert.deepEqual(fresh.source_after,old.source_pre);assert.equal(fresh.source_stable,true);assert.equal(fresh.font_file_before,fresh.font_file_after);assert.equal(fresh.failure,undefined);
 const freeze=json(path.join(qa,'sampler-freeze-06.json'));assert.equal(fresh.sampler_function_sha256,freeze.function_sha256);assert.equal(fresh.map_sha256,freeze.files['holiday-lab/layout-qa/asset-safe-regions.json']);
 assert.equal(sha(read(path.join(qa,'browser-sampler.cjs'))),freeze.files['holiday-lab/layout-qa/browser-sampler.cjs']);assert.equal(sha(read(path.join(qa,'asset-safe-regions.json'))),fresh.map_sha256);
 const rows=[],caseReceipts=[],profiles=new Map(),sourceCatalogs={},rawSources=[];
 const profileKey=(game,lang,width,owner)=>JSON.stringify([game,lang,width,owner]);
 for(const g of old.games){
  const source=Buffer.from(snap['games/'+g.game+'.mjs'].base64,'base64').toString(),cat=catalog(g.game,source);assert.deepEqual(cat,g.finite_catalog);assert.deepEqual(guards(g.game,source,Buffer.from(snap['runner.mjs'].base64,'base64').toString()),g.guard_reachability);sourceCatalogs[g.game]=cat;
  const rb=read(g.raw_report);assert.equal(sha(rb),g.raw_report_sha256);const raw=JSON.parse(rb);assert.equal(raw.cases.length,g.original_frames);assert.deepEqual(raw.violations,g.original_global_violations);assert.equal(raw.metadata.runtime_receipts_unchanged,true);assert.equal(raw.metadata.sampler_sha256,fresh.sampler_function_sha256);assert.equal(raw.metadata.asset_map_sha256,fresh.map_sha256);
  for(const f of ['runner.mjs','lab.css','assets/ui/panel.png','assets/ui/paper.png','games/'+g.game+'.mjs'])assert.equal(raw.metadata.runtime_receipts[f],fresh.source_before[f]);
  rawSources.push({game:g.game,file:g.raw_report,sha256:g.raw_report_sha256,frames:raw.cases.length,method_flags:raw.violations.length});
  const checks=new Map();for(const cc of g.case_checks){
   const c=raw.cases[cc.index];assert.equal(c.id,cc.id);assert.equal(c.original_state,cc.original_state);assert.deepEqual(c,json(cc.sample_file.replace(/\.json$/,'.case.json')));assert.equal(c.screenshot.sha256,cc.image_sha256);
   const rec=sampleImage(c,cc.sample_file,path.join(path.dirname(g.raw_report),c.screenshot.file),cc.sample_sha256);assert.deepEqual(rec.sample_violations,cc.raw_method_violations);assert.deepEqual(c.screenshot.viewport_proof,cc.viewport_proof);checks.set(cc.index,{c,rec});caseReceipts.push({origin:'legacy',game:g.game,raw_case_index:cc.index,id:c.id,width:c.width,height:c.height,inputs_preserved:true,...rec});
  }
  for(const row of g.rows){
   const {c,rec}=checks.get(row.raw_case_index),lang=c.id.split('/')[1],entry=cat.find(e=>e.key===row.key),n=c.nodes.find(n=>n.owner===row.owner&&norm(n.text)===norm(entry.values[lang]));assert.equal(c.width,row.width);assert.equal(c.id,row.original_case_id);assert.equal(lang,row.lang);assert.equal(row.source_text,entry.values[lang]);
   for(const k of ['text','ink','unclipped_ink','safe','safe_sources','measurements','computed'])assert.deepEqual(n[k],row[k]);assert.equal(measured(n),row.reconstructed);
   const state=c.original_state||'',used=state.includes('/controls-scroll-'),ses=raw.metadata.sessions.find(s=>s.lang===lang&&s.width===c.width&&s.intent===c.intent),pr=ses?.control_scrolls?.find(s=>s.state===state.split('/controls-scroll-')[0])?.proof;
   const scroll=!used||pr?.all_content_reachable===true&&pr.text_unchanged===true&&pr.visible_domain_stable===true&&pr.expected_nonspace===pr.seen_nonspace&&pr.missing?.length===0;
   assert.equal(used,row.used_scroll);assert.deepEqual(used?pr||null:null,row.scroll_proof);
   const facts=ownerFacts(n,entry.values[lang],c,fresh.source_before['assets/ui/panel.png'],scroll);assert.deepEqual(facts,row.checks);const pass=Object.values(facts).every(Boolean);assert.equal(pass,row.pass);
   const profile={computed:n.computed,fonts:fonts(n.platform_fonts)},pk=profileKey(g.game,lang,c.width,n.owner);if(profiles.has(pk))assert.deepEqual(profiles.get(pk),profile);else profiles.set(pk,profile);
   rows.push({origin:'legacy',game:g.game,lang,width:c.width,height:c.height,key:entry.key,trigger:entry.trigger,owner:n.owner,text:entry.values[lang],raw_case_index:row.raw_case_index,id:c.id,intent:c.intent,original_state:c.original_state,ink:n.unclipped_ink,safe:n.safe,computed:n.computed,fonts:profile.fonts,checks:facts,pass,...rec});
  }
  console.log(g.game+' original full/sample/image verified '+g.case_checks.length+'; rows '+g.rows.length);
 }
 const nativeDir=path.dirname(newFile);for(const s of fresh.sessions){assert.deepEqual(s.page_errors,[]);assert.deepEqual(s.console_errors,[]);assert.deepEqual(s.http_errors,[]);}
 for(const c of fresh.cases){
  const [game,lang]=c.id.split('/'),entry=sourceCatalogs[game].find(e=>e.owner===c.target.owner&&e.values[lang]===c.target.source_text);assert.ok(entry);const n=c.nodes.find(n=>n.owner===c.target.owner);assert.equal(n.text,entry.values[lang]);assert.equal(measured(n),c.target.reconstructed);assert.deepEqual(n.measurements,c.target.measurements);assert.deepEqual(n.computed,c.target.computed);assert.ok(!Object.hasOwn(c,'inputs'));
  const facts=ownerFacts(n,entry.values[lang],c,fresh.source_before['assets/ui/panel.png']);assert.ok(Object.values(facts).every(Boolean));
  const profile={computed:n.computed,fonts:fonts(c.target.platform_fonts)};assert.deepEqual(profile,profiles.get(profileKey(game,lang,c.width,n.owner)),'Original computed/CDP profile mismatch');
  const rec=sampleImage(c,path.join(nativeDir,c.sample_file),path.join(nativeDir,c.screenshot.file),c.sample_sha256);assert.deepEqual(rec.sample_violations,c.sample_violations);const derived=trace.captures.find(t=>t.id===c.id);assert.ok(derived?.trace_complete);
  caseReceipts.push({origin:'native',game,id:c.id,width:c.width,height:c.height,inputs_preserved:true,direct_dom_input_snapshot:false,derived_input_evidence:derived,...rec});rows.push({origin:'native',game,lang,width:c.width,height:c.height,key:entry.key,trigger:entry.trigger,owner:n.owner,text:entry.values[lang],id:c.id,intent:c.intent,original_state:c.original_state,ink:n.unclipped_ink,safe:n.safe,computed:n.computed,fonts:profile.fonts,checks:facts,pass:true,...rec});
 }
 const contexts=[];for(const game of Object.keys(sourceCatalogs))for(const lang of ['zh','en','ja'])for(const width of [320,1440]){
  const rs=rows.filter(r=>r.game===game&&r.lang===lang&&r.width===width&&r.pass),cat=sourceCatalogs[game],coverage=cat.map(e=>({key:e.key,owner:e.owner,trigger:e.trigger,text:e.values[lang],receipts:rs.filter(r=>r.key===e.key).map(r=>({id:r.id,origin:r.origin,sample_sha256:r.sample_sha256})),pass:rs.some(r=>r.key===e.key)}));
  const required=coverage.filter(c=>c.trigger!=='initial-reference'),valid=rs.filter(r=>r.trigger!=='initial-reference');assert.ok(required.every(c=>c.pass),'Finite text domain incomplete');
  const extrema={};for(const [metric,fn]of Object.entries({width:r=>r.ink.width,height:r=>r.ink.height,area:r=>r.ink.width*r.ink.height,left:r=>-r.ink.x,right:r=>r.ink.x+r.ink.width,top:r=>-r.ink.y,bottom:r=>r.ink.y+r.ink.height})){const best=valid.reduce((a,b)=>fn(b)>fn(a)?b:a);extrema[metric]={id:best.id,origin:best.origin,key:best.key,owner:best.owner,ink:best.ink,safe:best.safe,value:fn(best),sample_sha256:best.sample_sha256,image_sha256:best.image_sha256};}
  contexts.push({game,lang,width,height:width===320?900:1000,finite_text_coverage_complete:true,coverage,extrema,extrema_scope:'Observed actual finite-text native layouts; absolute document coordinates vary with normal scrolling. Not a theorem over every possible gameplay configuration.',canonical_error_longest_eligible:false,promotion_pending_parent_review:true});
 }
 const result={schema_version:1,type:'finite-error-joined-evidence-audit',date:new Date().toISOString(),source_before_after:fresh.source_before,source_stable:true,font_file_before_after:fresh.font_file_before,raw_sources:rawSources,legacy_samples_images:caseReceipts.filter(r=>r.origin==='legacy').length,native_samples_images:caseReceipts.filter(r=>r.origin==='native').length,owner_rows:rows.length,visible_safe_rows:rows.filter(r=>r.pass).length,contexts,case_receipts:caseReceipts,owner_receipts:rows,derived_input_evidence:trace,all_required_finite_text_covered:contexts.every(c=>c.finite_text_coverage_complete),canonical_candidates_emitted:0,full_project_approved:false,original_method_flags_preserved:true,original_static5_eligibility_unchanged:true,limitations:['Native cases have no original input snapshot: separate derived trace evidence only.','Collector source fingerprint is join-time, not an original runtime collector receipt.','Different owner viewports are separately captured and linked by unchanged before/after text, never represented as one screenshot.','Peace duplicate-listening preserves status text after choice stops listening; no continuous audio claim.','P3 Japanese final に。 short line retained; no player visual approval.']};
 fs.writeFileSync(path.join(__dirname,'joined-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({contexts:contexts.length,required_finite_text_covered:result.all_required_finite_text_covered,legacy_samples_images:result.legacy_samples_images,native_samples_images:result.native_samples_images,owner_rows:rows.length,visible_safe_rows:result.visible_safe_rows,canonical_candidates_emitted:0},null,2));
}
if(require.main===module){try{main();}catch(e){console.error(e.stack);process.exitCode=1;}}
module.exports={ownerFacts,fonts,inside,same};
