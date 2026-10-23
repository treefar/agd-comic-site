// Read-only independent result and screenshot integrity check; never rewrites peer receipts.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const dir='holiday-lab/reports/shutdown-20261023/independent',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(f);
const m=JSON.parse(read(dir+'/receipt.json')),raw=read(dir+'/run05/result.json'),r=JSON.parse(raw);
assert.equal(sha(raw),'837c6990cad9915cae94ed2ef2cb3eec58a3b417f77fffa95ce82723b9976bf2');assert.equal(m.result_sha256,sha(raw));
assert.equal(m.method_sha256,sha(read(dir+'/run-v5.cjs')));assert.equal(m.verify_sha256,sha(read(dir+'/verify.cjs')));
assert.equal(r.status,'pass');assert.equal(r.contexts.length,6);assert.deepEqual(r.sources_before,r.sources_after);assert.deepEqual(r.http_before,r.http_after);
for(const [f,h]of Object.entries(r.sources_after))assert.equal(sha(read(f)),h,f);
for(const c of r.contexts){assert.equal(c.pass,true);assert.equal(c.states.length,4);assert.equal(c.source.teamVisible,true);assert.equal(c.errors.length,0);assert.equal(c.badResponses.length,0);for(const s of c.states){assert.equal(s.fit,'contain');assert.equal(s.fontStatus,'loaded');assert.ok(s.pageWidth<=s.viewport+1);}}
assert.equal(m.pngs.length,30);for(const p of m.pngs)assert.equal(sha(read(path.join(dir,'run05',p.file))),p.sha256,p.file);
assert.equal(r.full_project_approved,false);console.log('PASS root readonly: 6 contexts / 24 states / 6 source clicks / 30 PNG; 9 current sources stable; independent method and PNG SHA preserved; no global approval');
