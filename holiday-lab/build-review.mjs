// A fresh directory and an explicit runtime allowlist; never clean or delete previous output.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const out=process.argv[2]||`.review-${Date.now()}`;
if(fs.existsSync(out))throw Error('Use a fresh output directory; previous builds are retained.');
execFileSync(process.execPath,['C:/AIHome/claude/skills/game-ui-art/scripts/ui-policy.cjs','--project',process.cwd()],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/build.mjs','--local-review',`--out=${out}`],{stdio:'inherit'});
const lab=path.join(out,'holiday-lab');fs.mkdirSync(lab,{recursive:true});
for(const name of ['index.html','lab.css','runner.mjs','replay-model.mjs','catalog.mjs','games','assets','audio']){
 if(!fs.existsSync(`holiday-lab/${name}`))throw Error(`Missing runtime ${name}`);
 fs.cpSync(`holiday-lab/${name}`,path.join(lab,name),{recursive:true});
}
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);}
const files=walk(out).map(p=>path.relative(out,p).replaceAll('\\','/'));
const forbidden=files.filter(p=>/(^|\/)(\.git|work-orders|art-source|audio-source|tests|reports|play-zone|uploads|dashboard)(\/|$)|LATEST_HANDOFF|CONTRACT\.md/.test(p));
if(forbidden.length)throw Error(`Unexpected files: ${forbidden}`);
fs.writeFileSync('holiday-lab/latest-build.json',JSON.stringify({out:path.resolve(out),built_at:new Date().toISOString(),files:files.length,private_reports_in_runtime:forbidden,public_release:false},null,2));console.log(`REVIEW_ONLY: ${out}; ${files.length} files; no publication performed.`);
