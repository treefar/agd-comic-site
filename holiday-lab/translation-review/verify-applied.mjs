// Read-only post-application audit. Does not build, regenerate catalogs or modify project files.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ownDir=path.dirname(fileURLToPath(import.meta.url));
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const decode=s=>s.replaceAll('~1','/').replaceAll('~0','~');
const normalize=s=>s.replace(/\s+/g,' ').trim();
function readPointer(value,pointer){if(typeof pointer!=='string'||!pointer.startsWith('/'))throw Error('Expected a nonempty JSON pointer');for(const token of pointer.slice(1).split('/').map(decode)){if(!value||typeof value!=='object'||!Object.hasOwn(value,token))throw Error('Missing JSON pointer '+pointer);value=value[token];}return value;}
function readLocale(project,language){const variable=language==='en'?'SITE_EN_MESSAGES':'SITE_JA_MESSAGES';const source=fs.readFileSync(path.join(project,`locale-${language}.js`),'utf8');const match=source.match(new RegExp(`const ${variable}\\s*=\\s*(\\{[\\s\\S]*\\});?\\s*$`));if(!match)throw Error(`Generated ${variable} JSON declaration was not found`);return JSON.parse(match[1]);}
export function verifyApplied(project,{plan=readJson(path.join(ownDir,'apply-p1-plan.json')),decisions=readJson(path.join(ownDir,'recommendations.json'))}={}){
 const root=path.resolve(project);if(!fs.statSync(root).isDirectory())throw Error('Project is not a directory');
 const patches=plan.patches;if(!Array.isArray(patches)||patches.length!==12||new Set(patches.map(p=>p.issue)).size!==12)throw Error('Expected the reviewed twelve unique P1 patches');
 const definitions=new Map(decisions.issues.map(i=>[i.id,i]));
 const jsonCache=new Map(),localeCache=new Map(),checks=[];
 for(const p of patches){const decision=definitions.get(p.issue);if(!decision||decision.priority!=='P1'||decision.decision!=='recommend'||decision.proposed!==p.new)throw Error('Patch is not an approved P1 recommendation: '+p.issue);
  const language=p.file.match(/^data\/(en|ja)\/[a-z-]+\.json$/)?.[1];if(!language||language!==decision.lang)throw Error('Unexpected target '+p.file);
  const row={issue:p.issue,file:p.file,pointer:p.pointer,expected:p.new,data:{result:'no'},locale:{result:'no'}};
  try{if(!jsonCache.has(p.file))jsonCache.set(p.file,readJson(path.join(root,p.file)));const actual=readPointer(jsonCache.get(p.file),p.pointer);row.data={result:actual===p.new?'yes':'no',actual};}catch(e){row.data.error=e.message;}
  try{if(!localeCache.has(language))localeCache.set(language,readLocale(root,language));const actual=localeCache.get(language)[normalize(decision.zh)];row.locale={result:actual===p.new?'yes':'no',actual:actual??null};}catch(e){row.locale.error=e.message;}
  checks.push(row);
 }
 const guards=[];for(const id of ['JA-RANK-KEEP','JA-ASSOC-KEEP','JA-SELECTION-HOLD']){const d=definitions.get(id);if(!d)throw Error('Missing guard '+id);let actual,error;try{if(!localeCache.has(d.lang))localeCache.set(d.lang,readLocale(root,d.lang));actual=localeCache.get(d.lang)[normalize(d.zh)];}catch(e){error=e.message;}const expected=d.decision==='keep'?d.proposed:d.current;guards.push({issue:id,expected,actual:actual??null,result:actual===expected?'yes':'no',...(error?{error}:{})});}
 const dataYes=checks.filter(c=>c.data.result==='yes').length,localeYes=checks.filter(c=>c.locale.result==='yes').length;
 return{checked_at:new Date().toISOString(),project:root,mode:'read-only post-application verification',scope:'Twelve exact P1 JSON values, their active generated locale entries, retained ranks and undecided admission term only.',data:{yes:dataYes,no:12-dataYes,total:12},locale:{yes:localeYes,no:12-localeYes,total:12},checks,guards,pass:dataYes===12&&localeYes===12&&guards.every(g=>g.result==='yes'),semantic_full_site_verified:false,rendered_ui_verified:false,product_files_written:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2);if(args.length!==2||args[0]!=='--project'||!args[1])throw Error('Usage: node verify-applied.mjs --project <project-directory>');const report=verifyApplied(args[1]);console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;}catch(e){console.error(e.stack||e.message);process.exitCode=1;}
}
