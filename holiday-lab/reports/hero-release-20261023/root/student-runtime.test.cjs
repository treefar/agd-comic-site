const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..');
test('local review explicitly carries all three student curation runtime files',()=>{
 const build=fs.readFileSync(path.join(root,'holiday-lab/build-review.mjs'),'utf8');
 for(const file of ['student-curation.html','student-curation.mjs','student-curation.css'])assert.ok(build.includes("'"+file+"'"),file);
 assert.match(build,/Use a fresh output directory/);
 assert.match(build,/public_release:false/);
});
