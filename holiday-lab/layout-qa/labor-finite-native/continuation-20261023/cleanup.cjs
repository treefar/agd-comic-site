'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),e=require('../engine-v4/engine.cjs'),{describeError}=require('./attempt.cjs');
async function closeNative(native,file){assert.equal(fs.existsSync(file),false,'one immutable cleanup attempt only');if(!native){const receipt={schema:1,attempted:false,native_created:false,closed:false,status:'not-created',error:null};e.writeJSON(file,receipt);return receipt;}
 try{await native.close();const receipt={schema:1,attempted:true,native_created:true,closed:true,status:'closed',error:null};e.writeJSON(file,receipt);return receipt;}catch(error){e.writeJSON(file,{schema:1,attempted:true,native_created:true,closed:false,status:'failed',error:describeError(error,'native-close')});throw error;}}
module.exports={closeNative};
