const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../..');
test('website keeps student curation at the bottom and does not offer frozen seasonal games',()=>{
 const home=fs.readFileSync(path.join(root,'holiday-home.jsx'),'utf8'),app=fs.readFileSync(path.join(root,'app.jsx'),'utf8');
 assert.ok(!home.includes('id="festival-start"'),'generated game entry must not be offered');
 assert.ok(!home.includes('id="festival-select"'),'frozen game selector must not be offered');
 assert.ok(home.includes('id="festival-paused-note"'));
 assert.ok(home.includes('id="student-curation-start"'));
 assert.ok(app.indexOf('<JoinChapter')<app.indexOf('id="student-play"'));
 assert.ok(app.indexOf('id="student-play"')<app.indexOf('<FooterChapter'));
});
