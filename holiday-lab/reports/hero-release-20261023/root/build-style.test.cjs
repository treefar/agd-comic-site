const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {transformSync}=require(path.resolve('node_modules/esbuild'));
test('source styles do not silently override duplicated object keys',()=>{const result=transformSync(fs.readFileSync('chapters-2.jsx','utf8'),{loader:'jsx',logLevel:'silent'});assert.deepEqual(result.warnings.filter(w=>w.id==='duplicate-object-key').map(w=>({text:w.text,line:w.location?.line})),[]);});
