// Read-only checks for a fresh local build; does not relax the game UI release gate.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const head=html=>(html.match(/<head>([\s\S]*?)<\/head>/i)||[])[1]||'';
const seo=html=>(head(html).match(/<title>[\s\S]*?<\/title>|<meta (name="(description|keywords|author|twitter:[a-z:]+)"|property="og:[a-z:]+")[^>]*>|<link rel="canonical"[^>]*>/g)||[]).join('\n');
function inspect(source,html){
 const required=['hero','news','about','works','faculty','labs','join','contact'];
 return [
  {id:'static-chapters',pass:required.every(id=>html.includes(`id="${id}"`))},
  {id:'seo-preserved',pass:seo(source).length>100&&seo(source)===seo(html)},
  {id:'no-browser-compiler',pass:!(/text\/babel|unpkg\.com|babel(?:\.min)?\.js/.test(html))},
  {id:'compiled-bundle-reference',pass:/<script src="app-[A-Z0-9]+\.js"><\/script>/.test(html)},
  {id:'viewport-preserved',pass:head(html).includes('name="viewport"')&&head(html).includes('width=device-width')},
  {id:'favicon-preserved',pass:head(html).includes('href="images/site-icon.png"')}
 ];
}
function check(root,build){
 const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),html=fs.readFileSync(path.join(build,'index.html'),'utf8');
 const checks=inspect(source,html),bundle=(html.match(/<script src="(app-[A-Z0-9]+\.js)"><\/script>/)||[])[1];
 checks.push({id:'compiled-bundle-exists',pass:!!bundle&&fs.existsSync(path.join(build,bundle))});
 const css=[...html.matchAll(/<link rel="stylesheet" href="([^"?#]+)(?:[^\"]*)"/g)].map(m=>m[1]);
 checks.push({id:'local-stylesheets-exist',pass:css.length>=4&&css.every(p=>!/^https?:|^\/\//.test(p)&&fs.existsSync(path.join(build,p)))});
 return {schema:1,build:path.resolve(build),pass:checks.every(c=>c.pass),checks,html_sha256:sha(Buffer.from(html)),bundle:bundle?{file:bundle,sha256:sha(fs.readFileSync(path.join(build,bundle)))}:null,scope:'static website chapters, metadata and build dependencies only',full_release_approved:false};
}
module.exports={inspect,check};
if(require.main===module){const r=check(process.cwd(),process.argv[2]);console.log(JSON.stringify(r,null,2));process.exitCode=r.pass?0:1;}
