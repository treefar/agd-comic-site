// Verify recorded evidence. Run audit.cjs and cmap.py again to refresh browser evidence.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname,latest=JSON.parse(fs.readFileSync(path.join(root,'latest.json'),'utf8'));
const a=JSON.parse(fs.readFileSync(path.join(root,latest.run,'audit.json'),'utf8'));
const c=JSON.parse(fs.readFileSync(path.join(root,'cmap.json'),'utf8'));
let count=0;function yes(label,condition){assert.ok(condition,label);console.log('YES '+label);count++;}
yes('three language snapshots',a.pages.map(p=>p.lang).join(',')==='zh,en,ja');
yes('zero failed production requests',a.pages.every(p=>p.errors.length===0));
yes('font response evidence exists and SHA-256 matches',a.files.every(f=>{const p=path.join(root,f.path);return fs.existsSync(p)&&require('crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')===f.sha256}));
yes('fontTools parsed all downloaded fonts',c.errors.length===0);
for(const name of ['Bangers','Bowlby One'])yes(name+' has missing CJK sample glyphs',c.families.find(f=>f.family===name).missing_sample.zh.some(x=>x.char==='鄧'));
yes('actual zh headline uses Microsoft JhengHei UI fallback',a.pages[0].nodes.some(n=>n.text.startsWith('畫出來')&&n.platform.some(f=>f.familyName==='Microsoft JhengHei UI'&&!f.isCustomFont)));
yes('Reggae One covers tested zh sample',c.families.find(f=>f.family==='Reggae One').missing_sample.zh.length===0);
yes('ToneOZ owned font covers all three bounded samples',Object.values(c.candidates.find(f=>f.family==='ToneOZ-Tsuipita-TC').missing_by_language).every(m=>m.length===0));
yes('Noto TC downloaded subsets require JP fallback for 徳/録',c.families.find(f=>f.family.startsWith('Noto Sans TC')).missing_sample.ja.some(m=>m.char==='徳'));
console.log('RESULT '+count+' YES / 0 NO');
console.log('NOT VERIFIED: all site routes, all Unicode, user-reported exact missing character, mobile visual acceptance.');
