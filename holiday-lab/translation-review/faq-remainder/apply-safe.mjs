// Read-only by default; only root may choose to apply an approved proposal.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const allowed=new Set(['data/en/student-guide-ui.json','data/ja/messages.json']);
export const defaultPlan=JSON.parse(fs.readFileSync(path.join(dir,'exact-plan.json'),'utf8'));
export function prepare(project,plan=defaultPlan){
  const root=path.resolve(project),originals=new Map(),texts=new Map(),jsons=new Map();
  for(const f of plan.files){
    if(!allowed.has(f.file)||originals.has(f.file))throw Error('OUTSIDE_OR_DUPLICATE_FILE '+f.file);
    const text=fs.readFileSync(path.join(root,f.file),'utf8');originals.set(f.file,text);jsons.set(f.file,JSON.parse(text));
  }
  const seen=new Set();
  for(const c of plan.changes){
    if(!allowed.has(c.file)||!jsons.has(c.file)||c.kind!=='set-json')throw Error('OUTSIDE_WHITELIST '+c.id);
    const identity=c.file+'\0'+c.key;if(seen.has(identity))throw Error('DUPLICATE_TARGET '+c.id);seen.add(identity);
    const data=jsons.get(c.file);
    if(!Object.hasOwn(data,c.key)||data[c.key]!==c.old)throw Error('OLD_EXACT_MISMATCH '+c.id);
    if(typeof c.new!=='string'||!c.new.trim())throw Error('INVALID_NEW_STRING '+c.id);
    data[c.key]=c.new;
  }
  for(const[file,json]of jsons){const text=JSON.stringify(json,null,2)+'\n';if(!text.trim())throw Error('EMPTY_SERIALIZATION');texts.set(file,text);}
  return{root,originals,texts,report:{mode:'dry-run',source_commit:plan.source_commit,operations:plan.changes.length,files:[...texts.keys()],product_files_written:0}};
}
export function applyPrepared(p){
  for(const[file,old]of p.originals)if(fs.readFileSync(path.join(p.root,file),'utf8')!==old)throw Error('CONCURRENT_CHANGE '+file);
  for(const[file,text]of p.texts)fs.writeFileSync(path.join(p.root,file),text);
  return{...p.report,mode:'applied',product_files_written:p.texts.size};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const args=process.argv.slice(2),i=args.indexOf('--project');if(i<0||!args[i+1]||args.some((x,j)=>x!=='--apply'&&j!==i&&j!==i+1))throw Error('Usage: node apply-safe.mjs --project <project> [--apply]');const p=prepare(args[i+1]);console.log(JSON.stringify(args.includes('--apply')?applyPrepared(p):p.report,null,2));}catch(e){console.error(e.stack??e.message);process.exitCode=1;}
}
