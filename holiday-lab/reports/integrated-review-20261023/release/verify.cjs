// Recheck actual frozen build, HTTP receipts, method bytes and screenshots. No browser/writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{manifest,hash}=require('./lib.cjs');
function verify(dir){
 const file=path.join(dir,'result.json'),raw=fs.readFileSync(file),r=JSON.parse(raw);
 assert.equal(r.schema_version,1);assert.equal(r.status,'pass-with-explicit-limitations');assert.equal(r.full_project_approved,false);assert.equal(r.public_release,false);assert.equal(r.labor_played,false);
 assert.deepEqual(r.source_before,r.source_after);assert.deepEqual(manifest(r.site),r.source_before);
 for(const [name,sha]of Object.entries(r.method_files))assert.equal(hash(fs.readFileSync(path.join(__dirname,name))),sha);
 assert.equal(r.checks.length,13);assert.equal(new Set(r.checks.map(c=>c.id)).size,13);assert.equal(r.checks.filter(c=>c.result==='no').length,0);
 const yes=r.checks.filter(c=>c.result==='yes').length,unknown=r.checks.filter(c=>c.result==='unknown').length;assert.equal(yes+unknown,13);assert.equal(r.summary.yes,yes);assert.equal(r.summary.unknown,unknown);assert.equal(r.summary.no,0);
 assert.equal(r.http.length,r.source_before.length);const rows=new Map(r.http.map(c=>[c.path,c]));assert.equal(rows.size,r.http.length);for(const f of r.source_before){const h=rows.get(f.path);assert.equal(h.status,200);assert.equal(h.bytes,f.bytes);assert.equal(h.sha256,f.sha256);}
 for(const shot of r.screenshots){const b=fs.readFileSync(path.join(dir,shot.file));assert.equal(hash(b),shot.sha256);assert.equal(b.length,shot.bytes);assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(b.readUInt32BE(16),shot.width);assert.equal(b.readUInt32BE(20),shot.height);}
 const network=r.checks.find(c=>c.id==='server-private-path-and-real-missing-status').evidence;assert.deepEqual(network.rows.map(x=>x.status),[404,404,404,404,403,400]);assert.equal(network.icon.status,200);
 return {schema_version:1,pass:true,scope:r.scope,site:r.site,base:r.base,checks:13,yes,no:0,unknown,runtime_files:r.source_before.length,http_sha_matches:r.http.length,screenshots:r.screenshots.length,source_stable:true,receipt:file,receipt_sha256:hash(raw),full_project_approved:false,public_release:false,labor_played:false};
}
module.exports={verify};if(require.main===module){try{console.log(JSON.stringify(verify(process.argv[2]),null,2));}catch(e){console.error(e.stack);process.exitCode=1;}}
