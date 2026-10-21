// 真實 Chromium 截圖；只透過遊戲公開測試介面操控狀態。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import sharp from 'sharp';
const arg = process.argv.indexOf('--out');
const out = path.resolve(arg < 0 ? 'docs/qa/creative-line/20261021' : process.argv[arg + 1]);
if (!out.startsWith(process.cwd() + path.sep)) throw Error('輸出必須在工作目錄內');
fs.mkdirSync(out, { recursive: true });
const onlyArg = process.argv.indexOf('--only');
const only = onlyArg < 0 ? null : process.argv[onlyArg + 1];
if (only && only !== 'L3-play-spring') throw Error('--only 目前只支援 L3-play-spring');
const prior = only ? JSON.parse(fs.readFileSync(path.join(out, 'evidence.json'), 'utf8')) : null;
const tmp = path.join(out, 'browser-tmp'); fs.mkdirSync(tmp, {recursive:true});
process.env.TEMP = process.env.TMP = process.env.TMPDIR = tmp;
const browser = await chromium.launch({headless:true});
const logs = [], evidence = prior ? prior.shots.filter(e => e.shot !== only) : [];
const states = ['cover','L1-ready','L1-play','L1-fail','L1-card','L2-ready','L2-play-ink','L2-lowink','L2-card','L3-ready','L3-play-spring','L3-card','final','paused'];
try {
for (const lang of ['zh','en']) for (const viewport of ['desktop','mobile']) {
  const mobile = viewport === 'mobile';
  const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile});
  const page = await context.newPage();
  page.on('console', m => {if(m.type()==='error') logs.push(`${lang}/${viewport} console: ${m.text()}`);});
  page.on('pageerror', e => logs.push(`${lang}/${viewport} JS: ${e.message}`));
  page.on('response', r => {if(r.status()>=400) logs.push(`${lang}/${viewport} HTTP ${r.status()} ${r.url()}`);});
  page.on('requestfailed', r => logs.push(`${lang}/${viewport} NETWORK ${r.url()} ${r.failure()?.errorText}`));
  // 凍結模擬時間，但由原生 RAF 排程實際繪製，不改遊戲檔案。
  await page.addInitScript(() => { window.qaNativeRAF = window.requestAnimationFrame.bind(window); performance.now = () => 1000; window.requestAnimationFrame = cb => {window.qaFrame=cb; return 1;}; });
  await page.goto(`http://127.0.0.1:8765/play/creative-line/index.html?lang=${lang}`);
  await page.waitForFunction(() => window.__cl?.state==='cover');
  await page.evaluate(() => document.fonts.ready);
  const render = () => page.evaluate(() => new Promise(resolve => window.qaNativeRAF(() => {window.qaFrame(1000); resolve();})));
  const shot = async state => {
    if (only && state !== only) return;
    await render();
    await page.evaluate(async () => { await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{}))); });
    const facts = await page.evaluate(() => {
      const line = document.querySelector('line:last-child'), orb = {...__cl.orb};
      const attrs = Object.fromEntries(['x1','y1','x2','y2','opacity'].map(k=>[k,Number(line.getAttribute(k))]));
      const target = {x:attrs.x2,y:attrs.y2};
      return {state:__cl.state,level:__cl.li,fails:__cl.fails,ink:__cl.ink,sparks:[...document.images].filter(i=>i.src.endsWith('/spark.png')&&i.getBoundingClientRect().width>0).length,spring:attrs.opacity,tilt:document.querySelector('.scene').style.transform,orb,target,distance:Math.hypot(target.x-orb.x,target.y-orb.y),line:attrs,selection:window.qaSpring};
    });
    if(state==='L3-play-spring' && (facts.state!=='play'||facts.distance<80||facts.spring<.6||facts.target.x<40||facts.target.x>1240||facts.target.y<40||facts.target.y>680)) throw Error(`彈簧驗收失敗 ${JSON.stringify(facts)}`);
    evidence.push({lang,viewport,shot:state,...facts});
    const png = await page.screenshot({type:'png'});
    await sharp(png).webp({quality:85}).toFile(path.join(out,`${lang}-${viewport}-${state}.webp`));
  };
  const start = async i => {await page.evaluate(i=>__cl.startLevel(i),i); await render();};
  const follow = async ratio => page.evaluate(ratio=>{
    const c=__cl,p=c.path;c.play();
    for(let n=0;n<Math.floor(p.length*ratio)&&c.state==='play';n++){
      c.setTarget(...p[n]); for(let k=0;k<30&&c.state==='play'&&Math.hypot(c.orb.x-p[n][0],c.orb.y-p[n][1])>0.8;k++)c.step(1/60);
    }
    if(ratio===1&&c.state==='play'){c.setTarget(...p.at(-1));for(let k=0;k<120&&c.state==='play';k++)c.step(1/60);}
    return {state:c.state,fails:c.fails};
  },ratio);
  const card = async state => {const r=await follow(1);if(r.state!=='won'||r.fails)throw Error(`autoplay ${lang}/${viewport}/${state}: ${JSON.stringify(r)}`);await page.waitForFunction(()=>__cl.state==='card',null,{polling:50,timeout:5000});await page.waitForTimeout(400);await shot(state);};
  await shot('cover');
  await start(0); await shot('L1-ready'); await follow(.5); await shot('L1-play');
  await page.evaluate(()=>{__cl.setTarget(__cl.orb.x,5);for(let i=0;i<120&&__cl.state==='play';i++)__cl.step(1/60);document.getAnimations().forEach(a=>{a.pause();a.currentTime=40;});});
  await shot('L1-fail');await page.evaluate(()=>document.getAnimations().forEach(a=>a.play()));await page.waitForTimeout(600);
  await start(0);await card('L1-card');
  await start(1);await shot('L2-ready');await follow(.4);await shot('L2-play-ink');
  const low=await page.evaluate(()=>{const c=__cl,b={...c.orb};for(let i=0;i<40&&c.ink>=30&&c.state==='play';i++){c.setTarget(b.x+(i%2?8:-8),b.y);c.step(.05);}return {state:c.state,ink:c.ink};});
  if(low.ink>=30||low.state!=='play')throw Error(`low ink: ${JSON.stringify(low)}`);
  await shot('L2-lowink');await start(1);await card('L2-card');
  await start(2);await shot('L3-ready');
  // 從 30%～60% 路徑逐點前進；搜尋有 40px 邊距的可走目標。
  await page.evaluate(()=>{
    const c=__cl,p=c.path; c.play();
    for(let n=0;n<=Math.floor(p.length*.6)&&c.state==='play';n++) {
      c.setTarget(...p[n]);
      for(let k=0;k<60&&c.state==='play'&&Math.hypot(c.orb.x-p[n][0],c.orb.y-p[n][1])>.8;k++) c.step(1/60);
      if(n<p.length*.3)continue;
      const o=c.orb;
      for(let y=400;y<=680;y+=4) for(let x=40;x<=1240;x+=4) {
        const d=Math.hypot(x-o.x,y-o.y);
        if(d<100)continue;
        const count=Math.ceil(d);let clear=true;
        for(let k=0;k<=count;k++) if(!c.walk(o.x+(x-o.x)*k/count,o.y+(y-o.y)*k/count)){clear=false;break;}
        if(clear){window.qaSpring={pathIndex:n,pathLength:p.length,pathRatio:n/p.length,walkSamples:count+1,walkClear:true,nativeFrames:2,settleSteps:5};c.setTarget(x,y);for(let k=0;k<5&&c.state==='play';k++)c.step(1/60);return;}
      }
    }
    throw Error('30%～60% 路徑找不到符合邊距與碰撞條件的彈簧線');
  });
  await render(); await render();
  await shot('L3-play-spring');await start(2);await card('L3-card');
  await page.getByRole('button',{name:lang==='en'?'YOUR FIRST SEMESTER':'看你的第一學期',exact:true}).click();await page.waitForTimeout(400);await shot('final');
  await start(0);await page.evaluate(()=>__cl.play());await page.keyboard.press('Escape');await shot('paused');
  await context.close();
}
evidence.sort((a,b) => ['zh','en'].indexOf(a.lang)-['zh','en'].indexOf(b.lang) || ['desktop','mobile'].indexOf(a.viewport)-['desktop','mobile'].indexOf(b.viewport) || states.indexOf(a.shot)-states.indexOf(b.shot));
const stamp=new Date().toISOString(),commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.writeFileSync(path.join(out,'console.txt'),logs.length?logs.join('\n')+'\n':'No console errors, JS errors, HTTP errors or failed requests.\n');
const files=fs.readdirSync(out).filter(f=>f.endsWith('.webp'));
const dimensions=await Promise.all(files.map(async file=>{const m=await sharp(path.join(out,file)).metadata();return {file,width:m.width,height:m.height,bytes:fs.statSync(path.join(out,file)).size};}));
const bytes=dimensions.reduce((sum,m)=>sum+m.bytes,0);
if(files.length!==56||fs.readdirSync(out).some(f=>f.endsWith('.png'))||bytes>20_000_000||dimensions.some(m=>!(/^(zh|en)-(desktop|mobile)-/.test(m.file))||m.width!==(m.file.includes('-mobile-')?780:1280)||m.height!==(m.file.includes('-mobile-')?1688:720)))throw Error('檔案數、容量或尺寸驗收失敗');
fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({stamp,browser:browser.version(),commit,conversion:{input:'Playwright PNG buffer',output:'WebP',quality:85,resize:false,crop:false,recolour:false},bytes,dimensions,shots:evidence,...(only ? {recapture:{only,stamp,commit,preservedShots:52,priorStamp:prior.stamp,priorCommit:prior.commit}} : {})},null,2));
const columns=['zh-desktop','zh-mobile','en-desktop','en-mobile'];
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>創作不斷線 QA</title><style>body{font-family:system-ui;background:#eee}table{width:100%;table-layout:fixed}td,th{border:1px solid #888;padding:4px}img{width:100%;height:180px;object-fit:contain}th:first-child{width:130px}</style><h1>創作不斷線：56 張狀態對照</h1><p>${stamp} · Chromium ${browser.version()} · commit ${commit}</p><p>手機為 390×844、DPR 2 觸控模擬；尚非真手機確認。點圖可看原圖。</p><table><tr><th>狀態</th>${columns.map(c=>`<th>${c}</th>`).join('')}</tr>${states.map(s=>`<tr><th>${s}</th>${columns.map(c=>`<td><a href="${c}-${s}.webp"><img loading="lazy" src="${c}-${s}.webp" alt="${c}-${s}"></a></td>`).join('')}</tr>`).join('')}</table>`);
const gallery=await browser.newPage();await gallery.goto(`http://127.0.0.1:8765/${path.relative(process.cwd(),out).replaceAll('\\','/')}/index.html`);
await gallery.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode();}));});
const galleryCount=await gallery.locator('img').evaluateAll(a=>a.filter(i=>i.complete&&i.naturalWidth>0).length);
const result={webp:files.length,png:fs.readdirSync(out).filter(f=>f.endsWith('.png')).length,bytes,MB:bytes/1e6,dimensionsValid:true,gallery:galleryCount,sparks:evidence.filter(e=>e.shot==='L1-fail').map(e=>e.sparks),spring:evidence.filter(e=>e.shot==='L3-play-spring').map(e=>({lang:e.lang,viewport:e.viewport,state:e.state,orb:e.orb,target:e.target,distance:e.distance,line:e.line,tilt:e.tilt,selection:e.selection})),logs};
console.log(JSON.stringify(result,null,2));
fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2));
if(galleryCount!==56||logs.length||result.sparks.some(n=>n<1))throw Error('對照表、主控台或火花驗收失敗');
} finally {await browser.close();}
