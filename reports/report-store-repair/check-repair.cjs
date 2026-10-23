// Reproducible mutation check; retains its temporary artifacts, never deletes data.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),source=path.join(root,'holiday-lab/layout-qa/layout-report-store.cjs'),test=path.join(root,'holiday-lab/tests/layout-report-store.test.cjs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'layout-store-legacy-mutant-')),mutant=path.join(temp,'legacy-mutant.cjs');
fs.writeFileSync(mutant,fs.readFileSync(source,'utf8')+'\nmodule.exports.writeLayoutReport=(file,report)=>fs.writeFileSync(file,JSON.stringify(report));\n');
const bad=spawnSync(process.execPath,['--test',test],{cwd:root,encoding:'utf8',env:{...process.env,LAYOUT_REPORT_STORE_MODULE:mutant}});
fs.writeFileSync(path.join(__dirname,'mutation-red-output.txt'),bad.stdout+bad.stderr);
if(bad.status===0||!bad.stdout.includes('Invalid string length'))throw Error('Legacy mutant did not reproduce bounded string failure');
const good=spawnSync(process.execPath,['--test',test],{cwd:root,encoding:'utf8',env:{...process.env,LAYOUT_REPORT_STORE_MODULE:source}});
fs.writeFileSync(path.join(__dirname,'green-output.txt'),good.stdout+good.stderr);
if(good.status!==0)throw Error('Real module tests failed');
const receipt={legacy_mutant_exit:bad.status,legacy_range_error_reproduced:true,repaired_exit:good.status,temp_artifacts_retained:temp,no_512mb_fixture:true,no_live_process_restart:true};
fs.writeFileSync(path.join(__dirname,'repair-verification.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
