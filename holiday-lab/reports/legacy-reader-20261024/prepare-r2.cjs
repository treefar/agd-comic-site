const fs=require('fs'),path=require('path');let s=fs.readFileSync(path.join(__dirname,'extract.cjs'),'utf8');
const pairs=[
 ["const d=__dirname,pkg=path.join(d,'runtime/node_modules/word-extractor'),Ole=","const d=path.join(__dirname,'parsed-r2'),pkg=path.join(__dirname,'runtime/node_modules/word-extractor'),Ole="],
 ["const sha=b=>","fs.mkdirSync(d,{recursive:false});\nconst sha=b=>"],
 ["function range(pieces,start,end){return pieces.map(p=>p.text.slice(Math.max(0,start-p.startCp),Math.min(p.text.length,end-p.startCp))).filter(Boolean).join('');}","function range(pieces,start,end){return pieces.map(p=>{const a=Math.max(start,p.startCp),b=Math.min(end,p.endCp);return b>a?p.text.slice(a-p.startCp,b-p.startCp):'';}).join('');}"],
 ["extractWordDocument(doc,b){this.fib=","extractWordDocument(doc,b){this.wordStream=Buffer.from(b);this.fib="],
 ["writePieces(b,t){super.writePieces(b,t);","writePieces(b,t){this.tableStream=Buffer.from(t);super.writePieces(b,t);"],
 ["const rawAll=extractor.rawPieces.map(p=>p.text).join('');","fs.writeFileSync(path.join(d,name+'-worddocument.bin'),extractor.wordStream);fs.writeFileSync(path.join(d,name+'-table.bin'),extractor.tableStream);const rawAll=extractor.rawPieces.map(p=>p.text).join('');fs.writeFileSync(path.join(d,name+'-raw-tail.txt'),range(extractor.rawPieces,start,extractor.declaredCP.at(-1)),'utf8');"]
];for(const [a,b]of pairs){if(!s.includes(a))throw Error('Cannot find method patch target');s=s.replace(a,b);}fs.writeFileSync(path.join(__dirname,'extract-r2.cjs'),s,{flag:'wx'});console.log('Prepared a corrected independent CP-range evidence helper. Installed parser unchanged.');
