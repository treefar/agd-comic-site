/* 創作不斷線 v2 — 電流急急棒玩法的原創致敬（2026-10-21）
   場景：六樓出口的實驗室實景漫畫圖；特效：Codex 實景漫畫風 fx2；按鈕：純文字（比照六樓出口，使用者於對話選擇）。
   三關 twist 依 C:/agywork/agd-game-research/claude/out/creative-line-levels.md：
     1 偶動畫＝逐格步進（12 格／秒）　2 電繪＝墨量與抖動　3 體感＝慣性彈簧
   碰撞用 masks.js；網址參數 ?lang=en 英文版 */
(() => {
  const W = 1280, H = 720;
  const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
  const COARSE = matchMedia("(pointer: coarse)").matches;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = document.getElementById("world"), fit = document.getElementById("fit");
  const T = {
    zh: { title: "創作不斷線", kicker: "動畫與遊戲設計系 · 實驗室闖關", cap: "按住<b>光點</b>，沿著實驗室的桌面和地板拖到<b>紅色印章</b>。碰到器材或離開桌面就回起點，放手就暫停。三關三種手感，每過一關解鎖一門課。",
      grab: "按住光點開始", start: "開始", paused: "暫停中．按住光點繼續", time: "時間", fails: "失誤", pause: "暫停", sound: "音效", mute: "靜音",
      unlocked: "解鎖課程", best: "最佳", next: "下一關", retry: "再玩這關", toFinal: "看你的第一學期", finalT: "你的第一學期", finalP: "三門課都是動遊系真的有開的課。想知道四年完整怎麼學，看課程地圖。",
      map: "看完整課程地圖", again: "再玩一次", ghost: "跟著淡淡的光軌走看看", cp: "幫你往前移了一段（這關最多 2 星）", steady: "穩住", credit: "場景：樹德科大動遊系實驗室實景照片轉漫畫（沿用《六樓出口》）",
      anim: "動畫創作軸線", art: "原創美術軸線", game: "遊戲開發軸線", star3: "3 星條件：過關、失誤 2 次內、限時內" },
    en: { title: "LINE UNBROKEN", kicker: "ANIMATION & GAME DESIGN · LAB RUN", cap: "Hold the <b>spark</b> and drag it across the lab's tables and floor to the <b>red stamp</b>. Touch the gear or leave the surface and you restart; let go to pause. Three stages, three different feels, one real course each.",
      grab: "Hold the spark to start", start: "START", paused: "Paused · hold the spark to continue", time: "Time", fails: "Misses", pause: "Pause", sound: "Sound", mute: "Muted",
      unlocked: "COURSE UNLOCKED", best: "Best", next: "NEXT", retry: "RETRY", toFinal: "YOUR FIRST SEMESTER", finalT: "Your First Semester", finalP: "All three are real courses in our department. See the curriculum map for the full four years.",
      map: "CURRICULUM MAP", again: "PLAY AGAIN", ghost: "Follow the faint trail", cp: "Moved you forward a bit (max 2 stars here)", steady: "Steady", credit: "Scenes: real photos of our labs turned into comics (shared with Sixth-Floor Exit)",
      anim: "Animation Stream", art: "Original Art Stream", game: "Game Design Stream", star3: "3 stars: clear, 2 misses or fewer, beat the time" }
  }[LANG];

  /* ---------- DOM ---------- */
  const el = (tag, cls, parent = world, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const img = (src, cls, parent, w, h) => { const i = el("img", cls, parent); i.src = src; i.alt = ""; if (w) { i.style.width = w + "px"; i.style.height = (h || w) + "px"; } return i; };
  const tbtn = (label, cls, parent, onTap) => { const b = el("button", "tbtn " + (cls || ""), parent); b.type = "button"; b.textContent = label;
    b.addEventListener("pointerdown", (e) => e.stopPropagation()); b.addEventListener("click", (e) => { e.stopPropagation(); ensureAudio(); onTap(); }); return b; };
  function fitWorld() { const k = Math.min(innerWidth / W, innerHeight / H); world.style.transform = `scale(${k})`; fit.style.width = W * k + "px"; fit.style.height = H * k + "px"; }
  addEventListener("resize", fitWorld); fitWorld();

  const scene = el("div", "scene"), bg = img("", "bg", scene);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "ov"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); scene.appendChild(svg);
  const inkLine = document.createElementNS(svg.namespaceURI, "polyline"); // 玩家拖出的墨線＝玩法資料
  Object.entries({ fill: "none", stroke: "#0f0d0a", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }).forEach(([k, v]) => inkLine.setAttribute(k, v)); svg.appendChild(inkLine);
  const blots = document.createElementNS(svg.namespaceURI, "g"); svg.appendChild(blots);
  const springLine = document.createElementNS(svg.namespaceURI, "line"); springLine.setAttribute("stroke", "#f4ecd8"); springLine.setAttribute("stroke-width", 2); springLine.setAttribute("stroke-dasharray", "6 5"); svg.appendChild(springLine);
  const goal = img("art/fx2/stamp.png", "goal", scene, 84);
  const ghost = img("art/fx2/orb.png", "ghost", scene, 50); ghost.style.opacity = 0;
  const afters = [0, 1, 2, 3, 4].map(() => { const i = img("art/fx2/orb.png", "after", scene, 50); i.style.opacity = 0; return i; });
  const orbEl = img("art/fx2/orb.png", "orb", scene, 56);
  const flash = el("div", "frameflash", scene);
  const fxLayer = el("div", "layer", scene); fxLayer.style.pointerEvents = "none";
  const hud = el("div", "hud"), tag = el("div", "tag", hud), statBox = el("div", "", hud), stat = el("div", "stat", statBox), inkbar = el("div", "inkbar hide", statBox), inkFill = el("i", "", inkbar);
  const ruleEl = el("div", "rule"), toastEl = el("div", "toast hide"), pauseL = el("div", "pauseL hide"); el("div", "", pauseL).textContent = T.paused;
  const pauseBtn = tbtn(T.pause, "", world, () => { if (state === "play") setState("paused"); }); pauseBtn.className = "iconbtn"; pauseBtn.style.left = "50%"; pauseBtn.style.transform = "translateX(-50%)";
  let muted = false; try { muted = localStorage.getItem("cl-muted") === "1"; } catch (e) {}
  const soundBtn = tbtn(muted ? T.mute : T.sound, "", world, () => { muted = !muted; soundBtn.textContent = muted ? T.mute : T.sound; try { localStorage.setItem("cl-muted", muted ? "1" : "0"); } catch (e) {} if (muted) stopLoops(); });
  soundBtn.className = "iconbtn"; soundBtn.style.left = "calc(50% + 70px)";
  const cover = el("div", "layer cover"), card = el("div", "layer hide");

  /* ---------- 系上資料 ---------- */
  const D = {};
  const clean = (s) => String(s ?? "").replace(/\s*\[CHECK\]/g, "").replace(/\s*\((?=[^()]*[\u3400-\u9fff])[^()]*\)/g, "").replace(/\s{2,}/g, " ").trim();
  async function loadData() {
    const get = (p) => fetch(p).then((r) => r.json()).catch(() => null), b = LANG === "en" ? "../../data/en/" : "../../data/";
    [D.cur, D.labs, D.fac, D.works, D.zhCur] = await Promise.all([get(b + "curriculum.json"), get(b + "labs.json"), get(b + "faculty.json"), get(b + "works.json"), get("../../data/curriculum.json")]);
  }
  function courseName(c) {
    if (LANG === "zh" || !D.cur || !D.zhCur) return c.name;
    for (let t = 0; t < D.zhCur.tracks.length; t++) { const i = D.zhCur.tracks[t].courses.flat().findIndex((x) => x.name === c.name); if (i >= 0) return clean(D.cur.tracks[t].courses.flat()[i].name); }
    return c.name;
  }
  const labName = (slug) => { const x = (D.labs || []).find((a) => a.slug === slug); return x ? clean(x.name) : slug.toUpperCase(); };
  function linkText(l) {
    let extra = "";
    if (l.kind === "lab") extra = `${labName(l.slug)} ${l.slug.toUpperCase()}`;
    if (l.kind === "faculty") { const x = (D.fac || []).find((a) => a.slug === l.slug); if (x) extra = LANG === "en" ? x.en : x.name; }
    if (l.kind === "work") { const x = (D.works || []).find((a) => a.id === l.id); if (x) extra = clean(x.title).replace(/^.*《|》.*$/g, ""); }
    return extra ? `${l.label[LANG]}：${extra}` : l.label[LANG];
  }
  function goSite(hash) { try { if (window.top !== window && window.top.location.host === location.host) { window.top.location.hash = hash; return; } } catch (e) {} location.href = "../../index.html" + hash; }

  /* ---------- 碰撞 ---------- */
  const cache = {};
  function plane(lv, p) { const k = lv.id + p; if (!cache[k]) { const s = atob(MASKS[lv.id][p]), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); cache[k] = a; } return cache[k]; }
  function walk(lv, x, y, p) { const m = MASKS[lv.id], gx = Math.floor(x / m.cell), gy = Math.floor(y / m.cell); if (gx < 0 || gy < 0 || gx >= m.w || gy >= m.h) return false; const i = gy * m.w + gx; return !!(plane(lv, p)[i >> 3] & (1 << (i & 7))); }
  function bfsPath(lv, from, p = "normal") { // 建議路線（幽靈提示與檢查點用）：先在嚴格遮罩找，找不到才用寬鬆的
    const m = MASKS[lv.id], ok = (x, y) => walk(lv, x * m.cell + 2, y * m.cell + 2, p), sx = Math.floor(from[0] / m.cell), sy = Math.floor(from[1] / m.cell), ex = m.end[0] / m.cell, ey = m.end[1] / m.cell;
    const prev = new Int32Array(m.w * m.h).fill(-2), q = [sy * m.w + sx]; prev[q[0]] = -1;
    for (let h = 0; h < q.length; h++) { const c = q[h], x = c % m.w, y = (c / m.w) | 0;
      if (Math.hypot(x - ex, y - ey) < 8) { const pts = []; for (let k = c; k >= 0; k = prev[k]) pts.unshift([(k % m.w) * m.cell + 2, ((k / m.w) | 0) * m.cell + 2]); return pts; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, n = ny * m.w + nx; if (nx >= 0 && ny >= 0 && nx < m.w && ny < m.h && prev[n] === -2 && ok(nx, ny)) { prev[n] = c; q.push(n); } } }
    return p === "normal" ? bfsPath(lv, from, "coarse") : null;
  }

  /* ---------- 音效（Web Audio 合成，原創） ---------- */
  let ac = null, noiseBuf = null; const lastPlay = {};
  function ensureAudio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); const n = ac.sampleRate; noiseBuf = ac.createBuffer(1, n, n); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; } catch (e) {} } if (ac && ac.state === "suspended") ac.resume(); }
  const can = (k) => { if (muted || !ac) return false; const t = performance.now(); if (lastPlay[k] && t - lastPlay[k] < 40) return false; lastPlay[k] = t; return true; };
  function tone(k, f, d, type = "sine", v = 0.1, f2 = 0, att = 0.004) {
    if (!can(k)) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
  }
  function noise(k, d, ftype, freq, v) { if (!can(k)) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime; s.buffer = noiseBuf; f.type = ftype; f.frequency.value = freq; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); s.connect(f).connect(g).connect(ac.destination); s.start(t); s.stop(t + d + 0.02); }
  const loops = {};
  function loop(k, ftype, freq, q = 1) { if (muted || !ac || loops[k]) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = noiseBuf; s.loop = true; f.type = ftype; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; s.connect(f).connect(g).connect(ac.destination); s.start(); loops[k] = { s, f, g }; }
  function loopSet(k, gain, freq) { const L = loops[k]; if (!L) return; L.g.gain.setTargetAtTime(gain, ac.currentTime, 0.03); if (freq) L.f.frequency.setTargetAtTime(freq, ac.currentTime, 0.05); }
  function stopLoops() { for (const k of Object.keys(loops)) { try { loops[k].s.stop(); } catch (e) {} delete loops[k]; } }
  const buzz = (p) => { if (!REDUCED && navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };
  const PENTA = [523, 587, 659, 784, 880];

  /* ---------- 狀態 ---------- */
  let state = "loading", li = 0, lvTime = 0, lvFails = 0, startPt = [0, 0], path = null, cpUsed = false, t = 0;
  let orb = { x: 0, y: 0, vx: 0, vy: 0, s: 1 }, target = null, pressing = false, failT = 0, rewind = null, ghostT = -1, toastT = 0;
  let stepAcc = 0, ink = 100, jit = { acc: 0, last: null, prevV: null }, trail = [], travel = 0, beat = 0, tilt = 0;
  const afterQ = []; let results = [];
  const LV = () => LEVELS[li], M = () => MASKS[LV().id];
  const plan = () => (COARSE || lvFails >= 2 ? "coarse" : "normal");
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  const toast = (s, sec = 2.5) => { toastEl.textContent = s; toastEl.classList.remove("hide"); toastT = sec; };

  function setState(s) {
    state = s;
    cover.classList.toggle("hide", s !== "cover"); card.classList.toggle("hide", s !== "card" && s !== "final");
    const inGame = s !== "cover" && s !== "loading";
    [scene, hud, ruleEl, pauseBtn, soundBtn].forEach((n) => n.classList.toggle("hide", !inGame));
    ruleEl.classList.toggle("hide", s !== "ready"); pauseL.classList.toggle("hide", s !== "paused");
    if (s !== "play") { pressing = false; loopSet("sand", 0); loopSet("wind", 0); }
  }
  function startLevel(i) {
    li = i; lvTime = 0; lvFails = 0; cpUsed = false; stopLoops();
    const lv = LV(); bg.src = lv.img; tag.textContent = lv.intro[LANG]; ruleEl.textContent = lv.rule[LANG];
    startPt = M().start.slice(); path = bfsPath(lv, startPt);
    resetRun(); inkbar.classList.toggle("hide", lv.twist !== "ink");
    goal.style.transform = `translate(${M().end[0] - 42}px, ${M().end[1] - 42}px)`;
    scene.style.filter = ""; scene.style.transform = "";
    setState("ready");
  }
  function resetRun() {
    orb = { x: startPt[0], y: startPt[1], vx: 0, vy: 0, s: 1 }; target = null; stepAcc = 0; ink = 100; jit = { acc: 0, last: null, prevV: null };
    trail = []; travel = 0; inkLine.setAttribute("points", ""); while (blots.firstChild) blots.firstChild.remove(); afterQ.length = 0;
  }
  function newGame() { results = []; startLevel(0); }

  /* ---------- 成敗 ---------- */
  function burst(src, x, y, size, dur, rise = 0) { const i = img(src, "", fxLayer, size); i.style.left = x - size / 2 + "px"; i.style.top = y - size / 2 + "px";
    const a = i.animate([{ transform: "scale(.7)", opacity: 1 }, { transform: `translateY(${-rise}px) scale(1.25)`, opacity: 0 }], { duration: REDUCED ? 200 : dur, easing: "ease-out" }); a.onfinish = () => i.remove(); }
  function fail() {
    lvFails++; const tw = LV().twist;
    burst("art/fx2/spark.png", orb.x, orb.y, 130, 520);
    if (tw === "step") { tone("f", 220, 0.15, "square", 0.09, 165); buzz([20, 30, 20]); }
    if (tw === "ink") { tone("f", 196, 0.18, "sawtooth", 0.07, 150); buzz([30, 40, 30]); if (!REDUCED) inkLine.animate([{ filter: "blur(0)" }, { filter: "blur(4px)", opacity: 0 }], { duration: 220, fill: "forwards" }); }
    if (tw === "spring") { tone("f", 880, 0.25, "sine", 0.08, 220); buzz([15, 20, 15, 20, 15]); }
    if (!REDUCED) world.animate([{ transform: world.style.transform + " translate(0,0)" }, { transform: world.style.transform + " translate(-4px,2px)" }, { transform: world.style.transform + " translate(4px,-2px)" }, { transform: world.style.transform }], { duration: 220 });
    if (lvFails >= 6 && !cpUsed && path) { cpUsed = true; startPt = path[Math.floor(path.length * 0.25)].slice(); toast(T.cp); }
    if (lvFails === 3) { ghostT = 0; toast(T.ghost); }
    rewind = { from: [orb.x, orb.y], t: 0 }; failT = REDUCED ? 0.05 : 0.25; setState("fail");
  }
  function finishRewind() { rewind = null; resetRun(); setState("ready"); }
  function success() {
    const lv = LV(); tone("w1", 523, 0.09); setTimeout(() => tone("w2", 659, 0.09), 90); setTimeout(() => tone("w3", 784, 0.12), 180); setTimeout(() => tone("w4", 1047, 0.18), 270); buzz(40);
    for (let i = 0; i < 3; i++) setTimeout(() => burst("art/fx2/confetti.png", M().end[0] + (i - 1) * 60, M().end[1], 140, 1100, 80), i * 90);
    let best = null; try { best = Number(localStorage.getItem("cl-best-" + lv.id)) || null; if (!best || lvTime < best) { localStorage.setItem("cl-best-" + lv.id, lvTime.toFixed(2)); best = lvTime; } } catch (e) {}
    const stars = [true, lvFails <= 2, lvTime <= lv.starTime && !cpUsed];
    let n = stars.filter(Boolean).length; if (cpUsed) n = Math.min(n, 2);
    results[li] = { stars: n, time: lvTime, fails: lvFails, best };
    setTimeout(() => showCard(), REDUCED ? 100 : 650); setState("won");
  }

  /* ---------- 課程卡與結算 ---------- */
  function starsHTML(n) { return [0, 1, 2].map((i) => (i < n ? `<b class="pop" style="animation-delay:${i * 250}ms">★</b>` : "☆")).join(""); }
  function showCard() {
    const lv = LV(), r = results[li], c = lv.course, last = li === LEVELS.length - 1;
    card.innerHTML = ""; const box = el("div", "card", card);
    img("art/fx2/stamp.png", "stamp", box);
    el("small", "", box).textContent = T.unlocked;
    el("h2", "", box).textContent = courseName(c);
    el("div", "meta", box).textContent = `${T[c.track]} · ${c.term[LANG]} · ${labName(lv.labSlug)} ${lv.labSlug.toUpperCase()}`;
    el("div", "stars", box, starsHTML(r.stars));
    el("div", "meta", box).textContent = `${T.time} ${fmt(r.time)}　${T.best} ${r.best ? fmt(r.best) : "-"}　${T.fails} ${r.fails}　（${T.star3}）`;
    el("p", "", box).textContent = lv.did[LANG];
    const links = el("div", "row", box); lv.links.forEach((l) => tbtn(linkText(l), "light small", links, () => goSite(LANG === "en" ? l.hashEn : l.hash)));
    const row = el("div", "row", box);
    tbtn(last ? T.toFinal : T.next, "", row, () => (last ? showFinal() : startLevel(li + 1)));
    tbtn(T.retry, "light", row, () => startLevel(li));
    if (!REDUCED) box.querySelectorAll(".stars b").forEach((b, i) => setTimeout(() => tone("st" + i, 988, 0.1), 160 + i * 250));
    setState("card");
  }
  function showFinal() {
    card.innerHTML = ""; const box = el("div", "card", card); box.style.width = "760px";
    img("art/fx2/stamp.png", "stamp", box);
    el("small", "", box).textContent = "AGD";
    el("h2", "", box).textContent = T.finalT;
    const s = el("div", "sched", box);
    LEVELS.forEach((lv, i) => { const d = el("div", "", s); d.textContent = courseName(lv.course); el("span", "", d).textContent = `${T[lv.course.track]}`; el("div", "stars", d, starsHTML(results[i] ? results[i].stars : 0)).style.fontSize = "24px"; });
    el("p", "", box).textContent = T.finalP;
    const row = el("div", "row", box);
    tbtn(T.map, "", row, () => goSite(LANG === "en" ? "#/en/curriculum" : "#/curriculum/map"));
    tbtn(T.again, "", row, () => newGame());
    setState("final");
  }
  function buildCover() {
    el("div", "bg", cover); el("div", "tone", cover); el("div", "frameline", cover);
    el("div", "kicker", cover).textContent = T.kicker;
    el("h1", "", cover).textContent = T.title;
    el("div", "caption", cover, T.cap);
    const row = el("div", "startrow", cover);
    const grab = img("art/fx2/orb.png", "", row, 96); grab.style.position = "static"; grab.style.pointerEvents = "auto"; grab.style.cursor = "grab";
    if (!REDUCED) grab.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 1200, iterations: Infinity });
    grab.addEventListener("pointerdown", (e) => { e.stopPropagation(); ensureAudio(); newGame(); });
    tbtn(T.start, "", row, () => newGame());
    el("div", "credit", cover).textContent = T.credit;
  }

  /* ---------- 移動與碰撞 ---------- */
  // 從目前位置掃到 (nx, ny)，每 4px 檢查一次；回傳 false 代表已觸發失敗或過關
  function sweep(nx, ny) {
    const lv = LV(), p = plan(), dx = nx - orb.x, dy = ny - orb.y, d = Math.hypot(dx, dy), n = Math.max(1, Math.ceil(d / 4)), e = M().end;
    for (let i = 1; i <= n; i++) {
      const x = orb.x + (dx * i) / n, y = orb.y + (dy * i) / n;
      if (!walk(lv, x, y, p)) { orb.x = x; orb.y = y; fail(); return false; }
      if (Math.hypot(x - e[0], y - e[1]) < 40) { orb.x = x; orb.y = y; success(); return false; }
    }
    travel += d; orb.x = nx; orb.y = ny; return true;
  }
  const keys = {};
  function update(dt) {
    t += dt;
    if (toastT > 0 && (toastT -= dt) <= 0) toastEl.classList.add("hide");
    if (ghostT >= 0 && path) { ghostT += dt; if (ghostT > 1.2) { ghostT = -1; ghost.style.opacity = 0; } }
    if (orb.s < 1) orb.s = Math.min(1, orb.s + dt * 2);
    const lv = LEVELS[li];
    if (lv && lv.twist === "spring" && ac && !muted && ["ready", "play", "paused"].includes(state)) { beat += dt; if (beat >= 0.667) { beat -= 0.667; const sp = Math.hypot(orb.vx, orb.vy); tone("hb", 55, 0.3, "sine", Math.min(0.18, 0.1 + sp / 4000), 0, 0.01); } }
    if (state === "fail") { failT -= dt; if (failT <= 0) { state = "rewind"; rewind.t = 0; } return; }
    if (state === "rewind") { rewind.t += dt / (REDUCED ? 0.05 : 0.25); const k = Math.min(1, rewind.t), e = 1 - Math.pow(1 - k, 3); orb.x = rewind.from[0] + (startPt[0] - rewind.from[0]) * e; orb.y = rewind.from[1] + (startPt[1] - rewind.from[1]) * e; if (k >= 1) finishRewind(); return; }
    if (state !== "play") return;
    lvTime += dt;
    const kx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), ky = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
    if (kx || ky) { const l = Math.hypot(kx, ky); target = { x: orb.x + (kx / l) * 60, y: orb.y + (ky / l) * 60 }; }
    if (!target) return;
    const tw = lv.twist;
    if (tw === "step") { // 逐格：每 83ms 跳一次，單次最多 48px
      stepAcc += dt;
      while (stepAcc >= 0.083 && state === "play") {
        stepAcc -= 0.083; const dx = target.x - orb.x, dy = target.y - orb.y, d = Math.hypot(dx, dy); if (d < 1) continue;
        const m = Math.min(d, 48), px = orb.x, py = orb.y;
        if (!sweep(orb.x + (dx / d) * m, orb.y + (dy / d) * m)) return;
        tone("click", 880, 0.05, "triangle", 0.09, 0, 0.002); noise("clickn", 0.006, "highpass", 2000, 0.08);
        afterQ.unshift({ x: px, y: py, born: t }); if (afterQ.length > 4) afterQ.pop();
        if (!REDUCED) { flash.style.left = orb.x + "px"; flash.style.top = orb.y + "px"; flash.animate([{ transform: "scale(1)", opacity: 0.8 }, { transform: "scale(1.12)", opacity: 0 }], { duration: 83 }); }
      }
      return;
    }
    if (tw === "ink") { // 跟手（上限 900px/s）；每 50ms 判斷一次抖動
      const dx = target.x - orb.x, dy = target.y - orb.y, d = Math.hypot(dx, dy), m = Math.min(d, 900 * dt), px = orb.x, py = orb.y;
      if (m > 0.5 && !sweep(orb.x + (dx / d) * m, orb.y + (dy / d) * m)) return;
      const moved = Math.hypot(orb.x - px, orb.y - py), sp = moved / dt;
      loop("sand", "bandpass", 2400, 1.2); loopSet("sand", Math.min(0.12, sp / 500 * 0.12));
      const lastPt = trail[trail.length - 1]; if (!lastPt || Math.hypot(orb.x - lastPt[0], orb.y - lastPt[1]) > 4) { trail.push([orb.x, orb.y]); inkLine.setAttribute("points", trail.map((p) => p.join(",")).join(" ")); }
      if (travel >= 120) { travel -= 120; tone("bell", PENTA[Math.floor(t * 3) % 5], 0.18, "sine", 0.08); }
      jit.acc += dt;
      if (jit.acc >= 0.05) {
        const v = jit.last ? [target.x - jit.last[0], target.y - jit.last[1]] : null; jit.last = [target.x, target.y]; const speed = v ? Math.hypot(...v) / jit.acc : 0; jit.acc = 0;
        if (v && jit.prevV && speed > 80) {
          const a = Math.acos(Math.max(-1, Math.min(1, (v[0] * jit.prevV[0] + v[1] * jit.prevV[1]) / (Math.hypot(...v) * Math.hypot(...jit.prevV) || 1)))) * 180 / Math.PI;
          if (a > (COARSE ? 90 : 70)) { ink -= COARSE ? 7 : 10; noise("zz", 0.07, "highpass", 3000, 0.06); buzz(10);
            const c = document.createElementNS(svg.namespaceURI, "circle"); c.setAttribute("cx", orb.x); c.setAttribute("cy", orb.y); c.setAttribute("r", 6 + Math.random() * 3); c.setAttribute("fill", "#0f0d0a"); blots.appendChild(c);
            c.animate([{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 1100, fill: "forwards" }); }
          else if (a < 30) ink = Math.min(100, ink + 1.5);
        }
        if (v) jit.prevV = v;
        if (ink <= 0) { ink = 0; fail(); return; }
      }
      return;
    }
    if (tw === "spring") { // 二階彈簧追隨：ω=14、ζ=0.85
      const w = 14, z = 0.85; let nx = orb.x, ny = orb.y;
      for (let s = 0; s < 4; s++) { const h = dt / 4; orb.vx += (w * w * (target.x - nx) - 2 * z * w * orb.vx) * h; orb.vy += (w * w * (target.y - ny) - 2 * z * w * orb.vy) * h; nx += orb.vx * h; ny += orb.vy * h; }
      const px = orb.x, py = orb.y; if (!sweep(nx, ny)) return;
      const sp = Math.hypot(orb.vx, orb.vy);
      loop("wind", "lowpass", 400, 0.7); loopSet("wind", Math.min(0.1, sp / 600 * 0.1), 400 + Math.min(1400, sp * 2.5));
      if (sp > 100 && (!afterQ[0] || t - afterQ[0].born > 0.03)) { afterQ.unshift({ x: px, y: py, born: t }); if (afterQ.length > 5) afterQ.pop(); }
    }
  }
  function render() {
    const lv = LEVELS[li];
    orbEl.style.transform = `translate(${orb.x - 28}px, ${orb.y - 28}px) scale(${orb.s * (state === "paused" ? 0.85 + 0.15 * Math.abs(Math.sin(t * 2.6)) : state === "ready" ? 1 + Math.sin(t * 5) * 0.08 : 1)})`;
    orbEl.style.opacity = state === "paused" ? 0.6 + 0.4 * Math.abs(Math.sin(t * 2.6)) : 1;
    const life = lv && lv.twist === "step" ? 0.33 : 0.15, base = lv && lv.twist === "step" ? [0.5, 0.35, 0.2, 0.1] : [0.45, 0.35, 0.25, 0.15, 0.05];
    afters.forEach((a, i) => { const q = afterQ[i]; const keep = REDUCED ? i < 2 : true; if (q && keep && t - q.born < life && state === "play") { a.style.opacity = base[i] ?? 0; a.style.transform = `translate(${q.x - 25}px, ${q.y - 25}px)`; } else a.style.opacity = 0; });
    if (ghostT >= 0 && path) { const p = path[Math.min(path.length - 1, Math.floor((ghostT / 1.2) * path.length))]; ghost.style.opacity = 0.35; ghost.style.transform = `translate(${p[0] - 25}px, ${p[1] - 25}px)`; }
    if (lv && lv.twist === "spring" && state === "play" && target) { const dist = Math.hypot(target.x - orb.x, target.y - orb.y); springLine.setAttribute("x1", orb.x); springLine.setAttribute("y1", orb.y); springLine.setAttribute("x2", target.x); springLine.setAttribute("y2", target.y); springLine.setAttribute("opacity", REDUCED ? 0.4 : Math.min(0.7, 0.2 + dist / 160)); }
    else springLine.setAttribute("opacity", 0);
    if (lv && lv.twist === "spring" && !REDUCED) { tilt += ((state === "play" ? Math.max(-2.5, Math.min(2.5, orb.vx / 160)) : 0) - tilt) * 0.12; scene.style.transform = `rotate(${tilt.toFixed(2)}deg)`; }
    if (lv && lv.twist === "ink") { inkFill.style.width = ink + "%"; inkbar.classList.toggle("low", ink < 30); inkbar.classList.toggle("shake", ink < 15 && !REDUCED); inkLine.setAttribute("stroke-width", ink < 30 ? 4 : 7); inkLine.setAttribute("opacity", ink < 30 ? 0.55 : 0.9); }
    stat.textContent = `${T.time} ${fmt(lvTime)}　${T.fails} ${lvFails}`;
  }
  let last = performance.now();
  function frame(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (state !== "loading") { update(dt); render(); } requestAnimationFrame(frame); }

  /* ---------- 輸入 ---------- */
  addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if ((e.key === "p" || e.key === "Escape") && state === "play") setState("paused");
    if (e.key.startsWith("Arrow")) { if (state === "ready" || state === "paused") { ensureAudio(); setState("play"); } e.preventDefault(); }
  });
  addEventListener("keyup", (e) => { keys[e.key] = false; if (e.key.startsWith("Arrow")) target = null; });
  const pos = (e) => { const b = world.getBoundingClientRect(), k = b.width / W; return { x: (e.clientX - b.left) / k, y: (e.clientY - b.top) / k, k }; };
  world.addEventListener("pointerdown", (e) => {
    ensureAudio(); if (state !== "ready" && state !== "paused") return;
    const p = pos(e), off = COARSE ? 40 / p.k : 0;
    if (Math.hypot(p.x - orb.x, p.y - off - orb.y) < 28 + 40) { // 光點外圍 40px 內都算抓到
      pressing = true; world.setPointerCapture(e.pointerId); target = { x: p.x, y: p.y - off }; orb.s = 1.15; buzz(8);
      if (state === "ready" && LV().twist === "ink" && lvFails === 0) toast(T.steady, 2);
      setState("play");
    }
  });
  world.addEventListener("pointermove", (e) => { if (!pressing) return; const p = pos(e), off = COARSE ? 40 / p.k : 0; target = { x: p.x, y: p.y - off }; });
  const release = () => { if (pressing && state === "play") setState("paused"); pressing = false; target = null; orb.vx = orb.vy = 0; };
  world.addEventListener("pointerup", release); world.addEventListener("pointercancel", release);
  world.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("visibilitychange", () => { if (document.hidden && state === "play") setState("paused"); });

  /* ---------- 啟動 ---------- */
  const pre = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = res; i.onerror = () => rej(new Error(src)); i.src = src; });
  Promise.all([...LEVELS.map((l) => pre(l.img)), pre("art/scene/s0.webp"), ...["orb", "spark", "confetti", "stamp"].map((n) => pre(`art/fx2/${n}.png`)), loadData()])
    .then(() => { document.getElementById("loading").remove(); buildCover(); setState("cover"); requestAnimationFrame(frame); })
    .catch((e) => { document.getElementById("loading").textContent = "素材載入失敗：" + e.message; });

  // 自動化測試用
  window.__cl = { get state() { return state; }, get orb() { return orb; }, get li() { return li; }, get fails() { return lvFails; }, get ink() { return ink; }, get results() { return results; },
    get path() { return path; }, newGame, startLevel, step: (dt) => update(dt), play: () => setState("play"), setTarget: (x, y) => { target = { x, y }; }, walk: (x, y) => walk(LV(), x, y, plan()) };
})();
