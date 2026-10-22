import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const site=path.join(root,'site');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package-id.json'),'utf8'));
const port=Number(process.argv[2]||8815);
if(!Number.isInteger(port)||port<1024||port>65535) throw Error('Invalid local port');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ogg':'audio/ogg','.wav':'audio/wav','.mp3':'audio/mpeg','.mp4':'video/mp4','.webm':'video/webm','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf'};
const server=http.createServer((req,res)=>{
  let rel;try{rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(rel==='/_preview-health') {res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({packageID:pkg.packageID,pid:process.pid,port}));return;}
  let file=path.resolve(site,'.'+rel);
  if(file!==site&&!file.startsWith(site+path.sep)){res.writeHead(403).end();return;}
  try{
    if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    const stream=fs.createReadStream(file);stream.on('error',e=>{console.error(e.message);res.destroy();});stream.pipe(res);
  }catch{res.writeHead(404).end();}
});
server.on('error',e=>{console.error(new Date().toISOString()+' '+e.stack);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(new Date().toISOString()+` READY http://127.0.0.1:${port}/ package=${pkg.packageID} PID=${process.pid}`));
