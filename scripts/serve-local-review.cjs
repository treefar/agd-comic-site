// Local-only review: serve the site and progress page from two explicit roots.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ogg':'audio/ogg'};
function createServer({site,dashboard}){
 site=path.resolve(site);dashboard=path.resolve(dashboard);
 return http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(pathname==='/progress'){res.writeHead(302,{Location:'/progress/'}).end();return;}
  let root=site,relative=pathname;
  if(pathname.startsWith('/progress/')){root=dashboard;relative=pathname.slice('/progress'.length);}
  // The review website deliberately has no icon: do not reuse the generated game icon.
  if(pathname==='/favicon.ico'){res.writeHead(204,{'Cache-Control':'no-store'}).end();return;}
  let file=path.resolve(root,'.'+relative);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);
 });
}
if(require.main===module){
 const args=Object.fromEntries(process.argv.slice(2).map(x=>x.split(/=(.*)/s).slice(0,2)));
 if(!args['--site']||!args['--dashboard'])throw Error('Use --site=<site> --dashboard=<dashboard> --port=<local-port>');
 const port=Number(args['--port']||8856);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid port');
 createServer({site:args['--site'],dashboard:args['--dashboard']}).listen(port,'127.0.0.1',()=>console.log(`Local site: http://127.0.0.1:${port}/ ; Progress: http://127.0.0.1:${port}/progress/`));
}
module.exports={createServer};
