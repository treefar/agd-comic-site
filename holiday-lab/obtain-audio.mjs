import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const folder='holiday-lab/audio-source';fs.mkdirSync(folder,{recursive:true});
const vault=execFileSync('powershell',['-NoProfile','-File','C:/AIHome/claude/skills/cloud-asset-library/scripts/resolve-vault.ps1'],{encoding:'utf8'}).trim();
const cloud=path.join(vault,'Audio/Kenney/InterfaceSounds');
fs.copyFileSync(cloud+'/interface-sounds.zip',folder+'/interface-sounds.zip');
fs.copyFileSync(cloud+'/License.txt',folder+'/interface-License.txt');
const url='https://kenney.nl/media/pages/assets/impact-sounds/87b4ddecda-1677589768/kenney_impact-sounds.zip';
if(!fs.existsSync(folder+'/impact-sounds.zip')){
 const response=await fetch(url);if(!response.ok)throw Error(response.status);fs.writeFileSync(folder+'/impact-sounds.zip',Buffer.from(await response.arrayBuffer()));
 fs.writeFileSync(folder+'/impact-source.json',JSON.stringify({source:'https://kenney.nl/assets/impact-sounds',download:url,license:'CC0-1.0',license_url:'https://creativecommons.org/publicdomain/zero/1.0/',verified:'2026-10-22',author:'Kenney',purpose:'Original material sound cues in local comic prototypes'},null,2));
}
// Native tar can extract ZIP on Windows without introducing an npm dependency.
for(const id of ['interface','impact']){const out=path.resolve(folder,id);fs.mkdirSync(out,{recursive:true});execFileSync('tar',['-xf',path.resolve(folder,`${id}-sounds.zip`),'-C',out]);}
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(d,f.name)):[path.join(d,f.name)]);}
console.log(walk(folder).filter(p=>/\.(ogg|txt)$/i.test(p)).join('\n'));
