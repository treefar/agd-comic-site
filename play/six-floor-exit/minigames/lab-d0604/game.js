(function () {
  "use strict";

  const R = typeof module !== "undefined" && module.exports
    ? require("./rules.js")
    : (typeof globalThis !== "undefined" ? globalThis.EXIT6_RULES_LAB_D0604 : window.EXIT6_RULES_LAB_D0604);

  // 規格限制六色
  const C_PAPER = "#f4ecd8";
  const C_INK = "#0f0d0a";
  const C_RED = "#e63946";
  const C_YELLOW = "#ffd60a";
  const C_BLUE = "#1d4ed8";
  const C_GRAY = "#8a948e";

  // Web Audio 即時音效合成
  class SoundFX {
    constructor() {
      this.ctx = null;
    }
    init() {
      if (!this.ctx && typeof window !== "undefined") {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    playBlip() {
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, t);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } catch (e) {}
    }
    playDraw() {
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320 + Math.random() * 80, t);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } catch (e) {}
    }
    playGo() {
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(392, t);
        osc.frequency.linearRampToValueAtTime(523, t + 0.1);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } catch (e) {}
    }
    playWin() {
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.07;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.2);
        });
      } catch (e) {}
    }
    playCrash() {
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } catch (e) {}
    }
    playError() {
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(140, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } catch (e) {}
    }
  }

  // 粒子系統
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }
    burst(x, y, count, colors, speedMin, speedMax) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = speedMin + Math.random() * (speedMax - speedMin);
        const col = colors[Math.floor(Math.random() * colors.length)];
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.4 + Math.random() * 0.4,
          maxLife: 0.8,
          size: 3 + Math.random() * 4,
          color: col
        });
      }
    }
    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 300 * dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
    draw(ctx) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    clear() {
      this.particles = [];
    }
  }

  // 浮動文字
  class FloatTextSystem {
    constructor() {
      this.items = [];
    }
    add(x, y, text, color) {
      this.items.push({
        x: x,
        y: y,
        text: text,
        color: color || C_YELLOW,
        life: 1.0,
        maxLife: 1.0
      });
    }
    update(dt) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.life -= dt;
        item.y -= 25 * dt;
        if (item.life <= 0) {
          this.items.splice(i, 1);
        }
      }
    }
    draw(ctx) {
      ctx.save();
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        ctx.font = 'bold 14px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillStyle = item.color;
        ctx.textAlign = "center";
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 3;
        ctx.strokeText(item.text, item.x, item.y);
        ctx.fillText(item.text, item.x, item.y);
      }
      ctx.restore();
    }
    clear() {
      this.items = [];
    }
  }

  // 常數
  const VW = 480;
  const VH = 270;
  const GRAV = 640;
  const SUBSTEPS = 4;
  const ITER = 3;
  const PT_R = 3.2;
  const BREAK_RATIO = 1.9;
  const RED_ACC = 400;
  const GOAL_R = 20;

  window.EXIT6_MG = window.EXIT6_MG || {};
  window.EXIT6_MG["lab-d0604"] = {
    title: R.GAME_INFO.title,
    skill: R.GAME_INFO.skill,
    seconds: R.GAME_INFO.seconds,
    lab: R.GAME_INFO.lab,
    stars: {
      score2: R.STARS.score2,
      flawless: R.STARS.flawless
    },

    mount(root, api) {
      const sound = new SoundFX();
      const particles = new ParticleSystem();
      const floatTexts = new FloatTextSystem();
      let ended = false;
      let animId = null;
      let lastTime = 0;

      // 容器：絕不修改 root.style
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.inset = "0";
      container.style.overflow = "hidden";
      container.style.background = C_PAPER;
      container.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
      container.style.userSelect = "none";
      container.style.webkitUserSelect = "none";
      container.style.touchAction = "none";
      root.appendChild(container);

      // 震動包裝層（只震動內層，絕不觸碰 root）
      const stageWrap = document.createElement("div");
      stageWrap.style.position = "absolute";
      stageWrap.style.inset = "0";
      stageWrap.style.display = "flex";
      stageWrap.style.flexDirection = "column";
      stageWrap.style.overflow = "hidden";
      container.appendChild(stageWrap);

      // 紅閃受傷層
      const flashOverlay = document.createElement("div");
      flashOverlay.style.position = "absolute";
      flashOverlay.style.inset = "0";
      flashOverlay.style.background = C_RED;
      flashOverlay.style.opacity = "0";
      flashOverlay.style.pointerEvents = "none";
      flashOverlay.style.transition = "opacity 0.2s ease-out";
      flashOverlay.style.zIndex = "10";
      container.appendChild(flashOverlay);

      // 頂部 HUD
      const topHud = document.createElement("div");
      topHud.style.height = "42px";
      topHud.style.background = C_PAPER;
      topHud.style.borderBottom = "3px solid " + C_INK;
      topHud.style.display = "flex";
      topHud.style.alignItems = "center";
      topHud.style.justifyContent = "space-between";
      topHud.style.padding = "0 12px";
      topHud.style.flexShrink = "0";
      topHud.style.zIndex = "2";

      const stageBadge = document.createElement("div");
      stageBadge.style.fontWeight = "bold";
      stageBadge.style.fontSize = "13px";
      stageBadge.style.color = C_INK;
      stageBadge.textContent = "第 1/3 階 · 直線滑坡";
      topHud.appendChild(stageBadge);

      const timerWrap = document.createElement("div");
      timerWrap.style.display = "flex";
      timerWrap.style.alignItems = "center";
      timerWrap.style.gap = "6px";
      const timerLabel = document.createElement("span");
      timerLabel.style.fontWeight = "bold";
      timerLabel.style.fontSize = "13px";
      timerLabel.style.color = C_INK;
      timerLabel.textContent = "⏱ 60.0s";
      const timerBarWrap = document.createElement("div");
      timerBarWrap.style.width = "70px";
      timerBarWrap.style.height = "10px";
      timerBarWrap.style.background = C_PAPER;
      timerBarWrap.style.border = "2px solid " + C_INK;
      timerBarWrap.style.borderRadius = "3px";
      timerBarWrap.style.overflow = "hidden";
      const timerBarFill = document.createElement("div");
      timerBarFill.style.width = "100%";
      timerBarFill.style.height = "100%";
      timerBarFill.style.background = C_YELLOW;
      timerBarWrap.appendChild(timerBarFill);
      timerWrap.appendChild(timerLabel);
      timerWrap.appendChild(timerBarWrap);
      topHud.appendChild(timerWrap);

      const inkWrap = document.createElement("div");
      inkWrap.style.display = "flex";
      inkWrap.style.alignItems = "center";
      inkWrap.style.gap = "6px";
      const inkLabel = document.createElement("span");
      inkLabel.style.fontWeight = "bold";
      inkLabel.style.fontSize = "13px";
      inkLabel.style.color = C_BLUE;
      inkLabel.textContent = "墨水: ∞";
      const inkBarWrap = document.createElement("div");
      inkBarWrap.style.width = "64px";
      inkBarWrap.style.height = "10px";
      inkBarWrap.style.background = C_PAPER;
      inkBarWrap.style.border = "2px solid " + C_INK;
      inkBarWrap.style.borderRadius = "3px";
      inkBarWrap.style.overflow = "hidden";
      const inkBarFill = document.createElement("div");
      inkBarFill.style.width = "100%";
      inkBarFill.style.height = "100%";
      inkBarFill.style.background = C_BLUE;
      inkBarWrap.appendChild(inkBarFill);
      inkWrap.appendChild(inkLabel);
      inkWrap.appendChild(inkBarWrap);
      topHud.appendChild(inkWrap);

      stageWrap.appendChild(topHud);

      // 教學提示橫條
      const hintBanner = document.createElement("div");
      hintBanner.style.background = C_YELLOW;
      hintBanner.style.borderBottom = "2px solid " + C_INK;
      hintBanner.style.padding = "4px 10px";
      hintBanner.style.fontSize = "12px";
      hintBanner.style.fontWeight = "bold";
      hintBanner.style.color = C_INK;
      hintBanner.style.textAlign = "center";
      hintBanner.style.flexShrink = "0";
      hintBanner.style.zIndex = "2";
      hintBanner.textContent = "在畫面上拖曳畫線，按『出發』讓角色沿線滑下去";
      stageWrap.appendChild(hintBanner);

      // 畫布區域
      const canvasArea = document.createElement("div");
      canvasArea.style.flex = "1";
      canvasArea.style.position = "relative";
      canvasArea.style.overflow = "hidden";
      canvasArea.style.background = C_PAPER;
      stageWrap.appendChild(canvasArea);

      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvasArea.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      // 右下角 GRAYBOX 浮水印
      const grayboxMark = document.createElement("div");
      grayboxMark.style.position = "absolute";
      grayboxMark.style.right = "8px";
      grayboxMark.style.bottom = "6px";
      grayboxMark.style.fontSize = "11px";
      grayboxMark.style.fontWeight = "bold";
      grayboxMark.style.color = C_GRAY;
      grayboxMark.style.pointerEvents = "none";
      grayboxMark.style.zIndex = "5";
      grayboxMark.textContent = "GRAYBOX";
      canvasArea.appendChild(grayboxMark);

      // 底部工具列
      const bottomBar = document.createElement("div");
      bottomBar.style.height = "56px";
      bottomBar.style.background = C_PAPER;
      bottomBar.style.borderTop = "3px solid " + C_INK;
      bottomBar.style.display = "flex";
      bottomBar.style.alignItems = "center";
      bottomBar.style.justifyContent = "center";
      bottomBar.style.gap = "8px";
      bottomBar.style.padding = "0 8px";
      bottomBar.style.flexShrink = "0";
      bottomBar.style.zIndex = "2";
      stageWrap.appendChild(bottomBar);

      // 建立按鈕工廠
      function createBtn(id, text, defaultBg, textColor) {
        const btn = document.createElement("button");
        btn.id = "btn-" + id;
        btn.style.minWidth = "44px";
        btn.style.minHeight = "44px";
        btn.style.height = "44px";
        btn.style.padding = "0 12px";
        btn.style.fontFamily = "inherit";
        btn.style.fontSize = "13px";
        btn.style.fontWeight = "bold";
        btn.style.color = textColor || C_INK;
        btn.style.background = defaultBg || C_PAPER;
        btn.style.border = "3px solid " + C_INK;
        btn.style.boxShadow = "3px 3px 0 " + C_INK;
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.touchAction = "manipulation";
        btn.textContent = text;
        btn.addEventListener("mousedown", () => {
          btn.style.transform = "translate(2px, 2px)";
          btn.style.boxShadow = "1px 1px 0 " + C_INK;
        });
        const resetBtnPos = () => {
          btn.style.transform = "none";
          btn.style.boxShadow = "3px 3px 0 " + C_INK;
        };
        btn.addEventListener("mouseup", resetBtnPos);
        btn.addEventListener("mouseleave", resetBtnPos);
        return btn;
      }

      const btnBlue = createBtn("blue", "藍線", C_YELLOW, C_INK);
      const btnRed = createBtn("red", "紅線", C_PAPER, C_INK);
      const btnErase = createBtn("erase", "橡皮", C_PAPER, C_INK);
      const btnPlay = createBtn("play", "出發 ▶", C_YELLOW, C_INK);
      btnPlay.style.minWidth = "70px";
      const btnReset = createBtn("reset", "重設 ⟲", C_PAPER, C_INK);
      const btnClear = createBtn("clear", "清空 ✕", C_PAPER, C_INK);

      bottomBar.appendChild(btnBlue);
      bottomBar.appendChild(btnRed);
      bottomBar.appendChild(btnErase);
      bottomBar.appendChild(btnPlay);
      bottomBar.appendChild(btnReset);
      bottomBar.appendChild(btnClear);

      // 遊戲狀態
      const state = {
        levelIdx: 0,
        L: R.LEVELS[0],
        mode: "edit", // edit | play | crash | won
        lines: [],
        inkLeft: Infinity,
        tool: "blue", // blue | red | erase
        timeTotal: api && api.seconds > 0 ? api.seconds : 60, // 派對模式會傳較短秒數
        timeLeft: api && api.seconds > 0 ? api.seconds : 60,
        passedLevels: 0,
        attempts: [0, 0, 0],
        crashes: 0,
        resets: 0,
        levelInkRatios: [],
        cam: { x: VW / 2, y: VH / 2 },
        drawing: null,
        crashTimer: 0,
        wonTimer: 0,
        shakeTimer: 0,
        shakeMag: 0,
        handDemoTimer: 3.2,
        userInteracted: false,
        pts: {},
        cons: [],
        ragdoll: false,
        touching: false,
        fallT: 0
      };

      function updateToolUi() {
        btnBlue.style.background = state.tool === "blue" ? C_YELLOW : C_PAPER;
        btnRed.style.background = state.tool === "red" ? C_YELLOW : C_PAPER;
        btnErase.style.background = state.tool === "erase" ? C_YELLOW : C_PAPER;

        const redAllowed = state.L.tools.indexOf("red") !== -1;
        btnRed.disabled = !redAllowed;
        btnRed.style.opacity = redAllowed ? "1" : "0.4";
        btnRed.style.cursor = redAllowed ? "pointer" : "not-allowed";

        btnPlay.textContent = state.mode === "play" ? "暫停 ⏸" : "出發 ▶";
        btnPlay.style.background = state.mode === "play" ? C_PAPER : C_YELLOW;
      }

      function updateHudUi() {
        stageBadge.textContent = state.L.name;
        timerLabel.textContent = "⏱ " + Math.max(0, state.timeLeft).toFixed(1) + "s";
        const tFrac = Math.max(0, Math.min(1, state.timeLeft / state.timeTotal));
        timerBarFill.style.width = (tFrac * 100) + "%";
        timerBarFill.style.background = tFrac < 0.25 ? C_RED : C_YELLOW;

        if (state.L.ink === Infinity) {
          inkLabel.textContent = "墨水: ∞";
          inkBarFill.style.width = "100%";
        } else {
          const frac = Math.max(0, Math.min(1, state.inkLeft / state.L.ink));
          inkLabel.textContent = "墨水: " + Math.round(state.inkLeft);
          inkBarFill.style.width = (frac * 100) + "%";
          inkBarFill.style.background = frac < 0.2 ? C_RED : C_BLUE;
        }
        hintBanner.textContent = state.L.hint;
      }

      function mkPt(x, y) {
        return { x: x, y: y, px: x, py: y };
      }

      function rotPt(p, cx, cy, ang) {
        const vx = p.x - p.px;
        const vy = p.y - p.py;
        const c = Math.cos(ang);
        const si = Math.sin(ang);
        const dx = p.x - cx;
        const dy = p.y - cy;
        p.x = cx + dx * c - dy * si;
        p.y = cy + dx * si + dy * c;
        p.px = p.x - vx;
        p.py = p.y - vy;
      }

      function resetSled() {
        const st = state.L.start;
        state.pts = {
          A: mkPt(st.x + 14, st.y),
          B: mkPt(st.x, st.y),
          H: mkPt(st.x + 1, st.y - 9),
          D: mkPt(st.x + 13, st.y - 9)
        };
        if (state.L.startAngle) {
          const a = (state.L.startAngle * Math.PI) / 180;
          for (const k in state.pts) {
            rotPt(state.pts[k], st.x + 7, st.y - 4, a);
          }
        }
        function dDist(p1, p2) {
          return Math.hypot(state.pts[p1].x - state.pts[p2].x, state.pts[p1].y - state.pts[p2].y);
        }
        state.cons = [
          { a: "A", b: "B", len: dDist("A", "B"), rigid: true },
          { a: "B", b: "H", len: dDist("B", "H"), rigid: false },
          { a: "A", b: "D", len: dDist("A", "D"), rigid: false },
          { a: "H", b: "D", len: dDist("H", "D"), rigid: false },
          { a: "A", b: "H", len: dDist("A", "H"), rigid: false },
          { a: "B", b: "D", len: dDist("B", "D"), rigid: false }
        ];
        state.ragdoll = false;
        state.touching = false;
        state.fallT = 0;
      }

      function sledCenter() {
        return {
          x: (state.pts.A.x + state.pts.B.x + state.pts.H.x + state.pts.D.x) / 4,
          y: (state.pts.A.y + state.pts.B.y + state.pts.H.y + state.pts.D.y) / 4
        };
      }

      function loadLevel(idx) {
        state.levelIdx = idx;
        state.L = R.LEVELS[idx];
        state.lines = [];
        for (let k = 0; k < state.L.terrain.length; k++) {
          const t = state.L.terrain[k];
          for (let q = 0; q < t.length - 1; q++) {
            state.lines.push({
              ax: t[q][0],
              ay: t[q][1],
              bx: t[q + 1][0],
              by: t[q + 1][1],
              type: "terrain",
              fixed: true
            });
          }
        }
        state.inkLeft = state.L.ink;
        state.tool = "blue";
        state.mode = "edit";
        state.cam = { x: VW / 2, y: VH / 2 };
        state.drawing = null;
        state.crashTimer = 0;
        state.wonTimer = 0;
        resetSled();
        updateToolUi();
        updateHudUi();
      }

      function triggerShake(magnitude, time) {
        const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;
        state.shakeMag = magnitude || 6;
        state.shakeTimer = time || 0.25;
      }

      function triggerCrash() {
        if (state.mode !== "play") return;
        state.mode = "crash";
        state.crashTimer = 0.9;
        state.ragdoll = true;
        state.crashes++;
        for (let c = 0; c < state.cons.length; c++) {
          if (!state.cons[c].rigid) state.cons[c].broken = true;
        }
        sound.playCrash();
        triggerShake(8, 0.3);

        const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          flashOverlay.style.opacity = "0.25";
          setTimeout(() => { flashOverlay.style.opacity = "0"; }, 200);
        }

        const ce = sledCenter();
        particles.burst(ce.x, ce.y, 14, [C_YELLOW, C_RED, C_INK], 30, 120);
        floatTexts.add(ce.x, ce.y - 15, "跌倒了！", C_RED);
        updateToolUi();
      }

      function triggerGoal() {
        state.mode = "won";
        state.wonTimer = 1.3;
        sound.playWin();

        const gl = state.L.goal;
        particles.burst(gl.x, gl.y - 10, 24, [C_YELLOW, C_BLUE, C_RED, C_PAPER], 60, 180);
        floatTexts.add(gl.x, gl.y - 25, "抵達終點！+1000", C_YELLOW);

        // 紀錄本關剩餘墨水比例
        const ratio = state.L.ink === Infinity ? 1.0 : Math.max(0, state.inkLeft / state.L.ink);
        state.levelInkRatios.push(ratio);
        state.passedLevels++;
        updateToolUi();
      }

      function airAlign() {
        if (state.ragdoll || state.touching || state.fallT < 0.12) return;
        const A = state.pts.A;
        const B = state.pts.B;
        const ca = Math.atan2(A.y - B.y, A.x - B.x);
        let diff = -ca;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        const rot = Math.max(-0.035, Math.min(0.035, diff * 0.06));
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2;
        rotPt(A, mx, my, rot);
        rotPt(B, mx, my, rot);
        rotPt(state.pts.H, mx, my, rot);
        rotPt(state.pts.D, mx, my, rot);
      }

      function collidePoint(p, key, sub) {
        for (let i = 0; i < state.lines.length; i++) {
          const L = state.lines[i];
          const abx = L.bx - L.ax;
          const aby = L.by - L.ay;
          const len2 = abx * abx + aby * aby;
          if (len2 < 0.01) continue;
          let t = ((p.x - L.ax) * abx + (p.y - L.ay) * aby) / len2;
          t = Math.max(0, Math.min(1, t));
          const cx = L.ax + abx * t;
          const cy = L.ay + aby * t;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 > PT_R * PT_R || d2 < 0.000001) continue;
          const d = Math.sqrt(d2);
          const push = Math.min(PT_R - d, 1.1) / d;
          p.x += dx * push;
          p.y += dy * push;
          state.touching = true;

          // 上半身碰撞視為摔倒
          if ((key === "H" || key === "D") && !state.ragdoll && state.mode === "play") {
            triggerCrash();
            return;
          }

          // 紅線動力加速
          if (L.type === "red") {
            const il = 1 / Math.sqrt(len2);
            p.x += abx * il * RED_ACC * sub * sub;
            p.y += aby * il * RED_ACC * sub * sub;
            if (Math.random() < 0.3) {
              particles.burst(p.x, p.y, 1, [C_RED, C_YELLOW], 10, 40);
            }
          }
        }
      }

      function stepPhysics(dt) {
        const sub = dt / SUBSTEPS;
        for (let ss = 0; ss < SUBSTEPS; ss++) {
          // Verlet 積分
          for (const k in state.pts) {
            const p = state.pts[k];
            const vx = (p.x - p.px) * 0.999;
            const vy = (p.y - p.py) * 0.999;
            p.px = p.x;
            p.py = p.y;
            p.x += vx;
            p.y += vy + GRAV * sub * sub;
          }
          // 約束迭代
          for (let it = 0; it < ITER; it++) {
            for (let c = 0; c < state.cons.length; c++) {
              const C = state.cons[c];
              if (C.broken) continue;
              const a = state.pts[C.a];
              const b = state.pts[C.b];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
              if (!state.ragdoll && !C.rigid && d > C.len * BREAK_RATIO) {
                C.broken = true;
                triggerCrash();
                continue;
              }
              const diff = ((d - C.len) / d) * 0.5;
              a.x += dx * diff;
              a.y += dy * diff;
              b.x -= dx * diff;
              b.y -= dy * diff;
            }
            state.touching = false;
            for (const k in state.pts) {
              collidePoint(state.pts[k], k, sub);
            }
          }
          // 速度上限鉗制
          for (const k in state.pts) {
            const p = state.pts[k];
            const ddx = p.x - p.px;
            const ddy = p.y - p.py;
            const sp2 = ddx * ddx + ddy * ddy;
            if (sp2 > 2.67 * 2.67) {
              const f = 2.67 / Math.sqrt(sp2);
              p.px = p.x - ddx * f;
              p.py = p.y - ddy * f;
            }
          }
          if (state.touching) state.fallT = 0;
          else state.fallT += sub;
          airAlign();
        }
      }

      function softReset() {
        resetSled();
        state.mode = "edit";
        state.cam = { x: VW / 2, y: VH / 2 };
        updateToolUi();
        sound.playBlip();
      }

      function togglePlay() {
        sound.init();
        if (state.mode === "edit") {
          state.mode = "play";
          state.attempts[state.levelIdx]++;
          sound.playGo();
        } else if (state.mode === "play") {
          state.mode = "edit";
          sound.playBlip();
        }
        updateToolUi();
      }

      function clearLines() {
        sound.init();
        for (let i = state.lines.length - 1; i >= 0; i--) {
          if (!state.lines[i].fixed) state.lines.splice(i, 1);
        }
        state.inkLeft = state.L.ink;
        softReset();
        updateHudUi();
        sound.playBlip();
      }

      function eraseAt(wx, wy) {
        for (let i = state.lines.length - 1; i >= 0; i--) {
          const L = state.lines[i];
          if (L.fixed) continue;
          const abx = L.bx - L.ax;
          const aby = L.by - L.ay;
          const len2 = abx * abx + aby * aby || 0.01;
          const t = Math.max(0, Math.min(1, ((wx - L.ax) * abx + (wy - L.ay) * aby) / len2));
          const dx = wx - (L.ax + abx * t);
          const dy = wy - (L.ay + aby * t);
          if (dx * dx + dy * dy < 100) {
            const cost = Math.hypot(L.bx - L.ax, L.by - L.ay);
            state.inkLeft = Math.min(state.L.ink, state.inkLeft + cost);
            state.lines.splice(i, 1);
            updateHudUi();
            sound.playDraw();
            return;
          }
        }
      }

      // 結束畫面展示與回呼
      function finishGame() {
        if (ended) return;
        ended = true;

        const passed = state.passedLevels;
        let avgInk = 0;
        if (state.levelInkRatios.length > 0) {
          avgInk = state.levelInkRatios.reduce((a, b) => a + b, 0) / state.levelInkRatios.length;
        }
        const remainingSec = Math.max(0, Math.floor(state.timeLeft));
        const finalStats = {
          passedCount: passed,
          inkRatio: avgInk,
          remainingSeconds: remainingSec,
          attempts: state.attempts.slice(0, Math.max(1, passed)),
          crashes: state.crashes,
          resets: state.resets
        };

        const win = R.isWin(finalStats);
        const score = R.calcScore(finalStats);
        const flawless = R.isFlawless(finalStats);
        const starsCount = R.calcStars(finalStats);

        const starsStr = win
          ? (starsCount === 3 ? "★★★" : (starsCount === 2 ? "★★☆" : "★☆☆"))
          : "☆☆☆";

        // 結束彈窗面板
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(15, 13, 10, 0.82)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "20";

        const card = document.createElement("div");
        card.style.background = C_PAPER;
        card.style.border = "3px solid " + C_INK;
        card.style.boxShadow = "6px 6px 0 " + C_INK;
        card.style.padding = "20px 24px";
        card.style.maxWidth = "420px";
        card.style.width = "90%";
        card.style.textAlign = "center";
        card.style.color = C_INK;

        const titleText = document.createElement("h2");
        titleText.style.margin = "0 0 8px 0";
        titleText.style.fontSize = "22px";
        titleText.style.color = win ? C_BLUE : C_RED;
        titleText.textContent = win ? "挑戰成功！" : "時間到！";
        card.appendChild(titleText);

        const starDisplay = document.createElement("div");
        starDisplay.style.fontSize = "32px";
        starDisplay.style.color = C_YELLOW;
        starDisplay.style.margin = "4px 0 10px 0";
        starDisplay.textContent = starsStr;
        card.appendChild(starDisplay);

        const detailList = document.createElement("div");
        detailList.style.textAlign = "left";
        detailList.style.margin = "12px auto";
        detailList.style.fontSize = "14px";
        detailList.style.lineHeight = "1.7";
        detailList.style.background = C_PAPER;
        detailList.style.border = "2px solid " + C_INK;
        detailList.style.padding = "8px 14px";
        detailList.innerHTML = `
          <div><strong>通關階數：</strong>${passed} / 3 關</div>
          <div><strong>剩餘時間：</strong>${remainingSec} 秒</div>
          <div><strong>剩餘墨水：</strong>${Math.round(avgInk * 100)}%</div>
          <div><strong>最終得分：</strong>${score} 分</div>
          <div><strong>完美評價：</strong>${flawless ? "達成 (每關一次成功)" : "未達成"}</div>
        `;
        card.appendChild(detailList);

        const knowledgeBox = document.createElement("div");
        knowledgeBox.style.fontSize = "13px";
        knowledgeBox.style.color = C_INK;
        knowledgeBox.style.background = C_YELLOW;
        knowledgeBox.style.border = "2px solid " + C_INK;
        knowledgeBox.style.padding = "8px 10px";
        knowledgeBox.style.margin = "12px 0 16px 0";
        knowledgeBox.style.fontWeight = "bold";
        knowledgeBox.textContent = R.GAME_INFO.knowledge;
        card.appendChild(knowledgeBox);

        const replayBtn = createBtn("replay", "再玩一次", C_YELLOW, C_INK);
        replayBtn.style.margin = "0 auto";
        replayBtn.style.padding = "0 24px";
        replayBtn.style.fontSize = "16px";
        replayBtn.addEventListener("click", () => {
          overlay.remove();
          ended = false;
          state.levelIdx = 0;
          state.timeLeft = state.timeTotal;
          state.passedLevels = 0;
          state.attempts = [0, 0, 0];
          state.crashes = 0;
          state.resets = 0;
          state.levelInkRatios = [];
          loadLevel(0);
        });
        card.appendChild(replayBtn);
        overlay.appendChild(card);
        container.appendChild(overlay);

        // 回呼對外介面（只呼叫一次）
        api.onEnd({
          win: win,
          score: score,
          flawless: flawless
        });
      }

      // 按鈕事件綁定
      btnBlue.addEventListener("click", () => {
        sound.init();
        state.tool = "blue";
        updateToolUi();
        sound.playBlip();
      });
      btnRed.addEventListener("click", () => {
        sound.init();
        if (state.L.tools.indexOf("red") !== -1) {
          state.tool = "red";
          updateToolUi();
          sound.playBlip();
        }
      });
      btnErase.addEventListener("click", () => {
        sound.init();
        state.tool = "erase";
        updateToolUi();
        sound.playBlip();
      });
      btnPlay.addEventListener("click", togglePlay);
      btnReset.addEventListener("click", () => {
        if (state.mode === "play") state.resets++;
        softReset();
      });
      btnClear.addEventListener("click", () => {
        if (state.mode === "play") state.resets++;
        clearLines();
      });

      // 觸控與滑鼠座標換算
      function clientToWorld(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const scale = Math.min(rect.width / VW, rect.height / VH) || 1;
        const offsetX = (rect.width - VW * scale) / 2;
        const offsetY = (rect.height - VH * scale) / 2;
        const cx = (clientX - rect.left - offsetX) / scale;
        const cy = (clientY - rect.top - offsetY) / scale;
        return {
          x: cx + state.cam.x - VW / 2,
          y: cy + state.cam.y - VH / 2
        };
      }

      let pointerDown = false;
      function onPointerStart(e) {
        sound.init();
        state.userInteracted = true;
        pointerDown = true;
        const pt = clientToWorld(e.clientX, e.clientY);
        if (state.tool === "erase") {
          eraseAt(pt.x, pt.y);
        } else if (state.tool === "blue" || state.tool === "red") {
          state.drawing = { lx: pt.x, ly: pt.y };
        }
      }

      function onPointerMove(e) {
        if (!pointerDown) return;
        const pt = clientToWorld(e.clientX, e.clientY);
        if (state.tool === "erase") {
          eraseAt(pt.x, pt.y);
        } else if (state.drawing && (state.tool === "blue" || state.tool === "red")) {
          const dx = pt.x - state.drawing.lx;
          const dy = pt.y - state.drawing.ly;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= 7) {
            const seg = {
              ax: state.drawing.lx,
              ay: state.drawing.ly,
              bx: pt.x,
              by: pt.y,
              type: state.tool
            };
            if (state.inkLeft >= dist) {
              if (state.lines.length < 800) {
                state.lines.push(seg);
                if (state.inkLeft !== Infinity) state.inkLeft -= dist;
                updateHudUi();
                if (Math.random() < 0.35) sound.playDraw();
              }
              state.drawing.lx = pt.x;
              state.drawing.ly = pt.y;
            } else {
              floatTexts.add(pt.x, pt.y - 12, "墨水不足！", C_RED);
              state.drawing = null;
              sound.playError();
            }
          }
        }
      }

      function onPointerEnd() {
        pointerDown = false;
        state.drawing = null;
      }

      canvas.addEventListener("pointerdown", onPointerStart);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerEnd);
      window.addEventListener("pointercancel", onPointerEnd);

      // 鍵盤快捷鍵
      function onKeyDown(e) {
        sound.init();
        if (e.code === "Space") {
          e.preventDefault();
          togglePlay();
        } else if (e.code === "KeyR") {
          if (state.mode === "play") state.resets++;
          softReset();
        } else if (e.code === "KeyC") {
          if (state.mode === "play") state.resets++;
          clearLines();
        } else if (e.code === "Digit1") {
          state.tool = "blue";
          updateToolUi();
        } else if (e.code === "Digit2") {
          if (state.L.tools.indexOf("red") !== -1) {
            state.tool = "red";
            updateToolUi();
          }
        } else if (e.code === "Digit3" || e.code === "KeyE") {
          state.tool = "erase";
          updateToolUi();
        }
      }
      window.addEventListener("keydown", onKeyDown);

      // 載入初始關卡
      loadLevel(0);

      // 主迴圈
      function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
        lastTime = timestamp;

        if (!ended) {
          state.timeLeft -= dt;
          if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            updateHudUi();
            finishGame();
          } else {
            updateHudUi();
          }
        }

        particles.update(dt);
        floatTexts.update(dt);

        if (state.shakeTimer > 0) {
          state.shakeTimer -= dt;
          const sx = (Math.random() - 0.5) * state.shakeMag * 2;
          const sy = (Math.random() - 0.5) * state.shakeMag * 2;
          stageWrap.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
          if (state.shakeTimer <= 0) {
            stageWrap.style.transform = "none";
          }
        }

        if (state.handDemoTimer > 0 && !state.userInteracted) {
          state.handDemoTimer -= dt;
        }

        if (state.mode === "play") {
          stepPhysics(dt);
          const ce = sledCenter();
          state.cam.x += (ce.x - state.cam.x) * Math.min(1, dt * 6);
          state.cam.y += (ce.y - state.cam.y) * Math.min(1, dt * 6);

          // 終點判定
          const gl = state.L.goal;
          if (gl) {
            for (const k in state.pts) {
              const dx = state.pts[k].x - gl.x;
              const dy = state.pts[k].y - gl.y;
              if (dx * dx + dy * dy < GOAL_R * GOAL_R) {
                triggerGoal();
                break;
              }
            }
          }

          // 墜出世界
          if (ce.y > 520) {
            state.crashes++;
            sound.playCrash();
            floatTexts.add(state.cam.x, state.cam.y - 20, "掉下去了…", C_BLUE);
            softReset();
          }
        } else if (state.mode === "crash") {
          state.crashTimer -= dt;
          stepPhysics(dt);
          if (state.crashTimer <= 0) {
            softReset();
          }
        } else if (state.mode === "won") {
          state.wonTimer -= dt;
          if (state.wonTimer <= 0) {
            if (state.levelIdx < R.LEVELS.length - 1) {
              loadLevel(state.levelIdx + 1);
            } else {
              finishGame();
            }
          }
        }

        renderCanvas();
        animId = requestAnimationFrame(loop);
      }

      function renderCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvasArea.getBoundingClientRect();
        if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
          canvas.width = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        // 繪圖板紙張底色
        ctx.fillStyle = C_PAPER;
        ctx.fillRect(0, 0, rect.width, rect.height);

        const scale = Math.min(rect.width / VW, rect.height / VH) || 1;
        const offsetX = (rect.width - VW * scale) / 2;
        const offsetY = (rect.height - VH * scale) / 2;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        // 鏡頭變換
        ctx.save();
        ctx.translate(Math.round(VW / 2 - state.cam.x), Math.round(VH / 2 - state.cam.y));

        // 繪製電繪板參考點陣
        const x0 = state.cam.x - VW / 2;
        const y0 = state.cam.y - VH / 2;
        const gx = Math.floor(x0 / 30) * 30;
        const gy = Math.floor(y0 / 30) * 30;
        ctx.fillStyle = "rgba(138, 148, 142, 0.4)";
        for (let x = gx; x < x0 + VW + 30; x += 30) {
          for (let y = gy; y < y0 + VH + 30; y += 30) {
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }

        // 起點台
        const st = state.L.start;
        ctx.fillStyle = C_GRAY;
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(st.x - 12, st.y + 4, 38, 7, 3);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillStyle = C_INK;
        ctx.textAlign = "center";
        ctx.fillText("起點", st.x + 7, st.y + 23);

        // 終點旗
        const gl = state.L.goal;
        if (gl) {
          const t = Date.now() * 0.005;
          ctx.strokeStyle = C_INK;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(gl.x, gl.y);
          ctx.lineTo(gl.x, gl.y - 32);
          ctx.stroke();

          // 旗面
          ctx.fillStyle = C_RED;
          ctx.beginPath();
          ctx.moveTo(gl.x, gl.y - 32);
          ctx.lineTo(gl.x + 20, gl.y - 24 + Math.sin(t) * 2);
          ctx.lineTo(gl.x, gl.y - 16);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // 終點感應範圍光環
          ctx.strokeStyle = C_YELLOW;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(gl.x, gl.y - 6, GOAL_R, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = 'bold 11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
          ctx.fillStyle = C_INK;
          ctx.textAlign = "center";
          ctx.fillText("終點", gl.x, gl.y + 16);
        }

        // 繪製軌道線條
        for (let i = 0; i < state.lines.length; i++) {
          const line = state.lines[i];
          if (line.type === "terrain") {
            ctx.strokeStyle = C_INK;
            ctx.lineWidth = 4;
          } else if (line.type === "blue") {
            ctx.strokeStyle = C_BLUE;
            ctx.lineWidth = 3.2;
          } else {
            ctx.strokeStyle = C_RED;
            ctx.lineWidth = 3.2;
          }
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(line.ax, line.ay);
          ctx.lineTo(line.bx, line.by);
          ctx.stroke();

          // 紅線箭頭
          if (line.type === "red") {
            const mx = (line.ax + line.bx) / 2;
            const my = (line.ay + line.by) / 2;
            const dx = line.bx - line.ax;
            const dy = line.by - line.ay;
            const d = Math.hypot(dx, dy) || 1;
            const ux = dx / d;
            const uy = dy / d;
            ctx.fillStyle = C_YELLOW;
            ctx.beginPath();
            ctx.moveTo(mx + ux * 6, my + uy * 6);
            ctx.lineTo(mx - ux * 3 - uy * 4, my - uy * 3 + ux * 4);
            ctx.lineTo(mx - ux * 3 + uy * 4, my - uy * 3 - ux * 4);
            ctx.closePath();
            ctx.fill();
          }
        }

        // 正在繪製的提示筆尖
        if (state.drawing) {
          ctx.fillStyle = state.tool === "red" ? C_RED : C_BLUE;
          ctx.beginPath();
          ctx.arc(state.drawing.lx, state.drawing.ly, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 繪製小圓球角色
        drawBallCharacter(ctx);

        // 粒子與浮動字
        particles.draw(ctx);
        floatTexts.draw(ctx);

        // 開場 3 秒動態手勢示範教學
        if (state.handDemoTimer > 0 && !state.userInteracted && state.levelIdx === 0) {
          drawTutorialDemo(ctx);
        }

        ctx.restore(); // 鏡頭 restore
        ctx.restore(); // 舞台 scale restore
        ctx.restore(); // dpr restore
      }

      function drawBallCharacter(ctx) {
        const A = state.pts.A;
        const B = state.pts.B;
        const H = state.pts.H;
        const D = state.pts.D;
        const mx = (A.x + B.x + H.x + D.x) / 4;
        const my = (A.y + B.y + H.y + D.y) / 4;
        const ang = Math.atan2(A.y - B.y, A.x - B.x);
        const vx = ((A.x - A.px) + (B.x - B.px)) * 0.5;
        const vy = ((A.y - A.py) + (B.y - B.py)) * 0.5;
        const spd = Math.hypot(vx, vy);

        // 滑板底座（連結線條）
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(B.x, B.y);
        ctx.lineTo(A.x, A.y);
        ctx.stroke();

        // 圓球主體
        ctx.save();
        ctx.translate(mx, my - 2);
        ctx.rotate(ang);

        ctx.fillStyle = C_YELLOW;
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 高光亮點
        ctx.fillStyle = C_PAPER;
        ctx.beginPath();
        ctx.arc(3, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛表情
        ctx.fillStyle = C_INK;
        if (state.mode === "crash") {
          // 跌倒暈眩 X X 眼睛
          ctx.strokeStyle = C_INK;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-5, -3); ctx.lineTo(-1, 1);
          ctx.moveTo(-1, -3); ctx.lineTo(-5, 1);
          ctx.moveTo(2, -3); ctx.lineTo(6, 1);
          ctx.moveTo(6, -3); ctx.lineTo(2, 1);
          ctx.stroke();
        } else if (spd > 1.2) {
          // 衝刺專注眼神
          ctx.beginPath();
          ctx.arc(3, -1, 2, 0, Math.PI * 2);
          ctx.arc(7, -1, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 一般可愛眼神
          ctx.beginPath();
          ctx.arc(2, -1, 1.8, 0, Math.PI * 2);
          ctx.arc(6, -1, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // 跌倒冒星星
        if (state.mode === "crash") {
          const t = Date.now() * 0.01;
          for (let st = 0; st < 3; st++) {
            const starAng = t + st * 2.1;
            const sx = mx + Math.cos(starAng) * 14;
            const sy = my - 16 + Math.sin(starAng) * 5;
            ctx.font = "bold 13px sans-serif";
            ctx.fillStyle = C_YELLOW;
            ctx.strokeStyle = C_INK;
            ctx.lineWidth = 2;
            ctx.strokeText("✶", sx, sy);
            ctx.fillText("✶", sx, sy);
          }
        }
      }

      function drawTutorialDemo(ctx) {
        const t = (3.2 - state.handDemoTimer) / 3.2; // 0 ~ 1
        const sx = 96, sy = 75;
        const ex = 410, ey = 236;
        const curX = sx + (ex - sx) * t;
        const curY = sy + (ey - sy) * t;

        // 虛線示範筆跡
        ctx.save();
        ctx.strokeStyle = C_BLUE;
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(curX, curY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 虛擬繪圖筆尖示範指引
        ctx.fillStyle = C_INK;
        ctx.beginPath();
        ctx.arc(curX, curY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = C_PAPER;
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX + 8, curY - 24, 80, 22, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillStyle = C_INK;
        ctx.textAlign = "center";
        ctx.fillText("拖曳畫線 ✎", curX + 48, curY - 9);

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);

      // 對外介面 destroy
      return {
        destroy() {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          canvas.removeEventListener("pointerdown", onPointerStart);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerEnd);
          window.removeEventListener("pointercancel", onPointerEnd);
          window.removeEventListener("keydown", onKeyDown);

          particles.clear();
          floatTexts.clear();

          if (container && container.parentNode === root) {
            root.removeChild(container);
          }
        }
      };
    }
  };
})();
