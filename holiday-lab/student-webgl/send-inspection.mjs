// Only queues the retained read-only inventory through the existing audited fleet mechanism.
import fs from 'node:fs';import os from 'node:os';import {execFileSync} from 'node:child_process';
const prior=new URL('./queued-inspection.json',import.meta.url);
if(fs.existsSync(prior)){const q=JSON.parse(fs.readFileSync(prior));console.log(`EXISTING ${q.jobId}; no duplicate was queued.`);process.exit(0);}
const file=new URL('./inspect-tf-base.ps1',import.meta.url),source=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'');
const encoded=Buffer.from(source,'utf16le').toString('base64');
const command=`powershell -NoProfile -EncodedCommand ${encoded}`;
const output=execFileSync('powershell',['-NoProfile','-ExecutionPolicy','Bypass','-File','C:/AIHome/claude/scripts/fleet-job.ps1','-Send','-To','TF-BASE','-Command',command,'-TimeoutSec','180'],{encoding:'utf8',maxBuffer:1024*1024,env:{...process.env,COMPUTERNAME:os.hostname()}});
const jobId=output.match(/\d{8}-\d{6}-tf-go-\d+/)?.[0];
if(!jobId)throw Error('No confirmed fleet job id was returned.');
fs.writeFileSync(new URL('./queued-inspection.json',import.meta.url),JSON.stringify({jobId,target:'TF-BASE',queued_at:new Date().toISOString(),state:'queued-not-executed',payload:'inspect-tf-base.ps1',mechanism:'existing C:/AIHome/claude/scripts/fleet-job.ps1',timeoutSec:180},null,2));console.log(`QUEUED ${jobId}; this is not a remote execution result.`);
