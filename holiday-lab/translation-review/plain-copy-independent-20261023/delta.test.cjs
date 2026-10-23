const test=require('node:test'),assert=require('node:assert/strict'),{exactDelta}=require('./source-audit.cjs');
const before={'甲/乙':{text:'原文'},preserved:['A','B']},after={'甲/乙':{text:'譯文'},preserved:['A','B']},allowed=[{pointer:'/甲~1乙/text',before:'原文',after:'譯文'}];
test('a valid nested escaped JSON pointer passes the same exact-delta guard',()=>assert.equal(exactDelta(before,after,allowed).length,1));
test('another value changed outside approval is rejected',()=>assert.throws(()=>exactDelta(before,{...after,preserved:['A','C']},allowed)));
test('an added key is rejected',()=>assert.throws(()=>exactDelta(before,{...after,extra:true},allowed)));
test('a removed key is rejected',()=>assert.throws(()=>exactDelta(before,{'甲/乙':{text:'譯文'}},allowed)));
test('a wrong replacement is rejected',()=>assert.throws(()=>exactDelta(before,{'甲/乙':{text:'別的翻譯'},preserved:['A','B']},allowed)));
test('the wrong original value is rejected',()=>assert.throws(()=>exactDelta({'甲/乙':{text:'非原文'},preserved:['A','B']},after,allowed)));
test('duplicate approved pointers cannot hide a missing actual change',()=>assert.throws(()=>exactDelta(before,after,[...allowed,...allowed])));
