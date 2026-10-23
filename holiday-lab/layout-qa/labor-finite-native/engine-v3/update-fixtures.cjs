'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const file=path.join(__dirname,'engine.test.cjs');let s=fs.readFileSync(file,'utf8');function replace(a,b){assert.equal(s.split(a).length,2);s=s.replace(a,b);}
replace("// Header-only unit fixture, not a decodable native screenshot or artwork.","// Reuse an existing real native PNG as decoder fixture; no pixels or artwork generated.");
replace("const png=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);png.writeUInt32BE(1440,16);png.writeUInt32BE(1000,20);","const png=fs.readFileSync(path.resolve(__dirname,'../../finite-errors-native-20261023/runs/run-01/peace-memory-en-1440-clipped-rejection-game-hint-38.png'));");
replace("geometry_errors:[],job_id:target.job_id","geometry_errors:[],method_violations:sample.violations,job_id:target.job_id");
replace("e.writeLease(run,{pid:112,creation:'2026-10-23T01:00:00.000Z'});","require('./lease.cjs').acquireResume(run,{resume:true,expectedPrevious:before.leases.at(-1).ref,owner:{pid:112,creation:'2026-10-23T01:00:00.000Z'},probeFn:pid=>pid===111?{state:'absent'}:{state:'present',pid,creation:'2026-10-23T01:00:00.000Z'}});");
fs.writeFileSync(file,s);console.log('Updated v3-only fixtures to real decoded PNG and atomic resume API');
