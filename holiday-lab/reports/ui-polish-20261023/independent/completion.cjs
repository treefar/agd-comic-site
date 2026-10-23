// Matches the fourteen actual result builders, not an assumed perfect score.
const assert=require('node:assert/strict');
const fields={'new-year':'takes','lunar-new-year':'poses',lantern:'shots',children:'takes','dragon-boat':'folds','mid-autumn':'cuts',teachers:'panels','national-day':'shots',semester:'visits',exhibition:'works','peace-memory':'heard',qingming:'captures',retrocession:'alignments',constitution:'captions'};
function checkCompletion(id,artifact,display){
 assert.ok(Object.hasOwn(fields,id));const rows=artifact[fields[id]];assert.ok(Array.isArray(rows));assert.equal(rows.length,id==='semester'?4:3,'actual saved work count');
 const m=display.trim().match(/^(\d+)\s*\/\s*100$/);assert.ok(m,'complete score presentation');const actual=Number(m[1]);let expected=100;
 if(['lantern','dragon-boat','national-day'].includes(id)){assert.ok(Number.isInteger(artifact.misses)&&artifact.misses>=0);expected=Math.max(50,100-artifact.misses*4);}
 if(id==='teachers'){assert.ok(Number.isInteger(artifact.attempts)&&artifact.attempts>=3);expected=Math.max(70,100-Math.max(0,artifact.attempts-3)*3);}
 if(id==='children')expected=Math.round(100-rows.reduce((n,t)=>n+t.error,0)/6);
 if(id==='mid-autumn')expected=Math.round(rows.reduce((n,t)=>n+t.score,0)/3);
 if(id==='retrocession')expected=Math.round(100-rows.reduce((n,t)=>n+t.error,0)*3);
 assert.ok(Number.isFinite(expected)&&expected>=0&&expected<=100);assert.equal(actual,expected,'actual score must match stored work and the product result formula');
 return {display,actual,expected,savedField:fields[id],savedCount:rows.length};
}
module.exports={checkCompletion};
