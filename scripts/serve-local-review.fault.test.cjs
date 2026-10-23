const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('server regression catches a real missing resource incorrectly changed to HTTP 200',()=>{
 const file=path.join(__dirname,'serve-local-review.cjs');const source=fs.readFileSync(file,'utf8');
 const mutant=source.replace('res.writeHead(404).end()','res.writeHead(200).end()');assert.notEqual(mutant,source);
 const code=`const Module=require('node:module');const f=${JSON.stringify(file)};const m=new Module(f);m.filename=f;m.paths=Module._nodeModulePaths(require('node:path').dirname(f));m._compile(${JSON.stringify(mutant)},f);require.cache[f]=m;require(${JSON.stringify(path.join(__dirname,'serve-local-review.test.cjs'))});`;
 const r=spawnSync(process.execPath,['-e',code],{encoding:'utf8',windowsHide:true});assert.equal(r.status,1);assert.match(r.stdout+r.stderr,/200 !== 404/);
});
