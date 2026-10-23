'use strict';
// New v3 copies only. Never touches v2 or any original pilot.
const fs=require('node:fs'),path=require('node:path');for(const name of ['binding.cjs','check.cjs','collect.cjs','engine.cjs','engine.test.cjs','freeze.cjs','native.cjs','plan.cjs','process-guard.cjs']){const file=path.join(__dirname,name);let s=fs.readFileSync(file,'utf8');s=s.replaceAll('engine-v2','engine-v3').replaceAll('schema:2','schema:3').replaceAll('.schema,2','.schema,3').replaceAll('freeze-v2.json','freeze-v3.json');fs.writeFileSync(file,s);}console.log('New v3 identity only; old v2 untouched');
