// 回歸測試：英文資料檔與中文版結構一致、受保護欄位未改；試玩區清單指到的檔案都存在
// 執行：node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8").replace(/^﻿/, ""));
const PROTECTED = new Set(["id", "slug", "key", "code", "color", "photo", "photoFallback", "image", "email", "ext", "date", "en", "nameEn", "titleEn"]);

function sameShape(a, b, where) {
  assert.equal(Array.isArray(a), Array.isArray(b), `型別不同 ${where}`);
  if (Array.isArray(a)) {
    assert.equal(a.length, b.length, `陣列長度不同 ${where}`);
    a.forEach((x, i) => sameShape(x, b[i], `${where}[${i}]`));
  } else if (a && typeof a === "object") {
    assert.deepEqual(Object.keys(b), Object.keys(a), `鍵不同 ${where}`);
    for (const k of Object.keys(a)) {
      if (PROTECTED.has(k) && typeof a[k] !== "object") assert.equal(b[k], a[k], `受保護欄位被改 ${where}.${k}`);
      else sameShape(a[k], b[k], `${where}.${k}`);
    }
  } else if (typeof a !== "string") {
    assert.equal(b, a, `非字串值被改 ${where}`);
  }
}

for (const name of ["faculty", "curriculum", "labs", "works", "videos", "stats", "news", "admission"]) {
  test(`data/en/${name}.json 與中文版結構一致`, () => {
    sameShape(read(`data/${name}.json`), read(`data/en/${name}.json`), name);
  });
}

test("play.json 每款遊戲的入口與封面都存在、層級有效", () => {
  const play = read("data/play.json");
  const tiers = new Set(play.tiers.map((t) => t.key));
  assert.ok(play.games.length > 0);
  for (const g of play.games) {
    assert.ok(tiers.has(g.tier), `${g.id} 的 tier 無效`);
    assert.ok(g.title.zh && g.title.en, `${g.id} 缺中英標題`);
    if (g.mode !== "link") assert.ok(fs.existsSync(path.join(root, g.src)), `${g.id} 找不到 ${g.src}`);
    if (g.poster) assert.ok(fs.existsSync(path.join(root, g.poster)), `${g.id} 找不到封面 ${g.poster}`);
  }
});

test("創作不斷線：碰撞遮罩三段都從起點連到終點", () => {
  const src = fs.readFileSync(path.join(root, "play/creative-line/masks.js"), "utf8");
  const MASKS = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  for (const name of ["lab_d0637", "lab_d0604", "lab_d0633"]) {
    const m = MASKS[name];
    assert.ok(m, `缺 ${name}`);
    for (const plane of ["normal", "coarse"]) {
      const bits = Buffer.from(m[plane], "base64");
      const ok = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && (bits[(y * m.w + x) >> 3] >> ((y * m.w + x) & 7)) & 1;
      const s = m.start.map((v) => Math.round(v / m.cell)), e = m.end.map((v) => v / m.cell);
      assert.ok(ok(s[0], s[1]), `${name}/${plane} 起點不在可走區`);
      const seen = new Set([s.join()]), q = [s];
      let reach = false;
      while (q.length && !reach) {
        const [x, y] = q.shift();
        if (Math.hypot(x - e[0], y - e[1]) < 9) reach = true;
        for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = [x + a, y + b]; if (ok(...k) && !seen.has(k.join())) { seen.add(k.join()); q.push(k); } }
      }
      assert.ok(reach, `${name}/${plane} 起點走不到終點`);
      // 障礙一定要存在：可走格不能超過全畫面的 45%（防止遮罩漏到牆上或整張圖）
      let n = 0; for (let i = 0; i < m.w * m.h; i++) n += (bits[i >> 3] >> (i & 7)) & 1;
      assert.ok(n < m.w * m.h * 0.45, `${name}/${plane} 可走區過大（${n} 格），可能漏色`);
    }
  }
});

