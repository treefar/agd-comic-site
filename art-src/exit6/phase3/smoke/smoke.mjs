// 小遊戲雛形冒煙測試：無頭 Chrome（CDP）同時開 5 個試玩頁，亂按 62 秒，收集錯誤、截圖、檢查結束畫面與「再玩一次」
// 用法：node smoke/smoke.mjs [baseUrl]   預設 http://localhost:8082/_agy-mg/mg
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || "http://localhost:8082/_agy-mg/mg";
const IDS = ["mg-anim", "mg-code", "mg-book", "mg-type", "mg-3d"];
const OUT = new URL("./out/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
mkdirSync(OUT, { recursive: true });
const PORT = 9333;
const prof = join(tmpdir(), "exit6-smoke-" + Date.now());
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, "--no-first-run", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "--window-size=1280,720", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(path, method = "GET") {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}${path}`, { method }); return await r.json(); } catch { await sleep(250); }
  }
  throw new Error("Chrome 沒有回應");
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    else listeners.forEach((f) => f(d));
  };
  const ready = new Promise((r) => (ws.onopen = r));
  return {
    ready, on: (f) => listeners.push(f), close: () => ws.close(),
    send: (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }),
  };
}

// 頁面內的亂按程式：點 #root 內隨機位置、按方向鍵與空白、偶爾點 root 裡的按鈕
const MONKEY = `(() => {
  const root = document.getElementById("root") || document.body;
  const keys = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","Enter"];
  window.__monkey = setInterval(() => {
    const r = root.getBoundingClientRect();
    const x = r.left + Math.random() * r.width, y = r.top + Math.random() * r.height;
    const el = document.elementFromPoint(x, y) || root;
    const o = { bubbles: true, clientX: x, clientY: y, pointerId: 1, pointerType: "mouse", isPrimary: true, button: 0, buttons: 1 };
    el.dispatchEvent(new PointerEvent("pointerdown", o)); el.dispatchEvent(new MouseEvent("mousedown", o));
    setTimeout(() => { el.dispatchEvent(new PointerEvent("pointerup", o)); el.dispatchEvent(new MouseEvent("mouseup", o)); el.dispatchEvent(new MouseEvent("click", o)); }, 120 + Math.random() * 300);
    const k = keys[Math.floor(Math.random() * keys.length)];
    document.dispatchEvent(new KeyboardEvent("keydown", { key: k, code: k === " " ? "Space" : k, bubbles: true }));
    setTimeout(() => document.dispatchEvent(new KeyboardEvent("keyup", { key: k, code: k === " " ? "Space" : k, bubbles: true })), 200);
    if (Math.random() < 0.25) { const bs = [...root.querySelectorAll("button")].filter(b => b.offsetParent && !/再玩/.test(b.textContent)); if (bs.length) bs[Math.floor(Math.random()*bs.length)].click(); }
  }, 280);
})()`;

async function runOne(id) {
  const t = await json(`/json/new?about:blank`, "PUT");
  const c = cdp(t.webSocketDebuggerUrl); await c.ready;
  const errors = [];
  c.on((d) => {
    if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.exception?.description?.split("\n")[0] || d.params.exceptionDetails.text);
    if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") errors.push("console.error: " + d.params.args.map((a) => a.value ?? a.description).join(" "));
    if (d.method === "Log.entryAdded" && d.params.entry.level === "error") errors.push("log: " + d.params.entry.text + " " + (d.params.entry.url || ""));
  });
  await c.send("Runtime.enable"); await c.send("Log.enable"); await c.send("Page.enable"); await c.send("Page.bringToFront");
  const shot = async (name) => { const s = await c.send("Page.captureScreenshot", { format: "png" }); writeFileSync(join(OUT, `${id}-${name}.png`), Buffer.from(s.result.data, "base64")); };
  const ev = async (expr) => (await c.send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;

  // 手機直拿版面
  await c.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await c.send("Page.navigate", { url: `${BASE}/${id}/index.html` }); await sleep(2500);
  const mobile = await ev(`(() => { const r = document.getElementById("root")?.getBoundingClientRect(); return { sw: document.documentElement.scrollWidth, root: r && [Math.round(r.left), Math.round(r.right), Math.round(r.width), Math.round(r.height)] }; })()`);
  await shot("mobile");

  // 電腦版：亂按 62 秒
  await c.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await c.send("Page.navigate", { url: `${BASE}/${id}/index.html` }); await sleep(2000);
  const api = await ev(`(() => { const g = (window.EXIT6_MG||{})["${id}"]; return g && { title: g.title, skill: g.skill, seconds: g.seconds }; })()`);
  await shot("t02");
  const fps = await ev(`new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else r(n); }; requestAnimationFrame(f); })`);
  if (process.argv[4] !== "idle") await ev(MONKEY);
  await sleep(10000); await shot("t12");
  await sleep(25000); await shot("t37");
  await sleep(28000);
  await ev(`clearInterval(window.__monkey)`); await sleep(1500);
  const endText = await ev(`document.body.innerText.slice(0, 600)`);
  await shot("end");
  const hasReplay = await ev(`!![...document.querySelectorAll("button")].find(b => /再玩/.test(b.textContent))`);
  // 再玩一次 → 3 秒後還要能動、沒錯誤
  await ev(`[...document.querySelectorAll("button")].find(b => /再玩/.test(b.textContent))?.click()`); await sleep(3000);
  await shot("replay");
  const replayText = await ev(`document.body.innerText.slice(0, 300)`);
  c.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`).catch(() => {});
  return { id, api, fps, mobile, hasReplay, endText, replayText, errors: [...new Set(errors)].slice(0, 12) };
}

try {
  await json("/json/version");
  const only = process.argv[3] ? process.argv[3].split(",") : IDS;
  const results = []; for (const id of only) results.push(await runOne(id));
  writeFileSync(join(OUT, "report.json"), JSON.stringify(results, null, 2));
  for (const r of results) {
    console.log(`\n== ${r.id} ${r.api ? r.api.title : "（沒有 EXIT6_MG 介面）"}`);
    console.log(`每秒畫面更新：${r.fps}`);
    console.log(`手機：scrollWidth ${r.mobile.sw}，root ${JSON.stringify(r.mobile.root)}`);
    console.log(`結束後有「再玩一次」：${r.hasReplay}`);
    console.log(`結束畫面文字：${(r.endText || "").replace(/\s+/g, " ").slice(0, 220)}`);
    console.log(`錯誤 ${r.errors.length} 筆：${r.errors.join(" | ").slice(0, 400)}`);
  }
} finally {
  chrome.kill();
  await sleep(500);
  try { rmSync(prof, { recursive: true, force: true }); } catch {}
}
