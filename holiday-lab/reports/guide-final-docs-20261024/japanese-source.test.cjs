const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('Japanese appeal-source caption uses the Japanese character for rules',()=>{const d=JSON.parse(fs.readFileSync('data/ja/flow-ui.json'));assert.equal(d['現列112年修訂辦法；中文表V4.0／英文表內標1.0'],'現在掲載の112年改正規程。中国語様式V4.0／英語様式内の表記1.0');});
