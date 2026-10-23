const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),f=JSON.parse(fs.readFileSync(path.join(__dirname,'freeze.json')));
for(const r of f.source_files)assert.equal(sha(r.file),r.sha256,r.file);for(const r of f.build_files)assert.equal(sha(path.join(f.site,r.file)),r.sha256,r.file);
console.log('FREEZE_UNCHANGED sources17/17 build360/360');
