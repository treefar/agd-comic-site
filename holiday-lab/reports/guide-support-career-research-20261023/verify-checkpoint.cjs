// 僅核對研究保全；不宣稱內容或獨立驗收完成。
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = __dirname;
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const expected = {
  'raw/school-regulations.pdf':'f3fcd3910013156848f962489c2b84d81bd1b4dd0c813a164335e222ec2306c8',
  'raw/degree-leaving.pdf':'48f0d65bbbe761fcaaae23e2706bdd316a3e0d3a0e5624fe9f3d2682156c8ce7'
};
const checks = [];
for(const [file,sha] of Object.entries(expected)) checks.push({name:file,yes:hash(file)===sha,sha256:hash(file)});
for(const [file,count] of [['raw/school-regulations-pages.json',16],['raw/degree-leaving-pages.json',2]]) {
  const pages=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
  checks.push({name:file,yes:pages.length===count&&pages.every((p,i)=>p.pdf_page===i+1&&p.text.trim()),pages:pages.length});
}
const chain=JSON.parse(fs.readFileSync(path.join(root,'official-entry-chain.json'),'utf8'));
checks.push({name:'official links',yes:chain.links.length===6&&new Set(chain.links.map(x=>x.url)).size===6,count:chain.links.length});
const pngs=['pages/school-regulations-p4.png','pages/school-regulations-p10.png','pages/degree-leaving-p1.png','pages/degree-leaving-p2.png'];
for(const file of pngs) checks.push({name:file,yes:fs.readFileSync(path.join(root,file)).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),sha256:hash(file)});
const manifest=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else{const rel=path.relative(root,f).split(path.sep).join('/');if(!['verification.json','stdout.txt'].includes(rel))manifest.push({file:rel,bytes:fs.statSync(f).size,sha256:hash(rel)});}}}
walk(root);
const out={recorded_at:new Date().toISOString(),scope:'checkpoint-file-integrity-only',content_review_complete:false,checks,manifest};
fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(out,null,2)+'\n');
const lines=checks.map(x=>`${x.yes?'YES':'NO'} ${x.name}${x.sha256?' SHA256 '+x.sha256:''}${x.pages?' PAGES '+x.pages:''}${x.count?' COUNT '+x.count:''}`);
lines.push(`${checks.filter(x=>x.yes).length}/${checks.length} checkpoint checks; four-topic draft NOT COMPLETE`);
fs.writeFileSync(path.join(root,'stdout.txt'),lines.join('\n')+'\n');
console.log(lines.join('\n'));
process.exitCode=checks.every(x=>x.yes)?0:1;
