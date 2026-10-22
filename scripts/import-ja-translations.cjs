// Import only validated, complete job outputs from the isolated staging directories.
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='C:/agywork/agd-ja-translation';const rows=JSON.parse(fs.readFileSync(root+'/manifest.json'));
function readParts(dir){const result={};for(const file of fs.readdirSync(dir+'/out').filter(x=>x.endsWith('.json'))){const values=JSON.parse(fs.readFileSync(dir+'/out/'+file));const input=JSON.parse(fs.readFileSync(dir+'/inputs/'+file));assert.deepEqual(Object.keys(values).sort(),input.map(x=>x.id).sort(),file+' id coverage');for(const [id,value]of Object.entries(values)){assert.equal(typeof value,'string');assert.ok(value.trim(),id);assert.ok(!(id in result),'duplicate '+id);result[id]=value;}}return result;}
const ja=readParts(root);assert.equal(Object.keys(ja).length,rows.length,'Japanese translation incomplete');
const messages=Object.fromEntries(rows.map(x=>[x.zh,ja[x.id].replaceAll('アニメーション・ゲームデザイン学科','アニメとゲームデザイン学科').replaceAll('4年制・2年制大学','4年制大学・2年制専科学校')]));
const en=readParts('C:/agywork/agd-guide-en-translation');const additions=rows.filter(x=>!x.en);assert.equal(Object.keys(en).length,additions.length,'English guide translation incomplete');
fs.mkdirSync('data/ja',{recursive:true});fs.writeFileSync('data/ja/messages.json',JSON.stringify(messages,null,2)+'\n');fs.writeFileSync('data/en/student-guide-ui.json',JSON.stringify(Object.fromEntries(additions.map(x=>[x.zh,en[x.id]])),null,2)+'\n');
const numbers=s=>(s.normalize('NFKC').match(/\d+/g)||[]).join('|');
const numberReview=rows.filter(x=>numbers(x.zh)!==numbers(messages[x.zh])).map(x=>({zh:x.zh,ja:messages[x.zh]}));
fs.mkdirSync('docs/qa/japanese',{recursive:true});fs.writeFileSync('docs/qa/japanese/translation-audit.json',JSON.stringify({expected:rows.length,translated:Object.keys(messages).length,englishGuideAdditions:additions.length,numberReview,unchanged:rows.filter(x=>messages[x.zh]===x.zh).map(x=>x.zh)},null,2));
console.log('IMPORTED',Object.keys(messages).length,'Japanese;',additions.length,'English guide additions; number review:',numberReview.length);
