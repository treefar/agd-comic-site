const fs=require('node:fs');
const messages=JSON.parse(fs.readFileSync('data/ja/messages.json','utf8'));
Object.assign(messages,JSON.parse(fs.readFileSync('data/ja/ui.json','utf8')));
if(fs.existsSync('data/ja/step-details.json'))Object.assign(messages,JSON.parse(fs.readFileSync('data/ja/step-details.json','utf8')));
if(fs.existsSync('data/ja/editorial.json'))Object.assign(messages,JSON.parse(fs.readFileSync('data/ja/editorial.json','utf8')));
if(fs.existsSync('data/ja/flow-ui.json'))Object.assign(messages,JSON.parse(fs.readFileSync('data/ja/flow-ui.json','utf8')));
fs.writeFileSync('locale-ja.js','// Generated from data/ja/messages.json; canonical Chinese data stay unchanged.\nconst SITE_JA_MESSAGES = '+JSON.stringify(messages,null,2)+';\n');
console.log('Japanese exact translations:',Object.keys(messages).length);
