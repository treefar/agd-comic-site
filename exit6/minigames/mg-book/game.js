(function () {
  'use strict';

  var R = (typeof globalThis !== 'undefined' && globalThis.EXIT6_RULES_MG_BOOK) ||
          (typeof window !== 'undefined' && window.EXIT6_RULES_MG_BOOK) ||
          {};

  // 灰盒色票規範
  var PALETTE = {
    paper: '#f4ecd8',
    ink: '#0f0d0a',
    red: '#e63946',
    yellow: '#ffd60a',
    blue: '#1d4ed8',
    grey: '#8a948e'
  };

  var V_WIDTH = 400;
  var V_HEIGHT = 600;

  function createSoundEngine() {
    var audioCtx = null;
    function getContext() {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function play(type) {
      var ac = getContext();
      if (!ac) return;
      var now = ac.currentTime;

      if (type === 'jump') {
        var osc = ac.createOscillator();
        var gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'collect') {
        var o1 = ac.createOscillator();
        var g1 = ac.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(659.25, now);
        o1.frequency.setValueAtTime(880, now + 0.07);
        g1.gain.setValueAtTime(0.28, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        o1.connect(g1);
        g1.connect(ac.destination);
        o1.start(now);
        o1.stop(now + 0.17);
      } else if (type === 'win') {
        var freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach(function (f, idx) {
          var o = ac.createOscillator();
          var g = ac.createGain();
          o.type = 'triangle';
          o.frequency.value = f;
          var t = now + idx * 0.08;
          g.gain.setValueAtTime(0.25, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          o.connect(g);
          g.connect(ac.destination);
          o.start(t);
          o.stop(t + 0.22);
        });
      } else if (type === 'fail') {
        var oFail = ac.createOscillator();
        var gFail = ac.createGain();
        oFail.type = 'sawtooth';
        oFail.frequency.setValueAtTime(180, now);
        oFail.frequency.exponentialRampToValueAtTime(75, now + 0.28);
        gFail.gain.setValueAtTime(0.26, now);
        gFail.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        oFail.connect(gFail);
        gFail.connect(ac.destination);
        oFail.start(now);
        oFail.stop(now + 0.29);
      }
    }

    function destroy() {
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
        audioCtx = null;
      }
    }

    return { getContext: getContext, play: play, destroy: destroy };
  }

  function drawGeometricCharacter(ctx, cx, cy, scale, parts, isSilhouette, faceDir) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale * (faceDir < 0 ? -1 : 1), scale);

    var ink = PALETTE.ink;
    var paper = PALETTE.paper;
    var red = PALETTE.red;
    var yellow = PALETTE.yellow;
    var blue = PALETTE.blue;
    var grey = PALETTE.grey;

    if (isSilhouette) {
      paper = ink;
      red = ink;
      yellow = ink;
      blue = ink;
      grey = ink;
    }

    ctx.lineWidth = isSilhouette ? 1 : 3;
    ctx.strokeStyle = ink;
    ctx.lineJoin = 'miter';

    // 1. 雙腳 (Feet)
    ctx.fillStyle = ink;
    ctx.fillRect(-10, 12, 7, 7);
    ctx.fillRect(3, 12, 7, 7);
    if (!isSilhouette) {
      ctx.strokeRect(-10, 12, 7, 7);
      ctx.strokeRect(3, 12, 7, 7);
    }

    // 2. 身體本體 (Base Body)
    ctx.fillStyle = paper;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-12, -14, 24, 26, 6) : ctx.rect(-12, -14, 24, 26);
    ctx.fill();
    if (!isSilhouette) {
      ctx.stroke();
    }

    // 3. 圍巾 (Scarf)
    if (parts.scarf) {
      ctx.fillStyle = red;
      // 圍巾領圈
      ctx.fillRect(-14, -2, 28, 7);
      if (!isSilhouette) ctx.strokeRect(-14, -2, 28, 7);
      // 飄逸的後擺 (動態剪影)
      ctx.beginPath();
      ctx.moveTo(-10, 2);
      ctx.lineTo(-24, 6);
      ctx.lineTo(-22, 16);
      ctx.lineTo(-8, 5);
      ctx.closePath();
      ctx.fill();
      if (!isSilhouette) ctx.stroke();
    }

    // 4. 眼睛 (Eyes)
    if (parts.eyes) {
      if (isSilhouette) {
        // 剪影模式下眼睛化為外輪廓或小眼縫，增加外側辨識
        ctx.fillStyle = paper;
        ctx.fillRect(2, -8, 6, 4);
      } else {
        // 大星星幾何萌眼
        ctx.fillStyle = yellow;
        ctx.beginPath();
        ctx.arc(3, -7, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 瞳孔
        ctx.fillStyle = ink;
        ctx.beginPath();
        ctx.arc(4, -7, 2, 0, Math.PI * 2);
        ctx.fill();

        // 另一隻眼 (側視角縮小)
        ctx.fillStyle = yellow;
        ctx.beginPath();
        ctx.arc(-5, -7, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = ink;
        ctx.beginPath();
        ctx.arc(-4, -7, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      if (!isSilhouette) {
        // 基礎簡易眼睛
        ctx.fillStyle = ink;
        ctx.fillRect(2, -7, 3, 3);
      }
    }

    // 5. 帽子 (Hat)
    if (parts.hat) {
      // 巫師／繪本畫家高帽
      ctx.fillStyle = blue;
      ctx.beginPath();
      ctx.moveTo(-16, -14);
      ctx.lineTo(16, -14);
      ctx.lineTo(8, -32);
      ctx.lineTo(-6, -34);
      ctx.closePath();
      ctx.fill();
      if (!isSilhouette) ctx.stroke();

      // 帽沿底板
      ctx.fillStyle = yellow;
      ctx.fillRect(-18, -16, 36, 4);
      if (!isSilhouette) ctx.strokeRect(-18, -16, 36, 4);

      // 帽頂小絨球
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.arc(-6, -35, 4, 0, Math.PI * 2);
      ctx.fill();
      if (!isSilhouette) ctx.stroke();
    }

    // 6. 配件 (Accessory - 畫筆 / 魔法杖)
    if (parts.accessory) {
      ctx.fillStyle = yellow;
      // 筆桿 / 杖身
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(24, -18);
      ctx.lineTo(27, -15);
      ctx.lineTo(13, 3);
      ctx.closePath();
      ctx.fill();
      if (!isSilhouette) ctx.stroke();

      // 筆尖 / 杖頭星狀幾何
      ctx.fillStyle = red;
      ctx.fillRect(22, -24, 7, 7);
      if (!isSilhouette) ctx.strokeRect(22, -24, 7, 7);
    }

    ctx.restore();
  }

  function drawPartIcon(ctx, type, cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);
    var ink = PALETTE.ink;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = ink;

    if (type === 'hat') {
      ctx.fillStyle = PALETTE.blue;
      ctx.beginPath();
      ctx.moveTo(-size * 0.7, size * 0.4);
      ctx.lineTo(size * 0.7, size * 0.4);
      ctx.lineTo(size * 0.3, -size * 0.6);
      ctx.lineTo(-size * 0.3, -size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = PALETTE.yellow;
      ctx.fillRect(-size * 0.9, size * 0.3, size * 1.8, size * 0.25);
      ctx.strokeRect(-size * 0.9, size * 0.3, size * 1.8, size * 0.25);
    } else if (type === 'eyes') {
      ctx.fillStyle = PALETTE.yellow;
      ctx.beginPath();
      ctx.arc(-size * 0.35, 0, size * 0.4, 0, Math.PI * 2);
      ctx.arc(size * 0.35, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(-size * 0.3, 0, size * 0.18, 0, Math.PI * 2);
      ctx.arc(size * 0.4, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'scarf') {
      ctx.fillStyle = PALETTE.red;
      ctx.fillRect(-size * 0.7, -size * 0.2, size * 1.4, size * 0.4);
      ctx.strokeRect(-size * 0.7, -size * 0.2, size * 1.4, size * 0.4);

      ctx.beginPath();
      ctx.moveTo(-size * 0.4, size * 0.2);
      ctx.lineTo(-size * 0.8, size * 0.8);
      ctx.lineTo(-size * 0.2, size * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (type === 'accessory') {
      ctx.fillStyle = PALETTE.yellow;
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.5);
      ctx.lineTo(size * 0.4, -size * 0.4);
      ctx.lineTo(size * 0.6, -size * 0.2);
      ctx.lineTo(-size * 0.3, size * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = PALETTE.red;
      ctx.fillRect(size * 0.2, -size * 0.7, size * 0.5, size * 0.5);
      ctx.strokeRect(size * 0.2, -size * 0.7, size * 0.5, size * 0.5);
    }
    ctx.restore();
  }

  window.EXIT6_MG = window.EXIT6_MG || {};
  window.EXIT6_MG['mg-book'] = {
    title: '繪本跳跳：角色設計',
    skill: '繪本與角色造型',
    seconds: 60,
    mount: function (root, api) {
      api = api || {};
      var rng = typeof api.rng === 'function' ? api.rng : Math.random;
      var onEnd = typeof api.onEnd === 'function' ? api.onEnd : function () {};
      var endCalled = false;

      var sounds = createSoundEngine();

      // prefers-reduced-motion 偵測
      var reducedMotion = false;
      if (typeof window.matchMedia === 'function') {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }

      // 容器建立
      root.innerHTML = '';
      root.style.position = 'relative';
      root.style.overflow = 'hidden';
      root.style.userSelect = 'none';
      root.style.webkitUserSelect = 'none';
      root.style.touchAction = 'none';
      root.style.background = PALETTE.paper;

      var canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.position = 'absolute';
      canvas.style.left = '50%';
      canvas.style.top = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      root.appendChild(canvas);

      var ctx = canvas.getContext('2d');

      // 遊戲狀態機
      var gameState = 'playing'; // 'playing' | 'gameover'
      var timeElapsed = 0;
      var timeLeft = 60;
      var height = 0;
      var camY = 0;
      var score = 0;
      var isWin = false;
      var failReason = '';
      var hintTimer = 3.5; // 開場 3.5 秒示範動作提示

      var screenShake = 0;
      var redFlash = 0;

      // 零件收集紀錄
      var collectedParts = {
        hat: false,
        eyes: false,
        scarf: false,
        accessory: false
      };
      var collectedCount = 0;

      // 角色物理
      var player = {
        x: V_WIDTH / 2 - R.PLAYER_W / 2,
        y: V_HEIGHT - 120,
        w: R.PLAYER_W,
        h: R.PLAYER_H,
        vx: 0,
        vy: R.BOUNCE_SPEED,
        face: 1,
        squash: 1
      };

      // 平台清單
      var platforms = [];
      var platState = {
        tier: 1,
        topY: V_HEIGHT - 80,
        topX: V_WIDTH / 2 - 45
      };

      // 起始平台
      platforms.push({
        x: V_WIDTH / 2 - 50,
        y: V_HEIGHT - 80,
        w: 100,
        h: R.PLATFORM_H,
        kind: 'normal',
        dir: 1,
        part: null
      });

      // 初始預先生成平台直到頂部
      while (platState.topY > -V_HEIGHT) {
        platState.tier = R.getTier(timeElapsed);
        platforms.push(R.generatePlatform(platState, rng, V_WIDTH));
      }

      // 粒子池與飄浮文字
      var particles = [];
      var floatTexts = [];

      function addParticles(x, y, count, color, speed) {
        if (reducedMotion) return;
        for (var i = 0; i < count; i++) {
          var angle = (rng() * Math.PI * 2);
          var spd = (15 + rng() * (speed || 50));
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 0.35 + rng() * 0.25,
            maxLife: 0.6,
            color: color || PALETTE.yellow,
            size: 3 + rng() * 3
          });
        }
      }

      function addFloatText(text, x, y, color) {
        floatTexts.push({
          text: text,
          x: x,
          y: y,
          vy: -35,
          life: 0.8,
          maxLife: 0.8,
          color: color || PALETTE.ink
        });
      }

      // 終點封面平台是否已建立
      var coverPlatCreated = false;

      // 輸入控制
      var inputAxis = 0;
      var pointerActive = false;
      var pointerX = V_WIDTH / 2;

      function onPointerDown(e) {
        sounds.getContext();
        pointerActive = true;
        var rect = canvas.getBoundingClientRect();
        var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
        var normX = (clientX - rect.left) / rect.width * V_WIDTH;
        pointerX = normX;
        inputAxis = pointerX < V_WIDTH / 2 ? -1 : 1;
        hintTimer = 0; // 一旦有點擊就隱藏新手引導
      }

      function onPointerMove(e) {
        if (!pointerActive) return;
        var rect = canvas.getBoundingClientRect();
        var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : pointerX);
        var normX = (clientX - rect.left) / rect.width * V_WIDTH;
        pointerX = normX;
        inputAxis = pointerX < V_WIDTH / 2 ? -1 : 1;
      }

      function onPointerUp() {
        pointerActive = false;
        inputAxis = 0;
      }

      var keysPressed = {};
      function onKeyDown(e) {
        sounds.getContext();
        keysPressed[e.code] = true;
        hintTimer = 0;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          inputAxis = -1;
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          inputAxis = 1;
        }
      }

      function onKeyUp(e) {
        keysPressed[e.code] = false;
        if ((keysPressed['ArrowLeft'] || keysPressed['KeyA'])) {
          inputAxis = -1;
        } else if ((keysPressed['ArrowRight'] || keysPressed['KeyD'])) {
          inputAxis = 1;
        } else if (!pointerActive) {
          inputAxis = 0;
        }
      }

      // 掛載輸入監聽 (掛在 root 與 window 上，在 destroy 中嚴格移除)
      root.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      // 視窗自適應
      var viewScale = 1;
      function resize() {
        var rw = root.clientWidth || 400;
        var rh = root.clientHeight || 600;
        viewScale = Math.min(rw / V_WIDTH, rh / V_HEIGHT);
        var dpr = window.devicePixelRatio || 1;

        var cssW = Math.floor(V_WIDTH * viewScale);
        var cssH = Math.floor(V_HEIGHT * viewScale);

        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr * viewScale, dpr * viewScale);
      }

      var resizeObserver = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(function () {
          resize();
        });
        resizeObserver.observe(root);
      }
      window.addEventListener('resize', resize);
      resize();


      function finishGame(win, reason) {
        if (gameState === 'gameover') return;
        gameState = 'gameover';
        isWin = win;
        failReason = reason;

        score = R.calculateScore(height, collectedCount, timeLeft, isWin);

        if (isWin) {
          sounds.play('win');
          addParticles(V_WIDTH / 2, V_HEIGHT / 2, 40, PALETTE.yellow, 120);
        } else {
          sounds.play('fail');
          if (!reducedMotion) {
            screenShake = 0.35;
            redFlash = 0.25;
          }
        }

        if (!endCalled) {
          endCalled = true;
          onEnd({ win: isWin, score: score });
        }
      }

      // 主更新與渲染迴圈
      var lastTime = 0;
      var animFrameId = null;

      function update(dt) {
        if (screenShake > 0) screenShake = Math.max(0, screenShake - dt);
        if (redFlash > 0) redFlash = Math.max(0, redFlash - dt);

        // 粒子更新
        for (var pi = particles.length - 1; pi >= 0; pi--) {
          var p = particles[pi];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) particles.splice(pi, 1);
        }

        // 飄字更新
        for (var fi = floatTexts.length - 1; fi >= 0; fi--) {
          var ft = floatTexts[fi];
          ft.y += ft.vy * dt;
          ft.life -= dt;
          if (ft.life <= 0) floatTexts.splice(fi, 1);
        }

        if (gameState === 'gameover') return;

        // 時間推進
        timeElapsed += dt;
        timeLeft = Math.max(0, 60 - timeElapsed);
        if (hintTimer > 0) hintTimer -= dt;

        // 階級判定
        var currentTier = R.getTier(timeElapsed);
        platState.tier = currentTier;
        var tierCfg = R.getTierConfig(currentTier);

        // 水平朝向
        if (inputAxis !== 0) {
          player.face = inputAxis > 0 ? 1 : -1;
        }

        // 物理更新
        R.updatePlayerPosition(player, inputAxis, dt, V_WIDTH, R.GRAVITY);

        // 縮放果汁回復
        player.squash += (1 - player.squash) * 12 * dt;

        // 平台移動更新
        for (var i = 0; i < platforms.length; i++) {
          var plat = platforms[i];
          if (plat.kind === 'move') {
            plat.x += plat.dir * tierCfg.moveSpeed * dt;
            if (plat.x < 6) {
              plat.x = 6;
              plat.dir = 1;
            } else if (plat.x + plat.w > V_WIDTH - 6) {
              plat.x = V_WIDTH - 6 - plat.w;
              plat.dir = -1;
            }
          }
        }

        // 碰撞判定：落到平台
        if (player.vy > 0) {
          for (var j = 0; j < platforms.length; j++) {
            var pl = platforms[j];
            if (R.checkPlatformLanding(player, pl)) {
              player.y = pl.y - player.h;
              player.vy = R.BOUNCE_SPEED;
              player.squash = 0.72; // 落地壓縮果汁

              sounds.play('jump');
              addParticles(player.x + player.w / 2, pl.y, 6, PALETTE.ink, 40);

              // 如果踩上封面平台直接勝利
              if (pl.isCover) {
                finishGame(true, 'reach_cover');
                return;
              }
              break;
            }
          }
        }

        // 零件收集判定
        for (var k = 0; k < platforms.length; k++) {
          var targetPlat = platforms[k];
          if (targetPlat.part && !targetPlat.part.collected) {
            if (R.checkPartCollect(player, targetPlat.part, targetPlat)) {
              targetPlat.part.collected = true;
              var pType = targetPlat.part.type;
              if (!collectedParts[pType]) {
                collectedParts[pType] = true;
                collectedCount++;
              }
              sounds.play('collect');
              addParticles(targetPlat.x + targetPlat.w / 2, targetPlat.y - 14, 12, PALETTE.yellow, 70);

              var partNames = {
                hat: '帽子！',
                eyes: '眼睛！',
                scarf: '圍巾！',
                accessory: '配件！'
              };
              addFloatText('+' + (partNames[pType] || '零件！'), targetPlat.x + targetPlat.w / 2, targetPlat.y - 20, PALETTE.red);
            }
          }
        }

        // 鏡頭只往上追，高度只增不減
        var targetCam = player.y - V_HEIGHT * 0.45;
        if (targetCam < camY) {
          height += (camY - targetCam) / 10;
          camY = targetCam;
        }

        // 判定封面頁建立
        if (height >= R.TARGET_HEIGHT - 6 && !coverPlatCreated) {
          coverPlatCreated = true;
          platforms.push({
            x: V_WIDTH / 2 - 120,
            y: camY - 140,
            w: 240,
            h: 18,
            kind: 'normal',
            dir: 0,
            isCover: true,
            part: null
          });
        }

        // 動態生成前方平台
        while (platState.topY > camY - V_HEIGHT * 0.8) {
          platforms.push(R.generatePlatform(platState, rng, V_WIDTH));
        }

        // 移除遠離鏡頭下方的舊平台
        for (var d = platforms.length - 1; d >= 0; d--) {
          if (platforms[d].y > camY + V_HEIGHT + 80) {
            platforms.splice(d, 1);
          }
        }

        // 勝負檢查
        var status = R.checkGameStatus(height, R.TARGET_HEIGHT, timeLeft, player.y, camY, V_HEIGHT);
        if (status.over) {
          finishGame(status.win, status.reason);
        }
      }

      function render() {
        ctx.save();

        // 螢幕震動
        if (screenShake > 0) {
          var sx = (rng() - 0.5) * 8;
          var sy = (rng() - 0.5) * 8;
          ctx.translate(sx, sy);
        }

        // 1. 繪本畫紙底色
        ctx.fillStyle = PALETTE.paper;
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // 漫畫風格筆記方格紋理 (跟隨鏡頭滾動)
        ctx.strokeStyle = 'rgba(15, 13, 10, 0.06)';
        ctx.lineWidth = 1;
        var offY = ((-camY) % 24 + 24) % 24;
        for (var gx = 0; gx <= V_WIDTH; gx += 24) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, V_HEIGHT);
          ctx.stroke();
        }
        for (var gy = offY; gy <= V_HEIGHT; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(V_WIDTH, gy);
          ctx.stroke();
        }

        // 2. 世界物件渲染 (隨鏡頭平移)
        ctx.save();
        ctx.translate(0, -camY);

        // 繪製平台
        for (var i = 0; i < platforms.length; i++) {
          var pl = platforms[i];
          if (pl.y > camY + V_HEIGHT + 30 || pl.y < camY - 50) continue;

          // 硬陰影 (4px 4px 墨色)
          ctx.fillStyle = PALETTE.ink;
          ctx.fillRect(pl.x + 4, pl.y + 4, pl.w, pl.h);

          if (pl.isCover) {
            // 封面大平台
            ctx.fillStyle = PALETTE.yellow;
            ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
            ctx.lineWidth = 3;
            ctx.strokeStyle = PALETTE.ink;
            ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);

            // 封面文字
            ctx.fillStyle = PALETTE.ink;
            ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('★ 繪本封面特等席 ★', pl.x + pl.w / 2, pl.y + 13);
          } else {
            // 普通或移動平台
            ctx.fillStyle = pl.kind === 'move' ? PALETTE.blue : PALETTE.paper;
            ctx.fillRect(pl.x, pl.y, pl.w, pl.h);

            ctx.lineWidth = 3;
            ctx.strokeStyle = PALETTE.ink;
            ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);

            // 平台裝飾紋理
            if (pl.kind === 'move') {
              ctx.fillStyle = PALETTE.yellow;
              ctx.fillRect(pl.x + 4, pl.y + 3, 6, 6);
              ctx.fillRect(pl.x + pl.w - 10, pl.y + 3, 6, 6);
            }
          }

          // 零件繪製
          if (pl.part && !pl.part.collected) {
            var pcx = pl.x + pl.w / 2;
            var pcy = pl.y - 14;
            // 硬陰影
            ctx.fillStyle = 'rgba(15, 13, 10, 0.2)';
            ctx.beginPath();
            ctx.arc(pcx + 2, pcy + 2, 10, 0, Math.PI * 2);
            ctx.fill();

            drawPartIcon(ctx, pl.part.type, pcx, pcy, 12);
          }
        }

        // 繪製主角 (帶彈跳拉伸與面向)
        ctx.save();
        var stretchY = player.squash;
        if (player.vy < -120) stretchY = 1.15;
        else if (player.vy > 180) stretchY = 0.9;

        var charX = player.x + player.w / 2;
        var charY = player.y + player.h / 2;
        ctx.translate(charX, charY);
        ctx.scale(1 / stretchY, stretchY);

        drawGeometricCharacter(ctx, 0, 0, 1, collectedParts, false, player.face);
        ctx.restore();

        // 粒子渲染
        for (var pi = 0; pi < particles.length; pi++) {
          var p = particles[pi];
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }

        // 飄字渲染
        for (var fi = 0; fi < floatTexts.length; fi++) {
          var ft = floatTexts[fi];
          ctx.fillStyle = ft.color;
          ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y);
        }

        ctx.restore(); // 退出世界座標

        // 3. UI 與 HUD 渲染 (固定螢幕)
        drawHUD();

        // 4. 開場 3 秒示範動作引導
        if (hintTimer > 0 && gameState === 'playing') {
          drawTeachingHint();
        }

        // 5. 結束畫面覆蓋
        if (gameState === 'gameover') {
          drawGameOverScreen();
        }

        // 6. 紅色警示閃爍 (失敗果汁)
        if (redFlash > 0) {
          ctx.fillStyle = 'rgba(230, 57, 70, ' + Math.min(0.4, redFlash * 1.5) + ')';
          ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
        }

        // 7. 固定灰盒小標記
        ctx.fillStyle = PALETTE.grey;
        ctx.font = 'bold 11px monospace, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('GRAYBOX', V_WIDTH - 8, V_HEIGHT - 8);

        ctx.restore();
      }

      function drawHUD() {
        var ink = PALETTE.ink;
        var red = PALETTE.red;
        var yellow = PALETTE.yellow;

        // 頂部倒數計時條
        var barW = V_WIDTH - 32;
        var barH = 10;
        var barX = 16;
        var barY = 12;

        ctx.fillStyle = PALETTE.paper;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = ink;
        ctx.strokeRect(barX, barY, barW, barH);

        var timeProgress = Math.max(0, timeLeft / 60);
        ctx.fillStyle = timeProgress < 0.25 ? red : yellow;
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * timeProgress, barH - 4);

        // 倒數數字
        ctx.fillStyle = ink;
        ctx.font = 'bold 12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.ceil(timeLeft) + 's', barX + barW, barY + barH + 15);

        // 左上角高度進度
        ctx.textAlign = 'left';
        ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('封面進度: ' + Math.min(80, Math.floor(height)) + 'm / 80m', 16, 40);

        // 階段指示器 (右側)
        var tier = R.getTier(timeElapsed);
        var tierNames = ['起草打底', '剪影修邊', '封面著色'];
        ctx.textAlign = 'right';
        ctx.font = 'bold 12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('第 ' + tier + ' 階：' + tierNames[tier - 1], V_WIDTH - 16, 40);

        // 零件收集槽 (4 個小圖示方塊)
        var slotX = 16;
        var slotY = 48;
        var partKeys = ['hat', 'eyes', 'scarf', 'accessory'];
        var partLabels = ['帽', '眼', '巾', '配'];

        for (var i = 0; i < 4; i++) {
          var key = partKeys[i];
          var has = collectedParts[key];
          var sx = slotX + i * 28;

          ctx.fillStyle = has ? yellow : PALETTE.paper;
          ctx.fillRect(sx, slotY, 24, 24);
          ctx.lineWidth = 2;
          ctx.strokeStyle = ink;
          ctx.strokeRect(sx, slotY, 24, 24);

          if (has) {
            drawPartIcon(ctx, key, sx + 12, slotY + 12, 8);
          } else {
            ctx.fillStyle = PALETTE.grey;
            ctx.font = 'bold 11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(partLabels[i], sx + 12, slotY + 16);
          }
        }
      }

      function drawTeachingHint() {
        var alpha = Math.min(1, hintTimer / 0.8);
        ctx.save();
        ctx.globalAlpha = alpha;

        // 半透明遮罩條
        ctx.fillStyle = 'rgba(244, 236, 216, 0.9)';
        ctx.fillRect(20, V_HEIGHT - 110, V_WIDTH - 40, 64);
        ctx.lineWidth = 3;
        ctx.strokeStyle = PALETTE.ink;
        ctx.strokeRect(20, V_HEIGHT - 110, V_WIDTH - 40, 64);

        // 左右方向箭頭示意
        var bounce = Math.sin(timeElapsed * 8) * 6;
        ctx.fillStyle = PALETTE.red;
        // 左箭頭
        ctx.beginPath();
        ctx.moveTo(50 - bounce, V_HEIGHT - 78);
        ctx.lineTo(65 - bounce, V_HEIGHT - 88);
        ctx.lineTo(65 - bounce, V_HEIGHT - 68);
        ctx.closePath();
        ctx.fill();
        // 右箭頭
        ctx.beginPath();
        ctx.moveTo(V_WIDTH - 50 + bounce, V_HEIGHT - 78);
        ctx.lineTo(V_WIDTH - 65 + bounce, V_HEIGHT - 88);
        ctx.lineTo(V_WIDTH - 65 + bounce, V_HEIGHT - 68);
        ctx.closePath();
        ctx.fill();

        // 1 行文字引導
        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('點按螢幕左/右側或方向鍵控制（角色自動彈跳！）', V_WIDTH / 2, V_HEIGHT - 74);

        ctx.restore();
      }

      function drawGameOverScreen() {
        // 背景半透明紙卡
        ctx.fillStyle = 'rgba(244, 236, 216, 0.95)';
        ctx.fillRect(16, 30, V_WIDTH - 32, V_HEIGHT - 60);

        // 硬外框＋硬陰影
        ctx.lineWidth = 3;
        ctx.strokeStyle = PALETTE.ink;
        ctx.strokeRect(16, 30, V_WIDTH - 32, V_HEIGHT - 60);

        // 標題
        ctx.textAlign = 'center';
        ctx.fillStyle = isWin ? PALETTE.red : PALETTE.ink;
        ctx.font = 'bold 22px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText(isWin ? '★ 繪本封面挑戰成功！ ★' : '創作草稿結算', V_WIDTH / 2, 70);

        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 14px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('最終得分: ' + score + ' 分（爬升 ' + Math.floor(height) + 'm）', V_WIDTH / 2, 98);

        // 角色造型雙重視角展示區
        // 左邊：純黑剪影 (Silhouette)；右邊：彩繪造型 (Color)
        var boxY = 115;
        var boxW = 160;
        var boxH = 145;

        // 左展示框（剪影）
        var leftX = 32;
        ctx.fillStyle = PALETTE.paper;
        ctx.fillRect(leftX, boxY, boxW, boxH);
        ctx.strokeRect(leftX, boxY, boxW, boxH);

        drawGeometricCharacter(ctx, leftX + boxW / 2, boxY + boxH / 2 + 10, 1.7, collectedParts, true, 1);
        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('【剪影外輪廓】', leftX + boxW / 2, boxY + 20);
        ctx.font = '11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('純黑也能一眼辨認', leftX + boxW / 2, boxY + boxH - 10);

        // 右展示框（彩繪）
        var rightX = V_WIDTH - 32 - boxW;
        ctx.fillStyle = PALETTE.paper;
        ctx.fillRect(rightX, boxY, boxW, boxH);
        ctx.strokeRect(rightX, boxY, boxW, boxH);

        drawGeometricCharacter(ctx, rightX + boxW / 2, boxY + boxH / 2 + 10, 1.7, collectedParts, false, 1);
        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('【繪本著色】', rightX + boxW / 2, boxY + 20);
        ctx.font = '11px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('幾何特徵配件拼裝', rightX + boxW / 2, boxY + boxH - 10);

        // 造型評語 (專長專業反饋)
        var critique = R.getSilhouetteCritique(collectedParts);
        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('造型評語：', 32, 285);

        ctx.font = '12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        wrapText(ctx, critique, 32, 308, V_WIDTH - 64, 18);

        // 專長知識核心
        ctx.fillStyle = PALETTE.blue;
        ctx.font = 'bold 13px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        ctx.fillText('這就是 繪本與角色造型 在做的事：', 32, 395);

        ctx.fillStyle = PALETTE.ink;
        ctx.font = '12px "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
        var domainLesson = (R && R.DOMAIN_LESSON) || '角色造型靠「剪影＋特徵配件」讓人一眼記住！繪本角色即使抽離顏色化為純黑剪影，也能光憑頂部帽子、飄揚圍巾或獨特側邊配件一眼辨別。';
        wrapText(ctx, domainLesson, 32, 418, V_WIDTH - 64, 18);
      }

      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split('');
        var line = '';
        var curY = y;

        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n];
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, curY);
            line = words[n];
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, curY);
      }

      function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        var dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // 夾取 dt 防止頁籤切換時物理暴衝
        if (dt > 0.1) dt = 0.1;

        update(dt);
        render();

        animFrameId = requestAnimationFrame(loop);
      }

      animFrameId = requestAnimationFrame(loop);

      // destroy 清理介面
      return {
        destroy: function () {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
          root.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerUp);
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('keyup', onKeyUp);
          window.removeEventListener('resize', resize);

          if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
          }

          sounds.destroy();
          root.innerHTML = '';
        }
      };
    }
  };
})();
