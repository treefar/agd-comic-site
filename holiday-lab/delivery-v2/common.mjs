import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function list(root, prefix='') {
  return fs.readdirSync(path.join(root,prefix), {withFileTypes:true}).flatMap(e=>{
    if(e.isSymbolicLink()) throw Error('Symbolic links are not permitted in runtime: '+prefix+e.name);
    return e.isDirectory()?list(root,prefix+e.name+'/'):[prefix+e.name];
  }).sort();
}
export function args(argv=process.argv.slice(2)) {
  const out={};
  for(let i=0;i<argv.length;i++) {
    const a=argv[i]; if(!a.startsWith('--')) throw Error('Expected --option: '+a);
    const [key,...tail]=a.slice(2).split('=');
    if(tail.length) out[key]=tail.join('=');
    else if(argv[i+1]&&!argv[i+1].startsWith('--')) out[key]=argv[++i];
    else out[key]=true;
  }
  return out;
}
export const psquote = s => "'"+String(s).replaceAll("'","''")+"'";
export function writeJSON(file,value) { const text=JSON.stringify(value,null,2);if(!text?.trim()) throw Error('Empty JSON refused');fs.writeFileSync(file,text+'\n'); }
export function verifyTree(root, manifest) {
  const expected=[...manifest.files.map(f=>f.path),'SHA256SUMS.json'].sort();
  const actual=list(root);
  if(JSON.stringify(actual)!==JSON.stringify(expected)) throw Error('Unexpected or missing files in extracted package');
  for(const f of manifest.files) {
    if(f.path.startsWith('/')||f.path.includes('..')||f.path.includes('\\')) throw Error('Unsafe manifest path');
    const file=path.join(root,f.path);
    if(fs.statSync(file).size!==f.bytes||sha(file)!==f.sha256) throw Error('SHA256 mismatch: '+f.path);
  }
  return expected.length;
}
