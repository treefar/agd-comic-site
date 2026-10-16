// 《六樓出口》老師關卡端到端冒煙：無頭 Chrome（CDP）走真實流程
// 走完導覽圈 → 第 6 站接受動畫老師邀請 → 亂按 62 秒 → 有沒有發卡、手帳 1/5 → 第 3 站開 3D 關卡再按 × 離開 → 預存 5 張卡看隱藏結局
// 用法：先開本機伺服器（例：npx http-server . -p 8090 -c-1），再 node scripts/exit6-teacher-e2e.mjs [http://localhost:8090]
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = (process.argv[2] || "http://localhost:8090") + "/exit6/index.html?seed=1";
const OUT = join(tmpdir(), "exit6-e2e"); mkdirSync(OUT, { recursive: true });
const PORT = 9334, prof = join(tmpdir(), "exit6-e2e-prof-" + Date.now());
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`,
  "--no-first-run", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(path, method = "GET") { for (let i = 0; i < 40; i++) { try { return await (await fetch(`http://127.0.0.1:${PORT}${path}`, { method })).json(); } catch { await sleep(250); } } throw new Error("Chrome 沒有回應"); }

const results = []; const ok = (name, pass, info = "") => { results.push({ name, pass, info }); console.log(`${pass ? "✔" : "✘"} ${name}${info ? "：" + info : ""}`); };
try {
  const t = await api("/json/new?about:blank", "PUT");
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id) { pend.get(d.id)?.(d); pend.delete(d.id); }
    if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.exception?.description?.split("\n")[0] || d.params.exceptionDetails.text);
    if (d.method === "Log.entryAdded" && d.params.entry.level === "error" && !/favicon/.test(d.params.entry.url || "")) errors.push(d.params.entry.text + " " + (d.params.entry.url || "")); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: `(async () => { ${expr} })()`, returnByValue: true, awaitPromise: true }); return r.result?.result?.value; };
  const shot = async (n) => { const s = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(join(OUT, n + ".png"), Buffer.from(s.result.data, "base64")); };
  await send("Runtime.enable"); await send("Log.enable"); await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 760, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(2000);
  await ev(`localStorage.removeItem("exit6-save-v1")`); await send("Page.navigate", { url: BASE }); await sleep(2000);

  const H = `const W=(ms)=>new Promise(r=>setTimeout(r,ms)); const $=(i)=>document.getElementById(i);
    const closeCard=()=>{ if(!$("card").classList.contains("hidden")) $("cardOk").click(); const sh=$("sheet"); if(!sh.classList.contains("hidden")) sh.querySelector("[data-close]")?.click(); };`;
  // 導覽圈
  const where = await ev(`${H} $("go").click(); await W(2600);
    for (let k=0;k<10;k++){ for (const b of document.querySelectorAll('#spots .spot:not(.done):not(.deliver):not(.clue)')) { b.click(); await W(80); }
      closeCard(); if ($("where").textContent.startsWith("第 1 圈")) break; $("btnFwd").click(); await W(2500); }
    return $("where").textContent;`);
  ok("走完導覽圈進第 1 圈", /^第 1 圈/.test(where), where);

  // 往前到第 6 站（第 1 圈的異常若錯過會跳卡片，關掉繼續）
  const at6 = await ev(`${H} for (let k=0;k<12 && !/D0646/.test($("where").textContent);k++){ closeCard(); $("btnFwd").click(); await W(2500); closeCard(); await W(300); }
    return [$("where").textContent, $("invite").classList.contains("hidden"), $("invite").textContent];`);
  ok("第 6 站出現動畫老師邀請", at6 && !at6[1] && /動畫老師/.test(at6[2]), JSON.stringify(at6));
  ok("邀請鈕顯示專長代稱、沒有老師本名", at6 && !/陳慶鴻/.test(at6[2]));

  const opened = await ev(`${H} $("invite").click(); await W(400); $("sheet").querySelector("[data-mg]").click(); await W(2500);
    return [!$("mg").classList.contains("hidden"), $("mgRoot").childElementCount, !!(window.EXIT6_MG||{})["mg-anim"]];`);
  ok("接受挑戰後開出小遊戲覆蓋層並掛上 mg-anim", opened && opened[0] && opened[1] > 0 && opened[2], JSON.stringify(opened));
  await shot("1-anim-start");

  // 亂按 62 秒（按住／放開空白鍵與點擊）
  await ev(`const root=document.getElementById("mgRoot"); window.__m=setInterval(()=>{ const r=root.getBoundingClientRect(); const o={bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2,pointerId:1,isPrimary:true,button:0,buttons:1};
    const el=document.elementFromPoint(o.clientX,o.clientY)||root; el.dispatchEvent(new PointerEvent("pointerdown",o)); setTimeout(()=>el.dispatchEvent(new PointerEvent("pointerup",o)), 150+Math.random()*500); }, 700); return 1;`);
  await sleep(64000);
  const fin = await ev(`clearInterval(window.__m); const W=(ms)=>new Promise(r=>setTimeout(r,ms)); await W(2000); const b=document.getElementById("mgResult");
    return [!b.classList.contains("hidden"), b.innerText.replace(/\\s+/g," ").slice(0,160), JSON.parse(localStorage.getItem("exit6-save-v1")||"{}").cards];`);
  await shot("2-anim-result");
  ok("小遊戲結束後出現結果畫面", fin && fin[0], fin && fin[1]);
  const won = fin && /簽名卡|再次挑戰成功/.test(fin[1]);
  ok(won ? "贏了：存檔有動畫老師的卡" : "這局輸了：存檔不該有卡", won ? (fin[2] || []).some((c) => c.id === "anim") : !(fin[2] || []).length, JSON.stringify(fin && fin[2]));

  const back = await ev(`${H} document.querySelector("#mgResult [data-back]").click(); await W(800);
    const st=[$("mg").classList.contains("hidden"), $("mgRoot").childElementCount]; $("nbBtn").click(); await W(400);
    const txt=$("sheet").innerText; $("sheet").querySelector("[data-close]").click(); return [...st, (txt.match(/老師簽名卡（\\d\\/5）/)||[""])[0]];`);
  ok("回走廊：覆蓋層關閉、小遊戲已拆掉", back && back[0] && back[1] === 0, JSON.stringify(back));
  ok("手帳顯示簽名卡數量", back && back[2] === (won ? "老師簽名卡（1/5）" : "老師簽名卡（0/5）"), back && back[2]);

  // 3D 關卡：第 7 站→下一圈第 3 站
  const at3 = await ev(`${H} for (let k=0;k<14 && !/中庭牌樓/.test($("where").textContent) || $("where").textContent.startsWith("導覽");k++){ closeCard(); $("btnFwd").click(); await W(2500); closeCard(); await W(300); if(/中庭牌樓/.test($("where").textContent)) break; }
    $("invite").click(); await W(400); $("sheet").querySelector("[data-mg]").click(); await W(6000);
    return [$("where").textContent, typeof THREE, !!$("mgRoot").querySelector("canvas"), $("mgRoot").innerText.slice(0,40)];`);
  await shot("3-3d");
  ok("3D 關卡載入 Three.js 並畫出 canvas", at3 && at3[1] === "object" && at3[2], JSON.stringify(at3));
  const closed = await ev(`${H} $("mgClose").click(); await W(800); return [$("mg").classList.contains("hidden"), $("mgRoot").childElementCount, $("btnFwd").disabled];`);
  ok("按 × 離開 3D 關卡回走廊、按鈕可用", closed && closed[0] && closed[1] === 0 && closed[2] === false, JSON.stringify(closed));

  // 第 4 站繪本、第 5 站視傳：小遊戲會改容器樣式，宿主的內層容器要保住尺寸（2026-10-16 mg-book 把容器改成 relative 會塌成 0 高）
  for (const [station, mg, sel] of [["D0604", "mg-book", "canvas"], ["海報櫥窗", "mg-type", "input"]]) {
    const r = await ev(`${H} for (let k=0;k<4 && !/${station}/.test($("where").textContent);k++){ closeCard(); $("btnFwd").click(); await W(2500); closeCard(); await W(300); }
      $("invite").click(); await W(400); $("sheet").querySelector("[data-mg]").click(); await W(2500);
      const el=$("mgRoot").querySelector("${sel}"); const box=$("mgRoot").getBoundingClientRect(); const e=el&&el.getBoundingClientRect();
      const out=[$("where").textContent, Math.round(box.height), e?Math.round(e.height):0, e?Math.round(e.top-box.top):-1];
      $("mgClose").click(); await W(600); return out;`);
    ok(`${mg}：容器保有高度、${sel} 在畫面內`, r && r[1] > 100 && r[2] > 20 && r[3] >= 0 && r[3] < r[1], JSON.stringify(r));
  }

  // 預存 5 張卡 → 手帳有「重看隱藏結局」→ 結局出現
  await ev(`localStorage.setItem("exit6-save-v1", JSON.stringify({ dex: [], clears: 0, cards: ["book","type","anim","3d","code"].map(id=>({id,best:100})) })); return 1;`);
  await send("Page.navigate", { url: BASE }); await sleep(2000);
  const end = await ev(`${H} $("go").click(); await W(2600); $("nbBtn").click(); await W(400); const n=$("sheet").innerText.match(/老師簽名卡（\\d\\/5）/)?.[0];
    $("sheet").querySelector("[data-ending]")?.click(); await W(600); return [n, $("sheet").innerText.slice(0,60), [...$("sheet").querySelectorAll("a")].map(a=>a.getAttribute("href"))];`);
  await shot("4-ending");
  ok("集滿 5 張：手帳 5/5 並能打開隱藏結局", end && end[0] === "老師簽名卡（5/5）" && /隱藏結局/.test(end[1]), JSON.stringify(end));
  // 主角旁白與第一輪減量（2026-10-16）：重新開局，S0 旁白 → 點必點物件主角說一句 → S1 只亮 1 個 → 循環圈點彩蛋
  await ev(`localStorage.removeItem("exit6-save-v1"); return 1;`);
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 760, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(2000);
  const st = await ev(`${H} $("go").click(); await W(800); const n0=$("narr").textContent; await W(2000);
    document.querySelector("#spots .spot:not(.done)").click(); await W(300); const say0=$("narr").textContent;
    $("btnFwd").click(); await W(1200); const n1=$("narr").textContent; await W(1500);
    const spots1=document.querySelectorAll("#spots .spot:not(.deliver):not(.clue)").length; return [n0, say0, n1, spots1];`);
  await shot("6-narr-s1");
  ok("到站旁白：電梯與系辦門口各有主角內心話", st && /6 樓/.test(st[0]) && /系辦/.test(st[2]), JSON.stringify(st && [st[0], st[2]]));
  ok("點必點物件：主角說一句", st && st[1] === "6 樓，到了。系辦就在這一層。", st && st[1]);
  ok("第一輪系辦門口只亮 1 個物件", st && st[3] === 1, st && String(st[3]));
  const egg = await ev(`${H} document.querySelector("#spots .spot:not(.done)").click(); await W(300);
    for (let k=0;k<10;k++){ for (const b of document.querySelectorAll('#spots .spot:not(.done):not(.deliver):not(.clue)')) { b.click(); await W(80); }
      closeCard(); if ($("where").textContent.startsWith("第 1 圈")) break; $("btnFwd").click(); await W(2500); }
    $("btnFwd").click(); await W(2600); closeCard();
    const r=$("stage").getBoundingClientRect(); const x=r.left+r.width*0.33, y=r.top+r.height*0.31;
    document.elementFromPoint(x,y).dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:x,clientY:y})); await W(300);
    const nr=$("narr").getBoundingClientRect(), sr=$("stage").getBoundingClientRect();
    return [$("where").textContent, $("narr").textContent, $("narr").classList.contains("off"), Math.round(nr.top - sr.bottom)];`);
  await shot("7-egg");
  ok("循環圈點系辦門口左側海報：主角說一句（彩蛋）", egg && /系辦門口/.test(egg[0]) && egg[1] === "左邊這張藍色海報，構圖好有氣勢。" && !egg[2], JSON.stringify(egg));
  ok("旁白框在畫面下方、不蓋畫面（電腦尺寸）", egg && egg[3] >= 0, egg && `旁白上緣距畫面下緣 ${egg[3]}px`);

  // 實驗室支線（2026-10-16）：第 5 站 D0637 → 漫畫背景開場 → 掛上小遊戲 → ×離開；再換成「必定三星」的假遊戲驗結算與成就牆
  const lab = await ev(`${H} for (let k=0;k<12 && !/海報櫥窗/.test($("where").textContent);k++){ closeCard(); $("btnFwd").click(); await W(2500); closeCard(); await W(300); }
    const btn=$("labBtn"); const r0=[$("where").textContent, btn.classList.contains("hidden"), btn.textContent];
    btn.click(); await W(500); const intro=$("mgRoot").querySelector(".labintro"); const bg=intro?getComputedStyle(intro).backgroundImage:"";
    $("mgRoot").querySelector("[data-labgo]").click(); await W(2500);
    const mounted=!!(window.EXIT6_MG||{})["lab-d0637"] && $("mgRoot").querySelector(".mgstage")?.childElementCount>0;
    $("mgClose").click(); await W(600); return [...r0, /lab_d0637/.test(bg), mounted, $("mg").classList.contains("hidden")];`);
  ok("第 5 站出現「進入 D0637」並開出漫畫背景、掛上小遊戲、×可離開", lab && !lab[1] && /D0637/.test(lab[2]) && lab[3] && lab[4] && lab[5], JSON.stringify(lab));
  const star = await ev(`${H} const g=window.EXIT6_MG["lab-d0637"]; const keep=g.mount;
    g.mount=(root,api)=>{ setTimeout(()=>api.onEnd({win:true,score:999999,flawless:true}),200); return {destroy(){}}; };
    $("labBtn").click(); await W(400); $("mgRoot").querySelector("[data-labgo]").click(); await W(3600);
    const res=$("mgResult"); const out=[res.classList.contains("hidden"), res.querySelector(".labstars")?.textContent, res.innerText.replace(/\\s+/g," ").slice(0,120)];
    res.querySelector("[data-back]").click(); await W(600); g.mount=keep;
    $("nbBtn").click(); await W(400); const wall=($("sheet").innerText.match(/實驗室成就（\\d+\\/15 星）[^\\n]*/)||[""])[0]; $("sheet").querySelector("[data-close]").click();
    const saved=JSON.parse(localStorage.getItem("exit6-save-v1")||"{}").achv; return [...out, wall, JSON.stringify(saved)];`);
  ok("實驗室結算：過關＋高分＋零失誤＝★★★，存檔與手帳成就牆記到 3 星與稱號", star && !star[0] && star[1] === "★★★" && /3\/15 星/.test(star[3]) && /實驗室訪客/.test(star[3]) && /"d0637":\{"stars":3/.test(star[4]), JSON.stringify(star));

  // 手機直拿：手帳卡冊不超出畫面
  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  const mob = await ev(`${H} $("sheet").querySelector("[data-close]")?.click(); await W(300); $("nbBtn").click(); await W(500);
    const g=document.querySelector(".cardgrid").getBoundingClientRect(); return [Math.round(g.left), Math.round(g.right), innerWidth, document.documentElement.scrollWidth, $("coach").classList.contains("hidden")];`);
  await shot("5-mobile-notebook");
  ok("手機：卡冊在畫面內、沒有左右捲動、開手帳時黃框藏起來", mob && mob[0] >= 0 && mob[1] <= mob[2] && mob[3] <= mob[2] && mob[4], JSON.stringify(mob));
  ok("沒有 JavaScript 錯誤", errors.length === 0, errors.slice(0, 5).join(" | "));
  ws.close();
} catch (e) { ok("測試流程本身", false, e.message); }
finally { chrome.kill(); await sleep(400); try { rmSync(prof, { recursive: true, force: true }); } catch {} }
console.log(`截圖：${OUT}`);
process.exit(results.every((r) => r.pass) ? 0 : 1);
