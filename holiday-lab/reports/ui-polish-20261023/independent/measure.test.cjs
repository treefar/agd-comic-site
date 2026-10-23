const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const req=require('node:module').createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {chromium}=req('playwright'),{measure}=require('./measure.cjs');
test('read-only line measurement distinguishes real clipping and a CJK one-character last line',async()=>{
 const browser=await chromium.launch({headless:true});try{const p=await browser.newPage({viewport:{width:320,height:900}});
 await p.setContent('<main id="lab"><button id="overflow" style="width:30px;white-space:nowrap">An overflowing control label</button><p id="clipped" style="width:20px;white-space:nowrap;overflow:hidden">Clipped full content</p><p id="orphan" style="width:32px;font:16px monospace;word-break:break-all">天地人</p></main>');
 const red=await p.evaluate(measure);assert.ok(red.issues.some(x=>x.kind==='control-text-outside'&&x.selector==='#overflow'));assert.ok(red.issues.some(x=>x.kind==='clipped-text'&&x.selector==='#clipped'));assert.ok(red.orphans.some(x=>x.selector==='#orphan'&&x.lastLine==='人'));
 await p.setContent('<main id="lab"><button id="fits" style="width:260px">A complete control label</button><p id="whole" style="width:260px">Readable full content</p></main>');
 const green=await p.evaluate(measure);assert.deepEqual(green.issues,[]);assert.deepEqual(green.orphans,[]);
 }finally{await browser.close();}
});
