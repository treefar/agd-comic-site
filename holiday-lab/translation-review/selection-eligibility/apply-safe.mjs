// Proposal-only by default. Exact old-value preflight; never modify generated locales.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
export const defaultPlan=JSON.parse(fs.readFileSync(path.join(dir,'exact-plan.json'),'utf8'));
const allowed=new Set(['data/admission.json','data/en/admission.json','data/ja/messages.json']);
export function prepare(project,plan=defaultPlan){
 const root=path.resolve(project),originals=new Map(),texts=new Map(),jsons=new Map();
 for(const f of plan.files){if(!allowed.has(f.file)||originals.has(f.file))throw Error('OUTSIDE_OR_DUPLICATE_FILE '+f.file);const text=fs.readFileSync(path.join(root,f.file),'utf8');originals.set(f.file,text);jsons.set(f.file,JSON.parse(text));}
 const targets=new Set();
 for(const c of plan.changes){
  if(!allowed.has(c.file)||!jsons.has(c.file))throw Error('OUTSIDE_WHITELIST '+c.id);
  const key=c.file+'\0'+(c.kind==='set-record'?c.slug+'/'+c.field:c.oldKey);if(targets.has(key))throw Error('DUPLICATE_TARGET');targets.add(key);
  if(typeof c.new!=='string'||!c.new.trim())throw Error('EMPTY_NEW_VALUE');
  const d=jsons.get(c.file);
  if(c.kind==='set-record'){
   if(!['data/admission.json','data/en/admission.json'].includes(c.file)||c.slug!=='selection'||c.field!=='content'||!Array.isArray(d))throw Error('OUTSIDE_RECORD_SCOPE');
   const records=d.filter(r=>r.slug===c.slug);if(records.length!==1||records[0][c.field]!==c.old)throw Error('OLD_EXACT_MISMATCH '+c.id);records[0][c.field]=c.new;
  }else if(c.kind==='rename-key'){
   if(c.file!=='data/ja/messages.json')throw Error('OUTSIDE_DICTIONARY_SCOPE');
   if(!Object.hasOwn(d,c.oldKey)||d[c.oldKey]!==c.old||Object.hasOwn(d,c.newKey))throw Error('KEY_EXACT_MISMATCH '+c.id);
   jsons.set(c.file,Object.fromEntries(Object.entries(d).map(([k,v])=>k===c.oldKey?[c.newKey,c.new]:[k,v])));
  }else throw Error('UNKNOWN_OPERATION '+c.kind);
 }
 for(const[file,json]of jsons)texts.set(file,JSON.stringify(json,null,2)+'\n');
 return{root,originals,texts,report:{mode:'dry-run',operations:plan.changes.length,files:[...texts.keys()],source_commit:plan.source_commit,product_files_written:0}};
}
export function applyPrepared(p){for(const[file,text]of p.originals)if(fs.readFileSync(path.join(p.root,file),'utf8')!==text)throw Error('CONCURRENT_CHANGE '+file);for(const[file,text]of p.texts)fs.writeFileSync(path.join(p.root,file),text);return{...p.report,mode:'applied',product_files_written:p.texts.size};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),i=args.indexOf('--project');if(i<0||!args[i+1]||args.some((x,j)=>x!=='--apply'&&j!==i&&j!==i+1))throw Error('Usage: node apply-safe.mjs --project <project> [--apply]');const p=prepare(args[i+1]);console.log(JSON.stringify(args.includes('--apply')?applyPrepared(p):p.report,null,2));}catch(e){console.error(e.stack??e.message);process.exitCode=1;}
}
