// Exact URLs/IDs and recorded photo derivatives only. This traces references, not copyright or human authorship.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),sources=[],leaves=[];
const read=file=>{const raw=fs.readFileSync(path.join(root,file));sources.push({file,sha256:sha(raw)});return JSON.parse(raw);};
const files=fs.readdirSync(path.join(root,'data')).filter(f=>f.endsWith('.json')).map(f=>'data/'+f);
function walk(value,file,pointer,record){if(typeof value==='string')leaves.push({value,file,pointer,title:record?.title||record?.name||null});else if(Array.isArray(value))value.forEach((v,i)=>walk(v,file,pointer+'/'+i,typeof v==='object'?v:record));else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))walk(v,file,pointer+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1'),value.title||value.name?value:record);}
for(const file of files)walk(read(file),file,'',null);
const assets=read('holiday-lab/reports/overnight-20261024/root/asset-audit.json').assets,photos=read('holiday-lab/reports/faculty-portrait/source-records.json').records,videos=JSON.parse(fs.readFileSync(path.join(root,'data/videos.json')));
const rows=[];
for(const asset of assets){
 if(asset.kind==='favicon'){rows.push({...asset,status:'disabled-icon',matches:[],authorship_confirmed:false,rights_confirmed:false});continue;}
 if(asset.kind==='css'){const urls=[...(asset.value||'').matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]);rows.push({...asset,status:urls.length?'css-photo-reference':'css-color-effect',urls,matches:[],authorship_confirmed:false,rights_confirmed:false});continue;}
 const url=new URL(asset.url),local=url.hostname==='127.0.0.1',key=local?decodeURI(url.pathname.slice(1)):asset.url;
 let matches=leaves.filter(l=>l.value===key).map(({file,pointer,title})=>({file,pointer,title})),status=matches.length?'exact-data-reference':'unresolved',extra={};
 if(url.hostname==='img.youtube.com'){const id=url.pathname.match(/^\/vi\/([^/]+)\/hqdefault\.jpg$/)?.[1],index=videos.findIndex(v=>v.id===id);assert.ok(index>=0,id);assert.equal(videos.filter(v=>v.id===id).length,1);matches=[{file:'data/videos.json',pointer:'/'+index+'/id',title:videos[index].title}];status='exact-video-id-thumbnail';extra={video_id:id,method:'原有元件以此精確video id產生thumbnail網址；未讀影片製程或認定授權。'};}
 const photo=photos.find(p=>p.background.file===key);if(photo){assert.equal(sha(fs.readFileSync(path.join(root,key))),photo.background.sha256);matches=[{file:'holiday-lab/reports/faculty-portrait/source-records.json',pointer:'/records/'+photos.indexOf(photo)+'/background',title:photo.name}];status='recorded-photo-edge-crop';extra={source_url:photo.url,operation:photo.background.operation};}
 if(key==='images/posters/clipstudio-grand-prize.jpg'){status='user-confirmed-graduate-work';matches=[{file:'holiday-home.jsx',pointer:'STUDENT_HERO_WORKS[0]',title:'小颯'},{file:'data/works.json',pointer:'/0/image',title:'ClipStudio Grand Prize'}];extra={author_evidence:'使用者2026-10-23對話確認；主辦本輪公告另核相同筆名與第27屆首獎。',source_url:'https://www.clipstudio.net/tc/cspcontest27/'};}
 const row={...asset,status,matches,...extra,authorship_confirmed:status==='user-confirmed-graduate-work',rights_confirmed:false};if(local){const bytes=fs.readFileSync(path.join(root,key));row.local_sha256=sha(bytes);row.bytes=bytes.length;}rows.push(row);
}
const counts={};for(const r of rows)counts[r.status]=(counts[r.status]||0)+1;
const result={observed_utc:new Date().toISOString(),input_scope:'8875六組實際DOM引用；後續新版引用變更需另比對',rows,counts,sources,complete_production_provenance_confirmed:false,all_rights_confirmed:false,raw_art_changed:false};
fs.writeFileSync(path.join(__dirname,'asset-reference-map.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({entries:rows.length,counts,all_rights_confirmed:false,art_changed:false}));
