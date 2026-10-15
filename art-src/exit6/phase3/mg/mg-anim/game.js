/**
 * mg-anim - 時間曲線滑翔
 * 專長：電腦動畫 (Computer Animation)
 *
 * 招生核心動詞：按住俯衝、放開滑翔。
 * 讓玩家在 60 秒內親身體會動畫「時間曲線（Timing Curve）」與「緩入緩出（Slow In & Slow Out）」的重量感。
 */
(function () {
  "use strict";

  // 取得純規則模組
  var R = window.EXIT6_RULES_MG_ANIM || window["EXIT6_RULES_mg-anim"];
  if (!R && typeof require !== "undefined") {
    try { R = require("./rules.js"); } catch (e) {}
  }

  // 灰盒限制配色盤
  var COLOR = {
    paper: "#f4ecd8",
    ink: "#0f0d0a",
    red: "#e63946",
    yellow: "#ffd60a",
    blue: "#1d4ed8",
    gray: "#8a948e",
    grayLight: "rgba(138, 148, 142, 0.35)",
    white: "#ffffff"
  };

  // ==========================================================================
  // Web Audio 即時合成短音（不載入任何外在音檔，點擊後初始化）
  // ==========================================================================
  function createAudio() {
    var ctx = null;
    function getCtx() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          ctx = new AC();
        }
      }
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      return ctx;
    }

    function play(type) {
      try {
        var c = getCtx();
        if (!c) return;
        var now = c.currentTime;

        if (type === "dive") {
          // 俯衝輕微低頻氣流聲
          var osc = c.createOscillator();
          var gain = c.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === "takeoff") {
          // 起飛滑翔向上掃頻（緩出升空）
          var o1 = c.createOscillator();
          var g1 = c.createGain();
          o1.type = "triangle";
          o1.frequency.setValueAtTime(220, now);
          o1.frequency.exponentialRampToValueAtTime(580, now + 0.22);
          g1.gain.setValueAtTime(0.2, now);
          g1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          o1.connect(g1);
          g1.connect(c.destination);
          o1.start(now);
          o1.stop(now + 0.22);
        } else if (type === "perfect") {
          // 完美著陸（叮噹雙音和弦）
          [523.25, 659.25].forEach(function (freq, i) {
            var o = c.createOscillator();
            var g = c.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(freq, now + i * 0.04);
            g.gain.setValueAtTime(0.22, now + i * 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.25);
            o.connect(g);
            g.connect(c.destination);
            o.start(now + i * 0.04);
            o.stop(now + i * 0.04 + 0.25);
          });
        } else if (type === "land") {
          // 一般落地短音
          var oL = c.createOscillator();
          var gL = c.createGain();
          oL.type = "sine";
          oL.frequency.setValueAtTime(120, now);
          oL.frequency.exponentialRampToValueAtTime(50, now + 0.08);
          gL.gain.setValueAtTime(0.15, now);
          gL.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          oL.connect(gL);
          gL.connect(c.destination);
          oL.start(now);
          oL.stop(now + 0.08);
        } else if (type === "flag") {
          // 飛過關鍵影格旗（歡呼和弦）
          [587.33, 739.99, 880.0].forEach(function (f, idx) {
            var o = c.createOscillator();
            var g = c.createGain();
            o.type = "triangle";
            o.frequency.setValueAtTime(f, now + idx * 0.06);
            g.gain.setValueAtTime(0.25, now + idx * 0.06);
            g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
            o.connect(g);
            g.connect(c.destination);
            o.start(now + idx * 0.06);
            o.stop(now + idx * 0.06 + 0.35);
          });
        } else if (type === "win") {
          // 通關大和弦
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            var o = c.createOscillator();
            var g = c.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(f, now + i * 0.09);
            g.gain.setValueAtTime(0.25, now + i * 0.09);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);
            o.connect(g);
            g.connect(c.destination);
            o.start(now + i * 0.09);
            o.stop(now + i * 0.09 + 0.4);
          });
        } else if (type === "gameover") {
          // 失敗低音
          var oG = c.createOscillator();
          var gG = c.createGain();
          oG.type = "sawtooth";
          oG.frequency.setValueAtTime(260, now);
          oG.frequency.exponentialRampToValueAtTime(110, now + 0.35);
          gG.gain.setValueAtTime(0.18, now);
          gG.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          oG.connect(gG);
          gG.connect(c.destination);
          oG.start(now);
          oG.stop(now + 0.35);
        }
      } catch (err) {}
    }

    function destroy() {
      if (ctx) {
        try { ctx.close(); } catch (e) {}
        ctx = null;
      }
    }

    return { play: play, destroy: destroy, getCtx: getCtx };
  }

  // ==========================================================================
  // 小遊戲進入點 EXIT6_MG["mg-anim"]
  // ==========================================================================
  window.EXIT6_MG = window.EXIT6_MG || {};
  window.EXIT6_MG["mg-anim"] = {
    title: "時間曲線滑翔",
    skill: "電腦動畫",
    seconds: 60,
    mount: function (root, api) {
      api = api || {};
      var rng = typeof api.rng === "function" ? api.rng : Math.random;
      var onEnd = typeof api.onEnd === "function" ? api.onEnd : function () {};
      var endCalled = false;

      // 檢查使用者偏好：是否減少動態效果 (prefers-reduced-motion)
      var reducedMotion = false;
      try {
        reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (e) {}

      // 音效系統
      var audio = createAudio();

      // 賽道地形與物理初始化
      var track = R.createContinuousTrack(rng);
      var flags = R.FLAG_DISTANCES.slice();

      // 遊戲狀態機
      var state = {
        timeRemaining: 60,
        elapsedSeconds: 0,
        stage: 1,
        flagsPassed: 0,
        flagsState: [false, false, false],
        distance: 0,
        score: 0,
        combo: 0,
        maxCombo: 0,
        perfectLands: 0,
        gameOver: false,
        gameWon: false,
        showTeaching: true,
        teachingTimer: 4.5
      };

      // 玩家角色狀態
      var player = {
        x: 60,
        y: R.trackGroundAt(60, track) - 40,
        vx: 220,
        vy: 0,
        r: 14,
        onGround: false,
        airTime: 0,
        dive: false,
        squashX: 1,
        squashY: 1,
        angle: 0
      };

      // 即時速度曲線記錄（供下方速度曲線折線圖呈現）
      var speedHistory = [];
      var maxHistorySamples = 75;

      // 視覺打擊感 (Juice)
      var juice = {
        shakeTime: 0,
        shakeAmount: 0,
        flashTime: 0,
        flashColor: "rgba(255, 255, 255, 0)",
        hitstop: 0
      };

      var particles = [];
      var floatTexts = [];

      function addParticle(x, y, count, color) {
        for (var i = 0; i < count; i++) {
          var angle = (Math.PI * 2 * i) / count + (rng() - 0.5) * 0.5;
          var speed = 40 + rng() * 120;
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 30,
            size: 3 + rng() * 4,
            life: 0.35 + rng() * 0.25,
            maxLife: 0.5,
            color: color || COLOR.yellow
          });
        }
      }

      function addFloatText(x, y, text, color, size) {
        floatTexts.push({
          x: x,
          y: y,
          text: text,
          color: color || COLOR.yellow,
          size: size || 18,
          life: 0.9,
          maxLife: 0.9
        });
      }

      function triggerShake(amount, time) {
        if (reducedMotion) return;
        juice.shakeAmount = amount;
        juice.shakeTime = time;
      }

      function triggerFlash(color, time) {
        juice.flashColor = color;
        juice.flashTime = time;
      }

      // 建立 DOM 元素
      var container = document.createElement("div");
      container.style.position = "relative";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.overflow = "hidden";
      container.style.userSelect = "none";
      container.style.webkitUserSelect = "none";
      container.style.touchAction = "none";
      container.style.backgroundColor = COLOR.paper;
      container.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';

      var canvas = document.createElement("canvas");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      container.appendChild(canvas);

      // 手機與點擊大操作按鈕（保障 44x44px 以上）
      var touchOverlay = document.createElement("div");
      touchOverlay.style.position = "absolute";
      touchOverlay.style.left = "0";
      touchOverlay.style.top = "0";
      touchOverlay.style.width = "100%";
      touchOverlay.style.height = "100%";
      touchOverlay.style.cursor = "pointer";
      touchOverlay.style.zIndex = "10";
      container.appendChild(touchOverlay);

      // 結束畫面 Modal Container
      var resultModal = document.createElement("div");
      resultModal.style.position = "absolute";
      resultModal.style.left = "0";
      resultModal.style.top = "0";
      resultModal.style.width = "100%";
      resultModal.style.height = "100%";
      resultModal.style.backgroundColor = "rgba(15, 13, 10, 0.72)";
      resultModal.style.display = "none";
      resultModal.style.flexDirection = "column";
      resultModal.style.alignItems = "center";
      resultModal.style.justifyContent = "center";
      resultModal.style.zIndex = "100";
      resultModal.style.padding = "16px";
      resultModal.style.boxSizing = "border-box";
      container.appendChild(resultModal);

      root.innerHTML = "";
      root.appendChild(container);

      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var viewW = 800;
      var viewH = 450;
      var camX = 0;

      function resize() {
        var rect = root.getBoundingClientRect();
        var w = Math.max(320, rect.width || 800);
        var h = Math.max(240, rect.height || 450);
        viewW = w;
        viewH = h;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
      }
      resize();

      var ro = null;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(function () { resize(); });
        ro.observe(root);
      }

      // 輸入控制
      var isPointerDown = false;
      var isKeyDown = false;

      function updateDiveState() {
        var shouldDive = isPointerDown || isKeyDown;
        if (shouldDive && !player.dive) {
          audio.play("dive");
        }
        player.dive = shouldDive;
        if (shouldDive) {
          state.showTeaching = false;
        }
      }

      function onPointerDown(e) {
        if (e) e.preventDefault();
        audio.getCtx();
        isPointerDown = true;
        updateDiveState();
      }

      function onPointerUp(e) {
        if (e) e.preventDefault();
        isPointerDown = false;
        updateDiveState();
      }

      function onKeyDown(e) {
        if (!e) return;
        var code = e.code || e.key;
        if (code === "Space" || code === "ArrowDown" || code === "KeyZ" || code === "KeyJ") {
          e.preventDefault();
          audio.getCtx();
          isKeyDown = true;
          updateDiveState();
        }
      }

      function onKeyUp(e) {
        if (!e) return;
        var code = e.code || e.key;
        if (code === "Space" || code === "ArrowDown" || code === "KeyZ" || code === "KeyJ") {
          e.preventDefault();
          isKeyDown = false;
          updateDiveState();
        }
      }

      function onWindowBlur() {
        isPointerDown = false;
        isKeyDown = false;
        updateDiveState();
      }

      touchOverlay.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("blur", onWindowBlur);

      // ======================================================================
      // 遊戲結算與結束回調
      // ======================================================================
      function showGameOverModal(win) {
        if (endCalled) return;
        endCalled = true;

        var finalScore = R.calculateScore({
          win: win,
          flagsPassed: state.flagsPassed,
          perfectLands: state.perfectLands,
          maxCombo: state.maxCombo,
          elapsedSeconds: state.elapsedSeconds,
          distance: player.x
        });
        state.score = finalScore;

        if (win) {
          audio.play("win");
        } else {
          audio.play("gameover");
        }

        // 調用宿主回調 api.onEnd（只呼叫一次）
        onEnd({ win: win, score: finalScore });

        // 渲染結算視窗
        resultModal.innerHTML = "";

        var card = document.createElement("div");
        card.style.backgroundColor = COLOR.paper;
        card.style.border = "3px solid " + COLOR.ink;
        card.style.boxShadow = "5px 5px 0px " + COLOR.ink;
        card.style.maxWidth = "440px";
        card.style.width = "90%";
        card.style.padding = "24px 20px";
        card.style.boxSizing = "border-box";
        card.style.textAlign = "center";
        card.style.color = COLOR.ink;

        var header = document.createElement("div");
        header.style.fontSize = "26px";
        header.style.fontWeight = "bold";
        header.style.marginBottom = "10px";
        header.style.color = win ? COLOR.blue : COLOR.red;
        header.innerText = win ? "★ 挑戰成功！飛越所有影格" : "時間到！未達終點影格";
        card.appendChild(header);

        var scoreDiv = document.createElement("div");
        scoreDiv.style.fontSize = "20px";
        scoreDiv.style.fontWeight = "bold";
        scoreDiv.style.marginBottom = "14px";
        scoreDiv.innerText = "最終分數：" + finalScore + " 分";
        card.appendChild(scoreDiv);

        var statsDiv = document.createElement("div");
        statsDiv.style.fontSize = "14px";
        statsDiv.style.lineHeight = "1.6";
        statsDiv.style.backgroundColor = COLOR.grayLight;
        statsDiv.style.padding = "8px 12px";
        statsDiv.style.borderRadius = "4px";
        statsDiv.style.marginBottom = "16px";
        statsDiv.style.border = "1px solid " + COLOR.ink;
        statsDiv.innerHTML =
          "通過關鍵影格：<strong>" + state.flagsPassed + " / 3</strong> 座<br>" +
          "完美緩入著陸：<strong>" + state.perfectLands + "</strong> 次<br>" +
          "最高連續連擊：<strong>" + state.maxCombo + "</strong> 拍";
        card.appendChild(statsDiv);

        // 專長知識傳達
        var knowledgeDiv = document.createElement("div");
        knowledgeDiv.style.fontSize = "14px";
        knowledgeDiv.style.fontWeight = "bold";
        knowledgeDiv.style.lineHeight = "1.5";
        knowledgeDiv.style.padding = "10px";
        knowledgeDiv.style.backgroundColor = COLOR.yellow;
        knowledgeDiv.style.border = "2px solid " + COLOR.ink;
        knowledgeDiv.innerText =
          "這就是「電腦動畫」在做的事：動畫師用「時間曲線」控制快慢，透過「緩入緩出（Slow In & Slow Out）」讓動作產生自然的重量感！";
        card.appendChild(knowledgeDiv);

        resultModal.appendChild(card);
        resultModal.style.display = "flex";
      }

      function resetGame() {
        endCalled = false;
        state.timeRemaining = 60;
        state.elapsedSeconds = 0;
        state.stage = 1;
        state.flagsPassed = 0;
        state.flagsState = [false, false, false];
        state.distance = 0;
        state.score = 0;
        state.combo = 0;
        state.maxCombo = 0;
        state.perfectLands = 0;
        state.gameOver = false;
        state.gameWon = false;
        state.showTeaching = true;
        state.teachingTimer = 4.5;

        track = R.createContinuousTrack(rng);
        player.x = 60;
        player.y = R.trackGroundAt(60, track) - 40;
        player.vx = 220;
        player.vy = 0;
        player.onGround = false;
        player.airTime = 0;
        player.squashX = 1;
        player.squashY = 1;
        speedHistory = [];
        particles = [];
        floatTexts = [];
      }

      // ======================================================================
      // 主迴圈更新 Update
      // ======================================================================
      var lastTimestamp = performance.now();
      var running = true;
      var rafId = null;

      function update(dt) {
        if (state.gameOver) return;

        // 倒數計時與階段推進
        state.elapsedSeconds += dt;
        state.timeRemaining = Math.max(0, R.TOTAL_SECONDS - state.elapsedSeconds);
        state.stage = R.getStage(state.elapsedSeconds);

        if (state.showTeaching) {
          state.teachingTimer -= dt;
          if (state.teachingTimer <= 0) state.showTeaching = false;
        }

        // 打擊感計時器
        if (juice.shakeTime > 0) juice.shakeTime -= dt;
        if (juice.flashTime > 0) juice.flashTime -= dt;

        // 物理計算
        var gy = R.trackGroundAt(player.x, track);
        var slope = R.trackSlopeAt(player.x, track);

        var prevOnGround = player.onGround;
        var nextP = R.updatePhysics(
          player,
          { dive: player.dive },
          slope,
          gy,
          dt,
          R.PHY
        );

        player.x = nextP.x;
        player.y = nextP.y;
        player.vx = nextP.vx;
        player.vy = nextP.vy;
        player.onGround = nextP.onGround;
        player.airTime = nextP.airTime;

        // 起飛動畫與音效
        if (nextP.tookOff) {
          audio.play("takeoff");
          player.squashX = 0.8;
          player.squashY = 1.35;
          addFloatText(player.x, player.y - 20, "緩出起飛！", COLOR.yellow, 15);
          addParticle(player.x, player.y + player.r, 8, COLOR.paper);
        }

        // 著陸判斷
        if (nextP.landed) {
          if (nextP.landQuality === "perfect") {
            audio.play("perfect");
            state.perfectLands++;
            state.combo++;
            if (state.combo > state.maxCombo) state.maxCombo = state.combo;
            state.score += 150 * state.combo;

            player.squashX = 1.45;
            player.squashY = 0.65;
            triggerShake(4, 0.2);
            triggerFlash("rgba(255, 214, 10, 0.25)", 0.15);

            addFloatText(player.x, player.y - 30, "完美緩入 +" + (150 * state.combo) + " (Combo x" + state.combo + ")", COLOR.yellow, 16);
            addParticle(player.x, player.y + player.r, 14, COLOR.yellow);
          } else {
            audio.play("land");
            state.combo = 0;
            player.squashX = 1.25;
            player.squashY = 0.8;
            addParticle(player.x, player.y + player.r, 4, COLOR.gray);
          }
        }

        // Squash & Stretch 彈性回彈到 1.0
        player.squashX += (1 - player.squashX) * Math.min(1, dt * 10);
        player.squashY += (1 - player.squashY) * Math.min(1, dt * 10);

        // 角色旋轉角度跟隨運動軌跡
        if (player.onGround) {
          player.angle = Math.atan(slope);
        } else {
          player.angle = Math.atan2(player.vy, player.vx);
        }

        // 速度歷史紀錄（供即時速度曲線小圖）
        speedHistory.push({ t: state.elapsedSeconds, v: player.vx, dive: player.dive });
        if (speedHistory.length > maxHistorySamples) {
          speedHistory.shift();
        }

        // 關鍵影格旗判定
        for (var i = 0; i < flags.length; i++) {
          if (!state.flagsState[i] && player.x >= flags[i]) {
            state.flagsState[i] = true;
            state.flagsPassed = i + 1;
            state.score += 1200;
            audio.play("flag");
            triggerShake(5, 0.25);
            triggerFlash("rgba(29, 78, 216, 0.25)", 0.25);
            addFloatText(flags[i], gy - 90, "★ 關鍵影格 " + (i + 1) + " 通過！", COLOR.yellow, 20);
            addParticle(flags[i], gy - 50, 24, COLOR.yellow);
          }
        }

        // 攝影機位置跟隨玩家
        camX = player.x - viewW * 0.28;

        // 更新粒子與浮動文字
        for (var pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
          var pt = particles[pIdx];
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += 260 * dt;
          pt.life -= dt;
          if (pt.life <= 0) particles.splice(pIdx, 1);
        }

        for (var fIdx = floatTexts.length - 1; fIdx >= 0; fIdx--) {
          var ft = floatTexts[fIdx];
          ft.y -= 30 * dt;
          ft.life -= dt;
          if (ft.life <= 0) floatTexts.splice(fIdx, 1);
        }

        // 勝負檢查
        var res = R.checkGameResult({
          flagsPassed: state.flagsPassed,
          targetFlags: R.TARGET_FLAGS,
          elapsedSeconds: state.elapsedSeconds,
          maxTime: R.TOTAL_SECONDS
        });

        if (res.over) {
          state.gameOver = true;
          state.gameWon = res.win;
          showGameOverModal(res.win);
        }
      }

      // ======================================================================
      // 畫面繪製 Render (嚴格遵循灰盒規範，無外在圖片)
      // ==========================================================================
      function render() {
        ctx.save();
        ctx.scale(dpr, dpr);

        // 螢幕震動 (Juice)
        if (juice.shakeTime > 0) {
          var sx = (rng() - 0.5) * juice.shakeAmount * 2;
          var sy = (rng() - 0.5) * juice.shakeAmount * 2;
          ctx.translate(sx, sy);
        }

        // 1. 天空背景（紙張質感色）
        ctx.fillStyle = COLOR.paper;
        ctx.fillRect(0, 0, viewW, viewH);

        // 天空漫畫線條裝飾
        ctx.strokeStyle = COLOR.grayLight;
        ctx.lineWidth = 1;
        for (var ly = 30; ly < viewH * 0.45; ly += 24) {
          ctx.beginPath();
          ctx.moveTo(0, ly);
          ctx.lineTo(viewW, ly);
          ctx.stroke();
        }

        // 2. 遠景視差山丘 (Parallax)
        ctx.save();
        ctx.fillStyle = COLOR.grayLight;
        ctx.beginPath();
        ctx.moveTo(0, viewH);
        for (var px = 0; px <= viewW; px += 16) {
          var worldX = (camX * 0.35) + px;
          var py = viewH * 0.55 + Math.sin(worldX * 0.003) * 35 + Math.cos(worldX * 0.006) * 15;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(viewW, viewH);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 3. 前景連續地形
        ctx.save();
        ctx.fillStyle = COLOR.gray;
        ctx.beginPath();
        ctx.moveTo(0, viewH);

        var sampleStep = 5;
        for (var scrX = 0; scrX <= viewW + sampleStep; scrX += sampleStep) {
          var wx = camX + scrX;
          var wy = R.trackGroundAt(wx, track);
          ctx.lineTo(scrX, wy);
        }
        ctx.lineTo(viewW, viewH);
        ctx.closePath();
        ctx.fill();

        // 地形上緣粗黑輪廓線 (3px)
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var scrX2 = 0; scrX2 <= viewW + sampleStep; scrX2 += sampleStep) {
          var wx2 = camX + scrX2;
          var wy2 = R.trackGroundAt(wx2, track);
          if (scrX2 === 0) ctx.moveTo(scrX2, wy2);
          else ctx.lineTo(scrX2, wy2);
        }
        ctx.stroke();

        // 坡度指引條紋（使上坡與下坡極易辨識）
        ctx.strokeStyle = "rgba(15, 13, 10, 0.18)";
        ctx.lineWidth = 2;
        var firstTick = Math.floor(camX / 30) * 30;
        for (var tx = firstTick; tx <= camX + viewW + 30; tx += 30) {
          var screenTickX = tx - camX;
          var ty = R.trackGroundAt(tx, track);
          var tSlope = R.trackSlopeAt(tx, track);
          var tickLen = 14 + Math.abs(tSlope) * 20;
          ctx.beginPath();
          ctx.moveTo(screenTickX, ty);
          ctx.lineTo(screenTickX - tSlope * 10, ty + tickLen);
          ctx.stroke();
        }
        ctx.restore();

        // 4. 關鍵影格旗 (Keyframe Flags)
        for (var f = 0; f < flags.length; f++) {
          var fx = flags[f] - camX;
          if (fx > -60 && fx < viewW + 60) {
            var fy = R.trackGroundAt(flags[f], track);
            var passed = state.flagsState[f];

            // 旗桿
            ctx.strokeStyle = COLOR.ink;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx, fy - 65);
            ctx.stroke();

            // 關鍵影格菱形標誌 (◆)
            ctx.save();
            ctx.translate(fx, fy - 65);
            ctx.fillStyle = passed ? COLOR.yellow : COLOR.paper;
            ctx.strokeStyle = COLOR.ink;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -9);
            ctx.lineTo(9, 0);
            ctx.lineTo(0, 9);
            ctx.lineTo(-9, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // 旗面
            ctx.fillStyle = passed ? COLOR.yellow : COLOR.blue;
            ctx.strokeStyle = COLOR.ink;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fx, fy - 65);
            ctx.lineTo(fx + 36, fy - 52);
            ctx.lineTo(fx, fy - 38);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 旗面文字
            ctx.fillStyle = passed ? COLOR.ink : COLOR.paper;
            ctx.font = "bold 11px system-ui";
            ctx.fillText("KF " + (f + 1), fx + 4, fy - 48);

            // 地面目標線
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = COLOR.ink;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx, viewH);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // 5. 玩家角色（具有 Squash & Stretch 彈性質感的漫畫滑翔球）
        var pScrX = player.x - camX;
        var pScrY = player.y;

        // 俯衝加速殘影線
        if (player.dive) {
          ctx.strokeStyle = COLOR.ink;
          ctx.lineWidth = 2;
          for (var sl = 1; sl <= 3; sl++) {
            ctx.beginPath();
            ctx.moveTo(pScrX - sl * 12, pScrY - 4 + sl * 4);
            ctx.lineTo(pScrX - sl * 12 - 16, pScrY - 4 + sl * 4);
            ctx.stroke();
          }
        }

        ctx.save();
        ctx.translate(pScrX, pScrY);
        ctx.rotate(player.angle);
        ctx.scale(player.squashX, player.squashY);

        // 角色本體：黃色帶黑硬邊框的幾何滑翔球
        ctx.fillStyle = player.dive ? COLOR.red : COLOR.yellow;
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 角色眼睛（漫畫風點睛，隨速度與俯衝變換）
        ctx.fillStyle = COLOR.ink;
        if (player.dive) {
          // 俯衝時瞇眼衝刺
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(3, -3);
          ctx.lineTo(8, -1);
          ctx.stroke();
        } else {
          // 滑翔時圓亮眼
          ctx.beginPath();
          ctx.arc(4, -3, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 角色鳥嘴／導流翼（純幾何三角）
        ctx.fillStyle = COLOR.ink;
        ctx.beginPath();
        ctx.moveTo(player.r - 2, -2);
        ctx.lineTo(player.r + 6, 0);
        ctx.lineTo(player.r - 2, 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // 6. 粒子與打擊感效果
        for (var pi = 0; pi < particles.length; pi++) {
          var prt = particles[pi];
          var ptScrX = prt.x - camX;
          ctx.fillStyle = prt.color;
          ctx.strokeStyle = COLOR.ink;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(ptScrX - prt.size / 2, prt.y - prt.size / 2, prt.size, prt.size);
          ctx.fill();
          ctx.stroke();
        }

        for (var fi = 0; fi < floatTexts.length; fi++) {
          var ft = floatTexts[fi];
          var ftScrX = ft.x - camX;
          var alpha = Math.max(0, ft.life / ft.maxLife);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = "bold " + ft.size + "px system-ui";
          ctx.fillStyle = ft.color;
          ctx.strokeStyle = COLOR.ink;
          ctx.lineWidth = 3;
          ctx.strokeText(ft.text, ftScrX, ft.y);
          ctx.fillText(ft.text, ftScrX, ft.y);
          ctx.restore();
        }

        // 閃白效果 (Flash)
        if (juice.flashTime > 0) {
          ctx.fillStyle = juice.flashColor;
          ctx.fillRect(0, 0, viewW, viewH);
        }

        // 7. HUD 上方資訊區（60秒倒數條、階段標籤、關鍵影格進度、得分）
        var barW = Math.min(320, viewW - 140);
        var barX = 14;
        var barY = 12;

        // 倒數計時外框
        ctx.fillStyle = "rgba(15, 13, 10, 0.15)";
        ctx.fillRect(barX, barY, barW, 10);
        var timeRatio = state.timeRemaining / R.TOTAL_SECONDS;
        ctx.fillStyle = state.timeRemaining < 15 ? COLOR.red : COLOR.blue;
        ctx.fillRect(barX, barY, barW * timeRatio, 10);
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, 10);

        // 剩餘秒數文字
        ctx.fillStyle = COLOR.ink;
        ctx.font = "bold 13px system-ui";
        ctx.fillText(Math.ceil(state.timeRemaining) + "s", barX + barW + 8, barY + 9);

        // 難度三階指示牌
        var stageConf = R.STAGE_CONFIGS[state.stage];
        ctx.fillStyle = COLOR.paper;
        ctx.fillRect(barX, barY + 16, 150, 22);
        ctx.strokeRect(barX, barY + 16, 150, 22);
        ctx.fillStyle = COLOR.ink;
        ctx.font = "bold 12px system-ui";
        ctx.fillText(stageConf.name, barX + 6, barY + 32);

        // 關鍵影格旗進度 (◆ ◆ ◆)
        var flagHUDX = viewW - 130;
        ctx.font = "bold 12px system-ui";
        ctx.fillText("關鍵影格: " + state.flagsPassed + " / 3", flagHUDX, 22);
        for (var k = 0; k < 3; k++) {
          ctx.fillStyle = state.flagsState[k] ? COLOR.yellow : "rgba(15, 13, 10, 0.2)";
          ctx.beginPath();
          var kx = flagHUDX + k * 18 + 8;
          var ky = 34;
          ctx.moveTo(kx, ky - 5);
          ctx.lineTo(kx + 5, ky);
          ctx.lineTo(kx, ky + 5);
          ctx.lineTo(kx - 5, ky);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // 分數
        ctx.font = "bold 14px system-ui";
        ctx.fillStyle = COLOR.ink;
        ctx.fillText("分數: " + state.score, flagHUDX, 58);

        // 8. 額外需求：即時「速度時間曲線」折線圖 (Timing Curve Widget)
        var graphW = Math.min(190, viewW * 0.45);
        var graphH = 50;
        var graphX = 14;
        var graphY = viewH - graphH - 12;

        // 曲線圖底板（硬邊框 + 紙質襯底）
        ctx.fillStyle = COLOR.paper;
        ctx.fillRect(graphX, graphY, graphW, graphH);
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 2;
        ctx.strokeRect(graphX, graphY, graphW, graphH);

        // 參考線（網格）
        ctx.strokeStyle = "rgba(15, 13, 10, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphH * 0.5);
        ctx.lineTo(graphX + graphW, graphY + graphH * 0.5);
        ctx.stroke();

        // 繪製速度曲線 (Slow In & Slow Out Polyline)
        if (speedHistory.length > 2) {
          ctx.strokeStyle = COLOR.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (var si = 0; si < speedHistory.length; si++) {
            var sample = speedHistory[si];
            var gx = graphX + (si / (maxHistorySamples - 1)) * graphW;
            // 速度歸一化至圖表高度
            var normV = (sample.v - R.PHY.minSpd) / (R.PHY.maxSpd - R.PHY.minSpd);
            var gyPlot = graphY + graphH - 4 - Math.max(0, Math.min(1, normV)) * (graphH - 10);
            if (si === 0) ctx.moveTo(gx, gyPlot);
            else ctx.lineTo(gx, gyPlot);
          }
          ctx.stroke();

          // 在當前速度端點畫一個關鍵影格菱形標記
          var lastSample = speedHistory[speedHistory.length - 1];
          var lastNormV = (lastSample.v - R.PHY.minSpd) / (R.PHY.maxSpd - R.PHY.minSpd);
          var lastGX = graphX + graphW - 2;
          var lastGY = graphY + graphH - 4 - Math.max(0, Math.min(1, lastNormV)) * (graphH - 10);

          ctx.fillStyle = COLOR.yellow;
          ctx.strokeStyle = COLOR.ink;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(lastGX, lastGY - 4);
          ctx.lineTo(lastGX + 4, lastGY);
          ctx.lineTo(lastGX, lastGY + 4);
          ctx.lineTo(lastGX - 4, lastGY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // 速度數值與小圖標題
        ctx.fillStyle = COLOR.ink;
        ctx.font = "bold 10px system-ui";
        ctx.fillText("速度曲線 (Timing Curve)", graphX + 6, graphY + 12);
        ctx.font = "bold 11px system-ui";
        ctx.fillStyle = player.vx > 400 ? COLOR.red : COLOR.blue;
        ctx.fillText(Math.round(player.vx) + " px/s", graphX + graphW - 55, graphY + 12);

        // 9. 10 秒教會示範引導（開場 3 秒動態提示）
        if (state.showTeaching) {
          var promptW = Math.min(360, viewW - 40);
          var promptH = 34;
          var promptX = (viewW - promptW) / 2;
          var promptY = viewH * 0.28;

          ctx.fillStyle = COLOR.yellow;
          ctx.fillRect(promptX, promptY, promptW, promptH);
          ctx.strokeStyle = COLOR.ink;
          ctx.lineWidth = 2;
          ctx.strokeRect(promptX, promptY, promptW, promptH);

          ctx.fillStyle = COLOR.ink;
          ctx.font = "bold 13px system-ui";
          ctx.textAlign = "center";
          ctx.fillText("【下坡按住俯衝加速、上坡前放開飛起！】", viewW / 2, promptY + 22);
          ctx.textAlign = "left";
        }

        // 10. 右下角固定標籤：GRAYBOX（規格硬約束）
        ctx.font = "bold 11px system-ui";
        ctx.fillStyle = "rgba(15, 13, 10, 0.45)";
        ctx.textAlign = "right";
        ctx.fillText("GRAYBOX", viewW - 10, viewH - 10);
        ctx.textAlign = "left";

        ctx.restore();
      }

      // 遊戲時鐘主迴圈
      function loop(timestamp) {
        if (!running) return;
        var dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
        lastTimestamp = timestamp;

        update(dt);
        render();

        rafId = requestAnimationFrame(loop);
      }

      rafId = requestAnimationFrame(loop);

      // ======================================================================
      // destroy 生命週期清理
      // ======================================================================
      return {
        destroy: function () {
          running = false;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }

          touchOverlay.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
          window.removeEventListener("keydown", onKeyDown);
          window.removeEventListener("keyup", onKeyUp);
          window.removeEventListener("blur", onWindowBlur);

          if (ro) {
            ro.disconnect();
            ro = null;
          }

          audio.destroy();
          root.innerHTML = "";
        }
      };
    }
  };
})();
