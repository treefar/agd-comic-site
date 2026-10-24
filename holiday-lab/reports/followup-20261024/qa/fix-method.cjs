const fs=require('fs'),path=require('path');
const dir=__dirname;
fs.copyFileSync(path.join(dir,'check.cjs'),path.join(dir,'check-v1.cjs.txt'));
fs.copyFileSync(path.join(dir,'command.json'),path.join(dir,'command-v1.json'));
const text=fs.readFileSync(path.join(dir,'check.cjs'),'utf8');
if(!text.includes("document.getElementById('admission')"))throw Error('expected method preimage missing');
fs.writeFileSync(path.join(dir,'check.cjs'),text.replace("document.getElementById('admission')","document.getElementById('join')"));
console.log('Method-only correction: actual admissions section id is join. No product writes.');
