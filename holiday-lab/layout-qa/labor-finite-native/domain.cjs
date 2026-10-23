// 精確有限文字域。VM僅讀取已固定來源中的純evaluate/字串；不mount、不改瀏覽器state。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const snap=JSON.parse(fs.readFileSync(path.join(__dirname,'source-snapshot.json'))),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const pinnedSource=()=>Object.fromEntries(Object.entries(snap.files).map(([f,v])=>[f,Buffer.from(v.base64,'base64').toString('utf8')]));
function assertSources(source){for(const f of ['games/labor.mjs','runner.mjs'])assert.equal(hash(source[f]),snap.files[f].sha256,'source drift: '+f);}
const source=pinnedSource();assertSources(source);const labor=source['games/labor.mjs'],runner=source['runner.mjs'];
const pure=labor.slice(0,labor.indexOf('export function buildResult')).replaceAll('export const ','const ').replaceAll('export function ','function ');
const failureStatement=labor.slice(labor.indexOf('const failures='),labor.indexOf('export function mount'));
assert.ok(pure.includes('export')===false&&failureStatement.startsWith('const failures=')&&failureStatement.endsWith(';\r\n')||failureStatement.endsWith(';\n'));
const context={};vm.runInNewContext(pure+failureStatement+';this.result={JOBS,breaks,failures,evaluate};',context,{timeout:1000});
const {JOBS,breaks,failures,evaluate:originalEvaluate}=context.result;
assert.deepEqual(Array.from(JOBS,j=>j.duration),[10,12,8,10,12,8]);assert.ok(labor.includes('min:0,max:42,step:1,value:0'));assert.ok(labor.includes('options:[0,1,2].map'));assert.ok(runner.includes("onInput(Number(input.value))"));
const evaluate=s=>JSON.parse(JSON.stringify(originalEvaluate(s)));
function assertUiSchedule(s){assert.ok(Array.isArray(s)&&s.length===6,'six jobs required');for(const j of s){assert.ok(Number.isInteger(j.artist)&&j.artist>=0&&j.artist<=2,'illegal artist');assert.ok(Number.isInteger(j.start)&&j.start>=0&&j.start<=42,'illegal time/step');}}
function loads(artists){assert.ok(Array.isArray(artists)&&artists.length===6,'six artists');const l=[0,0,0];for(let i=0;i<6;i++){assert.ok(Number.isInteger(artists[i])&&artists[i]>=0&&artists[i]<=2,'illegal artist');l[artists[i]]+=JOBS[i].duration;}return l;}
function assignments(){return Array.from({length:729},(_,index)=>{let n=index;const artists=Array.from({length:6},()=>{const a=n%3;n=Math.floor(n/3);return a;});return {index,artists,loads:loads(artists)};});}
function validateAssignments(rows){assert.equal(rows.length,729,'729 assignments required');const seen=new Set();for(const r of rows){const l=loads(r.artists),key=r.artists.join(',');assert.ok(!seen.has(key),'duplicate assignment');seen.add(key);assert.deepEqual(l,r.loads);}}
function loadDomain(rows=assignments()){validateAssignments(rows);const unique=new Map();for(const r of rows){const k=r.loads.join(',');if(!unique.has(k))unique.set(k,{loads:r.loads,artists:r.artists,witness:r.artists.map(artist=>({artist,start:0})),assignment_indices:[]});unique.get(k).assignment_indices.push(r.index);}return [...unique.values()].sort((a,b)=>a.loads[0]-b.loads[0]||a.loads[1]-b.loads[1]);}
function validateLoads(l){assert.equal(l.reduce((a,b)=>a+b,0),60,'joint total must be60');assert.ok(loadDomain().some(r=>r.loads.join(',')===l.join(',')),'loads not reachable from durations');}
const valid=()=>[0,1,2,0,1,2].map((artist,i)=>({artist,start:[0,10,22,10,22,34][i]}));
function fixtures(){const zero=(artists)=>artists.map(artist=>({artist,start:0})),changed=(fn)=>{const s=valid();fn(s);return s;};return [
 {id:'all-A',lang:'zh',width:320,schedule:zero([0,0,0,0,0,0]),reason:'dependency'},
 {id:'all-B',lang:'en',width:320,schedule:zero([1,1,1,1,1,1]),reason:'dependency'},
 {id:'all-C',lang:'ja',width:320,schedule:zero([2,2,2,2,2,2]),reason:'dependency'},
 {id:'balanced',lang:'zh',width:1440,schedule:zero([0,1,1,0,2,2]),reason:'dependency'},
 {id:'deadline',lang:'zh',width:320,schedule:changed(s=>s[4].start=41),reason:'deadline'},
 {id:'rest',lang:'en',width:320,schedule:changed(s=>{s[0].start=20;s[1].start=30;s[2].start=42;}),reason:'break'},
 {id:'overlap',lang:'ja',width:320,schedule:changed(s=>s[3].start=5),reason:'overlap'},
 {id:'heavy',lang:'zh',width:1440,schedule:changed(s=>{s[2]={artist:0,start:26};s[5]={artist:0,start:34};}),reason:'load'},
 {id:'max-slider',lang:'en',width:1440,schedule:changed(s=>s[4].start=42),reason:'deadline'},
 {id:'mixed',lang:'ja',width:1440,schedule:zero([0,1,2,0,1,2]),reason:'dependency'}
 ];}
