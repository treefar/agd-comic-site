// Source candidates are not assertions that every string is currently rendered.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const targets=[];for(const dir of ['data','data/en','data/ja'])for(const f of fs.readdirSync(path.join(root,dir),{withFileTypes:true}))if(f.isFile()&&f.name.endsWith('.json'))targets.push(dir+'/'+f.name);targets.push('data/students/guide.json');
const rows=[],inputs=[];
function walk(x,file,pointer){if(typeof x==='string'&&x.trim()&&!/^https?:\/\//.test(x))rows.push({file,pointer,text:x});else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x))walk(v,file,pointer+'/'+k.replaceAll('~','~0').replaceAll('/','~1'));}
for(const file of targets){const b=fs.readFileSync(path.join(root,file));inputs.push({file,sha256:sha(b)});walk(JSON.parse(b),file,'');}
const result={scope:'JSON string values in main website data, en/ja catalogs and student guide only. Excludes all holiday game folders and game runtimes. Some technical strings and unrendered values remain candidates, not actual UI observations.',inputs,rows};
fs.writeFileSync(path.join(__dirname,'source-corpus.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({files:inputs.length,candidate_strings:rows.length}));
