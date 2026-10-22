const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname,a=JSON.parse(fs.readFileSync(path.join(root,'audit.json'),'utf8')),c=JSON.parse(fs.readFileSync(path.join(root,'coverage.json'),'utf8'));
assert.equal(a.pages.length,3);assert.equal(a.cases.length,12);assert.equal(c.cases.length,12);assert.equal(a.errors.length,0);assert.equal(c.font_parse_errors.length,0);
for(const row of a.cases){assert.ok(row.visible);assert.ok(row.text.replace(/\s+/g,' ').includes(row.expected.replace(/\s+/g,' ')),row.issue+' active text');assert.ok(c.cases.find(x=>x.issue===row.issue)?.pass);assert.ok(fs.statSync(path.join(root,row.screenshot)).size>0);console.log('YES '+row.issue+' active/rendered/per-character cmap/screenshot');}
assert.equal(c.cases.reduce((n,r)=>n+r.character_pairs,0),272);console.log('RESULT 12/12 YES; 272 non-whitespace character/string pairs; 3 pages; no product writes');
