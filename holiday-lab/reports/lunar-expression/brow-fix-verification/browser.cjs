// Narrow known-fixture L2 regression, not a student blind playtest.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'))('playwright');
const base=process.env.BROW_BASE||'http://127.0.0.1:8830',out=__dirname;
const expected={zh:{positive:'眉毛往另一邊傾斜了。換個方向，搭配睜大的眼睛試試。',zero:'眼睛睜大了，眉毛還接近平直。把眉毛的傾斜做得更明顯。',accepted:'眼眉和張嘴一起接住了驚喜，可拍下或再演一版。'},en:{positive:'The brows tilt the other way. Reverse their tilt to match the wide-eyed surprise.',zero:'The eyes are wide, but the brows are almost level. Give the brows a clearer tilt.',accepted:'The eyes, brows and open mouth convey surprise. Capture it or try another version.'},ja:{positive:'眉の傾きが逆向きです。大きく開いた目に合わせ、傾きを反対にしてみよう。',zero:'目は大きいのに眉はまだ平らに近いです。眉の傾きをはっきりさせよう。',accepted:'目・眉・口で驚きが伝わります。撮影するか、別の演技を。'}};
const report={at:new Date().toISOString(),base,method:'Visible DOM ranges and submit button only; no game imports, internal state changes or server changes.',cases:[],errors:[]};
async function receipts(){const result={};for(const file of ['games/lunar-new-year.mjs','runner.mjs','lab.css']){const response=await fetch(base+'/holiday-lab/'+file);assert.equal(response.status,200);const bytes=Buffer.from(await response.arrayBuffer());result[file]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}return result;}
function save(){fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));}
let browser;
(async()=>{try{
 report.before=await receipts();browser=await chromium.launch({headless:true});report.browser=browser.version();
 for(const lang of ['zh','en','ja'])for(const width of [320,1440]){
  const row={lang,width,height:1000,pass:false,angles:[],pageErrors:[],consoleErrors:[]};report.cases.push(row);
  const context=await browser.newContext({viewport:{width,height:1000},isMobile:width===320,hasTouch:width===320});const page=await context.newPage();page.on('pageerror',e=>row.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')row.consoleErrors.push(m.text());});
  async function set(k,v){const l=page.locator('#lny-'+k);await l.fill(String(v));await l.dispatchEvent('input');assert.equal(Number(await l.inputValue()),v);}
  async function shot(name,selector){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(60);const file=`${lang}-${width}-${name}.png`;await page.screenshot({path:path.join(out,file),fullPage:false});return file;}
  try{
   await page.goto(base+`/holiday-lab/?game=lunar-new-year&lang=${lang}`,{waitUntil:'networkidle'});await page.locator('#intro-skip').click();await page.locator('#start-game').click();await page.locator('#lny-brow').waitFor();await set('eyes',1.5);await set('mouth',1);await set('pose',0);
   for(const brow of [30,0,-30]){
    await set('brow',brow);const angle={brow,values:{},observation:await page.locator('#lny-observation').textContent(),hintBefore:await page.locator('#game-hint').textContent()};row.angles.push(angle);
    for(const k of ['brow','eyes','mouth','pose'])angle.values[k]=Number(await page.locator('#lny-'+k).inputValue());
    assert.deepEqual(angle.values,{brow,eyes:1.5,mouth:1,pose:0});assert.equal(angle.observation,expected[lang][brow===30?'positive':brow===0?'zero':'accepted']);assert.equal(angle.hintBefore,angle.observation);
    angle.browStyle=await page.locator('#lny-brow-sprite').getAttribute('style');assert.ok(angle.browStyle.includes(`rotate(${brow}deg)`));
    angle.stageViewport=await shot(`brow${brow}-stage-before`,'#lny-brow-sprite');angle.observationViewport=await shot(`brow${brow}-observation-before`,'#lny-observation');
    await page.locator('#lny-submit').click();angle.hintAfter=await page.locator('#game-hint').textContent();angle.progress=await page.locator('#game-progress').textContent();
    assert.equal(angle.progress.replace(/\s/g,''),brow===-30?'1/3':'0/3');if(brow!==-30)assert.equal(angle.hintAfter,angle.observation);
    for(const[k,v]of Object.entries(angle.values))assert.equal(Number(await page.locator('#lny-'+k).inputValue()),v);
    angle.submissionViewport=await shot(`brow${brow}-after`,'#game-hint');angle.pass=true;
   }
   assert.notEqual(row.angles[0].observation,row.angles[1].observation);assert.deepEqual(row.pageErrors,[]);assert.deepEqual(row.consoleErrors,[]);row.pass=true;console.log(`YES ${lang}-${width}: +30 opposite direction / 0 near level rejected; -30 accepted; live and submit consistent; values retained`);
  }catch(e){row.error=e.stack;console.error(`NO ${lang}-${width}: ${e.message}`);await page.screenshot({path:path.join(out,`${lang}-${width}-failure.png`),fullPage:false}).catch(()=>{});}finally{await context.close();save();}
 }
 report.after=await receipts();assert.deepEqual(report.after,report.before);report.sourceStable=true;
}catch(e){report.errors.push(e.stack);console.error(e.stack);}finally{await browser?.close();report.pass=report.cases.length===6&&report.cases.every(c=>c.pass)&&!report.errors.length;save();console.log(`TOTAL ${report.cases.filter(c=>c.pass).length}/6; sourceStable=${report.sourceStable===true}; errors=${report.errors.length}`);process.exitCode=report.pass?0:1;}})();
