const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const allowed=new Set(['locale-en.js','locale-ja.js']),writes=[];
const guarded=new Proxy(fs,{get(target,key){if(key==='writeFileSync')return (file,data,...args)=>{const f=String(file).replaceAll('\\','/');if(allowed.has(f)){writes.push({product:f,bytes:Buffer.byteLength(data)});return fs.writeFileSync(file,data,...args);}if(f.startsWith('docs/qa/')){const out=path.join(__dirname,'generation-audit',path.basename(f));fs.mkdirSync(path.dirname(out),{recursive:true});writes.push({redirected_from:f,to:path.relative(process.cwd(),out),bytes:Buffer.byteLength(data)});return fs.writeFileSync(out,data,...args);}throw Error('Unexpected generator write '+f);};if(key==='mkdirSync')return (p,options)=>{const f=String(p).replaceAll('\\','/');if(f==='docs/qa')return;throw Error('Unexpected generator mkdir '+f);};return target[key];}});
for(const file of ['scripts/build-translations.cjs','scripts/build-ja-translations.cjs']){
 vm.runInNewContext(fs.readFileSync(file,'utf8'),{require:n=>n==='node:fs'||n==='fs'?guarded:require(n),console,Buffer,process},{filename:file});
}
assert.equal(writes.filter(w=>w.product).length,2);fs.writeFileSync(path.join(__dirname,'generation.json'),JSON.stringify({method:'Unmodified original generator executed in VM; writes limited to locale files, docs/qa outputs redirected to new evidence directory',writes},null,2)+'\n');

