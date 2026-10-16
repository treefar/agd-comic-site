(function () {
  "use strict";

  window.EXIT6_MG = window.EXIT6_MG || {};

  var R = window.EXIT6_RULES_LAB_D0633 || {
    ID: "lab-d0633",
    TITLE: "VR 跑步機衝刺",
    LAB: "D0633 體感互動實驗室",
    SKILL: "體感互動",
    SECONDS: 60,
    STARS: { score2: 1000, flawless: "全程未撞障礙" },
    PHYSICS: {
      gravity: 1500,
      jumpV: -500,
      jumpCut: 0.38,
      playerW: 18,
      playerH: 30,
      minTop: 95,
      maxTop: 215,
      slowOnCrate: 0.82
    },
    STAGES: [
      { tier: 1, name: "初階暖身", timeRange: [0, 20], speedStart: 200, speedEnd: 280, accel: 4.0, minGap: 26, maxGapRatio: 0.60, crateChance: 0.10 },
      { tier: 2, name: "進階提速", timeRange: [20, 40], speedStart: 280, speedEnd: 360, accel: 4.0, minGap: 38, maxGapRatio: 0.72, crateChance: 0.16 },
      { tier: 3, name: "極限衝刺", timeRange: [40, 60], speedStart: 360, speedEnd: 440, accel: 4.0, minGap: 52, maxGapRatio: 0.82, crateChance: 0.22 }
    ],
    getStage: function (t) {
      if (t < 20) return this.STAGES[0];
      if (t < 40) return this.STAGES[1];
      return this.STAGES[2];
    },
    calculateEnvelope: function (sp) {
      var v = -500, g = 1500, speed = Math.max(1, sp);
      var tUp = -v / g, apex = (v * v) / (2 * g);
      return {
        apex: apex,
        airTime: function (drop) {
          var a = 0.5 * g, b = v, c = -drop;
          var disc = b * b - 4 * a * c;
          if (disc < 0) return tUp * 2;
          return (-b + Math.sqrt(disc)) / (2 * a);
        },
        reachFor: function (drop) {
          var a = 0.5 * g, b = v, c = -drop;
          var disc = b * b - 4 * a * c;
          var time = disc < 0 ? tUp * 2 : (-b + Math.sqrt(disc)) / (2 * a);
          return speed * time;
        }
      };
    },
    generateBuilding: function (prev, stage, sp, rng) {
      var rand = rng || Math.random;
      var env = this.calculateEnvelope(sp);
      var maxRise = env.apex * 0.70;
      var rise = -60 + rand() * (maxRise - (-60));
      var top = Math.round(Math.min(215, Math.max(95, prev.top - rise)));
      var drop = top - prev.top;
      var maxGap = Math.max(stage.minGap, Math.min(260, env.reachFor(drop) * stage.maxGapRatio - 18));
      var gap = Math.round(stage.minGap + rand() * (maxGap - stage.minGap));
      var width = Math.round(140 + rand() * 120);
      var b = { x: prev.x + prev.w + gap, w: width, top: top, gap: gap, crates: [] };
      if (width > 160 && rand() < stage.crateChance) {
        b.crates.push({ x: Math.round(b.x + 45 + rand() * (width - 90)), y: top, hit: false });
      }
      return b;
    },
    checkWin: function (s) { return s && s.elapsed >= 60 && !s.dead; },
    calculateScore: function (d) { return Math.floor(Math.max(0, d || 0)); },
    isFlawless: function (s) { return !!(s && s.win === true && s.collisions === 0); }
  };

  // 規格指定六色
  var C = {
    PAPER: "#f4ecd8",
    INK: "#0f0d0a",
    RED: "#e63946",
    YELLOW: "#ffd60a",
    BLUE: "#1d4ed8",
    GRAY: "#8a948e"
  };

  window.EXIT6_MG["lab-d0633"] = {
    title: R.TITLE,
    skill: R.SKILL,
    seconds: R.SECONDS,
    lab: R.LAB,
    stars: {
      score2: R.STARS.score2,
      flawless: R.STARS.flawless
    },

    mount: function (root, api) {
      api = api || {};
      var onEnd = api.onEnd || function () {};
      var rng = typeof api.rng === "function" ? api.rng : Math.random;

      // 容器規則：不修改 root 本身任何樣式，在 root 內部建立全螢幕定位 div
      var container = document.createElement("div");
      container.setAttribute("data-role", "game-container");
      container.style.cssText = "position:absolute; inset:0; overflow:hidden; background:" + C.PAPER + "; font-family:'Noto Sans TC','Microsoft JhengHei',system-ui,sans-serif; user-select:none; -webkit-user-select:none; touch-action:none;";
      root.appendChild(container);

      var canvas = document.createElement("canvas");
      canvas.style.cssText = "position:absolute; inset:0; width:100%; height:100%; display:block;";
      container.appendChild(canvas);
      var ctx = canvas.getContext("2d");

      // 動態偏好檢查（prefers-reduced-motion）
      var motionReduced = false;
      if (typeof window !== "undefined" && window.matchMedia) {
        motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }

      // 音訊合成器（Web Audio API 即時合成）
      var audioCtx = null;
      function initAudio() {
        if (!audioCtx && typeof window !== "undefined") {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (AC) {
            try {
              audioCtx = new AC();
            } catch (e) {
              audioCtx = null;
            }
          }
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume();
        }
      }

      function playSound(type) {
        if (!audioCtx) return;
        try {
          var now = audioCtx.currentTime;
          var osc, gain;
          if (type === "jump") {
            osc = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
          } else if (type === "land") {
            osc = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
            gain.gain.setValueAtTime(0.16, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.09);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
          } else if (type === "hit") {
            osc = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.16);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
          } else if (type === "win") {
            var notes = [523.25, 659.25, 783.99, 1046.5];
            for (var i = 0; i < notes.length; i++) {
              var o = audioCtx.createOscillator();
              var g = audioCtx.createGain();
              o.type = "triangle";
              o.frequency.setValueAtTime(notes[i], now + i * 0.1);
              g.gain.setValueAtTime(0.15, now + i * 0.1);
              g.gain.linearRampToValueAtTime(0.001, now + i * 0.1 + 0.18);
              o.connect(g);
              g.connect(audioCtx.destination);
              o.start(now + i * 0.1);
              o.stop(now + i * 0.1 + 0.2);
            }
          } else if (type === "die") {
            var lossNotes = [392, 330, 261, 196];
            for (var j = 0; j < lossNotes.length; j++) {
              var lo = audioCtx.createOscillator();
              var lg = audioCtx.createGain();
              lo.type = "sawtooth";
              lo.frequency.setValueAtTime(lossNotes[j], now + j * 0.12);
              lg.gain.setValueAtTime(0.18, now + j * 0.12);
              lg.gain.linearRampToValueAtTime(0.001, now + j * 0.12 + 0.14);
              lo.connect(lg);
              lg.connect(audioCtx.destination);
              lo.start(now + j * 0.12);
              lo.stop(now + j * 0.12 + 0.16);
            }
          }
        } catch (err) {
          // 音效不阻塞遊戲
        }
      }

      // 虛擬 16:9 解析度
      var VW = 480;
      var VH = 270;

      // 遊戲執行狀態
      var running = true;
      var ended = false;
      var lastTimestamp = 0;
      var elapsed = 0;
      var speed = R.STAGES[0].speedStart;
      var dist = 0;
      var collisions = 0;
      var shake = 0;
      var hitstop = 0;
      var flash = 0;
      var jumpBuff = 0;

      // 玩家物件
      var player = {
        x: 80,
        y: 170 - R.PHYSICS.playerH,
        vy: 0,
        grounded: true,
        jumping: false,
        anim: 0,
        dead: false
      };

      // 建築物與障礙物管理
      var buildings = [];
      var particles = [];

      // 起始長屋頂
      buildings.push({
        x: 0,
        w: 420,
        top: 170,
        gap: 0,
        crates: []
      });

      // 預先生成初始視野前方建築
      for (var bIdx = 0; bIdx < 6; bIdx++) {
        var prevB = buildings[buildings.length - 1];
        var newB = R.generateBuilding(prevB, R.STAGES[0], speed, rng);
        buildings.push(newB);
      }

      // 粒子系統
      function spawnBurst(x, y, count, color, spMin, spMax) {
        if (motionReduced) return;
        for (var p = 0; p < count; p++) {
          var angle = -Math.PI / 2 + (rng() - 0.5) * 1.8;
          var pSpeed = spMin + rng() * (spMax - spMin);
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * pSpeed,
            vy: Math.sin(angle) * pSpeed,
            color: color,
            life: 0.3 + rng() * 0.25,
            maxLife: 0.55,
            size: 2 + rng() * 3
          });
        }
      }

      // 輸入管理
      var inputDown = false;
      var inputFresh = false;

      function onJumpPress() {
        initAudio();
        inputDown = true;
        inputFresh = true;
        jumpBuff = 0.14; // 140ms 輸入緩衝
      }

      function onJumpRelease() {
        inputDown = false;
      }

      function handleKeyDown(e) {
        if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          if (!e.repeat) onJumpPress();
        }
      }

      function handleKeyUp(e) {
        if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          onJumpRelease();
        }
      }

      function handlePointerDown(e) {
        e.preventDefault();
        onJumpPress();
      }

      function handlePointerUp(e) {
        e.preventDefault();
        onJumpRelease();
      }

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);

      // 畫面尺寸調節
      var viewScale = 1;
      var viewOffsetX = 0;
      var viewOffsetY = 0;

      function resize() {
        var rect = container.getBoundingClientRect();
        var cw = rect.width;
        var ch = rect.height;
        if (cw <= 0 || ch <= 0) return;

        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);

        var scaleX = cw / VW;
        var scaleY = ch / VH;
        viewScale = Math.min(scaleX, scaleY);
        viewOffsetX = (cw - VW * viewScale) / 2;
        viewOffsetY = (ch - VH * viewScale) / 2;
      }

      var resizeObserver = null;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(function () {
          resize();
        });
        resizeObserver.observe(container);
      }
      window.addEventListener("resize", resize);
      resize();

      // 地面檢測
      function getGroundUnder(px) {
        for (var i = 0; i < buildings.length; i++) {
          var b = buildings[i];
          if (px >= b.x && px <= b.x + b.w) {
            return b.top;
          }
        }
        return null;
      }

      // 結束結算畫面
      function showGameOverOverlay(win) {
        var finalScore = R.calculateScore(dist);
        var flawless = R.isFlawless({ win: win, collisions: collisions });

        var overlay = document.createElement("div");
        overlay.style.cssText = "position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(15,13,10,0.65); padding:16px; z-index:10;";

        var card = document.createElement("div");
        card.style.cssText = "background:" + C.PAPER + "; border:3px solid " + C.INK + "; box-shadow:4px 4px 0 " + C.INK + "; max-width:440px; width:100%; padding:20px; text-align:center; color:" + C.INK + ";";

        var titleEl = document.createElement("h2");
        titleEl.style.cssText = "font-size:1.4rem; margin-bottom:8px; font-weight:bold; color:" + (win ? C.BLUE : C.RED) + ";";
        titleEl.textContent = win ? "衝刺完走！模擬成功" : "失足墜落！訓練結束";
        card.appendChild(titleEl);

        // 星等標記
        var star1 = win;
        var star2 = finalScore >= R.STARS.score2;
        var star3 = flawless;
        var starStr = (star1 ? "★" : "☆") + (star2 ? "★" : "☆") + (star3 ? "★" : "☆");

        var starEl = document.createElement("div");
        starEl.style.cssText = "font-size:1.8rem; color:" + C.YELLOW + "; -webkit-text-stroke:1px " + C.INK + "; margin-bottom:12px;";
        starEl.textContent = starStr;
        card.appendChild(starEl);

        var statBox = document.createElement("div");
        statBox.style.cssText = "font-size:0.95rem; line-height:1.6; margin-bottom:14px; text-align:left; background:" + C.PAPER + "; border:2px dashed " + C.GRAY + "; padding:10px;";
        statBox.innerHTML =
          "<div><b>奔馳距離：</b>" + finalScore + " 公尺 " + (star2 ? "<span style='color:" + C.BLUE + "'>（達標★）</span>" : "（未達 " + R.STARS.score2 + "m）") + "</div>" +
          "<div><b>障礙碰撞：</b>" + collisions + " 次 " + (star3 ? "<span style='color:" + C.BLUE + "'>（完美★）</span>" : "") + "</div>" +
          "<div><b>通關狀態：</b>" + (win ? "完走 60 秒（通關★）" : "中途失足") + "</div>";
        card.appendChild(statBox);

        // 專長知識說明
        var knowledgeEl = document.createElement("div");
        knowledgeEl.style.cssText = "font-size:0.85rem; line-height:1.4; color:" + C.INK + "; background:" + C.YELLOW + "; border:2px solid " + C.INK + "; padding:8px; margin-bottom:16px; text-align:left;";
        knowledgeEl.innerHTML = "<b>體感互動小知識：</b><br>體感互動把身體動作變成遊戲輸入，跑步機、腳踏車、空間定位都能讓玩家「真的動起來」。";
        card.appendChild(knowledgeEl);

        // 再玩一次按鈕
        var replayBtn = document.createElement("button");
        replayBtn.style.cssText = "background:" + C.YELLOW + "; color:" + C.INK + "; border:3px solid " + C.INK + "; box-shadow:3px 3px 0 " + C.INK + "; padding:10px 24px; font-size:1rem; font-weight:bold; cursor:pointer;";
        replayBtn.textContent = "再玩一次";
        replayBtn.onmouseenter = function () {
          replayBtn.style.background = C.PAPER;
        };
        replayBtn.onmouseleave = function () {
          replayBtn.style.background = C.YELLOW;
        };
        replayBtn.onclick = function () {
          if (container && container.parentNode) {
            container.parentNode.removeChild(container);
          }
          window.EXIT6_MG["lab-d0633"].mount(root, api);
        };
        card.appendChild(replayBtn);

        overlay.appendChild(card);
        container.appendChild(overlay);
      }

      function finishGame(win) {
        if (ended) return;
        ended = true;
        running = false;
        var scoreVal = R.calculateScore(dist);
        var flawlessVal = R.isFlawless({ win: win, collisions: collisions });

        if (win) {
          playSound("win");
        } else {
          playSound("die");
        }

        // 僅呼叫一次 onEnd
        try {
          onEnd({
            win: win,
            score: scoreVal,
            flawless: flawlessVal
          });
        } catch (e) {
          // 安全呼叫防禦
        }

        showGameOverOverlay(win);
      }

      // 遊戲主迴圈
      function update(dt) {
        if (ended) return;

        // 頓幀處理
        if (hitstop > 0) {
          hitstop -= dt;
          return;
        }

        if (jumpBuff > 0) jumpBuff -= dt;
        if (shake > 0) shake -= dt;
        if (flash > 0) flash -= dt;

        elapsed += dt;
        var curStage = R.getStage(elapsed);

        // 速度隨當前階段遞增
        speed = Math.min(curStage.speedEnd, speed + curStage.accel * dt);

        // 跳躍邏輯
        if (player.grounded && (inputFresh || jumpBuff > 0)) {
          inputFresh = false;
          jumpBuff = 0;
          player.vy = R.PHYSICS.jumpV;
          player.grounded = false;
          player.jumping = true;
          playSound("jump");
          spawnBurst(player.x + 9, player.y + R.PHYSICS.playerH, 6, C.GRAY, 40, 110);
        }

        // 可變跳躍高度：放開按鍵時削弱上升動力
        if (player.jumping && !inputDown && player.vy < 0) {
          player.vy *= R.PHYSICS.jumpCut;
          player.jumping = false;
        }
        if (player.vy >= 0) {
          player.jumping = false;
        }

        // 物理位移
        player.vy += R.PHYSICS.gravity * dt;
        player.y += player.vy * dt;
        player.x += speed * dt;
        player.anim += dt * (0.8 + speed / 250);

        // 距離計算（10 像素換算約 1 公尺）
        dist += (speed * dt) / 10;

        // 落地與踩空檢測
        var footX = player.x + R.PHYSICS.playerW / 2;
        var groundY = getGroundUnder(footX);

        if (groundY !== null && player.vy >= 0 && player.y + R.PHYSICS.playerH >= groundY && player.y + R.PHYSICS.playerH - player.vy * dt <= groundY + 6) {
          player.y = groundY - R.PHYSICS.playerH;
          player.vy = 0;
          if (!player.grounded) {
            playSound("land");
            if (!motionReduced) shake = 0.08;
            spawnBurst(player.x + 9, groundY, 5, C.GRAY, 30, 90);
          }
          player.grounded = true;
        } else if (groundY === null || player.y + R.PHYSICS.playerH < groundY) {
          player.grounded = false;
        }

        // 檢測墜樓失敗
        if (player.y > VH + 50) {
          player.dead = true;
          finishGame(false);
          return;
        }

        // 檢測障礙箱碰撞
        var camX = player.x - 80;
        for (var b = 0; b < buildings.length; b++) {
          var bldg = buildings[b];
          for (var c = 0; c < bldg.crates.length; c++) {
            var crate = bldg.crates[c];
            if (crate.hit) continue;
            // 碰撞判定 AABB
            var crateW = 20;
            var crateH = 20;
            var crateTop = crate.y - crateH;
            if (
              player.x + R.PHYSICS.playerW > crate.x &&
              player.x < crate.x + crateW &&
              player.y + R.PHYSICS.playerH > crateTop &&
              player.y < crate.y
            ) {
              crate.hit = true;
              collisions++;
              speed = Math.max(curStage.speedStart, speed * R.PHYSICS.slowOnCrate);
              playSound("hit");
              if (!motionReduced) {
                shake = 0.28;
                hitstop = 0.05;
                flash = 0.08;
              }
              spawnBurst(crate.x + 10, crate.y - 10, 12, C.RED, 50, 180);
              spawnBurst(crate.x + 10, crate.y - 10, 8, C.YELLOW, 40, 140);
            }
          }
        }

        // 程序生成與回收建築
        var lastBldg = buildings[buildings.length - 1];
        while (lastBldg.x + lastBldg.w < camX + VW * 2) {
          lastBldg = R.generateBuilding(lastBldg, curStage, speed, rng);
          buildings.push(lastBldg);
        }
        while (buildings.length > 0 && buildings[0].x + buildings[0].w < camX - 80) {
          buildings.shift();
        }

        // 更新粒子
        for (var pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
          var pt = particles[pIdx];
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += 600 * dt;
          pt.life -= dt;
          if (pt.life <= 0) {
            particles.splice(pIdx, 1);
          }
        }

        // 時間到達 60 秒完走判定勝利
        if (elapsed >= R.SECONDS) {
          finishGame(true);
        }
      }

      function draw() {
        var dpr = window.devicePixelRatio || 1;
        ctx.save();
        ctx.scale(dpr, dpr);

        // 清空背景（紙質淡色）
        ctx.fillStyle = C.PAPER;
        ctx.fillRect(0, 0, container.clientWidth, container.clientHeight);

        ctx.save();
        ctx.translate(viewOffsetX, viewOffsetY);
        ctx.scale(viewScale, viewScale);

        // 震動效果應用在虛擬座標世界
        if (shake > 0 && !motionReduced) {
          var mag = shake * 10;
          ctx.translate((rng() - 0.5) * mag, (rng() - 0.5) * mag);
        }

        var camX = player.x - 80;

        // 1. 遠景城市屋頂剪影（兩層視差滾動）
        ctx.fillStyle = C.GRAY;
        ctx.globalAlpha = 0.45;
        for (var i = 0; i < 12; i++) {
          var bgX1 = ((i * 70 - camX * 0.15) % (VW + 140)) - 70;
          var h1 = 60 + ((i * 31) % 40);
          ctx.fillRect(bgX1, VH - h1 - 35, 52, h1 + 35);
        }

        ctx.globalAlpha = 0.65;
        for (var j = 0; j < 8; j++) {
          var bgX2 = ((j * 105 - camX * 0.3) % (VW + 210)) - 105;
          var h2 = 90 + ((j * 43) % 55);
          ctx.fillRect(bgX2, VH - h2 - 20, 80, h2 + 20);
        }
        ctx.globalAlpha = 1.0;

        // 2. 建築物與屋頂繪製（墨色大樓主體 + 灰盒細節）
        for (var b = 0; b < buildings.length; b++) {
          var bldg = buildings[b];
          if (bldg.x + bldg.w < camX - 40 || bldg.x > camX + VW + 40) continue;

          // 大樓主體
          ctx.fillStyle = C.INK;
          ctx.fillRect(bldg.x - camX, bldg.top, bldg.w, VH - bldg.top + 10);

          // 屋頂邊緣強調條（粗黑線與頂部反光）
          ctx.fillStyle = C.GRAY;
          ctx.fillRect(bldg.x - camX, bldg.top, bldg.w, 4);

          // 窗戶排列
          var winCount = Math.floor(bldg.w / 26);
          for (var w = 0; w < winCount; w++) {
            var wx = bldg.x - camX + 8 + w * 26;
            ctx.fillStyle = (w + b) % 3 === 0 ? C.YELLOW : C.GRAY;
            ctx.globalAlpha = (w + b) % 3 === 0 ? 0.8 : 0.25;
            ctx.fillRect(wx, bldg.top + 16, 12, 16);
            ctx.fillRect(wx, bldg.top + 42, 12, 16);
            ctx.globalAlpha = 1.0;
          }

          // 障礙箱繪製
          for (var c = 0; c < bldg.crates.length; c++) {
            var crate = bldg.crates[c];
            if (crate.hit) continue;
            var cx = crate.x - camX;
            var cy = crate.y - 20;

            // 箱體填充
            ctx.fillStyle = C.GRAY;
            ctx.fillRect(cx, cy, 20, 20);

            // 粗黑外框
            ctx.strokeStyle = C.INK;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(cx, cy, 20, 20);

            // 對角交叉木條
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + 20, cy + 20);
            ctx.moveTo(cx + 20, cy);
            ctx.lineTo(cx, cy + 20);
            ctx.stroke();
          }
        }

        // 3. 粒子渲染
        for (var p = 0; p < particles.length; p++) {
          var pt = particles[p];
          ctx.fillStyle = pt.color;
          ctx.fillRect(pt.x - camX, pt.y, pt.size, pt.size);
        }

        // 4. 奔跑者角色繪製（程式灰盒剪影，含 VR 頭戴面罩）
        ctx.save();
        ctx.translate(player.x - camX + R.PHYSICS.playerW / 2, player.y + R.PHYSICS.playerH);

        // 依奔跑速度前傾
        var lean = Math.min(0.3, (speed - 200) / 700);
        ctx.rotate(lean);

        var legSwing = player.grounded ? Math.sin(player.anim * 15) * 8 : 4;

        // 雙腿
        ctx.fillStyle = C.INK;
        ctx.fillRect(-7 + legSwing, -11, 5, 11);
        ctx.fillRect(2 - legSwing, -11, 5, 11);

        // 軀幹
        ctx.fillRect(-7, -24, 14, 14);

        // 雙臂
        var armSwing = player.grounded ? -Math.sin(player.anim * 15) * 6 : -4;
        ctx.fillRect(-8, -22 + armSwing, 4, 10);
        ctx.fillRect(4, -22 - armSwing, 4, 10);

        // 頭部
        ctx.beginPath();
        ctx.arc(1, -28, 5, 0, Math.PI * 2);
        ctx.fill();

        // VR 頭戴面罩（藍色亮點，突顯體感主題）
        ctx.fillStyle = C.BLUE;
        ctx.fillRect(2, -30, 6, 4);

        ctx.restore();

        // 5. 虛擬世界前景 HUD（VR 跑步機視野框與介面）
        // 淡淡的 VR 視野邊界框
        ctx.strokeStyle = C.GRAY;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.55;

        // 四角 HUD 折線
        var bLen = 16;
        // 左上
        ctx.beginPath();
        ctx.moveTo(12, 12 + bLen);
        ctx.lineTo(12, 12);
        ctx.lineTo(12 + bLen, 12);
        ctx.stroke();
        // 右上
        ctx.beginPath();
        ctx.moveTo(VW - 12 - bLen, 12);
        ctx.lineTo(VW - 12, 12);
        ctx.lineTo(VW - 12, 12 + bLen);
        ctx.stroke();
        // 左下
        ctx.beginPath();
        ctx.moveTo(12, VH - 12 - bLen);
        ctx.lineTo(12, VH - 12);
        ctx.lineTo(12 + bLen, VH - 12);
        ctx.stroke();
        // 右下
        ctx.beginPath();
        ctx.moveTo(VW - 12 - bLen, VH - 12);
        ctx.lineTo(VW - 12, VH - 12);
        ctx.lineTo(VW - 12, VH - 12 - bLen);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // 畫面上方 60 秒倒數計時條
        var curStageObj = R.getStage(elapsed);
        var barW = 140;
        var barH = 8;
        var barX = (VW - barW) / 2;
        var barY = 10;
        var timeRatio = Math.max(0, Math.min(1, (R.SECONDS - elapsed) / R.SECONDS));

        // 倒數條底框（3px 墨色邊框 + 灰底）
        ctx.fillStyle = C.GRAY;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = timeRatio > 0.3 ? C.YELLOW : C.RED;
        ctx.fillRect(barX, barY, barW * timeRatio, barH);
        ctx.strokeStyle = C.INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        // 倒數剩餘秒數文字
        ctx.fillStyle = C.INK;
        ctx.font = "bold 10px 'Noto Sans TC',sans-serif";
        ctx.textAlign = "center";
        var remainSec = Math.max(0, Math.ceil(R.SECONDS - elapsed));
        ctx.fillText("剩餘 " + remainSec + "s", VW / 2, barY + 19);

        // 左上角 VR 跑步機狀態
        ctx.textAlign = "left";
        ctx.font = "bold 11px 'Noto Sans TC',sans-serif";
        ctx.fillStyle = C.INK;
        ctx.fillText("[VR TREADMILL] " + Math.round(speed / 10) + " km/h", 16, 22);
        ctx.font = "10px 'Noto Sans TC',sans-serif";
        ctx.fillStyle = C.GRAY;
        ctx.fillText("奔馳 " + Math.round(dist) + "m ｜ 碰撞 " + collisions, 16, 35);

        // 右上角階段提示（階段 1/3、2/3、3/3）
        ctx.textAlign = "right";
        ctx.font = "bold 11px 'Noto Sans TC',sans-serif";
        ctx.fillStyle = curStageObj.tier === 3 ? C.RED : C.BLUE;
        ctx.fillText("階段 " + curStageObj.tier + " / 3 （" + curStageObj.name + "）", VW - 16, 22);

        // 開場 3 秒教學文字提示（最多一行）
        if (elapsed < 3.5) {
          var promptAlpha = elapsed < 2.5 ? 1 : Math.max(0, (3.5 - elapsed) / 1.0);
          ctx.save();
          ctx.globalAlpha = promptAlpha;
          var msg = "點畫面或按空白鍵跳躍，按久跳更遠";
          ctx.font = "bold 13px 'Noto Sans TC',sans-serif";
          var mWidth = ctx.measureText(msg).width;
          ctx.fillStyle = C.YELLOW;
          ctx.fillRect(VW / 2 - mWidth / 2 - 10, VH - 44, mWidth + 20, 24);
          ctx.strokeStyle = C.INK;
          ctx.lineWidth = 2;
          ctx.strokeRect(VW / 2 - mWidth / 2 - 10, VH - 44, mWidth + 20, 24);
          ctx.fillStyle = C.INK;
          ctx.textAlign = "center";
          ctx.fillText(msg, VW / 2, VH - 28);
          ctx.restore();
        }

        // 畫面受擊紅閃
        if (flash > 0 && !motionReduced) {
          ctx.fillStyle = C.RED;
          ctx.globalAlpha = Math.min(0.35, flash * 3);
          ctx.fillRect(0, 0, VW, VH);
          ctx.globalAlpha = 1.0;
        }

        // 畫面右下角固定標籤 GRAYBOX
        ctx.fillStyle = C.INK;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "right";
        ctx.fillText("GRAYBOX", VW - 14, VH - 12);

        ctx.restore();
        ctx.restore();
      }

      var animFrameId = null;
      function loop(timestamp) {
        if (!running && ended) return;
        if (!lastTimestamp) lastTimestamp = timestamp;
        var dt = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        // 限制每幀最大步進，防止切換分頁後產生過大位移
        if (dt > 0.08) dt = 0.08;

        update(dt);
        draw();

        if (running) {
          animFrameId = requestAnimationFrame(loop);
        }
      }

      animFrameId = requestAnimationFrame(loop);

      // destroy 生命週期：完全清理所有資源、事件、計時器與 DOM
      return {
        destroy: function () {
          running = false;
          ended = true;

          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }

          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
          window.removeEventListener("pointerup", handlePointerUp);
          window.removeEventListener("pointercancel", handlePointerUp);
          window.removeEventListener("resize", resize);

          if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
          }

          if (audioCtx) {
            try {
              if (typeof audioCtx.close === "function") {
                audioCtx.close();
              }
            } catch (e) {
              // 忽略關閉異常
            }
            audioCtx = null;
          }

          // 徹底移除容器，保證 root 恢復為空
          if (container && container.parentNode === root) {
            root.removeChild(container);
          }
          root.innerHTML = "";
        }
      };
    }
  };
})();
