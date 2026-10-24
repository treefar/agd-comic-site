const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('certificate awards, career exploration and internships retain their verified separate extensions',()=>{
 const g=JSON.parse(fs.readFileSync('data/students/guide.json')),card=id=>g.cards.find(c=>c.id===id);
 assert.equal(card('certification').contact.secondary_phone,'07-6158000#1712');
 assert.equal(card('career').contact.phone,'07-6158000#1713');
 for(const id of ['internship','overseas-internship'])assert.equal(card(id).contact.secondary_phone,'07-6158000#1711');
 const faq=card('career').faq.find(f=>f.q==='職涯探索、找工作和證照，問同一個分機嗎？');
 assert.ok(faq);assert.match(faq.a,/UCAN.*1713.*證照獎助1712.*學海1711/);assert.deepEqual(faq.source_ids,['career-contact']);
});
