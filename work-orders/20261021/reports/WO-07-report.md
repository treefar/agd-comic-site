# WO-07 彈簧線可見度修復

2026-10-21，TF-GO。從 7ee07e3 建立 codex/wo-07-spring-line；不推送、不修改 main。

採用 #1a1712、4px、6 5 虛線，加 #f4ecd8、8px 實線底線。墨黑對比米白地板，米白描邊對比深色平台與藍牆，沿用漫畫色系。兩條線共用原始座標與透明度公式，REDUCED 保留 0.4。

## 可重跑驗證

下列程式僅讀圖片像素、啟動瀏覽器並更新 verification.json；背景探針只改當次瀏覽器的既有兩條線，不寫圖片、不改遊戲檔。

```js
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import sharp from 'sharp';
const dir='docs/qa/creative-line/20261021';
process.env.TEMP=process.env.TMP=process.env.TMPDIR=path.resolve(dir,'browser-tmp');
const browser=await chromium.launch({headless:true});
const evidence=JSON.parse(fs.readFileSync(dir+'/evidence.json'));
const result={autoplay:[],pixelSamples:[],backgroundProbes:[],reduced:[],errors:[]};
const round=n=>Math.round(n*100)/100;
async function samples(buffer, matrix, line, distances) {
 const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const len=Math.hypot(line.x2-line.x1,line.y2-line.y1),ux=(line.x2-line.x1)/len,uy=(line.y2-line.y1)/len;
 const map=(x,y)=>({x:matrix.a*x+matrix.c*y+matrix.e,y:matrix.b*x+matrix.d*y+matrix.f});
 const a=map(line.x1,line.y1),b=map(line.x2,line.y2),sl=Math.hypot(b.x-a.x,b.y-a.y),nx=-(b.y-a.y)/sl,ny=(b.x-a.x)/sl;
 const pixel=(x,y)=>{x=Math.round(x);y=Math.round(y);const k=(y*info.width+x)*info.channels;const rgb=[...data.subarray(k,k+3)];return {x,y,rgb,Y:round(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)};};
 return distances.map(d=>{const p=map(line.x1+ux*d,line.y1+uy*d),on=pixel(p.x,p.y),off=pixel(p.x+nx*6,p.y+ny*6);return {distance:d,on,off,delta:round(Math.abs(on.Y-off.Y))};});
}
try {
for(const mobile of [false,true]) {
 const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile});
 const page=await ctx.newPage();
 page.on('pageerror',e=>result.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)result.errors.push('HTTP '+r.status()+' '+r.url())});page.on('requestfailed',r=>result.errors.push('NETWORK '+r.url()));
 await page.addInitScript(()=>{performance.now=()=>1000;requestAnimationFrame=cb=>{window.qaFrame=cb;return 1}});
 await page.goto('http://127.0.0.1:8765/play/creative-line/index.html');await page.waitForFunction(()=>window.__cl?.state==='cover',null,{polling:50});await page.evaluate(()=>document.fonts.ready);
 for(let level=0;level<3;level++) {
 const r=await page.evaluate(level=>{const c=__cl;c.startLevel(level);c.play();const p=c.path;for(const point of p){if(c.state!=='play')break;c.setTarget(...point);for(let k=0;k<30&&c.state==='play'&&Math.hypot(c.orb.x-point[0],c.orb.y-point[1])>.8;k++)c.step(1/60)}if(c.state==='play'){c.setTarget(...p.at(-1));for(let k=0;k<120&&c.state==='play';k++)c.step(1/60)}return {level:level+1,state:c.state,fails:c.fails,pathPoints:p.length}},level);
 result.autoplay.push({device:mobile?'mobile':'desktop',...r});if(r.state!=='won'||r.fails!==0)throw Error('autoplay failed');
 await page.waitForFunction(()=>__cl.state==='card',null,{polling:50});
 }
 for(const shot of evidence.shots.filter(s=>s.viewport===(mobile?'mobile':'desktop')&&s.shot==='L3-play-spring')) {
 const matrix=await page.evaluate(shot=>{document.querySelector('.scene').style.transform=shot.tilt;const m=document.querySelector('line:last-child').getScreenCTM(),d=devicePixelRatio;return Object.fromEntries(['a','b','c','d','e','f'].map(k=>[k,m[k]*d]));},shot);
 const file=shot.lang+'-'+shot.viewport+'-L3-play-spring.webp';
 const points=await samples(fs.readFileSync(dir+'/'+file),matrix,shot.line,[36,69,102,135,168]);
 const baseline=execFileSync('git',['show','codex/wo-01-screenshots-webp:'+dir+'/'+file],{maxBuffer:5e6});
 result.pixelSamples.push({file,matrix,points,baselinePoints:await samples(baseline,matrix,shot.line,[36,69,102,135,168])});
 }
 // 現有兩條線的靜態顯示探針；不新增物件、不改遊戲檔，也不寫圖片。
 await page.evaluate(()=>__cl.startLevel(2));await page.evaluate(()=>document.querySelector('.scene').style.transform='rotate(0deg)');
 for(const probe of [{name:'米白地板',x1:45,y1:630,x2:205,y2:630},{name:'深色平台',x1:450,y1:540,x2:610,y2:540},{name:'藍色牆面',x1:850,y1:180,x2:1010,y2:180}]) {
 const matrix=await page.evaluate(p=>{for(const line of document.querySelectorAll('line')){for(const k of ['x1','x2','y1','y2'])line.setAttribute(k,p[k]);line.setAttribute('opacity',.7)}const m=document.querySelector('line:last-child').getScreenCTM(),d=devicePixelRatio;return Object.fromEntries(['a','b','c','d','e','f'].map(k=>[k,m[k]*d]));},probe);
 const buf=await page.screenshot();const points=await samples(buf,matrix,probe,[14,47,80,113,146]);
 result.backgroundProbes.push({device:mobile?'mobile':'desktop',...probe,points});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForFunction(()=>window.__cl?.state==='cover',null,{polling:50});
 result.reduced.push(await page.evaluate(()=>{__cl.startLevel(2);__cl.play();__cl.setTarget(__cl.orb.x+100,__cl.orb.y);qaFrame(1000);const active=[...document.querySelectorAll('line')].map(l=>l.getAttribute('opacity'));__cl.startLevel(0);qaFrame(1000);return {active,inactive:[...document.querySelectorAll('line')].map(l=>l.getAttribute('opacity'))}}));
 await ctx.close();
}
const unchanged=fs.readdirSync(dir).filter(f=>f.endsWith('.webp')&&!f.endsWith('-L3-play-spring.webp'));
result.unchangedScreenshots=unchanged.filter(f=>fs.readFileSync(dir+'/'+f).equals(execFileSync('git',['show','codex/wo-01-screenshots-webp:'+dir+'/'+f],{maxBuffer:5e6}))).length;
if(result.unchangedScreenshots!==52||result.errors.length||result.reduced.some(r=>r.active.some(x=>x!=='0.4')||r.inactive.some(x=>x!=='0')))throw Error('驗證失敗');
const v=JSON.parse(fs.readFileSync(dir+'/verification.json'));v.wo07=result;fs.writeFileSync(dir+'/verification.json',JSON.stringify(v,null,2));
console.log(JSON.stringify(result,null,2));
} finally {await browser.close()}
```

