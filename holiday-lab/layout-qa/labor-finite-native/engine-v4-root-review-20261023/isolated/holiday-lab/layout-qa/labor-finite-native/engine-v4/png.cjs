'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createRequire}=require('node:module');
const req=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')),pkg=req.resolve('pngjs/package.json'),root=path.dirname(pkg),{PNG}=req('pngjs'),CRC=require(path.join(root,'lib/crc.js'));
function validatePNG(bytes,width,height){
 assert.ok(Buffer.isBuffer(bytes)&&bytes.length>=45,'complete PNG content required');assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature');let at=8,index=0,idat=0,iend=false;
 while(at<bytes.length){assert.ok(at+12<=bytes.length,'truncated PNG chunk header/CRC');const length=bytes.readUInt32BE(at),end=at+12+length;assert.ok(end<=bytes.length,'truncated PNG chunk data');const type=bytes.toString('ascii',at+4,at+8);assert.match(type,/^[A-Za-z]{4}$/u,'PNG chunk type');assert.equal(CRC.crc32(bytes.subarray(at+4,at+8+length))>>>0,bytes.readUInt32BE(at+8+length),'PNG chunk CRC mismatch');
  if(index===0){assert.equal(type,'IHDR','IHDR must be first');assert.equal(length,13,'complete IHDR');assert.equal(bytes.readUInt32BE(at+8),width,'PNG viewport width');assert.equal(bytes.readUInt32BE(at+12),height,'PNG viewport height');}else assert.notEqual(type,'IHDR','duplicate IHDR');
  if(type==='IDAT'){assert.ok(!iend,'IDAT after IEND');idat++;}if(type==='IEND'){assert.equal(length,0);assert.equal(end,bytes.length,'PNG trailing data after IEND');iend=true;}at=end;index++;
 }
 assert.ok(iend&&idat>0,'PNG must contain IDAT and IEND');const decoded=PNG.sync.read(bytes,{checkCRC:true});assert.equal(decoded.width,width);assert.equal(decoded.height,height);assert.equal(decoded.data.length,width*height*4,'complete decoded pixel content');return {width:decoded.width,height:decoded.height,decoded_bytes:decoded.data.length,chunks:index};
}
function decoderFiles(){return [pkg,...fs.readdirSync(path.join(root,'lib')).filter(f=>f.endsWith('.js')).map(f=>path.join(root,'lib',f))].sort();}
module.exports={validatePNG,decoderFiles};
