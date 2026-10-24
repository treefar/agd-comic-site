// Static coverage inventory. Missing dictionary entries are review candidates, not proof of visible untranslated text.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),norm=s=>s.replace(/\s+/g,' ').trim();
const dictionary=lang=>vm.runInNewContext(fs.readFileSync(path.join(root,'locale-'+lang+'.js'),'utf8')+'; SITE_'+lang.toUpperCase()+'_MESSAGES;');
const en=dictionary('en'),ja=dictionary('ja'),rows=[];
function walk(x,file,pointer=''){if(typeof x==='string'&&/[㐀-鿿]/.test(x)&&!/^https?:/.test(x)){const k=norm(x);rows.push({file,pointer,canonical:x,en:!!en[k],ja:!!ja[k]});}else if(Array.isArray(x))x.forEach((v,i)=>walk(v,file,pointer+'/'+i));else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x))walk(v,file,pointer+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1'));}
for(const name of fs.readdirSync(path.join(root,'data')).filter(n=>n.endsWith('.json'))){const f='data/'+name;walk(JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),f);}
const guide=JSON.parse(fs.readFileSync(path.join(root,'data/students/guide.json'),'utf8'));
for(const card of guide.cards)walk(card,'data/students/guide.json','/cards/'+card.id);
const sourceFiles=['locale-en.js','locale-ja.js','data/students/guide.json'];
const result={observed_utc:new Date().toISOString(),method:'Static canonical data dictionary coverage; not a visible-page or native-speaker certification',public_release:false,source_files:sourceFiles.map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')})),total:rows.length,translated_en:rows.filter(r=>r.en).length,translated_ja:rows.filter(r=>r.ja).length,unmapped:rows.filter(r=>!r.en||!r.ja)};
fs.writeFileSync(path.join(__dirname,process.argv[2]||'translation-inventory.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({total:result.total,translated_en:result.translated_en,translated_ja:result.translated_ja,review_candidates:result.unmapped.length,complete_translation_approved:false}));
