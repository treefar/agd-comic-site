// 驗收用自動試玩：node autoplay.cjs <repo根目錄> [query字串，例 "?lang=en" 或 "?tune=1"] [desktop|mobile]
// 自帶靜態伺服器，不需要 http-server；Playwright 借用 Codex clone 的 node_modules
const http = require("http"), fs = require("fs"), path = require("path");

const root = path.resolve(process.argv[2]), query = process.argv[3] || "", vp = process.argv[4] || "desktop";
const { chromium } = require(path.join(process.env.AGD_QA_NODE_MODULES || path.join(root,'node_modules'),'playwright'));
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript", ".json": "application/json; charset=utf-8", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".ogg": "audio/ogg" };
const srv = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" }); res.end(b); });
});
srv.listen(0, "127.0.0.1", async () => {
  const port = srv.address().port, url = `http://127.0.0.1:${port}/play/creative-line/index.html${query}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext(vp === "mobile" ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });
  page.on("response", (r) => { if (r.status() >= 400 && r.url().includes("127.0.0.1")) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.goto(url);
  await page.waitForFunction(() => window.__cl && window.__cl.state === "cover", null, { timeout: 20000 });
  const info = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, hasTuning: typeof window.__cl.tuning, hasStats: typeof window.__cl.stats, tunePanel: !!document.querySelector("[id*=tun], [class*=tun]") }));
  const out = [];
  for (let i = 0; i < 3; i++) {
    const r = await page.evaluate(({ i, speed, lead }) => {
      const c = window.__cl; c.startLevel(i); c.play();
      const P = c.path, seg = [0];
      for (let k = 1; k < P.length; k++) seg.push(seg[k - 1] + Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]));
      const total = seg[seg.length - 1];
      const at = (s) => { if (s >= total) return P[P.length - 1]; let k = seg.findIndex((v) => v > s); if (k < 1) k = 1; const a = P[k - 1], b = P[k], f = (s - seg[k - 1]) / (seg[k] - seg[k - 1] || 1); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
      let s = 0, frames = 0; const dt = 1 / 60;
      while (c.state === "play" && frames < 60 * 180) { s += speed * dt; const p = at(s + lead); c.setTarget(p[0], p[1]); c.step(dt); frames++; }
      return { level: i, state: c.state, fails: c.fails, ink: Math.round(c.ink * 10) / 10, pathLen: Math.round(total), simSec: Math.round(frames / 6) / 10, stats: c.stats ? JSON.parse(JSON.stringify(c.stats)) : null };
    }, { i, speed: 60, lead: 6 });
    await page.waitForTimeout(1200);
    r.after = await page.evaluate(() => window.__cl.state);
    out.push(r);
  }
  if (process.argv[5] === "brief") console.log(vp, query || "(no query)", JSON.stringify(info), out.map((l) => `L${l.level + 1}:${l.state}/fails=${l.fails}/ink=${l.ink}/then=${l.after}`).join(" "), "errors=" + errs.length, errs.join(" | "));
  else console.log(JSON.stringify({ url: url.replace(/:\d+/, ":PORT"), vp, info, levels: out, errors: errs }, null, 1));
  await browser.close(); srv.close();
});
