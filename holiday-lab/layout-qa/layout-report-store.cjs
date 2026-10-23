'use strict';
// QA report storage only. Original report schema and full case payloads are unchanged.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const VERSION=2,MARKER='layout_report_store_version';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const identity=c=>Object.fromEntries(['id','width','height','intent','original_state','replay_shot'].filter(k=>own(c,k)).map(k=>[k,c[k]]));
const summary=c=>Object.fromEntries(['id','width','height','intent','original_state','replay_shot','geometry_errors','screenshot'].filter(k=>own(c,k)).map(k=>[k,c[k]]));

// Serialize tokens directly to a file. Even a large string value is escaped in
// small pieces; surrogate pairs split at a boundary remain equivalent JSON.
function writeJSON(file,value){
  const fd=fs.openSync(file,'wx'),hash=crypto.createHash('sha256'),active=new Set();let bytes=0,pending=[],pendingBytes=0;
  const flush=()=>{if(!pendingBytes)return;const b=Buffer.concat(pending,pendingBytes);let at=0;while(at<b.length)at+=fs.writeSync(fd,b,at,b.length-at);hash.update(b);bytes+=b.length;pending=[];pendingBytes=0;};
  const put=s=>{const b=Buffer.from(s);pending.push(b);pendingBytes+=b.length;if(pendingBytes>=65536)flush();};
  function string(s){put('"');for(let i=0;i<s.length;i+=512)put(JSON.stringify(s.slice(i,i+512)).slice(1,-1));put('"');}
  function visit(v,key=''){
    if(v&&typeof v.toJSON==='function')v=v.toJSON(key);
    if(v===null){put('null');return;}
    if(typeof v==='string'){string(v);return;}
    if(typeof v==='number'){put(Number.isFinite(v)?String(v):'null');return;}
    if(typeof v==='boolean'){put(String(v));return;}
    if(typeof v==='bigint')throw new TypeError('Cannot serialize BigInt');
    if(typeof v!=='object'){put('null');return;}
    if(active.has(v))throw new TypeError('Converting circular structure to JSON');active.add(v);
    if(Array.isArray(v)){put('[');for(let i=0;i<v.length;i++){if(i)put(',');visit(v[i],String(i));}put(']');}
    else{put('{');let first=true;for(const k of Object.keys(v)){const x=v[k];if(x===undefined||typeof x==='function'||typeof x==='symbol')continue;if(!first)put(',');first=false;string(k);put(':');visit(x,k);}put('}');}
    active.delete(v);
  }
  try{visit(value);flush();fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  return {sha256:hash.digest('hex'),bytes};
}
function createLayoutReportWriter(file){
  file=path.resolve(file);fs.mkdirSync(path.dirname(file),{recursive:true});
  const generation=crypto.randomUUID(),dir=file+'.parts',entries=[];
  fs.mkdirSync(dir,{recursive:true});
  const record=(name,value)=>{const target=path.join(dir,generation+'-'+name+'.json'),proof=writeJSON(target,value);return {file:path.relative(path.dirname(file),target).split(path.sep).join('/'),...proof};};
  return {
    appendCase(c){
      if(!c||typeof c!=='object'||Array.isArray(c))throw new TypeError('Full case object required');
      const index=entries.length,entry={index,identity:identity(c),summary:summary(c),...record('case-'+index,c)};
      // A caller can keep mutating its original case; the index describes the saved snapshot.
      const saved=JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),entry.file),'utf8'));
      entry.identity=identity(saved);entry.summary=summary(saved);entries.push(entry);return index;
    },
    checkpoint(header){
      if(!header||typeof header!=='object'||Array.isArray(header))throw new TypeError('Report header object required');
      const top={};for(const k of Object.keys(header))if(k!=='cases')top[k]=header[k];
      const h=record('header-'+crypto.randomUUID(),top),manifest={[MARKER]:VERSION,format:'full-case-shards',header:h,case_count:entries.length,cases:entries};
      const temp=file+'.pending-'+crypto.randomUUID();writeJSON(temp,manifest);fs.renameSync(temp,file);
      return {file,version:VERSION,cases:entries.length};
    },
    get length(){return entries.length;}
  };
}
function writeLayoutReport(file,report){
  if(!Array.isArray(report?.cases))throw new TypeError('Report cases must be an Array');
  const writer=createLayoutReportWriter(file);for(const c of report.cases)writer.appendCase(c);return writer.checkpoint(report);
}
function localPath(file,relative){
  if(typeof relative!=='string'||path.isAbsolute(relative)||relative.split(/[\\/]/).includes('..'))throw Error('Unsafe shard path');
  const base=path.dirname(path.resolve(file)),target=path.resolve(base,relative);
  if(!target.startsWith(base+path.sep))throw Error('Unsafe shard path');return target;
}
function checkedJSON(file,ref){
  if(!ref||!/^[a-f0-9]{64}$/.test(ref.sha256))throw Error('Invalid shard SHA');
  const bytes=fs.readFileSync(localPath(file,ref.file));
  if(bytes.length!==ref.bytes||digest(bytes)!==ref.sha256)throw Error('Shard SHA/size mismatch: '+ref.file);
  return JSON.parse(bytes.toString('utf8'));
}
function open(file){
  const manifest=JSON.parse(fs.readFileSync(file,'utf8'));
  if(!own(manifest,MARKER))return {legacy:manifest};
  if(manifest[MARKER]!==VERSION||manifest.format!=='full-case-shards')throw Error('Unsupported report store version');
  if(!Array.isArray(manifest.cases)||manifest.case_count!==manifest.cases.length)throw Error('Invalid case count');
  for(let i=0;i<manifest.cases.length;i++){
    const e=manifest.cases[i];if(e.index!==i)throw Error('Invalid/duplicate case index');localPath(file,e.file);
    if(!e.identity||!e.summary||JSON.stringify(identity(e.summary))!==JSON.stringify(e.identity))throw Error('Manifest case identity mismatch');
  }
  return {manifest,header:checkedJSON(file,manifest.header)};
}
function readLayoutReport(file,{cacheSize=2,onCaseRead}={}){
  const result=open(file);if(result.legacy)return result.legacy;
  if(!Number.isSafeInteger(cacheSize)||cacheSize<0)throw new TypeError('cacheSize must be a nonnegative integer');
  const {manifest,header}=result,cache=new Map(),cases=new Array(manifest.cases.length);
  function load(index){
    if(cache.has(index)){const c=cache.get(index);cache.delete(index);cache.set(index,c);return c;}
    const e=manifest.cases[index],c=checkedJSON(file,e);
    if(JSON.stringify(identity(c))!==JSON.stringify(e.identity)||JSON.stringify(summary(c))!==JSON.stringify(e.summary))throw Error('Shard case identity/summary mismatch: '+index);
    if(onCaseRead)onCaseRead(index);
    if(cacheSize){cache.set(index,c);while(cache.size>cacheSize)cache.delete(cache.keys().next().value);}return c;
  }
  for(let i=0;i<cases.length;i++)Object.defineProperty(cases,i,{enumerable:true,configurable:false,get:()=>load(i)});
  header.cases=cases;return header;
}
function readCaseSummaries(file){const r=open(file);return r.legacy?r.legacy.cases.map(summary):r.manifest.cases.map(e=>({...e.summary}));}
function verifyLayoutReport(file){const r=readLayoutReport(file,{cacheSize:0});let n=0;for(const c of r.cases){if(!c||typeof c!=='object')throw Error('Invalid full case');n++;}return {cases:n,verified:true};}
module.exports={VERSION,createLayoutReportWriter,writeLayoutReport,readLayoutReport,readCaseSummaries,verifyLayoutReport};
