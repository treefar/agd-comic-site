// Compare only font/text dependencies. Photo background CSS may differ intentionally.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=process.argv[2];assert.ok(root,'Usage: node compare-build.cjs <next-build-directory>');
const a=JSON.parse(fs.readFileSync(path.join(__dirname,'audit.json'),'utf8'));let failed=0;
for(const [file,receipt]of Object.entries(a.receipts)){const p=path.resolve(root,file),actual=fs.existsSync(p)?crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'):null,same=actual===receipt.sha256;if(file==='faculty-portrait.css'){console.log((same?'SAME ':'ALLOWED_PHOTO_CSS_DELTA ')+file);continue;}console.log((same?'YES ':'NO ')+file+' '+(actual||'MISSING'));if(!same)failed++;}
console.log('FONT_TEXT_RECEIPT_MISMATCHES '+failed+'; does not replace a full next-build visual check');process.exitCode=failed?1:0;
