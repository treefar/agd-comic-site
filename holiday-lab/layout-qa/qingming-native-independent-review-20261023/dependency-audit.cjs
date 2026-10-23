// Read-only dependency closure inventory, no browser/HTTP/native measurement.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),source=path.resolve(__dirname,'../qingming-error-domain-20261023');
const N=require(path.join(source,'native-tools.cjs')),bindings=N.bindings(),runtimeFile=bindings.find(r=>/^runtime-identifiers(?:-v\d+)?\.json$/.test(r.file)).file,runtime=JSON.parse(fs.readFileSync(path.join(source,runtimeFile)));
function collect(v,out=[]){if(!v||typeof v!=='object')return out;if(typeof v.file==='string'&&typeof v.sha256==='string')out.push(path.resolve(source,v.file).toLowerCase());for(const x of Object.values(v))if(x&&typeof x==='object')collect(x,out);return out;}
const bound=new Set([...collect(runtime),...bindings.map(x=>path.resolve(source,x.file).toLowerCase())]);
const specifications=[['playwright-core','lib/bootstrap.js'],['playwright-core','lib/coreBundle.js'],['sharp','dist/constructor.cjs'],['sharp','dist/input.cjs'],['sharp','dist/output.cjs']];
const rows=specifications.map(([name,relative])=>{const p=runtime.packages.find(p=>p.name===name),file=path.join(p.root,relative);return {package:name,file,exists:fs.existsSync(file),sha256:fs.existsSync(file)?hash(file):null,covered_by_current_bindings:bound.has(file.toLowerCase()),actual_entry:{file:p.entry.file,sha256:hash(p.entry.file),require_source:fs.readFileSync(p.entry.file,'utf8')}};});
const result={at:new Date().toISOString(),runtime_file:runtimeFile,native_tools_sha256:hash(path.join(source,'native-tools.cjs')),runtime_identifiers_code_sha256:hash(path.join(source,'runtime-identifiers.cjs')),runtime_identifiers_json_sha256:hash(path.join(source,runtimeFile)),bound_path_count:bound.size,rows,browser_or_HTTP_or_native_executed:false,global_approved:false};
if(require.main===module)console.log(JSON.stringify(result,null,2));module.exports=result;
