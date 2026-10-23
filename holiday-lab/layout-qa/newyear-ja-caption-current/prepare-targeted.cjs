// Derive a smaller read-only capture run; keep the original unstable attempts.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const file=path.join(__dirname,'check.cjs');let source=fs.readFileSync(file,'utf8');
const changes=[
 ['for(const target of [0,1,2,3,4,5,6,7,8]){','for(const target of [3,7]){ for(let attempt=0;attempt<8;attempt++){'],
 ['`${lang}-${width}-shot-${target}.jpg`','`${lang}-${width}-shot-${target}-attempt-${attempt}.jpg`'],
 ['geometry_errors:checked});save();\n }','geometry_errors:checked});save(); if(stable)break;\n } assert.ok(row.samples.some(s=>s.target===target&&s.stable),"Target must have a stable native capture: "+target); }'],
 ['for(const width of [320,1440])','for(const width of [1440])'],
 ['report.native_pass===2','report.native_pass===1']
];
for(const[a,b]of changes){assert.equal(source.split(a).length-1,1,a);source=source.replace(a,b);}
fs.writeFileSync(path.join(__dirname,'targeted.cjs'),source);
fs.writeFileSync(path.join(__dirname,'targeted-origin.json'),JSON.stringify({source:file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),changes,product_writes:0,sampler_changes:0,clock_or_animation_changes:0},null,2));
console.log('TARGETED 1440 Japanese shots 3 and 7; up to 8 fresh native attempts; old failures retained');
