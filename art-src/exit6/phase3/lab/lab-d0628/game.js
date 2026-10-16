(function () {
  'use strict';

  var R = window.EXIT6_RULES_LAB_D0628 || (typeof require === 'function' ? require('./rules.js') : null);

  window.EXIT6_MG = window.EXIT6_MG || {};

  window.EXIT6_MG['lab-d0628'] = {
    title: '逐層列印',
    skill: '3D 列印',
    seconds: 60,
    lab: 'D0628 3D 列印工作坊',
    stars: {
      score2: 1000,
      flawless: '列印不溢料'
    },
    mount: function (root, api) {
      if (!R) {
        R = window.EXIT6_RULES_LAB_D0628;
      }

      var ended = false;
      var destroyed = false;
      var rng = (api && typeof api.rng === 'function') ? api.rng : Math.random;

      // 容器建立：絕對不碰 root.style
      var stage = document.createElement('div');
      stage.className = 'd0628-stage';
      stage.setAttribute('style', [
        'position: absolute',
        'inset: 0',
        'width: 100%',
        'height: 100%',
        'overflow: hidden',
        'background: #f4ecd8',
        'color: #0f0d0a',
        'font-family: "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif',
        'user-select: none',
        '-webkit-user-select: none',
        'touch-action: none',
        'display: flex',
        'flex-direction: column'
      ].join('; '));
      root.appendChild(stage);

      // 音訊合成器（Web Audio API，無外部音檔）
      var audioCtx = null;
      function getAudioContext() {
        if (!audioCtx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (AC) audioCtx = new AC();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playTone(freq, duration, type, startGain, endGain) {
        try {
          var ctx = getAudioContext();
          if (!ctx) return;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = type || 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          var g0 = typeof startGain === 'number' ? startGain : 0.18;
          var g1 = typeof endGain === 'number' ? endGain : 0.001;
          gain.gain.setValueAtTime(g0, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, g1), ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {}
      }

      function playSound(name) {
        if (name === 'move') {
          playTone(220, 0.03, 'square', 0.12, 0.01);
        } else if (name === 'rotate') {
          playTone(400, 0.06, 'triangle', 0.18, 0.01);
        } else if (name === 'soft') {
          playTone(150, 0.02, 'sine', 0.08, 0.01);
        } else if (name === 'drop') {
          playTone(90, 0.1, 'sawtooth', 0.22, 0.01);
        } else if (name === 'clear') {
          playTone(523.25, 0.08, 'triangle', 0.2, 0.02);
          setTimeout(function () { playTone(659.25, 0.08, 'triangle', 0.2, 0.02); }, 60);
          setTimeout(function () { playTone(783.99, 0.14, 'triangle', 0.2, 0.01); }, 120);
        } else if (name === 'multiClear') {
          playTone(523.25, 0.08, 'square', 0.22, 0.02);
          setTimeout(function () { playTone(659.25, 0.08, 'square', 0.22, 0.02); }, 70);
          setTimeout(function () { playTone(783.99, 0.08, 'square', 0.22, 0.02); }, 140);
          setTimeout(function () { playTone(1046.5, 0.2, 'square', 0.25, 0.01); }, 210);
        } else if (name === 'win') {
          playTone(440, 0.1, 'triangle', 0.22, 0.02);
          setTimeout(function () { playTone(554.37, 0.1, 'triangle', 0.22, 0.02); }, 100);
          setTimeout(function () { playTone(659.25, 0.12, 'triangle', 0.22, 0.02); }, 200);
          setTimeout(function () { playTone(880, 0.35, 'triangle', 0.28, 0.01); }, 300);
        } else if (name === 'fail') {
          playTone(280, 0.15, 'sawtooth', 0.2, 0.05);
          setTimeout(function () { playTone(160, 0.35, 'sawtooth', 0.25, 0.01); }, 130);
        }
      }

      // UI 頂部列
      var header = document.createElement('div');
      header.setAttribute('style', [
        'display: flex',
        'flex-direction: column',
        'background: #f4ecd8',
        'border-bottom: 3px solid #0f0d0a',
        'padding: 4px 8px',
        'z-index: 10',
        'flex-shrink: 0'
      ].join('; '));

      var topRow = document.createElement('div');
      topRow.setAttribute('style', 'display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px; font-size:12px; font-weight:bold;');
      topRow.innerHTML = [
        '<div><span style="color:#1d4ed8;">逐層列印</span> ｜ D0628 3D 列印工作坊</div>',
        '<div id="d0628-tier-badge" style="background:#ffd60a; padding:1px 6px; border:2px solid #0f0d0a;">階級 1（慢速）</div>',
        '<div>已成型：<span id="d0628-layers-num" style="color:#1d4ed8; font-size:14px;">0</span> / 8 層</div>',
        '<div>分數：<span id="d0628-score-num" style="font-size:14px;">0</span></div>',
        '<div>時間：<span id="d0628-time-num" style="color:#e63946; font-size:14px;">60.0</span>s</div>'
      ].join('');
      header.appendChild(topRow);

      // 時間進度條
      var timeBarTrack = document.createElement('div');
      timeBarTrack.setAttribute('style', 'width:100%; height:6px; background:#8a948e; margin-top:4px; border:1px solid #0f0d0a; overflow:hidden;');
      var timeBarFill = document.createElement('div');
      timeBarFill.setAttribute('style', 'width:100%; height:100%; background:#1d4ed8; transition: width 0.1s linear;');
      timeBarTrack.appendChild(timeBarFill);
      header.appendChild(timeBarTrack);

      // 教學一行
      var tutorialRow = document.createElement('div');
      tutorialRow.setAttribute('style', 'font-size:11px; color:#0f0d0a; text-align:center; padding:2px 0 0 0; font-weight:500;');
      tutorialRow.textContent = '←→ 移動、↑ 旋轉、↓ 加速，把一整排填滿就完成一層';
      header.appendChild(tutorialRow);

      stage.appendChild(header);

      // 遊戲畫布與畫面容器
      var canvasWrap = document.createElement('div');
      canvasWrap.setAttribute('style', 'flex: 1; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;');
      var canvas = document.createElement('canvas');
      canvas.setAttribute('style', 'display:block; max-width:100%; max-height:100%;');
      canvasWrap.appendChild(canvas);
      stage.appendChild(canvasWrap);

      // 手機虛擬按鍵列（至少 44×44）
      var touchBar = document.createElement('div');
      touchBar.setAttribute('style', [
        'display: flex',
        'justify-content: space-around',
        'align-items: center',
        'background: #f4ecd8',
        'border-top: 3px solid #0f0d0a',
        'padding: 6px 4px',
        'flex-shrink: 0',
        'z-index: 10'
      ].join('; '));

      function makeBtn(label, sub, action) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('style', [
          'min-width: 48px',
          'min-height: 48px',
          'padding: 4px 10px',
          'background: #f4ecd8',
          'border: 3px solid #0f0d0a',
          'box-shadow: 3px 3px 0 #0f0d0a',
          'font-family: inherit',
          'font-size: 16px',
          'font-weight: bold',
          'color: #0f0d0a',
          'cursor: pointer',
          'display: flex',
          'flex-direction: column',
          'align-items: center',
          'justify-content: center',
          'touch-action: manipulation'
        ].join('; '));
        btn.innerHTML = '<span>' + label + '</span>' + (sub ? '<span style="font-size:9px; font-weight:normal; color:#8a948e;">' + sub + '</span>' : '');

        function downHandler(e) {
          e.preventDefault();
          btn.style.background = '#ffd60a';
          btn.style.transform = 'translate(2px, 2px)';
          btn.style.boxShadow = '1px 1px 0 #0f0d0a';
          action(true);
        }
        function upHandler(e) {
          e.preventDefault();
          btn.style.background = '#f4ecd8';
          btn.style.transform = 'none';
          btn.style.boxShadow = '3px 3px 0 #0f0d0a';
          action(false);
        }

        btn.addEventListener('pointerdown', downHandler);
        btn.addEventListener('pointerup', upHandler);
        btn.addEventListener('pointercancel', upHandler);
        btn.addEventListener('pointerleave', upHandler);
        return btn;
      }

      var inputState = {
        left: false,
        right: false,
        down: false,
        rotatePending: false,
        hardDropPending: false
      };

      touchBar.appendChild(makeBtn('←', '左移', function (down) { inputState.left = down; }));
      touchBar.appendChild(makeBtn('→', '右移', function (down) { inputState.right = down; }));
      touchBar.appendChild(makeBtn('↓', '加速', function (down) { inputState.down = down; }));
      touchBar.appendChild(makeBtn('⟳', '旋轉', function (down) { if (down) inputState.rotatePending = true; }));
      touchBar.appendChild(makeBtn('⤓', '直落', function (down) { if (down) inputState.hardDropPending = true; }));
      stage.appendChild(touchBar);

      // 右下角 GRAYBOX 標籤
      var watermark = document.createElement('div');
      watermark.textContent = 'GRAYBOX';
      watermark.setAttribute('style', 'position:absolute; right:8px; bottom:6px; font-size:10px; font-weight:bold; color:#8a948e; pointer-events:none; z-index:20;');
      stage.appendChild(watermark);

      // 遊戲狀態初始化
      var ctx = canvas.getContext('2d');
      var board = R.createBoard(10, 16);
      var bag = [];
      var nextQueue = [];
      var currentPiece = null;
      var timeLeft = R.TOTAL_SECONDS;
      var elapsed = 0;
      var score = 0;
      var layersCleared = 0;
      var maxStackHeight = 0;
      var exceededHalf = false;

      var dropTimer = 0;
      var lockTimer = 0;
      var lockResets = 0;
      var das = 0;
      var dasDir = 0;
      var arr = 0;

      var clearingRows = null;
      var clearTimer = 0;

      var particles = [];
      var floatTexts = [];
      var shakeTimer = 0;
      var shakeIntensity = 0;

      var prefersReducedMotion = false;
      try {
        prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) {}

      function fillBag() {
        var newPieces = R.shuffleBag(rng);
        for (var i = 0; i < newPieces.length; i++) {
          bag.push(newPieces[i]);
        }
      }

      function drawPiece() {
        if (bag.length < 3) fillBag();
        return bag.shift();
      }

      for (var i = 0; i < 3; i++) {
        nextQueue.push(drawPiece());
      }

      function spawn() {
        var type = nextQueue.shift();
        nextQueue.push(drawPiece());
        currentPiece = {
          type: type,
          rot: 0,
          x: 3,
          y: -1,
          lastMoveRot: false
        };
        dropTimer = 0;
        lockTimer = 0;
        lockResets = 0;

        if (R.collide(board, currentPiece, 0, 0, 0)) {
          // 出生點受阻，頂出失敗
          endGame(false, '材料堆疊過高頂出，噴頭受阻！');
        }
      }

      function resetLockDelay() {
        if (lockTimer > 0 && lockResets < 15) {
          lockTimer = 0;
          lockResets++;
        }
      }

      function moveHorizontal(dir) {
        if (!currentPiece || clearingRows) return;
        if (!R.collide(board, currentPiece, dir, 0, 0)) {
          currentPiece.x += dir;
          currentPiece.lastMoveRot = false;
          playSound('move');
          resetLockDelay();
        }
      }

      function tryRotate(dir) {
        if (!currentPiece || clearingRows) return;
        var p = currentPiece;
        var from = p.rot;
        var to = (((p.rot + dir) % 4) + 4) % 4;
        var key = from + '>' + to;
        var table = p.type === 'I' ? R.KICKS_I : R.KICKS_JLSTZ;
        var kicks = p.type === 'O' ? [[0, 0]] : (table[key] || [[0, 0]]);

        for (var i = 0; i < kicks.length; i++) {
          var kx = kicks[i][0];
          var ky = -kicks[i][1];
          if (!R.collide(board, p, kx, ky, dir)) {
            p.x += kx;
            p.y += ky;
            p.rot = to;
            p.lastMoveRot = true;
            playSound('rotate');
            resetLockDelay();
            return;
          }
        }
      }

      function hardDrop() {
        if (!currentPiece || clearingRows || ended) return;
        var p = currentPiece;
        var d = 0;
        while (!R.collide(board, p, 0, d + 1, 0)) {
          d++;
        }
        p.y += d;
        playSound('drop');
        triggerShake(0.12, 4);
        lockPiece();
      }

      function triggerShake(time, intensity) {
        if (prefersReducedMotion) return;
        shakeTimer = time;
        shakeIntensity = intensity;
      }

      function addSparks(cx, cy, color, count) {
        for (var i = 0; i < count; i++) {
          var angle = (Math.random() * Math.PI) - Math.PI;
          var speed = 40 + Math.random() * 90;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 20,
            life: 0.25 + Math.random() * 0.2,
            maxLife: 0.4,
            color: color || '#ffd60a'
          });
        }
      }

      function addFloatText(text, x, y, color) {
        floatTexts.push({
          text: text,
          x: x,
          y: y,
          vy: -30,
          alpha: 1,
          color: color || '#1d4ed8'
        });
      }

      function lockPiece() {
        var p = currentPiece;
        var cells = R.cellsOf(p, 0, 0, 0);
        var color = R.SHAPES[p.type].color;
        var topOut = false;

        for (var i = 0; i < cells.length; i++) {
          var x = cells[i][0];
          var y = cells[i][1];
          if (y < 0) {
            topOut = true;
            continue;
          }
          if (y < R.ROWS && x >= 0 && x < R.COLS) {
            board[y][x] = color;
          }
        }

        var currentStack = R.getStackHeight(board);
        if (currentStack > maxStackHeight) {
          maxStackHeight = currentStack;
        }
        if (currentStack > R.MAX_STACK_LIMIT) {
          exceededHalf = true;
        }

        if (topOut) {
          endGame(false, '列印材料溢出成型盤頂部！');
          return;
        }

        // 檢查滿行
        var fullRows = [];
        for (var r = 0; r < R.ROWS; r++) {
          var rowFull = true;
          for (var c = 0; c < R.COLS; c++) {
            if (!board[r][c]) {
              rowFull = false;
              break;
            }
          }
          if (rowFull) fullRows.push(r);
        }

        if (fullRows.length > 0) {
          clearingRows = fullRows;
          clearTimer = 0.26;
          var clearedCount = fullRows.length;
          var gained = R.calculateLineScore(clearedCount);
          score += gained;
          layersCleared += clearedCount;

          if (clearedCount >= 4) {
            playSound('multiClear');
            triggerShake(0.24, 7);
            addFloatText('四層極限成型 +' + gained + '!', 140, 160, '#ffd60a');
          } else {
            playSound('clear');
            triggerShake(0.14, 4);
            addFloatText('完成 ' + clearedCount + ' 層 +' + gained, 140, 160, '#1d4ed8');
          }

          document.getElementById('d0628-layers-num').textContent = layersCleared;
          document.getElementById('d0628-score-num').textContent = score;

          if (layersCleared >= R.TARGET_LAYERS) {
            setTimeout(function () {
              if (!ended) endGame(true, '成功在 60 秒內印出 8 層模型！');
            }, 280);
          }
        } else {
          spawn();
        }
      }

      function finishClear() {
        if (!clearingRows) return;
        clearingRows.sort(function (a, b) { return a - b; });
        for (var i = clearingRows.length - 1; i >= 0; i--) {
          board.splice(clearingRows[i], 1);
        }
        for (var k = 0; k < clearingRows.length; k++) {
          var emptyRow = [];
          for (var c = 0; c < R.COLS; c++) emptyRow.push(null);
          board.unshift(emptyRow);
        }
        clearingRows = null;
        if (!ended && layersCleared < R.TARGET_LAYERS) {
          spawn();
        }
      }

      // 結算與結束畫面
      function endGame(win, reason) {
        if (ended) return;
        ended = true;

        var flawlessResult = R.isFlawless({
          won: win,
          maxStackHeight: maxStackHeight,
          exceededHalf: exceededHalf
        });

        playSound(win ? 'win' : 'fail');

        if (api && typeof api.onEnd === 'function') {
          api.onEnd({
            win: win,
            score: score,
            flawless: flawlessResult
          });
        }

        var starCount = R.calculateStars({
          win: win,
          score: score,
          flawless: flawlessResult
        });
        var starsStr = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);

        var endModal = document.createElement('div');
        endModal.className = 'd0628-modal';
        endModal.setAttribute('style', [
          'position: absolute',
          'inset: 12px',
          'background: #f4ecd8',
          'border: 3px solid #0f0d0a',
          'box-shadow: 6px 6px 0 #0f0d0a',
          'z-index: 100',
          'padding: 16px',
          'display: flex',
          'flex-direction: column',
          'justify-content: space-between',
          'align-items: center',
          'text-align: center'
        ].join('; '));

        endModal.innerHTML = [
          '<div>',
          '  <h2 style="font-size: 22px; color: ' + (win ? '#1d4ed8' : '#e63946') + '; margin-bottom: 4px;">' + (win ? '【列印完成】' : '【列印中止】') + '</h2>',
          '  <div style="font-size: 26px; color: #ffd60a; text-shadow: 2px 2px 0 #0f0d0a; margin: 4px 0;">' + starsStr + '</div>',
          '  <p style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">' + reason + '</p>',
          '  <div style="background: #8a948e; color: #0f0d0a; border: 2px solid #0f0d0a; padding: 6px 12px; font-size: 13px; margin-bottom: 8px;">',
          '    <div>成型進度：<strong>' + layersCleared + ' / 8 層</strong> ｜ 總分：<strong>' + score + '</strong></div>',
          '    <div>溢料狀態：<strong>' + (flawlessResult ? '無溢料（最高未達 8 格）' : '已溢料（曾超過半盤 8 格）') + '</strong></div>',
          '  </div>',
          '  <blockquote style="font-size: 12px; background: #f4ecd8; border-left: 4px solid #1d4ed8; padding: 6px 10px; text-align: left; margin: 6px 0; color: #0f0d0a;">',
          '    這就是 3D 列印在做的事：<br>',
          '    <strong>3D 列印是一層一層把模型疊出來，每一層都要穩，模型才不會塌。</strong>',
          '  </blockquote>',
          '</div>',
          '<button id="d0628-modal-replay" type="button" style="background:#ffd60a; color:#0f0d0a; border:3px solid #0f0d0a; box-shadow:3px 3px 0 #0f0d0a; padding:8px 24px; font-size:16px; font-weight:bold; cursor:pointer;">再試一次</button>'
        ].join('');

        stage.appendChild(endModal);

        var modalReplayBtn = document.getElementById('d0628-modal-replay');
        if (modalReplayBtn) {
          modalReplayBtn.addEventListener('click', function () {
            restartGame();
          });
        }
      }

      function restartGame() {
        var modal = stage.querySelector('.d0628-modal');
        if (modal) modal.remove();

        board = R.createBoard(10, 16);
        bag = [];
        nextQueue = [];
        for (var i = 0; i < 3; i++) nextQueue.push(drawPiece());
        timeLeft = R.TOTAL_SECONDS;
        elapsed = 0;
        score = 0;
        layersCleared = 0;
        maxStackHeight = 0;
        exceededHalf = false;
        dropTimer = 0;
        lockTimer = 0;
        lockResets = 0;
        clearingRows = null;
        particles = [];
        floatTexts = [];
        ended = false;

        document.getElementById('d0628-layers-num').textContent = '0';
        document.getElementById('d0628-score-num').textContent = '0';
        document.getElementById('d0628-time-num').textContent = '60.0';
        spawn();
      }

      // 鍵盤操作監聽
      function onKeyDown(e) {
        if (ended) return;
        getAudioContext();

        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          inputState.left = true;
          e.preventDefault();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          inputState.right = true;
          e.preventDefault();
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          inputState.down = true;
          e.preventDefault();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          tryRotate(1);
          e.preventDefault();
        } else if (e.code === 'Space') {
          hardDrop();
          e.preventDefault();
        }
      }

      function onKeyUp(e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          inputState.left = false;
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          inputState.right = false;
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          inputState.down = false;
        }
      }

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      // 視窗與畫布解析度調適
      var width = 480;
      var height = 320;
      function resize() {
        var rect = canvasWrap.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          width = Math.floor(rect.width);
          height = Math.floor(rect.height);
          canvas.width = width;
          canvas.height = height;
        }
      }
      resize();
      window.addEventListener('resize', resize);

      // 主更新與渲染迴圈
      var lastTime = performance.now();
      var animId = null;

      spawn();

      function update(dt) {
        if (ended) return;

        elapsed += dt;
        timeLeft = Math.max(0, R.TOTAL_SECONDS - elapsed);

        // 時間倒數更新
        var timeEl = document.getElementById('d0628-time-num');
        if (timeEl) timeEl.textContent = timeLeft.toFixed(1);
        if (timeBarFill) {
          var pct = Math.max(0, Math.min(100, (timeLeft / R.TOTAL_SECONDS) * 100));
          timeBarFill.style.width = pct + '%';
          if (pct < 20) timeBarFill.style.background = '#e63946';
          else if (pct < 45) timeBarFill.style.background = '#ffd60a';
          else timeBarFill.style.background = '#1d4ed8';
        }

        // 階級徽章更新
        var currentTier = R.getTier(elapsed);
        var tierEl = document.getElementById('d0628-tier-badge');
        if (tierEl) {
          tierEl.textContent = '階級 ' + currentTier.tier + '（' + (currentTier.tier === 1 ? '慢速' : currentTier.tier === 2 ? '中速' : '快速') + '）';
          tierEl.style.background = currentTier.tier === 3 ? '#e63946' : currentTier.tier === 2 ? '#ffd60a' : '#8a948e';
          tierEl.style.color = currentTier.tier === 3 ? '#f4ecd8' : '#0f0d0a';
        }

        // 時間結束判定
        if (timeLeft <= 0) {
          if (layersCleared >= R.TARGET_LAYERS) {
            endGame(true, '時間到，已達成 8 層列印目標！');
          } else {
            endGame(false, '時間耗盡，未能在 60 秒內完成 8 層列印。');
          }
          return;
        }

        // 震動計時
        if (shakeTimer > 0) {
          shakeTimer -= dt;
          if (shakeTimer <= 0) {
            canvas.style.transform = 'none';
          } else {
            var ox = (Math.random() * 2 - 1) * shakeIntensity;
            var oy = (Math.random() * 2 - 1) * shakeIntensity;
            canvas.style.transform = 'translate(' + ox + 'px, ' + oy + 'px)';
          }
        }

        // 消行過渡動畫
        if (clearingRows) {
          clearTimer -= dt;
          if (clearTimer <= 0) {
            finishClear();
          }
          updateFX(dt);
          return;
        }

        // 處理一次性虛擬按鈕點擊
        if (inputState.rotatePending) {
          inputState.rotatePending = false;
          tryRotate(1);
        }
        if (inputState.hardDropPending) {
          inputState.hardDropPending = false;
          hardDrop();
        }

        // DAS / ARR 水平自動位移手感
        var ax = 0;
        if (inputState.left && !inputState.right) ax = -1;
        if (inputState.right && !inputState.left) ax = 1;

        if (ax !== 0) {
          if (dasDir !== ax) {
            dasDir = ax;
            das = 0;
            arr = 0;
            moveHorizontal(ax);
          } else {
            das += dt;
            if (das >= 0.14) {
              arr += dt;
              while (arr >= 0.035) {
                arr -= 0.035;
                moveHorizontal(ax);
              }
            }
          }
        } else {
          dasDir = 0;
          das = 0;
          arr = 0;
        }

        // 下落與軟落
        var interval = currentTier.dropInterval;
        if (inputState.down) {
          interval = Math.min(interval, 0.035);
          playSound('soft');
        }

        dropTimer += dt;
        while (dropTimer >= interval) {
          dropTimer -= interval;
          if (!R.collide(board, currentPiece, 0, 1, 0)) {
            currentPiece.y++;
            currentPiece.lastMoveRot = false;
          } else {
            break;
          }
        }

        // 鎖定延遲（Lock Delay）
        if (R.collide(board, currentPiece, 0, 1, 0)) {
          lockTimer += dt;
          if (lockTimer >= 0.5) {
            lockPiece();
          }
        } else {
          lockTimer = 0;
        }

        updateFX(dt);
      }

      function updateFX(dt) {
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 300 * dt;
          p.life -= dt;
          if (p.life <= 0) particles.splice(i, 1);
        }

        for (var k = floatTexts.length - 1; k >= 0; k--) {
          var ft = floatTexts[k];
          ft.y += ft.vy * dt;
          ft.alpha -= dt * 0.9;
          if (ft.alpha <= 0) floatTexts.splice(k, 1);
        }
      }

      // 繪圖渲染
      function render() {
        ctx.fillStyle = '#f4ecd8';
        ctx.fillRect(0, 0, width, height);

        // 幾何計算：將 10x16 盤面與右側 3D 成型台配置於畫布中央
        var maxBoardH = height - 24;
        var cellSize = Math.max(12, Math.min(22, Math.floor(maxBoardH / R.ROWS)));
        var boardW = cellSize * R.COLS;
        var boardH = cellSize * R.ROWS;

        // 居中安排：左側為成型盤面，右側為預覽與 3D 灰盒模型剪影
        var totalW = boardW + 180;
        var startX = Math.max(12, Math.floor((width - totalW) / 2));
        var startY = Math.max(8, Math.floor((height - boardH) / 2));

        // 盤面底色與邊框
        ctx.fillStyle = '#0f0d0a';
        ctx.fillRect(startX, startY, boardW, boardH);

        // 網格線
        ctx.strokeStyle = '#8a948e';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        for (var col = 1; col < R.COLS; col++) {
          ctx.beginPath();
          ctx.moveTo(startX + col * cellSize, startY);
          ctx.lineTo(startX + col * cellSize, startY + boardH);
          ctx.stroke();
        }
        for (var row = 1; row < R.ROWS; row++) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + row * cellSize);
          ctx.lineTo(startX + boardW, startY + row * cellSize);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // 溢料警戒線（第 8 格）
        var warnY = startY + 8 * cellSize;
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, warnY);
        ctx.lineTo(startX + boardW, warnY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e63946';
        ctx.font = '10px "Noto Sans TC", sans-serif';
        ctx.fillText('▲ 溢料警戒線（8格）', startX + 4, warnY - 4);

        // 繪製盤面上已鎖定的方塊
        for (var y = 0; y < R.ROWS; y++) {
          for (var x = 0; x < R.COLS; x++) {
            if (board[y][x]) {
              var isClearing = clearingRows && clearingRows.indexOf(y) >= 0;
              drawCell(startX + x * cellSize, startY + y * cellSize, cellSize, isClearing ? '#ffd60a' : board[y][x]);
            }
          }
        }

        // 繪製 Ghost 落點預覽與當前方塊
        if (!ended && currentPiece && !clearingRows) {
          var p = currentPiece;
          var d = 0;
          while (!R.collide(board, p, 0, d + 1, 0)) d++;

          // Ghost 投影
          ctx.save();
          ctx.globalAlpha = 0.22;
          var ghostCells = R.cellsOf(p, 0, 0, d);
          for (var gi = 0; gi < ghostCells.length; gi++) {
            if (ghostCells[gi][1] >= 0) {
              drawCell(startX + ghostCells[gi][0] * cellSize, startY + ghostCells[gi][1] * cellSize, cellSize, R.SHAPES[p.type].color);
            }
          }
          ctx.restore();

          // 當前材料方塊
          var activeCells = R.cellsOf(p, 0, 0, 0);
          for (var ai = 0; ai < activeCells.length; ai++) {
            if (activeCells[ai][1] >= 0) {
              drawCell(startX + activeCells[ai][0] * cellSize, startY + activeCells[ai][1] * cellSize, cellSize, R.SHAPES[p.type].color);
            }
          }
        }

        // 盤面外框
        ctx.strokeStyle = '#0f0d0a';
        ctx.lineWidth = 3;
        ctx.strokeRect(startX - 1.5, startY - 1.5, boardW + 3, boardH + 3);

        // ==========================================
        // 右側區域：下一個材料 + 3D 模型成型剪影
        // ==========================================
        var rightX = startX + boardW + 16;

        // 下一個材料預覽
        ctx.fillStyle = '#0f0d0a';
        ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
        ctx.fillText('下一個材料：', rightX, startY + 12);

        var previewBoxSize = 48;
        ctx.fillStyle = '#f4ecd8';
        ctx.fillRect(rightX, startY + 18, previewBoxSize, previewBoxSize);
        ctx.strokeStyle = '#0f0d0a';
        ctx.lineWidth = 2;
        ctx.strokeRect(rightX, startY + 18, previewBoxSize, previewBoxSize);

        if (nextQueue.length > 0) {
          drawMiniPiece(nextQueue[0], rightX + 8, startY + 24, 8);
        }

        // ==========================================
        // 3D 列印工作台與幾何模型長高剪影（核心情境）
        // ==========================================
        var modelAreaY = startY + 80;
        ctx.fillStyle = '#0f0d0a';
        ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
        ctx.fillText('3D 列印成型預覽：', rightX, modelAreaY);

        var bedW = 120;
        var bedH = 10;
        var maxModelH = boardH - 120;
        var bedX = rightX;
        var bedY = modelAreaY + maxModelH;

        // 3D 印表機熱床基座
        ctx.fillStyle = '#8a948e';
        ctx.fillRect(bedX, bedY, bedW, bedH);
        ctx.strokeStyle = '#0f0d0a';
        ctx.lineWidth = 2;
        ctx.strokeRect(bedX, bedY, bedW, bedH);

        // 兩側龍門支架
        ctx.strokeStyle = '#8a948e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bedX + 4, bedY);
        ctx.lineTo(bedX + 4, modelAreaY + 16);
        ctx.lineTo(bedX + bedW - 4, modelAreaY + 16);
        ctx.lineTo(bedX + bedW - 4, bedY);
        ctx.stroke();

        // 幾何形狀模型（8層漸縮幾何瓶/火箭輪廓）
        // 每一層對應 1 行消除
        var layerH = Math.max(12, Math.floor((maxModelH - 24) / 8));
        var layerWidths = [100, 92, 84, 76, 68, 60, 50, 36]; // 由底至頂

        for (var l = 0; l < 8; l++) {
          var lw = layerWidths[l];
          var lx = bedX + (bedW - lw) / 2;
          var ly = bedY - (l + 1) * layerH;

          if (l < layersCleared) {
            // 已列印完成的層（實心藍色線條，代表材料成型）
            ctx.fillStyle = '#1d4ed8';
            ctx.fillRect(lx, ly, lw, layerH - 2);
            ctx.strokeStyle = '#0f0d0a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(lx, ly, lw, layerH - 2);

            // 層紋線（3D 列印層紋細節）
            ctx.strokeStyle = '#ffd60a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lx + 2, ly + Math.floor(layerH / 2));
            ctx.lineTo(lx + lw - 2, ly + Math.floor(layerH / 2));
            ctx.stroke();
          } else {
            // 未完成層（灰盒虛線剪影）
            ctx.strokeStyle = '#8a948e';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(lx, ly, lw, layerH - 2);
            ctx.setLineDash([]);
          }
        }

        // 噴頭位置（剛好浮在當前層之上）
        var nozzleLevel = Math.min(8, layersCleared);
        var nozzleY = bedY - nozzleLevel * layerH - 12;
        var nozzleX = bedX + bedW / 2;

        // 橫向擠出噴頭組件
        ctx.fillStyle = '#0f0d0a';
        ctx.fillRect(nozzleX - 14, nozzleY, 28, 6);
        // 倒三角噴嘴
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.moveTo(nozzleX - 5, nozzleY + 6);
        ctx.lineTo(nozzleX + 5, nozzleY + 6);
        ctx.lineTo(nozzleX, nozzleY + 11);
        ctx.closePath();
        ctx.fill();

        // 粒子繪製
        for (var pi = 0; pi < particles.length; pi++) {
          var pt = particles[pi];
          ctx.fillStyle = pt.color;
          ctx.fillRect(pt.x, pt.y, 3, 3);
        }

        // 浮動文字
        for (var fi = 0; fi < floatTexts.length; fi++) {
          var ft = floatTexts[fi];
          ctx.save();
          ctx.globalAlpha = Math.max(0, ft.alpha);
          ctx.fillStyle = ft.color;
          ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }
      }

      function drawCell(x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        // 邊角高光與陰影
        ctx.fillStyle = '#f4ecd8';
        ctx.globalAlpha = 0.35;
        ctx.fillRect(x + 1, y + 1, size - 2, 2);
        ctx.fillRect(x + 1, y + 1, 2, size - 2);
        ctx.fillStyle = '#0f0d0a';
        ctx.fillRect(x + 1, y + size - 3, size - 2, 2);
        ctx.fillRect(x + size - 3, y + 1, 2, size - 2);
        ctx.globalAlpha = 1.0;
      }

      function drawMiniPiece(type, ox, oy, sz) {
        var shape = R.SHAPES[type];
        if (!shape) return;
        var cells = shape.cells[0];
        ctx.fillStyle = shape.color;
        for (var i = 0; i < cells.length; i++) {
          ctx.fillRect(ox + cells[i][0] * sz, oy + cells[i][1] * sz, sz - 1, sz - 1);
        }
      }

      function loop(now) {
        if (destroyed) return;
        var dt = Math.min(0.08, (now - lastTime) / 1000);
        lastTime = now;

        update(dt);
        render();

        animId = requestAnimationFrame(loop);
      }

      animId = requestAnimationFrame(loop);

      return {
        destroy: function () {
          destroyed = true;
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('keyup', onKeyUp);
          window.removeEventListener('resize', resize);
          if (audioCtx) {
            try { audioCtx.close(); } catch (e) {}
            audioCtx = null;
          }
          root.innerHTML = '';
        }
      };
    }
  };
})();
