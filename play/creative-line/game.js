/* 創作不斷線 — 電流急急棒玩法的原創致敬切片（起筆章三段）
   畫面全部是核准生圖素材（art/）以網頁元素排版；本檔只做排版、動態文字、輸入與碰撞判定。
   碰撞用 masks.js（由路線圖的米色路面算出）。網址參數：?lang=en 英文版 */
(() => {
  const W = 600, H = 900;
  const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
  const COARSE = matchMedia("(pointer: coarse)").matches;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = document.getElementById("world"), fit = document.getElementById("fit");

  const T = {
    zh: { title: "創作不斷線", sub: "拖著靈感光點，穿過分鏡", start: "開始", hint: "按住光點，沿著路拖到終點", pickup: "按住光點繼續",
      firstHit: "碰到牆會回到起點，第一次不算！", next: "下一段", finish: "看成績", retry: "再玩這段", time: "時間", hits: "碰牆",
      result: "起筆章完成！", again: "再玩一次", map: "看課程地圖", paused: "暫停", course: "你解鎖了這門課", gate: "閘門有節奏，等它離開再過",
      sum: "你解鎖了三門課：手繪動畫、基礎程式設計、遊戲機制與關卡設計。", unit: " 次", core: "核心專業必修", anim: "動畫創作軸線", game: "遊戲開發軸線" },
    en: { title: "LINE UNBROKEN", sub: "Drag the spark through the comic panels", start: "START", hint: "Hold the spark and drag it to the goal", pickup: "Hold the spark to continue",
      firstHit: "Hit a wall and you go back. The first one is free!", next: "NEXT", finish: "RESULTS", retry: "RETRY", time: "Time", hits: "Hits",
      result: "Chapter 1 clear!", again: "PLAY AGAIN", map: "CURRICULUM MAP", paused: "PAUSED", course: "You unlocked this course", gate: "The gate has a rhythm. Wait, then go",
      sum: "Three courses unlocked: Hand-Drawn Animation, Programming Basics, and Game Mechanics & Level Design.", unit: "", core: "Core Required", anim: "Animation Stream", game: "Game Design Stream" }
  }[LANG];

  /* ---------- DOM 小工具 ---------- */
  const el = (tag, cls, parent = world) => { const e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; };
  const pic = (src, x, y, w, h, parent) => { const i = el("img", "", parent); i.src = src; i.alt = ""; Object.assign(i.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" }); return i; };
  const txt = (s, x, y, size, parent, o = {}) => { const d = el("div", "t" + (o.plain ? " plain" : ""), parent); d.textContent = s; Object.assign(d.style, { left: x + "px", top: y + "px", fontSize: size + "px", color: o.color || "", width: o.width ? o.width + "px" : "" }); if (o.sw != null) d.style.setProperty("--sw", o.sw + "px"); return d; };
  const btn = (skin, x, y, w, h, label, size, onTap, parent, aria) => {
    const b = el("button", "btn" + (skin === "btnPrimary" ? " red" : ""), parent); b.type = "button";
    Object.assign(b.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    const i = document.createElement("img"); i.src = `art/ui/${skin}.png`; i.alt = ""; b.appendChild(i);
    if (label) { const s = document.createElement("span"); s.textContent = label; s.style.fontSize = size + "px"; b.appendChild(s); }
    b.setAttribute("aria-label", aria || label); b.addEventListener("click", (e) => { e.stopPropagation(); ensureAudio(); sfx.tap(); onTap(); });
    b.addEventListener("pointerdown", (e) => e.stopPropagation());
    return b;
  };
  const clear = (node) => { while (node.firstChild) node.firstChild.remove(); };

  function fitWorld() {
    const k = Math.min(innerWidth / W, innerHeight / H);
    world.style.transform = `scale(${k})`; fit.style.width = W * k + "px"; fit.style.height = H * k + "px";
  }
  addEventListener("resize", fitWorld); fitWorld();

  /* ---------- 系上資料（名稱讀 data，不手打） ---------- */
  const D = {};
  const clean = (s) => String(s ?? "").replace(/\s*\[CHECK\]/g, "").replace(/\s*\((?=[^()]*[㐀-鿿])[^()]*\)/g, "").replace(/\s{2,}/g, " ").trim();
  async function loadData() {
    const get = (p) => fetch(p).then((r) => r.json()).catch(() => null);
    const b = LANG === "en" ? "../../data/en/" : "../../data/";
    [D.cur, D.labs, D.fac, D.works, D.zhCur] = await Promise.all([get(b + "curriculum.json"), get(b + "labs.json"), get(b + "faculty.json"), get(b + "works.json"), get("../../data/curriculum.json")]);
  }
  function courseName(c) {
    if (LANG === "zh" || !D.cur || !D.zhCur) return c.name;
    for (let t = 0; t < D.zhCur.tracks.length; t++) { const i = D.zhCur.tracks[t].courses.flat().findIndex((x) => x.name === c.name); if (i >= 0) return clean(D.cur.tracks[t].courses.flat()[i].name); }
    return c.name;
  }
  function linkText(l) {
    let extra = "";
    if (l.kind === "lab") { const x = (D.labs || []).find((a) => a.slug === l.slug); if (x) extra = clean(x.name); }
    if (l.kind === "faculty") { const x = (D.fac || []).find((a) => a.slug === l.slug); if (x) extra = LANG === "en" ? x.en : x.name; }
    if (l.kind === "work") { const x = (D.works || []).find((a) => a.id === l.id); if (x) extra = clean(x.title).replace(/^.*《|》.*$/g, ""); }
    const s = extra ? `${l.label[LANG]}：${extra}` : l.label[LANG];
    return s.length > 26 ? s.slice(0, 25) + "…" : s;
  }
  function goSite(hash) {
    try { if (window.top !== window && window.top.location.host === location.host) { window.top.location.hash = hash; return; } } catch (e) {}
    location.href = "../../index.html" + hash;
  }

  /* ---------- 碰撞遮罩 ---------- */
  const bitCache = {};
  function bits(r) {
    const key = r.id + (COARSE ? "c" : "n");
    if (!bitCache[key]) { const b = atob(MASKS[r.id][COARSE ? "coarse" : "normal"]); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); bitCache[key] = a; }
    return bitCache[key];
  }
  function walkable(r, x, y) {
    const m = MASKS[r.id], gx = Math.floor(x / m.cell), gy = Math.floor(y / m.cell);
    if (gx < 0 || gy < 0 || gx >= m.w || gy >= m.h) return false;
    const i = gy * m.w + gx; return !!(bits(r)[i >> 3] & (1 << (i & 7)));
  }
  const gateX = (r, t) => r.gate.cx + Math.sin(t * r.gate.speed / r.gate.amp) * r.gate.amp;
  function onGate(r, x, y, t) { if (!r.gate) return false; const gx = gateX(r, t), hw = r.gate.w / 2 + 10, hh = 16 + 10; return Math.abs(x - gx) < hw && Math.abs(y - r.gate.y) < hh; }

  /* ---------- 音效（原創合成音，使用者點擊後才啟用） ---------- */
  let audio = null, muted = false; try { muted = localStorage.getItem("cl-muted") === "1"; } catch (e) {}
  function ensureAudio() { if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (audio && audio.state === "suspended") audio.resume(); }
  function tone(f, d, type = "sine", v = 0.08, slide = 0) {
    if (muted || !audio) return; const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(audio.destination); o.start(t); o.stop(t + d + 0.02);
  }
  const sfx = { bonk: () => tone(210, 0.16, "triangle", 0.1, -90), node: () => { tone(523, 0.14); setTimeout(() => tone(659, 0.14), 90); setTimeout(() => tone(784, 0.2), 180); }, tap: () => tone(440, 0.06, "square", 0.035) };

  /* ---------- 畫面層 ---------- */
  const stage = el("div", "layer"), bg = pic("", 0, 0, W, H, stage), gate = pic("art/fx/gate.png", 0, 0, 100, 32, stage);
  const trail = [0, 1, 2, 3].map(() => pic("art/fx/orb.png", 0, 0, 44, 44, stage)), orbImg = pic("art/fx/orb.png", 0, 0, 48, 48, stage);
  const fxLayer = el("div", "layer", stage); fxLayer.style.pointerEvents = "none";
  const hud = el("div", "layer", stage); hud.style.pointerEvents = "none";
  const pauseBtn = btn("btnPause", 46, 46, 62, 62, "", 0, () => { if (state === "play") setState("paused"); }, hud, T.paused);
  const soundBtn = btn(muted ? "btnMute" : "btnSound", 118, 46, 62, 62, "", 0, () => { muted = !muted; try { localStorage.setItem("cl-muted", muted ? "1" : "0"); } catch (e) {} soundBtn.querySelector("img").src = `art/ui/${muted ? "btnMute" : "btnSound"}.png`; }, hud, "Sound");
  [pauseBtn, soundBtn].forEach((b) => (b.style.pointerEvents = "auto"));
  const timeT = txt("", 470, 34, 24, hud), hitT = txt("", 500, 68, 20, hud);
  const hintT = txt("", W / 2, H - 70, 22, hud), gateT = txt("", W / 2, H - 38, 17, hud, { sw: 5 }), toastT = txt("", W / 2, 140, 20, hud);
  const pauseL = el("div", "layer hide", stage); txt(T.paused, W / 2, H / 2 - 30, 46, pauseL); txt(T.pickup, W / 2, H / 2 + 24, 24, pauseL);
  const cover = el("div", "layer"), card = el("div", "layer hide"), result = el("div", "layer hide");

  /* ---------- 狀態 ---------- */
  let state = "loading", seg = 0, segTime = 0, totalTime = 0, hits = 0, segHits = 0, freeHitUsed = false, t = 0;
  let orb = { x: 0, y: 0, s: 1 }, target = null, pressing = false, hitstop = 0, shake = 0, toast = 0;
  const hist = [];
  const R = () => ROUTES[seg], M = () => MASKS[R().id];
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;

  function setState(s) {
    state = s;
    cover.classList.toggle("hide", s !== "cover"); card.classList.toggle("hide", s !== "card"); result.classList.toggle("hide", s !== "result");
    pauseL.classList.toggle("hide", s !== "paused"); stage.classList.toggle("hide", s === "cover");
    hintT.textContent = s === "ready" ? T.hint : ""; gateT.textContent = s === "ready" && R().gate ? T.gate : "";
    gate.classList.toggle("hide", !R().gate);
    if (s !== "play") pressing = false;
  }
  function startSeg(i) {
    seg = i; segTime = 0; segHits = 0; target = null; hist.length = 0;
    const st = M().start; orb = { x: st[0], y: st[1], s: 1 }; bg.src = R().art; setState("ready");
  }
  function newGame() { totalTime = 0; hits = 0; freeHitUsed = false; startSeg(0); }
  function burst(src, x, y, size, dur, rise = 0) {
    const i = pic(src, x - size / 2, y - size / 2, size, size, fxLayer);
    const a = i.animate([{ transform: "scale(.8)", opacity: 1 }, { transform: `translateY(${-rise}px) scale(1.25)`, opacity: 0 }], { duration: REDUCED ? 200 : dur, easing: "ease-out" });
    a.onfinish = () => i.remove();
  }
  function hit() {
    sfx.bonk(); hits++; segHits++;
    const free = !freeHitUsed; freeHitUsed = true; if (!free) segTime += 2;
    burst("art/fx/spark.png", orb.x, orb.y, 96, 500);
    if (!REDUCED) { hitstop = 0.05; shake = 0.08; }
    toastT.textContent = free ? T.firstHit : ""; toast = free ? 3 : 0;
    const st = M().start; orb = { x: st[0], y: st[1], s: 0.85 }; target = null; hist.length = 0; setState("ready");
  }
  function arrive() {
    sfx.node(); totalTime += segTime; const e = M().end;
    for (let i = 0; i < 3; i++) setTimeout(() => burst("art/fx/confetti.png", e[0] + (i - 1) * 46, e[1] + 20, 110, 1100, 70), i * 90);
    buildCard(); setState("card");
  }

  /* ---------- 課程卡與成績 ---------- */
  function buildCard() {
    clear(card); const c = R().course, last = seg === ROUTES.length - 1;
    pic("art/ui/panelCard.png", 30, 90, 540, 540, card);
    txt(T.course, W / 2, 150, 20, card, { color: "#e63946", sw: 0 });
    txt(courseName(c), W / 2, 196, LANG === "en" ? 30 : 40, card);
    txt(`${T[c.track] || T.core} · ${c.term[LANG]}`, W / 2, 238, 18, card, { sw: 0 });
    if (c.cardArt) pic(c.cardArt, W / 2 - 75, 262, 150, 150, card);
    txt(c.did[LANG], W / 2, c.cardArt ? 482 : 360, 19, card, { plain: true, width: 440 });
    const stamp = pic("art/fx/stamp.png", 440, 100, 110, 110, card);
    if (!REDUCED) stamp.animate([{ transform: "scale(1.6) rotate(-30deg)", opacity: 0 }, { transform: "scale(1) rotate(-12deg)", opacity: 1 }], { duration: 260, easing: "cubic-bezier(.2,1.6,.4,1)", fill: "forwards" });
    c.links.forEach((l, i) => btn("btnSecondary", W / 2, 668 + i * 52, 380, 48, linkText(l), 16, () => goSite(LANG === "en" ? l.hashEn : l.hash), card));
    const by = 668 + c.links.length * 52 + 30;
    btn("btnPrimary", W / 2 - 104, by, 196, 62, last ? T.finish : T.next, 22, () => (last ? buildResult() : startSeg(seg + 1)), card);
    btn("btnSecondary", W / 2 + 112, by, 176, 62, T.retry, 20, () => { totalTime -= segTime; startSeg(seg); }, card);
  }
  function buildResult() {
    clear(result);
    pic("art/ui/panelResult.png", 30, 120, 540, 440, result);
    txt(T.result, W / 2, 190, 40, result);
    txt(`${T.time}  ${fmt(totalTime)}`, W / 2, 300, 34, result);
    txt(`${T.hits}  ${hits}${T.unit}`, W / 2, 356, 28, result);
    txt(T.sum, W / 2, 450, 19, result, { plain: true, width: 440 });
    btn("btnPrimary", W / 2, 640, 320, 64, T.map, 22, () => goSite(LANG === "en" ? "#/en/curriculum" : "#/curriculum/map"), result);
    btn("btnSecondary", W / 2, 720, 320, 56, T.again, 20, () => newGame(), result);
    setState("result");
  }
  function buildCover() {
    pic("art/web/cover.png", 0, 0, W, H, cover);
    txt(T.title, W / 2, 128, LANG === "en" ? 54 : 70, cover, { color: "#e63946", sw: 12 }).style.webkitTextStroke = "12px #0f0d0a";
    txt(T.sub, W / 2, 196, 22, cover);
    btn("btnPrimary", W / 2, H - 120, 300, 76, T.start, 34, () => newGame(), cover);
  }

  /* ---------- 迴圈 ---------- */
  function update(dt) {
    t += dt;
    if (toast > 0 && (toast -= dt) <= 0) toastT.textContent = "";
    if (hitstop > 0) { hitstop -= dt; return; }
    if (shake > 0) shake -= dt;
    if (orb.s < 1) orb.s = Math.min(1, orb.s + dt * 1.2);
    if (state !== "play") return;
    segTime += dt;
    const kx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), ky = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
    if (kx || ky) { const l = Math.hypot(kx, ky); target = { x: orb.x + (kx / l) * 30, y: orb.y + (ky / l) * 30 }; }
    // 光點停著不動時，閘門掃過來也要算碰到
    if (onGate(R(), orb.x, orb.y, t)) { hit(); return; }
    if (!target) return;
    // 光點朝目標移動，速度上限避免瞬移穿牆；每 3px 檢查一次
    let remain = Math.min(1000 * dt, Math.hypot(target.x - orb.x, target.y - orb.y));
    const ang = Math.atan2(target.y - orb.y, target.x - orb.x), r = R(), e = M().end;
    while (remain > 0) {
      const step = Math.min(3, remain); remain -= step;
      orb.x += Math.cos(ang) * step; orb.y += Math.sin(ang) * step;
      if (!walkable(r, orb.x, orb.y) || onGate(r, orb.x, orb.y, t)) { hit(); return; }
      if (Math.hypot(orb.x - e[0], orb.y - e[1]) < 36) { arrive(); return; }
    }
    hist.unshift({ x: orb.x, y: orb.y }); if (hist.length > 12) hist.pop();
  }
  function render() {
    const sx = shake > 0 ? (Math.random() - 0.5) * 4 : 0, sy = shake > 0 ? (Math.random() - 0.5) * 4 : 0;
    stage.style.transform = shake > 0 ? `translate(${sx}px,${sy}px)` : "";
    const r = R();
    if (r.gate) gate.style.transform = `translate(${gateX(r, t) - 50}px, ${r.gate.y - 16}px)`;
    const sc = orb.s * (state === "ready" ? 1 + Math.sin(t * 6) * 0.08 : 1);
    orbImg.style.transform = `translate(${orb.x - 24}px, ${orb.y - 24}px) scale(${sc})`;
    // 貼近牆時拖尾變長（2 → 4 張殘影）
    let close = false; for (const [dx, dy] of [[14, 0], [-14, 0], [0, 14], [0, -14]]) if (!walkable(r, orb.x + dx, orb.y + dy)) close = true;
    const n = state === "play" ? (close ? 4 : 2) : 0;
    trail.forEach((im, i) => { const p = hist[(i + 1) * 2]; if (i < n && p) { im.style.opacity = 0.32 - i * 0.07; im.style.transform = `translate(${p.x - 22}px, ${p.y - 22}px)`; } else im.style.opacity = 0; });
    timeT.textContent = `${T.time} ${fmt(segTime)}`; hitT.textContent = `${T.hits} ${segHits}${T.unit}`;
  }
  let last = performance.now();
  function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (state !== "loading") { update(dt); render(); } requestAnimationFrame(loop); }

  /* ---------- 輸入 ---------- */
  const keys = {};
  addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if ((e.key === "p" || e.key === "Escape") && state === "play") setState("paused");
    if ((e.key === " " || e.key === "Enter") && (state === "ready" || state === "paused") && document.activeElement?.tagName !== "BUTTON") { setState("play"); e.preventDefault(); }
    if (e.key.startsWith("Arrow")) { if (state === "ready" || state === "paused") setState("play"); e.preventDefault(); }
  });
  addEventListener("keyup", (e) => { keys[e.key] = false; if (e.key.startsWith("Arrow")) target = null; });
  const pos = (e) => { const b = world.getBoundingClientRect(), k = b.width / W; return { x: (e.clientX - b.left) / k, y: (e.clientY - b.top) / k, k }; };
  world.addEventListener("pointerdown", (e) => {
    ensureAudio(); if (state !== "ready" && state !== "paused") return;
    const p = pos(e), off = COARSE ? 40 / p.k : 0; // 手機：光點顯示在手指上方約 40 CSS px
    if (Math.hypot(p.x - orb.x, p.y - off - orb.y) < 80) { pressing = true; world.setPointerCapture(e.pointerId); target = { x: p.x, y: p.y - off }; toastT.textContent = toast > 0 ? toastT.textContent : ""; setState("play"); }
  });
  world.addEventListener("pointermove", (e) => { if (!pressing) return; const p = pos(e), off = COARSE ? 40 / p.k : 0; target = { x: p.x, y: p.y - off }; });
  const release = () => { if (pressing && state === "play") setState("paused"); pressing = false; target = null; };
  world.addEventListener("pointerup", release); world.addEventListener("pointercancel", release);
  world.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("visibilitychange", () => { if (document.hidden && state === "play") setState("paused"); });

  /* ---------- 啟動 ---------- */
  const preload = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = res; i.onerror = () => rej(new Error(src)); i.src = src; });
  Promise.all([
    ...["web/cover", "web/route1", "web/route2", "web/route3", "web/card_anim", "web/card_code", "ui/btnPrimary", "ui/btnSecondary", "ui/btnPause", "ui/btnSound", "ui/btnMute", "ui/panelCard", "ui/panelResult", "fx/orb", "fx/spark", "fx/confetti", "fx/stamp", "fx/gate"].map((n) => preload(`art/${n}.png`)),
    loadData()
  ]).then(() => {
    document.getElementById("loading").remove(); buildCover(); bg.src = R().art; setState("cover"); requestAnimationFrame(loop);
  }).catch((e) => { document.getElementById("loading").textContent = "素材載入失敗：" + e.message; });

  // 給自動化測試讀狀態用
  window.__cl = { get state() { return state; }, get orb() { return orb; }, get seg() { return seg; }, get hits() { return hits; }, newGame, startSeg, walkable: (x, y) => walkable(R(), x, y), setTarget: (x, y) => { target = { x, y }; }, play: () => setState("play"),
    step: (dt) => update(dt), gateX: () => (R().gate ? gateX(R(), t) : null) };
})();
