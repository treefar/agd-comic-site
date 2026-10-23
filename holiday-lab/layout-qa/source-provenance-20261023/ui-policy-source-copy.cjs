#!/usr/bin/env node
// UI source/procedural-skin checks. Does not render or judge artwork.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const CODE=/\.(?:cs|gd|py|js|ts|jsx|tsx|mjs|cjs|html|css|scss|uss|uxml|cpp|h|svg)$/i;
function analyzeUiCode(file,content){
 if(!CODE.test(file))return [];
 if(/(?:^|[\\/])(?:tests?|fixtures)[\\/]|\.(?:test|spec)\.[cm]?[jt]sx?$/i.test(file))return [];
 if(/(?:^|[\\/])Editor[\\/]/i.test(file)||/^\s*extends\s+EditorPlugin\b/m.test(content))return [];
 const s=String(content),ui=/ui|hud|menu|interface|overlay|panel|dialog|screen|slicedraw/i.test(path.basename(file))||/using\s+UnityEngine\.(?:UI|UIElements)\b|extends\s+Control|class\s+\w+\s*:\s*(?:Control|UserControl)|function\s+\w*(?:Menu|Hud|Panel)/.test(s);
 const hits=[];
 const add=(name,re,scope=true)=>{if(scope&&re.test(s))hits.push(name);};
 add('Unity 預設 GUI 皮膚',/\b(?:GUI|GUILayout)\.(?:Box|Window)\s*\(/);
 // Invisible hit regions are bindings, not artwork.
 add('Unity 預設按鈕皮膚',/\b(?:GUI|GUILayout)\.Button\s*\((?:(?!GUIStyle\.none)[^;]){0,600}\)\s*[;{]/);
 add('程序 UI 面板／進度條',/\bSliceDraw\.(?:Panel|Bar|Button)\s*\(/);
 add('白色貼圖塗色充當 UI',/Texture2D\.whiteTexture|new\s+Texture2D\s*\(|\.SetPixels?\s*\(/,ui);
 add('Godot 程序 UI 皮膚',/\bStyleBoxFlat\b|\b(?:draw_rect|draw_circle|draw_polygon|DrawRect|DrawCircle|DrawPolygon)\s*\(/,ui);
 add('Unreal 程序 UI Brush',/\bFSlate(?:ColorBrush|RoundedBoxBrush)\b/,ui);
 add('UI Toolkit 程序皮膚',/\.style\.(?:backgroundColor|border\w*Color|border\w*Radius)\s*=/,ui);
 const bindsImages=/\.sprite\s*=|\.texture\s*=|\.backgroundImage\s*=|\bGeneratedUi\b|\.styleSheets\.Add\s*\(/.test(s);
 add('Unity UI 控制項未繫結生成皮膚',/AddComponent\s*<\s*(?:Image|RawImage|Button|Slider)\s*>\s*\(|\bnew\s+Button\s*\(/,ui&&!bindsImages);
 add('SVG UI',/<svg(?:\s|>)|createElementNS\s*\([^;]*svg/i,ui||/\.svg$/i.test(file));
 add('Canvas 程序 UI',/getContext\s*\(\s*['"]2d['"]|\.(?:fillRect|strokeRect|fillText|roundRect)\s*\(/,ui);
 add('Pillow／OpenCV 程序 UI',/\bImageDraw\b|\bdraw\.(?:rectangle|rounded_rectangle|ellipse|polygon|line|text)\s*\(|\bcv2\.(?:rectangle|circle|line|putText|fillPoly)\s*\(/,ui);
 add('CSS 繪製介面皮膚',/(?:box-shadow|backdrop-filter)\s*:|(?:linear|radial)-gradient\s*\(|border-radius\s*:\s*(?!0(?:px)?\s*[;}])[^;}]+/i,ui);
 return [...new Set(hits)];
}
function inside(root,p){const full=path.resolve(root,p),rel=path.relative(root,full);if(path.isAbsolute(p)||rel==='..'||rel.startsWith('..'+path.sep))throw Error('路徑必須位於專案內：'+p);return full;}
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function inspectProject(project){
 const root=path.resolve(project),errors=[],manifest=path.join(root,'ui-art-manifest.json');
 let m;try{m=JSON.parse(fs.readFileSync(manifest,'utf8'));}catch{return {pass:false,project:root,errors:['缺少或無法讀取 ui-art-manifest.json；灰盒亦須有 Codex UI 素材。']};}
 if(!m||typeof m!=='object'||Array.isArray(m))return {pass:false,project:root,errors:['Manifest 必須為 JSON 物件']};
 if(m.schema_version!==1)errors.push('schema_version 必須是 1');
 if(typeof m.theme!=='string'||!m.theme.trim())errors.push('缺少實際 theme');
 if(!Array.isArray(m.ui_targets)||!m.ui_targets.length)errors.push('ui_targets 不可省略或空白');
 const assets=Array.isArray(m.assets)?m.assets:[],ids=new Set();
 if(!assets.length)errors.push('沒有 UI 素材');
 for(const a of assets){try{
   if(!a||typeof a!=='object'||!a.id||ids.has(a.id))throw Error('素材 id 缺漏或重複');ids.add(a.id);
   if(!a.generator||a.generator.producer!=='codex'||!['image_gen','codex-image'].includes(a.generator.entry))throw Error('UI 僅限 Codex 生圖來源');
   if(!a.generator.generated_at||!Number.isFinite(Date.parse(a.generator.generated_at)))throw Error('缺少生成日期');
   if(!/\.(png|jpe?g|webp)$/i.test(a.path||''))throw Error('UI 素材須為生成的點陣圖片');
   const file=inside(root,a.path);if(!fs.existsSync(file)||hash(file)!==a.sha256)throw Error('素材缺失或 SHA-256 不符');
   const prompt=inside(root,a.prompt_file||'');if(!fs.statSync(prompt).isFile()||!fs.readFileSync(prompt,'utf8').trim())throw Error('缺少生成提示詞');
 }catch(e){errors.push((a?.id||'asset')+'：'+e.message);}}
 const screens=Array.isArray(m.screens)?m.screens:[];
 if(!screens.length)errors.push('screens 不可空白');
 for(const s of screens)if(!s?.id||!Array.isArray(s.asset_ids)||!s.asset_ids.length||s.asset_ids.some(id=>!ids.has(id)))errors.push('畫面素材引用無效：'+(s?.id||'unknown'));
 for(const target of Array.isArray(m.ui_targets)?m.ui_targets:[]){try{const f=inside(root,target),text=fs.readFileSync(f,'utf8');for(const hit of analyzeUiCode(f,text))errors.push(target+'：'+hit);}catch(e){errors.push(String(target)+'：'+e.message);}}
 return {pass:errors.length===0,project:root,assets:assets.length,screens:screens.length,errors};
}
function extractWrites(input){
 const ti=input.tool_input||input.arguments||{},out=[];
 const p=ti.file_path||ti.path;
 if(p&&typeof (ti.content??ti.new_string)==='string')out.push({file:p,content:ti.content??ti.new_string});
 let patch=typeof ti==='string'?ti:ti.patch||ti.input||'';
 // Decode JSON string literals only, never execute a tool wrapper as JavaScript.
 if(!patch&&typeof ti.code==='string'){const match=ti.code.match(/tools\.apply_patch\s*\(\s*("(?:\\.|[^"\\])*")\s*\)/);if(match){try{patch=JSON.parse(match[1]);}catch{}}}
 if(typeof patch==='string'&&patch.includes('*** Begin Patch')){
   let item=null;for(const line of patch.split(/\r?\n/)){const m=line.match(/^\*\*\* (?:Add|Update) File: (.+)$/);if(m){item={file:m[1],content:''};out.push(item);}else if(item&&line.startsWith('+'))item.content+=line.slice(1)+'\n';}
 }
 return out;
}
function extractCommands(input){
 const ti=input.tool_input||input.arguments||{},out=[];
 const cwd=ti.workdir||ti.cwd||input.cwd||process.cwd();
 const command=typeof ti==='string'&&!ti.startsWith('*** Begin Patch')?ti:ti.cmd||ti.command;
 if(command)out.push({command:Array.isArray(command)?command.join(' '):String(command),cwd});
 if(typeof ti.code==='string'){
  const wd=ti.code.match(/\bworkdir\s*:\s*("(?:\\.|[^"\\])*")/);let workdir=cwd;
  if(wd)try{workdir=JSON.parse(wd[1]);}catch{}
  for(const m of ti.code.matchAll(/\b(?:cmd|command)\s*:\s*("(?:\\.|[^"\\])*")/g))try{out.push({command:JSON.parse(m[1]),cwd:workdir});}catch{}
 }
 return out;
}
module.exports={analyzeUiCode,inspectProject,extractWrites,extractCommands,inside};
if(require.main===module){const i=process.argv.indexOf('--project');if(i<0){console.error('Usage: node ui-policy.cjs --project <root>');process.exitCode=2;}else{const r=inspectProject(process.argv[i+1]);console.log(JSON.stringify(r,null,2));process.exitCode=r.pass?0:1;}}
