const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'))('playwright');
const {sampleLayout}=require('../../layout-qa/browser-sampler.cjs'),{captureViewport}=require('../../layout-qa/viewport-shot.cjs');
const {inspectReport}=require('C:/AIHome/claude/skills/game-ui-art/scripts/ui-layout-policy.cjs');
const assets=JSON.parse(fs.readFileSync(path.join(__dirname,'../../layout-qa/asset-safe-regions.json'),'utf8'));
const mode=process.argv[2]||'candidate',base=process.env.BUTTON_BASE||'http://127.0.0.1:8819',out=path.join(__dirname,mode);fs.mkdirSync(out,{recursive:true});
const coreTargets=[{game:'teachers',id:'teachers-line-3',copy:'Thanks for always watching patiently.',redWidth:320},{game:'national-day',id:'island-reset-shot',copy:'Reset composition',redWidth:1440},{game:'peace-memory',id:'peace-listen',copy:'Listen in full',redWidth:320}];
const laborTargets=[{game:'labor',id:'labor-save',copy:'Save relay',redWidth:320},{game:'labor',id:'labor-preview',copy:'Preview relay (10×)',ja:'リレー再生（10倍速）',redWidth:1440}];
const teachersAllTargets=[{game:'teachers',id:'teachers-line-0',copy:'How can I improve this movement?',redWidth:1440},{game:'teachers',id:'teachers-line-2',copy:'Thank you for helping me finish my work.',redWidth:1440},{game:'teachers',id:'teachers-line-4',copy:'You have found your own approach.',redWidth:1440}];
const semesterTarget={game:'semester',id:'semester-window-1',copy:'Registration and Curriculum Section',redWidth:1440};
const targets=mode.includes('semester')?[semesterTarget]:mode.includes('teachers-all')?teachersAllTargets:mode.includes('labor')?laborTargets:mode.includes('all')?[...coreTargets,...laborTargets,...(mode.includes('complete')?[semesterTarget]:[])]:coreTargets;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');const report={at:new Date().toISOString(),mode,base,cases:[],errors:[],samplerSha:hash(Buffer.from(sampleLayout.toString())),assetMapSha:hash(fs.readFileSync(path.join(__dirname,'../../layout-qa/asset-safe-regions.json')))};
async function receipts(){const r={};for(const file of ['runner.mjs','lab.css',...targets.map(t=>'games/'+t.game+'.mjs')]){const response=await fetch(base+'/holiday-lab/'+file);assert.ok(response.ok);const bytes=Buffer.from(await response.arrayBuffer());r[file]={bytes:bytes.length,sha256:hash(bytes)};}return r;}
async function sample(p,cdp,t,label){
 const data=await p.evaluate(async({source,assets})=>await(0,eval)('('+source+')')({assets}),{source:sampleLayout.toString(),assets});
 const nodes=data.nodes.filter(n=>n.owner===t.id);assert.equal(nodes.length,1,'target measured as one complete text node');const n=nodes[0],i=n.unclipped_ink,s=n.safe;
 const margins={left:i.x-s.x,top:i.y-s.y,right:s.x+s.width-i.x-i.width,bottom:s.y+s.height-i.y-i.height};
 data.full_geometry_errors=inspectReport({schema_version:1,source_fingerprints:{},cases:[{id:label,width:p.viewportSize().width,height:p.viewportSize().height,nodes:data.nodes,blockers:data.blockers}]});
 const targetViolations=data.violations.filter(v=>v.includes(t.id));const safe=Object.values(margins).every(v=>v>=0)&&!targetViolations.length;
 const shot=await captureViewport(p,cdp);assert.ok(shot.scroll_unchanged);fs.writeFileSync(path.join(out,label+'.webp'),shot.bytes);fs.writeFileSync(path.join(out,label+'.json'),JSON.stringify(data,null,2));
 return {label,text:n.text,margins,safe,targetViolations,computed:n.computed,safe_sources:n.safe_sources,measurements:n.measurements,allViolations:data.violations,fullGeometryErrors:data.full_geometry_errors,screenshot:label+'.webp',scrollProof:{before:shot.before,after:shot.after}};
}
let browser;
(async()=>{try{report.before=await receipts();browser=await chromium.launch({headless:true});
 const matrix=mode.startsWith('candidate')?[...targets.map(t=>({...t,lang:'en',width:t.redWidth})),...(mode.includes('labor')?[320,1440].map(width=>({...laborTargets[1],lang:'ja',width})):[])]:targets.flatMap(t=>['zh','en','ja'].flatMap(lang=>[320,1440].map(width=>({...t,lang,width}))));
 for(const t of matrix){const row={game:t.game,id:t.id,lang:t.lang,width:t.width,states:[],pass:false};report.cases.push(row);const context=await browser.newContext({viewport:{width:t.width,height:t.width===320?900:1000},reducedMotion:'reduce'}),p=await context.newPage(),cdp=await context.newCDPSession(p);row.errors=[];p.on('pageerror',e=>row.errors.push(e.message));
 try{await p.goto(`${base}/holiday-lab/?game=${t.game}&lang=${t.lang}`,{waitUntil:'networkidle'});await p.locator('#intro-skip').click();await p.locator('#start-game').click();const target=p.locator('#'+t.id);await target.scrollIntoViewIfNeeded();row.originalPadding=await target.evaluate(el=>({left:getComputedStyle(el).paddingLeft,right:getComputedStyle(el).paddingRight,top:getComputedStyle(el).paddingTop,bottom:getComputedStyle(el).paddingBottom}));
 for(const variant of mode.startsWith('candidate')?['original','candidate']:['product']){
  if(variant==='candidate')await target.evaluate((el,{t,all})=>{el.textContent=t.lang==='ja'?t.ja:t.copy;if(t.game==='teachers'){if(all){el.closest('#teachers-line').querySelector('#teachers-line-3').textContent='Thanks for always watching patiently.';el.closest('#teachers-line').querySelectorAll('button').forEach(b=>{const s=getComputedStyle(b);b.style.paddingInline=(parseFloat(s.paddingLeft)+8)+'px';b.style.paddingBlock='18px';});}else el.style.paddingBlock='18px';}if(t.game==='semester')el.style.paddingInline=(parseFloat(getComputedStyle(el).paddingLeft)+8)+'px';},{t,all:mode.includes('teachers-all')});
  for(const state of ['normal','hover','pressed']){await target.scrollIntoViewIfNeeded();await p.mouse.move(1,1);if(state!=='normal')await target.hover();if(state==='pressed')await p.mouse.down();await p.waitForTimeout(180);
   const label=`${t.game}-${t.id}-${t.lang}-${t.width}-${variant}-${state}`,s=await sample(p,cdp,t,label);row.states.push({...s,variant,state});await p.mouse.move(1,1);if(state==='pressed')await p.mouse.up();
  }
 }
 if(mode.startsWith('candidate')){assert.ok(row.states.some(s=>s.variant==='original'&&!s.safe),'original defect reproduced');assert.ok(row.states.filter(s=>s.variant==='candidate').every(s=>s.safe),'all candidate states inside original safe frame');for(let j=0;j<3;j++)assert.equal(row.states[j].computed.size,row.states[j+3].computed.size);}
 else{assert.ok(row.states.every(s=>s.safe),'product target ink must remain inside fixed frame');if(t.lang==='en'||t.ja&&t.lang==='ja')assert.ok(row.states.every(s=>s.text===(t.lang==='ja'?t.ja:t.copy)));}
 assert.deepEqual(row.errors,[]);row.pass=true;console.log(`YES ${t.game}/${t.lang}/${t.width}: ${mode.startsWith('candidate')?'old RED -> DOM candidate GREEN':'actual product GREEN'} normal/hover/pressed`);
 }catch(e){row.error=e.stack;console.error(`NO ${t.game}/${t.lang}/${t.width}: ${e.message}`);}finally{await context.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));}}
 report.after=await receipts();assert.deepEqual(report.after,report.before);report.sourceStable=true;
 }catch(e){report.errors.push(e.stack);console.error(e.stack);}finally{await browser?.close();report.pass=report.cases.every(c=>c.pass)&&!report.errors.length;fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(`TOTAL ${report.cases.filter(c=>c.pass).length}/${report.cases.length}; stable=${report.sourceStable===true}; errors=${report.errors.length}`);process.exitCode=report.pass?0:1;}})();