## 驗收結果

| 條件 | yes／no | 實際結果 |
|---|---|---|
| 1. game.js 僅修改彈簧線 | yes | 僅建立區塊與座標／透明度更新區塊，完整 diff 如下 |
| 2. 桌機／手機三關沿 path | yes | 6/6 won、fails 0、errors []；手機 390×844、isMobile、hasTouch |
| 3. 4 張重拍與逐圖檢視／取樣 | yes | state play、線長均 ≥80、目標在畫面內；每張 5 點見下表 |
| 4. 其餘 52 張位元組相同 | yes | git show 逐檔 Buffer.equals = 52/52；diff --stat 只有指定 4 張圖片 |
| 5. 測試與範圍 | yes | en-play 12/12；本輪新增／修改均在白名單，原有未追蹤檔保留 |

### 實際指令與輸出

```powershell
node tools/qa/shoot-creative-line.mjs --only L3-play-spring
```

```text
webp=56, gallery=56, png=0, bytes=10314898, dimensionsValid=true, logs=[]
zh/desktop: state=play, distance=188.6429670768703, target=(40,628), opacity=0.7
zh/mobile: state=play, distance=189.7450964301949, target=(40,620), opacity=0.7
en/desktop: state=play, distance=188.6429670768703, target=(40,628), opacity=0.7
en/mobile: state=play, distance=189.7450964301949, target=(40,620), opacity=0.7
```

```powershell
$source = Get-Content work-orders/20261021/reports/WO-07-report.md -Raw
$code = [regex]::Match($source, '(?s)```js\r?\n(.*?)\r?\n```').Groups[1].Value
$code | node --input-type=module
```

輸出（完整像素 RGB、座標及 Y 在 verification.json 的 wo07 欄位）：

