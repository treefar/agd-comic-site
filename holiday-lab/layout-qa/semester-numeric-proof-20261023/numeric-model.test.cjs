const test=require('node:test'),assert=require('node:assert/strict'),M=require('./numeric-model.cjs');
const digits=Array.from({length:10},(_,d)=>({digit:String(d),advance:20,bounds:[d%3, -d%4, 11+d%6,14+d%5]}));
test('prefix DAG exact metric classes agree with brute force on bounded normal decimal strings',()=>{
 for(const [min,max,parity]of [[0,999,0],[1,999,1],[18,4999,0],[107,4003,1],[999,1001,1]]){
  const expected=new Map();for(let n=min;n<=max;n++)if(n%2===parity){const text=String(n),key=M.metricKey(text,digits);if(!expected.has(key))expected.set(key,text);}
  const actual=M.classes({min,max,parity},digits);assert.deepEqual([...actual.map(x=>x.key)].sort(),[...expected.keys()].sort());
  for(const r of actual){assert.equal(M.metricKey(r.witness,digits),r.key);assert.ok(Number(r.witness)>=min&&Number(r.witness)<=max);assert.equal(Number(r.witness)%2,parity);assert.ok(!/^0\d/.test(r.witness));}
 }
});
test('language ceiling, nonleading zeros, parity, empty range and unsound glyph slots rejected',()=>{
 const actual=M.classes({min:4294967289,max:4294967294,parity:0},digits);assert.ok(actual.length>0);for(const r of actual)assert.ok(Number(r.witness)<=4294967294);
 assert.deepEqual(M.classes({min:8,max:8,parity:1},digits),[]);
 assert.throws(()=>M.classes({min:0,max:4294967295,parity:0},digits),/guard/);
 const bad=structuredClone(digits);bad[0].bounds[2]=25;assert.throws(()=>M.classes({min:0,max:99,parity:0},bad),/slot/);
});
test('every contiguous fragment has exact classes and extrema, including a parity-constrained suffix',()=>{
 for(let start=0;start<3;start++)for(let end=start+1;end<=3;end++){
  const guard={min:107,max:989,parity:1},segment=[start,end],expected=new Set();for(let n=107;n<=989;n+=2)expected.add(M.metricKey(String(n),digits,segment));
  const actual=M.classes(guard,digits,{length:3,segment});assert.deepEqual(new Set(actual.map(x=>x.key)),expected);
  const b=M.bounds(actual);for(const field of ['advance','xMin','xMax','yMin','yMax']){assert.equal(M.metrics(b[field].lower_witness,digits,segment)[field],b[field].lower);assert.equal(M.metrics(b[field].upper_witness,digits,segment)[field],b[field].upper);}
 }
});
test('actual font outlines: tight ten-digit ceiling and decimal length crossings match bounded brute force',()=>{
 const fonts=require('./font-audit.json').fonts;
 for(const font of fonts)for(const [min,max]of [[4294967000,4294967294],[8,11],[98,101],[998,1001]])for(const parity of [0,1]){
  for(let length=String(min).length;length<=String(max).length;length++){
   const segments=[[0,length],[0,1],[length-1,length],...(length>2?[[1,length-1]]:[])];
   for(const segment of segments){
    const expected=new Set();for(let n=min;n<=max;n++)if(n%2===parity&&String(n).length===length)expected.add(M.metricKey(String(n),font.digits,segment));
    const actual=M.classes({min,max,parity},font.digits,{length,segment});assert.deepEqual(new Set(actual.map(x=>x.key)),expected,`${font.subfamily}/${min}/${max}/${parity}/${segment}`);
    if(actual.length){const b=M.bounds(actual);for(const field of ['advance','xMin','xMax','yMin','yMax'])for(const side of ['lower','upper']){const witness=b[field][side+'_witness'];assert.ok(Number(witness)>=min&&Number(witness)<=max);assert.equal(Number(witness)%2,parity);assert.equal(M.metrics(witness,font.digits,segment)[field],b[field][side]);}}
   }
  }
 }
});
