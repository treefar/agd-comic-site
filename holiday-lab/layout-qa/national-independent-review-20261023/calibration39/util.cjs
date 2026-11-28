'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname,lab=path.resolve(dir,'../../..'),qa=path.resolve(dir,'../..'),digest=x=>crypto.createHash('sha256').update(Buffer.isBuffer(x)?x:typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f)),proof=f=>{const b=fs.readFileSync(f);return{sha256:digest(b),bytes:b.length};},walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>{assert.ok(!d.isSymbolicLink(),'symlink unsupported');return d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)];}).sort();
function bytes(file,b){const fd=fs.openSync(file,'wx');try{let at=0;while(at<b.length)at+=fs.writeSync(fd,b,at,b.length-at);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
const write=(f,v)=>bytes(f,Buffer.from(JSON.stringify(v,null,2))),ref=(run,f)=>({file:path.relative(run,f).split(path.sep).join('/'),...proof(f)});
function checked(run,r){assert.ok(r&&typeof r.file==='string'&&!path.isAbsolute(r.file)&&!r.file.split(/[\\/]/u).includes('..'),'unsafe reference');const file=path.resolve(run,r.file);assert.ok(file.startsWith(path.resolve(run)+path.sep));assert.deepEqual(proof(file),{sha256:r.sha256,bytes:r.bytes},'SHA/size mismatch '+r.file);return file;}
module.exports={dir,lab,qa,digest,read,proof,walk,bytes,write,ref,checked};
