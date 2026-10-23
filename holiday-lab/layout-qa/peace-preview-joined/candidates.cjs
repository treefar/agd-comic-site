// Fixed typed entry point. verify(doc) is read-only; build runs only with explicit --build.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),adapter=require('./adapter.cjs');
async function verify(doc){return adapter.verify(doc);}
module.exports={verify,type:adapter.type,proof_scope:adapter.scope};
if(require.main===module)(async()=>{const file=path.join(__dirname,'canonical-candidates.json');if(process.argv.includes('--build')){assert.ok(!fs.existsSync(file),'No snapshot overwrite');const doc=await adapter.build();await verify(doc);fs.writeFileSync(file,JSON.stringify(doc,null,2)+'\n');}const doc=JSON.parse(fs.readFileSync(file));console.log('PEACE_PREVIEW_TYPED '+JSON.stringify(await verify(doc)));})().catch(e=>{console.error(e);process.exitCode=1;});
