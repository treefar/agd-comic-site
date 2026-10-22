import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package-id.json'),'utf8'));
const args=process.argv.slice(2),portArg=args.find(a=>a.startsWith('--port='));
const port=portArg?Number(portArg.slice(7)):8815;
const url=`http://127.0.0.1:${port}/`;
const errorLog=path.join(root,'launch-error.log');
async function health(){try{let r=await fetch(url+'_preview-health',{signal:AbortSignal.timeout(800)});return r.ok?await r.json():null;}catch{return null;}}
function openBrowser(){if(!args.includes('--no-browser')){const p=spawn('cmd.exe',['/d','/c','start','',url],{windowsHide:true,detached:true,stdio:'ignore'});p.on('error',e=>fs.appendFileSync(errorLog,e.message+'\n'));p.unref();}}
try{
  if(Number(process.versions.node.split('.')[0])<18)throw Error('Node.js 18 or later is required. No software was downloaded.');
  if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local port');
  const occupied=await new Promise(resolve=>{const s=net.connect({host:'127.0.0.1',port});s.once('connect',()=>{s.destroy();resolve(true)});s.once('error',()=>resolve(false));});
  if(occupied){
    const current=await health();
    if(current?.packageID!==pkg.packageID)throw Error(`Port ${port} is in use by another service. Use Start-Preview.cmd --port=8823. Existing services were not stopped.`);
    fs.writeFileSync(path.join(root,'preview-server.json'),JSON.stringify({...current,url},null,2)+'\n');
    console.log('REUSED '+url+' PID='+current.pid);openBrowser();
  }else{
    const logfile=fs.openSync(path.join(root,'preview-server.log'),'a');
    const child=spawn(process.execPath,[path.join(root,'preview-server.mjs'),String(port)],{cwd:root,windowsHide:true,detached:true,stdio:['ignore',logfile,logfile]});
    let spawnError;child.on('error',e=>spawnError=e);child.unref();fs.closeSync(logfile);
    let own=null;for(let i=0;i<40;i++){own=await health();if(own?.packageID===pkg.packageID)break;if(spawnError)throw spawnError;await new Promise(r=>setTimeout(r,150));}
    if(!own||own.packageID!==pkg.packageID){if(child.pid)try{process.kill(child.pid)}catch{}throw Error('Server did not become ready. Read preview-server.log before trying again.');}
    fs.writeFileSync(path.join(root,'preview-server.json'),JSON.stringify({...own,url},null,2)+'\n');
    console.log('READY '+url+' PID='+own.pid);openBrowser();
  }
}catch(e){const msg=new Date().toISOString()+' '+e.message+'\n';fs.appendFileSync(errorLog,msg);console.error(msg+'Read launch-error.log and preview-server.log. No retry or popup was started.');process.exitCode=1;}
