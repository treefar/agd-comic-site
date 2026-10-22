// Read-only triage of actual collector reports; does not classify a red as a product bug.
const fs=require('node:fs'),path=require('node:path');
const file=process.argv[2]||'holiday-lab/layout-qa/matrix-runs/2026-10-22T16-40-01-613Z/status.json';
const matrix=JSON.parse(fs.readFileSync(file,'utf8'));
for(const row of matrix.rows.filter(r=>r.geometry>0)){
 const report=JSON.parse(fs.readFileSync(path.join(row.raw_run,'report.json'),'utf8'));
 console.log(JSON.stringify({game:row.game,total:row.geometry,raw:row.raw_run,samples:report.cases.filter(c=>c.geometry_errors.length).slice(0,2).map(c=>({id:c.id,screenshot:c.screenshot,errors:c.geometry_errors.slice(0,3),nodes:c.nodes.filter(n=>c.geometry_errors.slice(0,3).some(e=>e.includes(n.id))).map(({id,text,ink,safe,...other})=>({id,text,ink,safe,context:other.context,selector:other.selector}))}))},null,2));
}
