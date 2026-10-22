const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const rules={teachers:[['Thank you for always watching with patience.','Thanks for always watching patiently.']], 'national-day':[['Reset this composition','Reset composition']], 'peace-memory':[['Listen to the whole message','Listen in full']],labor:[['Preview relay (10× time)','Preview relay (10×)'],['受け渡しを早送り（10倍）','リレー再生（10倍速）'],['Save the animation relay','Save relay']],semester:[]};
for(const [game,pairs] of Object.entries(rules)){
 const file=`holiday-lab/games/${game}.mjs`;let expected=execFileSync('git',['show',`d48f5d9a479db1449d932b815a6cff4d0a827f76:${file}`],{encoding:'utf8'}).replaceAll('\r\n','\n');
 for(const[a,b]of pairs){assert.equal(expected.split(a).length,2);expected=expected.replace(a,b);}
 assert.equal(fs.readFileSync(file,'utf8').replaceAll('\r\n','\n'),expected);console.log(`YES ${game}: ${pairs.length?'only approved label copy':'unchanged'}; IDs, rules, score and spacing unchanged`);
}
