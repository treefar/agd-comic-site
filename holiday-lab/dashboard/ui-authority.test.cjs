const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),authority=require('./authority.cjs');
const data=()=>JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'))),check=d=>authority({section:id=>d.sections.find(s=>s.id===id).rows});
test('current dashboard independently matches all source authorities',()=>assert.ok(check(data()).every(c=>c.pass)));
test('forged covered case count is rejected',()=>{const d=data();d.sections.find(s=>s.id==='ui_scope').rows[0].covered++;assert.equal(check(d).find(c=>c.name.startsWith('UI覆蓋分母')).pass,false);});
test('functional pass must never upgrade the complete UI gate',()=>{const d=data();d.sections.find(s=>s.id==='ui_gate').rows.find(r=>r.id==='global').result='pass';assert.equal(check(d).find(c=>c.name.startsWith('完整UI仍NO')).pass,false);});
test('invented user approval is rejected',()=>{const d=data();d.sections.find(s=>s.id==='games').rows[0].user='confirmed';assert.equal(check(d).find(c=>c.name.startsWith('使用者確認仍由')).pass,false);});