```json
{
  "autoplay": [
    {
      "device": "desktop",
      "level": 1,
      "state": "won",
      "fails": 0,
      "pathPoints": 290
    },
    {
      "device": "desktop",
      "level": 2,
      "state": "won",
      "fails": 0,
      "pathPoints": 105
    },
    {
      "device": "desktop",
      "level": 3,
      "state": "won",
      "fails": 0,
      "pathPoints": 325
    },
    {
      "device": "mobile",
      "level": 1,
      "state": "won",
      "fails": 0,
      "pathPoints": 290
    },
    {
      "device": "mobile",
      "level": 2,
      "state": "won",
      "fails": 0,
      "pathPoints": 105
    },
    {
      "device": "mobile",
      "level": 3,
      "state": "won",
      "fails": 0,
      "pathPoints": 325
    }
  ],
  "reduced": [
    {
      "active": [
        "0.4",
        "0.4"
      ],
      "inactive": [
        "0",
        "0"
      ]
    },
    {
      "active": [
        "0.4",
        "0.4"
      ],
      "inactive": [
        "0",
        "0"
      ]
    }
  ],
  "errors": [],
  "unchangedScreenshots": 52
}
```

第一次輔助驗證腳本因凍結 RAF 卻使用預設 RAF 輪詢而逾時；改成 polling:50 後重跑通過，未修改遊戲邏輯。

```powershell
node --test tests/en-play.test.mjs
```

```text
✔ data/en/faculty.json 與中文版結構一致 (3.9381ms)
✔ data/en/curriculum.json 與中文版結構一致 (2.2886ms)
✔ data/en/labs.json 與中文版結構一致 (1.2747ms)
✔ data/en/works.json 與中文版結構一致 (1.2785ms)
✔ data/en/videos.json 與中文版結構一致 (0.9858ms)
✔ data/en/stats.json 與中文版結構一致 (1.9039ms)
✔ data/en/news.json 與中文版結構一致 (1.8615ms)
✔ data/en/admission.json 與中文版結構一致 (1.3539ms)
✔ play.json 每款遊戲的入口與封面都存在、層級有效 (1.5273ms)
✔ 創作不斷線：碰撞遮罩三段都從起點連到終點 (58.3914ms)
✔ 創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡 (4.858ms)
✔ bundle.js 已包含英文頁與試玩區 (0.9112ms)
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 152.8708
```

### 完整 game.js diff

```powershell
git diff codex/wo-01-screenshots-webp..HEAD -- play/creative-line/game.js
```

以下為本次提交的完整內容（提交前以 git diff codex/wo-01-screenshots-webp -- play/creative-line/game.js 擷取，提交後重驗相同）：

