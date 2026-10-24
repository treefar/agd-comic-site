// Independent, read-only CFB/FIB/CLX verification for the two frozen DOC inputs.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root='C:/agywork/agd-holiday-prototypes',out=__dirname;
const worker=path.join(root,'holiday-lab/reports/legacy-reader-20261024');
const pkg=path.join(worker,'runtime/node_modules/word-extractor');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>fs.readFileSync(f),json=f=>JSON.parse(read(f));
const write=(f,v)=>fs.writeFileSync(path.join(out,f),JSON.stringify(v,null,2)+'\n');
const checks=[]; function check(id,ok,detail){checks.push({id,yes:!!ok,detail}); if(!ok)console.error('NO '+id+' '+JSON.stringify(detail));}
function controls(s){const x={};for(let i=0;i<s.length;i++){let n=s.charCodeAt(i);if(n<32||n===127){let k='U+'+n.toString(16).padStart(4,'0');x[k]=(x[k]||0)+1;}}return x;}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const baselineFile=path.join(root,'holiday-lab/reports/copy-actions-20261024/qa/raw-r1/result.json');
const baseline=json(baselineFile);
function productSnapshot(){return {source:baseline.source_after.map(x=>({file:x.file,sha256:sha(read(path.join(root,x.file)))})),build:baseline.build_after.map(x=>({file:x.file,sha256:sha(read(path.join(root,baseline.build,x.file)))}))};}
function matchSnapshot(actual,expected){return JSON.stringify(actual)===JSON.stringify(expected);}
function immutableSnapshot(){const files=[...walk(pkg),path.join(worker,'runtime/package-lock.json'),path.join(worker,'extract.cjs'),path.join(worker,'extract-r2.cjs'),path.join(worker,'extraction.json'),path.join(worker,'extraction-r3-command.json'),...walk(path.join(worker,'parsed-r2'))];return files.map(file=>({file,sha256:sha(read(file))}));}
// This independent CFB reader does not import any parser package code.
function cfb(file){
 const b=read(file),u32=o=>b.readUInt32LE(o),END=0xfffffffe,FREE=0xffffffff;
 assert.equal(b.subarray(0,8).toString('hex'),'d0cf11e0a1b11ae1');
 assert.equal(b.readUInt16LE(0x1c),0xfffe);
 const major=b.readUInt16LE(0x1a),ss=2**b.readUInt16LE(0x1e),ms=2**b.readUInt16LE(0x20);
 assert.ok((major===3&&ss===512)||(major===4&&ss===4096)); assert.equal(ms,64);
 assert.equal(b.length%ss,0);
 const sector=id=>{assert.ok(Number.isInteger(id)&&id>=0&&id<(b.length/ss)-1,'sector bounds '+id);return b.subarray((id+1)*ss,(id+2)*ss);};
 const ints=b=>Array.from({length:b.length/4},(_,i)=>b.readUInt32LE(i*4));
 let difat=Array.from({length:109},(_,i)=>u32(0x4c+4*i)).filter(x=>x!==FREE),next=u32(0x44),ds=new Set();
 for(let i=0;i<u32(0x48);i++){assert.ok(!ds.has(next),'DIFAT cycle');ds.add(next);let v=ints(sector(next));difat.push(...v.slice(0,-1).filter(x=>x!==FREE));next=v.at(-1);}
 assert.equal(difat.length,u32(0x2c),'FAT sector count');
 const fat=difat.flatMap(id=>ints(sector(id)));
 function chain(start,table,get){let chunks=[],ids=[],seen=new Set(),n=start;while(n!==END){assert.ok(n!==FREE&&n<table.length&&!seen.has(n),'chain bounds/cycle '+n);seen.add(n);ids.push(n);chunks.push(get(n));n=table[n];}return {bytes:Buffer.concat(chunks),ids};}
 const directory=chain(u32(0x30),fat,sector),entries=[];
 for(let p=0;p+128<=directory.bytes.length;p+=128){let e=directory.bytes.subarray(p,p+128),type=e[0x42];if(!type)continue;let nl=e.readUInt16LE(0x40);assert.ok(nl>=2&&nl<=64&&nl%2===0);entries.push({name:e.subarray(0,nl-2).toString('utf16le'),type,start:e.readUInt32LE(0x74),size:Number(e.readBigUInt64LE(0x78))});}
 const rt=entries.find(e=>e.type===5);assert.ok(rt);
 const miniStream=chain(rt.start,fat,sector).bytes.subarray(0,rt.size),miniFatChain=u32(0x40)?chain(u32(0x3c),fat,sector):{bytes:Buffer.alloc(0),ids:[]};
 assert.equal(miniFatChain.ids.length,u32(0x40)); const mf=ints(miniFatChain.bytes);
 function stream(name){let e=entries.find(x=>x.type===2&&x.name===name);assert.ok(e,'stream exists '+name);let ch;if(e.size<u32(0x38)){ch=chain(e.start,mf,id=>{assert.ok((id+1)*ms<=miniStream.length,'mini bounds');return miniStream.subarray(id*ms,(id+1)*ms);});}else ch=chain(e.start,fat,sector);assert.ok(ch.bytes.length>=e.size,'stream not truncated');return ch.bytes.subarray(0,e.size);}
 return {file,bytes:b.length,sha256:sha(b),signature:b.subarray(0,8).toString('hex'),major,sector_bytes:ss,mini_sector_bytes:ms,FAT_sectors:difat,directory_sectors:directory.ids,entries,stream};
}
function fibPieces(word,table){
 assert.equal(word.readUInt16LE(0),0xa5ec);assert.equal(word.readUInt16LE(2),0xc1);
 const flags=word.readUInt16LE(10);assert.equal(flags&0x100,0,'not encrypted');
 let p=32,csw=word.readUInt16LE(p);p+=2;const rgw=Array.from({length:csw},(_,i)=>word.readUInt16LE(p+i*2));p+=csw*2;
 const cslw=word.readUInt16LE(p);p+=2;const rglw=Array.from({length:cslw},(_,i)=>word.readUInt32LE(p+i*4));p+=cslw*4;
 const cbRgFcLcb=word.readUInt16LE(p);p+=2;const pairsStart=p,pairs=Array.from({length:cbRgFcLcb},(_,i)=>({index:i,fc:word.readUInt32LE(p+i*8),lcb:word.readUInt32LE(p+i*8+4)}));p+=cbRgFcLcb*8;
 assert.ok(p+2<=word.length);const cswNew=word.readUInt16LE(p);p+=2;const rgCswNew=Array.from({length:cswNew},(_,i)=>word.readUInt16LE(p+i*2));p+=cswNew*2;
 assert.ok(p<=word.readUInt32LE(24),'complete variable FIB before fcMin');
 assert.equal(pairsStart+33*8,0x1a2);const clx=pairs[33];assert.ok(clx.fc+clx.lcb<=table.length);
 const clxEnd=clx.fc+clx.lcb;let q=clx.fc,prcs=[];
 while(table[q]===1){const n=table.readUInt16LE(q+1);assert.ok(q+3+n<=clxEnd);prcs.push({offset:q,length:n});q+=3+n;}
 assert.equal(table[q++],2);const pieceTableBytes=table.readUInt32LE(q);q+=4;assert.equal(q+pieceTableBytes,clxEnd,'entire CLX consumed');
 assert.equal((pieceTableBytes-4)%12,0);const n=(pieceTableBytes-4)/12;assert.ok(n>0);
 const cps=Array.from({length:n+1},(_,i)=>table.readUInt32LE(q+i*4));assert.equal(cps[0],0);
 const pieces=[];
 for(let i=0;i<n;i++){const pc=q+(n+1)*4+i*8,fcRaw=table.readUInt32LE(pc+2);assert.equal(fcRaw&0x80000000,0);const compressed=!!(fcRaw&0x40000000);assert.equal(compressed,false,'these documents contain only UTF16 pieces');const fc=fcRaw&0x3fffffff,len=cps[i+1]-cps[i];assert.ok(len>0&&fc>=word.readUInt32LE(24)&&fc+len*2<=word.length);const bytes=word.subarray(fc,fc+len*2),text=bytes.toString('utf16le');assert.equal(text.length,len);pieces.push({index:i,start_cp:cps[i],end_cp:cps[i+1],file_start:fc,file_end:fc+len*2,bytes_sha256:sha(bytes),text_sha256:sha(Buffer.from(text)),text});}
 const all=pieces.map(x=>x.text).join('');assert.equal(all.length,cps.at(-1));
 const storyKeys=['ccpText','ccpFtn','ccpHdd','ccpMcr','ccpAtn','ccpEdn','ccpTxbx','ccpHdrTxbx'];
 const stories=[];let cp=0;for(let i=0;i<8;i++){const count=rglw[3+i],text=all.slice(cp,cp+count);assert.equal(text.length,count);stories.push({key:storyKeys[i],start_cp:cp,end_cp:cp+count,units:count,text,sha256:sha(Buffer.from(text)),controls:controls(text)});cp+=count;}
 assert.equal(rglw[6],0,'macro story absent');assert.ok(cp<=all.length);
 const tail=all.slice(cp),hdd=pairs[11];assert.ok(hdd.fc+hdd.lcb<=table.length);assert.equal(hdd.lcb%4,0);
 const hddCP=Array.from({length:hdd.lcb/4},(_,i)=>table.readUInt32LE(hdd.fc+i*4)),headerSegments=[];
 for(let i=1;i<hddCP.length;i++){const start=stories[2].start_cp+hddCP[i-1],end=Math.min(stories[2].start_cp+hddCP[i],stories[2].end_cp);assert.ok(start<=end);const si=i-1,type=si<3?'footnoteSeparators':si<6?'endSeparators':[0,1,4].includes(si%6)?'headers':'footers';headerSegments.push({type,start_cp:start,end_cp:end,text:all.slice(start,end)});}
 return {FIB:{wIdent:word.readUInt16LE(0),nFib:word.readUInt16LE(2),flags,fcMin:word.readUInt32LE(24),fcMac:word.readUInt32LE(28),csw,rgw,cslw,rglw,cbRgFcLcb,pairs,cswNew,rgCswNew,parsed_end:p},CLX:{...clx,prcs,piece_table_bytes:pieceTableBytes,cps,consumed_end:clxEnd},pieces,all,stories,tail,header_segments:headerSegments};
}
const Ole=require(path.join(pkg,'lib/word-ole-extractor')),Reader=require(path.join(pkg,'lib/buffer-reader'));
function copyPieces(ps){return ps.map(p=>({...p}));}
class Probe extends Ole{
 extractWordDocument(doc,b){this.word=Buffer.from(b);return super.extractWordDocument(doc,b);}
 writePieces(b,t){this.table=Buffer.from(t);super.writePieces(b,t);this.raw=copyPieces(this._pieces);}
 writeCharacterProperties(b,t){super.writeCharacterProperties(b,t);this.after_character=copyPieces(this._pieces);}
 writeParagraphProperties(b,t){super.writeParagraphProperties(b,t);this.after_paragraph=copyPieces(this._pieces);}
 buildDocument(){this.final=copyPieces(this._pieces);this.headers=this._taggedHeaders.map(x=>({...x}));return super.buildDocument();}
}
function independentClean(s){const replacements={2:'\x00',5:'\x00',7:'\t',8:'\x00',10:'\n',11:'\n',12:'\n',13:'\n'};assert.ok(!s.includes('\x1f'),'unmapped library control absent');s=s.replace(/[\x02\x05\x07\x08\x0a-\x0d]/g,c=>replacements[c.charCodeAt(0)]);let prev;do{prev=s;s=s.replace(/\x13[^\x13\x14\x15]*\x14?([^\x13\x14\x15]*)\x15/g,(_,v)=>v);}while(s!==prev);return s.replace(/[\x00-\x07]/g,'');}
function diffs(a,b){assert.equal(a.length,b.length);return Array.from({length:a.length},(_,cp)=>a[cp]===b[cp]?null:{cp,from:a.charCodeAt(cp),to:b.charCodeAt(cp)}).filter(Boolean);}
async function main(){
 const before=productSnapshot(),immutableBefore=immutableSnapshot();write('product-before.json',before);write('evidence-before.json',immutableBefore);
 check('baseline_47_sources',baseline.source_after.length===47&&matchSnapshot(before.source,baseline.source_after),{count:before.source.length});
 check('baseline_360_build',baseline.build_after.length===360&&matchSnapshot(before.build,baseline.build_after),{count:before.build.length,build:baseline.build});
 const lock=json(path.join(worker,'runtime/package-lock.json')),packageInfo=json(path.join(pkg,'package.json'));
 check('pinned_parser_actual_version',packageInfo.version==='1.0.4'&&lock.packages['node_modules/word-extractor'].version==='1.0.4',{actual:packageInfo.version,lock:lock.packages['node_modules/word-extractor']});
 const final=json(path.join(worker,'parsed-r2/extraction.json')),original=json(path.join(worker,'extraction.json')),receipt=json(path.join(worker,'extraction-r3-command.json'));
 check('final_worker_receipt',receipt.exit_code===0&&!receipt.stderr&&receipt.command.at(-1).endsWith('extract-r2.cjs'),{command:receipt.command,exit_code:receipt.exit_code,stderr:receipt.stderr});
 check('r1_failure_preserved',original.documents.find(x=>x.name==='evaluation').all_story_ranges_covered===false,{original:original.documents.map(x=>({name:x.name,covered:x.all_story_ranges_covered}))});
 const documents=[];
 for(const name of ['recognition','evaluation']){
  const w=final.documents.find(x=>x.name===name),tech=json(path.join(worker,'parsed-r2',name+'-technical.json')),f=cfb(w.file),wd=f.stream('WordDocument'),tab=f.stream((wd.readUInt16LE(10)&0x200)?'1Table':'0Table'),ind=fibPieces(wd,tab);
  check(name+'_input_sha_cfb',f.sha256===w.input_sha256&&w.input_sha256===w.input_sha256_after&&f.signature==='d0cf11e0a1b11ae1',{sha256:f.sha256,bytes:f.bytes,signature:f.signature});
  check(name+'_technical_matches_final',JSON.stringify(w)===JSON.stringify(tech),{});
  check(name+'_independent_streams',wd.equals(read(path.join(worker,'parsed-r2',name+'-worddocument.bin')))&&tab.equals(read(path.join(worker,'parsed-r2',name+'-table.bin'))),{word_bytes:wd.length,word_sha256:sha(wd),table_bytes:tab.length,table_sha256:sha(tab)});
  check(name+'_complete_fib_clx',ind.FIB.parsed_end<=ind.FIB.fcMin&&JSON.stringify(ind.CLX.cps)===JSON.stringify(w.declared_cp)&&ind.CLX.consumed_end===ind.CLX.fc+ind.CLX.lcb,{FIB_end:ind.FIB.parsed_end,CLX:ind.CLX});
  check(name+'_independent_pieces',ind.pieces.every((p,i)=>p.text_sha256===w.pieces[i].sha256&&p.start_cp===w.pieces[i].declared_start_cp&&p.end_cp===w.pieces[i].declared_end_cp)&&ind.all===read(path.join(worker,'parsed-r2',name+'-raw-all-pieces.txt')).toString('utf8'),{cps:ind.CLX.cps});
  for(const s of ind.stories){if(s.key==='ccpMcr'){check(name+'_macro_story_zero',s.units===0,{range:[s.start_cp,s.end_cp]});continue;}const wr=w.raw_ranges.find(x=>x.key===s.key);check(name+'_'+s.key+'_full_range',s.units===wr.declared_units&&s.sha256===wr.raw_sha256&&s.text===read(path.join(worker,'parsed-r2',name+'-raw-'+s.key+'.txt')).toString('utf8'),{range:[s.start_cp,s.end_cp],units:s.units,sha256:s.sha256});}
  check(name+'_one_tail_CR',ind.tail==='\r'&&ind.tail===read(path.join(worker,'parsed-r2',name+'-raw-tail.txt')).toString('utf8'),{tail:JSON.stringify(ind.tail),start_cp:ind.all.length-ind.tail.length,end_cp:ind.all.length});
  const probe=new Probe(),doc=await probe.extract(new Reader(read(w.file)));assert.ok(probe.word.equals(wd)&&probe.table.equals(tab));
  const raw=probe.raw.map(p=>p.text).join(''),postChar=probe.after_character.map(p=>p.text).join(''),postPara=probe.after_paragraph.map(p=>p.text).join(''),postHeader=probe.final.map(p=>p.text).join('');
  const stageDiffs={character:diffs(raw,postChar),paragraph:diffs(postChar,postPara),headers:diffs(postPara,postHeader)};
  check(name+'_raw_parser_matches_independent',raw===ind.all,{});
  check(name+'_no_printable_char_dropped_by_properties',stageDiffs.character.every(d=>d.from<32)&&stageDiffs.paragraph.every(d=>d.from<32)&&stageDiffs.headers.every(d=>d.from<32),{character:stageDiffs.character.length,paragraph:stageDiffs.paragraph.length,headers:stageDiffs.headers.length});
  check(name+'_only_table_row_delimiters_changed',stageDiffs.character.length===0&&stageDiffs.paragraph.every(d=>d.from===7&&d.to===10),{changes:stageDiffs.paragraph});
  check(name+'_header_plc_matches',JSON.stringify(probe.headers)===JSON.stringify(ind.header_segments.map(s=>({type:s.type,text:s.text}))),{segments:ind.header_segments});
  const stories={body:doc.getBody({filterUnicode:false}),footnotes:doc.getFootnotes({filterUnicode:false}),endnotes:doc.getEndnotes({filterUnicode:false}),headers:doc.getHeaders({filterUnicode:false,includeFooters:false}),footers:doc.getFooters({filterUnicode:false}),annotations:doc.getAnnotations({filterUnicode:false}),textboxes:doc.getTextboxes({filterUnicode:false,includeHeadersAndFooters:false}),headerTextboxes:doc.getTextboxes({filterUnicode:false,includeBody:false})};
  const independentBody=ind.all.slice(0,ind.stories[0].end_cp).split('');for(const d of stageDiffs.paragraph)if(d.cp<independentBody.length)independentBody[d.cp]='\n';
  check(name+'_body_independent_clean',stories.body===independentClean(independentBody.join('')),{units:stories.body.length,sha256:sha(Buffer.from(stories.body))});
  for(const kind of ['headers','footers'])check(name+'_'+kind+'_independent_clean',stories[kind]===independentClean(ind.header_segments.filter(s=>s.type===kind).map(s=>s.text).join('')),{text:stories[kind],sha256:sha(Buffer.from(stories[kind]))});
  check(name+'_all_API_stories_reproduced',Object.entries(stories).every(([key,text])=>sha(Buffer.from(text))===w.story_stats[key].sha256&&text===read(path.join(worker,'parsed-r2',name+'-'+key+'.txt')).toString('utf8')),{stories:Object.fromEntries(Object.entries(stories).map(([key,text])=>[key,{units:text.length,sha256:sha(Buffer.from(text))}]))});
  check(name+'_API_zero_replacement_chars',Object.values(stories).every(s=>!s.includes('\ufffd')),{});
  const {stream,...cfbMetadata}=f; documents.push({name,cfb:cfbMetadata,word_stream_sha256:sha(wd),table_stream_sha256:sha(tab),...ind,stage_diffs:stageDiffs,api:stories,limits:{layout_verified:false,table_geometry_preserved:false,current_115_applicability:'unknown',all_embedded_objects_read:false}});
  fs.writeFileSync(path.join(out,name+'-independent-raw.txt'),ind.all);fs.writeFileSync(path.join(out,name+'-independent-body.txt'),stories.body);
  console.log(JSON.stringify({name,input_sha256:f.sha256,CFB:f.signature,FIB_end:ind.FIB.parsed_end,pieces:ind.pieces.length,CPs:ind.CLX.cps,story_units:ind.stories.map(s=>[s.key,s.units]),tail:JSON.stringify(ind.tail),body_sha256:sha(Buffer.from(stories.body)),stage_changes:Object.fromEntries(Object.entries(stageDiffs).map(([k,v])=>[k,v.length]))}));
 }
 const after=productSnapshot(),immutableAfter=immutableSnapshot();write('product-after.json',after);write('evidence-after.json',immutableAfter);
 check('47_source_before_after_stable',matchSnapshot(before.source,after.source),{count:after.source.length});check('360_build_before_after_stable',matchSnapshot(before.build,after.build),{count:after.build.length});check('worker_originals_parser_evidence_untouched',matchSnapshot(immutableBefore,immutableAfter),{files:immutableAfter.length});
 const no=checks.filter(x=>!x.yes).length,result={at:new Date().toISOString(),scope:'Read-only independent CFB/FIB/CLX and all declared text stories; not visual Word layout or current applicability.',baseline:{file:baselineFile,sha256:sha(read(baselineFile)),source_count:47,build_count:360,build:baseline.build},parser:{package:packageInfo.name,version:packageInfo.version,lock_entry:lock.packages['node_modules/word-extractor']},documents,checks,yes:checks.length-no,no,pass:no===0,processes_started:'Only this Node process; no child, UI, browser, Word, service, network, or build process.'};
 write('parser-review.json',result);console.log(JSON.stringify({yes:result.yes,no,pass:result.pass}));process.exitCode=no?1:0;
}
main().catch(e=>{write('method-failure.json',{at:new Date().toISOString(),stack:e.stack,checks});console.error(e.stack);process.exitCode=1;});
