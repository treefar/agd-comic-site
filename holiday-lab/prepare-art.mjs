// Technical cropping and chroma removal only. All artwork comes from retained Codex atlases.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {games} from './catalog.mjs';
const deps=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const sharp=deps('sharp');
const source='holiday-lab/art-source',dest='holiday-lab/assets',records=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
const names=['actor1','actor2','actor3','prop1','prop2','prop3','target','token1','token2','token3'];
const uiNames=['normal','hover','pressed','disabled','panel','hud','bubble','header','play','pause','sound','mute','left','right','close','replay'];
async function keyed(buffer){const {data,info}=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});let minX=info.width,minY=info.height,maxX=-1,maxY=-1;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const j=(y*info.width+x)*4,r=data[j],g=data[j+1],b=data[j+2];if(r>150&&b>140&&g<Math.min(r,b)*.65)data[j+3]=0;if(data[j+3]>8){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}}if(maxX<0)throw Error('Empty keyed image');return sharp(data,{raw:info}).extract({left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}).png().toBuffer();}
for(const id of ['ui',...games.map(g=>g.id)]){
 const sourceId=id==='ui'&&fs.existsSync(`${source}/ui-v2.png`)?'ui-v2':id;
 const input=`${source}/${sourceId}.png`;if(!fs.existsSync(input))continue;
 const receiptFile=`${source}/${sourceId}.receipt.json`;
 const log=fs.existsSync(`${source}/${sourceId}.log`)?fs.readFileSync(`${source}/${sourceId}.log`,'utf8'):fs.readFileSync(receiptFile,'utf8');const line=log.split(/\r?\n/).findLast(x=>x.startsWith('{"ok":true'));
 if(!line)throw Error(`Missing generation receipt: ${id}`);const receipt=JSON.parse(line);
 fs.writeFileSync(receiptFile,JSON.stringify(receipt));
 const buffer=fs.readFileSync(input),meta=await sharp(buffer).metadata(),folder=`${dest}/${id}`;fs.mkdirSync(folder,{recursive:true});
 for(let i=0;i<16;i++){
  const left=Math.floor((i%4)*meta.width/4),top=Math.floor(Math.floor(i/4)*meta.height/4),width=Math.floor((i%4+1)*meta.width/4)-left,height=Math.floor((Math.floor(i/4)+1)*meta.height/4)-top;
  const inset=(id==='ui'||i>=6)?4:0;
  let crop=sharp(buffer).extract({left:left+inset,top:top+inset,width:width-inset*2,height:height-inset*2});let name,ext;
  if(id!=='ui'&&i<6){name=i<5?`cg-${i+1}`:'scene';ext='webp';await crop.webp({quality:87}).toFile(`${folder}/${name}.${ext}`);}
  else{name=id==='ui'?uiNames[i]:names[i-6];ext='png';fs.writeFileSync(`${folder}/${name}.${ext}`,await keyed(await crop.png().toBuffer()));
  }
  const p=`${folder}/${name}.${ext}`;records.push({id:`${id}-${name}`,path:p,sha256:sha(fs.readFileSync(p)),prompt_file:`${source}/${sourceId}.prompt.txt`,generator:{producer:'codex',entry:'codex-image',generated_at:new Date(fs.statSync(input).mtime).toISOString()},source:{atlas:input,sha256:sha(buffer),cell:i,session_id:receipt.sessionId,recoveredFrom:receipt.recoveredFrom},postprocess:ext==='webp'?'equal-cell crop; WebP quality 87':'equal-cell crop; magenta chroma removal; exact alpha bounding box'});
 }
 console.log(`${id}: 16 cropped assets; receipt ${receipt.sessionId}`);
}
// Crop an actual generated blank paper area for tiling; no computed fill is painted.
const panel=`${dest}/ui/panel.png`,pm=await sharp(panel).metadata(),paper=`${dest}/ui/paper.png`;await sharp(panel).extract({left:Math.floor(pm.width*.35),top:Math.floor(pm.height*.35),width:Math.floor(pm.width*.3),height:Math.floor(pm.height*.3)}).png().toFile(paper);records.push({...records.find(r=>r.id==='ui-panel'),id:'ui-paper',path:paper,sha256:sha(fs.readFileSync(paper)),postprocess:'center 30 percent crop of generated panel for paper tiling'});
const rig=`${source}/nian-rig.png`;if(fs.existsSync(rig)){const png=await keyed(fs.readFileSync(rig)),log=fs.readFileSync(`${source}/nian-rig.log`,'utf8'),receipt=JSON.parse(log.split(/\r?\n/).findLast(x=>x.startsWith('{"ok":true')));for(let n=1;n<=3;n++){const rec=records.find(r=>r.id===`lunar-new-year-actor${n}`);fs.writeFileSync(rec.path,png);Object.assign(rec,{sha256:sha(png),prompt_file:`${source}/nian-rig.prompt.txt`,source:{atlas:rig,sha256:sha(fs.readFileSync(rig)),session_id:receipt.sessionId,recoveredFrom:receipt.recoveredFrom},postprocess:'magenta chroma removal; exact alpha bounding box; same blank-face puppet rig across three acts'});}}
fs.writeFileSync('ui-art-manifest.json',JSON.stringify({schema_version:1,theme:'台灣青春漫畫創作工房；黑墨、奶油紙、網點、朱紅、芥黃、青綠；候選未經使用者確認',ui_targets:['holiday-home.jsx','holiday-home.css','holiday-lab/index.html','holiday-lab/lab.css','holiday-lab/runner.mjs',...games.filter(g=>fs.existsSync(`holiday-lab/games/${g.id}.mjs`)).map(g=>`holiday-lab/games/${g.id}.mjs`)],assets:records,screens:['archive','intro','menu','help','settings','game','pause','result','replay'].map(id=>({id,asset_ids:records.map(r=>r.id)})),user_approval:'pending'},null,2));
console.log(`Registered ${records.length} assets. Candidate artwork; user approval pending.`);
