// QA-only additions; this never writes product files.
const fs=require('node:fs'),path=require('node:path'),p=path.join(__dirname,'check.cjs');let s=fs.readFileSync(p,'utf8');
const pairs=[
 ['images,backgrounds,favicons:',"images,backgrounds,iframes:[...document.querySelectorAll('iframe')].map(e=>e.src),favicons:"],
 ['eyeError:a?r.y+a.eyeY*sy-f.y-f.height*.5:null,headError:','eyeY:a?r.y+a.eyeY*sy:null,headHeight:a?(a.chin-a.crown)*sy:null,eyeError:a?r.y+a.eyeY*sy-f.y-f.height*.5:null,headError:'],
 ["check('13 source-matched eye/head projections',","check('head height spread below 0.75px',Math.max(...row.portraits.map(x=>x.headHeight))-Math.min(...row.portraits.map(x=>x.headHeight))<.75);\n check('13 source-matched eye/head projections',"],
 ["check('no page exceptions',row.pageErrors.length===0,row.pageErrors);","check('no page exceptions',row.pageErrors.length===0,row.pageErrors);check('no bad HTTP responses',row.httpErrors.length===0,row.httpErrors);"]
];for(const [a,b]of pairs){if(!s.includes(a))throw Error('Expected QA text absent');s=s.replace(a,b);}fs.writeFileSync(p,s);console.log('QA collector enhanced; no product write');
