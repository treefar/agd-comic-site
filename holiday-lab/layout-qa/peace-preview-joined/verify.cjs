// Pure read-only root-facing verification. No date regeneration or browser launch.
const fs=require('node:fs'),path=require('node:path'),{verify}=require('./candidates.cjs');
verify(JSON.parse(fs.readFileSync(path.join(__dirname,'canonical-candidates.json')))).then(r=>console.log('PEACE_PREVIEW_READONLY YES '+JSON.stringify(r))).catch(e=>{console.error(e);process.exitCode=1;});
