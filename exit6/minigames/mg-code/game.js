(function (global) {
  'use strict';

  global.EXIT6_MG = global.EXIT6_MG || {};

  global.EXIT6_MG['mg-code'] = {
    title: '導管除錯',
    skill: 'Unity／程式',
    seconds: 60,

    mount: function (root, api) {
      var R = global.EXIT6_RULES_MG_CODE;
      if (!R) {
        throw new Error('EXIT6_RULES_MG_CODE 尚未載入');
      }

      var rng = (api && typeof api.rng === 'function') ? api.rng : Math.random;
      var onEndCallback = (api && typeof api.onEnd === 'function') ? api.onEnd : function () {};
      var hasEnded = false;

      // ======================================================================
      // 顏色盤（嚴格遵循規範配色）
      // ======================================================================
      var COLOR = {
        paper: '#f4ecd8', // 紙
        ink:   '#0f0d0a', // 墨
        red:   '#e63946', // 紅
        yellow:'#ffd60a', // 黃
        blue:  '#1d4ed8', // 藍
        grey:  '#8a948e'  // 灰
      };

      var prefersReducedMotion = false;
      try {
        if (typeof window !== 'undefined' && window.matchMedia) {
          prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
      } catch (e) {}

      // ======================================================================
      // 音效系統（WebAudio 即時合成）
      // ======================================================================
      var audioCtx = null;
      function initAudio() {
        if (audioCtx) {
          if (audioCtx.state === 'suspended') audioCtx.resume();
          return;
        }
        var AC = global.AudioContext || global.webkitAudioContext;
        if (AC) {
          try {
            audioCtx = new AC();
          } catch (err) {}
        }
      }

      function playTone(freq, dur, type, freqTo) {
        if (!audioCtx) return;
        try {
          var t0 = audioCtx.currentTime;
          var osc = audioCtx.createOscillator();
          var gain = audioCtx.createGain();
          osc.type = type || 'square';
          osc.frequency.setValueAtTime(freq, t0);
          if (freqTo) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), t0 + dur);
          }
          gain.gain.setValueAtTime(0.12, t0);
          gain.gain.linearRampToValueAtTime(0.001, t0 + dur);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t0);
          osc.stop(t0 + dur);
        } catch (e) {}
      }

      function sfxPlace() { playTone(440, 0.06, 'square', 660); }
      function sfxFlow() { playTone(300, 0.04, 'triangle'); }
      function sfxGoal() {
        playTone(523, 0.1, 'triangle');
        setTimeout(function () { playTone(659, 0.1, 'triangle'); }, 80);
        setTimeout(function () { playTone(784, 0.1, 'triangle'); }, 160);
        setTimeout(function () { playTone(1046, 0.22, 'square'); }, 240);
      }
      function sfxLeak() { playTone(160, 0.22, 'sawtooth', 70); }
      function sfxRun() { playTone(400, 0.08, 'triangle', 800); }

      // ======================================================================
      // DOM 容器與 Canvas 建立
      // ======================================================================
      root.innerHTML = '';
      root.style.position = 'relative';
      root.style.width = '100%';
      root.style.height = '100%';
      root.style.overflow = 'hidden';
      root.style.backgroundColor = COLOR.paper;
      root.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
      root.style.userSelect = 'none';
      root.style.webkitUserSelect = 'none';

      var canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.touchAction = 'none';
      root.appendChild(canvas);

      var ctx = canvas.getContext('2d');

      // ======================================================================
      // 遊戲狀態機
      // ======================================================================
      var destroyed = false;
      var totalTime = 60.0;
      var currentScore = 0;
      var currentStageIdx = 0;
      var clearedStages = 0;
      var totalOverwrites = 0;
      var gameOver = false;
      var stageTransitionT = 0; // 過場倒數

      // 關卡內部狀態
      var grid = null;
      var queue = [];
      var prepTimeLeft = 0;
      var isFlowing = false;
      var flowTimer = 0;
      var flowPath = [];
      var flowStepIdx = 0;
      var flowHead = null;
      var cursor = { c: 1, r: 0 };
      var stageCleared = false;
      var stageLeaked = false;

      // 打擊感與動畫
      var shakeTimer = 0;
      var shakeIntensity = 0;
      var flashTimer = 0;
      var flashColor = COLOR.red;
      var flashAlpha = 0;
      var particles = [];
      var floatTexts = [];
      var cellPops = {}; // key: "c,r" -> timer
      var tutorialHandT = 3.5; // 開場 3.5 秒示範動畫

      // 版面配置尺寸（每幀依尺寸動態計算）
      var layout = {
        w: 480,
        h: 320,
        dpr: 1,
        isPortrait: false,
        gridX: 20,
        gridY: 60,
        cellSize: 40,
        cols: 4,
        rows: 4,
        queueX: 360,
        queueY: 60,
        runBtnRect: { x: 360, y: 220, w: 100, h: 48 }
      };

      function addFloatText(x, y, text, color, size) {
        floatTexts.push({
          x: x,
          y: y,
          text: text,
          color: color || COLOR.ink,
          size: size || 14,
          life: 0.8,
          maxLife: 0.8
        });
      }

      function spawnParticles(x, y, count, colors) {
        if (prefersReducedMotion) return;
        var cols = colors || [COLOR.yellow, COLOR.blue, COLOR.paper];
        for (var i = 0; i < count; i++) {
          var angle = rng() * Math.PI * 2;
          var speed = 30 + rng() * 100;
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: cols[Math.floor(rng() * cols.length)],
            size: 3 + rng() * 4,
            life: 0.3 + rng() * 0.3,
            maxLife: 0.6
          });
        }
      }

      function triggerShake(duration, intensity) {
        if (prefersReducedMotion) return;
        shakeTimer = duration;
        shakeIntensity = intensity;
      }

      function triggerFlash(color, alpha, duration) {
        flashColor = color;
        flashAlpha = alpha;
        flashTimer = duration || 0.15;
      }

      // ======================================================================
      // 載入關卡
      // ======================================================================
      function loadStage(idx) {
        currentStageIdx = idx;
        var def = R.STAGES[currentStageIdx];
        grid = R.createStageGrid(currentStageIdx, rng);
        queue = R.createQueue(def.previewCount + 4, rng);
        prepTimeLeft = def.prepTime;
        isFlowing = false;
        flowTimer = 0;
        flowPath = [];
        flowStepIdx = 0;
        flowHead = {
          c: def.start.c,
          r: def.start.r,
          dir: def.start.dir,
          t: 0
        };
        cursor = {
          c: Math.min(def.cols - 1, def.start.c + 1),
          r: def.start.r
        };
        stageCleared = false;
        stageLeaked = false;
        cellPops = {};
      }

      loadStage(0);

      // ======================================================================
      // 放置管件
      // ======================================================================
      function tryPlacePiece(c, r) {
        if (gameOver || stageCleared || stageLeaked) return;
        initAudio();
        tutorialHandT = 0; // 玩家主動操作，立即關閉教學動畫

        var def = R.STAGES[currentStageIdx];
        if (!R.isPlacementValid(grid, def.cols, def.rows, c, r)) {
          sfxLeak();
          triggerShake(0.12, 3);
          addFloatText(layout.gridX + (c + 0.5) * layout.cellSize, layout.gridY + r * layout.cellSize, '不可放置', COLOR.red, 12);
          return;
        }

        var existing = grid[r][c];
        if (existing && existing.kind) {
          totalOverwrites++;
          currentScore = Math.max(0, currentScore - 50);
          addFloatText(layout.gridX + (c + 0.5) * layout.cellSize, layout.gridY + r * layout.cellSize, '覆蓋 -50', COLOR.red, 12);
          sfxPlace();
        } else {
          sfxPlace();
        }

        var pieceKind = R.getNextPiece(queue, rng);
        grid[r][c] = {
          kind: pieceKind,
          filled: 0,
          fillT: 0
        };

        cellPops[c + ',' + r] = 0.15;
        spawnParticles(
          layout.gridX + (c + 0.5) * layout.cellSize,
          layout.gridY + (r + 0.5) * layout.cellSize,
          6,
          [COLOR.blue, COLOR.yellow, COLOR.grey]
        );
      }

      // ======================================================================
      // 啟動資料流（水流）
      // ======================================================================
      function triggerFlowStart() {
        if (isFlowing || gameOver || stageCleared || stageLeaked) return;
        initAudio();
        sfxRun();
        isFlowing = true;

        // 提早放水獎勵
        var bonus = Math.round(Math.max(0, prepTimeLeft) * 30);
        if (bonus > 0) {
          currentScore += bonus;
          addFloatText(layout.w / 2, layout.gridY - 14, '提早執行 +' + bonus, COLOR.yellow, 15);
        }
        prepTimeLeft = 0;

        var def = R.STAGES[currentStageIdx];
        flowHead = {
          c: def.start.c,
          r: def.start.r,
          dir: def.start.dir,
          from: R.opposite(def.start.dir),
          t: 0
        };
      }

      // ======================================================================
      // 資料流步進（單格前進）
      // ======================================================================
      function advanceFlowStep() {
        var def = R.STAGES[currentStageIdx];
        var outDir = -1;
        var cell = grid[flowHead.r][flowHead.c];

        if (cell.type === 'start') {
          outDir = cell.dir;
        } else if (cell.kind) {
          var pDef = R.PIECES[cell.kind];
          if (cell.kind === 'x') {
            outDir = R.opposite(flowHead.from);
          } else {
            for (var d = 0; d < 4; d++) {
              if (pDef.open[d] && d !== flowHead.from) {
                outDir = d;
                break;
              }
            }
          }
        }

        if (outDir < 0) {
          triggerLeak('介面不連通');
          return;
        }

        var nextC = flowHead.c + R.DIRS[outDir].dx;
        var nextR = flowHead.r + R.DIRS[outDir].dy;
        var incomingFrom = R.opposite(outDir);

        // 出界檢查
        if (nextC < 0 || nextC >= def.cols || nextR < 0 || nextR >= def.rows) {
          triggerLeak('位址越界 (Index OOB)');
          return;
        }

        // 抵達 Goal
        if (nextC === def.goal.c && nextR === def.goal.r) {
          triggerGoalReached();
          return;
        }

        var nextCell = grid[nextR][nextC];
        if (!nextCell || !nextCell.kind) {
          triggerLeak('空指標異常 (Null Pipe)');
          return;
        }

        if (nextCell.type === 'bug' || nextCell.block) {
          triggerLeak('遇見 BUG 崩潰');
          return;
        }

        var nextPDef = R.PIECES[nextCell.kind];
        if (!nextPDef.open[incomingFrom]) {
          triggerLeak('型別不合 (Mismatch)');
          return;
        }

        if (nextCell.filled >= (nextCell.kind === 'x' ? 2 : 1)) {
          triggerLeak('無窮迴圈溢位');
          return;
        }

        // 前進成功
        nextCell.filled = (nextCell.filled || 0) + 1;
        nextCell.fillT = 0;
        flowHead = {
          c: nextC,
          r: nextR,
          from: incomingFrom,
          t: 0
        };

        currentScore += 50;
        sfxFlow();
        spawnParticles(
          layout.gridX + (nextC + 0.5) * layout.cellSize,
          layout.gridY + (nextR + 0.5) * layout.cellSize,
          4,
          [COLOR.yellow, COLOR.blue]
        );
      }

      function triggerGoalReached() {
        stageCleared = true;
        clearedStages++;
        currentScore += 1000;
        sfxGoal();
        triggerFlash(COLOR.yellow, 0.25, 0.3);
        addFloatText(layout.w / 2, layout.h / 2, 'Goal 抵達！關卡通過！+1000', COLOR.yellow, 18);
        spawnParticles(layout.w / 2, layout.h / 2, 28, [COLOR.yellow, COLOR.blue, COLOR.paper]);
        stageTransitionT = 1.3;
      }

      function triggerLeak(reason) {
        if (stageLeaked) return;
        stageLeaked = true;
        sfxLeak();
        triggerShake(1.0, 7);
        triggerFlash(COLOR.red, 0.4, 1.0);
        addFloatText(layout.w / 2, layout.h / 2, (reason || 'Runtime Error!') + '（重試本關）', COLOR.red, 16);
        spawnParticles(
          layout.gridX + (flowHead.c + 0.5) * layout.cellSize,
          layout.gridY + (flowHead.r + 0.5) * layout.cellSize,
          16,
          [COLOR.red, COLOR.ink]
        );
        stageTransitionT = 1.0;
      }

      function retryStage() {
        var nextState = R.afterLeak({
          currentStageIdx: currentStageIdx,
          clearedStages: clearedStages,
          totalTime: totalTime,
          currentScore: currentScore
        }, rng);

        currentStageIdx = nextState.currentStageIdx;
        grid = nextState.grid;
        queue = nextState.queue;
        prepTimeLeft = nextState.prepTimeLeft;
        isFlowing = false;
        flowTimer = 0;
        flowPath = [];
        flowStepIdx = 0;
        var def = R.STAGES[currentStageIdx];
        flowHead = {
          c: def.start.c,
          r: def.start.r,
          dir: def.start.dir,
          t: 0
        };
        cursor = {
          c: Math.min(def.cols - 1, def.start.c + 1),
          r: def.start.r
        };
        stageCleared = false;
        stageLeaked = false;
        cellPops = {};
      }

      function finishGame() {
        if (gameOver) return;
        gameOver = true;
        var evalResult = R.evaluateGame(clearedStages, currentScore, R.STAGES.length);
        if (!hasEnded) {
          hasEnded = true;
          onEndCallback({
            win: evalResult.win,
            score: evalResult.score
          });
        }
      }

      // ======================================================================
      // 更新迴圈
      // ======================================================================
      var lastTimestamp = 0;

      function update(dt) {
        if (gameOver) return;

        // 總倒數時間
        totalTime = Math.max(0, totalTime - dt);
        if (totalTime <= 0) {
          finishGame();
          return;
        }

        // 開場教學手勢倒數
        if (tutorialHandT > 0) {
          tutorialHandT -= dt;
        }

        // 關卡過場切換
        if (stageTransitionT > 0) {
          stageTransitionT -= dt;
          if (stageTransitionT <= 0) {
            if (stageLeaked) {
              retryStage();
            } else if (currentStageIdx < R.STAGES.length - 1) {
              loadStage(currentStageIdx + 1);
            } else {
              finishGame();
            }
          }
          return;
        }

        // 放水前倒數
        if (!isFlowing) {
          prepTimeLeft -= dt;
          if (prepTimeLeft <= 0) {
            prepTimeLeft = 0;
            triggerFlowStart();
          }
        } else if (!stageCleared && !stageLeaked) {
          // 資料流推進
          var def = R.STAGES[currentStageIdx];
          flowHead.t += dt;
          var curCell = grid[flowHead.r][flowHead.c];
          if (curCell) {
            curCell.fillT = Math.min(1, flowHead.t / def.flowSpeed);
          }
          if (flowHead.t >= def.flowSpeed) {
            advanceFlowStep();
          }
        }

        // 更新粒子
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) particles.splice(i, 1);
        }

        // 更新浮動文字
        for (var j = floatTexts.length - 1; j >= 0; j--) {
          var ft = floatTexts[j];
          ft.y -= 25 * dt;
          ft.life -= dt;
          if (ft.life <= 0) floatTexts.splice(j, 1);
        }

        // 更新放置彈跳
        for (var k in cellPops) {
          if (cellPops.hasOwnProperty(k)) {
            cellPops[k] -= dt;
            if (cellPops[k] <= 0) delete cellPops[k];
          }
        }

        if (shakeTimer > 0) shakeTimer -= dt;
        if (flashTimer > 0) flashTimer -= dt;
      }

      // ======================================================================
      // 繪製與版面運算
      // ======================================================================
      function updateLayout() {
        var rect = root.getBoundingClientRect();
        var cw = rect.width || 480;
        var ch = rect.height || 320;
        var dpr = window.devicePixelRatio || 1;

        if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
          canvas.width = Math.floor(cw * dpr);
          canvas.height = Math.floor(ch * dpr);
        }

        layout.w = cw;
        layout.h = ch;
        layout.dpr = dpr;
        layout.isPortrait = ch > cw * 1.05;

        var def = R.STAGES[currentStageIdx] || R.STAGES[0];
        layout.cols = def.cols;
        layout.rows = def.rows;

        if (layout.isPortrait) {
          // 直式排版（手機直拿）
          var availGridW = cw - 32;
          var availGridH = ch * 0.52;
          layout.cellSize = Math.floor(Math.min(availGridW / def.cols, availGridH / def.rows, 56));
          layout.gridX = Math.floor((cw - layout.cellSize * def.cols) / 2);
          layout.gridY = 85;

          layout.queueX = 20;
          layout.queueY = layout.gridY + layout.cellSize * def.rows + 16;

          var btnW = Math.max(120, cw - 40);
          layout.runBtnRect = {
            x: 20,
            y: ch - 58,
            w: btnW,
            h: 46
          };
        } else {
          // 橫式排版（16:9 / 電腦）
          var topMargin = 56;
          var bottomMargin = 20;
          var availH = ch - topMargin - bottomMargin;
          var availW = cw * 0.62;
          layout.cellSize = Math.floor(Math.min(availW / def.cols, availH / def.rows, 64));
          layout.gridX = Math.floor((cw * 0.65 - layout.cellSize * def.cols) / 2) + 10;
          layout.gridY = topMargin + Math.floor((availH - layout.cellSize * def.rows) / 2);

          layout.queueX = Math.floor(cw * 0.72);
          layout.queueY = topMargin + 10;

          layout.runBtnRect = {
            x: layout.queueX,
            y: Math.min(ch - 64, layout.queueY + 160),
            w: Math.min(140, cw - layout.queueX - 20),
            h: 46
          };
        }
      }

      function render() {
        ctx.save();
        ctx.scale(layout.dpr, layout.dpr);

        // 震動效果
        if (shakeTimer > 0 && !prefersReducedMotion) {
          var sx = (rng() - 0.5) * shakeIntensity * 2;
          var sy = (rng() - 0.5) * shakeIntensity * 2;
          ctx.translate(sx, sy);
        }

        // 背景：紙質
        ctx.fillStyle = COLOR.paper;
        ctx.fillRect(0, 0, layout.w, layout.h);

        // 頂部 HUD
        drawHUD();

        // 網格與管線
        drawGrid();

        // 預覽隊列
        drawQueue();

        // 立即執行按鈕
        drawRunButton();

        // 示範動作手勢動畫（開場）
        if (tutorialHandT > 0 && currentStageIdx === 0 && !gameOver) {
          drawTutorialHand();
        }

        // 粒子
        drawParticles();

        // 浮動文字
        drawFloatTexts();

        // 閃白/閃紅
        if (flashTimer > 0 && flashAlpha > 0) {
          ctx.fillStyle = flashColor;
          ctx.globalAlpha = flashAlpha * (flashTimer / 0.3);
          ctx.fillRect(0, 0, layout.w, layout.h);
          ctx.globalAlpha = 1;
        }

        // 遊戲結束結算面板
        if (gameOver) {
          drawEndScreen();
        }

        // 右下角固定灰盒標記
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = COLOR.grey;
        ctx.fillText('GRAYBOX', layout.w - 10, layout.h - 6);

        ctx.restore();
      }

      // ======================================================================
      // 繪圖子元件
      // ======================================================================
      function drawHUD() {
        // 頂部條背景
        ctx.fillStyle = COLOR.ink;
        ctx.fillRect(0, 0, layout.w, 42);

        // 總倒數條（60s）
        var barW = layout.w - 20;
        var barH = 5;
        ctx.fillStyle = COLOR.grey;
        ctx.fillRect(10, 37, barW, barH);
        var progress = Math.max(0, Math.min(1, totalTime / 60));
        ctx.fillStyle = progress > 0.25 ? COLOR.yellow : COLOR.red;
        ctx.fillRect(10, 37, barW * progress, barH);

        // 文字資訊
        ctx.fillStyle = COLOR.paper;
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('階級 ' + (currentStageIdx + 1) + ' / 3', 14, 20);

        ctx.textAlign = 'center';
        ctx.fillText('總時間: ' + totalTime.toFixed(1) + 's', layout.w / 2, 20);

        ctx.textAlign = 'right';
        ctx.fillText('得分: ' + currentScore, layout.w - 14, 20);

        // 放水倒數標示
        if (!isFlowing && !stageCleared && !stageLeaked && !gameOver) {
          ctx.font = 'bold 12px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = COLOR.ink;
          var alertText = '資料流倒數: ' + prepTimeLeft.toFixed(1) + 's（可點擊「立即執行」）';
          ctx.fillText(alertText, layout.w / 2, layout.gridY - 12);
        } else if (isFlowing && !stageCleared && !stageLeaked) {
          ctx.font = 'bold 12px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = COLOR.blue;
          ctx.fillText('▶ 資料流執行中...', layout.w / 2, layout.gridY - 12);
        }
      }

      function drawGrid() {
        var def = R.STAGES[currentStageIdx];
        var T = layout.cellSize;

        for (var r = 0; r < def.rows; r++) {
          for (var c = 0; c < def.cols; c++) {
            var x = layout.gridX + c * T;
            var y = layout.gridY + r * T;

            // 放置彈跳動畫
            var pop = cellPops[c + ',' + r];
            var scale = (pop && !prefersReducedMotion) ? (1 + pop * 1.5) : 1;

            ctx.save();
            if (scale !== 1) {
              ctx.translate(x + T / 2, y + T / 2);
              ctx.scale(scale, scale);
              ctx.translate(-(x + T / 2), -(y + T / 2));
            }

            // 格子底色與邊框（漫畫粗線與硬陰影）
            ctx.fillStyle = ((c + r) % 2 === 0) ? COLOR.paper : '#ece4ce';
            ctx.fillRect(x, y, T, T);

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = COLOR.grey;
            ctx.strokeRect(x, y, T, T);

            var cell = grid[r][c];
            if (cell) {
              if (cell.type === 'start') {
                drawStartCell(x, y, T, cell);
              } else if (cell.type === 'goal') {
                drawGoalCell(x, y, T, cell);
              } else if (cell.type === 'bug' || cell.block) {
                drawBugCell(x, y, T);
              } else if (cell.kind) {
                drawPipeCell(x, y, T, cell);
              }
            }

            // 鍵盤游標標記
            if (cursor.c === c && cursor.r === r && !gameOver) {
              ctx.lineWidth = 3;
              ctx.strokeStyle = COLOR.yellow;
              ctx.strokeRect(x + 2, y + 2, T - 4, T - 4);
              ctx.strokeStyle = COLOR.ink;
              ctx.lineWidth = 1;
              ctx.strokeRect(x + 4, y + 4, T - 8, T - 8);
            }

            ctx.restore();
          }
        }
      }

      function drawStartCell(x, y, T, cell) {
        // Start 盒
        ctx.fillStyle = COLOR.yellow;
        ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(x + 3, y + 3, T - 6, T - 6);

        // 文字
        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold ' + Math.floor(T * 0.22) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Start()', x + T / 2, y + T / 2 - 2);

        // 出水方向指標
        var arrowC = x + T / 2 + R.DIRS[cell.dir].dx * (T * 0.32);
        var arrowR = y + T / 2 + R.DIRS[cell.dir].dy * (T * 0.32);
        ctx.beginPath();
        ctx.arc(arrowC, arrowR, 4, 0, Math.PI * 2);
        ctx.fillStyle = COLOR.blue;
        ctx.fill();
        ctx.stroke();
      }

      function drawGoalCell(x, y, T, cell) {
        ctx.fillStyle = COLOR.blue;
        ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(x + 3, y + 3, T - 6, T - 6);

        ctx.fillStyle = COLOR.paper;
        ctx.font = 'bold ' + Math.floor(T * 0.26) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Goal', x + T / 2, y + T / 2);
      }

      function drawBugCell(x, y, T) {
        ctx.fillStyle = COLOR.red;
        ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(x + 3, y + 3, T - 6, T - 6);

        ctx.fillStyle = COLOR.paper;
        ctx.font = 'bold ' + Math.floor(T * 0.26) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BUG!', x + T / 2, y + T / 2);
      }

      function drawPipeCell(x, y, T, cell) {
        var open = R.PIECES[cell.kind].open;
        var cx = x + T / 2;
        var cy = y + T / 2;
        var half = T / 2;
        var outerW = Math.max(10, Math.floor(T * 0.38));
        var innerW = Math.max(6, Math.floor(T * 0.22));

        // 管體外殼（墨色輪廓）
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = outerW;
        ctx.lineCap = 'butt';
        for (var d = 0; d < 4; d++) {
          if (!open[d]) continue;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + R.DIRS[d].dx * half, cy + R.DIRS[d].dy * half);
          ctx.stroke();
        }

        // 管內通道（藍色/灰色基底）
        ctx.strokeStyle = cell.filled > 0 ? COLOR.blue : '#c4c8c5';
        ctx.lineWidth = innerW;
        for (d = 0; d < 4; d++) {
          if (!open[d]) continue;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + R.DIRS[d].dx * half, cy + R.DIRS[d].dy * half);
          ctx.stroke();
        }

        // 資料流填滿（亮黃色液態水流推進）
        if (cell.filled > 0) {
          var fillRatio = cell.fillT !== undefined ? cell.fillT : 1;
          ctx.strokeStyle = COLOR.yellow;
          ctx.lineWidth = innerW - 1;
          for (d = 0; d < 4; d++) {
            if (!open[d]) continue;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + R.DIRS[d].dx * half * fillRatio, cy + R.DIRS[d].dy * half * fillRatio);
            ctx.stroke();
          }
          ctx.fillStyle = COLOR.yellow;
          ctx.beginPath();
          ctx.arc(cx, cy, innerW * 0.5 * fillRatio, 0, Math.PI * 2);
          ctx.fill();
        }

        // 程式概念標籤（EXEC / IF / LOOP）
        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold ' + Math.max(9, Math.floor(T * 0.18)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var label = cell.kind === 'x' ? 'LOOP' : (cell.kind === 'v' || cell.kind === 'h' ? 'EXEC' : 'IF');
        ctx.fillText(label, cx, cy - (cell.kind === 'v' ? 0 : 2));
      }

      function drawQueue() {
        var def = R.STAGES[currentStageIdx];
        var qCount = Math.min(def.previewCount, queue.length);

        ctx.save();
        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        if (layout.isPortrait) {
          ctx.fillText('下一塊 (Next):', layout.queueX, layout.queueY);
          for (var i = 0; i < qCount; i++) {
            var qx = layout.queueX + i * 56;
            var qy = layout.queueY + 20;
            drawQueuePiece(qx, qy, 48, queue[i], i === 0);
          }
        } else {
          ctx.fillText('預覽管件 (Queue):', layout.queueX, layout.queueY);
          for (var j = 0; j < qCount; j++) {
            var px = layout.queueX;
            var py = layout.queueY + 22 + j * 54;
            drawQueuePiece(px, py, 46, queue[j], j === 0);
          }
        }
        ctx.restore();
      }

      function drawQueuePiece(x, y, size, kind, isNext) {
        // 卡片底色（漫畫邊框＋硬陰影）
        ctx.fillStyle = isNext ? COLOR.yellow : COLOR.paper;
        ctx.fillRect(x, y, size, size);

        ctx.lineWidth = isNext ? 3 : 2;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(x, y, size, size);

        // 硬陰影
        if (isNext) {
          ctx.fillStyle = COLOR.ink;
          ctx.fillRect(x + size, y + 4, 3, size);
          ctx.fillRect(x + 4, y + size, size, 3);
        }

        // 管件圖樣
        var open = R.PIECES[kind].open;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var len = size * 0.36;

        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 8;
        ctx.lineCap = 'butt';
        for (var d = 0; d < 4; d++) {
          if (!open[d]) continue;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + R.DIRS[d].dx * len, cy + R.DIRS[d].dy * len);
          ctx.stroke();
        }

        ctx.strokeStyle = COLOR.blue;
        ctx.lineWidth = 5;
        for (d = 0; d < 4; d++) {
          if (!open[d]) continue;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + R.DIRS[d].dx * len, cy + R.DIRS[d].dy * len);
          ctx.stroke();
        }

        if (isNext) {
          ctx.fillStyle = COLOR.ink;
          ctx.font = 'bold 9px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('NEXT', cx, y + 2);
        }
      }

      function drawRunButton() {
        var btn = layout.runBtnRect;
        var active = !isFlowing && !stageCleared && !stageLeaked && !gameOver;

        // 硬陰影
        ctx.fillStyle = COLOR.ink;
        ctx.fillRect(btn.x + 4, btn.y + 4, btn.w, btn.h);

        // 按鈕本體
        ctx.fillStyle = active ? COLOR.yellow : COLOR.grey;
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(active ? '▶ 立即執行' : '執行中...', btn.x + btn.w / 2, btn.y + btn.h / 2);
      }

      function drawTutorialHand() {
        // 第一格目標 (1, 0)
        var targetX = layout.gridX + (1 + 0.5) * layout.cellSize;
        var targetY = layout.gridY + 0.5 * layout.cellSize;

        var phase = (Date.now() % 1200) / 1200; // 0 ~ 1
        var bounce = Math.sin(phase * Math.PI) * 12;

        ctx.save();
        ctx.translate(targetX, targetY + bounce);

        // 手指造型幾何圖案（色塊＋墨黑描邊）
        ctx.fillStyle = 'rgba(244, 236, 216, 0.9)';
        ctx.strokeStyle = COLOR.ink;
        ctx.lineWidth = 3;

        // 點擊漣漪
        if (phase > 0.6) {
          var r = (phase - 0.6) * 40;
          ctx.strokeStyle = COLOR.yellow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -6, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 手指
        ctx.beginPath();
        ctx.roundRect(-8, -10, 16, 28, 6);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // 教學指引條
        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('點擊格子鋪設管線，連接 Start() 與 Goal', layout.w / 2, layout.gridY + layout.rows * layout.cellSize + 6);
      }

      function drawParticles() {
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      }

      function drawFloatTexts() {
        for (var i = 0; i < floatTexts.length; i++) {
          var ft = floatTexts[i];
          ctx.save();
          ctx.font = 'bold ' + ft.size + 'px system-ui, sans-serif';
          ctx.fillStyle = ft.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }
      }

      function drawEndScreen() {
        // 遮罩
        ctx.fillStyle = 'rgba(15, 13, 10, 0.7)';
        ctx.fillRect(0, 0, layout.w, layout.h);

        var panelW = Math.min(380, layout.w - 32);
        var panelH = 180;
        var px = (layout.w - panelW) / 2;
        var py = (layout.h - panelH) / 2;

        // 漫畫硬陰影
        ctx.fillStyle = COLOR.ink;
        ctx.fillRect(px + 6, py + 6, panelW, panelH);

        // 面板底色
        ctx.fillStyle = COLOR.paper;
        ctx.fillRect(px, py, panelW, panelH);
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(px, py, panelW, panelH);

        var evalRes = R.evaluateGame(clearedStages, currentScore, R.STAGES.length);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // 標題
        ctx.fillStyle = evalRes.win ? COLOR.yellow : COLOR.red;
        ctx.fillRect(px + 10, py + 12, panelW - 20, 36);
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLOR.ink;
        ctx.strokeRect(px + 10, py + 12, panelW - 20, 36);

        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.fillText(evalRes.win ? '除錯成功！通關！' : '資料流中斷！挑戰結束', px + panelW / 2, py + 19);

        // 成績文字
        ctx.fillStyle = COLOR.ink;
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText('通過關卡：' + clearedStages + ' / 3   |   最終得分：' + evalRes.score, px + panelW / 2, py + 64);

        // 專長引言
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillStyle = '#2d3748';
        var quoteLines = [
          '這就是 Unity／程式 在做的事：',
          '寫程式就是安排資料流的路徑，',
          '先想好流程再動手，比事後除錯省時間。'
        ];
        for (var l = 0; l < quoteLines.length; l++) {
          ctx.fillText(quoteLines[l], px + panelW / 2, py + 98 + l * 18);
        }
      }

      // ======================================================================
      // 事件處理（滑鼠／觸控／鍵盤）
      // ======================================================================
      function onPointerDown(e) {
        initAudio();
        var rect = canvas.getBoundingClientRect();
        var clientX = e.clientX;
        var clientY = e.clientY;
        var px = clientX - rect.left;
        var py = clientY - rect.top;

        // 檢查是否點擊立即執行按鈕
        var btn = layout.runBtnRect;
        if (px >= btn.x && px <= btn.x + btn.w && py >= btn.y && py <= btn.y + btn.h) {
          triggerFlowStart();
          return;
        }

        // 檢查是否點擊網格
        var T = layout.cellSize;
        var def = R.STAGES[currentStageIdx];
        if (px >= layout.gridX && px < layout.gridX + def.cols * T &&
            py >= layout.gridY && py < layout.gridY + def.rows * T) {
          var c = Math.floor((px - layout.gridX) / T);
          var r = Math.floor((py - layout.gridY) / T);
          cursor = { c: c, r: r };
          tryPlacePiece(c, r);
        }
      }

      function onKeyDown(e) {
        initAudio();
        var def = R.STAGES[currentStageIdx];
        if (!def) return;

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          cursor.c = Math.max(0, cursor.c - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          cursor.c = Math.min(def.cols - 1, cursor.c + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          cursor.r = Math.max(0, cursor.r - 1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          cursor.r = Math.min(def.rows - 1, cursor.r + 1);
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          tryPlacePiece(cursor.c, cursor.r);
        } else if (e.key === 'r' || e.key === 'R' || e.key === 'b' || e.key === 'B') {
          triggerFlowStart();
        }
      }

      canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('keydown', onKeyDown);

      // ======================================================================
      // 主迴圈與 ResizeObserver
      // ======================================================================
      var rafId = null;
      var lastTime = performance.now();

      function loop(now) {
        if (destroyed) return;
        var dt = Math.min(0.1, (now - lastTime) / 1000);
        lastTime = now;

        updateLayout();
        update(dt);
        render();

        rafId = requestAnimationFrame(loop);
      }

      rafId = requestAnimationFrame(loop);

      var resizeObserver = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(function () {
          if (!destroyed) updateLayout();
        });
        resizeObserver.observe(root);
      }

      // ======================================================================
      // 銷毀清理
      // ======================================================================
      return {
        destroy: function () {
          destroyed = true;
          if (rafId) cancelAnimationFrame(rafId);
          if (resizeObserver) resizeObserver.disconnect();

          canvas.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('keydown', onKeyDown);

          if (audioCtx) {
            try {
              audioCtx.close();
            } catch (err) {}
            audioCtx = null;
          }

          root.innerHTML = '';
        }
      };
    }
  };
})(typeof window !== 'undefined' ? window : this);