test("創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡", () => {
  const base = path.join(root, "play/creative-line");
  for (const k of ["orb", "spark", "confetti", "stamp"]) assert.ok(fs.existsSync(path.join(base, `art/fx2/${k}.png`)), `缺 art/fx2/${k}.png`);
  for (const k of ["lab_d0637", "lab_d0604", "lab_d0633", "s0"]) assert.ok(fs.existsSync(path.join(base, `art/scene/${k}.webp`)), `缺 art/scene/${k}.webp`);
  const lv = fs.readFileSync(path.join(base, "levels.js"), "utf8");
  const cur = read("data/curriculum.json").tracks.flatMap((t) => t.courses.flat().map((c) => c.name));
  for (const m of lv.matchAll(/course: \{ name: "([^"]+)"/g)) assert.ok(cur.includes(m[1]), `課程「${m[1]}」不在 curriculum.json`);
  for (const m of lv.matchAll(/labSlug: "([^"]+)"/g)) assert.ok(read("data/labs.json").some((x) => x.slug === m[1]), `labs 沒有 ${m[1]}`);
  assert.ok(read("data/faculty.json").some((x) => x.slug === "chiangyamei"), "faculty 沒有 chiangyamei");
  // 三關要有三種不同的玩法
  assert.deepEqual([...lv.matchAll(/twist: "(\w+)"/g)].map((m) => m[1]), ["step", "ink", "spring"]);
  assert.ok(read("data/works.json").some((x) => x.id === "stolen-recipe"), "works 沒有 stolen-recipe");
});

test("bundle.js 已包含英文頁與試玩區", () => {
  const b = fs.readFileSync(path.join(root, "bundle.js"), "utf8");
  for (const s of ["PlayZone", "EnglishIntro", "en/faculty", "play/zone"]) assert.ok(b.includes(s), `bundle 缺 ${s}`);
});

test('試玩區：五款都有雙語製作與授權欄位',()=>{
  for(const g of read('data/play.json').games)for(const k of ['team','year','license','credit'])for(const lang of ['zh','en']){
    assert.equal(typeof g[k]?.[lang],'string',`${g.id}.${k}.${lang}`);assert.ok(g[k][lang].trim(),`${g.id}.${k}.${lang} 空白`);
  }
});

const tuningExpected = {
  common: { grabRadius:68,touchOffset:40,orbHitRadius:10,failFreeze:0.25,rewind:0.25,forgiveAfterFails:2,ghostAfterFails:3,checkpointAfterFails:6,checkpointRatio:0.25,maxSpeed:900 },
  step:{interval:0.083,maxJump:48},
  ink:{sampleMs:50,angleMouse:70,angleTouch:90,costMouse:10,costTouch:7,regenAngle:30,regenPerSample:1.5,minSpeed:80,lowInk:30,shakeInk:15},
  spring:{omega:14,zeta:0.85,afterimageMinSpeed:100,tiltMaxDeg:2.5,tiltSpeedDiv:160},stars:{maxFails:2}
};
test('創作不斷線：調校預設鍵與原值完整',()=>{
  const context={window:{},URLSearchParams,location:{search:''}};vm.runInNewContext(fs.readFileSync(path.join(root,'play/creative-line/tuning.js'),'utf8'),context);
  for(const [group,values] of Object.entries(tuningExpected))for(const [key,value] of Object.entries(values)){
    assert.equal(typeof context.window.TUNING[group][key],'number',`${group}.${key}`);
    assert.equal(context.window.TUNING[group][key],value,`${group}.${key} 原值改動`);
  }
});

test('創作不斷線：瀏覽器通關、即時調校、持久化與公開版隔離',async()=>{
  const { chromium }=await import('playwright');const {createServer}=await import('node:http');
  const tmp=path.join(root,'work-orders/20261021/reports/browser-tmp');fs.mkdirSync(tmp,{recursive:true});
  const server=createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{const ext=path.extname(file);res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.json':'application/json','.webp':'image/webp','.png':'image/png'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const oldEnv={TEMP:process.env.TEMP,TMP:process.env.TMP,TMPDIR:process.env.TMPDIR};
  process.env.TEMP=process.env.TMP=process.env.TMPDIR=tmp;
  let browser;
  try{
    browser=await chromium.launch();
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
    await page.addInitScript(()=>{performance.now=()=>1000;requestAnimationFrame=cb=>{window.qaFrame=cb;return 1;};});
    const url=`http://127.0.0.1:${server.address().port}/play/creative-line/index.html`;
    const load=async query=>{await page.goto(url+query);await page.waitForFunction(()=>window.__cl?.state==='cover',null,{polling:50});};
    await load('');assert.equal(await page.locator('#cl-tune').count(),0);
    const wins=await page.evaluate(()=>{const result=[];for(let i=0;i<3;i++){__cl.startLevel(i);__cl.play();const p=__cl.path;for(const q of p){__cl.setTarget(...q);for(let j=0;j<30&&__cl.state==='play'&&Math.hypot(__cl.orb.x-q[0],__cl.orb.y-q[1])>.8;j++)__cl.step(1/60);if(__cl.state!=='play')break;}if(__cl.state==='play'){__cl.setTarget(...p.at(-1));for(let j=0;j<120&&__cl.state==='play';j++)__cl.step(1/60);}result.push({level:i+1,state:__cl.state,fails:__cl.fails});}return result;});
    assert.ok(wins.every(r=>r.state==='won'&&r.fails===0));console.log('AUTO-PLAY',JSON.stringify(wins));
    await load('?tune=1');assert.equal(await page.locator('input[type=range]').count(),Object.values(tuningExpected).reduce((n,g)=>n+Object.keys(g).length,0));
    const jitter=()=>page.evaluate(()=>{__cl.startLevel(1);__cl.play();const b={...__cl.orb};for(let i=0;i<6;i++){__cl.setTarget(b.x+(i%2?8:-8),b.y);__cl.step(.05);}return {ink:__cl.ink,count:__cl.stats.jitterCount};});
    const before=await jitter();await page.locator('[data-key="ink.costTouch"]').evaluate(e=>{e.value='14';e.dispatchEvent(new Event('input',{bubbles:true}));});const after=await jitter();
    assert.equal(before.count,after.count);assert.equal(100-after.ink,2*(100-before.ink));console.log('JITTER',JSON.stringify({before,after}));
    await page.getByRole('button',{name:'複製 JSON',exact:true}).click();const exported=await page.getByRole('textbox',{name:'調校 JSON'}).inputValue();assert.equal(JSON.parse(exported).ink.costTouch,14);
    const sandbox={window:{}};vm.runInNewContext('window.TUNING = '+exported+';',sandbox);assert.equal(sandbox.window.TUNING.ink.costTouch,14);
    await page.route('**/creative-line/tuning.js',route=>route.fulfill({contentType:'text/javascript',body:'window.TUNING = '+exported+';\n'+fs.readFileSync(path.join(root,'play/creative-line/tuning.js'),'utf8').split('(() => {')[1].replace(/^/,'(() => {')}));
    await load('');assert.equal(await page.evaluate(()=>__cl.tuning.ink.costTouch),14);assert.equal(await page.evaluate(()=>__cl.state),'cover');await page.unroute('**/creative-line/tuning.js');
    await load('?tune=1');assert.equal(await page.evaluate(()=>__cl.tuning.ink.costTouch),14);
    await load('');assert.equal(await page.evaluate(()=>__cl.tuning.ink.costTouch),7);
    await load('?tune=1');await page.getByRole('button',{name:'還原預設',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('cl-tuning')),null);assert.equal(await page.evaluate(()=>__cl.tuning.ink.costTouch),7);
    await page.getByRole('button',{name:'收合',exact:true}).click();assert.equal(await page.locator('input[type=range]').first().isVisible(),false);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));for(const [k,v] of Object.entries(oldEnv)){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
});
test('創作不斷線：手感常數不可寫死回遊戲',()=>{
  const s=fs.readFileSync(path.join(root,'play/creative-line/game.js'),'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'');
  assert.ok(!/\b0\.083\b/.test(s));assert.ok(!/\b14\s*,\s*\w+\s*=\s*0\.85\b/.test(s));
  for(const [group,keys] of Object.entries(tuningExpected))for(const key of Object.keys(keys)){
    // orbHitRadius 是規格保留欄位，v2 遮罩原實作僅查中心，不在本工單改碰撞規則。
    if(key!=='orbHitRadius')assert.ok(s.includes(`tuning.${group}.${key}`),`${group}.${key} 未接入`);
  }
});
