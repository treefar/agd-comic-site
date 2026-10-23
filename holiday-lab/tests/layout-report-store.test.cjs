const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const store = require(process.env.LAYOUT_REPORT_STORE_MODULE || '../layout-qa/layout-report-store.cjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'layout-report-store-'));
const example = () => ({schema_version:1,source_fingerprints:{中:'值😀'},metadata:{sessions:[{intent:'credit-first',failure:null}]},violations:['PARTIAL'],cases:Array.from({length:8},(_,i)=>({id:'semester/ja/game/error',width:i%2?1440:320,height:900,intent:i%3?'credit-first':'graduation-first',nodes:[{owner:'中文😀',text:'文字「助教」\n'.repeat(100),safe:{x:0,y:1},optional:null}],blockers:[{id:'按鈕',rect:[0,1,2,3]}],geometry_errors:[],screenshot:{sha256:'a'.repeat(64)},index:i}))});
test('legacy aggregate low-limit reproduction; sharded writer never aggregate-stringifies',()=>{
  const report=example(),original=JSON.stringify,limit=4000;report.metadata.long='😀\u0000'.repeat(10000);
  const limited=(value,...args)=>{const s=original(value,...args);if(s?.length>limit)throw new RangeError('Invalid string length (simulated 4000)');return s;};
  assert.throws(()=>limited(report),/Invalid string length/);
  const file=path.join(tmp(),'report.json');
  JSON.stringify=limited;
  try{store.writeLayoutReport(file,report);}finally{JSON.stringify=original;}
  assert.deepEqual(store.readLayoutReport(file),report);
});
test('v1 backward compatibility and v2 lazy true Array with bounded LRU',()=>{
  const dir=tmp(),report=example(),v1=path.join(dir,'old.json'),v2=path.join(dir,'new.json');
  fs.writeFileSync(v1,JSON.stringify(report));assert.deepEqual(store.readLayoutReport(v1),report);
  store.writeLayoutReport(v2,report);let loads=0;const r=store.readLayoutReport(v2,{cacheSize:2,onCaseRead:()=>loads++});
  assert.equal(loads,0);assert.ok(Array.isArray(r.cases));assert.equal(r.cases.length,8);
  assert.deepEqual(r.cases[0],report.cases[0]);assert.equal(loads,1);r.cases[0];assert.equal(loads,1);
  r.cases[1];r.cases[2];r.cases[0];assert.equal(loads,4);
  assert.deepEqual(r.cases.map(c=>c.index),report.cases.map(c=>c.index));assert.deepEqual(r,report);
  assert.deepEqual([r.cases[2].id,r.cases[2].width,r.cases[2].intent],[r.cases[4].id,r.cases[4].width,r.cases[4].intent]);assert.notEqual(r.cases[2].index,r.cases[4].index);
});
test('summaries preserve repeated IDs, width and intent without hydrating missing shards',()=>{
  const file=path.join(tmp(),'report.json');store.writeLayoutReport(file,example());
  const m=JSON.parse(fs.readFileSync(file));fs.renameSync(path.resolve(path.dirname(file),m.cases[0].file),path.join(path.dirname(file),'retained-missing-case.json'));
  const s=store.readCaseSummaries(file);assert.equal(s.length,8);assert.equal(s[0].id,s[1].id);assert.notEqual(s[0].width,s[1].width);assert.notEqual(s[0].intent,s[1].intent);
  assert.throws(()=>store.readLayoutReport(file).cases[0],/ENOENT/);
});
test('SHA mismatch, identity mismatch, duplicate indices and escaping paths fail closed',()=>{
  for(const kind of ['sha','identity','index','path']){
    const file=path.join(tmp(),'report.json');store.writeLayoutReport(file,example());const m=JSON.parse(fs.readFileSync(file));
    if(kind==='sha')fs.appendFileSync(path.resolve(path.dirname(file),m.cases[0].file),' ');
    if(kind==='identity')m.cases[0].identity.width=42;
    if(kind==='index')m.cases[1].index=0;
    if(kind==='path')m.cases[0].file='../outside.json';
    fs.writeFileSync(file,JSON.stringify(m));
    assert.throws(()=>store.readLayoutReport(file).cases[0],/SHA|identity|index|path/);
  }
});
test('incremental append preserves old checkpoint and full case snapshots',()=>{
  const file=path.join(tmp(),'report.json'),w=store.createLayoutReportWriter(file),report=example();
  w.appendCase(report.cases[0]);w.checkpoint({schema_version:1,metadata:{status:'partial'},violations:['red']});
  const old=fs.readFileSync(file);w.appendCase(report.cases[1]);assert.deepEqual(fs.readFileSync(file),old);
  w.checkpoint({schema_version:1,metadata:{status:'complete'},violations:[]});
  const r=store.readLayoutReport(file);assert.deepEqual(r.cases,report.cases.slice(0,2));assert.equal(r.metadata.status,'complete');
  assert.equal(store.verifyLayoutReport(file).cases,2);
});
test('append snapshot remains immutable when caller changes its original object',()=>{
  const file=path.join(tmp(),'report.json'),w=store.createLayoutReportWriter(file),c=example().cases[0],saved=structuredClone(c);
  w.appendCase(c);c.id='changed';c.nodes[0].text='changed';w.checkpoint({schema_version:1});assert.deepEqual(store.readLayoutReport(file).cases[0],saved);
  const cycle={id:'bad'};cycle.self=cycle;assert.throws(()=>w.appendCase(cycle),/circular/i);assert.equal(w.length,1);
});
test('stream serializer matches JSON semantics with Unicode, control chars and omission',()=>{
  const file=path.join(tmp(),'report.json'),r={schema_version:1,metadata:{str:'😀中\\\"\n\u0000'.repeat(5000),skip:undefined,nan:NaN,arr:[undefined,Infinity]},cases:[{id:'x',nodes:[],blockers:[],s:'a'.repeat(8191)+'😀'}]};
  store.writeLayoutReport(file,r);assert.deepEqual(store.readLayoutReport(file),JSON.parse(JSON.stringify(r)));
});
test('partial write failure does not replace previous committed manifest',()=>{
  const file=path.join(tmp(),'report.json');store.writeLayoutReport(file,example());const old=fs.readFileSync(file),w=store.createLayoutReportWriter(file);w.appendCase(example().cases[0]);
  const cycle={};cycle.self=cycle;assert.throws(()=>w.checkpoint({metadata:cycle}),/circular/i);assert.deepEqual(fs.readFileSync(file),old);
});
test('header SHA verified before exposing metadata; unsupported versions rejected',()=>{
  const file=path.join(tmp(),'report.json');store.writeLayoutReport(file,example());let m=JSON.parse(fs.readFileSync(file));fs.appendFileSync(path.resolve(path.dirname(file),m.header.file),' ');assert.throws(()=>store.readLayoutReport(file),/SHA/);
  fs.writeFileSync(file,JSON.stringify({layout_report_store_version:99}));assert.throws(()=>store.readLayoutReport(file),/version/);
});