```diff
diff --git a/play/creative-line/game.js b/play/creative-line/game.js
index ab64d27..2b8fd21 100644
--- a/play/creative-line/game.js
+++ b/play/creative-line/game.js
@@ -35,7 +35,8 @@
   const inkLine = document.createElementNS(svg.namespaceURI, "polyline"); // 玩家拖出的墨線＝玩法資料
   Object.entries({ fill: "none", stroke: "#0f0d0a", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }).forEach(([k, v]) => inkLine.setAttribute(k, v)); svg.appendChild(inkLine);
   const blots = document.createElementNS(svg.namespaceURI, "g"); svg.appendChild(blots);
-  const springLine = document.createElementNS(svg.namespaceURI, "line"); springLine.setAttribute("stroke", "#f4ecd8"); springLine.setAttribute("stroke-width", 2); springLine.setAttribute("stroke-dasharray", "6 5"); svg.appendChild(springLine);
+  const springUnderlay = document.createElementNS(svg.namespaceURI, "line"); springUnderlay.setAttribute("stroke", "#f4ecd8"); springUnderlay.setAttribute("stroke-width", 8); svg.appendChild(springUnderlay);
+  const springLine = document.createElementNS(svg.namespaceURI, "line"); springLine.setAttribute("stroke", "#1a1712"); springLine.setAttribute("stroke-width", 4); springLine.setAttribute("stroke-dasharray", "6 5"); svg.appendChild(springLine);
   const goal = img("art/fx2/stamp.png", "goal", scene, 84);
   const ghost = img("art/fx2/orb.png", "ghost", scene, 50); ghost.style.opacity = 0;
   const afters = [0, 1, 2, 3, 4].map(() => { const i = img("art/fx2/orb.png", "after", scene, 50); i.style.opacity = 0; return i; });
@@ -282,8 +283,8 @@
     const life = lv && lv.twist === "step" ? 0.33 : 0.15, base = lv && lv.twist === "step" ? [0.5, 0.35, 0.2, 0.1] : [0.45, 0.35, 0.25, 0.15, 0.05];
     afters.forEach((a, i) => { const q = afterQ[i]; const keep = REDUCED ? i < 2 : true; if (q && keep && t - q.born < life && state === "play") { a.style.opacity = base[i] ?? 0; a.style.transform = `translate(${q.x - 25}px, ${q.y - 25}px)`; } else a.style.opacity = 0; });
     if (ghostT >= 0 && path) { const p = path[Math.min(path.length - 1, Math.floor((ghostT / 1.2) * path.length))]; ghost.style.opacity = 0.35; ghost.style.transform = `translate(${p[0] - 25}px, ${p[1] - 25}px)`; }
-    if (lv && lv.twist === "spring" && state === "play" && target) { const dist = Math.hypot(target.x - orb.x, target.y - orb.y); springLine.setAttribute("x1", orb.x); springLine.setAttribute("y1", orb.y); springLine.setAttribute("x2", target.x); springLine.setAttribute("y2", target.y); springLine.setAttribute("opacity", REDUCED ? 0.4 : Math.min(0.7, 0.2 + dist / 160)); }
-    else springLine.setAttribute("opacity", 0);
+    if (lv && lv.twist === "spring" && state === "play" && target) { const dist = Math.hypot(target.x - orb.x, target.y - orb.y); for (const line of [springUnderlay, springLine]) { line.setAttribute("x1", orb.x); line.setAttribute("y1", orb.y); line.setAttribute("x2", target.x); line.setAttribute("y2", target.y); line.setAttribute("opacity", REDUCED ? 0.4 : Math.min(0.7, 0.2 + dist / 160)); } }
+    else for (const line of [springUnderlay, springLine]) line.setAttribute("opacity", 0);
     if (lv && lv.twist === "spring" && !REDUCED) { tilt += ((state === "play" ? Math.max(-2.5, Math.min(2.5, orb.vx / 160)) : 0) - tilt) * 0.12; scene.style.transform = `rotate(${tilt.toFixed(2)}deg)`; }
     if (lv && lv.twist === "ink") { inkFill.style.width = ink + "%"; inkbar.classList.toggle("low", ink < 30); inkbar.classList.toggle("shake", ink < 15 && !REDUCED); inkLine.setAttribute("stroke-width", ink < 30 ? 4 : 7); inkLine.setAttribute("opacity", ink < 30 ? 0.55 : 0.9); }
     stat.textContent = `${T.time} ${fmt(lvTime)}　${T.fails} ${lvFails}`;
```

### 四張人工目視描述

- zh-desktop：左下光點向左上方目標延伸，墨黑虛線在米白地板上清楚，底線貼合線身。
- en-desktop：左下光點與左側目標之間的虛線清楚，線身不再與淺色地板混合。
- zh-mobile：置中縮小場景的左下地板可見斜向虛線；縮小後線較細，仍能辨識與光點相連。
- en-mobile：置中場景左下的墨黑虛線可見，與米白地板有明顯對比，未裁掉目標端。

### 每張沿線 5 點亮度差

只用 sharp 解碼讀像素，未改圖。Y = 0.2126 R + 0.7152 G + 0.0722 B，範圍 0～255，為 sRGB 編碼值加權亮度，非線性 WCAG 相對亮度。取自光點端往目標方向 36、69、102、135、168 個世界座標 px（均落於 6 5 虛線實段中心），用 getScreenCTM 與 DPR 換算實際圖檔位置並四捨五入。旁點沿線法向偏移 6 個「圖檔像素」，比較絕對亮度差。取樣座標、RGB、Y 與矩陣均存 verification.json；保留傾斜角與手機留黑邊。

| 圖片 | 舊圖 5 點 ΔY | 新圖 5 點 ΔY |
|---|---|---|
| zh-desktop-L3-play-spring.webp | 2.07、0.15、3.35、1.71、9.22 | 142.48、147.05、152.05、147.48、135.48 |
| en-desktop-L3-play-spring.webp | 2.79、0.15、4.35、0.71、9.22 | 138.76、145.76、153.34、148.55、140.48 |
| zh-mobile-L3-play-spring.webp | 19.5、5.07、23.78、1.07、2.29 | 76.29、49.77、123.34、99.48、147.62 |
| en-mobile-L3-play-spring.webp | 16.43、5.07、22.57、1.72、0.29 | 76.29、48.77、125.41、99.63、148.42 |

