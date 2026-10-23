// Reuse the verified native timing collector; narrow only its base URL and language inventory.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const from=path.join(__dirname,'newyear-min140/check.cjs'),dir=path.join(__dirname,'newyear-ja-caption-current');assert.ok(!fs.existsSync(dir),'Use a fresh verification directory');fs.mkdirSync(dir);
let source=fs.readFileSync(from,'utf8');const replacements=[["const base='http://127.0.0.1:8845'","const base='http://127.0.0.1:8847'"],["for(const lang of ['zh','en','ja'])","for(const lang of ['ja'])"],["report.native_pass===6","report.native_pass===2"]];
for(const[a,b]of replacements){assert.equal(source.split(a).length-1,1,a);source=source.replace(a,b);}
fs.writeFileSync(path.join(dir,'check.cjs'),source);fs.writeFileSync(path.join(dir,'collector-origin.json'),JSON.stringify({source:from,sha256:crypto.createHash('sha256').update(fs.readFileSync(from)).digest('hex'),replacements,product_writes:false},null,2));console.log('READY unmodified native method, current build 10, Japanese two widths only');
