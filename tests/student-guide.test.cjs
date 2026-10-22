const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('Student guide uses existing site components and has an FAQ section',()=>{
 const source=fs.readFileSync('student-guide.jsx','utf8');assert.match(source,/StudentGuideDetail/);assert.match(source,/BackBar/);assert.match(source,/常見問題/);assert.match(source,/<details/);
 assert.match(fs.readFileSync('pages.jsx','utf8'),/case "students"/);assert.match(fs.readFileSync('comic-components.jsx','utf8'),/在校指南/);
});
test('Reviewed student copy has concise steps and traceable FAQ sources',()=>{
 const data=JSON.parse(fs.readFileSync('data/students/guide.json','utf8'));assert.equal(data.cards.length,15);assert.equal(data.categories.length,8);const ids=new Set(data.sources.map(x=>x.id));
 for(const c of data.cards){assert.ok(c.summary.length<=80,c.id);assert.ok(c.steps.length>0&&c.steps.length<=3,c.id);assert.ok(c.steps.every(x=>x.length<=45),c.id);assert.ok(c.contact.primary,c.id);assert.ok(c.source_ids.length&&c.source_ids.every(id=>ids.has(id)),c.id);assert.ok(c.faq.length>0,c.id);for(const f of c.faq){assert.ok(f.a.length<=120,c.id);assert.ok(f.source_ids.length&&f.source_ids.every(id=>ids.has(id)),c.id);}}
 assert.equal(new Set(data.cards.map(x=>x.id)).size,15);assert.ok(data.cards.some(x=>x.id==='overseas-internship'));assert.ok(data.cards.some(x=>x.id==='overseas-study-visit'));assert.ok(data.categories.every(x=>data.cards.some(c=>c.category===x.id)));
});
test('Category and student wording searches combine without hiding FAQ-only matches',()=>{
 const vm=require('node:vm'),ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('student-guide-model.js','utf8')+';this.model=StudentGuideModel',ctx);const m=ctx.model;const cards=[{id:'a',category:'courses',title:'選課',summary:'加退選',steps:['確認學分'],contact:{primary:'註冊課務組'},faq:[{q:'忘記選課？',a:'洽承辦'}]},{id:'b',category:'internships',title:'海外實習',summary:'赴日',steps:[],contact:{primary:'職涯中心'},faq:[{q:'有補助嗎？',a:'看當期甄選'}]}];
 assert.deepEqual(m.filter(cards,'courses','忘記').map(x=>x.id),['a']);assert.equal(m.filter(cards,'courses','補助').length,0);assert.deepEqual(m.filter(cards,'all',' 職涯 ').map(x=>x.id),['b']);assert.equal(m.filter(cards,'all','查無此資料').length,0);assert.equal(m.filter(cards,'all','').length,2);
});

test('Opening panel is a category index without promotional filler',()=>{const s=fs.readFileSync('student-guide.jsx','utf8');assert.doesNotMatch(s,/要辦什麼事，|先找到這一格|從選課到畢業，先看重點/);assert.ok(s.indexOf('aria-label="資訊分類"')<s.indexOf('<aside className="sg-note">'));});
