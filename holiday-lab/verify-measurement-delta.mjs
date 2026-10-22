import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function files(root,sub=''){return fs.readdirSync(path.join(root,sub),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(root,path.join(sub,e.name)):[path.join(sub,e.name).replaceAll('\\','/')]).sort();}
const before=process.argv[2]||'.measure-layout-07',after=process.argv[3]||'.measure-layout-08',expected=process.argv[4]||'holiday-lab/games/semester.mjs',output=process.argv[5]||'holiday-lab/reports/measurement-07-08-delta.json',a=files(before),b=files(after);assert.deepEqual(a,b);
const changes=a.filter(f=>hash(path.join(before,f))!==hash(path.join(after,f))).map(file=>({file,before_sha256:hash(path.join(before,file)),after_sha256:hash(path.join(after,file))}));
assert.deepEqual(changes.map(c=>c.file),[expected]);
const result={before,after,files:a.length,identical:a.length-changes.length,changes,pass:true,scope:`Only proves runtime file equivalence outside ${expected}. Neither build is cleared for delivery.`};fs.writeFileSync(output,JSON.stringify(result,null,2));console.log(`MEASUREMENT_DELTA ${a.length-changes.length}/${a.length} identical; ${expected} only`);
