// Independent, bounded EN/JA copy-action QA. No website access until invoked for a NEW frozen candidate.
// Writes only this QA directory; never writes product/build/git, opens a game, or starts a server.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright');
const root=path.resolve(__dirname,'../../../..'),[base,buildName,tag,ready]=process.argv.slice(2);
assert(ready==='--freeze-ready','Wait for root to supply a frozen new base/build before execution.');
assert(/^http:\/\/127\.0\.0\.1:\d+\/$/.test(base||'')&&+new URL(base).port>8881,'Only a NEW loopback candidate after 8881 is allowed.');
assert(buildName?.startsWith('.measure-')&&buildName!=='.measure-guide-final-docs-20261024-02'&&!/[\\/]/.test(buildName),'Explicit NEW .measure build required.');
assert(tag&&/^raw-[a-z0-9-]+$/.test(tag),'Fresh raw-tag required.');
const build=path.join(root,buildName),out=path.join(__dirname,tag);fs.mkdirSync(out,{recursive:false});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),norm=s=>String(s).replace(/\s+/g,' ').trim();
const read=f=>fs.readFileSync(path.join(root,f)),json=f=>JSON.parse(read(f));
const list=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(d,e.name)):[path.join(d,e.name)]).sort();
const snapshot=d=>list(d).map(f=>({file:path.relative(d,f).replaceAll('\\','/'),sha256:sha(fs.readFileSync(f))}));
const oldPath='holiday-lab/reports/guide-final-docs-20261024/qa/ja-source-r3/result.json',old=json(oldPath),oldBuild=path.join(root,old.build);
const reviewPath='holiday-lab/reports/goal-audit-20261024/translation-review.json',proposed=json(reviewPath).proposed_changes;
const photoCache=new Map();for(const p of json('holiday-lab/reports/faculty-portrait/annotation-records.json').landmarks){const b=read('holiday-lab/reports/faculty-portrait/originals/'+p.slug+'.jpg');assert.equal(sha(b),p.source_sha256);photoCache.set(p.photo,b);}
const sourceSnapshot=()=>[...fs.readdirSync(root).filter(n=>/\.(jsx?|css)$/.test(n)).map(n=>path.join(root,n)),...list(path.join(root,'data')).filter(n=>n.endsWith('.json'))].sort().map(f=>({file:path.relative(root,f).replaceAll('\\','/'),sha256:sha(fs.readFileSync(f))}));
const report={at:new Date().toISOString(),base,build:buildName,scope:'Four contexts EN/JA x390/1440. Only graduation FAQ and overseas-internship step action copy; no homepage/nav/full-guide/game QA.',old_base:old.base,old_build:old.build,old_evidence_sha256:sha(read(oldPath)),proposal_sha256:sha(read(reviewPath)),source_before:sourceSnapshot(),build_before:snapshot(build),cases:[],errors:[],full_project_approved:false,public_release:false};
const differences=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k])).map(key=>({key,before:a[key],after:b[key]}));
const dict=(text,lang)=>vm.runInNewContext(text+';SITE_'+lang.toUpperCase()+'_MESSAGES');
function sourceDelta(){
 assert.equal(old.base,'http://127.0.0.1:8881/');assert.equal(old.source_after.length,47);
 assert.deepEqual(report.source_before.map(x=>x.file),old.source_after.map(x=>x.file),'Source file set changed');
 const expected=['data/en/flow-ui.json','data/ja/flow-ui.json','locale-en.js','locale-ja.js'];
 const changed=report.source_before.filter(x=>old.source_after.find(y=>y.file===x.file).sha256!==x.sha256);
 assert.deepEqual(changed.map(x=>x.file).sort(),expected.sort(),'Only two flow-ui and two generated locale source files may differ from 8881');
 assert.equal(sha(read('data/students/guide.json')),old.source_after.find(x=>x.file==='data/students/guide.json').sha256,'Canonical guide changed');
 assert.equal(sha(read('data/students/guide.json')),sha(fs.readFileSync(path.join(build,'data/students/guide.json'))),'Frozen canonical guide differs');
 assert.equal(proposed.length,4);const languages=[];
 for(const lang of ['en','ja']){
  const rows=proposed.filter(x=>x.language===lang);assert.equal(rows.length,2);
  const priorBytes=fs.readFileSync(path.join(oldBuild,'data',lang,'flow-ui.json')),currentBytes=read('data/'+lang+'/flow-ui.json');
  assert.equal(sha(priorBytes),old.source_after.find(x=>x.file==='data/'+lang+'/flow-ui.json').sha256,'Old frozen flow fixture differs from old source SHA');
  const delta=differences(JSON.parse(priorBytes),JSON.parse(currentBytes));
  assert.equal(delta.length,2);for(const r of rows)assert(delta.some(x=>x.key===r.key&&x.before===r.before&&x.after===r.after),'Unexpected flow change '+lang);
  const localeText=read('locale-'+lang+'.js').toString('utf8'),newDict=dict(localeText,lang);let reverse=localeText;
  for(const r of rows){assert.equal(newDict[r.key],r.after);assert.equal(reverse.split(r.after).length-1,1,'Expected one corrected literal in locale');reverse=reverse.replace(r.after,r.before);}
  const oldHash=old.source_after.find(x=>x.file==='locale-'+lang+'.js').sha256;
  const variants=[{kind:'exact reverse of two values',text:reverse},{kind:'two values plus LF normalization',text:reverse.replace(/\r\n/g,'\n')},{kind:'two values plus CRLF normalization',text:reverse.replace(/\r\n/g,'\n').replace(/\n/g,'\r\n')}];
  const matched=variants.find(x=>sha(Buffer.from(x.text))===oldHash);assert(matched,'Generated locale cannot reconstruct 8881 from the two expected changes');
  const localeDelta=differences(dict(matched.text,lang),newDict);assert.equal(localeDelta.length,2);
  for(const r of rows)assert(localeDelta.some(x=>x.key===r.key&&x.before===r.before&&x.after===r.after));
  assert.equal(sha(currentBytes),sha(fs.readFileSync(path.join(build,'data',lang,'flow-ui.json'))),'Build flow differs');
  languages.push({lang,flow_changes:delta,locale_changes:localeDelta,old_locale_reconstruction:matched.kind,old_locale_sha256:sha(Buffer.from(matched.text))});
 }
 return {source_files:47,expected_changed:changed,other_source_files_unchanged:43,canonical_guide_unchanged:true,languages};
}
function buildDelta(){
 const before=old.build_after,after=report.build_before,am=new Map(after.map(x=>[x.file,x.sha256])),bm=new Map(before.map(x=>[x.file,x.sha256]));
 assert.equal(before.length,360);assert.equal(after.length,360);
 const changed=before.filter(x=>am.has(x.file)&&am.get(x.file)!==x.sha256),removed=before.filter(x=>!am.has(x.file)),added=after.filter(x=>!bm.has(x.file));
 assert.deepEqual(changed.map(x=>x.file).sort(),['data/en/flow-ui.json','data/ja/flow-ui.json','index.html'].sort());
 assert.equal(removed.length,1);assert.equal(added.length,1);assert(/^app-.*\.js$/.test(removed[0].file)&&/^app-.*\.js$/.test(added[0].file));
 const priorIndex=fs.readFileSync(path.join(oldBuild,'index.html'),'utf8'),newIndex=fs.readFileSync(path.join(build,'index.html'),'utf8');
 assert.equal(newIndex.replaceAll(added[0].file,removed[0].file),priorIndex,'index differs beyond bundle filename');
 const oldApp=fs.readFileSync(path.join(oldBuild,removed[0].file)),newApp=fs.readFileSync(path.join(build,added[0].file));let reversed=newApp.toString('utf8');
 const replacements=[];for(const r of proposed){const hits=reversed.split(r.after).length-1;replacements.push({lang:r.language,key:r.key,hits});if(hits===1)reversed=reversed.replace(r.after,r.before);}
 const exact=replacements.every(r=>r.hits===1)&&sha(Buffer.from(reversed))===sha(oldApp);
 const art=before.filter(x=>/\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(x.file));assert(art.every(x=>am.get(x.file)===x.sha256));
 return {old_files:360,new_files:360,changed_common:changed,removed,added,retained_art_font_files:art.length,retained_art_font_same_sha:true,index_only_bundle_name_changed:true,bundle_reversal:{possible:replacements.every(x=>x.hits===1),replacements,exact_old_sha_restored:exact,old_sha256:sha(oldApp),reversed_sha256:sha(Buffer.from(reversed))},note:exact?'All four exact corrected values reverse to the original bundle bytes.':'Exact bundle restoration not established; source/dictionary delta and frozen-file correspondence are reported separately.'};
}
async function httpBind(){
 const html=fs.readFileSync(path.join(build,'index.html'),'utf8'),refs=['index.html','data/students/guide.json','data/en/flow-ui.json','data/ja/flow-ui.json',...[...html.matchAll(/(?:src|href)="([^"<>]+\.(?:js|css)(?:\?[^"<>]*)?)"/g)].map(x=>x[1])],rows=[];
 for(const ref of new Set(refs)){const u=new URL(ref,base);if(u.origin!==new URL(base).origin)continue;const f=path.resolve(build,decodeURIComponent(u.pathname.slice(1)));assert(f.startsWith(build+path.sep));const r=await fetch(u,{signal:AbortSignal.timeout(10000)}),b=Buffer.from(await r.arrayBuffer());rows.push({url:u.href,status:r.status,sha256:sha(b),expected:sha(fs.readFileSync(f))});}
 assert(rows.every(x=>x.status===200&&x.sha256===x.expected),'Service is not the frozen candidate');return rows;
}
(async()=>{let browser;try{
 report.source_delta=sourceDelta();report.build_delta=buildDelta();report.http_before=await httpBind();
 const guide=json('data/students/guide.json'),graduation=guide.cards.find(c=>c.id==='graduation'),overseas=guide.cards.find(c=>c.id==='overseas-internship');
 const faqKey=proposed.find(x=>x.key.startsWith('不一定。')).key,stepKey=proposed.find(x=>x.key.startsWith('錄取後')).key;
 const faqIndex=guide.cards.flatMap(c=>c.faq).findIndex(f=>f.a===faqKey),stepIndex=overseas.step_details.findIndex(d=>d.detail===stepKey);assert(faqIndex>=0&&stepIndex>=0&&graduation.faq.some(f=>f.a===faqKey));
 browser=await chromium.launch({headless:true});report.browser=browser.version();report.browser_launched=true;
 for(const lang of ['en','ja'])for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),rows=proposed.filter(x=>x.language===lang);
  const row={lang,width,checks:[],page_errors:[],console_errors:[],http_errors:[],blocked_game_requests:[],shots:[]};report.cases.push(row);
  const check=(id,yes,details)=>row.checks.push({id,yes_no:yes?'yes':'no',details});
  page.on('pageerror',e=>row.page_errors.push(e.message));page.on('console',m=>{if(m.type()==='error')row.console_errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)row.http_errors.push({url:r.url(),status:r.status()});});
  await page.route('**/*',route=>{const href=route.request().url(),cached=photoCache.get(href);if(cached)return route.fulfill({status:200,contentType:'image/jpeg',body:cached});const u=new URL(href);if((u.pathname.startsWith('/holiday-lab/')&&!u.pathname.startsWith('/holiday-lab/student-curation'))||(route.request().resourceType()==='document'&&route.request().frame()!==page.mainFrame())){row.blocked_game_requests.push(u.href);return route.abort('blockedbyclient');}return route.continue();});
  try{
   await page.goto(base+'?lang='+lang+'#/students/guide',{waitUntil:'networkidle'});await page.locator('.sg-card-grid').waitFor();await page.evaluate(async()=>{await document.fonts.ready;});
   check('language',await page.locator('html').getAttribute('lang')===lang);
   const faq=page.locator('.sg-faq-item').nth(faqIndex);await faq.locator('summary').click();await faq.locator('.sg-faq-answer p').waitFor({state:'visible'});
   const actualFaq=await faq.locator('.sg-faq-answer p').innerText(),wantedFaq=rows.find(x=>x.key===faqKey);row.faq={key:faqKey,expected:wantedFaq.after,before:wantedFaq.before,actual:actualFaq};
   check('graduation-new-action-visible',norm(actualFaq)===norm(wantedFaq.after)&&await faq.locator('.sg-faq-answer p').isVisible(),row.faq);
   check('graduation-old-action-absent',!norm(actualFaq).includes(norm(wantedFaq.before)));
   await faq.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const f1=lang+'-'+width+'-graduation-faq.webp';await faq.screenshot({path:path.join(out,f1),type:'webp',quality:88});row.shots.push({file:f1,sha256:sha(fs.readFileSync(path.join(out,f1))),kind:'direct locator WebP'});
   const card=page.locator('[data-guide-card="overseas-internship"]');await card.locator('.sg-card-detail > summary').click();const step=card.locator('[data-step-detail="overseas-internship-'+stepIndex+'"]');await step.waitFor({state:'visible'});
   const actualStep=await step.innerText(),wantedStep=rows.find(x=>x.key===stepKey);row.step={key:stepKey,index:stepIndex,expected:wantedStep.after,before:wantedStep.before,actual:actualStep};
   check('overseas-return-action-visible',norm(actualStep)===norm(wantedStep.after)&&await step.isVisible(),row.step);
   check('overseas-old-action-absent',!norm(actualStep).includes(norm(wantedStep.before)));
   const stepRow=card.locator('#student-step-overseas-internship-'+stepIndex);await stepRow.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const f2=lang+'-'+width+'-overseas-return-step.webp';await stepRow.screenshot({path:path.join(out,f2),type:'webp',quality:88});row.shots.push({file:f2,sha256:sha(fs.readFileSync(path.join(out,f2))),kind:'direct locator WebP'});
   const bodyText=await page.locator('body').innerText();check('old-incorrect-visible-sentences-absent',rows.every(x=>!norm(bodyText).includes(norm(x.before))));
   row.metrics=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,replacementCharacter:document.querySelector('#student-guide').innerText.includes('\uFFFD'),iframeCount:document.querySelectorAll('iframe').length,fontStatus:document.fonts.status}));
   check('no-horizontal-overflow',row.metrics.documentWidth<=width+1,row.metrics);check('no-replacement-character',!row.metrics.replacementCharacter);check('no-iframe',row.metrics.iframeCount===0);
   fs.writeFileSync(path.join(out,lang+'-'+width+'-targets.html'),(await faq.evaluate(e=>e.outerHTML))+'\n'+(await stepRow.evaluate(e=>e.outerHTML)));
  }catch(e){row.error=e.stack;check('case-completed',false,e.message);}finally{
   check('no-console-page-http-errors',!row.console_errors.length&&!row.page_errors.length&&!row.http_errors.length,{console:row.console_errors,page:row.page_errors,http:row.http_errors});check('no-game-requests',row.blocked_game_requests.length===0,row.blocked_game_requests);
   row.pass=row.checks.every(x=>x.yes_no==='yes');console.log((row.pass?'PASS':'FAIL')+' '+lang+' '+width+' '+row.checks.filter(x=>x.yes_no==='yes').length+'/'+row.checks.length);fs.writeFileSync(path.join(out,lang+'-'+width+'.json'),JSON.stringify(row,null,2));await context.close();
  }
 }
 report.http_after=await httpBind();
}catch(e){report.errors.push(e.stack);console.error(e.stack);}finally{
 if(browser){await browser.close();report.browser_closed=true;}else report.browser_closed='not launched';
 report.source_after=sourceSnapshot();report.build_after=snapshot(build);report.source_stable=JSON.stringify(report.source_before)===JSON.stringify(report.source_after);report.build_stable=JSON.stringify(report.build_before)===JSON.stringify(report.build_after);
 report.pass=report.cases.length===4&&report.cases.every(x=>x.pass)&&!report.errors.length&&report.source_stable&&report.build_stable;report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({pass:report.pass,contexts:report.cases.length,yes:report.cases.reduce((n,c)=>n+c.checks.filter(x=>x.yes_no==='yes').length,0),no:report.cases.reduce((n,c)=>n+c.checks.filter(x=>x.yes_no==='no').length,0),source_files:report.source_after.length,build_files:report.build_after.length,source_stable:report.source_stable,build_stable:report.build_stable,browser_closed:report.browser_closed,bundle_reversed:report.build_delta?.bundle_reversal.exact_old_sha_restored}));process.exitCode=report.pass?0:1;
}})();
