const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),p=JSON.parse(fs.readFileSync(path.join(__dirname,'proposal.json')));
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const get=(o,p)=>p.slice(1).split('/').map(x=>x.replace(/~1/g,'/').replace(/~0/g,'~')).reduce((a,k)=>a?.[k],o);
const rows=[];const check=(label,yes,details)=>rows.push({label,yes_no:yes?'yes':'no',details});
check('四PROGRAM外語整句均有精確提案',p.operations.filter(o=>['PROGRAM-summary','PROGRAM-content'].includes(o.id)&&o.lang!=='zh').length===4);
check('同頁16欄共48三語指標一致提出',p.operations.length===48&&new Set(p.operations.map(o=>o.id)).size===16);
for(const o of [...p.operations,...p.title_operations]){const value=get(read(o.file),o.pointer);check(`${o.lang} ${o.pointer.slice(0,55)} before`,o.op==='add'?value===undefined:value===o.before,{file:o.file,op:o.op});}
for(const h of p.input_sha256){check('來源未變 '+h.file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,h.file))).digest('hex')===h.sha256);}
const plan=read('holiday-lab/translation-review/official-guide-names-20261023/plan.json');
for(const row of plan)for(const d of row.definitions)check('既有名稱 '+row.id,get(read(d.file),d.pointer)===row.expected);
for(const file of ['data/faculty.json','data/en/faculty.json']){const f=read(file)[0];check('鄧樹遠無電競代理主任 '+file,!/電競|Esports|acting/i.test(f.role),{name:f.name,role:f.role});}
check('職稱不硬套日本助教',p.title_operations.every(o=>o.after.includes('台湾の職名／Assistant Professor')&&!o.after.includes('助教')));
check('產品未寫入與母語／發布未升格',p.product_written===false&&p.native_speaker_approved===false&&p.public_release===false);
const result={at:new Date().toISOString(),yes:rows.filter(x=>x.yes_no==='yes').length,no:rows.filter(x=>x.yes_no==='no').length,rows};
fs.writeFileSync(path.join(__dirname,'verification-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({yes:result.yes,no:result.no,product_written:false}));process.exitCode=result.no?1:0;
