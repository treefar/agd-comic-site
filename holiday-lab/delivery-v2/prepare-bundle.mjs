import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {args,list,sha,writeJSON,psquote,verifyTree} from './common.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),opt=args();
if(!opt.source||!opt.out)throw Error('Usage: node prepare-bundle.mjs --source <FINAL_BUILD> --out <NEW_DIRECTORY_UNDER_DELIVERY_V2> [--expected-games=15] [--label=final-review]');
const source=fs.realpathSync(path.resolve(opt.source)),out=path.resolve(opt.out);
if(!out.startsWith(root+path.sep))throw Error('Output must stay inside holiday-lab/delivery-v2');
if(out===source||out.startsWith(source+path.sep))throw Error('Output cannot be inside source build');
if(path.basename(source)==='.review-local-04')throw Error('Old .review-local-04 is not an accepted final build');
if(fs.existsSync(out))throw Error('Output already exists; retain it and choose a fresh name');
const forbidden=/(^|\/)(?:\.git|node_modules|work-orders|tests|reports|redesign|delivery|delivery-v2|art-source|audio-source|verification|Unity|Library|Temp)(\/|$)/i;
const allowed=p=>!forbidden.test(p)&&(/^(data|images|fonts)\//.test(p)||/^holiday-lab\/(assets|games|audio)\//.test(p)||/^holiday-lab\/(catalog\.mjs|replay-model\.mjs|index\.html|lab\.css|runner\.mjs)$/.test(p)||/^(\.nojekyll|index\.html|app-[A-Z0-9]+\.js|styles\.css|faculty-portrait\.css|student-guide\.css|holiday-home\.css|favicon\.ico)$/.test(p));
const files=list(source),unexpected=files.filter(p=>!allowed(p));
if(unexpected.length)throw Error('Source contains non-runtime or unreviewed files; nothing copied: '+unexpected.join(', '));
for(const required of ['index.html','student-guide.css','holiday-lab/index.html','holiday-lab/catalog.mjs','holiday-lab/runner.mjs'])if(!files.includes(required))throw Error('Required runtime missing: '+required);
const catalog=await import(pathToFileURL(path.join(source,'holiday-lab/catalog.mjs')).href);
const ids=catalog.games.map(g=>g.id),expected=Number(opt['expected-games']||15);
if(ids.length!==expected||new Set(ids).size!==expected)throw Error('Expected '+expected+' unique games; got '+JSON.stringify(ids));
for(const id of ids){if(!files.includes('holiday-lab/games/'+id+'.mjs'))throw Error('Missing game module '+id);for(let i=1;i<=5;i++)if(!files.includes(`holiday-lab/assets/${id}/cg-${i}.webp`))throw Error(`Missing CG ${id}/${i}`);}
const before=files.map(p=>({path:p,bytes:fs.statSync(path.join(source,p)).size,sha256:sha(path.join(source,p))}));
const bundle=path.join(out,'portable');fs.mkdirSync(bundle,{recursive:true});
for(const f of before){const dest=path.join(bundle,'site',f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(source,f.path),dest);if(sha(dest)!==f.sha256)throw Error('Copied hash differs: '+f.path);}
for(const f of before)if(sha(path.join(source,f.path))!==f.sha256)throw Error('Source changed during packaging: '+f.path);
if(JSON.stringify(list(source))!==JSON.stringify(files))throw Error('Source file list changed during packaging');
for(const p of list(path.join(root,'templates')))fs.copyFileSync(path.join(root,'templates',p),path.join(bundle,p));
const cmd=target=>'@echo off\r\nsetlocal\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n  echo Node.js 18 or later is required. No software is downloaded automatically.> "%~dp0launch-error.log"\r\n  type "%~dp0launch-error.log"\r\n  exit /b 1\r\n)\r\nnode "%~dp0'+target+'" %*\r\nexit /b %errorlevel%\r\n';
for(const [name,target] of [['Start-Preview.cmd','launch-preview.mjs'],['Stop-Preview.cmd','stop-preview.mjs'],['Verify-Files.cmd','verify-package.mjs']]){const text=cmd(target);if(/[^\x00-\x7f]/.test(text))throw Error('CMD must be ASCII');fs.writeFileSync(path.join(bundle,name),text);}
const packageID=crypto.randomUUID();writeJSON(path.join(bundle,'package-id.json'),{packageID,label:String(opt.label||path.basename(source)),games:ids,createdAt:new Date().toISOString()});
fs.writeFileSync(path.join(bundle,'README-試玩說明.md'),`# 本機試玩包：${expected}款節日遊戲與新版在校指南\n\n1. 完整解壓縮ZIP，保留資料夾結構。電腦需已安裝Node.js 18以上；不會自動下載任何軟體。\n2. 雙擊Start-Preview.cmd。確認伺服器就緒後，會用預設瀏覽器開啟 http://127.0.0.1:8815/ 。不用開Unity，也不要直接用file://開網站。\n3. 遊戲入口：http://127.0.0.1:8815/holiday-lab/ ；新版指南：http://127.0.0.1:8815/?lang=zh#/students/guide 。可切換中英日。\n4. 關閉瀏覽器不等於停止server；結束試玩時雙擊Stop-Preview.cmd，只會停止本包身分核對成功的server。\n5. 再點Start時會重用同包已開啟的server。若埠被其他服務占用，不會停止其他服務、不反覆跳窗；先讀launch-error.log、preview-server.log，再於終端執行Start-Preview.cmd --port=8823。\n6. Verify-Files.cmd會重新比對所有隨包檔案SHA256；啟動後產生的log與state不在清單。\n\n本包為本機候選審閱版，尚未上線；遊戲圖像仍依使用者實際審閱決定。沒有Unity執行檔，不附重錄影片、不另加配樂。15款遊戲素材隨包保留；部分官網照片（含沿用官方原網址的師資主圖）、字型與學校處室連結需要網路。此包不另下載或改寫遠端照片，不能宣稱完整網站離線可用。\n\n若無法啟動，先看log，不需要反覆點啟動檔。若缺Node.js，log會明確提示；此包不改系統、不安裝軟體。\n`);
const packageFiles=list(bundle).map(p=>({path:p,bytes:fs.statSync(path.join(bundle,p)).size,sha256:sha(path.join(bundle,p))}));
const manifest={schema:2,packageID,createdAt:new Date().toISOString(),sourceSnapshot:path.basename(source),label:String(opt.label||''),gameIDs:ids,sourceFiles:before.length,sourceBytes:before.reduce((n,f)=>n+f.bytes,0),sourceManifest:before,files:packageFiles};
writeJSON(path.join(bundle,'SHA256SUMS.json'),manifest);verifyTree(bundle,manifest);writeJSON(path.join(out,'bundle-manifest.json'),manifest);
const zip=path.join(out,'holiday-preview-v2.zip');const compressed=spawnSync('powershell.exe',['-NoProfile','-Command',`$ErrorActionPreference='Stop'; Compress-Archive -Path ${psquote(path.join(bundle,'*'))} -DestinationPath ${psquote(zip)} -CompressionLevel Optimal`],{encoding:'utf8',windowsHide:true,timeout:180000});
if(compressed.status!==0)throw Error('Compress-Archive failed: '+compressed.stderr);
const summary={source,sourceFiles:before.length,verifiedCopies:before.length,games:ids.length,packageFiles:packageFiles.length+1,zip,zipBytes:fs.statSync(zip).size,zipSHA256:sha(zip),bundle};writeJSON(path.join(out,'package-summary.json'),summary);console.log(JSON.stringify(summary,null,2));