舊圖從指定基底分支 git show 讀取，同一組取樣點全部提升。這也量化重現原始對比不足。

### 三種背景與 REDUCED

以現有兩條線在當次瀏覽器進行固定座標顯示探針，不新增繪圖物件、不產出額外圖片檔，也不聲稱是可行走路徑。地板 (45,630)→(205,630)、平台 (450,540)→(610,540)、牆面 (850,180)→(1010,180)，opacity 0.7。額外開啟僅存記憶體的斜線探針影像 (430,180)→(550,650) 目視：淺底靠深虛線、深平台靠淺描邊、藍牆可循雙色線辨識。固定背景探針的中心線對旁邊 6px 取樣如下；平台中心差可能低，不能只拿中心差代表描邊效果。

| 裝置 | 背景 | 5 點 ΔY |
|---|---|---|
| desktop | 米白地板 | 141.61、149.82、144.82、148.61、150.97 |
| desktop | 深色平台 | 6.2、27.35、11.91、6.87、10.43 |
| desktop | 藍色牆面 | 27.32、114.43、118.42、18.05、15.81 |
| mobile | 米白地板 | 36.91、35.55、9.3、34.55、41.2 |
| mobile | 深色平台 | 53.22、79.36、80.01、62.93、88.92 |
| mobile | 藍色牆面 | 24.9、28.25、47.46、34.05、34.82 |

REDUCED 是 reload 後實際 matchMedia reduce 測試：桌機與手機兩條 active opacity 均為 [0.4,0.4]，離開第 3 關均為 [0,0]。

### 檔案範圍與限制

原有未追蹤項目：docs/qa/creative-line/20261021/browser-tmp/ 與 work-orders/20261021/ 下 codex-last-message-run2.txt、codex-last-message-run3.txt、codex-prompt-run2.txt、codex-prompt-run3.txt、codex-prompt-run4.txt。保留未提交，沒有白名單外的新變動；browser-tmp 原本即存在，僅供瀏覽器暫存。

未跑正式 build：本次為靜態遊戲 JS 線條修正，已用 Chromium 直接載入、三關自動試玩與既有 Node 測試驗證。未測真手機與玩家實際拖曳手感，這是最不確定的一件事。

不生成美術、不推送、不改既有分支、不刪任何既有檔案；提交後切回 feature/en-site-and-play-zone，關閉本輪預覽伺服器。

提交前實際範圍輸出（提交後以 git diff --stat codex/wo-01-screenshots-webp..HEAD 重驗）：

```text
 .../20261021/en-desktop-L3-play-spring.webp        |  Bin 298604 -> 298604 bytes
 .../20261021/en-mobile-L3-play-spring.webp         |  Bin 130470 -> 130746 bytes
 docs/qa/creative-line/20261021/evidence.json       |   22 +-
 docs/qa/creative-line/20261021/index.html          |    2 +-
 docs/qa/creative-line/20261021/verification.json   | 1880 +++++++++++++++++++-
 .../20261021/zh-desktop-L3-play-spring.webp        |  Bin 300498 -> 300478 bytes
 .../20261021/zh-mobile-L3-play-spring.webp         |  Bin 130868 -> 131090 bytes
 play/creative-line/game.js                         |    7 +-
 tools/qa/shoot-creative-line.mjs                   |   12 +-
 work-orders/20261021/reports/WO-07-report.md       |  280 +++
 10 files changed, 2186 insertions(+), 17 deletions(-)
```

```powershell
git status --short
```

```text
M  docs/qa/creative-line/20261021/en-desktop-L3-play-spring.webp
M  docs/qa/creative-line/20261021/en-mobile-L3-play-spring.webp
M  docs/qa/creative-line/20261021/evidence.json
M  docs/qa/creative-line/20261021/index.html
M  docs/qa/creative-line/20261021/verification.json
M  docs/qa/creative-line/20261021/zh-desktop-L3-play-spring.webp
M  docs/qa/creative-line/20261021/zh-mobile-L3-play-spring.webp
M  play/creative-line/game.js
M  tools/qa/shoot-creative-line.mjs
A  work-orders/20261021/reports/WO-07-report.md
?? docs/qa/creative-line/20261021/browser-tmp/
?? work-orders/20261021/codex-last-message-run2.txt
?? work-orders/20261021/codex-last-message-run3.txt
?? work-orders/20261021/codex-prompt-run2.txt
?? work-orders/20261021/codex-prompt-run3.txt
?? work-orders/20261021/codex-prompt-run4.txt
```
