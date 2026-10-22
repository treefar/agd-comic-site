import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const source='C:/agywork/agd-holiday-prototypes/.review-local-04';
const bundle=path.join(out,'portable');
if(fs.existsSync(bundle))throw Error('Keep prior bundle intact; use a fresh output directory instead');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const list=(root,prefix='')=>fs.readdirSync(path.join(root,prefix),{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(root,prefix+e.name+'/'):[prefix+e.name]).sort();
const paths=list(source),forbidden=/(^|\/)(?:\.git|work-orders|tests|reports|art-source|audio-source)(\/|$)/;
const allowed=p=>!forbidden.test(p)&&(/^(data|images)\//.test(p)||/^holiday-lab\/(assets|games)\//.test(p)||/^holiday-lab\/audio\/(click|success|error|paper|wood|metal)\.ogg$/.test(p)||/^holiday-lab\/(catalog\.mjs|index\.html|lab\.css|runner\.mjs)$/.test(p)||/^(\.nojekyll|index\.html|app-[A-Z0-9]+\.js|styles\.css|student-guide\.css|holiday-home\.css)$/.test(p));
const unexpected=paths.filter(p=>!allowed(p));if(unexpected.length)throw Error('Unexpected files outside runtime allowlist: '+unexpected.join(', '));
const before=paths.map(p=>({path:p,bytes:fs.statSync(path.join(source,p)).size,sha256:sha(path.join(source,p))}));
for(const item of before){const target=path.join(bundle,'site',item.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(source,item.path),target);if(sha(target)!==item.sha256)throw Error('Copy mismatch: '+item.path);}
for(const item of before)if(sha(path.join(source,item.path))!==item.sha256)throw Error('Source changed while packaging: '+item.path);
fs.copyFileSync('C:/agywork/agd-holiday-prototypes/holiday-lab/serve-review.mjs',path.join(bundle,'serve-review.mjs'));
const launch=`import fs from 'node:fs';import path from 'node:path';import net from 'node:net';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const args=process.argv.slice(2);const portArg=args.find(a=>a.startsWith('--port='));const port=portArg?Number(portArg.slice(7)):8801;
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local port');
const url='http://127.0.0.1:'+port+'/';
const occupied=await new Promise(resolve=>{const s=net.connect({host:'127.0.0.1',port});s.once('connect',()=>{s.destroy();resolve(true);});s.once('error',()=>resolve(false));});
if(occupied){console.error('Port '+port+' is already in use. Close the previous preview first, or run Start-Preview.cmd --port=8802.');process.exitCode=1;}else{
 const logfile=fs.openSync(path.join(root,'preview-server.log'),'a');const child=spawn(process.execPath,[path.join(root,'serve-review.mjs'),path.join(root,'site'),String(port)],{cwd:root,windowsHide:true,detached:true,stdio:['ignore',logfile,logfile]});child.unref();fs.closeSync(logfile);
 let ready=false;for(let i=0;i<40;i++){try{const response=await fetch(url);if(response.ok&&(await response.text()).includes('<html')){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,150));}
 if(!ready){try{process.kill(child.pid);}catch{}throw Error('Preview server did not become ready; see preview-server.log');}
 fs.writeFileSync(path.join(root,'preview-server.json'),JSON.stringify({pid:child.pid,port,url},null,2));console.log('READY '+url+' PID='+child.pid);
 if(!args.includes('--no-browser')){const opener=spawn('cmd.exe',['/d','/c','start','',url],{windowsHide:true,detached:true,stdio:'ignore'});opener.unref();}
}
`;
fs.writeFileSync(path.join(bundle,'launch-preview.mjs'),launch);
const cmd='@echo off\r\nsetlocal\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n  echo Node.js is required. Please install Node.js before running this preview.\r\n  echo No software will be downloaded automatically.\r\n  pause\r\n  exit /b 1\r\n)\r\nnode "%~dp0launch-preview.mjs" %*\r\nif errorlevel 1 (\r\n  echo Preview could not start. See the message above.\r\n  pause\r\n  exit /b 1\r\n)\r\necho Keep the extracted folder while playing.\r\n';
if(/[^\x00-\x7f]/.test(cmd))throw Error('CMD must remain ASCII');fs.writeFileSync(path.join(bundle,'Start-Preview.cmd'),cmd);
fs.writeFileSync(path.join(bundle,'README-試玩說明.md'),'# 節日番外篇：本機試玩包\n\n1. 完整解壓縮ZIP，保留資料夾結構。\n2. 電腦需已安裝Node.js；若沒有，啟動程式會提示並停止，不會自動下載。\n3. 雙擊Start-Preview.cmd，確認伺服器啟動後會用預設瀏覽器開啟 http://127.0.0.1:8801/ 。不要直接用file://開index.html，否則模組與資料無法正常載入。\n4. 從首頁「節日番外篇」選擇十款遊戲，或直接開 http://127.0.0.1:8801/holiday-lab/ 。每款以30–90秒為設計目標，開場五張CG可跳過。\n5. 上方可切換中文、English、日本語。聲音預設關閉，可自行開啟。可用滑鼠、單指、Tab、方向鍵、Enter；滑桿旁另有加減按鈕。\n\n在校指南：http://127.0.0.1:8801/?lang=zh#/students/guide 。\n\n這是候選審閱版本，尚未上線，圖像尚待使用者確認；虛構校園地圖與展品不代表真實校園導航或正式活動公告。學校處室外部連結仍需連網，網站既有外部字型等資源也可能需要網路；本機遊戲核心素材已隨包提供。\n\n若8801已被使用，先關閉前次試玩伺服器，或在此資料夾終端執行 Start-Preview.cmd --port=8802。關閉瀏覽器不會自動停止伺服器；可依preview-server.json記錄的PID，在工作管理員結束該Node.js程序。請勿結束其他專案的Node.js。\n\nSHA256SUMS.json記錄包內各檔案雜湊（不含雜湊清單本身）。完整解壓後逐檔比對，可確認內容未變動。\n');
const files=list(bundle).map(p=>({path:p,bytes:fs.statSync(path.join(bundle,p)).size,sha256:sha(path.join(bundle,p))}));
const manifest={schema:1,createdAt:new Date().toISOString(),sourceSnapshot:'.review-local-04',sourceFiles:before.length,sourceBytes:before.reduce((n,f)=>n+f.bytes,0),files};
fs.writeFileSync(path.join(bundle,'SHA256SUMS.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(out,'bundle-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({sourceFiles:before.length,sourceBytes:manifest.sourceBytes,packageFiles:files.length+1,verifiedCopies:before.length,bundle}));