function words(owner,v,lang){if(owner==='labor-loads'){const l=v.loads;return {zh:`工作量 A ${l[0]}／B ${l[1]}／C ${l[2]}`,en:`Workload A ${l[0]} / B ${l[1]} / C ${l[2]}`,ja:`作業量 A${l[0]}／B${l[1]}／C${l[2]}`}[lang];}if(owner==='game-progress')return `${v.validJobs} / 6`;return failures[v.reason][lang];}
function progressWitnesses(){return [
 fixtures().find(f=>f.reason==='deadline').schedule,
 fixtures()[0].schedule,
 valid().map((j,i)=>i===2?{...j,start:0}:j),
 valid().map((j,i)=>({...j,start:[0,10,22,20,30,42][i]})),
 valid().map((j,i)=>i===4?{...j,start:0}:j),
 valid().map((j,i)=>i===5?{...j,start:0}:j)
 ];}
function fullTextCoverage(domText,measurements,expected){const reconstructed=[...measurements].sort((a,b)=>a.baseline-b.baseline||a.advance.x-b.advance.x).map(m=>m.text).join('');return domText===expected&&reconstructed.replace(/\s/gu,'')===expected.replace(/\s/gu,'');}
function fullOwnerJobs(lang,width){return [
 ...loadDomain().map((r,i)=>({id:`load-${i}`,lang,width,schedule:r.witness,reason:'dependency',owners:['labor-loads']})),
 ...['deadline','dependency','break','overlap','load'].map(reason=>({...fixtures().find(x=>x.reason===reason),id:`reason-${reason}`,lang,width,owners:['game-hint','labor-status']})),
 ...Array.from({length:6},(_,i)=>Array.from({length:43},(_,n)=>{const schedule=Array.from({length:6},(_,j)=>({artist:0,start:i===j?n:0}));return {id:`output-${i}-${n}`,lang,width,schedule,reason:evaluate(schedule).reason,owners:[`output:labor-start-${i}`]};})).flat(),
 ...progressWitnesses().map((schedule,i)=>({id:`progress-${i}`,lang,width,schedule,reason:evaluate(schedule).reason,owners:['game-progress']}))
 ];}
module.exports={INPUT_STATES:3n**6n*43n**6n,JOBS,breaks,failures,pinnedSource,assertSources,evaluate,assertUiSchedule,loads,assignments,validateAssignments,loadDomain,validateLoads,valid,fixtures,words,pure,failureStatement,progressWitnesses,fullTextCoverage,fullOwnerJobs};
