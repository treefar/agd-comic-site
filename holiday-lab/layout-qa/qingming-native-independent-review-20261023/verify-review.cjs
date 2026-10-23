// Independent read-only method/binding review. Does not invoke run/launch/fetch or verify a fictional run.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=path.resolve(__dirname,'../qingming-error-domain-20261023'),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f));
function refs(value,out=[]){if(!value||typeof value!=='object')return out;if(typeof value.file==='string'&&typeof value.sha256==='string')out.push(value);for(const v of Object.values(value))if(v&&typeof v==='object')refs(v,out);return out;}
async function verify(freezeFile){
 freezeFile=path.resolve(freezeFile);assert.equal(path.dirname(freezeFile),source);const initialSHA=hash(freezeFile),freeze=read(freezeFile);assert.equal(freeze.approved,false);assert.equal(freeze.native_launched,false);assert.equal(freeze.canonical_candidates,0);assert.equal(freeze.full_project_approved,false);
 for(const r of freeze.files)assert.equal(hash(path.resolve(source,r.file)),r.sha256,r.file);
 const N=require(path.join(source,'native-tools.cjs'));assert.deepEqual(N.bindings(),freeze.native_bindings);
 const runtimeBinding=freeze.native_bindings.find(r=>/^runtime-identifiers(?:-v\d+)?\.json$/.test(r.file));assert.ok(runtimeBinding);const expected=read(path.join(source,runtimeBinding.file)),actual=require(path.join(source,'runtime-identifiers.cjs')).build();assert.deepEqual(actual,expected,'runtime package or executable drift');
 const allRefs=refs(expected),missing=[];for(const r of allRefs){assert.equal(hash(path.resolve(source,r.file)),r.sha256,r.file);}
 const covered=new Set(allRefs.map(r=>path.resolve(source,r.file).toLowerCase()));
 for(const [name,relative]of [['playwright-core','lib/bootstrap.js'],['playwright-core','lib/coreBundle.js'],['sharp','dist/constructor.cjs'],['sharp','dist/input.cjs'],['sharp','dist/output.cjs']]){const pkg=expected.packages.find(p=>p.name===name),f=path.join(pkg.root,relative);if(!covered.has(f.toLowerCase()))missing.push(f);}
 assert.deepEqual(missing,[],'known actual require dependencies missing');
 for(const name of ['detect-libc','semver'])assert.ok(allRefs.some(r=>r.file.replaceAll('\\','/').includes('/node_modules/'+name+'/')),'sharp dependency omitted: '+name);
 for(const r of freeze.files)assert.equal(hash(path.resolve(source,r.file)),r.sha256,'method drift during review '+r.file);assert.equal(hash(freezeFile),initialSHA);
 return {pass:true,reviewed_freeze:{file:freezeFile,sha256:initialSHA},method_files:freeze.files.length,native_bindings:freeze.native_bindings.length,runtime_file_references:allRefs.length,browser_or_native_or_HTTP_run:false,full_native_run_verified:false,root_approval_granted:false,global_approved:false};
}
module.exports={verify};
if(require.main===module){assert.ok(process.argv[2],'exact final author freeze required');verify(process.argv[2]).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});}
