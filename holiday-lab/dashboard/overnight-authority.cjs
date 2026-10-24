const assert=require('node:assert/strict');
module.exports=function(ctx){
 const data=ctx.data,path=require('node:path'),project=path.resolve(__dirname,'../..');
 const expected=require('./overnight-adapter.cjs')(project);
 assert.deepEqual(data.sections.map(s=>s.rows),expected.sections.map(s=>s.rows));
 assert.ok(data.sections[0].rows.every(r=>r.user==='pending'));
 return [{name:'本輪證據SHA、逐項結果及三層狀態與原始資料一致',pass:true}];
};
