// Read-only source/trace inventory. Derived receipts never mutate original cases.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {auditTrace}=require('./source-trace.cjs');
const qa=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(qa,f),'utf8'));
const snapshot=read('static-error-max-5/source-snapshot.json');
const run=read('finite-errors-native-20261023/runs/run-01/report.json');
const legacy=read('static-error-max-5/verification.json');
const trace=auditTrace(snapshot,run,fs.readFileSync(path.join(qa,'finite-errors-native-20261023/collect.cjs'),'utf8'));
fs.writeFileSync(path.join(__dirname,'trace-evidence.json'),JSON.stringify(trace,null,2)+'\n');
const evidence={schema_version:1,status:'trace-complete-joined-proof-incomplete',trace_contexts:trace.contexts.length,trace_branches:trace.branches.length,trace_captures:trace.captures.length,full_original_cases_modified:false,direct_dom_input_snapshots_present:run.cases.filter(c=>Object.hasOwn(c,'inputs')).length,canonical_candidates_emitted:0,canonical_error_longest_eligible:false,pending:['Independently bind 892 legacy sample/image receipts and original full cases','Independently verify 60 new sample/PNG/Range/safe/clip/font receipts','Compare source/font/dimensions and finite owner coverage across all 12 contexts','Compute actual directional and width/height/area extrema; preserve all original flags'],input_files:['static-error-max-5/source-snapshot.json','static-error-max-5/verification.json','finite-errors-native-20261023/runs/run-01/report.json','finite-errors-native-20261023/collect.cjs'].map(file=>({file:path.join(qa,file),sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(qa,file))).digest('hex')})),legacy_games:legacy.games.map(g=>g.game)};
fs.writeFileSync(path.join(__dirname,'inventory.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
