// Limited local evidence/proposal check; no browser, build or product mutation.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=__dirname,root='C:/agywork/agd-holiday-prototypes';
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const proposal=read('proposal.json'),translations=read('translations.json');
const current=JSON.parse(fs.readFileSync(path.join(root,'data/students/guide.json')));
const get=(x,p)=>p.slice(1).split('/').reduce((o,k)=>o[k.replace(/~1/g,'/').replace(/~0/g,'~')],x);
const results=[];function check(item,ok,actual){results.push({item,result:ok?'yes':'no',actual});}
const cards=JSON.parse(JSON.stringify(current.cards));
let beforeOK=true,cardOK=true;for(const op of proposal.changes){beforeOK&&=JSON.stringify(get(current,op.pointer))===JSON.stringify(op.before);cardOK&&=current.cards[Number(op.pointer.split('/')[2])].id===op.card_id_guard;const keys=op.pointer.split('/').slice(2);let obj=cards;for(const k of keys.slice(0,-1))obj=obj[k];obj[keys.at(-1)]=op.after;}
check('每個精確before與目前目標欄位一致；不以全檔SHA阻擋他人修改',beforeOK,{operations:proposal.changes.length,historical_sha:proposal.guide_snapshot_sha256});
check('卡片id guard均正確',cardOK,proposal.changes.map(x=>x.card_id_guard));
check('來源追加採id缺席guard，不綁來源索引',proposal.new_sources.every(x=>x.pointer==='/sources/-'&&x.guard.id_absent===x.after.id&&!current.sources.some(s=>s.id===x.after.id)),proposal.new_sources.map(x=>x.after.id));
const target=cards.filter(c=>['english','certification'].includes(c.id));
check('兩卡維持3大步及3小說明',target.every(c=>c.steps.length===3&&c.step_details.length===3),target.map(c=>({id:c.id,steps:c.steps.length,details:c.step_details.length})));
check('summary最多80字、每步detail25至100字、FAQ答案最多120字',target.every(c=>Array.from(c.summary).length<=80&&c.step_details.every(s=>{const n=Array.from(s.detail).length;return n>=25&&n<=100;})&&c.faq.every(f=>Array.from(f.a).length<=120)),target.map(c=>({id:c.id,summary:Array.from(c.summary).length,details:c.step_details.map(s=>Array.from(s.detail).length),answers:c.faq.map(f=>Array.from(f.a).length)})));
const known=new Set([...current.sources.map(s=>s.id),...proposal.new_sources.map(s=>s.after.id)]);let ids=[];function refs(x){if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(k==='source_ids')ids.push(...v);else refs(v);}}target.forEach(refs);
check('所有來源id已存在或有新來源提案',ids.every(x=>known.has(x)),[...new Set(ids)]);
let visible=[];for(const op of proposal.changes){if(/\/(summary|warning|detail|flow_note)$/.test(op.pointer))visible.push(op.after);if(op.pointer.endsWith('/faq'))for(const f of op.after)visible.push(f.q,f.a);}for(const s of proposal.new_sources)visible.push(s.after.title,s.after.readability);
const missing=visible.filter(s=>!translations.pairs.some(t=>t.zh===s&&t.en&&t.ja));
check('新增可見字串均有英日功能翻譯',missing.length===0,{visible:visible.length,translation_pairs:translations.pairs.length,missing});
check('英文contact不改且未猜專責分機',!proposal.changes.some(c=>c.pointer.startsWith(`/cards/${current.cards.findIndex(c=>c.id==='english')}/contact`)),target.find(c=>c.id==='english').contact);
const raw=read('source-matrix.json').raw_sources;
check('7原始PDF匿名200、PDF magic與SHA一致',raw.length===7&&raw.every(r=>{const b=fs.readFileSync(path.join(dir,r.file));return r.status===200&&r.authentication==='none'&&b.subarray(0,5).toString()==='%PDF-'&&sha(b)===r.sha256;}),raw.map(r=>({file:r.file,status:r.status,bytes:r.bytes,sha256:r.sha256})));
const matr=read('source-matrix.json');check('115-1全英課／完整認列表／當期獎助明確維持no',matr.items.filter(x=>/115-1可認列|115-1證照|完整認列表/.test(x.item)).every(x=>x.result==='no'),matr.items.filter(x=>x.result==='no').map(x=>x.item));
check('外語舊版影像限制明列、不冒充全頁目視',read('visual-ledger.json').records.find(r=>r.file==='language-course-20201209.pdf').visual_pages.length===1,read('visual-ledger.json').records.find(r=>r.file==='language-course-20201209.pdf'));
check('非目標卡保持不變',cards.filter(c=>!['english','certification'].includes(c.id)).every(c=>JSON.stringify(c)===JSON.stringify(current.cards.find(x=>x.id===c.id))),{unmodified_other_cards:cards.length-2});
const result={at:new Date().toISOString(),scope:'L0 local proposal/evidence only, not product integration or UI approval',yes:results.filter(x=>x.result==='yes').length,no:results.filter(x=>x.result==='no').length,checks:results};
fs.writeFileSync(path.join(dir,'verify-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));process.exitCode=result.no?1:0;
