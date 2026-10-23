const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{verify}=require('./verify.cjs');
const green=process.env.PLAIN_QA_RUN;assert.ok(green,'set PLAIN_QA_RUN to the exact completed v4 run');const file=path.join(green,'result.json');
function forged(change){const r=JSON.parse(fs.readFileSync(file));change(r);const patched={...fs,readFileSync:(f,...args)=>path.resolve(f)===path.resolve(file)?Buffer.from(JSON.stringify(r)):fs.readFileSync(f,...args)},mod={exports:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'verify.cjs'),'utf8'),{require:n=>n==='node:fs'?patched:require(n),module:mod,process,Buffer,URL,__dirname},{filename:__filename});return()=>mod.exports.verify(green);}
test('real complete receipt passes',()=>assert.equal(verify(green).pass,true));
test('unchanged raw through the same mutation harness passes',()=>assert.equal(forged(()=>{})().pass,true));
test('missing a viewport context is rejected',()=>assert.throws(forged(r=>r.cases.pop())));
test('missing one exact translation observation is rejected',()=>assert.throws(forged(r=>r.targets.pop())));
test('source/build manifest drift cannot hide behind summary pass',()=>assert.throws(forged(r=>{r.sourceBefore.build_manifest_sha256='0'.repeat(64);r.sourceAfter.build_manifest_sha256='0'.repeat(64);})));
test('a missing rendered leaf owner is rejected',()=>assert.throws(forged(r=>r.cases[0].initial.rows.pop())));
test('a real orphan line cannot hide behind orphan=false',()=>assert.throws(forged(r=>{const row=r.cases[0].initial.rows.find(n=>n.lines.length>1);row.lines.at(-1).text='字。';row.orphan=false;})));
test('loading fonts are rejected',()=>assert.throws(forged(r=>r.cases[0].initial.fontStatus='loading')));
test('page horizontal overflow is rejected',()=>assert.throws(forged(r=>r.cases[0].initial.pageOverflow=true)));
test('text beyond owner bounds is rejected even if summary says no overflow',()=>assert.throws(forged(r=>{const n=r.cases[0].initial.rows[0];n.lines[0].right=n.box.x+n.box.width+5;n.overflow=false;})));
test('unoperated FAQ is rejected',()=>assert.throws(forged(r=>r.cases[0].operations.faqKeyboard=false)));
test('console errors are rejected',()=>assert.throws(forged(r=>r.cases[0].errors.push({kind:'console',text:'bad'}))));
test('a forged PNG hash is rejected',()=>assert.throws(forged(r=>r.cases[0].pngs[0].sha256='0'.repeat(64))));
test('a dictionary target changed away from the approved wording is rejected',()=>assert.throws(forged(r=>r.targets[0].layout.text='Wrong translation')));
test('a fabricated native-speaker approval is rejected',()=>assert.throws(forged(r=>r.native_speaker_approved=true)));
test('local review cannot claim public release or full project approval',()=>{assert.throws(forged(r=>r.public_release=true));assert.throws(forged(r=>r.full_project_approved=true));});
