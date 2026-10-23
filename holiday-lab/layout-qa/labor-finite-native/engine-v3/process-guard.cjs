'use strict';
const assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
function inspectProcess(pid){
 if(!Number.isInteger(pid)||pid<=0)return {state:'uncertain',error:'invalid PID'};
 const command=`$ErrorActionPreference='Stop';$p=Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}';if($null -eq $p){@{state='absent'}|ConvertTo-Json -Compress}else{@{state='present';pid=[int]$p.ProcessId;creation=$p.CreationDate.ToUniversalTime().ToString('o');executable=$p.ExecutablePath;commandLine=$p.CommandLine}|ConvertTo-Json -Compress}`;
 const r=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{encoding:'utf8',windowsHide:true,timeout:20000});
 if(r.error||r.status!==0)return {state:'uncertain',error:r.error?.message||r.stderr||'CIM failed'};
 try{const p=JSON.parse(r.stdout);if(p.state==='absent')return p;if(p.state==='present'&&p.pid===pid&&typeof p.creation==='string'&&p.creation)return p;}catch{}
 return {state:'uncertain',error:'Missing/ambiguous process creation identity'};
}
function assertResume(lease,observed,explicit){
 assert.equal(explicit,true,'explicit --resume required');
 assert.ok(Number.isInteger(lease?.pid)&&lease.pid>0&&typeof lease.creation==='string'&&lease.creation,'uncertain previous process identity');
 assert.ok(observed&&['absent','present'].includes(observed.state),'uncertain process state; do not restart');
 if(observed.state==='absent')return;
 assert.equal(observed.pid,lease.pid,'uncertain observed PID');assert.ok(typeof observed.creation==='string'&&observed.creation,'uncertain creation identity');
 if(observed.creation===lease.creation)throw Error('live PID and creation still present; do not restart');
 throw Error('reused PID has different creation; termination evidence uncertain, do not restart');
}
module.exports={inspectProcess,assertResume};
